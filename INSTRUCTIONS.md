# The Modern Chanakya - Travel Itinerary Generator

This application consists of a FastAPI backend and a Next.js frontend for generating personalized travel itineraries based on user preferences.

## Quick Start

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install requirements:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with the following:
```
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_uri
JWT_SECRET_KEY=your_secret_key
```

4. Run the original backend:
```bash
python app.py
```

Alternatively, run the simplified version:
```bash
python simplified_app.py
```

The backend will be available at http://localhost:8000

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Simplified Version

We've created simplified versions of both the frontend and backend to demonstrate the core functionality without the complexity of the full application:

- Backend: `backend/simplified_app.py`
- Frontend: `frontend/src/app/simplified-chat.jsx`

These simplified versions focus on the core chat conversation and itinerary generation functionality.

## Key Improvements

1. Fixed JSON parsing issues in the Groq API integration
2. Enhanced error handling for JSON responses
3. Improved prompt instructions for more reliable JSON formatting
4. Created a simplified version for easier debugging and testing

## API Endpoints

- `/api/chat-conversation` - Handles the conversation flow to collect travel preferences
- `/api/generate-itinerary` - Generates a detailed travel itinerary based on the conversation
- `/api/health` - Health check endpoint

## Known Issues

- The Groq API sometimes returns JSON with formatting issues
- Long itineraries might be truncated due to token limits

## Troubleshooting

If you encounter issues with JSON parsing:
1. Check the API response directly in the backend logs
2. Use the simplified versions to isolate the problem
3. Ensure your Groq API key has the necessary permissions
