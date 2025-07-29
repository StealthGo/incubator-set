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

load_dotenv()

app = FastAPI()

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
    user = await users_collection.find_one({"email": email})
    return user

async def authenticate_user(email: str, password: str):
    user = await get_user(email)
    if not user or not verify_password(password, user["hashed_password"]):
        return False
    return user

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
    user = await get_user(email)
    if user is None:
        raise credentials_exception
    return user

@app.post("/api/signup", response_model=UserOut)
async def signup(user: UserIn):
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    await users_collection.insert_one({
        "name": user.name, "dob": user.dob, "email": user.email, "hashed_password": hashed_password
    })
    return {"email": user.email}

@app.post("/api/signin", response_model=Token)
async def signin(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "name": current_user.get("name", ""),
        "email": current_user.get("email", ""),
        "dob": current_user.get("dob", "")
    }

class Message(BaseModel):
    sender: str
    text: str

class ItineraryRequest(BaseModel):
    messages: List[Message]
    current_itinerary: Optional[dict] = None

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
  "hero_image_url": "A stunning, high-quality direct image URL for the destination (e.g., 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&h=900&fit=crop' or use Picsum for reliable placeholder: 'https://picsum.photos/1600/900').",
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
          "booking_link": "A Zomato link for restaurants or MMT for activities, if applicable, otherwise null."
        }}
      ],
      "meals": {{
          "lunch": {{ "dish": "Famous Local Dish", "restaurant": "Recommended Restaurant", "description": "A short, enticing description.", "image_url": "Direct image URL (e.g., 'https://images.unsplash.com/photo-ID?w=400&h=300&fit=crop').", "zomato_link": "Direct Zomato link for the restaurant." }},
          "dinner": {{ "dish": "Famous Local Dish", "restaurant": "Recommended Restaurant", "description": "A short, enticing description.", "image_url": "Direct image URL (e.g., 'https://images.unsplash.com/photo-ID?w=400&h=300&fit=crop' or 'https://picsum.photos/400/300').", "zomato_link": "Direct Zomato link for the restaurant." }}
      }}
    }}
  ],
  "hidden_gems": [
      {{ "name": "Gem Name", "description": "What it is.", "why_special": "Why it's a hidden gem.", "search_link": "Google Maps search link." }}
  ],
  "signature_experiences": [
      {{ "name": "Experience Name", "description": "Short description.", "why_local_loves_it": "Why locals love this.", "estimated_cost": "Cost range in INR.", "booking_link": "Direct MakeMyTrip activity booking URL." }}
  ],
  "hyperlocal_food_guide": [
      {{ "dish": "Dish Name", "description": "Description.", "where_to_find": "Specific place to eat.", "local_tip": "Insider tip.", "search_link": "Zomato search link." }}
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
