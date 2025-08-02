import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "food" | "activity"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    outline: "text-foreground",
    food: "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200",
    activity: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
  }
  
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

// Tag Badge component for food and activity tags
interface TagBadgeProps {
  tag: string;
  type?: "activity" | "food";
}

function TagBadge({ tag, type = "activity" }: TagBadgeProps) {
  const getTagStyle = (tag: string, type: string) => {
    const foodColors: Record<string, string> = {
      "Vegetarian": "bg-green-100 text-green-800",
      "Vegan": "bg-green-200 text-green-900",
      "Non-Vegetarian": "bg-red-100 text-red-800",
      "Street Food": "bg-orange-100 text-orange-800",
      "Fine Dining": "bg-purple-100 text-purple-800",
      "Local Specialty": "bg-yellow-100 text-yellow-800",
      "Spicy": "bg-red-200 text-red-900",
      "Sweet": "bg-pink-100 text-pink-800",
      "Traditional": "bg-amber-100 text-amber-800",
      "Fusion": "bg-indigo-100 text-indigo-800",
      "Budget": "bg-green-100 text-green-700",
      "Premium": "bg-purple-100 text-purple-700"
    };

    const activityColors: Record<string, string> = {
      "Adventure": "bg-red-100 text-red-800",
      "Cultural": "bg-blue-100 text-blue-800",
      "Heritage": "bg-amber-100 text-amber-800",
      "Nature": "bg-green-100 text-green-800",
      "Food": "bg-orange-100 text-orange-800",
      "Shopping": "bg-pink-100 text-pink-800",
      "Religious": "bg-purple-100 text-purple-800",
      "Nightlife": "bg-indigo-100 text-indigo-800",
      "Family-Friendly": "bg-cyan-100 text-cyan-800",
      "Budget": "bg-green-100 text-green-700",
      "Luxury": "bg-purple-100 text-purple-700",
      "Photography": "bg-gray-100 text-gray-800",
      "Historical": "bg-amber-100 text-amber-800",
      "Wellness": "bg-teal-100 text-teal-800",
      "Sports": "bg-blue-100 text-blue-800"
    };

    if (type === "food") {
      return foodColors[tag] || "bg-gray-100 text-gray-800";
    }
    return activityColors[tag] || "bg-gray-100 text-gray-800";
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      getTagStyle(tag, type)
    )}>
      {tag}
    </span>
  );
}

export { Badge, TagBadge }
