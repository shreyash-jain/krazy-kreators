


"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import { getCloudinaryVideoUrl, getCloudinaryVideoPoster } from "@/lib/cloudinaryVideo";

const testimonials = [
  {
    videoSrc: getCloudinaryVideoUrl("/testimonial/testimonial-1.mp4"),
    posterSrc: getCloudinaryVideoPoster("/testimonial/testimonial-1.mp4"),
    clientName: "Preeti Gore",
    brandName: "Tilted Lotus",
    location: "Texas, USA",
  },
  {
    videoSrc: getCloudinaryVideoUrl("/testimonial/testimonial-2.mp4"),
    posterSrc: getCloudinaryVideoPoster("/testimonial/testimonial-2.mp4"),
    clientName: "Jivan Purewal",
    brandName: "Sankar",
    location: "London, England",
  },
  {
    videoSrc: getCloudinaryVideoUrl("/testimonial/las-testimonial.mp4"),
    posterSrc: getCloudinaryVideoPoster("/testimonial/las-testimonial.mp4"),
    clientName: "Anika McKelvey",
    brandName: "Las Loungewear",
    location: "Miami, USA",
  },
  {
    videoSrc: getCloudinaryVideoUrl("/testimonial/badria-testimonial.mp4"),
    posterSrc: getCloudinaryVideoPoster("/testimonial/badria-testimonial.mp4"),
    clientName: "Badria Al Shihhi",
    brandName: "Badria Al Shihhi",
    location: "Seeb, Oman",
  },
];

const TestimonialsSection = () => {
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleVideoPlay = useCallback((index: number) => {
    // Pause all other videos and reset them to first frame
    videoRefs.current.forEach((ref, i) => {
      if (ref && i !== index) {
        ref.pause();
        ref.muted = true;
        ref.currentTime = 0.1; // Reset to first frame for thumbnail
      }
    });

    // If clicking the same video that's playing, pause it
    if (playingVideoIndex === index) {
      setPlayingVideoIndex(null);
      if (videoRefs.current[index]) {
        videoRefs.current[index]?.pause();
        videoRefs.current[index]!.muted = true;
        videoRefs.current[index]!.currentTime = 0.1; // Reset to first frame
      }
    } else {
      // Play the clicked video
      setPlayingVideoIndex(index);
      if (videoRefs.current[index]) {
        videoRefs.current[index]!.muted = false;
        videoRefs.current[index]?.play().catch(console.error);
      }
    }
  }, [playingVideoIndex]);

  const setVideoRef = useCallback((index: number, ref: HTMLVideoElement | null) => {
    videoRefs.current[index] = ref;
  }, []);

  const setCardRef = useCallback((index: number, ref: HTMLDivElement | null) => {
    cardRefs.current[index] = ref;
  }, []);

  // Initialize all videos to show first frame as thumbnail
  useEffect(() => {
    const initializeVideos = () => {
      videoRefs.current.forEach((ref) => {
        if (ref) {
          ref.muted = true;
          ref.currentTime = 0.1;
          ref.pause();
        }
      });
    };

    // Initialize after a short delay to ensure videos are loaded
    const timer = setTimeout(initializeVideos, 100);
    return () => clearTimeout(timer);
  }, []);


  return (
    <section className="py-24 bg-gradient-to-br from-[#FAFAFA] to-white">
      <div className="min-w-[80%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div
         
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-center tracking-tight mb-6 text-gray-900">
            Trusted by Founders Worldwide
          </h2>
          <p className="text-base md:text-lg text-neutral-600 text-center max-w-2xl mx-auto mb-12">
            True Stories. Real Brands. Built with Krazy Kreators.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              index={i}
              videoSrc={t.videoSrc}
              posterSrc={t.posterSrc}
              clientName={t.clientName}
              brandName={t.brandName}
              location={t.location}
              isPlaying={playingVideoIndex === i}
              onVideoPlay={handleVideoPlay}
              setVideoRef={setVideoRef}
              setCardRef={setCardRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 