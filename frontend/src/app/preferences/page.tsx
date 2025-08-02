"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format } from 'date-fns';
import SubscriptionPopup from './SubscriptionPopup';
import { TagBadge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Clock, Calendar, Users, DollarSign, 
  Star, Camera, Coffee, Mountain, Heart,
  ExternalLink, Navigation, Eye, Bookmark,
  Wifi, Utensils, BedDouble, Gem, Bus, Plane
} from "lucide-react";

// --- Configuration ---
const API_BASE_URL = "http://localhost:8000"; // Your backend URL

// Enhanced Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

// Enhanced Button component
const Button = ({ children, onClick, variant = "default", size = "default", className = "", ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 transform-gpu";
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-2xl hover:-translate-y-1",
    outline: "border-2 border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-gray-50 shadow-md hover:shadow-xl hover:border-gray-400 hover:-translate-y-0.5",
    primary: "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-2xl hover:-translate-y-1",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-2xl"
  };
  const sizes: Record<string, string> = {
    default: "h-11 px-6 py-2",
    sm: "h-9 px-4 text-xs",
    lg: "h-14 px-10 text-base font-semibold"
  };
  
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Dynamic conversation system - now LLM handles all interactions
const systemPrompt = `You are "The Modern Chanakya" - an enthusiastic, knowledgeable Indian travel planning assistant who specializes EXCLUSIVELY in Indian destinations and experiences. You are passionate about Incredible India and help fellow Indians and visitors explore the beauty, culture, and diversity of our motherland.

FOCUS: INDIA ONLY - You only plan trips within India. If someone asks about international destinations, politely redirect them to explore India's incredible diversity instead.

CONVERSATION FLOW:
1. Start with a warm, desi greeting asking which part of Bharat they want to explore
2. Naturally follow up to gather:
   - Indian Destination (which state/city/region of India)
   - Travel Dates (considering Indian seasons, festivals, weather)
   - Travelers (solo yatra, family trip, friends ka gang, honeymoon, etc.)
   - Interests (spiritual journey, adventure, food tour, heritage, beaches, mountains, wildlife, festivals, etc.)
   - Budget (budget travel, middle-class comfort, luxury experience)
   - Travel Style (relaxed darshan, balanced exploration, action-packed adventure)
   - Special Indian Preferences (vegetarian food, Ayurveda, yoga, local festivals, etc.)

PERSONALITY & LANGUAGE:
- Use a mix of English and Hindi naturally (like "Kahan jaana hai?", "That sounds kamaal!", "Wah, amazing choice!")
- Be enthusiastic about Indian culture, food, traditions
- Reference Indian contexts (monsoon season, festival times, local customs)
- Use phrases like "Bahut badhiya!", "Incredible choice!", "You'll love the local mithai there!"
- Show deep knowledge of Indian geography, culture, and travel

INDIAN CONTEXT EXPERTISE:
- Know about Indian seasons (summer, monsoon, winter, post-monsoon)
- Understand Indian festivals and their travel impact
- Be aware of Indian travel patterns (hill stations in summer, Goa in winter, etc.)
- Suggest authentic Indian experiences (local markets, street food, cultural shows, temples, etc.)
- Consider Indian travel preferences (family-friendly, vegetarian options, clean accommodations)

RULES:
- ONLY suggest destinations within India
- Ask ONE question at a time in a conversational, friendly manner
- Always acknowledge their previous answer before asking the next
- When you have enough info, enthusiastically summarize and ask if they're ready for their "perfect Bharat yatra itinerary"
- If they mention international travel, redirect: "Arre yaar, why go abroad when our own India has so much to offer! Tell me what kind of experience you want - I'll show you amazing places right here in our beautiful country!"

Current conversation context will be provided. Respond as the next message in the conversation.`;

// Quick replies for different conversation stages
const smartQuickReplies: Record<string, string[]> = {
  destination: ["�️ Himachal Pradesh", "�️ Goa", "🕌 Rajasthan", "� Kerala", "🏛️ Delhi NCR", "� Andaman"],
  dates: ["📅 Pick Dates", "🤷‍♀️ Flexible hai", "🌞 Next Month", "🎯 Festival Season", "❄️ Winter", "🌸 Summer"],
  travelers: ["✈️ Solo yatra", "👫 Partner ke saath", "👨‍👩‍👧‍👦 Family trip", "🎉 Friends ka group", "👥 Big family (5+)", "💏 Honeymoon"],
  interests: ["🙏 Spiritual journey", "� Food & Culture", "�️ Heritage sites", "🌿 Nature & Wildlife", "🧘‍♀️ Yoga & Wellness", "� Festivals"],
  budget: ["💸 Budget travel", "💰 Middle-class comfort", "💎 Luxury experience", "🎯 Best value", "👨‍👩‍👧‍👦 Family budget", "🎓 Student budget"],
  pace: ["🐌 Relaxed darshan", "⚖️ Balanced exploration", "🏃‍♂️ Adventure packed", "🧘‍♀️ Peaceful & slow", "📸 Photo-focused", "🎒 Backpacker style"],
};

// --- Helper Functions & Components ---

const getRandomFlexibleDates = () => {
  const today = new Date();
  const startOffset = Math.floor(Math.random() * 20) + 1;
  const startDate = addDays(today, startOffset);
  const endDate = addDays(startDate, 4);
  return `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`;
};

const Icon = ({ name, className }: { name: string, className?: string }) => (
  <span className={`material-icons-outlined ${className}`}>{name}</span>
);

const ChatBubble = ({ sender, children }: { sender: string, children: React.ReactNode }) => {
  const align = sender === 'user' ? 'justify-end' : 'justify-start';
  const bubbleColor = sender === 'user'
    ? 'bg-orange-500 text-white'
    : 'bg-orange-50 text-orange-900 border border-orange-200';
  const shape = sender === 'user' ? 'rounded-2xl rounded-br-none' : 'rounded-2xl rounded-bl-none';
  return (
    <div className={`flex ${align} w-full mb-1`}>
      <div className={`px-4 py-2 max-w-xs md:max-w-md text-sm shadow flex items-center ${bubbleColor} ${shape}`}>
        {children}
      </div>
    </div>
  );
};

// --- Authentication Modal ---
function SignInModal({ onClose, onSuccess, onUserUpdate }: { onClose: () => void, onSuccess: () => void, onUserUpdate: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);
      const res = await fetch(`${API_BASE_URL}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Sign in failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      
      // Fetch user data after successful login
      try {
        const userRes = await fetch(`${API_BASE_URL}/api/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${data.access_token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          onUserUpdate(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      
      setLoading(false);
      onSuccess();
      onClose();
    } catch {
      setError("Network error. Is the backend running?");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSignUpSuccess("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Sign up failed");
        setLoading(false);
        return;
      }
      setSignUpSuccess("Sign up successful! Please sign in.");
      setShowSignUp(false);
      setError("");
      setLoading(false);
    } catch {
      setError("Network error. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative z-10 w-full max-w-sm bg-white/95 rounded-xl shadow-xl p-8 backdrop-blur-md">
        <h1 className="text-2xl font-extrabold mb-6 text-center text-orange-700 drop-shadow">{showSignUp ? 'Sign Up' : 'Sign In'}</h1>
        {signUpSuccess && <div className="mb-2 text-green-600 text-sm text-center font-semibold">{signUpSuccess}</div>}
        <form className="flex flex-col gap-4" onSubmit={showSignUp ? handleSignUp : handleSignIn}>
          {showSignUp && (
            <>
              <input type="text" placeholder="Name" className="px-4 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required value={name} onChange={e => setName(e.target.value)} />
              <input type="date" placeholder="Date of Birth" className="px-4 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required value={dob} onChange={e => setDob(e.target.value)} />
            </>
          )}
          <input type="email" placeholder="Email" className="px-4 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="px-4 py-2 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500" required value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-full font-bold text-lg shadow hover:bg-orange-600 transition-all" disabled={loading}>{loading ? (showSignUp ? "Signing Up..." : "Signing In...") : (showSignUp ? "Sign Up" : "Sign In")}</button>
        </form>
        {error && <div className="mt-2 text-red-600 text-sm text-center font-semibold">{error}</div>}
        <div className="flex flex-col items-center mt-4 gap-2">
          <button onClick={onClose} className="text-sm text-gray-600 hover:underline w-full font-medium">Cancel</button>
          <button onClick={() => { setShowSignUp(s => !s); setError(""); setSignUpSuccess(""); }} className="text-sm text-orange-700 hover:underline w-full font-medium">
            {showSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function PreferencesPage() {
  const [messages, setMessages] = useState([
    { sender: "system", text: "Namaste! � Main hoon The Modern Chanakya, aapka Indian travel expert! Bharat mein kahan jaana hai? From Kashmir ki valleys to Kanyakumari ke beaches - batao kya explore karna hai! 🇮🇳✨" },
  ]);
  const [input, setInput] = useState("");
  const [itinerary, setItinerary] = useState<Record<string, any> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isConversing, setIsConversing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [user, setUser] = useState<{ 
    name: string; 
    email: string; 
    subscription_status?: string;
    free_itinerary_used?: boolean;
    itineraries_created?: number;
  } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Store conversation state
  const [conversationComplete, setConversationComplete] = useState(false);
  const [currentQuestionType, setCurrentQuestionType] = useState("destination");

  // Helper function to clear conversation data
  const clearConversationData = () => {
    localStorage.removeItem("currentItinerary");
    localStorage.removeItem("conversationMessages");
    localStorage.removeItem("conversationComplete");
    setItinerary(null);
    setMessages([{ sender: 'system', text: "Namaste! 🙏 Main hoon The Modern Chanakya, aapka Indian travel expert! Bharat mein kahan jaana hai? From Kashmir ki valleys to Kanyakumari ke beaches - batao kya explore karna hai! 🇮🇳✨" }]);
    setConversationComplete(false);
    setCurrentQuestionType("destination");
    setShowOptions(false);
  };

  // Check if user is locked due to subscription limits
  const isUserLocked = () => {
    return user?.subscription_status === "free" && user?.free_itinerary_used === true;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist itinerary and conversation state to localStorage
  useEffect(() => {
    if (itinerary) {
      localStorage.setItem("currentItinerary", JSON.stringify(itinerary));
    }
  }, [itinerary]);

  useEffect(() => {
    if (messages.length > 1) { // More than just the initial greeting
      localStorage.setItem("conversationMessages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("conversationComplete", JSON.stringify(conversationComplete));
  }, [conversationComplete]);

  // Clear localStorage if user becomes locked
  useEffect(() => {
    if (isUserLocked()) {
      localStorage.removeItem("currentItinerary");
      localStorage.removeItem("conversationMessages");
      localStorage.removeItem("conversationComplete");
    }
  }, [user?.free_itinerary_used, user?.subscription_status]);

  // Restore itinerary and conversation state from localStorage on component mount
  useEffect(() => {
    // Only restore data if user is logged in
    if (!isLoggedIn) return;
    
    const savedItinerary = localStorage.getItem("currentItinerary");
    const savedMessages = localStorage.getItem("conversationMessages");
    const savedConversationComplete = localStorage.getItem("conversationComplete");

    if (savedItinerary) {
      try {
        const parsedItinerary = JSON.parse(savedItinerary);
        setItinerary(parsedItinerary);
      } catch (error) {
        console.error("Error parsing saved itinerary:", error);
      }
    }

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 1) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error("Error parsing saved messages:", error);
      }
    }

    if (savedConversationComplete) {
      try {
        const parsedComplete = JSON.parse(savedConversationComplete);
        setConversationComplete(parsedComplete);
      } catch (error) {
        console.error("Error parsing conversation state:", error);
      }
    }
  }, [isLoggedIn]); // Depend on isLoggedIn instead of running on every mount

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");
      if (token && token.trim() !== "") {
        try {
          const res = await fetch(`${API_BASE_URL}/api/me`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setIsLoggedIn(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setUser(null);
            setShowSignInModal(true); // Show sign-in modal immediately
          }
        } catch (error) {
          console.error("Error checking user status:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
          setShowSignInModal(true); // Show sign-in modal immediately
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setShowSignInModal(true); // Show sign-in modal immediately for new users
      }
    };

    checkUserStatus();
  }, []);

  // LLM-powered conversation handler
  const handleSend = async (e?: React.FormEvent, value?: string) => {
    if (e) e.preventDefault();
    
    // Check if user is logged in before allowing any prompts
    if (!isLoggedIn) {
      setShowSignInModal(true);
      return;
    }
    
    // Check if user is locked due to subscription limits
    if (isUserLocked()) {
      setShowSubscriptionPopup(true);
      return;
    }
    
    const currentInput = value || input;
    if (!currentInput.trim()) return;

    if (itinerary) {
        setItinerary(null);
        setConversationComplete(false);
    }

    // Handle date picker special case
    if (currentInput === "📅 Pick Dates") {
        setShowDatePicker(true);
        return;
    }
    
    if (currentInput === "🤷‍♀️ I'm Flexible") {
        const randomDates = getRandomFlexibleDates();
        setMessages((msgs) => [...msgs, { sender: "user", text: randomDates }]);
        setInput("");
        
        // Let LLM handle the response to flexible dates
        await getLLMResponse([...messages, { sender: "user", text: randomDates }]);
        return;
    }
    
    setMessages((msgs) => [...msgs, { sender: "user", text: currentInput }]);
    setInput("");

    // Get LLM response to continue conversation
    await getLLMResponse([...messages, { sender: "user", text: currentInput }]);
  };

  // Function to get intelligent responses from LLM
  const getLLMResponse = async (conversationHistory: Array<{sender: string, text: string}>) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowSignInModal(true);
      return;
    }

    setIsConversing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat-conversation`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          conversation_history: conversationHistory,
          user_name: user?.name
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          setShowSignInModal(true);
          return;
        }
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Add LLM response to conversation
      setMessages((msgs) => [...msgs, { sender: "system", text: data.response }]);
      
      // Check if conversation is ready for itinerary generation
      if (data.ready_for_itinerary || data.response.toLowerCase().includes("ready to generate") || data.response.toLowerCase().includes("work my magic")) {
        setConversationComplete(true);
        setShowOptions(true);
      }

    } catch (error) {
      console.error("Error getting LLM response:", error);
      setMessages((msgs) => [...msgs, { 
        sender: "system", 
        text: "I'm having trouble responding right now. Could you try again? 😅" 
      }]);
    } finally {
      setIsConversing(false);
    }
  };

  // Determine current question type for quick replies based on conversation flow
  const getCurrentQuestionType = () => {
    const userMessages = messages.filter(msg => msg.sender === "user");
    const conversationStep = userMessages.length;
    
    // Follow the sequence: destination → dates → travelers → interests → budget → pace
    switch (conversationStep) {
      case 0: return "destination";  // First question about destination
      case 1: return "dates";       // Second question about dates
      case 2: return "travelers";   // Third question about travelers
      case 3: return "interests";   // Fourth question about interests
      case 4: return "budget";      // Fifth question about budget
      case 5: return "pace";        // Sixth question about pace
      default: return "destination"; // Default fallback
    }
  };

  const handleGenerate = async (followUpPrompt?: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    // Check if token exists and is not empty
    if (!token || token.trim() === "") {
      console.log("No valid token found, showing sign-in modal");
      setShowSignInModal(true);
      return;
    }

    setIsGenerating(true);
    setShowOptions(false);

    const generatingMessage = followUpPrompt 
        ? "Updating your itinerary based on your request..."
        : "Creating your hyper-detailed travel itinerary with local insights...";
    setMessages((msgs) => [...msgs, { sender: "llm", text: generatingMessage }]);

    const requestBody = {
      messages: followUpPrompt ? [...messages, { sender: 'user', text: followUpPrompt }] : messages,
      current_itinerary: itinerary
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/generate-itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Token is invalid or expired, clear it and show sign-in modal
          localStorage.removeItem("token");
          setShowSignInModal(true);
          setIsGenerating(false);
          return;
        }
        if (res.status === 403) {
          // Subscription limit reached
          const errorData = await res.json();
          setMessages((msgs) => [
            ...msgs,
            { sender: "llm", text: errorData.detail || "You have reached your free itinerary limit. Please upgrade to continue creating itineraries." },
          ]);
          setIsGenerating(false);
          setShowSubscriptionPopup(true);
          return;
        }
        if (res.status === 429) {
          // Quota exceeded
          setMessages((msgs) => [
            ...msgs,
            { sender: "llm", text: "I'm currently experiencing high demand. Please try again in a few minutes, or consider upgrading to a premium plan for faster access." },
          ]);
          setIsGenerating(false);
          return;
        }
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setItinerary(data.itinerary);
      setMessages((msgs) => [
        ...msgs,
        { sender: "llm", text: data.llm_message || "Your itinerary is ready! Check it out on the right." },
      ]);
      
      // Show subscription popup for free users after first itinerary
      if (user?.subscription_status === "free" || !user?.subscription_status) {
        setTimeout(() => {
          setShowSubscriptionPopup(true);
          // Update user state to reflect they've used their free itinerary
          setUser(prev => prev ? { ...prev, free_itinerary_used: true } : null);
        }, 3000); // Show popup after 3 seconds to let them see the itinerary
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setMessages((msgs) => [
        ...msgs,
        { sender: "llm", text: `Sorry, there was an error: ${errorMessage}. Please try again.` },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDateSelect = (ranges: { selection: { startDate: Date; endDate: Date } }) => {
    const { startDate, endDate } = ranges.selection;
    const formatted = `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`;
    setShowDatePicker(false);
    handleSend(undefined, formatted);
  };

  const handleAskMore = () => {
    setMessages((msgs) => [...msgs, { sender: "system", text: "What else would you like to share or ask?" }]);
    setShowOptions(false);
  };

  const renderItinerary = () => {
    if (isGenerating && !itinerary) {
      return <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Crafting your perfect journey...</p>
      </div>;
    }
    if (!itinerary) {
      return (
        <div className="text-gray-400 text-center mt-16 p-4">
          <Icon name="explore" className="text-5xl mb-4" />
          <div className="text-lg font-medium mb-2">Your Detailed Indian Itinerary Will Appear Here</div>
          <div className="text-sm">Complete the chat to get a comprehensive Bharat travel plan with:</div>
          <div className="text-sm mt-2 space-y-1 text-left inline-block">
            <div><Icon name="map" className="text-sm mr-2 text-orange-500"/>Day-by-day detailed Indian schedule</div>
            <div><Icon name="restaurant" className="text-sm mr-2 text-orange-500"/>Authentic local food recommendations</div>
            <div><Icon name="star" className="text-sm mr-2 text-orange-500"/>Cultural experiences & festivals</div>
            <div><Icon name="shopping_cart" className="text-sm mr-2 text-orange-500"/>Local markets & handicraft guides</div>
            <div><Icon name="account_balance_wallet" className="text-sm mr-2 text-orange-500"/>Budget breakdown in Indian rupees</div>
          </div>
        </div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-12 p-4 md:p-0"
      >
        {/* Enhanced Hero Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl h-96 group"
        >
          <motion.img 
            src={itinerary.hero_image_url} 
            alt={itinerary.destination_name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-4 h-4 rounded-full opacity-30 ${
                  i % 3 === 0 ? 'bg-orange-400' : i % 3 === 1 ? 'bg-blue-400' : 'bg-purple-400'
                }`}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${25 + (i % 2) * 30}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.h2 
                className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {itinerary.personalized_title || `Your Trip to ${itinerary.destination_name}`}
              </motion.h2>
              
              <motion.div 
                className="flex flex-wrap gap-3 mt-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {itinerary.trip_overview && [
                  { icon: Calendar, label: "Perfect Season" },
                  { icon: MapPin, label: itinerary.destination_name },
                  { icon: DollarSign, label: itinerary.trip_overview.estimated_total_cost }
                ].map((item, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Journey Details */}
        {itinerary.journey_details && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
                <motion.h3 
                  className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Bus className="text-2xl text-white" />
                  </div>
                  {itinerary.journey_details.title}
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {itinerary.journey_details.options.map((opt: any, i: number) => (
                        <motion.div 
                          key={i} 
                          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden relative"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {/* Background gradient on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                                  {opt.icon === 'flight' && <Plane className="text-2xl text-white" />}
                                  {opt.icon === 'train' && <Bus className="text-2xl text-white" />}
                                  {opt.icon === 'bus' && <Bus className="text-2xl text-white" />}
                                  {opt.icon === 'car' && <Navigation className="text-2xl text-white" />}
                                </div>
                                <h4 className="font-bold text-2xl text-gray-800">{opt.mode}</h4>
                            </div>
                            <p className="text-gray-700 mb-4 text-lg leading-relaxed">{opt.description}</p>
                            <p className="text-base text-gray-600 mb-6 flex items-center gap-2">
                              <Clock className="w-5 h-5 text-orange-500" />
                              <strong>Duration:</strong> {opt.duration}
                            </p>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-800 font-bold text-2xl flex items-center gap-2">
                                  <DollarSign className="w-6 h-6 text-green-500" />
                                  {opt.estimated_cost}
                                </p>
                                <Button variant="primary" size="default" asChild>
                                  <a href={opt.booking_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <ExternalLink className="w-4 h-4" /> Book Now
                                  </a>
                                </Button>
                            </div>
                          </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        )}
        
        {/* Accommodation Suggestions */}
        {itinerary.accommodation_suggestions && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="hotel" className="text-4xl text-orange-500"/> Accommodation Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {itinerary.accommodation_suggestions.map((opt: any, i: number) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                            <img src={opt.image_url} alt={opt.name} className="w-full h-48 object-cover"/>
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-3">
                                    <Icon name={opt.icon} className="text-3xl text-orange-600"/>
                                    <div>
                                        <h4 className="font-bold text-xl text-gray-800">{opt.name}</h4>
                                        <p className="text-sm text-gray-500">{opt.type}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{opt.description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-800 font-semibold text-lg">{opt.estimated_cost}</p>
                                    <a href={opt.booking_link} target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                                        <Icon name="hotel" /> Book on MMT
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Trip Overview */}
        {itinerary.trip_overview && (
          <section className="bg-orange-50 rounded-2xl p-6 shadow-lg border border-orange-200">
            <h3 className="text-3xl font-bold text-orange-800 mb-4 flex items-center gap-3"><Icon name="info" className="text-4xl"/> Trip Overview</h3>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{itinerary.trip_overview.destination_insights}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
              <div className="text-gray-800 flex items-center gap-3"><Icon name="thermostat" className="text-orange-600" /><div><strong>Weather:</strong> {itinerary.trip_overview.weather_during_visit}</div></div>
              <div className="text-gray-800 flex items-center gap-3"><Icon name="calendar_today" className="text-orange-600" /><div><strong>Season:</strong> {itinerary.trip_overview.seasonal_context}</div></div>
              <div className="text-gray-800 flex items-center gap-3"><Icon name="festival" className="text-orange-600" /><div><strong>Culture:</strong> {itinerary.trip_overview.cultural_context}</div></div>
              <div className="text-gray-800 flex items-center gap-3"><Icon name="group" className="text-orange-600" /><div><strong>Customs:</strong> {Array.isArray(itinerary.trip_overview.local_customs_to_know) ? itinerary.trip_overview.local_customs_to_know.join(', ') : 'N/A'}</div></div>
            </div>
            <div className="text-orange-900 font-bold mt-6 text-xl text-right">Estimated Cost: {itinerary.trip_overview.estimated_total_cost}</div>
          </section>
        )}

        {/* Daily Itinerary */}
        {itinerary.daily_itinerary && (
          <section>
            <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="map" className="text-4xl text-orange-500"/> Daily Itinerary</h3>
            <div className="space-y-8">
              {itinerary.daily_itinerary.map((day: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="bg-orange-400 text-white p-4">
                    <h4 className="font-bold text-xl">{`Day ${idx + 1}: ${day.date}`}</h4>
                    <p className="text-sm opacity-90">{day.theme}</p>
                  </div>
                  <div className="p-6">
                    <h5 className="font-bold text-xl text-gray-700 mb-4">Activities</h5>
                    <div className="space-y-6">
                        {day.activities.map((activity: any, actIdx: number) => (
                          <div key={actIdx} className="flex gap-4 items-start">
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="bg-orange-100 text-orange-700 rounded-full h-12 w-12 flex items-center justify-center">
                                    <Icon name={activity.icon || "place"} />
                                </div>
                                {actIdx < day.activities.length - 1 && <div className="w-px h-full bg-gray-200 mt-2"></div>}
                            </div>
                            <div className="w-full">
                              <p className="text-sm font-semibold text-gray-500">{activity.time}</p>
                              <p className="font-bold text-lg text-gray-800">{activity.activity}</p>
                              <div className="text-sm text-gray-600 flex items-center gap-1"><Icon name="location_on" className="text-sm"/> {activity.location}</div>
                              
                              {/* Activity Tags */}
                              {activity.tags && activity.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 my-2">
                                  {activity.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                    <TagBadge key={tagIndex} tag={tag} type="activity" />
                                  ))}
                                  {activity.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">+{activity.tags.length - 3} more</span>
                                  )}
                                </div>
                              )}
                              
                              <p className="text-gray-700 my-2">{activity.description}</p>
                              <div className="mt-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <p className="font-bold text-sm text-amber-800 mb-1">Local Guide Tip:</p>
                                <p className="text-base text-amber-700 italic">"{activity.local_guide_tip}"</p>
                              </div>
                               {activity.image_url && (
                                <div className="mt-4 rounded-xl overflow-hidden shadow-md">
                                    <img src={activity.image_url} alt={activity.activity} className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                </div>
                               )}
                               <div className="mt-4 flex items-center gap-4">
                                   <a href={activity.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-sm text-white bg-blue-500 hover:bg-blue-600 font-semibold inline-flex items-center gap-2 py-2 px-3 rounded-lg transition-colors">
                                       <Icon name="map"/> Google Maps
                                   </a>
                                   {activity.booking_link && (
                                        <a href={activity.booking_link} target="_blank" rel="noopener noreferrer" className="text-sm text-white bg-red-500 hover:bg-red-600 font-semibold inline-flex items-center gap-2 py-2 px-3 rounded-lg transition-colors">
                                            <Icon name="restaurant_menu"/> View on Zomato
                                        </a>
                                   )}
                               </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {day.meals && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                             <h5 className="font-bold text-xl text-gray-700 mb-4">Meal Recommendations</h5>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(day.meals).map(([mealType, meal]: [string, any]) => (
                                    <div key={mealType} className="bg-gray-50 rounded-xl p-4 shadow-md">
                                        <p className="font-bold text-gray-800 capitalize">{mealType}</p>
                                        <img src={meal.image_url} alt={meal.dish} className="w-full h-40 object-cover rounded-lg my-2"/>
                                        <p className="text-gray-800 font-semibold text-lg">{meal.dish}</p>
                                        <p className="text-sm text-gray-600">{meal.restaurant}</p>
                                        
                                        {/* Meal Tags */}
                                        {meal.tags && meal.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-1 my-2">
                                            {meal.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                              <TagBadge key={tagIndex} tag={tag} type="food" />
                                            ))}
                                            {meal.tags.length > 3 && (
                                              <span className="text-xs text-gray-500">+{meal.tags.length - 3} more</span>
                                            )}
                                          </div>
                                        )}
                                        
                                        <p className="text-sm text-gray-500 my-2 italic">"{meal.description}"</p>
                                        <a href={meal.zomato_link} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:underline font-semibold inline-flex items-center gap-1">
                                            <Icon name="restaurant_menu"/> View on Zomato
                                        </a>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Hidden Gems Section */}
        {itinerary.hidden_gems && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="diamond" className="text-4xl text-orange-500"/> Hidden Gems</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {itinerary.hidden_gems.map((gem: any, i: number) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <h4 className="font-bold text-xl text-gray-800 mb-2">{gem.name}</h4>
                            <p className="text-gray-700 mb-3">{gem.description}</p>
                            <p className="text-sm text-orange-800 bg-orange-100 p-2 rounded-lg italic"><strong>Why it's special:</strong> {gem.why_special}</p>
                            <a href={gem.search_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-semibold mt-4 inline-flex items-center gap-1">
                                <Icon name="map"/> Find on Map
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Other Sections in a Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Signature Experiences */}
            {itinerary.signature_experiences && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="star" className="text-4xl text-orange-500"/> Signature Experiences</h3>
                <div className="space-y-6">
                {itinerary.signature_experiences.map((exp: any, i: number) => (
                    <div key={i} className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6 border border-orange-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="font-bold text-lg text-gray-900 mb-2">{exp.name}</div>
                    
                    {/* Experience Tags */}
                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {exp.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                          <TagBadge key={tagIndex} tag={tag} type="activity" />
                        ))}
                        {exp.tags.length > 4 && (
                          <span className="text-xs text-gray-500">+{exp.tags.length - 4} more</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-700 text-base mb-3">{exp.description}</p>
                    <div className="text-base text-orange-800 bg-orange-200/50 p-3 rounded-lg italic"><strong>Local's Take:</strong> {exp.why_local_loves_it}</div>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-gray-800 font-semibold text-lg">{exp.estimated_cost}</p>
                        <a href={exp.booking_link} target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                            <Icon name="confirmation_number"/> Book Experience
                        </a>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            )}

            {/* Hyperlocal Food Guide */}
            {itinerary.hyperlocal_food_guide && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="restaurant" className="text-4xl text-orange-500"/> Hyperlocal Food Guide</h3>
                <div className="space-y-6">
                {itinerary.hyperlocal_food_guide.map((food: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="font-bold text-lg text-gray-900 mb-1">{food.dish}</div>
                    
                    {/* Food Tags */}
                    {food.tags && food.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {food.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                          <TagBadge key={tagIndex} tag={tag} type="food" />
                        ))}
                        {food.tags.length > 4 && (
                          <span className="text-xs text-gray-500">+{food.tags.length - 4} more</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-700 text-base mb-2">{food.description}</p>
                    <p className="text-base text-gray-600 mb-3"><strong>Find it at:</strong> {food.where_to_find}</p>
                    <div className="text-base text-green-800 bg-green-100/60 p-3 rounded-lg italic"><strong>Tip:</strong> {food.local_tip}</div>
                    <a href={food.search_link} target="_blank" rel="noopener noreferrer" className="text-sm text-red-600 hover:underline font-semibold mt-4 inline-flex items-center gap-1">
                        <Icon name="restaurant_menu"/> Check on Zomato
                    </a>
                    </div>
                ))}
                </div>
            </section>
            )}

            {/* Shopping Guide */}
            {itinerary.shopping_insider_guide && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="shopping_cart" className="text-4xl text-orange-500"/> Shopping Insider Guide</h3>
                <div className="space-y-6">
                {itinerary.shopping_insider_guide.map((shop: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="font-bold text-lg text-gray-900 mb-1">{shop.item}</div>
                    <p className="text-gray-700 text-base mb-2"><strong>Where to buy:</strong> {shop.where_to_buy}</p>
                    <div className="text-base text-blue-800 bg-blue-100/60 p-3 rounded-lg italic"><strong>Tip:</strong> {shop.local_tip}</div>
                    <a href={shop.search_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-semibold mt-4 inline-flex items-center gap-1">
                        <Icon name="search"/> Search Online
                    </a>
                    </div>
                ))}
                </div>
            </section>
            )}

            {/* Practical Wisdom */}
            {itinerary.practical_local_wisdom && (
            <section>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"><Icon name="lightbulb" className="text-4xl text-orange-500"/> Practical Wisdom</h3>
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-base space-y-4 shadow-lg">
                    {Object.entries(itinerary.practical_local_wisdom).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-start">
                            <strong className="capitalize text-green-900 w-1/3">{key.replace(/_/g, ' ')}:</strong>
                            <span className="text-gray-700 ml-2 w-2/3">{Array.isArray(value) ? value.join(', ') : value}</span>
                        </div>
                    ))}
                </div>
            </section>
            )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-100 font-sans flex flex-col ${showSignInModal || showSubscriptionPopup ? 'overflow-hidden' : ''}`}>
      <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet" />
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur flex items-center justify-between px-6 md:px-12 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <Icon name="travel_explore" className="text-orange-500" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">The Modern <span className="text-orange-500">Chanakya</span></span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { 
            if (isUserLocked()) {
              setShowSubscriptionPopup(true);
              return;
            }
            // Clear localStorage for fresh start
            localStorage.removeItem("currentItinerary");
            localStorage.removeItem("conversationMessages");
            localStorage.removeItem("conversationComplete");
            
            setItinerary(null); 
            setMessages([{ sender: 'system', text: "Namaste! � Main hoon The Modern Chanakya, aapka Indian travel expert! Bharat mein kahan jaana hai? From Kashmir ki valleys to Kanyakumari ke beaches - batao kya explore karna hai! 🇮🇳✨" }]); 
            setConversationComplete(false);
            setCurrentQuestionType("destination");
            setShowOptions(false);
            setShowSignInModal(false);
          }} className={`px-5 py-2 rounded-full font-semibold shadow transition-all text-sm ${
            isUserLocked() 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}>
              {isUserLocked() ? '🔒 Upgrade for New Trips' : 'New Trip'}
          </button>
          
          {isLoggedIn && user ? (
            <>
              {/* User Profile Button */}
              <button 
                onClick={() => router.push("/profile")} 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition-all text-sm"
                title={`Profile: ${user.name}`}
              >
                <Icon name="account_circle" className="text-lg" />
                <span className="hidden md:inline">{user.name}</span>
              </button>
              
              {/* Sign Out Button */}
              <button onClick={() => { 
                localStorage.removeItem("token");
                clearConversationData();
                setUser(null);
                setIsLoggedIn(false);
                setShowSignInModal(true);
              }} className="px-3 py-2 rounded-full bg-gray-500 text-white font-semibold shadow hover:bg-gray-600 transition-all text-xs">
                  Sign Out
              </button>
            </>
          ) : (
            /* Sign In Button for non-logged in users */
            <button onClick={() => setShowSignInModal(true)} className="px-4 py-2 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition-all text-sm">
                Sign In
            </button>
          )}
        </div>
      </nav>

      <div className="flex flex-col md:flex-row w-full flex-1" style={{ height: 'calc(100vh - 81px)' }}>
        {/* Left: Chat Section */}
        <section className={`w-full md:w-2/5 flex flex-col bg-white p-4 md:p-6 border-r border-gray-200 ${showFullItinerary ? 'hidden md:flex' : ''}`}>
          <div className="flex-1 flex flex-col justify-end overflow-y-auto hide-scrollbar">
            <div className="flex flex-col gap-4 mb-4">
              {/* Show welcome message for non-authenticated users */}
              {!isLoggedIn && (
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 rounded-2xl p-6 mb-4">
                  <div className="text-center">
                    <Icon name="travel_explore" className="text-4xl text-orange-500 mb-3" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Namaste! Welcome to The Modern Chanakya!</h3>
                    <p className="text-gray-700 mb-4">
                      Ready to explore Incredible India? Sign in to start creating personalized Indian travel itineraries with our desi AI travel expert - from Kashmir to Kanyakumari!
                    </p>
                    <button 
                      onClick={() => setShowSignInModal(true)}
                      className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all shadow-lg"
                    >
                      🇮🇳 Start Your Bharat Yatra
                    </button>
                  </div>
                </div>
              )}
              
              {/* Show messages only if logged in */}
              {isLoggedIn && messages.map((msg, i) => <ChatBubble key={i} sender={msg.sender}>{msg.text}</ChatBubble>)}
              <div ref={chatEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="mt-auto pt-4">
            {showDatePicker && (
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20 z-30">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2">
                  <DateRange
                    editableDateInputs
                    onChange={handleDateSelect}
                    moveRangeOnFirstSelection={false}
                    ranges={[{ startDate: new Date(), endDate: addDays(new Date(), 6), key: 'selection' }]}
                    minDate={new Date()}
                  />
                </div>
              </div>
            )}
            {!itinerary && !showOptions && !conversationComplete && !isUserLocked() && smartQuickReplies[getCurrentQuestionType()]?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {smartQuickReplies[getCurrentQuestionType()].map((option: string) => (
                  <button 
                    key={option} 
                    type="button" 
                    className={`px-4 py-1 rounded-full border transition text-sm font-semibold ${
                      isLoggedIn && !isUserLocked()
                        ? 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200' 
                        : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    }`} 
                    onClick={() => handleSend(undefined, option)}
                    disabled={!isLoggedIn || isUserLocked()}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="text" 
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:text-gray-400" 
                placeholder={
                  !isLoggedIn 
                    ? "Please sign in to start planning your trip..." 
                    : isUserLocked()
                      ? "🔒 Upgrade kar ke aur Indian adventures explore karo..."
                    : isConversing
                      ? "I'm thinking of the perfect response..."
                    : conversationComplete
                      ? "Ready to generate your itinerary! Hit the button below."
                    : itinerary 
                      ? "Any changes? Type here..." 
                      : "Type your answer..."
                } 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                disabled={isGenerating || !isLoggedIn || isConversing || isUserLocked()} 
              />
              <button 
                type="submit" 
                className={`p-2 rounded-full font-semibold shadow transition-all ${
                  isLoggedIn && !isConversing && !isUserLocked()
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`} 
                disabled={isGenerating || !isLoggedIn || isConversing || isUserLocked()}
              >
                {isConversing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Icon name="send" />
                )}
              </button>
            </form>
             {showOptions && !isUserLocked() && (
                <div className="flex gap-4 mt-4">
                <button 
                  onClick={handleAskMore} 
                  className={`px-5 py-2 rounded-full font-semibold shadow transition-all text-sm ${
                    isLoggedIn 
                      ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isLoggedIn}
                >
                  Ask More
                </button>
                <button 
                  onClick={() => handleGenerate()} 
                  className={`px-5 py-2 rounded-full font-semibold shadow transition-all text-sm ${
                    isLoggedIn 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`} 
                  disabled={isGenerating || !isLoggedIn}
                >
                  {isGenerating ? "Generating..." : "🚀 Generate My Itinerary"}
                </button>
                </div>
            )}

            {conversationComplete && !showOptions && !isUserLocked() && (
              <div className="mt-4">
                <button 
                  onClick={() => handleGenerate()} 
                  className={`w-full px-6 py-3 rounded-full font-bold shadow-lg transition-all text-lg ${
                    isLoggedIn 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`} 
                  disabled={isGenerating || !isLoggedIn}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating your perfect itinerary...
                    </div>
                  ) : (
                    "🎉 Generate My Perfect Itinerary!"
                  )}
                </button>
              </div>
            )}

            {/* Subscription Lock Message */}
            {isUserLocked() && (
              <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-xl font-bold text-orange-800 mb-2">Aapka free Indian itinerary complete ho gaya!</h3>
                <p className="text-gray-700 mb-4">
                  Upgrade to premium to create unlimited personalized Indian travel itineraries with advanced AI features for exploring incredible Bharat.
                </p>
                <button 
                  onClick={() => setShowSubscriptionPopup(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  🇮🇳 Upgrade for More Bharat Adventures
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right: Itinerary Output Section */}
        <section className={`w-full md:w-3/5 flex flex-col ${showFullItinerary ? 'w-full' : ''} h-full`}>
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
                <h2 className="text-xl font-bold text-gray-900">Your Itinerary</h2>
                <button type="button" className="ml-auto px-4 py-1 rounded-full bg-orange-100 text-orange-800 font-semibold hover:bg-orange-200 transition-all text-xs flex items-center gap-1" onClick={() => setShowFullItinerary(v => !v)}>
                  <Icon name={showFullItinerary ? "chat" : "fullscreen"} className="text-sm"/>
                  {showFullItinerary ? "Show Chat" : "Full Page"}
                </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8 hide-scrollbar">
              {renderItinerary()}
            </div>
        </section>
      </div>

      <style jsx global>{`
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .rdrDay.rdrDaySelected, .rdrDay.rdrDayActive { background: #f97316 !important; }
        .rdrDay.rdrDayInRange, .rdrDay.rdrDayInPreview { background: #fed7aa !important; color: #c2410c !important; }
        .rdrDayToday .rdrDayNumber span { border: 1.5px solid #f97316 !important; }
      `}</style>
      {showSignInModal && (
        <SignInModal 
          onClose={() => setShowSignInModal(false)} 
          onSuccess={() => {
            // Start the conversation after successful sign in
            setMessages([{ sender: 'system', text: "Namaste! � Main hoon The Modern Chanakya, aapka Indian travel expert! Bharat mein kahan jaana hai? From Kashmir ki valleys to Kanyakumari ke beaches - batao kya explore karna hai! 🇮🇳✨" }]);
            setConversationComplete(false);
            setCurrentQuestionType("destination");
            setShowOptions(false);
            setItinerary(null);
          }} 
          onUserUpdate={(userData) => {
            setUser(userData);
            setIsLoggedIn(true);
          }}
        />
      )}
      
      {/* Subscription Popup */}
      <SubscriptionPopup 
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
      />
    </div>
  );
}
