"use client";

import Footer from "@/components/Footer";
import Link from "next/link";
import CountrySelect from "@/components/CountrySelect";
import ServicesSelect from "@/components/ServicesSelect";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Mail,
  User,
  Building2,
  Globe,
  FileText,
  MessageSquare,
} from "lucide-react";


export default function ContactPage() {
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com/" },
      { "@type": "ListItem", position: 2, name: "Contact" },
    ],
  };

  return (
    <main className="w-full bg-[#FAF9F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hidden H1 for SEO with primary keyword */}
      <h1 className="sr-only">Contact Krazy Kreators – Start a Clothing Brand with Expert Fashion Manufacturing</h1>

      {/* Hero Intro */}
      <section className="py-28 sm:py-32 md:py-36">
        <div className="max-w-[80%] mx-auto px-6 md:px-20">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-[#111111] mt-6 sm:mt-8 md:mt-10">Talk to the Kreators</h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-[#666666] max-w-3xl mx-auto">
              We’d love to hear your ideas. Reach out and let’s start making magic.
            </p>
          </div>
        </div>
      </section>

      {/* StartProject-style Form first */}
      <section className="pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-[80%] mx-auto px-6 md:px-20">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_40px_-12px_rgba(0,0,0,0.08)] p-6 sm:p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative">
                  <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">Full name <span className="!text-[#CBB49A] !font-bold">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                    </div>
                    <input 
                      id="fullName" 
                      name="fullName"
                      type="text" 
                      required 
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base" 
                      placeholder="Enter your full name" 
                    />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">Email address <span className="!text-[#CBB49A] !font-bold">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                    </div>
                    <input 
                      id="email" 
                      name="email"
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base" 
                      placeholder="your@email.com" 
                    />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">Phone number <span className="!text-[#CBB49A] !font-bold">*</span></label>
                  <PhoneNumberInput
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="block w-full pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="company" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">Company/Brand name <span className="!text-[#CBB49A] !font-bold">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                    </div>
                    <input 
                      id="company" 
                      name="company"
                      type="text" 
                      required 
                      value={formData.company}
                      onChange={handleInputChange}
                      className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base" 
                      placeholder="Your company or brand name" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <label htmlFor="address" className="block text-sm font-medium text-[#2D2A2E] mb-2">Address <span className="text-[#A9A29D]">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-[#CBB49A]" />
                    </div>
                    <input 
                      id="address" 
                      name="address"
                      type="text" 
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200" 
                      placeholder="Enter your address" 
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="country" className="block text-sm font-medium text-[#2D2A2E] mb-2">Country <span className="!text-[#CBB49A] !font-bold">*</span></label>
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
                      <svg className="h-4 w-4 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="services" className="block text-sm font-medium text-[#2D2A2E] mb-2">Services Needed <span className="!text-[#CBB49A] !font-bold">*</span></label>
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
                      <svg className="h-4 w-4 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="message" className="block text-sm font-medium text-[#2D2A2E] mb-2">Short Message <span className="text-[#A9A29D]">(Optional)</span></label>
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
                    />
                  </div>
                </div>
              </div>

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
                <p className="text-center text-xs sm:text-sm text-[#A9A29D] mt-3 sm:mt-4">Once submitted, our team will reach out within 24 hours.</p>
              </div>
            </form>
          </div>

          {/* Contact details below the form (two light cards) */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Address + Hours */}
            <div className="bg-white/70 rounded-2xl border border-[#E0E0E0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-7 md:p-8">
              <div className="flex items-start gap-4 w-full">
                <MapPin className="w-6 h-6 text-[#6BA292] mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] font-semibold text-lg">Address</p>
                  <div className="text-[#333333] text-base leading-relaxed">
                    <p className="font-semibold">Krazy Kreators</p>
                    <p>B-71, 4TH FLOOR</p>
                    <p>SECTOR - 67</p>
                    <p>NOIDA, DELHI NCR, INDIA</p>
                    <p>201301</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-start gap-4 w-full">
                <Clock className="w-6 h-6 text-[#6BA292] mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] font-semibold text-lg">Opening Hours</p>
                  <p className="text-[#333333] text-base leading-relaxed">Monday - Saturday</p>
                </div>
              </div>
            </div>

            {/* Card 2: Phone + Email */}
            <div className="bg-white/70 rounded-2xl border border-[#E0E0E0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-7 md:p-8">
              <div className="flex items-start gap-4 w-full">
                <Phone className="w-6 h-6 text-[#6BA292] mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] font-semibold text-lg">Phone</p>
                  <Link href="tel:+919990440803" className="text-[#333333] underline underline-offset-4 text-base">+91 9990440803</Link>
                </div>
              </div>
              <div className="mt-6 flex items-start gap-4 w-full">
                <Mail className="w-6 h-6 text-[#6BA292] mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] font-semibold text-lg">Email</p>
                  <Link href="mailto:info@krazykreators.com" className="text-[#333333] underline underline-offset-4 text-base">info@krazykreators.com</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Map */}
      <section className="pb-24">
        <div className="max-w-[80%] mx-auto px-6 md:px-20">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-[#E0E0E0]">
            <iframe
              title="Krazy Kreators location on Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5!2d77.3789926!3d28.6072006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzI1LjkiTiA3N8KwMjInNTMuNCJF!5e0!3m2!1sen!2sin!4v1709062374956!5m2!1sen!2sin&markers=color:red%7Clabel:K%7C28.6072006,77.3814926"
              width="100%"
              height="520"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute left-4 top-4">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=28.6072006,77.3814926"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold text-[#111111] border border-[#E0E0E0] shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#6BA292]"
                aria-label="Get directions to Krazy Kreators"
              >
                <Navigation className="w-4 h-4 text-[#6BA292]" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}