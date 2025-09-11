"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { CardCarousel } from "@/components/ui/card-carousel";
import HoverExpand from "@/components/ui/hover-expand";
import {
    MinimalCard,
    MinimalCardImage,
    MinimalCardTitle,
    MinimalCardDescription,
    MinimalCardContent,
    MinimalCardFooter
} from "@/components/ui/minimal-card";
import { ImageCursorTrail } from "@/components/ui/image-cursortrail";
import { BentoGridWhyUs } from "@/components/ui/bento-grid-demo";
import { BentoGridProblems } from "@/components/ui/bento-grid-problems";
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
    Compass,
    LineChart,
    Globe,
    PlaneTakeoff,
    CloudOff,
    MessageSquare,
    Route,
    Ticket,
    FileText,
    Settings,
    Instagram,
    Linkedin,
    Youtube,
    Briefcase,
    Map,
    CalendarDays,
    Clock,
    Sparkle
} from "lucide-react";

// Assuming imageLinks is a file like: export default { delhi: '...', kashmir: '...' }
// If not, replace with actual paths or import statements.
import img1Light1 from '../../public/1.jpg';
import img1Light2 from '../../public/2.jpg';
import img2Light1 from '../../public/3.jpg';
import img2Light2 from '../../public/4.jpg';
import img3Light from '../../public/5.jpg';
import img4Light from '../../public/WhatsApp Image 2025-08-13 at 17.13.54_5e0a8408.jpg';

const imageLinks = {
    delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80",
    kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
    goa: "/goa.jpeg", // Updated to use the public folder image
    varanasi: "https://upload.wikimedia.org/wikipedia/commons/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg",
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
    'bg-gradient-to-br from-[#37C2C4] to-[#37C2C4]',
        'bg-gradient-to-br from-blue-400 to-purple-600',
        'bg-gradient-to-br from-pink-400 to-red-600',
        'bg-gradient-to-br from-indigo-400 to-cyan-600',
        'bg-gradient-to-br from-green-400 to-teal-600',
    'bg-gradient-to-br from-[#37C2C4] to-[#37C2C4]'
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
    const [isTyping, setIsTyping] = useState(false);
    const [listening, setListening] = useState(false);
    const recognitionRef = React.useRef<any>(null);
    const router = useRouter();
    // Voice recognition setup
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setListening(false);
            };
            recognition.onend = () => setListening(false);
            recognition.onerror = () => setListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

    const handleMicClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (listening) {
            recognitionRef.current && recognitionRef.current.stop();
            setListening(false);
        } else {
            recognitionRef.current && recognitionRef.current.start();
            setListening(true);
        }
    };
    
    // Check authentication status on component mount
    useEffect(() => {
        // Check if user is signed in - using the correct token key from signin
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const jwt = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
        
        // Check for any common auth indicators
        const isAuthenticated = !!(token || authToken || user || accessToken || jwt);
        console.log('Auth check:', { token, authToken, user, accessToken, jwt, isAuthenticated });
        setIsSignedIn(isAuthenticated);
    }, []);
    
    const prompts = [
        "Plan a Spritual Journey for me",
        "Plan a weekend getaway to Goa", 
        "Best temples to visit in Varanasi",
        "Romantic honeymoon in Kerala",
        "Adventure trip to Leh-Ladakh",
        "Family vacation in Rajasthan",
        "Budget backpacking in Himachal",
        "Luxury stay in Mumbai hotels"
    ];

    // Only rotate prompts if user is not typing
    useEffect(() => {
        if (!inputValue && !isTyping) {
            const interval = setInterval(() => {
                setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [inputValue, prompts.length, isTyping]);

    // Waitlist: All prompt submissions go to coming soon
    // Prompt bar: always go to coming soon page
    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.push('/coming-soon');
    };

    // ...existing code before...
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
            }}
            className="w-full h-full flex items-center"
            onClick={(e) => e.stopPropagation()}
        >
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => {
                    if (!inputValue.trim()) {
                        setIsTyping(false);
                    }
                }}
                placeholder={prompts[currentPromptIndex]}
                className="w-full h-full text-lg text-gray-800 placeholder-[#37C2C4] bg-transparent border-none outline-none px-3 py-1 cursor-text"
                onClick={(e) => e.stopPropagation()}
            />
            {/* Microphone icons removed as requested */}
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
    // Request geolocation permission and store current location
    useEffect(() => {
        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    localStorage.setItem('current_location', JSON.stringify({ latitude, longitude }));
                },
                (error) => {
                    // Optionally handle error or fallback
                    console.warn('Geolocation error:', error);
                }
            );
        }
    }, []);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    // Add inputValue state for prompt bar
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Handle navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const jwt = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
        
        // Check for any common auth indicators
        const isAuthenticated = !!(token || authToken || user || accessToken || jwt);
        console.log('Main component auth check:', { token, authToken, user, accessToken, jwt, isAuthenticated });
        setIsSignedIn(isAuthenticated);
    }, []);

    const handleQuickAction = (query: string) => {
        // Re-check authentication status at the time of action
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const jwt = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
        
    // Always route to coming soon page for now
    router.push('/coming-soon');
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen antialiased relative overflow-x-hidden flex flex-col"
            style={{ backgroundColor: '#FCFAF8', color: '#333333' }}
        >
            {/* Fixed Transparent Navbar */}
            <nav
                className="fixed top-0 left-0 right-0 z-[9999] w-full"
                style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999
                }}
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-7xl mx-auto px-6 py-6"
                >
                    <div className="flex items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-gray-900 tracking-wide font-poppins">
                                
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#home" className="text-gray-700 hover:text-[#37C2C4] transition-colors duration-200 font-medium font-inter text-sm">HOME</a>
                            <a href="#how-it-works" className="text-gray-700 hover:text-[#37C2C4] transition-colors duration-200 font-medium font-inter text-sm">HOW IT WORKS</a>
                            <a href="#why-us" className="text-gray-700 hover:text-[#37C2C4] transition-colors duration-200 font-medium font-inter text-sm">WHY US</a>
                            <a href="#Create With us" className="text-gray-700 hover:text-[#37C2C4] transition-colors duration-200 font-medium font-inter text-sm">CREATE WITH US</a>
                            <a href="#Support" className="text-gray-700 hover:text-[#37C2C4] transition-colors duration-200 font-medium font-inter text-sm">CONTACT</a>
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:flex items-center">
                            <button
                                className="bg-[#37C2C4] hover:bg-[#37C2C4]/80 text-white px-6 py-2 rounded-full transition-colors duration-200 font-medium font-inter text-sm"
                                onClick={() => router.push('/waitlist-survey')}
                            >
                                Join the Waitlist
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button className="text-gray-700 hover:text-[#37C2C4] transition-colors duration-200">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </nav>



            {/* Main Content */}
            <main className="flex-grow pt-24" id="home">

                {/* Hero Section */}
                <motion.section
                    initial="initial"
                    animate="animate"
                    variants={fadeInUp}
                    className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-14 px-6 mb-2"
                >
                          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                              Discover India, <span className="text-[#37C2C4]">Your Way.</span>
                          </h1>
                          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed text-center">
                                 AI-powered travel assistant, tailored for you.
                          </p>
                        <div className="inline-block px-5.5 py-2.5 rounded-full bg-[#37C2C4]/10 text-[#37C2C4] font-bold text-xl mb-6" style={{ letterSpacing: '0.05em' }}>
                            Coming Soon
                        </div>
                    
                    {/* Search Section */}
                    <div className="max-w-4xl mx-auto mb-16">
                        {/* Main Search Bar */}
                        <div className="relative mb-8">
                            <div 
                                className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-4 hover:border-[#37C2C4] transition-colors cursor-pointer"
                                onClick={() => {
                                    const input = document.querySelector<HTMLInputElement>('input[type="text"]');
                                    const value = input?.value || "";
                                    const query = value || (typeof window !== 'undefined' ? input?.placeholder : "");
                                    if (query) {
                                        // Check if user is signed in with correct token key
                                        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                                        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                                        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
                                        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
                                        const jwt = localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
                                        
                                        const isAuthenticated = !!(token || authToken || user || accessToken || jwt);
                                        console.log('Search box click:', { token, authToken, user, accessToken, jwt, isAuthenticated, query });
                                        
                                        if (isAuthenticated) {
                                            // User is signed in, redirect directly to preferences
                                            console.log('Redirecting to preferences with query:', query);
                                            window.location.href = `/preferences?prompt=${encodeURIComponent(query)}`;
                                        } else {
                                            // Store the query in localStorage to use after sign-in
                                            console.log('Redirecting to signin, storing query:', query);
                                            localStorage.setItem('pendingQuery', query);
                                            // Redirect to sign-in page
                                            window.location.href = '/signin';
                                        }
                                    }
                                }}
                            >
                                <SearchInput />
                                <div className="flex items-center gap-2 ml-4">
                                    <button 
                                        aria-label="Voice input"
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the parent div's onClick from firing
                                            // Voice input logic here
                                        }}
                                    >
                                        <Mic className="w-5 h-5 text-gray-500 group-hover:text-[#37C2C4]" />
                                    </button>
                                    <button 
                                        className={`bg-[#37C2C4] hover:bg-[#37C2C4]/80 text-white rounded-full p-2.5 transition-all duration-200 hover:scale-105 ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        aria-label="Search"
                                        disabled={!inputValue.trim()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const input = document.querySelector<HTMLInputElement>('input[type="text"]');
                                            const value = input?.value || "";
                                            const query = value || (typeof window !== 'undefined' ? input?.placeholder : "");
                                            if (!query.trim()) return;
                                            // Always route to coming soon page for now
                                            window.location.href = '/coming-soon';
                                        }}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <button
                                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#37C2C4] text-gray-700 px-4 py-3 rounded-full transition-colors"
                                onClick={() => {
                                    const query = 'Create a new trip';
                                    localStorage.setItem('pendingQuery', query);
                                    window.location.href = '/waitlist-survey?prompt=' + encodeURIComponent(query);
                                }}
                            >
                                <span className="text-[#37C2C4]">✈️</span>
                                Create a new trip
                            </button>
                            <button
                                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#37C2C4] text-gray-700 px-4 py-3 rounded-full transition-colors"
                                onClick={() => {
                                    const query = 'Inspire me where to go';
                                    localStorage.setItem('pendingQuery', query);
                                    window.location.href = '/waitlist-survey?prompt=' + encodeURIComponent(query);
                                }}
                            >
                                <span className="text-[#37C2C4]">🗺️</span>
                                Inspire me where to go
                            </button>
                            <button
                                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#37C2C4] text-gray-700 px-4 py-3 rounded-full transition-colors"
                                onClick={() => {
                                    const query = 'Weekend getaways';
                                    localStorage.setItem('pendingQuery', query);
                                    window.location.href = '/waitlist-survey?prompt=' + encodeURIComponent(query);
                                }}
                            >
                                <span className="text-[#37C2C4]">🏖️</span>
                                Weekend getaways
                            </button>
                            <button
                                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#37C2C4] text-gray-700 px-4 py-3 rounded-full transition-colors"
                                onClick={() => {
                                    const query = 'Beautiful hotel in Dubai';
                                    localStorage.setItem('pendingQuery', query);
                                    window.location.href = '/waitlist-survey?prompt=' + encodeURIComponent(query);
                                }}
                            >
                                <span className="text-[#37C2C4]">🏨</span>
                                Beautiful stays
                            </button>
                        </div>

                        {/* See How It Works Link - removed for cleaner design */}
                    </div>
                </motion.section>
                                {/* Why Us Section */}
                <motion.section 
                    id="why-us"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp} 
                    className="pt-8 pb-16"
                >
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Why Choose <span style={{ color: '#37C2C4' }}>The Modern Chanakya</span>?
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Experience the difference of truly personalized travel with authentic local insights
                            </p>
                        </div>
                        
                        {/* Bento Grid UI */}
                        <BentoGridWhyUs />
                        
                        {/* Additional Features Grid */}
                        <motion.div 
                            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ color: '#37C2C4' }}>10,000+</div>
                                <div className="text-gray-600 text-xs">Curated Experiences</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ color: '#37C2C4' }}>500+</div>
                                <div className="text-gray-600 text-xs">Local Experts</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ color: '#37C2C4' }}>98%</div>
                                <div className="text-gray-600 text-xs">Satisfaction Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold mb-1" style={{ color: '#37C2C4' }}>24/7</div>
                                <div className="text-gray-600 text-xs">Support Available</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

               
                {/* How it Works Section */}
                <motion.section 
                    id="how-it-works"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp} 
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full py-16"
                    style={{ backgroundColor: '#FCFAF8' }}
                >
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                How It Works: Your Journey, <span className="text-[#37C2C4]">Unfolded</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                From idea to reality in three simple steps
                            </p>
                        </div>

                        {/* Flow Diagram with MinimalCard UI */}
                        <div className="relative">
                            {/* Desktop Layout */}
                            <div className="hidden lg:grid grid-cols-3 gap-8 relative">
                                {/* Step 1 */}
                                <motion.div 
                                    className="relative z-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <MinimalCard className="h-full">
                                        <MinimalCardImage 
                                            src="/1.jpeg"
                                            alt="Step 1 - Unveil Your Soul" 
                                        />
                                        <MinimalCardContent>
                                            <div className="mb-2" style={{ color: '#37C2C4', fontWeight: 'bold' }}>Step 1</div>
                                            <MinimalCardTitle>Unveil Your Soul</MinimalCardTitle>
                                            <MinimalCardDescription>
                                                Tell us what you love (Food, History, Art) in our fun, personalized onboarding.
                                            </MinimalCardDescription>
                                        </MinimalCardContent>
                                        <MinimalCardFooter>
                                            <div className="w-10 h-10 bg-[#37C2C4] rounded-full flex items-center justify-center">
                                                <Compass className="w-5 h-5 text-white" />
                                            </div>
                                        </MinimalCardFooter>
                                    </MinimalCard>
                                </motion.div>

                                {/* Step 2 */}
                                <motion.div 
                                    className="relative z-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <MinimalCard className="h-full">
                                        <MinimalCardImage 
                                            src="/22.jpeg"
                                            alt="Step 2 - Let Chanakya Weave the Path" 
                                        />
                                        <MinimalCardContent>
                                            <div className="mb-2" style={{ color: '#37C2C4', fontWeight: 'bold' }}>Step 2</div>
                                            <MinimalCardTitle>Let Chanakya Weave the Path</MinimalCardTitle>
                                            <MinimalCardDescription>
                                                Our AI instantly creates a bespoke itinerary from our database of authentic gems.
                                            </MinimalCardDescription>
                                        </MinimalCardContent>
                                        <MinimalCardFooter>
                                            <div className="w-10 h-10 bg-[#37C2C4] rounded-full flex items-center justify-center">
                                                <Settings className="w-5 h-5 text-white" />
                                            </div>
                                        </MinimalCardFooter>
                                    </MinimalCard>
                                </motion.div>

                                {/* Step 3 */}
                                <motion.div 
                                    className="relative z-10"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <MinimalCard className="h-full">
                                        <MinimalCardImage 
                                            src="/33.jpeg"
                                            alt="Step 3 - Discover & Do" 
                                        />
                                        <MinimalCardContent>
                                            <div className="mb-2" style={{ color: '#37C2C4', fontWeight: 'bold' }}>Step 3</div>
                                            <MinimalCardTitle>Discover & Do</MinimalCardTitle>
                                            <MinimalCardDescription>
                                                Experience India effortlessly with seamless navigation and direct booking for unique local experiences.
                                            </MinimalCardDescription>
                                        </MinimalCardContent>
                                        <MinimalCardFooter>
                                            <div className="w-10 h-10 bg-[#37C2C4] rounded-full flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                        </MinimalCardFooter>
                                    </MinimalCard>
                                </motion.div>
                            </div>

                            {/* Mobile Layout */}
                            <div className="lg:hidden space-y-8">
                                {[
                                    {
                                        icon: Compass,
                                        step: "Step 1",
                                        title: "Unveil Your Soul",
                                        description: "Tell us what you love (Food, History, Art) in our fun, personalized onboarding.",
                                        image: "/1.jpg",
                                        delay: 0.2
                                    },
                                    {
                                        icon: Settings,
                                        step: "Step 2", 
                                        title: "Let Chanakya Weave the Path",
                                        description: "Our AI instantly creates a bespoke itinerary from our database of authentic gems.",
                                        image: "/2.jpg",
                                        delay: 0.4
                                    },
                                    {
                                        icon: MapPin,
                                        step: "Step 3",
                                        title: "Discover & Do", 
                                        description: "Experience India effortlessly with seamless navigation and direct booking for unique local experiences.",
                                        image: "/3.jpg",
                                        delay: 0.6
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: item.delay }}
                                    >
                                        <MinimalCard>
                                            <MinimalCardImage 
                                                src={item.image}
                                                alt={`Step ${index + 1} - ${item.title}`}
                                            />
                                            <MinimalCardContent>
                                                <div className="mb-2" style={{ color: '#37C2C4', fontWeight: 'bold' }}>{item.step}</div>
                                                <MinimalCardTitle>{item.title}</MinimalCardTitle>
                                                <MinimalCardDescription>{item.description}</MinimalCardDescription>
                                            </MinimalCardContent>
                                            <MinimalCardFooter>
                                                <div className="w-10 h-10 bg-[#37C2C4] rounded-full flex items-center justify-center">
                                                    <item.icon className="w-5 h-5 text-white" />
                                                </div>
                                            </MinimalCardFooter>
                                        </MinimalCard>
                                        
                                        {/* Connecting Arrow for Mobile */}
                                        {index < 2 && (
                                            <div className="flex justify-center py-4">
                                                <ArrowRight className="w-6 h-6" style={{ color: '#37C2C4' }} />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Call to Action */}
                        <motion.div 
                            className="text-center mt-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <button className="bg-[#37C2C4] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#37C2C4]/80 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                Start Your Journey
                            </button>
                        </motion.div>
                    </div>
                </motion.section>


                 {/* Problems Travellers Face Section (Bento Grid Style) */}
                <motion.section 
                    id="traveller-problems"
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp} 
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full py-16"
                    style={{ backgroundColor: '#FCFAF8' }}
                >
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#37C2C4' }}>
                                Problems Current Travellers Face
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Real issues and frustrations experienced by modern explorers
                            </p>
                        </div>
                        <BentoGridProblems />
                    </div>
                </motion.section>

                {/* Get Inspired Section */}
                {/* <motion.section 
                    id="get-inspired"
                    initial="initial" 
                    whileInView="animate" 
                    viewport={{ once: true, amount: 0.2 }} 
                    variants={fadeInUp} 
                    className="py-24"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-6xl font-extrabold text-gray-900 text-center mb-4 tracking-tight">Get Inspired</h2>
                        <p className="text-xl text-gray-600 text-center mb-12">Immerse yourself in the colors and emotions of incredible India</p>
                        
                        <HoverExpand
                            images={[
                                "https://images.pexels.com/photos/30082445/pexels-photo-30082445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                                "https://images.unsplash.com/photo-1692606743169-e1ae2f0a960f?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                "https://assets.lummi.ai/assets/QmQLSBeCFHUwCv7WBpGr7T3P67UXaAw8B2vvmtKimyinrL?auto=format&w=1500",
                                "https://assets.lummi.ai/assets/QmXe6v7jBF5L2R7FCio8KQdXwTX2uqzRycUJapyjoXaTqd?auto=format&w=1500",
                                "https://assets.lummi.ai/assets/QmNfwUDpehZyLWzE8to7QzgbJ164S6fQy8JyUWemHtmShj?auto=format&w=1500",
                                "https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format",
                                "https://assets.lummi.ai/assets/Qmb2P6tF2qUaFXnXpnnp2sk9HdVHNYXUv6MtoiSq7jjVhQ?auto=format&w=1500",
                                "https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format",
                            ]}
                            initialSelectedIndex={0}
                            thumbnailHeight={200}
                            modalImageSize={400}
                            maxThumbnails={11}
                        />
                        
                        <div className="mt-16 text-center">
                            <p className="max-w-3xl mx-auto text-center text-lg text-gray-600 mb-8 leading-relaxed">
                                Each image tells a story of our rich heritage and breathtaking landscapes. Hover to explore vibrant traditions, ancient wonders, and scenic beauty that awaits your discovery.
                            </p>
                            <button className="bg-[#37C2C4] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#37C2C4]/80 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                Begin Your Journey
                            </button>
                        </div>
                    </div>
                </motion.section> */}
                
                {/* Indian Itineraries Section */}
                <motion.section 
                    id="itineraries"
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
                <motion.section id="testimonials" initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Travellers kya bol rahe hain?</h2>
                        <p className="text-gray-600 text-center mb-12 text-lg">1 million+ logon ne The Modern Chanakya try kiya hai aur sabko planning ka kaam asaan laga!</p>
                        <MarqueeTestimonials />
                    </div>
                </motion.section>
                {/* Contribute Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                    className="py-24"
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-1/2">
                                <div className="relative overflow-hidden rounded-xl shadow-xl">
                                    <Image 
                                        src="https://images.unsplash.com/photo-1534531409543-069f6204c5b4?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                        alt="Beautiful lake with mountains" 
                                        width={600} 
                                        height={1000} 
                                        className="object-cover w-full h-[500px]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8">
                                        <h3 className="text-2xl font-bold text-white mb-2">Share Your Hidden Gems</h3>
                                        <p className="text-white/90 text-sm">Help fellow travelers discover authentic experiences</p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Contribute to a <span style={{ color: '#37C2C4' }}>Legacy</span>. <br />
                                    <span style={{ color: '#37C2C4', fontWeight: 'bold' }}>Become a Modern Chanakya Lorekeeper.</span>
                                </h2>

                                <div className="space-y-8 mt-8">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-full" style={{ background: '#37C2C420' }}>
                                            <Sparkle className="w-6 h-6" style={{ color: '#37C2C4' }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Share Your Passion</h3>
                                            <p className="text-gray-600">
                                                Do you know Delhi's best-kept secrets? The Modern Chanakya is built on local wisdom, and we believe your discoveries deserve to be shared.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-full" style={{ background: '#37C2C420' }}>
                                            <Users className="w-6 h-6" style={{ color: '#37C2C4' }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Join the Community</h3>
                                            <p className="text-gray-600">
                                                Join our community of 'Lorekeepers' to earn recognition and rewards for contributing unique, unbookable hidden gems and wise traveler tips.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-full" style={{ background: '#37C2C420' }}>
                                            <Globe className="w-6 h-6" style={{ color: '#37C2C4' }} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Empower Communities</h3>
                                            <p className="text-gray-600">
                                                Help us build India's most authentic travel resource and empower local communities through responsible tourism.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <button className="bg-[#37C2C4] hover:bg-[#37C2C4]/80 text-white font-medium rounded-full px-8 py-3">
                                        Coming Soon
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

            </main>
                            {/* FAQ Section */}
                            <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24">
                                <div className="max-w-3xl mx-auto px-6">
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10" style={{ color: '#37C2C4' }}>FAQs – Sawal Jo Aksar Puchte Hain</h2>
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

                            {/* Footer - Only support email */}
                            <footer className="bg-white border-t border-gray-200/80 mt-12">
                                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center">
                                    <p className="text-gray-500 text-sm mb-4">© {new Date().getFullYear()} The Modern Chanakya. All rights reserved.</p>
                                    <a href="mailto:humans@tmchanakya.com" className="text-[#37C2C4] font-medium text-sm">humans@tmchanakya.com</a>
                                </div>
                            </footer>
                        </motion.div>
                    );
                }