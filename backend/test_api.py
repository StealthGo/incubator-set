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
    success = test_groq_api()
    if success:
        print("\nAPI test passed. You can now run the application.")
        exit(0)
    else:
        print("\nAPI test failed. Please fix the issues before running the application.")
        exit(1)
