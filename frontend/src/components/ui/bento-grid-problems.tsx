import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid";
import { AlertTriangle, MapPin, DollarSign, Users } from "lucide-react";
import Image from "next/image";

const Skeleton = ({ src }: { src: string }) => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-2xl overflow-hidden relative group">
    <div className="absolute inset-0 bg-gradient-to-br from-[#37C2C4]/20 to-[#37C2C4]/30 opacity-30 group-hover:opacity-0 transition-opacity duration-300"></div>
    <Image 
      src={src} 
      alt="Problem illustration" 
      fill 
      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
    />
  </div>
);

const problems = [
  {
    title: "Stuck with One-Size-Fits-All Itineraries?",
    description: "Most travel platforms offer generic plans that don't match your unique interests or travel style.",
    header: <Skeleton src="/21.jpg" />,
  className: "md:col-span-2 bg-white dark:bg-black/90 border border-[#37C2C4] hover:border-[#37C2C4] transition-all duration-300 rounded-2xl shadow-lg",
  icon: <DollarSign className="h-5 w-5" style={{ color: '#37C2C4' }} />,
  },
  {
    title: "Afraid of falling in a tourist trap",
    description: "It's easy to end up in overcrowded, overpriced spots that don't deliver an authentic experience.",
    header: <Skeleton src="/22.jpg" />,
  className: "md:col-span-1 bg-white dark:bg-black/90 border border-[#37C2C4] hover:border-[#37C2C4] transition-all duration-300 rounded-2xl shadow-lg",
  icon: <Users className="h-5 w-5" style={{ color: '#37C2C4' }} />,
  },
  {
    title: "lost in the details",
    description: "Planning a trip can be overwhelming with too many options, hidden costs, and confusing logistics.",
    header: <Skeleton src="/23.jpg" />,
  className: "md:col-span-1 bg-white dark:bg-black/90 border border-[#37C2C4] hover:border-[#37C2C4] transition-all duration-300 rounded-2xl shadow-lg",
  icon: <MapPin className="h-5 w-5" style={{ color: '#37C2C4' }} />,
  },
  {
    title: "Safety & Trust Issues",
    description: "Concerns about safety, hygiene, and trustworthy recommendations make travel planning stressful.",
    header: <Skeleton src="/43.jpeg" />,
  className: "md:col-span-2 bg-white dark:bg-black/90 border border-[#37C2C4] hover:border-[#37C2C4] transition-all duration-300 rounded-2xl shadow-lg",
  icon: <AlertTriangle className="h-5 w-5" style={{ color: '#37C2C4' }} />,
  },
];

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
