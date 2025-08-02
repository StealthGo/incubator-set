"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Star,
  Share2,
  Download,
  ChevronRight,
  Utensils,
  Gem,
  BedDouble,
  ExternalLink,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagBadge } from "@/components/ui/badge";

// Sample data - replace with actual API call
const sampleItinerary = {
  id: "sample-itinerary",
  title: "Cultural Heritage Tour of Rajasthan",
  destination: "Rajasthan, India",
  duration: "7 Days",
  travelers: 4,
  createdAt: "2024-01-15",
  totalCost: "₹85,000",
  rating: 4.8,
  cover_image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop",
  description: "Experience the royal heritage and vibrant culture of Rajasthan through this carefully curated 7-day journey covering Jaipur, Udaipur, and Jodhpur.",
  highlights: [
    "Amber Palace and City Palace tours",
    "Traditional Rajasthani cuisine experiences",
    "Desert safari in Thar Desert",
    "Lake Pichola boat ride",
    "Local artisan workshops"
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival in Jaipur - The Pink City",
      date: "March 15, 2024",
      activities: [
        {
          time: "10:00 AM",
          title: "Airport Pickup & Hotel Check-in",
          description: "Comfortable transfer from Jaipur airport to heritage hotel",
          location: "Jaipur Airport",
          type: "transportation",
          duration: "2 hours",
          cost: "₹2,000"
        },
        {
          time: "2:00 PM",
          title: "City Palace Visit",
          description: "Explore the magnificent City Palace complex with its museums, courtyards, and royal architecture",
          location: "City Palace, Jaipur",
          type: "heritage",
          duration: "3 hours",
          cost: "₹800",
          tags: ["Heritage", "Cultural", "Photography"]
        },
        {
          time: "7:00 PM",
          title: "Traditional Rajasthani Dinner",
          description: "Authentic Rajasthani cuisine at a heritage restaurant with folk performances",
          location: "Chokhi Dhani Village Resort",
          type: "dining",
          duration: "2.5 hours",
          cost: "₹3,500",
          tags: ["Traditional", "Cultural", "Local Specialty"]
        }
      ]
    },
    {
      day: 2,
      title: "Jaipur Heritage & Markets",
      date: "March 16, 2024",
      activities: [
        {
          time: "8:00 AM",
          title: "Amber Palace & Fort",
          description: "Magnificent hilltop palace with stunning views and intricate mirror work",
          location: "Amber Fort, Jaipur",
          type: "heritage",
          duration: "4 hours",
          cost: "₹1,200",
          tags: ["Heritage", "Photography", "Historical"]
        },
        {
          time: "2:00 PM",
          title: "Johari Bazaar Shopping",
          description: "Traditional jewelry, textiles, and handicrafts shopping experience",
          location: "Johari Bazaar, Jaipur",
          type: "shopping",
          duration: "3 hours",
          cost: "₹5,000",
          tags: ["Shopping", "Local Specialty", "Cultural"]
        }
      ]
    }
  ],
  accommodation: [
    {
      name: "Heritage Haveli Hotel",
      location: "Jaipur",
      nights: 3,
      rating: 4.6,
      amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
      cost: "₹15,000"
    },
    {
      name: "Lake Palace Resort",
      location: "Udaipur",
      nights: 2,
      rating: 4.8,
      amenities: ["Lake View", "Free WiFi", "Restaurant", "Boat Service"],
      cost: "₹25,000"
    }
  ],
  travel_tips: [
    "Carry comfortable walking shoes for palace visits",
    "Best time to visit is October to March",
    "Keep hydrated and carry sun protection",
    "Respect local customs and dress modestly at religious sites"
  ]
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ItineraryPage() {
  const router = useRouter();
  const params = useParams();
  const [itinerary, setItinerary] = useState(sampleItinerary);
  const [isLoading, setIsLoading] = useState(false);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'dining':
        return <Utensils className="w-4 h-4" />;
      case 'heritage':
        return <Gem className="w-4 h-4" />;
      case 'accommodation':
        return <BedDouble className="w-4 h-4" />;
      case 'transportation':
        return <Navigation className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: itinerary.title,
        text: itinerary.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.main 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        {/* Hero Section */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={itinerary.cover_image}
              alt={itinerary.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {itinerary.title}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{itinerary.destination}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{itinerary.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{itinerary.travelers} travelers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{itinerary.duration}</div>
                <div className="text-sm text-gray-600">Duration</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{itinerary.totalCost}</div>
                <div className="text-sm text-gray-600">Total Cost</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">{itinerary.rating}</span>
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{itinerary.travelers}</div>
                <div className="text-sm text-gray-600">Travelers</div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div className="prose prose-gray max-w-none mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              {itinerary.description}
            </p>
          </div>

          {/* Highlights */}
          <Card className="border-gray-100 mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Trip Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {itinerary.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Itinerary Timeline */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Day-by-Day Itinerary</h2>
          
          <div className="space-y-8">
            {itinerary.itinerary.map((day, dayIndex) => (
              <motion.div key={day.day} variants={fadeInUp}>
                <Card className="border-gray-100">
                  <CardHeader className="border-b border-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          Day {day.day}: {day.title}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{day.date}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{day.day}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                              {getActivityIcon(activity.type)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {activity.time}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {activity.location}
                                  </div>
                                  {activity.duration && (
                                    <span>Duration: {activity.duration}</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">{activity.cost}</div>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3">{activity.description}</p>
                            
                            {activity.tags && (
                              <div className="flex flex-wrap gap-2">
                                {activity.tags.map((tag, tagIndex) => (
                                  <TagBadge key={tagIndex} tag={tag} type="activity" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Accommodation */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Accommodation</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {itinerary.accommodation.map((hotel, index) => (
              <Card key={index} className="border-gray-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{hotel.name}</CardTitle>
                      <p className="text-gray-600 mt-1">{hotel.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{hotel.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600">{hotel.nights} nights</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity, amenityIndex) => (
                      <span 
                        key={amenityIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">{hotel.cost}</span>
                    <span className="text-gray-600 text-sm ml-1">total</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Travel Tips */}
        <motion.section variants={fadeInUp}>
          <Card className="border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Travel Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {itinerary.travel_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.section>
      </motion.main>
    </div>
  );
}