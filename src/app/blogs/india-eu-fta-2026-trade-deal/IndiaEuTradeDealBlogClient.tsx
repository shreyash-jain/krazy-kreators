"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2, Heart, MessageCircle, Globe, TrendingUp, ShieldCheck, Truck, Zap, GraduationCap, Lock, Server, Leaf, Factory, Scale, Sprout, Rocket } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'india-eu-fta-2026-trade-deal';

type IndiaEuTradeDealBlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function IndiaEuTradeDealBlogClient({ initialLikeCount, initialComments }: IndiaEuTradeDealBlogClientProps) {
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
            alert('Please fill in all fields');
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar invertTabs={!scrolled} />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
                <Image
                    src="/blog/india-eu-fta-2026-banner.png"
                    alt="India-EU Trade Deal 2026"
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
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 max-w-5xl">
                        <span className="inline-block px-4 py-1.5 bg-[#CBB49A] text-white text-sm font-semibold rounded-full uppercase tracking-wider mb-6">
                            Global Trade Analysis
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                            The Big Shift: India-EU Trade Deal 2026
                        </h1>
                        <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
                            Unpacking the &quot;Mother of All Deals&quot; and what it means for your business, global trade, and the future of fashion.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">

                        {/* Social Interaction Section */}
                        <div className="mb-12 p-4 bg-[#F8F7F4] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-bold">
                                        KK
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-[#2D2A2E]">Krazy Kreators Team</p>
                                        <p className="text-[#666666]">January 27, 2026</p>
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

                            {/* Introduction */}
                            <div className="mb-16">
                                <p className="text-xl font-medium text-[#2D2A2E] mb-6">
                                    On January 27, 2026, India and the European Union finally made it official. After nearly 20 years of on-and-off talks, the Free Trade Agreement (FTA) is here.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    Leaders have called this the <strong>&quot;mother of all deals&quot;</strong>, and for good reason. It brings together two massive markets—<strong>1.9 billion people</strong> in total. That&apos;s a quarter of the world&apos;s economy joining hands.
                                </p>
                                <p className="leading-relaxed mb-8">
                                    But what does this actually mean for you? Whether you&apos;re in manufacturing, services, or just curious about global business, here is the simple breakdown of how this changes the game for companies like <strong>Krazy Kreators</strong>.
                                </p>

                                {/* Why This Matters */}
                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4">Why This Deal Matters Now</h3>
                                <div className="bg-[#F9F9F9] p-8 rounded-2xl border-l-4 border-[#CBB49A] mb-8">
                                    <p className="text-lg italic text-[#2D2A2E]">
                                        &quot;For Europe, it&apos;s about not relying on just one country (like China) for everything. For India, it&apos;s about going global in a big way.&quot;
                                    </p>
                                </div>
                                <p className="leading-relaxed">
                                    This isn&apos;t just a simple trade agreement anymore. It&apos;s a full-blown strategic partnership. It means India and Europe are now &quot;best friends&quot; in the business world, looking out for each other&apos;s interests.
                                </p>
                            </div>

                            {/* Implementation Timeline */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Timeline: From Signature to Shipment</h2>
                                <div className="relative border-l-4 border-[#CBB49A]/30 ml-4 space-y-10">
                                    <div className="relative pl-8">
                                        <div className="absolute -left-2.5 top-0 w-5 h-5 bg-[#CBB49A] rounded-full border-4 border-white shadow-sm"></div>
                                        <h4 className="font-bold text-[#2D2A2E] text-lg">January 27, 2026</h4>
                                        <p className="text-sm text-gray-600">Official Signing of the Deal.</p>
                                    </div>
                                    <div className="relative pl-8">
                                        <div className="absolute -left-2.5 top-0 w-5 h-5 bg-gray-300 rounded-full border-4 border-white shadow-sm"></div>
                                        <h4 className="font-bold text-[#2D2A2E] text-lg">Mid-2026</h4>
                                        <p className="text-sm text-gray-600">Final Legal Review & Approvals in Europe.</p>
                                    </div>
                                    <div className="relative pl-8">
                                        <div className="absolute -left-2.5 top-0 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>
                                        <h4 className="font-bold text-blue-800 text-lg">July 1, 2026 (Projected)</h4>
                                        <p className="text-sm text-gray-600"><strong>Deal Goes Live (Phase 1):</strong> Taxes drop for 90% of goods (including clothes/textiles) immediately.</p>
                                    </div>
                                    <div className="relative pl-8">
                                        <div className="absolute -left-2.5 top-0 w-5 h-5 bg-green-600 rounded-full border-4 border-white shadow-sm"></div>
                                        <h4 className="font-bold text-green-800 text-lg">Early 2027</h4>
                                        <p className="text-sm text-gray-600">Full Rollout & Investment Rules kick in.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Macro-Economic Foundations */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">By The Numbers: The Partnership Baseline</h2>
                                <p className="leading-relaxed mb-6">
                                    Before the ink was even dry, the EU had already established itself as India’s largest trading partner in goods. Here is the baseline for FY 2024-25:
                                </p>

                                <div className="overflow-x-auto mb-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#F8F7F4] text-[#2D2A2E]">
                                            <tr>
                                                <th className="p-4 font-bold border-b border-gray-100">Trade Indicator (FY 2024-25)</th>
                                                <th className="p-4 font-bold border-b border-gray-100">Value (USD Billions)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-50">
                                                <td className="p-4">Total Bilateral Goods Trade</td>
                                                <td className="p-4 font-semibold">$136.53</td>
                                            </tr>
                                            <tr className="border-b border-gray-50">
                                                <td className="p-4">Indian Exports to EU</td>
                                                <td className="p-4 font-semibold">$75.85</td>
                                            </tr>
                                            <tr className="border-b border-gray-50">
                                                <td className="p-4">Indian Imports from EU</td>
                                                <td className="p-4 font-semibold">$60.68</td>
                                            </tr>
                                            <tr className="border-b border-gray-50">
                                                <td className="p-4">India&apos;s Trade Surplus</td>
                                                <td className="p-4 text-green-600 font-bold">+$15.17</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4">Total Services Trade (CY 2024)</td>
                                                <td className="p-4 font-semibold">$83.10</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="leading-relaxed text-sm text-[#666666]">
                                    <em>Estimates suggest bilateral goods trade could double within 5-7 years of full implementation.</em>
                                </p>
                            </div>

                            {/* Sectoral Transformation / Krazy Kreators */}
                            <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-[#CBB49A]/20 rounded-lg text-[#CBB49A]">
                                            <Factory className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#2D2A2E] m-0">A Game-Changer for Fashion</h2>
                                    </div>
                                    <p className="leading-relaxed mb-4">
                                        For manufacturers like <strong>Krazy Kreators</strong>, this is huge. Historically, selling Indian clothes to Europe meant paying an extra 10-12% tax (duty). This made it hard to compete with countries like Bangladesh, which didn&apos;t have to pay these taxes.
                                    </p>
                                    <p className="leading-relaxed mb-4">
                                        This new deal levels the playing field. It provides <strong>zero-duty access</strong> for Indian apparel across all 27 EU member states immediately. In simple terms: we can now offer better prices without compromising quality.
                                    </p>
                                    <h4 className="font-bold text-[#2D2A2E] mt-6 mb-2">Key Wins for Our Clients:</h4>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                                            <span><strong>Knitted Garments:</strong> Immediate 0% tax, meaning better margins for t-shirts and activewear.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                                            <span><strong>Women&apos;s Wear:</strong> We can now aggressively compete in the high-fashion women&apos;s segment.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                                            <span><strong>Accessories:</strong> Scarves and shawls also become cheaper to export.</span>
                                        </li>
                                    </ul>
                                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Geographical Indications (GI):</strong> The deal also safeguards traditional Indian designs (like Pashmina) in European capitals, protecting premium status in markets like Paris and Milan.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg group">
                                    <Image
                                        src="/blog/india-eu-textile-hub.png"
                                        alt="Modern textile manufacturing in India"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
                                        <div>
                                            <p className="text-white font-bold text-lg mb-2">Regional Impact: Tiruppur & Noida</p>
                                            <p className="text-gray-200 text-sm leading-relaxed mb-2">
                                                The <strong>Tiruppur cluster</strong> alone accounts for $1.74 billion in exports (23% of India&apos;s total). The FTA removes the tariff disadvantage it faced against Bangladesh.
                                            </p>
                                            <p className="text-gray-200 text-sm leading-relaxed">
                                                For <strong>Noida-based firms</strong> like Krazy Kreators, the deal provides a predictable investment framework to scale sustainable manufacturing.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Automotive & Luxury */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Automotive & Luxury Pivot</h2>
                                <p className="leading-relaxed mb-8">
                                    One of the most complex chapters involves the automotive and luxury sectors. The agreement balances EU market access with India&apos;s &quot;Make in India&quot; objectives.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-[#F8F7F4] p-6 rounded-xl">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Electric Vehicles</h4>
                                        <p className="text-3xl font-bold text-blue-600 mb-2">15%</p>
                                        <p className="text-xs text-[#666666] uppercase tracking-wide">Revised Duty (down from 100%)</p>
                                        <p className="text-sm text-[#666666] mt-3">Game-changer for luxury EVs like Mercedes-Benz & BMW, subject to 50% localization by year 5.</p>
                                    </div>

                                    <div className="bg-[#F8F7F4] p-6 rounded-xl">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Scotch & Wines</h4>
                                        <p className="text-3xl font-bold text-purple-600 mb-2">Gradual Cut</p>
                                        <p className="text-xs text-[#666666] uppercase tracking-wide">Quota-Based Reduction</p>
                                        <p className="text-sm text-[#666666] mt-3">High-quality European alcoholic beverages will become more accessible to Indian consumers.</p>
                                    </div>

                                    <div className="bg-[#F8F7F4] p-6 rounded-xl">
                                        <div className="w-12 h-12 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center mb-4">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Rough Diamonds</h4>
                                        <p className="text-3xl font-bold text-gray-800 mb-2">~0%</p>
                                        <p className="text-xs text-[#666666] uppercase tracking-wide">Target Tariff</p>
                                        <p className="text-sm text-[#666666] mt-3">Boosting the diamond polishing industry in Surat and trade with Belgium.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Investment Protection Agreement (IPA) */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6 flex items-center gap-3">
                                    <Scale className="w-8 h-8 text-emerald-700" />
                                    Safe & Secure Investments
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    The deal replaces old, confusing rules with a new <strong>Investment Protection Agreement</strong>. This sets up a fair and transparent system for resolving disputes, which makes European investors feel much safer putting their money into India.
                                </p>
                                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 mb-6">
                                    <p className="text-emerald-900 font-medium">
                                        Impact: Experts predict a <strong>30% jump in Foreign Investment</strong> in the first 2 years. This means more factories, better technology, and more jobs in manufacturing hubs.
                                    </p>
                                </div>
                            </div>

                            {/* Agriculture & GIs */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6 flex items-center gap-3">
                                    <Sprout className="w-8 h-8 text-green-600" />
                                    Agriculture & Geographical Indications (GIs)
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    It’s not just about textiles. The deal recognizes <strong>173 Indian GIs</strong> in Europe, preventing imitation of premium heritage products.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#F8F7F4] p-5 rounded-lg">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Protected Indian Assets</h4>
                                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                            <li>Darjeeling Tea</li>
                                            <li>Alphonso Mangoes</li>
                                            <li>Basmati Rice</li>
                                            <li>Pashmina Wool</li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-5 rounded-lg">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">European GIs in India</h4>
                                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                            <li>Parmigiano Reggiano</li>
                                            <li>Feta Cheese</li>
                                            <li>Champagne</li>
                                            <li>Irish Whiskey</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Passport */}
                            <div className="mb-16 bg-[#F0F7FF] p-8 md:p-12 rounded-3xl border border-blue-100">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6 flex items-center gap-3">
                                    <GraduationCap className="w-8 h-8 text-blue-600" />
                                    The &quot;Skills Passport&quot; & Mobility
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    Moving beyond goods, the agreement delivers a historic breakthrough in professional mobility. The <strong>&quot;Mobility and Migration Partnership&quot;</strong> addresses labor shortages in Europe while offering opportunities for India&apos;s workforce:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <h5 className="font-bold text-blue-900">100,000 Annual Work Permits</h5>
                                        <p className="text-sm text-blue-800/70">EU commitment for multi-year permits for Indian pros.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <h5 className="font-bold text-blue-900">Post-Study Visas</h5>
                                        <p className="text-sm text-blue-800/70">Automatic 12-month job-search visas for Indian students.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <h5 className="font-bold text-blue-900">Portable Qualifications</h5>
                                        <p className="text-sm text-blue-800/70">Recognition of Indian degrees in engineering, nursing, etc.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <h5 className="font-bold text-blue-900">Visa-Free Short Stays</h5>
                                        <p className="text-sm text-blue-800/70">90-day stays for senior managers and independent professionals.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Digital Trade & Data Sovereignty */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6 flex items-center gap-3">
                                    <Server className="w-8 h-8 text-indigo-600" />
                                    Digital Trade & Data Sovereignty
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    The digital chapter navigates the complex terrain between Europe&apos;s GDPR and India’s Digital Personal Data Protection (DPDP) Act 2023. While Europe emphasizes individual privacy rights, India prioritizes data sovereignty.
                                </p>
                                <div className="bg-[#F8F7F4] p-6 rounded-xl mb-6">
                                    <h4 className="font-bold text-[#2D2A2E] mb-3">The Solution: &quot;European Legal Gateway Office&quot;</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Rather than forcing full &quot;data adequacy&quot; immediately, the agreement establishes a Gateway Office to streamline digital cooperation, reducing compliance burdens for Indian tech firms processing European data.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <Rocket className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-indigo-900 text-sm">Startup Bridge 2.0</h4>
                                        <p className="text-indigo-800 text-xs mt-1">
                                            A new &apos;Startup Bridge&apos; is now open, giving Indian tech startups a fast-track way to enter European markets without getting stuck in red tape.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Security & Defence */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6 flex items-center gap-3">
                                    <Lock className="w-8 h-8 text-red-700" />
                                    Security & Defence Partnership
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    The relationship has also expanded into security. A new defense pact allows Indian companies to access a massive €150-billion European fund.
                                </p>
                                <ul className="space-y-3 pl-4 border-l-2 border-red-200">
                                    <li className="text-gray-700"><strong>Working Together:</strong> Indian defense companies can now join European research projects.</li>
                                    <li className="text-gray-700"><strong>Supplies:</strong> Indian firms will likely export more ammunition and supplies to help stock up European reserves.</li>
                                    <li className="text-gray-700"><strong>Intel Sharing:</strong> Talks have started on a new agreement to share classified information more easily.</li>
                                </ul>
                            </div>

                            {/* Logistics & Supply Chain */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6 flex items-center gap-3">
                                    <Globe className="w-8 h-8 text-blue-500" />
                                    Faster Shipping: The Logistics Advantage
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    Beyond saving money on taxes, this deal saves time. New &quot;Green Lane&quot; customs rules for trusted companies mean goods will move much faster.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#F8F7F4] p-6 rounded-xl">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Old Way (Pre-2026)</h4>
                                        <p className="text-sm text-[#666666]">
                                            Port delays: <strong>4-5 days</strong>.
                                            <br />
                                            Customs clearance: <strong>2-3 days</strong>.
                                            <br />
                                            Result: Missed trends and slower re-stocking.
                                        </p>
                                    </div>
                                    <div className="bg-[#eff6ff] p-6 rounded-xl border border-blue-100">
                                        <h4 className="font-bold text-blue-900 mb-2">New Way (With FTA)</h4>
                                        <p className="text-sm text-blue-800">
                                            Port delays: <strong>1-1.5 days</strong>.
                                            <br />
                                            Customs clearance: <strong>Instant (Digital Pre-Arrival)</strong>.
                                            <br />
                                            Result: <strong>2 weeks faster</strong> delivery from factory to store.
                                        </p>
                                    </div>
                                </div>
                                <p className="leading-relaxed mt-6">
                                    For fashion brands, saving 14 days is huge. It means we can react to new trends faster than ever before.
                                </p>
                            </div>

                            {/* The Green Wall (CBAM) */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6 flex items-center gap-3">
                                    <Leaf className="w-8 h-8 text-green-600" />
                                    Going Green: The New Rules (CBAM)
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    There is one challenge: the <strong>Carbon Border Adjustment Mechanism (CBAM)</strong>. Think of it as a &quot;Green Tax&quot; on goods that aren&apos;t eco-friendly. It&apos;s fully active now in 2026.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    <strong>The Good News:</strong> The deal creates a path for India&apos;s own carbon credit system to be recognized. This means if Indian companies pay for carbon offsets at home, they won&apos;t get taxed again in Europe.
                                </p>
                                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                    <p className="text-green-800 text-sm font-medium">
                                        Small businesses in textiles and chemicals have also been given a &quot;Grace Period&quot; and access to new technology to help them ease into these new green standards.
                                    </p>
                                </div>
                            </div>

                            {/* Conclusion / Recs */}
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">What You Should Do Next</h2>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#CBB49A] mt-2.5"></div>
                                        <p><strong>Check Your Products:</strong> Look at your product categories. Many items that used to be expensive to export are now duty-free. Adjust your pricing!</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#CBB49A] mt-2.5"></div>
                                        <p><strong>Go Green:</strong> European buyers now demand sustainable supply chains. Use the new support systems to upgrade your sustainability standards.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#CBB49A] mt-2.5"></div>
                                        <p><strong>Expand Your Team:</strong> Use the &quot;Skills Passport&quot; to send your best designers or marketers to Europe to build closer relationships with clients.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#CBB49A] mt-2.5"></div>
                                        <p><strong>Set Up Shop:</strong> With the new safety rules for investments, it&apos;s safer than ever to set up offices or subsidiaries in both regions.</p>
                                    </li>
                                </ul>
                            </div>

                        </div>

                        {/* CTA / Final Word */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-14 rounded-3xl mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBB49A] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Ready to Scale Your Exports?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    The 2026 India-EU FTA is an open door for Indian manufacturing. Krazy Kreators is ready to help you navigate this new landscape with premium, sustainable manufacturing solutions.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#CBB49A]/30 font-semibold"
                                >
                                    Partner With Us
                                </Button>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did you find this analysis helpful?</h4>
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
                                            Share Article
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Display */}
                                <div className="space-y-6 mt-10" data-comments-section>
                                    <h3 className="text-2xl font-bold text-[#2D2A2E] mb-6">Join the Conversation</h3>

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
                                            placeholder="What are your thoughts on the FTA?"
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
            </section >

            <Footer />
            <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
            <ToastContainer />
        </div >
    );
}
