import Image from "next/image";
import { Gift, Workflow, Rocket, BadgePercent, Palette, Smile, TrendingUp, Truck } from "lucide-react";

const benefits = [
  {
    icon: Gift,
    title: "Free Design & Tech Pack",
    desc: "We offer initial design and tech packs at no cost.",
  },
  {
    icon: Workflow,
    title: "Unified Process",
    desc: "Eliminate vendor coordination — we manage it all.",
  },
  {
    icon: Rocket,
    title: "Faster Launch",
    desc: "Integrated execution reduces turnaround time.",
  },
  {
    icon: BadgePercent,
    title: "Cost Smart",
    desc: "Lower overhead, higher value for your investment.",
  },
  {
    icon: Palette,
    title: "Brand Alignment",
    desc: "Your vision is preserved at every stage.",
  },
  {
    icon: Smile,
    title: "Less Stress",
    desc: "We handle complexities, you focus on growth.",
  },
  {
    icon: TrendingUp,
    title: "Scalable for Startups",
    desc: "Built for agile scaling from prototype to production.",
  },
  {
    icon: Truck,
    title: "Seamless Logistics",
    desc: "Complete warehousing and delivery solutions for timely, secure product distribution.",
  },
];

export default function WhatWeDo() {
  return (
    <section className="w-full bg-[#FAF9F7] py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-12 sm:mb-16 relative">
          What We Do
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#6BA292] rounded-full"></div>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 auto-rows-fr">
          {/* Design Services Card (top-left) */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border flex flex-col overflow-hidden" style={{fontFamily: 'Inter, Graphik, sans-serif'}}>
            <div className="w-full h-40 sm:h-48 md:h-56 relative">
              <Image src="/brands/design.jpg" alt="Design Services" fill className="object-cover object-center" />
            </div>
            <div className="flex flex-col justify-between p-4 sm:p-6 md:p-8 flex-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-[#2D2A2E]">Design Services</h3>
              <p className="text-sm sm:text-base text-[#3D3846] mb-4">Transform your ideas into fashion-forward designs with our expert team.</p>
              <a href="#" className="text-[#6BA292] font-semibold underline underline-offset-2 hover:text-[#5A8A7A] transition-colors duration-200 w-fit text-sm sm:text-base">Read more &rarr;</a>
            </div>
          </div>
          {/* End-to-End Service Card (right, spanning both rows) */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-[#F6F1EB] flex flex-col overflow-hidden lg:row-span-2" style={{fontFamily: 'Inter, Graphik, sans-serif'}}>
            <div className="w-full h-48 sm:h-56 md:h-full relative min-h-[200px]">
              <Image src="/brands/end-to-end.jpg" alt="End-to-End Service" fill className="object-cover object-center" />
            </div>
            <div className="flex flex-col justify-between p-4 sm:p-6 md:p-8 flex-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-[#2D2A2E]">End-to-End Service</h3>
              <p className="text-sm sm:text-base md:text-lg text-[#3D3846] mb-4">Complete production support from concept to delivery — all under one roof.</p>
              <a href="#" className="text-[#6BA292] font-semibold underline underline-offset-2 hover:text-[#5A8A7A] transition-colors duration-200 w-fit text-sm sm:text-base">Read more &rarr;</a>
            </div>
          </div>
          {/* Manufacturing Card (bottom-left, above supportive text) */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border flex flex-col overflow-hidden" style={{fontFamily: 'Inter, Graphik, sans-serif'}}>
            <div className="w-full h-40 sm:h-48 md:h-56 relative">
              <Image src="/brands/manufacturing.jpg" alt="Manufacturing" fill className="object-cover object-center" />
            </div>
            <div className="flex flex-col justify-between p-4 sm:p-6 md:p-8 flex-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-[#2D2A2E]">Manufacturing</h3>
              <p className="text-sm sm:text-base text-[#3D3846] mb-4">Seamless manufacturing from samples to full-scale production.</p>
              <a href="#" className="text-[#6BA292] font-semibold underline underline-offset-2 hover:text-[#5A8A7A] transition-colors duration-200 w-fit text-sm sm:text-base">Read more &rarr;</a>
            </div>
          </div>
        </div>

        {/* --- New Elegant Subsection: Why Our End-to-End Services Work --- */}
        <div className="w-full mt-16 sm:mt-20 md:mt-24 lg:mt-32 mb-4 md:mb-12 px-2 md:px-0">
          <div className="text-center w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-[#2D2A2E] mb-3 sm:mb-4">Why Our End-to-End Services Work</h2>
            <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed mb-8 sm:mb-10 px-4">
              We simplify your production journey — with one integrated process from design to delivery. Here&apos;s what you gain by partnering with us.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
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
        {/* --- End Elegant Subsection --- */}
      </div>
    </section>
  );
} 