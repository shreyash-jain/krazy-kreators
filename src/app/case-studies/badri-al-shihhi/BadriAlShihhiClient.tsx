'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactDialog from '@/components/ContactDialog';
import Footer from '@/components/Footer';

export default function BadriAlShihhiClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [wasManuallyPaused, setWasManuallyPaused] = useState(false);

  const handleVideoClick = () => {
    if (!playing) {
      setPlaying(true);
      setWasManuallyPaused(false); // User manually resumed
      setTimeout(() => {
        videoRef.current?.play();
      }, 100);
    } else {
      setPlaying(false);
      setWasManuallyPaused(true); // User manually paused
      videoRef.current?.pause();
    }
  };

  // Intersection Observer to pause/resume video based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          
          if (!entry.isIntersecting && video && !video.paused) {
            // Video is not visible and is playing, pause it (preserves current time)
            video.pause();
            setPlaying(false);
            // Don't set wasManuallyPaused - this is automatic pause due to scrolling
          } else if (entry.isIntersecting && video && video.paused && !wasManuallyPaused) {
            // Video is visible, paused, and was NOT manually paused - resume it
            video.play().then(() => {
              setPlaying(true);
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

    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [wasManuallyPaused]);


  return (
    <div className="min-h-screen bg-white">
      <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/brands/badriaalshihhi-coverimage.jpg" 
            alt="Badria Al Shihhi hero background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        {/* Editorial texture overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="text-center">
            {/* Editorial accent line */}
            <div className="w-24 h-0.5 bg-white mx-auto mb-8"></div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 sm:mb-8 tracking-tight">
              <span className="text-white">Badria Al</span><br />
              <span className="text-[#CBB49A]">Shihhi</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-8 max-w-3xl mx-auto leading-relaxed text-white/90">
              Personal brand development that elevates individual presence and influence.
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl font-serif italic text-white/80 tracking-wide mb-8">
              ELEVATED. PERSONAL. INFLUENTIAL.
            </p>
            <a 
              href="https://badriaalshihhi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#CBB49A] hover:text-white transition-colors duration-300 font-semibold text-lg underline"
              style={{ color: '#CBB49A' }}
            >
              <span style={{ color: '#CBB49A' }}>Visit Website</span>
            </a>
          </div>
        </div>
      </section>

      {/* Our Client Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-[#F5F2ED] overflow-hidden">
        {/* subtle matte texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:14px_14px]"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Title and Subtext */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Our Client</h2>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">BADRIA AL SHIHHI</h3>
            </div>
            
            {/* Client Image */}
            <div className="mb-8">
              <img src="/brands/badria-client.png" alt="Badria Al Shihhi" className="w-full h-auto" />
            </div>
            
            {/* Text Content */}
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-black">Badria Al Shihhi is a multi-talented Omani woman with a background in chemical engineering, literature, and public leadership. Driven by her deep appreciation for elegance and individuality, she wanted to launched her namesake fashion and lifestyle brand to create something uniquely her own.</p>
              <p className="text-black">Her vision was clear: to offer high-style, limited-quantity fashion that&apos;s affordable, modern, and rooted in cultural sophistication.</p>
              <p className="text-black">Through this brand, she wanted to expresses not only her creative side but also her belief in empowerment, quality, and timeless style.</p>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left: full-height no background with centered image */}
            <div className="relative flex items-center justify-center min-h-[600px]">
              <img src="/brands/badria-client.png" alt="Badria Al Shihhi" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
            </div>

            {/* Right: no background with black text */}
            <div className="relative flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
              <div className="relative max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Our Client</h2>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">BADRIA AL SHIHHI</h3>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-black">Badria Al Shihhi is a multi-talented Omani woman with a background in chemical engineering, literature, and public leadership. Driven by her deep appreciation for elegance and individuality, she wanted to launched her namesake fashion and lifestyle brand to create something uniquely her own.</p>
                  <p className="text-black">Her vision was clear: to offer high-style, limited-quantity fashion that&apos;s affordable, modern, and rooted in cultural sophistication.</p>
                  <p className="text-black">Through this brand, she wanted to expresses not only her creative side but also her belief in empowerment, quality, and timeless style.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE VISION: Badria Al Shihhi Vision */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
        {/* subtle matte texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_25%_20%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Title and Subtext */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">THE VISION</h2>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Badria Al Shihhi Vision</h3>
            </div>
            
            {/* Vision Image */}
            <div className="mb-8">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img src="/brands/badria-vision.jpg" alt="Badria Al Shihhi vision" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="space-y-6 text-lg leading-relaxed text-black">
              <p>When Badria Al Shihhi came to us, she had a clear vision — to build a brand with variety, affordable pricing, low quantity per style, and high fashion value. She didn&apos;t just want to sell clothes — she wanted to create an experience.</p>
              <p className="text-black italic text-lg leading-relaxed">&ldquo;I want to give women something exclusive, beautiful, and accessible — not fast fashion, but fast elegance.&rdquo;</p>
              <p className="text-black font-semibold">– Badria Al Shihhi</p>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left: full-height white background with black text */}
            <div className="relative bg-white text-black flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_70%_40%,black_1px,transparent_1px)] [background-size:12px_12px]"></div>
              <div className="relative max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">THE VISION</h2>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Badria Al Shihhi Vision</h3>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-black">When Badria Al Shihhi came to us, she had a clear vision — to build a brand with variety, affordable pricing, low quantity per style, and high fashion value. She didn&apos;t just want to sell clothes — she wanted to create an experience.</p>
                  <p className="text-black italic text-lg leading-relaxed">&ldquo;I want to give women something exclusive, beautiful, and accessible — not fast fashion, but fast elegance.&rdquo;</p>
                  <p className="text-black font-semibold">– Badria Al Shihhi</p>
                </div>
              </div>
            </div>
            
            {/* Right: full-height beige background with centered image */}
            <div className="relative bg-[#CBB49A] flex items-center justify-center min-h-[800px]">
              <img src="/brands/badria-vision.jpg" alt="Badria Al Shihhi vision" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge: What Was Standing in Her Way? */}
      <section className="py-20 sm:py-24 lg:py-32 bg-[#F5F2ED] text-black">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
              The Challenge: What Was Standing in Her Way?
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
              The journey from luxury vision to premium travelwear brand revealed complex challenges that required innovative solutions.
            </p>
          </div>

          {/* Numbered pointers grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
              <article className="rounded-2xl border border-black/20 bg-white/[0.06] p-5 md:p-6 lg:p-7">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">1</span>
                  <p className="text-black/90 text-base md:text-[17px] leading-relaxed antialiased">She had a clear vision but no clarity on technical execution — especially fabric innovation and design.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-black/20 bg-white/[0.06] p-5 md:p-6 lg:p-7">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">2</span>
                  <p className="text-black/90 text-base md:text-[17px] leading-relaxed antialiased">Traditional factories refused to work on small MOQs with high style variety.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-black/20 bg-white/[0.06] p-5 md:p-6 lg:p-7">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">3</span>
                  <p className="text-black/90 text-base md:text-[17px] leading-relaxed antialiased">Hand embroidery facilities are rare in factories; our dedicated artisans team delivers intricate, premium-quality handwork.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-black/20 bg-white/[0.06] p-5 md:p-6 lg:p-7">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">4</span>
                  <p className="text-black/90 text-base md:text-[17px] leading-relaxed antialiased">Design-to-production guidance was missing — there was no single team who could handle concept, sampling, and scaling.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-black/20 bg-white/[0.06] p-5 md:p-6 lg:p-7">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">5</span>
                  <p className="text-black/90 text-base md:text-[17px] leading-relaxed antialiased">There was a gap in understanding between client vision and garment execution.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-black/20 bg-white/[0.06] p-5 md:p-6 lg:p-7">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">6</span>
                  <p className="text-black/90 text-base md:text-[17px] leading-relaxed antialiased">Lack of transparency, delayed communication, and fragmented supply chains added to the frustration.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Enter Krazy Kreators */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
        {/* subtle matte texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_25%_20%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Title and Subtext */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Enter Krazy Kreators</h2>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Our End-to-End Approach</h3>
            </div>
            
            {/* Office Image */}
            <div className="mb-8">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img src="/brands/contact.jpg" alt="Krazy Kreators office studio" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="space-y-6 text-lg leading-relaxed text-black">
              <p>We became more than a vendor — we became her brand-building partner. From the first sketch to final production, Krazy Kreators managed every step, aligning her vision with a practical execution strategy.</p>
              
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-black mb-4">Key Services Provided:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-black">Brand strategy & visual moodboarding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-black">Product & trend research</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-black">Designing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-black">Fabric sourcing (low MOQ vendors)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-black">Sampling & revisions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-black">Small-batch production</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-black">Photoshoot</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-black">Packaging & delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left: full-height black background with image */}
            <div className="relative bg-black flex items-center justify-center min-h-[600px]">
              <img src="/brands/contact.jpg" alt="Krazy Kreators office studio" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
            </div>

            {/* Right: full-height text section without background */}
            <div className="relative text-black flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
              <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_70%_40%,white_1px,transparent_1px)] [background-size:12px_12px]"></div>
              <div className="relative max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Enter Krazy Kreators</h2>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Our End-to-End Approach</h3>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-black">We became more than a vendor — we became her brand-building partner. From the first sketch to final production, Krazy Kreators managed every step, aligning her vision with a practical execution strategy.</p>
                  
                  <div className="mt-8">
                    <h4 className="text-xl font-semibold text-black mb-4">Key Services Provided:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-black">Brand strategy & visual moodboarding</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-black">Product & trend research</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-black">Designing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-black">Fabric sourcing (low MOQ vendors)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-black">Sampling & revisions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-black">Small-batch production</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-black">Photoshoot</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-black">Packaging & delivery</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Creative Direction */}
      <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/brands/badria-creative.jpg")' }}></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[600px] text-center">
            <div className="max-w-4xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">The Creative Direction</h2>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">Designing the DNA of Her Brand</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Designing the Collection */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-[#F5F2ED] text-black overflow-hidden">
        {/* subtle matte texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_25%_20%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Designing the Collection</h2>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Where the Vision Took Shape</h3>
            </div>
            
            {/* Image */}
            <div className="mb-8">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img src="/brands/badria-creative-moodboard.jpg" alt="Designing the Collection" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Body Text */}
            <div className="space-y-6 text-lg leading-relaxed text-black">
              <p>This phase includes:</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-black">Initial concept sketches for all SKUs</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-black">Created custom sketches tailored to the client&apos;s aesthetic and brand DNA</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-black">Designed intricate elements like embroidery motifs, print layouts, neckline shapes, and sleeve treatments</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-black">Carefully curated silhouette structures to balance modesty and modernity</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-black">Focused on small design details — from cuff finishes to fabric textures — ensuring every element had purpose and beauty</span>
                </div>
              </div>
              
              <p className="mt-8">Our process was deeply collaborative.</p>
              <p>Every week, we shared 7 new design sets with the client — giving her the opportunity to review, give feedback, and suggest additions. She loved being part of the process, and her input helped shape the final direction of the collection</p>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left: full-height text section */}
            <div className="relative text-black flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_70%_40%,black_1px,transparent_1px)] [background-size:12px_12px]"></div>
              <div className="relative max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Designing the Collection</h2>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Where the Vision Took Shape</h3>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-black">This phase includes:</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-black">Initial concept sketches for all SKUs</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-black">Created custom sketches tailored to the client&apos;s aesthetic and brand DNA</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-black">Designed intricate elements like embroidery motifs, print layouts, neckline shapes, and sleeve treatments</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-black">Carefully curated silhouette structures to balance modesty and modernity</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-black">Focused on small design details — from cuff finishes to fabric textures — ensuring every element had purpose and beauty</span>
                    </div>
                  </div>
                  
                  <p className="text-black mt-8">Our process was deeply collaborative.</p>
                  <p className="text-black">Every week, we shared 7 new design sets with the client — giving her the opportunity to review, give feedback, and suggest additions. She loved being part of the process, and her input helped shape the final direction of the collection</p>
                </div>
              </div>
            </div>

            {/* Right: full-height image section */}
            <div className="relative bg-white flex items-center justify-center min-h-[600px]">
              <img src="/brands/badria-creative-moodboard.jpg" alt="Designing the Collection" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Sampling & Development Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Title and Subtext */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">
                Sampling & Development
              </h2>
              <p className="text-xl sm:text-2xl font-serif italic text-[#CBB49A] mb-8">
                From Paper to Fabric
              </p>
            </div>
            
            {/* Image */}
            <div className="mb-8">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/brands/badria-sampling.jpg" 
                  alt="Sampling & Development Process" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="space-y-6 text-lg leading-relaxed text-black">
              <p>
                For each design, we produced 2 sample pieces — one for the client and one for our internal use. After the client received her samples, we scheduled review meetings to gather feedback. Whether it was a minor fit tweak or a motif adjustment, we refined every sample until it perfectly aligned with her vision. This phase ensured that each garment didn&apos;t just look good on paper — it lived beautifully in fabric, fit, and finish. Once the designs were approved, we moved into a structured and collaborative sampling phase. We began with fabric selection — offering 3 curated fabric options for each style. Swatches were sent to the client, and we held meetings to review them together, where our designers gave suggestions based on drape, season, and design compatibility.
              </p>
              <p>
                Once fabrics were finalized, we moved forward with sampling:
              </p>
              <ul className="space-y-2 list-disc list-inside text-black ml-4">
                <li>Embroidery and print design development</li>
                <li>Placement testing and layout confirmation</li>
                <li>Construction of sample garments</li>
              </ul>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left: full-height black background with image */}
            <div className="relative bg-black flex items-center justify-center min-h-[600px]">
              <img 
                src="/brands/badria-sampling.jpg" 
                alt="Sampling & Development Process" 
                className="block mx-auto max-w-[90%] max-h-[90%] object-contain"
              />
              </div>
              
            {/* Right: full-height text section without background */}
            <div className="relative text-black flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
              <div className="relative max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">
                  Sampling & Development
                </h2>
                <p className="text-xl sm:text-2xl font-serif italic text-[#CBB49A] mb-8">
                  From Paper to Fabric
                </p>
              <div className="space-y-6 text-lg leading-relaxed text-black">
                  <p>
                    For each design, we produced 2 sample pieces — one for the client and one for our internal use. After the client received her samples, we scheduled review meetings to gather feedback. Whether it was a minor fit tweak or a motif adjustment, we refined every sample until it perfectly aligned with her vision. This phase ensured that each garment didn&apos;t just look good on paper — it lived beautifully in fabric, fit, and finish. Once the designs were approved, we moved into a structured and collaborative sampling phase. We began with fabric selection — offering 3 curated fabric options for each style. Swatches were sent to the client, and we held meetings to review them together, where our designers gave suggestions based on drape, season, and design compatibility.
                  </p>
                  <p>
                    Once fabrics were finalized, we moved forward with sampling:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-black ml-4">
                    <li>Embroidery and print design development</li>
                    <li>Placement testing and layout confirmation</li>
                    <li>Construction of sample garments</li>
                  </ul>
                    </div>
                    </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production with Purpose Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/brands/badria-production.jpg"
            alt="Badria Al Shihhi production background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-14 h-0.5 bg-[#CBB49A] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">Production with Purpose</h2>
            <p className="text-xl sm:text-2xl font-serif italic text-[#CBB49A] mt-4">Crafting the Final Collection</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <article className="rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-sm p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Precision Production</h3>
              <div className="space-y-3 text-sm sm:text-base text-white">
                <p className="text-white">After sample approval, we transitioned into a precise and controlled production process, tailored for low MOQ but high-end execution.</p>
                <ul className="space-y-2 list-disc list-inside text-white">
                  <li className="text-white">We began with fabric in-housing based on the selected materials, suited for small-batch production.</li>
                  <li className="text-white">Embroidery and print production followed, based on finalized placements.</li>
                  <li className="text-white">Pattern grading was then completed, and size sets were created to cover the full range.</li>
                  <li className="text-white">Each size was measured in detail, with a comprehensive measurement sheet created to ensure consistency.</li>
                  <li className="text-white">Cutting was done in controlled batches, separated by style and size.</li>
                </ul>
          </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-sm p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Quality Assembly</h3>
              <div className="space-y-3 text-sm sm:text-base text-white">
                <p className="text-white">Once all pieces were cut:</p>
                <ul className="space-y-2 list-disc list-inside text-white">
                  <li className="text-white">Stitching began, style by style, maintaining precision and consistency</li>
                  <li className="text-white">Custom tags and label designs were finalized and applied</li>
                  <li className="text-white">Then, quality control began — with thorough checks for stitching, finishing, and measurements</li>
                </ul>
            </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Final Finishing</h3>
              <div className="space-y-3 text-sm sm:text-base text-white">
                <p className="text-white">Finally, we moved into finishing, which included:</p>
                <ul className="space-y-2 list-disc list-inside text-white">
                  <li className="text-white">Thread cutting</li>
                  <li className="text-white">Ironing and garment shaping</li>
                  <li className="text-white">Final touch-ups and neat packaging, aligning with the brand&apos;s premium feel</li>
                </ul>
                <p className="mt-4 text-white">Every stage was managed with care to ensure the final product met both design intent and luxury standards.</p>
            </div>
            </article>
          </div>
        </div>
      </section>

      {/* The Brand Comes to Life Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
        {/* subtle matte texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_25%_20%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Title and Subtext */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">The Brand Comes to Life</h2>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">From Sketches to Styled Stories</h3>
          </div>
          
            {/* Brand Life Image */}
            <div className="mb-8">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img src="/brands/badria-life.jpg" alt="Badria Al Shihhi brand comes to life" className="w-full h-full object-cover" />
            </div>
            </div>
            
            {/* Text Content */}
            <div className="space-y-6 text-lg leading-relaxed text-black">
              <p>We started by transforming our original croquis sketches into real-life looks, ensuring each garment on the model reflected the exact silhouette, style, and detailing from the design boards.</p>
              
              <p>Krazy Kreators provided an end-to-end photoshoot solution, planning everything from creative direction to execution:</p>
              <ul className="space-y-2 list-disc list-inside text-black ml-4">
                <li>We collaborated with our trusted photography and production team</li>
                <li>Discussed the shoot concept, mood, and location</li>
                <li>Aligned the theme and styling with the brand narrative</li>
              </ul>
              
              <p>The client was kept in the loop at every stage:</p>
              <ul className="space-y-2 list-disc list-inside text-black ml-4">
                <li>We shared model options, styling proposals, and mood references</li>
                <li>Held live discussions with the stylist and team to finalize the looks</li>
                <li>Invited the client to the shoot — and when she couldn&apos;t attend, we kept her updated via video call, showing her everything live in real-time</li>
              </ul>
          </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left: full-height black background with image */}
            <div className="relative bg-black flex items-center justify-center min-h-[600px]">
              <img src="/brands/badria-life.jpg" alt="Badria Al Shihhi brand comes to life" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
            </div>
            
            {/* Right: full-height text section without background */}
            <div className="relative text-black flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
              <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_70%_40%,white_1px,transparent_1px)] [background-size:12px_12px]"></div>
              <div className="relative max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">The Brand Comes to Life</h2>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">From Sketches to Styled Stories</h3>
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="text-black">We started by transforming our original croquis sketches into real-life looks, ensuring each garment on the model reflected the exact silhouette, style, and detailing from the design boards.</p>
                  
                  <p className="text-black">Krazy Kreators provided an end-to-end photoshoot solution, planning everything from creative direction to execution:</p>
                  <ul className="space-y-2 list-disc list-inside text-black ml-4">
                    <li className="text-black">We collaborated with our trusted photography and production team</li>
                    <li className="text-black">Discussed the shoot concept, mood, and location</li>
                    <li className="text-black">Aligned the theme and styling with the brand narrative</li>
                  </ul>
                  
                  <p className="text-black">The client was kept in the loop at every stage:</p>
                  <ul className="space-y-2 list-disc list-inside text-black ml-4">
                    <li className="text-black">We shared model options, styling proposals, and mood references</li>
                    <li className="text-black">Held live discussions with the stylist and team to finalize the looks</li>
                    <li className="text-black">Invited the client to the shoot — and when she couldn&apos;t attend, we kept her updated via video call, showing her everything live in real-time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Grand Launch Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/brands/badria-launch.jpg"
            alt="Badria Al Shihhi grand launch background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-14 h-0.5 bg-[#CBB49A] mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">The Grand Launch</h2>
            <p className="text-xl sm:text-2xl font-serif italic text-[#CBB49A] mt-4">From Vision to Reality</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <article className="rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-sm p-8 sm:p-10">
              <div className="space-y-6 text-lg leading-relaxed text-white">
                <p className="text-white">
                  After 8 months of creative collaboration, dedication, and design — Badria Al Shihhi officially launched her brand.
                </p>
                <p className="text-white">
                  With Krazy Kreators guiding the creative and strategic journey, the launch included:
                </p>
                <ul className="space-y-3 list-disc list-inside text-white ml-4">
                  <li className="text-white">A beautifully designed e-commerce website, showcasing the full collection</li>
                  <li className="text-white">The opening of her first physical store, crafted to reflect her brand identity</li>
                  <li className="text-white">A fashion show debut for her first collection — marking her entrance into the industry with elegance and impact</li>
                </ul>
                <p className="text-white">
                  This wasn&apos;t just a launch — it was the celebration of a dream realized, powered by research, design, and a shared vision for success.
                </p>
              </div>
            </article>
            </div>
              </div>
      </section>

      {/* Badria Al Shihhi Client Testimonial */}
      <section ref={testimonialRef} className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Badria Al Shihhi Client Testimonial</h2>
              <div className="w-16 h-0.5 bg-[#CBB49A] mx-auto mb-8"></div>
            </div>

            {/* Video Testimonial */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <div 
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={handleVideoClick}
                >
                  <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                    <video
                      ref={videoRef}
                      src="/testimonial/badria-testimonial.mp4"
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
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-6 text-lg leading-relaxed text-black">
              <p>
                &quot;Krazy Kreators didn&apos;t just help me build a brand — they helped me tell my story. As a woman from Oman with a vision for modest, elegant fashion, I needed a partner who truly understood both my cultural values and my creative aspirations.&quot;
              </p>
              
              <p>
                &quot;What impressed me most was their ability to translate my personal style into a cohesive brand identity. They took my love for cultural sophistication and created something that feels both timeless and contemporary. Every piece reflects the elegance I envisioned.&quot;
              </p>
              
              <p>
                &quot;The journey from concept to launch was seamless. They handled everything — from fabric sourcing to production — with such care and attention to detail. My brand now stands as a testament to what&apos;s possible when you have the right creative partner.&quot;
              </p>
            </div>

            {/* Client Details */}
            <div className="pt-6 border-t border-gray-200 mt-8">
              <h3 className="text-xl font-semibold text-black mb-2">Badria Al Shihhi</h3>
              <p className="text-[#CBB49A] font-medium">Founder, Badria Al Shihhi</p>
              <p className="text-gray-600 text-sm">Seeb, Oman</p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Video Testimonial */}
            <div className="relative max-w-md mx-auto">
              <div 
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={handleVideoClick}
              >
                <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                  <video
                    ref={videoRef}
                    src="/testimonial/badria-testimonial.mp4"
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
              </div>
            </div>

            {/* Right: Testimonial Summary */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Badria Al Shihhi Client Testimonial</h2>
                <div className="w-16 h-0.5 bg-[#CBB49A] mb-8"></div>
              </div>
              
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p className="text-black">
                  &quot;Krazy Kreators didn&apos;t just help me build a brand — they helped me tell my story. As a woman from Oman with a vision for modest, elegant fashion, I needed a partner who truly understood both my cultural values and my creative aspirations.&quot;
                </p>
                
                <p className="text-black">
                  &quot;What impressed me most was their ability to translate my personal style into a cohesive brand identity. They took my love for cultural sophistication and created something that feels both timeless and contemporary. Every piece reflects the elegance I envisioned.&quot;
                </p>
                
                <p className="text-black">
                  &quot;The journey from concept to launch was seamless. They handled everything — from fabric sourcing to production — with such care and attention to detail. My brand now stands as a testament to what&apos;s possible when you have the right creative partner.&quot;
                </p>
              </div>

              {/* Client Details */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-black mb-2">Badria Al Shihhi</h3>
                <p className="text-[#CBB49A] font-medium">Founder, Badria Al Shihhi</p>
                <p className="text-gray-600 text-sm">Seeb, Oman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Badria Al Shihhi Brand Launch Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-[#F5F2ED] text-black overflow-hidden">
        {/* subtle texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-8">Badria Al Shihhi Brand Launch</h2>
            
            <div className="space-y-8">
                <div className="text-xl sm:text-2xl text-black/90 leading-relaxed">
                Badria Al Shihhi is now live.{" "}
                <a 
                    href="https://badriaalshihhi.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#CBB49A] hover:text-black transition-colors duration-300 font-semibold underline"
                >
                  Visit Website
                </a>
              </div>

              {/* Website Image */}
              <div className="flex justify-center mb-8">
                <img 
                    src="/brands/badria-website.jpg" 
                    alt="Badria Al Shihhi website" 
                    className="w-full max-w-4xl h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Other Case Studies Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Explore Our Other Case Studies</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover how we&apos;ve helped other brands transform their vision into reality</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* Tilted Lotus Case Study */}
            <a href="/case-studies/tilted-lotus" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/brands/tilted-lotus-hero.jpg"
                  alt="Tilted Lotus Case Study"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">Tilted Lotus</h3>
                <p className="text-white/90 text-xs mb-1.5 leading-tight">Premium wellness brand</p>
                <div className="inline-flex items-center text-[#CBB49A] group-hover:text-white transition-colors duration-300 font-semibold text-xs">
                  View Case Study
                  <ArrowRight className="ml-1 w-2.5 h-2.5" />
                </div>
              </div>
            </a>
            
            {/* Drover Case Study */}
            <a href="/case-studies/drover" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/brands/drover-coverimage.jpg"
                  alt="Drover Case Study"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">Drover</h3>
                <p className="text-white/90 text-xs mb-1.5 leading-tight">Automotive lifestyle brand</p>
                <div className="inline-flex items-center text-[#CBB49A] group-hover:text-white transition-colors duration-300 font-semibold text-xs">
                  View Case Study
                  <ArrowRight className="ml-1 w-2.5 h-2.5" />
                </div>
              </div>
            </a>
            
            {/* Las Loungewear Case Study */}
            <a href="/case-studies/las" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/brands/las-loungewear- coverimage.png"
                  alt="Las Loungewear Case Study"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">Las Loungewear</h3>
                <p className="text-white/90 text-xs mb-1.5 leading-tight">Premium loungewear brand</p>
                <div className="inline-flex items-center text-[#CBB49A] group-hover:text-white transition-colors duration-300 font-semibold text-xs">
                  View Case Study
                  <ArrowRight className="ml-1 w-2.5 h-2.5" />
                </div>
              </div>
            </a>
            
            {/* HY Official Case Study */}
            <a href="/case-studies/hy-official" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/brands/hy-official-coverimage.png"
                  alt="HY Official Case Study"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">HY Official</h3>
                <p className="text-white/90 text-xs mb-1.5 leading-tight">Fashion brand development</p>
                <div className="inline-flex items-center text-[#CBB49A] group-hover:text-white transition-colors duration-300 font-semibold text-xs">
                  View Case Study
                  <ArrowRight className="ml-1 w-2.5 h-2.5" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
        {/* Editorial background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-black transform rotate-45"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-gray-600 transform -rotate-45"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-black rounded-full"></div>
        </div>

        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Enhanced Header */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6 sm:mb-8 tracking-tight leading-tight uppercase">
              READY TO BUILD A BRAND THAT<br />
              <span className="text-[#CBB49A]">STANDS OUT?</span>
            </h2>

            {/* Corner brackets */}
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="w-16 h-0.5 bg-black"></div>
              <div className="w-4 h-4 border-2 border-black transform rotate-45"></div>
              <div className="w-16 h-0.5 bg-black"></div>
            </div>
          </div>

          {/* Pull quote subheadline */}
          <div className="relative max-w-4xl mx-auto mb-10 sm:mb-12">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-gray-600"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium leading-relaxed px-16 italic">
              Let&apos;s create something timeless, sophisticated, and unapologetically luxurious. Your vision deserves to be celebrated in premium fashion.
            </p>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-gray-600"></div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
            <Button 
              size="lg" 
              className="group bg-[#CBB49A] text-white hover:bg-[#b7a078] text-base sm:text-lg font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[#CBB49A]"
              onClick={(e) => { e.preventDefault(); setContactOpen(true); }}
            >
              <span className="flex items-center gap-3 text-white">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group border-2 border-[#CBB49A] text-[#CBB49A] hover:bg-[#CBB49A] hover:text-black text-base sm:text-lg font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={(e) => { e.preventDefault(); setContactOpen(true); }}
            >
              <span className="flex items-center gap-3">
                Start a Demo
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </section>
      </main>

      <Footer />
      
      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
