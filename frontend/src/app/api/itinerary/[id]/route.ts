import { NextRequest, NextResponse } from 'next/server';

// Mock data that matches your TypeScript interfaces
const mockItineraryData = {
  itinerary_id: "example-id-123",
  user_info: {
    email: "user@example.com",
    name: "Travel Enthusiast"
  },
  trip_parameters: {
    destination: "Paris, France",
    dates: "June 15-22, 2024",
    travelers: "2 Adults",
    interests: "Culture, Food, History",
    budget: "$3,000 - $4,000",
    pace: "Moderate"
  },
  itinerary: {
    hero_image_url: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?auto=format&fit=crop&w=2070&q=80",
    destination_name: "Paris, France",
    personalized_title: "A Romantic Cultural Journey Through Paris",
    journey_details: {
      title: "Getting to Paris",
      options: [
        {
          mode: "Flight",
          duration: "8-12 hours",
          description: "Direct flights from major US cities",
          estimated_cost: "$600-1200",
          booking_link: "https://example.com/flights"
        }
      ]
    },
    accommodation_suggestions: [
      {
        name: "Hotel de la Paix",
        type: "Boutique Hotel",
        icon: "🏨",
        description: "Charming hotel in the heart of Paris",
        estimated_cost: "$200-300/night",
        booking_link: "https://example.com/hotel",
        image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
      }
    ],
    trip_overview: {
      destination_insights: "Paris, the City of Light, offers world-class museums, incredible cuisine, and romantic atmosphere.",
      weather_during_visit: "Pleasant summer weather with temperatures 20-25°C",
      seasonal_context: "Peak tourist season with longer days",
      cultural_context: "Rich artistic heritage and café culture",
      local_customs_to_know: [
        "Greet shopkeepers when entering stores",
        "Don't speak loudly in public spaces",
        "Tipping 10% at restaurants is customary"
      ],
      estimated_total_cost: "$3,500"
    },
    daily_itinerary: [
      {
        date: "2024-06-15",
        theme: "Arrival & First Impressions",
        activities: [
          {
            time: "10:00 AM",
            activity: "Visit the Louvre Museum",
            location: "Louvre Museum",
            description: "Explore the world's largest art museum",
            local_guide_tip: "Book skip-the-line tickets in advance",
            icon: "🎨",
            image_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?auto=format&fit=crop&w=1000&q=80",
            Maps_link: "https://maps.google.com",
            booking_link: "https://example.com/louvre",
            tags: ["Cultural", "Heritage", "Photography", "Historical"]
          }
        ],
        meals: {
          lunch: {
            dish: "French Onion Soup",
            restaurant: "L'Ami Jean",
            description: "Traditional French bistro",
            image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
            zomato_link: "https://example.com/restaurant",
            tags: ["Traditional", "Non-Vegetarian", "Local Specialty"]
          },
          dinner: {
            dish: "Coq au Vin",
            restaurant: "Le Comptoir du Relais",
            description: "Classic French dinner",
            image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
            zomato_link: "https://example.com/restaurant",
            tags: ["Traditional", "Non-Vegetarian", "Fine Dining"]
          }
        }
      }
    ],
    hidden_gems: [
      {
        name: "Secret Garden",
        description: "Hidden courtyard in Marais district",
        why_special: "Local artists gather here for inspiration",
        search_link: "https://example.com/search"
      }
    ],
    signature_experiences: [
      {
        name: "Seine River Cruise at Sunset",
        description: "Romantic boat ride along the Seine",
        why_local_loves_it: "Best time to see Paris illuminated",
        estimated_cost: "$25-35",
        booking_link: "https://example.com/cruise"
      }
    ],
    hyperlocal_food_guide: [
      {
        dish: "Pain au Chocolat",
        description: "Buttery pastry with chocolate",
        where_to_find: "Local boulangeries",
        local_tip: "Best enjoyed warm in the morning",
        search_link: "https://example.com/bakery"
      }
    ],
    shopping_insider_guide: [
      {
        item: "French Macarons",
        where_to_buy: "Ladurée or Pierre Hermé",
        local_tip: "Try seasonal flavors",
        search_link: "https://example.com/macarons"
      }
    ],
    practical_local_wisdom: {
      safety_tips: "Keep belongings secure in tourist areas",
      health_and_wellness: "Tap water is safe to drink",
      connectivity: "Free WiFi available in most cafés",
      transport: "Metro is efficient and covers the whole city"
    }
  },
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2024-01-15T10:30:00Z"
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real application, you would:
    // 1. Validate the ID format
    // 2. Query your database for the itinerary
    // 3. Handle user authentication/authorization
    // 4. Return appropriate error responses
    
    // For now, return mock data with the requested ID
    const responseData = {
      ...mockItineraryData,
      itinerary_id: id
    };
    
    // Simulate a small delay to test loading states
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch itinerary data' },
      { status: 500 }
    );
  }
}
