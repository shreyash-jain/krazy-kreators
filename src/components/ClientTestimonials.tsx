


import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    videoSrc: "/testimonial/testimonial-1.mp4",
    clientName: "Preeti Gore",
    brandName: "Tilted Lotus",
    location: "Houston, US",
    // avatarSrc: "/avatars/preeti-gore.jpg", // Optional: add avatar if available
  },
  {
    videoSrc: "/testimonial/testimonial-2.mp4",
    clientName: "Jivan Purewal",
    brandName: "Sankar",
    location: "London, England",
    // avatarSrc: "/avatars/jivan-purewal.jpg", // Optional: add avatar if available
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#FAFAFA] to-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
        {/* Section Header */}
        <div
         
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-center tracking-tight mb-6 text-gray-900">
            Hear it from our clients
          </h2>
          <p className="text-base md:text-lg text-neutral-600 text-center max-w-2xl mx-auto mb-12">
            Real founders. Real fashion journeys. Here&apos;s what it&apos;s like to work with Krazy Kreators.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="flex flex-col md:flex-row md:justify-center md:gap-8 gap-12 max-w-3xl mx-auto">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={i}
              videoSrc={t.videoSrc}
              clientName={t.clientName}
              brandName={t.brandName}
              location={t.location}
              // avatarSrc={t.avatarSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 