"use client"
import { motion } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  index: number;
  videoSrc: string;
  clientName: string;
  brandName: string;
  location: string;
  isPlaying: boolean;
  onVideoPlay: (index: number) => void;
  setVideoRef: (index: number, ref: HTMLVideoElement | null) => void;
  setCardRef: (index: number, ref: HTMLDivElement | null) => void;
  variant?: "default" | "minimal";
  className?: string;
  videoContainerClassName?: string;
  videoClassName?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  index,
  videoSrc,
  clientName,
  brandName,
  location,
  isPlaying,
  onVideoPlay,
  setVideoRef,
  setCardRef,
  variant = "default",
  className,
  videoContainerClassName,
  videoClassName,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCardClick = () => {
    onVideoPlay(index);
  };

  // Safari-specific video handling
  React.useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        // When playing, ensure video is unmuted and plays
        videoRef.current.muted = false;
        videoRef.current.play().catch(console.error);
      } else {
        // When not playing, ensure video is paused and muted
        videoRef.current.pause();
        videoRef.current.muted = true;
        // Reset to first frame for thumbnail
        videoRef.current.currentTime = 0.1;
      }
    }
  }, [isPlaying]);

  const wrapperClasses = cn(
    "transition-all duration-300 overflow-hidden",
    variant === "minimal"
      ? "rounded-3xl bg-transparent shadow-none"
      : "rounded-3xl bg-white shadow-lg hover:shadow-xl",
    variant === "default" ? "flex flex-col cursor-pointer" : "cursor-pointer",
    className
  );

  const videoContainerClasses = cn(
    videoContainerClassName
      ? videoContainerClassName
      : variant === "default"
        ? "relative w-full aspect-[3/4] overflow-hidden"
        : "relative w-full h-[90vh] sm:h-[85vh] lg:h-[80vh]",
  );

  const computedVideoClassName = cn(
    videoClassName
      ? videoClassName
      : variant === "default"
        ? "w-full h-full object-cover"
        : "w-full h-full object-contain",
    videoClassName
  );

  return (
    <motion.div
      ref={(ref) => {
        setCardRef(index, ref);
      }}
      data-index={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={wrapperClasses}
      style={{
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      }}
      onClick={handleCardClick}
    >
       {/* Video Container - much taller height */}
       <div 
        className={videoContainerClasses}
         style={{
           WebkitTransform: 'translateZ(0)',
           transform: 'translateZ(0)',
           WebkitBackfaceVisibility: 'hidden',
           backfaceVisibility: 'hidden'
         }}
       >
        <video
          ref={(ref) => {
            videoRef.current = ref;
            setVideoRef(index, ref);
          }}
          src={videoSrc}
           className={computedVideoClassName}
          style={{
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
          controls={false}
          playsInline
          preload="metadata"
          poster=""
          muted
          onLoadedMetadata={() => {
            // Force Safari to load the first frame as thumbnail
            if (videoRef.current) {
              videoRef.current.currentTime = 0.1;
              // Ensure the first frame is visible
              videoRef.current.pause();
            }
          }}
          onCanPlay={() => {
            // Additional Safari optimization - ensure first frame is loaded
            if (videoRef.current && !isPlaying) {
              videoRef.current.currentTime = 0.1;
              videoRef.current.pause();
            }
          }}
          onEnded={() => onVideoPlay(-1)}
          tabIndex={-1}
        />
        {/* Play button overlay when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/15">
            <div className="bg-white rounded-full p-3 md:p-4 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {variant === "default" && (
        <div className="flex flex-col gap-1 px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">{clientName}</h3>
          <p className="text-sm text-gray-500 leading-snug">
            {brandName}
            {brandName && location ? ", " : ""}
            {location}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialCard; 