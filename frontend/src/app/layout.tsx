"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserAvatar from "./UserAvatar";
import { useEffect, useState } from "react";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // Simulate loading
    return () => clearTimeout(timer);
  }, []);
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-466W8V28LZ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-466W8V28LZ');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative min-h-screen">
          {loading && (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-white transition-opacity duration-700" style={{ pointerEvents: 'all', opacity: loading ? 1 : 0 }}>
              <div className="flex flex-col items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-yellow-400 animate-pulse-minimal mb-2"></div>
                <div className="text-lg md:text-2xl font-semibold text-gray-800 tracking-wide">The Modern Chanakya</div>
              </div>
            </div>
          )}
          <UserAvatar />
          <div style={{ filter: loading ? 'blur(2px)' : 'none', transition: 'filter 0.7s' }}>
          {children}
          </div>
        </div>
        <style jsx global>{`
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-pulse-minimal {
            animation: pulse-minimal 1.2s cubic-bezier(0.4,0,0.2,1) infinite;
          }
          @keyframes pulse-minimal {
            0%, 100% { opacity: 0.7; box-shadow: 0 0 0 0 #fbbf24; }
            50% { opacity: 1; box-shadow: 0 0 0 8px #fbbf2422; }
          }
        `}</style>
      </body>
    </html>
  );
}
