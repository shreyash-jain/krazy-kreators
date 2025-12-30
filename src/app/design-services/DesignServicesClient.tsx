"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Download, DownloadCloud, Maximize2, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [illustrationsOpen, setIllustrationsOpen] = useState(false);
  const [illustrationIndex, setIllustrationIndex] = useState(0);
  const [illustrationFullscreen, setIllustrationFullscreen] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);
  // Prints modal state
  const [printsOpen, setPrintsOpen] = useState(false);
  const [printsIndex, setPrintsIndex] = useState(0);
  const [printsFullscreen, setPrintsFullscreen] = useState(false);
  const [printsZipLoading, setPrintsZipLoading] = useState(false);
  // Tech pack modal state
  const [techOpen, setTechOpen] = useState(false);
  const [techFullscreen, setTechFullscreen] = useState(false);
  // BOM modal state
  const [bomOpen, setBomOpen] = useState(false);
  const [bomFullscreen, setBomFullscreen] = useState(false);

  const illustrations = [
    { src: "/services/design/illustrations/hoodie-illustration.png", name: "hoodie-illustration.png" },
    { src: "/services/design/illustrations/kid-garment.png", name: "kid-garment.png" },
    { src: "/services/design/illustrations/polo-illustration.png", name: "polo-illustration.png" },
    { src: "/services/design/illustrations/shirt-illustration.png", name: "shirt-illustration.png" },
    { src: "/services/design/illustrations/trouser-illustration.png", name: "trouser-illustration.png" },
    { src: "/services/design/illustrations/women-gown-illustration-black.png", name: "women-gown-illustration-black.png" },
    { src: "/services/design/illustrations/women-gown-illustration-red.png", name: "women-gown-illustration-red.png" },
  ];

  const goPrev = () => setIllustrationIndex((i) => (i - 1 + illustrations.length) % illustrations.length);
  const goNext = () => setIllustrationIndex((i) => (i + 1) % illustrations.length);
  const downloadCurrent = () => {
    const img = illustrations[illustrationIndex];
    const a = document.createElement('a');
    a.href = img.src;
    a.download = img.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Minimal JSZip type to avoid any
  interface JSZipLike { file: (name: string, data: Blob) => void; generateAsync: (opts: { type: 'blob' }) => Promise<Blob>; }
  type JSZipCtor = new () => JSZipLike;

  // Lazy-load JSZip from CDN and download all images as a single zip
  const downloadAllAsZip = async () => {
    try {
      setZipLoading(true);
      // Load JSZip if not already loaded
      const w = window as unknown as { JSZip?: JSZipCtor };
      if (!w.JSZip) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load JSZip'));
          document.body.appendChild(script);
        });
      }
      const w2 = window as unknown as { JSZip: JSZipCtor };
      const zip = new w2.JSZip();
      // Fetch each image as blob and add to the zip
      await Promise.all(
        illustrations.map(async (img) => {
          const res = await fetch(img.src, { cache: 'no-cache' });
          const blob = await res.blob();
          zip.file(img.name, blob);
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'illustrations.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch {
      // Fallback: sequential downloads if zipping fails
      illustrations.forEach((img, idx) => {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = img.src;
          a.download = img.name;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, idx * 150);
      });
    } finally {
      setZipLoading(false);
    }
  };

  // Lock page scroll when modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (illustrationsOpen || printsOpen || techOpen || bomOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original || '';
    }
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [illustrationsOpen, printsOpen, techOpen, bomOpen]);

  // Prints images list
  const prints = [
    { src: "/services/design/prints/PLAID%201.png", name: "PLAID 1.png" },
    { src: "/services/design/prints/PLAID%202.png", name: "PLAID 2.png" },
    { src: "/services/design/prints/PRINT%201.png", name: "PRINT 1.png" },
    { src: "/services/design/prints/PRINT%202.png", name: "PRINT 2.png" },
    { src: "/services/design/prints/PRINT%203.png", name: "PRINT 3.png" },
    { src: "/services/design/prints/PRINT%204.png", name: "PRINT 4.png" },
    { src: "/services/design/prints/PRINT%206.png", name: "PRINT 6.png" },
    { src: "/services/design/prints/PRINT%207.png", name: "PRINT 7.png" },
    { src: "/services/design/prints/PRINT5.png", name: "PRINT5.png" },
  ];
  const goPrevPrint = () => setPrintsIndex((i) => (i - 1 + prints.length) % prints.length);
  const goNextPrint = () => setPrintsIndex((i) => (i + 1) % prints.length);
  const downloadCurrentPrint = () => {
    const img = prints[printsIndex];
    const a = document.createElement('a');
    a.href = img.src;
    a.download = img.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const downloadAllPrintsAsZip = async () => {
    try {
      setPrintsZipLoading(true);
      const w = window as unknown as { JSZip?: JSZipCtor };
      if (!w.JSZip) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load JSZip'));
          document.body.appendChild(script);
        });
      }
      const w2 = window as unknown as { JSZip: JSZipCtor };
      const zip = new w2.JSZip();
      await Promise.all(
        prints.map(async (img) => {
          const res = await fetch(img.src, { cache: 'no-cache' });
          const blob = await res.blob();
          zip.file(img.name, blob);
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'prints.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    } catch {
      prints.forEach((img, idx) => {
        setTimeout(() => {
          const a = document.createElement('a');
          a.href = img.src;
          a.download = img.name;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, idx * 150);
      });
    } finally {
      setPrintsZipLoading(false);
    }
  };

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
        <div className="relative min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-24 sm:py-28 md:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">Design. Develop. Deliver.</h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-normal">Trend forecasting, garment sampling, and production-ready designs for fast-moving fashion brands.</h2>
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative">
          <header className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Our Fashion Design Expertise</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] max-w-[700px] mx-auto">
              From concept sketches to production-ready garments, we provide a full spectrum of design solutions for modern fashion brands.
            </p>
          </header>

          {/* 3-column grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
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

      {/* CONCEPT AND ILLUSTRATIONS SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Concept and Illustrations</h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] leading-relaxed">
                Every collection begins with a concept — a story that defines the mood, inspiration, and creative direction. Illustrations bring this vision to life, transforming abstract ideas into expressive visuals that guide design development. They serve as a bridge between imagination and execution, capturing silhouettes, textures, colors, and emotions before garments take form. Together, concept and illustrations establish the foundation of a fashion collection, ensuring each design is not only aesthetically compelling but also connected to a deeper narrative.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => { setIllustrationsOpen(true); document.body.style.overflow = 'hidden'; }}
                  className="inline-flex items-center justify-center rounded-full border border-[#CBB49A] text-[#CBB49A] px-7 py-3.5 text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b7a078] hover:text-[#b7a078]"
                >
                  View Sample
                </button>
              </div>
            </div>
            
            {/* Right: Image */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
              <div className="relative w-full h-full min-h-[22rem]">
                <Image 
                  src="/services/design/design-1.png" 
                  alt="Fashion design concept and illustration process - designer's workspace with sketches and digital tools" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Illustrations Modal - Lightbox with navigation and fullscreen */}
      {illustrationsOpen && (
        <div className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center`}>
          <div className="absolute inset-0" onClick={() => { setIllustrationsOpen(false); setIllustrationFullscreen(false); document.body.style.overflow = ''; }} />
          <div className={`${illustrationFullscreen ? 'w-full h-full rounded-none' : 'w-[92%] max-w-6xl max-h-[90vh] rounded-2xl'} relative bg-white shadow-2xl overflow-hidden flex flex-col`}>
            {/* Header simplified: title only and close icon */}
            <div className={`flex items-center justify-between px-5 py-4 border-b border-[#EEE8F6]` }>
              <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Concept & Illustrations – Samples</h3>
              <button onClick={() => { setIllustrationsOpen(false); setIllustrationFullscreen(false); document.body.style.overflow = ''; }} className="text-[#2D2A2E] hover:text-[#CBB49A] text-xl leading-none">×</button>
            </div>
            <div className="relative flex-1 bg-white">
              {/* Prev / Next icons */}
              <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white text-[#2D2A2E] px-3 py-3 shadow">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white text-[#2D2A2E] px-3 py-3 shadow">
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Top-right action icons inside image area */}
              <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                <button onClick={downloadCurrent} className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title="Download">
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={downloadAllAsZip}
                  className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title="Download all"
                >
                  {zipLoading ? (
                    <span className="relative inline-flex w-5 h-5">
                      <span className="absolute inline-flex w-5 h-5 rounded-full border-2 border-[#CBB49A] border-t-transparent animate-spin" />
                    </span>
                  ) : (
                    <DownloadCloud className="w-5 h-5" />
                  )}
                </button>
                <button onClick={() => setIllustrationFullscreen((v) => !v)} className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title={illustrationFullscreen ? 'Exit full screen' : 'View full screen'}>
                  {illustrationFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
              <div className={`relative w-full ${illustrationFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[75vh]'} bg-white`}>
                <Image src={illustrations[illustrationIndex].src} alt={illustrations[illustrationIndex].name} fill className="object-contain" />
              </div>
            </div>
            {/* Footer removed */}
          </div>
        </div>
      )}

      {/* Prints Modal - similar lightbox */}
      {printsOpen && (
        <div className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center`}>
          <div className="absolute inset-0" onClick={() => { setPrintsOpen(false); setPrintsFullscreen(false); document.body.style.overflow = ''; }} />
          <div className={`${printsFullscreen ? 'w-full h-full rounded-none' : 'w-[92%] max-w-6xl max-h-[90vh] rounded-2xl'} relative bg-white shadow-2xl overflow-hidden flex flex-col`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b border-[#EEE8F6]` }>
              <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Print & Pattern – Samples</h3>
              <button onClick={() => { setPrintsOpen(false); setPrintsFullscreen(false); document.body.style.overflow = ''; }} className="text-[#2D2A2E] hover:text-[#CBB49A] text-xl leading-none">×</button>
            </div>
            <div className="relative flex-1 bg-white">
              <button onClick={goPrevPrint} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white text-[#2D2A2E] px-3 py-3 shadow">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goNextPrint} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white text-[#2D2A2E] px-3 py-3 shadow">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                <button onClick={downloadCurrentPrint} className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title="Download">
                  <Download className="w-5 h-5" />
                </button>
                <button onClick={downloadAllPrintsAsZip} className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title="Download all">
                  {printsZipLoading ? (
                    <span className="relative inline-flex w-5 h-5">
                      <span className="absolute inline-flex w-5 h-5 rounded-full border-2 border-[#CBB49A] border-t-transparent animate-spin" />
                    </span>
                  ) : (
                    <DownloadCloud className="w-5 h-5" />
                  )}
                </button>
                <button onClick={() => setPrintsFullscreen((v) => !v)} className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title={printsFullscreen ? 'Exit full screen' : 'View full screen'}>
                  {printsFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
              <div className={`relative w-full ${printsFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[75vh]'} bg-white`}>
                <Image src={prints[printsIndex].src} alt={prints[printsIndex].name} fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tech Pack PDF Modal */}
      {techOpen && (
        <div className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center`}>
          <div className="absolute inset-0" onClick={() => { setTechOpen(false); setTechFullscreen(false); document.body.style.overflow = ''; }} />
          <div className={`${techFullscreen ? 'w-full h-full rounded-none' : 'w-[92%] max-w-5xl max-h-[90vh] rounded-2xl'} relative bg-white shadow-2xl overflow-hidden flex flex-col`}
               role="dialog" aria-modal="true">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEE8F6]">
              <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Tech Pack – Preview</h3>
              <div className="flex items-center gap-2">
                <a href="/services/design/Techpack .pdf" download className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title="Download PDF">
                  <Download className="w-5 h-5" />
                </a>
                <button onClick={() => setTechFullscreen((v) => !v)} className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title={techFullscreen ? 'Exit full screen' : 'View full screen'}>
                  {techFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button onClick={() => { setTechOpen(false); setTechFullscreen(false); document.body.style.overflow = ''; }} className="text-[#2D2A2E] hover:text-[#CBB49A] text-xl leading-none">×</button>
              </div>
            </div>
            <div className={`relative w-full ${techFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[75vh]'} bg-white`}>
              <iframe src="/services/design/Techpack .pdf#toolbar=0" title="Tech Pack PDF" className="w-full h-full"
                      style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }} />
            </div>
          </div>
        </div>
      )}

      {/* BOM PDF Modal */}
      {bomOpen && (
        <div className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center`}>
          <div className="absolute inset-0" onClick={() => { setBomOpen(false); setBomFullscreen(false); document.body.style.overflow = ''; }} />
          <div className={`${bomFullscreen ? 'w-full h-full rounded-none' : 'w-[92%] max-w-5xl max-h-[90vh] rounded-2xl'} relative bg-white shadow-2xl overflow-hidden flex flex-col`}
               role="dialog" aria-modal="true">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEE8F6]">
              <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">Bill of Materials – Preview</h3>
              <div className="flex items-center gap-2">
                <a href="/services/design/BOM%20template.pdf" download className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title="Download PDF">
                  <Download className="w-5 h-5" />
                </a>
                <button onClick={() => setBomFullscreen((v) => !v)} className="rounded-full bg-white text-[#2D2A2E] p-2 shadow hover:bg-white/90" title={bomFullscreen ? 'Exit full screen' : 'View full screen'}>
                  {bomFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button onClick={() => { setBomOpen(false); setBomFullscreen(false); document.body.style.overflow = ''; }} className="text-[#2D2A2E] hover:text-[#CBB49A] text-xl leading-none">×</button>
              </div>
            </div>
            <div className={`relative w-full ${bomFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[75vh]'} bg-white`}>
              <iframe src="/services/design/BOM%20template.pdf#toolbar=0" title="BOM Template PDF" className="w-full h-full"
                      style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }} />
            </div>
          </div>
        </div>
      )}

      {/* TREND AND FORECAST RESEARCH SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Image (shown after content on mobile/tablet) */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm order-2 lg:order-1">
              <div className="relative w-full h-full min-h-[22rem]">
                <Image 
                  src="/services/design/design-2.png" 
                  alt="Trend and forecast research in fashion - analyzing market trends and consumer preferences" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
            
            {/* Right: Content (shown first on mobile/tablet) */}
            <div className="flex flex-col justify-center order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Trend and Forecast Research</h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] leading-relaxed">
                Trend and forecast research is a vital part of the fashion industry because it bridges creativity with market relevance. Fashion moves quickly, and consumer preferences shift with culture, technology, lifestyle, and global events. By studying runways, street style, social media, retail analytics, and forecasting agencies, designers and brands can anticipate what colors, fabrics, prints, and silhouettes will be in demand for upcoming seasons. This research reduces the risk of creating products that won&apos;t sell, ensures collections reflect consumer lifestyles, and helps brands stay one step ahead of competitors. Beyond guiding design, it also shapes marketing strategies, storytelling, and retail planning. In short, trend and forecast research gives fashion brands the ability to innovate confidently while remaining commercially successful and culturally relevant in a fast-changing industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECH PACK SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Tech Pack</h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] leading-relaxed">
                A Tech Pack, short for Technical Package, is the blueprint of a garment. It serves as the essential communication tool between designers, product developers, and manufacturers, ensuring that every detail of a design is accurately translated into production. Containing specifications such as measurements, materials, trims, construction methods, colorways, and finishing details, the tech pack minimizes errors, reduces sampling costs, and streamlines the development process.
              </p>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] leading-relaxed">
                In the fashion industry, a well-prepared tech pack is not only a guide but also a contract of clarity — it defines expectations, maintains quality standards, and supports efficient collaboration across global supply chains. By bridging creativity with technical precision, tech packs transform design concepts into production-ready garments that align with both creative vision and commercial goals.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => { setTechOpen(true); document.body.style.overflow = 'hidden'; }}
                  className="inline-flex items-center justify-center rounded-full border border-[#CBB49A] text-[#CBB49A] px-7 py-3.5 text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b7a078] hover:text-[#b7a078]"
                  aria-label="View Sample Tech Pack PDF"
                >
                  View Sample
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
              <div className="relative w-full h-full min-h-[22rem]">
                <Image 
                  src="/services/design/design-3.png" 
                  alt="Tech pack for fashion production displayed on a designer's screen" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINT & PATTERN DESIGN SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Image (shown after content on mobile/tablet) */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm order-2 lg:order-1">
              <div className="relative w-full h-full min-h-[22rem]">
                <Image 
                  src="/services/design/design-4.png" 
                  alt="Print and pattern design collage showcasing motifs and garment applications" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>

            {/* Right: Content (shown first on mobile/tablet) */}
            <div className="flex flex-col justify-center order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Print & Pattern Design</h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] leading-relaxed">
                Print and pattern design plays a vital role in shaping the identity of a fashion collection. Beyond fabric and form, prints tell stories, evoke emotions, and add a distinctive signature to garments. From intricate motifs to bold graphics, patterns transform simple silhouettes into statement pieces, reflecting cultural influences, seasonal moods, and artistic innovation. As a core element of fashion design, print and pattern work elevates creativity, giving depth, texture, and personality to every collection.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => { setPrintsOpen(true); document.body.style.overflow = 'hidden'; }}
                  className="inline-flex items-center justify-center rounded-full border border-[#CBB49A] text-[#CBB49A] px-7 py-3.5 text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b7a078] hover:text-[#b7a078]"
                >
                  View Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BILL OF MATERIAL (BOM) SECTION */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Bill of Material ( BOM )</h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg text-[#5C5C5C] leading-relaxed">
                A Bill of Materials (BOM) of a garment is a detailed list of all the raw materials, components, and trims required to produce a specific garment style. It serves as a blueprint for manufacturers, ensuring that every element needed for production is identified in the correct quantity and specification. The BOM helps in costing, sourcing, inventory planning, and production accuracy. By clearly documenting all components, it reduces errors, ensures quality, and makes the garment manufacturing process efficient and transparent.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => { setBomOpen(true); document.body.style.overflow = 'hidden'; }}
                  className="inline-flex items-center justify-center rounded-full border border-[#CBB49A] text-[#CBB49A] px-7 py-3.5 text-sm sm:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b7a078] hover:text-[#b7a078]"
                  aria-label="View Sample Bill of Materials PDF"
                >
                  View Sample
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
              <div className="relative w-full h-full min-h-[22rem]">
                <Image 
                  src="/services/design/design-5.png" 
                  alt="Bill of Materials for garments showing trims, labels, and fabric components" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES – GRID (below Why Choose section) */}
      <section id="client-case-studies" className="relative bg-white py-12 sm:py-16 md:py-20">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
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
                { brand: "Badria Al Shihhi", location: "Seeb, Oman", logo: "/brands/badria-al-shihhi-logo.png", href: "/case-studies/badri-al-shihhi", desc: "End‑to‑end fashion design from concept through to production for retail launch.", image: "/brands/badriaalshihhi-coverimage.jpg" },
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
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
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
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