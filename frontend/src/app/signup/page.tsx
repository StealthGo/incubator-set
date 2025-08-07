"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildApiUrl, API_ENDPOINTS } from '@/lib/api';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.signup), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Sign up failed");
        setLoading(false);
        return;
      }
      // Optionally, auto-login or redirect to sign in
      router.push("/signin?signup=success");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 font-sans">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Sign Up</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
        </form>
        {error && <div className="mt-2 text-red-600 text-sm text-center">{error}</div>}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
} 