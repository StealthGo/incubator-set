"use client";

import { useRouter } from "next/navigation";
import { SiInstagram, SiLinkedin, SiYoutube, SiPinterest, SiReddit } from "react-icons/si";
import Image from "next/image";
import imageLinks from '../imageLinks';
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Icosahedron } from '@react-three/drei';
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 200]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans relative overflow-x-hidden flex flex-col">
      {/* Enhanced 3D Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={0.9} />
          <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
            <Icosahedron args={[2, 1]}>
              <meshStandardMaterial 
                color="#6366f1" 
                wireframe={false} 
                metalness={0.4} 
                roughness={0.6}
                transparent
                opacity={0.7}
              />
            </Icosahedron>
          </Float>
          <Float speed={2.2} rotationIntensity={0.8} floatIntensity={1.8}>
            <mesh position={[4, 2, -2]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial 
                color="#f59e0b" 
                metalness={0.6} 
                roughness={0.4}
                transparent
                opacity={0.5}
              />
            </mesh>
          </Float>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Mouse Follow Effect */}
      <div 
        className="fixed pointer-events-none z-10 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 transition-all duration-300"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(1.5)',
        }}
      />

      {/* Google Material Icons CDN */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      {/* Enhanced Navbar */}
      <motion.nav 
        className="w-full flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-lg fixed top-0 left-0 z-40 border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="material-icons text-white text-xl">travel_explore</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            The Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Chanakya</span>
          </span>
        </motion.div>
        <div className="flex gap-3">
          <motion.button
            onClick={() => router.push("/signin")}
            className="px-4 py-2 rounded-full text-gray-600 hover:text-gray-900 font-medium transition-all text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
          <motion.button
            onClick={() => router.push("/preferences")}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Enhanced Hero Section */}
      <motion.section
        className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center pt-32 pb-20 px-6 md:px-0 text-center"
        style={{ marginBottom: '5rem' }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {/* Floating Background Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20"
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-20"
          style={{ y: y2 }}
        />
        
        {/* Main Content */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Namaste! <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Welcome to The Modern Chanakya
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Planning a trip? Chalo, let us help you! Get super-personalized, Indian-style travel itineraries delivered instantly.<br />
            <span className="font-semibold text-indigo-600">Discover, plan, and experience travel like never before – all with a desi touch.</span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-12 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.button 
              onClick={() => router.push("/preferences")}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-2xl hover:shadow-3xl transition-all text-lg relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Start Your Yatra</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
            <motion.button 
              className="px-8 py-4 rounded-full bg-white text-gray-700 font-bold shadow-xl hover:shadow-2xl transition-all text-lg border-2 border-gray-200 hover:border-indigo-300"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              See How It Works
            </motion.button>
          </motion.div>
          
          {/* Enhanced Stats with Icons */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.div 
              className="flex flex-col items-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3">
                <span className="material-icons text-white text-2xl">explore</span>
              </div>
              <span className="font-bold text-2xl text-gray-900">5,000+</span>
              <span className="text-gray-600 font-medium">Trips Planned</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-3">
                <span className="material-icons text-white text-2xl">groups</span>
              </div>
              <span className="font-bold text-2xl text-gray-900">2,000+</span>
              <span className="text-gray-600 font-medium">Happy Travellers</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-3">
                <span className="material-icons text-white text-2xl">star_rate</span>
              </div>
              <span className="font-bold text-2xl text-gray-900">4.9/5</span>
              <span className="text-gray-600 font-medium">Avg. Rating</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Enhanced How it Works Section */}
      <motion.section
        className="w-full flex flex-col items-center justify-center py-32 bg-gradient-to-br from-white via-indigo-50 to-purple-50 relative overflow-hidden"
        style={{ marginBottom: '5rem' }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23667eea' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40z'/%3E%3Cpath d='m40 40v-40h-40z' fill='%23764ba2'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <motion.h2 
          className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          How it Works
        </motion.h2>
        
        <motion.p
          className="text-xl text-gray-600 text-center mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Experience the magic of AI-powered travel planning in just three simple steps
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl gap-16 px-4">
          {/* Left Side - Enhanced Interaction Demo */}
          <motion.div 
            className="flex-1 flex flex-col items-start justify-center max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="material-icons text-white text-3xl">chat</span>
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Start chatting<br/>with us.
            </h3>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Ask us for suggestions for any destination or ask us for an entire itinerary. Be as specific as you can about the types of experiences that you like or take our quiz to determine your travel style.
            </p>
            
            {/* Feature Benefits */}
            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
              >
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <span className="text-gray-700 font-medium">Natural conversation interface</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
              >
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-700 font-medium">Personalized recommendations</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
              >
                <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                <span className="text-gray-700 font-medium">Instant intelligent responses</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Enhanced Visual Demo */}
          <motion.div 
            className="flex-1 flex flex-col items-center justify-center relative min-h-[500px] max-w-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {/* Enhanced Interactive Visual */}
            <div className="relative w-full h-[400px] flex items-center justify-center">
              {/* Central Hub */}
              <motion.div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl border-4 border-white">
                  <Image src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" width={80} height={80} className="w-20 h-20 rounded-full object-cover" unoptimized />
                </div>
              </motion.div>

              {/* Floating Elements with Enhanced Animations */}
              <motion.div 
                className="absolute left-8 top-20 flex flex-col items-center"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                  <Image src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=facearea&w=80&h=80" alt="Spa" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                </div>
                <motion.span 
                  className="mt-3 px-4 py-2 bg-white rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  🧘‍♀️ Wellness & Spa
                </motion.span>
              </motion.div>

              <motion.div 
                className="absolute right-8 top-16 flex flex-col items-center"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                  <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=facearea&w=80&h=80" alt="Dining" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                </div>
                <motion.span 
                  className="mt-3 px-4 py-2 bg-white rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  🍽️ Fine Dining
                </motion.span>
              </motion.div>

              <motion.div 
                className="absolute left-4 bottom-20 flex flex-col items-center"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                  <Image src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=facearea&w=80&h=80" alt="Hotels" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                </div>
                <motion.span 
                  className="mt-3 px-4 py-2 bg-white rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  🏨 Luxury Hotels
                </motion.span>
              </motion.div>

              <motion.div 
                className="absolute right-4 bottom-12 flex flex-col items-center"
                animate={{ 
                  y: [0, 12, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{ 
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                  <Image src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=facearea&w=80&h=80" alt="Water Sports" width={64} height={64} className="w-full h-full object-cover" unoptimized />
                </div>
                <motion.span 
                  className="mt-3 px-4 py-2 bg-white rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  🏄‍♂️ Adventure Sports
                </motion.span>
              </motion.div>
            </div>

            {/* Enhanced Chat Interface */}
            <motion.div 
              className="w-full max-w-md mt-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="flex items-center px-6 py-4 border-b border-gray-100">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                <span className="text-sm font-medium text-gray-600">Chat with AI Travel Assistant</span>
              </div>
              <div className="p-6">
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <motion.span 
                    className="material-icons text-indigo-500 mr-3"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    add_circle_outline
                  </motion.span>
                  <motion.span
                    className="flex-1 text-gray-500 text-base"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Ask us anything...
                  </motion.span>
                  <motion.button 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-2 ml-3 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="material-icons text-lg">send</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Style additions */}
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f3f4f6 100%);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
