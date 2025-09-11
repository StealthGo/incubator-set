"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Calendar, Mountain, Camera, Waves, Users, Star } from "lucide-react";  // Import missing icons

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
            Coming Soon!
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
}
<div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
</div>
