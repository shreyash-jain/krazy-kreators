"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How does your monthly retainer model work?",
    answer: "Our monthly retainer model provides you with dedicated design and production support on an ongoing basis. You pay a fixed monthly fee and get priority access to our team, ensuring consistent quality and faster turnaround times for your fashion projects."
  },
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer: "Our MOQ varies depending on the complexity of your design and production requirements. For most projects, we start with a minimum of 50-100 pieces per style, but we can work with smaller quantities for sample development and testing phases."
  },
  {
    question: "Can I use only design services without opting for production?",
    answer: "Absolutely! We offer standalone design services including concept development, technical drawings, and tech pack creation. You can choose to work with us for design only, then take your completed tech packs to any manufacturer of your choice."
  },
  {
    question: "Do you support international brands?",
    answer: "Yes, we work with brands worldwide. Our team has experience serving clients from North America, Europe, Asia, and beyond. We handle all international logistics, customs documentation, and shipping to ensure smooth delivery to your location."
  },
  {
    question: "What's included in the sample development phase?",
    answer: "The sample development phase includes initial concept sketches, fabric sourcing recommendations, first sample creation, fit testing, and up to two rounds of revisions. We also provide detailed feedback and suggestions for production optimization."
  },
  {
    question: "Can I pause or cancel my retainer anytime?",
    answer: "Yes, our retainer model is flexible. You can pause your retainer for up to 3 months or cancel with 30 days' notice. We'll ensure all ongoing projects are completed before the pause or cancellation takes effect."
  },
  {
    question: "Do you offer tech packs or CADs separately?",
    answer: "Yes, we offer comprehensive tech pack services as standalone offerings. This includes detailed technical drawings, size specifications, material requirements, construction details, and quality standards. Perfect for brands who want to manage their own production."
  },
  {
    question: "How do I track the progress of my project?",
    answer: "We provide regular updates through our project management system, including weekly progress reports, milestone notifications, and real-time tracking of your samples and production. You'll have direct access to your project dashboard and can communicate with our team anytime."
  },
  {
    question: "How is pricing structured?",
    answer: "Our pricing is transparent and project-based. We provide detailed quotes that break down design costs, sample development, and production costs separately. For retainer clients, we offer discounted rates and priority scheduling. All pricing is discussed upfront with no hidden fees."
  },
  {
    question: "What if I need both design and production — but not at the same time?",
    answer: "That's perfectly fine! Many of our clients work with us in phases. You can start with design services, then return for production when you're ready. We maintain all your project files and specifications, so there's no need to start over. This approach gives you flexibility while maintaining consistency in your brand."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-sans text-[#2D2A2E] mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-2xl mx-auto px-4">
            Everything you need to know about working with us. Can&apos;t find what you&apos;re looking for? 
            <a href="#" className="text-[#CBB49A] hover:text-[#b7a078] transition-colors duration-200 ml-1 underline underline-offset-2">
              Get in touch
            </a>
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#ECE9E2] last:border-b-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-4 sm:py-6 md:py-8 text-left flex items-center justify-between group hover:bg-[#F8F7F4]/50 transition-colors duration-200"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-medium text-[#2D2A2E] pr-4 sm:pr-8 leading-relaxed">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                    <div className={`w-3 h-0.5 sm:w-4 sm:h-0.5 bg-[#CBB49A] transition-all duration-300 ${
                      openIndex === index ? 'rotate-90' : ''
                    }`}></div>
                    <div className={`w-3 h-0.5 sm:w-4 sm:h-0.5 bg-[#CBB49A] transition-all duration-300 absolute ${
                      openIndex === index ? 'opacity-0' : 'opacity-100'
                    }`}></div>
                  </div>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="pb-4 sm:pb-6 md:pb-8 pr-4 sm:pr-8">
                  <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 