import Link from "next/link";
import { Mail, Instagram, Linkedin, Facebook } from "lucide-react";

const quickLinks = [
  { name: "About", href: "#" },
  { name: "Case Studies", href: "#" },
  { name: "FAQ", href: "#" },
  { name: "Contact", href: "#" },
];

const services = [
  { name: "Design", href: "#" },
  { name: "Sampling", href: "#" },
  { name: "Production", href: "#" },
  { name: "Tech Packs", href: "#" },
];

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-[#F2F2F2]">
      {/* Main Footer Content */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-8">
          {/* Column 1: Logo + Tagline */}
          <div className="text-center sm:text-left">
            <div className="mb-4 sm:mb-6">
              <Link href="/" className="inline-block">
                <img
                  src="/brands/logo.svg"
                  alt="Krazy Kreators"
                  className="h-10 sm:h-12 w-auto"
                />
              </Link>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-[#F2F2F2]">
              Design. Sample. Produce.<br />Zero MOQ.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-medium text-base sm:text-lg mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#F2F2F2] hover:text-white hover:underline underline-offset-4 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-white font-medium text-base sm:text-lg mb-4 sm:mb-6">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-[#F2F2F2] hover:text-white hover:underline underline-offset-4 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div>
            <h3 className="text-white font-medium text-base sm:text-lg mb-4 sm:mb-6">Stay Connected</h3>
            <div className="space-y-3 sm:space-y-4">
              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#CBB49A]" />
                  <span className="text-[#F2F2F2] text-sm sm:text-base">Email:</span>
                </div>
                <a
                  href="mailto:info@krazykreators.com"
                  className="text-[#E5D4BC] hover:text-white text-base sm:text-lg font-medium transition-colors duration-200"
                >
                  info@krazykreators.com
                </a>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-white text-xs sm:text-sm mb-2 sm:mb-3">Follow us</h4>
                <div className="flex gap-2 sm:gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#F2F2F2]/10 flex items-center justify-center hover:bg-[#F2F2F2]/20 transition-colors duration-200"
                        aria-label={social.name}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#F2F2F2]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Strip */}
      <div className="border-t border-[#F2F2F2]/10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#F2F2F2]/80">
            <div>
              © 2025 Krazy Kreators. All rights reserved.
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="#"
                className="text-[#F2F2F2]/80 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <div className="w-1 h-1 rounded-full bg-[#F2F2F2]/20"></div>
              <Link
                href="#"
                className="text-[#F2F2F2]/80 hover:text-white transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 