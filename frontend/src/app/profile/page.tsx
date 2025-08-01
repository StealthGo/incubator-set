"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  Star, 
  Eye, 
  Trash2, 
  Plus,
  Clock,
  Globe,
  Award,
  Activity,
  TrendingUp,
  Camera,
  Share2,
  Download,
  Edit3
} from "lucide-react";

interface User {
  name: string;
  email: string;
  dob: string;
}

interface ItinerarySummary {
  itinerary_id: string;
  destination: string;
  dates: string;
  travelers: string;
  destination_name: string;
  personalized_title: string;
  hero_image_url: string;
  created_at: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [itineraries, setItineraries] = useState<ItinerarySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [itinerariesLoading, setItinerariesLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'destination'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'favorites'>('all');
  const [showStats, setShowStats] = useState(false);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        router.push("/signin?next=/profile");
        return;
      }
      const data = await res.json();
      setUser(data);
      setLoading(false);
    } catch {
      router.push("/signin?next=/profile");
    }
  };

  const fetchItineraries = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/my-itineraries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItineraries(data.itineraries || []);
        // Show stats animation after loading
        setTimeout(() => setShowStats(true), 500);
      }
    } catch (error) {
      console.error("Failed to fetch itineraries:", error);
    } finally {
      setItinerariesLoading(false);
    }
  };

  const deleteItinerary = async (itineraryId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setDeleteLoading(itineraryId);
    try {
      const res = await fetch(`http://localhost:8000/api/itinerary/${itineraryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setItineraries(prev => prev.filter(item => item.itinerary_id !== itineraryId));
      } else {
        alert("Failed to delete itinerary");
      }
    } catch (error) {
      console.error("Failed to delete itinerary:", error);
      alert("Failed to delete itinerary");
    } finally {
      setDeleteLoading(null);
    }
  };

  const viewItinerary = (itineraryId: string) => {
    router.push(`/itinerary/${itineraryId}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  // Get user statistics
  const getUserStats = () => {
    const totalTrips = itineraries.length;
    const destinations = new Set(itineraries.map(i => i.destination_name)).size;
    const recentTrips = itineraries.filter(i => {
      const created = new Date(i.created_at);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return created > thirtyDaysAgo;
    }).length;
    
    return { totalTrips, destinations, recentTrips };
  };

  // Sort and filter itineraries
  const getFilteredItineraries = () => {
    let filtered = [...itineraries];
    
    // Apply filters
    if (filterBy === 'recent') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(i => new Date(i.created_at) > thirtyDaysAgo);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return a.destination_name.localeCompare(b.destination_name);
      }
    });
    
    return filtered;
  };

  const stats = getUserStats();
  const filteredItineraries = getFilteredItineraries();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/signin?next=/profile");
      return;
    }
    
    fetchUserData(token);
    fetchItineraries(token);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Loading your travel profile...</h3>
          <p className="text-gray-500 mt-2">Preparing your journey dashboard</p>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header with Navigation */}
      <motion.div 
        className="bg-white/80 backdrop-blur-lg shadow-sm border-b sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold">The Modern Chanakya</span>
              </button>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>Profile</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">{user.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/preferences')}
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Trip
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced User Profile Section */}
        <motion.div 
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl shadow-2xl mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='nonzero'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 10c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Enhanced Avatar */}
              <div className="relative">
                <motion.div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </motion.div>
                <motion.div 
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Camera className="w-4 h-4 text-white" />
                </motion.div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {user.name}
                </motion.h1>
                <motion.p 
                  className="text-blue-100 text-lg mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {user.email}
                </motion.p>
                <motion.div 
                  className="flex flex-wrap justify-center md:justify-start gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since {formatDate(user.dob)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                    <Award className="w-4 h-4 mr-2" />
                    Travel Explorer
                  </span>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col space-y-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 backdrop-blur-sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 20 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <motion.p 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  {stats.totalTrips}
                </motion.p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Destinations</p>
                <motion.p 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                >
                  {stats.destinations}
                </motion.p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Trips</p>
                <motion.p 
                  className="text-3xl font-bold text-gray-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                >
                  {stats.recentTrips}
                </motion.p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Itineraries Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Section Header with Controls */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">My Travel Itineraries</h3>
                <p className="text-gray-600">Explore your journey collection and plan new adventures</p>
              </div>
              
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'destination')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="destination">Sort by Destination</option>
                </select>

                {/* Filter Dropdown */}
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as 'all' | 'recent' | 'favorites')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Trips</option>
                  <option value="recent">Recent</option>
                  <option value="favorites">Favorites</option>
                </select>

                {/* Create Trip Button */}
                <motion.button
                  onClick={() => router.push('/preferences')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Trip
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {itinerariesLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <motion.div
                  className="relative w-16 h-16 mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </motion.div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Loading your adventures...</h4>
                <p className="text-gray-500">Gathering your travel memories</p>
              </div>
            ) : filteredItineraries.length === 0 ? (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MapPin className="w-12 h-12 text-blue-600" />
                </motion.div>
                <h4 className="text-2xl font-bold text-gray-700 mb-3">
                  {filterBy === 'all' ? 'No trips yet' : 'No trips found'}
                </h4>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {filterBy === 'all' 
                    ? 'Ready to explore the world? Start planning your first adventure!'
                    : 'Try adjusting your filters to see more trips.'
                  }
                </p>
                {filterBy === 'all' && (
                  <motion.button
                    onClick={() => router.push('/preferences')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Plan Your First Trip
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={viewMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                  }
                >
                  {filteredItineraries.map((itinerary, index) => (
                    <motion.div
                      key={itinerary.itinerary_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={viewMode === 'grid' 
                        ? "group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
                        : "group cursor-pointer bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300 border border-gray-200"
                      }
                    >
                      {viewMode === 'grid' ? (
                        <>
                          {/* Grid View - Enhanced YouTube-style */}
                          <div className="relative aspect-video bg-gray-200 overflow-hidden">
                            {itinerary.hero_image_url ? (
                              <Image
                                src={itinerary.hero_image_url}
                                alt={itinerary.destination_name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                  e.currentTarget.src = `https://picsum.photos/400/225?random=${itinerary.itinerary_id}`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                                <MapPin className="text-white text-4xl" />
                              </div>
                            )}
                            
                            {/* Enhanced Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div 
                                  className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <Eye className="w-6 h-6 text-gray-800" />
                                </motion.div>
                              </div>
                            </div>

                            {/* Duration & Status Badges */}
                            <div className="absolute top-3 left-3 flex flex-col space-y-2">
                              <span className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
                                {itinerary.dates}
                              </span>
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                                NEW
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add to favorites logic
                                }}
                                className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Heart className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Share logic
                                }}
                                className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Share2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          {/* Enhanced Content */}
                          <div className="p-5">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors">
                              {itinerary.personalized_title || `Trip to ${itinerary.destination_name}`}
                            </h4>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                <span>{itinerary.destination_name}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-green-500" />
                                <span>{itinerary.travelers}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>Created {formatDate(itinerary.created_at)}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Eye className="w-3 h-3 mr-1" />
                                  145
                                </span>
                                <span className="flex items-center">
                                  <Heart className="w-3 h-3 mr-1" />
                                  12
                                </span>
                              </div>
                            </div>

                            {/* Enhanced Action Buttons */}
                            <div className="flex space-x-2">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewItinerary(itinerary.itinerary_id);
                                }}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                View Details
                              </motion.button>
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this itinerary?')) {
                                    deleteItinerary(itinerary.itinerary_id);
                                  }
                                }}
                                disabled={deleteLoading === itinerary.itinerary_id}
                                className="px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50 border border-red-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {deleteLoading === itinerary.itinerary_id ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* List View */
                        <div className="flex items-center space-x-4 p-2">
                          <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden">
                            {itinerary.hero_image_url ? (
                              <Image
                                src={itinerary.hero_image_url}
                                alt={itinerary.destination_name}
                                width={96}
                                height={64}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `https://picsum.photos/96/64?random=${itinerary.itinerary_id}`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                <MapPin className="text-white text-lg" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {itinerary.personalized_title || `Trip to ${itinerary.destination_name}`}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{itinerary.destination_name}</span>
                              <span>•</span>
                              <span>{itinerary.travelers}</span>
                              <span>•</span>
                              <span>{formatDate(itinerary.created_at)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewItinerary(itinerary.itinerary_id);
                              }}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this itinerary?')) {
                                  deleteItinerary(itinerary.itinerary_id);
                                }
                              }}
                              disabled={deleteLoading === itinerary.itinerary_id}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              {deleteLoading === itinerary.itinerary_id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
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