"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Ribbon, CheckCircle2, ChevronRight, Layers, ShieldCheck, Scale3D } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'private-label-vs-custom-manufacturing';

type CustomMfgClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function CustomMfgClient({ initialLikeCount, initialComments }: CustomMfgClientProps) {
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
                    src="/blog/private-label-vs-custom-manufacturing-banner.png"
                    alt="Private Label vs Custom Manufacturing"
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
                            <Layers className="w-4 h-4" />
                            Business Strategy
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Private Label vs.<br />Custom Manufacturing
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            Are you just printing on blanks, or are you building lasting brand equity? Let&apos;s break down which approach actually fits your vision.
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
                                        <p className="text-[#666666]">March 12, 2026</p>
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
                                    Launching a new fashion collection? You&apos;re likely facing the first pivotal crossroad of your brand&apos;s future: do you buy high-quality generic blanks and slap your logo on them (Private Label/White Label), or do you design everything from scratch, building a unique garment from the yarn up (Custom Manufacturing)?
                                </p>
                                <p className="leading-relaxed mb-6">
                                    There&apos;s no single &quot;correct&quot; answer, but making the wrong choice for your specific business model has killed countless promising fashion startups. Are you aiming to be a fast-moving merch brand, or a premium streetwear label with silhouettes that customers actively seek out? 
                                </p>
                                <p className="leading-relaxed mb-6">
                                    In this breakdown, we&apos;ll dissect exactly what each method entails, their pros and cons, and why deeper-pocketed clients almost always pivot to custom-cut-and-sew to secure long-term brand equity.
                                </p>
                            </div>

                            {/* Section 1 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Ribbon className="w-8 h-8 text-[#CBB49A]" />
                                    1. The Private Label / White Label Approach
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Private Labeling (often called White Labeling in other industries) is the practice of purchasing pre-manufactured, blank garments produced by a factory, and then having them &quot;re-labeled&quot; with your brand&apos;s neck tag. You then apply your custom prints, embroidery, or wash treatments to these blanks.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 text-green-700 flex items-center gap-2">
                                            The Pros
                                        </h3>
                                        <ul className="text-sm leading-relaxed space-y-3">
                                            <li><strong>Low Barrier to Entry:</strong> Minimum order quantities (MOQs) are virtually non-existent. You can print on just 20 hoodies if you want to.</li>
                                            <li><strong>Speed to Market:</strong> Because the garments already exist in a warehouse, you skip the prototyping and fabric-sourcing phases. You can turn an idea around in weeks.</li>
                                            <li><strong>Predictable Fit:</strong> If you use a famous blank brand, customers generally know how exactly that specific shirt will fit them.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 text-red-700 flex items-center gap-2">
                                            The Cons
                                        </h3>
                                        <ul className="text-sm leading-relaxed space-y-3">
                                            <li><strong>Zero Unique Identity:</strong> Your $80 t-shirt is fundamentally the exact same construction and fabric as a local gym&apos;s $20 merch t-shirt. The only difference is the graphic.</li>
                                            <li><strong>High Margin Ceiling:</strong> Blank providers take their own profit margins. When you attempt to scale, the &quot;per-unit&quot; cost of a high-end blank remains stubbornly high, crushing your wholesale viability.</li>
                                            <li><strong>Vulnerable Supply Chain:</strong> If the blank manufacturer discontinues your favorite silhouette or colorway, your flagship product is instantly dead.</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative max-w-4xl mx-auto">
                                    <Image
                                        src="/blog/private_label_vs_custom_1.png"
                                        alt="Comparison of identical blank t-shirts vs unique custom cut and sew hoodie"
                                        width={1400}
                                        height={788}
                                        className="w-full h-auto max-h-[450px] object-cover"
                                    />
                                    <p className="text-center text-sm text-gray-500 p-3 bg-white border-t border-gray-100 m-0">The difference is visual: generic blank vs a truly proprietary silhouette.</p>
                                </div>

                                <p className="leading-relaxed">
                                    <strong>Who is it for?</strong> Content creators moving into basic merch, small dropshippers, or cash-strapped startups wanting to test a simple graphic concept without betting the farm.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Scale3D className="w-8 h-8 text-[#CBB49A]" />
                                    2. Custom Cut & Sew Manufacturing
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Custom manufacturing is how true fashion brands are built. You design the exact measurements. You choose the specific 350 GSM French Terry cotton. You dictate the exact drop-shoulder angle and the specific ribbing density on the collar. The factory sources raw fabric, cuts it to your proprietary patterns, and sews it specifically for your brand.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 text-green-700 flex items-center gap-2">
                                            The Pros
                                        </h3>
                                        <ul className="text-sm leading-relaxed space-y-3">
                                            <li><strong>Proprietary Silhouette:</strong> When someone asks, &quot;Wow, where did you get that hoodie? The fit is amazing!&quot; they can <em>only</em> buy it from you. Your fit becomes your moat.</li>
                                            <li><strong>Significantly Better Margins at Scale:</strong> Since you aren&apos;t paying a middleman for their blank profit margins, your unit cost drops dramatically as you produce higher volumes.</li>
                                            <li><strong>Limitless Execution:</strong> Custom hardware, unique wash treatments (like acid or enzyme washes), complex paneling, and engineered print placements are only possible through cut &amp; sew.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4 text-red-700 flex items-center gap-2">
                                            The Cons
                                        </h3>
                                        <ul className="text-sm leading-relaxed space-y-3">
                                            <li><strong>Higher Investment:</strong> Factories have to dye raw fabrics and cut proprietary patterns, so MOQs apply (typically 100-300 units minimum per style).</li>
                                            <li><strong>Longer Development Time:</strong> It takes time to iterate on technical Tech Packs, create fit samples, adjust patterns, and greenlight bulk production.</li>
                                            <li><strong>Requires Expertise:</strong> You need a basic understanding of fabrics, grading, and Tech Packs (unless you partner with a full-service manufacturer like Krazy Kreators).</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 relative max-w-4xl mx-auto">
                                    <Image
                                        src="/blog/custom_garment_close_up.png"
                                        alt="Extreme close up of premium heavyweight fabric and stitching details"
                                        width={1400}
                                        height={788}
                                        className="w-full h-auto max-h-[450px] object-cover"
                                    />
                                    <p className="text-center text-sm text-gray-500 p-3 bg-white border-t border-gray-100 m-0">Custom manufacturing allows you to dictate every detail, down to the gauge of the stitching and the density of the ribbing.</p>
                                </div>

                                <p className="leading-relaxed">
                                    <strong>Who is it for?</strong> Serial entrepreneurs, established brands, and serious designers who view their business as a long-term fashion house, not a short-term graphic t-shirt hustle.
                                </p>
                            </div>

                            {/* Section 3 Value Proposition */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 text-[#CBB49A]" />
                                    3. Why Real Brand Equity Demands Custom Manufacturing
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    If you want to charge $100+ for a hoodie, your customer must <em>feel</em> the value. In 2026, consumers are hyper-educated. A teenager can spot a standard print-on-demand blank from a mile away. 
                                </p>
                                <p className="leading-relaxed mb-6">
                                    When you rely on private label blanks, your entire brand&apos;s value is placed strictly on your logo or graphic. If a competitor produces a cooler graphic on the exact same blank, they steal your customer.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    But when you invest in <strong>Custom Manufacturing</strong>, you create physical value. The hefty weight of the cotton, the precise crop of the jacket, the unique dye pattern—these elements create brand loyalty that graphics alone cannot replicate. Cult brands like Represent, Cole Buxton, and Corteiz aren&apos;t printing on generic blanks; they&apos;ve defined the market by pioneering completely custom, proprietary silhouettes.
                                </p>

                                <div className="bg-gradient-to-br from-[#2D2A2E] to-gray-800 p-10 rounded-2xl text-white shadow-xl relative overflow-hidden mt-10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBB49A] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold text-white mb-6 mt-0">The Krazy Kreators Advantage</h3>
                                        <p className="text-gray-300 leading-relaxed text-lg mb-8">
                                            We built our entire supply chain to help ambitious brands bridge the gap between &quot;private label&quot; and &quot;high-end fashion house.&quot; 
                                        </p>
                                        <ul className="space-y-4 mb-0 pl-0">
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#CBB49A] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>Accessible MOQs:</strong> While traditional custom factories demand 500+ units, we support emerging brands with lower MOQs to make cut & sew viable.</span>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#CBB49A] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>Free Tech Packs:</strong> Making the jump to custom requires technical design. We create your Tech Packs in-house for free.</span>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#CBB49A] flex-shrink-0 mt-1" />
                                                <span className="text-gray-300"><strong>End-to-End Control:</strong> From spinning specific yarn weights to executing complex acid washes, your garments become impossible for cheap competitors to copy.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Conclusion */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">The Verdict</h2>
                                <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                    <p className="text-lg leading-relaxed text-gray-700 m-0">
                                        Private printing on generic blanks is an excellent way to figure out if you actually want to run a clothing business. But the moment you are serious about building a brand that survives seasons, defines trends, and commands premium pricing, pivoting to custom manufacturing is non-negotiable. 
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-white border-2 border-[#CBB49A] p-10 lg:p-14 rounded-3xl mt-16 text-center" ref={endOfArticleRef}>
                                <div className="max-w-2xl mx-auto">
                                    <span className="text-[#CBB49A] font-bold tracking-widest text-sm uppercase mb-4 block">Elevate Your Brand</span>
                                    <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Ready to graduate to Cut & Sew?</h3>
                                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                        Stop relying on standard blanks. Build a brand that is physically distinct. Book a clarity call with us and let&apos;s discuss engineering your next custom collection.
                                    </p>
                                    <Button
                                        onClick={() => setContactOpen(true)}
                                        className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#CBB49A]/30 font-semibold group flex flex-row items-center gap-2 mx-auto"
                                    >
                                        Start Building Custom
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did you find this comparison helpful?</h4>
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

