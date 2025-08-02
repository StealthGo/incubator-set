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
  Navigation,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagBadge } from "@/components/ui/badge";

// Types for the API response
interface Activity {
  time: string;
  activity: string;
  location: string;
  description: string;
  local_guide_tip: string;
  icon: string;
  image_url: string;
  google_maps_link: string;
  booking_link?: string;
  tags: string[];
}

interface DailyItinerary {
  date: string;
  theme: string;
  activities: Activity[];
  meals: {
    lunch: {
      dish: string;
      restaurant: string;
      description: string;
      image_url: string;
      zomato_link: string;
      tags: string[];
    };
    dinner: {
      dish: string;
      restaurant: string;
      description: string;
      image_url: string;
      zomato_link: string;
      tags: string[];
    };
  };
}

interface AccommodationSuggestion {
  name: string;
  type: string;
  icon: string;
  description: string;
  estimated_cost: string;
  booking_link: string;
  image_url: string;
}

interface ItineraryData {
  hero_image_url: string;
  destination_name: string;
  personalized_title: string;
  journey_details: {
    title: string;
    options: Array<{
      mode: string;
      icon: string;
      description: string;
      duration: string;
      estimated_cost: string;
      booking_link: string;
    }>;
  };
  accommodation_suggestions: AccommodationSuggestion[];
  trip_overview: {
    destination_insights: string;
    weather_during_visit: string;
    seasonal_context: string;
    cultural_context: string;
    local_customs_to_know: string[];
    estimated_total_cost: string;
  };
  daily_itinerary: DailyItinerary[];
  hidden_gems: Array<{
    name: string;
    description: string;
    why_special: string;
    search_link: string;
  }>;
  signature_experiences: Array<{
    name: string;
    description: string;
    why_local_loves_it: string;
    estimated_cost: string;
    booking_link: string;
    tags: string[];
  }>;
  hyperlocal_food_guide: Array<{
    dish: string;
    description: string;
    where_to_find: string;
    local_tip: string;
    search_link: string;
    tags: string[];
  }>;
  shopping_insider_guide: Array<{
    item: string;
    where_to_buy: string;
    local_tip: string;
    search_link: string;
  }>;
  practical_local_wisdom: {
    safety_tips: string;
    health_and_wellness: string;
    connectivity: string;
    transport: string;
  };
}

interface ApiResponse {
  itinerary_id: string;
  user_info: {
    email: string;
    name: string;
  };
  trip_parameters: {
    destination: string;
    dates: string;
    travelers: string;
    interests: string;
    budget: string;
    pace: string;
  };
  itinerary: ItineraryData;
  created_at: string;
  updated_at: string;
}

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
  const [itineraryData, setItineraryData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await fetch(`/api/itinerary/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/signin');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch itinerary: ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();
        setItineraryData(data);
      } catch (err) {
        console.error('Error fetching itinerary:', err);
        setError(err instanceof Error ? err.message : 'Failed to load itinerary');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItinerary();
  }, [params.id, router]);

  const getActivityIcon = (iconName: string) => {
    // Map backend icon names to Lucide icons
    switch (iconName) {
      case 'local_cafe':
      case 'restaurant':
        return <Utensils className="w-4 h-4" />;
      case 'storefront':
      case 'local_mall':
        return <Gem className="w-4 h-4" />;
      case 'hotel_class':
      case 'night_shelter':
        return <BedDouble className="w-4 h-4" />;
      case 'flight':
      case 'train':
      case 'directions_bus':
        return <Navigation className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const handleShare = () => {
    if (!itineraryData) return;
    
    if (navigator.share) {
      navigator.share({
        title: itineraryData.itinerary.personalized_title,
        text: itineraryData.itinerary.trip_overview.destination_insights,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Itinerary</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!itineraryData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No itinerary found</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const { itinerary, trip_parameters } = itineraryData;

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
              src={itinerary.hero_image_url}
              alt={itinerary.personalized_title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://picsum.photos/1200/600";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {itinerary.personalized_title}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{itinerary.destination_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{trip_parameters.dates}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{trip_parameters.travelers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-xl font-bold text-gray-900">{trip_parameters.dates}</div>
                <div className="text-sm text-gray-600">Travel Dates</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-xl font-bold text-gray-900">{itinerary.trip_overview.estimated_total_cost}</div>
                <div className="text-sm text-gray-600">Estimated Cost</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-xl font-bold text-gray-900">{trip_parameters.pace}</div>
                <div className="text-sm text-gray-600">Pace</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-xl font-bold text-gray-900">{trip_parameters.travelers}</div>
                <div className="text-sm text-gray-600">Travelers</div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div className="prose prose-gray max-w-none mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              {itinerary.trip_overview.destination_insights}
            </p>
          </div>

          {/* Trip Overview */}
          <Card className="border-gray-100 mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Trip Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Weather During Visit</h4>
                <p className="text-gray-700">{itinerary.trip_overview.weather_during_visit}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Seasonal Context</h4>
                <p className="text-gray-700">{itinerary.trip_overview.seasonal_context}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cultural Context</h4>
                <p className="text-gray-700">{itinerary.trip_overview.cultural_context}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Local Customs to Know</h4>
                <ul className="space-y-2">
                  {itinerary.trip_overview.local_customs_to_know && itinerary.trip_overview.local_customs_to_know.length > 0 && itinerary.trip_overview.local_customs_to_know.map((custom, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                      <span className="text-gray-700">{custom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Itinerary */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Day-by-Day Itinerary</h2>
          
          <div className="space-y-8">
            {itinerary.daily_itinerary && itinerary.daily_itinerary.length > 0 && itinerary.daily_itinerary.map((day, dayIndex) => (
              <motion.div key={day.date} variants={fadeInUp}>
                <Card className="border-gray-100">
                  <CardHeader className="border-b border-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          Day {dayIndex + 1}: {day.theme}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{day.date}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{dayIndex + 1}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Activities */}
                      {day.activities && day.activities.length > 0 && day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                              {getActivityIcon(activity.icon)}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {activity.time}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {activity.location}
                                  </div>
                                </div>
                              </div>
                              {activity.booking_link && (
                                <a
                                  href={activity.booking_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                            
                            <p className="text-gray-700 mb-2">{activity.description}</p>
                            <p className="text-sm text-blue-600 mb-3 italic">💡 {activity.local_guide_tip}</p>
                            
                            {activity.tags && activity.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {activity.tags.map((tag, tagIndex) => (
                                  <TagBadge key={tagIndex} tag={tag} type="activity" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Meals */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Recommended Meals</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">🍽️ Lunch</h5>
                            <p className="text-sm font-medium text-gray-800">{day.meals.lunch.dish}</p>
                            <p className="text-xs text-gray-600">{day.meals.lunch.restaurant}</p>
                            <p className="text-xs text-gray-700 mt-1">{day.meals.lunch.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {day.meals.lunch.tags && day.meals.lunch.tags.length > 0 && day.meals.lunch.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">🌆 Dinner</h5>
                            <p className="text-sm font-medium text-gray-800">{day.meals.dinner.dish}</p>
                            <p className="text-xs text-gray-600">{day.meals.dinner.restaurant}</p>
                            <p className="text-xs text-gray-700 mt-1">{day.meals.dinner.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {day.meals.dinner.tags && day.meals.dinner.tags.length > 0 && day.meals.dinner.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Accommodation Suggestions */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Accommodation Suggestions</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {itinerary.accommodation_suggestions && itinerary.accommodation_suggestions.length > 0 && itinerary.accommodation_suggestions.map((hotel, index) => (
              <Card key={index} className="border-gray-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{hotel.name}</CardTitle>
                      <p className="text-gray-600 mt-1">{hotel.type}</p>
                    </div>
                    <a
                      href={hotel.booking_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4">{hotel.description}</p>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">{hotel.estimated_cost}</span>
                    <span className="text-gray-600 text-sm ml-1">per night</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Hidden Gems */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hidden Gems</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {itinerary.hidden_gems && itinerary.hidden_gems.length > 0 && itinerary.hidden_gems.map((gem, index) => (
              <Card key={index} className="border-gray-100">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{gem.name}</h3>
                  <p className="text-gray-700 text-sm mb-2">{gem.description}</p>
                  <p className="text-blue-600 text-sm italic mb-3">✨ {gem.why_special}</p>
                  <a
                    href={gem.search_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View on Maps →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Signature Experiences */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Signature Experiences</h2>
          
          <div className="grid gap-6">
            {itinerary.signature_experiences && itinerary.signature_experiences.length > 0 && itinerary.signature_experiences.map((experience, index) => (
              <Card key={index} className="border-gray-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{experience.name}</h3>
                      <p className="text-gray-700 text-sm mb-2">{experience.description}</p>
                      <p className="text-green-600 text-sm italic mb-3">💚 {experience.why_local_loves_it}</p>
                      <div className="flex flex-wrap gap-2">
                        {experience.tags && experience.tags.length > 0 && experience.tags.slice(0, 4).map((tag, tagIndex) => (
                          <TagBadge key={tagIndex} tag={tag} type="experience" />
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-semibold text-gray-900 mb-2">{experience.estimated_cost}</div>
                      <a
                        href={experience.booking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Book Now →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Food Guide */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hyperlocal Food Guide</h2>
          
          <div className="grid gap-4">
            {itinerary.hyperlocal_food_guide && itinerary.hyperlocal_food_guide.length > 0 && itinerary.hyperlocal_food_guide.map((food, index) => (
              <Card key={index} className="border-gray-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{food.dish}</h3>
                      <p className="text-gray-700 text-sm mb-2">{food.description}</p>
                      <p className="text-gray-600 text-sm mb-1">📍 {food.where_to_find}</p>
                      <p className="text-orange-600 text-sm italic">🍴 {food.local_tip}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {food.tags && food.tags.length > 0 && food.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={food.search_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 ml-4"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Shopping Guide */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shopping Insider Guide</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {itinerary.shopping_insider_guide && itinerary.shopping_insider_guide.length > 0 && itinerary.shopping_insider_guide.map((shopping, index) => (
              <Card key={index} className="border-gray-100">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{shopping.item}</h3>
                  <p className="text-gray-600 text-sm mb-2">🛍️ {shopping.where_to_buy}</p>
                  <p className="text-purple-600 text-sm italic">{shopping.local_tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Practical Wisdom */}
        <motion.section variants={fadeInUp}>
          <Card className="border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Practical Local Wisdom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🛡️ Safety Tips</h4>
                <p className="text-gray-700 text-sm">{itinerary.practical_local_wisdom.safety_tips}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🏥 Health & Wellness</h4>
                <p className="text-gray-700 text-sm">{itinerary.practical_local_wisdom.health_and_wellness}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📱 Connectivity</h4>
                <p className="text-gray-700 text-sm">{itinerary.practical_local_wisdom.connectivity}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">🚗 Transport</h4>
                <p className="text-gray-700 text-sm">{itinerary.practical_local_wisdom.transport}</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.main>
    </div>
  );
}