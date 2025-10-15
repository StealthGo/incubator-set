import jwt
import datetime
def test_signin_wrong_password():
    # Try to sign in with wrong password
    email = "testuser2@example.com"
    password = "rightpass"
    name = "Test User2"
    # Ensure user exists
    client.post("/api/signup", json={"email": email, "password": password, "name": name})
    resp = client.post("/api/signin", data={"username": email, "password": "wrongpass"})
    assert resp.status_code == 400
    assert "Incorrect email or password" in resp.text

def test_access_me_missing_token():
    # No token provided
    resp = client.get("/api/me")
    assert resp.status_code == 401
    assert "Could not validate credentials" in resp.text

def test_access_me_invalid_token():
    # Invalid token
    headers = {"Authorization": "Bearer invalidtoken123"}
    resp = client.get("/api/me", headers=headers)
    assert resp.status_code == 401
    assert "Could not validate credentials" in resp.text

def test_access_me_expired_token():
    # Create expired JWT
    email = "testuser3@example.com"
    password = "testpass3"
    name = "Test User3"
    client.post("/api/signup", json={"email": email, "password": password, "name": name})
    secret = app.dependency_overrides.get('SECRET_KEY', 'supersecret')
    expired = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=10)
    token = jwt.encode({"sub": email, "exp": expired}, secret, algorithm="HS256")
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/api/me", headers=headers)
    assert resp.status_code == 401
    assert "Token has expired" in resp.text
"""
Test script for verifying Groq API integration
Run this script before starting the application to ensure the API is working correctly
"""
import os
from dotenv import load_dotenv
from groq import Groq

def test_groq_api():
    """Test the Groq API connection and integration"""
    print("Testing Groq API integration...")
    
    # Load environment variables
    load_dotenv()
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        print("ERROR: GROQ_API_KEY not found in .env file")
        return False
    
    try:
        # Initialize client
        print("Initializing Groq client...")
        client = Groq(api_key=api_key)
        
        # Test a simple completion
        print("Testing API with a simple prompt...")
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": "Say hello in 10 words or less"
                }
            ],
            temperature=0.5,
            max_completion_tokens=20,
            stream=False
        )
        
        # Extract and display response
        response = completion.choices[0].message.content.strip()
        print(f"API Response: {response}")
        print("API test successful!")
        return True
        
    except Exception as e:
        print(f"ERROR: Groq API test failed: {e}")
        print("Please check your API key and internet connection")
        return False

if __name__ == "__main__":

# --- FastAPI endpoint tests for itinerary management ---
import pytest
from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

def get_auth_token(email="testuser@example.com", password="testpass", name="Test User"):
    # Signup or signin to get token
    signup_resp = client.post("/api/signup", json={"email": email, "password": password, "name": name})
    if signup_resp.status_code == 400 and "already registered" in signup_resp.text:
        signin_resp = client.post("/api/signin", data={"username": email, "password": password})
        token = signin_resp.json()["access_token"]
    else:
        token = signup_resp.json()["access_token"]
    return token

def test_generate_get_delete_itinerary():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    # Generate itinerary
    payload = {
        "destination": "Paris",
        "dates": "2025-10-20 to 2025-10-25",
        "travelers": "2",
        "interests": "art, food",
        "food_preferences": "vegetarian",
        "budget": "medium",
        "pace": "relaxed",
        "personalized_title": "Romantic Paris Trip"
    }
    gen_resp = client.post("/api/generate-itinerary", json=payload, headers=headers)
    assert gen_resp.status_code == 200
    itinerary_id = gen_resp.json()["itinerary_id"]
    # Get itinerary
    get_resp = client.get(f"/api/itinerary/{itinerary_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["destination"] == "Paris"
    # Delete itinerary
    del_resp = client.delete(f"/api/itinerary/{itinerary_id}", headers=headers)
    assert del_resp.status_code == 200
    # Confirm deletion
    get_resp2 = client.get(f"/api/itinerary/{itinerary_id}", headers=headers)
    assert get_resp2.status_code == 404
