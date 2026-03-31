"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Leaf, Recycle, ShieldCheck, Factory, Droplets, TreePine, CheckCircle2, TrendingUp, BarChart3, Sparkles } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'sustainable-manufacturing-eco-friendly-fashion-brand';

type SustainableManufacturingClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function SustainableManufacturingClient({ initialLikeCount, initialComments }: SustainableManufacturingClientProps) {
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
    const [newComment, setNewComment] = useState({ name: "", email: "", comment: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const endOfArticleRef = useRef<HTMLDivElement | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleScroll = () => setScrolled(window.scrollY > 100);
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
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        } catch (error) {
            console.log('Error copying to clipboard:', error);
            showToast('Failed to copy link', 'error');
        }
    };

    const handleComment = () => {
        const commentsSection = document.querySelector('[data-comments-section]');
        if (commentsSection) commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleCommentLike = async (commentId: string) => {
        try {
            const action = likedComments.has(commentId) ? 'unlike' : 'like';
            const newCount = await likeComment(commentId, action);
            setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: newCount } : c));
            setLikedComments(prev => {
                const newSet = new Set(prev);
                if (newSet.has(commentId)) newSet.delete(commentId); else newSet.add(commentId);
                return newSet;
            });
        } catch {
            console.error('Failed to toggle like for comment:', commentId);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prev => ({ ...prev, [name]: value }));
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
                id: created.id, name: created.name, email: created.email, comment: created.comment,
                date: new Date(created.created_at).toLocaleString(),
                avatar: (created.name || '?').charAt(0).toUpperCase(), likes: 0,
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
                    src="/blog/sustainable-manufacturing-banner.png"
                    alt="Sustainable Fashion Manufacturing"
                    fill
                    className="object-cover object-top"
                    priority
                    style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 max-w-5xl">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-full uppercase tracking-wider mb-6 animate-fade-in-up">
                            <Leaf className="w-4 h-4" />
                            Sustainability
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Sustainable Manufacturing: How to Build an Eco-Friendly Fashion Brand
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            Smarter manufacturing, greener results. The complete playbook for conscious brands in 2026.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 sm:py-24 lg:py-28 bg-white">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                    <div className="w-full">
                        {/* Social Interaction Bar */}
                        <div className="mb-12 p-4 bg-[#F8F7F4] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-24 z-10 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-bold">KK</div>
                                    <div className="text-sm">
                                        <p className="font-bold text-[#2D2A2E]">Krazy Kreators Team</p>
                                        <p className="text-[#666666]">March 20, 2026</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button onClick={handleLike} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isLiked ? "bg-[#CBB49A] text-white" : "bg-white text-gray-600 hover:bg-[#CBB49A]/10 border border-gray-200"}`}>
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                                    {likeCount}
                                </button>
                                <button onClick={handleComment} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                                    <MessageCircle className="w-4 h-4" />
                                    {commentCount}
                                </button>
                                <button onClick={handleShare} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#2D2A2E] text-white hover:bg-black text-sm font-medium transition-all duration-300">
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
                                    Sustainability is no longer a marketing buzzword—it&apos;s a business imperative. The modern consumer doesn&apos;t just want to wear good clothes; they want to wear clothes that reflect their values. For fashion brands, this means the era of &quot;greenwashing&quot; is over, and the era of genuine, auditable sustainability has begun.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    The numbers are staggering: the fashion industry accounts for roughly 10% of global carbon emissions and nearly 20% of global wastewater. Consumers are paying attention. A 2025 McKinsey report found that 67% of consumers now consider sustainability when making a purchase, and they&apos;re willing to pay a 10-15% premium for genuinely eco-friendly products.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    But here&apos;s the critical nuance: &quot;sustainable&quot; isn&apos;t just about the fabric. It&apos;s the entire lifecycle—from fiber sourcing and dyeing processes to labor ethics, packaging, logistics, and end-of-life recyclability. Building a truly eco-friendly fashion brand requires a systems-level approach to manufacturing.
                                </p>
                                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl my-8">
                                    <h4 className="flex items-center gap-2 font-bold text-emerald-900 m-0 mb-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Why This Matters for Your Brand
                                    </h4>
                                    <p className="text-emerald-800 m-0">
                                        Brands that lead on sustainability don&apos;t just attract conscious consumers—they attract premium pricing, retail partnerships (Nordstrom, Selfridges), and press coverage that money can&apos;t buy. This isn&apos;t an expense; it&apos;s an investment in long-term brand equity.
                                    </p>
                                </div>
                            </div>

                            {/* Section 1: Sustainable Fabrics */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Leaf className="w-8 h-8 text-emerald-600" />
                                    1. Sustainable Fabrics: The Foundation of Green Fashion
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Every sustainable garment starts with the fiber. The choice of raw material determines the environmental footprint of the entire product. Here&apos;s a breakdown of the best options for eco-conscious brands in 2026:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Organic Cotton (GOTS Certified)</h3>
                                        <p className="text-sm leading-relaxed mb-4">
                                            Grown without synthetic pesticides or GMO seeds, GOTS-certified organic cotton uses up to 91% less water than conventional cotton (Textile Exchange, 2025). It&apos;s the gold standard for sustainable basics, tees, and denim.
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span><strong>Best for:</strong> T-shirts, denim, basics, loungewear</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span><strong>Cost impact:</strong> 15-30% more than conventional cotton</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span><strong>Certify with:</strong> GOTS (Global Organic Textile Standard)</span></li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Recycled Polyester (rPET)</h3>
                                        <p className="text-sm leading-relaxed mb-4">
                                            Made from post-consumer plastic bottles or recycled garments, rPET reduces the carbon footprint of virgin polyester by up to 75%. It retains all the performance properties—moisture-wicking, durability, stretch—with a fraction of the environmental cost.
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span><strong>Best for:</strong> Activewear, outerwear, linings</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span><strong>Cost impact:</strong> 10-20% more than virgin polyester</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" /><span><strong>Certify with:</strong> GRS (Global Recycled Standard)</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-100">
                                        <TreePine className="w-8 h-8 text-emerald-600 mb-4" />
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">TENCEL&trade; Lyocell</h4>
                                        <p className="text-sm text-gray-600">Made from sustainably sourced wood pulp in a closed-loop process that recovers 99% of the solvent used. Silky soft, breathable, and biodegradable.</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                                        <Droplets className="w-8 h-8 text-blue-600 mb-4" />
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Hemp</h4>
                                        <p className="text-sm text-gray-600">Requires zero pesticides and 50% less water than cotton. Naturally antimicrobial. Gets softer with every wash while maintaining structural integrity.</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-100">
                                        <Sparkles className="w-8 h-8 text-amber-600 mb-4" />
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Bamboo Linen</h4>
                                        <p className="text-sm text-gray-600">Bamboo grows rapidly without fertilizer. Mechanically processed bamboo linen (not viscose) is a truly sustainable alternative with a luxurious drape.</p>
                                    </div>
                                </div>

                                {/* Fabric Comparison Table */}
                                <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100 overflow-x-auto">
                                    <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-[#CBB49A]" />
                                        Sustainable Fabric Comparison
                                    </h3>
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="border-b border-gray-300">
                                                <th className="py-3 pr-4 font-bold text-[#2D2A2E]">Fabric</th>
                                                <th className="py-3 pr-4 font-bold text-[#2D2A2E]">Water Usage</th>
                                                <th className="py-3 pr-4 font-bold text-[#2D2A2E]">Carbon Footprint</th>
                                                <th className="py-3 pr-4 font-bold text-[#2D2A2E]">Biodegradable</th>
                                                <th className="py-3 font-bold text-[#2D2A2E]">Cost Premium</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600">
                                            <tr className="border-b border-gray-100"><td className="py-3 pr-4 font-medium">Organic Cotton</td><td className="py-3 pr-4">Low</td><td className="py-3 pr-4">Low</td><td className="py-3 pr-4">✅ Yes</td><td className="py-3">+15-30%</td></tr>
                                            <tr className="border-b border-gray-100"><td className="py-3 pr-4 font-medium">Recycled Polyester</td><td className="py-3 pr-4">Very Low</td><td className="py-3 pr-4">Very Low</td><td className="py-3 pr-4">❌ No</td><td className="py-3">+10-20%</td></tr>
                                            <tr className="border-b border-gray-100"><td className="py-3 pr-4 font-medium">TENCEL&trade;</td><td className="py-3 pr-4">Very Low</td><td className="py-3 pr-4">Low</td><td className="py-3 pr-4">✅ Yes</td><td className="py-3">+20-35%</td></tr>
                                            <tr className="border-b border-gray-100"><td className="py-3 pr-4 font-medium">Hemp</td><td className="py-3 pr-4">Very Low</td><td className="py-3 pr-4">Very Low</td><td className="py-3 pr-4">✅ Yes</td><td className="py-3">+25-40%</td></tr>
                                            <tr><td className="py-3 pr-4 font-medium">Bamboo Linen</td><td className="py-3 pr-4">Low</td><td className="py-3 pr-4">Low</td><td className="py-3 pr-4">✅ Yes</td><td className="py-3">+20-30%</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative max-w-2xl mx-auto">
                                    <Image
                                        src="/blog/sustainable-fabrics-detail.png"
                                        alt="Sustainable Organic Fabrics Flat Lay"
                                        width={640}
                                        height={640}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>

                            {/* Section 2: Ethical Labor */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-emerald-600" />
                                    2. Ethical Labor: The Human Side of Sustainability
                                </h2>
                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative max-w-2xl mx-auto">
                                    <Image
                                        src="/blog/ethical-factory-wide.png"
                                        alt="Clean Modern Ethical Garment Factory"
                                        width={640}
                                        height={640}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                <p className="leading-relaxed mb-8">
                                    A garment isn&apos;t truly sustainable if the people who made it were exploited. Ethical labor practices are the non-negotiable pillar of any genuine sustainability strategy. Post-Rana Plaza, this is no longer optional—it&apos;s a regulatory and reputational requirement.
                                </p>
                                <div className="space-y-6 mb-10">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4">What Ethical Manufacturing Looks Like</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2">Fair Wages</h4>
                                                <p className="text-sm text-gray-600">Living wages—not just minimum wages. There&apos;s a massive difference. A fair wage covers housing, food, healthcare, education, and savings. Partner with manufacturers who can prove wage audits.</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2">Safe Working Conditions</h4>
                                                <p className="text-sm text-gray-600">Well-ventilated facilities, proper lighting, fire safety systems, access to clean water, and reasonable working hours (no more than 48 hours/week + voluntary overtime).</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2">No Child Labor</h4>
                                                <p className="text-sm text-gray-600">Verified age documentation for all workers. Third-party audits (SMETA, BSCI, SA8000) to ensure compliance across the entire supply chain, including subcontractors.</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2">Transparency</h4>
                                                <p className="text-sm text-gray-600">Open factory doors. Invite your customers to see where their clothes are made. Brands like Everlane and Patagonia have turned radical transparency into a competitive advantage.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-emerald-900 text-white p-8 rounded-2xl">
                                    <h3 className="text-xl font-bold mb-4">Key Certifications to Look For</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-emerald-800/50 p-4 rounded-xl">
                                            <strong className="block text-emerald-300 mb-1">SA8000</strong>
                                            <span className="text-emerald-100 text-sm">The gold standard for social accountability. Covers child labor, forced labor, health &amp; safety, and management systems.</span>
                                        </div>
                                        <div className="bg-emerald-800/50 p-4 rounded-xl">
                                            <strong className="block text-emerald-300 mb-1">Fair Trade Certified</strong>
                                            <span className="text-emerald-100 text-sm">Guarantees fair prices, community development premiums, and environmental standards for producers.</span>
                                        </div>
                                        <div className="bg-emerald-800/50 p-4 rounded-xl">
                                            <strong className="block text-emerald-300 mb-1">WRAP</strong>
                                            <span className="text-emerald-100 text-sm">Worldwide Responsible Accredited Production. Focuses on lawful, humane, and ethical manufacturing.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Minimizing Waste */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Recycle className="w-8 h-8 text-emerald-600" />
                                    3. Minimizing Waste: From Design to Delivery
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    The fashion industry generates 92 million tonnes of textile waste annually. A truly sustainable brand designs waste out of the system from the very first sketch. Here are the strategies that work:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Zero-Waste Patterning</div>
                                        <p className="text-xs text-gray-500">Design patterns that interlock like puzzle pieces on the fabric, using 100% of the material with no off-cuts going to landfill.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Made-to-Order</div>
                                        <p className="text-xs text-gray-500">Produce only what&apos;s been sold. Eliminates deadstock entirely. Combined with the Drop Model (low MOQ), this is the gold standard.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Deadstock Upcycling</div>
                                        <p className="text-xs text-gray-500">Transform leftover fabrics and off-cuts into accessories, patchwork pieces, or limited-edition capsules.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Eco-Packaging</div>
                                        <p className="text-xs text-gray-500">Replace poly bags with compostable mailers. Use recycled cardboard boxes. Eliminate unnecessary tissue paper and plastic hangers.</p>
                                    </div>
                                </div>
                                <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-[#2D2A2E] mb-4">Sustainable Dyeing &amp; Finishing</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-36 shrink-0 font-bold text-gray-900">Waterless Dyeing</div>
                                            <div className="text-gray-600 text-sm">Technologies like DyeCoo use supercritical CO&#8322; instead of water as a solvent. Zero wastewater, zero chemicals, 50% faster than conventional dyeing.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-36 shrink-0 font-bold text-gray-900">Natural Dyes</div>
                                            <div className="text-gray-600 text-sm">Derived from plants (indigo, turmeric, pomegranate), minerals, or insects. Beautiful, unique color palettes—but require mordants for colorfastness.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-36 shrink-0 font-bold text-gray-900">OEKO-TEX&reg;</div>
                                            <div className="text-gray-600 text-sm">The OEKO-TEX Standard 100 certifies that every component of a finished product has been tested for harmful chemicals. Non-negotiable for EU and US markets.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Building Your Ethical Supply Chain */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Factory className="w-8 h-8 text-emerald-600" />
                                    4. Building Your Ethical Supply Chain
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    The supply chain is where sustainability either becomes real or falls apart. A brand can use organic cotton but if it&apos;s dyed in a factory dumping chemicals into a river, the sustainability claim is meaningless.
                                </p>
                                <div className="bg-[#2D2A2E] text-white p-8 rounded-2xl">
                                    <h3 className="text-xl font-bold mb-4">Your Sustainable Supply Chain Checklist</h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs mt-0.5">1</div>
                                            <div><strong className="block text-emerald-400">Audit Your Tier 1 &amp; Tier 2 Suppliers</strong><span className="text-gray-400 text-sm">Tier 1 is your garment factory. Tier 2 is the fabric mill. Both need to meet your sustainability standards. Don&apos;t just audit the sewing floor—audit the dyehouse.</span></div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs mt-0.5">2</div>
                                            <div><strong className="block text-emerald-400">Demand Certified Raw Materials</strong><span className="text-gray-400 text-sm">GOTS for organic cotton, GRS for recycled polyester, FSC for wood-based fibers (TENCEL). No certificate, no order.</span></div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs mt-0.5">3</div>
                                            <div><strong className="block text-emerald-400">Map Your Carbon Footprint</strong><span className="text-gray-400 text-sm">Use tools like the Higg Index or Carbon Trust to measure and report your CO&#8322; emissions per garment. Set reduction targets annually.</span></div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs mt-0.5">4</div>
                                            <div><strong className="block text-emerald-400">Consolidate Shipments</strong><span className="text-gray-400 text-sm">Sea freight over air freight whenever possible (40x lower emissions). Consolidate orders to reduce the number of shipments per year.</span></div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs mt-0.5">5</div>
                                            <div><strong className="block text-emerald-400">Choose Proximity</strong><span className="text-gray-400 text-sm">Nearshoring or working with manufacturers in regions like India (powered by solar and wind energy) significantly cuts transportation emissions.</span></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Is sustainable manufacturing more expensive?</h4>
                                        <p className="text-sm text-gray-600 m-0">Yes, initially. Sustainable fabrics carry a 10-40% premium. However, brands using sustainable practices report 20-30% higher customer lifetime value, lower return rates, and significantly stronger wholesale relationships. The ROI is clear within 12-18 months.</p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">What certifications should I prioritize first?</h4>
                                        <p className="text-sm text-gray-600 m-0">Start with GOTS (for cotton products) or GRS (for recycled materials) and OEKO-TEX Standard 100. These are the most widely recognized by retailers and consumers globally. Add SA8000 or WRAP for social compliance as you scale.</p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Can I start small with sustainability?</h4>
                                        <p className="text-sm text-gray-600 m-0">Absolutely. Start with one capsule collection using organic cotton. Switch to compostable poly bags. Choose a manufacturer with existing certifications. You don&apos;t need to overhaul everything at once—but you need to start.</p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">How do I communicate sustainability to my customers?</h4>
                                        <p className="text-sm text-gray-600 m-0">Be specific, not vague. Don&apos;t say &quot;eco-friendly.&quot; Say &quot;Made from GOTS-certified organic cotton, dyed with OEKO-TEX approved dyes, in an SA8000-certified facility.&quot; Specificity builds trust. Consider adding a QR code to your hang tags linking to your supply chain story.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Conclusion */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Future is Green—and Profitable</h2>
                                <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white p-8 rounded-2xl">
                                    <p className="text-lg leading-relaxed mb-6 text-white">
                                        Sustainability isn&apos;t a cost center—it&apos;s your competitive moat. The brands winning in 2026 are those who can prove their green credentials with certificates, not just Instagram posts. The consumer has evolved. Your manufacturing must evolve with them.
                                    </p>
                                    <p className="text-xl font-bold text-emerald-300">
                                        Build with intention. Manufacture with integrity. The market will reward you.
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-[#2D2A2E] text-white p-10 lg:p-14 rounded-3xl mt-16 relative overflow-hidden text-center" ref={endOfArticleRef}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#CBB49A] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
                                <div className="relative z-10 max-w-2xl mx-auto">
                                    <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-4 block">Ready to Go Green?</span>
                                    <h3 className="text-3xl font-bold mb-6">Looking for a Sustainable Clothing Manufacturer?</h3>
                                    <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                        Krazy Kreators combines eco-friendly fashion production with premium quality. From organic cotton sourcing to OEKO-TEX certified processes, we help conscious brands manufacture responsibly.
                                    </p>
                                    <Button onClick={() => setContactOpen(true)} className="bg-emerald-600 text-white hover:bg-emerald-700 border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-emerald-500/30 font-semibold">
                                        Start Your Sustainable Journey
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
                                        <button onClick={handleLike} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLiked ? "bg-white text-[#CBB49A] border-2 border-[#CBB49A]" : "bg-white text-gray-600 hover:text-[#CBB49A] border border-gray-200"}`}>
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                                            {isLiked ? 'Liked' : 'Like'} ({likeCount})
                                        </button>
                                        <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:text-[#CBB49A] border border-gray-200 text-sm font-medium transition-all duration-300">
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
                                <MessageCircle className="w-6 h-6 text-[#CBB49A]" />
                                Discussion ({commentCount})
                            </h3>
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm mb-12">
                                <h4 className="text-lg font-semibold text-[#2D2A2E] mb-6">Leave a Reply</h4>
                                <form onSubmit={handleSubmitComment} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                                            <input type="text" id="name" name="name" value={newComment.name} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CBB49A] focus:ring-2 focus:ring-[#CBB49A]/20 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="John Doe" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                                            <input type="email" id="email" name="email" value={newComment.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CBB49A] focus:ring-2 focus:ring-[#CBB49A]/20 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="john@example.com" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="comment" className="text-sm font-medium text-gray-700">Comment</label>
                                        <textarea id="comment" name="comment" value={newComment.comment} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CBB49A] focus:ring-2 focus:ring-[#CBB49A]/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none" placeholder="Share your thoughts..." required></textarea>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500">Your email address will not be published.</p>
                                        <Button type="submit" disabled={isSubmitting} className="bg-[#2D2A2E] text-white hover:bg-black px-8 py-3 rounded-xl transition-all disabled:opacity-50">
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
                            <div className="space-y-6">
                                {comments.length > 0 ? (
                                    (showAllComments ? comments : comments.slice(0, 5)).map((comment) => (
                                        <div key={comment.id} id={`comment-${comment.id}`} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#CBB49A]/30 transition-all shadow-sm">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0">{comment.avatar}</div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="font-bold text-[#2D2A2E]">{comment.name}</h5>
                                                        <span className="text-xs text-gray-400">{comment.date}</span>
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed mb-4">{comment.comment}</p>
                                                    <div className="flex items-center gap-4">
                                                        <button onClick={() => handleCommentLike(comment.id)} className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likedComments.has(comment.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
                                                            <Heart className={`w-3.5 h-3.5 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                                                            {comment.likes || 0} Likes
                                                        </button>
                                                        <button className="text-xs font-medium text-gray-400 hover:text-[#CBB49A] transition-colors">Reply</button>
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
                                        <button onClick={() => setShowAllComments(!showAllComments)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition-all">
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
