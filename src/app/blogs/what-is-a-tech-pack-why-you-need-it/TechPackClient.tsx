"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, FileText, Component, Ruler, AlertTriangle, PenTool, CheckCircle2, ChevronRight, LayoutList } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'what-is-a-tech-pack-why-you-need-it';

type TechPackClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function TechPackClient({ initialLikeCount, initialComments }: TechPackClientProps) {
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
                    src="/blog/tech-pack-banner.png"
                    alt="Clothing Tech Pack Blueprint Document"
                    fill
                    className="object-cover object-top"
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
                            <FileText className="w-4 h-4" />
                            Design & Production
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            What is a Tech Pack?<br />(And Why You Need It)
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            The ultimate blueprint for manufacturing your fashion brand without errors.
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
                                        <p className="text-[#666666]">March 06, 2026</p>
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
                                    You have a brilliant idea for a collection. You&apos;ve created a stunning mood board, picked out inspiration photos, and even sketched your designs on an iPad. You send this to a factory, expecting a perfect sample. Weeks later, the sample arrives—and it looks nothing like what you imagined.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    The fit is entirely off, the fabric feels wrong, and the print placement is two inches too high. What went wrong? The answer is almost always the same: **You skipped the clothing Tech Pack.**
                                </p>
                                <p className="leading-relaxed mb-6">
                                    For designers new to production, jumping straight from a concept to a factory is the fastest way to burn through your budget. In this guide, we&apos;ll break down exactly what a Tech Pack is, why it&apos;s the foundation of fashion technical design, and why at Krazy Kreators, we actually provide them for free.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <LayoutList className="w-8 h-8 text-[#CBB49A]" />
                                    1. What Exactly Produces a Tech Pack? (The Blueprint)
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    A **Tech Pack** (Technical Package), also known as a garment specification sheet, is effectively the architectural blueprint for your factory. Think of it like trying to build a house: you wouldn&apos;t just hand a builder a picture of a house from Pinterest and say &quot;build this.&quot; You hand them architectural blueprints with exact dimensions, materials, and structural plans.
                                </p>
                                <p className="leading-relaxed mb-8">
                                    A comprehensive Tech Pack turns a subjective design into objective, measurable instructions. It typically includes:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <PenTool className="w-5 h-5 text-[#CBB49A]" /> Technical Flat Sketches
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-0">
                                            These are black-and-white, 2D vector drawings (usually created in Adobe Illustrator) of the front, back, and side views of the garment. Unlike fashion illustrations which focus on &quot;vibe&quot; and draping, flat sketches show every seam, stitch line, dart, and hardware placement with absolute precision.
                                        </p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <Component className="w-5 h-5 text-[#CBB49A]" /> Bill of Materials (BOM)
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-0">
                                            The master list of every physical component required to construct the garment. This includes the main fabric (with specific GSM and fiber content), lining, threads, buttons, zippers, labels, hangtags, and even packaging materials.
                                        </p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <Ruler className="w-5 h-5 text-[#CBB49A]" /> Grading Rules & Measurement Specs
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-0">
                                            This is the mathematical core of the garment specification sheet. It includes the exact measurements for your base sample size (i.e. Medium), and the &quot;grading rules&quot; which dictate exactly how much larger or smaller every point of measure should be for sizes S, L, XL, etc.
                                        </p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#CBB49A]" /> Construction Details
                                        </h3>
                                        <p className="text-sm leading-relaxed mb-0">
                                            Explicit instructions on how pieces should be sewn together. Will the hem be a double-needle coverstitch or a blind hem? What is the SPI (Stitches Per Inch)? What type of wash treatment will be applied? It leaves absolutely zero room for factory interpretation.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image
                                        src="/blog/tech_pack_flat_sketch.png"
                                        alt="Minimalist technical flat sketch of a heavyweight hoodie"
                                        width={1400}
                                        height={788}
                                        className="w-full h-auto object-cover"
                                    />
                                    <p className="text-center text-sm text-gray-500 mt-2 p-2">An example of technical flat sketches found in a clothing Tech Pack.</p>
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <AlertTriangle className="w-8 h-8 text-[#CBB49A]" />
                                    2. Why You Can&apos;t Manufacture Without One
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    &quot;Can&apos;t I just send a sample I like and tell them to copy it, but change the collar?&quot; It&apos;s a question we hear daily from eager designers. While some factories might say &quot;yes&quot; to get your deposit, the consequences are disastrous.
                                </p>

                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="bg-red-50 p-3 rounded-full hidden sm:block">
                                            <AlertTriangle className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2D2A2E] text-xl mb-2 mt-0">The Cost of Factory Misinterpretation</h4>
                                            <p className="text-sm text-gray-600 mb-0">
                                                Factories operate on efficiency. When they encounter an ambiguity in your design request, they will not pause production to ask you; they will make an assumption based on whatever is easiest or cheapest for them. Without a Tech Pack explicitly stating you want a premium 2x1 heavy rib collar, you will get a flimsy standard collar.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border-l-4 border-orange-500 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="bg-orange-50 p-3 rounded-full hidden sm:block">
                                            <AlertTriangle className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2D2A2E] text-xl mb-2 mt-0">Sample Iteration Hell (And Budget Drain)</h4>
                                            <p className="text-sm text-gray-600 mb-0">
                                                A sample might cost $100 to $300. If your first sample is wildly off because you lacked documentation, you have to pay for a second sample. Without a Tech Pack to point to and say, &quot;You didn&apos;t follow line item 4,&quot; you assume all the financial liability for fixing those errors. It turns into a back-and-forth guessing game that delays your launch by months.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
                                        <div className="bg-amber-50 p-3 rounded-full hidden sm:block">
                                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#2D2A2E] text-xl mb-2 mt-0">Loss of Quality Control Accountability</h4>
                                            <p className="text-sm text-gray-600 mb-0">
                                                When production is finished and 500 units arrive at your door, how do you verify they are correct? The Tech Pack acts as a definitive contract between you and the manufacturer. If the finished garment doesn&apos;t match the specific tolerances in the garment specification sheet, the factory is accountable for re-making it. Without it, you have no legal or operational leg to stand on.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image
                                        src="/blog/tech_pack_production_error.png"
                                        alt="Visual comparison showing an aesthetic mood board vs a poorly made prototype"
                                        width={1400}
                                        height={788}
                                        className="w-full h-auto object-cover"
                                    />
                                    <p className="text-center text-sm text-gray-500 mt-2 p-2">The gap between expectation (mood board) and reality (finished prototype) without a garment specification sheet.</p>
                                </div>
                            </div>

                            {/* Section 3 Krazy Kreators Approach */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-[#CBB49A]" />
                                    3. The Krazy Kreators Standard: Free Tech Packs
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    Here is an industry secret: most technical designers will charge you anywhere from $150 to $500 <em>per style</em> to develop a proper professional tech pack. If you are launching a collection with 5 styles, that&apos;s a massive upfront investment before you&apos;ve even touched a single piece of fabric.
                                </p>

                                <div className="bg-gradient-to-br from-[#2D2A2E] to-gray-800 p-10 rounded-2xl text-white shadow-xl relative overflow-hidden">
                                    {/* Decorative background elements */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBB49A] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-6 mt-0">Why We Do It Differently</h3>
                                        <p className="text-gray-300 leading-relaxed text-lg mb-8">
                                            At Krazy Kreators, we flipped the model. <strong>We offer Free Design & Tech Pack creation</strong> as a core benefit for the brands that manufacture with us. Why? Because we want your product to be perfect the first time.
                                        </p>

                                        <ul className="space-y-4 mb-0 pl-0">
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#CBB49A] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>Zero Translation Error:</strong> Our in-house technical designers create your pack in direct communication with the actual factory floor that will sew it.</span>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#CBB49A] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>Saving Startup Capital:</strong> Redirect those thousands of dollars you would have spent on technical designers into your marketing and inventory.</span>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#CBB49A] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>From Mood Board to Reality:</strong> You tell us the vision. We handle the heavy lifting of calculating GSMs, grading curves, and construction variables.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            {/* Conclusion */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Stop Guessing, Start Building</h2>
                                <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                    <p className="text-lg leading-relaxed text-gray-700 m-0">
                                        Starting a fashion brand is difficult enough without managing manufacturing disasters. By utilizing a comprehensive clothing tech pack, you shift from hoping your samples turn out well, to engineering a supply chain designed for success. Treat your design process with the precision of an architect, and your final product will reflect the premium quality your customers demand.
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-white border-2 border-[#CBB49A] p-10 lg:p-14 rounded-3xl mt-16 text-center" ref={endOfArticleRef}>
                                <div className="max-w-2xl mx-auto">
                                    <span className="text-[#CBB49A] font-bold tracking-widest text-sm uppercase mb-4 block">Take the Next Step</span>
                                    <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Have an idea but missing the blueprint?</h3>
                                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                        Don&apos;t let technical complexities stall your launch. Book a call with Krazy Kreators today, and let us handle your Free Technical Design &amp; Tech Pack generation during your manufacturing order.
                                    </p>
                                    <Button
                                        onClick={() => setContactOpen(true)}
                                        className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#CBB49A]/30 font-semibold group flex flex-row items-center gap-2 mx-auto"
                                    >
                                        Get Your Free Tech Pack
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did you find this guide helpful?</h4>
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
                                            placeholder="Share your thoughts or ask a question..."
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

