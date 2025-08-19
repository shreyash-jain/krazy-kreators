import Footer from "@/components/Footer";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  Send,
  Navigation,
  Mail,
  User,
  Building2,
  Globe,
  FileText,
  MessageSquare,
} from "lucide-react";

export const metadata = {
  title: "Contact Krazy Kreators | Start a Clothing Brand",
  description:
    "Contact Krazy Kreators to start your clothing brand. Expert fashion brand manufacturing, custom clothing production, and end-to-end support.",
  alternates: { canonical: "/contact" },
  keywords: [
    "create your own fashion brand",
    "start a clothing brand",
    "clothing manufacturing services",
    "fashion brand manufacturing",
    "custom clothing production",
  ],
};

export default function ContactPage() {
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
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hidden H1 for SEO with primary keyword */}
      <h1 className="sr-only">Contact Krazy Kreators – Start a Clothing Brand with Expert Fashion Manufacturing</h1>

      {/* Hero Intro */}
      <section className="py-28 sm:py-32 md:py-36">
        <div className="max-w-[1200px] mx-auto px-6 md:px-20">
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
        <div className="max-w-[1200px] mx-auto px-6 md:px-20">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_4px_40px_-12px_rgba(0,0,0,0.08)] p-6 sm:p-8 md:p-12">
            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="relative">
                  <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">Your full name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                    </div>
                    <input id="fullName" type="text" className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base" placeholder="Enter your full name" />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                    </div>
                    <input id="email" type="email" className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">Phone number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                    </div>
                    <input id="phone" type="tel" className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base" placeholder="+91 9990440803" />
                  </div>
                </div>
                <div className="relative">
                  <label htmlFor="company" className="block text-xs sm:text-sm font-medium text-[#2D2A2E] mb-1 sm:mb-2">Company/Brand name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#CBB49A]" />
                    </div>
                    <input id="company" type="text" className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-[#ECE9E2] rounded-lg sm:rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 text-sm sm:text-base" placeholder="Your company or brand name" />
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
                    <input id="address" type="text" className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200" placeholder="Enter your address" />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="country" className="block text-sm font-medium text-[#2D2A2E] mb-2">Country</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-[#CBB49A]" />
                    </div>
                    <select id="country" className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 appearance-none">
                      <option value="">Select your country</option>
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="services" className="block text-sm font-medium text-[#2D2A2E] mb-2">Services Needed</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-[#CBB49A]" />
                    </div>
                    <select id="services" className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 appearance-none">
                      <option value="">Select services you need</option>
                      <option>Design Services</option>
                      <option>Tech Pack Development</option>
                      <option>Sample Development</option>
                      <option>Production</option>
                      <option>Full Package Service</option>
                      <option>Consulting</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-[#CBB49A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="message" className="block text-sm font-medium text-[#2D2A2E] mb-2">Message</label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-[#CBB49A]" />
                    </div>
                    <textarea id="message" rows={4} className="block w-full pl-12 pr-4 py-3 border border-[#ECE9E2] rounded-xl bg-white placeholder-[#A9A29D] text-[#2D2A2E] focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] transition-colors duration-200 resize-none" placeholder="Tell us about your project or any specific requirements..." />
                  </div>
                </div>
              </div>

              <div className="pt-3 sm:pt-4">
                <button type="submit" className="w-full bg-gradient-to-r from-[#CBB49A] to-[#b7a078] text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full font-medium text-base sm:text-lg hover:from-[#b7a078] hover:to-[#a69072] transition-all duration-300 shadow-sm hover:shadow-md">
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
        <div className="max-w-[1200px] mx-auto px-6 md:px-20">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-[#E0E0E0]">
            <iframe
              title="Krazy Kreators location on Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.0000000000005!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKrazy%20Kreators!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="520"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute left-4 top-4">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Krazy%20Kreators"
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