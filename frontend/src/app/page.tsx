"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere } from '@react-three/drei';
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


// Animation Variants
const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardHover = {
    scale: 1.03,
    transition: { duration: 0.3 }
};


// FAQ Component
const Accordion = ({ question, answer }) => {
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
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased relative overflow-x-hidden flex flex-col">
            {/* 3D Animated Background */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[10, 10, 5]} intensity={0.5} />
                    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
                        <Sphere args={[1.5, 64, 64]}>
                            <meshStandardMaterial color="#c2995e" wireframe={true} metalness={0.6} roughness={0.4} />
                        </Sphere>
                    </Float>
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
                </Canvas>
            </div>

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
                <button
                    onClick={() => router.push("/preferences")}
                    className="px-5 py-2.5 rounded-full bg-amber-500 text-white font-semibold shadow-sm hover:bg-amber-600 transition-all text-sm flex items-center gap-2"
                >
                    Get Started <ArrowRight size={16} />
                </button>
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
                        Namaste! <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">Welcome to The Modern Chanakya</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Planning a trip? Chalo, let us help you! Get super-personalized, Indian-style travel itineraries delivered instantly.<br />
                        Discover, plan, and experience travel like never before – all with a desi touch.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                        <button onClick={() => router.push("/preferences")}
                            className="px-8 py-3.5 rounded-full bg-amber-500 text-white font-semibold shadow-sm hover:bg-amber-600 transition-all text-base">Start Your Yatra</button>
                        <button className="px-8 py-3.5 rounded-full bg-gray-200 text-gray-800 font-semibold shadow-sm hover:bg-gray-300 transition-all text-base">See How It Works</button>
                    </div>
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
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="w-full py-24 bg-white">
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
                                    {['🏖️ Beach', '🏛️ History', '🍽️ Dining', '🧖‍♀️ Spa', '🐦 Wildlife', '🚴‍♂️ Cycling'].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-md border border-gray-100"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 100 }}
                                            style={{
                                                top: `${50 + 40 * Math.sin(i * (Math.PI / 3))}%`,
                                                left: `${50 + 40 * Math.cos(i * (Math.PI / 3))}%`,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            <span className="text-sm font-medium text-gray-700">{item}</span>
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
                                <motion.div key={card.title} variants={fadeInUp} whileHover={cardHover} className="relative rounded-2xl overflow-hidden group h-80">
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
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Apni Next Indian Adventure Yahin Dhoondo!</h2>
                        <p className="text-gray-600 text-center mb-12 text-lg">Yahan milenge asli travellers ke banaye hue, ready-made itineraries. Bas ek click, aur nikal pado apni dream trip par!</p>
                        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { href: "/itineraries/delhi-agra-golden-triangle", img: imageLinks.delhi, title: "Golden Triangle: Delhi, Agra & Jaipur", desc: "A classic 7-day itinerary covering India's most iconic sights: Taj Mahal, Red Fort, Amber Fort, and more.", userImg: imageLinks.userAmit, userName: "Amit", views: "12.3k", likes: 210 },
                                { href: "/itineraries/kerala-backwaters", img: imageLinks.kerala, title: "Kerala Backwaters & Beaches", desc: "Relax on a houseboat, explore Alleppey, and unwind on Kerala's stunning beaches in this 5-day trip.", userImg: imageLinks.userPriya, userName: "Priya", views: "8.9k", likes: 175 },
                                { href: "/itineraries/goa-party-relax", img: imageLinks.goa, title: "Goa: Party & Relax", desc: "A 4-day itinerary for the best of Goa: beaches, nightlife, and hidden gems for relaxation and fun.", userImg: imageLinks.userRahul, userName: "Rahul", views: "6.7k", likes: 120 },
                                { href: "/itineraries/varanasi-spiritual", img: imageLinks.varanasi, title: "Varanasi: Spiritual Journey", desc: "Experience the Ganga Aarti, explore ancient temples, and soak in the spiritual vibe of Varanasi in 3 days.", userImg: imageLinks.userMeera, userName: "Meera", views: "5.2k", likes: 98 },
                            ].map(card => (
                                <motion.a key={card.title} href={card.href} variants={fadeInUp} whileHover={cardHover} className="rounded-2xl overflow-hidden bg-white flex flex-col border border-gray-200/80 group">
                                    <div className="h-56 overflow-hidden">
                                        <Image src={card.img} alt={card.title} width={600} height={224} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 flex-grow">{card.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{card.desc}</p>
                                        <div className="flex items-center gap-2 mt-auto text-sm text-gray-500">
                                            <Image src={card.userImg} alt={card.userName} width={28} height={28} className="w-7 h-7 rounded-full object-cover" unoptimized />
                                            <span className="font-semibold text-gray-800">{card.userName}</span>
                                            <span className="flex items-center gap-1 ml-auto"><Eye size={14} /> {card.views}</span>
                                            <span className="flex items-center gap-1"><Heart size={14} /> {card.likes}</span>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Testimonials Section */}
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-4">Travellers kya bol rahe hain?</h2>
                        <p className="text-gray-600 text-center mb-12 text-lg">1 million+ logon ne The Modern Chanakya try kiya hai aur sabko planning ka kaam asaan laga!</p>
                        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[
                                { img: imageLinks.userNadia, name: "Nadia", handle: "Travel Blogger", review: "Planning your trip by having all the attractions already plugged into a map makes trip planning so much easier." },
                                { name: "Sharon Brewster", review: "amazing app! easy to use, love the AI functionality." },
                                { img: imageLinks.userJayson, name: "Jayson Oite", review: "It seems to be this is my new travel app buddy. Very handy, convenient and very easy to use." },
                                { img: imageLinks.userErica, name: "Erica Franco", review: "Absolutely love this app! It is so helpful when planning my trips. I especially love The optimize route option..." },
                                { img: imageLinks.userBelinda, name: "Belinda Kohles", review: "I have used several trip planning apps. This one by far is the best. The interaction between google maps makes the planning so much easier..." },
                                { name: "Lydia Yang", handle: "Founder @LydiaScapes", review: "So much easier to visualize and plan a road trip to my favourite rock climbing destinations and explore the area around." },
                                { name: "A. Rosa", review: "I absolutely love this app!!! I would recommend to anyone who is seriously planning a trip." },
                                { img: imageLinks.userJorge, name: "Jorge D.", review: "It left me speechless that I can add places to my trip and they get automatically populated with a featured pic and description." },
                            ].map((t, i) => (
                                <motion.div key={i} variants={fadeInUp} className="bg-white rounded-2xl border border-gray-200/80 p-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        {t.img ? <Image src={t.img} alt={t.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
                                            : <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">{t.name[0]}</div>
                                        }
                                        <div>
                                            <div className="font-bold text-gray-900">{t.name}</div>
                                            {t.handle && <div className="text-xs text-gray-500">{t.handle}</div>}
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 text-amber-500">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{t.review}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Featured Travel Creators Section */}
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24 bg-white">
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
                <motion.section initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24 bg-white">
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
            <footer className="w-full bg-white border-t border-gray-200/80 pt-16 pb-8 px-6 md:px-12">
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
        </div>
    );
}