# The Modern Chanakya - Travel Itinerary Generator

This application consists of a backend API built with FastAPI and a frontend built with Next.js.

## Backend Setup

1. Navigate to the backend directory
```
cd backend
```

2. Install requirements
```
pip install -r requirements.txt
```

3. Run the backend server
```
python app.py
```

The backend will be available at http://localhost:8000

## Frontend Setup

1. Navigate to the frontend directory
```
cd frontend
```

2. Install dependencies
```
npm install
```

3. Run the development server
```
npm run dev
```

The frontend will be available at http://localhost:3000

## API Configuration

The backend uses the Groq API for generating itineraries. Make sure to set up your `.env` file with the following:

```
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET_KEY=your_secret_key_here
```

## Usage

1. Sign up or log in to the application
2. Navigate to the preferences page to chat with The Modern Chanakya
3. Answer the questions about your travel preferences
4. Generate your personalized itinerary
