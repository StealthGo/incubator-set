// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://incubator-set.onrender.com',
  timeout: 30000, // 30 seconds
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  signin: '/api/signin',
  signup: '/api/signup',
  me: '/api/me',
  
  // Chat endpoints
  chatConversation: '/api/chat-conversation',
  
  // Itinerary endpoints
  generateItinerary: '/api/generate-itinerary',
  getItinerary: (id: string) => `/api/itinerary/${id}`,
  myItineraries: '/api/my-itineraries',
};

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove trailing slash from baseURL, ensure endpoint starts with one slash
  const base = API_CONFIG.baseURL.replace(/\/+$/, '');
  const path = `/${endpoint.replace(/^\/+/, '')}`;
  return base + path;
};

// Fetch wrapper with error handling
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
