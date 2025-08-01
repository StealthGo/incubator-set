"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";

interface FullItinerary {
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
  itinerary: {
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
        google_maps_link: string;
        booking_link: string | null;
      }>;
      meals: {
        lunch: {
          dish: string;
          restaurant: string;
          description: string;
          image_url: string;
          zomato_link: string;
        };
        dinner: {
          dish: string;
          restaurant: string;
          description: string;
          image_url: string;
          zomato_link: string;
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
    }>;
    hyperlocal_food_guide: Array<{
      dish: string;
      description: string;
      where_to_find: string;
      local_tip: string;
      search_link: string;
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

export default function ItineraryDetails() {
  const [itinerary, setItinerary] = useState<FullItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const itineraryId = params.id as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchItinerary = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/itinerary/${itineraryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Itinerary not found");
          } else if (res.status === 401) {
            router.push("/signin");
            return;
          } else {
            setError("Failed to load itinerary");
          }
          return;
        }

        const data = await res.json();
        setItinerary(data);
      } catch (error) {
        console.error("Failed to fetch itinerary:", error);
        setError("Failed to load itinerary");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [itineraryId, router]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{error || "Itinerary not found"}</h1>
        <button
          onClick={() => router.push("/profile")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </button>
            <div className="text-sm text-gray-500">
              Created {formatDate(itinerary.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {itinerary.itinerary.hero_image_url ? (
          <Image
            src={itinerary.itinerary.hero_image_url}
            alt={itinerary.itinerary.destination_name}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/1600/400?random=${itinerary.itinerary_id}`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{itinerary.itinerary.personalized_title}</h1>
            <p className="text-xl">{itinerary.itinerary.destination_name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Trip Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Destination:</span> {itinerary.trip_parameters.destination}</p>
                <p><span className="font-medium">Dates:</span> {itinerary.trip_parameters.dates}</p>
                <p><span className="font-medium">Travelers:</span> {itinerary.trip_parameters.travelers}</p>
                <p><span className="font-medium">Budget:</span> {itinerary.trip_parameters.budget}</p>
                <p><span className="font-medium">Pace:</span> {itinerary.trip_parameters.pace}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Local Insights</h3>
              <p className="text-sm text-gray-700 mb-4">{itinerary.itinerary.trip_overview.destination_insights}</p>
              <p className="text-sm"><span className="font-medium">Weather:</span> {itinerary.itinerary.trip_overview.weather_during_visit}</p>
            </div>
          </div>
        </div>

        {/* Daily Itinerary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h2>
          <div className="space-y-8">
            {itinerary.itinerary.daily_itinerary.map((day, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{day.theme}</h3>
                    <p className="text-gray-600">{formatDate(day.date)}</p>
                  </div>
                </div>
                
                <div className="space-y-4 ml-12">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-medium">{activity.time}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{activity.activity}</h4>
                        <p className="text-sm text-gray-600 mb-2">{activity.location}</p>
                        <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-2">
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">💡 Local Tip:</span> {activity.local_guide_tip}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {activity.google_maps_link && (
                            <a
                              href={activity.google_maps_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                            >
                              📍 Maps
                            </a>
                          )}
                          {activity.booking_link && (
                            <a
                              href={activity.booking_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
                            >
                              🎫 Book
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Meals for the day */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-orange-900 mb-2">🍽️ Lunch</h5>
                      <p className="text-sm font-medium">{day.meals.lunch.dish}</p>
                      <p className="text-sm text-gray-600">{day.meals.lunch.restaurant}</p>
                      <p className="text-xs text-gray-500 mt-1">{day.meals.lunch.description}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-purple-900 mb-2">🍽️ Dinner</h5>
                      <p className="text-sm font-medium">{day.meals.dinner.dish}</p>
                      <p className="text-sm text-gray-600">{day.meals.dinner.restaurant}</p>
                      <p className="text-xs text-gray-500 mt-1">{day.meals.dinner.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Gems & Experiences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💎 Hidden Gems</h2>
            <div className="space-y-4">
              {itinerary.itinerary.hidden_gems.map((gem, index) => (
                <div key={index} className="border-l-4 border-yellow-400 pl-4">
                  <h3 className="font-semibold text-gray-900">{gem.name}</h3>
                  <p className="text-sm text-gray-700 mb-1">{gem.description}</p>
                  <p className="text-sm text-yellow-700 italic">{gem.why_special}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⭐ Signature Experiences</h2>
            <div className="space-y-4">
              {itinerary.itinerary.signature_experiences.map((exp, index) => (
                <div key={index} className="border-l-4 border-green-400 pl-4">
                  <h3 className="font-semibold text-gray-900">{exp.name}</h3>
                  <p className="text-sm text-gray-700 mb-1">{exp.description}</p>
                  <p className="text-sm text-green-700 italic mb-1">{exp.why_local_loves_it}</p>
                  <p className="text-xs text-gray-500">Estimated cost: {exp.estimated_cost}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Practical Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎒 Practical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety & Health</h3>
              <p className="text-sm text-gray-700 mb-4">{itinerary.itinerary.practical_local_wisdom.safety_tips}</p>
              <p className="text-sm text-gray-700">{itinerary.itinerary.practical_local_wisdom.health_and_wellness}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Connectivity & Transport</h3>
              <p className="text-sm text-gray-700 mb-4">{itinerary.itinerary.practical_local_wisdom.connectivity}</p>
              <p className="text-sm text-gray-700">{itinerary.itinerary.practical_local_wisdom.transport}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
