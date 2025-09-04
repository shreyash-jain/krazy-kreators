"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MessageSquare, Package, ShieldCheck, Video, ClipboardList, CalendarDays } from "lucide-react";

const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

export default function ManufacturingServicesClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
        <div className="relative min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-24 sm:py-28 md:py-32 text-center">
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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
                {process.map((step) => {
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Creative Journeys We’ve Brought to Life</h2>
            <p className="mt-2 text-sm sm:text-base text-[#5C5C5C]">From concept to collection — explore the brands we’ve helped shine in the fashion world.</p>
          </div>
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                		            { brand: "Drover Cowboy Threads", location: "Oklahoma, USA", image: "/brands/drover-coverimage.jpg", href: "/case-studies/drover" },
                { brand: "Tilted Lotus", location: "Texas, USA", image: "/brands/titled-lotus-coverimage.png", href: "/case-studies/tilted-lotus" },
                { brand: "Las Loungewear", location: "Miami, USA", image: "/brands/las-loungewear- coverimage.png", href: "#" },
                { brand: "HY Official", location: "Texas, USA", image: "/brands/hy-official-coverimage.png", href: "#" },
                { brand: "Badria Al Shihhi", location: "Seeb, Oman", image: "/brands/badriaalshihhi-coverimage.jpg", href: "/case-studies/badri-al-shihhi" },
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

      {/* FAQ Section */}
      <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-2xl mx-auto px-4">
              Everything you need to know about our manufacturing services. Can&apos;t find what you&apos;re looking for? 
              <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="text-[#CBB49A] hover:text-[#b7a078] transition-colors duration-200 ml-1 underline underline-offset-2">
                Get in touch
              </a>
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-0">
            {[
              {
                question: "What's our MOQ (Minimum Order Quantity)?",
                answer: "We're flexible. Pilot runs from ~100–300 pcs per style/color are possible (fabric-dependent). For cost-efficient bulk production, 500–1,000+ pcs per style/color is typical. We also offer low-MOQ options on select core fabrics that we keep in stock."
              },
              {
                question: "How long do our production and sampling take?",
                answer: "Standard timelines: development samples in 3–5 weeks (depending on complexity), and bulk production in 6–8 weeks after approvals and deposit. Final timelines may vary by fabric lead time, embellishments, and factory capacity."
              },
              {
                question: "Which product categories can we manufacture?",
                answer: "We produce a wide range of apparel: menswear, womenswear (knits & woven), loungewear, shirts, dresses, hoodies, joggers, abayas, co-ord sets, jackets, jeans, tops, bottoms, light outerwear, and accessories such as scarves and socks — via our vetted vendor network."
              },
              {
                question: "Can we source fabrics, trims, and packaging?",
                answer: "Yes. We provide complete sourcing services — fabric R&D, vendor matching, trims (zippers, buttons, labels), sustainable options (organic, recycled), and custom packaging. Swatches and cost options are shared for transparent decision-making."
              },
              {
                question: "What quality standards do we follow?",
                answer: "We use a strict multi-stage quality control process: • Fabric inspection before cutting to eliminate roll or dye-lot defects. • In-line QC during stitching and finishing. • Multiple checkpoints for trims, stitching accuracy, and finishing. • Final 100% inspection before packing — including measurements and fit validation — to ensure every item meets your approved specifications."
              },
              {
                question: "Which social or product certifications can we work with?",
                answer: "We regularly support production aligned with GOTS (organic), OEKO-TEX® STANDARD 100 (safety standards), and GRS (recycled content & chain of custody). We also collaborate with facilities audited under SMETA/WRAP when required by buyers."
              },
              {
                question: "What compliance and labeling do we support for US/EU markets?",
                answer: "We follow buyer tech packs and comply with: • US Textile Fiber Rule (fiber %, RN/company name, country of origin). • EU Regulation 1007/2011 (fiber composition). • CPSIA standards for US children's wear (lead/phthalates limits, tracking labels)."
              },
              {
                question: "What are our standard tolerances and size grading?",
                answer: "A graded size set is finalized during development. Typical tolerances are ±0.5–1.0 cm depending on fabric and garment area. These tolerances are locked in the approved spec sheet before bulk production."
              },
              {
                question: "How do we handle defects or remakes?",
                answer: "If QC identifies defects beyond agreed AQL/tolerances, we repair, replace, or credit as per contract. Inspection reports, photos, and corrective actions are shared to ensure transparency."
              },
              {
                question: "What are our pricing and payment terms?",
                answer: "We offer open costing on request. Quotes include fabric, trims, CM (cut & make), overheads, packaging, and QC. Payment terms: deposit on PO confirmation, with the balance due before dispatch. (For large orders, bank transfer/LC options available.)"
              },
              {
                question: "Which shipping terms do we offer?",
                answer: "We ship under FOB, CFR/CIF, or DDP terms via trusted logistics partners. • FOB: risk transfers at loading port. • CIF: includes seller-arranged insurance to destination port. • DDP: covers import clearance and duties for complete buyer convenience."
              },
              {
                question: "How do we communicate and track orders?",
                answer: "Every client gets a dedicated Project Manager for end-to-end communication. We provide weekly updates, milestone dashboards (sampling → approvals → cutting → stitching → finishing → dispatch), and shared folders for all documents to ensure full visibility."
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

