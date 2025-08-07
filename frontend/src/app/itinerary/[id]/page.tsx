"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { buildApiUrl, API_ENDPOINTS } from '@/lib/api';
import { 
  ArrowLeft, BedDouble, Utensils, Gem, Star, MapPin, 
  Heart, BookOpen, Waves, Sun, ShieldCheck, Wifi, Bus,
  Plane, Calendar, Users, DollarSign, Clock, Camera,
  Coffee, Mountain, Palmtree, Award, Navigation, Info,
  CloudSun, Globe, Shield, Smartphone, ExternalLink,
  Share2, Download, Eye, Bookmark, ChevronDown,
  ChevronRight, Play, Pause, Volume2, Menu, X,
  ZoomIn, ArrowUp, ArrowDown, ArrowRight
} from "lucide-react";
import { TagBadge } from "@/components/ui/badge";

// Enhanced Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 }
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 }
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

// Progressive reveal container
const progressiveReveal = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

// Floating elements animation
const floatingAnimation = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
  }
};

// Enhanced Button component with 3D effects
const Button = ({ children, onClick, variant = "default", size = "default", className = "", asChild, ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 transform-gpu perspective-1000";
  const variants: Record<string, string> = {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-2xl hover:-translate-y-1",
    outline: "border-2 border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-gray-50 shadow-md hover:shadow-xl hover:border-gray-400 hover:-translate-y-0.5",
    ghost: "hover:bg-gray-100/80 backdrop-blur-sm hover:shadow-lg hover:-translate-y-0.5",
    primary: "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:-translate-y-1 bg-size-200 bg-pos-0 hover:bg-pos-100",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-2xl hover:-translate-y-1",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-2xl"
  };
  const sizes: Record<string, string> = {
    default: "h-11 px-6 py-2",
    sm: "h-9 px-4 text-xs",
    lg: "h-14 px-10 text-base font-semibold"
  };
  
  if (asChild) {
    return children;
  }
  
  return (
    <motion.button 
      whileHover={{ scale: 1.02, rotateX: 5 }}
      whileTap={{ scale: 0.98, rotateX: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      onClick={onClick}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      <span style={{ transform: "translateZ(20px)" }}>{children}</span>
    </motion.button>
  );
};

// Enhanced Card component with 3D effects and glass morphism
const Card = ({ children, className = "", hover = true, glass = false, ...props }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30, rotateX: 10 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    whileHover={hover ? { 
      y: -8, 
      rotateX: 5,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    } : {}}
    className={`rounded-2xl border transform-gpu perspective-1000 ${
      glass 
        ? "bg-white/10 backdrop-blur-md border-white/20 shadow-xl" 
        : "border-gray-200 bg-white shadow-lg"
    } ${className}`}
    style={{ transformStyle: "preserve-3d" }}
    {...props}
  >
    <div style={{ transform: "translateZ(20px)" }}>
      {children}
    </div>
  </motion.div>
);

// Enhanced Badge component with glow effects
const Badge = ({ children, variant = "default", className = "", glow = false, ...props }: any) => {
  const variants: Record<string, string> = {
    default: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    outline: "border border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-gray-50",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    glow: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50"
  };
  
  return (
    <motion.span 
      whileHover={{ scale: 1.05, boxShadow: glow ? "0 0 20px rgba(59, 130, 246, 0.5)" : undefined }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${variants[variant] || variants.default} ${className}`} 
      {...props}
    >
      {children}
    </motion.span>
  );
};

// Image Gallery Component with Lightbox
const ImageGallery = ({ images, alt }: { images: string[], alt: string }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length 
      : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.slice(0, 6).map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(image, index)}
          >
            <Image
              src={image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={alt}
                width={1200}
                height={800}
                className="w-full h-full object-contain rounded-lg"
                unoptimized
              />
              
              {/* Navigation */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </button>
              
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Floating Progress Indicator
const FloatingProgress = ({ activeSection, sections }: { activeSection: string, sections: any[] }) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="bg-white/20 backdrop-blur-md rounded-full p-2 shadow-lg">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            className={`w-3 h-3 rounded-full mb-2 transition-all duration-300 ${
              activeSection === section.id ? 'bg-blue-500 scale-125' : 'bg-gray-300'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
        
        {/* Progress bar */}
        <motion.div
          className="w-1 bg-blue-500 rounded-full mt-4"
          style={{ height: useTransform(progress, [0, 1], ["0%", "100%"]) }}
        />
      </div>
    </motion.div>
  );
};

// Interactive Timeline Component
const InteractiveTimeline = ({ activities }: { activities: any[] }) => {
  const [activeActivity, setActiveActivity] = useState(0);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
      
      <div className="space-y-8">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex gap-8 cursor-pointer transition-all duration-300 ${
              activeActivity === index ? 'scale-105' : 'hover:scale-102'
            }`}
            onClick={() => setActiveActivity(index)}
          >
            {/* Timeline dot */}
            <motion.div
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeActivity === index 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50' 
                  : 'bg-white border-4 border-blue-200'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <Clock className={`w-6 h-6 ${activeActivity === index ? 'text-white' : 'text-blue-600'}`} />
            </motion.div>
            
            {/* Content */}
            <Card 
              className={`flex-1 p-6 transition-all duration-300 ${
                activeActivity === index ? 'border-blue-500 shadow-xl' : ''
              }`}
              hover={false}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">{activity.time}</p>
                  <h4 className="text-xl font-semibold text-gray-900">{activity.activity}</h4>
                </div>
                <Badge variant="outline">{activity.location}</Badge>
              </div>
              
              <AnimatePresence>
                {activeActivity === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-700 mb-4">{activity.description}</p>
                    
                    {activity.local_guide_tip && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
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
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Full itinerary interface
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

export default function ItineraryDetailPage() {
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const itineraryId = params.id as string;

  // Scroll-based animations
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  
  // Only initialize useScroll with target after component is mounted
  const { scrollYProgress } = useScroll(
    isMounted && heroRef.current ? {
      target: heroRef,
      offset: ["start start", "end start"]
    } : {}
  );

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sections = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "itinerary", label: "Daily Plans", icon: Calendar },
    { id: "accommodation", label: "Stay", icon: BedDouble },
    { id: "experiences", label: "Experiences", icon: Star },
    { id: "food", label: "Food Guide", icon: Coffee },
    { id: "practical", label: "Practical Tips", icon: Shield }
  ];

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
        const res = await fetch(buildApiUrl(API_ENDPOINTS.getItinerary(itineraryId)), {
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

  // Auto-scroll to section on navigation
  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-8 relative"
          >
            <div className="absolute inset-2 border-2 border-purple-200 border-r-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
          >
            Preparing Your Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg"
          >
            Loading your personalized itinerary...
          </motion.p>
          
          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !itinerary) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          😢
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4"
        >
          Something went wrong
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 max-w-md text-lg"
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
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30"
    >
      {/* Floating Progress Indicator */}
      <FloatingProgress activeSection={activeSection} sections={sections} />

      {/* Fixed Navigation Header with Glass Morphism */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed top-0 w-full bg-white/20 backdrop-blur-md border-b border-white/20 z-50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="glass" 
              onClick={() => router.push("/profile")}
              className="text-gray-800 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="glass"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-red-500" : "text-gray-700"}
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="glass" className="text-gray-700">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="glass" className="text-gray-700">
                <Download className="w-4 h-4" />
              </Button>
              
              {/* Mobile menu toggle */}
              <Button 
                variant="glass" 
                className="md:hidden text-gray-700"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Hero Section with Parallax */}
      <motion.section 
        ref={heroRef}
        className="relative h-screen overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div 
          className="absolute inset-0"
          style={isMounted ? { scale: heroScale, opacity: heroOpacity, y: heroY } : {}}
        >
          <Image
            src={hero_image_url || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80`}
            alt={destination_name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-6 h-6 rounded-full opacity-30 ${
                i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'
              }`}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              variants={floatingAnimation}
              animate="animate"
              transition={{ 
                delay: i * 0.2,
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-32">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1, type: "spring", stiffness: 50 }}
              className="max-w-4xl"
            >
              <motion.div 
                className="flex flex-wrap gap-3 mb-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {[
                  { icon: Calendar, label: trip_parameters.dates },
                  { icon: Users, label: trip_parameters.travelers },
                  { icon: DollarSign, label: trip_parameters.budget }
                ].map((item, index) => (
                  <motion.div key={index} variants={fadeInUp}>
                    <Badge variant="glow" glow className="text-white text-sm px-4 py-2">
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, type: "spring", stiffness: 50 }}
                className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-2xl"
              >
                {personalized_title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-2xl md:text-3xl text-white/90 mb-10 font-light drop-shadow-lg"
              >
                {destination_name} • Created {new Date(created_at).toLocaleDateString()}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex flex-wrap gap-6"
              >
                <Button variant="primary" size="lg" onClick={() => setActiveSection("itinerary")}>
                  <Play className="w-5 h-5 mr-2" />
                  Start Journey
                </Button>
                <Button variant="glass" size="lg">
                  <Eye className="w-5 h-5 mr-2" />
                  Quick Overview
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white/80 text-center cursor-pointer group"
            onClick={() => setActiveSection("overview")}
          >
            <div className="w-8 h-12 border-2 border-white/50 rounded-full mb-4 mx-auto flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-white/70 rounded-full mt-2"
              />
            </div>
            <p className="text-sm group-hover:text-white transition-colors">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Enhanced Navigation Tabs with Mobile Support */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="sticky top-20 z-40 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex overflow-x-auto py-6 space-x-6">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 font-medium ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105"
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/20 backdrop-blur-sm border border-white/30"
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden py-4">
            <Button
              variant="glass"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-full justify-between text-gray-800"
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const currentSection = sections.find(s => s.id === activeSection);
                  const IconComponent = currentSection?.icon;
                  return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
                })()}
                {sections.find(s => s.id === activeSection)?.label}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
            </Button>
            
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 p-4"
                >
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveSection(section.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-gray-700 hover:bg-white/30"
                      }`}
                    >
                      <section.icon className="w-4 h-4" />
                      {section.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          {activeSection === "overview" && (
            <motion.div
              key="overview"
              id="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Enhanced Quick Stats with 3D Cards */}
              <motion.div
                variants={progressiveReveal}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {[
                  { label: "Duration", value: trip_parameters.dates, icon: Calendar, gradient: "from-blue-500 to-cyan-500" },
                  { label: "Travelers", value: trip_parameters.travelers, icon: Users, gradient: "from-green-500 to-emerald-500" },
                  { label: "Budget", value: trip_parameters.budget, icon: DollarSign, gradient: "from-purple-500 to-pink-500" },
                  { label: "Total Cost", value: trip_overview.estimated_total_cost, icon: Award, gradient: "from-orange-500 to-red-500" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    whileHover={{ rotateY: 10, rotateX: 5 }}
                    className="relative group cursor-pointer"
                    style={{ perspective: '1000px' }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                    <Card 
                      className="relative bg-white/90 backdrop-blur-md p-8 border-2 border-white/50 transform-gpu"
                      hover={false}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mt-2">{stat.value}</p>
                        </div>
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                          <stat.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </Card>
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
              id="itinerary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Enhanced Day Selector with Glass Cards */}
              <Card className="p-8 bg-white/80 backdrop-blur-lg border-2 border-white/50" glass>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center"
                >
                  <Calendar className="w-8 h-8 mr-4 text-blue-500" />
                  Daily Journey
                </motion.h2>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12"
                  variants={progressiveReveal}
                  initial="initial"
                  animate="animate"
                >
                  {daily_itinerary.map((day, index) => (
                    <motion.button
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveDay(index)}
                      className={`relative p-6 rounded-2xl font-medium transition-all duration-300 overflow-hidden group ${
                        activeDay === index
                          ? "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white shadow-xl shadow-blue-500/50"
                          : "bg-white/50 backdrop-blur-sm border-2 border-white/30 text-gray-700 hover:bg-white/70 hover:shadow-lg"
                      }`}
                    >
                      {/* Animated background */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${activeDay === index ? 'opacity-100' : ''}`} />
                      
                      <div className="relative z-10">
                        <div className="text-lg font-bold mb-1">Day {index + 1}</div>
                        <div className="text-sm opacity-80">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className={`text-xs mt-2 font-medium ${activeDay === index ? 'text-white/80' : 'text-gray-500'}`}>
                          {day.theme}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>

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
                      <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">{day.theme}</h3>
                        <p className="text-lg text-gray-600">{formatDate(day.date)}</p>
                      </motion.div>
                      
                      {/* Interactive Timeline */}
                      <InteractiveTimeline activities={day.activities} />
                      
                                             {/* Enhanced Meals Section */}
                       <motion.div 
                         className="mt-16"
                         initial={{ opacity: 0, y: 30 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.6 }}
                       >
                         <h4 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                           Today's Culinary Journey
                         </h4>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {/* Enhanced Lunch Card */}
                           <Card 
                             className="relative overflow-hidden bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm border-2 border-orange-200/50 p-8"
                             hover
                           >
                             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -translate-y-16 translate-x-16" />
                             
                             <div className="relative z-10">
                               <div className="flex items-center justify-between mb-6">
                                 <h5 className="font-bold text-orange-900 flex items-center text-xl">
                                   <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-3">
                                     <Utensils className="w-5 h-5 text-white" />
                                   </div>
                                   Lunch
                                 </h5>
                                 <Badge variant="outline" className="bg-white/50">Local Pick</Badge>
                               </div>
                               
                               <h6 className="font-bold text-gray-900 text-xl mb-3">{day.meals.lunch.dish}</h6>
                               <p className="text-orange-700 font-semibold mb-4 text-lg">{day.meals.lunch.restaurant}</p>
                               
                               {day.meals.lunch.tags && day.meals.lunch.tags.length > 0 && (
                                 <div className="flex flex-wrap gap-2 my-4">
                                   {day.meals.lunch.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                     <TagBadge key={tagIndex} tag={tag} type="food" />
                                   ))}
                                 </div>
                               )}
                               
                               <p className="text-gray-700 mb-6 leading-relaxed">{day.meals.lunch.description}</p>
                               {day.meals.lunch.zomato_link && (
                                 <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400">
                                   <ExternalLink className="w-4 h-4 mr-2" />
                                   <a href={day.meals.lunch.zomato_link} target="_blank" rel="noopener noreferrer">
                                     View Menu
                                   </a>
                                 </Button>
                               )}
                             </div>
                           </Card>

                           {/* Enhanced Dinner Card */}
                           <Card 
                             className="relative overflow-hidden bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-2 border-purple-200/50 p-8"
                             hover
                           >
                             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-16 translate-x-16" />
                             
                             <div className="relative z-10">
                               <div className="flex items-center justify-between mb-6">
                                 <h5 className="font-bold text-purple-900 flex items-center text-xl">
                                   <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                                     <Utensils className="w-5 h-5 text-white" />
                                   </div>
                                   Dinner
                                 </h5>
                                 <Badge variant="outline" className="bg-white/50">Chef's Choice</Badge>
                               </div>
                               
                               <h6 className="font-bold text-gray-900 text-xl mb-3">{day.meals.dinner.dish}</h6>
                               <p className="text-purple-700 font-semibold mb-4 text-lg">{day.meals.dinner.restaurant}</p>
                               
                               {day.meals.dinner.tags && day.meals.dinner.tags.length > 0 && (
                                 <div className="flex flex-wrap gap-2 my-4">
                                   {day.meals.dinner.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                     <TagBadge key={tagIndex} tag={tag} type="food" />
                                   ))}
                                 </div>
                               )}
                               
                               <p className="text-gray-700 mb-6 leading-relaxed">{day.meals.dinner.description}</p>
                               {day.meals.dinner.zomato_link && (
                                 <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400">
                                   <ExternalLink className="w-4 h-4 mr-2" />
                                   <a href={day.meals.dinner.zomato_link} target="_blank" rel="noopener noreferrer">
                                     View Menu
                                   </a>
                                 </Button>
                               )}
                             </div>
                           </Card>
                         </div>
                       </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Card>
            </motion.div>
          )}

          {activeSection === "accommodation" && (
            <motion.div
              key="accommodation"
              id="accommodation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <BedDouble className="w-7 h-7 mr-3 text-blue-500" />
                  Accommodation Suggestions
                </h2>
                
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {accommodation_suggestions.map((accommodation, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <BedDouble className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{accommodation.name}</h3>
                            <Badge variant="outline" className="mt-1">{accommodation.type}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{accommodation.estimated_cost}</p>
                          <p className="text-xs text-gray-500">per night</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{accommodation.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {accommodation.booking_link && (
                          <Button size="sm" variant="primary">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <a href={accommodation.booking_link} target="_blank" rel="noopener noreferrer">
                              Book Now
                            </a>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Journey Details */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Plane className="w-6 h-6 mr-3 text-green-500" />
                    {journey_details.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {journey_details.options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Bus className="w-5 h-5 text-blue-500" />
                          <h4 className="font-semibold text-gray-900">{option.mode}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Duration:</span>
                            <span className="font-medium">{option.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Cost:</span>
                            <span className="font-medium text-green-600">{option.estimated_cost}</span>
                          </div>
                        </div>
                        {option.booking_link && (
                          <Button size="sm" variant="outline" className="w-full mt-4">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <a href={option.booking_link} target="_blank" rel="noopener noreferrer">
                              Book Transport
                            </a>
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeSection === "experiences" && (
            <motion.div
              key="experiences"
              id="experiences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Signature Experiences */}
              <Card className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="w-7 h-7 mr-3 text-yellow-500" />
                  Signature Experiences
                </h2>
                
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {signature_experiences.map((experience, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{experience.name}</h3>
                        <div className="text-right">
                          <p className="text-lg font-bold text-yellow-600">{experience.estimated_cost}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{experience.description}</p>
                      
                      <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                        <p className="text-sm text-yellow-800">
                          <strong>💛 Why locals love it:</strong> {experience.why_local_loves_it}
                        </p>
                      </div>

                      {experience.tags && experience.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {experience.tags.map((tag: string, tagIndex: number) => (
                            <TagBadge key={tagIndex} tag={tag} type="activity" />
                          ))}
                        </div>
                      )}
                      
                      {experience.booking_link && (
                        <Button size="sm" variant="primary">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <a href={experience.booking_link} target="_blank" rel="noopener noreferrer">
                            Book Experience
                          </a>
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </Card>

              {/* Hidden Gems */}
              <Card className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Gem className="w-7 h-7 mr-3 text-purple-500" />
                  Hidden Gems
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hidden_gems.map((gem, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{gem.name}</h3>
                      <p className="text-sm text-gray-700 mb-3">{gem.description}</p>
                      
                      <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-4">
                        <p className="text-xs text-purple-800">
                          <strong>✨ Why it's special:</strong> {gem.why_special}
                        </p>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        <Navigation className="w-4 h-4 mr-2" />
                        <a href={gem.search_link} target="_blank" rel="noopener noreferrer">
                          Find Location
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Shopping Guide */}
              <Card className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Gem className="w-7 h-7 mr-3 text-green-500" />
                  Shopping Insider Guide
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {shopping_insider_guide.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.item}</h3>
                      <p className="text-sm text-green-700 font-medium mb-2">{item.where_to_buy}</p>
                      
                      <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
                        <p className="text-xs text-green-800">
                          <strong>💡 Local tip:</strong> {item.local_tip}
                        </p>
                      </div>
                      
                      <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                        <Navigation className="w-4 h-4 mr-2" />
                        <a href={item.search_link} target="_blank" rel="noopener noreferrer">
                          Find Shops
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeSection === "food" && (
            <motion.div
              key="food"
              id="food"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Coffee className="w-7 h-7 mr-3 text-orange-500" />
                  Hyperlocal Food Guide
                </h2>
                
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {hyperlocal_food_guide.map((food, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{food.dish}</h3>
                        <Coffee className="w-6 h-6 text-orange-500" />
                      </div>
                      
                      <p className="text-gray-700 mb-4">{food.description}</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
                          <p className="text-sm text-orange-800">
                            <strong>📍 Where to find:</strong> {food.where_to_find}
                          </p>
                        </div>
                        
                        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>💡 Local tip:</strong> {food.local_tip}
                          </p>
                        </div>
                      </div>

                      {food.tags && food.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {food.tags.map((tag: string, tagIndex: number) => (
                            <TagBadge key={tagIndex} tag={tag} type="food" />
                          ))}
                        </div>
                      )}
                      
                      <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                        <Navigation className="w-4 h-4 mr-2" />
                        <a href={food.search_link} target="_blank" rel="noopener noreferrer">
                          Find Restaurants
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              </Card>
            </motion.div>
          )}

          {activeSection === "practical" && (
            <motion.div
              key="practical"
              id="practical"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <Card className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="w-7 h-7 mr-3 text-green-500" />
                  Practical Local Wisdom
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Safety Tips */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">Safety Tips</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{practical_local_wisdom.safety_tips}</p>
                  </motion.div>

                  {/* Health & Wellness */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Health & Wellness</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{practical_local_wisdom.health_and_wellness}</p>
                  </motion.div>

                  {/* Connectivity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Wifi className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">Connectivity</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{practical_local_wisdom.connectivity}</p>
                  </motion.div>

                  {/* Transport */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Bus className="w-6 h-6 text-orange-600" />
                      <h3 className="text-xl font-bold text-gray-900">Transport</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{practical_local_wisdom.transport}</p>
                  </motion.div>
                </div>

                {/* Quick Tips Grid */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Reference</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Smartphone, label: "Emergency", value: "Local emergency services" },
                      { icon: Globe, label: "Language", value: "Local language tips" },
                      { icon: DollarSign, label: "Currency", value: "Payment methods" },
                      { icon: Clock, label: "Timezone", value: "Local time zone" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                      >
                        <item.icon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
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
                <p>Last updated: {formatDate(updated_at)}</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.footer>
    </motion.div>
  );
}