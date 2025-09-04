"use client";

import { 
  Users, 
  Eye, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Warehouse 
} from "lucide-react";

const uniqueFeatures = [
  {
    icon: Users,
    title: "Design Team + PM",
    description: "Dedicated design team with your own project manager to keep everything on track.",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Eye,
    title: "Continuous Supervision",
    description: "We monitor your product journey from sketch to shipment — no blind spots.",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Client Dashboard",
    description: "Track your sales and purchase orders in real time with our custom dashboard.",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Package,
    title: "No MOQ",
    description: "Start small. We don't believe in minimums — we believe in momentum.",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: ShoppingCart,
    title: "End-to-End Procurement",
    description: "We test, source, and procure so you avoid costly sourcing mistakes.",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    icon: Warehouse,
    title: "Raw Material Inventory",
    description: "Stay cost-effective and season-ready with our inventory planning system.",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
];

export default function WhatMakesUsUnique() {
  return (
    <section className="w-full bg-gradient-to-br from-[#F8F7F4] to-[#F0EDE8] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-3 sm:mb-4 relative">
            What Makes Krazy Kreators Unique
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#6BA292] rounded-full"></div>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {uniqueFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-white/60 text-center sm:text-left"
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto sm:mx-0`}>
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold text-[#2D2A2E] mb-2 sm:mb-3 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[#3D3846]/80 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 