"use client";

import { UsersRound, Brush, Clock } from "lucide-react";

const benefits = [
  {
    icon: UsersRound,
    title: "Direct Collaboration",
    description: "Real people. Real conversations. Real progress.",
  },
  {
    icon: Brush,
    title: "Design-Aligned Execution",
    description: "Designers who speak your brand's language.",
  },
  {
    icon: Clock,
    title: "Faster Decisions",
    description: "Stay ahead with streamlined approvals and clarity.",
  },
];

export default function DedicatedTeam() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Section Header - Centered */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-[#2D2A2E] mb-4 sm:mb-6 leading-tight relative">
                Your Own Project Manager & Design Team
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#6BA292] rounded-full"></div>
              </h2>
          <p className="text-[#3D3846]/80 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                At Krazy Kreators, you&apos;re never just handed off to a process. You&apos;re paired with a dedicated project manager and design team from day one — a team that becomes an extension of yours. From refining your vision to execution, we guide you every step of the way.
              </p>
            </div>

        {/* Content Grid - Centered */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Benefit Cards */}
            <div className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-[#F8F7F4] to-[#F0EDE8] rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/60 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#2D2A2E]" />
                      </div>
                                         <div className="text-left">
                        <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E] mb-1">
                          {benefit.title}
                        </h3>
                        <p className="text-[#3D3846]/70 text-sm sm:text-base">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Right Column - PM Illustration */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-gradient-to-br from-[#F8F7F4] to-[#F0EDE8] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 h-[400px] sm:h-[480px] md:h-[520px] flex items-center justify-center">
              <img 
                src="/brands/client-pm.png" 
                alt="Project Manager and Design Team collaboration illustration" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 