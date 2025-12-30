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

export default function HandEmbroideryClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const capabilities = [
    {
      icon: Scissors,
      title: "Wide Range of Techniques",
      description: "Zardozi, Aari, Resham, Sequins, Beadwork, Threadwork, Appliqué & more.",
    },
    {
      icon: Sparkles,
      title: "Premium Detailing",
      description: "Adding artisanal depth to garments — from bridal couture to contemporary wear.",
    },
    {
      icon: Palette,
      title: "Creative Translation",
      description: "We translate your sketches and inspirations into embroidery swatches and final pieces.",
    },
    {
      icon: Layers,
      title: "Scalable Production",
      description: "From sample swatches to bulk orders, our network of skilled artisans ensures consistent quality and timely delivery.",
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com/" },
      { "@type": "ListItem", position: 2, name: "Design Services", item: "https://www.krazykreators.com/design-services" },
      { "@type": "ListItem", position: 3, name: "Hand Embroidery" },
    ],
  };

  return (
    <main className="w-full bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Navbar />

      {/* HERO SECTION - MATCH DESIGN SERVICES STYLE */}
      <section className="kk-hero-dark relative w-full bg-white min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image src="/services/design/hand-embriodery.png" alt="Hand embroidery craftsmanship by Krazy Kreators" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">Hand Embroidery</h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-normal">Where Craft Meets Couture</h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Start Your Journey</a>
            <Link href="/#case-studies" className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full border border-white/70 text-white px-7 text-sm sm:text-base font-semibold hover:text-[#6BA292] hover:border-[#6BA292] transition-colors">View Portfolio</Link>
          </div>
        </div>
      </section>

      {/* CAPABILITIES SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Section Intro + Title */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-sm sm:text-base md:text-lg text-[#2F2F2F] leading-relaxed max-w-3xl mx-auto mb-10">
              In today’s fashion world, where mass production dominates, hand embroidery stands apart as the soul of craftsmanship. Each stitch tells a story of patience, creativity, and precision. At Krazy Kreators, we believe that handwork is not just a detail — it is a signature of timeless luxury.
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2F2F2F] mb-4">
              Our Capabilities
            </h2>
            <div className="w-24 h-0.5 bg-[#C1A782] mx-auto rounded-full" />
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {capabilities.map((capability) => {
              const Icon = capability.icon;
              return (
                <div
                  key={capability.title}
                  className="bg-[#F5F2E8] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#C1A782]/10 rounded-full mb-4">
                      <Icon className="w-6 h-6 text-[#C1A782]" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#2F2F2F] mb-3 font-serif">
                      {capability.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#3C3C3C] leading-relaxed">
                      {capability.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    {/* EMBROIDERY IMAGE AND TEXT SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-[#F5F2E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Title and subtext above the image */}
          <div className="text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4 text-center">Basic Embroidery Stitches</h3>
            <p className="mb-6 text-center">Here are the foundational stitches every embroiderer learns:</p>
          </div>

          {/* Image */}
          <div className="relative w-full h-96 mb-12 sm:mb-16">
            <Image
              src="/services/design/embriodery-1.png"
              alt="Detailed hand embroidery sample - Basic embroidery stitches"
              fill
              className="object-contain"
            />
          </div>

          {/* Content below the image - 3 pointers left, 3 pointers right, 1 below spanning both */}
          <div className="text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-[#F5F2E8] rounded-lg p-4 border border-[#E6D9C2]">
                <h4 className="font-semibold text-[#2F2F2F] mb-2">Running Stitch</h4>
                <p className="text-sm text-[#3C3C3C]">Small, straight stitches in a line. Used for outlines, borders, or simple details.</p>
              </div>
              <div className="bg-[#F5F2E8] rounded-lg p-4 border border-[#E6D9C2]">
                <h4 className="font-semibold text-[#2F2F2F] mb-2">Back Stitch</h4>
                <p className="text-sm text-[#3C3C3C]">Stronger than running stitch, creates a continuous line. Good for lettering or outlines.</p>
              </div>
              <div className="bg-[#F5F2E8] rounded-lg p-4 border border-[#E6D9C2]">
                <h4 className="font-semibold text-[#2F2F2F] mb-2">Chain Stitch</h4>
                <p className="text-sm text-[#3C3C3C]">Loops form a chain-like pattern. Common in Indian hand embroidery (like Aari, crochet-style).</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#F5F2E8] rounded-lg p-4 border border-[#E6D9C2]">
                <h4 className="font-semibold text-[#2F2F2F] mb-2">Satin Stitch</h4>
                <p className="text-sm text-[#3C3C3C]">Threads placed side by side to fill a shape. Creates a smooth, satin-like surface (used for petals, leaves).</p>
              </div>
              <div className="bg-[#F5F2E8] rounded-lg p-4 border border-[#E6D9C2]">
                <h4 className="font-semibold text-[#2F2F2F] mb-2">Stem Stitch</h4>
                <p className="text-sm text-[#3C3C3C]">Slightly slanted, twisted line stitch. Used for vines, curves, and outlines.</p>
              </div>
              <div className="bg-[#F5F2E8] rounded-lg p-4 border border-[#E6D9C2]">
                <h4 className="font-semibold text-[#2F2F2F] mb-2">French Knot</h4>
                <p className="text-sm text-[#3C3C3C]">Tiny knots made with thread. Looks like small dots or flower centers.</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="bg-[#F5F2E8] rounded-lg p-4 border border-[#E6D9C2]">
              <h4 className="font-semibold text-[#2F2F2F] mb-2">Lazy Daisy Stitch</h4>
              <p className="text-sm text-[#3C3C3C]">A looped stitch shaped like a petal. Perfect for small flowers.</p>
            </div>
          </div>
          
          <p className="text-[clamp(1rem,1.2vw,1.25rem)] text-[#2F2F2F] leading-[1.8] mt-8 text-center">
            Basic embroidery is the foundation for advanced work like zardozi, aari, dabka, beadwork, and stone embroidery.
          </p>
        </div>
      </div>
    </section>

    {/* ADVANCED EMBROIDERY FOUNDATION SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-8 text-[#2F2F2F]">
          Advanced Embroidery
        </h3>
        <div className="relative w-full h-96">
          <Image
            src="/services/design/embriodery-2.png"
            alt="Advanced embroidery techniques including Zardozi, Aari, Dabka, Beadwork, and Stone Embroidery"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-[clamp(1rem,1.2vw,1.25rem)] text-[#2F2F2F] leading-[1.8] mt-12">
          At Krazy Kreators, advanced embroidery is more than technique — it&apos;s a dialogue between heritage and innovation. Each creation reflects our dedication to preserving artisanal mastery while reimagining it for contemporary fashion. Through intricate detailing, luxurious materials, and time-honored handwork, we bring stories of culture, craft, and couture to life, one stitch at a time.
        </p>
      </div>
    </section>

    {/* ZARDOZI ELEGANCE SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Centered Title */}
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-12 text-[#2F2F2F] text-center">
          Zardozi Elegance: Where Heritage Meets Haute Couture
        </h3>
        
        {/* Mobile: Image first, then text. Desktop: Image left, text right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-start">
          <div className="relative w-full h-96 order-1 md:order-1">
            <Image
              src="/services/design/embriodery-3.png"
              alt="Zardozi Elegance - Heritage meets Haute Couture embroidery"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-[#2F2F2F] leading-relaxed order-2 md:order-2">
            <p className="text-[clamp(1rem,1.2vw,1.25rem)] mb-6 leading-[1.8]">
              Inspired by Mughal and Persian floral artistry, this hand-embroidered design showcases precision detailing and shimmering textures, beautifully balancing heritage craftsmanship with modern luxury aesthetics, while remaining versatile enough to adorn both traditional couture and high-fashion western silhouettes.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-[#2F2F2F] mb-2">Embroidery Look:</h4>
                <p className="text-sm text-[#3C3C3C]">Fine detailing hand zardozi-inspired work with bead-like textures, lending a regal, ornamental quality.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technical Details Below Image */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-[#2F2F2F] mb-4">Techniques Used:</h4>
              <ul className="text-sm text-[#3C3C3C] space-y-2">
                <li>• Stem stitch and chain stitch for outlining the vines.</li>
                <li>• French knots / bead-like detailing inside floral clusters.</li>
                <li>• Satin filling for leaves and petals.</li>
                <li>• Couching may have been used for thicker metallic thread lines.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#2F2F2F] mb-4">Embellishments:</h4>
              <p className="text-sm text-[#3C3C3C]">Some parts resemble beads, pearls, or sequins giving the floral centers a textured sparkle.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* PEARL-DRAPED ELEGANCE SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-[#F5F2E8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-12 text-[#2F2F2F] text-center">
          Pearl-Draped Elegance in Every Stitch
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="relative w-full h-96 order-1 md:order-2">
            <Image
              src="/services/design/embriodery-4.png"
              alt="Pearl-Draped Elegance in Every Stitch - Hand embroidery with pearl fringe"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-[#2F2F2F] leading-relaxed order-2 md:order-1">
            <p className="text-[clamp(1rem,1.2vw,1.25rem)] mb-6 leading-[1.8]">
              This embroidery is a stunning example of luxury Zardozi-inspired craftsmanship featuring intricate floral and geometric border patterns. The design is richly embellished with silver threadwork, sequins, and bead embroidery, arranged in horizontal layers that flow like regal lace.The standout feature is the dangling pearl and bead tassel fringe at the bottom, adding graceful movement and opulence. This detail not only enhances the richness of the embroidery but also gives it a couture edge, making it ideal for high-fashion statement pieces.
            </p>
          </div>
        </div>
        
        {/* Applications in Fashion Below Image */}
        <div className="mt-12 max-w-4xl mx-auto text-left">
          <h4 className="font-semibold text-xl sm:text-2xl text-[#2F2F2F] mb-4">Applications in Fashion</h4>
          <p className="mb-4">This embroidery sample can be used across couture, bridal, and luxury garments:</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><span className="font-semibold">Bridal & Couture Wear:</span> Borders of lehengas, dupattas, saris, or gowns.</li>
            <li><span className="font-semibold">Evening & Cocktail Wear:</span> Hemlines and yokes of statement dresses or capes.</li>
            <li><span className="font-semibold">Menswear:</span> Regal sherwani borders, stole finishes, or bandhgalas.</li>
            <li><span className="font-semibold">Accessories:</span> Luxury handbags, belts, clutches, and even bridal veils.</li>
          </ul>
          <p className="text-[clamp(1rem,1.2vw,1.25rem)] leading-[1.8]">
            The fringe pearl detail makes it especially suited for garments where movement enhances elegance—like flowing skirts, dupatta edges, or cape borders.
          </p>
        </div>
      </div>
    </section>

    {/* HANDCRAFTED SILVER FLORAL EMBROIDERY ART SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-12 text-[#2F2F2F] text-center">
          Handcrafted Silver Floral Embroidery Art
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center mb-12">
          <div className="relative w-full h-96 flex justify-center order-1 md:order-1">
            <Image
              src="/services/design/embriodery-5.png"
              alt="Handcrafted Silver Floral Embroidery Art"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-[#2F2F2F] leading-relaxed text-left order-2 md:order-2">
            <p className="text-[clamp(1rem,1.2vw,1.25rem)] mb-6 leading-[1.8]">
              This artisanal embroidery sample showcases a luxurious floral design, crafted to inspire high-end fashion garments. Set against a rich black base fabric, the embroidery features detailed roses, buds, and leafy vines created using metallic silver threads, with accents of beads and sequins for added depth and shimmer.
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <h4 className="font-semibold text-xl sm:text-2xl text-[#2F2F2F] mb-4">Key Highlights</h4>
          <ul className="list-disc list-inside space-y-3 text-[#2F2F2F] leading-relaxed text-left">
            <li><span className="font-semibold">Fabric Base:</span> Black velvet/cotton fabric for rich contrast</li>
            <li><span className="font-semibold">Embroidery Technique:</span> Hand embroidery with metallic silver threads, beadwork, and sequins</li>
            <li><span className="font-semibold">Motifs:</span> Floral arrangement featuring roses, buds, and vines</li>
            <li><span className="font-semibold">Style:</span> A blend of contemporary elegance and traditional craftsmanship</li>
            <li><span className="font-semibold">Application:</span> Perfect for use in couture, eveningwear, bridal ensembles, blouses, lehengas, sarees, jackets, and luxury western wear</li>
          </ul>
        </div>
      </div>
    </section>

    {/* STONE & BEAD GARLAND SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-12 text-[#2F2F2F] text-center">
          Stone & Bead Garland
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center mb-12">
          <div className="relative w-full h-96 flex justify-center order-1 md:order-2">
            <Image
              src="/services/design/embriodery-6.png"
              alt="Stone and Bead Garland Embroidery Art"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-[#2F2F2F] leading-relaxed text-left order-2 md:order-1">
            <p className="text-[clamp(1rem,1.2vw,1.25rem)] mb-6 leading-[1.8]">
              The design is arranged in a symmetric curved composition forming a semi-circular garland pattern across the hoop, leaving the center empty. This type of layout is often used for necklines, yokes, or decorative motifs on couture garments.
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <h4 className="font-semibold text-xl sm:text-2xl text-[#2F2F2F] mb-4">Likely techniques include:</h4>
          <ul className="list-disc list-inside space-y-3 text-[#2F2F2F] leading-relaxed text-left">
            <li>Zardozi (metallic thread & beadwork)</li>
            <li>Aari/Tambour embroidery for attaching sequins and beads</li>
            <li>Stone setting with claw or bead attachments for the larger crystal pieces</li>
          </ul>
        </div>
      </div>
    </section>

    {/* CONTEMPORARY FLORAL BEAD & THREAD EMBROIDERY SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-12 text-[#2F2F2F] text-center">
          Contemporary Floral Bead & Thread Embroidery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center mb-12">
          <div className="relative w-full h-96 flex justify-center order-1 md:order-1">
            <Image
              src="/services/design/embriodery-7.png"
              alt="Contemporary Floral Bead & Thread Embroidery Art"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-[#2F2F2F] leading-relaxed text-left order-2 md:order-2">
            <p className="text-[clamp(1rem,1.2vw,1.25rem)] mb-6 leading-[1.8]">
              This embroidery panel is a striking example of contemporary couture handwork, combining bead embellishment, thread artistry, and metallic detailing to create a bold, luxurious surface.
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <h4 className="font-semibold text-xl sm:text-2xl text-[#2F2F2F] mb-4">Techniques Used</h4>
          <ul className="list-disc list-inside space-y-3 text-[#2F2F2F] leading-relaxed text-left">
            <li>Zardozi-inspired metallic threadwork for floral outlines and leaf veins</li>
            <li>Bead embroidery using tube beads to create structured, radiating floral petals</li>
            <li>French knots and seed embroidery in contrasting red and blue shades for textural depth</li>
            <li>Sequin appliqué for luminous highlights at flower centers</li>
          </ul>
          <h4 className="font-semibold text-xl sm:text-2xl text-[#2F2F2F] mb-4 mt-8">Visual Impact & Applications</h4>
          <ul className="list-disc list-inside space-y-3 text-[#2F2F2F] leading-relaxed text-left">
            <li>The dark base fabric intensifies the metallic and colorful embellishments, making the embroidery highly impactful and perfect for luxury evening wear, statement jackets, clutches, or couture panels</li>
            <li>This combination of structured beadwork and vibrant detailing gives the design both modern edge and artisanal richness</li>
          </ul>
        </div>
      </div>
    </section>

    {/* ZARI LEAF JAAL MOTIF SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-12 text-[#2F2F2F] text-center">
          Zari Leaf Jaal Motif
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center mb-12">
          <div className="relative w-full h-96 flex justify-center order-1 md:order-2">
            <Image
              src="/services/design/embriodery-8.png"
              alt="Zari Leaf Jaal Motif Embroidery Art"
              fill
              className="object-contain"
            />
          </div>
          <div className="text-[#2F2F2F] leading-relaxed text-left order-2 md:order-1">
            <p className="text-[clamp(1rem,1.2vw,1.25rem)] mb-6 leading-[1.8]">
              The fine metallic look suggests the use of zari thread for outlining the leaves. Its symmetry and balance make it suitable for placement at the center-Back of a Blazer, luxury western wear gown yoke, Dress panel, or dupatta border.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* INTRICATE WHITE-ON-WHITE EMBROIDERY SECTION */}
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-12 text-[#2F2F2F] text-center">
          Intricate White-on-White Embroidery
        </h3>
        
        {/* Image */}
        <Image
          src="/services/design/embriodery-9.png"
          alt="Intricate white-on-white embroidery art"
          width={800}
          height={400}
          className="object-contain mx-auto mb-8"
        />

        {/* Content Text */}
        <div className="text-[#2F2F2F] leading-relaxed text-left max-w-4xl mx-auto">
          <p className="text-[clamp(1rem,1.2vw,1.25rem)] mb-6 leading-[1.8]">
            This embroidery is a true showcase of luxury craftsmanship, created using a refined tone-on-tone technique where white threads, sequins, and beads blend seamlessly into the base fabric to create a sophisticated, textural effect.
          </p>

          <h4 className="font-semibold text-xl sm:text-2xl text-[#2F2F2F] mb-4 mt-8">✨ Design & Motifs</h4>
          <ul className="list-disc list-inside space-y-3 text-[clamp(1rem,1.2vw,1.25rem)] leading-[1.8] mb-6">
            <li>The piece features a floral and foliage composition, with large blossoms framed by delicate vines and leaves.</li>
            <li>Central flowers are layered with dense threadwork petals and finished with clusters of sequins, giving a three-dimensional bloom effect.</li>
            <li>Smaller floral sprigs and buds are scattered throughout, balancing density with lightness.</li>
          </ul>

          <h4 className="font-semibold text-xl sm:text-2xl text-[#2F2F2F] mb-4 mt-8">✨ Techniques Used</h4>
          <ul className="list-disc list-inside space-y-3 text-[clamp(1rem,1.2vw,1.25rem)] leading-[1.8] mb-6">
            <li>Thread Embroidery: Satin stitch, stem stitch, and couching techniques are used for leaves and stems, creating soft textures with a raised finish.</li>
            <li>Beadwork & Sequins: Iridescent white sequins and tubular beads are hand-applied to highlight motifs, adding sparkle and dimension.</li>
            <li>Layering & Depth: Multiple embroidery methods are combined to create a rich surface that feels tactile and luxurious.</li>
          </ul>

          <h4 className="font-semibold text-xl sm:text-2xl text-[#2F2F2F] mb-4 mt-8">✨ Application & Use</h4>
          <ul className="list-disc list-inside space-y-3 text-[clamp(1rem,1.2vw,1.25rem)] leading-[1.8]">
            <li>Ideal for bridal couture, evening gowns, and high-fashion pieces where understated elegance is desired.</li>
            <li>This white-on-white embroidery is timeless, pairing effortlessly with both modern silhouettes and traditional garments.</li>
          </ul>
        </div>
      </div>
    </section>

    {/* CLOSING SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F5F2E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-center">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-[#2F2F2F] mb-8 leading-relaxed">
            At Krazy Kreators, every design begins with a stitch and ends with a masterpiece.
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

      <Footer />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}
