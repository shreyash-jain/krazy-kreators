"use client";

import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { useState } from "react";

const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

export default function AboutPage() {
  const [contactOpen, setContactOpen] = useState(false);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com/" },
      { "@type": "ListItem", position: 2, name: "About" },
    ],
  };

  return (
    <main className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero (two-column) */}
      <section className="relative w-full bg-[#F5F0E8] min-h-screen flex items-center overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left copy */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-[#2D2A2E] tracking-tight mb-3">
                About Krazy Kreators
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed max-w-2xl">
                Krazy Kreators is your trusted partner in <strong>fashion brand manufacturing</strong> and clothing production. We specialize in turning ideas into reality — from innovative design development and detailed tech packs to sampling, bulk production, and global delivery. With a focus on quality, speed, and sustainability, we support fashion startups and established brands alike, ensuring every collection is market-ready. Our dedicated team bridges the gap between creativity and execution, making the entire process simple, transparent, and reliable. At Krazy Kreators, we don&apos;t just produce garments — we create fashion journeys that inspire growth worldwide.
              </p>
            </div>
            {/* Right image */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
              <img
                src="/brands/contact.jpg"
                alt="Krazy Kreators team – fashion design and manufacturing"
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats below hero */}
      <section className="w-full bg-white py-8 sm:py-10 md:py-12">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] mb-6">Our Impact in Numbers</h2>
            <div className="w-16 h-0.5 bg-[#6BA292] rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-12 sm:gap-16 md:gap-20 mb-12 sm:mb-16 md:mb-20 w-full justify-items-center px-4 max-w-4xl mx-auto">
            {/* Stat 1 */}
            <div className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">5+</span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">brands launched successfully</span>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">15+</span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">years of industry experience</span>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">3000+</span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">designs prototyped & produced</span>
            </div>
            {/* Stat 4 */}
            <div className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">1lakh+</span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">garments manufactured & shipped</span>
            </div>
          </div>
          
          {/* Brand Logos Row */}
          <div className="mt-8 sm:mt-12 md:mt-16 w-full px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 items-center">
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
                <img src="/brands/drover.png" alt="Drover fashion brand logo - custom clothing production" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
              </div>
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
                <img src="/brands/titled-lotus.png" alt="Tilted Lotus logo - create your own fashion brand" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
              </div>
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
                <img src="/brands/las-loungewear.png" alt="Las Loungewear logo - fashion brand manufacturing" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
              </div>
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
                <img src="/brands/hy-official.png" alt="HY Official logo - clothing manufacturing services" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
              </div>
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
                <img src="/brands/badri-al-shihhi.png" alt="Badria Al Shihhi logo - custom clothing production" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story – Past, Present & Future */}
      <section className="w-full py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#2D2A2E] mb-6 sm:mb-8">
            Our Story: Past, Present & Future
          </h2>
          <div className="w-14 h-0.5 bg-[#6BA292] rounded-full mb-8" />

          {/* 3-up blocks */}
          <div className="space-y-10 sm:space-y-12 lg:space-y-16">
            {/* Past */}
            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                {/* Text */}
                <div className="order-2 md:order-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#6BA292] inline-block" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2D2A2E]">Past – Humble Beginnings with a Vision</h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Krazy Kreators started with a clear purpose: to simplify the complex journey of fashion brand creation. In our early days, we worked closely with founders and aspiring entrepreneurs who had the passion but needed structured support to bring their clothing ideas to life. Our focus was on building accurate tech packs, assisting with fittings, and managing small sample runs, ensuring that every design could move confidently into production. This hands-on approach gave startups clarity, reduced costly mistakes, and allowed them to test their ideas in the real market. Those beginnings shaped our ethos of partnership, precision, and creativity, which continue to guide us today.
                  </p>
                </div>
                {/* Image right on desktop */}
                <div className="order-1 md:order-2">
                  <img
                    src="/brands/about-past.jpg"
                    alt="Past – early fashion design to delivery support"
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover rounded-xl border border-[#ECE9E2]"
                  />
                </div>
              </div>
            </div>

            {/* Present */}
            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                {/* Image left on desktop */}
                <div className="order-1 md:order-1">
                  <img
                    src="/brands/about-present.jpg"
                    alt="Present – sustainable clothing manufacturing at Krazy Kreators"
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover rounded-xl border border-[#ECE9E2]"
                  />
                </div>
                {/* Text */}
                <div className="order-2 md:order-2">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#6BA292] inline-block" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2D2A2E]">Present – End-to-End Fashion Manufacturing Excellence</h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Today, Krazy Kreators stands as a complete fashion manufacturing and supply chain partner trusted by both startups and established global brands. Our services span the entire journey — from trend research, design development, and digital sampling to custom clothing production, quality control, and international shipping. With in-house capacity and an extended vendor network, we deliver speed without compromising on finish quality. Every project is managed with transparent timelines, clear costing, and strict fit checks, giving our clients confidence at every stage. Sustainability remains at the heart of our operations, with a strong emphasis on responsible sourcing, reduced waste, and smarter production practices. By combining creative design with seamless execution, we empower brands to focus on growth while we manage the complexity of production.
                  </p>
                </div>
              </div>
            </div>

            {/* Future */}
            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                {/* Text */}
                <div className="order-2 md:order-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#6BA292] inline-block" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2D2A2E]">Future – Innovating Fashion for a Smarter Tomorrow</h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Looking ahead, Krazy Kreators is committed to reshaping how fashion brands are built and scaled globally. The future of fashion lies in innovation, sustainability, and predictability, and we are investing heavily in these areas. From exploring next-generation fabrics and eco-friendly materials to adopting 3D digital sampling and virtual prototyping, we aim to help brands launch faster with fewer risks. Our vision also includes expanding global partnerships that give our clients access to diverse manufacturing hubs and supply chain advantages across geographies. By blending technology, sustainability, and collaboration, Krazy Kreators seeks to create a future where fashion production is faster, smarter, and better for the planet. We don&apos;t just keep up with industry change — we strive to lead it.
                  </p>
                </div>
                {/* Image right on desktop */}
                <div className="order-1 md:order-2">
                  <img
                    src="/brands/about-future.jpg"
                    alt="Future – innovation in custom clothing production at Krazy Kreators"
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover rounded-xl border border-[#ECE9E2]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder’s Message */}
      <section className="w-full bg-[#F8F7F4] py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="max-w-[80%] mx-auto px-4 md:px-0 lg:px-0">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">From Our Founder</h2>
            <p className="text-sm sm:text-base md:text-lg text-[#3D3846] mt-2">Crafting Clothing Brands with Passion & Precision</p>
            <div className="w-16 h-0.5 bg-[#6BA292] rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative mx-auto w-full max-w-md h-[34rem] sm:h-[36rem] md:h-[40rem] lg:h-[44rem] rounded-3xl overflow-hidden border border-[#ECE9E2] shadow-sm">
              <img
                src="/brands/about-prashant.png"
                alt="Prashant Singh — founder of Krazy Kreators, fashion brand manufacturing"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <p className="text-[#3D3846] text-sm sm:text-base md:text-lg leading-relaxed">
                When I founded Krazy Kreators, the vision was simple yet bold: to bridge the gap between fashion dreams and manufacturing realities. I have always believed that great design deserves great execution, and that belief continues to guide everything we do.
              </p>
              <p className="text-[#3D3846] text-sm sm:text-base md:text-lg leading-relaxed mt-4">
                What started as a small initiative to support fashion startups with tech packs, sampling, and production clarity has grown into a full-fledged fashion manufacturing partner serving clients across the globe. Our journey has been shaped by an unwavering commitment to creativity, precision, and trust.
              </p>
              <p className="text-[#3D3846] text-sm sm:text-base md:text-lg leading-relaxed mt-4">
                At Krazy Kreators, we see ourselves not just as manufacturers, but as collaborators in your brand&apos;s story. Every stitch, seam, and silhouette reflects our promise to deliver with integrity and excellence. We take pride in offering solutions that are transparent, sustainable, and scalable, helping both startups and established brands move forward with confidence.
              </p>
              <p className="text-[#3D3846] text-sm sm:text-base md:text-lg leading-relaxed mt-4">
                As the founder, I am grateful for the incredible team that stands behind this vision. Together, we are building more than garments — we are crafting opportunities, nurturing ideas, and creating collections that leave a mark in the world of fashion.
              </p>
              <p className="text-[#3D3846] text-sm sm:text-base md:text-lg leading-relaxed mt-4">
                Thank you for trusting Krazy Kreators with your journey. I look forward to walking this path with you, turning visions into reality and ideas into iconic collections.
              </p>
              <p className="text-[#2D2A2E] font-semibold mt-6 font-serif italic">— Prashant Kumar</p>
              <p className="text-[#3D3846] text-sm font-medium mt-2">Founder & MD, Krazy Kreators (India) Pvt Ltd</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="w-full py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#2D2A2E]">Our Team</h2>
            <p className="text-[#3D3846] text-sm sm:text-base md:text-lg max-w-3xl mx-auto mt-3">
              Our expert fashion manufacturing team blends creativity, technical skill, and global sourcing expertise — the
              end‑to‑end clothing production specialists behind every collection.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Bipul Singh", role: "Director", desc: "Strategy & partnerships", img: "/brands/about-bipul.jpeg" },
              { name: "Seema Yadav", role: "Design Manager", desc: "Creative direction & design ops", img: "/brands/about-seema.jpeg" },
              { name: "Sonu Kumar", role: "Sourcing and Operations", desc: "Vendors, materials & timelines", img: "/brands/about-sonu.jpeg" },
              { name: "Rohit Goswami", role: "Sr. Fashion Designer", desc: "Apparel design & fits", img: "/brands/about-rohit.jpg" },
              { name: "Ayushi Singh", role: "Fashion Designer", desc: "Fashion designer", img: "/brands/about-ayushi.jpg" },
              { name: "Vinod Srivastva", role: "Quality Control", desc: "AQL & production audits", img: "/brands/about-vinod.jpeg" },
            ].map((m) => (
              <div key={m.name} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#ECE9E2]">
                <img src={m.img} alt={`${m.name} – ${m.role}`} className="w-full h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] object-cover" />
                <div className="p-4 sm:p-5">
                  <p className="text-[#2D2A2E] text-base font-semibold">{m.name}</p>
                  <p className="text-[#3D3846] text-sm">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#F8F7F4] py-14 sm:py-16 md:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#2D2A2E] mb-3">
            Ready to Start Your Fashion Brand?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-3xl mx-auto mb-6">
            From sketches to store shelves, Krazy Kreators is your trusted partner in <strong>fashion brand manufacturing</strong> &
            <strong> clothing brand creation</strong>.
          </p>
                      <button
              onClick={() => setContactOpen(true)}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-full bg-[#CBB49A] text-white text-sm sm:text-base font-semibold hover:bg-[#b7a078] transition-colors"
            >
            Let&apos;s Create Together
          </button>
        </div>
      </section>
      <Footer />
      
      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
} 