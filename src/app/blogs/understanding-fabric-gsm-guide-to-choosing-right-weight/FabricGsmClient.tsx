"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Shirt } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'understanding-fabric-gsm-guide-to-choosing-right-weight';

type FabricGsmClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function FabricGsmClient({ initialLikeCount, initialComments }: FabricGsmClientProps) {
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
                    src="/blog/understanding-fabric-gsm-banner.png"
                    alt="Heavy GSM Fabric Texture"
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
                            <Shirt className="w-4 h-4" />
                            Manufacturing & Material
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Understanding Fabric GSM: The Guide to Weight
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            Drape, durability, and feel all come down to one metric: GSM. Learn what it is, why it matters, and how to pick the exact right weight for your next collection.
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
                                <div className="flex flex-row items-center gap-2">
                                    <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-bold">
                                        KK
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-[#2D2A2E]">Krazy Kreators Team</p>
                                        <p className="text-[#666666]">March 26, 2026</p>
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
                        <div className="prose prose-lg max-w-none">
                            <div className="mb-12">
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    &quot;What is a good GSM for a hoodie?&quot; It&apos;s arguably the most common question we get from emerging designers.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    You have a vision. You know exactly how you want your garment to hang on the body. You know if you want it to feel substantial and structured, or light and breezy. But communicating that vision to a manufacturer requires speaking their language. And in the world of textiles, weight is spoken in GSM.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    GSM stands for Grams per Square Meter. It&apos;s the metric measurement of the weight of a fabric. Literally, if you cut a one-meter by one-meter square of the fabric and weighed it on a scale, that number is the GSM.
                                </p>
                            </div>

                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Lightweight Fabrics (100 - 150 GSM)</h2>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        Lightweight fabrics are exactly what they sound like—airy, thin, and highly breathable. They have a very fluid drape, meaning they cling more closely to the body.
                                    </p>
                                    <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                                        <li><strong>The Vibe:</strong> An ultra-thin, almost sheer vintage band tee, or a highly breathable workout shirt. It&apos;s comfortable but offers very little structural shape.</li>
                                        <li><strong>Best Uses:</strong> Base layers, undershirts, summer flowy garments, and athletic/performance tops.</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/gsm_digital_scale.png" alt="Lightweight fabric on a digital scale" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="order-2 md:order-1">
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/gsm-weight-comparison.png" alt="Comparison of midweight t-shirts" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                </div>
                                <div className="order-1 md:order-2">
                                    <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Midweight Fabrics (160 - 200 GSM)</h2>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        This is the undisputed industry standard. If you close your eyes and picture a regular, everyday t-shirt that you buy from a typical retail store, you are picturing a midweight fabric (usually hovering right around the 160-180 GSM mark).
                                    </p>
                                    <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                                        <li><strong>The Vibe:</strong> It strikes a perfect balance. It is opaque enough not to be see-through, but light enough to be worn comfortably indoors year-round.</li>
                                        <li><strong>Versatility:</strong> A 180 GSM cotton jersey is incredibly versatile and takes standard screen printing flawlessly without puckering.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Heavyweight Fabrics (210 - 450+ GSM)</h2>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        Now we are entering premium territory. Heavyweight cotton holds its own structural shape independent of the wearer&apos;s body. When you see a &quot;boxy&quot; streetwear tee that stands away from the body in sharp lines rather than clinging to it, you are looking at heavy GSM. This is currently the most requested weight class at Krazy Kreators.
                                    </p>
                                    <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                                        <li><strong>Premium Tees:</strong> 240-280 GSM is considered the absolute sweet spot for a premium, heavy tee. It feels substantial and expensive.</li>
                                        <li><strong>Heavy Hoodies:</strong> 350-450 GSM French Terry or dense brushed fleece. The garment becomes thick, incredibly warm, and features a rigid, dramatic silhouette.</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/heavyweight-hoodie-detail.png" alt="Close up of heavyweight premium hoodie fabric" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="order-2 md:order-1">
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/gsm_drape_test.png" alt="How GSM affects Drape" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                </div>
                                <div className="order-1 md:order-2">
                                    <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Why Print Quality Depends on GSM</h2>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        GSM isn&apos;t just about how a garment feels; it entirely dictates what you can do to it. If you try to apply a thick, high-density puff print graphic to a lightweight 130 GSM tee, the weight of the ink will cause the fabric to buckle, pucker, and warp.
                                    </p>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        Heavy fabrics (240+ GSM) have the structural tension necessary to support dense embroidery and thick ink deposits without losing their shape.
                                    </p>
                                </div>
                            </div>

                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Don&apos;t Guess Your GSM.</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    Whether you need a breathable 160 GSM activewear tee or a rigid 450 GSM heavyweight hoodie, we have the fabric expertise to help you build exactly what you envision.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg mt-4 font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    Start Manufacturing Today
                                </Button>
                            </div>
                        </div>

                         {/* Post-Content Social Interaction */}
                         <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did this GSM guide help you?</h4>
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
                                            Share Guide
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
                                                placeholder="Your Name"
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
                                                placeholder="your@email.com"
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
                                            placeholder="What's your preferred GSM for hoodies?"
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">No comments yet. Have a question about GSM? Ask below!</p>
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

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

