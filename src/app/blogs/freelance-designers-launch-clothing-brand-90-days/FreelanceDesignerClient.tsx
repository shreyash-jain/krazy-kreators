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

const BLOG_ID = 'freelance-designers-launch-clothing-brand-90-days';

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function FreelanceDesignerClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
                    src="https://res.cloudinary.com/dn9snfizy/image/upload/v1777389258/blog/z3bgaz5se6abvjlg3eva.jpg"
                    alt="Freelance Designer Launching Clothing Brand"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">9 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">April 28, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        You Design for Other People's Brands Every Day.<br className="hidden sm:block" /> Here Is How to Launch Your Own in 90 Days.
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        A practical roadmap for freelance designers to transition into brand owners.
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
                                <p className="text-sm text-[#666666]">Published on April 28, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Intro */}
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                If you are a freelance fashion designer, a graphic artist creating merch graphics, or a creative director working on Upwork, you know this feeling: You wrap up a brilliant project, hand over the files, and watch your client turn your vision into a highly profitable, fully realized brand. Meanwhile, you move on to the next gig. 
                            </p>

                            <p className="mb-6">
                                You have the aesthetic eye. You have the technical skills. You know exactly what a premium garment should look and feel like. Yet, the thought of launching your own label feels paralyzing. The reason? You believe manufacturing is too complex, requires massive upfront capital, or demands long-term factory contracts that you cannot commit to.
                            </p>

                            <p className="mb-12">
                                It is time to rethink that assumption. The landscape has changed dramatically. What used to require significant funding and industry connections can now be accomplished through smart partnerships and flexible production models. In 90 days, you can transition from designing for others to holding the first physical garment of your own label. Here is the step-by-step roadmap to make it happen using a Zero MOQ manufacturing partner.
                            </p>

                            {/* Section 1 */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The 90-Day Blueprint to Launch</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-8">
                                    <div className="order-2 lg:order-1">
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">The secret to a successful launch is not spending months overthinking the business plan. It is moving decisively through a proven, low-risk process. By leveraging your existing design skills and combining them with a flexible manufacturing partner, you eliminate the traditional barriers to entry.</p>
                                        <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-6 shadow-sm">
                                            <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">Day 1 to 30: Documenting the Vision</h3>
                                            <p className="text-[#666666] m-0 text-lg leading-relaxed">Stop keeping your ideas in your head or in a loose sketch folder. The first 30 days are about creating a concrete, factory-ready blueprint. You already know how to design; now you need to translate that design into a language the factory understands.</p>
                                        </div>
                                        <p className="text-lg text-[#4A484A] leading-relaxed">This means converting your existing design work into a detailed tech pack. A tech pack covers every specification — from the silhouette and measurements to fabric weight, stitch types, hardware details, and label requirements. If you are a graphic designer who has never built a technical apparel document, do not worry. At Krazy Kreators, we assist in developing your tech pack so it is perfectly optimized for production.</p>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px] order-1 lg:order-2">
                                        <Image
                                            src="https://res.cloudinary.com/dn9snfizy/image/upload/v1777389260/blog/kjfnolpjka788wheordp.jpg"
                                            alt="Freelance graphic designer modern desk setup"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 — 3 Step Model */}
                            <div className="mt-20 mb-20 bg-[#F8F7F4] p-10 lg:p-14 rounded-3xl">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-4 pb-4 border-b border-[#EBEBEB]">Day 30 to 60: The Physical Proof</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">This is where the magic happens. Moving from a screen to a tangible garment.</p>

                                {/* Step 1 */}
                                <div className="mb-12">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="min-w-[56px] h-[56px] rounded-full bg-[#CBB49A] flex items-center justify-center font-extrabold text-white text-2xl shadow-md">1</div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-[#2D2A2E] mb-4">Ordering Your First Sample</h3>
                                            <p className="text-lg text-[#666666] leading-relaxed mb-4">With your tech pack finalized, you order a single sample. That is right — one garment. Traditional manufacturing often required massive bulk commitments before you could even test a product. With a Zero MOQ partner, you can mitigate risk entirely by ordering just what you need to validate your design.</p>
                                            <p className="text-lg text-[#666666] leading-relaxed">When the sample arrives, you test it thoroughly. How does the fabric drape? Are the seams clean? Does the hardware feel premium? This step ensures the reality matches your vision without tying up thousands of dollars in unproven inventory.</p>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-64 ml-0 lg:ml-[72px]">
                                        <Image
                                            src="https://res.cloudinary.com/dn9snfizy/image/upload/v1777389261/blog/ocpbdszn0gsp00pyk351.jpg"
                                            alt="Fashion tech pack document next to garment sample"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="mb-4">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="min-w-[56px] h-[56px] rounded-full bg-[#CBB49A] flex items-center justify-center font-extrabold text-white text-2xl shadow-md">2</div>
                                        <div>
                                            <h3 className="text-3xl font-bold text-[#2D2A2E] mb-4">Iterating Without Penalty</h3>
                                            <p className="text-lg text-[#666666] leading-relaxed mb-4">Design is rarely perfect on the first try. If the collar sits too high or the sleeve length needs adjusting, you provide that feedback. We make the necessary revisions and send a corrected sample. You have full creative control, iterating until the garment is flawless, all without the pressure of a looming bulk order.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Day 60 to 90: Validating and Scaling</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px]">
                                        <Image
                                            src="https://res.cloudinary.com/dn9snfizy/image/upload/v1777389262/blog/p9piq7ifl3inlcajbmmo.jpg"
                                            alt="Minimal curated clothing rack showcasing new brand"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">Once you have an approved sample in your hands, the dynamic changes. You are no longer just a designer with an idea; you are a brand owner with a product.</p>
                                        <ul className="space-y-5">
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[10px] h-[10px] rounded-full bg-[#CBB49A] mt-2"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#2D2A2E] mb-1">Test with Real Buyers</h4>
                                                    <p className="text-[#666666] m-0 leading-relaxed">Use the physical sample for photoshoots, run pre-orders on your social media, or pitch it to boutique stockists. Prove the demand before producing the supply.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-4 bg-[#F8F7F4] p-6 rounded-2xl">
                                                <div className="min-w-[10px] h-[10px] rounded-full bg-[#CBB49A] mt-2"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#2D2A2E] mb-1">Scale When Ready</h4>
                                                    <p className="text-[#666666] m-0 leading-relaxed">When the market responds, you move into production. Our flexible minimum order model means you can start with a smart run of 30 to 50 pieces, rather than over-leveraging yourself.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 — The Creative Advantage */}
                            <div className="mt-20 mb-20 bg-[#2D2A2E] p-10 lg:p-14 rounded-3xl text-white">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-10 pb-4 border-b border-gray-700">Your Unfair Advantage</h2>
                                <p className="text-xl leading-relaxed text-gray-300 mb-10 font-medium">As a designer, you already possess the most difficult skills required to build a brand.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 border border-gray-700 bg-gray-800/50 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#CBB49A] mb-4">You Control the Aesthetic</h4>
                                        <p className="text-lg text-gray-300 leading-relaxed">Most founders have to hire someone like you to define their visual identity, create logos, and build a cohesive look. You have this locked down from day one, saving immense time and capital.</p>
                                    </div>
                                    <div className="p-8 border border-gray-700 bg-gray-800/50 rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#CBB49A] mb-4">You Understand Quality</h4>
                                        <p className="text-lg text-gray-300 leading-relaxed">You know the difference between standard and premium. By partnering with a manufacturer that shares your standard for excellence, you can deliver a product that truly reflects your design prowess.</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            {/* Bottom Line */}
                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Take the Leap</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">You have spent years building brands for other people. It is time to invest that energy into yourself.</p>
                                <p className="text-lg text-[#666666] leading-relaxed">The manufacturing barriers that once stopped you — high minimums, complex factory contracts, and massive risk — have been removed. With a clear 90-day roadmap and a dedicated partner to handle the complexities of production, your transition from freelancer to brand owner is not just possible; it is practically waiting for you to begin.</p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Stop Designing for Others. Start Your Brand Today.</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Convert your existing designs into a tech pack, order your first sample with zero bulk commitment, and launch your label in 90 days. We provide the manufacturing backbone so you can focus on the creative vision.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Build Your Own Brand
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
