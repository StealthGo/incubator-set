"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { CardCarousel } from "@/components/ui/card-carousel";
import {
    ArrowRight,
    CheckCircle,
    ChevronDown,
    MapPin,
    Users,
    Star,
    Send,
    Mic,
    Plus,
    Heart,
    Eye,
    Globe,
    PlaneTakeoff,
    CloudOff,
    MessageSquare,
    Route,
    Ticket,
    FileText,
    Settings2,
    Instagram,
    Linkedin,
    Youtube
} from "lucide-react";

// Assuming imageLinks is a file like: export default { delhi: '...', kashmir: '...' }
// If not, replace with actual paths or import statements.
const imageLinks = {
    delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
    kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
    goa: "https://images.unsplash.com/photo-1590372728453-75b2a4a28965?auto=format&fit=crop&w=600&q=80",
    varanasi: "https://images.unsplash.com/photo-1561361533-ebb46a782e30?auto=format&fit=crop&w=600&q=80",
    userAmit: "https://randomuser.me/api/portraits/men/32.jpg",
    userPriya: "https://randomuser.me/api/portraits/women/44.jpg",
    userRahul: "https://randomuser.me/api/portraits/men/46.jpg",
    userMeera: "https://randomuser.me/api/portraits/women/68.jpg",
    userNadia: "https://randomuser.me/api/portraits/women/1.jpg",
    userJayson: "https://randomuser.me/api/portraits/men/2.jpg",
    userErica: "https://randomuser.me/api/portraits/women/3.jpg",
    userBelinda: "https://randomuser.me/api/portraits/women/4.jpg",
    userJorge: "https://randomuser.me/api/portraits/men/5.jpg",
    userRohit: "https://randomuser.me/api/portraits/men/11.jpg",
    userAnanya: "https://randomuser.me/api/portraits/women/22.jpg",
    userSiddharth: "https://randomuser.me/api/portraits/men/33.jpg",
    lehLadakh: "https://images.unsplash.com/photo-1605275559453-562135c5b927?auto=format&fit=crop&w=600&q=80",
    kolkata: "https://images.unsplash.com/photo-1596708294975-7b08216d0619?auto=format&fit=crop&w=600&q=80",
    spitiValley: "https://images.unsplash.com/photo-1609843997230-b7433435017c?auto=format&fit=crop&w=600&q=80",
};

// Testimonials data for marquee
const reviews = [
    {
        name: "Nadia",
        username: "@travel_blogger_nadia",
        body: "Planning your trip by having all the attractions already plugged into a map makes trip planning so much easier.",
        img: imageLinks.userNadia,
    },
    {
        name: "Sharon Brewster",
        username: "@sharon_brewster",
        body: "Amazing app! Easy to use, love the AI functionality.",
        img: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
        name: "Jayson Oite",
        username: "@jayson_oite",
        body: "It seems to be this is my new travel app buddy. Very handy, convenient and very easy to use.",
        img: imageLinks.userJayson,
    },
    {
        name: "Erica Franco",
        username: "@erica_franco",
        body: "Absolutely love this app! It is so helpful when planning my trips. I especially love the optimize route option...",
        img: imageLinks.userErica,
    },
    {
        name: "Belinda Kohles",
        username: "@belinda_kohles",
        body: "I have used several trip planning apps. This one by far is the best. The interaction with google maps makes the planning so much easier...",
        img: imageLinks.userBelinda,
    },
    {
        name: "Lydia Yang",
        username: "@lydiascapes",
        body: "So much easier to visualize and plan a road trip to my favourite rock climbing destinations and explore the area around.",
        img: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    {
        name: "A. Rosa",
        username: "@a_rosa",
        body: "I absolutely love this app!!! I would recommend to anyone who is seriously planning a trip.",
        img: "https://randomuser.me/api/portraits/women/18.jpg",
    },
    {
        name: "Jorge D.",
        username: "@jorge_d",
        body: "It left me speechless that I can add places to my trip and they get automatically populated with a featured pic and description.",
        img: imageLinks.userJorge,
    },
    {
        name: "Amit Sharma",
        username: "@amit_travels",
        body: "Perfect for planning road trips across India. The route optimization saved me hours of planning!",
        img: imageLinks.userAmit,
    },
    {
        name: "Priya Patel",
        username: "@priya_explorer",
        body: "Love how it suggests local experiences and hidden gems. Made my Kerala trip unforgettable!",
        img: imageLinks.userPriya,
    },
    {
        name: "Rahul Singh",
        username: "@rahul_wanderer",
        body: "The desi touch makes all the difference. Finally, a travel app that understands Indian travelers!",
        img: imageLinks.userRahul,
    },
    {
        name: "Meera Jain",
        username: "@meera_journeys",
        body: "From chai stops to temple visits, it plans everything perfectly. Bahut accha app hai!",
        img: imageLinks.userMeera,
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

// Review card component for marquee
const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    // Generate a random gradient for the avatar based on the name
    const gradients = [
        'bg-gradient-to-br from-green-400 to-blue-600',
        'bg-gradient-to-br from-purple-400 to-pink-600', 
        'bg-gradient-to-br from-yellow-400 to-orange-600',
        'bg-gradient-to-br from-blue-400 to-purple-600',
        'bg-gradient-to-br from-pink-400 to-red-600',
        'bg-gradient-to-br from-indigo-400 to-cyan-600',
        'bg-gradient-to-br from-green-400 to-teal-600',
        'bg-gradient-to-br from-orange-400 to-red-600'
    ];
    
    const gradientIndex = name.charCodeAt(0) % gradients.length;
    const selectedGradient = gradients[gradientIndex];

    return (
        <figure className="relative w-72 cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex flex-row items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-full ${selectedGradient} flex items-center justify-center text-white text-sm font-semibold`}>
                    {name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <figcaption className="text-sm font-semibold text-gray-900">
                        {name}
                    </figcaption>
                    <p className="text-xs text-gray-500">{username}</p>
                </div>
            </div>
            <blockquote className="text-sm text-gray-700 leading-relaxed">
                {body}
            </blockquote>
        </figure>
    );
};

// Marquee testimonials component
const MarqueeTestimonials = () => {
    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
            <Marquee pauseOnHover className="[--duration:30s] [--gap:1.5rem] mb-6" repeat={3}>
                {firstRow.map((review, index) => (
                    <ReviewCard key={`first-${review.username}-${index}`} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:25s] [--gap:1.5rem]" repeat={3}>
                {secondRow.map((review, index) => (
                    <ReviewCard key={`second-${review.username}-${index}`} {...review} />
                ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r to-transparent" style={{ background: 'linear-gradient(to right, #FCFAF8, transparent)' }}></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l to-transparent" style={{ background: 'linear-gradient(to left, #FCFAF8, transparent)' }}></div>
        </div>
    );
};


// Simple and clean animations
const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 }
};

const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 }
};

const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 }
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

const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
};

// TypeScript interface for Accordion props
interface AccordionProps {
    question: string;
    answer: string;
}

// SearchInput component with rotating prompts
const SearchInput = () => {
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [isSignedIn, setIsSignedIn] = useState(false);
    const router = useRouter();
    
    // Check authentication status on component mount
    useEffect(() => {
        // Check if user is signed in (you can replace this with your actual auth check)
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        setIsSignedIn(!!token || !!user);
    }, []);
    
    const prompts = [
        "Create a 7-day Paris itinerary",
        "Plan a weekend getaway to Goa", 
        "Best temples to visit in Varanasi",
        "Romantic honeymoon in Kerala",
        "Adventure trip to Leh-Ladakh",
        "Family vacation in Rajasthan",
        "Budget backpacking in Himachal",
        "Luxury stay in Mumbai hotels"
    ];

    useEffect(() => {
        if (!inputValue) {
            const interval = setInterval(() => {
                setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [inputValue, prompts.length]);

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const query = inputValue || prompts[currentPromptIndex];
        if (query) {
            if (isSignedIn) {
                // User is signed in, redirect directly to chat
                router.push(`/chat?prompt=${encodeURIComponent(query)}`);
            } else {
                // Store the query in localStorage to use after sign-in
                localStorage.setItem('pendingQuery', query);
                // Redirect to sign-in page
                router.push('/signin');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex-1">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={prompts[currentPromptIndex]}
                className="flex-1 text-lg text-gray-800 placeholder-amber-400 bg-transparent border-none outline-none px-3 py-1"
            />
        </form>
    );
};

// FAQ Component
const Accordion = ({ question, answer }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div
            layout
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white rounded-2xl border border-gray-200/80 p-6 cursor-pointer"
        >
            <motion.div layout className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800">{question}</h3>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="text-gray-500" />
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="text-gray-600 leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


export default function Home() {
    const router = useRouter();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen antialiased relative overflow-x-hidden flex flex-col"
            style={{ backgroundColor: '#FCFAF8', color: '#333333' }}
        >
            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-lg fixed top-0 left-0 z-50 border-b border-gray-200/80"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Globe className="text-amber-600" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">The Modern <span className="text-amber-600">Chanakya</span></span>
                </div>
            </motion.nav>

            {/* Main Content */}
            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <motion.section
                    initial="initial"
                    animate="animate"
                    variants={fadeInUp}
                    className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-24 px-6 text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
                        Your Perfect Itinerary, <span className="text-amber-600">Instantly.</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        AI-powered travel planning that understands your style. Stop searching, start experiencing.
                    </p>
                    
                    {/* Search Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="w-full max-w-4xl mx-auto mb-12"
                    >
                        {/* Main Search Bar */}
                        <div className="relative mb-8">
                            {/* Search Input Container */}
                            <div className="flex items-center bg-white rounded-3xl border-2 border-amber-300/50 p-5">
                                <SearchInput />
                                <div className="flex items-center gap-3 ml-4">
                                    <button 
                                        aria-label="Voice input"
                                        className="p-2.5 rounded-full hover:bg-amber-50 transition-colors group"
                                    >
                                        <Mic className="w-5 h-5 text-amber-500 group-hover:text-amber-600" />
                                    </button>
                                    <button 
                                        className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-3.5 transition-all duration-200 hover:scale-105"
                                        aria-label="Search"
                                        onClick={() => {
                                            const input = document.querySelector<HTMLInputElement>('input[type="text"]');
                                            const value = input?.value || "";
                                            const query = value || (typeof window !== 'undefined' ? input?.placeholder : "");
                                            if (query) {
                                                // Check if user is signed in
                                                const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                                                const user = localStorage.getItem('user') || sessionStorage.getItem('user');
                                                const isSignedIn = !!token || !!user;
                                                
                                                if (isSignedIn) {
                                                    // User is signed in, redirect directly to chat
                                                    window.location.href = `/chat?prompt=${encodeURIComponent(query)}`;
                                                } else {
                                                    // Store the query in localStorage to use after sign-in
                                                    localStorage.setItem('pendingQuery', query);
                                                    // Redirect to sign-in page
                                                    window.location.href = '/signin';
                                                }
                                            }
                                        }}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-3">
                            <motion.button 
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-5 py-3 bg-amber-50 rounded-2xl border border-amber-200/50 text-amber-800 hover:bg-amber-100 hover:border-amber-300/70 transition-all duration-200"
                                onClick={() => {
                                    localStorage.setItem('pendingQuery', 'Create a new trip');
                                    router.push('/signin');
                                }}
                            >
                                <Globe className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium">Create a new trip</span>
                            </motion.button>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-5 py-3 bg-amber-50 rounded-2xl border border-amber-200/50 text-amber-800 hover:bg-amber-100 hover:border-amber-300/70 transition-all duration-200"
                                onClick={() => {
                                    localStorage.setItem('pendingQuery', 'Inspire me where to go');
                                    router.push('/signin');
                                }}
                            >
                                <MapPin className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium">Inspire me</span>
                            </motion.button>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-5 py-3 bg-amber-50 rounded-2xl border border-amber-200/50 text-amber-800 hover:bg-amber-100 hover:border-amber-300/70 transition-all duration-200"
                                onClick={() => {
                                    localStorage.setItem('pendingQuery', 'Plan weekend getaways');
                                    router.push('/signin');
                                }}
                            >
                                <Users className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium">Weekend getaways</span>
                            </motion.button>
                        </div>
                    </motion.div>
                    
                    {/* Stats */}
                    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex flex-col sm:flex-row gap-8 justify-center items-center w-full">
                        <motion.div variants={fadeInUp} className="flex items-center gap-3 text-gray-700">
                            <MapPin className="text-amber-500" />
                            <span className="font-semibold">5,000+ <span className="font-normal text-gray-500">Trips Planned</span></span>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="flex items-center gap-3 text-gray-700">
                            <Users className="text-amber-500" />
                            <span className="font-semibold">2,000+ <span className="font-normal text-gray-500">Happy Travellers</span></span>
                        </motion.div>
                        <motion.div variants={fadeInUp} className="flex items-center gap-3 text-gray-700">
                            <Star className="text-amber-500" />
                            <span className="font-semibold">4.9/5 <span className="font-normal text-gray-500">Avg. Rating</span></span>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* How it Works Section */}
                <motion.section 
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp} 
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full py-24"
                    style={{ backgroundColor: '#FCFAF8' }}
                >
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-5xl font-extrabold text-gray-900 text-center mb-16">How it Works</h2>
                        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-16">
                            <div className="flex-1 max-w-lg">
                                <h3 className="text-4xl font-bold text-gray-900 mb-4">Start chatting<br />with us.</h3>
                                <p className="text-lg text-gray-700 leading-relaxed">Ask us for suggestions for any destination or ask us for an entire itinerary. Be as specific as you can about the types of experiences that you like or take our quiz to determine your travel style.</p>
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[420px]">
                                {/* Simplified Visualizer */}
                                <div className="relative w-[380px] h-[380px] ">
                                    <Image src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" width={80} height={80} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" unoptimized />
                                    {/* Interest Bubbles */}
                                    {[
                                        { item: '🏖️ Beach', top: '90%', left: '50%' },
                                        { item: '🏛️ History', top: '65%', left: '85%' },
                                        { item: '🍽️ Dining', top: '35%', left: '85%' },
                                        { item: '🧖‍♀️ Spa', top: '10%', left: '50%' },
                                        { item: '🐦 Wildlife', top: '35%', left: '15%' },
                                        { item: '🚴‍♂️ Cycling', top: '65%', left: '15%' }
                                    ].map((bubble, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-md border border-gray-100"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 100 }}
                                            style={{
                                                top: bubble.top,
                                                left: bubble.left,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            <span className="text-sm font-medium text-gray-700">{bubble.item}</span>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="w-[380px] mt-4 bg-white rounded-2xl shadow-lg flex items-center px-3 py-2 border border-gray-200/80">
                                    <Plus className="text-gray-400" />
                                    <input type="text" placeholder="Ask us anything..." className="flex-1 outline-none border-none bg-transparent text-gray-700 text-base mx-2" disabled />
                                    <Mic className="text-gray-400" />
                                    <button className="bg-gray-800 text-white rounded-full p-2.5 ml-2 hover:bg-gray-700 transition-all">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Get Inspired Section */}
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-6xl font-extrabold text-gray-900 text-center mb-4 tracking-tight">Get inspired.</h2>
                        <p className="text-xl text-gray-600 text-center mb-12">Explore India’s wonders, curated by AI and crafted for you.</p>
                        <p className="max-w-3xl mx-auto text-center text-lg text-gray-600 mb-16 leading-relaxed">
                            Incredible India, Infinite Possibilities.<br />
                            From the mighty Himalayas to the vibrant streets of Mumbai, The Modern Chanakya is your AI-powered travel companion—designed by Indians, for Indians, right here in India.<br />
                            Discover hidden gems, iconic landmarks, and authentic experiences across Bharat. Let our smart platform recommend journeys that match your vibe, your pace, and your dreams.
                        </p>
                        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", title: "Kashmir", desc: "Sail Dal Lake at sunrise" },
                                { img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80", title: "Jaipur", desc: "Live the royal life in Jaipur" },
                                { img: "https://images.unsplash.com/photo-1516685018646-5499d0a7d42f?auto=format&fit=crop&w=600&q=80", title: "Goa", desc: "Unwind on Goa’s golden sands" },
                                { img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80", title: "Kerala", desc: "Cruise Kerala’s tranquil backwaters" },
                                { img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", title: "Varanasi", desc: "Witness the Ganga Aarti" },
                                { img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80", title: "Leh-Ladakh", desc: "Ride the passes of Ladakh" },
                                { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", title: "Rann of Kutch", desc: "Experience the Rann Utsav" },
                                { img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80", title: "Meghalaya", desc: "Chase waterfalls in the clouds" },
                            ].map(card => (
                                <motion.div 
                                    key={card.title} 
                                    variants={fadeInUp} 
                                    whileHover={{ scale: 1.05, y: -8 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative rounded-2xl overflow-hidden group h-80"
                                >
                                    <Image src={card.img} alt={card.title} layout="fill" className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-5 text-white">
                                        <h3 className="font-bold text-lg drop-shadow-md">{card.title}</h3>
                                        <p className="text-sm drop-shadow-sm opacity-90">{card.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Indian Itineraries Section */}
                <motion.section 
                    initial="initial" 
                    whileInView="animate" 
                    viewport={{ once: true, amount: 0.2 }} 
                    variants={fadeInUp} 
                    className="py-24"
                    style={{ backgroundColor: '#FCFAF8' }}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Apni Next Indian Adventure Yahin Dhoondo!</h2>
                        <p className="text-gray-600 text-center mb-12 text-lg">Yahan milenge asli travellers ke banaye hue, ready-made itineraries. Bas ek click, aur nikal pado apni dream trip par!</p>
                        
                        <CardCarousel
                            images={[
                                {
                                    src: imageLinks.delhi,
                                    alt: "Golden Triangle: Delhi, Agra & Jaipur",
                                    title: "Golden Triangle: Delhi, Agra & Jaipur",
                                    description: "A classic 7-day itinerary covering India's most iconic sights: Taj Mahal, Red Fort, Amber Fort, and more.",
                                    href: "/itineraries/delhi-agra-golden-triangle",
                                    userImg: imageLinks.userAmit,
                                    userName: "Amit",
                                    views: "12.3k",
                                    likes: 210
                                },
                                {
                                    src: imageLinks.kerala,
                                    alt: "Kerala Backwaters & Beaches",
                                    title: "Kerala Backwaters & Beaches",
                                    description: "Relax on a houseboat, explore Alleppey, and unwind on Kerala's stunning beaches in this 5-day trip.",
                                    href: "/itineraries/kerala-backwaters",
                                    userImg: imageLinks.userPriya,
                                    userName: "Priya",
                                    views: "8.9k",
                                    likes: 175
                                },
                                {
                                    src: imageLinks.goa,
                                    alt: "Goa: Party & Relax",
                                    title: "Goa: Party & Relax",
                                    description: "A 4-day itinerary for the best of Goa: beaches, nightlife, and hidden gems for relaxation and fun.",
                                    href: "/itineraries/goa-party-relax",
                                    userImg: imageLinks.userRahul,
                                    userName: "Rahul",
                                    views: "6.7k",
                                    likes: 120
                                },
                                {
                                    src: imageLinks.varanasi,
                                    alt: "Varanasi: Spiritual Journey",
                                    title: "Varanasi: Spiritual Journey",
                                    description: "Experience the Ganga Aarti, explore ancient temples, and soak in the spiritual vibe of Varanasi in 3 days.",
                                    href: "/itineraries/varanasi-spiritual",
                                    userImg: imageLinks.userMeera,
                                    userName: "Meera",
                                    views: "5.2k",
                                    likes: 98
                                }
                            ]}
                            autoplayDelay={3000}
                            showPagination={true}
                            showNavigation={true}
                        />
                    </div>
                </motion.section>

                {/* Testimonials Section */}
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Travellers kya bol rahe hain?</h2>
                        <p className="text-gray-600 text-center mb-12 text-lg">1 million+ logon ne The Modern Chanakya try kiya hai aur sabko planning ka kaam asaan laga!</p>
                        <MarqueeTestimonials />
                    </div>
                </motion.section>

                {/* Featured Travel Creators Section */}
                <motion.section 
                    initial="initial" 
                    whileInView="animate" 
                    viewport={{ once: true, amount: 0.2 }} 
                    variants={fadeInUp} 
                    className="py-24"
                    style={{ backgroundColor: '#FCFAF8' }}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-amber-700 text-center mb-4">Featured Travel Creators</h2>
                        <p className="text-gray-600 text-center mb-12 text-lg">Follow these amazing Indian travellers and check out their favourite itineraries!</p>
                        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {[
                                { name: "Rohit Sharma", handle: "@rohit_traveldiaries", bio: "Solo backpacker, chai lover, and Himalaya explorer. Sharing desi hacks for budget travel!", userImg: imageLinks.userRohit, itinImg: imageLinks.lehLadakh, itinTitle: "Leh-Ladakh Road Trip", href: "/itineraries/leh-ladakh-rohit" },
                                { name: "Ananya Singh", handle: "@ananya_wanders", bio: "Foodie, vlogger, and city explorer. Loves finding hidden gems in every Indian city!", userImg: imageLinks.userAnanya, itinImg: imageLinks.kolkata, itinTitle: "Kolkata Food Trail", href: "/itineraries/kolkata-food-ananya" },
                                { name: "Siddharth Mehra", handle: "@sid_on_the_road", bio: "Adventure junkie, biker, and storyteller. Always ready for the next road trip!", userImg: imageLinks.userSiddharth, itinImg: imageLinks.spitiValley, itinTitle: "Spiti Valley Adventure", href: "/itineraries/spiti-valley-sid" },
                            ].map(creator => (
                                <motion.div key={creator.name} variants={fadeInUp} className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col items-center text-center">
                                    <Image src={creator.userImg} alt={creator.name} width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-amber-200" unoptimized />
                                    <h3 className="font-bold text-xl text-gray-900">{creator.name}</h3>
                                    <p className="text-amber-600 text-sm mb-3">{creator.handle}</p>
                                    <p className="text-gray-600 text-sm mb-6 flex-grow">{creator.bio}</p>
                                    <a href={creator.href} className="block w-full rounded-xl overflow-hidden group border border-gray-200 hover:shadow-lg transition">
                                        <Image src={creator.itinImg} alt={creator.itinTitle} width={300} height={150} className="w-full h-36 object-cover" unoptimized />
                                        <div className="p-4 bg-gray-50 text-gray-800 font-semibold group-hover:text-amber-600 transition">{creator.itinTitle}</div>
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* FAQ Section */}
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24">
                    <div className="max-w-3xl mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-amber-700 text-center mb-10">FAQs – Sawal Jo Aksar Puchte Hain</h2>
                        <div className="space-y-4">
                            <Accordion
                                question="How does The Modern Chanakya work?"
                                answer="Bilkul simple hai! Bas apni preferences batao, aur hum aapke liye ek dum personalized itinerary bana denge – Indian style mein, with all the local masala."
                            />
                            <Accordion
                                question="Is The Modern Chanakya free?"
                                answer="Haanji, abhi ke liye bilkul free hai! Aap jitni chahe itineraries bana sakte ho, bina kisi charge ke."
                            />
                            <Accordion
                                question="Can I get itineraries for my family or group?"
                                answer="Bilkul! Family trip ho ya dosto ke saath masti, bas preferences mein batao kaun jaa raha hai, aur itinerary usi hisaab se milegi."
                            />
                            <Accordion
                                question="How do I get support if I’m stuck?"
                                answer="Koi dikkat aaye? Hum yahin hain! Niche contact section ya WhatsApp pe message karo, jaldi reply milega."
                            />
                        </div>
                    </div>
                </motion.section>

                {/* Newsletter Signup Section */}
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24">
                    <div className="max-w-3xl mx-auto px-6">
                        <div className="bg-amber-50 rounded-2xl p-8 lg:p-12 flex flex-col items-center text-center border border-amber-200/80">
                            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-3">Get Travel Gyaan in Your Inbox or WhatsApp!</h2>
                            <p className="text-gray-700 mb-8 max-w-xl">Subscribe for desi travel tips, exclusive deals, and itinerary inspiration. No bakwaas, only useful gyaan!</p>
                            <form className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
                                <input type="email" placeholder="Your email address" className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900" />
                                <button type="submit" className="px-6 py-3 rounded-full bg-amber-500 text-white font-semibold shadow-sm hover:bg-amber-600 transition-all text-base">Subscribe</button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3">We respect your privacy. No spam, promise!</p>
                        </div>
                    </div>
                </motion.section>

                {/* Pro Features Section */}
                <motion.section 
                    initial="initial" 
                    whileInView="animate" 
                    viewport={{ once: true, amount: 0.2 }} 
                    variants={fadeInUp} 
                    className="py-24"
                    style={{ backgroundColor: '#FCFAF8' }}
                >
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Upgrade Your Yatra with Stealth Pro</h2>
                        <p className="text-gray-600 text-center mb-12 text-lg">Unlock the full power of The Modern Chanakya with Pro features – made for Indian travellers who want more!</p>
                        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: <PlaneTakeoff />, title: "Live Train & Flight Updates", desc: "Get instant alerts for IRCTC trains and flights – no more last-minute surprises, boss!" },
                                { icon: <CloudOff />, title: "Offline Access", desc: "No network? No tension! Download your itinerary and access it anywhere, even in the mountains." },
                                { icon: <MessageSquare />, title: "WhatsApp Support", desc: "Kuch bhi doubt ho? Message us on WhatsApp for quick help – like a travel buddy in your pocket." },
                                { icon: <Route />, title: "Route Optimization", desc: "Save time and petrol! Get the best route for your road trips, auto-arranged for you." },
                                { icon: <Ticket />, title: "Cheap Deals & Alerts", desc: "Get exclusive deals on hotels, flights, and activities – sasta, sundar, tikau!" },
                                { icon: <Settings2 />, title: "Export to Google Maps", desc: "Send your itinerary to Google Maps in one click. Perfect for navigation on the go!" },
                                { icon: <FileText />, title: "Unlimited Attachments", desc: "Keep all your tickets, PDFs, and travel docs in one place – no more searching in 10 apps!" },
                            ].map(feature => (
                                <motion.div key={feature.title} variants={fadeInUp} className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-gray-200/80">
                                    <div className="text-amber-500 bg-amber-50 rounded-lg p-3 mt-1">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">{feature.title}</h3>
                                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

            </main>

            {/* Footer */}
            <footer 
                className="w-full border-t border-gray-200/80 pt-16 pb-8 px-6 md:px-12"
                style={{ backgroundColor: '#FCFAF8' }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                        <div className="col-span-2 mb-8 md:mb-0">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <Globe className="text-amber-600" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">The Modern <span className="text-amber-600">Chanakya</span></span>
                            </div>
                            <p className="text-gray-500 text-base">Bharat ka apna AI-powered travel itinerary platform.</p>
                        </div>
                        {[{ title: 'Company', links: ['About', 'Contact', 'FAQ'] }, { title: 'Product', links: ['Personalized Trips', 'Business Solutions', 'Partners'] }, { title: 'Legal', links: ['Privacy', 'Terms'] }, { title: 'Plan', links: ['Solo Trip', 'Family Trip', 'Business Trip'] }].map(col => (
                            <div key={col.title}>
                                <h4 className="font-semibold text-gray-900 mb-3">{col.title}</h4>
                                <ul className="space-y-2 text-gray-500">
                                    {col.links.map(link => <li key={link}><a href="#" className="hover:text-amber-600 transition">{link}</a></li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-gray-200/80">
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} The Modern Chanakya. All rights reserved.</p>
                        <div className="flex gap-5 text-gray-500 text-xl">
                            <a href="#" aria-label="Instagram" className="hover:text-amber-600 transition"><Instagram /></a>
                            <a href="#" aria-label="LinkedIn" className="hover:text-amber-600 transition"><Linkedin /></a>
                            <a href="#" aria-label="YouTube" className="hover:text-amber-600 transition"><Youtube /></a>
                            <a href="#" aria-label="Globe" className="hover:text-amber-600 transition"><Globe /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </motion.div>
    );
}