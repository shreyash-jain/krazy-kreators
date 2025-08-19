"use client"
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

interface TestimonialCardProps {
  videoSrc: string;
  clientName: string;
  brandName: string;
  location: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  videoSrc,
  clientName,
  brandName,
  location,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleCardClick = () => {
    if (!playing) {
      setPlaying(true);
      setTimeout(() => {
        videoRef.current?.play();
      }, 100);
    } else {
      setPlaying(false);
      videoRef.current?.pause();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Video Container - reduced height */}
      <div className="relative w-full h-[70vh]" style={{ aspectRatio: '4/5' }}>
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          controls={false}
          playsInline
          preload="metadata"
          onEnded={() => setPlaying(false)}
          tabIndex={-1}
        />
        {/* Play button overlay when not playing */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {/* Client Details Section - without avatar */}
      <div className="p-4">
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
            {clientName}
          </h3>
          <p className="text-sm text-gray-600 leading-tight">
            {brandName}{location ? `, ${location}` : ''}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard; 