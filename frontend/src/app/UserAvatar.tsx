"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserAvatar() {
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      fetch("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) return;
          const data = await res.json();
          setUserInitial(data.name ? data.name[0].toUpperCase() : "U");
        })
        .catch(() => {});
    } else {
      setUserInitial(null);
    }
  }, []);

  if (!userInitial) return null;

  return (
    <button
      className="fixed top-4 right-6 z-50 w-11 h-11 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-bold text-yellow-900 shadow-lg border-2 border-white hover:scale-105 transition"
      onClick={() => router.push("/profile")}
      aria-label="User Profile"
    >
      {userInitial}
    </button>
  );
} 