"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = "eu-digital-product-passport-fashion-brands-2026";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function EuDigitalProductPassportClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [commentCount, setCommentCount] = useState(initialComments.length);
    const [comments, setComments] = useState<Array<{ id: string; name: string; email: string; comment: string; date: string; avatar: string; likes: number }>>(() =>
        initialComments.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            comment: c.comment,
            date: new Date(c.created_at).toLocaleString(),
            avatar: (c.name || "?").charAt(0).toUpperCase(),
            likes: c.likes ?? 0,
        }))
    );
    const [newComment, setNewComment] = useState({ name: "", email: "", comment: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const endOfArticleRef = useRef<HTMLDivElement | null>(null);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLike = async () => {
        try {
            const action = isLiked ? "unlike" : "like";
            const newCount = await likeBlog(BLOG_ID, action);
            recordBlogLikeUpdate(BLOG_ID, newCount);
            setIsLiked(!isLiked);
            setLikeCount(newCount);
        } catch { }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast("Link copied to clipboard!", "success");
        } catch {
            showToast("Failed to copy link", "error");
        }
    };

    const handleComment = () => {
        const commentsSection = document.querySelector("[data-comments-section]");
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleCommentLike = async (commentId: string) => {
        try {
            const action = likedComments.has(commentId) ? "unlike" : "like";
            const newCount = await likeComment(commentId, action);
            setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: newCount } : c));
            setLikedComments(prev => {
                const newSet = new Set(prev);
                if (newSet.has(commentId)) newSet.delete(commentId);
                else newSet.add(commentId);
                return newSet;
            });
        } catch { }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()) {
            alert("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        try {
            const created = await addComment({ blogId: BLOG_ID, name: newComment.name.trim(), email: newComment.email.trim(), comment: newComment.comment.trim() });
            const newCommentData = {
                id: created.id,
                name: created.name,
                email: created.email,
                comment: created.comment,
                date: new Date(created.created_at).toLocaleString(),
                avatar: (created.name || "?").charAt(0).toUpperCase(),
                likes: 0,
            };
            setComments(prev => [newCommentData, ...prev]);
            setCommentCount(prev => prev + 1);
            setNewComment({ name: "", email: "", comment: "" });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar invertTabs={!scrolled} />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <Image
                    src="/blog/eu_sustainability_banner.png"
                    alt="EU Digital Product Passport compliance for fashion brands in 2026"
                    fill
                    className="object-cover"
                    style={{
                        WebkitTransform: "translateZ(0)",
                        transform: "translateZ(0)",
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                    }}
                    priority
                />
                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Compliance
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">9 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 12, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        What the EU Digital Product Passport<br className="hidden sm:block" /> Means for Your Clothing Brand Right Now
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        How to prepare before 2027 and avoid the scramble most brands will not see coming
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">
                        {/* Social Interaction Container */}
                        <div className="mb-0">
                            <div className="mb-12 p-4 bg-[#F8F7F4] rounded-xl flex items-center justify-between">
                                <div className="flex flex-wrap items-center gap-4">
                                    <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200 text-sm font-medium transition-all duration-300">
                                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                                    </button>
                                    <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                                        <MessageCircle className="w-4 h-4" />
                                        {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                                    </button>
                                    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300">
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Post Details */}
                        <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-12 border border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-[#666666]">Hosted on May 12, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                If you are building a clothing brand in 2026 and you plan to sell into Europe, there is a regulation you should already have on your radar. Most founders we talk to have not heard of it. The ones who have usually think it is a 2027 problem. It is not. It is a 2026 problem that becomes a 2027 emergency for the brands who waited.
                            </p>

                            <p className="mb-6">
                                It is called the <strong>EU Digital Product Passport</strong>, often shortened to DPP. By the time it takes full effect for textiles, every garment sold into the European Union will need a scannable, verifiable record of how and where it was made. Brands that can produce that record on demand will keep their shelf space. Brands that cannot will quietly stop receiving purchase orders.
                            </p>
                            <p className="mb-12">
                                This is the single biggest compliance event hitting fashion brands in the next 12 months. So let us walk through it the way you actually need to hear it. What it is, who it touches, what to collect from your manufacturer right now, and what happens if you wait.
                            </p>

                            {/* Section 1: What it is */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What the EU Digital Product Passport Actually Is</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The Digital Product Passport is part of the EU&apos;s Ecodesign for Sustainable Products Regulation. In plain English, it is a digital record attached to every textile product that crosses into the European market. A QR code, an NFC tag, or another scannable identifier links the garment to a structured set of data about its origin, materials, and journey.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-8">
                                    A buyer, a regulator, or an end customer should be able to scan that tag and see exactly what the garment is made of, where the fibre was grown, where the fabric was milled, where it was dyed, who stitched it, and how it should be cared for or recycled at end of life. Nothing about that is optional.
                                </p>
                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">When it actually kicks in</h3>
                                    <p className="text-[#666666] m-0 text-lg leading-relaxed">
                                        Textiles are in the first wave of categories scheduled to fall under DPP enforcement. Phased implementation begins in 2027, and large EU retailers are already asking their wholesale brands to be DPP-ready well ahead of the deadline. If your timeline is to be on European shelves by spring 2027, the documentation work needs to be underway in 2026.
                                    </p>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The thing to understand is that DPP is not a checkbox. It is a chain of records. You cannot generate it the week before you ship. It has to be captured at every step of production, and that means it has to live inside your manufacturer&apos;s process, not yours.
                                </p>
                            </div>

                            {/* Section 2: Who is affected */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Which Brands Are Affected and Which Are Not</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                                    <div>
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-6 font-medium">
                                            A lot of founders assume DPP is a problem for the giants. H&amp;M, Zara, Nike. The opposite is closer to the truth.
                                        </p>
                                        <p className="text-lg leading-relaxed text-[#666666]">
                                            The big players already have compliance teams, supply chain dashboards, and software vendors solving this in the background. It is the small and mid-sized brands selling into Europe who are most exposed, because they do not yet have the systems and they often do not control their factories tightly enough to demand the data.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px]">
                                        <Image
                                            src="/blog/eu_sustainability_fabric.png"
                                            alt="Textile traceability and EU Digital Product Passport readiness"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">You are affected if</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">You sell or plan to sell textile products into any EU member state. This includes D2C shipments to European customers, wholesale into EU retailers, and marketplace fulfilment through Amazon EU, Zalando, or Asos. The placer of the product on the EU market is on the hook, even if your business is registered elsewhere.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">You are not affected if</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">You sell only into non-EU markets and have no plans to enter Europe. Even then, expect the UK, parts of Asia, and eventually the US to follow with their own traceability frameworks. Brands building for the next five years should treat DPP as the new floor, not an EU-only obligation.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">If you sell wholesale</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">EU department stores and concept stores are already adding DPP-readiness clauses to their vendor onboarding forms. You will be asked to confirm traceability before you receive a purchase order, not after. If you cannot answer, the buyer moves on.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">If you sell D2C in the EU</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Customs and market surveillance authorities will spot-check shipments. A missing or unverifiable DPP tag is grounds for the product to be held, refused, or destroyed. The cost of one stopped container is usually higher than the cost of doing this properly from day one.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: What to collect now */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What to Collect From Your Manufacturer Right Now</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-10 font-medium">
                                    Do not wait for the final EU technical specification to be published. The data points are already clear enough to start gathering. The brands who win the 2027 transition will be the ones who built this dataset across every production run in 2026 instead of trying to recreate it retroactively.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Material composition with origin</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Not just &quot;100 percent cotton.&quot; You need the spinning mill, the country of origin of the fibre, and any certifications attached to it like GOTS, OEKO-TEX, or GRS for recycled content. Save the certificate numbers, not just the logo.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Tier 1, 2, and 3 supplier list</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Tier 1 is the stitching unit. Tier 2 is the fabric mill, the dye house, the printer. Tier 3 is the yarn spinner and the fibre source. Each tier should have a name, an address, and a contact. Most brands have Tier 1. Almost none have Tier 3 written down anywhere.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Process records per production stage</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Dye type and recipe, printing method, finishing treatments, any chemicals applied. You do not have to publish the formula. You have to be able to prove what was used if asked.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Social compliance audits</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">SA8000, BSCI, Sedex, or equivalent. Confirm the audit window and pull the report. EU retailers are increasingly bundling DPP and human rights documentation into a single intake form.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">5</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">End-of-life instructions</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Recyclability, fibre separation guidance, and care instructions that go beyond the wash label. The DPP will eventually carry a circularity score. Garments designed without it in mind will simply rank lower in front of the customer.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">6</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Batch and production lot identifiers</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Every order should be tagged to a production lot in your manufacturer&apos;s system so that the data above is tied to a specific run, not a vague brand-wide answer. This is the single piece most factories skip.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: What happens if you cannot */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">What Happens to Brands That Cannot Provide Traceability Data</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">This is the part most articles leave vague. We will not.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">You lose retail accounts before launch</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Wholesale buyers in Berlin, Paris, Milan, and Amsterdam are already screening for traceability during onboarding. If your line sheet looks beautiful but your supply chain answers are vague, the purchase order goes to a competitor whose answers are clean. You will never hear why.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Your shipments get held at customs</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Once enforcement begins, a container without DPP-compliant tags is treated like any other non-compliant import. It can be held, refused entry, or in some cases destroyed at the importer&apos;s cost. For a small brand, a single stopped shipment can wipe out a quarter.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Your sustainability claims become legal risk</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">The EU Green Claims Directive sits alongside DPP. If you say organic, recycled, or low-impact on your website and you cannot back it up with documented evidence pulled from a real production record, you are exposed to greenwashing penalties. The data the DPP captures is the same data that defends your marketing.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">You scramble in 2027 at full price</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Compliance consultants are already quoting six-figure retainers for end-of-deadline cleanup. Software vendors will raise prices the closer enforcement gets. The cost curve for DPP readiness is steep in the wrong direction. Cheapest in 2026, expensive in 2027, painful in 2028.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Documented process protects from day one */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">How a Documented Manufacturing Process Protects Your Brand From Day One</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-10 font-medium">
                                    Here is the part most founders do not realise. The DPP is not really new work. It is the same information a well-run factory already produces internally to control quality. The brands who lose the most over the next 18 months are the ones whose manufacturer never wrote any of it down.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-10">
                                    A documented production process is your insurance policy. When fabric is received, the source is logged. When dye is applied, the recipe is logged. When stitching begins, the unit and the date are logged. When the order ships, every datapoint is bundled into a single production file tied to the lot number. That file becomes your DPP record without any additional scramble. It also becomes your defence the first time a buyer, a regulator, or a customer asks how this garment was made.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    Brands working with this kind of partner do not feel DPP as a shock. They feel it as a question they already know the answer to. The same documentation that satisfies the regulator is what protects you against defective bulk orders, fabric substitutions, and the slow drift in quality that kills small brands in their second year.
                                </p>
                            </div>

                            {/* Section 6: How Krazy Kreators documents */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">How Krazy Kreators Documents Every Production Stage</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    We built our process around the idea that nothing leaves the factory without a paper trail. That habit predates DPP. It is how we have worked with EU buyers for years, and it is why our brands tend to walk into wholesale conversations with the documentation already in hand.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">Tier-mapped supplier register</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">Tier 1 to Tier 3 suppliers are mapped before sampling begins, with certifications and audit windows on file. You see who made every part of your garment before you commit to bulk.</p>
                                    </div>
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">Per-lot production record</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">Every production run is tied to a unique lot identifier. Fabric source, dye recipe, print method, finishing, social audit, and ship date all sit under that lot in one structured file.</p>
                                    </div>
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">DPP-ready export pack</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">When you need to hand documentation to an EU buyer or a customs broker, we deliver a structured export pack that maps to the DPP data schema. No reformatting, no chasing factories for missing certificates.</p>
                                    </div>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The brands we onboard usually tell us the same thing after their first wholesale meeting in Europe. The buyer asked three traceability questions they did not expect, and they answered all three in under a minute. That is what readiness feels like.
                                </p>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Bottom Line</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    The EU Digital Product Passport is not a future problem. It is a 2026 preparation problem with a 2027 enforcement deadline.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    Founders who set up documented production now will treat DPP as a non-event. They will keep their wholesale accounts, clear customs without surprises, and back up every sustainability claim with a real production record. Founders who wait will spend 2027 paying premium fees to retrofit the same documentation they could have collected for free, run by run, starting today. The work is the same either way. The cost is not.
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Get Your Production Fully Documented Before EU Retailers Start Asking</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Krazy Kreators builds traceability into every project. Tier-mapped suppliers, per-lot records, and a DPP-ready export pack from day one. Book a free call and we will walk through your production documentation needs.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Book a Free Consultation
                                </Button>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-200 pt-8 mb-12">
                            <div className="p-6 bg-[#F8F7F4] rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={handleLike}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                                ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                                                : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                                            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                                        </button>

                                        <button
                                            onClick={handleComment}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Share Article
                                    </button>
                                </div>
                                {/* Comments Display */}
                                <div className="space-y-6 mt-8" data-comments-section>
                                    <form onSubmit={handleSubmitComment} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h4 className="text-lg font-semibold text-[#2D2A2E] mb-4">Leave a Comment</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <input
                                                type="text"
                                                name="name"
                                                value={newComment.name}
                                                onChange={handleInputChange}
                                                placeholder="Your Name"
                                                className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all"
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                value={newComment.email}
                                                onChange={handleInputChange}
                                                placeholder="Your Email"
                                                className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all"
                                            />
                                        </div>
                                        <textarea
                                            name="comment"
                                            value={newComment.comment}
                                            onChange={handleInputChange}
                                            placeholder="Share your thoughts..."
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all mb-4 resize-none"
                                        />
                                        <div className="flex items-center justify-between">
                                            {showSuccessMessage && (
                                                <span className="text-green-600 text-sm font-medium animate-fade-in">
                                                    Comment posted successfully!
                                                </span>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="ml-auto px-6 py-2.5 bg-[#CBB49A] text-white font-medium rounded-full hover:bg-[#b7a078] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        Post Comment
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>

                                    {comments.length > 0 ? (
                                        <>
                                            {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                                                <div key={comment.id} id={`comment-${comment.id}`} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                                    <div className="flex items-start gap-3 sm:gap-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                                                            {comment.avatar}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="hidden sm:flex items-center gap-3 mb-3">
                                                                <h5 className="font-semibold text-[#2D2A2E] text-lg">{comment.name}</h5>
                                                                <span className="text-sm text-[#666666]">•</span>
                                                                <span className="text-sm text-[#666666]">{comment.date}</span>
                                                            </div>
                                                            <div className="bg-[#F8F7F4] rounded-lg p-3 sm:p-4">
                                                                <p className="text-[#2D2A2E] leading-relaxed text-sm sm:text-base break-words mb-3">
                                                                    {comment.comment}
                                                                </p>
                                                                <div className="flex items-center justify-between">
                                                                    <button
                                                                        onClick={() => handleCommentLike(comment.id)}
                                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${likedComments.has(comment.id)
                                                                            ? "bg-[#CBB49A]/10 text-[#CBB49A]"
                                                                            : "bg-gray-100 text-gray-600 hover:bg-[#CBB49A]/10 hover:text-[#CBB49A]"
                                                                            }`}
                                                                    >
                                                                        <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? "fill-[#CBB49A]" : ""}`} />
                                                                        {comment.likes} {comment.likes === 1 ? "Like" : "Likes"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {comments.length > 3 && (
                                                <button
                                                    onClick={() => setShowAllComments(!showAllComments)}
                                                    className="w-full py-3 text-center text-[#CBB49A] font-medium hover:bg-[#F8F7F4] rounded-lg transition-colors border border-[#CBB49A]/20"
                                                >
                                                    {showAllComments ? "Show Less Comments" : `Show All ${comments.length} Comments`}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <MessageSquare className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-[#2D2A2E] mb-2">No comments yet</h3>
                                            <p className="text-[#666666]">Be the first to share your thoughts!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
            <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
            <ToastContainer />
        </div>
    );
}
