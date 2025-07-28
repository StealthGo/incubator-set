"use client";

import { useRouter } from "next/navigation";
import { SiInstagram, SiLinkedin, SiYoutube, SiPinterest, SiReddit } from "react-icons/si";
import Image from "next/image";
import imageLinks from '../imageLinks';
import { motion } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Icosahedron } from '@react-three/drei';

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 font-sans relative overflow-x-hidden flex flex-col">
      {/* 3D Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-60">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={0.7} />
          <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
            <Icosahedron args={[2, 1]}>
              <meshStandardMaterial color="#fbbf24" wireframe={false} metalness={0.3} roughness={0.7} />
            </Icosahedron>
          </Float>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
        </Canvas>
      </div>
      {/* Google Material Icons CDN */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-12 py-6 bg-white fixed top-0 left-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="material-icons text-yellow-500 text-2xl">travel_explore</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">The Modern <span className="text-yellow-500">Chanakya</span></span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/preferences")}
            className="px-5 py-2 rounded-full bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition-all text-sm"
          >
            Get Started
          </button>
        </div>
      </nav>
      {/* Main Content */}
      <motion.section
        className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center pt-40 pb-20 px-6 md:px-0 text-center"
        style={{ marginBottom: '5rem' }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
          Namaste! <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-yellow-500">Welcome to The Modern Chanakya</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Planning a trip? Chalo, let us help you! Get super-personalized, Indian-style travel itineraries delivered instantly.<br />
          Discover, plan, and experience travel like never before – all with a desi touch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
          <button onClick={() => router.push("/preferences")}
            className="px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition-all text-lg">Start Your Yatra</button>
          <button className="px-8 py-3 rounded-full bg-gray-200 text-gray-900 font-semibold shadow hover:bg-gray-300 transition-all text-lg">See How It Works</button>
        </div>
        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 mt-2 justify-center items-center w-full">
          <div className="flex items-center gap-2">
            <span className="material-icons text-yellow-500 text-xl">explore</span>
            <span className="font-semibold text-gray-900">5,000+ <span className="font-normal text-gray-500">Trips Planned</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons text-yellow-500 text-xl">groups</span>
            <span className="font-semibold text-gray-900">2,000+ <span className="font-normal text-gray-500">Happy Travellers</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons text-yellow-500 text-xl">star_rate</span>
            <span className="font-semibold text-gray-900">4.9/5 <span className="font-normal text-gray-500">Avg. Rating</span></span>
          </div>
        </div>
      </motion.section>
      {/* How it Works Section */}
      <motion.section
        className="w-full flex flex-col items-center justify-center py-28 bg-white"
        style={{ marginBottom: '5rem' }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
      >
        <h2 className="text-5xl font-extrabold text-gray-900 text-center mb-12">How it Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-12 px-4">
          {/* Left Side */}
          <div className="flex-1 flex flex-col items-start justify-center max-w-md">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Start chatting<br/>with us.</h3>
            <p className="text-lg text-gray-700 mb-6">Ask us for suggestions for any destination or ask us for an entire itinerary. Be as specific as you can about the types of experiences that you like or take our quiz to determine your travel style.</p>
          </div>
          {/* Right Side - Cluster of images and chat */}
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[420px]">
            {/* Clustered Images with Labels */}
            <div className="relative w-[370px] h-[320px] flex items-center justify-center">
              {/* Spa/Wellness */}
              <div className="absolute left-0 top-4 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80" alt="Spa" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🧖‍♀️ Spa / Wellness</span>
              </div>
              {/* Theater */}
              <div className="absolute right-0 top-0 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=80&h=80" alt="Theater" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🎭 Theater</span>
              </div>
              {/* Beach */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=facearea&w=80&h=80" alt="Beach" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🏖️ Beach</span>
              </div>
              {/* Wildlife */}
              <div className="absolute right-0 top-24 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=80&h=80" alt="Wildlife" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🐦 Wildlife</span>
              </div>
              {/* Resorts */}
              <div className="absolute left-12 top-32 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=facearea&w=80&h=80" alt="Resorts" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🏡 Resorts</span>
              </div>
              {/* Center User */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <Image src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" width={80} height={80} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl" unoptimized />
              </div>
              {/* Fine Dining */}
              <div className="absolute right-8 top-40 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1516685018646-5499d0a7d42f?auto=format&fit=facearea&w=80&h=80" alt="Fine Dining" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🍽️ Fine Dining</span>
              </div>
              {/* Historical Tours */}
              <div className="absolute left-0 bottom-8 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=facearea&w=80&h=80" alt="Historical Tours" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🏛️ Historical Tours</span>
              </div>
              {/* Cycling */}
              <div className="absolute left-32 bottom-0 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=facearea&w=80&h=80" alt="Cycling" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🚴‍♂️ Cycling</span>
              </div>
              {/* Water Sports */}
              <div className="absolute right-0 bottom-0 flex flex-col items-center">
                <Image src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=facearea&w=80&h=80" alt="Water Sports" width={64} height={64} className="w-16 h-16 rounded-xl object-cover shadow-lg" unoptimized />
                <span className="mt-2 px-3 py-1 bg-white rounded-full shadow text-sm font-medium flex items-center gap-1">🤿 Water Sports</span>
              </div>
            </div>
            {/* Chat Input Box */}
            <div className="w-[370px] mt-8 bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 border border-gray-200">
              <span className="material-icons text-gray-400 mr-2">add_circle_outline</span>
              <input type="text" placeholder="Ask us anything..." className="flex-1 outline-none border-none bg-transparent text-gray-700 text-base" disabled />
              <span className="material-icons text-gray-400 mx-2">mic_none</span>
              <button className="bg-gray-900 text-white rounded-full p-2 ml-2 hover:bg-gray-800 transition-all">
                <span className="material-icons">send</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>
      {/* Get Inspired Section */}
      <motion.section
        className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
      >
        <h2 className="text-6xl font-extrabold text-gray-900 text-center mb-4 font-sans tracking-tight">Get inspired.</h2>
        <p className="text-xl text-gray-700 text-center mb-12">Explore India’s wonders, curated by AI and crafted for you.</p>
        <div className="max-w-2xl mx-auto text-center text-lg text-gray-600 mb-12">
          Incredible India, Infinite Possibilities.<br />
          From the mighty Himalayas to the vibrant streets of Mumbai, The Modern Chanakya is your AI-powered travel companion—designed by Indians, for Indians, right here in India.<br />
          Discover hidden gems, iconic landmarks, and authentic experiences across Bharat. Let our smart platform recommend journeys that match your vibe, your pace, and your dreams.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="relative rounded-2xl overflow-hidden shadow bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform h-72">
            <Image src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Kashmir" width={600} height={400} className="absolute inset-0 w-full h-full object-cover" unoptimized />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
              <span className="font-bold text-white text-lg drop-shadow">Kashmir: Heaven on Earth</span><br />
              <span className="text-white text-sm">Sail Dal Lake at sunrise</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="relative rounded-2xl overflow-hidden shadow bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform h-72">
            <Image src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80" alt="Jaipur" width={600} height={400} className="absolute inset-0 w-full h-full object-cover" unoptimized />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
              <span className="font-bold text-white text-lg drop-shadow">Jaipur: Royal Heritage & Pink Hues</span><br />
              <span className="text-white text-sm">Live the royal life in Jaipur</span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="relative rounded-2xl overflow-hidden shadow bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform h-72">
            <Image src="https://images.unsplash.com/photo-1516685018646-5499d0a7d42f?auto=format&fit=crop&w=600&q=80" alt="Goa" width={600} height={400} className="absolute inset-0 w-full h-full object-cover" unoptimized />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
              <span className="font-bold text-white text-lg drop-shadow">Goa: Beaches, Bazaars & Beyond</span><br />
              <span className="text-white text-sm">Unwind on Goa’s golden sands</span>
            </div>
          </div>
          {/* Card 4 */}
          <div className="relative rounded-2xl overflow-hidden shadow bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform h-72">
            <Image src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80" alt="Kerala" width={600} height={400} className="absolute inset-0 w-full h-full object-cover" unoptimized />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
              <span className="font-bold text-white text-lg drop-shadow">Kerala: Backwaters & Bliss</span><br />
              <span className="text-white text-sm">Cruise Kerala’s tranquil backwaters</span>
            </div>
          </div>
          {/* Card 5 */}
          <div className="relative rounded-2xl overflow-hidden shadow bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform h-72">
            <Image src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" alt="Varanasi" width={600} height={400} className="absolute inset-0 w-full h-full object-cover" unoptimized />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
              <span className="font-bold text-white text-lg drop-shadow">Varanasi: Spiritual Soul of India</span><br />
              <span className="text-white text-sm">Witness the Ganga Aarti in Varanasi</span>
            </div>
          </div>
          {/* Card 6 */}
          <div className="relative rounded-2xl overflow-hidden shadow bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform h-72">
            <Image src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" alt="Leh-Ladakh" width={600} height={400} className="absolute inset-0 w-full h-full object-cover" unoptimized />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
              <span className="font-bold text-white text-lg drop-shadow">Leh-Ladakh: Adventure Awaits</span><br />
              <span className="text-white text-sm">Ride the passes of Ladakh</span>
            </div>
          </div>
          {/* Card 7 */}
          <div className="relative rounded-2xl overflow-hidden shadow bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform h-72">
            <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" alt="Rann of Kutch" width={600} height={400} className="absolute inset-0 w-full h-full object-cover" unoptimized />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
              <span className="font-bold text-white text-lg drop-shadow">Rann of Kutch: White Desert Magic</span><br />
              <span className="text-white text-sm">Experience the Rann Utsav</span>
            </div>
          </div>
          {/* Card 8 */}
          <div className="relative rounded-2xl overflow-hidden shadow bg-white flex flex-col cursor-pointer hover:scale-105 transition-transform h-72">
            <Image src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80" alt="Meghalaya" width={600} height={400} className="absolute inset-0 w-full h-full object-cover" unoptimized />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
              <span className="font-bold text-white text-lg drop-shadow">Meghalaya: Abode of Clouds</span><br />
              <span className="text-white text-sm">Chase waterfalls in Meghalaya</span>
            </div>
          </div>
        </div>
      </motion.section>
      {/* Indian Itineraries Section */}
      <motion.section
        className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-2">Apni Next Indian Adventure Yahin Dhoondo!</h2>
        <p className="text-gray-600 text-center mb-8">Yahan milenge asli travellers ke banaye hue, ready-made itineraries. Bas ek click, aur nikal pado apni dream trip par!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Card 1: Delhi & Agra */}
          <a href="/itineraries/delhi-agra-golden-triangle" className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col hover:scale-105 transition-transform">
            <Image src={imageLinks.delhi} alt="Delhi & Agra" width={600} height={224} className="w-full h-56 object-cover" unoptimized />
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-bold text-lg text-gray-900 mb-1">Golden Triangle: Delhi, Agra & Jaipur</div>
              <div className="text-gray-600 text-sm mb-3 flex-1">A classic 7-day itinerary covering India&apos;s most iconic sights: Taj Mahal, Red Fort, Amber Fort, and more.</div>
              <div className="flex items-center gap-2 mt-auto">
                <Image src={imageLinks.userAmit} alt="Amit" width={28} height={28} className="w-7 h-7 rounded-full object-cover" unoptimized />
                <span className="font-semibold text-gray-800 text-sm">Amit</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><span className="material-icons text-base">visibility</span> 12,300</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><span className="material-icons text-base">favorite</span> 210</span>
              </div>
            </div>
          </a>
          {/* Card 2: Kerala Backwaters */}
          <a href="/itineraries/kerala-backwaters" className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col hover:scale-105 transition-transform">
            <Image src={imageLinks.kerala} alt="Kerala Backwaters" width={600} height={224} className="w-full h-56 object-cover" unoptimized />
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-bold text-lg text-gray-900 mb-1">Kerala Backwaters & Beaches</div>
              <div className="text-gray-600 text-sm mb-3 flex-1">Relax on a houseboat, explore Alleppey, and unwind on Kerala&apos;s stunning beaches in this 5-day trip.</div>
              <div className="flex items-center gap-2 mt-auto">
                <Image src={imageLinks.userPriya} alt="Priya" width={28} height={28} className="w-7 h-7 rounded-full object-cover" unoptimized />
                <span className="font-semibold text-gray-800 text-sm">Priya</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><span className="material-icons text-base">visibility</span> 8,900</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><span className="material-icons text-base">favorite</span> 175</span>
              </div>
            </div>
          </a>
          {/* Card 3: Goa */}
          <a href="/itineraries/goa-party-relax" className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col hover:scale-105 transition-transform">
            <Image src={imageLinks.goa} alt="Goa" width={600} height={224} className="w-full h-56 object-cover" unoptimized />
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-bold text-lg text-gray-900 mb-1">Goa: Party & Relax</div>
              <div className="text-gray-600 text-sm mb-3 flex-1">A 4-day itinerary for the best of Goa: beaches, nightlife, and hidden gems for relaxation and fun.</div>
              <div className="flex items-center gap-2 mt-auto">
                <Image src={imageLinks.userRahul} alt="Rahul" width={28} height={28} className="w-7 h-7 rounded-full object-cover" unoptimized />
                <span className="font-semibold text-gray-800 text-sm">Rahul</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><span className="material-icons text-base">visibility</span> 6,700</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><span className="material-icons text-base">favorite</span> 120</span>
              </div>
            </div>
          </a>
          {/* Card 4: Varanasi */}
          <a href="/itineraries/varanasi-spiritual" className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col hover:scale-105 transition-transform">
            <Image src={imageLinks.varanasi} alt="Varanasi" width={600} height={224} className="w-full h-56 object-cover" unoptimized />
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-bold text-lg text-gray-900 mb-1">Varanasi: Spiritual Journey</div>
              <div className="text-gray-600 text-sm mb-3 flex-1">Experience the Ganga Aarti, explore ancient temples, and soak in the spiritual vibe of Varanasi in 3 days.</div>
              <div className="flex items-center gap-2 mt-auto">
                <Image src={imageLinks.userMeera} alt="Meera" width={28} height={28} className="w-7 h-7 rounded-full object-cover" unoptimized />
                <span className="font-semibold text-gray-800 text-sm">Meera</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><span className="material-icons text-base">visibility</span> 5,200</span>
                <span className="text-gray-400 text-xs flex items-center gap-1"><span className="material-icons text-base">favorite</span> 98</span>
              </div>
            </div>
          </a>
        </div>
      </motion.section>
      {/* Testimonials Section */}
      <motion.section
        className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-2">Travellers kya bol rahe hain?</h2>
        <p className="text-gray-600 text-center mb-8">1 million+ logon ne The Modern Chanakya try kiya hai aur sabko planning ka kaam asaan laga!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Testimonial Card 1 */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <Image src={imageLinks.userNadia} alt="Nadia" width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
              <div>
                <div className="font-bold text-gray-900">Nadia</div>
                <div className="text-xs text-gray-500">Travel Blogger @Couple Tr...</div>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-1">{`★★★★★`.split("")}</div>
            <div className="text-gray-700 text-sm">Planning your trip by having all the attractions already plugged into a map makes trip planning so much easier.</div>
          </div>
          {/* Testimonial Card 2 */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">S</div>
              <div>
                <div className="font-bold text-gray-900">Sharon Brewster</div>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-1">{`★★★★★`.split("")}</div>
            <div className="text-gray-700 text-sm">amazing app! easy to use, love the AI functionality.</div>
          </div>
          {/* Testimonial Card 3 */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <Image src={imageLinks.userJayson} alt="Jayson Oite" width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
              <div>
                <div className="font-bold text-gray-900">Jayson Oite</div>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-1">{`★★★★★`.split("")}</div>
            <div className="text-gray-700 text-sm">It seems to be this is my new travel app buddy. Very handy, convenient and very easy to use. It also recommends tourist destinations and nearby places. Kudos to the programmer.</div>
          </div>
          {/* Testimonial Card 4 */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <Image src={imageLinks.userErica} alt="Erica Franco" width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
              <div>
                <div className="font-bold text-gray-900">Erica Franco</div>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-1">{`★★★★★`.split("")}</div>
            <div className="text-gray-700 text-sm">Absolutely love this app! It is so helpful when planning my trips. I especially love The optimize route option...</div>
          </div>
          {/* Testimonial Card 5 */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <Image src={imageLinks.userBelinda} alt="Belinda and Kathy Kohles" width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
              <div>
                <div className="font-bold text-gray-900">Belinda and Kathy Kohles</div>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-1">{`★★★★★`.split("")}</div>
            <div className="text-gray-700 text-sm">I have used several trip planning apps. This one by far is the best. The interaction between google maps makes the planning so much easier...</div>
          </div>
          {/* Testimonial Card 6 */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">L</div>
              <div>
                <div className="font-bold text-gray-900">Lydia Yang</div>
                <div className="text-xs text-gray-500">Founder @LydiaScapes Ad...</div>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-1">{`★★★★★`.split("")}</div>
            <div className="text-gray-700 text-sm">So much easier to visualize and plan a road trip to my favourite rock climbing destinations and explore the area around.</div>
          </div>
          {/* Testimonial Card 7 */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">A</div>
              <div>
                <div className="font-bold text-gray-900">A. Rosa</div>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-1">{`★★★★★`.split("")}</div>
            <div className="text-gray-700 text-sm">I absolutely love this app!!! I would recommend to anyone who is seriously planning a trip. It will take you through their entire process with ease and all the...</div>
          </div>
          {/* Testimonial Card 8 */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <Image src={imageLinks.userJorge} alt="Jorge D." width={40} height={40} className="w-10 h-10 rounded-full object-cover" unoptimized />
              <div>
                <div className="font-bold text-gray-900">Jorge D.</div>
              </div>
            </div>
            <div className="flex gap-1 text-yellow-500 mb-1">{`★★★★★`.split("")}</div>
            <div className="text-gray-700 text-sm">It left me speechless that I can add places to my trip and they get automatically populated with a featured pic and description from the web.</div>
          </div>
        </div>
      </motion.section>
      {/* Featured Travel Creators Section */}
      <motion.section
        className="w-full max-w-7xl mx-auto px-4 md:px-0 mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-700 text-center mb-2">Featured Travel Creators</h2>
        <p className="text-gray-600 text-center mb-8">Follow these amazing Indian travellers and check out their favourite itineraries!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Creator 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
            <Image src={imageLinks.userRohit} alt="Rohit Sharma" width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-yellow-200" unoptimized />
            <div className="font-bold text-lg text-gray-900 mb-1">Rohit Sharma</div>
            <div className="text-yellow-600 text-sm mb-2">@rohit_traveldiaries</div>
            <div className="text-gray-600 text-sm mb-4">Solo backpacker, chai lover, and Himalaya explorer. Sharing desi hacks for budget travel!</div>
            <a href="/itineraries/leh-ladakh-rohit" className="block w-full rounded-xl overflow-hidden shadow border border-gray-100 hover:scale-105 transition mb-2">
              <Image src={imageLinks.lehLadakh} alt="Leh Ladakh" width={128} height={128} className="w-full h-32 object-cover" unoptimized />
              <div className="p-3 bg-gray-50 text-gray-900 font-semibold">Leh-Ladakh Road Trip</div>
            </a>
          </div>
          {/* Creator 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
            <Image src={imageLinks.userAnanya} alt="Ananya Singh" width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-yellow-200" unoptimized />
            <div className="font-bold text-lg text-gray-900 mb-1">Ananya Singh</div>
            <div className="text-yellow-600 text-sm mb-2">@ananya_wanders</div>
            <div className="text-gray-600 text-sm mb-4">Foodie, vlogger, and city explorer. Loves finding hidden gems in every Indian city!</div>
            <a href="/itineraries/kolkata-food-ananya" className="block w-full rounded-xl overflow-hidden shadow border border-gray-100 hover:scale-105 transition mb-2">
              <Image src={imageLinks.kolkata} alt="Kolkata Food Trail" width={128} height={128} className="w-full h-32 object-cover" unoptimized />
              <div className="p-3 bg-gray-50 text-gray-900 font-semibold">Kolkata Food Trail</div>
            </a>
          </div>
          {/* Creator 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
            <Image src={imageLinks.userSiddharth} alt="Siddharth Mehra" width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-yellow-200" unoptimized />
            <div className="font-bold text-lg text-gray-900 mb-1">Siddharth Mehra</div>
            <div className="text-yellow-600 text-sm mb-2">@sid_on_the_road</div>
            <div className="text-gray-600 text-sm mb-4">Adventure junkie, biker, and storyteller. Always ready for the next road trip!</div>
            <a href="/itineraries/spiti-valley-sid" className="block w-full rounded-xl overflow-hidden shadow border border-gray-100 hover:scale-105 transition mb-2">
              <Image src={imageLinks.spitiValley} alt="Spiti Valley" width={128} height={128} className="w-full h-32 object-cover" unoptimized />
              <div className="p-3 bg-gray-50 text-gray-900 font-semibold">Spiti Valley Adventure</div>
            </a>
          </div>
        </div>
      </motion.section>
      {/* FAQ Section */}
      <motion.section
        className="w-full max-w-3xl mx-auto px-4 md:px-0 mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-700 text-center mb-6">FAQs – Sawal Jo Aksar Puchte Hain</h2>
        <div className="space-y-4">
          {/* Q1 */}
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-lg cursor-pointer text-gray-900 group-open:text-yellow-700">How does The Modern Chanakya work?</summary>
            <div className="mt-2 text-gray-700">Bilkul simple hai! Bas apni preferences batao, aur hum aapke liye ek dum personalized itinerary bana denge – Indian style mein, with all the local masala.</div>
          </details>
          {/* Q2 */}
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-lg cursor-pointer text-gray-900 group-open:text-yellow-700">Is The Modern Chanakya free?</summary>
            <div className="mt-2 text-gray-700">Haanji, abhi ke liye bilkul free hai! Aap jitni chahe itineraries bana sakte ho, bina kisi charge ke.</div>
          </details>
          {/* Q3 */}
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-lg cursor-pointer text-gray-900 group-open:text-yellow-700">Can I get itineraries for my family or group?</summary>
            <div className="mt-2 text-gray-700">Bilkul! Family trip ho ya dosto ke saath masti, bas preferences mein batao kaun jaa raha hai, aur itinerary usi hisaab se milegi.</div>
          </details>
          {/* Q4 */}
          <details className="bg-white rounded-xl shadow p-5 group">
            <summary className="font-semibold text-lg cursor-pointer text-gray-900 group-open:text-yellow-700">How do I get support if I’m stuck?</summary>
            <div className="mt-2 text-gray-700">Koi dikkat aaye? Hum yahin hain! Niche contact section ya WhatsApp pe message karo, jaldi reply milega.</div>
          </details>
        </div>
      </motion.section>
      {/* Newsletter Signup / WhatsApp Updates Section */}
      <motion.section
        className="w-full max-w-3xl mx-auto px-4 md:px-0 mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.7 }}
      >
        <div className="bg-yellow-50 rounded-2xl p-8 flex flex-col items-center text-center shadow">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-700 mb-2">Get Travel Gyaan in Your Inbox or WhatsApp!</h2>
          <p className="text-gray-700 mb-6">Subscribe for desi travel tips, exclusive deals, and itinerary inspiration. No bakwaas, only useful gyaan!</p>
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-xl justify-center">
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900" />
            <input type="text" placeholder="WhatsApp number (optional)" className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900" />
            <button type="submit" className="px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition-all text-lg">Subscribe</button>
          </form>
          <div className="text-xs text-gray-500 mt-2">We respect your privacy. No spam, promise!</div>
        </div>
      </motion.section>
      {/* Pro Features Section */}
      <motion.section
        className="w-full max-w-6xl mx-auto px-4 md:px-0 mt-32 mb-32"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.8 }}
      >
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-2">Upgrade Your Yatra with Stealth Pro</h2>
        <p className="text-gray-600 text-center mb-10">Unlock the full power of The Modern Chanakya with Pro features – made for Indian travellers who want more convenience, savings, and peace of mind!</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 items-start shadow">
            <span className="material-icons text-3xl text-yellow-600 mb-2">flight_takeoff</span>
            <div className="font-bold text-lg text-gray-900">Live Train & Flight Updates</div>
            <div className="text-gray-600">Get instant alerts for IRCTC trains and flights – no more last-minute surprises, boss!</div>
          </div>
          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 items-start shadow">
            <span className="material-icons text-3xl text-yellow-600 mb-2">cloud_off</span>
            <div className="font-bold text-lg text-gray-900">Offline Access</div>
            <div className="text-gray-600">No network? No tension! Download your itinerary and access it anywhere, even in the mountains.</div>
          </div>
          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 items-start shadow">
            <span className="material-icons text-3xl text-yellow-600 mb-2">support_agent</span>
            <div className="font-bold text-lg text-gray-900">WhatsApp Support</div>
            <div className="text-gray-600">Kuch bhi doubt ho? Message us on WhatsApp for quick help – like a travel buddy in your pocket.</div>
          </div>
          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 items-start shadow">
            <span className="material-icons text-3xl text-yellow-600 mb-2">alt_route</span>
            <div className="font-bold text-lg text-gray-900">Route Optimization</div>
            <div className="text-gray-600">Save time and petrol! Get the best route for your road trips, auto-arranged for you.</div>
          </div>
          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 items-start shadow">
            <span className="material-icons text-3xl text-yellow-600 mb-2">local_offer</span>
            <div className="font-bold text-lg text-gray-900">Cheap Deals & Alerts</div>
            <div className="text-gray-600">Get exclusive deals on hotels, flights, and activities – sasta, sundar, tikau!</div>
          </div>
          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 items-start shadow">
            <span className="material-icons text-3xl text-yellow-600 mb-2">map</span>
            <div className="font-bold text-lg text-gray-900">Export to Google Maps</div>
            <div className="text-gray-600">Send your itinerary to Google Maps in one click. Perfect for navigation on the go!</div>
          </div>
          {/* Feature 7 */}
          <div className="bg-white rounded-2xl p-6 flex flex-col gap-2 items-start shadow">
            <span className="material-icons text-3xl text-yellow-600 mb-2">attach_file</span>
            <div className="font-bold text-lg text-gray-900">Unlimited Attachments</div>
            <div className="text-gray-600">Keep all your tickets, PDFs, and travel docs in one place – no more searching in 10 apps!</div>
          </div>
        </div>
      </motion.section>
      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 pt-12 pb-6 px-4 md:px-12 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
          {/* Branding and description */}
          <div className="flex-1 min-w-[200px] mb-8 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="material-icons text-yellow-500 text-3xl">travel_explore</span>
              </div>
              <span className="text-3xl font-bold text-gray-900 tracking-tight">The Modern <span className="text-yellow-500">Chanakya</span></span>
            </div>
            <div className="text-gray-500 text-base mb-4">Bharat ka apna AI-powered travel itinerary platform.</div>
          </div>
          {/* Footer columns */}
          <div className="flex-[2] grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <div className="font-semibold text-gray-900 mb-2">Company</div>
              <ul className="space-y-1 text-gray-500">
                <li><a href="#" className="hover:text-yellow-600">About</a></li>
                <li><a href="#" className="hover:text-yellow-600">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">Product</div>
              <ul className="space-y-1 text-gray-500">
                <li><a href="#" className="hover:text-yellow-600">Personalized Trips</a></li>
                <li><a href="#" className="hover:text-yellow-600">Business Solutions</a></li>
                <li><a href="#" className="hover:text-yellow-600">Partners</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">Legal</div>
              <ul className="space-y-1 text-gray-500">
                <li><a href="#" className="hover:text-yellow-600">Privacy</a></li>
                <li><a href="#" className="hover:text-yellow-600">Terms</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">Top Destinations</div>
              <ul className="space-y-1 text-gray-500">
                <li><a href="#" className="hover:text-yellow-600">Japan</a></li>
                <li><a href="#" className="hover:text-yellow-600">Italy</a></li>
                <li><a href="#" className="hover:text-yellow-600">Australia</a></li>
                <li><a href="#" className="hover:text-yellow-600">India</a></li>
                <li><a href="#" className="hover:text-yellow-600">All Destinations</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-2">Plan</div>
              <ul className="space-y-1 text-gray-500">
                <li><a href="#" className="hover:text-yellow-600">Solo Trip Planner</a></li>
                <li><a href="#" className="hover:text-yellow-600">Family Trip Planner</a></li>
                <li><a href="#" className="hover:text-yellow-600">Business Trip Planner</a></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Copyright and social icons */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-100 gap-4">
          <div className="text-gray-400 text-sm">© {new Date().getFullYear()} All rights reserved by The Modern Chanakya</div>
          <div className="flex gap-4 text-yellow-500 text-2xl">
            {/* Social icons using react-icons */}
            <a href="#" aria-label="Instagram"><SiInstagram /></a>
            <a href="#" aria-label="LinkedIn"><SiLinkedin /></a>
            <a href="#" aria-label="YouTube"><SiYoutube /></a>
            <a href="#" aria-label="Pinterest"><SiPinterest /></a>
            <a href="#" aria-label="Reddit"><SiReddit /></a>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #fff 0%, #f3f4f6 100%);
        }
        .masonry-column {
          background-clip: padding-box;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadein {
          opacity: 0;
          animation: fadein 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
        .animate-fadein {
          will-change: opacity, transform;
        }
        /* Intersection Observer for scroll-in effect */
      `}</style>
    </div>
  );
}
