import json
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import motor.motor_asyncio
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import datetime
from bson import ObjectId
import asyncio
import httpx
from fastapi import BackgroundTasks
from contextlib import asynccontextmanager

load_dotenv()

# Keep-alive configuration
RENDER_SERVICE_URL = os.getenv("RENDER_SERVICE_URL", "http://localhost:8000")
KEEP_ALIVE_INTERVAL = 14 * 60  # 14 minutes

# Global variable to store the keep-alive task
keep_alive_task = None

async def ping_self():
    """Ping the server to keep it awake"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{RENDER_SERVICE_URL}/api/health", timeout=10)
            print(f"Keep-alive ping successful: {response.status_code}")
    except Exception as e:
        print(f"Keep-alive ping failed: {e}")

async def start_keep_alive_task():
    """Start the keep-alive background task with proper cancellation handling"""
    try:
        while True:
            await asyncio.sleep(KEEP_ALIVE_INTERVAL)
            await ping_self()
    except asyncio.CancelledError:
        print("Keep-alive task cancelled gracefully")
        raise
    except Exception as e:
        print(f"Keep-alive task error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage the application lifespan"""
    global keep_alive_task
    
    # Startup
    await start_database()
    if "render" in RENDER_SERVICE_URL.lower() or os.getenv("RENDER") == "true":
        keep_alive_task = asyncio.create_task(start_keep_alive_task())
        print("Keep-alive task started for Render deployment")
    
    yield
    
    # Shutdown
    await close_database()
    if keep_alive_task:
        keep_alive_task.cancel()
        try:
            await keep_alive_task
        except asyncio.CancelledError:
            pass
        print("Keep-alive task stopped")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client_mongo = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client_mongo["user_database"]
users_collection = db["users"]
itineraries_collection = db["itineraries"]

async def start_database():
    """Connect to MongoDB"""
    try:
        await client_mongo.admin.command('ismaster')
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

async def close_database():
    """Close MongoDB connection"""
    client_mongo.close()
    print("MongoDB connection closed")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class UserIn(BaseModel):
    name: str
    dob: str
    email: str
    password: str

class UserOut(BaseModel):
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/signin")

async def get_user(email: str):
    try:
        user = await users_collection.find_one({"email": email})
        return user
    except asyncio.CancelledError:
        print("Get user operation cancelled")
        raise

async def authenticate_user(email: str, password: str):
    try:
        user = await get_user(email)
        if not user or not verify_password(password, user["hashed_password"]):
            return False
        return user
    except asyncio.CancelledError:
        print("Authentication cancelled")
        raise

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    except asyncio.CancelledError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service is shutting down"
        )
    
    try:
        user = await get_user(email)
        if user is None:
            raise credentials_exception
        return user
    except asyncio.CancelledError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service is shutting down"
        )

@app.post("/api/signup", response_model=UserOut)
async def signup(user: UserIn):
    try:
        if await users_collection.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = get_password_hash(user.password)
        await users_collection.insert_one({
            "name": user.name, 
            "dob": user.dob, 
            "email": user.email, 
            "hashed_password": hashed_password,
            "subscription_status": "free",  # free, premium
            "itineraries_created": 0,
            "free_itinerary_used": False,
            "created_at": datetime.datetime.now(datetime.timezone.utc)
        })
        return {"email": user.email}
    except HTTPException:
        raise
    except asyncio.CancelledError:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Request was cancelled. Please try again."
        )
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create account. Please try again."
        )

@app.post("/api/signin", response_model=Token)
async def signin(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        access_token = create_access_token(data={"sub": user["email"]})
        return {"access_token": access_token, "token_type": "bearer"}
    except asyncio.CancelledError:
        print("Signin cancelled")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service is shutting down"
        )
    except HTTPException:
        raise

@app.get("/api/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "name": current_user.get("name", ""),
        "email": current_user.get("email", ""),
        "dob": current_user.get("dob", "")
    }

@app.get("/api/my-itineraries")
async def get_my_itineraries(current_user: dict = Depends(get_current_user)):
    """Fetch all itineraries created by the current user"""
    try:
        # Find all itineraries for the current user
        cursor = itineraries_collection.find(
            {"user_email": current_user.get("email")},
            {
                "_id": 1,
                "destination": 1,
                "dates": 1,
                "travelers": 1,
                "itinerary_data.destination_name": 1,
                "itinerary_data.personalized_title": 1,
                "itinerary_data.hero_image_url": 1,
                "created_at": 1
            }
        ).sort("created_at", -1)  # Sort by newest first
        
        itineraries = []
        async for doc in cursor:
            itinerary_summary = {
                "itinerary_id": str(doc["_id"]),
                "destination": doc.get("destination", "Unknown"),
                "dates": doc.get("dates", ""),
                "travelers": doc.get("travelers", ""),
                "destination_name": doc.get("itinerary_data", {}).get("destination_name", doc.get("destination", "Unknown")),
                "personalized_title": doc.get("itinerary_data", {}).get("personalized_title", f"Trip to {doc.get('destination', 'Unknown')}"),
                "hero_image_url": doc.get("itinerary_data", {}).get("hero_image_url", "https://picsum.photos/800/400"),
                "created_at": doc.get("created_at")
            }
            itineraries.append(itinerary_summary)
        
        return {"itineraries": itineraries}
    
    except asyncio.CancelledError:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Request was cancelled. Please try again."
        )
    except Exception as e:
        print(f"Error fetching itineraries: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch itineraries"
        )

@app.get("/api/itinerary/{itinerary_id}")
async def get_itinerary_details(itinerary_id: str, current_user: dict = Depends(get_current_user)):
    """Fetch full details of a specific itinerary"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(itinerary_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid itinerary ID format"
            )
        
        # Find the itinerary
        itinerary = await itineraries_collection.find_one({
            "_id": ObjectId(itinerary_id),
            "user_email": current_user.get("email")  # Ensure user can only access their own itineraries
        })
        
        if not itinerary:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Itinerary not found"
            )
        
        # Return the full itinerary data
        return {
            "itinerary_id": str(itinerary["_id"]),
            "user_info": {
                "email": itinerary.get("user_email"),
                "name": itinerary.get("user_name")
            },
            "trip_parameters": {
                "destination": itinerary.get("destination"),
                "dates": itinerary.get("dates"),
                "travelers": itinerary.get("travelers"),
                "interests": itinerary.get("interests"),
                "budget": itinerary.get("budget"),
                "pace": itinerary.get("pace")
            },
            "itinerary": itinerary.get("itinerary_data"),
            "created_at": itinerary.get("created_at"),
            "updated_at": itinerary.get("updated_at")
        }
    
    except asyncio.CancelledError:
        print("Get itinerary details cancelled")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service is shutting down"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching itinerary details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch itinerary details"
        )

@app.delete("/api/itinerary/{itinerary_id}")
async def delete_itinerary(itinerary_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a specific itinerary"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(itinerary_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid itinerary ID format"
            )
        
        # Delete the itinerary (ensure user can only delete their own)
        result = await itineraries_collection.delete_one({
            "_id": ObjectId(itinerary_id),
            "user_email": current_user.get("email")
        })
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Itinerary not found or you don't have permission to delete it"
            )
        
        return {"message": "Itinerary deleted successfully"}
    
    except asyncio.CancelledError:
        print("Delete itinerary cancelled")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service is shutting down"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting itinerary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete itinerary"
        )

# Health check endpoint for keep-alive
@app.get("/api/health")
async def health_check():
    """Health check endpoint to keep the server awake"""
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "message": "Server is running"
    }

class Message(BaseModel):
    sender: str
    text: str

class ChatConversationRequest(BaseModel):
    system_prompt: str
    conversation_history: List[Message]
    user_name: Optional[str] = None

class ItineraryRequest(BaseModel):
    messages: List[Message]
    current_itinerary: Optional[dict] = None

@app.post("/api/chat-conversation")
async def chat_conversation(
    request: ChatConversationRequest, 
    current_user: dict = Depends(get_current_user)
):
    """Handle conversational AI for trip planning"""
    try:
        # Use Gemini for conversational responses
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
        # Convert conversation history to Gemini format
        conversation_text = ""
        for msg in request.conversation_history:
            if msg.sender == "user":
                conversation_text += f"User: {msg.text}\n"
            elif msg.sender == "system":
                conversation_text += f"Assistant: {msg.text}\n"
        
        # Create the prompt for conversational response
        prompt = f"""
{request.system_prompt}

CONVERSATION SO FAR:
{conversation_text}

USER NAME: {request.user_name or current_user.get('name', 'there')}

Based on the conversation above, respond as "The Modern Chanakya" with the next appropriate message. 
- Be enthusiastic and use emojis naturally
- Ask ONE follow-up question that builds on what they've shared
- Reference their previous answers to show you're listening
- If you have enough information to create an itinerary (destination, rough dates, and some preferences), indicate that you're ready to generate their itinerary
- Keep responses conversational and friendly

IMPORTANT: Respond as if you're continuing this conversation naturally. Do not repeat information already covered.
"""

        # Generate response using Gemini
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=300,
            )
        )
        
        ai_response = response.text.strip()
        
        # Check if we have enough information to suggest itinerary generation
        conversation_length = len(request.conversation_history)
        has_destination = any("where" in msg.text.lower() for msg in request.conversation_history if msg.sender == "system")
        has_enough_info = conversation_length >= 6 or "ready to generate" in ai_response.lower() or "work my magic" in ai_response.lower()
        
        return {
            "response": ai_response,
            "ready_for_itinerary": has_enough_info
        }
        
    except Exception as e:
        print(f"Error in chat conversation: {e}")
        return {
            "response": "I'm having a moment of wanderlust distraction! 😅 Could you repeat that? I want to make sure I get every detail right for your perfect trip!",
            "ready_for_itinerary": False
        }

# Initialize Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.post("/api/generate-itinerary")
async def generate_itinerary(req: ItineraryRequest, current_user: dict = Depends(get_current_user)):
    user_name = current_user.get("name", "Traveler")

    # Extract answers based on the sequence of system questions
    # The frontend asks questions in a specific order
    system_questions_order = ["destination", "dates", "travelers", "interests", "budget", "pace", "aboutYou"]
    
    def extract_answer_by_position(position):
        """Extract user answer at a specific position in the conversation"""
        user_messages = [m.text for m in req.messages if m.sender == "user"]
        if position < len(user_messages):
            return user_messages[position]
        return "Not specified"
    
    def extract_answer_by_keywords(keywords):
        """Fallback method using keywords"""
        for m in reversed(req.messages):
            if m.sender == "user":
                for kw in keywords:
                    if kw.lower() in m.text.lower():
                        return m.text
        return "Not specified"

    # Extract answers - try position first, then keywords as fallback
    destination = extract_answer_by_position(0) or extract_answer_by_keywords(["destination", "city", "country", "place", "go to"])
    dates = extract_answer_by_position(1) or extract_answer_by_keywords(["dates", "planning for", "when"])
    travelers = extract_answer_by_position(2) or extract_answer_by_keywords(["travelers", "coming along", "with", "who"])
    interests = extract_answer_by_position(3) or extract_answer_by_keywords(["interests", "excited about", "like", "enjoy"])
    budget = extract_answer_by_position(4) or extract_answer_by_keywords(["budget", "cost", "spend"])
    pace = extract_answer_by_position(5) or extract_answer_by_keywords(["pace", "speed", "relaxed", "packed", "balanced"])
    
    current_location = "Raghogarh-Vijaypur, Madhya Pradesh"

    # Debug print to see what we extracted
    print(f"Received messages: {[{'sender': m.sender, 'text': m.text} for m in req.messages]}")
    print(f"Extracted data: destination={destination}, dates={dates}, travelers={travelers}, interests={interests}, budget={budget}, pace={pace}")

    system_prompt_content = f"""
You are 'The Modern Chanakya', an elite, AI-powered travel strategist based in India. Your tone is sophisticated, knowledgeable, and reassuring. You create hyper-detailed, premium travel itineraries that are so comprehensive, users would pay for them.

Generate a complete travel plan in JSON format. Every field must be filled with rich, detailed, and actionable information.

**IMPORTANT**: You MUST respond ONLY with a valid JSON object. Do NOT include any conversational text, markdown, or any content before or after the JSON.

**IMAGE URL REQUIREMENTS**: 
- Use ONLY direct image URLs that end with image file extensions (.jpg, .jpeg, .png, .webp)
- Preferred sources: Unsplash direct URLs (https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop) or Picsum placeholder (https://picsum.photos/800/600)
- Ensure all image URLs are accessible and load properly
- DO NOT use search URLs or redirects

**TRAVELER PROFILE:**
- User's Name: {user_name}
- Current Location: {current_location}
- Destination: {destination}
- Dates: {dates}
- Travelers: {travelers}
- Interests: {interests}
- Budget: {budget}
- Pace: {pace}

**REQUIRED JSON STRUCTURE:**
{{
  "hero_image_url": "A stunning, high-quality direct image URL for the destination (e.g., 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&h=900&fit=crop').",
  "destination_name": "{destination}",
  "personalized_title": "Create a catchy, personalized title like '{user_name}'s Unforgettable Goa Getaway'.",
  "journey_details": {{
    "title": "Travel Plan from {current_location} to {destination}",
    "options": [
      {{
        "mode": "Flight", "icon": "flight", "description": "Detailed description of the flight route, mentioning key airports.", "duration": "Approximate flight time.", "estimated_cost": "Price range in INR.", "booking_link": "A direct MakeMyTrip flights URL."
      }},
      {{
        "mode": "Train", "icon": "train", "description": "Detailed description of the train route, mentioning key stations.", "duration": "Approximate journey time.", "estimated_cost": "Price range in INR.", "booking_link": "A direct MakeMyTrip railways URL."
      }}
    ]
  }},
  "accommodation_suggestions": [
      {{ "name": "Hotel Name", "type": "Luxury Resort/Boutique/etc.", "icon": "hotel_class/nightlife/etc.", "description": "Compelling 2-line description.", "estimated_cost": "Price per night in INR.", "booking_link": "Direct MakeMyTrip hotel booking URL.", "image_url": "Direct image URL (e.g., 'https://images.unsplash.com/photo-ID?w=400&h=300&fit=crop' or 'https://picsum.photos/400/300')." }}
  ],
  "trip_overview": {{
    "destination_insights": "A 2-3 line paragraph from a local's perspective.",
    "weather_during_visit": "Detailed weather forecast for the travel dates.",
    "seasonal_context": "What's special about this season.",
    "cultural_context": "Any local festivals or events.",
    "local_customs_to_know": ["List of 2-3 important customs."],
    "estimated_total_cost": "Full budget breakdown per person in INR."
  }},
  "daily_itinerary": [
    {{
      "date": "YYYY-MM-DD",
      "theme": "A catchy theme for the day (e.g., 'North Goa Vibes & Flea Market Finds').",
      "activities": [
        {{
          "time": "HH:MM AM/PM",
          "activity": "Activity Name",
          "location": "Specific Location",
          "description": "A detailed, engaging 2-3 line description of the place and what to expect.",
          "local_guide_tip": "A non-empty, genuinely useful insider tip. Make it sound like a real local is talking.",
          "icon": "A relevant Material Icons name (e.g., 'local_cafe', 'storefront').",
          "image_url": "A direct image URL (e.g., 'https://images.unsplash.com/photo-ID?w=800&h=600&fit=crop' for placeholder).",
          "google_maps_link": "A direct Google Maps search URL for the location.",
          "booking_link": "A Zomato link for restaurants or MMT for activities, if applicable, otherwise null.",
          "tags": ["Adventure", "Cultural", "Heritage", "Nature", "Food", "Shopping", "Religious", "Nightlife", "Family-Friendly", "Budget", "Luxury", "Photography", "Historical"]
        }}
      ],
      "meals": {{
          "lunch": {{ "dish": "Famous Local Dish", "restaurant": "Recommended Restaurant", "description": "A short, enticing description.", "image_url": "Direct image URL (e.g., 'https://images.unsplash.com/photo-ID?w=400&h=300&fit=crop').", "zomato_link": "Direct Zomato link for the restaurant.", "tags": ["Vegetarian", "Vegan", "Non-Vegetarian", "Street Food", "Fine Dining", "Local Specialty", "Spicy", "Sweet", "Traditional", "Fusion", "Budget", "Premium"] }},
          "dinner": {{ "dish": "Famous Local Dish", "restaurant": "Recommended Restaurant", "description": "A short, enticing description.", "image_url": "Direct image URL (e.g., 'https://images.unsplash.com/photo-ID?w=400&h=300&fit=crop' or 'https://picsum.photos/400/300').", "zomato_link": "Direct Zomato link for the restaurant.", "tags": ["Vegetarian", "Vegan", "Non-Vegetarian", "Street Food", "Fine Dining", "Local Specialty", "Spicy", "Sweet", "Traditional", "Fusion", "Budget", "Premium"] }}
      }}
    }}
  ],
  "hidden_gems": [
      {{ "name": "Gem Name", "description": "What it is.", "why_special": "Why it's a hidden gem.", "search_link": "Google Maps search link." }}
  ],
  "signature_experiences": [
      {{ "name": "Experience Name", "description": "Short description.", "why_local_loves_it": "Why locals love this.", "estimated_cost": "Cost range in INR.", "booking_link": "Direct MakeMyTrip activity booking URL.", "tags": ["Adventure", "Cultural", "Heritage", "Nature", "Food", "Shopping", "Religious", "Nightlife", "Family-Friendly", "Budget", "Luxury", "Photography", "Historical", "Wellness", "Sports"] }}
  ],
  "hyperlocal_food_guide": [
      {{ "dish": "Dish Name", "description": "Description.", "where_to_find": "Specific place to eat.", "local_tip": "Insider tip.", "search_link": "Zomato search link.", "tags": ["Vegetarian", "Vegan", "Non-Vegetarian", "Street Food", "Fine Dining", "Local Specialty", "Spicy", "Sweet", "Traditional", "Fusion", "Budget", "Premium"] }}
  ],
  "shopping_insider_guide": [
      {{ "item": "Item to buy", "where_to_buy": "Specific store/market.", "local_tip": "Bargaining tips etc.", "search_link": "Google search link." }}
  ],
  "practical_local_wisdom": {{
    "safety_tips": "Important safety advice.",
    "health_and_wellness": "Tips for staying healthy.",
    "connectivity": "SIM cards, Wi-Fi info.",
    "transport": "Best local transport options (e.g., renting a scooter)."
  }}
}}
"""

    try:
        # Use the new Google GenAI library with gemini-2.5-pro
        model = "gemini-2.5-pro"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=system_prompt_content),
                ],
            ),
        ]
        
        generate_content_config = types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(
                thinking_budget=-1,
            ),
        )

        # Generate content using streaming
        response_chunks = []
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                response_chunks.append(chunk.text)

        llm_reply = "".join(response_chunks)
        
        # Clean up the response - remove markdown code blocks if present
        llm_reply = llm_reply.strip()
        if llm_reply.startswith("```json"):
            llm_reply = llm_reply[7:]  # Remove ```json
        if llm_reply.startswith("```"):
            llm_reply = llm_reply[3:]   # Remove ```
        if llm_reply.endswith("```"):
            llm_reply = llm_reply[:-3]  # Remove trailing ```
        llm_reply = llm_reply.strip()
        
        # Try to parse JSON response
        try:
            itinerary_data = json.loads(llm_reply)
        except json.JSONDecodeError as json_error:
            print(f"JSON parsing error: {json_error}")
            print(f"Raw response: {llm_reply}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="The AI response was not in the expected format. Please try again."
            )
        
        llm_message = "Your premium itinerary is ready. Every detail has been crafted for your journey."

        # Store the itinerary in the database
        itinerary_document = {
            "user_email": current_user.get("email"),
            "user_name": current_user.get("name"),
            "destination": destination,
            "dates": dates,
            "travelers": travelers,
            "interests": interests,
            "budget": budget,
            "pace": pace,
            "itinerary_data": itinerary_data,
            "created_at": datetime.datetime.now(datetime.timezone.utc),
            "updated_at": datetime.datetime.now(datetime.timezone.utc)
        }
        
        # Insert the itinerary into the database with error handling
        try:
            result = await itineraries_collection.insert_one(itinerary_document)
            itinerary_id = str(result.inserted_id)
            
            # Add the ID to the response
            itinerary_data["itinerary_id"] = itinerary_id
        except asyncio.CancelledError:
            # Handle cancellation gracefully
            raise HTTPException(
                status_code=status.HTTP_408_REQUEST_TIMEOUT,
                detail="Request was cancelled. Please try again."
            )
        except Exception as db_error:
            print(f"Database error: {db_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save itinerary. Please try again."
            )

    except asyncio.CancelledError:
        # Handle cancellation at the top level
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="Request was cancelled. Please try again."
        )
    except Exception as e:
        print(f"Error calling Gemini API or parsing JSON: {e}")
        error_detail = str(e)
        
        # Check if it's a quota error
        if "quota" in error_detail.lower() or "429" in error_detail:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="API quota exceeded. Please try again in a few minutes or upgrade your plan."
            )
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while crafting your plan: {error_detail}"
        )

    return {"itinerary": itinerary_data, "llm_message": llm_message}
