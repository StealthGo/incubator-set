"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, Mail, Lock, ArrowRight, Eye, EyeOff, Chrome, Apple, MapPin, Users, Star } from "lucide-react";
import { buildApiUrl, API_ENDPOINTS } from '@/lib/api';

function SignInInner({ router }: { router: ReturnType<typeof useRouter> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      setSuccess("Sign up successful! Please sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const form = new URLSearchParams();
      form.append("username", email);
      form.append("password", password);
      const res = await fetch(buildApiUrl(API_ENDPOINTS.signin), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Sign in failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      // If a pending query exists (from the homepage prompt), send straight to preferences with prompt
      const pending = localStorage.getItem('pendingQuery');
      if (pending) {
        localStorage.removeItem('pendingQuery');
        router.push(`/preferences?prompt=${encodeURIComponent(pending)}`);
      } else {
        router.push("/preferences");
      }
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans flex items-center justify-center px-6" style={{ backgroundColor: '#FCFAF8' }}>
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-amber-100/50 blur-3xl" />

      {/* Container grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left brand/benefits panel */}
        <div className="hidden md:flex flex-col gap-6 p-8 rounded-2xl border border-gray-200/70 bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Globe className="text-amber-600" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">The Modern <span className="text-amber-600">Chanakya</span></span>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">Plan smarter, travel happier.</h2>
            <p className="text-gray-600 mt-3">AI-powered itineraries crafted to your vibe. Sign in to continue where you left off.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-700"><MapPin className="text-amber-500" /> <span className="font-semibold">5,000+</span></div>
            <div className="flex items-center gap-2 text-gray-700"><Users className="text-amber-500" /> <span className="font-semibold">2,000+</span></div>
            <div className="flex items-center gap-2 text-gray-700"><Star className="text-amber-500" /> <span className="font-semibold">4.9/5</span></div>
          </div>
          <ul className="mt-2 text-gray-600 list-disc list-inside space-y-1">
            <li>Personalized trips in seconds</li>
            <li>Seamless maps export</li>
            <li>Offline-ready itineraries</li>
          </ul>
        </div>

        {/* Right auth card */}
        <div className="w-full md:max-w-md md:ml-auto bg-white rounded-2xl border border-gray-200/80 p-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">Sign in to continue your journey.</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <button onClick={(e)=>e.preventDefault()} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-gray-700 hover:bg-gray-50 transition">
              <Chrome size={18} className="text-amber-600" /> Google
            </button>
            <button onClick={(e)=>e.preventDefault()} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-gray-700 hover:bg-gray-50 transition">
              <Apple size={18} className="text-amber-600" /> Apple
            </button>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-500">or continue with email</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="relative">
              <span className="sr-only">Email</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"><Mail size={18} /></span>
              <input type="email" placeholder="Email" className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400" required value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label className="relative">
              <span className="sr-only">Password</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"><Lock size={18} /></span>
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400" required value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" aria-label="Toggle password visibility" onClick={()=>setShowPassword(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600"><input type="checkbox" className="rounded border-gray-300" /> Remember me</label>
              <Link href="#" className="text-amber-700 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="mt-1 w-full px-4 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-all flex items-center justify-center gap-2" disabled={loading}>
              {loading ? "Signing In..." : (<><span>Sign In</span><ArrowRight size={18} /></>)}
            </button>
          </form>
          {success && <div className="mt-3 text-green-600 text-sm text-center">{success}</div>}
          {error && <div className="mt-3 text-red-600 text-sm text-center">{error}</div>}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account? <Link href="/signup" className="text-amber-700 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.9s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
}

export default function SignIn() {
  const router = useRouter();
  return (
    <Suspense fallback={null}>
      <SignInInner router={router} />
    </Suspense>
  );
} 