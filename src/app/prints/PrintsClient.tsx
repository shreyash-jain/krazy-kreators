"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { 
  Scissors, 
  Sparkles, 
  Palette, 
  Layers,
  ChevronRight
} from "lucide-react";

const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

export default function PrintsClient() {
  const [contactOpen, setContactOpen] = useState(false);
  // const capabilities = [
  //   {
  //     icon: Scissors,
  //     title: "Wide Range of Techniques",
  //     description: "Screen printing, digital printing, block printing, and more.",
  //   },
  //   {
  //     icon: Sparkles,
  //     title: "Premium Detailing",
  //     description: "Adding artistic depth to garments — from casual wear to high-end fashion.",
  //   },
  //   {
  //     icon: Palette,
  //     title: "Creative Translation",
  //     description: "We translate your sketches and inspirations into print designs and final pieces.",
  //   },
  //   {
  //     icon: Layers,
  //     title: "Scalable Production",
  //     description: "From sample prints to bulk orders, our network ensures consistent quality and timely delivery.",
  //   },
  // ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com/" },
      { "@type": "ListItem", position: 2, name: "Design Services", item: "https://www.krazykreators.com/design-services" },
      { "@type": "ListItem", position: 3, name: "Prints & Patterns" },
    ],
  };

  return (
    <main className="w-full bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navbar />

      {/* HERO SECTION - MATCH DESIGN SERVICES STYLE */}
      <section className="kk-hero-dark relative w-full bg-white min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image src="/services/prints/print-hero.jpg" alt="Prints and patterns craftsmanship by Krazy Kreators" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">Prints & Patterns</h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-normal">The Art of Color, Texture, and Expression</h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Start Your Journey</a>
            <Link href="/#case-studies" className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full border border-white/70 text-white px-7 text-sm sm:text-base font-semibold hover:text-[#6BA292] hover:border-[#6BA292] transition-colors">View Portfolio</Link>
          </div>
        </div>
      </section>

      {/* THE CRAFT BEHIND EVERY PRINT SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-6">
              The Craft Behind Every Print
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto mb-8">
              From timeless handcrafted techniques to modern digital innovations, fabric printing brings designs to life through color, texture, and precision. Each method — whether screen, block, or rotary — offers its own character and charm. At Krazy Kreators, we master diverse printing processes to transform every fabric into a distinctive canvas of creativity.
            </p>
            
            {/* Print Intro Image */}
            <div className="flex justify-center">
              <div className="relative h-96 lg:h-[500px] w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/print-intro.png" 
                  alt="Print design process and techniques at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCREEN PRINTING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F5F2E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-6">
              Screen Printing
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto">
              Screen printing is ideal when you need bold, durable, and high-quality prints. It&apos;s most suitable in these cases:
            </p>
          </div>

          {/* Desktop: Image Left, First 3 Cards Right Layout */}
          <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
            {/* Image on the left */}
            <div className="order-1">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/screen-printing.png" 
                  alt="Screen printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
            
            {/* First 3 Cards on the right */}
            <div className="order-2">
              <div className="space-y-4">
                {/* Card 1: Bulk Production */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Bulk Production</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p><strong>Why:</strong> Screen printing is cost-effective when printing large quantities.</p>
                        <p><strong>Example:</strong> Uniforms, event T-shirts, merchandise, or bulk apparel orders.</p>
                        <p><strong>Reason:</strong> Once the screen setup is done, each print is quick and cheap.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Limited Color Designs */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Limited Color Designs</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p><strong>Why:</strong> Each color needs a separate screen; fewer colors mean lower cost and faster setup.</p>
                        <p><strong>Example:</strong> Logos, simple graphics, slogans, or bold text prints.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Long-Lasting Prints */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Long-Lasting Prints</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p><strong>Why:</strong> The thick ink layer in screen printing bonds strongly to fabric.</p>
                        <p><strong>Result:</strong> Resistant to washing, sunlight, and friction.</p>
                        <p><strong>Example:</strong> Workwear, sportswear, school uniforms, or outdoor apparel.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Image first, then all cards */}
          <div className="lg:hidden mb-8">
            {/* Image */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/screen-printing.png" 
                  alt="Screen printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* All 5 Cards */}
            <div className="space-y-4">
              {/* Card 1: Bulk Production */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Bulk Production</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> Screen printing is cost-effective when printing large quantities.</p>
                      <p><strong>Example:</strong> Uniforms, event T-shirts, merchandise, or bulk apparel orders.</p>
                      <p><strong>Reason:</strong> Once the screen setup is done, each print is quick and cheap.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Limited Color Designs */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Limited Color Designs</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> Each color needs a separate screen; fewer colors mean lower cost and faster setup.</p>
                      <p><strong>Example:</strong> Logos, simple graphics, slogans, or bold text prints.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Long-Lasting Prints */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Long-Lasting Prints</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> The thick ink layer in screen printing bonds strongly to fabric.</p>
                      <p><strong>Result:</strong> Resistant to washing, sunlight, and friction.</p>
                      <p><strong>Example:</strong> Workwear, sportswear, school uniforms, or outdoor apparel.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Vibrant & Opaque Colors */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Vibrant & Opaque Colors</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> Screen inks sit on top of the fabric, not absorbed, giving rich, solid, and bright colors — even on dark fabrics.</p>
                      <p><strong>Example:</strong> Dark T-shirts, hoodies, or tote bags.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Special Finishes */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Special Finishes</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p className="mb-2">Screen printing allows special inks:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Metallic ink (gold/silver shine)</li>
                        <li>Puff ink (3D raised texture)</li>
                        <li>Glow-in-the-dark ink</li>
                        <li>High-density or gel inks</li>
                      </ul>
                      <p className="mt-2">Great for creative and textured designs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Cards 4 and 5 Below Both Columns */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 4: Vibrant & Opaque Colors */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Vibrant & Opaque Colors</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p><strong>Why:</strong> Screen inks sit on top of the fabric, not absorbed, giving rich, solid, and bright colors — even on dark fabrics.</p>
                    <p><strong>Example:</strong> Dark T-shirts, hoodies, or tote bags.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Special Finishes */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">Special Finishes</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p className="mb-2">Screen printing allows special inks:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Metallic ink (gold/silver shine)</li>
                      <li>Puff ink (3D raised texture)</li>
                      <li>Glow-in-the-dark ink</li>
                      <li>High-density or gel inks</li>
                    </ul>
                    <p className="mt-2">Great for creative and textured designs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Table within Screen Printing Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F2F2F] mb-4">
                Best Fabrics for Screen Printing
              </h3>
            </div>
            
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C1A782]/20">
              {/* Mobile: Card layout (no horizontal scroll) */}
              <div className="md:hidden space-y-4">
                {/* Row 1 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">100% Cotton</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Plastisol / Water-Based</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Bright colors, durable, soft</div>
                </div>

                {/* Row 2 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Cotton-Poly Blends</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Low-Bleed Plastisol</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Stable print, reduced dye</div>
                </div>

                {/* Row 3 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Polyester</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Low-Cure / Sublimation Ink</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Good for sportswear</div>
                </div>

                {/* Row 4 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Canvas / Linen</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Water-Based / Discharge</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Strong coverage, artistic texture</div>
                </div>

                {/* Row 5 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Fleece / Terry Cotton</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Plastisol / Puff Ink</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Good adhesion, raised texture</div>
                </div>
              </div>

              {/* Desktop: Table layout (unchanged) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#C1A782]/40">
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Fabric Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Best Ink Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A782]/20">
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">100% Cotton</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Plastisol / Water-Based</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Bright colors, durable, soft</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Cotton-Poly Blends</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Low-Bleed Plastisol</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Stable print, reduced dye</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Polyester</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Low-Cure / Sublimation Ink</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Good for sportswear</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Canvas / Linen</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Water-Based / Discharge</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Strong coverage, artistic texture</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Fleece / Terry Cotton</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Plastisol / Puff Ink</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Good adhesion, raised texture</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIGITAL PRINTING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-6">
              DIGITAL PRINTING
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto">
              Digital printing is perfect when you want high-quality, detailed, and fast output without the setup cost of screens or plates.
            </p>
          </div>

          {/* Desktop: First 3 Cards Left, Image Right */}
          <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
            {/* First 3 Cards on the left */}
            <div className="order-1">
              <div className="space-y-4">
                {/* Card 1: Short Runs or One-Offs */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Need Short Runs or One-Off Designs</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p><strong>Why:</strong> No setup cost (unlike screen printing which needs screens for each color).</p>
                        <p><strong>Example:</strong> Custom T-shirts, limited edition collections, samples, or personalized prints.</p>
                        <p><strong>Ideal For:</strong> Small brands, startups, or prototype development.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Many Colors or Gradients */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When the Design Has Many Colors or Gradients</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p><strong>Why:</strong> Digital printers reproduce photo-quality images, full-color gradients, and fine details.</p>
                        <p><strong>Example:</strong> Portrait prints, photographic designs, complex patterns, or gradient logos.</p>
                        <p><strong>Best With:</strong> CMYK color designs or artwork with subtle shading.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Fast Turnaround */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Need Fast Turnaround</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p><strong>Why:</strong> No screen setup — just load the digital file and print.</p>
                        <p><strong>Example:</strong> Urgent orders, event merch, or last-minute samples.</p>
                        <p><strong>Output Speed:</strong> Ideal for on-demand or print-on-request services.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image on the right */}
            <div className="order-2">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/digital-printing.png" 
                  alt="Digital textile printing at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
          </div>

          {/* Mobile: Image first, then all cards */}
          <div className="lg:hidden mb-8">
            {/* Image */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/digital-printing.png" 
                  alt="Digital textile printing at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* All 7 Cards */}
            <div className="space-y-4">
              {/* Card 1: Short Runs or One-Offs */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Need Short Runs or One-Off Designs</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> No setup cost (unlike screen printing which needs screens for each color).</p>
                      <p><strong>Example:</strong> Custom T-shirts, limited edition collections, samples, or personalized prints.</p>
                      <p><strong>Ideal For:</strong> Small brands, startups, or prototype development.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Many Colors or Gradients */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When the Design Has Many Colors or Gradients</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> Digital printers reproduce photo-quality images, full-color gradients, and fine details.</p>
                      <p><strong>Example:</strong> Portrait prints, photographic designs, complex patterns, or gradient logos.</p>
                      <p><strong>Best With:</strong> CMYK color designs or artwork with subtle shading.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Fast Turnaround */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Need Fast Turnaround</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> No screen setup — just load the digital file and print.</p>
                      <p><strong>Example:</strong> Urgent orders, event merch, or last-minute samples.</p>
                      <p><strong>Output Speed:</strong> Ideal for on-demand or print-on-request services.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Lightweight or Delicate Fabrics */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Lightweight or Delicate Fabrics</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> Digital printing doesn&apos;t add thickness or weight to fabric like screen inks.</p>
                      <p><strong>Example:</strong> Silk, chiffon, georgette, lightweight cotton, or polyester blends.</p>
                      <p><strong>Benefit:</strong> Keeps soft hand feel and flexibility.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Customization / Variable Data */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Customization or Variable Data Printing</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> Each print can be different (names, sizes, or serial numbers).</p>
                      <p><strong>Example:</strong> Personalized T-shirts, custom sports jerseys, promotional gifts.</p>
                      <p><strong>Unique Advantage:</strong> No need for separate setups for each variation.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: Eco-Friendly, Low-Waste */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">6</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Eco-Friendly, Low-Waste Production</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> Uses less water, no screens, and minimal ink waste.</p>
                      <p><strong>Example:</strong> Sustainable fashion brands or eco-conscious production lines.</p>
                      <p><strong>Bonus:</strong> Most modern digital textile printers use water-based inks.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 7: Synthetic Fabrics (Polyester) */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">7</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When Working with Synthetic Fabrics (Polyester)</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p><strong>Why:</strong> Sublimation printing, a digital method, is ideal for polyester.</p>
                      <p><strong>Result:</strong> Colors are vibrant, long-lasting, and fully embedded into the fabric.</p>
                      <p><strong>Example:</strong> Sportswear, leggings, swimwear, home textiles.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Cards 4 to 7 Below Both Columns */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 4: Lightweight or Delicate Fabrics */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Lightweight or Delicate Fabrics</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p><strong>Why:</strong> Digital printing doesn’t add thickness or weight to fabric like screen inks.</p>
                    <p><strong>Example:</strong> Silk, chiffon, georgette, lightweight cotton, or polyester blends.</p>
                    <p><strong>Benefit:</strong> Keeps soft hand feel and flexibility.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Customization / Variable Data */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Customization or Variable Data Printing</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p><strong>Why:</strong> Each print can be different (names, sizes, or serial numbers).</p>
                    <p><strong>Example:</strong> Personalized T-shirts, custom sports jerseys, promotional gifts.</p>
                    <p><strong>Unique Advantage:</strong> No need for separate setups for each variation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6: Eco-Friendly, Low-Waste */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">6</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Eco-Friendly, Low-Waste Production</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p><strong>Why:</strong> Uses less water, no screens, and minimal ink waste.</p>
                    <p><strong>Example:</strong> Sustainable fashion brands or eco-conscious production lines.</p>
                    <p><strong>Bonus:</strong> Most modern digital textile printers use water-based inks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 7: Synthetic Fabrics (Polyester) */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">7</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When Working with Synthetic Fabrics (Polyester)</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p><strong>Why:</strong> Sublimation printing, a digital method, is ideal for polyester.</p>
                    <p><strong>Result:</strong> Colors are vibrant, long-lasting, and fully embedded into the fabric.</p>
                    <p><strong>Example:</strong> Sportswear, leggings, swimwear, home textiles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Table within Digital Printing Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F2F2F] mb-4">
                Best Fabrics for Digital Printing
              </h3>
            </div>

            <div className="bg-[#F5F2E8] rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C1A782]/20">
              {/* Mobile: Card layout (no horizontal scroll) */}
              <div className="md:hidden space-y-4">
                {/* Row 1 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Cotton / Linen</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Digital Method</div>
                  <div className="text-[#2F2F2F]">Reactive Inkjet</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Soft feel, good color fastness</div>
                </div>

                {/* Row 2 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Polyester</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Digital Method</div>
                  <div className="text-[#2F2F2F]">Sublimation Printing</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Bright, durable, no texture</div>
                </div>

                {/* Row 3 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Silk</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Digital Method</div>
                  <div className="text-[#2F2F2F]">Acid Inkjet / Reactive</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Fine detailing, luxury finish</div>
                </div>

                {/* Row 4 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Viscose / Rayon</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Digital Method</div>
                  <div className="text-[#2F2F2F]">Reactive</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Smooth print, vivid color</div>
                </div>

                {/* Row 5 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Blends (Poly-Cotton)</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Digital Method</div>
                  <div className="text-[#2F2F2F]">Pigment or Sublimation</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Balance of color and softness</div>
                </div>
              </div>

              {/* Desktop: Table layout (unchanged) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#C1A782]/40">
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Fabric Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Digital Method</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A782]/20">
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Cotton / Linen</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Reactive Inkjet</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Soft feel, good color fastness</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Polyester</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Sublimation Printing</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Bright, durable, no texture</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Silk</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Acid Inkjet / Reactive</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Fine detailing, luxury finish</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Viscose / Rayon</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Reactive</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Smooth print, vivid color</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Blends (Poly-Cotton)</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Pigment or Sublimation</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Balance of color and softness</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEAT TRANSFER PRINTING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F5F2E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-6">
              Heat Transfer Printing
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto">
              Heat transfer printing is a fast and flexible method where your design is first printed on special transfer paper and then heat-pressed onto fabric. It&apos;s one of the most popular printing choices for custom apparel and promotional wear.
            </p>
          </div>

          {/* Desktop: Image Left, First 3 Cards Right Layout */}
          <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
            {/* Image on the left */}
            <div className="order-1">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/heat-transfer-printing.png" 
                  alt="Heat transfer printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
            
            {/* First 3 Cards on the right */}
            <div className="order-2">
              <div className="space-y-4">
                {/* Card 1: Small Quantities or Custom Orders */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Small Quantities or Custom Orders</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>If you need a few pieces — not hundreds — heat transfer printing is ideal.</p>
                        <p><strong>No screens, no setup cost, and quick production.</strong></p>
                        <p><strong>Perfect for:</strong> personalized T-shirts, limited-edition merch, or event wear.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Photo-Quality Prints */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Need Photo-Quality Prints</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>This technique captures high-resolution, full-color designs with gradients and fine details.</p>
                        <p><strong>Perfect for:</strong> photographic prints, logos with shading, or complex designs.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: On-Demand or Fast Production */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For On-Demand or Fast Production</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>It&apos;s quick! You can print and press the same day.</p>
                        <p><strong>Great for:</strong> custom orders, urgent deliveries, or sample production.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Image first, then all cards */}
          <div className="lg:hidden mb-8">
            {/* Image */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/heat-transfer-printing.png" 
                  alt="Heat transfer printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* All 5 Cards */}
            <div className="space-y-4">
              {/* Card 1: Small Quantities or Custom Orders */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Small Quantities or Custom Orders</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>If you need a few pieces — not hundreds — heat transfer printing is ideal.</p>
                      <p><strong>No screens, no setup cost, and quick production.</strong></p>
                      <p><strong>Perfect for:</strong> personalized T-shirts, limited-edition merch, or event wear.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Photo-Quality Prints */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Need Photo-Quality Prints</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>This technique captures high-resolution, full-color designs with gradients and fine details.</p>
                      <p><strong>Perfect for:</strong> photographic prints, logos with shading, or complex designs.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: On-Demand or Fast Production */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For On-Demand or Fast Production</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>It&apos;s quick! You can print and press the same day.</p>
                      <p><strong>Great for:</strong> custom orders, urgent deliveries, or sample production.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Synthetic and Blended Fabrics */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Synthetic and Blended Fabrics</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Works well on polyester, cotton blends, and spandex fabrics, where traditional inks may not stick well.</p>
                      <p><strong>Popular in:</strong> sportswear, jerseys, and performance apparel.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Multi-Color or Gradient Designs */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Multi-Color or Gradient Designs</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Unlike screen printing, you don&apos;t need multiple screens for each color — you can print as many colors as you like in one go.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Cards 4 and 5 Below Both Columns */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 4: Synthetic and Blended Fabrics */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Synthetic and Blended Fabrics</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Works well on polyester, cotton blends, and spandex fabrics, where traditional inks may not stick well.</p>
                    <p><strong>Popular in:</strong> sportswear, jerseys, and performance apparel.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Multi-Color or Gradient Designs */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Multi-Color or Gradient Designs</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Unlike screen printing, you don&apos;t need multiple screens for each color — you can print as many colors as you like in one go.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Use Cases Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F2F2F] mb-4">
                Best Use Cases
              </h3>
            </div>
            
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C1A782]/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-[#F5F2E8] rounded-xl p-4 h-full">
                    <h4 className="font-semibold text-[#2F2F2F] mb-2">Sportswear & Jerseys</h4>
                    <p className="text-sm text-[#6B6B6B]">Performance apparel with vibrant designs</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-[#F5F2E8] rounded-xl p-4 h-full">
                    <h4 className="font-semibold text-[#2F2F2F] mb-2">Custom T-shirts</h4>
                    <p className="text-sm text-[#6B6B6B]">Personalized designs for any occasion</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-[#F5F2E8] rounded-xl p-4 h-full">
                    <h4 className="font-semibold text-[#2F2F2F] mb-2">Event Merchandise</h4>
                    <p className="text-sm text-[#6B6B6B]">Quick turnaround for special events</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-[#F5F2E8] rounded-xl p-4 h-full">
                    <h4 className="font-semibold text-[#2F2F2F] mb-2">Promotional Apparel</h4>
                    <p className="text-sm text-[#6B6B6B]">Branded items for marketing campaigns</p>
                  </div>
                </div>
                <div className="text-center sm:col-span-2 lg:col-span-4">
                  <div className="bg-[#F5F2E8] rounded-xl p-4">
                    <h4 className="font-semibold text-[#2F2F2F] mb-2">Personalized Gifts</h4>
                    <p className="text-sm text-[#6B6B6B]">Unique, one-of-a-kind custom items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Table within Heat Transfer Printing Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F2F2F] mb-4">
                Best Fabrics for Heat Transfer Printing
              </h3>
            </div>
            
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C1A782]/20">
              {/* Mobile: Card layout (no horizontal scroll) */}
              <div className="md:hidden space-y-4">
                {/* Row 1 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">100% Cotton</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Transfer Material</div>
                  <div className="text-[#2F2F2F]">Heat Transfer Vinyl (HTV) / Inkjet</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Soft feel, vivid colors, durable</div>
                </div>

                {/* Row 2 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Polyester</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Transfer Material</div>
                  <div className="text-[#2F2F2F]">Sublimation Paper / HTV (Low Temp)</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Bright prints, ideal for sportswear</div>
                </div>

                {/* Row 3 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Cotton-Poly Blends</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Transfer Material</div>
                  <div className="text-[#2F2F2F]">Heat Transfer Vinyl (Hybrid Film)</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Balanced softness, minimal shrinkage</div>
                </div>

                {/* Row 4 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Spandex / Lycra</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Transfer Material</div>
                  <div className="text-[#2F2F2F]">Stretchable HTV (Elastic Vinyl)</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Flexible, resists cracking</div>
                </div>

                {/* Row 5 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Coated Nylon</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Transfer Material</div>
                  <div className="text-[#2F2F2F]">Nylon-Specific HTV / Transfer</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Strong adhesion, water-resistant</div>
                </div>
              </div>

              {/* Desktop: Table layout (unchanged) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#C1A782]/40">
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Fabric Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Best Transfer Material</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A782]/20">
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">100% Cotton</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Heat Transfer Vinyl (HTV) / Inkjet</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Soft feel, vivid colors, durable</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Polyester</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Sublimation Paper / HTV (Low Temp)</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Bright prints, ideal for sportswear</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Cotton-Poly Blends</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Heat Transfer Vinyl (Hybrid Film)</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Balanced softness, minimal shrinkage</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Spandex / Lycra</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Stretchable HTV (Elastic Vinyl)</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Flexible, resists cracking</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Coated Nylon</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Nylon-Specific HTV / Transfer</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Strong adhesion, water-resistant</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK PRINTING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-6">
              Block Printing
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto">
              Block printing is one of the oldest and most artistic textile printing techniques — a handcrafted process where carved wooden blocks are dipped in dye and stamped onto fabric. Each print is slightly unique, giving it a natural, handmade charm that machines can&apos;t replicate.
            </p>
          </div>

          {/* Desktop: First 2 Cards Left, Image Right */}
          <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
            {/* First 2 Cards on the left */}
            <div className="order-1">
              <div className="space-y-4">
                {/* Card 1: Handcrafted, Artistic Look */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want a Handcrafted, Artistic Look</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>If your goal is to create fabric with traditional, handmade, or artisanal aesthetics, block printing is perfect.</p>
                        <p>Every piece carries the human touch — with slight variations that make it feel alive and authentic.</p>
                        <p><strong>Best For:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Ethnic wear (kurtas, sarees, dupattas)</li>
                          <li>Home décor (curtains, table linens, cushion covers)</li>
                          <li>Boutique or luxury collections</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Limited or Custom Collections */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Limited or Custom Collections</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>Block printing is done manually, so it&apos;s ideal for small batches or limited editions — not mass production.</p>
                        <p><strong>Perfect For:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Designer collections</li>
                          <li>Custom projects</li>
                          <li>Art-based or sustainable fashion brands</li>
                        </ul>
                        <p>It&apos;s a great way to offer exclusivity and craftsmanship to your clients.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image on the right */}
            <div className="order-2">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/block-printing.png" 
                  alt="Block printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
          </div>

          {/* Mobile: Image first, then all cards */}
          <div className="lg:hidden mb-8">
            {/* Image */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/block-printing.png" 
                  alt="Block printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* All 5 Cards */}
            <div className="space-y-4">
              {/* Card 1: Handcrafted, Artistic Look */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want a Handcrafted, Artistic Look</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>If your goal is to create fabric with traditional, handmade, or artisanal aesthetics, block printing is perfect.</p>
                      <p>Every piece carries the human touch — with slight variations that make it feel alive and authentic.</p>
                      <p><strong>Best For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Ethnic wear (kurtas, sarees, dupattas)</li>
                        <li>Home décor (curtains, table linens, cushion covers)</li>
                        <li>Boutique or luxury collections</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Limited or Custom Collections */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Limited or Custom Collections</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Block printing is done manually, so it&apos;s ideal for small batches or limited editions — not mass production.</p>
                      <p><strong>Perfect For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Designer collections</li>
                        <li>Custom projects</li>
                        <li>Art-based or sustainable fashion brands</li>
                      </ul>
                      <p>It&apos;s a great way to offer exclusivity and craftsmanship to your clients.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Natural Dyes and Sustainable Printing */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Natural Dyes and Sustainable Printing</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Block printing often uses eco-friendly vegetable dyes and traditional color recipes.</p>
                      <p>If your brand promotes sustainability, this method aligns beautifully with your values.</p>
                      <p><strong>Benefits:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Low energy consumption</li>
                        <li>Natural color variations</li>
                        <li>Environmentally conscious production</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Texture and Imperfection Are Part of the Design */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When Texture and Imperfection Are Part of the Design</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Unlike digital or screen printing, block printing doesn&apos;t aim for perfection — its slight irregularities are its beauty.</p>
                      <p>Designs gain depth, texture, and character that feel organic and handmade.</p>
                      <p><strong>Use It For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Rustic, bohemian, or artisanal fabric lines</li>
                        <li>Home textile collections with natural themes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Working with Natural Fabrics */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When Working with Natural Fabrics</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Block printing works best on natural fibers that absorb dye well.</p>
                      <p><strong>Ideal fabrics:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Cotton</li>
                        <li>Linen</li>
                        <li>Silk</li>
                        <li>Khadi</li>
                      </ul>
                      <p>Synthetic fabrics are not suitable because the color doesn&apos;t bond well.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Cards 3, 4, and 5 Below Both Columns */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 3: Natural Dyes and Sustainable Printing */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Natural Dyes and Sustainable Printing</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Block printing often uses eco-friendly vegetable dyes and traditional color recipes.</p>
                    <p>If your brand promotes sustainability, this method aligns beautifully with your values.</p>
                    <p><strong>Benefits:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Low energy consumption</li>
                      <li>Natural color variations</li>
                      <li>Environmentally conscious production</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Texture and Imperfection Are Part of the Design */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When Texture and Imperfection Are Part of the Design</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Unlike digital or screen printing, block printing doesn&apos;t aim for perfection — its slight irregularities are its beauty.</p>
                    <p>Designs gain depth, texture, and character that feel organic and handmade.</p>
                    <p><strong>Use It For:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Rustic, bohemian, or artisanal fabric lines</li>
                      <li>Home textile collections with natural themes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Working with Natural Fabrics */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When Working with Natural Fabrics</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Block printing works best on natural fibers that absorb dye well.</p>
                    <p><strong>Ideal fabrics:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Cotton</li>
                      <li>Linen</li>
                      <li>Silk</li>
                      <li>Khadi</li>
                    </ul>
                    <p>Synthetic fabrics are not suitable because the color doesn&apos;t bond well.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Table within Block Printing Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F2F2F] mb-4">
                Best Fabrics for Block Printing
              </h3>
            </div>
            
            <div className="bg-[#F5F2E8] rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C1A782]/20">
              {/* Mobile: Card layout (no horizontal scroll) */}
              <div className="md:hidden space-y-4">
                {/* Row 1 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">100% Cotton</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Color Type</div>
                  <div className="text-[#2F2F2F]">Natural / Reactive Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Excellent absorption, crisp</div>
                </div>

                {/* Row 2 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Linen</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Color Type</div>
                  <div className="text-[#2F2F2F]">Pigment / Vegetable Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Textured finish, rustic handmade</div>
                </div>

                {/* Row 3 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Silk</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Color Type</div>
                  <div className="text-[#2F2F2F]">Acid / Natural Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Smooth surface, elegant</div>
                </div>

                {/* Row 4 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Khadi</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Color Type</div>
                  <div className="text-[#2F2F2F]">Vegetable / Natural Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Traditional, eco-friendly, organic</div>
                </div>

                {/* Row 5 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Rayon / Viscose</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Color Type</div>
                  <div className="text-[#2F2F2F]">Reactive Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Smooth printing surface, bright</div>
                </div>
              </div>

              {/* Desktop: Table layout (unchanged) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#C1A782]/40">
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Fabric Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Best Dye / Color Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A782]/20">
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">100% Cotton</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Natural / Reactive Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Excellent absorption, crisp</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Linen</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Pigment / Vegetable Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Textured finish, rustic handmade</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Silk</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Acid / Natural Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Smooth surface, elegant</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Khadi</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Vegetable / Natural Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Traditional, eco-friendly, organic</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Rayon / Viscose</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Reactive Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Smooth printing surface, bright</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROTARY PRINTING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F5F2E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-6">
              Rotary Printing
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto">
              Rotary printing combines speed and precision, making it a modern choice for large-scale fabric production. Using engraved cylindrical screens, it creates continuous patterns that flow seamlessly across long fabric rolls. The result is vibrant, durable, and perfectly aligned prints that bring together efficiency and artistry, ideal for producing high-quality textiles in large volumes.
            </p>
          </div>

          {/* Desktop: Image Left, First 2 Cards Right Layout */}
          <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
            {/* Image on the left */}
            <div className="order-1">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/rotary-printing.png" 
                  alt="Rotary printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
            
            {/* First 2 Cards on the right */}
            <div className="order-2">
              <div className="space-y-4">
                {/* Card 1: Bulk Fabric Production */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Bulk Fabric Production</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>If your goal is high-volume printing, rotary is unbeatable.</p>
                        <p>Once the screens are made, it can print thousands of meters per hour with consistent quality.</p>
                        <p><strong>Best For:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Export fabric production</li>
                          <li>Bedsheets, curtains, upholstery</li>
                          <li>Fashion fabric rolls for mass garment making</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Continuous or Repetitive Designs */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Continuous or Repetitive Designs</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>Rotary printing uses cylindrical screens that roll continuously, making it ideal for repeating patterns.</p>
                        <p><strong>Perfect For:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Florals, stripes, polka dots, geometric prints</li>
                          <li>All-over prints on fabric rolls</li>
                        </ul>
                        <p><strong>Result:</strong> Seamless, edge-to-edge designs with precision.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Image first, then all cards */}
          <div className="lg:hidden mb-8">
            {/* Image */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/rotary-printing.png" 
                  alt="Rotary printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* All 5 Cards */}
            <div className="space-y-4">
              {/* Card 1: Bulk Fabric Production */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Bulk Fabric Production</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>If your goal is high-volume printing, rotary is unbeatable.</p>
                      <p>Once the screens are made, it can print thousands of meters per hour with consistent quality.</p>
                      <p><strong>Best For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Export fabric production</li>
                        <li>Bedsheets, curtains, upholstery</li>
                        <li>Fashion fabric rolls for mass garment making</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Continuous or Repetitive Designs */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Continuous or Repetitive Designs</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Rotary printing uses cylindrical screens that roll continuously, making it ideal for repeating patterns.</p>
                      <p><strong>Perfect For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Florals, stripes, polka dots, geometric prints</li>
                        <li>All-over prints on fabric rolls</li>
                      </ul>
                      <p><strong>Result:</strong> Seamless, edge-to-edge designs with precision.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Cost Efficiency in Large Runs */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Cost Efficiency in Large Runs</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Although setup (screen engraving) is expensive, the cost per meter drops drastically with higher quantities.</p>
                      <p><strong>So choose rotary printing when:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>You&apos;re producing over 500–1000 meters of fabric.</li>
                        <li>You want consistent output at a lower per-unit cost.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Vibrant and Durable Prints */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Vibrant and Durable Prints</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Rotary printing allows multiple colors (usually 8–12 per design) and uses strong textile inks for wash durability and color brightness.</p>
                      <p><strong>Best For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Fashion fabrics</li>
                        <li>Home furnishings</li>
                        <li>Long-lasting commercial textiles</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: High Speed with Consistency */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Need High Speed with Consistency</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Unlike manual methods, rotary ensures exact color registration and high production speed without variation.</p>
                      <p><strong>Ideal For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Export houses</li>
                        <li>Textile mills</li>
                        <li>High-demand seasonal prints</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Cards 3, 4, and 5 Below Both Columns */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 3: Cost Efficiency in Large Runs */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Cost Efficiency in Large Runs</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Although setup (screen engraving) is expensive, the cost per meter drops drastically with higher quantities.</p>
                    <p><strong>So choose rotary printing when:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>You&apos;re producing over 500–1000 meters of fabric.</li>
                      <li>You want consistent output at a lower per-unit cost.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Vibrant and Durable Prints */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Vibrant and Durable Prints</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Rotary printing allows multiple colors (usually 8–12 per design) and uses strong textile inks for wash durability and color brightness.</p>
                    <p><strong>Best For:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Fashion fabrics</li>
                      <li>Home furnishings</li>
                      <li>Long-lasting commercial textiles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: High Speed with Consistency */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Need High Speed with Consistency</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Unlike manual methods, rotary ensures exact color registration and high production speed without variation.</p>
                    <p><strong>Ideal For:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Export houses</li>
                      <li>Textile mills</li>
                      <li>High-demand seasonal prints</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Table within Rotary Printing Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F2F2F] mb-4">
                Best Fabrics for Rotary Printing
              </h3>
            </div>
            
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C1A782]/20">
              {/* Mobile: Card layout (no horizontal scroll) */}
              <div className="md:hidden space-y-4">
                {/* Row 1 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">100% Cotton</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Ink Type</div>
                  <div className="text-[#2F2F2F]">Reactive / Pigment Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Excellent color depth, smooth</div>
                </div>

                {/* Row 2 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Polyester</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Ink Type</div>
                  <div className="text-[#2F2F2F]">Disperse / Sublimation Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Bright, durable prints for sportswear</div>
                </div>

                {/* Row 3 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Cotton-Poly Blends</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Ink Type</div>
                  <div className="text-[#2F2F2F]">Pigment / Disperse Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Stable, low-shrinkage prints</div>
                </div>

                {/* Row 4 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Viscose / Rayon</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Ink Type</div>
                  <div className="text-[#2F2F2F]">Reactive Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Soft hand feel, vibrant shades</div>
                </div>

                {/* Row 5 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Linen</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye / Ink Type</div>
                  <div className="text-[#2F2F2F]">Pigment / Reactive Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Textured, artistic look with strong color</div>
                </div>
              </div>

              {/* Desktop: Table layout (unchanged) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#C1A782]/40">
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Fabric Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Best Dye / Ink Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A782]/20">
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">100% Cotton</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Reactive / Pigment Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Excellent color depth, smooth</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Polyester</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Disperse / Sublimation Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Bright, durable prints for sportswear</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Cotton-Poly Blends</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Pigment / Disperse Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Stable, low-shrinkage prints</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Viscose / Rayon</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Reactive Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Soft hand feel, vibrant shades</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Linen</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Pigment / Reactive Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Textured, artistic look with strong color</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PUFF PRINTING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-6">
              Puff Printing
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto">
              Puff printing is a special screen-printing technique that uses a heat-reactive additive mixed with ink. When the printed fabric is heated, the ink expands and rises, creating a 3D, textured look that stands out from the surface. It&apos;s a favorite for fashion brands, streetwear, and creative designers who want dimension and style in their prints.
            </p>
          </div>

          {/* Desktop: First 2 Cards Left, Image Right */}
          <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
            {/* First 2 Cards on the left */}
            <div className="order-1">
              <div className="space-y-4">
                {/* Card 1: 3D or Raised Effect */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want a 3D or Raised Effect</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>If your design needs to pop — literally — puff printing is ideal.</p>
                        <p>The raised ink adds a soft, foam-like texture that&apos;s visually striking and tactile.</p>
                        <p><strong>Perfect For:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Logos and brand names</li>
                          <li>Graphic designs on hoodies or sweatshirts</li>
                          <li>Kidswear and fashion-forward apparel</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Simple, Bold Designs */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Simple, Bold Designs</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>Puff ink works best on thick, solid shapes or typography, not on fine or detailed artwork.</p>
                        <p>If your design has clear outlines or bold text, puff printing will make it stand out beautifully.</p>
                        <p><strong>Example:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Streetwear logos</li>
                          <li>Bold slogans</li>
                          <li>Minimalistic graphics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image on the right */}
            <div className="order-2">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/puff-printing.png" 
                  alt="Puff printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
          </div>

          {/* Mobile: Image first, then all cards */}
          <div className="lg:hidden mb-8">
            {/* Image */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/puff-printing.png" 
                  alt="Puff printing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* All 5 Cards */}
            <div className="space-y-4">
              {/* Card 1: 3D or Raised Effect */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want a 3D or Raised Effect</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>If your design needs to pop — literally — puff printing is ideal.</p>
                      <p>The raised ink adds a soft, foam-like texture that&apos;s visually striking and tactile.</p>
                      <p><strong>Perfect For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Logos and brand names</li>
                        <li>Graphic designs on hoodies or sweatshirts</li>
                        <li>Kidswear and fashion-forward apparel</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Simple, Bold Designs */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">For Simple, Bold Designs</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Puff ink works best on thick, solid shapes or typography, not on fine or detailed artwork.</p>
                      <p>If your design has clear outlines or bold text, puff printing will make it stand out beautifully.</p>
                      <p><strong>Example:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Streetwear logos</li>
                        <li>Bold slogans</li>
                        <li>Minimalistic graphics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Printing on Heavier Fabrics */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When Printing on Heavier Fabrics</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Puff printing gives the best results on medium to heavy-weight fabrics that can hold the raised ink well.</p>
                      <p><strong>Best Fabrics:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Cotton (especially sweatshirts, hoodies, and tees)</li>
                        <li>Fleece</li>
                        <li>Terry cotton</li>
                        <li>Cotton blends</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Texture & Depth in the Design */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Texture & Depth in the Design</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Puff printing adds a premium, tactile feel that elevates simple garments.</p>
                      <p>It&apos;s a great way to create dimension without embroidery or applique.</p>
                      <p><strong>Used By:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Streetwear brands</li>
                        <li>Sportswear lines</li>
                        <li>Premium casual wear collections</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Durable, Stylish Finish */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want a Durable, Stylish Finish</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Once cured properly, puff prints are wash-resistant and flexible, maintaining their raised texture over time.</p>
                      <p><strong>Pro Tip:</strong> Use high-quality puff additives and controlled heat curing to ensure consistent puff height and softness.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Cards 3, 4, and 5 Below Both Columns */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 3: Printing on Heavier Fabrics */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When Printing on Heavier Fabrics</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Puff printing gives the best results on medium to heavy-weight fabrics that can hold the raised ink well.</p>
                    <p><strong>Best Fabrics:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Cotton (especially sweatshirts, hoodies, and tees)</li>
                      <li>Fleece</li>
                      <li>Terry cotton</li>
                      <li>Cotton blends</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Texture & Depth in the Design */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Texture & Depth in the Design</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Puff printing adds a premium, tactile feel that elevates simple garments.</p>
                    <p>It&apos;s a great way to create dimension without embroidery or applique.</p>
                    <p><strong>Used By:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Streetwear brands</li>
                      <li>Sportswear lines</li>
                      <li>Premium casual wear collections</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Durable, Stylish Finish */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want a Durable, Stylish Finish</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Once cured properly, puff prints are wash-resistant and flexible, maintaining their raised texture over time.</p>
                    <p><strong>Pro Tip:</strong> Use high-quality puff additives and controlled heat curing to ensure consistent puff height and softness.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Table within Puff Printing Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F2F2F] mb-4">
                Best Fabrics for Puff Printing
              </h3>
            </div>
            
            <div className="bg-[#F5F2E8] rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C1A782]/20">
              {/* Mobile: Card layout (no horizontal scroll) */}
              <div className="md:hidden space-y-4">
                {/* Row 1 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">100% Cotton</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Puff Additive with Plastisol Ink</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Strong puff effect, soft texture</div>
                </div>

                {/* Row 2 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Cotton-Poly Blends</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Low-Bleed Puff Plastisol</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Stable print, reduced dye migration</div>
                </div>

                {/* Row 3 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Fleece</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Puff Plastisol / Water-Based Puff</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Raised, soft 3D finish, perfect for hoodies</div>
                </div>

                {/* Row 4 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Terry Cotton</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Puff Plastisol Ink</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Thick texture, ideal for towels and robes</div>
                </div>

                {/* Row 5 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Canvas / Heavy Jersey</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Ink Type</div>
                  <div className="text-[#2F2F2F]">Puff Additive Ink</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Bold raised effect, excellent adhesion</div>
                </div>
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#C1A782]/40">
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Fabric Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Best Ink Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A782]/20">
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">100% Cotton</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Puff Additive with Plastisol Ink</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Strong puff effect, soft texture</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Cotton-Poly Blends</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Low-Bleed Puff Plastisol</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Stable print, reduced dye migration</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Fleece</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Puff Plastisol / Water-Based Puff</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Raised, soft 3D finish, perfect for hoodies</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Terry Cotton</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Puff Plastisol Ink</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Thick texture, ideal for towels and robes</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Canvas / Heavy Jersey</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Puff Additive Ink</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Bold raised effect, excellent adhesion</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESIST DYEING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F5F2E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Centered Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-6">
              Resist Dyeing
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto">
              Resist dyeing is a traditional and artistic technique where parts of the fabric are protected (or &ldquo;resisted&rdquo;) from dye using materials like wax, thread, or clamps — so only the exposed areas absorb color.
            </p>
          </div>

          {/* Desktop: Image Left, First 2 Cards Right Layout */}
          <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
            {/* Image on the left */}
            <div className="order-1">
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/resist-dyeing.png" 
                  alt="Resist dyeing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
            
            {/* First 2 Cards on the right */}
            <div className="order-2">
              <div className="space-y-4">
                {/* Card 1: Unique, Handmade Patterns */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Unique, Handmade Patterns</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>Resist dyeing is ideal when your goal is to create exclusive, handcrafted designs rather than machine-perfect prints.</p>
                        <p>Each fabric comes out slightly different, giving it authentic character and individuality.</p>
                        <p><strong>Perfect For:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Artisanal or boutique collections</li>
                          <li>Boho and ethnic fashion lines</li>
                          <li>Home décor textiles like scarves, curtains, and cushion covers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Using Natural Fabrics */}
                <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You&apos;re Using Natural Fabrics</h3>
                      <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                        <p>This technique works best on absorbent, natural fibers that hold dye beautifully.</p>
                        <p><strong>Best fabrics:</strong></p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Cotton</li>
                          <li>Silk</li>
                          <li>Linen</li>
                          <li>Viscose</li>
                          <li>Khadi</li>
                        </ul>
                        <p>Synthetic fabrics don&apos;t absorb the dye well, so stick to natural ones for richer results.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Image first, then all cards */}
          <div className="lg:hidden mb-8">
            {/* Image */}
            <div className="mb-8">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <Image 
                  src="/services/prints/resist-dyeing.png" 
                  alt="Resist dyeing process at Krazy Kreators" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* All 5 Cards */}
            <div className="space-y-4">
              {/* Card 1: Unique, Handmade Patterns */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Unique, Handmade Patterns</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Resist dyeing is ideal when your goal is to create exclusive, handcrafted designs rather than machine-perfect prints.</p>
                      <p>Each fabric comes out slightly different, giving it authentic character and individuality.</p>
                      <p><strong>Perfect For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Artisanal or boutique collections</li>
                        <li>Boho and ethnic fashion lines</li>
                        <li>Home décor textiles like scarves, curtains, and cushion covers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Using Natural Fabrics */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You&apos;re Using Natural Fabrics</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>This technique works best on absorbent, natural fibers that hold dye beautifully.</p>
                      <p><strong>Best fabrics:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Cotton</li>
                        <li>Silk</li>
                        <li>Linen</li>
                        <li>Viscose</li>
                        <li>Khadi</li>
                      </ul>
                      <p>Synthetic fabrics don&apos;t absorb the dye well, so stick to natural ones for richer results.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Natural, Organic Color Transitions */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Natural, Organic Color Transitions</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Resist dyeing creates soft, uneven color flows and beautiful imperfections that give the fabric a handcrafted look.</p>
                      <p>Unlike digital or screen printing, it celebrates texture and spontaneity.</p>
                      <p><strong>Perfect For:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Traditional patterns like tie-dye, batik, or shibori</li>
                        <li>Earthy, artistic collections</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Eco-Friendly and Sustainable Production */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Eco-Friendly and Sustainable Production</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Because resist dyeing often uses natural dyes and manual processes, it&apos;s a sustainable alternative to chemical-heavy methods.</p>
                      <p>It&apos;s perfect for eco-conscious brands that value tradition and craftsmanship.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Combine Art & Fashion */}
              <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want to Combine Art & Fashion</h3>
                    <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                      <p>Resist dyeing is not just printing — it&apos;s wearable art.</p>
                      <p>It&apos;s ideal for designers who want to express creativity through patterns made by folding, tying, stitching, or waxing.</p>
                      <p><strong>Popular Methods:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li><strong>Tie-Dye:</strong> Tied sections resist color, creating circular or spiral patterns.</li>
                        <li><strong>Batik:</strong> Wax is used to block dye for intricate motifs.</li>
                        <li><strong>Shibori:</strong> Fabric is folded, twisted, or stitched before dyeing for natural patterns.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Cards 3, 4, and 5 Below Both Columns */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 3: Natural, Organic Color Transitions */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Natural, Organic Color Transitions</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Resist dyeing creates soft, uneven color flows and beautiful imperfections that give the fabric a handcrafted look.</p>
                    <p>Unlike digital or screen printing, it celebrates texture and spontaneity.</p>
                    <p><strong>Perfect For:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Traditional patterns like tie-dye, batik, or shibori</li>
                      <li>Earthy, artistic collections</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Eco-Friendly and Sustainable Production */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want Eco-Friendly and Sustainable Production</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Because resist dyeing often uses natural dyes and manual processes, it&apos;s a sustainable alternative to chemical-heavy methods.</p>
                    <p>It&apos;s perfect for eco-conscious brands that value tradition and craftsmanship.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Combine Art & Fashion */}
            <div className="border-2 border-[#C1A782]/40 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#C1A782] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#2F2F2F] mb-3 font-serif">When You Want to Combine Art & Fashion</h3>
                  <div className="text-sm text-[#2F2F2F] leading-relaxed space-y-2">
                    <p>Resist dyeing is not just printing — it&apos;s wearable art.</p>
                    <p>It&apos;s ideal for designers who want to express creativity through patterns made by folding, tying, stitching, or waxing.</p>
                    <p><strong>Popular Methods:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><strong>Tie-Dye:</strong> Tied sections resist color, creating circular or spiral patterns.</li>
                      <li><strong>Batik:</strong> Wax is used to block dye for intricate motifs.</li>
                      <li><strong>Shibori:</strong> Fabric is folded, twisted, or stitched before dyeing for natural patterns.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Table within Resist Dyeing Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F2F2F] mb-4">
                Best Fabrics for Resist Dyeing
              </h3>
            </div>
            
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#C1A782]/20">
              {/* Mobile: Card layout (no horizontal scroll) */}
              <div className="md:hidden space-y-4">
                {/* Row 1 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">100% Cotton</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye Type</div>
                  <div className="text-[#2F2F2F]">Natural / Reactive Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Excellent absorption, vibrant colors</div>
                </div>

                {/* Row 2 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Silk</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye Type</div>
                  <div className="text-[#2F2F2F]">Acid Dyes / Natural Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Luxurious finish, rich color depth</div>
                </div>

                {/* Row 3 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Linen</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye Type</div>
                  <div className="text-[#2F2F2F]">Natural / Fiber Reactive Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Textured surface, earthy tones</div>
                </div>

                {/* Row 4 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Viscose / Rayon</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye Type</div>
                  <div className="text-[#2F2F2F]">Reactive Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Soft drape, excellent color absorption</div>
                </div>

                {/* Row 5 */}
                <div className="rounded-xl border border-[#C1A782]/30 p-4">
                  <div className="text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Fabric Type</div>
                  <div className="font-medium text-[#2F2F2F]">Khadi / Handloom</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Best Dye Type</div>
                  <div className="text-[#2F2F2F]">Natural / Indigo Dyes</div>
                  <div className="mt-3 text-xs font-semibold text-[#C1A782] uppercase tracking-wide">Features</div>
                  <div className="text-[#2F2F2F]">Authentic traditional look, unique texture</div>
                </div>
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#C1A782]/40">
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Fabric Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Best Dye Type</th>
                      <th className="text-left py-4 px-6 font-semibold text-[#2F2F2F] text-lg">Features</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C1A782]/20">
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">100% Cotton</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Natural / Reactive Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Excellent absorption, vibrant colors</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Silk</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Acid Dyes / Natural Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Luxurious finish, rich color depth</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Linen</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Natural / Fiber Reactive Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Textured surface, earthy tones</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Viscose / Rayon</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Reactive Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Soft drape, excellent color absorption</td>
                    </tr>
                    <tr className="hover:bg-[#F5F2E8]/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#2F2F2F]">Khadi / Handloom</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Natural / Indigo Dyes</td>
                      <td className="py-4 px-6 text-[#2F2F2F]">Authentic traditional look, unique texture</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-[#2F2F2F] mb-8 leading-relaxed">
            At Krazy Kreators, every pattern tells a story, and every print brings it to life.
          </p>
          
          <button 
            onClick={() => setContactOpen(true)}
            className="inline-flex items-center gap-2 bg-[#C1A782] hover:bg-[#B89A6F] text-white px-8 py-4 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Contact us today
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      
      <Footer />
    </main>
  );
}
