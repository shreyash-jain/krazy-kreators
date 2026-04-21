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

const BLOG_ID = 'zero-moq-no-warehouse-launch-clothing-brand-2026';

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function ZeroMoqClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [commentCount, setCommentCount] = useState(initialComments?.length || 0);
    const [comments, setComments] = useState<Array<{ id: string; name: string; email: string; comment: string; date: string; avatar: string; likes: number }>>(() =>
        (initialComments || []).map((c) => ({
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
    const { showToast, ToastContainer } = useToast();

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
        const shareUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast('Link copied to clipboard!', 'success');
        } catch {
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
                    src="/blog/zero_moq_banner.png"
                    alt="Zero MOQ Clothing Brand Launch 2026"
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
                            Business
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">8 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">April 21, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Zero MOQ. No Warehouse.<br className="hidden sm:block" /> No Factory Contract.
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The 2026 Playbook for Launching Your First Clothing Brand
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">

                        {/* Social Interaction Top */}
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

                        {/* Post Details */}
                        <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-12 border border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-[#666666]">Published on April 21, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Intro */}
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                <strong>The Scenario:</strong> You have had the idea for a clothing brand for years. You know your aesthetic. You have a name, a logo, and a clear sense of who you are designing for. What has been holding you back is not a lack of vision. It is the fear of a $15,000 minimum order, a warehouse lease you cannot afford, and a factory contract you do not fully understand.
                            </p>

                            <p className="mb-6">
                                That fear used to be completely reasonable. As recently as five years ago, launching a clothing brand meant either having significant startup capital or having a connection inside the industry. Neither of those things was easy to come by.
                            </p>

                            <p className="mb-12">
                                In 2026, it is a different game. The barriers that once kept independent founders on the sidelines have been systematically dismantled by a new generation of flexible production partners. You no longer need a minimum order to start. You no longer need a warehouse to store inventory. And you absolutely do not need to sign a long-term factory contract before you have sold a single unit. Here is the playbook.
                            </p>

                            {/* Section 1 */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why the Old Rules No Longer Apply</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8">
                                    <div className="order-2 lg:order-1">
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">Traditional manufacturing was built for scale — and scale alone. The economics of running a factory made sense only when orders came in the thousands. Setup costs for machinery, dye lots, and labor had to be spread across the maximum number of units possible.</p>
                                        <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-6 shadow-sm">
                                            <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">The Shift That Changed Everything</h3>
                                            <p className="text-[#666666] m-0 text-lg leading-relaxed">The rise of flexible micro-manufacturing, combined with advances in digital patterning and on-demand dyeing, means that production partners today can profitably run orders of 30, 20, or even a single sample. The infrastructure finally caught up with the demand.</p>
                                        </div>
                                        <p className="text-lg text-[#4A484A] leading-relaxed">The result is that first-time founders in the USA and Europe no longer need to take a financial leap of faith to test whether their brand idea has legs. They can test it with one piece.</p>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px] order-1 lg:order-2">
                                        <Image
                                            src="/blog/zero_moq_studio.png"
                                            alt="Modern fashion startup studio"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 — 3 Step Model */}
                            <div className="mt-20 mb-20 bg-[#F8F7F4] p-10 lg:p-14 rounded-3xl">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-4 pb-4 border-b border-[#EBEBEB]">The Three-Step Model</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">Start small. De-risk everything. Scale only when the market confirms it.</p>

                                {/* Step 1 */}
                                <div className="mb-12">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="min-w-[56px] h-[56px] rounded-full bg-[#CBB49A] flex items-center justify-center font-extrabold text-white text-2xl shadow-md">1</div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-[#2D2A2E] mb-4">Start with a Tech Pack</h3>
                                            <p className="text-lg text-[#666666] leading-relaxed mb-4">Before a single piece of thread is moved, your idea needs to be documented. A tech pack is the blueprint of your garment — a detailed document that specifies every measurable aspect of your design: silhouette, measurements per size, fabric composition, GSM weight, stitch type, print placement, hardware specs, and label requirements.</p>
                                            <p className="text-lg text-[#666666] leading-relaxed">Without a tech pack, every conversation with a manufacturer is vague, every quote is unreliable, and every sample you receive is a gamble. The tech pack is the single document that transforms your creative idea into something a factory can actually build. Think of it as the architectural drawing before the construction begins.</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm ml-0 lg:ml-[72px]">
                                        <p className="text-[#CBB49A] font-bold text-sm uppercase tracking-wider mb-2">Pro Tip</p>
                                        <p className="text-[#2D2A2E] leading-relaxed">At Krazy Kreators, we offer full tech pack development as part of our onboarding process. You do not need prior technical design experience to work with us. We translate your vision, references, and sketches into a factory-ready specification document.</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="mb-12">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="min-w-[56px] h-[56px] rounded-full bg-[#CBB49A] flex items-center justify-center font-extrabold text-white text-2xl shadow-md">2</div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-[#2D2A2E] mb-4">Order One Sample</h3>
                                            <p className="text-lg text-[#666666] leading-relaxed mb-4">Once your tech pack is complete, you order a single sample. That is it. One physical garment, built exactly to your specifications, shipped directly to your door. No minimum quantities. No bulk fabric commitment. No warehouse deposit.</p>
                                            <p className="text-lg text-[#666666] leading-relaxed">You try it on, photograph it, test the drape and the stitch quality, and decide whether it represents your brand the way you envisioned. If something needs adjusting — maybe the collar sits slightly differently than you imagined, or the pocket placement feels off — you give that feedback and we revise. You receive a corrected sample before any commitment to scale is even on the table.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-64 ml-0 lg:ml-[72px]">
                                        <Image
                                            src="/blog/zero_moq_sample.png"
                                            alt="Single garment sample quality check"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="mb-4">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="min-w-[56px] h-[56px] rounded-full bg-[#CBB49A] flex items-center justify-center font-extrabold text-white text-2xl shadow-md">3</div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-[#2D2A2E] mb-4">Move to Production Only When You Are Ready</h3>
                                            <p className="text-lg text-[#666666] leading-relaxed mb-4">Here is where the model fundamentally changes the risk equation. You do not commit to bulk production until you are satisfied with the sample and confident in the demand. Some founders use that approved sample to run pre-orders. Others use it to pitch stockists. Some simply post it on social media to see how people respond before placing a single bulk order.</p>
                                            <p className="text-lg text-[#666666] leading-relaxed">When you are ready to go into production, our flexible minimum order quantity model means you can start with a run as small as 30 to 50 pieces. There is no requirement to commit to 500 units of a design you have not yet proven sells.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What About Warehousing?</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px]">
                                        <Image
                                            src="/blog/zero_moq_delivery.png"
                                            alt="Direct shipping from manufacturer to customer"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">One of the most overlooked cost centers for a new clothing brand is physical storage. A warehouse lease is a fixed commitment that does not care whether you are having a great month or a slow one.</p>
                                        <ul className="space-y-5">
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[10px] h-[10px] rounded-full bg-[#CBB49A] mt-2"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#2D2A2E] mb-1">Ship Direct to You</h4>
                                                    <p className="text-[#666666] m-0 leading-relaxed">For small initial runs, we ship production directly to your home or studio. No warehouse needed when your first drop is 50 pieces.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[10px] h-[10px] rounded-full bg-[#CBB49A] mt-2"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#2D2A2E] mb-1">Use 3PL When You Scale</h4>
                                                    <p className="text-[#666666] m-0 leading-relaxed">As your volumes grow, third-party logistics providers offer flexible, pay-per-unit warehousing and fulfillment — no long-term lease required.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[10px] h-[10px] rounded-full bg-[#CBB49A] mt-2"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#2D2A2E] mb-1">Pre-Order First, Store Later</h4>
                                                    <p className="text-[#666666] m-0 leading-relaxed">Many founders use their approved sample to collect pre-orders before going into production. When you sell before you produce, you never have unsold inventory sitting in a warehouse at all.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 — Factory Contracts */}
                            <div className="mt-20 mb-20 bg-[#2D2A2E] p-10 lg:p-14 rounded-3xl text-white">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-10 pb-4 border-b border-gray-700">No Factory Contract. No Long-Term Lock-In.</h2>
                                <p className="text-xl leading-relaxed text-gray-300 mb-10 font-medium">A factory contract sounds like a formality. In practice, it is often a trap for a brand that is still finding its footing.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 border border-gray-700 bg-gray-800/50 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#CBB49A] mb-4">What Traditional Contracts Demand</h4>
                                        <p className="text-lg text-gray-300 leading-relaxed">Many factories require founders to commit to a minimum number of orders per season, pay non-refundable tooling fees, or lock in exclusivity clauses. Once signed, you are committed — regardless of whether your first collection sold out or sat unsold.</p>
                                    </div>
                                    <div className="p-8 border border-gray-700 bg-gray-800/50 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#CBB49A] mb-4">The Krazy Kreators Model</h4>
                                        <p className="text-lg text-gray-300 leading-relaxed">We work on a project-by-project basis. Your first sample does not obligate you to a bulk order. Your first bulk order does not lock you into a seasonal commitment. You grow at the pace the market dictates, not the pace a contract demands.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5 — Who This Is For */}
                            <div className="mt-20 mb-16">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">Who This Model Is Built For</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">This is not a model for brands that already have $100,000 in startup capital and retail distribution lined up. This is for everyone else.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="w-12 h-12 bg-[#CBB49A]/15 rounded-xl flex items-center justify-center mb-5">
                                            <span className="text-2xl">🎨</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">The Creative With a Vision</h4>
                                        <p className="text-[#666666] leading-relaxed">You have designs ready and a strong sense of your brand identity. What you lack is the capital and industry contacts to bring it to life at scale. This model lets you start with what you have.</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="w-12 h-12 bg-[#CBB49A]/15 rounded-xl flex items-center justify-center mb-5">
                                            <span className="text-2xl">📱</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">The Content Creator Going Physical</h4>
                                        <p className="text-[#666666] leading-relaxed">You have an audience that trusts your taste. Launching a physical product feels risky because you have never manufactured before. A single sample gives you content and proof of concept without the financial exposure.</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="w-12 h-12 bg-[#CBB49A]/15 rounded-xl flex items-center justify-center mb-5">
                                            <span className="text-2xl">🚀</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">The Side-Project Founder</h4>
                                        <p className="text-[#666666] leading-relaxed">You have a full-time job and are building something on the side. You cannot afford to risk your savings on an unproven idea. This model lets you validate the concept before you commit a dollar to bulk production.</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            {/* Bottom Line */}
                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Takeaway</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">The question is no longer whether you can afford to start a clothing brand. The question is whether you are willing to take the first step.</p>
                                <p className="text-lg text-[#666666] leading-relaxed">A tech pack costs a fraction of a bulk order. A sample costs a fraction of a production run. And both together give you something no amount of planning or research can replace — a real, physical product you can hold, photograph, test, and sell. The founders who win in 2026 are not the ones with the largest budgets. They are the ones who started earlier, iterated faster, and scaled only what the market already proved it wanted.</p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Ready to Build Your Brand — Without the Guesswork?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Start with a tech pack. Order one sample. Move to production only when you are ready. No MOQ, no warehouse, no factory contract — just a clear path from idea to finished garment. We have helped founders across the USA and Europe take their first step. Let us help you take yours.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Start Your Brand Today
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction + Comments */}
                        <div className="border-t border-gray-200 pt-8 mb-12">
                            <div className="p-6 bg-[#F8F7F4] rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button onClick={handleLike} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLiked ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200" : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"}`}>
                                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                                            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                                        </button>
                                        <button onClick={handleComment} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                                            <MessageCircle className="w-5 h-5" />
                                            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                                        </button>
                                    </div>
                                    <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300">
                                        <Share2 className="w-5 h-5" />
                                        Share Article
                                    </button>
                                </div>

                                {/* Comments */}
                                <div className="space-y-6 mt-8" data-comments-section>
                                    <form onSubmit={handleSubmitComment} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <h4 className="text-lg font-semibold text-[#2D2A2E] mb-4">Leave a Comment</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <input type="text" name="name" value={newComment.name} onChange={handleInputChange} placeholder="Your Name" className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all" />
                                            <input type="email" name="email" value={newComment.email} onChange={handleInputChange} placeholder="Your Email" className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all" />
                                        </div>
                                        <textarea name="comment" value={newComment.comment} onChange={handleInputChange} placeholder="Share your thoughts..." rows={4} className="w-full px-4 py-3 rounded-lg bg-[#F8F7F4] border-none focus:ring-1 focus:ring-[#CBB49A] outline-none transition-all mb-4 resize-none" />
                                        <div className="flex items-center justify-between">
                                            {showSuccessMessage && <span className="text-green-600 text-sm font-medium">Comment posted successfully!</span>}
                                            <button type="submit" disabled={isSubmitting} className="ml-auto px-6 py-2.5 bg-[#CBB49A] text-white font-medium rounded-full hover:bg-[#b7a078] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                                                {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Post Comment</span><ArrowRight className="w-4 h-4" /></>}
                                            </button>
                                        </div>
                                    </form>

                                    {comments.length > 0 ? (
                                        <>
                                            {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                                                <div key={comment.id} id={`comment-${comment.id}`} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                                    <div className="flex items-start gap-3 sm:gap-4">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">{comment.avatar}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="hidden sm:flex items-center gap-3 mb-3">
                                                                <h5 className="font-semibold text-[#2D2A2E] text-lg">{comment.name}</h5>
                                                                <span className="text-sm text-[#666666]">•</span>
                                                                <span className="text-sm text-[#666666]">{comment.date}</span>
                                                            </div>
                                                            <div className="bg-[#F8F7F4] rounded-lg p-3 sm:p-4">
                                                                <p className="text-[#2D2A2E] leading-relaxed text-sm sm:text-base break-words mb-3">{comment.comment}</p>
                                                                <button onClick={() => handleCommentLike(comment.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${likedComments.has(comment.id) ? "bg-[#CBB49A]/10 text-[#CBB49A]" : "bg-gray-100 text-gray-600 hover:bg-[#CBB49A]/10 hover:text-[#CBB49A]"}`}>
                                                                    <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? 'fill-[#CBB49A]' : ''}`} />
                                                                    {comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {comments.length > 3 && (
                                                <button onClick={() => setShowAllComments(!showAllComments)} className="w-full py-3 text-center text-[#CBB49A] font-medium hover:bg-[#F8F7F4] rounded-lg transition-colors border border-[#CBB49A]/20">
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
