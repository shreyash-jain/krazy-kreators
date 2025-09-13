"use client";

import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import VideoManager from "@/lib/videoManager";

interface HeroProps {
  onGetStartedClick?: () => void;
  onStartDemoClick?: () => void;
}

export default function Hero({ onGetStartedClick, onStartDemoClick }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted by default
  const [isPlaying, setIsPlaying] = useState(false);
  const [wasManuallyPaused, setWasManuallyPaused] = useState(false);
  const videoId = "hero-video"; // Unique ID for this video

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleCardClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        // Register this video with the global manager before playing
        VideoManager.getInstance().registerVideo(videoId, videoRef.current);
        // Unmute the video when user clicks to play
        videoRef.current.muted = false;
        setIsMuted(false);
        videoRef.current.play();
        setIsPlaying(true);
        setWasManuallyPaused(false); // User manually resumed
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setWasManuallyPaused(true); // User manually paused
      }
    }
  };

  // Check if page was loaded with a hash fragment (e.g., from services page redirect)
  useEffect(() => {
    const checkHashFragment = () => {
      if (window.location.hash && videoRef.current && !videoRef.current.paused) {
        // Page was loaded with a hash fragment, pause the video immediately
        videoRef.current.pause();
        setIsPlaying(false);
        setWasManuallyPaused(false); // This is automatic pause due to hash redirect
      }
    };

    // Check immediately and after a short delay to ensure DOM is ready
    checkHashFragment();
    const timer = setTimeout(checkHashFragment, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Listen for hash changes to pause video when navigating to sections
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash && videoRef.current && !videoRef.current.paused) {
        // Hash changed, pause the video if it's playing
        videoRef.current.pause();
        setIsPlaying(false);
        setWasManuallyPaused(false); // This is automatic pause due to hash navigation
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Intersection Observer to pause/resume video based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          
          if (!entry.isIntersecting && video && !video.paused) {
            // Video is not visible and is playing, pause it (preserves current time)
            video.pause();
            setIsPlaying(false);
            // Don't set wasManuallyPaused - this is automatic pause due to scrolling
          } else if (entry.isIntersecting && video && video.paused && !wasManuallyPaused) {
            // Video is visible, paused, and was NOT manually paused - resume it
            // Register this video with the global manager before playing
            VideoManager.getInstance().registerVideo(videoId, video);
            // Resume with the current muted state (should be muted by default)
            video.muted = isMuted;
            video.play().then(() => {
              setIsPlaying(true);
            }).catch((error) => {
              console.log('Resume play failed:', error);
            });
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the video is visible
        rootMargin: '0px 0px -10% 0px' // Add some margin to trigger earlier
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [wasManuallyPaused]); // Include wasManuallyPaused in dependencies

  // Auto-play video muted by default when component mounts
  useEffect(() => {
    const attemptAutoPlay = async () => {
      if (videoRef.current) {
        try {
          // Register this video with the global manager
          VideoManager.getInstance().registerVideo(videoId, videoRef.current);
          
          // Start with muted auto-play by default
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsPlaying(true);
          setIsMuted(true);
        } catch (error) {
          console.log('Auto-play failed:', error);
          setIsPlaying(false);
        }
      }
    };

    // Small delay to ensure video element is ready
    const timer = setTimeout(attemptAutoPlay, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Note: Removed automatic audio enabling on user interaction
  // Video will stay muted until user explicitly clicks the video card

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Unregister this video from the global manager when component unmounts
      VideoManager.getInstance().unregisterVideo(videoId);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="w-full mx-auto bg-[#F5EFE6] min-h-screen flex flex-col items-center justify-center relative"
    >
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto text-center flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-48 xl:pt-56 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-12 xl:px-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#2D2A2E] mb-4 sm:mb-6 leading-tight font-sans">
          Not Just Threads<br className="hidden sm:inline" />
          We Weave <span className="bg-gradient-to-r from-[#CBB49A] via-[#b7a078] to-[#2D2A2E] bg-clip-text text-transparent">Possibilities</span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#3D3846] font-light max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
                          Empowering new-age fashion brands with expert designs and creative solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10">
          <Button 
            onClick={onGetStartedClick}
            className="rounded-full bg-[#CBB49A] text-white px-4 sm:px-6 py-2 text-base sm:text-lg font-semibold shadow-md hover:bg-[#b7a078] transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
          <Button 
            onClick={onStartDemoClick}
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
            
            {/* Play button - only show when video is paused */}
            {!isPlaying && (
              <button
                aria-label="Play video"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6BA292] rounded-full p-3 sm:p-4 md:p-6 shadow-[0_4px_16px_0_rgba(107,162,146,0.35)] flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#6BA292]/40 transition-all duration-300 z-20 border-2 sm:border-4 border-white hover:scale-110"
                style={{ pointerEvents: 'auto' }}
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              </button>
            )}

            {/* Mute/Unmute button - always visible when video is playing */}
            {isPlaying && (
              <button
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                onClick={handleMuteToggle}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 z-20 hover:bg-black/70"
                style={{ pointerEvents: 'auto' }}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 