"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Building2, MapPin, Globe, FileText, MessageSquare } from "lucide-react";
import CountrySelect from "@/components/CountrySelect";
import ServicesSelect from "@/components/ServicesSelect";
import PhoneNumberInput from "@/components/PhoneNumberInput";

export default function StartProject() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    country: '',
    services: '',
    message: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Check if all required fields are filled
  useEffect(() => {
    const requiredFields = ['fullName', 'email', 'phone', 'company', 'country', 'services'];
    const allRequiredFilled = requiredFields.every(field => 
      formData[field as keyof typeof formData].trim() !== ''
    );
    setIsFormValid(allRequiredFilled);
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      phone: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      // Handle form submission here
      console.log('Form submitted:', formData);
      // You can add your form submission logic here
    }
  };
  return (
    <section className="w-full bg-gradient-to-br from-white to-[#F8F7F4] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
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
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div className="relative">
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">
                  Full name <span className="!text-[#CBB49A] !font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">
                  Email address <span className="!text-[#CBB49A] !font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">
                  Phone number <span className="!text-[#CBB49A] !font-bold">*</span>
                </label>
                <PhoneNumberInput
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="block w-full py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Company/Brand */}
              <div className="relative">
                <label htmlFor="company" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">
                  Company/Brand name <span className="!text-[#CBB49A] !font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                  </div>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
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
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* Country */}
              <div className="relative">
                <label htmlFor="country" className="block text-sm font-medium text-[#2D2A2E] mb-2">
                  Country <span className="!text-[#CBB49A] !font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-[#CBB49A]" />
                  </div>
                  <CountrySelect
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 appearance-none"
                  />
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
                  Services Needed <span className="!text-[#CBB49A] !font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-[#CBB49A]" />
                  </div>
                  <ServicesSelect
                    id="services"
                    name="services"
                    value={formData.services}
                    onChange={handleInputChange}
                    className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 appearance-none"
                  />
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
                  Short Message <span className="text-[#A9A29D]">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-[#CBB49A]" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
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
                disabled={!isFormValid}
                className={`w-full py-3 sm:py-4 px-6 sm:px-8 rounded-full font-medium text-base sm:text-lg transition-all duration-300 shadow-sm ${
                  isFormValid 
                    ? 'bg-gradient-to-r from-[#CBB49A] to-[#b7a078] text-white hover:from-[#b7a078] hover:to-[#a69072] hover:shadow-md cursor-pointer' 
                    : 'bg-gradient-to-r from-[#CBB49A]/30 to-[#b7a078]/30 text-white/70 cursor-not-allowed'
                }`}
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