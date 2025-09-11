"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  href?: string;
  userImg?: string;
  userName?: string;
  views?: string;
  likes?: number;
}

interface CardCarouselProps {
  images: CarouselImage[];
  autoplayDelay?: number;
  showPagination?: boolean;
  showNavigation?: boolean;
  className?: string;
}

export const CardCarousel: React.FC<CardCarouselProps> = ({
  images,
  autoplayDelay = 3000,
  showPagination = true,
  showNavigation = true,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoplay || !autoplayDelay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [isAutoplay, autoplayDelay, images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  // Create an infinite array for smooth scrolling
  const getVisibleCards = () => {
    const visibleCards = [];
    const totalVisible = 5; // Show 5 cards total (2 left, 1 center, 2 right)
    
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + images.length) % images.length;
      const image = images[index];
      visibleCards.push({
        ...image,
        position: i,
        originalIndex: index
      });
    }
    
    return visibleCards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div 
      className={cn("relative w-full max-w-7xl mx-auto py-8", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel container */}
      <div className="relative h-[480px] flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {visibleCards.map((card, index) => {
            const position = card.position;
            const isCenter = position === 0;
            const scale = isCenter ? 1 : 0.85;
            const opacity = Math.abs(position) <= 1 ? 1 : 0.6;
            const zIndex = isCenter ? 30 : 20 - Math.abs(position);
            
            // Calculate positions for infinite scroll effect
            const translateX = position * 320; // 320px spacing between cards
            const rotateY = position * -15; // Slight rotation for depth
            const translateZ = isCenter ? 0 : -50;

            // Only pass CarouselImage props to CarouselCard
            const { position: cardPosition, originalIndex, ...carouselImageProps } = card;
            return (
              <motion.div
                key={`${card.originalIndex}-${position}`}
                className="absolute cursor-default"
                initial={false}
                animate={{
                  x: translateX,
                  scale: scale,
                  rotateY: rotateY,
                  z: translateZ,
                  opacity: opacity,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: zIndex,
                }}
                onClick={() => !isCenter && goToSlide(card.originalIndex)}
                whileHover={!isCenter ? { scale: scale * 1.05 } : {}}
              >
                <CarouselCard image={carouselImageProps} isCenter={isCenter} />
              </motion.div>
            );
          })}
        </div>
        
        {/* Gradient overlays for infinite effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FCFAF8] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FCFAF8] to-transparent pointer-events-none z-10" />
      </div>

      {/* Navigation arrows */}
      {showNavigation && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-3 shadow-xl transition-all duration-200 hover:scale-110 z-40 border border-gray-200/50"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-3 shadow-xl transition-all duration-200 hover:scale-110 z-40 border border-gray-200/50"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Pagination dots */}
      {showPagination && images.length > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-amber-500 scale-125 shadow-lg"
                  : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Individual carousel card component
const CarouselCard: React.FC<{ image: CarouselImage; isCenter: boolean }> = ({ image, isCenter }) => {
  return (
    <div 
      className={cn(
        "relative bg-white rounded-2xl overflow-hidden transition-all duration-300",
        "w-[300px] h-[400px]",
        isCenter 
          ? "shadow-2xl ring-2 ring-amber-200/50" 
          : "shadow-lg"
      )}
    >
      {/* Image container */}
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Title overlay on image */}
        {image.title && (
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-lg font-bold drop-shadow-lg line-clamp-2">
              {image.title}
            </h3>
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className="p-4 h-[160px] flex flex-col">
        {/* Description */}
        {image.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3 flex-grow">
            {image.description}
          </p>
        )}
        
        {/* User info and stats */}
        {(image.userImg || image.userName || image.views || image.likes) && (
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {image.userImg && (
                <img
                  src={image.userImg}
                  alt={image.userName || "User"}
                  className="w-6 h-6 rounded-full object-cover border border-gray-200"
                />
              )}
              {image.userName && (
                <span className="font-medium text-sm text-gray-800">
                  {image.userName}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {image.views && (
                <span className="flex items-center gap-1">
                  👁 {image.views}
                </span>
              )}
              {image.likes && (
                <span className="flex items-center gap-1">
                  ❤️ {image.likes}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
