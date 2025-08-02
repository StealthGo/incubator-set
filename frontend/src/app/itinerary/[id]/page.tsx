"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, BedDouble, Utensils, Gem, Star, MapPin, 
  Heart, BookOpen, Waves, Sun, ShieldCheck, Wifi, Bus,
  Plane, Calendar, Users, DollarSign, Clock, Camera,
  Coffee, Mountain, Palmtree, Award, Navigation, Info,
  CloudSun, Globe, Shield, Smartphone
} from "lucide-react";

// Simplified Button component for the layout
const Button = ({ children, onClick, variant = "default", size = "default", className = "", asChild, ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100"
  };
  const sizes: Record<string, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8"
  };
  
  if (asChild) {
    return children;
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Simplified Card component
const Card = ({ children, className = "", ...props }: any) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

// Simplified Badge component
const Badge = ({ children, variant = "default", className = "", ...props }: any) => {
  const variants: Record<string, string> = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 bg-white"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Tag Badge component for food and activity tags
const TagBadge = ({ tag, type = "activity" }: { tag: string; type?: "activity" | "food" }) => {
  const getTagStyle = (tag: string, type: string) => {
    const foodColors: Record<string, string> = {
      "Vegetarian": "bg-green-100 text-green-800",
      "Vegan": "bg-green-200 text-green-900",
      "Non-Vegetarian": "bg-red-100 text-red-800",
      "Street Food": "bg-orange-100 text-orange-800",
      "Fine Dining": "bg-purple-100 text-purple-800",
      "Local Specialty": "bg-yellow-100 text-yellow-800",
      "Spicy": "bg-red-200 text-red-900",
      "Sweet": "bg-pink-100 text-pink-800",
      "Traditional": "bg-amber-100 text-amber-800",
      "Fusion": "bg-indigo-100 text-indigo-800",
      "Budget": "bg-green-100 text-green-700",
      "Premium": "bg-purple-100 text-purple-700"
    };

    const activityColors: Record<string, string> = {
      "Adventure": "bg-red-100 text-red-800",
      "Cultural": "bg-blue-100 text-blue-800",
      "Heritage": "bg-amber-100 text-amber-800",
      "Nature": "bg-green-100 text-green-800",
      "Food": "bg-orange-100 text-orange-800",
      "Shopping": "bg-pink-100 text-pink-800",
      "Religious": "bg-purple-100 text-purple-800",
      "Nightlife": "bg-indigo-100 text-indigo-800",
      "Family-Friendly": "bg-cyan-100 text-cyan-800",
      "Budget": "bg-green-100 text-green-700",
      "Luxury": "bg-purple-100 text-purple-700",
      "Photography": "bg-gray-100 text-gray-800",
      "Historical": "bg-amber-100 text-amber-800",
      "Wellness": "bg-teal-100 text-teal-800",
      "Sports": "bg-blue-100 text-blue-800"
    };

    if (type === "food") {
      return foodColors[tag] || "bg-gray-100 text-gray-800";
    }
    return activityColors[tag] || "bg-gray-100 text-gray-800";
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagStyle(tag, type)}`}>
      {tag}
    </span>
  );
};

// The full itinerary interface
interface FullItinerary {
    itinerary_id: string;
    user_info: { email: string; name: string };
    trip_parameters: { destination: string; dates: string; travelers: string; interests: string; budget: string; pace: string };
    itinerary: {
        hero_image_url: string;
        destination_name: string;
        personalized_title: string;
        journey_details: { title: string; options: Array<{ mode: string; duration: string; description: string; estimated_cost: string; booking_link: string; }> };
        accommodation_suggestions: Array<{ name: string; type: string; icon: string; description: string; estimated_cost: string; booking_link: string; image_url: string; }>;
        trip_overview: { destination_insights: string; weather_during_visit: string; seasonal_context: string; cultural_context: string; local_customs_to_know: string[]; estimated_total_cost: string; };
        daily_itinerary: Array<{ date: string; theme: string; activities: Array<{ time: string; activity: string; location: string; description: string; local_guide_tip: string; icon: string; image_url: string; Maps_link: string; booking_link: string | null; tags: string[]; }>; meals: { lunch: { dish: string; restaurant: string; description: string; image_url: string; zomato_link: string; tags: string[]; }; dinner: { dish: string; restaurant: string; description: string; image_url: string; zomato_link: string; tags: string[]; }; }; }>;
        hidden_gems: Array<{ name: string; description: string; why_special: string; search_link: string; }>;
        signature_experiences: Array<{ name: string; description: string; why_local_loves_it: string; estimated_cost: string; booking_link: string; tags: string[]; }>;
        hyperlocal_food_guide: Array<{ dish: string; description: string; where_to_find: string; local_tip: string; search_link: string; tags: string[]; }>;
        shopping_insider_guide: Array<{ item: string; where_to_buy: string; local_tip: string; search_link: string; }>;
        practical_local_wisdom: { safety_tips: string; health_and_wellness: string; connectivity: string; transport: string; };
    };
    created_at: string;
    updated_at: string;
}

const ItineraryDetails = () => {
  const [itinerary, setItinerary] = useState<FullItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const router = useRouter();
  const params = useParams();
  const itineraryId = params.id as string;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white">
            <div className="text-6xl mb-4">😢</div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">{error || "We couldn't find the itinerary you're looking for."}</p>
            <Button onClick={() => router.push("/profile")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
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

  const { trip_parameters, user_info, created_at, updated_at, itinerary_id } = itinerary;

 return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/profile")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <div className="text-right">
              <p className="font-medium text-gray-900">{destination_name}</p>
              <p className="text-sm text-gray-500">Created {formatDate(created_at)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {personalized_title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">{destination_name}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="bg-white border-gray-200">
                <Calendar className="w-4 h-4 mr-2" />
                {trip_parameters.dates}
              </Badge>
              <Badge variant="outline" className="bg-white border-gray-200">
                <Users className="w-4 h-4 mr-2" />
                {trip_parameters.travelers}
              </Badge>
              <Badge variant="outline" className="bg-white border-gray-200">
                <DollarSign className="w-4 h-4 mr-2" />
                {trip_parameters.budget}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
         
          {/* Trip Overview */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Info className="w-6 h-6 mr-3 text-blue-500" />
              Trip Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Trip Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium">{trip_parameters.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dates:</span>
                    <span className="font-medium">{trip_parameters.dates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travelers:</span>
                    <span className="font-medium">{trip_parameters.travelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interests:</span>
                    <span className="font-medium">{trip_parameters.interests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">{trip_parameters.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pace:</span>
                    <span className="font-medium">{trip_parameters.pace}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Destination Insights</h3>
                <p className="text-gray-700 mb-4">{trip_overview.destination_insights}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <CloudSun className="w-4 h-4 text-blue-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Weather:</span>
                      <p className="text-sm text-gray-600">{trip_overview.weather_during_visit}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Cultural Context:</span>
                      <p className="text-sm text-gray-600">{trip_overview.cultural_context}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Local Customs */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Local Customs to Know</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {trip_overview.local_customs_to_know.map((custom, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{custom}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Total Cost */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  Total Estimated Cost: {trip_overview.estimated_total_cost}
                </span>
              </div>
            </div>
          </Card>

          {/* Journey Details */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Plane className="w-6 h-6 mr-3 text-blue-500" />
              {journey_details.title}
            </h2>
            <div className="space-y-4">
              {journey_details.options.map((option, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{option.mode}</h3>
                    <span className="text-sm text-gray-500">{option.duration}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{option.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-600">{option.estimated_cost}</span>
                    {option.booking_link && (
                      <Button asChild size="sm" variant="outline">
                        <a href={option.booking_link} target="_blank" rel="noopener noreferrer">
                          Book Now
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Accommodation */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <BedDouble className="w-6 h-6 mr-3 text-blue-500" />
              Accommodation Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {accommodation_suggestions.map((hotel, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{hotel.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{hotel.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{hotel.type}</p>
                      <p className="text-gray-700 mb-3">{hotel.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-600">{hotel.estimated_cost}</span>
                        {hotel.booking_link && (
                          <Button asChild size="sm" variant="outline">
                            <a href={hotel.booking_link} target="_blank" rel="noopener noreferrer">
                              Book Now
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Daily Itinerary */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-500" />
              Daily Itinerary
            </h2>
            
            {/* Day Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              {daily_itinerary.map((day, index) => (
                <Button
                  key={index}
                  onClick={() => setActiveDay(index)}
                  variant={activeDay === index ? "default" : "outline"}
                  size="sm"
                  className={activeDay === index ? 'bg-blue-600 text-white' : ''}
                >
                  Day {index + 1}
                </Button>
              ))}
            </div>

            {/* Active Day Content */}
            <div className="space-y-6">
              {daily_itinerary.map((day, index) => index === activeDay && (
                <div key={index}>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">{day.theme}</h3>
                    <p className="text-gray-600">{formatDate(day.date)}</p>
                  </div>
                  
                  {/* Activities */}
                  <div className="space-y-4">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="text-center font-medium text-blue-600 min-w-[60px] pt-1">
                            {activity.time}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{activity.activity}</h4>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {activity.location}
                            </p>
                            
                            {/* Activity Tags */}
                            {activity.tags && activity.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {activity.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                  <TagBadge key={tagIndex} tag={tag} type="activity" />
                                ))}
                                {activity.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">+{activity.tags.length - 3} more</span>
                                )}
                              </div>
                            )}
                            
                            <p className="text-gray-700 mb-3">{activity.description}</p>
                            
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-yellow-800">
                                <strong>💡 Local Tip:</strong> {activity.local_guide_tip}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              {activity.Maps_link && (
                                <Button asChild size="sm" variant="outline" className="text-xs">
                                  <a href={activity.Maps_link} target="_blank" rel="noopener noreferrer">
                                    <Navigation className="w-3 h-3 mr-1" /> Maps
                                  </a>
                                </Button>
                              )}
                              {activity.booking_link && (
                                <Button asChild size="sm" variant="outline" className="text-xs">
                                 <a href={activity.booking_link} target="_blank" rel="noopener noreferrer">
                                  <Award className="w-3 h-3 mr-1" /> Book
                                 </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Meals for the day */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h5 className="font-medium text-orange-900 mb-2 flex items-center">
                        <Utensils className="w-4 h-4 mr-2" />
                        Lunch
                      </h5>
                      <p className="font-medium">{day.meals.lunch.dish}</p>
                      <p className="text-sm text-gray-600">{day.meals.lunch.restaurant}</p>
                      
                      {/* Lunch Tags */}
                      {day.meals.lunch.tags && day.meals.lunch.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-2">
                          {day.meals.lunch.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <TagBadge key={tagIndex} tag={tag} type="food" />
                          ))}
                          {day.meals.lunch.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{day.meals.lunch.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">{day.meals.lunch.description}</p>
                      {day.meals.lunch.zomato_link && (
                        <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                          <a href={day.meals.lunch.zomato_link} target="_blank" rel="noopener noreferrer">
                            View Menu
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h5 className="font-medium text-purple-900 mb-2 flex items-center">
                        <Utensils className="w-4 h-4 mr-2" />
                        Dinner
                      </h5>
                      <p className="font-medium">{day.meals.dinner.dish}</p>
                      <p className="text-sm text-gray-600">{day.meals.dinner.restaurant}</p>
                      
                      {/* Dinner Tags */}
                      {day.meals.dinner.tags && day.meals.dinner.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 my-2">
                          {day.meals.dinner.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <TagBadge key={tagIndex} tag={tag} type="food" />
                          ))}
                          {day.meals.dinner.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{day.meals.dinner.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">{day.meals.dinner.description}</p>
                      {day.meals.dinner.zomato_link && (
                        <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                          <a href={day.meals.dinner.zomato_link} target="_blank" rel="noopener noreferrer">
                            View Menu
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hidden Gems & Signature Experiences */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Gem className="w-6 h-6 mr-3 text-yellow-500" />
                Hidden Gems
              </h2>
              <div className="space-y-4">
                {hidden_gems.map((gem, index) => (
                  <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                    <h3 className="font-medium text-gray-900">{gem.name}</h3>
                    <p className="text-sm text-gray-700 mb-1">{gem.description}</p>
                    <p className="text-sm text-yellow-700 italic">{gem.why_special}</p>
                    {gem.search_link && (
                      <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                        <a href={gem.search_link} target="_blank" rel="noopener noreferrer">
                          Learn More
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Star className="w-6 h-6 mr-3 text-green-500" />
                Signature Experiences
              </h2>
              <div className="space-y-4">
                {signature_experiences.map((exp, index) => (
                  <div key={index} className="border-l-4 border-green-400 pl-4 py-2">
                    <h3 className="font-medium text-gray-900">{exp.name}</h3>
                    
                    {/* Experience Tags */}
                    {exp.tags && exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-2">
                        {exp.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                          <TagBadge key={tagIndex} tag={tag} type="activity" />
                        ))}
                        {exp.tags.length > 4 && (
                          <span className="text-xs text-gray-500">+{exp.tags.length - 4} more</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-700 mb-1">{exp.description}</p>
                    <p className="text-sm text-green-700 italic mb-1">{exp.why_local_loves_it}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Cost: {exp.estimated_cost}</span>
                      {exp.booking_link && (
                        <Button asChild size="sm" variant="outline" className="text-xs">
                          <a href={exp.booking_link} target="_blank" rel="noopener noreferrer">
                            Book Experience
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Food Guide & Shopping */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Coffee className="w-6 h-6 mr-3 text-orange-500" />
                Hyperlocal Food Guide
              </h2>
              <div className="space-y-4">
                {hyperlocal_food_guide.map((food, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{food.dish}</h3>
                    
                    {/* Food Tags */}
                    {food.tags && food.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-2">
                        {food.tags.slice(0, 4).map((tag: string, tagIndex: number) => (
                          <TagBadge key={tagIndex} tag={tag} type="food" />
                        ))}
                        {food.tags.length > 4 && (
                          <span className="text-xs text-gray-500">+{food.tags.length - 4} more</span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-700 mb-2">{food.description}</p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Where to find:</strong> {food.where_to_find}
                    </p>
                    <p className="text-sm text-orange-700">
                      <strong>💡 Local tip:</strong> {food.local_tip}
                    </p>
                    {food.search_link && (
                      <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                        <a href={food.search_link} target="_blank" rel="noopener noreferrer">
                          Find Places
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-purple-500" />
                Shopping Insider Guide
              </h2>
              <div className="space-y-4">
                {shopping_insider_guide.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{item.item}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Where to buy:</strong> {item.where_to_buy}
                    </p>
                    <p className="text-sm text-purple-700">
                      <strong>💡 Local tip:</strong> {item.local_tip}
                    </p>
                    {item.search_link && (
                      <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
                        <a href={item.search_link} target="_blank" rel="noopener noreferrer">
                          Find Stores
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Practical Local Wisdom */}
          <Card className="bg-white border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-blue-500" />
              Practical Local Wisdom
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Safety Tips</h3>
                    <p className="text-sm text-gray-700">{practical_local_wisdom.safety_tips}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Health & Wellness</h3>
                    <p className="text-sm text-gray-700">{practical_local_wisdom.health_and_wellness}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Connectivity</h3>
                    <p className="text-sm text-gray-700">{practical_local_wisdom.connectivity}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bus className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Transport</h3>
                    <p className="text-sm text-gray-700">{practical_local_wisdom.transport}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* User Info */}
          <Card className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-600">{user_info.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Created by {user_info.name}</p>
                  <p className="text-sm text-gray-500">{user_info.email}</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>ID: {itinerary_id}</p>
                <p>Updated: {formatDate(updated_at)}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
 );
};

export default ItineraryDetails;