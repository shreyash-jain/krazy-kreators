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

export default function Home() {
  return (
    <>
      {/* SEO H1 for primary keywords */}
      <h1 className="sr-only">Start a clothing brand with Krazy Kreators — custom clothing production and fashion brand manufacturing</h1>
      <Hero />
      <AboutUs />
      <WhatWeDo />
      <FromDesignToShelf />
      <ExploreDesigns />
      <HowWeAreDifferent />
      <WhatMakesUsUnique />
      <DedicatedTeam />
      <CaseStudies />
      <TestimonialsSection />
      <BlogAndTechPacks />
      <FAQ />
      <StartProject />
      <Footer />
      {/* Add other sections here as components */}
    </>
  );
}
