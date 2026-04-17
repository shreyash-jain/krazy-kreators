"use client";
/* eslint-disable react/no-unescaped-entities, @typescript-eslint/no-unused-vars */

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

const BLOG_ID = 'essential-trimmings-quality';

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function EssentialTrimmingsClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
    const { showToast, ToastContainer } = useToast();

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
                    src="/blog/essential_trimmings_banner.png"
                    alt="Essential Trimmings Banner"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">6 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">April 16, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Essential Trimmings
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        How Zippers, Buttons, and Drawstrings Define Quality
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">
                        {/* Social Interaction Container */}
                        <div className="mb-0">
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
                                <p className="text-sm text-[#666666]">Hosted on April 16, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                <strong>The Scenario:</strong> You've spent months sourcing the perfect 400 GSM French terry cotton. Your custom pigment dye looks flawless. You launch your capsule collection at a premium price point, and the initial sales are great. But a few weeks later, the emails start trickling in. A zipper snagged and broke. A drawstring tip frayed in the wash. A snap button popped off.
                            </p>
                            
                            <p className="mb-6">
                                Suddenly, your premium $150 hoodie feels like a cheap knock-off in the eyes of your customer.
                            </p>
                            <p className="mb-12">
                                When building a high-end clothing brand, it’s easy to obsess over fabric weights, modern silhouettes, and striking graphic prints. But there is a secret that top-tier designer labels know that emerging brands often miss: <strong>Quality isn't just felt in the fabric; it’s interacted with through the hardware.</strong> Zippers, buttons, and drawstrings are the tactile touchpoints of your garment. They are the mechanical pieces your customer actually <em>uses</em> every single day. Here is why mastering your trimmings is the ultimate flex for scaling from “basic” streetwear to “luxury” status.
                            </p>

                            {/* Section 1 */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Psychology of Hardware</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8">
                                    <div className="order-2 lg:order-1">
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">Think about closing the door of a luxury SUV versus an economy sedan. That heavy, solid "thud" instantly communicates safety and quality without a single word. Apparel hardware works the exact same way.</p>
                                        <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-6 shadow-sm">
                                            <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">The Tactile Judgment</h3>
                                            <p className="text-[#666666] m-0 text-lg leading-relaxed">When a customer pulls a zipper or snaps a jacket shut, they are instinctively judging the garment's durability. Flimsy, lightweight plastic hardware screams "fast fashion," while heavy, smooth, custom-branded metal whispers "designer."</p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px] order-1 lg:order-2">
                                        <Image
                                            src="/blog/premium_zipper_hardware.png"
                                            alt="Premium Zipper Detail"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="mt-20 mb-20 bg-[#F8F7F4] p-10 lg:p-14 rounded-3xl">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-[#EBEBEB]">Zippers: The Undisputed Hero of Trimmings</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-10 font-medium">The zipper is arguably the most hard-working component on any jacket or hoodie. It is also the very first thing to fail on a cheaply made garment.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">The YKK Standard</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">There is a reason YKK zippers dominate the premium market. Their heavy-duty zippers literally self-lubricate the more you use them, ensuring a buttery-smooth glide for years.</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Two-Way Functionality</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Incorporate a two-way zipper on outerwear. It allows the wearer to adjust the hem for styling and comfort when sitting down—a detail fashion-conscious consumers actively look for.</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Custom Pulls</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Casting a custom rectangular or ring pull with your brand’s logo deeply etched into the metal elevates the entire piece from a generic blank to a bespoke, intentional design.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Drawstrings & Aglets: Finishing the Frayed Edges</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px]">
                                        <Image
                                            src="/blog/custom_drawstring_aglet.png"
                                            alt="Custom Matte-Black Drawstring Aglet"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">A beautifully cut hoodie can be entirely ruined by a cheap, loosely woven cotton cord that pulls like a flimsy shoelace. Worse? A raw knot at the end that unravels in the wash.</p>
                                        <ul className="space-y-6">
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[40px] h-[40px] rounded-full bg-[#CBB49A] flex items-center justify-center font-bold text-white shadow-md">1</div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">The Cord</h4>
                                                    <p className="text-lg text-[#666666] m-0 leading-relaxed">Elevate your hoods and sweatpants by exploring dense, tubular cotton, waxed cords, or thick elastic toggles that hold their shape and density over time.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[40px] h-[40px] rounded-full bg-[#CBB49A] flex items-center justify-center font-bold text-white shadow-md">2</div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">The Aglet</h4>
                                                    <p className="text-lg text-[#666666] m-0 leading-relaxed">Upgrading to a heavy metal tip, or a sleek custom silicone-dipped end, adds a subtle yet substantial weight to the hood. It proves you considered every millimeter.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 */}
                            <div className="mt-20 mb-20 bg-[#2D2A2E] p-10 lg:p-14 rounded-3xl text-white">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-10 pb-4 border-b border-gray-700">Buttons & Snaps: The Tactical Touch</h2>
                                <p className="text-xl leading-relaxed text-gray-300 mb-10 font-medium">If your upcoming collection includes chore coats, flannels, or heavy denim, your closure system dictates the garment's lifespan.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 border border-gray-700 bg-gray-800/50 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#CBB49A] mb-4">Ditch the Generic Plastic</h4>
                                        <p className="text-lg text-gray-300 leading-relaxed">Standard plastic buttons are brittle and visually flat. Upgrading to natural horn, corozo nut, or high-density engraved enamel buttons adds instant depth, texture, and character to a piece.</p>
                                    </div>
                                    <div className="p-8 border border-gray-700 bg-gray-800/50 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#CBB49A] mb-4">Premium Heavy-Duty Snaps</h4>
                                        <p className="text-lg text-gray-300 leading-relaxed">For modern streetwear and workwear, the snap button is king. Incorporating heavy-duty brass snaps provides a satisfying, secure "click" that feels virtually indestructible to the touch.</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />
                            
                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Bottom Line</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">In the hyper-competitive world of fashion apparel, the margin between a good brand and a great brand lives securely in the micro-details.</p>
                                <p className="text-lg text-[#666666] leading-relaxed">Anyone can buy a heavy blank hoodie and slap a cool screen print on it. But curating heavy metal zippers, custom-dipped cords, and branded hardware shows a relentless level of intentionality that commands respect—and a luxury price tag. Don't let a 30-cent plastic zipper ruin a beautiful $150 garment. When you invest in the hardware, the quality speaks for itself.</p>
                            </div>
                        </div>

                        {/* Conclusion */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Ready to Build a World-Class Brand?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    From sourcing custom-branded YKK zippers to casting high-density snap buttons, Krazy Kreators provides the premium component sourcing you need to scale. Stop settling for basic blanks. Find out how we can help upgrade your next collection.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Source Your Custom Hardware
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
