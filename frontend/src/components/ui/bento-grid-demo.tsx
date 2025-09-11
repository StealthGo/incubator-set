import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid";
import { Briefcase, Sparkle, CalendarDays, Users } from "lucide-react";
import Image from "next/image";

export function BentoGridWhyUs() {
  return (
    <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem] gap-6">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = ({ src }: { src: string }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative group">
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-100/30 opacity-30 group-hover:opacity-0 transition-opacity duration-300"></div>
    <Image 
      src={src} 
      alt="Feature illustration" 
      fill 
      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
    />
  </div>
);

const items = [
  {
    title: "Group and Collaborate Feature",
    description: "Connect with like-minded travelers, plan together, and share experiences in real time.",
    header: <Skeleton src="/11.jpg" />,
  className: "md:col-span-2 hover:border-[#37C2C4] transition-all duration-300 bg-white dark:bg-black/90 border border-[#37C2C4] rounded-2xl shadow-lg",
  icon: <Briefcase className="h-5 w-5" style={{ color: '#37C2C4' }} />,
  },
  {
    title: "Ignite Your Wanderlust Feature",
    description: "Get inspired with curated travel ideas, trending spots, and unique destinations.",
    header: <Skeleton src="/12.jpg" />,
  className: "md:col-span-1 hover:border-[#37C2C4] transition-all duration-300 bg-white dark:bg-black/90 border border-[#37C2C4] rounded-2xl shadow-lg",
  icon: <Sparkle className="h-5 w-5" style={{ color: '#37C2C4' }} />,
  },
  {
    title: "Personalised Discovery Feature",
    description: "Discover places tailored to your preferences, travel style, and past journeys.",
    header: <Skeleton src="/13.jpg" />,
  className: "md:col-span-1 hover:border-[#37C2C4] transition-all duration-300 bg-white dark:bg-black/90 border border-[#37C2C4] rounded-2xl shadow-lg",
  icon: <CalendarDays className="h-5 w-5" style={{ color: '#37C2C4' }} />,
  },
  {
    title: "Smart Savings",
    description: "Find budget-friendly options, deals, and discounts without compromising on experience.",
    header: <Skeleton src="/14.jpg" />,
  className: "md:col-span-2 hover:border-[#37C2C4] transition-all duration-300 bg-white dark:bg-black/90 border border-[#37C2C4] rounded-2xl shadow-lg",
  icon: <Users className="h-5 w-5" style={{ color: '#37C2C4' }} />,
  },
  {
    title: "Smarter Routes, Deeper Discoveries",
    description: "Get optimized routes that help you explore more while saving time and effort.",
    header: <Skeleton src="/15.jpg" />,
    className: "md:col-span-2 hover:border-amber-200 transition-all duration-300 bg-white dark:bg-black/90",
    icon: <Briefcase className="h-5 w-5 text-amber-500" />,
  },
  {
    title: "Hidden Treasures",
    description: "Uncover lesser-known gems and authentic local experiences beyond tourist hotspots.",
    header: <Skeleton src="/16.jpg" />,
    className: "md:col-span-1 hover:border-amber-200 transition-all duration-300 bg-white dark:bg-black/90",
    icon: <Sparkle className="h-5 w-5 text-amber-500" />,
  },
  {
    title: "Guidance from Those Who Know",
    description: "Benefit from tips and insights shared by locals and experienced travelers.",
    header: <Skeleton src="/17.jpg" />,
    className: "md:col-span-1 hover:border-amber-200 transition-all duration-300 bg-white dark:bg-black/90",
    icon: <CalendarDays className="h-5 w-5 text-amber-500" />,
  },
  {
    title: "Seamless Convenience",
    description: "Enjoy a smooth travel experience with easy planning, booking, and on-the-go support.",
    header: <Skeleton src="/18.jpg" />,
    className: "md:col-span-2 hover:border-amber-200 transition-all duration-300 bg-white dark:bg-black/90",
    icon: <Users className="h-5 w-5 text-amber-500" />,
  },

];
