"use client";

import { Check, X, ArrowRight } from "lucide-react";

const comparisonData = [
  {
    feature: "End-to-end Support",
    subtext: "From design to dispatch",
    krazyKreators: "Complete journey support",
    others: "Fragmented services",
  },
  {
    feature: "No or Low MOQ",
    subtext: "For emerging brands",
    krazyKreators: "Flexible minimums",
    others: "High MOQ requirements",
  },
  {
    feature: "Real-time Tracking",
    subtext: "Dedicated dashboard",
    krazyKreators: "Live project updates",
    others: "Limited visibility",
  },
  {
    feature: "Transparent Costing",
    subtext: "With tech pack access",
    krazyKreators: "Full cost breakdown",
    others: "Hidden fees & charges",
  },
  {
    feature: "Creative Collaboration",
    subtext: "Personalized approach",
    krazyKreators: "Direct designer access",
    others: "Generic solutions",
  },
  {
    feature: "Expert Procurement",
    subtext: "Material & QC-led",
    krazyKreators: "Quality-first sourcing",
    others: "Basic quality checks",
  },
  {
    feature: "Brand Guidance",
    subtext: "Educational resources",
    krazyKreators: "Growth partnership",
    others: "Transactional only",
  },
];

export default function HowWeAreDifferent() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
        {/* Title Block */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-3 sm:mb-4 relative">
            How Krazy Kreators is Different
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#6BA292] rounded-full"></div>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-2xl mx-auto px-4">
            See why emerging and established brands choose us over traditional manufacturing vendors.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-14 md:mb-16">
          {/* Krazy Kreators Column */}
          <div className="bg-gradient-to-br from-[#F8F7F4] to-[#F0EDE8] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#E8E4DD]">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#2D2A2E] mb-2">Your Creative Partner</h3>
              <div className="w-12 sm:w-16 h-1 bg-[#CBB49A] mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {comparisonData.map((item, index) => (
                <div key={index} className="bg-white/60 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/40">
                  <div className="mb-3 text-center sm:text-left">
                    <h4 className="text-base sm:text-lg font-bold text-[#2D2A2E] mb-1">{item.feature}</h4>
                    <p className="text-xs sm:text-sm text-[#3D3846]/70 font-medium">{item.subtext}</p>
                  </div>
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 border border-green-200">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#3D3846] font-medium">{item.krazyKreators}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Others Column */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#E8E4DD]">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#2D2A2E] mb-2">Traditional Vendors</h3>
              <div className="w-12 sm:w-16 h-1 bg-gray-300 mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {comparisonData.map((item, index) => (
                <div key={index} className="bg-gray-50/60 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100">
                  <div className="mb-3 text-center sm:text-left">
                    <h4 className="text-base sm:text-lg font-bold text-[#2D2A2E] mb-1">{item.feature}</h4>
                    <p className="text-xs sm:text-sm text-[#3D3846]/70 font-medium">{item.subtext}</p>
                  </div>
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 border border-red-200">
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#3D3846] font-medium">{item.others}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Block */}
        <div className="bg-gradient-to-r from-[#2D2A2E] to-[#3D3846] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center text-white">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">
            Ready to experience the difference?
          </h3>
          <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Let&apos;s bring your fashion vision to life.
          </p>
          <button className="inline-flex items-center gap-2 bg-[#CBB49A] hover:bg-[#B8A189] text-[#2D2A2E] font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 group text-sm sm:text-base transform hover:scale-105">
            START YOUR PROJECT
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
} 