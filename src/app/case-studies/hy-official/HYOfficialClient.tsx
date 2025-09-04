'use client';

import { useState } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactDialog from '@/components/ContactDialog';
import Footer from '@/components/Footer';

export default function HYOfficialClient() {
  const [contactOpen, setContactOpen] = useState(false);


  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="/brands/hy_hero.jpg" 
              alt="HY Official hero background" 
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
                <span className="text-white">HY</span><br />
                <span className="text-[#CBB49A]">Official</span>
              </h1>
                             <p className="text-xl sm:text-2xl lg:text-3xl font-light mb-8 max-w-3xl mx-auto leading-relaxed text-white">
                 Contemporary fashion brand blending streetwear aesthetics with luxury craftsmanship.
               </p>
               <p className="text-lg sm:text-xl lg:text-2xl font-serif italic text-white tracking-wide mb-8">
                 BOLD. STREET. LUXURY.
               </p>
                             <a 
                 href="https://www.hy-official.com/" 
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

        {/* About the Brand Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          
          <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto">
                         {/* Split Layout */}
             <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
               {/* Text Content - First on mobile, left on desktop */}
               <div className="relative text-white flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12 order-1 lg:order-2">
                 <div className="relative max-w-2xl">
                   {/* Decorative line */}
                   <div className="w-16 h-0.5 bg-white mb-8"></div>
                   
                   {/* Title */}
                   <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-8 tracking-tight">
                     <span className="text-white">About the </span>
                     <span className="text-[#CBB49A]">Brand</span>
                   </h2>
                   
                   {/* Content */}
                   <div className="space-y-6 text-lg leading-relaxed text-white">
                     <p className='text-white'>
                       The founders of HY aren&apos;t just building a brand — they&apos;re curating a lifestyle rooted in comfort, elegance, and soulful design. Born from a shared passion for the luxurious feel of soft, cozy attire, HY is on a mission to make that everyday indulgence universally accessible. Every piece is crafted with precision using high-quality fabrics and an uncompromising focus on detail.
                     </p>
                     
                     <p className='text-white'>
                       Inspired by an infinite sky full of rising stars, the name &quot;HY&quot; reflects limitless comfort and individuality. With its signature Rising Star emblem, the brand stands for warmth, progress, and personal expression. Each piece is thoughtfully crafted from skin-loving, resilient fabrics — a blank canvas inviting wearers to infuse it with their unique style.
                     </p>
                   </div>
                 </div>
               </div>
               
               {/* Image - Second on mobile, left on desktop */}
               <div className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-0 order-2 lg:order-1">
                 <img 
                   src="/brands/hy-official-coverimage.png" 
                   alt="HY Official model styled in clothing" 
                   className="w-full h-full object-cover"
                 />
                {/* Curved border edge transitioning to right side */}
                <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#1a1a2e] to-transparent lg:block hidden"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Essence and Vision Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          
          <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto">
            {/* Split Layout - Text first on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
              {/* Text Content - First on mobile, left on desktop */}
              <div className="relative text-white flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12 order-1">
                <div className="relative max-w-2xl">
                  {/* Decorative line */}
                  <div className="w-16 h-0.5 bg-white mb-8"></div>
                  
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-8 tracking-tight">
                    <span className="text-white">Essence and </span>
                    <span className="text-[#CBB49A]">Vision</span>
                  </h2>
                  
                  {/* Content */}
                  <div className="space-y-6 text-lg leading-relaxed text-white">
                    <p className='text-white'>
                      HY mission is to craft clothing that seamlessly blends comfort and style, empowering individuals to embrace their uniqueness with confidence.
                    </p>
                    
                    <p className='text-white'>
                      HY envision a world where self-expression through fashion is effortless and authentic, allowing everyone to feel at ease in their own skin. Guided by their core values, they prioritize luxurious comfort through soft, skin-friendly fabrics, timeless yet versatile design, and a deep respect for individuality. Every piece is a celebration of personal style, built with an unwavering commitment to quality and craftsmanship that ensures lasting elegance and wearability.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Image - Second on mobile, right on desktop */}
              <div className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-0 order-2">
                <img 
                  src="/brands/hy_vision.png" 
                  alt="HY Official vision and essence" 
                  className="w-full h-full object-cover"
                />
                {/* Curved border edge transitioning to left side */}
                <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[#1a1a2e] to-transparent lg:block hidden"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenges and Shortcomings Section */}
        <section className="py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] text-white">
          <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
                 <span className="text-white">Challenges and </span>
                 <span className="text-[#CBB49A]">Shortcomings</span>
               </h2>
              <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
                The journey from streetwear vision to luxury fashion brand revealed complex challenges that required innovative solutions.
              </p>
            </div>

            {/* Numbered pointers grid */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
                {[
                  "Traditional manufacturers rejected small batches with many styles.",
                  "Most vendors lacked flexibility for continuous new design drops.",
                  "Supply chains were fragmented and expensive for new brands.",
                  "No clear guidance or structure for scaling from idea to final product.",
                  "Sourcing premium fabrics in small quantities was difficult and time-consuming.",
                  "Communication gaps between designers, tailors, and vendors caused frequent delays.",
                  "High MOQs (Minimum Order Quantities) didn't suit her exclusivity model.",
                  "No single platform offered design, sampling, and production under one roof.",
                  "Sample quality often didn't align with bulk production, affecting consistency.",
                  "Limited access to teams who understand cultural fashion with a modern edge."
                ].map((txt, i) => (
                  <article
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-xs flex-shrink-0">{i + 1}</span>
                      <p className="text-white text-base md:text-[17px] leading-relaxed antialiased">{txt}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Role & Key Insights Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] text-white overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          
          <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
                <span className="text-white">Our Role & </span>
                <span className="text-[#CBB49A]">Key Insights</span>
              </h2>
              <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
                Comprehensive brand development and production management to bring HY&apos;s vision to life.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {/* Brand Interpretation Card */}
                <div className="group bg-white/[0.06] border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#CBB49A]/20 border border-[#CBB49A]/30 flex items-center justify-center mb-6 group-hover:bg-[#CBB49A]/30 transition-colors duration-300">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 group-hover:text-[#CBB49A] transition-colors duration-300">
                      Brand Interpretation
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                      Translated HY&apos;s vision of comfort and quiet luxury into wearable, retail-ready designs.
                    </p>
                  </div>
                </div>

                {/* Material Expertise Card */}
                <div className="group bg-white/[0.06] border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#CBB49A]/20 border border-[#CBB49A]/30 flex items-center justify-center mb-6 group-hover:bg-[#CBB49A]/30 transition-colors duration-300">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 group-hover:text-[#CBB49A] transition-colors duration-300">
                      Material Expertise
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                      Recommended and sourced premium fabrics like viscose tencel, balancing softness with durability.
                    </p>
                  </div>
                </div>

                {/* Design Execution Card */}
                <div className="group bg-white/[0.06] border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#CBB49A]/20 border border-[#CBB49A]/30 flex items-center justify-center mb-6 group-hover:bg-[#CBB49A]/30 transition-colors duration-300">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 group-hover:text-[#CBB49A] transition-colors duration-300">
                      Design Execution
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                      Crafted modern silhouettes with subtle statement details that aligned with the brand&apos;s aesthetic.
                    </p>
                  </div>
                </div>

                {/* Tech Pack Delivery Card */}
                <div className="group bg-white/[0.06] border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#CBB49A]/20 border border-[#CBB49A]/30 flex items-center justify-center mb-6 group-hover:bg-[#CBB49A]/30 transition-colors duration-300">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 group-hover:text-[#CBB49A] transition-colors duration-300">
                      Tech Pack Delivery
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                      Provided meticulous tech packs covering measurements, construction, trims, prints, embroidery placement, and label specs.
                    </p>
                  </div>
                </div>

                {/* Sampling & Fit Card */}
                <div className="group bg-white/[0.06] border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#CBB49A]/20 border border-[#CBB49A]/30 flex items-center justify-center mb-6 group-hover:bg-[#CBB49A]/30 transition-colors duration-300">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 group-hover:text-[#CBB49A] transition-colors duration-300">
                      Sampling & Fit
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                      Managed multiple sample iterations to fine-tune fit, fall, and finish before bulk production.
                    </p>
                  </div>
                </div>

                {/* Label Design Card */}
                <div className="group bg-white/[0.06] border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#CBB49A]/20 border border-[#CBB49A]/30 flex items-center justify-center mb-6 group-hover:bg-[#CBB49A]/30 transition-colors duration-300">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 group-hover:text-[#CBB49A] transition-colors duration-300">
                      Label Design
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                      Designed custom HY labels (main, size, care) and ensured accurate placement based on international standards.
                    </p>
                  </div>
                </div>

                {/* Production Management Card */}
                <div className="group bg-white/[0.06] border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#CBB49A]/20 border border-[#CBB49A]/30 flex items-center justify-center mb-6 group-hover:bg-[#CBB49A]/30 transition-colors duration-300">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 group-hover:text-[#CBB49A] transition-colors duration-300">
                      Production Management
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                      Oversaw full-scale production with strict QC at every stage — from cutting to packing.
                    </p>
                  </div>
                </div>

                {/* Packaging & Presentation Card */}
                <div className="group bg-white/[0.06] border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#CBB49A]/20 border border-[#CBB49A]/30 flex items-center justify-center mb-6 group-hover:bg-[#CBB49A]/30 transition-colors duration-300">
                      <svg className="w-8 h-8 lg:w-10 lg:h-10 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-white mb-3 group-hover:text-[#CBB49A] transition-colors duration-300">
                      Packaging & Presentation
                    </h3>
                    <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                      Finalized brand-aligned packaging for a polished unboxing experience, ready for retail or online fulfillment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* From Vision to Blueprint Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] text-white overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          
          <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto">
                         {/* Split Layout - Text first on mobile */}
             <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px] lg:min-h-[700px]">
               {/* Text Content - First on mobile, left on desktop */}
               <div className="relative text-white flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12 lg:col-span-2 order-1">
                 <div className="relative max-w-2xl">
                  {/* Decorative line */}
                  <div className="w-16 h-0.5 bg-white mb-8"></div>
                  
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-8 tracking-tight">
                    <span className="text-white">From Vision to </span>
                    <span className="text-[#CBB49A]">Blueprint</span>
                  </h2>
                  
                  {/* Content */}
                  <div className="space-y-8">
                    {/* 1. Concept & Sourcing */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-sm flex items-center justify-center flex-shrink-0">1</div>
                        <h3 className="text-xl font-semibold text-white">Concept & Sourcing</h3>
                      </div>
                      <div className="ml-12 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            <strong className="text-white">Understood the brand DNA of HY:</strong> comfort + elegance
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            <strong className="text-white">Sourced premium fabrics:</strong> viscose tencel for softness and drape
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            <strong className="text-white">Developed:</strong> moodboards, fabric swatches, and fit direction
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Design Development */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-sm flex items-center justify-center flex-shrink-0">2</div>
                        <h3 className="text-xl font-semibold text-white">Design Development</h3>
                      </div>
                      <div className="ml-12 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            <strong className="text-white">Designed key pieces:</strong> the Camp Shirt for SS24
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            <strong className="text-white">Created:</strong> flat sketches, color stories, and detailed construction notes
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 3. Tech Pack Creation */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-sm flex items-center justify-center flex-shrink-0">3</div>
                        <h3 className="text-xl font-semibold text-white">Tech Pack Creation</h3>
                      </div>
                      <div className="ml-12 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            <strong className="text-white">Complete tech pack with:</strong> measurements, sewing details, label placements, trims, and buttons
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Fabric weave, GSM, and dye info finalized
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            <strong className="text-white">Placement prints and embroidery areas highlighted:</strong> using custom designs like the Modified Butterfly Print
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image - Second on mobile, right on desktop */}
              <div className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-0 order-2">
                <img 
                  src="/brands/hy_blueprint.png" 
                  alt="HY Official blueprint process" 
                  className="w-full h-full object-cover"
                />
                {/* Curved border edge transitioning to left side */}
                <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[#1a1a2e] to-transparent lg:block hidden"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Bringing It to Life Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] text-white overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          
          <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto">
            {/* Split Layout - Text first on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px] lg:min-h-[700px] lg:gap-16">
              {/* Text Content - First on mobile, left on desktop */}
              <div className="relative text-white flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-20 lg:col-span-2 order-1 lg:order-2">
                <div className="relative max-w-2xl">
                  {/* Decorative line */}
                  <div className="w-16 h-0.5 bg-white mb-8"></div>
                  
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-8 tracking-tight">
                    <span className="text-white">Bringing It to </span>
                    <span className="text-[#CBB49A]">Life</span>
                  </h2>
                  
                  {/* Content */}
                  <div className="space-y-8">
                    {/* 4. Sampling & Print Testing */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-sm flex items-center justify-center flex-shrink-0">4</div>
                        <h3 className="text-xl font-semibold text-white">Sampling & Print Testing</h3>
                      </div>
                      <div className="ml-12 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            First sample developed for Camp Shirt
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Embroidery swatches tested using the butterfly print
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Feedback loop with client for fit, detail refinement, and embroidery quality
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 5. Label Development */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-sm flex items-center justify-center flex-shrink-0">5</div>
                        <h3 className="text-xl font-semibold text-white">Label Development</h3>
                      </div>
                      <div className="ml-12 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Custom-designed HY Rising Star logo and labels (folded, care, and size labels)
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Placement and sizing mapped clearly in the tech pack
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image - Second on mobile, right on desktop */}
              <div className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-0 order-2 lg:order-1">
                <img 
                  src="/brands/hy_life.png" 
                  alt="HY Official bringing it to life process" 
                  className="w-full h-full object-cover"
                />
                {/* Curved border edge transitioning to left side */}
                <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[#1a1a2e] to-transparent lg:block hidden"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Finish & Delivery Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] text-white overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          
          <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto">
            {/* Split Layout - Text first on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px] lg:min-h-[700px]">
              {/* Text Content - First on mobile, left on desktop */}
              <div className="relative text-white flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12 lg:col-span-2 order-1">
                <div className="relative max-w-2xl">
                  {/* Decorative line */}
                  <div className="w-16 h-0.5 bg-white mb-8"></div>
                  
                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-8 tracking-tight">
                    <span className="text-white">Final Finish & </span>
                    <span className="text-[#CBB49A]">Delivery</span>
                  </h2>
                  
                  {/* Content */}
                  <div className="space-y-8">
                    {/* 6. Production */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-sm flex items-center justify-center flex-shrink-0">6</div>
                        <h3 className="text-xl font-semibold text-white">Production</h3>
                      </div>
                      <div className="ml-12 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Final approved samples moved to bulk manufacturing
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Quality-checked for seam finishing, button attachment, and label application
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 7. Packaging & Dispatch */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-sm flex items-center justify-center flex-shrink-0">7</div>
                        <h3 className="text-xl font-semibold text-white">Packaging & Dispatch</h3>
                      </div>
                      <div className="ml-12 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Final garments steamed, folded, tagged, and packed
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Delivered to HY with size sets and branding intact
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#CBB49A] mt-2 flex-shrink-0"></div>
                          <p className="text-white/90 text-base leading-relaxed">
                            Ready for retail or D2C launch
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
                             {/* Image - Second on mobile, right on desktop */}
               <div className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-0 order-2">
                 <img 
                   src="/brands/hy_finish.png" 
                   alt="HY Official final finish and delivery process" 
                   className="w-full h-full object-cover"
                 />
                 {/* Curved border edge transitioning to left side */}
                 <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-[#1a1a2e] to-transparent lg:block hidden"></div>
               </div>
            </div>
          </div>
        </section>

                {/* The Brand Goes Live Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] text-white overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Main Content */}
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-8">The Brand Goes Live</h2>
                
                <div className="space-y-8">
                  <div className="text-xl sm:text-2xl text-white leading-relaxed">
                    HY Official is now live.{" "}
                     <a 
                       href="https://www.hy-official.com/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-[#CBB49A] hover:text-white transition-colors duration-300 font-semibold underline"
                     >
                       Visit Website
                     </a>
                  </div>

                     {/* Website Image */}
                   <div className="flex justify-center mb-8">
                     <img 
                       src="/brands/hy_website.png" 
                       alt="HY Official website" 
                       className="w-full max-w-4xl rounded-2xl shadow-2xl"
                     />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Case Studies Section */}
        <section className="relative py-20 sm:py-24 lg:py-32 bg-[#1a1a2e] text-white overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Explore Our Other Case Studies</h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">Discover how we&apos;ve helped other brands transform their vision into reality</p>
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

              {/* Badria Al Shihhi Case Study */}
              <a href="/case-studies/badri-al-shihhi" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/brands/badriaalshihhi-coverimage.jpg"
                    alt="Badria Al Shihhi Case Study"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">Badria Al Shihhi</h3>
                  <p className="text-white/90 text-xs mb-1.5 leading-tight">Personal brand development</p>
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
        <section className="py-16 sm:py-20 md:py-24 bg-[#1a1a2e] text-white relative overflow-hidden">
          {/* Subtle texture overlay for entire section */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>

          <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Enhanced Header */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 sm:mb-8 tracking-tight leading-tight uppercase">
                READY TO BUILD A BRAND THAT<br />
                <span className="text-[#CBB49A]">STANDS OUT?</span>
              </h2>

              {/* Corner brackets */}
              <div className="flex justify-center items-center gap-6 mb-8">
                <div className="w-16 h-0.5 bg-white"></div>
                <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
                <div className="w-16 h-0.5 bg-white"></div>
              </div>
            </div>

            {/* Pull quote subheadline */}
            <div className="relative max-w-4xl mx-auto mb-10 sm:mb-12">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-white/60"></div>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium leading-relaxed px-16 italic">
                Let&apos;s create something bold, innovative, and unapologetically street. Your vision deserves to be celebrated in contemporary fashion.
              </p>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-white/60"></div>
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
