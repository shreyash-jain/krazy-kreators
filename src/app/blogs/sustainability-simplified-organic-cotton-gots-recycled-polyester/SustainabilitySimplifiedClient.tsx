"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Leaf, ShieldCheck, Recycle, CheckCircle2, ChevronRight } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'sustainability-simplified-organic-cotton-gots-recycled-polyester';

type SustainabilitySimplifiedClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function SustainabilitySimplifiedClient({ initialLikeCount, initialComments }: SustainabilitySimplifiedClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
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
            avatar: (c.name || '?').charAt(0).toUpperCase(),
            likes: c.likes ?? 0,
        }))
    );
    const [newComment, setNewComment] = useState({
        name: "",
        email: "",
        comment: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const endOfArticleRef = useRef<HTMLDivElement | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            setScrolled(isScrolled);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLike = async () => {
        try {
            const action = isLiked ? 'unlike' : 'like';
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
            showToast('Link copied to clipboard!', 'success');
        } catch (error) {
            console.log('Error copying to clipboard:', error);
            showToast('Failed to copy link', 'error');
        }
    };

    const handleComment = () => {
        const commentsSection = document.querySelector('[data-comments-section]');
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleCommentLike = async (commentId: string) => {
        try {
            const action = likedComments.has(commentId) ? 'unlike' : 'like';
            const newCount = await likeComment(commentId, action);
            setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: newCount } : c));

            setLikedComments(prev => {
                const newSet = new Set(prev);
                if (newSet.has(commentId)) {
                    newSet.delete(commentId);
                } else {
                    newSet.add(commentId);
                }
                return newSet;
            });
        } catch {
            console.error('Failed to toggle like for comment:', commentId);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()) {
            showToast('Please fill in all fields', 'error');
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
                avatar: (created.name || '?').charAt(0).toUpperCase(),
                likes: 0,
            };
            setComments(prev => [newCommentData, ...prev]);
            setCommentCount(prev => prev + 1);
            setNewComment({ name: "", email: "", comment: "" });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            setTimeout(() => {
                const el = document.getElementById(`comment-${newCommentData.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } catch (err) {
            console.error(err);
            showToast('Failed to post comment', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar invertTabs={!scrolled} />

            {/* Hero Section */}
            <section className="relative h-[65vh] min-h-[550px] overflow-hidden">
                <Image
                    src="/blog/sustainability_blog_banner_v2.png"
                    alt="Sustainable Fashion Concept"
                    fill
                    className="object-cover object-top"
                    priority
                    style={{
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 max-w-5xl">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#5D7A68] text-white text-sm font-semibold rounded-full uppercase tracking-wider mb-6 animate-fade-in-up">
                            <Leaf className="w-4 h-4" />
                            Sustainability
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Sustainability Simplified
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            Organic Cotton, GOTS, and Recycled Polyester explained—without the greenwashing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 sm:py-24 lg:py-28 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                    <div className="w-full">
                        {/* Social Interaction Section */}
                        <div className="mb-12 p-4 bg-[#F8F7F4] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-24 z-10 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-[#5D7A68] rounded-full flex items-center justify-center text-white font-bold">
                                        KK
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-[#2D2A2E]">Krazy Kreators Team</p>
                                        <p className="text-[#666666]">April 10, 2026</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleLike}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                        ? "bg-[#5D7A68] text-white"
                                        : "bg-white text-gray-600 hover:bg-[#5D7A68]/10 border border-gray-200"
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                                    {likeCount}
                                </button>
                                <button
                                    onClick={handleComment}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {commentCount}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2D2A2E] text-white hover:bg-black text-sm font-medium transition-all duration-300"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-xl max-w-none text-[#666666]">
                            {/* Introduction */}
                            <div className="mb-16">
                                <p className="text-2xl font-medium text-[#2D2A2E] leading-relaxed mb-8">
                                    &quot;Eco-friendly&quot; has become the fashion industry&apos;s favorite buzzword. But let&apos;s be honest—when you&apos;re trying to build a modern, purpose-driven brand, navigating the world of eco-certifications and sustainable materials can feel overwhelming.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    You want to create products that you can genuinely market as sustainable without falling into the &quot;greenwashing&quot; trap. But jumping in without understanding the differences between conventional, organic, and recycled fibers can lead to poor decisions about hand-feel, pricing, and ultimately, your brand&apos;s integrity.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    In this guide, we&apos;re cutting through the noise. We&apos;ll simplify what makes organic cotton and recycled polyester different from their conventional counterparts, explain why certifications like GOTS matter, and weigh the very real pros and cons of implementing these materials in your supply chain.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Leaf className="w-8 h-8 text-[#5D7A68]" />
                                    1. Organic Cotton: More Than Just a Marketing Term
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Cotton is one of the most widely used fabrics globally, but conventional cotton is notoriously thirsty and chemically intensive. Transitioning to organic cotton is often the first step brands take toward sustainability. But what does it actually mean?
                                </p>
                                <p className="leading-relaxed mb-8">
                                    Simply put, organic cotton is grown without the use of toxic synthetic pesticides or fertilizers. It relies on natural farming methods that are better for the soil, better for the farmers, and ultimately, use significantly less water compared to conventional farming.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            The Upside (Pros)
                                        </h3>
                                        <ul className="text-sm leading-relaxed mb-0 space-y-2">
                                            <li><strong>Incredible Hand-Feel:</strong> Since the fibers haven&apos;t been broken down by harsh chemicals during farming, organic cotton often yields a softer, more luxurious feel.</li>
                                            <li><strong>Hypoallergenic:</strong> It&apos;s inherently hypoallergenic, making it ideal for babywear or brands focusing on sensitive skin.</li>
                                            <li><strong>Marketing Power:</strong> Consumers instantly recognize and trust the term &quot;organic cotton.&quot;</li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            The Downside (Cons)
                                        </h3>
                                        <ul className="text-sm leading-relaxed mb-0 space-y-2">
                                            <li><strong>Premium Cost:</strong> Farming organic cotton is a labor-intensive process with lower yields. Expect to pay a 15% to 30% premium over conventional cotton.</li>
                                            <li><strong>Supply Constraints:</strong> True organic cotton makes up a tiny fraction of global cotton production, meaning lead times can occasionally be longer if not sourced properly.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mb-12 mt-8 rounded-2xl overflow-hidden shadow-lg relative bg-gray-50 border border-gray-100 p-2">
                                    <div className="rounded-xl overflow-hidden relative aspect-video">
                                        <Image
                                            src="/blog/organic_cotton_swatches.png"
                                            alt="Premium organic cotton fabric swatches arranged neatly"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="text-center text-sm text-gray-500 mt-3 mb-2 font-medium">The tactile difference of high-quality organic cotton is immediately noticeable compared to chemical-heavy conventional fibers.</p>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-[#5D7A68]" />
                                    2. Decoding GOTS (Global Organic Textile Standard)
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Claiming a t-shirt is &quot;made with organic cotton&quot; is easy. Proving it is hard. This is where <strong>GOTS</strong> comes in. GOTS is the worldwide leading textile processing standard for organic fibers.
                                </p>
                                
                                <div className="bg-white p-8 rounded-xl border-l-4 border-[#5D7A68] shadow-sm mb-8">
                                    <h4 className="font-bold text-[#2D2A2E] text-xl mb-4 mt-0">Why GOTS Matters</h4>
                                    <p className="text-gray-600 mb-0 leading-relaxed">
                                        GOTS isn&apos;t just about the farming of the raw cotton; it traces the <em>entire</em> supply chain. For a garment to be GOTS-certified, it means no toxic heavy metals were used in the dyes, wastewater was properly treated before being released back into the environment, and strict social criteria (fair labor practices) were enforced at the factory level.
                                    </p>
                                </div>

                                <p className="leading-relaxed mb-8">
                                    If you want to protect your brand from greenwashing accusations, a GOTS certification is your bulletproof vest. It confirms to your customers that you have done the rigorous legwork behind the scenes.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Recycle className="w-8 h-8 text-[#5D7A68]" />
                                    3. Recycled Polyester (rPET): Engineering with Waste
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Polyester is essentially plastic, derived from petroleum. It&apos;s incredibly durable, moisture-wicking, and essential for activewear and outerwear. The sustainable alternative? <strong>Recycled Polyester (rPET)</strong>, which is made by melting down existing plastics (most commonly post-consumer water bottles) and re-spinning them into new textile fibers.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            The Upside (Pros)
                                        </h3>
                                        <ul className="text-sm leading-relaxed mb-0 space-y-2">
                                            <li><strong>Waste Reduction:</strong> It gives a second life to materials that would otherwise end up in oceans or landfills.</li>
                                            <li><strong>Energy Efficiency:</strong> Producing rPET requires roughly 50% less energy than producing virgin polyester.</li>
                                            <li><strong>Performance:</strong> It performs exactly like virgin polyester in terms of strength, stretch, and moisture management.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            The Downside (Cons)
                                        </h3>
                                        <ul className="text-sm leading-relaxed mb-0 space-y-2">
                                            <li><strong>Hand-feel Variations:</strong> Depending on the supplier, rPET can sometimes feel slightly stiffer than virgin polyester. (However, premium mills have bridged this gap significantly in recent years).</li>
                                            <li><strong>Microplastics:</strong> Like all synthetic fabrics, recycled polyester still sheds microfibers locally when washed. It solves a waste problem but isn&apos;t entirely flawless ecologically.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mb-12 mt-8 rounded-2xl overflow-hidden shadow-lg relative bg-gray-50 border border-gray-100 p-2">
                                    <div className="rounded-xl overflow-hidden relative aspect-video">
                                        <Image
                                            src="/blog/recycled_polyester_concept.png"
                                            alt="A conceptual rendering of recycled plastic transforming into premium textiles"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="text-center text-sm text-gray-500 mt-3 mb-2 font-medium">High-end Recycled Polyester (rPET) achieves identical performance metrics to virgin plastic.</p>
                                </div>
                            </div>

                            {/* Section 4 Krazy Kreators Approach */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-[#5D7A68]" />
                                    4. Building an Honest Brand
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    The modern consumer is hyper-aware. They can see straight through vague claims like &quot;Eco-Friendly Fabric.&quot; If you&apos;re building a purpose-driven brand, transparency is your greatest marketing tool. Tell your customers exactly <em>why</em> you chose organic cotton, and don&apos;t be afraid to mention that while recycled polyester isn&apos;t perfect, it&apos;s a massive step in the right direction.
                                </p>

                                <div className="bg-gradient-to-br from-[#2D2A2E] to-gray-800 p-10 rounded-2xl text-white shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#5D7A68] opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-6 mt-0">Sourcing Sustainably with Krazy Kreators</h3>
                                        <p className="text-gray-300 leading-relaxed text-lg mb-8">
                                            We understand that balancing ethics with unit economics is tough. That&apos;s why we guide our partners through every step of sustainable sourcing.
                                        </p>
                                        <ul className="space-y-4 mb-0 pl-0">
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#5D7A68] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>Traceable Supply Chains:</strong> We source textiles from audited, reputable mills providing verifiable certifications.</span>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#5D7A68] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>Realistic Costing:</strong> We help you forecast the exact financial impact of switching from conventional to organic materials to protect your margins.</span>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#5D7A68] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>Fabric Library Access:</strong> Touch and feel GOTS organic cotton and premium rPET before making your production commitments.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            {/* Conclusion */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Takeaway</h2>
                                <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                    <p className="text-lg leading-relaxed text-gray-700 m-0">
                                        Sustainability isn&apos;t all-or-nothing; it&apos;s a progression. You don&apos;t need to be 100% impact-free on day one. Start by upgrading your hero products to organic cotton, or swap your outerwear linings to recycled polyester. Every step counts, and communicating these choices transparently will win you the lasting loyalty of conscious consumers.
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-white border-2 border-[#5D7A68] p-10 lg:p-14 rounded-3xl mt-16 text-center" ref={endOfArticleRef}>
                                <div className="max-w-2xl mx-auto">
                                    <span className="text-[#5D7A68] font-bold tracking-widest text-sm uppercase mb-4 block">Ready to go green?</span>
                                    <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Let&apos;s craft your sustainable collection.</h3>
                                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                        Connect with the Krazy Kreators team today to explore our library of certified sustainable fabrics for your next manufacturing run.
                                    </p>
                                    <Button
                                        onClick={() => setContactOpen(true)}
                                        className="bg-[#5D7A68] text-white hover:bg-[#4a6354] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#5D7A68]/30 font-semibold group flex flex-row items-center gap-2 mx-auto"
                                    >
                                        Start Your Sustainable Project
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did you find this guide helpful?</h4>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleLike}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                                ? "bg-white text-[#5D7A68] border-2 border-[#5D7A68]"
                                                : "bg-white text-gray-600 hover:text-[#5D7A68] border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#5D7A68]' : ''}`} />
                                            {isLiked ? 'Liked' : 'Like'} ({likeCount})
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:text-[#5D7A68] border border-gray-200 text-sm font-medium transition-all duration-300"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            Share Guide
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-16" id="comments-section" data-comments-section>
                            <h3 className="text-2xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-2">
                                <MessageCircle className="w-6 h-6 text-[#5D7A68]" />
                                Discussion ({commentCount})
                            </h3>

                            {/* Comment Form */}
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-12">
                                <h4 className="text-lg font-semibold text-[#2D2A2E] mb-6">Leave a Reply</h4>
                                <form onSubmit={handleSubmitComment} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={newComment.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5D7A68] focus:ring-2 focus:ring-[#5D7A68]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={newComment.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5D7A68] focus:ring-2 focus:ring-[#5D7A68]/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="comment" className="text-sm font-medium text-gray-700">Comment</label>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            value={newComment.comment}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5D7A68] focus:ring-2 focus:ring-[#5D7A68]/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                            placeholder="Share your thoughts or ask a question..."
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500">Your email address will not be published.</p>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-[#2D2A2E] text-white hover:bg-black px-8 py-3 rounded-xl transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                                        </Button>
                                    </div>
                                </form>
                                {showSuccessMessage && (
                                    <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2 animate-fade-in">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Comment posted successfully!
                                    </div>
                                )}
                            </div>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {comments.length > 0 ? (
                                    (showAllComments ? comments : comments.slice(0, 5)).map((comment) => (
                                        <div key={comment.id} id={`comment-${comment.id}`} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#5D7A68]/30 transition-all shadow-sm">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0">
                                                    {comment.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="font-bold text-[#2D2A2E]">{comment.name}</h5>
                                                        <span className="text-xs text-gray-400">{comment.date}</span>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed mb-4">{comment.comment}</p>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => handleCommentLike(comment.id)}
                                                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likedComments.has(comment.id)
                                                                ? "text-red-500"
                                                                : "text-gray-400 hover:text-red-500"
                                                                }`}
                                                        >
                                                            <Heart className={`w-3.5 h-3.5 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                                                            {comment.likes || 0} Likes
                                                        </button>
                                                        <button className="text-xs font-medium text-gray-400 hover:text-[#5D7A68] transition-colors">
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">No comments yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}

                                {comments.length > 5 && (
                                    <div className="text-center mt-8">
                                        <button
                                            onClick={() => setShowAllComments(!showAllComments)}
                                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition-all"
                                        >
                                            {showAllComments ? 'Show Less' : `Show All Comments (${comments.length})`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
            <Footer />
        </div>
    );
}
