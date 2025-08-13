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
    title: "Tailored for You",
    description: "We go beyond generic, templated itineraries. Our AI acts as a personal local advisor, crafting hyper-personalized journeys based on your unique interests.",
    header: <Skeleton src="/1.jpg" />,
    className: "md:col-span-2 hover:border-amber-200 transition-all duration-300 hover:shadow-xl bg-white dark:bg-black/90",
    icon: <Briefcase className="h-5 w-5 text-amber-500" />,
  },
  {
    title: "Hidden Gems",
    description: "Our platform features 'hidden gems' vetted by local experts, including invaluable 'Wise Traveler Insights' on cultural etiquette and safety.",
    header: <Skeleton src="/2.jpg" />,
    className: "md:col-span-1 hover:border-amber-200 transition-all duration-300 hover:shadow-xl bg-white dark:bg-black/90",
    icon: <Sparkle className="h-5 w-5 text-amber-500" />,
  },
  {
    title: "Seamless Convenience",
    description: "From initial prompt to final destination, our platform provides integrated maps and bookings for unique experiences with just a single tap.",
    header: <Skeleton src="/3.jpg" />,
    className: "md:col-span-1 hover:border-amber-200 transition-all duration-300 hover:shadow-xl bg-white dark:bg-black/90",
    icon: <CalendarDays className="h-5 w-5 text-amber-500" />,
  },
  {
    title: "Community Driven",
    description: "Join our community of 'Lorekeepers' to earn recognition and rewards for contributing unique, unbookable hidden gems and wise traveler tips.",
    header: <Skeleton src="/4.jpg" />,
    className: "md:col-span-2 hover:border-amber-200 transition-all duration-300 hover:shadow-xl bg-white dark:bg-black/90",
    icon: <Users className="h-5 w-5 text-amber-500" />,
  },
];
