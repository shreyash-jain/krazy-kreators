"use client";

import { PenTool, Package, Factory, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Design Collaboration",
    desc: "Your journey begins with a collaborative design session where our expert team works closely with you to understand your vision, brand identity, and market requirements. We translate your ideas into detailed technical specifications and mood boards.",
    icon: PenTool,
  },
  {
    number: "02",
    title: "Sampling & Sourcing",
    desc: "We create detailed samples using premium materials sourced from our network of trusted suppliers. Each sample undergoes rigorous testing and refinement to ensure it meets your exact specifications and quality standards.",
    icon: Package,
  },
  {
    number: "03",
    title: "Bulk Production",
    desc: "With approved samples and sourced materials, we begin full-scale production in our state-of-the-art facilities. Our production team ensures consistent quality across every piece while maintaining strict timelines and quality control protocols.",
    icon: Factory,
  },
  {
    number: "04",
    title: "Quality Check & Dispatch",
    desc: "Every piece undergoes our rigorous quality control process before being carefully packaged and prepared for dispatch. We coordinate with logistics partners to ensure timely delivery to your specified locations worldwide.",
    icon: Truck,
  },
];

export default function FromDesignToShelf() {
  return (
    <section className="w-full bg-[#F8F7F4] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-3 sm:mb-4">
          From Design to Shelf in 4 Months
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg text-[#3D3846] max-w-2xl mx-auto mb-12 sm:mb-14 md:mb-16 px-4">
          Experience the complete journey of your fashion collection, from initial concept to final delivery, with transparent tracking at every step.
        </p>
        <div className="relative flex flex-col gap-10 sm:gap-12 md:gap-16 lg:gap-20">
          {/* Vertical line connector - hidden on mobile, visible on larger screens */}
          <div className="hidden md:block absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CBB49A]/30 to-[#CBB49A] z-0" />
          
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {/* Mobile Layout - Stacked */}
                <div className="md:hidden">
                  <div className="flex flex-col items-center text-center mb-6">
                    {/* Number badge */}
                    <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-[#CBB49A] text-[#CBB49A] font-bold text-xl shadow-sm mb-4">
                      {step.number}
                    </span>
                    {/* Icon and title */}
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-6 h-6 text-[#6BA292]" />
                      <h3 className="text-lg font-bold text-[#2D2A2E] font-sans">{step.title}</h3>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-[#3D3846] font-sans opacity-90 leading-relaxed max-w-sm">
                      {step.desc}
                    </p>
                    {/* Connector line - only show if not last item */}
                    {i < steps.length - 1 && (
                      <div className="w-0.5 h-8 bg-gradient-to-b from-[#CBB49A] to-[#CBB49A]/30 mt-6" />
                    )}
                  </div>
                </div>

                {/* Desktop Layout - Horizontal */}
                <div className="hidden md:flex items-start lg:items-center gap-10">
                  {/* Number badge and connector */}
                  <div className="flex flex-col items-center z-10">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-[#CBB49A] text-[#CBB49A] font-bold text-lg lg:text-xl shadow-sm mb-2">
                      {step.number}
                    </span>
                    {i < steps.length - 1 && (
                      <span className="w-0.5 flex-1 bg-dotted bg-[#CBB49A]/40" style={{minHeight: '40px', marginTop: '0.25rem'}} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-7 h-7 text-[#6BA292]" />
                      <h3 className="text-lg lg:text-xl font-bold text-[#2D2A2E] font-sans mb-0">{step.title}</h3>
                    </div>
                    <p className="text-base lg:text-lg text-[#3D3846] font-sans opacity-90 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <style jsx>{`
          .bg-dotted {
            background-image: repeating-linear-gradient(
              to bottom,
              #CBB49A 0 2px,
              transparent 2px 12px
            );
          }
        `}</style>
      </div>
    </section>
  );
} 