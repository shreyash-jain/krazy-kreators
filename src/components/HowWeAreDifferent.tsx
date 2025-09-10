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

interface HowWeAreDifferentProps {
  onStartProjectClick?: () => void;
}

export default function HowWeAreDifferent({ onStartProjectClick }: HowWeAreDifferentProps) {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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

        {/* Comparison Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E8E4DD] overflow-hidden mb-12 sm:mb-14 md:mb-16">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden lg:block bg-gradient-to-r from-[#F8F7F4] to-[#F0EDE8] p-6 sm:p-8 border-b border-[#E8E4DD]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-[#2D2A2E] mb-2">Feature</h3>
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-[#2D2A2E] mb-2">Krazy Kreators</h3>
                <div className="w-12 h-1 bg-[#CBB49A] mx-auto rounded-full"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-[#2D2A2E] mb-2">Traditional Vendors</h3>
                <div className="w-12 h-1 bg-gray-400 mx-auto rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-[#E8E4DD]">
            {comparisonData.map((item, index) => (
              <div key={index} className="p-4 sm:p-6 md:p-8 hover:bg-[#F8F7F4]/50 transition-colors">
                {/* Mobile Layout - Stacked with inline headers */}
                <div className="lg:hidden space-y-4">
                  {/* Feature Name */}
                  <div className="text-center">
                    <h4 className="text-base sm:text-lg font-bold text-[#2D2A2E] mb-1">{item.feature}</h4>
                    <p className="text-xs sm:text-sm text-[#3D3846]/70 font-medium">{item.subtext}</p>
                  </div>
                  
                  {/* Krazy Kreators Benefit */}
                  <div className="bg-[#F8F7F4]/30 rounded-lg p-4 border-l-4 border-[#CBB49A]">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators:</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 border border-green-200">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm sm:text-base text-[#3D3846] font-medium">{item.krazyKreators}</span>
                    </div>
                  </div>
                  
                  {/* Traditional Vendor Limitation */}
                  <div className="bg-gray-50/30 rounded-lg p-4 border-l-4 border-gray-400">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-[#2D2A2E]">Traditional Vendors:</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 border border-red-200">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm sm:text-base text-[#3D3846] font-medium">{item.others}</span>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Layout - Grid */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-4 sm:gap-6 items-center">
                  {/* Feature Name */}
                  <div className="text-center lg:text-left">
                    <h4 className="text-base sm:text-lg font-bold text-[#2D2A2E] mb-1">{item.feature}</h4>
                    <p className="text-xs sm:text-sm text-[#3D3846]/70 font-medium">{item.subtext}</p>
                  </div>
                  
                  {/* Krazy Kreators Benefit */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 border border-green-200">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm sm:text-base text-[#3D3846] font-medium">{item.krazyKreators}</span>
                    </div>
                  </div>
                  
                  {/* Traditional Vendor Limitation */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 border border-red-200">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm sm:text-base text-[#3D3846] font-medium">{item.others}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
          <button 
            onClick={onStartProjectClick}
            className="inline-flex items-center gap-2 bg-[#CBB49A] hover:bg-[#B8A189] text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 group text-sm sm:text-base transform hover:scale-105"
          >
            START YOUR PROJECT
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
} 