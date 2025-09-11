"""
Simplified backend for The Modern Chanakya - Travel Itinerary Generator
This version focuses on handling API calls correctly with Groq
"""

import json
import os
import datetime
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
async def chat_conversation(request: ChatConversationRequest):
    """Handle conversational AI for trip planning"""
    try:
        # Add debug logging
        print("Received chat request")
        print(f"Conversation history length: {len(request.conversation_history)}")
        
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

USER NAME: {request.user_name or 'User'}

Based on the conversation above, respond as "The Modern Chanakya" with the next appropriate message. 

RESPONSE GUIDELINES:
- Keep responses SHORT and conversational (max 2-3 sentences)
- Ask ONE clear, simple follow-up question
- Use casual, friendly tone with emojis naturally
- Be quick and to the point - like WhatsApp chatting
- Reference their previous answers briefly to show you're listening
- After 5-6 exchanges, if you have destination + dates + basic preferences, indicate readiness to generate itinerary

CONVERSATION FLOW (6-7 questions max):
1. Destination in India (where in Bharat?)
2. Travel dates (when?)  
3. Who's traveling (solo/family/friends?)
4. Main interests (what excites you most?)
5. Food preferences (vegetarian/non-vegetarian/vegan/jain/any specific dietary needs?)
6. Budget range (budget/mid-range/luxury?)
7. Ready to generate if enough info, otherwise ask about pace/special requirements

Keep it snappy and WhatsApp-friendly! No long paragraphs.

IMPORTANT: Keep responses under 100 words. Be conversational, not formal.
"""

        # Generate response using Groq
        print("Calling Groq API for chat response...")
        
        try:
            completion = client.chat.completions.create(
                model="openai/gpt-oss-20b",  # Using openai/gpt-oss-20b model
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.8,
                max_completion_tokens=150,  # Reduced for shorter responses
                top_p=1,
                reasoning_effort="medium",
                stream=False,
                stop=None
            )
            
            print("Groq API call successful")
            ai_response = completion.choices[0].message.content.strip()
            print(f"Response length: {len(ai_response)} characters")
        except Exception as api_error:
            print(f"Groq API error: {api_error}")
            # Fall back to a default response if API call fails
            ai_response = "Hey! 👋 I'd love to help plan your trip to India! Where would you like to visit? From the mountains of Himachal to the beaches of Goa, I can help you discover the perfect destination!"
        
        # Check if we have enough information to suggest itinerary generation
        conversation_length = len(request.conversation_history)
        user_messages = [msg.text for msg in request.conversation_history if msg.sender == "user"]
        
        # More intelligent detection of readiness - look for key info
        has_destination = any(msg.sender == "user" and len(msg.text) > 2 for msg in request.conversation_history)
        has_enough_info = (
            conversation_length >= 12 or  # After 6 back-and-forth exchanges (12 messages total)
            "ready to generate" in ai_response.lower() or 
            "work my magic" in ai_response.lower() or
            "create your itinerary" in ai_response.lower() or
            len(user_messages) >= 6  # User has answered 6 questions
        )
        
        return {
            "response": ai_response,
            "ready_for_itinerary": has_enough_info,
        }
        
    except Exception as e:
        print(f"Error in chat conversation: {e}")
        # Return a more helpful error message
        return {
            "response": "Hi there! I'm excited to help plan your perfect Indian adventure! 🇮🇳 Where in India would you like to travel?",
            "ready_for_itinerary": False,
        }

@app.post("/api/generate-itinerary")
async def generate_itinerary(req: ItineraryRequest):
    """Generate a travel itinerary based on user preferences"""
    
    # Extract answers from the conversation
    user_messages = [m.text for m in req.messages if m.sender == "user"]
    
    destination = user_messages[0] if len(user_messages) > 0 else "Not specified"
    dates = user_messages[1] if len(user_messages) > 1 else "Not specified"
    travelers = user_messages[2] if len(user_messages) > 2 else "Not specified"
    interests = user_messages[3] if len(user_messages) > 3 else "Not specified" 
    food_preferences = user_messages[4] if len(user_messages) > 4 else "Not specified"
    budget = user_messages[5] if len(user_messages) > 5 else "Not specified"
    pace = user_messages[6] if len(user_messages) > 6 else "Not specified"
    
    system_prompt_content = f"""
You are 'The Modern Chanakya', an elite, AI-powered travel strategist based in India. 
Create a detailed JSON travel itinerary for the following trip:

**TRAVELER PROFILE:**
- Destination: {destination}
- Dates: {dates}
- Travelers: {travelers}
- Food Preferences: {food_preferences}
- Interests: {interests}
- Budget: {budget}
- Pace: {pace}

**REQUIRED JSON STRUCTURE:**
{{
  "destination_name": "{destination}",
  "personalized_title": "A catchy title for this trip",
  "trip_overview": {{
    "destination_insights": "A brief paragraph with local insights",
    "weather_during_visit": "Weather forecast",
    "seasonal_context": "What's special about this season",
    "local_customs_to_know": ["Important customs to know"]
  }},
  "daily_itinerary": [
    {{
      "date": "YYYY-MM-DD",
      "day_number": "Day 1",
      "theme": "Theme for the day",
      "breakfast": {{
        "restaurant": "Restaurant name",
        "dish": "Recommended dish",
        "estimated_cost": "Cost in INR"
      }},
      "morning_activities": [
        {{
          "activity": "Activity name",
          "location": "Location details",
          "duration": "Recommended time"
        }}
      ],
      "lunch": {{
        "restaurant": "Restaurant name",
        "dish": "Recommended dish",
        "estimated_cost": "Cost in INR"
      }},
      "afternoon_activities": [
        {{
          "activity": "Activity name",
          "location": "Location details",
          "duration": "Recommended time"
        }}
      ],
      "dinner": {{
        "restaurant": "Restaurant name",
        "dish": "Recommended dish",
        "estimated_cost": "Cost in INR"
      }}
    }}
  ],
  "practical_tips": [
    "Practical tip 1",
    "Practical tip 2"
  ]
}}

FINAL REMINDER: You MUST respond ONLY with a valid JSON object. Do NOT include any explanatory text, markdown formatting, or content before or after the JSON. Your response should start with {{ and end with }} with no other characters outside of those.
"""

    try:
        # Use Groq to generate the itinerary
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": system_prompt_content
                }
            ],
            temperature=0.6,
            max_completion_tokens=26571,
            top_p=1,
            reasoning_effort="medium",
            stream=False,
            response_format={"type": "json_object"},
            stop=None
        )
        
        llm_reply = completion.choices[0].message.content
        
        # Clean up the response
        llm_reply = llm_reply.strip()
        if llm_reply.startswith("```json"):
            llm_reply = llm_reply[7:]
        if llm_reply.startswith("```"):
            llm_reply = llm_reply[3:]
        if llm_reply.endswith("```"):
            llm_reply = llm_reply[:-3]
        llm_reply = llm_reply.strip()
        
        # Parse JSON response
        try:
            itinerary_data = json.loads(llm_reply)
        except json.JSONDecodeError:
            # Find JSON between curly braces
            import re
            json_match = re.search(r'(\{.*\})', llm_reply, re.DOTALL)
            if json_match:
                potential_json = json_match.group(1)
                itinerary_data = json.loads(potential_json)
            else:
                # Try to find first opening brace and last closing brace
                first_brace = llm_reply.find('{')
                last_brace = llm_reply.rfind('}')
                
                if first_brace != -1 and last_brace != -1 and first_brace < last_brace:
                    potential_json = llm_reply[first_brace:last_brace+1]
                    itinerary_data = json.loads(potential_json)
                else:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Failed to parse itinerary data"
                    )

        return {"itinerary": itinerary_data, "message": "Your itinerary is ready!"}

    except Exception as e:
        print(f"Error generating itinerary: {e}")
        # Return a basic sample itinerary as fallback
        fallback_itinerary = {
            "destination_name": "Sample Destination",
            "personalized_title": "Your India Adventure",
            "trip_overview": {
                "destination_insights": "This is a sample itinerary. Please try again with more specific preferences.",
                "weather_during_visit": "Weather information would appear here.",
                "seasonal_context": "Season information would appear here.",
                "local_customs_to_know": ["Sample custom 1", "Sample custom 2"]
            },
            "daily_itinerary": [
                {
                    "date": "2025-08-16",
                    "day_number": "Day 1",
                    "theme": "Exploration Day",
                    "breakfast": {
                        "restaurant": "Sample Restaurant",
                        "dish": "Local Breakfast",
                        "estimated_cost": "₹200-300"
                    },
                    "morning_activities": [
                        {
                            "activity": "Sample Activity",
                            "location": "Sample Location",
                            "duration": "2 hours"
                        }
                    ],
                    "lunch": {
                        "restaurant": "Sample Lunch Place",
                        "dish": "Local Cuisine",
                        "estimated_cost": "₹400-500"
                    },
                    "afternoon_activities": [
                        {
                            "activity": "Sample Afternoon Activity",
                            "location": "Sample Location",
                            "duration": "3 hours"
                        }
                    ],
                    "dinner": {
                        "restaurant": "Sample Dinner Place",
                        "dish": "Special Dinner",
                        "estimated_cost": "₹600-800"
                    }
                }
            ],
            "practical_tips": [
                "Sample tip 1",
                "Sample tip 2"
            ]
        }
        return {
            "itinerary": fallback_itinerary,
            "message": "We've prepared a sample itinerary. For a fully personalized plan, please try again."
        }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    # Test the Groq API key
    api_key_valid = False
    try:
        # Check if the API key is set
        if os.getenv("GROQ_API_KEY"):
            # Just check if client instantiation works
            test_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            api_key_valid = True
    except Exception as e:
        print(f"API key validation error: {e}")
    
    return {
        "status": "healthy",
        "api_connected": api_key_valid,
        "message": "The Modern Chanakya is ready to assist with your travel plans!",
        "timestamp": datetime.datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
