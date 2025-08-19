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
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero (two-column) */}
      <section className="relative w-full bg-[#F5F0E8] min-h-screen flex items-center overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
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
                src="/brands/about-hero.jpg"
                alt="Krazy Kreators team – fashion design and manufacturing"
                className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats below hero */}
      <section className="w-full bg-white py-8 sm:py-10 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sm:p-7">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#6BA292] font-sans">5+</div>
              <div className="text-[#2D2A2E] text-sm sm:text-base mt-2">Brands launched successfully</div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sm:p-7">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#6BA292] font-sans">15+</div>
              <div className="text-[#2D2A2E] text-sm sm:text-base mt-2">Years of industry experience</div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 sm:p-7">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#6BA292] font-sans">1000+</div>
              <div className="text-[#2D2A2E] text-sm sm:text-base mt-2">Designs prototyped & produced</div>
            </div>
          </div>

        </div>
      </section>

      {/* Our Story – Past, Present & Future */}
      <section className="w-full py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
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
                    src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80&auto=format&fit=crop"
                    alt="Past – early fashion design to delivery support"
                    className="w-full h-52 sm:h-64 md:h-72 object-cover rounded-xl border border-[#ECE9E2]"
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
                    className="w-full h-52 sm:h-64 md:h-72 object-cover rounded-xl border border-[#ECE9E2]"
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
                    className="w-full h-52 sm:h-64 md:h-72 object-cover rounded-xl border border-[#ECE9E2]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder’s Message */}
      <section className="w-full bg-[#F8F7F4] py-12 sm:py-14 md:py-18 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D2A2E]">From Our Founder</h2>
            <p className="text-sm sm:text-base md:text-lg text-[#3D3846] mt-2">Crafting Clothing Brands with Passion & Precision</p>
            <div className="w-16 h-0.5 bg-[#6BA292] rounded-full mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[#ECE9E2]">
              <img
                src="/brands/about-prashant.png"
                alt="Prashant Singh — founder of Krazy Kreators, fashion brand manufacturing"
                className="w-full h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] object-cover"
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
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0">
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
              { name: "Rohit Goswami", role: "Sr. Fashion Designer", desc: "Apparel design & fits", img: "/brands/about-rohit.jpeg" },
              { name: "Subhakshi Goswami", role: "Fashion Designer", desc: "Prints, trims & details", img: "/brands/about-subhakshi.jpeg" },
              { name: "Vinod Srivastva", role: "Quality Control", desc: "AQL & production audits", img: "/brands/about-vinod.jpeg" },
            ].map((m) => (
              <div key={m.name} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#ECE9E2]">
                <img src={m.img} alt={`${m.name} – ${m.role}`} className="w-full h-64 sm:h-72 md:h-80 object-cover" />
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
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 lg:px-0 text-center">
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