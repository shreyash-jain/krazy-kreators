"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { getRandomBlogs, blogPosts as blogUtilsPosts } from "@/lib/blogUtils";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'how-to-start-clothing-brand-2026';

type HowToStartBlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function HowToStartBlogClient({ initialLikeCount, initialComments }: HowToStartBlogClientProps) {
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

        // Set initial scroll state
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
        // Scroll to existing comments when comments button is clicked
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

            // Toggle the liked state only if API call succeeds
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
            // If API call fails, don't change the liked state
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
            {/* Navbar with dynamic text color */}
            <Navbar invertTabs={!scrolled} />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
                <Image
                    src="/blog/how-to-start-clothing-brand-2026-banner.jpg"
                    alt="How to Start a Clothing Brand in 2026"
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
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">
                        {/* Article Title and Category */}
                        <div className="mb-8">
                            <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2A2E] mb-4">
                                How to Start a Clothing Brand in 2026: Additional Steps for Success
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full">
                                    Business
                                </span>
                                <span className="text-sm text-[#666666]">10 min read</span>
                                <span className="text-sm text-[#666666]">•</span>
                                <span className="text-sm text-[#666666]">Posted on January 19, 2026</span>
                            </div>

                            {/* Social Interaction Section */}
                            <div className="mb-8 p-4 bg-[#F8F7F4] rounded-xl">
                                {/* Desktop Layout */}
                                <div className="hidden sm:flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={handleLike}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                                ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                                                : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                                            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                                        </button>

                                        <button
                                            onClick={handleComment}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </button>
                                </div>

                                {/* Mobile Layout */}
                                <div className="flex flex-col gap-3 sm:hidden">
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={handleLike}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 mr-2 ${isLiked
                                                ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                                                : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                                            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                                        </button>

                                        <button
                                            onClick={handleComment}
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300 flex-1 ml-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300 w-full"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Introduction */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-[#2D2A2E] mb-4">Executive Summary: The Fashion Entrepreneur’s Landscape in 2026</h2>
                            <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                The global fashion industry in 2026 stands at a complex intersection of technological acceleration and operational constriction. For the aspiring entrepreneur, the barrier to entry has ostensibly lowered through the democratization of generative Artificial Intelligence (AI) and the ubiquity of social commerce platforms. However, the barrier to sustainable profitability has risen significantly, fortified by stringent regulatory frameworks like the European Union’s Digital Product Passport (DPP), volatile geopolitical supply chains characterized by fluctuating tariffs, and a consumer base that demands hyper-transparency.
                            </p>
                            <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                The market, projected to exceed historical valuations, is no longer a playground for the &quot;move fast and break things&quot; mentality that defined the direct-to-consumer (DTC) boom of the previous decade. Instead, success in 2026 requires a philosophy of &quot;move smart and trace everything,&quot; where operational resilience is valued as highly as aesthetic innovation.
                            </p>
                        </div>

                        {/* Introduction Image */}
                        <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            {/* Placeholder until image generation works */}
                            <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-400">
                                <Image
                                    src="/blog/how-to-start-clothing-brand-2026-manufacturing.jpg"
                                    alt="Modern fashion manufacturing"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>

                        {/* Post Details */}
                        <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-12 border border-gray-100">
                            <h3 className="text-lg font-semibold text-[#2D2A2E] mb-4">Post Details</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#666666]">Hosted on January 19, 2026</p>
                                    <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                                </div>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none">

                            {/* Phase 1 */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Phase 1: Strategic Foundation and Niche Identification in 2026</h2>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4">1.1 The Shift from Demographics to Psychographic Micro-Communities</h3>
                                <p className="text-lg text-[#666666] leading-relaxed mb-4">
                                    The era of the generalist fashion brand has effectively ended for the startup entrant. The dominance of ultra-fast fashion giants and established luxury houses leaves little room in the middle market for undefined brands. In 2026, success depends on identifying and serving &quot;micro-communities&quot;—highly specific consumer segments united by shared values, aesthetics, or functional needs rather than broad demographic brackets.
                                </p>

                                <div className="mb-8 rounded-xl overflow-hidden shadow-lg my-8">
                                    <Image
                                        src="/blog/how-to-start-clothing-brand-2026-community.jpg"
                                        alt="Micro-communities in 2026"
                                        width={800}
                                        height={500}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                <p className="text-lg text-[#666666] leading-relaxed mb-4">
                                    Research indicates that high-growth niches in 2026 are defined by their functional integration of technology and values. Adaptive and Inclusive Fashion has moved from a sideline to a central demand. Similarly, the &quot;Well-being&quot; Wardrobe has emerged, where clothing is integrated with wellness. Furthermore, Digital-First and &quot;Phygital&quot; Fashion represents a maturing revenue stream.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4 mt-8">1.2 The Economic Reality: Navigating Volatility and Tariffs</h3>
                                <p className="text-lg text-[#666666] leading-relaxed mb-4">
                                    Entrepreneurs launching in 2026 must bake resilience into their business model from day one. Industry executives describe the landscape as &quot;Challenging,&quot; with tariffs and supply chain volatility cited as primary hurdles overtaking general uncertainty. The imperative is a shift toward high-value, differentiated products, as low-margin commodities are effectively dead for new entrants.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4 mt-8">1.3 Business Model Selection: The Risk-Reward Spectrum</h3>
                                <div className="overflow-x-auto mb-8 border border-gray-200 rounded-lg">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-4 border-b font-semibold text-[#2D2A2E]">Business Model</th>
                                                <th className="p-4 border-b font-semibold text-[#2D2A2E]">Operational Mechanism</th>
                                                <th className="p-4 border-b font-semibold text-[#2D2A2E]">Risk Profile (2026)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-4 font-medium">Print-on-Demand (POD)</td>
                                                <td className="p-4 text-gray-600">On-order mfg.</td>
                                                <td className="p-4 text-gray-600">Low Risk / Low Margin. Saturated.</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-4 font-medium">Private Label (Blanks)</td>
                                                <td className="p-4 text-gray-600">Re-labeling generic.</td>
                                                <td className="p-4 text-gray-600">Medium Risk. &quot;Same fabric&quot; issues.</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-4 font-medium">Cut & Sew (CMT)</td>
                                                <td className="p-4 text-gray-600">Brand supplies fabric/patterns.</td>
                                                <td className="p-4 text-gray-600">High Risk. Full liability.</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 font-medium text-[#CBB49A]">Design to Shelf (Full Package)</td>
                                                <td className="p-4 text-gray-600">Manufacturer handles all.</td>
                                                <td className="p-4 text-gray-600">Optimized Risk. Integrated DFM.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>


                            {/* Phase 2 */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Phase 2: Design and Development in the Age of AI</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                                    <div>
                                        <p className="text-lg text-[#666666] leading-relaxed mb-4">
                                            The design process in 2026 has been revolutionized by the integration of Generative AI and 3D simulation. However, a dangerous misconception exists that AI replaces the designer. In reality, the most successful brands utilize a &quot;Centaur&quot; model—human creativity augmented by AI speed and precision.
                                        </p>
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">2.1 The AI-Augmented Workflow</h4>
                                        <ul className="list-disc pl-5 space-y-2 text-[#666666] mb-4">
                                            <li><strong className="text-[#2D2A2E]">Step 1: Ideation (Text-to-Image):</strong> Tools like NewArc.ai and Midjourney allow founders to visualize concepts instantly.</li>
                                            <li><strong className="text-[#2D2A2E]">Step 2: 3D Visualization:</strong> Software like CLO 3D and Style3D translates 2D concepts into digital twins for virtual try-on and fit validation.</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-xl overflow-hidden shadow-lg">
                                        <Image
                                            src="/blog/how-to-start-clothing-brand-2026-ai-design.jpg"
                                            alt="AI Design Interface"
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                </div>

                                <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 mt-6">2.3 The &quot;Trap&quot; of AI Design</h4>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    While AI accelerates visualization, it introduces a &quot;Hallucination of Feasibility.&quot; A manufacturer&apos;s role in 2026 is to take the AI-generated inspiration and apply Design for Manufacturing (DFM) principles, ensuring the product can actually be made at the target price point.
                                </p>
                            </div>

                            {/* Phase 3 & 4 */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Phase 3 & 4: Technical Blueprint & Supply Chain Strategy</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-4">
                                    If the design is the soul of the garment, the Tech Pack is its constitution. In 2026, the tech pack has evolved from a static PDF into a dynamic, data-rich asset housed within a PLM system.
                                </p>
                                <div className="bg-[#F8F7F4] p-6 rounded-xl mb-8">
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Strategic Advantage of &quot;Design to Shelf&quot;</h4>
                                    <p className="text-[#666666] mb-4">
                                        For a client like Crazy Creator, pitching Design to Shelf services is a critical risk mitigation strategy. It offers Integrated Accountability—if fabric arrives late, the manufacturer owns the timeline.
                                    </p>
                                    <p className="text-[#666666]">
                                        Also critical is <strong>Tariff Engineering</strong>: Skilled manufacturers can advise on minor design changes that might shift a garment into a different tariff classification, saving millions in duty over time.
                                    </p>
                                </div>
                            </div>

                            {/* Phase 5 */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Phase 5: Regulatory Compliance (DPP)</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-4">
                                    The EU’s Ecodesign for Sustainable Products Regulation (ESPR) mandates that textiles sold in the EU must carry a <strong>Digital Product Passport (DPP)</strong> by 2027. This acts as a &quot;digital fingerprint&quot; for the product, accessible via a QR code.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-4">
                                    Startups must choose manufacturers that are &quot;DPP-Ready&quot; and utilize platforms like Carbonfact or Retraced to aggregate supply chain data. Rather than a burden, smart brands use it as a marketing asset to build trust.
                                </p>
                            </div>

                            {/* Phase 6 & 7 */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Phase 6 & 7: Brand Building & Financial Modeling</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Detailed Financial Modeling</h4>
                                        <p className="text-[#666666] mb-4">
                                            The &quot;Valley of Death&quot; is the gap between paying the manufacturer and receiving revenue. A robust pricing model must include COGS, Landed Costs (Tariffs), CAC, and a Return Rate Buffer (often 30%).
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">SEO 2.0 & Nano-Influencers</h4>
                                        <p className="text-[#666666] mb-4">
                                            Marketing in 2026 relies on &quot;Search Everywhere Optimization&quot;—optimizing for TikTok, Pinterest, and AI chatbots. Nano-influencers (1k-10k) now hold more sway than celebrities due to genuine community trust.
                                        </p>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Conclusion */}
                        <div className="bg-[#2D2A2E] text-white p-8 rounded-2xl mb-12" ref={endOfArticleRef}>
                            <h3 className="text-2xl font-bold mb-4">Conclusion: The Path Forward with Krazy Kreators</h3>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Starting a clothing brand in 2026 is a journey through a high-tech, highly regulated, and hyper-competitive landscape. The winners will be the &quot;Smart Brands&quot;—those that combine distinct micro-community focus with operational excellence. By partnering with a Design to Shelf manufacturer like Krazy Kreators, you outsource the technical, logistical, and compliance warfare, freeing you to focus on building your brand and community.
                            </p>
                            <Button
                                onClick={() => setContactOpen(true)}
                                className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none"
                            >
                                Start Your Journey
                            </Button>
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
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                                            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                                        </button>

                                        <button
                                            onClick={handleComment}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
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
                                    {/* Input */}
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

                                    {/* Existing Comments */}
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
                                                                        <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? 'fill-[#CBB49A]' : ''}`} />
                                                                        {comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}
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
                                                    {showAllComments ? 'Show Less Comments' : `Show All ${comments.length} Comments`}
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
