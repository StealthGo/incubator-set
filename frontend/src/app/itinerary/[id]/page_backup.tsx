"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ArrowLeft, BedDouble, Utensils, Gem, Star, MapPin, 
  Heart, BookOpen, Waves, Sun, ShieldCheck, Wifi, Bus,
  Plane, Calendar, Users, DollarSign, Clock, Camera,
  Coffee, Mountain, Palmtree, Award, Navigation, Info,
  CloudSun, Globe, Shield, Smartphone, ExternalLink,
  Share2, Download, Eye, Bookmark, ChevronDown,
  ChevronRight, Play, Pause, Volume2
} from "lucide-react";
import { TagBadge } from "@/components/ui/badge";

// Enhanced Button component with animations
const Button = ({ children, onClick, variant = "default", size = "default", className = "", asChild, ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg",
    ghost: "hover:bg-gray-100 hover:shadow-md",
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl"
  };
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base"
  };
  
  if (asChild) {
    return children;
  }
  
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Enhanced Card component with animations
const Card = ({ children, className = "", hover = true, ...props }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={hover ? { y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
    className={`rounded-xl border border-gray-200 bg-white shadow-lg ${className}`} 
    {...props}
  >
    {children}
  </motion.div>
);

// Enhanced Badge component
const Badge = ({ children, variant = "default", className = "", ...props }: any) => {
  const variants: Record<string, string> = {
    default: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
    success: "bg-green-100 text-green-800 hover:bg-green-200"
  };
  
  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${variants[variant] || variants.default} ${className}`} 
      {...props}
    >
      {children}
    </motion.span>
  );
};

// The full itinerary interface
interface FullItinerary {
    itinerary_id: string;
    user_info: { email: string; name: string };
    trip_parameters: { destination: string; dates: string; travelers: string; interests: string; budget: string; pace: string };
    itinerary: {
        hero_image_url: string;
        destination_name: string;
        personalized_title: string;
        journey_details: { title: string; options: Array<{ mode: string; duration: string; description: string; estimated_cost: string; booking_link: string; }> };
        accommodation_suggestions: Array<{ name: string; type: string; icon: string; description: string; estimated_cost: string; booking_link: string; image_url: string; }>;
        trip_overview: { destination_insights: string; weather_during_visit: string; seasonal_context: string; cultural_context: string; local_customs_to_know: string[]; estimated_total_cost: string; };
        daily_itinerary: Array<{ date: string; theme: string; activities: Array<{ time: string; activity: string; location: string; description: string; local_guide_tip: string; icon: string; image_url: string; Maps_link: string; booking_link: string | null; tags: string[]; }>; meals: { lunch: { dish: string; restaurant: string; description: string; image_url: string; zomato_link: string; tags: string[]; }; dinner: { dish: string; restaurant: string; description: string; image_url: string; zomato_link: string; tags: string[]; }; }; }>;
        hidden_gems: Array<{ name: string; description: string; why_special: string; search_link: string; }>;
        signature_experiences: Array<{ name: string; description: string; why_local_loves_it: string; estimated_cost: string; booking_link: string; tags: string[]; }>;
        hyperlocal_food_guide: Array<{ dish: string; description: string; where_to_find: string; local_tip: string; search_link: string; tags: string[]; }>;
        shopping_insider_guide: Array<{ item: string; where_to_buy: string; local_tip: string; search_link: string; }>;
        practical_local_wisdom: { safety_tips: string; health_and_wellness: string; connectivity: string; transport: string; };
    };
    created_at: string;
    updated_at: string;
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 }
};

const ItineraryDetails = () => {
  const [itinerary, setItinerary] = useState<FullItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();
  const params = useParams();
  const itineraryId = params.id as string;

  const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    } catch {
        return dateString;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    if (!itineraryId) return;

    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/itinerary/${itineraryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to load itinerary: ${res.statusText}`);
        }
        const data = await res.json();
        setItinerary(data);
      } catch (error: any) {
        console.error("Failed to fetch itinerary:", error);
        setError(error.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [itineraryId, router]);

  const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    } catch {
        return dateString;
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Preparing Your Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Loading your personalized itinerary...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (error || !itinerary) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-red-50 to-pink-50"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl mb-4"
        >
          😢
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Something went wrong
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 max-w-md"
        >
          {error || "We couldn't find the itinerary you're looking for. Please try again later."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={() => router.push("/profile")} variant="primary" size="lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Profile
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const {
      hero_image_url,
      destination_name,
      personalized_title,
      trip_overview,
      journey_details,
      daily_itinerary,
      accommodation_suggestions,
      hidden_gems,
      signature_experiences,
      hyperlocal_food_guide,
      shopping_insider_guide,
      practical_local_wisdom
  } = itinerary.itinerary;

  const { trip_parameters, user_info, created_at, updated_at, itinerary_id } = itinerary;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Fixed Navigation Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/profile")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-red-500" : "text-gray-500"}
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Large Image */}
      <motion.section 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={hero_image_url || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80`}
            alt={destination_name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-4xl"
            >
              <motion.div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="gradient" className="text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  {trip_parameters.dates}
                </Badge>
                <Badge variant="gradient" className="text-white">
                  <Users className="w-4 h-4 mr-2" />
                  {trip_parameters.travelers}
                </Badge>
                <Badge variant="gradient" className="text-white">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {trip_parameters.budget}
                </Badge>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              >
                {personalized_title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/90 mb-8 font-light"
              >
                {destination_name} • Created {new Date(created_at).toLocaleDateString()}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Button variant="primary" size="lg" onClick={() => setActiveSection("itinerary")}>
                  <Play className="w-5 h-5 mr-2" />
                  Start Journey
                </Button>
                <Button variant="outline" size="lg" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Eye className="w-5 h-5 mr-2" />
                  Quick Overview
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/70 text-center"
          >
            <ChevronDown className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Navigation Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 space-x-6">
            {[
              { id: "overview", label: "Overview", icon: Info },
              { id: "itinerary", label: "Daily Plans", icon: Calendar },
              { id: "accommodation", label: "Stay", icon: BedDouble },
              { id: "experiences", label: "Experiences", icon: Star },
              { id: "food", label: "Food Guide", icon: Coffee },
              { id: "practical", label: "Practical Tips", icon: Shield }
            ].map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {activeSection === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Quick Stats */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  { label: "Duration", value: trip_parameters.dates, icon: Calendar, color: "blue" },
                  { label: "Travelers", value: trip_parameters.travelers, icon: Users, color: "green" },
                  { label: "Budget", value: trip_parameters.budget, icon: DollarSign, color: "purple" },
                  { label: "Total Cost", value: trip_overview.estimated_total_cost, icon: Award, color: "orange" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-6 rounded-2xl border border-${stat.color}-200`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-700 mt-1`}>{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Trip Overview Card */}
              <Card className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="w-6 h-6 text-blue-500" />
                    <h2 className="text-3xl font-bold text-gray-900">Trip Overview</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Destination Insights</h3>
                      <p className="text-gray-700 leading-relaxed mb-6">{trip_overview.destination_insights}</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CloudSun className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Weather During Visit</p>
                            <p className="text-gray-600">{trip_overview.weather_during_visit}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-green-500 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Cultural Context</p>
                            <p className="text-gray-600">{trip_overview.cultural_context}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Trip Details</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Destination", value: trip_parameters.destination },
                          { label: "Travel Dates", value: trip_parameters.dates },
                          { label: "Group Size", value: trip_parameters.travelers },
                          { label: "Interests", value: trip_parameters.interests },
                          { label: "Travel Pace", value: trip_parameters.pace }
                        ].map((detail, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                          >
                            <span className="text-gray-600">{detail.label}:</span>
                            <span className="font-semibold text-gray-900">{detail.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Local Customs */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Customs to Know</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trip_overview.local_customs_to_know.map((custom, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200"
                        >
                          <p className="text-sm text-gray-700">{custom}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          )}

          {activeSection === "itinerary" && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Day Selector */}
              <Card className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-7 h-7 mr-3 text-blue-500" />
                  Daily Itinerary
                </h2>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {daily_itinerary.map((day, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveDay(index)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        activeDay === index
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Day {index + 1}
                      <div className="text-xs opacity-80">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Active Day Content */}
                <AnimatePresence mode="wait">
                  {daily_itinerary.map((day, index) => index === activeDay && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-8"
                    >
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900">{day.theme}</h3>
                        <p className="text-gray-600 mt-2">{new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                      
                      {/* Activities Timeline */}
                      <div className="space-y-6">
                        {day.activities.map((activity, actIndex) => (
                          <motion.div
                            key={actIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: actIndex * 0.1 }}
                            className="flex gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                              </div>
                              <p className="text-sm font-medium text-blue-600 mt-2 text-center">{activity.time}</p>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-xl font-semibold text-gray-900">{activity.activity}</h4>
                                <Badge variant="outline">{activity.location}</Badge>
                              </div>
                              
                              {activity.tags && activity.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {activity.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                    <TagBadge key={tagIndex} tag={tag} type="activity" />
                                  ))}
                                  {activity.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">+{activity.tags.length - 3} more</span>
                                  )}
                                </div>
                              )}
                              
                              <p className="text-gray-700 mb-3">{activity.description}</p>
                              
                              {activity.local_guide_tip && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                                  <p className="text-sm text-amber-800">
                                    <strong>💡 Local Tip:</strong> {activity.local_guide_tip}
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex gap-3">
                                {activity.Maps_link && (
                                  <Button size="sm" variant="outline">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <a href={activity.Maps_link} target="_blank" rel="noopener noreferrer">
                                      View on Map
                                    </a>
                                  </Button>
                                )}
                                {activity.booking_link && (
                                  <Button size="sm" variant="primary">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    <a href={activity.booking_link} target="_blank" rel="noopener noreferrer">
                                      Book Now
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Meals for the day */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Lunch */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6"
                        >
                          <h5 className="font-bold text-orange-900 mb-3 flex items-center text-lg">
                            <Utensils className="w-5 h-5 mr-2" />
                            Lunch
                          </h5>
                          <h6 className="font-semibold text-gray-900 text-lg mb-2">{day.meals.lunch.dish}</h6>
                          <p className="text-orange-700 font-medium mb-2">{day.meals.lunch.restaurant}</p>
                          
                          {day.meals.lunch.tags && day.meals.lunch.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 my-3">
                              {day.meals.lunch.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                <TagBadge key={tagIndex} tag={tag} type="food" />
                              ))}
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-600 mb-4">{day.meals.lunch.description}</p>
                          {day.meals.lunch.zomato_link && (
                            <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              <a href={day.meals.lunch.zomato_link} target="_blank" rel="noopener noreferrer">
                                View Menu
                              </a>
                            </Button>
                          )}
                        </motion.div>

                        {/* Dinner */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6"
                        >
                          <h5 className="font-bold text-purple-900 mb-3 flex items-center text-lg">
                            <Utensils className="w-5 h-5 mr-2" />
                            Dinner
                          </h5>
                          <h6 className="font-semibold text-gray-900 text-lg mb-2">{day.meals.dinner.dish}</h6>
                          <p className="text-purple-700 font-medium mb-2">{day.meals.dinner.restaurant}</p>
                          
                          {day.meals.dinner.tags && day.meals.dinner.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 my-3">
                              {day.meals.dinner.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                <TagBadge key={tagIndex} tag={tag} type="food" />
                              ))}
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-600 mb-4">{day.meals.dinner.description}</p>
                          {day.meals.dinner.zomato_link && (
                            <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              <a href={day.meals.dinner.zomato_link} target="_blank" rel="noopener noreferrer">
                                View Menu
                              </a>
                            </Button>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {/* Add other sections here... */}
        </AnimatePresence>
      </main>
        <div className="space-y-8">
         
          {/* Trip Overview */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Info className="w-6 h-6 mr-3 text-blue-500" />
              Trip Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Trip Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium">{trip_parameters.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dates:</span>
                    <span className="font-medium">{trip_parameters.dates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travelers:</span>
                    <span className="font-medium">{trip_parameters.travelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interests:</span>
                    <span className="font-medium">{trip_parameters.interests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{trip_parameters.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pace:</span>
                    <span className="font-medium">{trip_parameters.pace}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Destination Insights</h3>
                <p className="text-gray-700 mb-4">{trip_overview.destination_insights}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <CloudSun className="w-4 h-4 text-blue-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Weather:</span>
                      <p className="text-sm text-gray-600">{trip_overview.weather_during_visit}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Cultural Context:</span>
                      <p className="text-sm text-gray-600">{trip_overview.cultural_context}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Local Customs */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Local Customs to Know</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {trip_overview.local_customs_to_know.map((custom, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{custom}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Total Cost */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  Total Estimated Cost: {trip_overview.estimated_total_cost}
                </span>
              </div>
            </div>
          </Card>

          {/* Journey Details */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Plane className="w-6 h-6 mr-3 text-blue-500" />
              {journey_details.title}
            </h2>
            <div className="space-y-4">
              {journey_details.options.map((option, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{option.mode}</h3>
                    <span className="text-sm text-gray-500">{option.duration}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{option.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-600">{option.estimated_cost}</span>
                    {option.booking_link && (
                      <Button asChild size="sm" variant="outline">
                        <a href={option.booking_link} target="_blank" rel="noopener noreferrer">
                          Book Now
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Accommodation */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <BedDouble className="w-6 h-6 mr-3 text-blue-500" />
              Accommodation Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accommodation_suggestions.map((hotel, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{hotel.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{hotel.type}</p>
                      <p className="text-gray-700 mb-3">{hotel.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-600">{hotel.estimated_cost}</span>
                        {hotel.booking_link && (
                          <Button asChild size="sm" variant="outline">
                            <a href={hotel.booking_link} target="_blank" rel="noopener noreferrer">
                              Book Now
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily Itinerary */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-500" />
              Daily Itinerary
            </h2>
            
            {/* Day Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              {daily_itinerary.map((day, index) => (
                <Button
                  key={index}
                  onClick={() => setActiveDay(index)}
                  variant={activeDay === index ? "default" : "outline"}
                  size="sm"
                  className={activeDay === index ? 'bg-blue-600 text-white' : ''}
                >
                  Day {index + 1}
                </Button>
              ))}
            </div>

            {/* Active Day Content */}
            <div className="space-y-6">
              {daily_itinerary.map((day, index) => index === activeDay && (
                <div key={index}>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{day.theme}</h3>
                    <p className="text-gray-600">{formatDate(day.date)}</p>
                  </div>
                  
                  {/* Activities */}
                  <div className="space-y-4">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="text-center font-medium text-blue-600 min-w-[60px] pt-1">
                            {activity.time}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{activity.activity}</h4>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {activity.location}
                            </p>
                            
                            {/* Activity Tags */}
                            {activity.tags && activity.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {activity.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                  <TagBadge key={tagIndex} tag={tag} type="activity" />
                                ))}
                                {activity.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">+{activity.tags.length - 3} more</span>
                                )}
                              </div>
                            )}
                            
                            <p className="text-gray-700 mb-3">{activity.description}</p>
                            
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-yellow-800">
                                <strong>💡 Local Tip:</strong> {activity.local_guide_tip}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              {activity.Maps_link && (
                                <Button asChild size="sm" variant="outline" className="text-xs">
                                  <a href={activity.Maps_link} target="_blank" rel="noopener noreferrer">
                                    <Navigation className="w-3 h-3 mr-1" /> Maps
                                  </a>
                                </Button>
                              )}
                              {activity.booking_link && (
                                <Button asChild size="sm" variant="outline" className="text-xs">
                                 <a href={activity.booking_link} target="_blank" rel="noopener noreferrer">
                                  <Award className="w-3 h-3 mr-1" /> Book
                                 </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Meals for the day */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                        <Utensils className="w-4 h-4 mr-2" />
                        Lunch
                      </h5>
                      <p className="font-medium">{day.meals.lunch.dish}</p>
                      <p className="text-sm text-gray-600">{day.meals.lunch.restaurant}</p>
                      
                      {/* Lunch Tags */}
                      {day.meals.lunch.tags && day.meals.lunch.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-2">
                          {day.meals.lunch.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <TagBadge key={tagIndex} tag={tag} type="food" />
                          ))}
                          {day.meals.lunch.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{day.meals.lunch.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">{day.meals.lunch.description}</p>
                      {day.meals.lunch.zomato_link && (
                        <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                          <a href={day.meals.lunch.zomato_link} target="_blank" rel="noopener noreferrer">
                            View Menu
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-medium text-purple-900 mb-2 flex items-center">
                        <Utensils className="w-4 h-4 mr-2" />
                        Dinner
                      </h5>
                      <p className="font-medium">{day.meals.dinner.dish}</p>
                      <p className="text-sm text-gray-600">{day.meals.dinner.restaurant}</p>
                      
                      {/* Dinner Tags */}
                      {day.meals.dinner.tags && day.meals.dinner.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-2">
                          {day.meals.dinner.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <TagBadge key={tagIndex} tag={tag} type="food" />
                          ))}
                          {day.meals.dinner.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{day.meals.dinner.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">{day.meals.dinner.description}</p>
                      {day.meals.dinner.zomato_link && (
                        <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                          <a href={day.meals.dinner.zomato_link} target="_blank" rel="noopener noreferrer">
                            View Menu
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hidden Gems & Signature Experiences */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Gem className="w-6 h-6 mr-3 text-yellow-500" />
                Hidden Gems
              </h2>
              <div className="space-y-4">
                {hidden_gems.map((gem, index) => (
                  <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                    <h3 className="font-medium text-gray-900">{gem.name}</h3>
                    <p className="text-sm text-gray-700 mb-1">{gem.description}</p>
                    <p className="text-sm text-yellow-700 italic">{gem.why_special}</p>
                    {gem.search_link && (
                      <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                        <a href={gem.search_link} target="_blank" rel="noopener noreferrer">
                          Learn More
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3 text-green-500" />
                Signature Experiences
              </h2>
              <div className="space-y-4">
                {signature_experiences.map((exp, index) => (
                  <div key={index} className="border-l-4 border-green-400 pl-4 py-2">
                    <h3 className="font-medium text-gray-900">{exp.name}</h3>
                    
                    {/* Experience Tags */}
                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-2">
                        {exp.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                          <TagBadge key={tagIndex} tag={tag} type="activity" />
                        ))}
                        {exp.tags.length > 4 && (
                          <span className="text-xs text-gray-500">+{exp.tags.length - 4} more</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-700 mb-1">{exp.description}</p>
                    <p className="text-sm text-green-700 italic mb-1">{exp.why_local_loves_it}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Cost: {exp.estimated_cost}</span>
                      {exp.booking_link && (
                        <Button asChild size="sm" variant="outline" className="text-xs">
                          <a href={exp.booking_link} target="_blank" rel="noopener noreferrer">
                            Book Experience
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Food Guide & Shopping */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Coffee className="w-6 h-6 mr-3 text-orange-500" />
                Hyperlocal Food Guide
              </h2>
              <div className="space-y-4">
                {hyperlocal_food_guide.map((food, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{food.dish}</h3>
                    
                    {/* Food Tags */}
                    {food.tags && food.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-2">
                        {food.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                          <TagBadge key={tagIndex} tag={tag} type="food" />
                        ))}
                        {food.tags.length > 4 && (
                          <span className="text-xs text-gray-500">+{food.tags.length - 4} more</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-700 mb-2">{food.description}</p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Where to find:</strong> {food.where_to_find}
                    </p>
                    <p className="text-sm text-orange-700">
                      <strong>💡 Local tip:</strong> {food.local_tip}
                    </p>
                    {food.search_link && (
                      <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                        <a href={food.search_link} target="_blank" rel="noopener noreferrer">
                          Find Places
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-purple-500" />
                Shopping Insider Guide
              </h2>
              <div className="space-y-4">
                {shopping_insider_guide.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{item.item}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Where to buy:</strong> {item.where_to_buy}
                    </p>
                    <p className="text-sm text-purple-700">
                      <strong>💡 Local tip:</strong> {item.local_tip}
                    </p>
                    {item.search_link && (
                      <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                        <a href={item.search_link} target="_blank" rel="noopener noreferrer">
                          Find Stores
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Practical Local Wisdom */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-blue-500" />
              Practical Local Wisdom
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Safety Tips</h3>
                    <p className="text-sm text-gray-700">{practical_local_wisdom.safety_tips}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Health & Wellness</h3>
                    <p className="text-sm text-gray-700">{practical_local_wisdom.health_and_wellness}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Connectivity</h3>
                    <p className="text-sm text-gray-700">{practical_local_wisdom.connectivity}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bus className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Transport</h3>
                    <p className="text-sm text-gray-700">{practical_local_wisdom.transport}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* User Info */}
          <Card className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-600">{user_info.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Created by {user_info.name}</p>
                  <p className="text-sm text-gray-500">{user_info.email}</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>ID: {itinerary_id}</p>
                <p>Updated: {formatDate(updated_at)}</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer with User Info */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white border-t border-gray-200 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white text-lg">{user_info.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Created by {user_info.name}</p>
                  <p className="text-sm text-gray-500">{user_info.email}</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Itinerary ID: {itinerary_id}</p>
                <p>Last updated: {new Date(updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default ItineraryDetails;