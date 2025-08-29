// API Configuration
export const API_CONFIG = {
  // Always use deployed backend URL for all API requests
  baseURL: 'https://incubator-set.onrender.com',
  timeout: 30000, // 30 seconds
  longTimeout: 120000, // 120 seconds (2 minutes) for complex operations
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

// Fetch wrapper with error handling and endpoint-specific timeouts
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
    // Determine the appropriate timeout for this endpoint
    let timeoutDuration = API_CONFIG.timeout;
    
    // Use longer timeout for complex operations like itinerary generation
    if (endpoint === API_ENDPOINTS.generateItinerary ||
        endpoint.includes('generate-itinerary')) {
      timeoutDuration = API_CONFIG.longTimeout;
    }
    
    // Add timeout for fetch requests (not natively supported in fetch)
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutDuration);
    
    const fetchOptions = {
      ...defaultOptions,
      signal: abortController.signal
    };

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      // Log specific error details for debugging server errors
      if (response.status >= 500) {
        console.error(`Server error for ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      const fetchError = error as { name: string };
      if (fetchError?.name === 'AbortError') {
        console.error(`Request timeout for ${endpoint} after ${timeoutDuration}ms`);
        throw new Error(`Request timeout after ${timeoutDuration}ms`);
      }
      throw error;
    }
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};
