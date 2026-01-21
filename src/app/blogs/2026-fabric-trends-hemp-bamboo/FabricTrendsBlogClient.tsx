"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, User, Share2, Heart, MessageCircle, Leaf, Droplets, Sun } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = '2026-fabric-trends-hemp-bamboo';

type FabricTrendsBlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function FabricTrendsBlogClient({ initialLikeCount, initialComments }: FabricTrendsBlogClientProps) {
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
                    src="/blog/fabric-trends-2026-banner.png"
                    alt="2026 Fabric Trends: Hemp and Bamboo"
                    fill
                    className="object-cover"
                    style={{
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                    }}
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 max-w-4xl">
                        <span className="inline-block px-4 py-1.5 bg-[#CBB49A] text-white text-sm font-semibold rounded-full uppercase tracking-wider mb-6">
                            Sustainability Report
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                            Why Hemp and Bamboo Are Taking Over
                        </h1>
                        <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium">
                            2026 Fabric Trends: Moving beyond polyester to the future of eco-luxury.
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
                                        <p className="text-[#666666]">January 21, 2026</p>
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

                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Sustainability is No Longer Boring</h2>
                                <p className="text-lg leading-relaxed mb-6">
                                    Remember when &quot;eco-friendly&quot; clothing meant scratchy, beige sacks that cost a fortune? Thankfully, those days are over. In 2026, sustainable fabrics are actually <em>better</em> than the synthetics they replace—softer, stronger, and far more stylish.
                                </p>
                                <p className="text-lg leading-relaxed mb-8">
                                    We aren&apos;t just seeing a trend; we are seeing a takeover. People are realizing that polyester is basically just plastic woven into thread (which makes you sweat!), and they are looking for natural alternatives that let their skin breathe.
                                </p>
                                <div className="bg-[#F9F9F9] p-8 rounded-2xl border-l-4 border-[#CBB49A] mb-8">
                                    <p className="text-xl italic font-medium text-[#2D2A2E]">
                                        &quot;This isn&apos;t just about saving the planet. It&apos;s about wearing something that feels incredible on your skin. That is the real secret to why these fabrics are exploding in popularity.&quot;
                                    </p>
                                </div>
                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4">The &quot;Real Deal&quot; Detector</h3>
                                <p className="leading-relaxed mb-4">
                                    Shoppers today are smart. They flip the tag to check what a shirt is made of before they even look at the price. They can spot &quot;Greenwashing&quot; (when brands pretend to be eco-friendly but aren&apos;t) from a mile away.
                                </p>
                                <p className="leading-relaxed">
                                    Using real, certified organic materials like hemp and bamboo tells your customer: &quot;We care about quality, and we respect your intelligence.&quot;
                                </p>
                            </div>

                            {/* Hemp Section */}
                            <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-100 rounded-lg text-green-700">
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#2D2A2E] m-0">Hemp: The Industrial Powerhouse</h2>
                                    </div>
                                    <p className="leading-relaxed mb-4">
                                        Think of Hemp as <strong>&quot;Linen&apos;s Tougher Cousin.&quot;</strong> In the past, it was used for ropes and sails because it was so strong. Today, thanks to new softening methods, we get that same unbreakable strength but with a touch that feels like your favorite vintage t-shirt.
                                    </p>
                                    <ul className="space-y-3 mt-6">
                                        <li className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#CBB49A] mt-2.5"></div>
                                            <span><strong>Antibacterial:</strong> Naturally resistant to odors, making it perfect for activewear and summer collections.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#CBB49A] mt-2.5"></div>
                                            <span><strong>Gets Better with Age:</strong> Unlike cotton which wears out, hemp wears <em>in</em>, becoming softer with every wash.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#CBB49A] mt-2.5"></div>
                                            <span><strong>Zero Pesticides:</strong> It grows like a weed (literally), requiring no nasty chemicals to thrive.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#CBB49A] mt-2.5"></div>
                                            <span><strong>UV Resistant:</strong> Offers natural protection against the sun, a key selling point for outdoor brands.</span>
                                        </li>
                                    </ul>
                                    <div className="mt-6 flex flex-col gap-4">
                                        <p className="text-sm text-[#666666] bg-green-50 p-4 rounded-lg border border-green-100">
                                            <strong>Design Note:</strong> Since hemp fibers are thicker, they hold structure beautifully. Use it for boxy jackets, wide-leg trousers, or structured button-downs that need to keep their shape.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                                    <Image
                                        src="/blog/hemp-texture-visualization.png"
                                        alt="High resolution hemp fabric texture"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Bamboo Section */}
                            <div className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1 relative h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                                    <Image
                                        src="/blog/bamboo-texture-visualization.png"
                                        alt="High resolution bamboo fabric texture"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                                            <Droplets className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-[#2D2A2E] m-0">Bamboo: The Silk Alternative</h2>
                                    </div>
                                    <p className="leading-relaxed mb-4">
                                        If Hemp is the workhorse, Bamboo is the luxury car. It is often called <strong>&quot;Vegan Silk&quot;</strong> because it creates a fabric that is incredibly smooth, liquid-like, and cool to the touch.
                                    </p>
                                    <p className="leading-relaxed mb-4">
                                        It is literally <strong>Nature&apos;s Air Conditioner</strong>. The fiber structure has tiny gaps that allow air to flow freely, meaning it keeps you 2-3 degrees cooler in the summer than cotton does.
                                    </p>
                                    <div className="bg-blue-50 p-6 rounded-xl mt-6 border border-blue-100">
                                        <h4 className="font-bold text-blue-900 mb-2">Why Designers Love It:</h4>
                                        <p className="text-blue-800 text-sm mb-2">
                                            It holds dye exceptionally well, resulting in vibrant, lasting colors that don&apos;t fade like conventional cotton.
                                        </p>
                                        <p className="text-blue-800 text-sm">
                                            <strong>Recommendation:</strong> Use bamboo for anything that needs to move. Think flowy midi dresses, oversized resort shirts, or activewear leggings where &quot;second-skin&quot; feel is the goal.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* New Section: What to Make */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Cheat Sheet: What to Make with What?</h2>
                                <p className="leading-relaxed mb-8">
                                    Not sure which fabric fits your brand? Here is a simple breakdown of the best uses for each:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-[#f0fdf4] p-8 rounded-2xl border border-green-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <Leaf className="w-5 h-5 text-green-600" />
                                            Best Uses for Hemp
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-2 text-[#666666]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                                Heavyweight Tees & Streetwear
                                            </li>
                                            <li className="flex items-center gap-2 text-[#666666]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                                Jackets & Outerwear (It&apos;s wind resistant!)
                                            </li>
                                            <li className="flex items-center gap-2 text-[#666666]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                                                Durable Pants & Shorts
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#eff6ff] p-8 rounded-2xl border border-blue-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <Droplets className="w-5 h-5 text-blue-600" />
                                            Best Uses for Bamboo
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-2 text-[#666666]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                Intimates & Underwear (Super soft)
                                            </li>
                                            <li className="flex items-center gap-2 text-[#666666]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                Activewear & Yoga Gear
                                            </li>
                                            <li className="flex items-center gap-2 text-[#666666]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                Summer Dresses & Lounge Sets
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* The "Why Now" Section */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Numbers Don&apos;t Lie</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    <div className="p-6 bg-[#F8F7F4] rounded-2xl text-center hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-[#2D2A2E] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                                            <Sun className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-4xl font-bold text-[#CBB49A] mb-2">50%</h3>
                                        <p className="text-sm font-semibold text-[#2D2A2E] uppercase tracking-wide">Less Water</p>
                                        <p className="text-xs text-[#666666] mt-2">Bamboo requires significantly less water than cotton farming.</p>
                                    </div>
                                    <div className="p-6 bg-[#F8F7F4] rounded-2xl text-center hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-[#2D2A2E] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-4xl font-bold text-[#CBB49A] mb-2">10x</h3>
                                        <p className="text-sm font-semibold text-[#2D2A2E] uppercase tracking-wide">CO2 Absorption</p>
                                        <p className="text-xs text-[#666666] mt-2">Hemp absorbs more carbon CO2 per hectare than almost any other commercial crop.</p>
                                    </div>
                                    <div className="p-6 bg-[#F8F7F4] rounded-2xl text-center hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-[#2D2A2E] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-4xl font-bold text-[#CBB49A] mb-2">73%</h3>
                                        <p className="text-sm font-semibold text-[#2D2A2E] uppercase tracking-wide">Consumer Preference</p>
                                        <p className="text-xs text-[#666666] mt-2">Millennials & Gen Z are willing to pay more for sustainable products.</p>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Strategic Sourcing: How to Do It Right</h2>
                                <p className="leading-relaxed mb-6">
                                    The challenge with these premium materials isn&apos;t demand; it&apos;s supply chain transparency. How do you know your &quot;organic bamboo&quot; isn&apos;t just rayon in disguise?
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">1. Check the ID Card (Certifications)</h4>
                                        <p className="text-sm text-[#666666]">
                                            Don&apos;t just take their word for it. Ask for <strong>GOTS</strong> (for organic cotton/hemp) or <strong>FSC</strong> (for bamboo). Think of these like a passport—if the fabric doesn&apos;t have it, it&apos;s not getting into your collection.
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">2. Trace the Roots</h4>
                                        <p className="text-sm text-[#666666]">
                                            A good supplier can tell you exactly where the plant was grown, not just where the fabric was knitted. If they can&apos;t tell you the farm, they are hiding something. Total transparency is the new standard.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Future Outlook: Beyond 2026</h2>
                            <p className="leading-relaxed mb-6">
                                The innovation doesn&apos;t stop here. We are already seeing the emergence of &quot;Hybrid Fabrics&quot;—blends that combine the durability of hemp with the softness of bamboo in a single weave.
                            </p>
                            <div className="bg-[#2D2A2E] text-white p-8 rounded-2xl">
                                <h4 className="text-xl font-bold text-[#CBB49A] mb-4">The Investment Case</h4>
                                <p className="leading-relaxed text-gray-300">
                                    Switching to sustainable fabrics is an upfront investment, often costing 15-20% more per yard than premium synthetics. However, brands making this switch report a <strong>higher Customer Lifetime Value (LTV)</strong> and lower return rates, as the product quality is tangibly superior.
                                </p>
                            </div>
                        </div>

                        {/* New Section: Selling the Story */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Selling the Story (Marketing 101)</h2>
                            <p className="leading-relaxed mb-6">
                                You aren&apos;t just selling cloth; you are selling a philosophy. Here is how to educate your customers (and justify a higher price point) using your hangtags and product descriptions:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#F8F7F4] p-6 rounded-xl">
                                    <h4 className="font-bold text-[#2D2A2E] mb-3">Copy-Paste for Hangtags:</h4>
                                    <p className="text-sm italic text-[#666666] mb-3">
                                        &quot;This garment is made from 100% Organic Hemp. It uses 50% less water than cotton and gets softer with every wash. Wear it, love it, pass it down.&quot;
                                    </p>
                                    <p className="text-xs text-[#999999] uppercase font-bold tracking-wide">Perfect for Brand Storytelling</p>
                                </div>
                                <div className="bg-[#F8F7F4] p-6 rounded-xl">
                                    <h4 className="font-bold text-[#2D2A2E] mb-3">Care Instructions (Educate Them):</h4>
                                    <ul className="text-sm text-[#666666] space-y-2">
                                        <li>• <strong>Wash Cold:</strong> Saves energy and protects the fiber.</li>
                                        <li>• <strong>Hang Dry:</strong> High heat is the enemy of natural fibers.</li>
                                        <li>• <strong>Don&apos;t Overwash:</strong> Hemp resists odors, so wash it less!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Conclusion & CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-14 rounded-3xl mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBB49A] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Looking for the Next Big Fabric?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Whether you want the rugged durability of hemp or the silky luxury of bamboo, Krazy Kreators has the sourcing network to get you authentic, high-quality sustainable fabrics. Don&apos;t just follow the trend—lead it.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#CBB49A]/30 font-semibold"
                                >
                                    Source Sustainable Fabrics
                                </Button>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did you find this article helpful?</h4>
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
                                            placeholder="What are your thoughts on sustainable fabrics?"
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
