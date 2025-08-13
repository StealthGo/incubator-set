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
  Wifi, Utensils, BedDouble, Gem, Bus, Plane, Truck, Globe
} from "lucide-react";
import { buildApiUrl, API_ENDPOINTS, apiRequest } from '@/lib/api';

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
const systemPrompt = `You are "The Modern Chanakya" - a friendly, knowledgeable Indian travel buddy who helps plan amazing trips within India. You chat like a friend on WhatsApp - casual, quick, and fun!

🎯 YOUR MISSION: Get the essentials in 6-7 quick questions, then create an AMAZING itinerary!

CHAT STYLE:
- Keep it SHORT and snappy (like WhatsApp messages)
- Use emojis naturally 🚀✨
- Mix English and Hindi casually ("Kahan jaana hai?", "Sounds amazing yaar!")
- Be enthusiastic but not overwhelming
- Ask ONE simple question at a time

QUICK QUESTION FLOW (Max 6-7 questions):
1. "Hey! Kahan jaana hai? Which part of incredible India?" 🇮🇳
2. "Nice choice! When are you planning to go?" 📅
3. "Cool! Who's coming along on this adventure?" 👥
4. "What about food - vegetarian, non-veg, or no restrictions?" 🍛
5. "What gets you most excited - culture, adventure, nature?" 🎯
6. "What's your vibe - budget travel, comfortable, or luxury?" 💰
7. Optional: "Any special requests or pace preference?" (if needed)

Then: "Perfect! Ready to create your dream itinerary? ✨"

IMPORTANT RULES:
- ONLY India destinations (redirect international requests politely)
- Keep responses under 50 words
- Be conversational, not formal
- After 6 user answers, offer to generate itinerary
- Sound excited but not pushy
- Use Indian context (monsoon, festivals, etc.)

Example responses:
"Goa? Fantastic choice! 🏖️ When are you planning this beach escape?"
"Solo trip? That's so cool! 🎒 What excites you most - beaches, culture, or food tours?"
"Food tours sound amazing! 🍛 Any dietary preferences - vegetarian, non-veg, or special needs?"
"Amazing! I've got all I need. Ready to create your perfect Goa itinerary? 🚀"

Current conversation context will be provided. Respond as the next message in the conversation.`;

// Quick replies for different conversation stages - WhatsApp style, short and sweet
const smartQuickReplies: Record<string, string[]> = {
  destination: ["🏔️ Himachal", "🏖️ Goa", "🕌 Rajasthan", "🌴 Kerala", "🏛️ Agra", "🏝️ Andaman"],
  dates: ["📅 Pick Dates", "🤷‍♀️ I'm Flexible", "🌞 Next Month", "❄️ Winter Trip", "🌸 Summer", "🎯 Festival Time"],
  travelers: ["✈️ Solo", "👫 With Partner", "👨‍👩‍👧‍👦 Family", "🎉 Friends", "💕 Honeymoon", "👥 Big Group"],
  food_preferences: ["🥗 Vegetarian", "🍖 Non-Vegetarian", "🌱 Vegan", "🍽️ Jain Food", "🌍 Everything", "🚫 Allergies"],
  interests: ["🍛 Food", "🏛️ Heritage", "🌿 Nature", "🙏 Spiritual", "🧘‍♀️ Wellness", "🎭 Culture"],
  budget: ["💸 Budget", "💰 Comfortable", "💎 Luxury", "🎯 Best Value", "👨‍👩‍👧‍👦 Family Friendly", "🎓 Student"],
  pace: ["🐌 Relaxed", "⚖️ Balanced", "🏃‍♂️ Adventure", "🧘‍♀️ Peaceful", "📸 Photo Tour", "🎒 Backpacker"]
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

const ChatBubble = ({ sender, children, timestamp }: { sender: string, children: React.ReactNode, timestamp?: string }) => {
  const isUser = sender === 'user';
  
  return (
    <motion.div 
      className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        duration: 0.3 
      }}
    >
      <div className={`
        max-w-[85%] sm:max-w-[75%] px-4 py-3 text-[15px] leading-[1.4] font-normal
        ${isUser 
          ? 'bg-[#005c4b] text-white rounded-[18px] rounded-br-[4px] ml-auto shadow-sm' 
          : 'bg-white text-[#1f2937] rounded-[18px] rounded-bl-[4px] shadow-sm border border-gray-100'
        }
        relative group font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']
      `}>
        <div className="break-words">
          {children}
        </div>
        {timestamp && (
          <div className={`text-[11px] mt-2 ${isUser ? 'text-green-100' : 'text-gray-400'} text-right flex items-center justify-end gap-1`}>
            {timestamp}
            {isUser && (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
              </svg>
            )}
          </div>
        )}
        
        {/* WhatsApp-style tail */}
        <div className={`
          absolute bottom-0 w-0 h-0
          ${isUser 
            ? 'right-[-8px] border-l-[8px] border-l-[#005c4b] border-t-[8px] border-t-transparent' 
            : 'left-[-8px] border-r-[8px] border-r-white border-t-[8px] border-t-transparent'
          }
        `} />
      </div>
    </motion.div>
  );
};

// Enhanced typing indicator with WhatsApp-style animation
const TypingIndicator = () => (
  <motion.div 
    className="flex justify-start w-full mb-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <div className="max-w-[85%] sm:max-w-[70%] bg-white rounded-[18px] rounded-bl-[4px] shadow-sm border border-gray-100 px-4 py-3 relative">
      <div className="flex items-center gap-2">
        <div className="flex space-x-1">
          <motion.div 
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div 
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div 
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <span className="text-[13px] text-gray-500 font-medium font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
          The Modern Chanakya is typing...
        </span>
      </div>
      
      {/* WhatsApp-style tail */}
      <div className="absolute bottom-0 left-[-8px] w-0 h-0 border-r-[8px] border-r-white border-t-[8px] border-t-transparent" />
    </div>
  </motion.div>
);

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
      const res = await apiRequest(API_ENDPOINTS.signin, {
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
        const userRes = await apiRequest(API_ENDPOINTS.me, {
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
      const res = await apiRequest(API_ENDPOINTS.signup, {
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
    { sender: "system", text: "Hey! 👋 Ready to explore incredible India? \n\nKahan jaana hai? Where do you want to go? 🇮🇳✨" },
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
  const [initialPromptProcessed, setInitialPromptProcessed] = useState(false);
  
  // Store conversation state
  const [conversationComplete, setConversationComplete] = useState(false);
  const [currentQuestionType, setCurrentQuestionType] = useState("destination");

  // Helper function to clear conversation data
  const clearConversationData = () => {
    localStorage.removeItem("currentItinerary");
    localStorage.removeItem("conversationMessages");
    localStorage.removeItem("conversationComplete");
    setItinerary(null);
    setMessages([{ sender: 'system', text: "Hey! � Ready to explore incredible India? \n\nKahan jaana hai? Where do you want to go? 🇮🇳✨" }]);
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
          const res = await apiRequest(API_ENDPOINTS.me, {
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
  
  // Process the URL parameters and pendingQuery from localStorage
  useEffect(() => {
    // Only process this once and only after user is confirmed to be logged in
    if (initialPromptProcessed || !isLoggedIn) return;
    
    const processInitialPrompt = async () => {
      try {
        // First check for URL parameters
        let initialPrompt = '';
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          initialPrompt = urlParams.get('prompt') || '';
          
          // If no URL prompt, check localStorage for pendingQuery
          if (!initialPrompt && localStorage.getItem('pendingQuery')) {
            initialPrompt = localStorage.getItem('pendingQuery') || '';
            // Clear pendingQuery after using it
            localStorage.removeItem('pendingQuery');
          }
        }
        
        // If we have an initial prompt, submit it to the chat
        if (initialPrompt && !isConversing) {
          console.log("Processing initial prompt:", initialPrompt);
          // Add user message
          setMessages(current => [...current, { sender: "user", text: initialPrompt }]);
          
          // Use handleSend to process the message properly instead of calling getLLMResponse directly
          await handleSend(undefined, initialPrompt);
        }
        
        // Mark as processed to avoid duplicates
        setInitialPromptProcessed(true);
      } catch (error) {
        console.error("Error processing initial prompt:", error);
        setInitialPromptProcessed(true); // Mark as processed even on error to avoid loops
      }
    };
    
    processInitialPrompt();
  }, [isLoggedIn, initialPromptProcessed, isConversing]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
  const getLLMResponse = async (conversationHistory: Array<{sender: string, text: string}>, retryCount = 0) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowSignInModal(true);
      return;
    }

    setIsConversing(true);
    
    // Add typing indicator immediately (only on first attempt)
    if (retryCount === 0) {
      setMessages((msgs) => [...msgs, { sender: "system", text: "typing..." }]);
    }

    try {
      const response = await apiRequest(API_ENDPOINTS.chatConversation, {
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
        
        // Handle 503 (Service Unavailable) errors separately
        if (response.status === 503) {
          throw new Error("model_overloaded");
        }
        
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Replace typing indicator with actual response
      setMessages((msgs) => {
        const newMsgs = [...msgs];
        // Remove the typing indicator (last message)
        newMsgs.pop();
        // Add the actual response
        newMsgs.push({ sender: "system", text: data.response });
        return newMsgs;
      });
      
      // Small delay to ensure message is rendered before showing quick replies
      setTimeout(() => {
        // Check if conversation is ready for itinerary generation
        if (data.ready_for_itinerary || data.response.toLowerCase().includes("ready to generate") || data.response.toLowerCase().includes("work my magic") || data.response.toLowerCase().includes("create your itinerary")) {
          setConversationComplete(true);
          setShowOptions(true);
        }
      }, 100);

    } catch (error) {
      console.error("Error getting LLM response:", error);
      // Replace typing indicator with error message
      setMessages((msgs) => {
        const newMsgs = [...msgs];
        newMsgs.pop(); // Remove typing indicator
        
        // Custom error message based on error type
        if (error instanceof Error && error.message === "model_overloaded") {
          // If we haven't exceeded retry limit, attempt to retry after a delay
          const MAX_RETRIES = 2;
          if (retryCount < MAX_RETRIES) {
            // Show temporary message about retrying
            newMsgs.push({ 
              sender: "system", 
              text: `The AI is a bit busy right now. Retrying automatically in a few seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})` 
            });
            
            // Set up retry after a delay
            setTimeout(() => {
              // Remove the retry message
              setMessages(msgs => {
                const updatedMsgs = [...msgs];
                updatedMsgs.pop(); // Remove the retry message
                return updatedMsgs;
              });
              
              // Retry the request with incremented retry count
              getLLMResponse(conversationHistory, retryCount + 1);
            }, 5000 + (retryCount * 3000)); // Increasing backoff
            
            return newMsgs;
          } else {
            // We've exceeded retry limit, show final error
            newMsgs.push({ 
              sender: "system", 
              text: "Our AI assistant is currently experiencing high demand. Please try asking your question again in a little while. 🙏" 
            });
          }
        } else {
          newMsgs.push({ 
            sender: "system", 
            text: "Oops! Network issue ho gaya. Try again? 😅" 
          });
        }
        return newMsgs;
      });
    } finally {
      setIsConversing(false);
    }
  };

  // Determine if we should show quick replies - only after AI has asked a question
  const shouldShowQuickReplies = () => {
    if (!isLoggedIn || conversationComplete || isUserLocked() || isConversing) {
      return false;
    }
    
    const systemMessages = messages.filter(msg => msg.sender === "system" && msg.text !== "typing...");
    const userMessages = messages.filter(msg => msg.sender === "user");
    
    // Show quick replies only if:
    // 1. AI has sent at least one message (excluding typing indicator)
    // 2. AI has responded more recently than user (AI's turn is complete)
    // 3. We're not at the very start (first message is just greeting)
    
    if (systemMessages.length === 1 && userMessages.length === 0) {
      // This is just the initial greeting, show destination options
      return true;
    }
    
    // Show replies if AI has responded to the user's last message
    // (system messages should be greater than or equal to user messages)
    return systemMessages.length > userMessages.length || systemMessages.length === userMessages.length;
  };

  // Determine current question type for quick replies based on conversation flow
  const getCurrentQuestionType = () => {
    const userMessages = messages.filter(msg => msg.sender === "user");
    const conversationStep = userMessages.length;
    
    // Follow the sequence: destination → dates → travelers → interests → food_preferences → budget → pace
    switch (conversationStep) {
      case 0: return "destination";        // First question about destination
      case 1: return "dates";             // Second question about dates
      case 2: return "travelers";         // Third question about travelers
      case 3: return "interests";         // Fourth question about interests
      case 4: return "food_preferences";  // Fifth question about food preferences
      case 5: return "budget";            // Sixth question about budget
      case 6: return "pace";              // Seventh question about pace
      default: return "destination";      // Default fallback
    }
  };

  const handleGenerate = async (followUpPrompt?: string, retryCount = 0) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    // Check if token exists and is not empty
    if (!token || token.trim() === "") {
      console.log("No valid token found, showing sign-in modal");
      setShowSignInModal(true);
      return;
    }

    setIsGenerating(true);
    setShowOptions(false);

    // Only show generating message on first attempt
    if (retryCount === 0) {
      const generatingMessage = followUpPrompt 
          ? "Updating your itinerary based on your request..."
          : "Creating your hyper-detailed travel itinerary with local insights...";
      setMessages((msgs) => [...msgs, { sender: "llm", text: generatingMessage }]);
    }

    const requestBody = {
      messages: followUpPrompt ? [...messages, { sender: 'user', text: followUpPrompt }] : messages,
      current_itinerary: itinerary
    };

    try {
      const res = await apiRequest(API_ENDPOINTS.generateItinerary, {
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
        if (res.status === 503) {
          // Service unavailable / model overloaded
          const MAX_RETRIES = 2;
          if (retryCount < MAX_RETRIES) {
            // Update the generating message to show retry status
            setMessages((msgs) => {
              const newMsgs = [...msgs];
              // Replace the last message with a retry message
              newMsgs[newMsgs.length - 1] = { 
                sender: "llm", 
                text: `Our servers are experiencing high demand. Retrying automatically in a moment... (Attempt ${retryCount + 1}/${MAX_RETRIES})` 
              };
              return newMsgs;
            });
            
            // Retry after a delay with exponential backoff
            setTimeout(() => {
              handleGenerate(followUpPrompt, retryCount + 1);
            }, 5000 + (retryCount * 3000));
            
            return;
          } else {
            // Max retries exceeded
            setMessages((msgs) => [
              ...msgs,
              { sender: "llm", text: "I'm sorry, our servers are currently overloaded. Please try generating your itinerary again in a few minutes." },
            ]);
            setIsGenerating(false);
            return;
          }
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
      console.error("Error generating itinerary:", err);
      
      // Check for model overload errors in the error message
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      const isModelOverloaded = 
        errorMessage.includes('overloaded') || 
        errorMessage.includes('503') || 
        errorMessage.includes('unavailable');
      
      // Handle model overload errors with retry logic
      if (isModelOverloaded && retryCount < 2) {
        // Update the generating message to show retry status
        setMessages((msgs) => {
          const newMsgs = [...msgs];
          // Replace the last message with a retry message
          newMsgs[newMsgs.length - 1] = { 
            sender: "llm", 
            text: `Our AI is a bit busy right now. Retrying automatically in a moment... (Attempt ${retryCount + 1}/2)` 
          };
          return newMsgs;
        });
        
        // Retry after a delay
        setTimeout(() => {
          handleGenerate(followUpPrompt, retryCount + 1);
        }, 5000 + (retryCount * 3000));
        
        return;
      }
      
      // If not a model overload error or max retries exceeded, show error message
      setMessages((msgs) => {
        const newMsgs = [...msgs];
        // If the last message is a "generating" message, replace it
        const lastMessage = newMsgs.length > 0 ? newMsgs[newMsgs.length - 1] : null;
        if (lastMessage && 
            lastMessage.sender === "llm" && 
            (lastMessage.text.includes("Creating") || 
             lastMessage.text.includes("Updating") ||
             lastMessage.text.includes("Retrying"))) {
          newMsgs.pop();
        }
        
        // Add appropriate error message based on the error type
        if (isModelOverloaded) {
          newMsgs.push({ 
            sender: "llm", 
            text: "I'm sorry, our servers are currently very busy. Please try again in a few minutes." 
          });
        } else {
          newMsgs.push({ 
            sender: "llm", 
            text: "Sorry, there was an error creating your itinerary. Please try again." 
          });
        }
        return newMsgs;
      });
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
        transition={{ duration: 0.5 }}
        className="space-y-8 p-3 md:p-4"
      >
        {/* Enhanced Hero Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden shadow-lg h-80 group"
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
                className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-2xl font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {itinerary.personalized_title || `Your Trip to ${itinerary.destination_name}`}
              </motion.h2>
              
              <motion.div 
                className="flex flex-wrap gap-2 mt-4"
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
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm px-3 py-2 rounded-full flex items-center gap-2 shadow-lg font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
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
                  className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Bus className="text-sm text-white" />
                  </div>
                  {itinerary.journey_details.title}
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {itinerary.journey_details.options.map((opt: any, i: number) => (
                        <motion.div 
                          key={i} 
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group overflow-hidden relative"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.01 }}
                        >
                          {/* Background gradient on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                                  {opt.icon === 'flight' && <Plane className="text-sm text-white" />}
                                  {opt.icon === 'train' && <Bus className="text-sm text-white" />}
                                  {opt.icon === 'bus' && <Truck className="text-sm text-white" />}
                                  {opt.icon === 'car' && <Navigation className="text-sm text-white" />}
                                </div>
                                <h4 className="font-semibold text-base text-gray-800 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{opt.mode}</h4>
                            </div>
                            <p className="text-gray-700 mb-3 text-[15px] leading-relaxed font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{opt.description}</p>
                            <p className="text-sm text-gray-600 mb-4 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                              <Clock className="w-4 h-4 text-orange-500" />
                              <strong>Duration:</strong> {opt.duration}
                            </p>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-800 font-semibold text-base flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                                  <DollarSign className="w-4 h-4 text-green-500" />
                                  {opt.estimated_cost}
                                </p>
                                <Button variant="primary" size="sm" asChild>
                                  <a href={opt.booking_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm">
                                      <ExternalLink className="w-3 h-3" /> Book Now
                                  </a>
                                </Button>
                            </div>
                          </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        )}
        
        {/* Enhanced Accommodation Suggestions */}
        {itinerary.accommodation_suggestions && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
                <motion.h3 
                  className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <BedDouble className="text-sm text-white" />
                  </div>
                  Accommodation Options
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {itinerary.accommodation_suggestions.map((opt: any, i: number) => (
                        <motion.div 
                          key={i} 
                          className="bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.01 }}
                        >
                            <div className="relative overflow-hidden">
                              <motion.img 
                                src={opt.image_url} 
                                alt={opt.name} 
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                initial={{ scale: 1.1 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                      <BedDouble className="text-sm text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-base text-gray-800 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{opt.name}</h4>
                                        <p className="text-sm text-gray-500 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{opt.type}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4 text-[15px] leading-relaxed font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{opt.description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-800 font-semibold text-base flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                                      <DollarSign className="w-4 h-4 text-green-500" />
                                      {opt.estimated_cost}
                                    </p>
                                    <Button variant="primary" size="sm" asChild>
                                      <a href={opt.booking_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm">
                                          <BedDouble className="w-3 h-3" /> Book on MMT
                                      </a>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        )}

        {/* Enhanced Trip Overview */}
        {itinerary.trip_overview && (
          <motion.section 
            className="relative rounded-3xl p-8 shadow-2xl border border-orange-200 overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-100/30 to-transparent" />
            
            {/* Floating background elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 bg-orange-200/20 rounded-full"
                  style={{
                    left: `${20 + i * 25}%`,
                    top: `${10 + (i % 2) * 70}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <motion.h3 
                className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-3 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                Trip Overview
              </motion.h3>
              <motion.p 
                className="text-gray-700 mb-6 text-[15px] leading-relaxed font-medium font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {itinerary.trip_overview.destination_insights}
              </motion.p>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[15px]"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {[
                  { icon: Mountain, label: "Weather", value: itinerary.trip_overview.weather_during_visit },
                  { icon: Calendar, label: "Season", value: itinerary.trip_overview.seasonal_context },
                  { icon: Heart, label: "Culture", value: itinerary.trip_overview.cultural_context },
                  { icon: Users, label: "Customs", value: Array.isArray(itinerary.trip_overview.local_customs_to_know) ? itinerary.trip_overview.local_customs_to_know.join(', ') : 'N/A' }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:bg-white/80 transition-all duration-300"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <strong className="text-gray-800 text-[15px] font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{item.label}:</strong>
                    </div>
                    <p className="text-gray-700 ml-14 text-[15px] font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{item.value}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div 
                className="text-orange-900 font-bold mt-6 text-[15px] text-right flex items-center justify-end gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <DollarSign className="w-4 h-4 text-green-600" />
                Estimated Cost: {itinerary.trip_overview.estimated_total_cost}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Enhanced Daily Itinerary */}
        {itinerary.daily_itinerary && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              Daily Itinerary
            </motion.h3>
            <div className="space-y-12">
              {itinerary.daily_itinerary.map((day: any, idx: number) => (
                <motion.div 
                  key={idx} 
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-6 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-black/10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                      }} />
                    </div>
                    
                    <div className="relative z-10">
                      <h4 className="font-bold text-[15px] mb-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{`Day ${idx + 1}: ${day.date}`}</h4>
                      <p className="text-[15px] opacity-90 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{day.theme}</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {/* Breakfast */}
                    {day.breakfast && (
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <h5 className="font-bold text-[15px] text-gray-700 mb-3 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                          <Utensils className="w-4 h-4 text-orange-500" />
                          Breakfast ({day.breakfast.time})
                        </h5>
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-yellow-200">
                          <div className="flex items-start gap-6">
                            {day.breakfast.image_url && (
                              <motion.img 
                                src={day.breakfast.image_url} 
                                alt={day.breakfast.dish} 
                                className="w-32 h-32 object-cover rounded-2xl shadow-md flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                            <div className="flex-1">
                              <h6 className="font-bold text-[15px] text-gray-800 mb-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{day.breakfast.dish}</h6>
                              <p className="text-[15px] text-gray-600 mb-2 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                {day.breakfast.restaurant} - {day.breakfast.location}
                              </p>
                              
                              {/* Breakfast Tags */}
                              {day.breakfast.tags && day.breakfast.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {day.breakfast.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                    <TagBadge key={tagIndex} tag={tag} type="food" />
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-gray-700 mb-3 text-[15px] leading-relaxed font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{day.breakfast.description}</p>
                              <p className="text-green-600 font-bold text-[15px] mb-3 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{day.breakfast.estimated_cost}</p>
                              
                              {day.breakfast.insider_tip && (
                                <motion.div 
                                  className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border-l-4 border-amber-400 mb-4"
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="font-bold text-[15px] text-amber-800 mb-2 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                                    <Star className="w-4 h-4" />
                                    Insider Tip:
                                  </p>
                                  <p className="text-[15px] text-amber-700 italic font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">"{day.breakfast.insider_tip}"</p>
                                </motion.div>
                              )}
                              
                              <div className="flex gap-3">
                                {day.breakfast.google_maps_link && (
                                  <Button variant="primary" size="default" asChild>
                                    <a href={day.breakfast.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" /> Google Maps
                                    </a>
                                  </Button>
                                )}
                                {day.breakfast.zomato_link && (
                                  <Button variant="outline" size="default" asChild>
                                    <a href={day.breakfast.zomato_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <Utensils className="w-4 h-4" /> Zomato
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Morning Activities */}
                    {day.morning_activities && day.morning_activities.length > 0 && (
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <h5 className="font-bold text-[15px] text-gray-700 mb-4 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                          <Camera className="w-4 h-4 text-orange-500" />
                          Morning Activities
                        </h5>
                        <div className="space-y-8">
                          {day.morning_activities.map((activity: any, actIdx: number) => (
                            <motion.div 
                              key={actIdx} 
                              className="flex gap-6 items-start group"
                              initial={{ opacity: 0, x: -30 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: actIdx * 0.1, duration: 0.5 }}
                              viewport={{ once: true }}
                            >
                              <div className="flex flex-col items-center flex-shrink-0">
                                  <motion.div 
                                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl h-12 w-12 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                  >
                                      <MapPin className="w-4 h-4" />
                                  </motion.div>
                                  {actIdx < day.morning_activities.length - 1 && (
                                    <div className="w-1 h-20 bg-gradient-to-b from-orange-300 to-red-300 mt-4 rounded-full" />
                                  )}
                              </div>
                              <div className="w-full bg-gray-50 rounded-2xl p-6 group-hover:bg-gray-100 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                  <Clock className="w-4 h-4 text-orange-500" />
                                  <p className="text-[15px] font-bold text-orange-600 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{activity.time}</p>
                                </div>
                                <p className="font-bold text-[15px] text-gray-800 mb-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{activity.activity}</p>
                                <div className="text-[15px] text-gray-600 flex items-center gap-2 mb-4 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                                  <MapPin className="w-4 h-4 text-blue-500" />
                                  {activity.location}
                                </div>
                                
                                {/* Activity Tags */}
                                {activity.tags && activity.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 my-4">
                                    {activity.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                      <TagBadge key={tagIndex} tag={tag} type="activity" />
                                    ))}
                                    {activity.tags.length > 3 && (
                                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">+{activity.tags.length - 3} more</span>
                                    )}
                                  </div>
                                )}
                                
                                <p className="text-gray-700 my-4 text-lg leading-relaxed">{activity.description}</p>
                                
                                <motion.div 
                                  className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border-l-4 border-amber-400"
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="font-bold text-base text-amber-800 mb-2 flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Local Guide Tip:
                                  </p>
                                  <p className="text-lg text-amber-700 italic">"{activity.local_guide_tip}"</p>
                                </motion.div>
                                
                                 {activity.image_url && (
                                  <motion.div 
                                    className="mt-6 rounded-2xl overflow-hidden shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                      <img 
                                        src={activity.image_url} 
                                        alt={activity.activity} 
                                        className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110" 
                                        onError={(e) => (e.currentTarget.style.display = 'none')} 
                                      />
                                  </motion.div>
                                 )}
                                 
                                 <div className="mt-6 flex items-center gap-4 flex-wrap">
                                     <Button variant="primary" size="default" asChild>
                                       <a href={activity.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                           <MapPin className="w-4 h-4" /> Google Maps
                                       </a>
                                     </Button>
                                     {activity.booking_link && (
                                          <Button variant="outline" size="default" asChild>
                                            <a href={activity.booking_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                {activity.booking_link.includes('zomato') && <Utensils className="w-4 h-4" />}
                                                {activity.booking_link.includes('asi') && <Globe className="w-4 h-4" />}
                                                {activity.booking_link.includes('tourism') && <Globe className="w-4 h-4" />}
                                                {activity.booking_link.includes('makemytrip') && <ExternalLink className="w-4 h-4" />}
                                                {!activity.booking_link.includes('zomato') && !activity.booking_link.includes('asi') && !activity.booking_link.includes('tourism') && !activity.booking_link.includes('makemytrip') && <ExternalLink className="w-4 h-4" />}
                                                {activity.booking_link.includes('zomato') ? 'View on Zomato' : 
                                                 activity.booking_link.includes('asi') ? 'Book on ASI' :
                                                 activity.booking_link.includes('tourism') ? 'Official Booking' :
                                                 activity.booking_link.includes('makemytrip') ? 'Book on MMT' :
                                                 'Book Tickets'}
                                            </a>
                                          </Button>
                                     )}
                                     {activity.official_website && activity.official_website !== activity.booking_link && (
                                          <Button variant="outline" size="default" asChild>
                                            <a href={activity.official_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                <Globe className="w-4 h-4" /> Official Site
                                            </a>
                                          </Button>
                                     )}
                                     {activity.booking_priority && (
                                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            activity.booking_priority === 'Required' ? 'bg-red-100 text-red-800' :
                                            activity.booking_priority === 'Recommended' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-600'
                                          }`}>
                                            {activity.booking_priority === 'Required' ? '🎫 Booking Required' :
                                             activity.booking_priority === 'Recommended' ? '📝 Booking Recommended' :
                                             '🚶 Walk-in Welcome'}
                                          </span>
                                     )}
                                 </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Lunch */}
                    {day.lunch && (
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <h5 className="font-bold text-[15px] text-gray-700 mb-3 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                          <Utensils className="w-4 h-4 text-orange-500" />
                          Lunch ({day.lunch.time})
                        </h5>
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-green-200">
                          <div className="flex items-start gap-6">
                            {day.lunch.image_url && (
                              <motion.img 
                                src={day.lunch.image_url} 
                                alt={day.lunch.dish} 
                                className="w-32 h-32 object-cover rounded-2xl shadow-md flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                            <div className="flex-1">
                              <h6 className="font-bold text-[15px] text-gray-800 mb-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{day.lunch.dish}</h6>
                              <p className="text-[15px] text-gray-600 mb-2 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                {day.lunch.restaurant} - {day.lunch.location}
                              </p>
                              
                              {/* Lunch Tags */}
                              {day.lunch.tags && day.lunch.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {day.lunch.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                    <TagBadge key={tagIndex} tag={tag} type="food" />
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-gray-700 mb-3 text-[15px] leading-relaxed font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{day.lunch.description}</p>
                              <p className="text-green-600 font-bold text-[15px] mb-3 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{day.lunch.estimated_cost}</p>
                              
                              {day.lunch.insider_tip && (
                                <motion.div 
                                  className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border-l-4 border-amber-400 mb-4"
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="font-bold text-base text-amber-800 mb-2 flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Insider Tip:
                                  </p>
                                  <p className="text-lg text-amber-700 italic">"{day.lunch.insider_tip}"</p>
                                </motion.div>
                              )}
                              
                              <div className="flex gap-3">
                                {day.lunch.google_maps_link && (
                                  <Button variant="primary" size="default" asChild>
                                    <a href={day.lunch.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" /> Google Maps
                                    </a>
                                  </Button>
                                )}
                                {day.lunch.zomato_link && (
                                  <Button variant="outline" size="default" asChild>
                                    <a href={day.lunch.zomato_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <Utensils className="w-4 h-4" /> Zomato
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Afternoon Activities */}
                    {day.afternoon_activities && day.afternoon_activities.length > 0 && (
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <h5 className="font-bold text-2xl text-gray-700 mb-6 flex items-center gap-3">
                          <Camera className="w-7 h-7 text-orange-500" />
                          Afternoon Activities
                        </h5>
                        <div className="space-y-8">
                          {day.afternoon_activities.map((activity: any, actIdx: number) => (
                            <motion.div 
                              key={actIdx} 
                              className="flex gap-6 items-start group"
                              initial={{ opacity: 0, x: -30 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: actIdx * 0.1, duration: 0.5 }}
                              viewport={{ once: true }}
                            >
                              <div className="flex flex-col items-center flex-shrink-0">
                                  <motion.div 
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl h-16 w-16 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                  >
                                      <MapPin className="w-7 h-7" />
                                  </motion.div>
                                  {actIdx < day.afternoon_activities.length - 1 && (
                                    <div className="w-1 h-20 bg-gradient-to-b from-purple-300 to-pink-300 mt-4 rounded-full" />
                                  )}
                              </div>
                              <div className="w-full bg-gray-50 rounded-2xl p-6 group-hover:bg-gray-100 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                  <Clock className="w-5 h-5 text-purple-500" />
                                  <p className="text-base font-bold text-purple-600">{activity.time}</p>
                                </div>
                                <p className="font-bold text-2xl text-gray-800 mb-2">{activity.activity}</p>
                                <div className="text-lg text-gray-600 flex items-center gap-2 mb-4">
                                  <MapPin className="w-5 h-5 text-blue-500" />
                                  {activity.location}
                                </div>
                                
                                {/* Activity Tags */}
                                {activity.tags && activity.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 my-4">
                                    {activity.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                      <TagBadge key={tagIndex} tag={tag} type="activity" />
                                    ))}
                                    {activity.tags.length > 3 && (
                                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">+{activity.tags.length - 3} more</span>
                                    )}
                                  </div>
                                )}
                                
                                <p className="text-gray-700 my-4 text-lg leading-relaxed">{activity.description}</p>
                                
                                <motion.div 
                                  className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border-l-4 border-amber-400"
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="font-bold text-base text-amber-800 mb-2 flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Local Guide Tip:
                                  </p>
                                  <p className="text-lg text-amber-700 italic">"{activity.local_guide_tip}"</p>
                                </motion.div>
                                
                                 {activity.image_url && (
                                  <motion.div 
                                    className="mt-6 rounded-2xl overflow-hidden shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                      <img 
                                        src={activity.image_url} 
                                        alt={activity.activity} 
                                        className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110" 
                                        onError={(e) => (e.currentTarget.style.display = 'none')} 
                                      />
                                  </motion.div>
                                 )}
                                 
                                 <div className="mt-6 flex items-center gap-4 flex-wrap">
                                     <Button variant="primary" size="default" asChild>
                                       <a href={activity.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                           <MapPin className="w-4 h-4" /> Google Maps
                                       </a>
                                     </Button>
                                     {activity.booking_link && (
                                          <Button variant="outline" size="default" asChild>
                                            <a href={activity.booking_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                {activity.booking_link.includes('zomato') && <Utensils className="w-4 h-4" />}
                                                {activity.booking_link.includes('asi') && <Globe className="w-4 h-4" />}
                                                {activity.booking_link.includes('tourism') && <Globe className="w-4 h-4" />}
                                                {activity.booking_link.includes('makemytrip') && <ExternalLink className="w-4 h-4" />}
                                                {!activity.booking_link.includes('zomato') && !activity.booking_link.includes('asi') && !activity.booking_link.includes('tourism') && !activity.booking_link.includes('makemytrip') && <ExternalLink className="w-4 h-4" />}
                                                {activity.booking_link.includes('zomato') ? 'View on Zomato' : 
                                                 activity.booking_link.includes('asi') ? 'Book on ASI' :
                                                 activity.booking_link.includes('tourism') ? 'Official Booking' :
                                                 activity.booking_link.includes('makemytrip') ? 'Book on MMT' :
                                                 'Book Tickets'}
                                            </a>
                                          </Button>
                                     )}
                                     {activity.official_website && activity.official_website !== activity.booking_link && (
                                          <Button variant="outline" size="default" asChild>
                                            <a href={activity.official_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                <Globe className="w-4 h-4" /> Official Site
                                            </a>
                                          </Button>
                                     )}
                                     {activity.booking_priority && (
                                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            activity.booking_priority === 'Required' ? 'bg-red-100 text-red-800' :
                                            activity.booking_priority === 'Recommended' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-600'
                                          }`}>
                                            {activity.booking_priority === 'Required' ? '🎫 Booking Required' :
                                             activity.booking_priority === 'Recommended' ? '📝 Booking Recommended' :
                                             '🚶 Walk-in Welcome'}
                                          </span>
                                     )}
                                 </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Evening Snacks */}
                    {day.evening_snacks && (
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <h5 className="font-bold text-2xl text-gray-700 mb-4 flex items-center gap-3">
                          <Utensils className="w-7 h-7 text-orange-500" />
                          Evening Snacks ({day.evening_snacks.time})
                        </h5>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-200">
                          <div className="flex items-start gap-6">
                            {day.evening_snacks.image_url && (
                              <motion.img 
                                src={day.evening_snacks.image_url} 
                                alt={day.evening_snacks.dish} 
                                className="w-32 h-32 object-cover rounded-2xl shadow-md flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                            <div className="flex-1">
                              <h6 className="font-bold text-2xl text-gray-800 mb-2">{day.evening_snacks.dish}</h6>
                              <p className="text-lg text-gray-600 mb-2 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                {day.evening_snacks.place} - {day.evening_snacks.location}
                              </p>
                              
                              {/* Snacks Tags */}
                              {day.evening_snacks.tags && day.evening_snacks.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {day.evening_snacks.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                    <TagBadge key={tagIndex} tag={tag} type="food" />
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-gray-700 mb-3 text-lg leading-relaxed">{day.evening_snacks.description}</p>
                              <p className="text-green-600 font-bold text-xl mb-3">{day.evening_snacks.estimated_cost}</p>
                              
                              {day.evening_snacks.local_experience && (
                                <motion.div 
                                  className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border-l-4 border-amber-400 mb-4"
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="font-bold text-base text-amber-800 mb-2 flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Local Experience:
                                  </p>
                                  <p className="text-lg text-amber-700 italic">"{day.evening_snacks.local_experience}"</p>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Dinner */}
                    {day.dinner && (
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <h5 className="font-bold text-2xl text-gray-700 mb-4 flex items-center gap-3">
                          <Utensils className="w-7 h-7 text-orange-500" />
                          Dinner ({day.dinner.time})
                        </h5>
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-red-200">
                          <div className="flex items-start gap-6">
                            {day.dinner.image_url && (
                              <motion.img 
                                src={day.dinner.image_url} 
                                alt={day.dinner.dish} 
                                className="w-32 h-32 object-cover rounded-2xl shadow-md flex-shrink-0"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                            <div className="flex-1">
                              <h6 className="font-bold text-2xl text-gray-800 mb-2">{day.dinner.dish}</h6>
                              <p className="text-lg text-gray-600 mb-2 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                {day.dinner.restaurant} - {day.dinner.location}
                              </p>
                              
                              {/* Dinner Tags */}
                              {day.dinner.tags && day.dinner.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {day.dinner.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                    <TagBadge key={tagIndex} tag={tag} type="food" />
                                  ))}
                                </div>
                              )}
                              
                              <p className="text-gray-700 mb-3 text-lg leading-relaxed">{day.dinner.description}</p>
                              <p className="text-green-600 font-bold text-xl mb-3">{day.dinner.estimated_cost}</p>
                              
                              {day.dinner.ambiance && (
                                <p className="text-gray-600 mb-3 text-lg italic">Ambiance: {day.dinner.ambiance}</p>
                              )}
                              
                              {day.dinner.insider_tip && (
                                <motion.div 
                                  className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-2xl border-l-4 border-amber-400 mb-4"
                                  whileHover={{ x: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="font-bold text-base text-amber-800 mb-2 flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    Insider Tip:
                                  </p>
                                  <p className="text-lg text-amber-700 italic">"{day.dinner.insider_tip}"</p>
                                </motion.div>
                              )}
                              
                              <div className="flex gap-3">
                                {day.dinner.google_maps_link && (
                                  <Button variant="primary" size="default" asChild>
                                    <a href={day.dinner.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" /> Google Maps
                                    </a>
                                  </Button>
                                )}
                                {day.dinner.zomato_link && (
                                  <Button variant="outline" size="default" asChild>
                                    <a href={day.dinner.zomato_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <Utensils className="w-4 h-4" /> Zomato
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Day End Summary */}
                    {day.day_end_summary && (
                      <motion.div 
                        className="mt-8 pt-8 border-t border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <h5 className="font-bold text-2xl text-gray-700 mb-6 flex items-center gap-3">
                          <Star className="w-7 h-7 text-orange-500" />
                          Day Summary
                        </h5>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h6 className="font-bold text-lg text-gray-800 mb-3">Key Experiences</h6>
                              <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {day.day_end_summary.key_experiences?.map((exp: string, idx: number) => (
                                  <li key={idx}>{exp}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-bold text-lg text-gray-800 mb-3">Photo Opportunities</h6>
                              <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {day.day_end_summary.photos_to_take?.map((photo: string, idx: number) => (
                                  <li key={idx}>{photo}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="md:col-span-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h6 className="font-bold text-lg text-gray-800">Total Cost</h6>
                                  <p className="text-2xl font-bold text-green-600">{day.day_end_summary.total_estimated_cost}</p>
                                </div>
                                <div className="text-right">
                                  <h6 className="font-bold text-lg text-gray-800">Energy Level</h6>
                                  <p className="text-lg text-gray-600">{day.day_end_summary.energy_level}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        
        {/* Enhanced Hidden Gems Section */}
        {itinerary.hidden_gems && (
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
                <motion.h3 
                  className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Gem className="w-4 h-4 text-white" />
                  </div>
                  Hidden Gems
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {itinerary.hidden_gems.map((gem: any, i: number) => (
                        <motion.div 
                          key={i} 
                          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group relative overflow-hidden"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {/* Background gradient on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <Gem className="w-6 h-6 text-white" />
                              </div>
                              <h4 className="font-bold text-[15px] text-gray-800 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{gem.name}</h4>
                            </div>
                            <p className="text-gray-700 mb-4 text-[15px] leading-relaxed font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{gem.description}</p>
                            <motion.div 
                              className="text-lg text-purple-800 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl italic border-l-4 border-purple-400 mb-6"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <strong className="flex items-center gap-2 mb-2">
                                <Star className="w-5 h-5" />
                                Why it's special:
                              </strong> 
                              {gem.why_special}
                            </motion.div>
                            <Button variant="outline" size="default" asChild>
                              <a href={gem.search_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" /> Find on Map
                              </a>
                            </Button>
                          </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        )}

        {/* Other Sections in a Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Signature Experiences */}
            {itinerary.signature_experiences && (
            <section>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"><Icon name="star" className="w-4 h-4 text-orange-500"/> Signature Experiences</h3>
                <div className="space-y-6">
                {itinerary.signature_experiences.map((exp: any, i: number) => (
                    <div key={i} className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6 border border-orange-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="font-bold text-[15px] text-gray-900 mb-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{exp.name}</div>
                    
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
                    
                    <p className="text-gray-700 text-[15px] mb-3 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{exp.description}</p>
                    <div className="text-[15px] text-orange-800 bg-orange-200/50 p-3 rounded-lg italic font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"><strong>Local's Take:</strong> {exp.why_local_loves_it}</div>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-gray-800 font-semibold text-[15px] font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{exp.estimated_cost}</p>
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"><Icon name="restaurant" className="w-4 h-4 text-orange-500"/> Hyperlocal Food Guide</h3>
                <div className="space-y-6">
                {itinerary.hyperlocal_food_guide.map((food: any, i: number) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="font-bold text-[15px] text-gray-900 mb-1 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{food.dish}</div>
                    
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"><Icon name="shopping_cart" className="w-4 h-4 text-orange-500"/> Shopping Insider Guide</h3>
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
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']"><Icon name="lightbulb" className="w-4 h-4 text-orange-500"/> Practical Wisdom</h3>
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
      <nav className="sticky top-0 z-20 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#128c7e] to-[#075e54] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-gray-900 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">The Modern Chanakya</span>
              <span className="text-xs text-gray-500 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">Your Indian Travel Expert</span>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-3">
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
            setMessages([{ sender: 'system', text: "Hey! 👋 Ready to explore incredible India? \n\nKahan jaana hai? Where do you want to go? 🇮🇳✨" }]); 
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
        {/* Left: Chat Section - WhatsApp Style */}
        <section className={`w-full md:w-2/5 flex flex-col bg-[#efeae2] ${showFullItinerary ? 'hidden md:flex' : ''}`}>
          {/* Chat Header */}
          <div className="bg-[#128c7e] text-white px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[16px] font-['Inter','sans-serif']">The Modern Chanakya</h3>
              <p className="text-[13px] text-green-100 font-['Inter','sans-serif']">
                {isConversing ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></span>
                    typing...
                  </span>
                ) : 'Your Indian Travel Expert'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto px-3 py-2 bg-[#e5ddd5] bg-opacity-30" style={{ 
            backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"1\" fill=\"%23f0f0f0\" opacity=\"0.3\"/><circle cx=\"80\" cy=\"80\" r=\"1\" fill=\"%23f0f0f0\" opacity=\"0.3\"/><circle cx=\"40\" cy=\"60\" r=\"1\" fill=\"%23f0f0f0\" opacity=\"0.3\"/><circle cx=\"60\" cy=\"40\" r=\"1\" fill=\"%23f0f0f0\" opacity=\"0.3\"/></svg>')",
            backgroundSize: '60px 60px'
          }}>
            {/* Welcome message for non-authenticated users */}
            {!isLoggedIn && (
              <div className="flex justify-center items-center h-full">
                <motion.div 
                  className="bg-white rounded-2xl p-6 shadow-lg max-w-sm text-center mx-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-4xl mb-3">🇮🇳</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Welcome to The Modern Chanakya!</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Sign in to start planning your incredible India journey!
                  </p>
                  <button 
                    onClick={() => setShowSignInModal(true)}
                    className="px-6 py-2 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors text-sm"
                  >
                    Start Planning
                  </button>
                </motion.div>
              </div>
            )}
            
            {/* Chat Messages */}
            {isLoggedIn && (
              <div className="space-y-1 py-2">
                {messages.map((msg, i) => 
                  msg.text === "typing..." ? (
                    <TypingIndicator key={i} />
                  ) : (
                    <ChatBubble 
                      key={i} 
                      sender={msg.sender}
                      timestamp={i === messages.length - 1 ? new Date().toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      }) : undefined}
                    >
                      {msg.text}
                    </ChatBubble>
                  )
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>
          
          {/* Input Area - WhatsApp Style */}
          {isLoggedIn && (
            <div className="bg-[#f0f0f0] px-4 py-3 border-t border-gray-200">
              {/* Quick Replies */}
              {/* @ts-ignore - We know getCurrentQuestionType returns a valid key */}
              {!itinerary && shouldShowQuickReplies() && smartQuickReplies[getCurrentQuestionType()]?.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-2 mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {smartQuickReplies[getCurrentQuestionType()]?.map((option: string) => (
                    <motion.button 
                      key={option} 
                      type="button" 
                      className="px-4 py-2 rounded-full border border-[#128c7e] bg-white text-[#128c7e] text-[15px] font-medium hover:bg-[#f0f9ff] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif'] shadow-sm hover:shadow-md"
                      onClick={() => handleSend(undefined, option)}
                      disabled={isConversing || isUserLocked()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: Math.random() * 0.1 }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Date Picker Modal */}
              {showDatePicker && (
                <motion.div 
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="bg-white rounded-2xl shadow-2xl p-4 m-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <DateRange
                      editableDateInputs
                      onChange={handleDateSelect}
                      moveRangeOnFirstSelection={false}
                      ranges={[{ startDate: new Date(), endDate: addDays(new Date(), 6), key: 'selection' }]}
                      minDate={new Date()}
                    />
                    <button 
                      onClick={() => setShowDatePicker(false)}
                      className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Input Box */}
              <form onSubmit={handleSend} className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white rounded-[25px] border border-gray-200 focus:outline-none focus:ring-0 focus:border-[#128c7e] text-[15px] placeholder-gray-500 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif'] shadow-sm transition-all duration-200"
                    placeholder={
                      isUserLocked()
                        ? "🔒 Upgrade for unlimited chat..."
                        : isConversing
                          ? "Wait for response..."
                          : conversationComplete
                            ? "Ready for itinerary! 🎯"
                            : itinerary 
                              ? "Want changes? Type here..." 
                              : "Type a message..."
                    }
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    disabled={isConversing || isUserLocked()}
                  />
                </div>
                
                {/* Send Button */}
                <motion.button 
                  type="submit" 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                    isConversing || isUserLocked() || (!input.trim() && !conversationComplete)
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-[#128c7e] hover:bg-[#075e54] active:scale-95'
                  }`}
                  disabled={isConversing || isUserLocked() || (!input.trim() && !conversationComplete)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isConversing ? (
                    <motion.div 
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  )}
                </motion.button>
              </form>

              {/* Action Buttons */}
              {showOptions && !isUserLocked() && (
                <motion.div 
                  className="flex gap-2 mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button 
                    onClick={handleAskMore} 
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
                  >
                    Ask More
                  </button>
                  <button 
                    onClick={() => handleGenerate()} 
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-full font-medium text-sm hover:bg-orange-600 transition-colors"
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Creating..." : "🚀 Generate"}
                  </button>
                </motion.div>
              )}

              {conversationComplete && !showOptions && !isUserLocked() && (
                <motion.button 
                  onClick={() => handleGenerate()} 
                  className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                  disabled={isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div 
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating Your Itinerary...
                    </div>
                  ) : (
                    "✨ Generate My Dream Itinerary"
                  )}
                </motion.button>
              )}

              {/* Subscription Lock Message */}
              {isUserLocked() && (
                <motion.div 
                  className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-3xl mb-2">🔒</div>
                  <h3 className="text-lg font-bold text-orange-800 mb-2">Free chat limit reached!</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Upgrade to premium for unlimited travel planning with advanced AI features.
                  </p>
                  <button 
                    onClick={() => setShowSubscriptionPopup(true)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-red-600 transition-all shadow-md text-sm"
                  >
                    🇮🇳 Upgrade Now
                  </button>
                </motion.div>
              )}
            </div>
          )}
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
            setMessages([{ sender: 'system', text: "Hey! 👋 Ready to explore incredible India? \n\nKahan jaana hai? Where do you want to go? 🇮🇳✨" }]);
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