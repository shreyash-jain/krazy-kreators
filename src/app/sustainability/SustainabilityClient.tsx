"use client";

import Image from "next/image";
import { useState } from "react";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";

export default function SustainabilityClient() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="w-full bg-white">
      {/* Hero (two-column) */}
      <section className="relative w-full bg-[#F5F0E8] min-h-screen flex items-center overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left copy */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-[#2D2A2E] tracking-tight mb-3">
                Fashion that respects people, materials, and Mother Earth
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed max-w-2xl">
                Sustainability isn&apos;t a trend for us — it&apos;s a responsibility. We work exclusively with certified mills, manufacturers, and vendors for organic and recycled inputs, ensuring transparency, performance, and a smaller footprint per garment.
              </p>
            </div>
            {/* Right image */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm relative h-64 sm:h-72 md:h-80 lg:h-96">
              <Image
                src="/sustainability/sustainability-hero.jpg"
                alt="Sustainability in fashion manufacturing at Krazy Kreators"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full bg-white py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#2D2A2E] font-bold font-sans mb-12 leading-tight max-w-4xl mx-auto text-center">
            Because fashion should care for the planet as much as it cares for people.
          </h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-[#F5F0E8] rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6BA292] mb-2">50+</div>
              <div className="text-xs sm:text-sm text-[#3D3846] font-medium">CERTIFIED PARTNERS</div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-[#F5F0E8] rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6BA292] mb-2">100+</div>
              <div className="text-xs sm:text-sm text-[#3D3846] font-medium">RECYCLED PROGRAMS</div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-[#F5F0E8] rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6BA292] mb-2">30-60%</div>
              <div className="text-xs sm:text-sm text-[#3D3846] font-medium">AVG. WATER SAVINGS*</div>
            </div>
            
            {/* Card 4 */}
            <div className="bg-[#F5F0E8] rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6BA292] mb-2">100%</div>
              <div className="text-xs sm:text-sm text-[#3D3846] font-medium">TRACEABLE BATCHES</div>
            </div>
          </div>
          
          {/* Disclaimer */}
          <p className="text-xs sm:text-sm text-[#3D3846] text-center mb-8 max-w-4xl mx-auto">
            *Water savings vary by fabric, mill process and color depth.
          </p>
          
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed max-w-4xl mx-auto text-center mb-6">
            At Krazy Kreators, sustainability isn&apos;t a trend — it&apos;s our responsibility.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed max-w-4xl mx-auto text-center mb-6">
            We understand that every fabric, dye, and stitch leaves an impact on our environment and Mother Earth. That&apos;s why we work only with certified mills, manufacturers, and vendors who share our vision of a cleaner, transparent, and ethical fashion supply chain.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed max-w-4xl mx-auto text-center">
            From organic cotton to recycled polyester, our wide network of sustainable suppliers ensures every product we develop has a smaller footprint and a bigger purpose.
          </p>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="w-full bg-[#F5F0E8] py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left image */}
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm relative h-64 sm:h-72 md:h-80 lg:h-96">
                <Image
                  src="/sustainability/sustainability-recycle.png"
                  alt="Our commitment to sustainability at Krazy Kreators"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Right text */}
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-[#2D2A2E] tracking-tight mb-6 text-center lg:text-left">
                Our Commitment
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#6BA292] mr-3 mt-1">•</span>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    We source only from certified vendors — every fabric, yarn, and dyeing process is verified for sustainability and traceability.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6BA292] mr-3 mt-1">•</span>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    We prioritize recycled and eco-friendly materials — including GRS-certified recycled polyester, organic cotton, and low-impact dye processes.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6BA292] mr-3 mt-1">•</span>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    We educate our partners and buyers about sustainable alternatives — helping brands make conscious choices without compromising design or performance.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="text-[#6BA292] mr-3 mt-1">•</span>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    We audit and verify our partner facilities for fair labor, waste management, and energy-efficient processes.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="w-full bg-[#F5F0E8] py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-[#2D2A2E] tracking-tight mb-6 text-center">
            Why It Matters
          </h2>
          <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed mb-8 max-w-4xl mx-auto text-center">
            Every garment we create carries a footprint — and every choice we make shapes the world we leave behind. Together, we&apos;re building a fashion industry that protects our planet and empowers people, one responsible decision at a time.
          </p>
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 max-w-6xl mx-auto">
            {/* Card 1 - Water Pollution */}
            <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.69C8.5 2.69 5.69 5.5 5.69 9c0 1.5.5 2.9 1.3 4L12 22l5-9c.8-1.1 1.3-2.5 1.3-4 0-3.5-2.8-6.31-6.3-6.31zM12 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                  Protect clean water by eliminating harmful chemicals from dyeing and finishing processes.
                </p>
              </div>
            </div>
            
            {/* Card 2 - Carbon Emissions */}
            <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.5 12c0 3.03-2.47 5.5-5.5 5.5S6.5 15.03 6.5 12 8.97 6.5 12 6.5s5.5 2.47 5.5 5.5zm-5.5-3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-7.5 3c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5S4.5 16.14 4.5 12z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                  Reduce carbon footprint through energy-efficient production and renewable resources.
                </p>
              </div>
            </div>
            
            {/* Card 3 - Waste Generation */}
            <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                  Transform waste into value through circular design and responsible material recovery.
                </p>
              </div>
            </div>
            
            {/* Card 4 - Unethical Labor */}
            <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                  Empower workers with fair wages, safe conditions, and dignity throughout the supply chain.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed max-w-4xl mx-auto text-center">
            This is more than fashion — it&apos;s our promise to future generations. Together, we&apos;re crafting a world where style and sustainability go hand in hand.
          </p>
        </div>
      </section>

      {/* Our Certified Network Section */}
      <section className="w-full bg-white py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-[#2D2A2E] tracking-tight mb-6 text-center">
            Our Certified Network
          </h2>
          <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed mb-8 max-w-4xl mx-auto text-center">
            We&apos;re proud to collaborate with manufacturers and mills that hold some of the most recognized global sustainability certifications.
          </p>
          <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed mb-8 max-w-4xl mx-auto text-center">
            Here&apos;s what they mean — so our buyers can make informed, confident choices:
          </p>
          
          {/* Certifications Table */}
          <div className="overflow-x-auto max-w-6xl mx-auto border-2 border-[#ECE9E2] rounded-xl">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-[#F5F0E8]">
                  <th className="text-left p-4 sm:p-6 text-sm sm:text-base font-bold text-[#2D2A2E] border-b border-[#ECE9E2]">
                    Certification
                  </th>
                  <th className="text-left p-4 sm:p-6 text-sm sm:text-base font-bold text-[#2D2A2E] border-b border-[#ECE9E2]">
                    Purpose & Key Points
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#ECE9E2] hover:bg-[#F5F0E8]/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm sm:text-base font-semibold text-[#2D2A2E] align-top">
                    GOTS (Global Organic Textile Standard)
                  </td>
                  <td className="p-4 sm:p-6 text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Ensures fibers are organic, free from harmful chemicals, and produced under fair labor conditions. Ideal for brands focusing on organic cotton or natural fabrics.
                  </td>
                </tr>
                <tr className="border-b border-[#ECE9E2] hover:bg-[#F5F0E8]/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm sm:text-base font-semibold text-[#2D2A2E] align-top">
                    GRS (Global Recycled Standard)
                  </td>
                  <td className="p-4 sm:p-6 text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Verifies recycled content in materials (like polyester, nylon, cotton) and ensures environmental & social practices throughout production. Perfect for recycled polyester or blended fabrics.
                  </td>
                </tr>
                <tr className="border-b border-[#ECE9E2] hover:bg-[#F5F0E8]/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm sm:text-base font-semibold text-[#2D2A2E] align-top">
                    OEKO-TEX® Standard 100
                  </td>
                  <td className="p-4 sm:p-6 text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Guarantees textiles are tested for harmful substances and are safe for human use. Essential for skin-friendly apparel or babywear.
                  </td>
                </tr>
                <tr className="border-b border-[#ECE9E2] hover:bg-[#F5F0E8]/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm sm:text-base font-semibold text-[#2D2A2E] align-top">
                    Fair Trade Certified™
                  </td>
                  <td className="p-4 sm:p-6 text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Focuses on ethical labor, fair wages, and community welfare in production units. Best suited for brands that value social sustainability.
                  </td>
                </tr>
                <tr className="border-b border-[#ECE9E2] hover:bg-[#F5F0E8]/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm sm:text-base font-semibold text-[#2D2A2E] align-top">
                    BCI (Better Cotton Initiative)
                  </td>
                  <td className="p-4 sm:p-6 text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Promotes better standards in cotton farming, reducing water usage and improving livelihoods. Excellent for brands using cotton fabrics.
                  </td>
                </tr>
                <tr className="border-b border-[#ECE9E2] hover:bg-[#F5F0E8]/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm sm:text-base font-semibold text-[#2D2A2E] align-top">
                    ISO 14001
                  </td>
                  <td className="p-4 sm:p-6 text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Certification for environmental management systems — ensures factories minimize waste, pollution, and energy use.
                  </td>
                </tr>
                <tr className="border-b border-[#ECE9E2] hover:bg-[#F5F0E8]/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm sm:text-base font-semibold text-[#2D2A2E] align-top">
                    Higg Index (by SAC)
                  </td>
                  <td className="p-4 sm:p-6 text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Measures environmental and social impacts of the entire value chain. Helps brands assess sustainability performance transparently.
                  </td>
                </tr>
                <tr className="hover:bg-[#F5F0E8]/50 transition-colors">
                  <td className="p-4 sm:p-6 text-sm sm:text-base font-semibold text-[#2D2A2E] align-top">
                    RCS (Recycled Claim Standard)
                  </td>
                  <td className="p-4 sm:p-6 text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Verifies recycled content in a product, but with less stringent chain-of-custody checks than GRS — suitable for entry-level sustainable collections.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The Krazy Kreators Way Section */}
      <section className="w-full bg-[#F5F0E8] py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-[#2D2A2E] tracking-tight mb-6 text-center">
            The Krazy Kreators Way
          </h2>
          <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed mb-4 max-w-4xl mx-auto text-center">
            We believe sustainability should be practical, scalable, and transparent.
          </p>
          <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed mb-8 max-w-4xl mx-auto text-center">
            That&apos;s why we don&apos;t just design garments — we design systems that empower brands to grow responsibly.
          </p>
          
          {/* Image */}
          <div className="mb-12 max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm relative h-64 sm:h-72 md:h-80 lg:h-96">
              <Image
                src="/sustainability/sustainability-the-krazy-kreators-way.jpg"
                alt="The Krazy Kreators Way - sustainable fashion manufacturing"
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#2D2A2E] mb-8 text-center">
              When you partner with Krazy Kreators, you get:
            </h3>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Card 1 - Pre-verified Suppliers */}
              <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-[#2D2A2E] mb-2">
                    Access to pre-verified sustainable suppliers
                  </h4>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Gain direct access to our trusted network of pre-verified, sustainability-certified mills and manufacturers — ensuring every material and process meets global environmental and ethical standards.
                  </p>
                </div>
              </div>
              
              {/* Card 2 - Transparency */}
              <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-[#2D2A2E] mb-2">
                    Transparency in sourcing and manufacturing
                  </h4>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    We believe in complete traceability — from the origin of every fiber to the final stitch — giving brands and buyers a clear view into how their garments are responsibly made.
                  </p>
                </div>
              </div>
              
              {/* Card 3 - Custom Solutions */}
              <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-[#2D2A2E] mb-2">
                    Custom solutions for eco-conscious product lines
                  </h4>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Our team collaborates closely with brands to develop tailor-made solutions that blend sustainability with creativity, helping you design collections that are both eco-friendly and commercially viable.
                  </p>
                </div>
              </div>
              
              {/* Card 4 - Certification Support */}
              <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-[#2D2A2E] mb-2">
                    Support in certification documentation for export buyers
                  </h4>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    We simplify the certification process for you by assisting with documentation, audits, and compliance requirements — making it easier to meet international sustainability standards and buyer expectations.
                  </p>
                </div>
              </div>
              
              {/* Card 5 - Shared Mission */}
              <div className="bg-white rounded-xl border border-[#ECE9E2] shadow-sm p-6 sm:p-8 flex items-start gap-4 md:col-span-2">
                <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#6BA292]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-[#2D2A2E] mb-2">
                    A shared mission to create fashion that feels good and does good
                  </h4>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    At Krazy Kreators, we partner with brands that believe in purpose-driven design — creating fashion that not only looks beautiful but also uplifts people and protects our planet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-white py-14 sm:py-16 md:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#2D2A2E] mb-3">
            Let&apos;s Build a Greener Fashion Future
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-3xl mx-auto mb-4">
            Whether you&apos;re a growing fashion startup or a global brand, we help you make sustainability part of your identity — not just your label.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-3xl mx-auto mb-6">
            Join hands with Krazy Kreators — where creativity meets conscience, and every fabric tells a story of responsibility.
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

