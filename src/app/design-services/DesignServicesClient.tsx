"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  PenTool,
  Ruler,
  Palette,
  FileText,
  Scissors,
  FlaskConical,
  LineChart,
  CheckCircle2,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

export default function DesignServicesClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const why = [
    { icon: CheckCircle2, title: "Comprehensive Solutions", desc: "All your design and research needs under one roof." },
    { icon: Lightbulb, title: "Innovative Approach", desc: "Creative and forward‑thinking design that ensures market standout." },
    { icon: ShieldCheck, title: "Quality Assurance", desc: "Every design is crafted with precision and attention to detail." },
    { icon: LineChart, title: "Forecasting Excellence", desc: "Expert trend forecasting keeps your brand ahead of the curve." },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com/" },
      { "@type": "ListItem", position: 2, name: "Design Services" },
    ],
  };

  return (
    <main className="w-full bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* HERO SECTION */}
      <section className="kk-hero-dark relative w-full bg-white min-h-screen flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/brands/design-why-choose-us.jpg" alt="Krazy Kreators design studio background" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-24 sm:py-28 md:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Design. Develop. Deliver.</h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl text-white/90 font-normal">Trend forecasting, garment sampling, and production-ready designs for fast-moving fashion brands.</h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Start Your Design Journey</a>
            <Link href="/#case-studies" className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full border border-white/70 text-white px-7 text-sm sm:text-base font-semibold hover:text-[#6BA292] hover:border-[#6BA292] transition-colors">View Portfolio</Link>
          </div>
        </div>
      </section>

      

      {/* EXPERTISE SUMMARY SECTION */}
      <section className="relative bg-white py-16 sm:py-20 md:py-24 overflow-hidden">
        {/* subtle accent shapes */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#F5F0E8] blur-2xl opacity-60" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#F8F7F4] blur-2xl opacity-60" />
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative">
          <header className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Our Fashion Design Expertise</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] max-w-[700px] mx-auto">
              From concept sketches to production-ready garments, we provide a full spectrum of design solutions for modern fashion brands.
            </p>
          </header>

          {/* 3-column grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: PenTool, title: "New Collection Development", desc: "Trendsetting collections tailored to your brand identity.", alt: "fashion design services – collection development" },
              { icon: Ruler, title: "Size and Fit Development", desc: "Precision fit for comfort, style, and quality.", alt: "fashion design services – size and fit" },
              { icon: Palette, title: "Print & Pattern Design", desc: "Original prints and patterns for every aesthetic.", alt: "print design for fashion" },
              { icon: FileText, title: "Printable Files for Garment Placement", desc: "Seamless, production-ready design files.", alt: "production ready print files" },
              { icon: Scissors, title: "In‑House Sampling", desc: "Test and refine your designs before full production.", alt: "garment sampling services" },
              { icon: FlaskConical, title: "Research & Development", desc: "Innovative solutions backed by in-depth research.", alt: "fashion R&D" },
            ].map((item) => {
              const Icon = item.icon as React.ComponentType<{ className?: string }>;
              return (
                <article key={item.title} className="rounded-2xl border border-[#ECE9E2] bg-white p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]" aria-label={item.alt}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E]">{item.title}</h3>
                      <div className="h-0.5 w-8 bg-[#6BA292] rounded-full mt-1.5" />
                      <p className="mt-2 text-sm text-[#5C5C5C]">{item.desc}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA intentionally omitted to keep section minimal and editorial */}
        </div>
      </section>

      {/* Services grid with images removed to avoid duplication */}

      {/* WHY CHOOSE US SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm h-full">
              <div className="relative w-full h-full min-h-[22rem]">
                <Image src="/brands/design-hero.jpg" alt="Why choose Krazy Kreators design services – collaborative team at work" fill className="object-cover" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Why Choose Krazy Kreators for Your Design Needs?</h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {why.map((w) => {
                  const Icon = w.icon;
                  return (
                    <article key={w.title} className="rounded-xl border border-[#ECE9E2] bg-white p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]" aria-hidden="true">
                          <Icon className="w-4 h-4" />
                        </span>
                        <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E]">{w.title}</h3>
                      </div>
                      <p className="mt-3 text-sm sm:text-base text-[#3D3846]">{w.desc}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES – GRID (below Why Choose section) */}
      <section id="client-case-studies" className="relative bg-white py-12 sm:py-16 md:py-20">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Creative Journeys We’ve Brought to Life</h2>
            <p className="mt-2 text-sm sm:text-base text-[#5C5C5C]">From concept to collection — explore the brands we’ve helped shine in the fashion world.</p>
          </div>

          {/* Standard responsive grid */}
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                		            { brand: "Drover Cowboy Threads", location: "Oklahoma, USA", logo: "/brands/drover.png", href: "/case-studies/drover", desc: "Western-inspired apparel brought from concept to production-ready with refined fits.", image: "/brands/drover-coverimage.jpg" },
                { brand: "Tilted Lotus", location: "Texas, USA", logo: "/brands/titled-lotus.png", href: "/case-studies/tilted-lotus", desc: "Print and pattern design with seasonal capsule planning to accelerate rollouts.", image: "/brands/titled-lotus-coverimage.png" },
                { brand: "Las Loungewear", location: "Miami, USA", logo: "/brands/las-loungewear.png", href: "/case-studies/las", desc: "Comfort-first loungewear line with size and fit development for D2C scale.", image: "/brands/las-loungewear- coverimage.png" },
                { brand: "HY Official", location: "Texas, USA", logo: "/brands/hy-official.png", href: "/case-studies/hy-official", desc: "Trend forecasting and garment sampling to validate silhouettes prior to launch.", image: "/brands/hy-official-coverimage.png" },
                { brand: "Badria Al Shihhi", location: "Seeb, Oman", logo: "/brands/badri-al-shihhi.png", href: "/case-studies/badri-al-shihhi", desc: "End‑to‑end fashion design from concept through to production for retail launch.", image: "/brands/badriaalshihhi-coverimage.jpg" },
              ].map((c) => (
                <a key={c.brand} href={c.href} className="group block">
                  <article className="rounded-2xl border border-[#ECE9E2] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5">
                    <div className="relative w-full h-44 sm:h-48">
                      <Image src={c.image} alt={`${c.brand} case study cover`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-5 sm:p-6 flex flex-col">
                      <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E] group-hover:text-[#6BA292] transition-colors duration-200">{c.brand}</h3>
                      <p className="text-sm text-[#777] mt-0.5">{c.location}</p>
                      <p className="mt-2 text-sm text-[#4B4652] line-clamp-3">{c.desc}</p>
                      <div className="mt-4 flex justify-end">
                        <span className="text-[#6BA292] group-hover:text-[#2D2A2E] transition-colors duration-200 text-sm font-medium">Learn More</span>
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-2xl mx-auto px-4">
              Everything you need to know about our design services. Can&apos;t find what you&apos;re looking for? 
              <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="text-[#CBB49A] hover:text-[#b7a078] transition-colors duration-200 ml-1 underline underline-offset-2">
                Get in touch
              </a>
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-0">
            {[
              {
                question: "What design services do we offer?",
                answer: "We provide end-to-end fashion design services including trend research, concept boards, color palettes, print and embroidery development, CAD flats, 3D mockups (on request), measurement specifications, BOMs, graded size charts, and production-ready tech packs."
              },
              {
                question: "What's included in our tech pack?",
                answer: "Our tech packs include a cover page, detailed sketches/flats, measurements with tolerances, size grading, BOM with material codes, construction notes, stitch types, embellishment placements, care/content label specifications, packaging details, and QC checkpoints."
              },
              {
                question: "Which files and tools do we use?",
                answer: "We work with industry-standard tools such as Adobe Illustrator (AI/PDF), layered PSDs, JPGs/PNGs for visuals, XLSX/CSV spec sheets, and DXF/PLT files for patterns (on request). We can also adapt to client-provided file templates."
              },
              {
                question: "How many revisions do we include?",
                answer: "For each style, we usually include two design revisions and one specification refinement (fair-use policy). Any additional iterations can be delivered at transparent, pre-agreed costs."
              },
              {
                question: "Can we translate mood boards into vendor-ready packs?",
                answer: "Yes. When clients share mood boards or references, we transform them into complete, vendor-ready packs with exact measurements, trims, Pantone codes, and construction details."
              },
              {
                question: "Do we retain the IP for the designs we create?",
                answer: "No. Upon full payment, all intellectual property (IP) is transferred to the client. We ensure complete ownership transfer of all designs, concepts, and technical specifications."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-[#ECE9E2] last:border-b-0">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-4 sm:py-6 md:py-8 text-left flex items-center justify-between group hover:bg-[#F8F7F4]/50 transition-colors duration-200"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-medium text-[#2D2A2E] pr-4 sm:pr-8 leading-relaxed">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center relative">
                      <div className={`w-3 h-0.5 sm:w-4 sm:h-0.5 bg-[#CBB49A] transition-all duration-300 ${
                        openIndex === index ? 'rotate-90' : ''
                      }`}></div>
                      <div className={`w-3 h-0.5 sm:w-4 sm:h-0.5 bg-[#CBB49A] transition-all duration-300 absolute ${
                        openIndex === index ? 'opacity-0' : 'opacity-100'
                      }`}></div>
                    </div>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="pb-4 sm:pb-6 md:pb-8 pr-4 sm:pr-8">
                    <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT CASE STUDIES – Bento Grid (removed in favor of horizontal scroller) */}

      {/* FINAL CTA SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Transform Your Vision Into Reality</h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-[#3D3846]">Partner with Krazy Kreators to bring your fashion concepts to life — from initial sketches to market‑ready collections.</p>
            <div className="mt-6">
              <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Contact Us Today</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}