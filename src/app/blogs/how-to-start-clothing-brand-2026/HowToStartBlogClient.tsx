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
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2D2A2E] mb-6 leading-tight">
                                Launching a Global Clothing Brand in 2026: The Strategic Playbook
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <span className="px-4 py-1.5 bg-[#F4EFEB] text-[#8B7355] text-sm font-semibold rounded-full uppercase tracking-wider">
                                    Business Strategy
                                </span>
                                <span className="text-sm text-[#666666] font-medium">15 min read</span>
                                <span className="text-sm text-[#CCCCCC]">•</span>
                                <span className="text-sm text-[#666666] font-medium">January 19, 2026</span>
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
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-[#2D2A2E] mb-4">Introduction: The New Global Standard</h2>
                            <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                The fashion landscape has shifted. For entrepreneurs in hubs like New York, London, and Dubai, 2026 offers unprecedented access to global markets—but the bar for entry has been raised. It is no longer enough to have a good design; successful brands must now demonstrate clear operations, reliable production, and a strong brand identity from Day 1.
                            </p>
                            <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                This guide is designed for the modern fashion founder who views their brand as a scalable asset. We move beyond the basics to discuss how you can leverage professional manufacturing, smart AI tools, and the right partners to build a brand that endures.
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

                            {/* Phase 1: Two Column Layout for Niche and Image */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Step 1: Identifying a Viable Market Niche</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4">Beyond Demographics</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                            The most successful brands launching in 2026 aren&apos;t targeting &quot;Women 25-40.&quot; They are targeting shared values and specific lifestyles. Whether you are building <strong>Loungewear for Remote Workers</strong> or <strong>Performance Wear for Desert Climates</strong>, your niche must be sharp and well-defined.
                                        </p>
                                        <p className="text-lg text-[#666666] leading-relaxed">
                                            International buyers, particularly in competitive markets like the UK and UAE, respond to brands that solve specific problems (e.g., breathable fabrics for humidity, modest fashion with a modern twist).
                                        </p>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src="/blog/how-to-start-clothing-brand-2026-community.jpg"
                                            alt="Strategic Niche Selection"
                                            width={800}
                                            height={600}
                                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-6">Selecting the Right Business Model</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-[#F9F9F9] p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2 text-lg">Private Label</h4>
                                        <p className="text-sm text-[#666666] mb-4">Re-branding existing high-quality blank garments.</p>
                                        <div className="flex items-center text-xs font-semibold text-orange-600 bg-orange-50 w-fit px-2 py-1 rounded">
                                            Medium Risk / Fast Entry
                                        </div>
                                    </div>

                                    <div className="bg-[#F9F9F9] p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-2 text-lg">Custom Manufacturing</h4>
                                        <p className="text-sm text-[#666666] mb-4">You provide patterns/fabrics; factory assembles.</p>
                                        <div className="flex items-center text-xs font-semibold text-red-600 bg-red-50 w-fit px-2 py-1 rounded">
                                            High Effort
                                        </div>
                                    </div>

                                    <div className="bg-[#2D2A2E] p-6 rounded-xl shadow-lg relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-white transform rotate-12 group-hover:scale-110 transition-transform">
                                            ★
                                        </div>
                                        <h4 className="font-bold text-white mb-2 text-lg">Full Service Production</h4>
                                        <p className="text-sm text-gray-300 mb-4">We handle everything: designs, fabrics, making it, and shipping.</p>
                                        <div className="flex items-center text-xs font-semibold text-[#2D2A2E] bg-[#CBB49A] w-fit px-2 py-1 rounded">
                                            Recommended for Scale
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Phase 2: Professional AI Section */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Step 2: Leveraging AI for Efficiency, Not Replacement</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                            <h4 className="flex items-center gap-2 text-lg font-bold text-[#2D2A2E] mb-3">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                The Efficiency Engine
                                            </h4>
                                            <p className="text-[#666666]">
                                                Use AI tools for rapid ideation and colorway testing. Platforms like Midjourney can visualize a 50-piece collection in hours, allowing you to see what people like before spending money on samples.
                                            </p>
                                        </div>
                                        <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100">
                                            <h4 className="flex items-center gap-2 text-lg font-bold text-[#2D2A2E] mb-3">
                                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                                The Human Essential
                                            </h4>
                                            <p className="text-[#666666]">
                                                AI cannot determine how fabric feels or fits. An experienced technical designer is required to translate digital dreams into detailed blueprints that factories can actually execute.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-xl h-full relative min-h-[300px]">
                                        <Image
                                            src="/blog/how-to-start-clothing-brand-2026-ai-design.jpg"
                                            alt="AI assisted fashion design"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Phase 3 & Spotlight Combined */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Step 3: Securing a Global Manufacturing Partner</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                                    <div className="lg:col-span-2 text-lg text-[#666666] leading-relaxed space-y-4">
                                        <p>
                                            For brands in the US or UK, the challenge is rarely just production—it is <strong>Shipping and Rules</strong>. An &quot;All-in-One&quot; partner handles the hard work: from sourcing organic cotton that meets EU standards to optimizing shipping routes for Dubai customs.
                                        </p>
                                        <p>
                                            This &quot;Integrated Approach&quot; mitigates the risk of fragmented supply chains, where a delay in fabric sourcing can miss a seasonal launch window.
                                        </p>
                                    </div>
                                    <div className="bg-[#2D2A2E] p-8 rounded-2xl text-white shadow-xl flex flex-col justify-center relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h4 className="text-xl font-bold mb-2 text-[#CBB49A]">Why Choose Full Package?</h4>
                                            <ul className="space-y-3 mt-4 text-gray-300 ">
                                                <li className="flex items-center gap-3 text-gray-300">
                                                    <span className="w-1.5 h-1.5 bg-[#CBB49A] rounded-full"></span>
                                                    Checking if designs are possible
                                                </li>
                                                <li className="flex items-center gap-3 text-gray-300">
                                                    <span className="w-1.5 h-1.5 bg-[#CBB49A] rounded-full"></span>
                                                    Handling Worldwide Shipping
                                                </li>
                                                <li className="flex items-center gap-3 text-gray-300">
                                                    <span className="w-1.5 h-1.5 bg-[#CBB49A] rounded-full"></span>
                                                    Strict Quality Checks
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Client Success Spotlight */}
                                <div className="bg gradient-to-r from-[#F9F9F9] to-white border border-gray-100 rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBB49A] opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                                    <div className="relative z-10">
                                        <h3 className="text-sm font-bold tracking-widest text-[#CBB49A] uppercase mb-4">Client Success Spotlight</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                            <div>
                                                <h4 className="text-3xl font-serif text-[#2D2A2E] mb-4">Las Loungewear: From Concept to US Market Leader</h4>
                                                <p className="text-[#666666] mb-6 leading-relaxed">
                                                    When Anika McKelvey founded <strong>Las Loungewear</strong> in Miami, she needed more than just a factory—she needed a strategic partner. She required high-quality, sustainable fabrics that offered comfort for the humid Florida climate, while maintaining a premium aesthetic.
                                                </p>
                                                <p className="text-[#666666] mb-8 leading-relaxed">
                                                    By partnering with Krazy Kreators for end-to-end development, Anika could focus on marketing and community building. We handled the complex prototyping, fabric testing, and logistics, helping Las Loungewear scale rapidly across the US.
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-500">
                                                        LM
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#2D2A2E]">Anika McKelvey</p>
                                                        <p className="text-sm text-[#888888]">Founder, Las Loungewear (Miami, USA)</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden shadow-lg border-4 border-white">
                                                {/* Placeholder for video/image - using a generic image for now */}
                                                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                                                    <div className="text-center p-6">
                                                        <p className="text-white text-lg font-medium opacity-80 italic">&quot;Krazy Kreators handled the details, so I could build the brand.&quot;</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4: Compliance & Sustainability (DPP) */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Step 4: Compliance & Sustainability</h2>
                                <div className="bg-green-50/50 rounded-2xl p-8 border border-green-100">
                                    <h3 className="text-xl font-bold text-[#2D2A2E] mb-4">The Digital Product ID Era</h3>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        For brands exporting to Europe or planning a global presence, the &apos;Digital Product ID&apos; is becoming a standard. This is no longer just about &quot;being green&quot;—it is about following the rules to sell globally. New international sustainability laws effectively mandates that brands account for their environmental footprint.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                        <div className="bg-white p-6 rounded-xl shadow-sm">
                                            <h4 className="font-bold text-[#2D2A2E] mb-2">Traceability</h4>
                                            <p className="text-sm text-[#666666]">
                                                You must be able to trace your garment from raw fiber (e.g., Organic Cotton from Turkey) to the final stitch.
                                            </p>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-sm">
                                            <h4 className="font-bold text-[#2D2A2E] mb-2">Transparency</h4>
                                            <p className="text-sm text-[#666666]">
                                                QR codes on labels that reveal the factory location, wage data, and carbon footprint to the consumer.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 5: Operational Strategy */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Step 5: Operational Strategy & Growth</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="border-t-4 border-[#CBB49A] pt-6">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Financial Prudence</h4>
                                        <p className="text-[#666666] leading-relaxed">
                                            The &quot;Gap&quot; for new brands is the cash withdrawal between production payment and sales revenue. Ensure your budget accounts for <strong>Total Final Cost</strong> (making + shipping + taxes) rather than just unit price. Smart founders allocate 40% of their initial budget to marketing, not just stock.
                                        </p>
                                    </div>
                                    <div className="border-t-4 border-[#2D2A2E] pt-6">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Community-First Marketing</h4>
                                        <p className="text-[#666666] leading-relaxed">
                                            In 2026, trust is the currency. Focus on cultivating deep relationships with nano-influencers (1k-10k followers) who align with your brand values, rather than burning budget on broad expensive automated ads. Community events and &quot;Founder&apos;s Journal&quot; style content build higher customer loyalty.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 6: The Modern Tech Stack */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Step 6: The Tech Stack of a Modern Brand</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-8">
                                    A 2026 brand cannot run on spreadsheets alone. To compete with established players, you need a lean but powerful tech stack that automates the mundane and amplifies your reach.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-[#F8F7F4] rounded-xl border border-gray-100 group hover:border-[#CBB49A] transition-colors">
                                        <div className="w-10 h-10 bg-[#CBB49A]/10 text-[#CBB49A] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#CBB49A] group-hover:text-white transition-all">
                                            <span className="font-bold">1</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-[#2D2A2E] mb-2">3D Digital Design</h4>
                                        <p className="text-sm text-[#666666]">
                                            Drastically reduce sampling costs and time-to-market by visualizing designs digitally before cutting a single yard of fabric.
                                        </p>
                                    </div>
                                    <div className="p-6 bg-[#F8F7F4] rounded-xl border border-gray-100 group hover:border-[#CBB49A] transition-colors">
                                        <div className="w-10 h-10 bg-[#CBB49A]/10 text-[#CBB49A] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#CBB49A] group-hover:text-white transition-all">
                                            <span className="font-bold">2</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-[#2D2A2E] mb-2">Smart Inventory Tools</h4>
                                        <p className="text-sm text-[#666666]">
                                            Tools that automatically update your stock across your Shopify store, TikTok Shop, and wholesale channels in real-time.
                                        </p>
                                    </div>
                                    <div className="p-6 bg-[#F8F7F4] rounded-xl border border-gray-100 group hover:border-[#CBB49A] transition-colors">
                                        <div className="w-10 h-10 bg-[#CBB49A]/10 text-[#CBB49A] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#CBB49A] group-hover:text-white transition-all">
                                            <span className="font-bold">3</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-[#2D2A2E] mb-2">Smart Email Marketing</h4>
                                        <p className="text-sm text-[#666666]">
                                            Systems that predict when a customer is ready to buy again based on their usage habits.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 7: Post-Launch Momentum */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Step 7: Maintaining Momentum Post-Launch</h2>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-full md:w-1/2">
                                        <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                            The real work begins after launch day. The most common mistake new founders make is front-loading all their energy into the launch and having no plan for &quot;Month 2&quot;.
                                        </p>
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-3">
                                                <div className="min-w-[6px] h-[6px] rounded-full bg-[#CBB49A] mt-2.5"></div>
                                                <p className="text-[#666666]"><strong>The Drop Model:</strong> Instead of releasing everything at once, release small &quot;capsules&quot; every 6 weeks to maintain hype and manage cash flow.</p>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="min-w-[6px] h-[6px] rounded-full bg-[#CBB49A] mt-2.5"></div>
                                                <p className="text-[#666666]"><strong>User Generated Content (UGC):</strong> Incentivize your first 100 customers to post. Their social proof is worth more than any professional photoshoot.</p>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="min-w-[6px] h-[6px] rounded-full bg-[#CBB49A] mt-2.5"></div>
                                                <p className="text-[#666666]"><strong>Iterate Fast:</strong> Listen to feedback on fit and fabric immediately. Your second production run should be an upgrade on your first.</p>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="w-full md:w-1/2 bg-[#2D2A2E] text-white p-8 rounded-2xl shadow-xl">
                                        <h4 className="text-xl font-bold mb-4 text-[#CBB49A]">Key Metric: Repeat Purchase Rate</h4>
                                        <p className="text-gray-300 mb-6">
                                            &quot;In fashion, your first sale is marketing; your second sale is brand validation. If customers aren&apos;t coming back within 90 days, you have a product problem, not a marketing problem.&quot;
                                        </p>
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="w-3/4 h-full bg-[#CBB49A]"></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 text-right">Target Renewal: &gt;25%</p>
                                    </div>
                                </div>
                            </div>




                            {/* Step 8: Logistics */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Step 8: The Logistics of Scale</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-8">
                                    Scaling a brand requires mastering the unglamorous side of fashion: logistics. In 2026, customers expect Amazon-prime level speeds even from independent boutiques.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Professional Fulfillment Partners</h4>
                                        <p className="text-[#666666] mb-4">
                                            Do not ship from your garage. Partner with a modern shipping partner that integrates directly with Shopify and TikTok Shop. Look for partners with &quot;smart routing&quot; capabilities to reduce shipping costs by up to 20%.
                                        </p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Handling Returns Smartly</h4>
                                        <p className="text-[#666666] mb-4">
                                            Fashion has a 30% return rate. Turn this into an opportunity with &quot;easy exchange systems&quot; which encourage customers to swap sizes rather than request refunds.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 9: Team Building */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Step 9: Building Your Core Team</h2>
                                <div className="space-y-6">
                                    <p className="text-lg text-[#666666] leading-relaxed">
                                        You cannot wear every hat forever. The most successful founders transition from &quot;doing&quot; to &quot;leading&quot; by making three critical hires in their first year:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                                            <h4 className="font-bold text-[#2D2A2E] mb-2">1. The Content Creator</h4>
                                            <p className="text-sm text-[#666666]">
                                                Someone who lives on TikTok/Reels. They don&apos;t need a DSLR; they need to understand native storytelling and trends.
                                            </p>
                                        </div>
                                        <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                                            <h4 className="font-bold text-[#2D2A2E] mb-2">2. The Ops Manager</h4>
                                            <p className="text-sm text-[#666666]">
                                                Your right hand. They handle the shipping details, inventory forecasting, and customer support tickets.
                                            </p>
                                        </div>
                                        <div className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-shadow">
                                            <h4 className="font-bold text-[#2D2A2E] mb-2">3. The Technical Designer</h4>
                                            <p className="text-sm text-[#666666]">
                                                Freelance or Part-time initially. Ensures your design files are perfect so production runs are flawless.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    <div className="bg-[#F9F9F9] rounded-xl p-6">
                                        <h3 className="font-bold text-[#2D2A2E] mb-2">How much capital do I need to start?</h3>
                                        <p className="text-[#666666]">
                                            While you can start a simple print-on-demand business for under $500, a serious custom clothing line typically requires <strong>$15,000 - $30,000</strong> to cover sampling, minimum factory orders, and initial marketing.
                                        </p>
                                    </div>
                                    <div className="bg-[#F9F9F9] rounded-xl p-6">
                                        <h3 className="font-bold text-[#2D2A2E] mb-2">How long does the process take?</h3>
                                        <p className="text-[#666666]">
                                            From concept to launch, expect a timeline of <strong>6 to 9 months</strong>. This includes 2-3 rounds of sampling, production lead times (usually 45-60 days), and shipping.
                                        </p>
                                    </div>
                                    <div className="bg-[#F9F9F9] rounded-xl p-6">
                                        <h3 className="font-bold text-[#2D2A2E] mb-2">Should I incorporate immediately?</h3>
                                        <p className="text-[#666666]">
                                            Yes. Registering your business protects your personal assets. Additionally, trademarks should be filed as soon as your brand name is finalized to prevent IP theft, especially if manufacturing overseas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Conclusion */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Ready to Build a World-Class Brand?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Starting a clothing brand in 2026 is a journey of precision and partnership. Whether you are scaling a label in London or launching a startup in Dubai, Krazy Kreators provides the infrastructure you need to succeed. We handle the complexity of manufacturing, so you can focus on your vision.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Start Your Project with Us
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
