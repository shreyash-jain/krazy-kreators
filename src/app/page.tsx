"use client";

import { useState } from "react";
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
      <ExploreDesigns />
      <HowWeAreDifferent onStartProjectClick={handleContactOpen} />
      <WhatMakesUsUnique />
      <DedicatedTeam />
      <CaseStudies />
      <TestimonialsSection />
      {/* Blogs and Tech Packs are not in the home page as i want to reuse it on our next build */}
      {/* <BlogAndTechPacks /> */}
      <FAQ />
      <StartProject />
      <Footer />
      
      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
