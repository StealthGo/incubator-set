import json
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
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
import razorpay
import stripe
import hmac
import hashlib

load_dotenv()

# Payment configuration
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

# Initialize payment clients (with error handling for missing dependencies)
razorpay_client = None
stripe_client = None

try:
    if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
        razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    print(f"Razorpay initialization failed: {e}")

try:
    if STRIPE_SECRET_KEY:
        stripe.api_key = STRIPE_SECRET_KEY
        stripe_client = stripe
except Exception as e:
    print(f"Stripe initialization failed: {e}")

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
    allow_origins=["http://localhost:3000","https://www.tmchanakya.com","https://tmchanakya.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client_mongo = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client_mongo["user_database"]

users_collection = db["users"]
itineraries_collection = db["itineraries"]
payments_collection = db["payments"]
# New collection for survey responses
survey_collection = db["survey_responses"]
class SurveyResponse(BaseModel):
    step_1: str
    step_2: int
    step_3: str
    step_4: str
    email: str = None
    submitted_at: Optional[datetime.datetime] = None


# Endpoint to receive and store survey responses
@app.post("/api/survey")
async def submit_survey(response: SurveyResponse):
    try:
        doc = response.dict()
        doc["submitted_at"] = datetime.datetime.now(datetime.timezone.utc)
        await survey_collection.insert_one(doc)
        return {"message": "Survey response recorded"}
    except Exception as e:
        print(f"Survey submission error: {e}")
        raise HTTPException(status_code=500, detail="Failed to record survey response")

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
    email: str
    password: str

class UserOut(BaseModel):
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PaymentRequest(BaseModel):
    payment_method: str  # "razorpay" or "stripe"
    plan: str  # "monthly" or "yearly"

class RazorpayPaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class StripePaymentVerification(BaseModel):
    session_id: str

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
    



@app.post("/api/signup", response_model=Token)
async def signup(user: UserIn):
    try:
        if await users_collection.find_one({"email": user.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = get_password_hash(user.password)
        await users_collection.insert_one({
            "name": user.name,
            "email": user.email,
            "hashed_password": hashed_password,
            "subscription_status": "free",  # free, premium
            "has_premium_subscription": False,  # Boolean for premium subscription access
            "itineraries_created": 0,
            "free_itinerary_used": False,
            "chat_messages_used": 0,  # Track chat usage for free users
            "created_at": datetime.datetime.now(datetime.timezone.utc)
        })
        # Create access token for the new user
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
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
        # "dob": current_user.get("dob", ""),  # <-- Removed dob
        "subscription_status": current_user.get("subscription_status", "free"),
        "has_premium_subscription": current_user.get("has_premium_subscription", False),
        "itineraries_created": current_user.get("itineraries_created", 0),
        "free_itinerary_used": current_user.get("free_itinerary_used", False),
        "chat_messages_used": current_user.get("chat_messages_used", 0)
    }


# --- COMMENTED OUT: Subscription upgrade endpoint (not in use for waitlist/survey) ---
# @app.post("/api/upgrade-subscription")
# async def upgrade_subscription(current_user: dict = Depends(get_current_user)):
#     ...existing code...


# --- COMMENTED OUT: Subscription downgrade endpoint (not in use for waitlist/survey) ---
# @app.post("/api/downgrade-subscription")
# async def downgrade_subscription(current_user: dict = Depends(get_current_user)):
#     ...existing code...


# --- COMMENTED OUT: Subscription status endpoint (not in use for waitlist/survey) ---
# @app.get("/api/subscription-status")
# async def get_subscription_status(current_user: dict = Depends(get_current_user)):
#     ...existing code...


# --- COMMENTED OUT: Subscription plans endpoint (not in use for waitlist/survey) ---
# @app.get("/api/subscription-plans")
# async def get_subscription_plans():
#     ...existing code...


# --- COMMENTED OUT: Payment order endpoint (not in use for waitlist/survey) ---
# @app.post("/api/create-payment-order")
# async def create_payment_order(...):
#     ...existing code...


# --- COMMENTED OUT: Payment verification endpoint (not in use for waitlist/survey) ---
# @app.post("/api/verify-payment")
# async def verify_payment(...):
#     ...existing code...


# --- COMMENTED OUT: My itineraries endpoint (not in use for waitlist/survey) ---
# @app.get("/api/my-itineraries")
# async def get_my_itineraries(...):
#     ...existing code...


# --- COMMENTED OUT: Itinerary details endpoint (not in use for waitlist/survey) ---
# @app.get("/api/itinerary/{itinerary_id}")
# async def get_itinerary_details(...):
#     ...existing code...


# --- COMMENTED OUT: Itinerary delete endpoint (not in use for waitlist/survey) ---
# @app.delete("/api/itinerary/{itinerary_id}")
# async def delete_itinerary(...):
#     ...existing code...

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


# --- COMMENTED OUT: Chat conversation endpoint (not in use for waitlist/survey) ---
# @app.post("/api/chat-conversation")
# async def chat_conversation(...):
#     ...existing code...

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.post("/api/generate-itinerary")
async def generate_itinerary(req: ItineraryRequest, current_user: dict = Depends(get_current_user)):
    user_name = current_user.get("name", "Traveler")
    user_email = current_user.get("email")
    subscription_status = current_user.get("subscription_status", "free")
    has_premium_subscription = current_user.get("has_premium_subscription", False)
    free_itinerary_used = current_user.get("free_itinerary_used", False)
    
    # Check subscription limits for itinerary generation
    if not has_premium_subscription and subscription_status == "free" and free_itinerary_used:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You have already used your free itinerary. Please upgrade to premium for unlimited itinerary generation and enhanced features."
        )

    # Extract answers based on the sequence of system questions
    # The frontend asks questions in a specific order
    system_questions_order = ["destination", "dates", "travelers", "interests", "food_preferences", "budget", "pace", "aboutYou"]
    
    def extract_answer_by_position(position):
        """Extract user answer at a specific position in the conversation"""
        user_messages = [m.text for m in req.messages if m.sender == "user"]
        if position < len(user_messages):
            return user_messages[position]
        return "Not specified"
    
    def extract_answer_by_keywords(keywords, text_to_search):
        """Check if any keywords are in the text"""
        text_to_search = text_to_search.lower()
        for kw in keywords:
            if kw.lower() in text_to_search:
                return True
        return False
    
    def classify_message_by_content(message_text):
        """Attempt to classify a message based on its content"""
        message_text = message_text.lower()
        
        food_keywords = ["vegetarian", "non-vegetarian", "vegan", "food", "eat", "dietary", "meal", "cuisine"]
        traveler_keywords = ["solo", "partner", "family", "friend", "group", "people", "travelers", "honeymoon"]
        budget_keywords = ["budget", "luxury", "comfort", "spend", "cost", "cheap", "expensive", "price"]
        interest_keywords = ["culture", "adventure", "nature", "heritage", "spiritual", "wellness", "activity", "interest"]
        
        if any(emoji in message_text for emoji in ["🍖", "🥗", "🍽️", "🌱", "🍛"]) or extract_answer_by_keywords(food_keywords, message_text):
            return "food_preferences"
        elif any(emoji in message_text for emoji in ["✈️", "👫", "👨‍👩‍👧‍👦", "👥", "💕"]) or extract_answer_by_keywords(traveler_keywords, message_text):
            return "travelers"
        elif any(emoji in message_text for emoji in ["💸", "💰", "💎", "🎯", "💼"]) or extract_answer_by_keywords(budget_keywords, message_text):
            return "budget"
        elif any(emoji in message_text for emoji in ["🍛", "🏛️", "🌿", "🙏", "🧘‍♀️", "🎭"]) or extract_answer_by_keywords(interest_keywords, message_text):
            return "interests"
        
        return None
    
    # Initialize default values
    destination = "Not specified"
    dates = "Not specified"
    travelers = "Not specified"
    interests = "Not specified" 
    food_preferences = "Not specified"
    budget = "Not specified"
    pace = "Not specified"
    
    # First, try to extract in sequence
    user_messages = [m.text for m in req.messages if m.sender == "user"]
    if len(user_messages) > 0:
        destination = user_messages[0]
    if len(user_messages) > 1:
        dates = user_messages[1]
    
    # Then try to classify the remaining messages by content
    classified_messages = {}
    for i, msg in enumerate(user_messages):

        # --- COMMENTED OUT: Itinerary generation endpoint (not in use for waitlist/survey) ---
        # @app.post("/api/generate-itinerary")
        # async def generate_itinerary(...):
        #     ...existing code...
        if not itinerary_data.get("personalized_title") or itinerary_data.get("personalized_title") in [None, "", "undefined"]:
            itinerary_data["personalized_title"] = f"Trip to {itinerary_data['destination_name']}"

        llm_message = "Your premium itinerary is ready. Every detail has been crafted for your journey."

        # Store the itinerary in the database
        itinerary_document = {
            "user_email": current_user.get("email"),
            "user_name": current_user.get("name"),
            "destination": destination,
            "dates": dates,
            "travelers": travelers,
            "food_preferences": food_preferences,
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
            
            # Update user's subscription status if they used their free itinerary
            if not has_premium_subscription and subscription_status == "free":
                await users_collection.update_one(
                    {"email": user_email},
                    {
                        "$set": {"free_itinerary_used": True},
                        "$inc": {"itineraries_created": 1}
                    }
                )
            else:
                # For premium users, just increment the counter
                await users_collection.update_one(
                    {"email": user_email},
                    {"$inc": {"itineraries_created": 1}}
                )
                
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
        print(f"Error calling Groq API or parsing JSON: {e}")
        error_detail = str(e)
        
        # Check if it's a quota error
        if "quota" in error_detail.lower() or "429" in error_detail:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="API quota exceeded. Please try again in a few minutes or upgrade your plan."
            )
            
        # Instead of failing, return a basic itinerary
        print("Returning fallback itinerary")
        
        # Create a basic itinerary with the data we have
        destination_name = destination if destination != "Not specified" else "India"
        itinerary_data = {
            "hero_image_url": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&h=900&fit=crop",
            "destination_name": destination_name,
            "personalized_title": f"Your {destination_name} Adventure",
            "trip_overview": {
                "destination_insights": "Experience the beauty and culture of India with this sample itinerary.",
                "weather_during_visit": "Please check current weather forecasts before traveling.",
                "seasonal_context": "India's climate varies significantly by region and season.",
                "local_customs_to_know": ["Remove shoes before entering temples", "Dress modestly at religious sites"]
            },
            "daily_itinerary": [
                {
                    "date": "Day 1",
                    "day_number": "Day 1",
                    "theme": "Exploring the Local Culture",
                    "breakfast": {
                        "restaurant": "Local Restaurant",
                        "dish": "Traditional Indian Breakfast",
                        "estimated_cost": "₹200-300"
                    },
                    "morning_activities": [
                        {
                            "activity": "Visit a Local Landmark",
                            "location": "City Center",
                            "duration": "2 hours"
                        }
                    ],
                    "lunch": {
                        "restaurant": "Authentic Indian Restaurant",
                        "dish": "Regional Thali",
                        "estimated_cost": "₹400-600"
                    },
                    "afternoon_activities": [
                        {
                            "activity": "Cultural Tour",
                            "location": "Heritage Area",
                            "duration": "3 hours"
                        }
                    ],
                    "evening_snacks": {
                        "dish": "Street Food Snacks",
                        "place": "Local Market",
                        "estimated_cost": "₹100-200"
                    },
                    "dinner": {
                        "restaurant": "Premium Dining Experience",
                        "dish": "Chef's Special",
                        "estimated_cost": "₹800-1200"
                    }
                }
            ]
        }
        
        # Add more user-specific details if available
        if travelers != "Not specified":
            itinerary_data["trip_overview"]["travel_party"] = f"Tailored for {travelers}"
        
        if food_preferences != "Not specified":
            itinerary_data["trip_overview"]["food_note"] = f"Includes {food_preferences} food options"
            
        return {"itinerary": itinerary_data, "llm_message": "Here's a sample itinerary to get you started. For a fully personalized plan, please try again with more specific preferences."}

    return {"itinerary": itinerary_data, "llm_message": llm_message}
