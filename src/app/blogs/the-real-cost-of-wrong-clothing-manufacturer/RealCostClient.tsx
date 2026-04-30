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

const BLOG_ID = 'the-real-cost-of-wrong-clothing-manufacturer';

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function RealCostClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
                    src="https://res.cloudinary.com/dn9snfizy/image/upload/blog/defective_bulk.png"
                    alt="Defective Bulk Order Frustration"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">April 30, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl drop-shadow-lg mb-6 tracking-tight">
                        The Real Cost of Choosing the Wrong Clothing Manufacturer
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-2xl drop-shadow-md leading-relaxed">
                        Why the cheapest quote is often your most expensive mistake.
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
                                <p className="text-sm text-[#666666]">Published on April 30, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Intro */}
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                It happens to almost every founder. You get an incredibly low quote from an overseas factory. The communication seems decent at first, and the promise of high margins is intoxicating. You sign off, send the deposit, and wait. But then the reality sets in.
                            </p>

                            <p className="mb-6">
                                The excitement of launching your clothing brand quickly turns into a logistical nightmare. The samples arrive and look absolutely nothing like your tech pack. The bulk order is delayed by months, and when it finally arrives, half the units are defective. And the worst part? When you try to resolve the issue, your emails bounce, and the WhatsApp messages are left on read.
                            </p>

                            <p className="mb-12">
                                If you have been burned by an unreliable manufacturer, you know that the "cheapest" option is often the most expensive mistake you can make. The real cost of a bad manufacturing partner goes far beyond the invoice. It costs you time, momentum, and ultimately, your brand's reputation.
                            </p>

                            {/* Section 1 */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">1. The Trap of Wrong Samples</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8">
                                    <div className="order-2 lg:order-1">
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">You spend weeks perfecting your designs, sourcing the right fabric references, and detailing every measurement in your tech pack. You pay the sampling fee and wait four weeks. When the package finally arrives, it is a disaster.</p>
                                        <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-6 shadow-sm">
                                            <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">The Hidden Time Tax</h3>
                                            <p className="text-[#666666] m-0 text-lg leading-relaxed">A wrong sample does not just cost you the $150 sampling fee. It costs you another month of waiting for a revision. If the second sample is also wrong, your entire launch calendar is derailed. You miss seasonal trends and pre-sale windows.</p>
                                        </div>
                                        <p className="text-lg text-[#4A484A] leading-relaxed">Bad manufacturers use a "spray and pray" approach to sampling. They do not read the tech pack; they just rush a generic garment with your logo on it. At Krazy Kreators, we assign a dedicated technical designer to review your tech pack before a single piece of fabric is cut, ensuring the first sample is as close to perfection as possible.</p>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px] order-1 lg:order-2">
                                        <Image
                                            src="https://res.cloudinary.com/dn9snfizy/image/upload/blog/wrong_samples.png"
                                            alt="Stressed founder looking at defective samples"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="mt-20 mb-20 bg-[#F8F7F4] p-10 lg:p-14 rounded-3xl">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-4 pb-4 border-b border-[#EBEBEB]">2. Defective Bulk Orders Arriving Late</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">The sample was acceptable, so you paid the 50% deposit for the bulk order. Then, radio silence.</p>
                                <p className="text-lg text-[#4A484A] leading-relaxed mb-6">
                                    When the bulk order finally arrives—often weeks behind schedule—you open the boxes to find crooked seams, inconsistent sizing, and low-quality zippers that snap on the first pull. Because you already paid the remaining 50% balance before shipping, you have absolutely zero leverage to get a refund or a remake.
                                </p>
                                <p className="text-lg text-[#4A484A] leading-relaxed mb-6">
                                    This is a catastrophic blow to a young brand. You either have to swallow your pride and ship defective products to your early customers (ruining your brand reputation immediately), or you absorb a massive financial loss and throw the inventory away.
                                </p>
                                <p className="text-lg text-[#4A484A] leading-relaxed font-bold">
                                    How to avoid this: Demand a robust Quality Control (QC) process. Krazy Kreators implements strict AQL (Acceptable Quality Limit) inspections before any bulk order leaves the facility, and we provide detailed photos and videos of the production line.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">3. The Nightmare of "No One to Call"</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px]">
                                        <Image
                                            src="https://res.cloudinary.com/dn9snfizy/image/upload/blog/no_one_to_call.png"
                                            alt="Frustrated founder with no responsive contact"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">When things go wrong in manufacturing—and they will—you need a partner who answers the phone. A faceless factory halfway across the world is not a partner; they are a vendor who disappears the moment there is a problem.</p>
                                        <ul className="space-y-5">
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[10px] h-[10px] rounded-full bg-[#CBB49A] mt-2"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#2D2A2E] mb-1">The Communication Gap</h4>
                                                    <p className="text-[#666666] m-0 leading-relaxed">Time zone differences and language barriers turn simple questions into days of confusion. Misinterpreted instructions lead to thousands of dollars in ruined garments.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[10px] h-[10px] rounded-full bg-[#CBB49A] mt-2"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#2D2A2E] mb-1">The Dedicated Account Manager</h4>
                                                    <p className="text-[#666666] m-0 leading-relaxed">We solve this by giving every brand a dedicated English-speaking project manager. They act as your eyes and ears on the factory floor, providing weekly updates and answering your messages promptly.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 */}
                            <div className="mt-20 mb-20 bg-[#2D2A2E] p-10 lg:p-14 rounded-3xl text-white">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-10 pb-4 border-b border-gray-700">4. Hidden Charges After Commitment</h2>
                                <p className="text-xl leading-relaxed text-gray-300 mb-10 font-medium">A common bait-and-switch tactic is offering an unbelievably low per-unit cost, only to nickel-and-dime you once you are locked in.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 border border-gray-700 bg-gray-800/50 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#CBB49A] mb-4">The "Extras"</h4>
                                        <p className="text-lg text-gray-300 leading-relaxed">Suddenly, you are charged extra for custom neck labels, polybags, specific dye colors, and "handling fees" that were never discussed during the quoting phase.</p>
                                    </div>
                                    <div className="p-8 border border-gray-700 bg-gray-800/50 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#CBB49A] mb-4">Transparent Pricing</h4>
                                        <p className="text-lg text-gray-300 leading-relaxed">A trustworthy manufacturer provides an all-inclusive Landed Cost. With Krazy Kreators, the price we quote covers the garment, the trims, the packaging, and the shipping. No surprises.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5 - The Solution */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The 5 Checks Before Choosing a Manufacturer</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div>
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">If you are currently evaluating manufacturers, run them through this 5-point checklist before sending a single dollar:</p>
                                        <ol className="list-decimal pl-6 space-y-4 text-lg text-[#666666] font-medium">
                                            <li><strong className="text-[#2D2A2E]">Do they ask questions about your tech pack?</strong> A good factory clarifies details. A bad factory says "yes" to everything.</li>
                                            <li><strong className="text-[#2D2A2E]">Do they offer a dedicated point of contact?</strong> If you are talking to a generic info@ email address, run.</li>
                                            <li><strong className="text-[#2D2A2E]">Are their pricing terms completely transparent?</strong> Ensure packaging and trims are included in the quote.</li>
                                            <li><strong className="text-[#2D2A2E]">What is their defect policy?</strong> Do they remake defective units for free, or is it "buyer beware"?</li>
                                            <li><strong className="text-[#2D2A2E]">Do they have a flexible MOQ?</strong> Good partners want to test the market with you, not force you into a 500-unit minimum.</li>
                                        </ol>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px]">
                                        <Image
                                            src="https://res.cloudinary.com/dn9snfizy/image/upload/blog/krazy_solution.png"
                                            alt="Confident brand owner with perfect garment sample"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            {/* Bottom Line */}
                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Stop Gambling With Your Brand's Future</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">Building a clothing brand is hard enough without having to fight your own supply chain.</p>
                                <p className="text-lg text-[#666666] leading-relaxed">You deserve a manufacturing partner who cares about your product as much as you do. One who delivers accurate samples, sticks to deadlines, maintains strict quality control, and is always just a message away. It is time to stop settling for unreliability.</p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Looking for a Partner You Can Actually Trust?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Krazy Kreators offers transparent pricing, dedicated account managers, zero MOQ flexibility, and strict quality control. Let's build your brand the right way, without the headaches.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Start Your Production
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
