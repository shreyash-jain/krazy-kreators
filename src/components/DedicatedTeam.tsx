"use client";

import { UsersRound, Brush, Clock, UserCheck, Palette, PenTool, Scissors, Ruler, Sparkles, Shirt } from "lucide-react";

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

// Define positions for 6 points in a circle (60° apart)
type Position = 'top' | 'top-right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'top-left';

const designTeamRoles = [
  { icon: Palette, label: "Fashion Designer", position: 'top' as Position },
  { icon: PenTool, label: "Graphic Designer", position: 'top-right' as Position },
  { icon: Sparkles, label: "Textile Expert", position: 'bottom-right' as Position },
  { icon: Ruler, label: "Pattern Master", position: 'bottom' as Position },
  { icon: Scissors, label: "Stitcher", position: 'bottom-left' as Position },
  { icon: Shirt, label: "Sample Master", position: 'top-left' as Position },
];

// Calculate exact positions using trigonometry for perfect circle
const getCirclePosition = (position: Position): string => {
  const positions = {
    'top': 'top-[2%] left-1/2 -translate-x-1/2',
    'top-right': 'top-[15%] right-[15%] translate-x-[15%] translate-y-[15%]',
    'bottom-right': 'bottom-[15%] right-[15%] translate-x-[15%] translate-y-[-15%]',
    'bottom': 'bottom-[2%] left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-[15%] left-[15%] translate-x-[-15%] translate-y-[-15%]',
    'top-left': 'top-[15%] left-[15%] translate-x-[-15%] translate-y-[15%]'
  };
  return positions[position];
};

// Get label position relative to circle
const getLabelPosition = (position: Position): string => {
  const positions = {
    'top': 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    'top-right': 'bottom-full right-0 mb-1.5',
    'bottom-right': 'top-full right-0 mt-1.5',
    'bottom': 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    'bottom-left': 'top-full left-0 mt-1.5',
    'top-left': 'bottom-full left-0 mb-1.5'
  };
  return positions[position];
};

export default function DedicatedTeam() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-[#2D2A2E] mb-4 sm:mb-6 leading-tight relative">
                Your Own Project Manager & Design Team
                <div className="absolute -bottom-2 left-0 w-16 h-0.5 bg-[#6BA292] rounded-full lg:block hidden"></div>
              </h2>
              <p className="text-[#3D3846]/80 text-base sm:text-lg leading-relaxed px-4 lg:px-0">
                At Krazy Kreators, you&apos;re never just handed off to a process. You&apos;re paired with a dedicated project manager and design team from day one — a team that becomes an extension of yours. From refining your vision to execution, we guide you every step of the way.
              </p>
            </div>

            {/* Benefit Cards */}
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
                      <div className="text-center lg:text-left">
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
          </div>

          {/* Right Column - Refined Collaboration Illustration */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-gradient-to-br from-[#F8F7F4] to-[#F0EDE8] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 h-[400px] sm:h-[480px] md:h-[520px] flex items-center justify-center">
              <div className="relative w-full h-full max-w-[440px] mx-auto">
                {/* Project Manager - Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative group">
                    <div className="w-28 h-28 bg-white rounded-full shadow-lg flex flex-col items-center justify-center z-10 relative transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                      <UserCheck className="w-12 h-12 text-[#2D2A2E]" />
                      <span className="text-sm font-medium text-[#2D2A2E]/80 mt-1">PM</span>
                    </div>
                    {/* Subtle glow effect */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#F8F7F4] to-[#F0EDE8] rounded-full blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Design Team Roles - Outer Circle */}
                {designTeamRoles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <div 
                      key={index} 
                      className={`absolute ${getCirclePosition(role.position)}`}
                    >
                      <div className="relative group">
                        {/* Circle with Icon */}
                        <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                          <Icon className="w-9 h-9 text-[#2D2A2E]/80" />
                        </div>
                        {/* Label outside circle */}
                        <div className={`absolute whitespace-nowrap ${getLabelPosition(role.position)}`}>
                          <span className="text-xs font-medium text-[#2D2A2E]/60 bg-white/80 px-2.5 py-0.5 rounded-full shadow-sm">
                            {role.label}
                          </span>
                        </div>
                        {/* Hover glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#F8F7F4] to-[#F0EDE8] rounded-full blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  );
                })}

                {/* Connecting Circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full">
                  {/* Dashed orbit line with animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#2D2A2E]/10 animate-pulse"></div>
                  
                  {/* Solid background circle */}
                  <div className="absolute inset-0 rounded-full border border-[#2D2A2E]/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 