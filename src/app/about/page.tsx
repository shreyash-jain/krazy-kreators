import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Krazy Kreators | Fashion Brand Manufacturing",
  description:
    "We help you create your own clothing line with end‑to‑end fashion brand manufacturing and custom clothing production — from design to sustainable delivery.",
  alternates: { canonical: "/about" },
  keywords: [
    "fashion brand manufacturing",
    "custom clothing production",
    "fashion design to delivery",
    "create your own clothing line",
    "sustainable clothing manufacturing",
  ],
};

export default function AboutPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com/" },
      { "@type": "ListItem", position: 2, name: "About" },
    ],
  };

  return (
    <main className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero (two-column) */}
      <section className="relative w-full bg-[#F5F0E8] min-h-screen flex items-center overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left copy */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-[#2D2A2E] tracking-tight mb-3">
                About Krazy Kreators
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed max-w-2xl">
                We’re your go‑to <strong>fashion brand manufacturing</strong> and clothing production experts, bringing your
                clothing brand ideas to life. From creative design to seamless production, we deliver quality, speed, and
                sustainability across every stage.
              </p>
            </div>
            {/* Right image */}
            <div className="rounded-2xl overflow-hidden border border-[#ECE9E2] shadow-sm">
              <img
                src="/brands/contact.jpg"
                alt="Krazy Kreators team – fashion design and manufacturing"
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats below hero */}
      <section className="w-full bg-white py-8 sm:py-10 md:py-12">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] mb-6">Our Impact in Numbers</h2>
            <div className="w-16 h-0.5 bg-[#6BA292] rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-12 sm:gap-16 md:gap-20 mb-12 sm:mb-16 md:mb-20 w-full justify-items-center px-4 max-w-4xl mx-auto">
            {/* Stat 1 */}
            <div className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">5+</span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">brands launched successfully</span>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">15+</span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">years of industry experience</span>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">3000+</span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">designs prototyped & produced</span>
            </div>
            {/* Stat 4 */}
            <div className="flex flex-col items-center min-w-[120px] sm:min-w-[150px]">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#6BA292] font-sans mb-2 tracking-tight">1lakh+</span>
              <span className="text-sm sm:text-base md:text-lg text-[#2D2A2E] font-medium opacity-90 text-center">garments manufactured & shipped</span>
            </div>
          </div>
          
          {/* Brand Logos Row */}
          <div className="mt-8 sm:mt-12 md:mt-16 w-full px-4">
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
        </div>
      </section>

      {/* Our Story – Past, Present & Future */}
      <section className="w-full py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#2D2A2E] mb-6 sm:mb-8">
            Our Story: Past, Present & Future
          </h2>
          <div className="w-14 h-0.5 bg-[#6BA292] rounded-full mb-8" />

          {/* 3-up blocks */}
          <div className="space-y-10 sm:space-y-12 lg:space-y-16">
            {/* Past */}
            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                {/* Text */}
                <div className="order-2 md:order-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#6BA292] inline-block" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2D2A2E]">Past</h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Our humble beginnings were rooted in hands‑on fashion design support — building tech packs, fittings, and
                    sample runs that helped founders <strong>create their own clothing line</strong> with clarity and confidence.
                  </p>
                </div>
                {/* Image right on desktop */}
                <div className="order-1 md:order-2">
                  <img
                    src="/brands/about-past.jpg"
                    alt="Past – early fashion design to delivery support"
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover rounded-xl border border-[#ECE9E2]"
                  />
                </div>
              </div>
            </div>

            {/* Present */}
            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                {/* Image left on desktop */}
                <div className="order-1 md:order-1">
                  <img
                    src="/brands/about-present.jpg"
                    alt="Present – sustainable clothing manufacturing at Krazy Kreators"
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover rounded-xl border border-[#ECE9E2]"
                  />
                </div>
                {/* Text */}
                <div className="order-2 md:order-2">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#6BA292] inline-block" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2D2A2E]">Present</h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    Today we lead sustainable, end‑to‑end <strong>fashion brand manufacturing</strong> — from design and sampling
                    to <strong>custom clothing production</strong> — with transparent timelines, fit control, and finish quality.
                    Explore our <Link href="/#what-we-do" className="text-[#6BA292] hover:text-[#5A8A7A] underline underline-offset-4">services</Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Future */}
            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                {/* Text */}
                <div className="order-2 md:order-1">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6BA292]/10 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#6BA292] inline-block" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#2D2A2E]">Future</h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#3D3846] leading-relaxed">
                    We continue to innovate in materials, digital sampling, and global partnerships to accelerate <strong>clothing
                    brand creation</strong> with lower waste and better predictability.
                  </p>
                </div>
                {/* Image right on desktop */}
                <div className="order-1 md:order-2">
                  <img
                    src="/brands/about-future.jpg"
                    alt="Future – innovation in custom clothing production at Krazy Kreators"
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover rounded-xl border border-[#ECE9E2]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder’s Message */}
      <section className="w-full bg-[#F8F7F4] py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="max-w-[80%] mx-auto px-4 md:px-0 lg:px-0">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">From Our Founder</h2>
            <p className="text-sm sm:text-base md:text-lg text-[#3D3846] mt-2">Crafting Clothing Brands with Passion & Precision</p>
            <div className="w-16 h-0.5 bg-[#6BA292] rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative mx-auto w-full max-w-md h-[34rem] sm:h-[36rem] md:h-[40rem] lg:h-[44rem] rounded-3xl overflow-hidden border border-[#ECE9E2] shadow-sm">
              <img
                src="/brands/about-prashant.png"
                alt="Prashant Singh — founder of Krazy Kreators, fashion brand manufacturing"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <p className="text-[#3D3846] text-sm sm:text-base md:text-lg leading-relaxed">
                “Every label we build blends creativity with engineering. Our role is to translate your vision into
                garments that look beautiful and perform in the real world — with <strong>custom clothing production</strong>
                workflows that are transparent, repeatable, and sustainable.” For collaborations and enquiries,{" "}
                <Link href="/#start-project" className="text-[#6BA292] hover:text-[#5A8A7A] underline underline-offset-4">contact our team</Link>.
              </p>
              <p className="text-[#2D2A2E] font-semibold mt-6 font-serif italic">— Prashant Singh</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="w-full py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#2D2A2E]">Our Team</h2>
            <p className="text-[#3D3846] text-sm sm:text-base max-w-3xl mx-auto mt-3">
              Our expert fashion manufacturing team blends creativity, technical skill, and global sourcing expertise — the
              end‑to‑end clothing production specialists behind every collection.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Bipul Singh", role: "Director", desc: "Strategy & partnerships", img: "/brands/about-bipul.jpeg" },
              { name: "Seema Yadav", role: "Design Manager", desc: "Creative direction & design ops", img: "/brands/about-seema.jpeg" },
              { name: "Sonu Kumar", role: "Sourcing and Operations", desc: "Vendors, materials & timelines", img: "/brands/about-sonu.jpeg" },
              { name: "Rohit Goswami", role: "Sr. Fashion Designer", desc: "Apparel design & fits", img: "/brands/about-rohit.jpg" },
              { name: "Ayushi Singh", role: "Fashion Designer", desc: "Fashion designer", img: "/brands/about-ayushi.jpg" },
              { name: "Vinod Srivastva", role: "Quality Control", desc: "AQL & production audits", img: "/brands/about-vinod.jpeg" },
            ].map((m) => (
              <div key={m.name} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#ECE9E2]">
                <img src={m.img} alt={`${m.name} – ${m.role}`} className="w-full h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] object-cover" />
                <div className="p-4 sm:p-5">
                  <p className="text-[#2D2A2E] text-base font-semibold">{m.name}</p>
                  <p className="text-[#3D3846] text-sm">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-[#F8F7F4] py-14 sm:py-16 md:py-20">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#2D2A2E] mb-3">
            Ready to Start Your Fashion Brand?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3846] max-w-3xl mx-auto mb-6">
            From sketches to store shelves, Krazy Kreators is your trusted partner in <strong>fashion brand manufacturing</strong> &
            <strong> clothing brand creation</strong>.
          </p>
                      <Link
              href="/#start-project"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 rounded-full bg-[#CBB49A] text-white text-sm sm:text-base font-semibold hover:bg-[#b7a078] transition-colors"
            >
            Let’s Create Together
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
} 