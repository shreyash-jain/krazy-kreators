import Link from "next/link";

const stats = [
  { value: "5+", label: "brands launched successfully" },
  { value: "15+", label: "years of industry experience" },
  { value: "1000+", label: "designs prototyped & produced" },
];

export default function AboutUs() {
  return (
    <section className="w-full bg-[#F8F7F4] py-16 sm:py-20 md:py-24 lg:py-32 px-4 md:px-0 lg:px-0">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Heading at the top */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#2D2A2E] mb-8 sm:mb-10 md:mb-12 leading-snug tracking-tight text-center px-4 relative whitespace-nowrap">
          Create Your Fashion Brand, Sustainably
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#CBB49A] rounded-full"></div>
        </h2>
        {/* Stat Cards Row */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 w-full justify-center px-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white rounded-xl sm:rounded-2xl border border-[#ECE9E2] shadow-[0_2px_12px_0_rgba(44,42,46,0.06)] px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-9 min-w-[120px] sm:min-w-[150px]"
              style={{ boxShadow: '0 2px 12px 0 rgba(44,42,46,0.06)' }}
            >
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        {/* Brand Logos Row */}
        <div className="mt-4 sm:mt-6 md:mt-8 w-full px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 md:gap-10 items-center">
            <div className="flex items-center justify-center h-12 sm:h-14 md:h-16">
              <img src="/brands/drover.png" alt="Drover fashion brand logo - custom clothing production" className="max-h-full w-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
            <div className="flex items-center justify-center h-12 sm:h-14 md:h-16">
              <img src="/brands/titled-lotus.png" alt="Tilted Lotus logo - create your own fashion brand" className="max-h-full w-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
            <div className="flex items-center justify-center h-12 sm:h-14 md:h-16">
              <img src="/brands/las-loungewear.png" alt="Las Loungewear logo - fashion brand manufacturing" className="max-h-full w-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
            <div className="flex items-center justify-center h-12 sm:h-14 md:h-16">
              <img src="/brands/hy-official.png" alt="HY Official logo - clothing manufacturing services" className="max-h-full w-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
            <div className="flex items-center justify-center h-12 sm:h-14 md:h-16">
              <img src="/brands/badri-al-shihhi.png" alt="Badri Al Shihhi logo - custom clothing production" className="max-h-full w-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
          </div>
        </div>
        {/* CTA below stat cards */}
        <Link
          href="#"
          className="mt-6 inline-block text-base sm:text-lg md:text-xl font-bold text-[#6BA292] hover:text-[#5A8A7A] transition-colors duration-200 tracking-tight"
          style={{ fontSize: '1.2rem', letterSpacing: 0.5, textDecoration: 'none', background: 'none', border: 'none', padding: 0 }}
        >
          More About Us &rarr;
        </Link>
      </div>
    </section>
  );
} 