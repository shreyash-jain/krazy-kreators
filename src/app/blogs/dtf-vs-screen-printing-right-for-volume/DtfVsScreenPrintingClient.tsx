"use client";
/* eslint-disable react/no-unescaped-entities, @typescript-eslint/no-unused-vars */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ToastContainer } from "@/components/Toast";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'dtf-vs-screen-printing-right-for-volume';

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function DtfVsScreenPrintingClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
    const [newComment, setNewComment] = useState({ name: "", email: "", comment: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const endOfArticleRef = useRef<HTMLDivElement | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
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
                if (newSet.has(commentId)) newSet.delete(commentId);
                else newSet.add(commentId);
                return newSet;
            });
        } catch { }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prev => ({ ...prev, [name]: value }));
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
            <section className="relative h-[60vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <Image
                    src="/blog/dtf-vs-screen-printing-banner.jpg"
                    alt="Direct-to-Film (DTF) vs. Screen Printing"
                    fill
                    className="object-cover"
                    style={{
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                    }}
                    priority
                />
                <div className="absolute inset-0 bg-black/60"></div>
                
                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Manufacturing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">April 15, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The Great Print Debate:<br className="hidden sm:block" /> DTF vs. Screen Printing
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Why Your Order Size Decides the Winner
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">
                        {/* Social Interaction Container */}
                        <div className="mb-0">

                            {/* Social Interaction Section */}
                            <div className="mb-12 p-4 bg-[#F8F7F4] rounded-xl flex items-center justify-between">
                                <div className="flex flex-wrap items-center gap-4">
                                    <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200 text-sm font-medium transition-all duration-300">
                                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                                    </button>
                                    <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                                        <MessageCircle className="w-4 h-4" />
                                        {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                                    </button>
                                    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300">
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Post Details */}
                        <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-12 border border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-[#666666]">Hosted on April 15, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                <strong>The Scenario:</strong> You’ve spent months perfecting a 6-color, incredibly detailed streetwear graphic. You request a quote for your first drop of 40 hoodies. The manufacturer sends back the invoice, and you’re hit with a massive, unexpected line item: <strong>$250 in Screen Setup Fees</strong>.
                            </p>
                            
                            <p className="mb-6">
                                Before a single drop of ink has touched your garments, your profit margins are already bleeding. 
                            </p>
                            <p className="mb-12">
                                If you are a rising apparel brand, navigating the world of garment printing can feel like a trap. The biggest decision you face early on is choosing between the traditional heavyweight, <strong>Screen Printing</strong>, and the modern disruptor, <strong>Direct-to-Film (DTF)</strong>. The secret the industry doesn't always tell you? Neither method is inherently "better"—but picking the wrong one for your order volume can cost you thousands. Here is your cheat sheet to making the right choice.
                            </p>

                            {/* Section 1 */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Traditional Route: Screen Printing</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8">
                                    <div className="order-2 lg:order-1">
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">Screen printing is the ancient art of apparel decoration, and it remains the industry standard for mass production.</p>
                                        <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-6 shadow-sm">
                                            <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">The Catch: The Screen Tax</h3>
                                            <p className="text-[#666666] m-0 text-lg leading-relaxed">In screen printing, every single color in your design requires its own custom mesh screen to be burned. If your logo has five colors, you need five screens. This is a highly manual, labor-intensive process.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px] order-1 lg:order-2">
                                        <Image
                                            src="/blog/dtf_screen_printing_demo.jpg"
                                            alt="Traditional Screen Printing Process"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                    <div className="p-8 border-2 border-green-500/20 bg-green-50/50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-3 uppercase tracking-wider">
                                            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span> When It Makes Sense
                                        </h4>
                                        <p className="text-lg text-green-900/80 leading-relaxed">Because you pay for the screens upfront, the cost per shirt plummets as your volume goes up. If you are ordering <strong className="text-green-900">100+ to 500+ units</strong> of a 2-color design, screen printing is highly cost-effective. It sinks beautifully into the fabric, breathes well, and lasts practically forever.</p>
                                    </div>
                                    <div className="p-8 border-2 border-red-500/20 bg-red-50/50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-3 uppercase tracking-wider">
                                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span> When It Hurts Your Business
                                        </h4>
                                        <p className="text-lg text-red-900/80 leading-relaxed">If you only need 30 shirts to test a new market, dividing a $200 screen setup fee across 30 shirts makes your production cost skyrocket. For small runs with high color counts, screen printing is a <strong className="text-red-900">budget killer</strong>.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Modern Hack: Direct-to-Film (DTF)</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px]">
                                        <Image
                                            src="/blog/dtf_film_peel.jpg"
                                            alt="DTF Transfer Film Peel"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">Enter DTF. Instead of burning screens, your design is digitally printed onto a specialized film, backed with an adhesive powder, and heat-pressed seamlessly onto the fabric.</p>
                                        <div className="bg-[#2D2A2E] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#CBB49A] opacity-10 rounded-bl-full"></div>
                                            <h3 className="text-2xl font-bold text-[#CBB49A] mb-4 relative z-10">The Magic: Zero Setup Fees</h3>
                                            <p className="text-gray-300 text-lg leading-relaxed relative z-10">Because DTF is essentially a highly-advanced digital printer, it doesn't care if your design has 2 colors or 200 colors. It doesn't care if there are complex gradients or photo-realistic shadows. <strong className="text-white">There are zero screen setup fees.</strong></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 bg-[#F8F7F4] p-10 rounded-3xl">
                                    <div>
                                        <h4 className="text-2xl font-bold text-[#2D2A2E] mb-4 border-l-4 border-[#CBB49A] pl-4">When It Makes Sense:</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">DTF is the ultimate weapon for the <strong>low-volume, high-complexity</strong> brand. If you are running a limited "drop" of 40 pieces featuring a highly detailed, 8-color back graphic, DTF allows you to produce premium quality without the setup penalty.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-[#2D2A2E] mb-4 border-l-4 border-[#CBB49A] pl-4">The "Feel" Factor:</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Historically, digital prints had a reputation for feeling like thick stickers. Modern 2026 DTF technology has completely changed the game. Today's DTF prints are thin, stretch perfectly with the garment, and easily survive rigorous wash testing.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decision Matrix */}
                            <div className="mt-20 mb-16">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">The Quick-Decision Matrix</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">Stop guessing. Pinpoint exactly what your brand needs right now:</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden group hover:border-[#CBB49A] transition-colors duration-500">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-3xl font-black text-[#2D2A2E] mb-8 flex items-center gap-3">
                                            <span className="bg-[#CBB49A] text-white w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md">✓</span>
                                            Go with DTF
                                        </h3>
                                        <ul className="space-y-6 relative z-10">
                                            <li className="flex items-start gap-4">
                                                <div className="min-w-[8px] h-[8px] rounded-full bg-[#CBB49A] mt-2.5"></div>
                                                <p className="text-lg text-[#666666] m-0 leading-relaxed"><strong className="text-[#2D2A2E]">Your Volume is Low:</strong> You are ordering anything under 50-75 units.</p>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <div className="min-w-[8px] h-[8px] rounded-full bg-[#CBB49A] mt-2.5"></div>
                                                <p className="text-lg text-[#666666] m-0 leading-relaxed"><strong className="text-[#2D2A2E]">Your Art is Complex:</strong> Your design features photographs, shading, or 4+ colors.</p>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <div className="min-w-[8px] h-[8px] rounded-full bg-[#CBB49A] mt-2.5"></div>
                                                <p className="text-lg text-[#666666] m-0 leading-relaxed"><strong className="text-[#2D2A2E]">You're Testing a Trend:</strong> You want to drop a quick capsule collection to test the waters without risking heavy upfront capital.</p>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden group hover:border-[#2D2A2E] transition-colors duration-500">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#2D2A2E]/10 to-transparent"></div>
                                        <h3 className="text-3xl font-black text-[#2D2A2E] mb-8 flex items-center gap-3">
                                            <span className="bg-[#2D2A2E] text-white w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md">✓</span>
                                            Go with Screen Printing
                                        </h3>
                                        <ul className="space-y-6 relative z-10">
                                            <li className="flex items-start gap-4">
                                                <div className="min-w-[8px] h-[8px] rounded-full bg-[#2D2A2E] mt-2.5"></div>
                                                <p className="text-lg text-[#666666] m-0 leading-relaxed"><strong className="text-[#2D2A2E]">Your Volume is High:</strong> You are producing 100+ units of the exact same design.</p>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <div className="min-w-[8px] h-[8px] rounded-full bg-[#2D2A2E] mt-2.5"></div>
                                                <p className="text-lg text-[#666666] m-0 leading-relaxed"><strong className="text-[#2D2A2E]">Your Art is Clean & Simple:</strong> You have a minimalist, typography-based design with only 1 to 3 solid colors.</p>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <div className="min-w-[8px] h-[8px] rounded-full bg-[#2D2A2E] mt-2.5"></div>
                                                <p className="text-lg text-[#666666] m-0 leading-relaxed"><strong className="text-[#2D2A2E]">Specific Colors:</strong> You require a mathematically exact Pantone color match.</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />
                            
                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Bottom Line</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">Don't let rigid manufacturers force you into high-volume screen printing when you're just trying to test a complex design.</p>
                                <p className="text-lg text-[#666666] leading-relaxed">At Krazy Kreators, we act as your strategic manufacturing partner. If your volume dictates DTF, we route you to cutting-edge digital presses. When you scale up to 500+ units, we seamlessly transition you to large-scale screen printing. You focus on the art and the brand; we'll handle making sure the math works.</p>
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Ready to Build a World-Class Brand?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Whether you need low-volume highly complex DTF testing, or large-scale precision Screen Printing, Krazy Kreators provides the infrastructure you need to succeed. We handle the complexity of manufacturing, so you can focus on your vision.
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
