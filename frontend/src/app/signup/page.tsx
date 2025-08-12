"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Mail, Lock, ArrowRight, Eye, EyeOff, Chrome, Apple, User } from "lucide-react";
import { buildApiUrl, API_ENDPOINTS } from '@/lib/api';

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      if (!name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }
      const res = await fetch(buildApiUrl(API_ENDPOINTS.signup), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        let errorMsg = "Sign up failed";
        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          // FastAPI validation errors are often arrays
          errorMsg = data.detail.map((err: any) => err.msg).join(", ");
        } else if (typeof data.detail === "object" && data.detail?.msg) {
          errorMsg = data.detail.msg;
        } else if (typeof data.detail === "object") {
          errorMsg = JSON.stringify(data.detail);
        }
        setError(errorMsg);
        setLoading(false);
        return;
      }
      router.push("/signin?signup=success");
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
        {/* Left brand panel */}
        <div className="hidden md:flex flex-col gap-6 p-8 rounded-2xl border border-gray-200/70 bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Globe className="text-amber-600" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">The Modern <span className="text-amber-600">Chanakya</span></span>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">Start your journey today.</h2>
            <p className="text-gray-600 mt-3">Create an account to build personalized itineraries in seconds.</p>
          </div>
          <ul className="mt-2 text-gray-600 list-disc list-inside space-y-1">
            <li>One-click trip customization</li>
            <li>Sync across devices</li>
            <li>Secure and private</li>
          </ul>
        </div>

        {/* Right auth card */}
        <div className="w-full md:max-w-md md:ml-auto bg-white rounded-2xl border border-gray-200/80 p-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600 mb-8">Join thousands of travellers planning smarter.</p>

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
            <span className="text-xs text-gray-500">or sign up with email</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="relative">
              <span className="sr-only">Full Name</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"><User size={18} /></span>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label className="relative">
              <span className="sr-only">Email</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"><Mail size={18} /></span>
              <input type="email" placeholder="Email" className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400" required value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label className="relative">
              <span className="sr-only">Password</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"><Lock size={18} /></span>
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400" required value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" aria-label="Toggle password visibility" onClick={()=>setShowPassword(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            <label className="relative">
              <span className="sr-only">Confirm Password</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"><Lock size={18} /></span>
              <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password" className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-400" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <button type="button" aria-label="Toggle confirm password visibility" onClick={()=>setShowConfirm(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            <button type="submit" className="mt-1 w-full px-4 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-all flex items-center justify-center gap-2" disabled={loading}>
              {loading ? "Signing Up..." : (<><span>Sign Up</span><ArrowRight size={18} /></>)}
            </button>
          </form>
          {error && <div className="mt-3 text-red-600 text-sm text-center">{error}</div>}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link href="/signin" className="text-amber-700 hover:underline">Sign In</Link>
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