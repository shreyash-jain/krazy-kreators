"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, AlertTriangle, Box, Scissors, Mail, Search, BarChart3, MessageSquare, Target, Home, Palette, Zap, Settings, Eye, Shirt, Search as MagnifyingGlass, Sparkles, FileText, Layers, CheckCircle, Factory, PackageCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";



export default function DroverClient() {
  const [contactOpen, setContactOpen] = useState(false);
  
  // Add fade-in animation on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Case Studies",
        item: "https://www.krazykreators.com/case-studies",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Drover Cowboy Threads",
        item: "https://www.krazykreators.com/case-studies/drover",
      },
    ],
  };

  return (
    <div className="w-full">
    <main className="w-full bg-[#F8F7F4]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero Section */}
      <section className="kk-hero-dark relative min-h-screen w-full flex items-center">
        <Image
          src="/brands/drover-coverimage.jpg"
          alt="Drover case study for fashion brand manufacturing and custom clothing production"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        

        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="max-w-5xl mx-auto">

            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-bold mb-6 sm:mb-8 md:mb-10 tracking-tight drop-shadow-lg">
              DROVER<br />
              <span className="text-[#CBB49A]">COWBOY THREADS</span>
            </h1>
            
            {/* Pull quote style subheadline */}
            <div className="relative mb-8 sm:mb-10">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-[#6BA292]"></div>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic text-white/90 leading-relaxed tracking-wide drop-shadow-md px-12">
                BOLD STYLE. GLOBAL REACH. TRUE WESTERN SPIRIT.
              </p>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-[#6BA292]"></div>
            </div>
            
            {/* Visit Website Button */}
            <div className="mt-8 sm:mt-10">
              <a 
                href="https://drovercowboythreads.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#CBB49A] hover:text-white transition-colors duration-300 font-semibold text-lg underline"
                style={{ color: '#CBB49A' }}
              >
                <span style={{ color: '#CBB49A' }}>Visit Website</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* The Drover Story Section */}
      <section className="w-full bg-[#F5F2EB] py-24 sm:py-28 md:py-32 lg:py-40 relative">

        
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header with Western Style */}
          <div className="text-center mb-20 sm:mb-24 md:mb-28">

            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] leading-tight tracking-tight mb-8 uppercase">
              THE DROVER STORY
            </h2>
            
            {/* Pull quote style content */}
            <div className="relative max-w-5xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#3D3846] leading-relaxed font-light italic">
                At DROVER, western wear isn&apos;t just clothing — it&apos;s identity. With bold colors, striking patterns, and fits designed for comfort and confidence, Drover bridges heritage and modern style. Sold in 29 U.S. states, Canada, and Australia, Drover is redefining what modern western wear means for today&apos;s world, where heritage meets modern style in every Drover fashion piece.
              </p>
            </div>
          </div>

          {/* Product Images Row with Enhanced Styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {/* Product Image 1 */}
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/brands/drover-3.jpg"
                  alt="Drover western wear collection - modern western fashion"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Product Image 2 */}
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/brands/drover-5.jpg"
                  alt="Drover fashion brand - western wear identity"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Product Image 3 */}
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/brands/drover-4.jpg"
                  alt="Drover cowboy fashion - heritage meets modern style"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Case Study Section */}
      <section className="w-full bg-black py-16 sm:py-20 md:py-24 lg:py-28 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/brands/drover-brand.jpg"
            alt="Drover brand background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        

        
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20 sm:mb-24 md:mb-28">

            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight mb-8 uppercase">
              REDEFINING THE<br />
              <span className="text-[#CBB49A]">COWBOY LOOK</span>
            </h2>
            

          </div>

           {/* Pull quote style subtext */}
           <div className="text-center mb-16 sm:mb-20 md:mb-24">
             <div className="relative max-w-5xl mx-auto">
               <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed font-light italic">
                 Drover Cowboy Threads blends tradition with toughness — we brought their westernwear vision to life through premium sourcing, precise detailing, and production-ready designs. At Krazy Kreators, we aligned Drover&apos;s bold identity with modern craftsmanship, ensuring every shirt and pattern carried their cowboy spirit into the global market.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="w-full bg-[#F8F7F4] py-24 sm:py-28 md:py-32 lg:py-40 relative">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Clean Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            {/* Top accent line */}
            <div className="w-16 h-px bg-[#6BA292] mx-auto mb-4"></div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#2D2A2E] leading-tight tracking-tight mb-4">
              Shaping Drover&apos;s Vision
            </h2>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-[#6BA292] leading-relaxed mb-4">
              Redefining western wear with attitude, authenticity, and attention to detail.
            </p>
          </div>

          {/* Body Content */}
          <div className="max-w-5xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl text-[#3D3846] leading-relaxed text-center">
              At Krazy Kreators, we partnered with Drover to bring their bold vision of western wear to life. Together, we set out to redefine the cowboy wardrobe — blending timeless cowboy spirit with modern design, superior comfort, and uncompromising quality.
            </p>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenge" className="py-20 sm:py-24 md:py-32 lg:py-40 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/brands/drover-challenges-cover.jpeg"
            alt="Drover challenges background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20 md:mb-24">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-[#CBB49A] text-2xl sm:text-3xl">✦</span>
                             <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                The Challenge
              </h2>
              <span className="text-[#CBB49A] text-2xl sm:text-3xl">✦</span>
            </div>
             <p className="text-base sm:text-xl text-white font-medium max-w-2xl mx-auto">
              What stood in the way of Drover&apos;s bold vision?
            </p>
          </div>

          {/* Challenges Circles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                icon: AlertTriangle,
                title: "No Clear Guidance",
                description: "No clear guidance or structure for scaling from idea to final product.",
              },
              {
                icon: Box,
                title: "Vendor Inflexibility",
                description: "Most vendors lacked flexibility for continuous new design drops.",
              },
              {
                icon: Scissors,
                title: "Limited Cultural Understanding",
                description: "Limited access to teams who understand cultural fashion with a modern edge.",
              },
              {
                icon: Mail,
                title: "Small Batch Rejection",
                description: "Traditional manufacturers rejected small batches with many styles.",
              },
              {
                icon: Search,
                title: "Fabric Sourcing Issues",
                description: "Sourcing premium fabrics in small quantities was difficult and time-consuming.",
              },
              {
                icon: BarChart3,
                title: "High MOQ Barriers",
                description: "High MOQs (Minimum Order Quantities) didn't suit the exclusivity model.",
              },
              {
                icon: MessageSquare,
                title: "Communication Gaps",
                description: "Communication gaps between designers, tailors, and vendors caused frequent delays.",
              },
              {
                icon: Target,
                title: "Quality Inconsistency",
                description: "Sample quality often didn't align with bulk production, affecting consistency.",
              },
              {
                icon: Home,
                title: "No Unified Platform",
                description: "No single platform offered design, sampling, and production under one roof.",
              },
            ].map((challenge, index) => {
              const Icon = challenge.icon as React.ComponentType<{ className?: string }>;
              return (
                <div
                  key={index}
                  className="group relative"
                >
                  {/* Circle Background */}
                  <div className="w-64 h-64 mx-auto bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-105">
                  <div className="text-center">
                      {/* Icon Circle */}
                      <div className="w-16 h-16 bg-[#CBB49A] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#B7A078] transition-colors duration-300">
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                      
                      {/* Content */}
                      <h3 className="text-lg font-bold text-white mb-3">
                      {challenge.title}
                    </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                      {challenge.description}
                    </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Krazy Kreators's Role Section */}
      <section className="py-24 sm:py-28 md:py-32 bg-white relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-2">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F5F2EB] to-[#F8F7F4]"></div>
        </div>
        
        <div className="min-w-[80%] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] tracking-tight mb-4">
              Krazy Kreators&apos;s Role
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm font-medium text-[#CBB49A] uppercase tracking-wider mb-4">
              HOW WE DELIVERED
            </p>
            
            {/* Decorative line */}
            <div className="w-16 h-px bg-[#CBB49A] mx-auto"></div>
          </div>

          {/* Enhanced Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Enhanced Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#CBB49A]/20 to-[#6BA292]/20 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
              <img
                src="/brands/drover-kk-role.jpeg"
                alt="Krazy Kreators role in Drover project"
                className="w-full h-[500px] object-cover rounded-2xl relative z-10 shadow-xl"
              />
            </div>

            {/* Right Side - Enhanced Three Pointers */}
            <div className="space-y-12">
              {[
                {
                  icon: Palette,
                  title: "Refine Brand Identity",
                  description:
                    "We translate raw brand vision into cohesive, retail-ready execution — aligning visuals, fits, and packaging to build a modern yet authentic western aesthetic.",
                },
                {
                  icon: Zap,
                  title: "Fabric & Fit Expertise",
                  description:
                    "From sourcing premium, performance-driven fabrics to perfecting silhouettes, we ensure every piece looks bold and feels exceptional.",
                },
                {
                  icon: Settings,
                  title: "End-to-End Execution",
                  description:
                    "We streamline the entire journey — design, tech packs, sampling, production, and packaging — ensuring brand consistency and retail excellence at every stage.",
                },
              ].map((role, index) => {
                const Icon = role.icon as React.ComponentType<{ className?: string }>;
                return (
                  <div key={index} className="group">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-[#CBB49A]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#CBB49A]/20 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-[#CBB49A]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4">{role.title}</h3>
                        <p className="text-lg text-[#3D3846] leading-relaxed">{role.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Understanding Brand DNA Section */}
      <section className="py-24 bg-white">
        <div className="min-w-[80%] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
                         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] tracking-tight mb-4">
              Understanding Brand DNA
            </h2>
          </div>

          {/* Content with Images */}
          <div className="space-y-12 sm:space-y-16">
            {/* What We Did Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left - Content */}
              <div className="space-y-6 sm:space-y-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#2D2A2E] mb-4 sm:mb-6">What We Did</h3>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      icon: Eye,
                      text: "Aligned with Drover's vision: bold prints, extended sizing, and function-first construction.",
                    },
                    {
                      icon: MagnifyingGlass,
                      text: "Studied market benchmarks, target audience (rodeo riders, ranchers, western lifestyle fans), and product reviews.",
                    },
                    {
                      icon: Shirt,
                      text: "Finalized silhouettes like shirts with underarm gussets, pearl snaps, and clean finishing.",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon as React.ComponentType<{ className?: string }>;
                    return (
                      <div key={index} className="flex items-start gap-3 sm:gap-4 group">
                        <div className="w-12 h-12 bg-[#CBB49A]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#CBB49A]/20 transition-colors duration-300">
                          <Icon className="w-6 h-6 text-[#CBB49A]" />
                        </div>
                        <p className="text-base sm:text-lg text-[#3D3846] leading-relaxed pt-0.5 sm:pt-1">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right - Design Process Image */}
              <div className="relative mt-8 lg:mt-0">
                <img
                   src="/brands/drover-brand-dna-1.jpeg"
                   alt="Drover Brand DNA - Design Process"
                  className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover rounded-xl sm:rounded-2xl shadow-lg"
                />
              </div>
            </div>

            {/* Fabric & Trim Sourcing Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left - Fabric Selection Image */}
              <div className="relative order-2 lg:order-1 mt-8 lg:mt-0">
                <img
                   src="/brands/drover-brand-dna-2.jpeg"
                   alt="Drover Brand DNA - Fabric & Trim Details"
                  className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover rounded-xl sm:rounded-2xl shadow-lg"
                />
              </div>

              {/* Right - Content */}
              <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#2D2A2E] mb-4 sm:mb-6">Fabric & Trim Sourcing</h3>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      icon: Sparkles,
                      text: "Sourced breathable, wrinkle-resistant fabrics suitable for performance wear.",
                    },
                    {
                      icon: Box,
                      text: "Identified trims like poly buttons, moisture-wicking threads, and durable label application.",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon as React.ComponentType<{ className?: string }>;
                    return (
                      <div key={index} className="flex items-start gap-3 sm:gap-4 group">
                        <div className="w-12 h-12 bg-[#CBB49A]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#CBB49A]/20 transition-colors duration-300">
                          <Icon className="w-6 h-6 text-[#CBB49A]" />
                        </div>
                        <p className="text-base sm:text-lg text-[#3D3846] leading-relaxed pt-0.5 sm:pt-1">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design to Development Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-[#F8F7F4]">
        <div className="min-w-[80%] lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
                         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] tracking-tight mb-3 sm:mb-4">
              Design to Development
            </h2>
          </div>

          {/* Z-Format Layout */}
          <div className="space-y-20 sm:space-y-24 md:space-y-32">
            {/* Row 1: Content Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              {/* Left - Tech Pack Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#CBB49A]/10 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#CBB49A]" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#2D2A2E]">Tech Pack Creation</h3>
                </div>
                  <p className="text-lg text-[#6BA292] font-medium">Detailed garment blueprints</p>
              </div>
                <div className="space-y-4">
                {["Flat sketches", "Construction notes (e.g., no top stitch at seams, double yoke)", "Label placements", "Measurement breakdowns (S–3XL)"].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-base sm:text-lg text-[#3D3846] leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

              {/* Right - Design Image 1 */}
              <div className="relative group">
                <div className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/brands/drover-design-1.jpeg"
                    alt="Drover design process - tech pack creation"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>

            {/* Row 2: Image Left, Content Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              {/* Left - Design Image 2 */}
              <div className="relative group order-2 lg:order-1">
                <div className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/brands/drover-design-2.jpeg"
                    alt="Drover design process - custom elements"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Right - Custom Elements Content */}
              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#CBB49A]/10 rounded-full flex items-center justify-center">
                      <Layers className="w-6 h-6 text-[#CBB49A]" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#2D2A2E]">Custom Elements</h3>
                </div>
                  <p className="text-lg text-[#6BA292] font-medium">Unique design adaptations</p>
              </div>
                <div className="space-y-4">
                {["Coordinated unique print placements and sleeve/collar contrasts", "Adapted fit for active movement using gussets and stretch-compatible seams", "Created clean tech files for embroidery if needed (e.g., logo, motifs)"].map(
                  (item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-base sm:text-lg text-[#3D3846] leading-relaxed">{item}</p>
                    </div>
                  )
                )}
                </div>
              </div>
            </div>

            {/* Row 3: Content Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              {/* Left - Sampling Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#CBB49A]/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-[#CBB49A]" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#2D2A2E]">Sampling</h3>
                </div>
                  <p className="text-lg text-[#6BA292] font-medium">Quality assurance process</p>
              </div>
                <div className="space-y-4">
                {["Supervised sample runs", "Fit approvals with minor tweaks for body types and movement", "Sent trial shirts for wear test"].map(
                  (item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-base sm:text-lg text-[#3D3846] leading-relaxed">{item}</p>
                    </div>
                  )
                )}
                </div>
              </div>

              {/* Right - Design Image 3 */}
              <div className="relative group">
                <div className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/brands/drover-design-3.jpeg"
                    alt="Drover design process - sampling and quality assurance"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production & Delivery Section */}
      <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/brands/drover-production-cover.jpeg"
            alt="Drover Production Background"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="max-w-[80%] mx-auto px-4 md:px-0 lg:px-0 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20 md:mb-24">
                         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight mb-4 sm:mb-6">
              Production & Delivery
            </h2>
          </div>

          {/* Modern Content Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {/* Manufacturing */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                  <Factory className="w-6 h-6 text-white" />
                  </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Manufacturing</h3>
                </div>
              <div className="space-y-4">
                  {["Stitch accuracy", "Print alignment", "Label placement", "Durability tests"].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 bg-[#CBB49A] rounded-full flex-shrink-0"></div>
                    <p className="text-base sm:text-lg text-white/90 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

            {/* Quality Control */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Quality Control</h3>
              </div>
              <div className="space-y-4">
                {["Material verification", "Stitch accuracy testing", "Durability assessment", "Final inspection"].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 bg-[#CBB49A] rounded-full flex-shrink-0"></div>
                    <p className="text-base sm:text-lg text-white/90 font-medium">{item}</p>
            </div>
                ))}
                </div>
              </div>

            {/* Brand-Aligned Packaging */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                  <PackageCheck className="w-6 h-6 text-white" />
                  </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Packaging</h3>
                </div>
              <div className="space-y-4">
                {["Final press and folding", "Tags and labels attached", "Bulk packing for distribution", "D2C-ready presentation"].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 bg-[#CBB49A] rounded-full flex-shrink-0"></div>
                    <p className="text-base sm:text-lg text-white/90 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
          </div>

          {/* Global Delivery Info */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-10 border border-white/20 inline-block">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Global Delivery</h3>
              </div>
              <p className="text-lg sm:text-xl text-white/90 font-medium">
                Seamless delivery for both retail and D2C channels across 29 U.S. states, Canada, and Australia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Brand Goes Live Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 bg-black text-white overflow-hidden">
        {/* subtle texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:14px_14px]"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-8">The Brand Goes Live</h2>
              
              <div className="space-y-8">
                <div className="text-xl sm:text-2xl text-white/90 leading-relaxed">
                  Drover Cowboy Threads is now live.{" "}
                  <a 
                    href="https://drovercowboythreads.com/" 
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
                    src="/brands/drover-website.jpg" 
                    alt="Drover Cowboy Threads website" 
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

      {/* Enhanced CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F5F2EB] relative overflow-hidden">


        <div className="min-w-[80%] lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Enhanced Header */}
          <div className="mb-8 sm:mb-10">


            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] mb-6 sm:mb-8 tracking-tight leading-tight uppercase">
              READY TO BUILD A BRAND THAT<br />
              <span className="text-[#CBB49A]">STANDS OUT?</span>
          </h2>


          </div>

           {/* Pull quote subheadline */}
           <div className="relative max-w-4xl mx-auto mb-10 sm:mb-12">
             <p className="text-lg sm:text-xl md:text-2xl text-[#3D3846] font-medium leading-relaxed italic">
               Let&apos;s craft something iconic — from first sketch to shelf-ready style.
             </p>
           </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
            <Button 
              size="lg" 
              className="group bg-[#CBB49A] text-white hover:bg-[#B7A078] text-base sm:text-lg font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[#CBB49A]"
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
              className="group border-2 border-[#CBB49A] text-[#CBB49A] hover:bg-[#CBB49A] hover:text-white text-base sm:text-lg font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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

      <style jsx global>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-fade-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
      <Footer />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
} 
