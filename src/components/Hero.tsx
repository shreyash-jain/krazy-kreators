"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useRef, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const handlePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsMuted(false);
      setShowPlayButton(false);
    }
  };

  const handleCardClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.muted = false;
        videoRef.current.play();
        setIsMuted(false);
        setShowPlayButton(false);
      } else {
        videoRef.current.pause();
        setShowPlayButton(true);
      }
    }
  };

  return (
    <section className="w-full mx-auto bg-[#F5EFE6] min-h-screen flex flex-col items-center justify-center relative">
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto text-center flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-48 xl:pt-56 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-12 xl:px-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#2D2A2E] mb-4 sm:mb-6 leading-tight font-sans">
          Not Just Threads<br className="hidden sm:inline" />
          We Weave <span className="bg-gradient-to-r from-[#CBB49A] via-[#b7a078] to-[#2D2A2E] bg-clip-text text-transparent">Possibilities</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#3D3846] font-light max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
                          Empowering new-age fashion brands with expert designs and creative solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10">
          <Button className="rounded-full bg-[#CBB49A] text-white px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold shadow-md hover:bg-[#b7a078] transition-all duration-300 transform hover:scale-105">
            Get Started
          </Button>
          <Button 
            variant="outline" 
            className="rounded-full border-[#CBB49A] text-[#2D2A2E] px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold hover:bg-[#CBB49A]/10 hover:border-[#b7a078] transition-all duration-300"
          >
            Start a Demo
          </Button>
        </div>
        <div className="w-full flex justify-center px-4 sm:px-6">
          <div
            className="relative w-full max-w-7xl rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_12px_48px_0_rgba(203,180,154,0.55)] aspect-video bg-black cursor-pointer"
            onClick={handleCardClick}
          >
            <video
              ref={videoRef}
              src="/hero-video.mp4"
              poster="https://via.placeholder.com/1280x720.png?text=Video+Placeholder"
              className="w-full h-full object-cover aspect-video"
              autoPlay
              loop
              muted={isMuted}
              playsInline
            >
              Sorry, your browser does not support embedded videos.
            </video>
            {showPlayButton && (
              <button
                aria-label="Play video"
                onClick={handlePlay}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6BA292] rounded-full p-3 sm:p-4 md:p-6 shadow-[0_4px_16px_0_rgba(107,162,146,0.35)] flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#6BA292]/40 transition-all duration-300 z-20 border-2 sm:border-4 border-white hover:scale-110"
                style={{ pointerEvents: 'auto' }}
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 