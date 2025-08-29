import React, { useState, useRef, useEffect } from 'react';

// Simple API utility
const API_URL = 'http://localhost:8000';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const defaultOptions = {
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
    console.error(`API request failed:`, error);
    throw error;
  }
};

function SimplifiedChat() {
  const [messages, setMessages] = useState([
    { sender: 'system', text: 'Hey there! I\'m The Modern Chanakya, your personal travel buddy! 🇮🇳 Where in India would you like to go?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [readyForItinerary, setReadyForItinerary] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // API call to get assistant's response
      const response = await apiRequest('/api/chat-conversation', {
        method: 'POST',
        body: JSON.stringify({
          system_prompt: `You are "The Modern Chanakya" - a friendly, knowledgeable Indian travel buddy who helps plan amazing trips within India. You chat like a friend on WhatsApp - casual, quick, and fun! Keep it SHORT and snappy. Use emojis naturally. Ask ONE simple question at a time.`,
          conversation_history: newMessages,
          user_name: 'Traveler'
        })
      });

      const data = await response.json();
      
      // Add assistant's response
      setMessages([...newMessages, { sender: 'system', text: data.response }]);
      setIsTyping(false);
      
      // Check if ready for itinerary
      if (data.ready_for_itinerary) {
        setReadyForItinerary(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...newMessages, { sender: 'system', text: 'Sorry, I\'m having trouble connecting right now. Please try again!' }]);
      setIsTyping(false);
    }
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    
    try {
      const response = await apiRequest('/api/generate-itinerary', {
        method: 'POST',
        body: JSON.stringify({
          messages: messages
        })
      });

      const data = await response.json();
      setItinerary(data.itinerary);
      setLoading(false);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setLoading(false);
      setMessages([...messages, { sender: 'system', text: 'Sorry, I couldn\'t generate your itinerary. Please try again!' }]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">The Modern Chanakya</h1>
      <p className="text-center mb-8">Your AI travel buddy for exploring India</p>

      {itinerary ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{itinerary.personalized_title}</h2>
          <div className="mb-4">
            <h3 className="font-semibold">Destination</h3>
            <p>{itinerary.destination_name}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Trip Overview</h3>
            <p>{itinerary.trip_overview.destination_insights}</p>
            <p className="mt-2"><strong>Weather:</strong> {itinerary.trip_overview.weather_during_visit}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Daily Itinerary</h3>
            {itinerary.daily_itinerary.map((day, index) => (
              <div key={index} className="border-b pb-4 mb-4">
                <h4 className="font-medium">{day.day_number}: {day.theme}</h4>
                <p><strong>Breakfast:</strong> {day.breakfast.dish} at {day.breakfast.restaurant}</p>
                <p><strong>Morning:</strong> {day.morning_activities[0].activity} at {day.morning_activities[0].location}</p>
                <p><strong>Lunch:</strong> {day.lunch.dish} at {day.lunch.restaurant}</p>
                <p><strong>Afternoon:</strong> {day.afternoon_activities[0].activity} at {day.afternoon_activities[0].location}</p>
                <p><strong>Dinner:</strong> {day.dinner.dish} at {day.dinner.restaurant}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setItinerary(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Chat
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-white shadow-md rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-white shadow-md rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-lg"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || input.trim() === ''}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Send
            </button>
          </div>
          
          {readyForItinerary && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="mb-2">Ready to create your personalized itinerary?</p>
              <button
                onClick={handleGenerateItinerary}
                disabled={loading}
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300"
              >
                {loading ? 'Generating your itinerary...' : 'Generate Itinerary'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SimplifiedChat;
