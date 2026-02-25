"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, BarChart3, Clock, Rocket, CheckCircle2, AlertTriangle, Coins, Sparkles, TrendingUp } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'the-drop-culture-model';

type DropCultureClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function DropCultureClient({ initialLikeCount, initialComments }: DropCultureClientProps) {
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
        } catch {}
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
            <section className="relative h-[65vh] min-h-[550px] overflow-hidden bg-[#111111]">
                <Image
                    src="/blog/drop-culture-model-banner.png"
                    alt="The Drop Culture Model - Hypebeast Clothing Limited Release"
                    fill
                    className="object-cover object-center opacity-70 scale-105 hover:scale-100 transition-transform duration-[10s] ease-out"
                    priority
                    style={{
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center pt-20">
                    <div className="text-center px-4 max-w-4xl relative z-10 w-full">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF3366]/20 text-[#FF3366] text-sm font-bold rounded-full uppercase tracking-wider mb-6 border border-[#FF3366]/50">
                            <Sparkles className="w-4 h-4" />
                            Business Strategy
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl tracking-tight">
                            The &apos;Drop Culture&apos; Model
                        </h1>
                        <p className="text-lg sm:text-2xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg mb-8">
                            Strategies for Sold-Out Collections: Solving high inventory risk with hype and flexibility.
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
                                    <div className="w-10 h-10 bg-[#FF3366] rounded-full flex items-center justify-center text-white font-bold">
                                        KK
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-[#2D2A2E]">Krazy Kreators Team</p>
                                        <p className="text-[#666666]">February 25, 2026</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleLike}
                                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                        ? "bg-[#FF3366] text-white"
                                        : "bg-white text-gray-600 hover:bg-[#FF3366]/10 border border-gray-200"
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
                                    The traditional fashion calendar—designing enormous Spring/Summer or Fall/Winter collections months in advance—is broken. For modern, independent labels, this older system means ordering thousands of units upfront, tying up vital cash, and crossing your fingers that the trend holds out. 
                                </p>
                                <p className="leading-relaxed mb-6">
                                    Instead, brands like <strong>Supreme</strong>, <strong>Corteiz</strong>, and a sprawling ecosystem of successful D2C labels have abandoned the massive seasonal drop for the <em>&quot;Drop Culture&quot;</em> model: limited, frequent releases that operate outside the industry norm.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    Why are they doing this? It isn&apos;t just about building hype. It&apos;s a fundamentally smarter business model designed to solve the fashion brand&apos;s greatest existential threat: <strong>inventory risk</strong>. 
                                </p>
                                <div className="bg-rose-50 border-l-4 border-[#FF3366] p-6 rounded-r-xl my-8">
                                    <h4 className="flex items-center gap-2 font-bold text-rose-900 m-0 mb-2">
                                        <TrendingUp className="w-5 h-5" />
                                        What We&apos;ll Cover
                                    </h4>
                                    <p className="text-rose-800 m-0">
                                        We break down why the Drop Model ensures business stability, creates undeniable brand momentum, and how you can use <strong>Low MOQ manufacturing</strong> to execute it without crippling upfront capital.
                                    </p>
                                </div>
                            </div>

                            {/* Section 1: Hype and Business */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Sparkles className="w-8 h-8 text-[#FF3366]" />
                                    1. The Trend: Why traditional seasons are dead
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Pioneered by streetwear legends and now adopted by luxury houses and agile indies alike, the &quot;Drop&quot; is a focused product release, tightly marketed and available in incredibly limited quantities. Rather than producing 40 different SKUs at once and waiting 6 months to see what sells, drops usually focus on 1-4 key pieces—like a killer graphic tee, a custom heavyweight hoodie, or a statement jacket.
                                </p>
                                
                                <div className="mb-10 rounded-2xl overflow-hidden shadow-lg relative max-w-3xl mx-auto">
                                    <Image
                                        src="/portfolio/mens-streetwear/casual-shirt/11.webp"
                                        alt="Modern streetwear drop concept with limited inventory"
                                        width={1400}
                                        height={600}
                                        className="w-full h-auto object-cover max-h-[400px]"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0 flex gap-2 items-center"><Clock className="w-5 h-5" /> Traditional vs. Drops</h3>
                                        <ul className="space-y-4 mb-0 list-none pl-0 mt-6">
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-red-400 shrink-0"></div>
                                                <span><strong>Traditional:</strong> Orders 10,000 units. Prays the weather hits right. Sweats over storing inventory. Discounts leftovers at 50% off.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0"></div>
                                                <span><strong>Drop Model:</strong> Promotes 100-300 units heavily to an engaged community. Sells out in minutes. Leaves the audience starving for more. Zero leftovers.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-zinc-900 p-8 rounded-2xl border border-gray-800 text-white shadow-sm">
                                        <h3 className="text-xl font-bold text-white mb-3 mt-0">The Scarcity Principle</h3>
                                        <p className="text-zinc-300 mb-4 leading-relaxed">
                                            When an item is always available, the customer will say: <em>&quot;I&apos;ll buy it next paycheck.&quot;</em> But if you announce that there are exactly 150 Hoodies and they will never be restocked? The customer buys it <strong>now</strong>. It shifts the power dynamic entirely back to the brand.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Why it works */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <AlertTriangle className="w-8 h-8 text-[#FF3366]" />
                                    2. Why It Works: Killing the &quot;High Inventory Risk&quot; Monster
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Most clothing brands don&apos;t die because their designs are bad. They die because they run out of cash. This happens when their capital is tied up in boxes of XXL and XS sizes sitting in a warehouse, slowly depreciating.
                                </p>

                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative max-w-3xl mx-auto">
                                    <Image
                                        src="/services/enterprise/enterprise-the-challenges-big-enterprise-face.jpg"
                                        alt="Challenges of high inventory in the fashion industry"
                                        width={1400}
                                        height={600}
                                        className="w-full h-auto object-cover max-h-[400px]"
                                    />
                                </div>

                                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 text-slate-900 border border-emerald-100 p-8 rounded-2xl mb-8">
                                    <h3 className="text-xl font-bold mb-6 mt-0 flex items-center gap-2"><Coins className="w-6 h-6 text-emerald-600" /> Cash Flow Positivity</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-xl border border-emerald-100">
                                            <div className="font-bold text-lg mb-2 text-emerald-800">No &quot;Dead Stock&quot;</div>
                                            <p className="text-sm text-gray-600">Because you under-produce demand deliberately, there is never excess inventory to heavily discount. Your brand stays premium.</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-emerald-100">
                                            <div className="font-bold text-lg mb-2 text-emerald-800">Faster Reinvesting</div>
                                            <p className="text-sm text-gray-600">With a small batch yielding a high sell-through rate, you take your profits the very same week and fund the prototype for the next drop.</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-emerald-100">
                                            <div className="font-bold text-lg mb-2 text-emerald-800">Community Feedback</div>
                                            <p className="text-sm text-gray-600">A 50-piece drop is a paid beta-test. If the baby blue colorway sells out in 3 minutes, you know exactly what your community demands next time.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Low MOQ Secret */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Rocket className="w-8 h-8 text-[#FF3366]" />
                                    3. The Secret Weapon: Low MOQ Flexibility
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Here is the catch: to execute a drop successfully, you cannot order 2,000 units from a traditional mass-production factory in China that takes 4 months to ship. Drops require speed, agility, and incredibly high quality control on smaller batches.
                                </p>
                                <p className="leading-relaxed mb-8">
                                    This is exactly where <strong>Low MOQ (Minimum Order Quantity) manufacturing</strong> becomes your superpower. You need a fast, elite manufacturing partner who treats a 100-piece order with the exact same precision as a 10,000-piece order.
                                </p>

                                <div className="mb-10 rounded-2xl overflow-hidden shadow-lg relative max-w-3xl mx-auto">
                                    <Image
                                        src="/services/enterprise/raw-material-hero.webp"
                                        alt="Krazy Kreators Low MOQ manufacturing process"
                                        width={1400}
                                        height={600}
                                        className="w-full h-auto object-cover max-h-[400px]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-stretch">
                                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3366]/5 rounded-bl-[100px] -z-0"></div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 mt-0 relative z-10">The Old Way</h3>
                                        <ul className="space-y-4 mb-0 text-sm list-none pl-0 relative z-10">
                                            <li className="flex gap-3 text-gray-600">
                                                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> Minimum 500-1000 pieces per color/style.
                                            </li>
                                            <li className="flex gap-3 text-gray-600">
                                                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> Inflexible designs; tech packs locked months in advance.
                                            </li>
                                            <li className="flex gap-3 text-gray-600">
                                                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" /> Heavy upfront financial burden before launching.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#2D2A2E] p-8 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden group">
                                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-[100px] -z-0"></div>
                                        <h3 className="text-xl font-bold text-white mb-4 mt-0 relative z-10">The Drop Culture Way</h3>
                                        <ul className="space-y-4 mb-0 text-sm list-none pl-0 relative z-10">
                                            <li className="flex gap-3 text-gray-300">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" /> <span className="!text-gray-300">Launch smaller batches (50-200 pieces) consistently.</span>
                                            </li>
                                            <li className="flex gap-3 text-gray-300">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" /> <span className="!text-gray-300">Iterate quickly. New designs monthly based on trends.</span>
                                            </li>
                                            <li className="flex gap-3 text-gray-300">
                                                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" /> <span className="!text-gray-300">Zero dead end inventory. Keep capital liquid.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Checklist */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <BarChart3 className="w-8 h-8 text-[#FF3366]" />
                                    4. Your Checklist for a &quot;Sold Out&quot; Drop
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border-l-4 border-l-[#CBB49A] flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-xl text-[#2D2A2E] shadow-sm shrink-0">1</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#2D2A2E] m-0 mb-2">Build The Email/SMS List</h4>
                                            <p className="text-sm text-gray-600 m-0">Lock your drops behind a password-protected site for the first 2 hours. Give password access entirely to your email VIPs. This guarantees hardcore fans buy first.</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border-l-4 border-l-[#CBB49A] flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-xl text-[#2D2A2E] shadow-sm shrink-0">2</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#2D2A2E] m-0 mb-2">Create The Content Runway</h4>
                                            <p className="text-sm text-gray-600 m-0">Document the process. Post manufacturing snippets, samples, fabric tests, and behind-the-scenes on TikTok and Reels. Make the community feel involved in the product.</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border-l-4 border-l-[#CBB49A] flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-xl text-[#2D2A2E] shadow-sm shrink-0">3</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#2D2A2E] m-0 mb-2">Never Restock The Same Exact Item</h4>
                                            <p className="text-sm text-gray-600 m-0">If a piece sells out, keep your promise. Do not restock it. By never restocking, consumers learn your word is law, and they will run to checkout instantly on the next drop.</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border-l-4 border-l-[#CBB49A] flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-xl text-[#2D2A2E] shadow-sm shrink-0">4</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#2D2A2E] m-0 mb-2">Partner With The Right Manufacturer</h4>
                                            <p className="text-sm text-gray-600 m-0">Work with Krazy Kreators. We offer Low MOQs so you can place an order for 50 pieces without compromising on premium heavyweight fabrics or custom cut-and-sew dimensions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conclusion */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Takeaway: Small Drops, Big Impact</h2>
                                <div className="bg-[#111111] text-white p-8 rounded-2xl">
                                    <p className="text-lg leading-relaxed mb-6 text-white">
                                        The Drop Culture model is not a hyped-up gimmick. It&apos;s an intelligent risk management strategy dressed in cool packaging. By moving to frequent, limited releases, you remove the heavy inventory burden, tighten your cash cycle, and turn every launch into a cultural event for your audience.
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-[#FF3366] text-white p-10 lg:p-14 rounded-3xl mt-16 relative overflow-hidden text-center" ref={endOfArticleRef}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                                <div className="relative z-10 max-w-2xl mx-auto">
                                    <span className="text-white/80 font-bold tracking-widest text-sm uppercase mb-4 block">End-to-End Manufacturing</span>
                                    <h3 className="text-3xl font-bold mb-6">Ready to Execute Your First Drop?</h3>
                                    <p className="text-white/90 leading-relaxed mb-8 text-lg">
                                        Krazy Kreators offers the Low MOQ flexibility, speed, and premium quality necessary to make a drop model work. Let&apos;s build your custom apparel, 50 pieces at a time.
                                    </p>
                                    <Button
                                        onClick={() => setContactOpen(true)}
                                        className="bg-black text-white hover:bg-[#2D2A2E] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl font-semibold"
                                    >
                                        Talk to Our Production Team
                                    </Button>
                                </div>
                            </div>
                        </div>

                         {/* Post-Content Social Interaction */}
                         <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did you find this article insightful?</h4>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleLike}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                                ? "bg-white text-[#FF3366] border-2 border-[#FF3366]"
                                                : "bg-white text-gray-600 hover:text-[#FF3366] border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#FF3366]' : ''}`} />
                                            {isLiked ? 'Liked' : 'Like'} ({likeCount})
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:text-[#FF3366] border border-gray-200 text-sm font-medium transition-all duration-300"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            Share Article
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-16" id="comments-section" data-comments-section>
                            <h3 className="text-2xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-2">
                                <MessageCircle className="w-6 h-6 text-[#FF3366]" />
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
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3366] focus:ring-2 focus:ring-[#FF3366]/20 outline-none transition-all bg-gray-50 focus:bg-white"
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
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3366] focus:ring-2 focus:ring-[#FF3366]/20 outline-none transition-all bg-gray-50 focus:bg-white"
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
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF3366] focus:ring-2 focus:ring-[#FF3366]/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                            placeholder="Share your thoughts..."
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500">Your email address will not be published.</p>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-[#111111] text-white hover:bg-black px-8 py-3 rounded-xl transition-all disabled:opacity-50"
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
                                        <div key={comment.id} id={`comment-${comment.id}`} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#FF3366]/30 transition-all shadow-sm">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#FF3366] to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
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
                                                        <button className="text-xs font-medium text-gray-400 hover:text-[#FF3366] transition-colors">
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
