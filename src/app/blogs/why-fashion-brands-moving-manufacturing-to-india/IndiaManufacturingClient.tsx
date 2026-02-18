
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Globe, Factory, Palette, Shield, TrendingUp, CheckCircle2, AlertTriangle, BarChart3, Landmark, Scissors, Leaf } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'why-fashion-brands-moving-manufacturing-to-india';

type IndiaManufacturingClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function IndiaManufacturingClient({ initialLikeCount, initialComments }: IndiaManufacturingClientProps) {
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
                    src="/blog/india-manufacturing-banner.jpg"
                    alt="Indian textile manufacturing - Fashion brands moving to India"
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
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#CBB49A] text-white text-sm font-semibold rounded-full uppercase tracking-wider mb-6 animate-fade-in-up">
                            <Globe className="w-4 h-4" />
                            Supply Chain Strategy
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Why Fashion Brands Are Moving Manufacturing to India
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            Beyond just cost: The geopolitical, quality, and craftsmanship advantages driving the global shift.
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
                                    <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-bold">
                                        KK
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-[#2D2A2E]">Krazy Kreators Team</p>
                                        <p className="text-[#666666]">February 18, 2026</p>
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
                        <div className="prose prose-xl max-w-none text-[#666666]">
                            {/* Introduction */}
                            <div className="mb-16">
                                <p className="text-2xl font-medium text-[#2D2A2E] leading-relaxed mb-8">
                                    The global fashion supply chain is undergoing its biggest transformation in two decades. Brands that once relied exclusively on China or Southeast Asia for manufacturing are now actively &quot;de-risking&quot; their supply chains&mdash;and India is emerging as the leading alternative.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    But the narrative that &quot;India is cheaper&quot; misses the entire picture. Cost is a factor, yes, but it&apos;s often not even the primary reason brands are making the switch. The real drivers are far more strategic: geopolitical stability, vertically integrated supply chains, unmatched textile heritage, and a young, skilled workforce that can execute at a level few countries can match.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    Whether you are a supply chain manager at a mid-size D2C brand or a founder scouting your first manufacturing partner, this article breaks down exactly why India is no longer just an option&mdash;it&apos;s becoming the default choice for forward-thinking fashion businesses.
                                </p>
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl my-8">
                                    <h4 className="flex items-center gap-2 font-bold text-amber-900 m-0 mb-2">
                                        <TrendingUp className="w-5 h-5" />
                                        The Big Picture
                                    </h4>
                                    <p className="text-amber-800 m-0">
                                        India&apos;s textile and apparel exports crossed $44.4 billion in FY2024-25. With the upcoming India-EU FTA reducing tariff barriers to near-zero, the trajectory is set to accelerate sharply. This isn&apos;t a trend&mdash;it&apos;s a structural shift.
                                    </p>
                                </div>
                            </div>

                            {/* Section 1: Geopolitical De-risking */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Shield className="w-8 h-8 text-[#CBB49A]" />
                                    1. The &quot;China Plus One&quot; Strategy: De-Risking Is Not Optional
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    The global supply chain disruptions of 2020-2023 exposed a critical vulnerability: over-concentration. When a single country accounts for 30%+ of global apparel exports, any disruption&mdash;pandemic, trade war, or geopolitical tension&mdash;ripples across every retail brand on the planet.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Why Brands Are Diversifying</h3>
                                        <ul className="space-y-3 mb-0 list-none pl-0">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                <span><strong>Tariff Uncertainty:</strong> Escalating trade tensions between the West and China have led to unpredictable tariff regimes, ranging from 7.5% to 25%+ on apparel imports from China.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                <span><strong>Compliance Pressure:</strong> Growing ESG mandates (like the EU&apos;s CSDDD) require transparent supply chains. India&apos;s democratic governance structure makes compliance documentation significantly easier.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                <span><strong>IP Protection:</strong> India&apos;s legal framework for intellectual property is far more robust than many alternative manufacturing hubs, a critical factor for brands with proprietary designs.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">India&apos;s Strategic Position</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-xl">
                                                <BarChart3 className="w-6 h-6 text-green-600 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-sm text-green-900 m-0">2nd Largest Textile Exporter</p>
                                                    <p className="text-xs text-green-700 m-0">Globally, behind only China</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                                                <Landmark className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-sm text-blue-900 m-0">PLI Scheme: $1.44 Billion</p>
                                                    <p className="text-xs text-blue-700 m-0">Government incentives for textile manufacturing</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-xl">
                                                <Globe className="w-6 h-6 text-purple-600 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-sm text-purple-900 m-0">FTAs with 60+ Countries</p>
                                                    <p className="text-xs text-purple-700 m-0">Expanding trade access, including upcoming EU deal</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Vertical Integration */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Factory className="w-8 h-8 text-[#CBB49A]" />
                                    2. Vertical Integration: From Raw Cotton to Finished Garment
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    One of India&apos;s most underappreciated advantages isn&apos;t just cheap labor&mdash;it&apos;s that the entire supply chain exists within a single geography. India is one of the very few countries in the world where you can go from raw cotton fiber to a finished, labeled, and packed garment without crossing a single border.
                                </p>
                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image
                                        src="/blog/india-textile-craftsmanship.jpg"
                                        alt="Indian textile craftsmanship and vertical integration"
                                        width={1400}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                <div className="bg-gradient-to-r from-[#2D2A2E] to-gray-800 text-white p-8 rounded-2xl mb-8">
                                    <h3 className="text-xl font-bold mb-6 mt-0 text-[#CBB49A]">India&apos;s Complete Supply Chain</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-white/10 rounded-xl">
                                            <div className="text-3xl font-bold text-[#CBB49A]">6M+</div>
                                            <p className="text-xs text-gray-300 mt-2 mb-0">Tonnes of cotton produced annually (2nd globally)</p>
                                        </div>
                                        <div className="text-center p-4 bg-white/10 rounded-xl">
                                            <div className="text-3xl font-bold text-[#CBB49A]">4,500+</div>
                                            <p className="text-xs text-gray-300 mt-2 mb-0">Textile mills across the country</p>
                                        </div>
                                        <div className="text-center p-4 bg-white/10 rounded-xl">
                                            <div className="text-3xl font-bold text-[#CBB49A]">45M</div>
                                            <p className="text-xs text-gray-300 mt-2 mb-0">People employed in textiles sector</p>
                                        </div>
                                        <div className="text-center p-4 bg-white/10 rounded-xl">
                                            <div className="text-3xl font-bold text-[#CBB49A]">95%</div>
                                            <p className="text-xs text-gray-300 mt-2 mb-0">Of value chain achievable domestically</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl my-8">
                                    <h4 className="flex items-center gap-2 font-bold text-amber-900 m-0 mb-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Why This Matters for Your Brand
                                    </h4>
                                    <p className="text-amber-800 m-0">
                                        Vertical integration means shorter lead times, lower logistics costs, fewer currency exchange risks, and dramatically simplified quality control. When your yarn spinner, dye house, and cut-sew factory are all within 200km of each other, problems get solved in days, not weeks.
                                    </p>
                                </div>
                            </div>

                            {/* Section 3: Craftsmanship Heritage */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Palette className="w-8 h-8 text-[#CBB49A]" />
                                    3. Unmatched Craftsmanship: 5,000 Years of Textile Heritage
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    This is India&apos;s true &quot;moat.&quot; While many countries can offer low-cost assembly, India offers something no factory in Bangladesh, Vietnam, or even China can replicate: a living, breathing tradition of textile artistry that spans millennia.
                                </p>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                                            <Scissors className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Hand Embroidery</h3>
                                        <p className="text-sm leading-relaxed mb-4">
                                            From the delicate <strong>Chikankari</strong> of Lucknow to the mirror-work <strong>Kutchi</strong> embroidery of Gujarat, India possesses an unparalleled library of hand-embroidery techniques. These are skills passed down through generations that simply cannot be replicated by machine.
                                        </p>
                                        <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-500">
                                            <strong>Luxury brands</strong> like Dior, Chanel, and Gucci actively source embroidered fabrics from Indian artisans for their couture collections.
                                        </div>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                            <Palette className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Block Printing &amp; Natural Dyes</h3>
                                        <p className="text-sm leading-relaxed mb-4">
                                            Jaipur&apos;s <strong>block printing</strong>, Bagru&apos;s natural dye techniques, and the intricate <strong>Ajrakh</strong> printing from Sindh&mdash;these are sustainable, artisanal processes that align perfectly with the growing consumer demand for authenticity and eco-consciousness.
                                        </p>
                                        <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-500">
                                            <strong>Natural dyes</strong> from indigo, turmeric, and pomegranate are in massive demand for sustainable fashion lines.
                                        </div>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Handloom Weaving</h3>
                                        <p className="text-sm leading-relaxed mb-4">
                                            India has <strong>3.5 million handloom weavers</strong>&mdash;more than the rest of the world combined. From the silks of Varanasi to the khadi of Ponduru, the diversity of hand-woven textiles is unmatched by any other nation.
                                        </p>
                                        <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-500">
                                            <strong>GI-tagged textiles</strong> like Banarasi Silk have legal protection, ensuring authenticity for international buyers.
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image
                                        src="/blog/india-supply-chain-global.jpg"
                                        alt="India's global reach in textile supply chain"
                                        width={1400}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>

                            {/* Section 4: Sustainability */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Leaf className="w-8 h-8 text-[#CBB49A]" />
                                    4. Sustainability Is Built In, Not Bolted On
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    As Western consumers increasingly demand transparency and sustainability, India has a surprising advantage: many of its traditional manufacturing methods are inherently sustainable. While fast-fashion factories elsewhere are retrofitting expensive water treatment plants, Indian artisans have been using organic dyes and zero-waste techniques for centuries.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    <div className="bg-green-50 p-8 rounded-2xl border border-green-100">
                                        <h3 className="text-xl font-bold text-green-900 mb-4 mt-0 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            India&apos;s Green Advantages
                                        </h3>
                                        <ul className="space-y-3 list-none pl-0 mb-0">
                                            <li className="text-sm text-green-800 flex items-start gap-2">
                                                <span className="text-green-600 font-bold mt-0.5">&bull;</span>
                                                <span><strong>Organic Cotton Leader:</strong> India is the world&apos;s largest producer of organic cotton, accounting for ~50% of global supply.</span>
                                            </li>
                                            <li className="text-sm text-green-800 flex items-start gap-2">
                                                <span className="text-green-600 font-bold mt-0.5">&bull;</span>
                                                <span><strong>Solar-Powered Factories:</strong> India&apos;s massive solar energy infrastructure allows textile parks to operate on 60-80% renewable energy.</span>
                                            </li>
                                            <li className="text-sm text-green-800 flex items-start gap-2">
                                                <span className="text-green-600 font-bold mt-0.5">&bull;</span>
                                                <span><strong>Zero Liquid Discharge (ZLD):</strong> Many major Indian dye houses have invested heavily in ZLD systems, recycling 95%+ of water.</span>
                                            </li>
                                            <li className="text-sm text-green-800 flex items-start gap-2">
                                                <span className="text-green-600 font-bold mt-0.5">&bull;</span>
                                                <span><strong>Handloom = Low Carbon:</strong> Handloom weaving uses zero electricity, making it one of the lowest-carbon manufacturing processes in the world.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                                            <h3 className="text-xl font-bold text-red-900 mb-4 mt-0 flex items-center gap-2">
                                                <AlertTriangle className="w-5 h-5" />
                                                The Compliance Edge
                                            </h3>
                                            <p className="text-red-800 text-sm mb-0">
                                                The EU&apos;s Corporate Sustainability Due Diligence Directive (CSDDD), set to be enforced from 2027, will require brands to prove their supply chains are free from forced labor and environmental harm. India&apos;s strong regulatory framework, independent audit culture, and established certification bodies (like GOTS, OEKO-TEX, and Fair Trade) give it a massive compliance advantage over many competing manufacturing hubs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Workforce & Capabilities */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Factory className="w-8 h-8 text-[#CBB49A]" />
                                    5. The Modern Indian Factory: Tech-Forward &amp; Globally Certified
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Forget the outdated image of dimly-lit sweatshops. India&apos;s top-tier manufacturing facilities are modern, technology-driven operations that would rival any factory in Europe or East Asia. The new generation of Indian manufacturers has invested heavily in automation, ERP systems, and global compliance certifications.
                                </p>

                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image
                                        src="/blog/india-modern-factory.jpg"
                                        alt="Modern Indian textile manufacturing facility"
                                        width={1400}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">CAD/CAM Cutting</div>
                                        <p className="text-xs text-gray-500">Automated pattern making and precision laser cutting reduces waste by 15-20%.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Digital Sampling</div>
                                        <p className="text-xs text-gray-500">3D CLO/Browzwear capabilities reduce sample development time from weeks to days.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">AQL Inspections</div>
                                        <p className="text-xs text-gray-500">Multi-point quality inspections at AQL 2.5 standard, matching global buyer expectations.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">WRAP &amp; SEDEX</div>
                                        <p className="text-xs text-gray-500">Thousands of Indian factories are WRAP, SEDEX, or SA8000 certified for ethical production.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6: Practical Checklist */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-[#CBB49A]" />
                                    6. Your Checklist: Evaluating an Indian Manufacturing Partner
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    If you&apos;re considering India for the first time, here are the key criteria you should evaluate to find a reliable partner:
                                </p>
                                <div className="bg-[#2D2A2E] text-white p-8 rounded-2xl">
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#CBB49A] flex items-center justify-center text-[#2D2A2E] font-bold text-xs mt-0.5">1</div>
                                            <div>
                                                <strong className="block text-[#CBB49A]">Vertical Capability</strong>
                                                <span className="text-gray-400 text-sm">Can they handle fabric sourcing, dyeing, cutting, sewing, and finishing in-house or within their cluster? The fewer middlemen, the better.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#CBB49A] flex items-center justify-center text-[#2D2A2E] font-bold text-xs mt-0.5">2</div>
                                            <div>
                                                <strong className="block text-[#CBB49A]">Certifications &amp; Compliance</strong>
                                                <span className="text-gray-400 text-sm">Look for GOTS, OEKO-TEX, WRAP, SEDEX, or BCI certifications. These are non-negotiable for exporting to EU/US markets.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#CBB49A] flex items-center justify-center text-[#2D2A2E] font-bold text-xs mt-0.5">3</div>
                                            <div>
                                                <strong className="block text-[#CBB49A]">Communication &amp; Project Management</strong>
                                                <span className="text-gray-400 text-sm">India&apos;s English-speaking workforce is a massive advantage. Ensure your partner has dedicated account managers and uses modern tools (Slack, Trello, shared drives).</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#CBB49A] flex items-center justify-center text-[#2D2A2E] font-bold text-xs mt-0.5">4</div>
                                            <div>
                                                <strong className="block text-[#CBB49A]">MOQ Flexibility</strong>
                                                <span className="text-gray-400 text-sm">The best Indian partners work with flexible MOQs, supporting startups at 50-100 pieces per style while scaling to 10,000+ for established brands.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#CBB49A] flex items-center justify-center text-[#2D2A2E] font-bold text-xs mt-0.5">5</div>
                                            <div>
                                                <strong className="block text-[#CBB49A]">Sample Track Record</strong>
                                                <span className="text-gray-400 text-sm">Ask for 2-3 physical samples before committing to bulk. A good manufacturer will gladly produce samples to prove their capability.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Key Manufacturing Hubs */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Globe className="w-8 h-8 text-[#CBB49A]" />
                                    7. India&apos;s Key Textile &amp; Manufacturing Hubs
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    India&apos;s manufacturing strength is distributed across specialized clusters, each with its own superpower:
                                </p>
                                <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-32 shrink-0 font-bold text-gray-900">Tiruppur</div>
                                            <div className="text-gray-600 text-sm">The &quot;Knitwear Capital of India.&quot; Produces ~90% of India&apos;s knitted garment exports. Specializes in cotton t-shirts, polo shirts, and casualwear.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-32 shrink-0 font-bold text-gray-900">Noida/NCR</div>
                                            <div className="text-gray-600 text-sm">The hub for woven garments, formal wear, and export-quality fashion. Home to many large-scale, vertically integrated factories.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-32 shrink-0 font-bold text-gray-900">Jaipur</div>
                                            <div className="text-gray-600 text-sm">The epicenter of block printing, hand embroidery, and artisanal fashion. Ideal for brands with a boho, sustainable, or luxury-artisan aesthetic.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-32 shrink-0 font-bold text-gray-900">Bengaluru</div>
                                            <div className="text-gray-600 text-sm">Known for high-end garments, silk manufacturing, and tech-integrated factories with strong US/EU buyer relationships.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-32 shrink-0 font-bold text-gray-900">Surat</div>
                                            <div className="text-gray-600 text-sm">The &quot;Textile City&quot; of India. Dominates synthetic, polyester, and embroidered fabric production. Key hub for affordable occasion-wear.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-32 shrink-0 font-bold text-gray-900">Ludhiana</div>
                                            <div className="text-gray-600 text-sm">The center for knitwear, sweaters, and winter-wear production. Offers competitive pricing for bulk fleece and woolen garments.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conclusion */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Bottom Line: India Is the Strategic Choice</h2>
                                <div className="bg-gradient-to-br from-[#2D2A2E] to-gray-800 text-white p-8 rounded-2xl">
                                    <p className="text-lg leading-relaxed mb-6 text-white">
                                        Moving manufacturing to India is not about finding the cheapest option. It&apos;s about building a <strong>resilient, high-quality, and future-proof supply chain</strong>. It&apos;s about accessing a country that can offer everything from hand-embroidered couture to high-volume streetwear, all within a single, deeply experienced ecosystem.
                                    </p>
                                    <p className="text-lg leading-relaxed mb-6 text-white">
                                        The brands that are winning in 2026 are the ones that made this move two years ago. The best time to start was yesterday. The second best time is now.
                                    </p>
                                    <p className="text-xl font-bold text-[#CBB49A]">
                                        The question is no longer &quot;should you manufacture in India?&quot;&mdash;it&apos;s &quot;can you afford not to?&quot;
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-[#2D2A2E] text-white p-10 lg:p-14 rounded-3xl mt-16 relative overflow-hidden text-center" ref={endOfArticleRef}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBB49A] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                                <div className="relative z-10 max-w-2xl mx-auto">
                                    <span className="text-[#CBB49A] font-bold tracking-widest text-sm uppercase mb-4 block">Ready to Explore India?</span>
                                    <h3 className="text-3xl font-bold mb-6">Looking for a Reliable Manufacturing Partner in India?</h3>
                                    <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                        Krazy Kreators offers end-to-end manufacturing from India&mdash;from fabric sourcing and sampling to production and global shipping. Whether you need 50 pieces or 50,000, we can help.
                                    </p>
                                    <Button
                                        onClick={() => setContactOpen(true)}
                                        className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#CBB49A]/30 font-semibold"
                                    >
                                        Start a Conversation
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
                                                ? "bg-white text-[#CBB49A] border-2 border-[#CBB49A]"
                                                : "bg-white text-gray-600 hover:text-[#CBB49A] border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                                            {isLiked ? 'Liked' : 'Like'} ({likeCount})
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:text-[#CBB49A] border border-gray-200 text-sm font-medium transition-all duration-300"
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
                                <MessageCircle className="w-6 h-6 text-[#CBB49A]" />
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
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CBB49A] focus:ring-2 focus:ring-[#CBB49A]/20 outline-none transition-all bg-gray-50 focus:bg-white"
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
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CBB49A] focus:ring-2 focus:ring-[#CBB49A]/20 outline-none transition-all bg-gray-50 focus:bg-white"
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
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CBB49A] focus:ring-2 focus:ring-[#CBB49A]/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                            placeholder="Share your thoughts..."
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
                                        <div key={comment.id} id={`comment-${comment.id}`} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#CBB49A]/30 transition-all shadow-sm">
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
                                                        <button className="text-xs font-medium text-gray-400 hover:text-[#CBB49A] transition-colors">
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
