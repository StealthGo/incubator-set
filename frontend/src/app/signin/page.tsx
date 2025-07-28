"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SignInInner({ router }: { router: ReturnType<typeof useRouter> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const res = await fetch("http://localhost:8000/api/signin", {
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
      router.push("/preferences");
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Transparent, blurred background to reveal underlying page */}
      <div className="absolute inset-0 z-0 backdrop-blur-2xl bg-transparent" />
      <div className="relative z-10 w-full max-w-sm bg-white/80 rounded-xl shadow-xl p-8 animate-fade-in backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-yellow-700">Sign In</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" className="px-4 py-2 border border-yellow-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" required value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="px-4 py-2 border border-yellow-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400" required value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600 transition-all" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
        </form>
        {success && <div className="mt-2 text-green-600 text-sm text-center">{success}</div>}
        {error && <div className="mt-2 text-red-600 text-sm text-center">{error}</div>}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account? <Link href="/signup" className="text-yellow-700 hover:underline">Sign Up</Link>
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

export default function SignIn() {
  const router = useRouter();
  return (
    <Suspense fallback={null}>
      <SignInInner router={router} />
    </Suspense>
  );
} 