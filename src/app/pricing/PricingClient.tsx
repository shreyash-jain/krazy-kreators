"use client";

import Footer from "@/components/Footer";
import { Check, Star, Sparkles, Scissors, Shirt, Palette } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const ContactDialog = dynamic(() => import("@/components/ContactDialog"), { ssr: false });

interface Plan {
  name: string;
  price: string;
  features?: string[];
}

export default function PricingClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    type: 'retainer' | 'custom';
    features?: string[];
  } | null>(null);

  const handlePlanSelect = (plan: Plan, type: 'retainer' | 'custom') => {
    setSelectedPlan({
      name: plan.name,
      price: plan.price,
      type,
      features: plan.features
    });
    setContactOpen(true);
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com/" },
      { "@type": "ListItem", position: 2, name: "Pricing" },
    ],
  };

  const retainerPlans: Array<
    Plan & { tagline?: string; highlight?: boolean }
  > = [
    {
      name: "Starter",
      price: "$1990/mo",
      tagline: "Starter pack to help you to get started",
      features: [
        "Forecast and trend research",
        "Up to 40 Garment Design and Techpack",
        "Dedicated Design Project Manager",
        "Up to 20,000 pcs production handling per year",
        "Quality check and 100% inspection",
        "No MOQ (Minimum Order Quantity)",
        "24/7 support",
        "80% cost discount in sampling",
        "Packaging and Shipping World-wide",
        "Live project tracking (Tech enabled Dash board)",
        "Smart inventory management (Raw materials)",
      ],
      highlight: false,
    },
    {
      name: "Growth",
      price: "$3490/mo",
      tagline: "More power for small teams create project plans with confidence",
      features: [
        "Forecast and trend research",
        "Up to 90 Garment Design and Techpack",
        "Dedicated Design Project Manager (Solely for you)",
        "Unlimited production handling per year",
        "Quality check and 100% inspection",
        "Open costing",
        "No MOQ",
        "24/7 support",
        "Free sampling (up to 20 per quarter)",
        "Free shipping World-wide (24 per year)",
        "Live project tracking (Tech enabled Dash board)",
        "Smart inventory management (Raw materials)",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      tagline: "Empowering large teams with seamless design-to-delivery support",
      features: [
        "Forecast and trend research",
        "Unlimited Garment Design and Techpack",
        "Dedicated Design Team (Solely for you)",
        "Unlimited production handling per year",
        "Quality check and 100% inspection",
        "Open costing",
        "No MOQ",
        "24/7 support",
        "Free sampling",
        "Free shipping World-wide",
        "Live project tracking (Tech enabled Dash board)",
        "Smart inventory management (Raw materials)",
      ],
      highlight: false,
    },
  ];

  const customPlans: Array<
    Plan & { icon: typeof Scissors | typeof Shirt | typeof Palette }
  > = [
    {
      name: "Sample Development",
      price: "$390",
      icon: Scissors,
      features: [
        "Pattern development",
        "Material sourcing",
        "Pattern fit development",
        "Print and embroidery",
        "Brand label and washcare",
        "Fit sample development",
        "Final sample development",
        "Size chart and pattern grading",
        "Packaging and shipping",
      ],
    },
    {
      name: "Garment Design",
      price: "$290",
      icon: Shirt,
      features: [
        "Trend and Forecast Research",
        "Mood board",
        "Design illustrations (3 options / design)",
        "Colour options of selected design",
        "Print or embroidery editable file",
        "Branding trims design",
        "Detailed Tech-pack",
        "Size chart",
        "Editable digital Assets",
      ],
    },
    {
      name: "Fabric Print Design",
      price: "$190",
      icon: Palette,
      features: [
        "Trend and Forecast Research",
        "Mood board",
        "Design illustrations",
        "Colour options of selected design",
        "Print or embroidery editable file",
        "Pantone and print specifications",
        "Ready to print file (Tiff)",
        "Editable file (.Ai or .Psd)",
      ],
    },
  ];

  return (
    <main className="w-full bg-[#FAF9F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero - Clean white */}
      <section className="min-h-screen flex items-center bg-white py-20 sm:py-24 md:py-28">
        <div className="max-w-[80%] mx-auto px-4 md:px-0 lg:px-0 text-center w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#111111]">
            Simple Pricing. Big Value.
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#666666] max-w-2xl mx-auto">
            Transparent plans that fit your needs — and your budget.
          </p>
          <div className="mt-8">
            <a
              href="#retainer-plans"
              className="inline-flex items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5"
            >
              See Our Plans
            </a>
          </div>
          <p className="mt-6 text-xs sm:text-sm text-[#8E8A83]">Trusted by leading fashion brands worldwide.</p>
        </div>
      </section>

      {/* Retainership model explainer (cards) */}
      <section className="py-14 sm:py-16 md:py-20 bg-[#FAF9F7]">
        <div className="max-w-[80%] mx-auto px-4 md:px-0 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-fr items-stretch gap-6 md:gap-8">
            {/* Card 1 */}
            <article className="rounded-2xl border border-[#E0E0E0] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-6 sm:p-7 md:p-8 h-full">
              <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#2D2A2E]">What is a Retainer Model?</h3>
              <p className="mt-3 text-[#5C5C5C] text-sm sm:text-base leading-relaxed">
                A monthly pricing model where you get full access to our design, production, and sourcing teams — just like
                having your own in-house team. Enjoy consistent quality, predictable costs, and the flexibility to scale as you grow.
              </p>
            </article>

            {/* Card 2 */}
            <article className="rounded-2xl border border-[#E0E0E0] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-6 sm:p-7 md:p-8 h-full">
              <h4 className="text-lg sm:text-xl font-serif font-semibold text-[#2D2A2E] mb-3">Why it’s beneficial</h4>
              <ul className="space-y-3 text-[#5C5C5C] text-sm sm:text-base">
                {[
                  "Dedicated project manager",
                  "Fashion + graphic + textile designers",
                  "Transparent costing & regular updates",
                  "Scalable as you grow",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#6BA292] mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0L3.293 9.95a1 1 0 111.414-1.414l3.1 3.101 6.364-6.364a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Monthly Retainer Plans */}
      <section id="retainer-plans" className="pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-[80%] mx-auto px-4 md:px-0 lg:px-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#2D2A2E] text-center">
            Fashion Brand Retainer Plans
          </h2>
          <p className="text-center text-[#666666] mt-3 mb-8 sm:mb-10 md:mb-12">
            Choose a monthly partnership geared to design, sampling, and production momentum.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {retainerPlans.map((plan) => (
              <article
                key={plan.name}
                className={`flex flex-col rounded-2xl border border-[#E0E0E0] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-6 sm:p-7 md:p-8 ${
                  plan.highlight ? "ring-1 ring-[#CBB49A]" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#111111] flex items-center gap-2">
                    {plan.name}
                    {plan.highlight && <Star className="w-4 h-4 text-[#6BA292]" />}
                  </h3>
                  <div className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">{plan.price}</div>
                </div>
                {plan.tagline && (
                  <p className="mt-2 text-sm text-[#666666] italic">{plan.tagline}</p>
                )}

                <ul className="mt-4 space-y-3 text-[#333333] text-sm sm:text-base flex-1">
                  {plan.features?.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#6BA292] mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-5">
                  <button 
                    onClick={() => handlePlanSelect(plan, 'retainer')}
                    className="w-full inline-flex items-center justify-center rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-5 py-3 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition hover:translate-y-[-1px]"
                  >
                    Get Started
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Plans */}
      <section className="pb-20 sm:pb-24 md:pb-28">
        <div className="max-w-[80%] mx-auto px-4 md:px-0 lg:px-0">
          {/* Title + subtext above */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">
              Custom Plans to Suit Your Unique Needs
            </h2>
            <p className="mt-4 text-[#333333] text-sm sm:text-base md:text-lg leading-relaxed">
              Every label is different. We offer flexible, transparent options for specific deliverables — from sample
              development to full garment and print design. Scale only what you need while keeping budgets in control.
            </p>
            <div className="mt-5 h-1 w-16 bg-[#6BA292] rounded-full mx-auto" />
          </div>

          {/* Horizontal cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {customPlans.map((p) => {
              const Icon = p.icon;
              return (
                <article key={p.name} className="rounded-2xl border border-[#E0E0E0] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-6 sm:p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[#6BA292]" />
                      <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#111111]">{p.name}</h3>
                    </div>
                    <div className="text-lg sm:text-xl font-semibold text-[#2D2A2E]">{p.price}</div>
                  </div>
                  <ul className="mt-4 space-y-3 text-[#333333] text-sm sm:text-base">
                    {p.features?.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#6BA292] mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-5">
                    <button 
                      onClick={() => handlePlanSelect(p, 'custom')}
                      className="inline-flex items-center gap-2 rounded-full bg-[#CBB49A] hover:bg-[#b7a078] text-white px-5 py-3 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition hover:translate-y-[-1px]"
                    >
                      <Sparkles className="w-4 h-4" />
                      Get Started
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Contact Dialog */}
      <ContactDialog 
        open={contactOpen} 
        onClose={() => setContactOpen(false)}
        selectedPlan={selectedPlan}
      />
    </main>
  );
}


