"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState<{ name: string; email: string; dob: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/signin?next=/profile");
      return;
    }
    fetch("http://localhost:8000/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          router.push("/signin?next=/profile");
          return;
        }
        const data = await res.json();
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/signin?next=/profile");
      });
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 font-sans">
      <div className="w-full max-w-lg bg-white rounded-xl shadow p-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Your Profile</h1>
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-yellow-200 flex items-center justify-center text-3xl font-bold text-yellow-700">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <div className="text-lg font-semibold text-gray-800">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-sm text-gray-500">DOB: {user.dob}</div>
        </div>
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