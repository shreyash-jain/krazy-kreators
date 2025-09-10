import Link from "next/link";

const stats = [
  { value: "5+", label: "brands launched successfully" },
  { value: "15+", label: "years of industry experience" },
  { value: "3000+", label: "designs prototyped & produced" },
  { value: "1lakh+", label: "garments manufactured & shipped" },
];

export default function AboutUs() {
  return (
    <section className="w-full bg-[#F8F7F4] py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 flex flex-col items-center">
        {/* Heading at the top */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#2D2A2E] mb-8 sm:mb-10 md:mb-12 leading-snug tracking-tight text-center px-4 relative whitespace-nowrap">
          Create Your Fashion Brand, Sustainably
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#CBB49A] rounded-full"></div>
        </h2>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:gap-16 mb-8 sm:mb-10 md:mb-12 w-full justify-items-center px-4 max-w-4xl">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]"
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
            <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
              <img src="/brands/drover.png" alt="Drover fashion brand logo - custom clothing production" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
            <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
              <img src="/brands/titled-lotus.png" alt="Tilted Lotus logo - create your own fashion brand" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
            <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
              <img src="/brands/las-loungewear.png" alt="Las Loungewear logo - fashion brand manufacturing" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
            <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
              <img src="/brands/hy-official.png" alt="HY Official logo - clothing manufacturing services" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
            <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 w-full bg-white rounded-lg border border-[#ECE9E2] p-4">
              <img src="/brands/badri-al-shihhi.png" alt="Badria Al Shihhi logo - custom clothing production" className="max-h-full max-w-full w-auto h-auto object-contain opacity-90 hover:opacity-100 transition" />
            </div>
          </div>
        </div>
        {/* CTA below stat cards */}
        <Link
          href="/about"
          className="mt-12 sm:mt-16 md:mt-20 inline-flex items-center gap-3 px-8 py-4 bg-[#CBB49A] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[#b7a078] group"
        >
          <span className="text-lg text-white">More About Us</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
} 