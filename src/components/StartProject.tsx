"use client";

import { useState } from "react";
import { User, Mail, Phone, Building2, MapPin, Globe, FileText, MessageSquare } from "lucide-react";

const services = [
  "Design Services",
  "Tech Pack Development",
  "Sample Development",
  "Production",
  "Full Package Service",
  "Consulting",
];

export default function StartProject() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  return (
    <section className="w-full bg-gradient-to-br from-white to-[#F8F7F4] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-3 sm:mb-4">
            Start Your Project
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-2xl mx-auto px-4">
            Ready to bring your fashion vision to life? Let&apos;s get started on your journey with Krazy Kreators.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_40px_-12px_rgba(0,0,0,0.08)] p-6 sm:p-8 md:p-12">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 sm:space-y-6">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div className="relative">
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">
                  Your full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">
                  Phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Company/Brand */}
              <div className="relative">
                <label htmlFor="company" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">
                  Company/Brand name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base"
                    placeholder="Your company or brand name"
                  />
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="space-y-4 sm:space-y-6">
              {/* Address */}
              <div className="relative">
                <label htmlFor="address" className="block text-sm font-medium text-[#2D2A2E] mb-2">
                  Address <span className="text-[#A9A29D]">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-[#CBB49A]" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="relative">
                <label htmlFor="country" className="block text-sm font-medium text-[#2D2A2E] mb-2">
                  Country
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-[#CBB49A]" />
                  </div>
                  <select
                    id="country"
                    className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 appearance-none"
                  >
                    <option value="">Select your country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Services Needed */}
              <div className="relative">
                <label htmlFor="services" className="block text-sm font-medium text-[#2D2A2E] mb-2">
                  Services Needed
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-[#CBB49A]" />
                  </div>
                  <select
                    id="services"
                    className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 appearance-none"
                  >
                    <option value="">Select services you need</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <label htmlFor="message" className="block text-sm font-medium text-[#2D2A2E] mb-2">
                  Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-[#CBB49A]" />
                  </div>
                  <textarea
                    id="message"
                    rows={4}
                    className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 resize-none"
                    placeholder="Tell us about your project or any specific requirements..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 sm:pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#CBB49A] to-[#b7a078] text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full font-medium text-base sm:text-lg hover:from-[#b7a078] hover:to-[#a69072] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Get Started
              </button>
              <p className="text-center text-xs sm:text-sm text-[#A9A29D] mt-3 sm:mt-4">
                Once submitted, our team will reach out within 24 hours.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
} 