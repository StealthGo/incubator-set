"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Check, 
  Zap, 
  Globe, 
  Heart, 
  Camera, 
  Calendar,
  Shield,
  Sparkles,
  ChevronDown,
  MessageCircle,
  Plane,
  Mountain,
  Compass,
  Coffee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
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

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Personalized Itineraries",
      description: "AI-powered recommendations tailored to your interests, budget, and travel style for the perfect Indian adventure.",
      color: "from-orange-500 to-pink-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Local Experiences & Hidden Gems",
      description: "Discover authentic local experiences and hidden treasures that only locals know about across India.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Suggestions",
      description: "Advanced artificial intelligence analyzes thousands of data points to create your perfect travel plan.",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Easy Customization & Flexibility",
      description: "Modify, add, or remove activities with ease. Your itinerary adapts to your changing preferences.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "24/7 Customer Support",
      description: "Round-the-clock assistance to ensure your journey is smooth from planning to execution.",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cultural Immersion",
      description: "Deep dive into India's rich culture with curated experiences that connect you with local traditions.",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, India",
      rating: 5,
      text: "The Modern Chanakya planned my Kerala backwater trip perfectly! Every recommendation was spot-on, from the houseboat experience to the spice plantation tour. Absolutely magical!",
      avatar: "PS",
      experience: "Kerala Explorer"
    },
    {
      name: "Rajesh Kumar",
      location: "Bangalore, India",
      rating: 5,
      text: "As a solo traveler, I was nervous about exploring Rajasthan. The detailed itinerary and cultural insights gave me confidence to have an incredible desert adventure!",
      avatar: "RK",
      experience: "Rajasthan Solo Journey"
    },
    {
      name: "Anita Desai",
      location: "Delhi, India",
      text: "The local food recommendations were incredible! We discovered authentic street food and hidden restaurants in Old Delhi. Our honeymoon was unforgettable!",
      rating: 5,
      avatar: "AD",
      experience: "Delhi Food Trail"
    },
    {
      name: "Vikram Patel",
      location: "Pune, India",
      rating: 5,
      text: "The Himalayan trek itinerary was perfectly planned. From acclimatization to the best photo spots, everything was thought through. Best mountain experience ever!",
      avatar: "VP",
      experience: "Himalayan Adventure"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to get my India itinerary?",
      answer: "Our AI generates your personalized India travel itinerary within minutes! After you answer our simple questionnaire about your preferences, destinations, and travel dates, you'll receive a detailed itinerary covering accommodations, activities, local experiences, and cultural insights."
    },
    {
      question: "Can I make changes to my India travel itinerary?",
      answer: "Absolutely! Your itinerary is fully customizable. You can add or remove destinations, extend stays in your favorite places, swap activities, change accommodation types, or adjust the pace of your journey across India. Our platform makes modifications easy and seamless."
    },
    {
      question: "Do you cover all regions of India?",
      answer: "Yes! We cover all 28 states and 8 union territories of India, from the snow-capped Himalayas in the north to the tropical beaches of the south, from the deserts of Rajasthan to the backwaters of Kerala. Our AI has extensive knowledge of India's incredible diversity."
    },
    {
      question: "Is the service free for India travel planning?",
      answer: "We offer a free basic itinerary that includes major attractions and general recommendations. For detailed personalized itineraries with local experiences, hidden gems, cultural insights, and 24/7 support during your India trip, we offer premium plans starting at very affordable rates."
    },
    {
      question: "Do you help with visas and travel documents for India?",
      answer: "We provide comprehensive information about India visa requirements for different nationalities, necessary documents, vaccination requirements, and helpful links to official government resources. However, we always recommend confirming current requirements with official Indian consular services."
    },
    {
      question: "What makes your India travel recommendations authentic?",
      answer: "Our AI is trained on real experiences from thousands of India travelers, local insights from residents across different states, cultural experts, and continuously updated information about festivals, seasonal variations, and authentic local experiences that showcase the real India."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-x-hidden">
      {/* Mouse Follow Effect */}
      <div 
        className="fixed pointer-events-none z-10 w-6 h-6 rounded-full bg-blue-500/20 transition-all duration-300"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(1.5)',
        }}
      />
      
      {/* Navbar */}
      <motion.nav 
        className="w-full flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-lg fixed top-0 left-0 z-40 border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Compass className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            The Modern <span className="text-orange-600">Chanakya</span>
          </span>
        </motion.div>
        <div className="flex gap-3">
          <Button variant="ghost" className="rounded-full text-gray-700 hover:text-gray-900">
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700">
            Get Started
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        {/* Floating Background Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 opacity-20"
          style={{ y: y1 }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-36 h-36 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-20"
          style={{ y: y2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-15"
          style={{ y: y1, rotate: 45 }}
        />
        
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-orange-500 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Discover Your Perfect
            </span><br />
            <span className="text-gray-900">India Travel Itinerary</span>
          </motion.h1>
          
          <motion.p 
            className="text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Personalized travel plans based on your interests and preferences.<br />
            <span className="text-orange-600 font-semibold">Experience the magic of Incredible India, tailored just for you.</span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 mb-16 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all group">
              Create Your Itinerary
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/90 backdrop-blur border-2 border-orange-300 text-orange-700 hover:bg-orange-50 text-lg px-8 py-4 rounded-full">
              Watch How It Works
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[
              { icon: <Users className="w-8 h-8" />, number: "10,000+", label: "Happy Travelers", color: "from-orange-500 to-red-500" },
              { icon: <MapPin className="w-8 h-8" />, number: "500+", label: "Destinations Covered", color: "from-green-500 to-teal-500" },
              { icon: <Star className="w-8 h-8" />, number: "4.9/5", label: "Average Rating", color: "from-yellow-500 to-orange-500" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <span className="font-bold text-3xl text-gray-900 block mb-2">{stat.number}</span>
                <span className="text-gray-600 font-medium text-lg">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="w-full py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Why Choose Us?
            </h2>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Experience the future of India travel planning with AI-powered recommendations and authentic local insights
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 h-full transform group-hover:scale-105">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button size="lg" variant="outline" className="bg-white border-2 border-orange-300 text-orange-700 hover:bg-orange-50 text-lg px-8 py-4 rounded-full">
              Learn More About Our Features
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Popular Destinations Section */}
      <motion.section
        className="w-full py-24 bg-gradient-to-br from-gray-50 to-orange-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Popular Destinations
            </h2>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Explore India's most breathtaking destinations with our curated itineraries
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Kerala",
                description: "God's Own Country - Backwaters, hills, and spices",
                image: "🌴",
                gradient: "from-green-500 to-teal-600"
              },
              {
                name: "Rajasthan",
                description: "Land of Kings - Palaces, deserts, and culture",
                image: "🏰",
                gradient: "from-orange-500 to-red-600"
              },
              {
                name: "Himalayas",
                description: "Mountain Paradise - Peaks, valleys, and spirituality",
                image: "⛰️",
                gradient: "from-blue-500 to-purple-600"
              },
              {
                name: "Goa",
                description: "Beach Bliss - Sun, sand, and Portuguese heritage",
                image: "🏖️",
                gradient: "from-yellow-500 to-orange-500"
              }
            ].map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 h-full transform group-hover:scale-105 overflow-hidden">
                  <div className={`h-48 bg-gradient-to-br ${destination.gradient} flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300`}>
                    {destination.image}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">{destination.name}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">{destination.description}</p>
                    <Button variant="outline" className="w-full border-2 border-orange-300 text-orange-700 hover:bg-orange-50 rounded-full">
                      See Itinerary
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 text-lg px-8 py-4 rounded-full shadow-xl">
              Explore All Destinations
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="w-full py-24 bg-gradient-to-br from-orange-50 to-pink-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get your personalized India travel itinerary in just three simple steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {[
              {
                step: "01",
                icon: <MessageCircle className="w-12 h-12" />,
                title: "Answer a Few Simple Questions",
                description: "Tell us your travel preferences, interests, budget, and dates. Let us know what makes your heart sing!",
                color: "from-orange-500 to-red-500",
                bgColor: "from-orange-100 to-red-100"
              },
              {
                step: "02",
                icon: <Sparkles className="w-12 h-12" />,
                title: "Get Tailored Itinerary",
                description: "Our AI generates a personalized itinerary based on your unique preferences and India's incredible diversity.",
                color: "from-green-500 to-teal-500",
                bgColor: "from-green-100 to-teal-100"
              },
              {
                step: "03",
                icon: <Plane className="w-12 h-12" />,
                title: "Enjoy Your Trip",
                description: "Book activities, follow your custom itinerary, and create unforgettable memories across India.",
                color: "from-blue-500 to-purple-500",
                bgColor: "from-blue-100 to-purple-100"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`bg-gradient-to-br ${step.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <div className="relative mb-8">
                    <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto text-white shadow-lg`}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center text-lg font-bold text-gray-800 shadow-lg">
                      {step.step}
                    </div>
                    {index < 2 && (
                      <div className="hidden lg:block absolute top-12 left-full w-16 h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2"></div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="w-full py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              What Travelers Say
            </h2>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Join thousands of happy travelers who've discovered India's magic with our personalized itineraries
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 h-full transform group-hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-gray-600">{testimonial.location}</p>
                        <p className="text-orange-600 text-sm font-medium">{testimonial.experience}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        className="w-full py-24 bg-gradient-to-br from-orange-50 to-pink-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-orange-600">We believe in making travel personal and accessible to all.</strong> Born from a passion for India's incredible diversity, we created an AI-powered solution that understands the unique needs of every traveler.
                </p>
                <p>
                  After countless trips across India's 28 states and 8 union territories, we realized that one size never fits all when it comes to travel. That's when we decided to harness the power of artificial intelligence to create truly personalized experiences.
                </p>
                <p>
                  <strong className="text-green-600">Our mission:</strong> To help you explore India your way, connecting you with authentic experiences while respecting local cultures and communities.
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">3+</div>
                  <div className="text-gray-600 font-medium">Years of Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-gray-600 font-medium">Destinations Mapped</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl p-12 text-white shadow-2xl">
                <h3 className="text-3xl font-bold mb-8">Why We Started</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Heart className="w-4 h-4" />
                    </div>
                    <p className="text-lg">We saw travelers struggling with generic, one-size-fits-all itineraries that missed the real magic of India.</p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <p className="text-lg">We wanted to create stress-free travel planning that captures the essence of incredible India.</p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Globe className="w-4 h-4" />
                    </div>
                    <p className="text-lg">Our AI learns from real traveler experiences to recommend authentic, local experiences.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="w-full py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-2xl text-gray-700 leading-relaxed">
              Everything you need to know about planning your perfect India adventure
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <details className="group cursor-pointer">
                      <summary className="flex items-center justify-between list-none">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors pr-4">{faq.question}</h3>
                        <ChevronDown className="w-6 h-6 text-gray-600 group-open:rotate-180 transition-transform duration-300 flex-shrink-0" />
                      </summary>
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-700 text-lg leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="w-full py-24 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready for Your India Adventure?
            </h2>
            <p className="text-2xl mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
              Join thousands of travelers who've discovered the magic of India with our AI-powered personalized itineraries. Your incredible journey starts here!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-10 py-5 rounded-full shadow-xl transform hover:scale-105 transition-all">
                Start Planning Your Trip
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-xl px-10 py-5 rounded-full">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full"></div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Compass className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">The Modern Chanakya</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                AI-powered India travel planning for the modern explorer. Discover, plan, and experience the incredible diversity of India like never before.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-lg">📘</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-lg">📷</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-lg">🐦</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Home</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Destinations</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Travel Blog</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Cookie Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 The Modern Chanakya. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-gray-400">
                <span className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>hello@themodernchankaya.com</span>
                </span>
                <span className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>+91-XXXX-XXXXXX</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
