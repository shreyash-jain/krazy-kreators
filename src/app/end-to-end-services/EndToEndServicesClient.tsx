"use client";

import Footer from "@/components/Footer";
import FromDesignToShelf from "@/components/FromDesignToShelf";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  LineChart,
  Palette,
  Scissors,
  Factory,
  ShieldCheck,
  UserCheck,
  Package,
  Camera,
  PiggyBank,
  FlaskConical,
  Gift,
  Workflow,
  Rocket,
  BadgePercent,
  Smile,
  TrendingUp,
  Truck,
} from "lucide-react";

const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

export default function EndToEndServicesClient() {
  const [contactOpen, setContactOpen] = useState(false);

  const coverage = [
    { icon: LineChart, title: "Forecast → Design", desc: "Deep trend research flows into brand-aligned design development." },
    { icon: Scissors, title: "Sampling & Manufacturing", desc: "Streamlined protos, fit rounds, and production with rigorous QA." },
    { icon: ShieldCheck, title: "100% Inspection", desc: "Every unit checked before packing to uphold top-tier standards." },
    { icon: UserCheck, title: "Project Manager", desc: "Your English‑speaking Design PM as a single point of contact." },
    { icon: Package, title: "Storage Facility", desc: "Store raw materials and leftovers to reduce cost on next runs." },
    { icon: Camera, title: "Real‑time Updates", desc: "Transparent images/videos from the floor for full visibility." },
    { icon: PiggyBank, title: "80% Lower Sampling Cost", desc: "Significant savings with our subscription‑based workflow." },
    { icon: FlaskConical, title: "R&D for New Styles", desc: "Iterate freely with unlimited design and sampling revisions." },
  ];

  const why = [
    { icon: ShieldCheck, title: "Client‑Centric", desc: "We optimize around your goals so you can focus on growth." },
    { icon: Factory, title: "Speed & Efficiency", desc: "Accelerated cycles and dependable delivery timelines." },
    { icon: PiggyBank, title: "Cost‑Effective", desc: "Savings across sampling, storage, and scale‑ready production." },
  ];

  const e2eBenefits = [
    { icon: Gift, title: "Free Design & Tech Pack", desc: "We offer initial design and tech packs at no cost." },
    { icon: Workflow, title: "Unified Process", desc: "Eliminate vendor coordination — we manage it all." },
    { icon: Rocket, title: "Faster Launch", desc: "Integrated execution reduces turnaround time." },
    { icon: BadgePercent, title: "Cost Smart", desc: "Lower overhead, higher value for your investment." },
    { icon: Palette, title: "Brand Alignment", desc: "Your vision is preserved at every stage." },
    { icon: Smile, title: "Less Stress", desc: "We handle complexities, you focus on growth." },
    { icon: TrendingUp, title: "Scalable for Startups", desc: "Built for agile scaling from prototype to production." },
    { icon: Truck, title: "Seamless Logistics", desc: "Complete warehousing and delivery solutions for timely, secure product distribution." },
  ];

  return (
    <main className="w-full bg-white">
      {/* HERO */}
      <section className="kk-hero-dark relative w-full bg-white min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image src="/brands/end-to-end-hero.jpg" alt="Krazy Kreators end-to-end fashion solution" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0 py-24 sm:py-28 md:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Your End‑to‑End Fashion Solution</h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl text-white/90 font-normal">A subscription‑based model that handles research, design, sampling, production, QA, storage, and updates — so you focus on customers and growth.</h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Start Your Subscription</a>
            <a href="/contact" className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full border border-white/70 text-white px-7 text-sm sm:text-base font-semibold hover:text-[#6BA292] hover:border-[#6BA292] transition-colors">Talk to Us</a>
          </div>
        </div>
      </section>

      

      {/* COVERAGE GRID */}
      <section className="relative bg-white py-16 sm:py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <header className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">What Our End‑to‑End Solution Covers</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] max-w-[760px] mx-auto">From forecast to delivery, we integrate every piece into one reliable, transparent operation.</p>
          </header>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {coverage.map((c) => {
              const Icon = c.icon as React.ComponentType<{ className?: string }>;
              return (
                <article key={c.title} className="rounded-2xl border border-[#ECE9E2] bg-white p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E]">{c.title}</h3>
                      <div className="h-0.5 w-8 bg-[#6BA292] rounded-full mt-1.5" />
                      <p className="mt-2 text-sm text-[#5C5C5C]">{c.desc}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm h-full">
              <div className="relative w-full h-full min-h-[22rem]">
                <Image src="/brands/end-to-end-why-choose-us.jpg" alt="Why choose Krazy Kreators end-to-end" fill className="object-cover" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Why Choose Krazy Kreators?</h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {why.map((w) => {
                  const Icon = w.icon as React.ComponentType<{ className?: string }>;
                  return (
                    <article key={w.title} className="rounded-xl border border-[#ECE9E2] bg-white p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
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

      {/* FROM DESIGN TO SHELF */}
      <FromDesignToShelf />

      {/* WHY OUR END-TO-END SERVICES WORK (reused pattern from landing) */}
      <section className="w-full bg-[#FAF9F7] py-12 sm:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E] mb-12 sm:mb-16 relative">
            Why Our End‑to‑End Services Work
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#6BA292] rounded-full"></div>
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {e2eBenefits.map((benefit) => {
              const Icon = benefit.icon as React.ComponentType<{ className?: string }>;
              return (
                <article key={benefit.title} className="rounded-2xl border border-[#ECE9E2] bg-white p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E]">{benefit.title}</h3>
                      <div className="h-0.5 w-8 bg-[#6BA292] rounded-full mt-1.5" />
                      <p className="mt-2 text-sm text-[#5C5C5C]">{benefit.desc}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CASE STUDIES GRID */}
      <section className="relative bg-white py-12 sm:py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Creative Journeys We’ve Brought to Life</h2>
            <p className="mt-2 text-sm sm:text-base text-[#5C5C5C]">From concept to collection — explore the brands we’ve helped shine in the fashion world.</p>
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { brand: "Drover Cowboy Threads", location: "London, UK", image: "/brands/drover-coverimage.png", href: "/case-studies/drover" },
                { brand: "Tilted Lotus", location: "New York, USA", image: "/brands/titled-lotus-coverimage.png", href: "#" },
                { brand: "Las Loungewear", location: "Los Angeles, USA", image: "/brands/las-loungewear- coverimage.png", href: "#" },
                { brand: "HY Official", location: "Seoul, South Korea", image: "/brands/hy-official-coverimage.png", href: "#" },
                { brand: "Badri Al Shihhi", location: "Dubai, UAE", image: "/brands/badriaalshihhi-coverimage.png", href: "#" },
              ].map((c) => (
                <article key={c.brand} className="rounded-2xl border border-[#ECE9E2] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="relative w-full h-44 sm:h-48">
                    <Image src={c.image} alt={`${c.brand} end-to-end case study cover`} fill className="object-cover" />
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">{c.brand}</h3>
                    <p className="text-sm text-[#777] mt-0.5">{c.location}</p>
                    <div className="mt-4 flex justify-end">
                      <a href={c.href} className="text-[#6BA292] hover:underline text-sm font-medium">Learn More</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Transform Your Brand with End‑to‑End</h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-[#3D3846]">Discover how our subscription‑based service elevates your fashion operations from research to delivery — with clarity and control.</p>
            <div className="mt-6">
              <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}

