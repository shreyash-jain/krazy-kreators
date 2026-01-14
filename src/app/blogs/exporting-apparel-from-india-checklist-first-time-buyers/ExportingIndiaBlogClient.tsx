"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Share2, Heart, MessageCircle, Eye } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";
import { useToast } from "@/components/Toast";
import { likeBlog, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'exporting-apparel-from-india-checklist-first-time-buyers';

type ExportingIndiaBlogClientProps = {
  initialLikeCount: number;
  initialComments: PublicComment[];
};

export default function ExportingIndiaBlogClient({ initialLikeCount, initialComments }: ExportingIndiaBlogClientProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount] = useState(initialComments.length);
  const { showToast, ToastContainer } = useToast();
  const [relatedBlogs] = useState(() =>
    blogPosts
      .filter((blog) => blog.slug !== BLOG_ID)
      .slice(0, 3)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLike = async () => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      const newCount = await likeBlog(BLOG_ID, action);
      recordBlogLikeUpdate(BLOG_ID, newCount);
      setIsLiked(!isLiked);
      setLikeCount(newCount);
    } catch {
      // Ignore like errors to keep UI stable
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard!", "success");
    } catch (e) {
      console.log(e);
      showToast("Failed to copy link", "error");
    }
  };

  const handleComment = () => {
    const el = document.querySelector("[data-comments-section]");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar invertTabs={!scrolled} />

      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src="/blog/blog -2 image.png"
          alt="Exporting Apparel from India"
          fill
          className="object-cover"
          style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)", WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2A2E] mb-4">Exporting Apparel from India: A Checklist for First-Time Buyers</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">Export Guide</span>
                <span className="text-sm text-[#666666]">12 min read</span>
                <span className="text-sm text-[#666666]">•</span>
                <span className="text-sm text-[#666666]">Posted on December 12, 2024</span>
              </div>

              <div className="mb-8 p-4 bg-[#F8F7F4] rounded-xl">
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isLiked ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200" : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"}`}>
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                    </button>
                    <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                      <MessageCircle className="w-4 h-4" />
                      {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                    </button>
                  </div>
                  <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                  <div className="flex items-center justify-between">
                    <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 mr-2 ${isLiked ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200" : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"}`}>
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                    </button>
                    <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300 flex-1 ml-2">
                      <MessageCircle className="w-4 h-4" />
                      {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                    </button>
                  </div>
                  <button onClick={handleShare} className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300 w-full">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Section 1 */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Pre-Export Preparation</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">1. Research the Market</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Identify target country requirements (demand, style, seasonality, and price points).</li>
                        <li>Study trade restrictions, duty rates, and competitor sourcing regions.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">2. Finalize Product & Specifications</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Decide apparel category (casual wear, activewear, ethnic, kidswear, etc.).</li>
                        <li>Prepare a tech pack with fabric details, measurements, trims, colors, packaging instructions.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">3. Select Reliable Suppliers/Manufacturers</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Verify background: certifications (SEDEX, GOTS, ISO, Fair Trade).</li>
                        <li>Inspect sample quality & compliance with international standards.</li>
                        <li>Negotiate clear terms on MOQ, pricing, and lead time.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog_5_1.png" alt="Pre-export preparation" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog_5_2.png" alt="Compliance and legal documentation" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Compliance & Legal Documentation</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">1. Exporter Registration</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Importer-Exporter Code (IEC) from DGFT (mandatory).</li>
                        <li>Register with EPCH / AEPC for export incentives.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">2. Business & Legal Docs</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>GST registration (if applicable).</li>
                        <li>Company PAN, bank account with AD code (Authorized Dealer Code).</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">3. Buyer’s Import Regulations</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Check labeling norms (fiber content, wash care, country of origin).</li>
                        <li>Ensure compliance with safety standards (e.g., CPSIA for US, REACH for EU).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Order & Production Process</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">1. Sampling & Approvals</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Develop proto sample → fit sample → pre-production sample.</li>
                        <li>Obtain written approval on each sample to avoid disputes.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">2. Production Monitoring</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Conduct quality checks at inline, midline, and final stages.</li>
                        <li>Ensure AQL (Acceptable Quality Level) inspections before shipment.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog_5_3.png" alt="Order and production process" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog_5_4.png" alt="Logistics and shipping" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Logistics & Shipping</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">1. Packaging</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Follow buyer’s packaging standards (poly bags, tags, cartons).</li>
                        <li>Use barcodes if required (UPC/EAN).</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">2. Logistics</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Choose mode: sea (cheaper, longer) or air (faster, costly).</li>
                        <li>Agree on Incoterms (FOB, CIF, DDP) with the buyer.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">3. Export Documentation</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Commercial Invoice & Packing List.</li>
                        <li>Bill of Lading / Airway Bill & Certificate of Origin.</li>
                        <li>Inspection Certificate (if required) & Export Declaration Form (EDF).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Payment & Risk Management</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">1. Payment Terms</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Secure methods: LC (Letter of Credit), Advance TT, or DP (Documents against Payment).</li>
                        <li>Avoid full credit for first-time orders.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">2. Insurance</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Marine insurance for goods in transit.</li>
                        <li>Credit insurance to safeguard against buyer default.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">3. Foreign Exchange</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Monitor exchange rates (USD/Euro vs INR).</li>
                        <li>Hedge currency risk for large orders.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog_5_5.png" alt="Payment and risk management" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog_5_6.png" alt="After-sales relationship building" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">After-Sales & Relationship Building</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">1. Post-Shipment Follow-Up</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Confirm receipt and buyer satisfaction.</li>
                        <li>Maintain communication to secure repeat orders.</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#2D2A2E] mb-4">2. Feedback Loop</h3>
                      <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                        <li>Collect buyer feedback on quality, packaging, and timelines.</li>
                        <li>Use insights to refine processes for future exports.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F7F4]">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">Explore More Insights</h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">Discover more articles about fashion design, manufacturing, and industry insights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group">
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden">
                    <Image src={blog.image} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.category === "design" ? "bg-blue-100 text-blue-600" : blog.category === "manufacturing" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"}`}>{blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}</span>
                      <span className="text-sm text-[#666666]">{blog.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2">{blog.title}</h2>
                    <p className="text-[#666666] text-sm leading-relaxed mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-[#666666] mb-4">
                      <span>{blog.author}</span>
                      <span>{blog.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-[#666666]">
                        <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{blog.readers.toLocaleString()}</span></div>
                        <div className="flex items-center gap-1"><Heart className="w-4 h-4" /><span>{blog.likes}</span></div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F8F7F4] to-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-6">Ready to Transform Your Vision Into Reality?</h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8">Let&apos;s work together to bring your fashion vision to life with our comprehensive design and manufacturing services.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105" onClick={() => setContactOpen(true)}>
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-[#F8F7F4] text-[#2D2A2E] hover:bg-[#F8F7F4] hover:text-[#2D2A2E] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300" onClick={() => setContactOpen(true)}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Get Consultation
            </Button>
          </div>
        </div>
      </section>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <ToastContainer />
      <Footer />
    </div>
  );
}