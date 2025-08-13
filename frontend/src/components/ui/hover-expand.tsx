"use client"

import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface HoverExpandProps {
  images: string[]
  initialSelectedIndex?: number
  thumbnailHeight?: number
  modalImageSize?: number
  maxThumbnails?: number
}

export default function HoverExpand({
  images,
  initialSelectedIndex = 0,
  thumbnailHeight = 200,
  modalImageSize = 400,
  maxThumbnails = 11,
}: HoverExpandProps) {
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false)
      }
    }

    if (isModalOpen) {
      document.body.classList.add("overflow-hidden")
      document.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.classList.remove("overflow-hidden")
    }
  }, [isModalOpen])

  return (
    <div className="relative">
      <div className="mx-auto flex w-fit gap-1 rounded-md pb-20 pt-10 md:gap-2">
        {images.slice(0, maxThumbnails).map((imageUrl, i) => (
          <motion.div
            key={`image-container-${i}`}
            className="group relative h-52 overflow-hidden rounded-2xl cursor-pointer"
            initial={{ width: selectedIndex === i ? 256 : 48 }}
            animate={{ 
              width: selectedIndex === i ? 256 : 48,
              transition: { 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94]  // cubic-bezier for smooth animation
              }
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            onMouseEnter={() => setSelectedIndex(i)}
            onClick={() => {
              setSelectedIndex(i)
              setIsModalOpen(true)
            }}
          >
            <motion.div
              layoutId={`image-${i}`}
              className="absolute inset-0 size-full"
            >
              <motion.img
                src={imageUrl}
                alt={`Image ${i + 1}`}
                className="size-full object-cover"
                initial={{ scale: 1.1, opacity: 0.8 }}
                animate={{ 
                  scale: selectedIndex === i ? 1 : 1.1,
                  opacity: selectedIndex === i ? 1 : 0.7,
                  transition: { 
                    duration: 0.6, 
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }
                }}
                whileHover={{
                  scale: selectedIndex === i ? 1.05 : 1.15,
                  opacity: 1,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              />
            </motion.div>
            
            {/* Overlay for better visual feedback */}
            <motion.div
              className="absolute inset-0 bg-black/20"
              initial={{ opacity: selectedIndex === i ? 0 : 0.3 }}
              animate={{ 
                opacity: selectedIndex === i ? 0 : 0.3,
                transition: { duration: 0.4 }
              }}
              whileHover={{ 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
            />
            
            {/* Subtle border highlight */}
            <motion.div
              className="absolute inset-0 border-2 border-white/50 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: selectedIndex === i ? 1 : 0,
                transition: { duration: 0.3 }
              }}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ 
              opacity: 1, 
              backdropFilter: "blur(8px)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            exit={{ 
              opacity: 0, 
              backdropFilter: "blur(0px)",
              transition: { duration: 0.2, ease: "easeIn" }
            }}
            className="fixed inset-0 z-50 grid place-content-center bg-white/40 backdrop-blur-sm dark:bg-black/40"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="cursor-pointer overflow-hidden rounded-2xl bg-black shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.4, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.1
                }
              }}
              exit={{ 
                scale: 0.9, 
                opacity: 0, 
                y: 30,
                transition: { duration: 0.2, ease: "easeIn" }
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div
                layoutId={`image-${selectedIndex}`}
                className="relative size-96"
              >
                <img
                  src={images[selectedIndex]}
                  alt={`Image ${selectedIndex + 1}`}
                  className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
