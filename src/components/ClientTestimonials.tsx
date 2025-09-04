


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
  {
    videoSrc: "/testimonial/las-testimonial.mp4",
    clientName: "Anika McKelvey",
    brandName: "Las Loungewear",
    location: "Dubai, UAE",
    // avatarSrc: "/avatars/anika-las.jpg", // Optional: add avatar if available
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#FAFAFA] to-white">
      <div className="min-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
         
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-center tracking-tight mb-6 text-gray-900">
            Trusted by Founders Worldwide
          </h2>
          <p className="text-base md:text-lg text-neutral-600 text-center max-w-2xl mx-auto mb-12">
            True Stories. Real Brands. Built with Krazy Kreators.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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