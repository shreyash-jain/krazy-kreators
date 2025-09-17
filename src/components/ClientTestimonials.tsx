


"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    videoSrc: "/testimonial/testimonial-1.mp4",
    clientName: "Preeti Gore",
    brandName: "Tilted Lotus",
    location: "Texas, USA",
    // avatarSrc: "/avatars/preeti-gore.jpg", // Optional: add avatar if available
  },
  {
    videoSrc: "/testimonial/testimonial-2.mp4",
    clientName: "Jivan Purewal",
    brandName: "Sankar",
    location: "London, England",
    // avatarSrc: "/avatars/jivan-purewal.jpg", // Optional: add avatar if available
  },
  {
    videoSrc: "/testimonial/las-testimonial.mp4",
    clientName: "Anika McKelvey",
    brandName: "Las Loungewear",
    location: "Miami, USA",
    // avatarSrc: "/avatars/anika-las.jpg", // Optional: add avatar if available
  },
  {
    videoSrc: "/testimonial/badria-testimonial.mp4",
    clientName: "Badria Al Shihhi",
    brandName: "Badria Al Shihhi",
    location: "Seeb, Oman",
    // avatarSrc: "/avatars/badria-al-shihhi.jpg", // Optional: add avatar if available
  },
];

const TestimonialsSection = () => {
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleVideoPlay = useCallback((index: number) => {
    // Pause all other videos
    videoRefs.current.forEach((ref, i) => {
      if (ref && i !== index) {
        ref.pause();
      }
    });

    // If clicking the same video that's playing, pause it
    if (playingVideoIndex === index) {
      setPlayingVideoIndex(null);
      if (videoRefs.current[index]) {
        videoRefs.current[index]?.pause();
      }
    } else {
      // Play the clicked video
      setPlayingVideoIndex(index);
      if (videoRefs.current[index]) {
        videoRefs.current[index]?.play();
      }
    }
  }, [playingVideoIndex]);

  const setVideoRef = useCallback((index: number, ref: HTMLVideoElement | null) => {
    videoRefs.current[index] = ref;
  }, []);

  const setCardRef = useCallback((index: number, ref: HTMLDivElement | null) => {
    cardRefs.current[index] = ref;
  }, []);

  // Intersection Observer to auto-play first visible and pause others
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let firstVisibleIndex: number | null = null;
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          const video = videoRefs.current[index];
          if (entry.isIntersecting) {
            if (firstVisibleIndex === null) firstVisibleIndex = index;
          } else if (video && !video.paused) {
            video.pause();
          }
        });
        if (firstVisibleIndex !== null) {
          const video = videoRefs.current[firstVisibleIndex];
          if (video) {
            video.play().catch(() => {});
            setPlayingVideoIndex(firstVisibleIndex);
          }
        }
      },
      { threshold: 0.6 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
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
              clientName={t.clientName}
              brandName={t.brandName}
              location={t.location}
              isPlaying={playingVideoIndex === i}
              onVideoPlay={handleVideoPlay}
              setVideoRef={setVideoRef}
              setCardRef={setCardRef}
              // avatarSrc={t.avatarSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 