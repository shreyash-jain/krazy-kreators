"use client";

import Image from "next/image";
import { Scroll, Package, Recycle, ShoppingCart, Warehouse, BarChart, Tag, Zap, Layers, BadgeDollarSign, Leaf } from "lucide-react";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { useState } from "react";

const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

export default function Page() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="w-full bg-white">
      <section className="kk-hero-dark relative w-full bg-white min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/services/enterprise/raw-material-hero.webp"
            alt="Raw materials management and storage"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-24 sm:py-28 md:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Raw Materials Management</h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl text-white/90 font-normal max-w-3xl mx-auto">
            Centralized fabric and trims procurement, storage, and documentation — enabling full traceability, better costing, and faster repeat orders.
          </h2>
        </div>
      </section>
      
      
      
      

      
      

      {/* Smarter Inventory Section */}
      <section className="w-full bg-white py-16 sm:py-20 md:py-24">
        <div className="min-w-[80%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="max-w-[1000px] mx-auto text-center">
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-[#1E1E1E]">Smarter Inventory, Lower Costs</h2>
            <div className="mt-4 flex justify-center">
              <span className="block w-16 h-0.5 bg-[#E6D8C6] rounded-full" />
            </div>
            <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-700 leading-8 max-w-[900px] mx-auto">
              At Krazy Kreators, we know that raw materials — fabrics, trims, buttons, and packaging — often make up the biggest chunk of a garment’s cost. For startups and small brands working with lower MOQs, buying in bulk can feel impossible.
              <br className="hidden sm:block" />
              <br className="hidden sm:block" />
              That’s where our Raw Material Storage &amp; Reuse System changes the game.
              <br className="hidden sm:block" />
              <br className="hidden sm:block" />
              We plan your material purchases at bulk efficiency levels — securing mill-grade prices and quality — while producing your required quantity. The remaining stock is safely stored and tracked in our system for your future collections or repeat orders.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                  <Scroll className="w-6 h-6" />
                </div>
                <div className="mt-3 font-medium text-[#1E1E1E]">Bulk Efficiency</div>
                <div className="mt-1 text-sm text-gray-700">Buy materials at mill-level rates</div>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                  <Package className="w-6 h-6" />
                </div>
                <div className="mt-3 font-medium text-[#1E1E1E]">Safe Storage</div>
                <div className="mt-1 text-sm text-gray-700">Stored and tracked for reuse</div>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                  <Recycle className="w-6 h-6" />
                </div>
                <div className="mt-3 font-medium text-[#1E1E1E]">Smart Reuse</div>
                <div className="mt-1 text-sm text-gray-700">Reuse same materials for future batches</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      

      {/* The Journey of Your Raw Materials */}
      <section className="w-full bg-[#FAF9F3] py-16 sm:py-20 md:py-24">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#2D2A2E]">The Journey of Your Raw Materials</h2>
            <div className="mt-4 flex justify-center">
              <span className="block w-16 h-0.5 bg-[#E6D8C6] rounded-full" />
            </div>
            <p className="mt-6 text-sm sm:text-base md:text-lg text-[#4B4652] max-w-3xl mx-auto leading-relaxed">
              We make sure every material you invest in continues to create value — through mindful sourcing, safe storage, and smart reuse across future collections.
            </p>
          </div>

          <div className="mt-12 sm:mt-16 md:mt-20 space-y-12 sm:space-y-16 md:space-y-20">
            {/* Point 1: Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-1 lg:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A2E]">Bulk Procurement for Lower Rates</h3>
                </div>
                <p className="text-sm sm:text-base text-[#4B4652] leading-7 mt-4">
                  We source your approved fabrics, trims, and accessories directly from our certified mills and vendors at larger quantities — ensuring the lowest possible rate per meter or piece.
                </p>
              </div>
              <div className="order-2 lg:order-2 rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
                <div className="relative w-full h-64 sm:h-80">
                  <Image src="/services/enterprise/raw-material-bulk-procurement.webp" alt="Bulk procurement of raw materials" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* Point 2: Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
                <div className="relative w-full h-64 sm:h-80">
                  <Image src="/services/enterprise/raw-material-storage-facility.webp" alt="Dedicated storage facility for raw materials" fill className="object-cover" />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <Warehouse className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A2E]">Dedicated Storage Facility</h3>
                </div>
                <p className="text-sm sm:text-base text-[#4B4652] leading-7 mt-4">
                  All your remaining raw materials are safely stored at Krazy Kreators&apos; warehouse with proper labeling, batch details, and condition monitoring.
                </p>
              </div>
            </div>

            {/* Point 3: Text Left, Image Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-1 lg:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <Recycle className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A2E]">Smart Reuse in Future Batches</h3>
                </div>
                <p className="text-sm sm:text-base text-[#4B4652] leading-7 mt-4">
                  When you launch your next collection or restock a best-seller, we reuse the same stored materials — maintaining consistency in fabric, color, and quality while saving you both time and cost.
                </p>
              </div>
              <div className="order-2 lg:order-2 rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
                <div className="relative w-full h-64 sm:h-80">
                  <Image src="/services/enterprise/raw-material-smart-reuse.webp" alt="Smart reuse of stored materials" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* Point 4: Image Left, Text Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
                <div className="relative w-full h-64 sm:h-80">
                  <Image src="/services/enterprise/raw-material-live-tracking.webp" alt="Live tracking of raw materials" fill className="object-cover" />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <BarChart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A2E]">Live Material Tracking</h3>
                </div>
                <p className="text-sm sm:text-base text-[#4B4652] leading-7 mt-4">
                  You get digital visibility of what&apos;s stored, what&apos;s used, and what&apos;s remaining — so planning future styles becomes easier and faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Brands Love This System */}
      <section className="w-full bg-white py-16 sm:py-20 md:py-24">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#2D2A2E]">Why Brands Love This System</h2>
            <div className="mt-4 flex justify-center">
              <span className="block w-16 h-0.5 bg-[#E6D8C6] rounded-full" />
            </div>
            <p className="mt-6 text-sm sm:text-base md:text-lg text-[#4B4652] leading-relaxed">
              Designed to make your production faster, cheaper, and more consistent — while keeping your cash flow and sustainability in balance.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <article className="rounded-2xl border border-[#ECE9E2] bg-[#FAF9F3] p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] text-left">
              <div className="flex items-center justify-start gap-3">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-lg shrink-0 bg-[#6BA292]/10 text-[#6BA292]"><Tag className="w-5 h-5" /></span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Big Savings on Small Quantities</h3>
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#4B4652] leading-7">You don’t have to pay high prices for small MOQs — we combine your requirements into a larger bulk purchase that gets wholesale-level pricing without forcing you to produce everything at once.</p>
            </article>

            <article className="rounded-2xl border border-[#ECE9E2] bg-[#FAF9F3] p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] text-left">
              <div className="flex items-center justify-start gap-3">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-lg shrink-0 bg-[#6BA292]/10 text-[#6BA292]"><Zap className="w-5 h-5" /></span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Faster Repeat Production</h3>
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#4B4652] leading-7">Since your core materials are already in stock with us, your next production cycle can start immediately — no delays in sourcing or dyeing.</p>
            </article>

            <article className="rounded-2xl border border-[#ECE9E2] bg-[#FAF9F3] p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] text-left">
              <div className="flex items-center justify-start gap-3">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-lg shrink-0 bg-[#6BA292]/10 text-[#6BA292]"><Layers className="w-5 h-5" /></span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Consistency Across Collections</h3>
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#4B4652] leading-7">Using the same stored materials ensures your fabric shade, weave, trims, and accessories stay identical across different drops or reorders.</p>
            </article>

            <article className="rounded-2xl border border-[#ECE9E2] bg-[#FAF9F3] p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] text-left">
              <div className="flex items-center justify-start gap-3">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-lg shrink-0 bg-[#6BA292]/10 text-[#6BA292]"><BadgeDollarSign className="w-5 h-5" /></span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Cash Flow Friendly</h3>
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#4B4652] leading-7">You invest once in your raw material at a low bulk rate — then reuse it over multiple batches. This keeps your up-front production cost low and frees up working capital for design and marketing.</p>
            </article>

            <article className="rounded-2xl border border-[#ECE9E2] bg-[#FAF9F3] p-6 sm:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.04)] sm:col-span-2 text-left">
              <div className="flex items-center justify-start gap-3">
                <span className="inline-flex w-12 h-12 items-center justify-center rounded-lg shrink-0 bg-[#6BA292]/10 text-[#6BA292]"><Leaf className="w-5 h-5" /></span>
                <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Eco‑Smart & Sustainable</h3>
              </div>
              <p className="mt-3 text-sm sm:text-base text-[#4B4652] leading-7">By reusing your existing raw materials, you reduce textile waste, packaging consumption, and unnecessary production of new fabrics — doing good for both your business and the planet.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Conversion CTA */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Every meter you&apos;ve paid for should add value — not waste.</h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed">
              With Krazy Kreators, your raw materials live beyond one collection.
              <br className="hidden sm:block" />
              <br className="hidden sm:block" />
              Save money, reduce waste, and stay production-ready for every new drop — all through a system designed for long-term growth and sustainability.
            </p>
            <div className="mt-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setContactOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5"
              >
                Start Your Sustainable Plan
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}


