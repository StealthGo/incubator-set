"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { buildApiUrl, API_ENDPOINTS, apiRequest } from '@/lib/api';
import SubscriptionPopup from "./SubscriptionPopup";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/ui/badge";

import { DateRange } from "react-date-range";
import { addDays, format } from 'date-fns';
import {
  MapPin, Clock, Calendar, Users, DollarSign, Star, Camera, Coffee, Mountain, Heart,
  ExternalLink, Navigation, Eye, Bookmark, Wifi, Utensils, BedDouble, Gem, Bus, Plane, Truck, Globe
} from "lucide-react";
// If you have a local Icon component, import it:
// import Icon from '@/components/Icon';

// Restore any constants or helpers used in the file
const getRandomFlexibleDates = () => {
  const today = new Date();
  const startOffset = Math.floor(Math.random() * 20) + 1;
  const startDate = addDays(today, startOffset);
  const endDate = addDays(startDate, 4);
  return `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`;
};

// Restore systemPrompt if used
const systemPrompt = `You are \"The Modern Chanakya\" - a friendly, knowledgeable Indian travel buddy who helps plan amazing trips within India. You chat like a friend on WhatsApp - casual, quick, and fun!\n\n🎯 YOUR MISSION: Get the essentials in 6-7 quick questions, then create an AMAZING itinerary!\n...`;

// If you have a local Icon component, define a fallback if not imported
const Icon = ({ name, className }: { name: string, className?: string }) => <span className={className}>{name}</span>;

// Restore animation variants if used
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
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Sign up failed");
        setLoading(false);
        return;
      }
      // Automatically sign in after successful signup
      const signInForm = new URLSearchParams();
      signInForm.append("username", email);
      signInForm.append("password", password);
      const signInRes = await apiRequest(API_ENDPOINTS.signin, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: signInForm.toString(),
      });
      if (!signInRes.ok) {
        setError("Signup succeeded but automatic login failed. Please sign in manually.");
        setShowSignUp(false);
        setLoading(false);
        return;
      }
      const signInData = await signInRes.json();
      localStorage.setItem("token", signInData.access_token);
      // Fetch user data after successful login
      try {
        const userRes = await apiRequest(API_ENDPOINTS.me, {
          method: "GET",
          headers: { "Authorization": `Bearer ${signInData.access_token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          onUserUpdate(userData);
        }
      } catch (error) {
        console.error("Error fetching user data after auto-login:", error);
      }
      setShowSignUp(false);
      setError("");
      setLoading(false);
      onSuccess();
      onClose();
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
  const getLLMResponse = async (conversationHistory: Array<{sender: string, text: string}>) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowSignInModal(true);
      return;
    }

    setIsConversing(true);
    
    // Add typing indicator immediately
    setMessages((msgs) => [...msgs, { sender: "system", text: "typing..." }]);

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
        newMsgs.push({ 
          sender: "system", 
          text: "Oops! Network issue ho gaya. Try again? 😅" 
        });
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
                                <Button variant="default" size="sm">
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
                                        <h4 className="font-semibold text-base text-gray-800 mb-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{opt.name}</h4>
                                        <p className="text-sm text-gray-500 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{opt.type}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4 text-[15px] leading-relaxed font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">{opt.description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-800 font-semibold text-base flex items-center gap-2 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">
                                      <DollarSign className="w-4 h-4 text-green-500" />
                                      {opt.estimated_cost}
                                    </p>
                                    <Button variant="default" size="sm">
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
                                  <Button variant="default" size="default">
                                    <a href={day.breakfast.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" /> Google Maps
                                    </a>
                                  </Button>
                                )}
                                {day.breakfast.zomato_link && (
                                  <Button variant="outline" size="default">
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
                                     <Button variant="default" size="default">
                                       <a href={activity.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                           <MapPin className="w-4 h-4" /> Google Maps
                                       </a>
                                     </Button>
                                     {activity.booking_link && (
                                          <Button variant="outline" size="default">
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
                                          <Button variant="outline" size="default">
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
                                  <p className="text-lg text-amber-700 italic font-['Inter','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','sans-serif']">"{day.lunch.insider_tip}"</p>
                                </motion.div>
                              )}
                              
                              <div className="flex gap-3">
                                {day.lunch.google_maps_link && (
                                  <Button variant="default" size="default">
                                    <a href={day.lunch.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" /> Google Maps
                                    </a>
                                  </Button>
                                )}
                                {day.lunch.zomato_link && (
                                  <Button variant="outline" size="default">
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
                                     <Button variant="default" size="default">
                                       <a href={activity.google_maps_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                           <MapPin className="w-4 h-4" /> Google Maps
                                       </a>
                                     </Button>
                                     {activity.booking_link && (
                                          <Button variant="outline" size="default">
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
                                          <Button variant="outline" size="default">
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
                                             activity.booking_priority === 'Recommended' ? '🔖 Booking Recommended' :
                                             '🚶 Walk-in Welcome'}
                                          </span>
                                     )}
