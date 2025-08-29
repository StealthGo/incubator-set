"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane } from "lucide-react";

export default function ComingSoon() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => router.push("/waitlist-survey"), 1200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF8] px-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl shadow-md border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-500 rounded-full p-4 mb-4 shadow-lg">
            <Plane className="w-10 h-10 text-white rotate-12" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center font-poppins">
            Coming Soon
          </h1>
          <p className="text-base text-gray-600 mb-2 text-center max-w-xs">
            We’re almost ready to launch your next travel companion.<br />
            Be the first to know when we go live!
          </p>
        </div>
        {!isSubscribed ? (
          <div className="w-full flex flex-col gap-3 mb-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 text-gray-800 placeholder-amber-400 text-base"
            />
            <button
              onClick={handleSubscribe}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-full transition-all duration-200 text-base disabled:opacity-50"
              disabled={!email.trim()}
            >
              Join Waitlist
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center mb-2">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-700 font-semibold mb-1">Welcome to the waitlist!</p>
            <p className="text-gray-500 text-sm">Redirecting to our survey...</p>
          </div>
        )}
        <button
          onClick={() => router.push("/waitlist-survey")}
          className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-full transition-all duration-200 text-base"
        >
          Take the Waitlist Survey
        </button>
      </div>
    </div>
  );
          {/* Logo/Brand Area */}
          <div className="flex justify-center mb-6 pulse-gentle">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-full p-6 shadow-2xl">
                <Plane className="w-12 h-12 text-white transform rotate-45" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 bg-clip-text text-transparent slide-in">
            Wanderlust
          </h1>
          
          <div className="h-16 mb-6 flex items-center justify-center">
            <div className="slide-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center space-x-3">
                {features[currentFeature] &&
                  React.createElement(features[currentFeature].icon, {
                    className: `w-6 h-6 ${features[currentFeature].color}`
                  })}
                <p className="text-xl text-gray-700 font-medium">
                  {features[currentFeature]?.text}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed slide-in" style={{ animationDelay: "0.5s" }}>
            We're crafting the ultimate travel experience platform. From personalized itineraries to hidden local treasures, 
            your next adventure is about to get a whole lot more magical.
          </p>

          {/* Email Subscription */}
          {!isSubscribed ? (
            <div className="mb-8 slide-in" style={{ animationDelay: "0.7s" }}>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for early access"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8 fade-in-up">
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-semibold">🎉 Welcome aboard!</p>
                <p className="text-green-700">Redirecting to our survey...</p>
              </div>
            </div>
          )}

          {/* Featured Destinations */}
          <div className="mb-8 slide-in" style={{ animationDelay: "0.9s" }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Dream Destinations Coming Soon</h3>
            <div className="grid grid-cols-2 gap-4">
              {destinations.map((dest, index) => (
                <div 
                  key={dest.name}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
                  style={{ animationDelay: `${1.1 + index * 0.1}s` }}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {dest.image}
                  </div>
                  <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {dest.name}
                  </h4>
                  <p className="text-sm text-gray-600">{dest.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Counter */}
          <div className="grid grid-cols-3 gap-6 mb-8 slide-in" style={{ animationDelay: "1.3s" }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">1000+</div>
              <div className="text-sm text-gray-600">Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6 slide-in" style={{ animationDelay: "1.5s" }}>
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span>Join 2,847+ travelers on the waitlist</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-in" style={{ animationDelay: "1.7s" }}>
            <button
              onClick={() => router.push("/waitlist-survey")}
              className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Plan My Dream Trip</span>
              </span>
            </button>
            <button
              onClick={() => router.push("/explore")}
              className="group border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <Mountain className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Explore Destinations</span>
              </span>
            </button>
          </div>

          {/* Features Preview */}
          <div className="mt-8 pt-8 border-t border-gray-200 slide-in" style={{ animationDelay: "1.9s" }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">What's Coming</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-700">
                <Camera className="w-4 h-4 text-blue-500" />
                <span>AR Travel Guides</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Waves className="w-4 h-4 text-teal-500" />
                <span>Real-time Weather</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Travel Matching</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>AI Trip Curator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Elements */}
        <div className="fixed bottom-8 right-8 z-20">
          <div className="bg-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 cursor-pointer group">
            <div className="relative">
              <Plane className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 slide-in" style={{ animationDelay: "2.1s" }}>
          <div className="bg-white/70 rounded-full px-6 py-3 shadow-lg border border-white/30">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex space-x-1">
                {[1,2,3,4,5].map((step) => (
                  <div 
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      step <= 3 ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">60% Complete</span>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Success Animation */}
        {isSubscribed && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 fade-in-up">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Wanderlust!</h3>
              <p className="text-gray-600 mb-4">You're now on our exclusive early access list.</p>
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Plane className="w-4 h-4" />
                <span className="text-sm font-medium">Taking you to our survey...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
      </div>
    </div>
  );
}