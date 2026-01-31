"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2, Heart, MessageCircle, Leaf, Recycle, ShieldCheck, Users, TrendingUp, DollarSign, Clock, AlertTriangle, RefreshCw, Globe, CheckCircle2 } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'anti-fast-fashion-slow-brand';

type AntiFastFashionClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function AntiFastFashionClient({ initialLikeCount, initialComments }: AntiFastFashionClientProps) {
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
    const [showAllComments, setShowAllComments] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const endOfArticleRef = useRef<HTMLDivElement | null>(null);
    const { showToast, ToastContainer } = useToast();

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
                    src="/blog/anti-fast-fashion-banner.png"
                    alt="Slow Fashion vs Fast Fashion"
                    fill
                    className="object-cover"
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
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#CBB49A] text-white text-sm font-semibold rounded-full uppercase tracking-wider mb-6 animate-fade-in-up">
                            <Leaf className="w-4 h-4" />
                            Industry Insights
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Anti-Fast Fashion: Building a Brand That Lasts
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            The era of disposable clothing is ending. Here is how to position your brand for the quality-first revolution.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[85%] lg:max-w-[85%] xl:max-w-[70%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">

                        {/* Social Interaction Section */}
                        <div className="mb-12 p-4 bg-[#F8F7F4] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-24 z-10 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-bold">
                                        KK
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-[#2D2A2E]">Krazy Kreators Team</p>
                                        <p className="text-[#666666]">January 28, 2026</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleLike}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                        ? "bg-[#CBB49A] text-white"
                                        : "bg-white text-gray-600 hover:bg-[#CBB49A]/10 border border-gray-200"
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
                        <div className="prose prose-lg max-w-none text-[#666666]">

                            {/* Introduction containing the "Hook" */}
                            <div className="mb-16">
                                <p className="text-2xl font-medium text-[#2D2A2E] leading-relaxed mb-8">
                                    Let’s be honest: The world doesn’t need another $5 polyester t-shirt.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    For the past decade, the fashion industry has been stuck in a race to the bottom. Ultra-fast fashion giants like Shein and Temu have normalized disposable clothing, churning out thousands of new styles every day at prices that seem too good to be true.
                                </p>
                                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl my-8">
                                    <h4 className="flex items-center gap-2 font-bold text-red-900 m-0 mb-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        The Consumer Fatigue is Real
                                    </h4>
                                    <p className="text-red-800 m-0">
                                        Recent data shows a massive shift in 2026. Returns on ultra-cheap fashion have hit record highs (over 40%) as customers get tired of poor fabrics, bad fits, and items that fall apart after one wash.
                                    </p>
                                </div>
                                <p className="leading-relaxed mb-6">
                                    This creates a massive opening for <strong>Slow Fashion</strong>. Customers are willing to pay more—significantly more—for &quot;quality that lasts.&quot; They are looking for brands that stand for something.
                                </p>
                            </div>

                            {/* The Real Cost of Fast Fashion */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                    The Hidden Cost of Fast Fashion
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Before we dive into building a slow fashion brand, it&apos;s crucial to understand what you&apos;re fighting against. The fast fashion industry isn&apos;t just a business model—it&apos;s an environmental and social crisis happening in plain sight.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                    <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100 text-center">
                                        <div className="text-4xl font-bold text-red-600 mb-2">92M</div>
                                        <p className="text-sm text-red-800 font-medium">Tons of textile waste dumped in landfills annually</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">20%</div>
                                        <p className="text-sm text-blue-800 font-medium">Of global water pollution comes from textile dyeing</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 text-center">
                                        <div className="text-4xl font-bold text-purple-600 mb-2">10%</div>
                                        <p className="text-sm text-purple-800 font-medium">Of global carbon emissions from fashion industry</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-100 text-center">
                                        <div className="text-4xl font-bold text-amber-600 mb-2">7</div>
                                        <p className="text-sm text-amber-800 font-medium">Average wears before a fast fashion item is discarded</p>
                                    </div>
                                </div>

                                <div className="bg-gray-900 text-white p-8 rounded-2xl">
                                    <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-[#CBB49A]" />
                                        The Human Cost
                                    </h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">
                                        Behind every $5 dress is a worker—often in Bangladesh, Vietnam, or Cambodia—earning less than $3 per day. The 2013 Rana Plaza collapse in Bangladesh killed over 1,100 garment workers and injured 2,500 more. Despite global outrage, conditions in many factories have barely improved.
                                    </p>
                                    <p className="text-gray-300 leading-relaxed">
                                        When you build a slow fashion brand, you&apos;re not just creating clothes—you&apos;re creating a business model that respects human dignity. That&apos;s a story worth telling.
                                    </p>
                                </div>
                            </div>

                            {/* What is Slow Fashion? */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <RefreshCw className="w-8 h-8 text-[#CBB49A]" />
                                    What is a &quot;Slow Fashion&quot; Brand?
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Slow fashion isn&apos;t just about being expensive. It&apos;s a completely different business model. It separates itself from the &quot;churn-and-burn&quot; of fast fashion through three core pillars:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Durability First</h3>
                                        <p className="text-sm leading-relaxed m-0">
                                            Garments engineered to last years, not weeks. High GSM fabrics, reinforced stitching, and premium finishes.
                                        </p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Radical Transparency</h3>
                                        <p className="text-sm leading-relaxed m-0">
                                            Knowing exactly who made the clothes and where. No hidden sweatshops, just honest supply chains.
                                        </p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Timeless Design</h3>
                                        <p className="text-sm leading-relaxed m-0">
                                            Ignoring micro-trends. Creating versatile &quot;capsule&quot; pieces that don&apos;t go out of style next season.
                                        </p>
                                    </div>
                                </div>

                                {/* Consumer Psychology Insight */}
                                <div className="bg-gradient-to-r from-[#CBB49A]/10 to-[#CBB49A]/5 border-l-4 border-[#CBB49A] p-6 rounded-r-xl">
                                    <h4 className="font-bold text-[#2D2A2E] mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-[#CBB49A]" />
                                        The Psychology Behind the Shift
                                    </h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">
                                        Research from McKinsey&apos;s 2025 State of Fashion report shows that <strong>67% of consumers</strong> now consider sustainability when making a purchase, up from just 37% in 2019. But here&apos;s the key insight: it&apos;s not just about the planet.
                                    </p>
                                    <p className="text-[#666666] leading-relaxed">
                                        Consumers are experiencing <strong>&quot;purchase fatigue&quot;</strong>—the emotional exhaustion of constantly buying, returning, and discarding. They want to buy less, but buy better. They want their purchases to mean something. This presents an enormous opportunity for brands that can deliver quality AND purpose.
                                    </p>
                                </div>
                            </div>

                            {/* How to Build It Section */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-10">How to Build Your Slow Fashion Brand</h2>

                                <div className="space-y-12">
                                    {/* Step 1 */}
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 border-2 border-gray-100 text-center sticky top-32">
                                            <div className="text-5xl font-bold text-[#CBB49A]/20 mb-2">01</div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Fabric is King</h4>
                                            <p className="text-sm text-gray-500">Stop using cheap polyester.</p>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-2xl font-bold text-[#2D2A2E] mt-0 mb-4">Start with the Material</h3>
                                            <p className="leading-relaxed mb-4">
                                                Fast fashion relies on polyester because it&apos;s cheap. It also sheds microplastics and feels sweaty. To differentiate, you must offer superior hand-feel.
                                            </p>
                                            <ul className="space-y-3 mb-6 list-none pl-0">
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                    <span><strong>Organic Cotton & Hemp:</strong> Breaths better, lasts longer, and ages beautifully.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                    <span><strong>Tencel / Lyocell:</strong> The premium sustainable alternative with a silk-like drape.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                    <span><strong>Heavyweight GSM:</strong> A 240 GSM t-shirt immediately feels like a luxury item compared to a standard 140 GSM fast-fashion tee.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 border-2 border-gray-100 text-center sticky top-32">
                                            <div className="text-5xl font-bold text-[#CBB49A]/20 mb-2">02</div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">The &quot;Who&quot; Factor</h4>
                                            <p className="text-sm text-gray-500">Turn your factory into a character.</p>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-2xl font-bold text-[#2D2A2E] mt-0 mb-4">Show Your Supply Chain</h3>
                                            <p className="leading-relaxed mb-4">
                                                In the era of Shein, <strong>transparency is your marketing superpower</strong>. Don&apos;t hide your manufacturer—celebrate them.
                                            </p>
                                            <p className="leading-relaxed mb-4">
                                                Show videos of the stitching process. Interview the master cutter. Show the clean, ethical environment where the clothes are made. When customers see the human effort behind a garment, they understand why it costs $80 instead of $8.
                                            </p>
                                            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                                                <strong>Krazy Kreators Tip:</strong> We encourage our clients to visit our facilities or use our production footage in their marketing. It builds instant trust.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 border-2 border-gray-100 text-center sticky top-32">
                                            <div className="text-5xl font-bold text-[#CBB49A]/20 mb-2">03</div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Price for Value</h4>
                                            <p className="text-sm text-gray-500">Educate on Cost-Per-Wear.</p>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-2xl font-bold text-[#2D2A2E] mt-0 mb-4">Flip the Pricing Narrative</h3>
                                            <p className="leading-relaxed mb-4">
                                                Don&apos;t apologize for higher prices. Explain them. Use the &quot;Cost Per Wear&quot; argument:
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                                    <h5 className="font-bold text-red-800 text-sm mb-1">Fast Fashion Tee ($10)</h5>
                                                    <p className="text-xs text-red-700">Washed 5 times before losing shape.<br /><strong>Cost: $2.00 per wear.</strong></p>
                                                </div>
                                                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                    <h5 className="font-bold text-green-800 text-sm mb-1">Your Premium Tee ($40)</h5>
                                                    <p className="text-xs text-green-700">Worn 50+ times and still looks new.<br /><strong>Cost: $0.80 per wear.</strong></p>
                                                </div>
                                            </div>
                                            <p className="leading-relaxed">
                                                When you frame it this way, Slow Fashion becomes the logical financial choice, not just the ethical one.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 4 */}
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 border-2 border-gray-100 text-center sticky top-32">
                                            <div className="text-5xl font-bold text-[#CBB49A]/20 mb-2">04</div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Story First</h4>
                                            <p className="text-sm text-gray-500">Craft an authentic narrative.</p>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-2xl font-bold text-[#2D2A2E] mt-0 mb-4">Build Your Brand Story</h3>
                                            <p className="leading-relaxed mb-4">
                                                Slow fashion brands don&apos;t just sell products—they sell a <strong>philosophy</strong>. Your brand story should answer these questions:
                                            </p>
                                            <ul className="space-y-3 mb-6 list-none pl-0">
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                    <span><strong>Why did you start?</strong> What moment, frustration, or realization sparked your journey?</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                    <span><strong>What do you stand against?</strong> Be specific about the industry problems you&apos;re rejecting.</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                    <span><strong>What future are you building?</strong> Paint a picture of the world you want to create.</span>
                                                </li>
                                            </ul>
                                            <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-100">
                                                <strong>Pro Tip:</strong> Document everything from Day 1. Those early struggles, prototypes, and behind-the-scenes moments become powerful content that builds authenticity.
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 5 */}
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 border-2 border-gray-100 text-center sticky top-32">
                                            <div className="text-5xl font-bold text-[#CBB49A]/20 mb-2">05</div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Community</h4>
                                            <p className="text-sm text-gray-500">Build a tribe, not just customers.</p>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-2xl font-bold text-[#2D2A2E] mt-0 mb-4">Create a Movement, Not Just a Brand</h3>
                                            <p className="leading-relaxed mb-4">
                                                Fast fashion relies on constant advertising to drive impulse purchases. Slow fashion brands win through <strong>community and advocacy</strong>. Your customers should feel like members of a movement.
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                <div className="bg-[#F8F7F4] p-4 rounded-xl border border-gray-100">
                                                    <h5 className="font-bold text-[#2D2A2E] text-sm mb-2">User-Generated Content</h5>
                                                    <p className="text-xs text-gray-600">Encourage customers to share how they style your pieces. Repost them. Celebrate them.</p>
                                                </div>
                                                <div className="bg-[#F8F7F4] p-4 rounded-xl border border-gray-100">
                                                    <h5 className="font-bold text-[#2D2A2E] text-sm mb-2">Repair Programs</h5>
                                                    <p className="text-xs text-gray-600">Offer free repairs or tutorials. This reinforces longevity and deepens loyalty.</p>
                                                </div>
                                                <div className="bg-[#F8F7F4] p-4 rounded-xl border border-gray-100">
                                                    <h5 className="font-bold text-[#2D2A2E] text-sm mb-2">Educational Content</h5>
                                                    <p className="text-xs text-gray-600">Teach your audience about fabrics, care, and the real cost of fashion. Knowledge builds trust.</p>
                                                </div>
                                                <div className="bg-[#F8F7F4] p-4 rounded-xl border border-gray-100">
                                                    <h5 className="font-bold text-[#2D2A2E] text-sm mb-2">Exclusive Access</h5>
                                                    <p className="text-xs text-gray-600">Give loyal customers early access to new drops, design input, or factory tours.</p>
                                                </div>
                                            </div>
                                            <p className="leading-relaxed text-sm italic text-gray-500">
                                                &quot;People don&apos;t buy what you do; they buy why you do it.&quot; — Simon Sinek
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 6 */}
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 border-2 border-gray-100 text-center sticky top-32">
                                            <div className="text-5xl font-bold text-[#CBB49A]/20 mb-2">06</div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Get Certified</h4>
                                            <p className="text-sm text-gray-500">Back up your claims with credentials.</p>
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-2xl font-bold text-[#2D2A2E] mt-0 mb-4">Invest in Certifications</h3>
                                            <p className="leading-relaxed mb-4">
                                                In a world of greenwashing, certifications provide <strong>third-party validation</strong> that your claims are real. They&apos;re expensive but worth it.
                                            </p>
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">GOTS</div>
                                                    <div>
                                                        <h5 className="font-bold text-green-800 text-sm">Global Organic Textile Standard</h5>
                                                        <p className="text-xs text-green-700">The gold standard for organic textiles. Covers entire supply chain.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">Oeko</div>
                                                    <div>
                                                        <h5 className="font-bold text-blue-800 text-sm">OEKO-TEX Standard 100</h5>
                                                        <p className="text-xs text-blue-700">Certifies textiles are free from harmful substances. Consumer-trusted.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">B</div>
                                                    <div>
                                                        <h5 className="font-bold text-purple-800 text-sm">B Corp Certification</h5>
                                                        <p className="text-xs text-purple-700">Proves your entire business prioritizes people and planet, not just profit.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                                    <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">FT</div>
                                                    <div>
                                                        <h5 className="font-bold text-amber-800 text-sm">Fair Trade Certified</h5>
                                                        <p className="text-xs text-amber-700">Ensures fair wages and safe working conditions for garment workers.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Marketing Strategies Section */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <TrendingUp className="w-8 h-8 text-[#CBB49A]" />
                                    Marketing Your Slow Fashion Brand
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Traditional marketing tactics (flash sales, constant discounts, urgency messaging) contradict slow fashion values. Here&apos;s how to market authentically:
                                </p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                    <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <Leaf className="w-5 h-5 text-green-600" />
                                            Content That Educates
                                        </h3>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Behind-the-scenes of your production process</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Fabric deep-dives: why organic cotton feels different</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Care guides to maximize garment lifespan</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Industry exposés on fast fashion practices</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-600" />
                                            Influencer Strategy
                                        </h3>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Partner with micro-influencers (5K-50K) for authentic reach</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Focus on lifestyle/sustainability creators, not just fashion</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Long-term ambassadorships over one-off posts</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Prioritize engagement rate over follower count</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-amber-600" />
                                            Pricing Psychology
                                        </h3>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Never discount—it undermines the &quot;quality&quot; narrative</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Use transparent pricing breakdowns (fabric: $X, labor: $Y)</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Offer payment plans to increase accessibility</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Compare lifetime value vs. fast fashion alternatives</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <Recycle className="w-5 h-5 text-purple-600" />
                                            Sustainability Messaging
                                        </h3>
                                        <ul className="space-y-3 text-sm text-gray-600">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Be specific: &quot;saves 2,700L of water per tee&quot; beats &quot;eco-friendly&quot;</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Acknowledge imperfections—no brand is 100% sustainable</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Share your sustainability roadmap and goals</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                <span>Publish annual impact reports with real data</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Success Stories */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <TrendingUp className="w-8 h-8 text-green-600" />
                                    Brands That Got It Right
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    These brands prove that slow fashion isn&apos;t just idealistic—it&apos;s profitable. Here&apos;s what they did right:
                                </p>

                                <div className="space-y-6">
                                    <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-[#CBB49A]/50 transition-all">
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-amber-800 flex-shrink-0">
                                                P
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Patagonia</h3>
                                                <p className="text-sm text-[#CBB49A] font-medium mb-3">The Original Slow Fashion Pioneer</p>
                                                <p className="text-gray-600 leading-relaxed mb-4">
                                                    Famous for their &quot;Don&apos;t Buy This Jacket&quot; campaign, Patagonia built a $1B+ brand by actively discouraging overconsumption. Their Worn Wear program encourages customers to repair rather than replace, and they donate 1% of all sales to environmental causes.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">B Corp Certified</span>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Repair Program</span>
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Environmental Activism</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-[#CBB49A]/50 transition-all">
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-gray-800 flex-shrink-0">
                                                E
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Everlane</h3>
                                                <p className="text-sm text-[#CBB49A] font-medium mb-3">The Radical Transparency Leader</p>
                                                <p className="text-gray-600 leading-relaxed mb-4">
                                                    Everlane disrupted the industry by publishing the full cost breakdown of every product—factory costs, materials, labor, transport, and their markup. This transparency converts skeptics into believers and justifies premium pricing.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Transparent Pricing</span>
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Factory Profiles</span>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Minimal Waste</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-[#CBB49A]/50 transition-all">
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-800 flex-shrink-0">
                                                A
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Allbirds</h3>
                                                <p className="text-sm text-[#CBB49A] font-medium mb-3">The Material Innovator</p>
                                                <p className="text-gray-600 leading-relaxed mb-4">
                                                    Allbirds built their entire brand around material innovation—Merino wool, eucalyptus tree fiber, and sugarcane-based foam. They carbon-label every product like nutritional information, making environmental impact tangible and comparable.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Carbon Neutral</span>
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">Novel Materials</span>
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Carbon Labeling</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 p-6 bg-[#F8F7F4] rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-[#2D2A2E] mb-3">The Common Thread</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        Notice that none of these brands compete on price. They compete on <strong>values, quality, and transparency</strong>. They&apos;ve turned their ethical choices into marketing advantages. You can do the same.
                                    </p>
                                </div>
                            </div>

                            {/* Final Thoughts */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Bottom Line</h2>
                                <div className="bg-gradient-to-br from-[#2D2A2E] to-gray-800 text-white p-8 rounded-2xl">
                                    <p className="text-lg leading-relaxed mb-6 text-white">
                                        The fashion industry is at an inflection point. Consumers are waking up to the true cost of cheap clothes—to the environment, to workers, and to their own wardrobes filled with things they never wear.
                                    </p>
                                    <p className="text-lg leading-relaxed mb-6 text-white">
                                        This creates an unprecedented opportunity for brands willing to take the slow fashion path. Yes, it requires more investment upfront. Yes, your price points will be higher. But you&apos;ll build something far more valuable than another disposable fashion brand.
                                    </p>
                                    <p className="text-xl font-bold text-[#CBB49A]">
                                        You&apos;ll build a brand that customers genuinely love, recommend to friends, and return to for years. That&apos;s the real competitive advantage.
                                    </p>
                                </div>
                            </div>

                            {/* CTA / Final Word */}
                            <div className="bg-[#2D2A2E] text-white p-10 lg:p-14 rounded-3xl mt-16 relative overflow-hidden text-center" ref={endOfArticleRef}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBB49A] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                                <div className="relative z-10 max-w-2xl mx-auto">
                                    <span className="text-[#CBB49A] font-bold tracking-widest text-sm uppercase mb-4 block">Partner With Us</span>
                                    <h3 className="text-3xl font-bold mb-6">Need a Manufacturing Partner Who Understanding &quot;Quality&quot;?</h3>
                                    <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                        Krazy Kreators specializes in high-quality, ethical manufacturing for brands that want to stand out. From fabric sourcing to final stitch, we help you build a product you can be proud of.
                                    </p>
                                    <Button
                                        onClick={() => setContactOpen(true)}
                                        className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#CBB49A]/30 font-semibold"
                                    >
                                        Start Your Brand Today
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
                                                ? "bg-white text-[#CBB49A] border-2 border-[#CBB49A]"
                                                : "bg-white text-gray-600 hover:text-[#CBB49A] border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                                            {likeCount} Likes
                                        </button>

                                        <button
                                            onClick={handleShare}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D2A2E] text-white hover:bg-black text-sm font-medium transition-all duration-300"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            Share Guide
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Display */}
                                <div className="space-y-6 mt-10" data-comments-section>
                                    <h3 className="text-2xl font-bold text-[#2D2A2E] mb-6">Join the Discussion</h3>

                                    {/* Input */}
                                    <form onSubmit={handleSubmitComment} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <input
                                                type="text"
                                                name="name"
                                                value={newComment.name}
                                                onChange={handleInputChange}
                                                placeholder="Your Name"
                                                className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all placeholder:text-gray-400"
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                value={newComment.email}
                                                onChange={handleInputChange}
                                                placeholder="Your Email"
                                                className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                        <textarea
                                            name="comment"
                                            value={newComment.comment}
                                            onChange={handleInputChange}
                                            placeholder="What's your biggest challenge in building a slow fashion brand?"
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all mb-4 resize-none placeholder:text-gray-400"
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
                                                className="ml-auto px-8 py-2.5 bg-[#CBB49A] text-white font-medium rounded-full hover:bg-[#b7a078] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
                                            >
                                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                                                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Existing Comments */}
                                    {comments.length > 0 ? (
                                        <>
                                            {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                                                <div key={comment.id} id={`comment-${comment.id}`} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 bg-[#E5E0D5] rounded-full flex items-center justify-center text-[#2D2A2E] font-bold text-lg flex-shrink-0">
                                                            {comment.avatar}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h5 className="font-bold text-[#2D2A2E]">{comment.name}</h5>
                                                                <span className="text-xs text-[#666666]">{comment.date}</span>
                                                            </div>
                                                            <p className="text-[#666666] leading-relaxed text-sm mb-3">
                                                                {comment.comment}
                                                            </p>
                                                            <button
                                                                onClick={() => handleCommentLike(comment.id)}
                                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 w-fit ${likedComments.has(comment.id)
                                                                    ? "bg-[#CBB49A]/10 text-[#CBB49A]"
                                                                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                                    }`}
                                                            >
                                                                <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? 'fill-[#CBB49A]' : ''}`} />
                                                                {comment.likes} Likes
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {comments.length > 3 && (
                                                <div className="text-center pt-4">
                                                    <button
                                                        onClick={() => setShowAllComments(!showAllComments)}
                                                        className="text-[#CBB49A] font-medium hover:underline text-sm"
                                                    >
                                                        {showAllComments ? "Show Less" : `View All ${comments.length} Comments`}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-10 text-gray-400">
                                            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>No comments yet. Be the first to start the discussion!</p>
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
