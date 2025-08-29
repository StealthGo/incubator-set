/**
 * The Modern Chanakya - Node.js Backend
 * 
 * This is the main server file for The Modern Chanakya travel itinerary generator.
 * It provides API endpoints for user authentication, chat conversation, and itinerary generation.
 */

// Import required dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Configure middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://www.tmchanakya.com', 'https://tmchanakya.com'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev')); // Log HTTP requests

// Define schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionStatus: { type: String, default: 'free' }, // free, premium
  hasPremiumSubscription: { type: Boolean, default: false },
  itinerariesCreated: { type: Number, default: 0 },
  freeItineraryUsed: { type: Boolean, default: false },
  chatMessagesUsed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const ItinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, required: true },
  userName: { type: String },
  destination: { type: String, required: true },
  dates: { type: String },
  travelers: { type: String },
  foodPreferences: { type: String },
  interests: { type: String },
  budget: { type: String },
  pace: { type: String },
  itineraryData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create models
const User = mongoose.model('User', UserSchema);
const Itinerary = mongoose.model('Itinerary', ItinerarySchema);

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ email: decoded.email });
    
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  // Check if Groq API key exists
  const apiKeyValid = !!process.env.GROQ_API_KEY;
  
  res.json({
    status: 'healthy',
    apiConnected: apiKeyValid,
    message: 'The Modern Chanakya is ready to assist with your travel plans!',
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to check user data (only for development)
app.get('/api/debug/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't return the actual password, just whether it exists
    const userData = {
      name: user.name,
      email: user.email,
      hasPassword: !!user.password,
      passwordType: typeof user.password,
      passwordLength: user.password ? user.password.length : 0,
      subscriptionStatus: user.subscriptionStatus,
      createdAt: user.createdAt
    };
    
    res.json(userData);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Error retrieving user data' });
  }
});

// Password reset endpoint (only for development)
app.post('/api/debug/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Auth endpoints
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await newUser.save();
    
    // Generate token
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });
    
    res.status(201).json({
      access_token: token,
      token_type: 'bearer',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Signin attempt:', { username, passwordProvided: !!password });
    
    // Find user
    const user = await User.findOne({ email: username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ error: 'Incorrect email or password' });
    }
    
    console.log('User found:', { email: user.email, passwordStored: !!user.password });
    
    // Check if password exists and is not undefined
    if (!password) {
      console.log('Password is undefined or empty');
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // Check if user has a password stored
    if (!user.password) {
      console.log('User has no password stored');
      return res.status(400).json({ error: 'Account requires password reset' });
    }
    
    try {
      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log('Password validation failed');
        return res.status(400).json({ error: 'Incorrect email or password' });
      }
    } catch (bcryptError) {
      console.error('Password comparison error:', bcryptError);
      return res.status(400).json({ error: 'Authentication error. Please contact support.' });
    }
    
    // Generate token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });
    
    res.json({
      access_token: token,
      token_type: 'bearer',
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

app.get('/api/me', authenticateToken, (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    subscription_status: req.user.subscriptionStatus,
    has_premium_subscription: req.user.hasPremiumSubscription,
    itineraries_created: req.user.itinerariesCreated,
    free_itinerary_used: req.user.freeItineraryUsed,
    chat_messages_used: req.user.chatMessagesUsed,
  });
});

// Chat conversation endpoint
app.post('/api/chat-conversation', authenticateToken, async (req, res) => {
  try {
    console.log('Received chat request');
    
    const { system_prompt, conversation_history, user_name } = req.body;
    const user = req.user;
    
    // Check subscription status and message limits
    const hasPremiumSubscription = user.hasPremiumSubscription;
    let chatMessagesUsed = user.chatMessagesUsed;
    
    // Define limits for free users
    const FREE_CHAT_LIMIT = 20;
    
    // If user doesn't have premium subscription, check limits
    if (!hasPremiumSubscription) {
      if (chatMessagesUsed >= FREE_CHAT_LIMIT) {
        return res.json({
          response: "🔒 You've reached your free chat limit! Upgrade to premium for unlimited conversations and premium itinerary features. 💎✨",
          ready_for_itinerary: false,
          subscription_required: true,
          limit_reached: true,
          messages_used: chatMessagesUsed,
          free_limit: FREE_CHAT_LIMIT,
        });
      }
    }
    
    // Format conversation history
    let conversationText = "";
    for (const msg of conversation_history) {
      if (msg.sender === 'user') {
        conversationText += `User: ${msg.text}\n`;
      } else if (msg.sender === 'system') {
        conversationText += `Assistant: ${msg.text}\n`;
      }
    }
    
    // Create prompt for conversational response
    const prompt = `
${system_prompt}

CONVERSATION SO FAR:
${conversationText}

USER NAME: ${user_name || user.name || 'there'}
USER SUBSCRIPTION: ${hasPremiumSubscription ? 'Premium ✨' : 'Free (Limited)'}

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

IMPORTANT: Keep responses under 100 words. Be conversational, not formal.`;

    console.log('Calling Groq API for chat response...');
    
    try {
      // Generate response using Groq
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_completion_tokens: 150,
        top_p: 1,
        reasoning_effort: "medium",
        stream: false,
        stop: null
      });
      
      console.log('Groq API call successful');
      const aiResponse = completion.choices[0].message.content.trim();
      console.log(`Response length: ${aiResponse.length} characters`);
      
      // Update message count for free users
      if (!hasPremiumSubscription) {
        await User.updateOne(
          { email: user.email },
          { $inc: { chatMessagesUsed: 1 } }
        );
        chatMessagesUsed += 1;
      }
      
      // Check if ready for itinerary generation
      const conversationLength = conversation_history.length;
      const userMessages = conversation_history.filter(msg => msg.sender === 'user').map(msg => msg.text);
      
      // More intelligent detection of readiness - look for key info
      const hasDestination = conversation_history.some(msg => msg.sender === 'user' && msg.text.length > 2);
      const hasEnoughInfo = (
        conversationLength >= 12 || // After 6 back-and-forth exchanges (12 messages total)
        aiResponse.toLowerCase().includes("ready to generate") ||
        aiResponse.toLowerCase().includes("work my magic") ||
        aiResponse.toLowerCase().includes("create your itinerary") ||
        userMessages.length >= 6 // User has answered 6 questions
      );
      
      res.json({
        response: aiResponse,
        ready_for_itinerary: hasEnoughInfo,
        subscription_required: false,
        limit_reached: false,
        messages_used: hasPremiumSubscription ? -1 : chatMessagesUsed,
        free_limit: FREE_CHAT_LIMIT,
        has_premium: hasPremiumSubscription
      });
    } catch (apiError) {
      console.error('Groq API error:', apiError);
      
      // Fall back to a default response
      res.json({
        response: "Hey! 👋 I'd love to help plan your trip to India! Where would you like to visit? From the mountains of Himachal to the beaches of Goa, I can help you discover the perfect destination!",
        ready_for_itinerary: false,
        subscription_required: false,
        limit_reached: false,
        messages_used: hasPremiumSubscription ? -1 : chatMessagesUsed,
        free_limit: FREE_CHAT_LIMIT,
        has_premium: hasPremiumSubscription
      });
    }
  } catch (error) {
    console.error('Error in chat conversation:', error);
    res.json({
      response: "Hey! 👋 Ready to explore incredible India? Kahan jaana hai? Where do you want to go?",
      ready_for_itinerary: false,
      subscription_required: false,
      limit_reached: false
    });
  }
});

// Generate itinerary endpoint
app.post('/api/generate-itinerary', authenticateToken, async (req, res) => {
  try {
    const { messages, current_itinerary } = req.body;
    const user = req.user;
    
    // Check subscription limits for itinerary generation
    if (!user.hasPremiumSubscription && user.subscriptionStatus === 'free' && user.freeItineraryUsed) {
      return res.status(403).json({
        error: "You have already used your free itinerary. Please upgrade to premium for unlimited itinerary generation and enhanced features."
      });
    }
    
    // Extract answers from the conversation
    const userMessages = messages.filter(m => m.sender === 'user').map(m => m.text);
    
    const destination = userMessages[0] || "Not specified";
    const dates = userMessages[1] || "Not specified";
    const travelers = userMessages[2] || "Not specified";
    const interests = userMessages[3] || "Not specified";
    const foodPreferences = userMessages[4] || "Not specified";
    const budget = userMessages[5] || "Not specified";
    const pace = userMessages[6] || "Not specified";
    
    const systemPromptContent = `
You are 'The Modern Chanakya', an elite, AI-powered travel strategist based in India. 
Create a detailed JSON travel itinerary for the following trip:

**TRAVELER PROFILE:**
- Destination: ${destination}
- Dates: ${dates}
- Travelers: ${travelers}
- Food Preferences: ${foodPreferences}
- Interests: ${interests}
- Budget: ${budget}
- Pace: ${pace}

**REQUIRED JSON STRUCTURE:**
{
  "destination_name": "${destination}",
  "personalized_title": "A catchy title for this trip",
  "hero_image_url": "A high-quality direct image URL that ends with .jpg, .jpeg, .png, or .webp",
  "trip_overview": {
    "destination_insights": "A brief paragraph with local insights",
    "weather_during_visit": "Weather forecast",
    "seasonal_context": "What's special about this season",
    "local_customs_to_know": ["Important customs to know"]
  },
  "daily_itinerary": [
    {
      "date": "YYYY-MM-DD",
      "day_number": "Day 1",
      "theme": "Theme for the day",
      "breakfast": {
        "restaurant": "Restaurant name",
        "dish": "Recommended dish",
        "estimated_cost": "Cost in INR"
      },
      "morning_activities": [
        {
          "activity": "Activity name",
          "location": "Location details",
          "duration": "Recommended time"
        }
      ],
      "lunch": {
        "restaurant": "Restaurant name",
        "dish": "Recommended dish",
        "estimated_cost": "Cost in INR"
      },
      "afternoon_activities": [
        {
          "activity": "Activity name",
          "location": "Location details",
          "duration": "Recommended time"
        }
      ],
      "dinner": {
        "restaurant": "Restaurant name",
        "dish": "Recommended dish",
        "estimated_cost": "Cost in INR"
      }
    }
  ],
  "practical_tips": [
    "Practical tip 1",
    "Practical tip 2"
  ]
}

FINAL REMINDER: You MUST respond ONLY with a valid JSON object. Do NOT include any explanatory text, markdown formatting, or content before or after the JSON. Your response should start with '{' and end with '}' with no other characters outside of those.

IMPORTANT: Valid JSON requires:
1. All keys are double-quoted
2. All string values are double-quoted
3. No trailing commas in arrays or objects
4. No comments
5. No formatting or markdown code blocks
`;

    console.log('Generating itinerary for destination:', destination);
    
    try {
      // Generate itinerary using Groq
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: systemPromptContent
          }
        ],
        temperature: 0.6,
        max_completion_tokens: 26571,
        top_p: 1,
        reasoning_effort: "medium",
        stream: false,
        response_format: { type: "json_object" },
        stop: null
      });
      
      let llmReply = completion.choices[0].message.content;
      
      // Clean up the response
      llmReply = llmReply.trim();
      
      // Parse JSON response
      let itineraryData;
      try {
        itineraryData = JSON.parse(llmReply);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        
        // Try to find JSON between curly braces
        const jsonMatch = llmReply.match(/(\{.*\})/s);
        if (jsonMatch) {
          const potentialJson = jsonMatch[1];
          try {
            itineraryData = JSON.parse(potentialJson);
            console.log('Successfully extracted JSON using regex pattern');
          } catch (e) {
            // Try more aggressive extraction
            const firstBrace = llmReply.indexOf('{');
            const lastBrace = llmReply.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
              const potentialJson = llmReply.substring(firstBrace, lastBrace + 1);
              itineraryData = JSON.parse(potentialJson);
              console.log('Successfully extracted JSON using brace positions');
            } else {
              throw new Error('Failed to extract valid JSON');
            }
          }
        } else {
          throw new Error('No JSON structure found in response');
        }
      }
      
      // Create a new itinerary document
      const itineraryDoc = new Itinerary({
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        destination,
        dates,
        travelers,
        foodPreferences,
        interests,
        budget,
        pace,
        itineraryData,
      });
      
      const savedItinerary = await itineraryDoc.save();
      
      // Add the ID to the response
      itineraryData.itinerary_id = savedItinerary._id.toString();
      
      // Update user's subscription status if they used their free itinerary
      if (!user.hasPremiumSubscription && user.subscriptionStatus === 'free') {
        await User.updateOne(
          { email: user.email },
          {
            $set: { freeItineraryUsed: true },
            $inc: { itinerariesCreated: 1 }
          }
        );
      } else {
        // For premium users, just increment the counter
        await User.updateOne(
          { email: user.email },
          { $inc: { itinerariesCreated: 1 } }
        );
      }
      
      res.json({
        itinerary: itineraryData,
        llm_message: "Your premium itinerary is ready. Every detail has been crafted for your journey."
      });
    } catch (apiError) {
      console.error('Groq API error:', apiError);
      
      // Create a fallback itinerary
      const destinationName = destination !== "Not specified" ? destination : "India";
      const fallbackItinerary = {
        hero_image_url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&h=900&fit=crop",
        destination_name: destinationName,
        personalized_title: `Your ${destinationName} Adventure`,
        trip_overview: {
          destination_insights: "Experience the beauty and culture of India with this sample itinerary.",
          weather_during_visit: "Please check current weather forecasts before traveling.",
          seasonal_context: "India's climate varies significantly by region and season.",
          local_customs_to_know: ["Remove shoes before entering temples", "Dress modestly at religious sites"]
        },
        daily_itinerary: [
          {
            date: "Day 1",
            day_number: "Day 1",
            theme: "Exploring the Local Culture",
            breakfast: {
              restaurant: "Local Restaurant",
              dish: "Traditional Indian Breakfast",
              estimated_cost: "₹200-300"
            },
            morning_activities: [
              {
                activity: "Visit a Local Landmark",
                location: "City Center",
                duration: "2 hours"
              }
            ],
            lunch: {
              restaurant: "Authentic Indian Restaurant",
              dish: "Regional Thali",
              estimated_cost: "₹400-600"
            },
            afternoon_activities: [
              {
                activity: "Cultural Tour",
                location: "Heritage Area",
                duration: "3 hours"
              }
            ],
            dinner: {
              restaurant: "Premium Dining Experience",
              dish: "Chef's Special",
              estimated_cost: "₹800-1200"
            }
          }
        ],
        practical_tips: [
          "Stay hydrated, especially during summer months",
          "Always carry some cash as not all places accept cards"
        ]
      };
      
      res.json({
        itinerary: fallbackItinerary,
        llm_message: "Here's a sample itinerary to get you started. For a fully personalized plan, please try again."
      });
    }
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      error: "Failed to generate itinerary",
      detail: error.message
    });
  }
});

// Get user's itineraries
app.get('/api/my-itineraries', authenticateToken, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userEmail: req.user.email })
      .select('_id destination dates travelers itineraryData.destination_name itineraryData.personalized_title itineraryData.hero_image_url createdAt')
      .sort({ createdAt: -1 });
    
    const formattedItineraries = itineraries.map(doc => ({
      itinerary_id: doc._id.toString(),
      destination: doc.destination || "Unknown",
      dates: doc.dates || "",
      travelers: doc.travelers || "",
      destination_name: doc.itineraryData?.destination_name || doc.destination || "Unknown",
      personalized_title: doc.itineraryData?.personalized_title || `Trip to ${doc.destination || "Unknown"}`,
      hero_image_url: doc.itineraryData?.hero_image_url || "https://picsum.photos/800/400",
      created_at: doc.createdAt
    }));
    
    res.json({ itineraries: formattedItineraries });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    res.status(500).json({ error: "Failed to fetch itineraries" });
  }
});

// Get a specific itinerary
app.get('/api/itinerary/:itineraryId', authenticateToken, async (req, res) => {
  try {
    const { itineraryId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(itineraryId)) {
      return res.status(400).json({ error: "Invalid itinerary ID format" });
    }
    
    const itinerary = await Itinerary.findOne({
      _id: itineraryId,
      userEmail: req.user.email
    });
    
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    res.json({
      itinerary_id: itinerary._id.toString(),
      user_info: {
        email: itinerary.userEmail,
        name: itinerary.userName
      },
      trip_parameters: {
        destination: itinerary.destination,
        dates: itinerary.dates,
        travelers: itinerary.travelers,
        food_preferences: itinerary.foodPreferences,
        interests: itinerary.interests,
        budget: itinerary.budget,
        pace: itinerary.pace
      },
      itinerary: itinerary.itineraryData,
      created_at: itinerary.createdAt,
      updated_at: itinerary.updatedAt
    });
  } catch (error) {
    console.error('Error fetching itinerary details:', error);
    res.status(500).json({ error: "Failed to fetch itinerary details" });
  }
});

// Delete an itinerary
app.delete('/api/itinerary/:itineraryId', authenticateToken, async (req, res) => {
  try {
    const { itineraryId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(itineraryId)) {
      return res.status(400).json({ error: "Invalid itinerary ID format" });
    }
    
    const result = await Itinerary.deleteOne({
      _id: itineraryId,
      userEmail: req.user.email
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Itinerary not found or you don't have permission to delete it" });
    }
    
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ error: "Failed to delete itinerary" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API health check available at http://localhost:${PORT}/api/health`);
});
