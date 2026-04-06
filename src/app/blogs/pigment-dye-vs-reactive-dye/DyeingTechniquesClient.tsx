"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Droplets, Palette, FlaskConical, CheckCircle2 } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'pigment-dye-vs-reactive-dye';

type DyeingTechniquesClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function DyeingTechniquesClient({ initialLikeCount, initialComments }: DyeingTechniquesClientProps) {
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
                    src="/blog/v2-pigment-dye-vs-reactive-dye-banner.png"
                    alt="Pigment Dyed vs Reactive Dyed Garments Side by Side"
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
                            <Droplets className="w-4 h-4" />
                            Manufacturing & Finishing
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Pigment Dye vs. Reactive Dye: Which One Is Right for Your Brand?
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            That &quot;vintage, washed-out feel&quot; you keep asking for? It has a name. Here is everything you need to know about garment dyeing before your next production run.
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
                                        <p className="text-[#666666]">April 6, 2026</p>
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

                            {/* Introduction */}
                            <div className="mb-12">
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    We hear it almost every week. A designer walks into a call and says, &quot;I want that vintage, washed-out look.&quot; Great. We get it. But when we follow up with, &quot;Are you thinking pigment dye or reactive dye?&quot; there is usually a long pause. And honestly, that pause is totally normal. Most designers have never had anyone explain the difference clearly.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    Here is why it matters: the dyeing technique you pick does not just change the color of your garment. It changes the hand feel. It changes how the color behaves after ten, twenty, fifty washes. It changes whether your customer thinks they bought something premium or something disposable. That is a lot riding on one production decision.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    Whether you are building a heritage streetwear label or launching a clean, vibrant activewear line, this guide will help you understand what each dyeing process actually does, when to use it, and what to avoid so you do not waste time or money on the wrong finish.
                                </p>
                            </div>

                            {/* What is Pigment Dye */}
                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#CBB49A]/20 rounded-full flex items-center justify-center">
                                            <Palette className="w-5 h-5 text-[#CBB49A]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-[#2D2A2E]">What is Pigment Dyeing?</h2>
                                    </div>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        You know that effortlessly faded, slightly sun-bleached look you see on high-end streetwear hoodies and vintage-style tees? That is pigment dyeing. It is the technique behind almost every &quot;lived-in&quot; garment on the market right now.
                                    </p>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        The key difference with pigment dye is that it does not chemically bond to the fiber. Instead, the color sits on the surface of the fabric and is held in place by a resin binder. Because the dye is surface-level, it fades naturally over time, especially along seams, edges, and areas of friction. That is exactly what gives it the worn-in, broken-in character that so many brands try to replicate artificially.
                                    </p>
                                    <div className="bg-[#F8F7F4] p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-3">The Vibe</h4>
                                        <ul className="list-disc list-inside text-[#666666] leading-relaxed space-y-2">
                                            <li><strong>Hand feel:</strong> Soft, matte, slightly chalky to the touch</li>
                                            <li><strong>Wash behavior:</strong> Fades gradually with each cycle, gets softer over time</li>
                                            <li><strong>Uniqueness:</strong> No two pieces look exactly the same, slight color variation is built in</li>
                                            <li><strong>Color fastness:</strong> Lower by design. The fading is the feature, not a defect</li>
                                            <li><strong>Works best on:</strong> 100% cotton or high-cotton blends, especially heavyweight fleece</li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/v2-pigment-dyed-garments.png" alt="Pigment dyed garments showing natural fade variation" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-3 text-center">Pigment dyed garments with natural color variation, each piece slightly different from the next</p>
                                </div>
                            </div>

                            {/* What is Reactive Dye */}
                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="order-2 md:order-1">
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/v2-reactive-dyed-garments.png" alt="Reactive dyed garments with vibrant saturated colors" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-3 text-center">Reactive dyed fabric holds bold, saturated color wash after wash</p>
                                </div>
                                <div className="order-1 md:order-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#CBB49A]/20 rounded-full flex items-center justify-center">
                                            <FlaskConical className="w-5 h-5 text-[#CBB49A]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-[#2D2A2E]">What is Reactive Dyeing?</h2>
                                    </div>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        If pigment dye is the vintage cousin, reactive dye is the clean-cut professional. This is the industry standard for bold, saturated colors that need to look the same on the first wear as they do on the fiftieth wash.
                                    </p>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        The science behind it is straightforward. Reactive dye molecules form a covalent chemical bond with the cellulose fibers in the fabric. The color literally becomes part of the material rather than sitting on top. That is why it holds up so well over time and why most premium basics, activewear, and uniform brands rely on it for consistent color reproduction across hundreds or thousands of units.
                                    </p>
                                    <div className="bg-[#F8F7F4] p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-3">The Vibe</h4>
                                        <ul className="list-disc list-inside text-[#666666] leading-relaxed space-y-2">
                                            <li><strong>Hand feel:</strong> Smooth, clean, natural to the touch</li>
                                            <li><strong>Wash behavior:</strong> Holds strong after 50+ washes with minimal shift</li>
                                            <li><strong>Consistency:</strong> Highly uniform across production batches</li>
                                            <li><strong>Color matching:</strong> Ideal for hitting exact Pantone references</li>
                                            <li><strong>Works best on:</strong> Cotton, linen, viscose, and other cellulosic blends</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Side-by-Side Comparison Table */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6 text-center">Pigment Dye vs. Reactive Dye: A Quick Comparison</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
                                        <thead>
                                            <tr className="bg-[#2D2A2E] text-white">
                                                <th className="px-6 py-4 text-left font-semibold">Property</th>
                                                <th className="px-6 py-4 text-left font-semibold">Pigment Dye</th>
                                                <th className="px-6 py-4 text-left font-semibold">Reactive Dye</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Color Bonding</td>
                                                <td className="px-6 py-4 text-[#666666]">Surface-level (resin binder)</td>
                                                <td className="px-6 py-4 text-[#666666]">Chemical bond with fiber</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4] border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Hand Feel</td>
                                                <td className="px-6 py-4 text-[#666666]">Soft, chalky, dry</td>
                                                <td className="px-6 py-4 text-[#666666]">Smooth, clean, natural</td>
                                            </tr>
                                            <tr className="bg-white border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Color Fastness</td>
                                                <td className="px-6 py-4 text-[#666666]">Low — fades over time</td>
                                                <td className="px-6 py-4 text-[#666666]">High — holds after 50+ washes</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4] border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Color Vibrancy</td>
                                                <td className="px-6 py-4 text-[#666666]">Muted, earthy tones</td>
                                                <td className="px-6 py-4 text-[#666666]">Bright, saturated tones</td>
                                            </tr>
                                            <tr className="bg-white border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Consistency</td>
                                                <td className="px-6 py-4 text-[#666666]">Each piece is slightly unique</td>
                                                <td className="px-6 py-4 text-[#666666]">Highly uniform across batches</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4] border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Best For</td>
                                                <td className="px-6 py-4 text-[#666666]">Streetwear, vintage aesthetics, casual</td>
                                                <td className="px-6 py-4 text-[#666666]">Premium basics, activewear, uniforms</td>
                                            </tr>
                                            <tr className="bg-white border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Water Usage</td>
                                                <td className="px-6 py-4 text-[#666666]">Lower</td>
                                                <td className="px-6 py-4 text-[#666666]">Higher (requires extensive rinsing)</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Cost</td>
                                                <td className="px-6 py-4 text-[#666666]">Generally lower</td>
                                                <td className="px-6 py-4 text-[#666666]">Generally higher</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* When to Use Which */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">So Which One Should You Actually Use?</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-8">
                                    This is where most designers get stuck. The answer depends entirely on what you are making and who you are making it for. Here is a simple way to think about it.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Palette className="w-6 h-6 text-[#CBB49A]" />
                                            <h3 className="text-xl font-bold text-[#2D2A2E]">Go With Pigment Dye If...</h3>
                                        </div>
                                        <ul className="list-disc list-inside text-[#666666] leading-relaxed space-y-3">
                                            <li>You are building a <strong>streetwear or vintage-inspired</strong> collection where character matters</li>
                                            <li>You want each piece to feel <strong>slightly one-of-a-kind</strong>, like a thrift find</li>
                                            <li>Your palette leans toward <strong>earth tones, dusty pastels, or muted shades</strong></li>
                                            <li>The <strong>fading is part of the story</strong> you are selling (think &quot;gets better with age&quot;)</li>
                                            <li>You are working with <strong>100% cotton or heavyweight fleece</strong> blanks</li>
                                            <li>You want the garment to feel <strong>pre-worn and broken-in</strong> straight out of the packaging</li>
                                        </ul>
                                    </div>

                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <FlaskConical className="w-6 h-6 text-[#CBB49A]" />
                                            <h3 className="text-xl font-bold text-[#2D2A2E]">Go With Reactive Dye If...</h3>
                                        </div>
                                        <ul className="list-disc list-inside text-[#666666] leading-relaxed space-y-3">
                                            <li>Color accuracy is <strong>non-negotiable</strong> and you need to hit an exact Pantone reference</li>
                                            <li>You are producing <strong>hundreds or thousands of units</strong> that all need to match</li>
                                            <li>Your product will be <strong>washed heavily</strong> (activewear, essentials, kids&apos; clothing)</li>
                                            <li>Your designs call for <strong>bright, saturated, or deep colors</strong> that pop</li>
                                            <li>The garment will also get <strong>screen printing, embroidery, or other embellishment</strong> on top</li>
                                            <li>You are selling to <strong>retail or wholesale accounts</strong> with strict QC standards</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Common Mistakes */}
                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Mistakes We See Designers Make All the Time</h2>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        This is not a judgment call. These are genuinely common pitfalls, and we see them on a weekly basis. The good news is they are all completely avoidable once you know what to watch for.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex gap-3 items-start">
                                            <span className="text-red-500 font-bold text-lg mt-0.5">1.</span>
                                            <p className="text-[#666666]"><strong>Wanting &quot;vintage&quot; but expecting the color to never change.</strong> This is the big one. Pigment dye fades by nature. That is the whole point. If you want the worn-in aesthetic without the actual color shift, the better move is reactive dye with a garment wash or enzyme treatment layered on top.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <span className="text-red-500 font-bold text-lg mt-0.5">2.</span>
                                            <p className="text-[#666666]"><strong>Applying pigment dye to polyester blends.</strong> Pigment dye does not grip synthetic fibers well. You end up with patchy, uneven coverage that looks like a production defect, not a design choice.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <span className="text-red-500 font-bold text-lg mt-0.5">3.</span>
                                            <p className="text-[#666666]"><strong>Skipping wash-down testing before bulk production.</strong> A color that looks perfect before washing can shift noticeably after just one cycle. Always request wash-test samples. This single step can save you an entire rejected bulk order.</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <span className="text-red-500 font-bold text-lg mt-0.5">4.</span>
                                            <p className="text-[#666666]"><strong>Forgetting about rub fastness.</strong> Pigment dye can transfer onto lighter garments, car seats, or furniture. If your customers are going to notice, you need to test for crocking before you ship.</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/v2-dyeing-process-factory.png" alt="Garment dyeing process in a factory" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-3 text-center">Knowing the process helps you give clearer briefs and avoid costly revisions</p>
                                </div>
                            </div>

                            {/* Pro Tips */}
                            <div className="mb-12 bg-gradient-to-br from-[#2D2A2E] to-[#3D3A3E] p-8 md:p-12 rounded-2xl text-white">
                                <h2 className="text-2xl font-bold mb-6">What We Tell Every Designer Before They Go to Bulk</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 text-[#CBB49A]">Layer Your Finishes</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            Want that vintage look but cannot afford the color to shift too much? Dye reactive first, then apply a pigment wash or enzyme wash on top. You get the base color stability with the surface-level texture and softness. This is one of the most requested finishes at Krazy Kreators right now.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 text-[#CBB49A]">Always Get Lab Dips First</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            Never commit to bulk without seeing 2-3 lab dip options on your actual fabric. Colors behave differently on different weights and compositions. What looks perfect on a 180 GSM single jersey will look completely different on a 320 GSM fleece.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 text-[#CBB49A]">Specify Post-Dye Treatments Upfront</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            Silicone softeners, enzyme washes, and mechanical tumbles all interact differently with pigment and reactive dye. If you only specify the color and skip the finishing details, you might get the right shade with the wrong hand feel.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 text-[#CBB49A]">Put It All in the Tech Pack</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            Dye type, Pantone code, wash treatment, target hand feel, and fastness expectations should all live in your tech pack. The more specific you are on paper, the fewer revision rounds you burn through in production.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mb-12" ref={endOfArticleRef}>
                                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Stop Guessing. Start Specifying.</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    The gap between a garment that looks &quot;fine&quot; and one that looks genuinely premium often comes down to one thing: the dye process. And most designers never get to have this conversation with their manufacturer because they do not know what to ask for.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    At Krazy Kreators, we handle the full spectrum of garment dyeing and finishing. Pigment washes, reactive dye color matching, enzyme treatments, silicone softeners, layered finishes. Whether you are going for a sun-faded LA streetwear aesthetic or you need Pantone-perfect color for a wholesale retail launch, we work with you to dial in the exact finish before anything goes to bulk.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    You bring the vision. We bring the process.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg mt-4 font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    Get Expert Dyeing Guidance
                                </Button>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did this dyeing guide help you?</h4>
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
                                            placeholder="Have a question about dyeing techniques? Ask here..."
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
                                        <p className="text-gray-500 font-medium">No comments yet. Have a question about dyeing? Ask below!</p>
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
