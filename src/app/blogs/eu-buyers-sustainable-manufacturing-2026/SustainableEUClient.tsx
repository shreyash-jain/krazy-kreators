/* eslint-disable */
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

const BLOG_ID = 'eu-buyers-sustainable-manufacturing-2026';

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function SustainableEUClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
                    src="/blog/eu_sustainability_banner.png"
                    alt="Sustainable Manufacturing EU Regulations 2026"
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
                            Sustainability
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">8 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">April 25, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Your EU Buyers Are Asking About Your Supply Chain
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        What Every Fashion Startup Needs to Know About Sustainable Manufacturing in 2026
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
                                <p className="text-sm text-[#666666]">Published on April 25, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Intro */}
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                If you are planning to sell into the European market, things are changing faster than ever. It used to be that retailers only cared about your wholesale price and whether your designs would sell. Now? They are asking for your supply chain documentation before they even agree to stock your brand.
                            </p>

                            <p className="mb-6">
                                Sustainability is no longer just a marketing buzzword you can slap on a label. It has become a concrete, measurable, and highly regulated requirement. And if you are a Direct-to-Consumer (D2C) founder currently sourcing your garments, you are about to hit a major compliance deadline. 
                            </p>

                            <p className="mb-12">
                                The EU Digital Product Passport regulation, which mandates full textile traceability, rolls out in 2027. That means right now, in 2026, is the exact moment you need to get your manufacturing processes in order. Let us break down what this actually means for your day-to-day operations and how you can stay ahead of the curve.
                            </p>

                            {/* Section 1 */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Practical Reality of Sustainable Manufacturing</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">When you hear &quot;sustainable manufacturing,&quot; it is easy to picture something vague and unachievable. But at a practical level for startup founders, it boils down to three very tangible pillars.</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border-t-4 border-[#CBB49A] shadow-sm">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3">1. Material Choices</h3>
                                        <p className="text-[#666666] leading-relaxed text-base">It starts with what goes into your garments. Are your fabrics grown with minimal water impact? Are they recycled? Can they be traced back to the farm?</p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border-t-4 border-[#CBB49A] shadow-sm">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3">2. Process Efficiency</h3>
                                        <p className="text-[#666666] leading-relaxed text-base">How are those materials handled? This involves looking at the dyes being used (are they low-impact?), water management systems in the factory, and energy sources.</p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border-t-4 border-[#CBB49A] shadow-sm">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3">3. Labor Practices</h3>
                                        <p className="text-[#666666] leading-relaxed text-base">Sustainability includes the people making the clothes. Fair wages, safe working environments, and reasonable hours are foundational, not optional.</p>
                                    </div>
                                </div>
                                <p className="text-lg text-[#4A484A] leading-relaxed">You do not have to be perfect from day one, but you do have to be transparent. That transparency is exactly what the new EU regulations are built around.</p>
                            </div>

                            {/* Section 2 */}
                            <div className="mt-20 mb-20 bg-[#2D2A2E] p-10 lg:p-14 rounded-3xl text-white">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 pb-4 border-b border-gray-700">What the EU Digital Product Passport Means for You</h2>
                                <p className="text-xl text-gray-300 mb-8 font-medium">Starting in 2027, the EU is implementing the Digital Product Passport (DPP) for textiles. If you want to sell into Europe, this matters.</p>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="order-2 lg:order-1">
                                        <p className="text-lg text-gray-300 leading-relaxed mb-6">Think of the DPP as a digital birth certificate for your clothing. It will require brands to attach a scannable tag (like a QR code or RFID) to their garments. When scanned, it must reveal the complete journey of that product.</p>
                                        <ul className="space-y-4 mb-6">
                                            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#CBB49A] rounded-full"></div><span className="text-gray-300">Where the raw materials were sourced</span></li>
                                            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#CBB49A] rounded-full"></div><span className="text-gray-300">Who manufactured it and under what conditions</span></li>
                                            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#CBB49A] rounded-full"></div><span className="text-gray-300">The environmental impact of production</span></li>
                                            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#CBB49A] rounded-full"></div><span className="text-gray-300">Instructions for recycling or end-of-life disposal</span></li>
                                        </ul>
                                        <p className="text-lg text-gray-300 leading-relaxed">For founders sourcing from regions like India, this actually presents a massive opportunity. The best Indian manufacturers are already deeply integrated with traceability software and certified organic supply chains. By partnering with a factory that can provide this data easily, you automatically bypass a major hurdle that will trip up thousands of unprepared brands next year.</p>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-gray-700 relative h-80 lg:h-full min-h-[400px] order-1 lg:order-2">
                                        <Image
                                            src="/blog/eu_sustainability_fabric.png"
                                            alt="Digital Product Passport fabric concept"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The 5 Exact Questions to Ask Your Manufacturer</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">Do not wait for buyers to ask you these questions. You need to ask your manufacturing partner these exact questions today.</p>

                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-200 p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">1. &quot;Can you provide transaction certificates for organic materials?&quot;</h3>
                                        <p className="text-[#666666] leading-relaxed">If a factory claims they use organic cotton (like GOTS certified), they must be able to provide a transaction certificate for your specific batch of fabric. Without it, the claim is legally meaningless in the EU.</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">2. &quot;How do you handle dye house wastewater?&quot;</h3>
                                        <p className="text-[#666666] leading-relaxed">Dyeing is historically the most toxic part of fashion. You want a partner who uses Zero Liquid Discharge (ZLD) systems or properly treats their effluent water before it leaves the facility.</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">3. &quot;What social compliance audits do you currently hold?&quot;</h3>
                                        <p className="text-[#666666] leading-relaxed">Look for internationally recognized certifications like SEDEX (SMETA), SA8000, or WRAP. These prove that third-party auditors have verified safe working conditions and fair labor practices.</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">4. &quot;How is your fabric waste managed?&quot;</h3>
                                        <p className="text-[#666666] leading-relaxed">The cutting room floor generates massive waste. Ask if they have partnerships to recycle offcuts or if they end up in a landfill.</p>
                                    </div>
                                    <div className="bg-white border border-gray-200 p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">5. &quot;Are you prepared for digital traceability requirements?&quot;</h3>
                                        <p className="text-[#666666] leading-relaxed">A modern factory should not be confused by this question. They should already be mapping their Tier 2 and Tier 3 suppliers (yarn spinners and farmers) to prepare for the 2027 DPP rollout.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 */}
                            <div className="mt-20 mb-16 bg-[#F8F7F4] p-10 lg:p-14 rounded-3xl border border-[#EBEBEB]">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">Fabric Choices That Make an Immediate Impact</h2>
                                <p className="text-xl text-[#666666] mb-8 font-medium">Changing your fabric is the fastest way to improve your brand&apos;s environmental footprint. Here are the materials buyers love to see:</p>
                                
                                <ul className="space-y-6">
                                    <li className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="min-w-[60px] h-[60px] bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">🌿</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Organic Cotton (GOTS Certified)</h4>
                                            <p className="text-[#666666] leading-relaxed">Grown without synthetic pesticides or fertilizers. It uses significantly less water than conventional cotton and keeps soil healthy. It is the gold standard for premium streetwear.</p>
                                        </div>
                                    </li>
                                    <li className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="min-w-[60px] h-[60px] bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">♻️</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Recycled Polyester (rPET)</h4>
                                            <p className="text-[#666666] leading-relaxed">If you need synthetics for activewear or outerwear, use rPET. It diverts plastic bottles from oceans and landfills and requires less energy to produce than virgin polyester.</p>
                                        </div>
                                    </li>
                                    <li className="flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="min-w-[60px] h-[60px] bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100">🎋</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Hemp and Tencel™ Lyocell</h4>
                                            <p className="text-[#666666] leading-relaxed">Hemp is naturally pest-resistant and requires very little water. Tencel (derived from sustainably sourced wood pulp) is processed in a closed-loop system where 99% of the water and solvents are reused.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            {/* Bottom Line */}
                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Bottom Line</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">The rules of the game are shifting, and ignorance is no longer an excuse.</p>
                                <p className="text-lg text-[#666666] leading-relaxed">EU buyers are scrutinizing supply chains because their governments are forcing them to. By 2027, traceability will be the baseline expectation, not a premium feature. If you start asking the right questions and partnering with compliant manufacturers now, you will position your brand as a secure, forward-thinking partner for global retailers. Get your data straight, choose your materials wisely, and you will turn compliance from a headache into a competitive advantage.</p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Need a Compliant Manufacturing Partner?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    At Krazy Kreators, we connect brands with fully vetted, certified manufacturers in India who are already prepared for strict global compliance standards. Let us help you build a transparent, scalable supply chain.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Discuss Your Supply Chain
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
