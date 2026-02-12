
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Ruler, Printer, SprayCan, Shirt, Layers, Beaker, CheckCircle2, TrendingUp, AlertTriangle, Users } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'streetwear-2-0-heavy-gsm-puff-prints-acid-washes';

type StreetwearClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function StreetwearClient({ initialLikeCount, initialComments }: StreetwearClientProps) {
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
                    src="/blog/streetwear-2-0-banner.png"
                    alt="Streetwear 2.0 Trends"
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
                            <Shirt className="w-4 h-4" />
                            Industry Trends
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Streetwear 2.0: Heavy GSM, Puff Prints, and Acid Washes
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            The market is evolving. Here is the technical execution behind the current aesthetic obsession.
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
                                        <p className="text-[#666666]">February 09, 2026</p>
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
                                    Streetwear is evolving. The era of flimsy blanks, basic screen prints, and generic cuts is over. We are entering &quot;Streetwear 2.0&quot;—a movement defined by a demand for extreme substance, tactile texture, and unique character.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    For years, brands could get away with printing a logo on a standard Gildan or Alstyle blank. Today, the consumer is far more educated. They understand fabric weight, they recognize specialized wash treatments, and they can feel the difference between a standard print and a technical application.
                                </p>
                                <p className="leading-relaxed mb-6">
                                    Currently, the market is obsessed with three key elements: **Heavyweight (240+ GSM) tees**, **Puff Printing**, and **vintage Acid Washes**. This isn&apos;t just a fleeting trend; it&apos;s a fundamental shift towards tactile, premium-feeling garments that justify higher price points and build lasting brand loyalty.
                                </p>
                                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl my-8">
                                    <h4 className="flex items-center gap-2 font-bold text-amber-900 m-0 mb-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Why This Works
                                    </h4>
                                    <p className="text-amber-800 m-0">
                                        This is highly specific. When a designer searches &quot;how to manufacture acid wash hoodies,&quot; they are looking for technical capability, not just a vendor. Mastering these techniques positions your brand not just as a seller of clothes, but as a technical leader in the space.
                                    </p>
                                </div>
                            </div>

                            {/* Heavy GSM Section */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Ruler className="w-8 h-8 text-[#CBB49A]" />
                                    1. Heavyweight GSM (240+)
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    GSM (Grams per Square Meter) is the definitive metric for fabric weight. The standard 160-180 GSM tee feels cheap in today&apos;s market. Streetwear 2.0 demands 240 GSM to 300 GSM for t-shirts and 400+ GSM for hoodies.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Why Heavyweight?</h3>
                                        <ul className="space-y-3 mb-0 list-none pl-0">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                <span><strong>Structure & Drape:</strong> Unlike thinner fabrics that cling, 240+ GSM cotton creates its own silhouette. It holds a &quot;boxy&quot; shape that stands away from the body, which is the cornerstone of the modern streetwear aesthetic.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                <span><strong>Durability:</strong> These garments survive rigorous washing cycles without twisting, shrinking, or piling. They age better, often softening with time while maintaining their structure.</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                                <span><strong>Perceived Value:</strong> The physical weight immediately signals quality to the customer. When a customer picks up a 300gsm tee, the &quot;heft&quot; justifies a higher retail price point immediately.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Best Fibers for Heavy GSM</h3>
                                        <p className="text-sm leading-relaxed mb-4">
                                            Simply increasing weight isn&apos;t enough. You need the right yarn.
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            <li><strong>Combed Cotton:</strong> Smooth, strong, and perfect for printing.</li>
                                            <li><strong>French Terry:</strong> Ideal for hoodies, with looped interior for comfort.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image
                                        src="/blog/heavyweight-gsm-texture.jpg"
                                        alt="Close up of heavyweight cotton fabric texture"
                                        width={1400}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>

                            {/* Puff Prints Section */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Printer className="w-8 h-8 text-[#CBB49A]" />
                                    2. Puff Printing
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    Flat screen prints are standard. Puff prints add a third dimension. By adding a foaming agent to the plastisol ink, the print expands when heat-cured, creating a raised, 3D effect.
                                </p>
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-4">Technical Considerations</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2">Mesh Count</h4>
                                                <p className="text-sm text-gray-600">Use lower mesh counts (e.g., 60-86) to allow more ink deposit for better puff expansion.</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2">Curing Temp</h4>
                                                <p className="text-sm text-gray-600">Precise temperature control is critical. Over-curing can cause the puff to collapse.</p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-700 mb-2">Artwork</h4>
                                                <p className="text-sm text-gray-600">Avoid fine lines. Bold, blocky designs work best for maximum impact.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image
                                        src="/blog/puff-print-detail.jpg"
                                        alt="Macro shot of puff print texture on t-shirt"
                                        width={1400}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-red-50 p-8 rounded-2xl border border-red-100">
                                    <div>
                                        <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            Common Pitfalls
                                        </h3>
                                        <p className="text-red-800 text-sm mb-0">
                                            The most common issue with puff printing is <strong>cracking</strong>. If the curing temperature varies even by a few degrees or the dwell time is insufficient, the puff ink won&apos;t cure all the way through. This leads to the &quot;marshmallow effect&quot;—soft inside, hard shell—which cracks deeply after the first wash.
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                       <span className="font-bold text-red-900 mb-2 text-sm">Design Tip:</span>
                                       <p className="text-red-800 text-sm italic">
                                            &quot;Don&apos;t try to puff fine text. The expansion will close up the letters (filling in the loops of &apos;e&apos;s and &apos;a&apos;s). Stick to bold logos and typography at least 12pt thickness.&quot;
                                       </p>
                                    </div>
                                </div>
                            </div>

                            {/* Acid Washes Section */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <SprayCan className="w-8 h-8 text-[#CBB49A]" />
                                    3. Acid Washes (Vintage Wash)
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    The &quot;perfectly new&quot; look is out. The &quot;lived-in&quot; aesthetic is in. Acid washing involves soaking pumice stones in chlorine bleach and tumbling them with the garments. This strips color irregularly, creating a unique, vintage patina.
                                </p>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                                            <Beaker className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">The Process</h3>
                                        <p className="text-sm leading-relaxed mb-4">
                                            It&apos;s a chemical artistry. The duration of the tumble, the concentration of bleach, and the size of the stones all dictate the final pattern. No two pieces are exactly alike.
                                        </p>
                                        <div className="p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-500">
                                            <strong>Note:</strong> Acid washing weakens fabric slightly, so starting with a Heavy GSM base (see point 1) is crucial to maintain integrity.
                                        </div>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                            <Layers className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 mt-0">Variations</h3>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li><strong>Mineral Wash:</strong> A softer, more subtle variation using enzyme washes.</li>
                                            <li><strong>Sun-Faded:</strong> Focuses on fading shoulders and seams to mimic sun exposure.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image
                                        src="/blog/acid-wash-pattern.jpg"
                                        alt="Vintage acid wash fabric texture pattern"
                                        width={1400}
                                        height={800}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>

                                <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                    <h3 className="text-xl font-bold text-[#2D2A2E] mb-4">Beyond Acid: Advanced Wash Techniques</h3>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-24 shrink-0 font-bold text-gray-900">Ozone Wash</div>
                                            <div className="text-gray-600 text-sm">A sustainable alternative using ozone gas to bleach denim and cotton. It uses 90% less water than traditional acid washing while achieving similar &quot;vintage&quot; results.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-24 shrink-0 font-bold text-gray-900">Enzyme Wash</div>
                                            <div className="text-gray-600 text-sm">Uses organic enzymes to &quot;eat&quot; the cellulose in the cotton. This results in an incredibly soft hand-feel (the &quot;peach skin&quot; effect) without the heavy abrasion of pumice stones.</div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-24 shrink-0 font-bold text-gray-900">Pigment Dye</div>
                                            <div className="text-gray-600 text-sm">Instead of reacting with the fiber, the dye sits on top. When washed, the pigment falls off high points (seams, collars), creating an instant &quot;worn-in&quot; look that usually takes years to achieve.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* New Section: Fit Engineering */}
                            <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <Users className="w-8 h-8 text-[#CBB49A]" />
                                    4. Fit Engineering: The Boxy Cut
                                </h2>
                                <p className="leading-relaxed mb-8">
                                    A heavy fabric is wasted on a standard &quot;retail fit.&quot; The Streetwear 2.0 aesthetic relies on specific pattern engineering to compliment the heavy drape of the fabric.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Drop Shoulder</div>
                                        <p className="text-xs text-gray-500">Seams sit 2-3 inches off the shoulder cap, creating a relaxed, slouchy vibe.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Wider Chest</div>
                                        <p className="text-xs text-gray-500">Chest measurements are increased by 2-4 inches compared to standard sizing for &quot;boxiness.&quot;</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Cropped Length</div>
                                        <p className="text-xs text-gray-500">Slightly shorter body length prevents the &quot;dress&quot; look when wearing oversized widths.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                                        <div className="font-bold text-lg mb-2">Thick Ribbing</div>
                                        <p className="text-xs text-gray-500">1-inch or 1.25-inch neck ribs are mandatory to balance the visual weight of the heavy body fabric.</p>
                                    </div>
                                </div>
                            </div>

                             {/* New Section: Manufacturer Checklist */}
                             <div className="mb-20">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8 flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-[#CBB49A]" />
                                    5. The Manufacturing Checklist
                                </h2>
                                <p className="leading-relaxed mb-6">
                                    If you are sourcing these garments, do not just send a photo and hope for the best. Use this checklist to vet your manufacturer:
                                </p>
                                <div className="bg-[#2D2A2E] text-white p-8 rounded-2xl">
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#CBB49A] flex items-center justify-center text-[#2D2A2E] font-bold text-xs mt-0.5">1</div>
                                            <div>
                                                <strong className="block text-[#CBB49A]">Test Wash Reports</strong>
                                                <span className="text-gray-400 text-sm">Ask for lab dips and shrinkage reports. Heavy cotton can shrink up to 5-7% if not pre-shrunk properly.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#CBB49A] flex items-center justify-center text-[#2D2A2E] font-bold text-xs mt-0.5">2</div>
                                            <div>
                                                <strong className="block text-[#CBB49A]">Puff Height Samples</strong>
                                                <span className="text-gray-400 text-sm">Request physical samples of different puff heights. &quot;High density&quot; puff is very different from &quot;suede&quot; puff. Be specific.</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-[#CBB49A] flex items-center justify-center text-[#2D2A2E] font-bold text-xs mt-0.5">3</div>
                                            <div>
                                                <strong className="block text-[#CBB49A]">Neutralization Confirmation</strong>
                                                <span className="text-gray-400 text-sm">For acid washes, ensure the manufacturer performs a thorough neutralization bath. Residual chlorine will rot the cotton over time.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Conclusion */}
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold text-[#2D2A2E] mb-8">Executing the Vision</h2>
                                <div className="bg-gradient-to-br from-[#2D2A2E] to-gray-800 text-white p-8 rounded-2xl">
                                    <p className="text-lg leading-relaxed mb-6 text-white">
                                        Combining these three elements—Heavy GSM, Puff Prints, and Acid Wash—creates a product that screams &quot;Streetwear 2.0&quot;. It&apos;s tactile, visual, and substantial.
                                    </p>
                                    <p className="text-xl font-bold text-[#CBB49A]">
                                        Don&apos;t just chase the trend; understand the manufacturing that makes it possible. That is how you build a brand with staying power.
                                    </p>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-[#2D2A2E] text-white p-10 lg:p-14 rounded-3xl mt-16 relative overflow-hidden text-center" ref={endOfArticleRef}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#CBB49A] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                                <div className="relative z-10 max-w-2xl mx-auto">
                                    <span className="text-[#CBB49A] font-bold tracking-widest text-sm uppercase mb-4 block">Ready to Create?</span>
                                    <h3 className="text-3xl font-bold mb-6">Looking for a Manufacturer Who Can Execute Streetwear 2.0?</h3>
                                    <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                        Krazy Kreators has the technical capability to handle heavy GSM fabrics, specialized puff printing, and custom wash treatments. Let&apos;s bring your vision to life.
                                    </p>
                                    <Button
                                        onClick={() => setContactOpen(true)}
                                        className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-10 py-7 text-lg rounded-full transition-all shadow-xl hover:shadow-[#CBB49A]/30 font-semibold"
                                    >
                                        Start Your Project
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
                                            placeholder="Share your thoughts..."
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

