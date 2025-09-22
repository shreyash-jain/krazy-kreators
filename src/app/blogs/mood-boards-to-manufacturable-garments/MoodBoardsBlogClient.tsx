"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, User } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function MoodBoardsBlogClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar with dynamic text color */}
      <Navbar invertTabs={!scrolled} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src="/brands/design.jpg"
          alt="Mood Boards to Manufacturable Garments Process"
          fill
          className="object-cover"
          style={{
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </section>


      {/* Main Content */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Article Title and Category */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2A2E] mb-4">
                How We Translate Mood Boards Into Manufacturable Garments
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">
                  Design
                </span>
                <span className="text-sm text-[#666666]">8 min read</span>
                <span className="text-sm text-[#666666]">•</span>
                <span className="text-sm text-[#666666]">Posted on March 15, 2025</span>
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg text-[#666666] leading-relaxed mb-6">
                Every garment begins with a story — and often, that story is captured on a mood board. A mood board is not just a collage of images, colors, and textures. It&apos;s the foundation of a collection, the emotional DNA that guides the design process. But how do we move from this abstract world of inspiration to a garment that is manufacturable, wearable, and ready to reach the customer?
              </p>
              <p className="text-lg text-[#666666] leading-relaxed">
                Here&apos;s the journey step by step:
              </p>
            </div>

            {/* Featured Image */}
            <div className="relative h-96 mb-12 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/brands/tilted-lotus-design.jpg"
                alt="Mood Boards to Manufacturable Garments Process"
                fill
                className="object-cover"
                style={{
                  WebkitTransform: 'translateZ(0)',
                  transform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                onLoad={() => {
                  if (typeof window !== 'undefined') {
                    const img = document.querySelector('img[src="/brands/tilted-lotus-design.jpg"]') as HTMLImageElement;
                    if (img) {
                      img.style.opacity = '1';
                    }
                  }
                }}
              />
            </div>

            {/* Post Details */}
            <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-12">
              <h3 className="text-lg font-semibold text-[#2D2A2E] mb-4">Post Details</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CBB49A] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Hosted by March 15, 2025</p>
                  <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-[#666666] leading-relaxed mb-8">
                Every garment begins with a story — and often, that story is captured on a mood board. A mood board is not just a collage of images, colors, and textures. It&apos;s the foundation of a collection, the emotional DNA that guides the design process. But how do we move from this abstract world of inspiration to a garment that is manufacturable, wearable, and ready to reach the customer?
              </p>

              <p className="text-lg text-[#666666] leading-relaxed mb-12">
                Here&apos;s the journey step by step:
              </p>

              {/* Step 1 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">1. Reading the Mood Board</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  The first step is interpretation. A mood board holds hidden clues — a certain shade of pink, a fluid drape in a photo, a bold geometric silhouette, or a cultural motif.
                </p>
                <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2 mb-6">
                  <li>Colors become Pantone references.</li>
                  <li>Textures hint at fabrics — silk, denim, knits, or organza.</li>
                  <li>Imagery sparks silhouettes and details — oversized sleeves, cinched waists, or minimalist cuts.</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">2. From Inspiration to Initial Sketches</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Once the mood board direction is clear, designers begin sketching. These sketches translate abstract emotions into wearable shapes. Each detail — neckline, hemline, fit — begins to align with the board&apos;s story.
                </p>
              </div>

              {/* Step 3 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">3. Fabric & Material Selection</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  A mood board&apos;s colors and textures are matched with real-world fabrics. This step answers: What fabric will best express the drape, comfort, and mood intended? Along with base fabric, trims and accessories — zippers, buttons, embroidery, laces — are chosen to reinforce the design language.
                </p>
              </div>

              {/* Step 4 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">4. Creating the Tech Pack</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Here the idea starts becoming technical. The tech pack is the designer&apos;s language for manufacturers, including:
                </p>
                <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2 mb-6">
                  <li>Flat sketches</li>
                  <li>Measurements and grading</li>
                  <li>Stitching details</li>
                  <li>Fabric and trim specifications</li>
                </ul>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  This is where creativity meets precision. Without this, a design can&apos;t be accurately reproduced.
                </p>
              </div>

              {/* Step 5 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">5. Prototyping</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  The first tangible form of the garment is created. A prototype or test fit (made from test fabric) helps check silhouette, fit, and construction. Adjustments are made until the garment feels true to the original vision.
                </p>
                
                {/* Strategic Image 1: Design Process */}
                <div className="relative h-80 mb-8 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/brands/tilted-lotus-design-2.png"
                    alt="Design process from mood board to sketches"
                    fill
                    className="object-cover"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                </div>
              </div>

              {/* Step 6 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">6. Sampling in Main Fabric (Designer & Client Approval)</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Once the prototype is approved, the garment is made in the actual fabric and trims chosen for production. This is the most important checkpoint — because only in the main fabric can one judge the real drape, shine, and finish. Both designers and clients review and approve this sample before moving forward.
                </p>
              </div>

              {/* Step 7 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">7. Pre-Production & Scaling</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Once samples are approved, the garment goes into pre-production. At this stage, patterns are finalized, fabric orders placed, and manufacturing timelines locked.
                </p>
                
                {/* Strategic Image 2: Manufacturing Process */}
                <div className="relative h-80 mb-8 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/brands/tilted-lotus-design-3.jpg"
                    alt="Manufacturing and production process"
                    fill
                    className="object-cover"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                </div>
              </div>

              {/* Step 8 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">8. Production & Quality Checks</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  The garment is finally manufactured in bulk. Quality checks ensure every piece matches the sample — in fit, stitching, and finish.
                </p>
                
                {/* Strategic Image 3: Final Product */}
                <div className="relative h-80 mb-8 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/brands/tilted-lotus-product-1.jpg"
                    alt="Final manufactured garments and quality control"
                    fill
                    className="object-cover"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                </div>
              </div>

              {/* Conclusion */}
              <div className="mb-12">
                <p className="text-lg text-[#2D2A2E] leading-relaxed font-medium">
                  Each step ensures the original inspiration doesn&apos;t get lost in the process but instead evolves into something both beautiful and manufacturable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Blogs Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F7F4]">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">
              Explore More Insights
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Discover more articles about fashion design, manufacturing, and industry insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog 1 */}
            <Link href="/blogs/print-pattern-prototyping" className="group">
              <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 h-full flex flex-col">
                <div className="relative h-64 flex-shrink-0">
                  <Image
                    src="/brands/design.jpg"
                    alt="Why Print, Pattern & Prototyping Matters"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">
                      Manufacturing
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-[#CBB49A] rounded-full"></div>
                    <span className="text-sm text-[#CBB49A] font-medium">Manufacturing</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2 leading-tight">
                    Why Print, Pattern & Prototyping Matters
                  </h3>
                  <p className="text-[#666666] text-sm mb-4 line-clamp-3 leading-relaxed">
                    Discover the critical role of print, pattern, and prototyping in creating successful fashion collections.
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#CBB49A] font-semibold text-sm hover:underline">
                      Learn More →
                    </span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Blog 2 */}
            <Link href="/blogs/sustainable-fashion" className="group">
              <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 h-full flex flex-col">
                <div className="relative h-64 flex-shrink-0">
                  <Image
                    src="/brands/luxury_wear.jpg"
                    alt="Sustainable Fashion: The Future of Manufacturing"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">
                      Sustainability
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-[#CBB49A] rounded-full"></div>
                    <span className="text-sm text-[#CBB49A] font-medium">Sustainability</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2 leading-tight">
                    Sustainable Fashion: The Future of Manufacturing
                  </h3>
                  <p className="text-[#666666] text-sm mb-4 line-clamp-3 leading-relaxed">
                    Explore how sustainable practices are revolutionizing the fashion manufacturing industry.
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#CBB49A] font-semibold text-sm hover:underline">
                      Learn More →
                    </span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Blog 3 */}
            <Link href="/blogs/tech-packs-guide" className="group">
              <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 h-full flex flex-col">
                <div className="relative h-64 flex-shrink-0">
                  <Image
                    src="/brands/design-hero.jpg"
                    alt="The Complete Guide to Tech Packs"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">
                      Design
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-[#CBB49A] rounded-full"></div>
                    <span className="text-sm text-[#CBB49A] font-medium">Design</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2 leading-tight">
                    The Complete Guide to Tech Packs
                  </h3>
                  <p className="text-[#666666] text-sm mb-4 line-clamp-3 leading-relaxed">
                    Master the art of creating comprehensive tech packs that ensure perfect garment production.
                  </p>
                  <div className="mt-auto">
                    <span className="text-[#CBB49A] font-semibold text-sm hover:underline">
                      Learn More →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F8F7F4] to-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-6">
            Ready to Transform Your Vision Into Reality?
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8">
            Let&apos;s work together to bring your fashion vision to life with our comprehensive design and manufacturing services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => setContactOpen(true)}
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-[#F8F7F4] text-[#2D2A2E] hover:bg-[#F8F7F4] hover:text-[#2D2A2E] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
              onClick={() => setContactOpen(true)}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Get Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
