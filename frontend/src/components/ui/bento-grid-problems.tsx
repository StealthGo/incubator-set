import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid";
import { AlertTriangle, MapPin, DollarSign, Users } from "lucide-react";
import Image from "next/image";

const problems = [
  {
    title: "Stuck with One-Size-Fits-All Itineraries?",
    description: "Travellers often face unexpected charges, scams, and unclear pricing at destinations.",
    header: <Skeleton src="/21.jpg" />,
    className: "md:col-span-2 bg-white dark:bg-black/90",
    icon: <DollarSign className="h-5 w-5 text-red-500" />,
  },
  {
    title: "Afraid of falling in a tourist trap",
    description: "Popular places are often packed, making it hard to enjoy the experience authentically.",
    header: <Skeleton src="/22.jpg" />,
    className: "md:col-span-1 bg-white dark:bg-black/90",
    icon: <Users className="h-5 w-5 text-red-500" />,
  },
  {
    title: "lost in the details",
    description: "Most guides miss out on hidden gems and local culture, leaving travellers with generic experiences.",
    header: <Skeleton src="/23.jpg" />,
    className: "md:col-span-1 bg-white dark:bg-black/90",
    icon: <MapPin className="h-5 w-5 text-red-500" />,
  },
  {
    title: "Safety & Trust Issues",
    description: "Concerns about safety, hygiene, and trust in recommendations are common among travellers.",
    header: <Skeleton src="/problem4.jpg" />,
    className: "md:col-span-2 bg-white dark:bg-black/90",
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
  },
];

const Skeleton = ({ src }: { src: string }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative group">
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-100/30 opacity-30 group-hover:opacity-0 transition-opacity duration-300"></div>
    <Image 
      src={src} 
      alt="Problem illustration" 
      fill 
      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
    />
  </div>
);

export function BentoGridProblems() {
  return (
    <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem] gap-6">
      {problems.map((item, i) => (
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
