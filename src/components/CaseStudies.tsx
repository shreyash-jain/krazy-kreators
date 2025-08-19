"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Case study data with all 5 clients
const caseStudies = [
  {
    id: 1,
    caseNumber: "01",
    title: "Drover",
    subtitle: "USA",
    description: "Krazy Kreators helped Drover transform its raw brand vision into a cohesive western wear line — aligning design, fabric sourcing, and full-scale execution from tech packs to packaging, delivering standout retail-ready collections.",
    backgroundImage: "/brands/drover-coverimage.png",
    logo: "/brands/drover.png",
    logoPosition: "top-right" as const,
  },
  {
    id: 2,
    caseNumber: "02",
    title: "Tilted Lotus",
    subtitle: "Houston",
    description: "Krazy Kreators helped Tilted Lotus evolve from Indian ethnicwear to a culture-conscious Western collection — redefining silhouettes and storytelling to resonate with today's urban woman. From initial comfort trials to a globally relevant design language, we aligned vision, identity, and versatility into retail-ready styles.",
    backgroundImage: "/brands/titled-lotus-coverimage.png",
    logo: "/brands/titled-lotus.png",
    logoPosition: "top-right" as const,
  },
  {
    id: 3,
    caseNumber: "03",
    title: "Las Loungewear",
    subtitle: "Florida",
    description: "Krazy Kreators helped Las Loungewear shape its comfort-first vision into a refined lifestyle brand — offering end-to-end support across design, fabric sourcing, and scalable production. From moodboards to final packaging, we aligned the founder's creative intent with everyday functionality.",
    backgroundImage: "/brands/las-loungewear- coverimage.png",
    logo: "/brands/las-loungewear.png",
    logoPosition: "top-right" as const,
  },
  {
    id: 4,
    caseNumber: "04",
    title: "HY Official",
    subtitle: "Florida",
    description: "Krazy Kreators collaborated with HY Official to translate its vision of quiet luxury into retail-ready essentials — blending premium fabric sourcing, refined detailing, and full-spectrum execution from tech packs to packaging for a seamless go-to-market launch.",
    backgroundImage: "/brands/hy-official-coverimage.png",
    logo: "/brands/hy-official.png",
    logoPosition: "top-right" as const,
  },
  {
    id: 5,
    caseNumber: "05",
    title: "Badri Al Shihhi",
    subtitle: "Oman",
    description: "Krazy Kreators collaborated with Badri Al Shihhi to bring her modern take on Omani heritage to life — weaving cultural storytelling into contemporary silhouettes. From moodboarding to final production, we ensured every detail resonated with regional elegance and craftsmanship for a thoughtfully executed launch.",
    backgroundImage: "/brands/badriaalshihhi-coverimage.png",
    logo: "/brands/badri-al-shihhi.png",
    logoPosition: "top-right" as const,
  },
];

export default function CaseStudies() {
  return (
    <section className="w-full bg-gradient-to-br from-[#F8F7F4] to-[#F0EDE8] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-4 sm:mb-6">
            Real Stories. Real Impact.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#3D3846]/70 max-w-3xl mx-auto leading-relaxed px-4">
            See how our clients turned ideas into extraordinary outcomes with Krazy Kreators.
          </p>
        </div>

        {/* Case Study Cards - Vertical Stack */}
        <div className="space-y-6 sm:space-y-8">
          {caseStudies.map((study, index) => (
            <div
              key={study.id}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer border border-white/60"
            >
              {/* Background Image */}
              <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                <Image
                  src={study.backgroundImage}
                  alt={`${study.title} background`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              </div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-[#2D2A2E]/60 group-hover:bg-[#2D2A2E]/70 transition-all duration-500"></div>

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8 md:p-12 min-h-[280px] sm:min-h-[320px] md:min-h-[380px] flex flex-col justify-between">
                {/* Logo Badge - Top Right for all cards */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 md:px-3 md:py-2 flex items-center justify-center shadow-lg">
                    <Image
                      src={study.logo}
                      alt={`${study.title} logo`}
                      width={60}
                      height={36}
                      className="object-contain max-h-6 sm:max-h-8 md:max-h-10"
                    />
                  </div>
                </div>

                {/* Text Content - Split layout for all cards */}
                <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col justify-center max-w-2xl">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Badri Al Shihhi style layout for all cards */}
                    <div className="space-y-4 sm:space-y-6">
                      {/* Case Study Number */}
                      <div className="text-xs sm:text-sm text-white/60 font-medium tracking-wide uppercase">
                        Case Study {study.caseNumber}
                      </div>
                      
                      {/* Title and Subtitle */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight font-sans">
                            {study.title}
                          </h3>
                          <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white/90 text-xs sm:text-sm font-medium rounded-full border border-white/30 self-start sm:self-auto">
                            {study.subtitle}
                          </span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/85 leading-relaxed font-light">
                        {study.description}
                      </p>
                    </div>
                  </div>

                  {/* View Case Study Button */}
                  <div className="pt-3 sm:pt-4">
                    <Link 
                      href={study.title.toLowerCase() === "drover" ? "/case-studies/drover" : "#"}
                      className="inline-flex items-center space-x-2 sm:space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 md:px-8 md:py-4 rounded-full font-medium transition-all duration-300 border border-white/30 hover:border-white/40 group/button"
                    >
                      <span className="text-sm sm:text-base md:text-lg text-white">View Case Study</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white transition-transform duration-300 group-hover/button:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Subtle Border Glow on Hover */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 