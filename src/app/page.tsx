"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import WhatWeDo from "@/components/WhatWeDo";
import FromDesignToShelf from "@/components/FromDesignToShelf";
import ExploreDesigns from "@/components/ExploreDesigns";
import HowWeAreDifferent from "@/components/HowWeAreDifferent";
import WhatMakesUsUnique from "@/components/WhatMakesUsUnique";
import DedicatedTeam from "@/components/DedicatedTeam";
import CaseStudies from "@/components/CaseStudies";
import TestimonialsSection from "@/components/ClientTestimonials";
import BlogAndTechPacks from "@/components/BlogAndTechPacks";
import FAQ from "@/components/FAQ";
import StartProject from "@/components/StartProject";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  const handleContactOpen = () => {
    setContactOpen(true);
  };

  return (
    <>
      {/* SEO H1 for primary keywords */}
      <h1 className="sr-only">Start a clothing brand with Krazy Kreators — custom clothing production and fashion brand manufacturing</h1>
      <Hero onGetStartedClick={handleContactOpen} onStartDemoClick={handleContactOpen} />
      <AboutUs />
      <WhatWeDo />
      <FromDesignToShelf />
      
      {/* Sustainability Banner */}
      <section className="relative w-full h-[70vh] lg:h-[50vh] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/sustainability/sustainability-banner-2.jpg"
            alt="Sustainability banner background"
            fill
            className="object-cover"
            loading="lazy"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-white mb-4 sm:mb-6">
            Smarter Manufacturing, Greener Results
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Every choice we make today builds a cleaner, smarter, and more responsible tomorrow.
          </p>
          <Link
            href="/sustainability"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-full bg-[#CBB49A] text-white text-sm sm:text-base font-semibold hover:bg-[#b7a078] transition-colors"
          >
            Explore Our Commitment
          </Link>
        </div>
      </section>
      
      <ExploreDesigns />
      <HowWeAreDifferent onStartProjectClick={handleContactOpen} />
      <WhatMakesUsUnique />
      <DedicatedTeam />
      
      {/* Raw Materials Banner */}
      <section className="relative w-full h-[70vh] lg:h-[50vh] overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services/enterprise/raw-materials-banner-2.jpg"
            alt="Raw materials banner background"
            fill
            className="object-cover"
            loading="lazy"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-white mb-4 sm:mb-6">
            Raw Materials, Managed Responsibly
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            From procurement to reuse, we ensure efficiency, consistency, and sustainability in every batch.
          </p>
          <Link
            href="/end-to-end-services/raw-materials"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-full bg-[#CBB49A] text-white text-sm sm:text-base font-semibold hover:bg-[#b7a078] transition-colors"
          >
            Explore Our Approach
          </Link>
        </div>
      </section>
      
      <CaseStudies />
      <TestimonialsSection />
      <BlogAndTechPacks />
      <FAQ />
      <StartProject />
      <Footer />
      
      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
