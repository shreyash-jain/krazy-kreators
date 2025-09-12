"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import CountrySelect from "@/components/CountrySelect";
import ServicesSelect from "@/components/ServicesSelect";
import PhoneNumberInput from "@/components/PhoneNumberInput";

type SelectedPlan = {
  name: string;
  price: string;
  type: 'retainer' | 'custom';
  features?: string[];
} | null;

type ContactDialogProps = {
  open: boolean;
  onClose: () => void;
  selectedPlan?: SelectedPlan;
};

export default function ContactDialog({ open, onClose, selectedPlan }: ContactDialogProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError(null);

    const submissionData = {
      ...formData,
      selectedPlan: selectedPlan ? {
        name: selectedPlan.name,
        price: selectedPlan.price,
        type: selectedPlan.type
      } : null
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      // Optional: reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        country: '',
        services: '',
        message: ''
      });

      // Auto-close after a short delay
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setSubmitError(message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#ECE9E2] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={stop}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0ECE6] flex-shrink-0">
          <h3 className="text-lg font-semibold text-[#2D2A2E]">Get in touch</h3>
          <button
            aria-label="Close"
            className="p-2 rounded-md hover:bg-[#F8F7F4]"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-[#2D2A2E]" />
          </button>
        </div>
        
        {/* Selected Plan Details */}
        {selectedPlan && (
          <div className="px-5 py-4 bg-[#F8F7F4] border-b border-[#F0ECE6] flex-shrink-0">
            <div className="bg-white rounded-xl p-4 border border-[#ECE9E2]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold text-[#2D2A2E]">{selectedPlan.name} Plan</h4>
                <span className="text-lg font-bold text-[#CBB49A]">{selectedPlan.price}</span>
              </div>
              <p className="text-sm text-[#666666] mb-3">
                {selectedPlan.type === 'retainer' ? 'Monthly Retainer Plan' : 'Custom Service Plan'}
              </p>
              {selectedPlan.features && selectedPlan.features.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[#2D2A2E] mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPlan.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="text-xs bg-[#CBB49A]/10 text-[#2D2A2E] px-2 py-1 rounded-full">
                        {feature.length > 30 ? feature.substring(0, 30) + '...' : feature}
                      </span>
                    ))}
                    {selectedPlan.features.length > 3 && (
                      <span className="text-xs text-[#666666] px-2 py-1">
                        +{selectedPlan.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cd-fullName" className="block text-sm font-medium text-[#2D2A2E] mb-1">Full name <span className="!text-[#CBB49A] !font-bold">*</span></label>
                <input 
                  id="cd-fullName" 
                  name="fullName" 
                  type="text" 
                  required 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" 
                  placeholder="Enter your full name" 
                />
              </div>
              <div>
                <label htmlFor="cd-email" className="block text-sm font-medium text-[#2D2A2E] mb-1">Email address <span className="!text-[#CBB49A] !font-bold">*</span></label>
                <input 
                  id="cd-email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" 
                  placeholder="your@email.com" 
                />
              </div>
              <div>
                <label htmlFor="cd-phone" className="block text-sm font-medium text-[#2D2A2E] mb-1">Phone number <span className="!text-[#CBB49A] !font-bold">*</span></label>
                <PhoneNumberInput
                  id="cd-phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label htmlFor="cd-company" className="block text-sm font-medium text-[#2D2A2E] mb-1">Company/Brand name <span className="!text-[#CBB49A] !font-bold">*</span></label>
                <input 
                  id="cd-company" 
                  name="company" 
                  type="text" 
                  required 
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" 
                  placeholder="Your company or brand name" 
                />
              </div>
              <div>
                <label htmlFor="cd-address" className="block text-sm font-medium text-[#2D2A2E] mb-1">Address <span className="text-[#A9A29D]">(Optional)</span></label>
                <input 
                  id="cd-address" 
                  name="address" 
                  type="text" 
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A]" 
                  placeholder="Enter your address" 
                />
              </div>
              <div>
                <label htmlFor="cd-country" className="block text-sm font-medium text-[#2D2A2E] mb-1">Country <span className="!text-[#CBB49A] !font-bold">*</span></label>
                <CountrySelect
                  id="cd-country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] appearance-none"
                />
              </div>
              <div>
                <label htmlFor="cd-services" className="block text-sm font-medium text-[#2D2A2E] mb-1">Services Needed <span className="!text-[#CBB49A] !font-bold">*</span></label>
                <ServicesSelect
                  id="cd-services"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] appearance-none"
                />
              </div>
              <div>
                <label htmlFor="cd-message" className="block text-sm font-medium text-[#2D2A2E] mb-1">Short Message <span className="text-[#A9A29D]">(Optional)</span></label>
                <textarea 
                  id="cd-message" 
                  name="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#ECE9E2] bg-white px-4 py-3 text-[#2D2A2E] placeholder-[#A9A29D] focus:outline-none focus:ring-2 focus:ring-[#CBB49A]/20 focus:border-[#CBB49A] resize-none" 
                  placeholder="Tell us about your project or any specific requirements..." 
                />
              </div>
            </form>
          </div>
          {/* Fixed button at bottom */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-[#F0ECE6] bg-white">
            <button 
              type="submit" 
              form="contact-form"
              disabled={!isFormValid || isSubmitting}
              className={`w-full inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold shadow-sm transition-all duration-200 ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-[#CBB49A] to-[#b7a078] text-white hover:shadow-md cursor-pointer' 
                  : 'bg-gradient-to-r from-[#CBB49A]/30 to-[#b7a078]/30 text-white/70 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Get Started'}
            </button>
            {submitStatus === 'success' && (
              <p className="text-center text-xs text-green-600 mt-3">Message sent. We\'ll get back within 24 hours.</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-center text-xs text-red-600 mt-3">{submitError || 'Something went wrong. Please try again.'}</p>
            )}
            <p className="text-center text-xs text-[#A9A29D] mt-3">Once submitted, our team will reach out within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}