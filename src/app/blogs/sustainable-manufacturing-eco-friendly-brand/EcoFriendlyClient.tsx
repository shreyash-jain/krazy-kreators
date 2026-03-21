"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Leaf, CheckCircle2, ChevronRight, Sprout, ShieldCheck, Recycle } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'sustainable-manufacturing-eco-friendly-brand';

type EcoFriendlyClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function EcoFriendlyClient({ initialLikeCount, initialComments }: EcoFriendlyClientProps) {
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
                    src="/blog/eco-friendly-fashion.png"
                    alt="Sustainable Manufacturing and Ethical Fashion"
                    fill
                    className="object-cover object-center"
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
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4A7C59] text-white text-sm font-semibold rounded-full uppercase tracking-wider mb-6 animate-fade-in-up">
                            <Leaf className="w-4 h-4" />
                            Sustainability Guide
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Sustainable Manufacturing:<br />Building an Eco-Friendly Brand
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            Align with the mission of &quot;Smarter Manufacturing, Greener Results&quot; and attract high-value clients by elevating your ethical supply chain.
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
                                    <div className="w-10 h-10 bg-[#4A7C59] rounded-full flex items-center justify-center text-white font-bold">
                                        KK
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-[#2D2A2E]">Krazy Kreators Team</p>
                                        <p className="text-[#666666]">March 21, 2026</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleLike}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                        ? "bg-[#4A7C59] text-white"
                                        : "bg-white text-gray-600 hover:bg-[#4A7C59]/10 border border-gray-200"
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
                                    The fast fashion industry is facing a massive reckoning. Consumers—especially Millennials and Gen Z—are demanding transparency, ethical supply chains, and garments that don&apos;t harm the planet. Welcome to the era of the modern &quot;conscious&quot; brand.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    But building an eco-friendly fashion label isn&apos;t just about good PR; it&apos;s a highly profitable strategy. Conscious consumers are high-value clients who are willing to pay a premium for apparel that aligns with their ethics. If you want a brand that endures for decades, sustainability is no longer optional—it&apos;s foundational.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    Let&apos;s explore how you can build an ethically driven apparel brand that perfectly aligns with a <strong>&quot;Smarter Manufacturing, Greener Results&quot;</strong> philosophy.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Sprout className="w-8 h-8 text-[#4A7C59]" />
                                    1. Sourcing Better Fabrics
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Your garment&apos;s environmental impact begins with the fabric. Moving away from traditional, chemical-heavy textiles to natural or recycled alternatives is the biggest step you can take. Here are the materials that define the modern eco-conscious brand:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100 border-l-4 border-l-[#4A7C59]">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            Organic Cotton
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-0">Unlike traditional cotton (which uses more pesticides than any other crop), organic cotton is grown without synthetic chemicals. This keeps soil healthy, drastically reduces water usage, and provides a softer, hypoallergenic fabric for the end-user.</p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100 border-l-4 border-l-[#4A7C59]">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            Recycled Polyester (rPET)
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-0">Athleisure and activewear brands heavily rely on polyester for its moisture-wicking and durable properties. By utilizing recycled polyester—made from post-consumer plastic bottles—you actively remove plastic from the environment while still getting high-performance sportswear.</p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100 border-l-4 border-l-[#4A7C59]">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            Hemp & Bamboo
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-0">These rapidly renewable resources require drastically less water than cotton and no harmful pesticides. Bamboo creates incredibly soft, breathable fabrics perfect for loungewear, while hemp offers unmatched durability with a premium, structured drape similar to linen.</p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100 border-l-4 border-l-[#4A7C59]">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            Tencel™ / Lyocell
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-0">Sourced from sustainably managed wood pulp, Lyocell is produced in a closed-loop system where 99% of the water and solvents are recycled. It results in a luxurious, silky textile that drapes beautifully and biodegrades completely.</p>
                                    </div>
                                </div>

                                <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative max-w-4xl mx-auto">
                                    <Image
                                        src="/blog/sustainable_fabrics_texture.png"
                                        alt="High-quality organic cotton and sustainable textiles"
                                        width={1400}
                                        height={788}
                                        className="w-full h-auto max-h-[450px] object-cover"
                                    />
                                    <p className="text-center text-sm text-gray-500 p-3 bg-white border-t border-gray-100 m-0">Up close: the premium texture and organic feel of sustainably sourced fabrics.</p>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-[#4A7C59]" />
                                    2. Ethical Labor and Supply Chains
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    &quot;Eco-friendly&quot; is only half the equation; a truly sustainable brand must also be an ethical one. Conscious consumers care deeply about the individuals sewing their garments. 
                                </p>

                                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-8">
                                    <h3 className="text-xl font-bold text-[#2D2A2E] mb-4">The Pillars of an Ethical Supply Chain:</h3>
                                    <ul className="text-lg leading-relaxed space-y-4">
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-[#4A7C59] flex-shrink-0 mt-1" />
                                            <span><strong>Fair Wages & Working Conditions:</strong> Ensure your manufacturing partner guarantees living wages, normal working hours, and a safe, modern working environment for all their labor force.</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-[#4A7C59] flex-shrink-0 mt-1" />
                                            <span><strong>Complete Transparency:</strong> The most respected brands openly discuss where their garments are made. Radical transparency builds radical trust.</span>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-[#4A7C59] flex-shrink-0 mt-1" />
                                            <span><strong>Certifications:</strong> Look to partner with manufacturers holding certifications indicating fair trade, ethical sourcing, and organic textile standards.</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative max-w-4xl mx-auto">
                                    <Image
                                        src="/blog/ethical_manufacturing_process.png"
                                        alt="Modern and ethical fashion manufacturing facility"
                                        width={1400}
                                        height={788}
                                        className="w-full h-auto max-h-[450px] object-cover"
                                    />
                                    <p className="text-center text-sm text-gray-500 p-3 bg-white border-t border-gray-100 m-0">Inside a modern facility where ethical labor and craftsmanship go hand in hand.</p>
                                </div>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-6 mt-12">The Economics of Ethics: Why It Pays Off</h3>
                                <p className="leading-relaxed mb-8">
                                    Some startup founders worry that ensuring fair wages and utilizing sustainable fabrics will eat into their margins. However, market data shows the exact opposite. Conscious consumers have significantly higher purchasing power and display immense brand loyalty. By being radically transparent about your elevated manufacturing standards, your brand commands premium pricing that generic fast-fashion simply cannot reach.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Recycle className="w-8 h-8 text-[#4A7C59]" />
                                    3. Minimizing Waste Through Smarter Design
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    The global fashion industry throws away millions of tons of fabric scraps annually. Truly sustainable brands utilize design methods specifically crafted to minimize this waste. 
                                </p>
                                <p className="leading-relaxed mb-8">
                                    By incorporating zero-waste pattern drafting, designers can maximize fabric yield, ensuring near 100% of the textile is used in the garment. Moreover, offcuts can be shredded down into yarn to create recycled fabrics, or repurposed into accessories.
                                </p>
                                
                                <div className="bg-gradient-to-br from-[#1E2E23] to-[#2D3F33] p-10 rounded-2xl text-white shadow-xl relative overflow-hidden mt-10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A7C59] opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-6 mt-0 flex items-center gap-3">
                                            Smarter Manufacturing, Greener Results
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed text-lg mb-8">
                                            At Krazy Kreators, we are fully committed to sustainable practices. We merge innovative production technologies with eco-friendly fabrics so you can build out a conscious brand without sacrificing luxury or quality.
                                        </p>
                                        <ul className="space-y-4 mb-0 pl-0">
                                            <li className="flex items-start gap-4">
                                                <Leaf className="w-6 h-6 text-[#A0D4B2] flex-shrink-0 mt-1" />
                                                <span className="text-gray-200"><strong>Sustainable Sourcing:</strong> Access a massive library of organic cottons, recycled polyesters, bamboo, and hemp fabrics.</span>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <ShieldCheck className="w-6 h-6 text-[#A0D4B2] flex-shrink-0 mt-1" />
                                                <span className="text-gray-200"><strong>Ethical Vetting:</strong> Rest assured knowing every garment is produced under strict ethical guidelines.</span>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <Recycle className="w-6 h-6 text-[#A0D4B2] flex-shrink-0 mt-1" />
                                                <span className="text-gray-200"><strong>Optimized Production:</strong> Our tech-driven approach minimizes fabric waste during patterning and guarantees a low carbon footprint on manufacturing runs.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Conclusion */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Future is Green</h2>
                                <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                    <p className="text-lg leading-relaxed text-gray-700 m-0">
                                        Consumers are voting with their wallets for an ethical future. Launching a brand with sustainable materials and an ethical backbone not only protects our planet, but defines your brand as a premium, thoughtful household name capable of dominating the 2026 market.
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-white border-2 border-[#4A7C59] p-10 lg:p-14 rounded-3xl mt-16 text-center" ref={endOfArticleRef}>
                                <div className="max-w-2xl mx-auto">
                                    <span className="text-[#4A7C59] font-bold tracking-widest text-sm uppercase mb-4 block">Launch Your Conscious Line</span>
                                    <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Ready to Produce Ethically?</h3>
                                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                        Build garments you are proud to stand behind. Let&apos;s discuss your sustainable sourcing options and optimize your upcoming eco-friendly drop.
                                    </p>
                                    <Button
                                        onClick={() => setContactOpen(true)}
                                        className="bg-[#4A7C59] text-white hover:bg-[#386044] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#4A7C59]/30 font-semibold group flex flex-row items-center gap-2 mx-auto"
                                    >
                                        Start Sustainable Journey
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
                                                ? "bg-white text-[#4A7C59] border-2 border-[#4A7C59]"
                                                : "bg-white text-gray-600 hover:text-[#4A7C59] border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#4A7C59]' : ''}`} />
                                            {isLiked ? 'Liked' : 'Like'} ({likeCount})
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:text-[#4A7C59] border border-gray-200 text-sm font-medium transition-all duration-300"
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
                                <MessageCircle className="w-6 h-6 text-[#4A7C59]" />
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
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/20 outline-none transition-all bg-gray-50 focus:bg-white"
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
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/20 outline-none transition-all bg-gray-50 focus:bg-white"
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
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
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
                                        <div key={comment.id} id={`comment-${comment.id}`} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#4A7C59]/30 transition-all shadow-sm">
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
                                                        <button className="text-xs font-medium text-gray-400 hover:text-[#4A7C59] transition-colors">
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
