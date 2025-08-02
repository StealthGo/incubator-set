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
  DollarSign,
  Info,
  Coffee,
  ShieldCheck,
  Wifi,
  Bus,
  Plane,
  Heart,
  Smartphone,
  Globe,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagBadge } from "@/components/ui/badge";

// Full itinerary interface based on actual API structure
interface FullItinerary {
  itinerary_id: string;
  user_info: { email: string; name: string };
  trip_parameters: { 
    destination: string; 
    dates: string; 
    travelers: string; 
    interests: string; 
    budget: string; 
    pace: string 
  };
  itinerary: {
    hero_image_url: string;
    destination_name: string;
    personalized_title: string;
    journey_details: { 
      title: string; 
      options: Array<{ 
        mode: string; 
        duration: string; 
        description: string; 
        estimated_cost: string; 
        booking_link: string; 
      }> 
    };
    accommodation_suggestions: Array<{ 
      name: string; 
      type: string; 
      icon: string; 
      description: string; 
      estimated_cost: string; 
      booking_link: string; 
      image_url: string; 
    }>;
    trip_overview: { 
      destination_insights: string; 
      weather_during_visit: string; 
      seasonal_context: string; 
      cultural_context: string; 
      local_customs_to_know: string[]; 
      estimated_total_cost: string; 
    };
    daily_itinerary: Array<{ 
      date: string; 
      theme: string; 
      activities: Array<{ 
        time: string; 
        activity: string; 
        location: string; 
        description: string; 
        local_guide_tip: string; 
        icon: string; 
        image_url: string; 
        Maps_link: string; 
        booking_link: string | null; 
        tags: string[]; 
      }>; 
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
    }>;
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
  };
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
  const [itinerary, setItinerary] = useState<FullItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itineraryId = params.id as string;

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
        const res = await fetch(`http://localhost:8000/api/itinerary/${itineraryId}`, {
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

  const getActivityIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'dining': Utensils,
      'heritage': Gem,
      'accommodation': BedDouble,
      'transportation': Navigation,
      'sightseeing': MapPin,
      'shopping': Gem,
      'food': Utensils,
      'activity': Star,
      'cultural': Gem
    };
    
    const IconComponent = iconMap[iconName] || MapPin;
    return <IconComponent className="w-4 h-4" />;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: itinerary?.itinerary.personalized_title || 'My Itinerary',
        text: itinerary?.itinerary.trip_overview.destination_insights || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Journey</h2>
          <p className="text-gray-600">Preparing your personalized itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white">
        <div className="text-6xl mb-6">😢</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          {error || "We couldn't find the itinerary you're looking for. Please try again later."}
        </p>
        <Button onClick={() => router.push("/profile")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Button>
      </div>
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

  const { trip_parameters, user_info, created_at, updated_at } = itinerary;

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
              src={hero_image_url || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80`}
              alt={destination_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {personalized_title}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{destination_name}</span>
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
                <div className="text-2xl font-bold text-gray-900">{trip_parameters.dates}</div>
                <div className="text-sm text-gray-600">Travel Dates</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{trip_overview.estimated_total_cost}</div>
                <div className="text-sm text-gray-600">Estimated Cost</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{trip_parameters.travelers}</div>
                <div className="text-sm text-gray-600">Travelers</div>
              </CardContent>
            </Card>
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-900">{trip_parameters.pace}</div>
                <div className="text-sm text-gray-600">Travel Pace</div>
              </CardContent>
            </Card>
          </div>

          {/* Trip Overview */}
          <Card className="border-gray-100 mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Trip Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Destination Insights</h3>
                  <p className="text-gray-700 leading-relaxed">{trip_overview.destination_insights}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Weather During Visit</h4>
                    <p className="text-gray-700">{trip_overview.weather_during_visit}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cultural Context</h4>
                    <p className="text-gray-700">{trip_overview.cultural_context}</p>
                  </div>
                </div>

                {trip_overview.local_customs_to_know && trip_overview.local_customs_to_know.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Local Customs to Know</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {trip_overview.local_customs_to_know.map((custom, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">{custom}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Itinerary */}
        <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Day-by-Day Itinerary</h2>
          
          <div className="space-y-8">
            {daily_itinerary.map((day, dayIndex) => (
              <motion.div key={dayIndex} variants={fadeInUp}>
                <Card className="border-gray-100">
                  <CardHeader className="border-b border-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900">
                          Day {dayIndex + 1}: {day.theme}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{formatDate(day.date)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{dayIndex + 1}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {day.activities.map((activity, activityIndex) => (
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
                            </div>
                            
                            <p className="text-gray-700 mb-3">{activity.description}</p>
                            
                            {activity.local_guide_tip && (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                                <p className="text-sm text-amber-800">
                                  <strong>💡 Local Tip:</strong> {activity.local_guide_tip}
                                </p>
                              </div>
                            )}
                            
                            {activity.tags && activity.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {activity.tags.map((tag, tagIndex) => (
                                  <TagBadge key={tagIndex} tag={tag} type="activity" />
                                ))}
                              </div>
                            )}

                            {(activity.Maps_link || activity.booking_link) && (
                              <div className="flex gap-2">
                                {activity.Maps_link && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={activity.Maps_link} target="_blank" rel="noopener noreferrer">
                                      <MapPin className="w-4 h-4 mr-2" />
                                      View on Map
                                    </a>
                                  </Button>
                                )}
                                {activity.booking_link && (
                                  <Button size="sm" asChild>
                                    <a href={activity.booking_link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Book Now
                                    </a>
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Meals Section */}
                    {(day.meals?.lunch || day.meals?.dinner) && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Today's Meals</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          {day.meals.lunch && (
                            <Card className="border-orange-200 bg-orange-50">
                              <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Utensils className="w-4 h-4 text-orange-600" />
                                  <span className="font-semibold text-orange-900">Lunch</span>
                                </div>
                                <h5 className="font-bold text-gray-900">{day.meals.lunch.dish}</h5>
                                <p className="text-orange-700 font-medium mb-2">{day.meals.lunch.restaurant}</p>
                                <p className="text-gray-700 text-sm mb-3">{day.meals.lunch.description}</p>
                                {day.meals.lunch.tags && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {day.meals.lunch.tags.map((tag, tagIndex) => (
                                      <TagBadge key={tagIndex} tag={tag} type="food" />
                                    ))}
                                  </div>
                                )}
                                {day.meals.lunch.zomato_link && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={day.meals.lunch.zomato_link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View Menu
                                    </a>
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {day.meals.dinner && (
                            <Card className="border-purple-200 bg-purple-50">
                              <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Utensils className="w-4 h-4 text-purple-600" />
                                  <span className="font-semibold text-purple-900">Dinner</span>
                                </div>
                                <h5 className="font-bold text-gray-900">{day.meals.dinner.dish}</h5>
                                <p className="text-purple-700 font-medium mb-2">{day.meals.dinner.restaurant}</p>
                                <p className="text-gray-700 text-sm mb-3">{day.meals.dinner.description}</p>
                                {day.meals.dinner.tags && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {day.meals.dinner.tags.map((tag, tagIndex) => (
                                      <TagBadge key={tagIndex} tag={tag} type="food" />
                                    ))}
                                  </div>
                                )}
                                {day.meals.dinner.zomato_link && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={day.meals.dinner.zomato_link} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      View Menu
                                    </a>
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Accommodation */}
        {accommodation_suggestions && accommodation_suggestions.length > 0 && (
          <motion.section variants={fadeInUp} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Accommodation Suggestions</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {accommodation_suggestions.map((hotel, index) => (
                <Card key={index} className="border-gray-100">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{hotel.name}</CardTitle>
                        <p className="text-gray-600 mt-1">{hotel.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{hotel.estimated_cost}</div>
                        <div className="text-sm text-gray-600">per night</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-4">{hotel.description}</p>
                    {hotel.booking_link && (
                      <Button size="sm" asChild>
                        <a href={hotel.booking_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Book Now
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Journey Details */}
        {journey_details && (
          <motion.section variants={fadeInUp} className="mb-12">
            <Card className="border-gray-100">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Plane className="w-5 h-5 text-green-500" />
                  {journey_details.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {journey_details.options.map((option, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Bus className="w-4 h-4 text-blue-500" />
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
                        <Button size="sm" variant="outline" className="w-full mt-4" asChild>
                          <a href={option.booking_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Book Transport
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Signature Experiences */}
        {signature_experiences && signature_experiences.length > 0 && (
          <motion.section variants={fadeInUp} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Signature Experiences
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {signature_experiences.map((experience, index) => (
                <Card key={index} className="border-yellow-200 bg-yellow-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{experience.name}</h3>
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
                        {experience.tags.map((tag, tagIndex) => (
                          <TagBadge key={tagIndex} tag={tag} type="activity" />
                        ))}
                      </div>
                    )}
                    
                    {experience.booking_link && (
                      <Button size="sm" asChild>
                        <a href={experience.booking_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Book Experience
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Hidden Gems */}
        {hidden_gems && hidden_gems.length > 0 && (
          <motion.section variants={fadeInUp} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Gem className="w-6 h-6 text-purple-500" />
              Hidden Gems
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hidden_gems.map((gem, index) => (
                <Card key={index} className="border-purple-200 bg-purple-50">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{gem.name}</h3>
                    <p className="text-sm text-gray-700 mb-3">{gem.description}</p>
                    
                    <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 mb-4">
                      <p className="text-xs text-purple-800">
                        <strong>✨ Why it's special:</strong> {gem.why_special}
                      </p>
                    </div>
                    
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <a href={gem.search_link} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-4 h-4 mr-2" />
                        Find Location
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Food Guide */}
        {hyperlocal_food_guide && hyperlocal_food_guide.length > 0 && (
          <motion.section variants={fadeInUp} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Coffee className="w-6 h-6 text-orange-500" />
              Hyperlocal Food Guide
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {hyperlocal_food_guide.map((food, index) => (
                <Card key={index} className="border-orange-200 bg-orange-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{food.dish}</h3>
                      <Coffee className="w-5 h-5 text-orange-500" />
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
                        {food.tags.map((tag, tagIndex) => (
                          <TagBadge key={tagIndex} tag={tag} type="food" />
                        ))}
                      </div>
                    )}
                    
                    <Button size="sm" variant="outline" asChild>
                      <a href={food.search_link} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-4 h-4 mr-2" />
                        Find Restaurants
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Shopping Guide */}
        {shopping_insider_guide && shopping_insider_guide.length > 0 && (
          <motion.section variants={fadeInUp} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Gem className="w-6 h-6 text-green-500" />
              Shopping Insider Guide
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {shopping_insider_guide.map((item, index) => (
                <Card key={index} className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.item}</h3>
                    <p className="text-sm text-green-700 font-medium mb-2">{item.where_to_buy}</p>
                    
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
                      <p className="text-xs text-green-800">
                        <strong>💡 Local tip:</strong> {item.local_tip}
                      </p>
                    </div>
                    
                    <Button size="sm" variant="outline" asChild>
                      <a href={item.search_link} target="_blank" rel="noopener noreferrer">
                        <Navigation className="w-4 h-4 mr-2" />
                        Find Shops
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Practical Wisdom */}
        <motion.section variants={fadeInUp} className="mb-12">
          <Card className="border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Practical Local Wisdom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Safety Tips</h3>
                  </div>
                  <p className="text-gray-700">{practical_local_wisdom.safety_tips}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Health & Wellness</h3>
                  </div>
                  <p className="text-gray-700">{practical_local_wisdom.health_and_wellness}</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Wifi className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">Connectivity</h3>
                  </div>
                  <p className="text-gray-700">{practical_local_wisdom.connectivity}</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bus className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-900">Transport</h3>
                  </div>
                  <p className="text-gray-700">{practical_local_wisdom.transport}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.footer variants={fadeInUp}>
          <Card className="border-gray-100">
            <CardContent className="pt-6">
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
                  <p>Created: {formatDate(created_at)}</p>
                  <p>Last updated: {formatDate(updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.footer>
      </motion.main>
    </div>
  );
}