"use client";

import Footer from "@/components/Footer";
import FromDesignToShelf from "@/components/FromDesignToShelf";
import Image from "next/image";
import Link from "next/link";
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
        <div className="relative min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-24 sm:py-28 md:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Your End‑to‑End Fashion Solution</h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl text-white/90 font-normal">A subscription‑based model that handles research, design, sampling, production, QA, storage, and updates — so you focus on customers and growth.</h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Start Your Subscription</a>
            <Link href="/#case-studies" className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full border border-white/70 text-white px-7 text-sm sm:text-base font-semibold hover:text-[#6BA292] hover:border-[#6BA292] transition-colors">View Portfolio</Link>
          </div>
        </div>
      </section>

      

      {/* COVERAGE GRID */}
      <section className="relative bg-white py-16 sm:py-20 md:py-24">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Creative Journeys We’ve Brought to Life</h2>
            <p className="mt-2 text-sm sm:text-base text-[#5C5C5C]">From concept to collection — explore the brands we’ve helped shine in the fashion world.</p>
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                		            { brand: "Drover Cowboy Threads", location: "Oklahoma, USA", image: "/brands/drover-coverimage.jpg", href: "/case-studies/drover", desc: "Western-inspired apparel brought from concept to production-ready with refined fits." },
                { brand: "Tilted Lotus", location: "Texas, USA", image: "/brands/titled-lotus-coverimage.png", href: "/case-studies/tilted-lotus", desc: "Print and pattern design with seasonal capsule planning to accelerate rollouts." },
                { brand: "Las Loungewear", location: "Miami, USA", image: "/brands/las-loungewear- coverimage.png", href: "/case-studies/las", desc: "Comfort-first loungewear line with size and fit development for D2C scale." },
                { brand: "HY Official", location: "Texas, USA", image: "/brands/hy-official-coverimage.png", href: "/case-studies/hy-official", desc: "Trend forecasting and garment sampling to validate silhouettes prior to launch." },
                { brand: "Badria Al Shihhi", location: "Seeb, Oman", image: "/brands/badriaalshihhi-coverimage.jpg", href: "/case-studies/badri-al-shihhi", desc: "End‑to‑end fashion design from concept through to production for retail launch." },
              ].map((c) => (
                <a key={c.brand} href={c.href} className="group block">
                  <article className="rounded-2xl border border-[#ECE9E2] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5">
                    <div className="relative w-full h-44 sm:h-48">
                      <Image src={c.image} alt={`${c.brand} end-to-end case study cover`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
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
              Everything you need to know about our end-to-end services. Can&apos;t find what you&apos;re looking for? 
              <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="text-[#CBB49A] hover:text-[#b7a078] transition-colors duration-200 ml-1 underline underline-offset-2">
                Get in touch
              </a>
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-0">
            {[
              {
                question: "What does our end-to-end service include?",
                answer: "Our end-to-end apparel manufacturing service covers everything: concept and design, fabric and trim sourcing, sampling, cost engineering, pre-production, bulk manufacturing, QA/AQL inspections, packaging, and global shipping under your preferred Incoterm. A dedicated Project Manager oversees every step for full accountability."
              },
              {
                question: "How do we kick off a new brand or collection?",
                answer: "We begin with a discovery call and project brief covering target market, pricing strategy, and sustainability goals. Then, we create a detailed roadmap with milestones, responsibilities, and a timeline/Gantt chart so you know exactly what happens at each stage."
              },
              {
                question: "Can we help choose sustainable materials and certifications?",
                answer: "Yes. We specialize in sustainable fashion sourcing and offer certified inputs like organic (GOTS), recycled (GRS), and OEKO-TEX® STANDARD 100 materials. We also map documentation and chain-of-custody requirements directly into your purchase order flow."
              },
              {
                question: "What labs and product tests do we coordinate?",
                answer: "We coordinate third-party textile and garment testing — including colorfastness, pilling, dimensional stability, and other buyer-standard tests. We also ensure all labeling and compliance standards are met for US, EU, and global markets."
              },
              {
                question: "How do we ensure on-time delivery?",
                answer: "Through critical path management, fabric booking gates, capacity planning, and weekly progress reviews. If risks arise (fabric delays, testing holds), we proactively escalate with solutions such as alternate mills or split shipments."
              },
              {
                question: "What visibility do clients get during production?",
                answer: "We provide full transparency through milestone dashboards, photo and video updates, and inspection reports (inline and final AQL). Each report includes clear pass/fail results and corrective action plans."
              },
              {
                question: "Can we handle global shipping and customs paperwork?",
                answer: "Yes. We prepare all required shipping and customs documents — including commercial invoices, packing lists, COO, test certificates, and label declarations. We support FOB, CIF, CFR, or DDP shipping terms per client preference."
              },
              {
                question: "Do we support reorders and rolling forecasts?",
                answer: "Yes. We maintain approved specs, patterns, and vendor allocations. With your forecasts, we pre-book greige fabric or loom time to reduce lead times and streamline reorders."
              },
              {
                question: "What is our approach to cost transparency?",
                answer: "We practice open costing on request. Our detailed breakdown includes fabric yield, trims, cut-and-make (CM), wastage, packaging, testing, and logistics — empowering you to make faster, margin-driven decisions."
              },
              {
                question: "How do we handle IP and confidentiality?",
                answer: "We sign NDAs, restrict file access to your dedicated project team, and maintain a private library for your patterns, fabrics, and artwork. Protecting your brand's intellectual property is our priority."
              },
              {
                question: "What happens if a shipment fails a test or inspection?",
                answer: "We block shipment immediately, identify root causes, rework/reinspect, and re-test if needed. Clients receive a full CAPA (Corrective and Preventive Action) report along with a revised shipping plan."
              },
              {
                question: "Can we scale from small batches to large volumes?",
                answer: "Yes. We manage pilot runs in-house starting from small batches, and scale up to 100k+ pcs/month through our vetted manufacturing partners — all while keeping the same Project Manager and QA process."
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

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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

