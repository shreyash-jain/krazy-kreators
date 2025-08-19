"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { CheckCircle2, MessageSquare, Package, ShieldCheck, Truck, Video, ClipboardList, CalendarDays } from "lucide-react";

const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

export default function ManufacturingServicesClient() {
  const [contactOpen, setContactOpen] = useState(false);

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Quality Control",
      desc: "Rigorous oversight at each stage ensures your standards are consistently met.",
    },
    {
      icon: Video,
      title: "Timely Updates",
      desc: "Transparent progress with regular photos and videos from the factory floor.",
    },
    {
      icon: MessageSquare,
      title: "Ease of Communication",
      desc: "Clear, responsive channels to resolve queries quickly across time zones.",
    },
    {
      icon: Package,
      title: "Customized Solutions",
      desc: "Tailored production plans that align with your brand&apos;s unique requirements.",
    },
  ];

  const process = [
    { icon: ClipboardList, title: "Initial Assessment", desc: "We align on goals, volumes, pricing, and quality expectations." },
    { icon: ShieldCheck, title: "Quality‑Centric Approach", desc: "Stringent checks, fit approvals, and standardized AQL inspections." },
    { icon: MessageSquare, title: "Transparent Communication", desc: "Regular status updates with visuals throughout the cycle." },
    { icon: CalendarDays, title: "Adherence to Schedules", desc: "Planned timelines with proactive risk mitigation for on‑time delivery." },
    { icon: Package, title: "Brand‑Aligned Packaging & Shipping", desc: "Packaging that reflects your identity and reliable global logistics." },
  ];

  return (
    <main className="w-full bg-white">
      {/* HERO */}
      <section className="kk-hero-dark relative w-full bg-white min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image src="/brands/manufacturing-hero.jpg" alt="Apparel manufacturing at Krazy Kreators partner facility" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0 py-24 sm:py-28 md:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Manufacture with Confidence</h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl text-white/90 font-normal">Seamless production management for overseas brands — quality, clarity, and on‑time delivery.</h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Start Your Project</a>
            <a href="/contact" className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full border border-white/70 text-white px-7 text-sm sm:text-base font-semibold hover:text-[#6BA292] hover:border-[#6BA292] transition-colors">Talk to Us</a>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative bg-white py-16 sm:py-20 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <header className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Why Our Manufacturing Management Works</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] max-w-[760px] mx-auto">
              At Krazy Kreators, we manage end‑to‑end production for overseas clients with an unwavering focus on quality, communication, and timely delivery.
            </p>
          </header>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {benefits.map((b) => {
              const Icon = b.icon as React.ComponentType<{ className?: string }>;
              return (
                <article key={b.title} className="rounded-2xl border border-[#ECE9E2] bg-white p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E]">{b.title}</h3>
                      <div className="h-0.5 w-8 bg-[#6BA292] rounded-full mt-1.5" />
                      <p className="mt-2 text-sm text-[#5C5C5C]">{b.desc}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Left: image */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm h-full">
              <div className="relative w-full h-full min-h-[22rem]">
                <Image src="/brands/manufacturing-plan.jpg" alt="Manufacturing process overview" fill className="object-cover" />
              </div>
            </div>
            {/* Right: heading + 2xN grid cards */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Our Creative Game Plan</h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] max-w-[760px]">A clear, step-by-step approach ensuring every project delivers excellence.</p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {process.map((step, idx) => {
                  const Icon = step.icon as React.ComponentType<{ className?: string }>;
                  return (
                  <article key={step.title} className="rounded-2xl border border-[#ECE9E2] bg-white p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292] mt-0.5">
                        <Icon className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E]">{step.title}</h3>
                        <div className="h-0.5 w-8 bg-[#6BA292] rounded-full mt-1.5" />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[#4B4652]">{step.desc}</p>
                  </article>
                );})}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES GRID (reuse pattern) */}
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
                    <Image src={c.image} alt={`${c.brand} production case study cover`} fill className="object-cover" />
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Experience Peace of Mind</h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-[#3D3846]">Focus on growth, marketing, and sales while we manage your production — with quality, communication, and delivery you can trust.</p>
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

