import React, { useEffect, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

import { TypewriterEffect } from "./TypeWriter"

// Define types for props
interface HeroProps {
  images: string[]
  children?: React.ReactNode
  overlay?: boolean
  overlayClassName?: string
  className?: string
  autoplay?: boolean
  direction?: "up" | "down"
}

export const Hero: React.FC<HeroProps> = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up"
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [, setLoading] = useState<boolean>(false)
  const [loadedImages, setLoadedImages] = useState<string[]>([])

  const words = [
    {
      text: "KHÁM"
    },
    {
      text: "PHÁ"
    },
    {
      text: "XEM"
    },
    {
      text: "MỌI"
    },
    {
      text: "NGƯỜI"
    },
    {
      text: "NGHĨ"
    },
    {
      text: "GÌ.",
      className: "text-blue-700 dark:text-blue-500"
    }
  ]

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    )
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    )
  }

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = () => {
    setLoading(true)
    const loadPromises = images.map((image) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.src = image
        img.onload = () => resolve(image)
        img.onerror = reject
      })
    })

    Promise.all(loadPromises)
      .then((loadedImages) => {
        setLoadedImages(loadedImages)
        setLoading(false)
      })
      .catch((error) => console.error("Failed to load images", error))
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext()
      } else if (event.key === "ArrowLeft") {
        handlePrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    // autoplay
    let interval: NodeJS.Timeout
    if (autoplay) {
      interval = setInterval(() => {
        handleNext()
      }, 5000)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      clearInterval(interval)
    }
  }, [autoplay])

  const slideVariants = {
    initial: {
      scale: 0,
      opacity: 0,
      rotateX: 45
    },
    visible: {
      scale: 1,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1.0]
      }
    },
    upExit: {
      opacity: 1,
      y: "-150%",
      transition: {
        duration: 1
      }
    },
    downExit: {
      opacity: 1,
      y: "150%",
      transition: {
        duration: 1
      }
    }
  }

  const areImagesLoaded = loadedImages.length > 0

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden py-80",
        className
      )}
      style={{
        perspective: "1000px"
      }}
    >
      <div className="opacity-1 z-50 flex transform-none flex-col items-center justify-center">
        <TypewriterEffect words={words} />
        <p className="bg-gradient-to-b from-blue-500 to-neutral-400 bg-clip-text py-4 text-center text-sm font-bold text-transparent md:text-2xl">
          Hãy cho chúng tôi biết suy nghĩ của bạn
        </p>
      </div>
      {areImagesLoaded && children}
      {areImagesLoaded && overlay && (
        <div className={cn("absolute inset-0 z-40", overlayClassName)} />
      )}

      {areImagesLoaded && (
        <AnimatePresence>
          <motion.img
            key={currentIndex}
            src={loadedImages[currentIndex]}
            initial="initial"
            animate="visible"
            exit={direction === "up" ? "upExit" : "downExit"}
            variants={slideVariants}
            className="image absolute inset-0 h-full w-full object-cover object-center"
          />
        </AnimatePresence>
      )}
    </div>
  )
}
