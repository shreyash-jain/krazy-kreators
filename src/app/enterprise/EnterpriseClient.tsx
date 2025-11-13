"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Building2, Users, Shield, TrendingUp, CheckCircle2, ArrowRight, Eye, Boxes, Clock, MessageSquare, ShieldCheck, UserCog, BarChart3, LayoutDashboard, Palette, Scissors, Package, UserCheck, Truck, Zap, Search, BarChart, Lightbulb, CheckCircle, Headphones, Globe, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard from "@/components/TestimonialCard";

const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

export default function EnterpriseClient() {
  const [contactOpen, setContactOpen] = useState(false);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://krazykreators.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Enterprise Solutions",
        "item": "https://krazykreators.com/enterprise"
      }
    ]
  };

  // Case studies slider using shared TestimonialCard component (matches case study pages)
  const CaseStudiesSlider: React.FC<{ caseStudies: { videoSrc: string; paragraphs: string[]; client: string; role: string }[] }>
    = ({ caseStudies }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);
    const total = caseStudies.length;

    const prev = () => setActiveIndex((i) => (i - 1 + total) % total);
    const next = () => setActiveIndex((i) => (i + 1) % total);

    const item = caseStudies[activeIndex];

    const handleVideoPlay = (index: number) => {
      setPlayingVideoIndex((curr) => (curr === index ? null : index));
    };

    return (
      <div>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center">
          {/* Left: video using shared component for identical sizing/behavior */}
          <TestimonialCard
            index={activeIndex}
            videoSrc={item.videoSrc}
            clientName={item.client}
            brandName=""
            location=""
            isPlaying={playingVideoIndex === activeIndex}
            onVideoPlay={handleVideoPlay}
            setVideoRef={() => {}}
            setCardRef={() => {}}
            variant="minimal"
            className="max-w-md w-full mx-auto"
            videoContainerClassName="relative w-full aspect-[4/5]"
            videoClassName="w-full h-full object-cover"
          />

          {/* Right: testimonial text */}
          <div>
            <div className="space-y-6 text-base sm:text-lg text-[#3A3A3A] leading-relaxed">
              {item.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            <div className="pt-8 mt-8 border-t border-[#E0D9D0]">
              <h3 className="text-xl font-semibold text-[#2D2A2E] mb-1">{item.client}</h3>
              <p className="text-[#CBB49A] font-medium">{item.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation below content */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={prev} className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-[#E0D9D0] text-[#2D2A2E] bg-white hover:bg-[#F3EFE9]">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {caseStudies.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === activeIndex ? 'bg-[#CBB49A]' : 'bg-[#D6CEC5]'}`} />
            ))}
          </div>
          <button onClick={next} className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-[#E0D9D0] text-[#2D2A2E] bg-white hover:bg-[#F3EFE9]">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const enterpriseFeatures = [
    {
      icon: Building2,
      title: "Scalable Production",
      description: "Handle large-scale manufacturing with advanced production capabilities and streamlined processes."
    },
    {
      icon: Users,
      title: "Dedicated Teams",
      description: "Assigned project managers and specialized teams for enterprise-level support and communication."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Rigorous quality control systems and compliance standards for enterprise requirements."
    },
    {
      icon: TrendingUp,
      title: "Supply Chain Management",
      description: "End-to-end supply chain optimization with real-time tracking and inventory management."
    }
  ];

  const painPoints = [
    {
      icon: Users,
      title: "Vendor Management Overhead",
      description: "Coordinating multiple suppliers takes time and can delay launches.",
    },
    {
      icon: Eye,
      title: "Lack of Visibility",
      description: "Limited real-time production insights make it hard to assure stakeholders.",
    },
    {
      icon: Boxes,
      title: "High MOQs",
      description: "Large minimum orders increase inventory risk and reduce flexibility.",
    },
    {
      icon: ShieldCheck,
      title: "Quality & Compliance Concerns",
      description: "Ensuring ethical, consistent production is critical for brand reputation.",
    },
    {
      icon: Clock,
      title: "Slow Turnaround",
      description: "Long development cycles risk missing trends.",
    },
    {
      icon: MessageSquare,
      title: "Communication Gaps",
      description: "Time zones, language, and indirect communication hinder smooth collaboration.",
    },
  ];


	// In‑view animation trigger for pain points list
	const painRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const el = painRef.current;
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					// Animation trigger logic can be added here if needed
				}
			},
			{ threshold: 0.15 }
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

  const whyUs = [
    {
      icon: UserCog,
      title: "Dedicated Project Manager",
      description: "Your single point of contact ensures smooth, streamlined communication.",
    },
    {
      icon: Users,
      title: "End-to-End Team Setup",
      description: "Designers, textile engineers, pattern masters, QC, sourcing, and logistics in one team.",
    },
    {
      icon: BarChart3,
      title: "Scalable Capacity",
      description: "20,000 pcs/month in-house to 100,000+ via our trusted partner network.",
    },
    {
      icon: ShieldCheck,
      title: "Global Compliance",
      description: "SMETA/WRAP audited facilities, AQL checks, and international Incoterms adherence.",
    },
    {
      icon: LayoutDashboard,
      title: "Tech-Enabled Tracking",
      description: "Real-time dashboards, order tracking, reports, and communication tools for transparency.",
    },
  ];

  const teamStructure = [
    {
      tier: "Design Team",
      icon: Palette,
      roles: ["Fashion Designers", "Textile Designers", "Trend Researchers", "Illustrators"],
      description: "Creative vision and material expertise",
    },
    {
      tier: "Production Team",
      icon: Scissors,
      roles: ["Sourcing Experts", "Fabric Managers", "Pattern Masters", "Tailors", "Textile Engineer"],
      description: "End-to-end manufacturing execution",
    },
    {
      tier: "Quality & Logistics",
      icon: Package,
      roles: ["QC Managers", "Store Managers", "Shipping Managers", "Checkers"],
      description: "Quality assurance and delivery excellence",
    },
  ];

  const howWeWork = [
    {
      step: "01",
      icon: Palette,
      title: "Collaborative Design & Development",
      description: "Work with in-house or external design teams to translate ideas into reality. From trend research to tech packs, over 3,000+ prototypes developed to date.",
    },
    {
      step: "02",
      icon: Package,
      title: "Sampling & Material Sourcing",
      description: "Rapid sample production with vetted suppliers and iterative approval cycles for faster decision-making.",
    },
    {
      step: "03",
      icon: Building2,
      title: "Scaled Bulk Production",
      description: "Leverage both in-house capacity and partner factories to produce large volumes without compromising quality.",
    },
    {
      step: "04",
      icon: ShieldCheck,
      title: "Quality Control at Every Step",
      description: "Multi-stage inspections, AQL checks, and full compliance with international quality standards.",
    },
    {
      step: "05",
      icon: LayoutDashboard,
      title: "Transparent Project Management",
      description: "A dedicated Project Manager and live client dashboard keep you updated in real-time.",
    },
    {
      step: "06",
      icon: Truck,
      title: "Streamlined Logistics & Delivery",
      description: "From global shipping and warehousing to customs — everything handled seamlessly for on-time delivery.",
    },
  ];

  const enterpriseBenefits = [
    {
      icon: Zap,
      title: "Faster Time-to-Market",
      description: "Compress development cycles and launch collections faster.",
    },
    {
      icon: Search,
      title: "End-to-End Transparency",
      description: "Track every stage of production through dashboards and live updates.",
    },
    {
      icon: BarChart,
      title: "Scalable & Flexible Production",
      description: "Low or no MOQs enable pilot runs and seamless scale-ups.",
    },
    {
      icon: Lightbulb,
      title: "One-Stop Convenience",
      description: "A single partner managing everything from design to delivery.",
    },
    {
      icon: CheckCircle,
      title: "Quality & Consistency",
      description: "Engineered quality control with in-line inspections from the design stage.",
    },
    {
      icon: Headphones,
      title: "Dedicated Support & Expertise",
      description: "Proactive consultation and on-ground guidance from experienced specialists.",
    },
    {
      icon: Globe,
      title: "Global Reach with Compliance",
      description: "Sustainably operated, internationally compliant facilities meeting global standards.",
    },
    {
      icon: DollarSign,
      title: "Cost Efficiency & Predictability",
      description: "Transparent pricing, reduced overhead, and flexible retainer models for enterprises.",
    },
  ];

  // Case studies / testimonials data
  const caseStudies = [
    {
      videoSrc: "/testimonial/badria-testimonial.mp4",
      paragraphs: [
        "Krazy Kreators didn't just help me build a brand — they helped me tell my story. As a woman from Oman with a vision for modest, elegant fashion, I needed a partner who truly understood both my cultural values and my creative aspirations.",
        "What impressed me most was their ability to translate my personal style into a cohesive brand identity. They took my love for cultural sophistication and created something that feels both timeless and contemporary. Every piece reflects the elegance I envisioned.",
        "The journey from concept to launch was seamless. They handled everything — from fabric sourcing to production — with such care and attention to detail. My brand now stands as a testament to what's possible when you have the right creative partner.",
      ],
      client: "Badria Al Shihhi",
      role: "Founder, Badria Al Shihhi",
    },
    {
      videoSrc: "/testimonial/las-testimonial.mp4",
      paragraphs: [
        "Working with Krazy Kreators was a game-changer for Las Loungewear. They didn't just understand my vision — they elevated it. From the initial concept to the final product, every step was executed with precision and creativity.",
        "The attention to detail in fabric selection, the innovative compression technology, and the sophisticated design elements exceeded my expectations. They truly became a partner in building my brand, not just a vendor.",
        "The end result is exactly what I envisioned: premium travelwear that feels luxurious and performs perfectly. Our customers love the quality and comfort, and I couldn't be happier with the partnership.",
      ],
      client: "Anika McKelvey",
      role: "Founder, Las Loungewear",
    },
    {
      videoSrc: "/testimonial/testimonial-1.mp4",
      paragraphs: [
        "Working with Krazy Kreators was transformative for Tilted Lotus. They didn't just understand my cultural vision — they elevated it to new heights. From the initial concept to the NYFW runway, every step was executed with precision and cultural sensitivity.",
        "The attention to detail in preserving South Asian artistic traditions while creating contemporary silhouettes exceeded my expectations. They truly became partners in bringing my cultural heritage to life in modern fashion.",
        "The end result is exactly what I envisioned: a brand that celebrates cultural diversity while maintaining contemporary appeal. Our customers love the authenticity and quality, and I couldn't be happier with the partnership.",
      ],
      client: "Preeti Gore",
      role: "Founder, Tilted Lotus",
    },
  ];

  // Lazy subcomponent to keep main render readable
  const BenefitsContent: React.FC = () => {
    // First four (icon + text strip over subtle band)
    const first = enterpriseBenefits.slice(0, 4);
    const next = enterpriseBenefits.slice(4);

    return (
      <div>
        {/* Subtle band with reduced soft edges */}
        <div className="mb-10">
          <div className="rounded-2xl bg-[#F8F5EE] px-4 sm:px-6 py-5">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {first.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.title} className="flex items-start gap-3 min-h-[130px]">
                    <span className="mt-0.5 inline-flex items-center justify-center w-10 h-10 aspect-square rounded-md bg-[#6BA292]/10 text-[#6BA292]">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span>
                      <p className="font-semibold text-[#2D2A2E]">{b.title}</p>
                      <p className="text-sm text-[#5C5C5C] leading-relaxed">{b.description}</p>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Zigzag / staggered two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {next.map((b, i) => {
            const Icon = b.icon;
            const alignRight = i % 2 === 1;
            return (
              <div key={b.title} className="relative p-6 rounded-2xl bg-[#F8F5EE] border border-[#ECE9E2] shadow-sm">
                {/* Accent line */}
                <div className={`absolute top-0 ${alignRight ? 'right-6' : 'left-6'} h-1 w-12 bg-[#CBB49A] rounded-full`} />
                <div className={`flex ${alignRight ? 'flex-row-reverse text-right' : ''} items-start gap-4`}>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <Icon className="w-6 h-6" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#2D2A2E]">{b.title}</p>
                    <p className="text-sm text-[#5C5C5C]">{b.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing micro-CTA */}
        <div className="text-center mt-12">
          <p className="text-[#2D2A2E] text-sm italic">&ldquo;Empowering enterprise fashion — faster, smarter, and globally compliant.&rdquo;</p>
        </div>
      </div>
    );
  };

  return (
    <main className="w-full bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero Section */}
      <section className="kk-hero-dark relative w-full bg-white min-h-screen flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image 
            src="/services/enterprise/enterprise-hero.jpg" 
            alt="Krazy Kreators dedicated design and production team" 
            fill 
            priority 
            sizes="100vw" 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-24 sm:py-28 md:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">
            Hire Your Design & Production Team
          </h1>
          <h2 className="mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-normal">
            Your end-to-end partner for global fashion collections, from trend research to timely delivery.
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setContactOpen(true); }} 
              className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5"
            >
              Book a Consultation
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setContactOpen(true); }} 
              className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/50 hover:bg-white/30 px-7 text-sm sm:text-base font-semibold transition-all duration-300"
            >
              Onboard Your Team
            </a>
          </div>
        </div>
      </section>


      {/* Enterprise Features Section */}
      <section id="enterprise-features" className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">
              Enterprise-Grade Solutions
            </h2>
            <p className="text-base sm:text-lg text-[#5C5C5C] max-w-3xl mx-auto">
              Built for scale, designed for success. Our enterprise solutions are tailored for large-scale fashion operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enterpriseFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECE9E2] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#6BA292]/10 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-[#6BA292]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2D2A2E] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#5C5C5C]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem / Pain Points */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">The Challenges Big Fashion Brands Face</h2>
            <p className="mt-5 text-base sm:text-lg text-[#5C5C5C] max-w-3xl mx-auto leading-relaxed">
              Enterprise brands operate in a high‑speed market with tight deadlines, complex supplier networks, and non‑negotiable quality standards. Without the right systems, teams face overproduction, wasted inventory, and missed trends.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: editorial list */}
            <div ref={painRef} className="flex flex-col justify-center">
              <ul className="divide-y divide-[#ECE9E2]">
                {painPoints.map((p) => {
                  const Icon = p.icon;
                  return (
                    <li
                      key={p.title}
                      className="flex gap-4 py-4"
                    >
                      <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#6BA292]/10 text-[#6BA292]">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="font-semibold text-[#2D2A2E] text-base sm:text-lg">{p.title}</p>
                        <p className="text-sm text-[#5C5C5C] leading-relaxed">{p.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* Right: image */}
            <div className="relative flex justify-center">
              <div className="relative aspect-[3/4] w-full max-w-md rounded-2xl overflow-hidden">
                <Image
                  src="/services/enterprise/enterprise-the-challenges-big-enterprise-face.jpg"
                  alt="Challenges enterprise fashion brands face in operations and supply chain"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Enterprise Clients Work With Us */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Why Big Brands Partner With Krazy Kreators</h2>
            <p className="mt-4 text-base sm:text-lg text-[#5C5C5C] max-w-3xl mx-auto">We provide enterprise brands with a seamless, end-to-end solution — combining expertise, scalability, and technology to simplify complex fashion supply chains.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
            {whyUs.map((w, i) => {
              const Icon = w.icon;
              const spanCls = i < 3 ? "lg:col-span-2" : "lg:col-span-3";
              return (
                <div key={i} className={`group rounded-2xl border border-[#EEE8F6] bg-white p-6 shadow-sm hover:shadow-md transition-all ${spanCls}`}>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#6BA292]/10 text-[#6BA292] group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E]">{w.title}</h3>
                  <p className="mt-2 text-sm text-[#5C5C5C]">{w.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Team You Get */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">The Team Behind Your Collection</h2>
            <p className="mt-4 text-base sm:text-lg text-[#5C5C5C] max-w-3xl mx-auto">When you onboard with Krazy Kreators, you don&apos;t just hire a vendor — you gain a full-scale design and production ecosystem working exclusively for your brand.</p>
          </div>

          {/* Team Structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamStructure.map((team, index) => {
              const Icon = team.icon;
              return (
                <div key={index} className="bg-white rounded-2xl border border-[#ECE9E2] p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-[#6BA292]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-[#6BA292]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">{team.tier}</h3>
                  <p className="text-[#5C5C5C] mb-4">{team.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {team.roles.map((role, roleIndex) => (
                      <span key={roleIndex} className="px-3 py-1 bg-[#FAF9F3] text-[#2D2A2E] rounded-full text-sm font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Client-Facing PM Section */}
          <div className="mt-20 pt-10 border-t border-[#ECE9E2]">
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#2D2A2E] mb-2">Your Dedicated Project Manager</h3>
              <p className="text-sm text-[#6BA292] font-medium">One contact. Full control. Zero chaos.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-[#6BA292]/5 to-[#CBB49A]/5 rounded-2xl p-8 border border-[#6BA292]/20">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#6BA292] rounded-full flex items-center justify-center">
                      <UserCheck className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h4 className="text-lg font-bold text-[#2D2A2E] mb-2">Dedicated Project Manager</h4>
                    <p className="text-[#5C5C5C]">Every client is assigned a Dedicated Project Manager — your single point of contact who coordinates across design, sourcing, production, and logistics to keep everything on track.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Solution / How We Work */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF9F3]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">How We Work — From Design to Delivery</h2>
            <p className="mt-4 text-base sm:text-lg text-[#5C5C5C] max-w-3xl mx-auto">Krazy Kreators delivers seamless design-to-delivery solutions for enterprise clients, ensuring every stage — from ideation to logistics — runs with precision and transparency.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {howWeWork.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative group bg-white rounded-2xl border border-[#ECE9E2] p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#6BA292]/30">
                  {/* Connecting line for desktop */}
                  {idx < howWeWork.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#6BA292]/40 to-transparent transform -translate-y-1/2 z-10"></div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#6BA292]/10 text-[#6BA292] font-semibold group-hover:bg-[#6BA292] group-hover:text-white transition-colors">
                      {item.step}
                    </div>
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6BA292]/10 text-[#6BA292] group-hover:bg-[#6BA292] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#2D2A2E] mb-2 group-hover:text-[#6BA292] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[#5C5C5C]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Benefits */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Enterprise Benefits That Set Us Apart</h2>
            <p className="mt-4 text-base sm:text-lg text-[#5C5C5C] max-w-3xl mx-auto">Partnering with Krazy Kreators means more than production support — it&apos;s about gaining speed, visibility, and reliability across your supply chain. We operate as an extension of your team.</p>
          </div>

          {/* Smooth in-view reveal */}
          <BenefitsContent />
        </div>
      </section>

      {/* Case Studies / Proof */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#F8F4EF]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Proven Success Stories from Global Fashion Brands</h2>
            <p className="mt-4 text-base sm:text-lg text-[#5C5C5C] max-w-3xl mx-auto">
              From emerging labels to global enterprises, Krazy Kreators has helped brands scale production, reduce lead times, and ensure uncompromised quality.
            </p>
          </div>

          {/* Featured highlight */}
          <div className="text-center mb-12">
            <p className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">
              How we helped an international brand scale from 5,000 to 50,000 pcs in 6 months — with zero shipment delays.
            </p>
          </div>

          {/* Testimonial slider */}
          <CaseStudiesSlider caseStudies={caseStudies} />

          {/* CTA */}
          <div className="text-center mt-14">
            <p className="text-base sm:text-lg text-[#2D2A2E]">
              See what working with Krazy Kreators feels like — book a consultation today.
            </p>
            <div className="mt-5">
              <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#CBB49A] text-white font-semibold">
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Krazy Kreators */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#333333] mb-4">
              Why Brands Choose Krazy Kreators
            </h2>
            <p className="text-base sm:text-lg text-[#666666] max-w-3xl mx-auto">
              Because building a successful fashion brand isn&apos;t just about production — it&apos;s about partnership, innovation, and trust.
            </p>
          </div>

          {/* Split editorial layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-center">
            {/* Left: Large image */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/services/enterprise/enterprise-why-brand-choose-krazy-kreators.jpg"
                  alt="Designer working on pattern making with precision tools"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right: Staggered text list */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="text-left lg:text-right">
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-bold text-[#333333]">Proven Track Record</span>
                </div>
                <p className="text-[#666666] text-sm">15+ years, 100,000+ garments delivered worldwide.</p>
              </div>

              <div className="text-left lg:ml-8">
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <Users className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-bold text-[#333333]">Holistic, Partner Mindset</span>
                </div>
                <p className="text-[#666666] text-sm">We become an extension of your team, anticipating needs.</p>
              </div>

              <div className="text-left lg:text-right">
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <Lightbulb className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-bold text-[#333333]">Innovation & Technology</span>
                </div>
                <p className="text-[#666666] text-sm">3D sampling, virtual prototyping, trend forecasting.</p>
              </div>

              <div className="text-left lg:ml-8">
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-bold text-[#333333]">Comparable or Better than the Best</span>
                </div>
                <p className="text-[#666666] text-sm">Tech-enabled, enterprise-grade with boutique attention.</p>
              </div>

              <div className="text-left lg:text-right">
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <Shield className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-bold text-[#333333]">Supply Chain Security</span>
                </div>
                <p className="text-[#666666] text-sm">Backup factories and risk-mitigation strategies.</p>
              </div>

              <div className="text-left lg:ml-8">
                <div className="inline-flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
                    <Globe className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-bold text-[#333333]">Sustainability & Compliance Focus</span>
                </div>
                <p className="text-[#666666] text-sm">Ethical, eco-friendly, and CSR-aligned.</p>
              </div>
            </div>
          </div>

          {/* Quote highlight bar */}
          <div className="mt-20 pt-10 border-t border-[#CBB49A]/20">
            <div className="text-center">
              <div className="w-16 h-0.5 bg-[#CBB49A] mx-auto mb-4"></div>
              <p className="text-lg font-medium text-[#333333] italic">
                &ldquo;Over 100 global brands trust Krazy Kreators for consistent quality and scalable growth.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Production + Delivery */}
      <section className="py-16 sm:py-20 md:py-24 bg-[#FAF6EF]">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#333333]">Production + Delivery: Where Design Meets Precision</h2>
            <p className="mt-4 text-base sm:text-lg text-[#5C5C5C] max-w-3xl mx-auto">
              From first stitch to final shipment — every stage is powered by quality checks, data-driven tracking, and global delivery excellence.
            </p>
          </div>

          {/* Timeline flow */}
          <div className="relative">
            {/* connector line */}
            <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-px border-t border-dotted border-[#CBB49A]" aria-hidden></div>

            <ul className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12 relative">
              {[
                { icon: Boxes, title: 'Material Procurement', desc: 'Vetted suppliers, eco-certified fabrics.' },
                { icon: Building2, title: 'Production Setup', desc: 'Line planning, capacity allocation, workflow mapping.' },
                { icon: ShieldCheck, title: 'Quality Assurance', desc: 'Multi-stage AQL checks and inline inspections.' },
                { icon: Package, title: 'Packaging & Labelling', desc: 'Brand tags, barcodes, and export compliance.' },
                { icon: Truck, title: 'Dispatch & Logistics', desc: 'Coordinated shipments and partner carriers.' },
                { icon: Globe, title: 'Global Delivery', desc: 'Doorstep delivery under international Incoterms.' },
              ].map((s, i) => {
                const Icon = s.icon as React.ComponentType<{ className?: string }>;
                const even = i % 2 === 1; // alternate alignment
                const stepNumber = String(i + 1).padStart(2, "0");
                return (
                  <li key={s.title} className="relative py-5 sm:py-6 lg:flex lg:flex-col lg:items-center lg:text-center">
                    {/* Mobile simplified view */}
                    <div className="lg:hidden flex items-start gap-4 text-left">
                      <span className="text-sm font-semibold text-[#CBB49A] leading-none mt-1">{stepNumber}</span>
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm text-[#6BA292] border border-[#ECE9E2] flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="text-sm text-[#333333] leading-relaxed">
                        <p className="font-semibold text-[#333333]">{s.title}</p>
                        <p className="text-xs text-[#5C5C5C] mt-1 leading-[1.5]">{s.desc}</p>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className={`hidden lg:flex ${even ? 'flex-col-reverse' : 'flex-col'} items-center gap-8 p-4`}>
                      <div className={`max-w-[15rem] ${even ? 'mt-4' : 'mb-4'}`}>
                        <p className="text-sm font-semibold text-[#333333]">{s.title}</p>
                        <p className="text-xs text-[#5C5C5C] mt-1 leading-[1.4]">{s.desc}</p>
                      </div>
                      <span className={`inline-flex items-center justify-center size-12 rounded-xl bg-white shadow-sm text-[#6BA292] border border-[#ECE9E2] my-4`}>
                        <Icon className="w-5 h-5" />
                      </span>
                    </div>

                    {/* Desktop connector node */}
                    <span className="hidden lg:block absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#CBB49A] shadow" aria-hidden></span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Metrics strip */}
          <div className="mt-14 rounded-xl bg-[#F1EBE1] border border-[#E7E0D6] py-4 px-5">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[#333333] text-sm sm:text-base">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#6BA292]" />
                <span>98% on-time delivery rate</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <Package className="w-5 h-5 text-[#6BA292]" />
                <span>100,000+ garments shipped worldwide</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#6BA292]" />
                <span>15+ years of production excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (match design-services) */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">Build the Future of Fashion, Together</h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-[#3D3846]">Collaborate with Krazy Kreators for end-to-end solutions — from design innovation to timely, compliant global delivery.</p>
            <div className="mt-6">
              <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }} className="inline-flex items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5">Start Your Partnership</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}
