"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type ContactDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function ContactDialog({ open, onClose }: ContactDialogProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#ECE9E2] overflow-hidden"
        onClick={stop}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0ECE6]">
          <h3 className="text-lg font-semibold text-[#2D2A2E]">Get in touch</h3>
          <button
            aria-label="Close"
            className="p-2 rounded-md hover:bg-[#F8F7F4]"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-[#2D2A2E]" />
          </button>
        </div>
        <div className="px-5 py-5">
          <div className="max-h-[80vh] overflow-y-auto pr-1">
            <form className="space-y-4">
              <div>
                <label htmlFor="cd-fullName" className="block text-sm font-medium text-[#2D2A2E] mb-1">Your full name</label>
                <input id="cd-fullName" name="fullName" type="text" className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" placeholder="Enter your full name" />
              </div>
              <div>
                <label htmlFor="cd-email" className="block text-sm font-medium text-[#2D2A2E] mb-1">Email address</label>
                <input id="cd-email" name="email" type="email" className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="cd-phone" className="block text-sm font-medium text-[#2D2A2E] mb-1">Phone number</label>
                <input id="cd-phone" name="phone" type="tel" className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" placeholder="+91 9990440803" />
              </div>
              <div>
                <label htmlFor="cd-company" className="block text-sm font-medium text-[#2D2A2E] mb-1">Company/Brand name</label>
                <input id="cd-company" name="company" type="text" className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" placeholder="Your company or brand name" />
              </div>
              <div>
                <label htmlFor="cd-address" className="block text-sm font-medium text-[#2D2A2E] mb-1">Address <span className="text-[#A9A29D]">(Optional)</span></label>
                <input id="cd-address" name="address" type="text" className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" placeholder="Enter your address" />
              </div>
              <div>
                <label htmlFor="cd-country" className="block text-sm font-medium text-[#2D2A2E] mb-1">Country</label>
                <select id="cd-country" name="country" className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] appearance-none">
                  <option value="">Select your country</option>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
              <div>
                <label htmlFor="cd-services" className="block text-sm font-medium text-[#2D2A2E] mb-1">Services Needed</label>
                <select id="cd-services" name="services" className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] appearance-none">
                  <option value="">Select services you need</option>
                  <option>Design Services</option>
                  <option>Tech Pack Development</option>
                  <option>Sample Development</option>
                  <option>Production</option>
                  <option>Full Package Service</option>
                  <option>Consulting</option>
                </select>
              </div>
              <div>
                <label htmlFor="cd-message" className="block text-sm font-medium text-[#2D2A2E] mb-1">Message</label>
                <textarea id="cd-message" name="message" rows={4} className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] resize-none" placeholder="Tell us about your project or any specific requirements..." />
              </div>
              <div className="pt-1">
                <button type="submit" className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#CBB49A] to-[#b7a078] text-white px-6 py-3 font-semibold shadow-sm hover:shadow-md transition">
                  Get Started
                </button>
                <p className="text-center text-xs text-[#A9A29D] mt-3">Once submitted, our team will reach out within 24 hours.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}