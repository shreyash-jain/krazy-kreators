"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, MessageCircle, Ruler, Scissors, CheckCircle2 } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'grading-vs-pattern-making-perfect-fit';

type GradingVsPatternMakingClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function GradingVsPatternMakingClient({ initialLikeCount, initialComments }: GradingVsPatternMakingClientProps) {
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
                    src="/blog/v2-grading-vs-pattern-making-banner.png"
                    alt="Pattern making table with graded size set and measurement tools"
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
                            <Ruler className="w-4 h-4" />
                            Design & Fit
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            Grading vs. Pattern Making: Why Your Sample Fits Great in One Size but Not the Others
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                            A Medium is not just a smaller Large. Here is why fit breaks across your size run and what you can do about it before your next production order.
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
                                    You approve a Medium sample. It looks incredible. The proportions are right, the shoulders sit clean, the hem hits exactly where you wanted it. You feel great about it.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    Then the full size run shows up. The Small is too tight through the chest. The XL sleeves are somehow shorter than the Large. The XXL looks like a completely different garment. And suddenly you are staring at a bulk order where half the sizes do not work.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    This is one of the most common problems we see at Krazy Kreators, and it almost always comes down to the same thing: the difference between pattern making and size grading. Most founders and first-time designers do not know there are two separate processes involved in getting a garment to fit correctly across every size. And when either one is done poorly, the entire production suffers.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    This guide breaks down what each process actually does, where things tend to go wrong, and what to look for in a manufacturer who takes fit seriously.
                                </p>
                            </div>

                            {/* What is Pattern Making */}
                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#CBB49A]/20 rounded-full flex items-center justify-center">
                                            <Scissors className="w-5 h-5 text-[#CBB49A]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-[#2D2A2E]">What is Pattern Making?</h2>
                                    </div>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        Pattern making is where a garment actually begins to take physical shape. It is the process of translating your design, your sketch, your tech pack measurements into flat template pieces that can be cut from fabric and sewn together into a three-dimensional garment.
                                    </p>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        Think of it this way: every seam, every dart, every curve on a sleeve cap exists because a pattern maker decided exactly where that line should fall. The pattern determines the silhouette, the ease (how much room the fabric gives around the body), the proportions, and ultimately how the garment drapes when someone puts it on.
                                    </p>
                                    <p className="text-lg text-[#666666] leading-relaxed">
                                        This is typically done for a single base size, usually a Medium or a Large depending on the brand. That one pattern becomes the foundation for everything that follows.
                                    </p>
                                </div>
                                <div>
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/v2-pattern-making-table.png" alt="Pattern maker working on garment pattern pieces on a table" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-3 text-center">Pattern making translates your design vision into precise, cuttable template pieces</p>
                                </div>
                            </div>

                            {/* What is Grading */}
                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="order-2 md:order-1">
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/v2-size-grading-process.png" alt="Graded pattern nest showing multiple sizes scaled from a base pattern" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-3 text-center">A graded nest showing how the base pattern scales proportionally across every size</p>
                                </div>
                                <div className="order-1 md:order-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#CBB49A]/20 rounded-full flex items-center justify-center">
                                            <Ruler className="w-5 h-5 text-[#CBB49A]" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-[#2D2A2E]">What is Size Grading?</h2>
                                    </div>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        Once you have a base pattern that fits your sample size perfectly, grading is the process of scaling that pattern up and down to create every other size in your range. XS, Small, Large, XL, XXL, and everything in between.
                                    </p>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        Here is the part most people get wrong: grading is not just making the pattern bigger or smaller by a uniform amount. A human body does not scale uniformly. When someone goes from a Medium to an XL, their chest might increase by three inches but their shoulder width might only go up by one. Their torso gets longer. Their armhole deepens. The proportions shift in ways that are different for every measurement point.
                                    </p>
                                    <p className="text-lg text-[#666666] leading-relaxed">
                                        Good grading accounts for all of this. It uses specific increment rules for each measurement point so that the silhouette, the design intent, and the overall proportions of the garment stay consistent no matter what size someone is wearing.
                                    </p>
                                </div>
                            </div>

                            {/* Why This Matters */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Why This Matters More Than You Think</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-8">
                                    Fit is the single biggest reason customers return clothing. Not color. Not fabric quality. Fit. And in most cases, the fit issue is not in the sample size. It shows up in the sizes that were graded from it. Here is why that happens.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border border-gray-100">
                                        <div className="text-3xl font-bold text-[#CBB49A] mb-3">01</div>
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Lazy Grading</h4>
                                        <p className="text-[#666666] leading-relaxed">
                                            Some manufacturers scale every measurement by the same percentage. The chest goes up two inches, the sleeve goes up two inches, the body length goes up two inches. That is not how bodies work. The result is larger sizes that feel boxy and shapeless, and smaller sizes that feel pinched in the wrong places.
                                        </p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border border-gray-100">
                                        <div className="text-3xl font-bold text-[#CBB49A] mb-3">02</div>
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">Missing Grade Rules</h4>
                                        <p className="text-[#666666] leading-relaxed">
                                            Grade rules are the specific increments applied to each measurement point between sizes. Without a clear grade rule table, the person doing the grading is essentially guessing. Chest might get graded but the neckline does not. Sleeves scale up but the armhole stays the same. The garment technically gets bigger, but it does not fit bigger.
                                        </p>
                                    </div>
                                    <div className="bg-[#F8F7F4] p-6 rounded-2xl border border-gray-100">
                                        <div className="text-3xl font-bold text-[#CBB49A] mb-3">03</div>
                                        <h4 className="font-bold text-[#2D2A2E] mb-2">No Fit Testing Across Sizes</h4>
                                        <p className="text-[#666666] leading-relaxed">
                                            Many brands only test the sample size on a fit model. They approve the Medium and assume the rest will be fine. But a size that was graded without live testing often reveals issues that only show up on an actual body. Tight armpits on the XS. Dropped shoulders on the XXL. Sleeves that look right on paper but pull awkwardly in person.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Side-by-Side Comparison */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6 text-center">Pattern Making vs. Size Grading: A Quick Comparison</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
                                        <thead>
                                            <tr className="bg-[#2D2A2E] text-white">
                                                <th className="px-6 py-4 text-left font-semibold">Aspect</th>
                                                <th className="px-6 py-4 text-left font-semibold">Pattern Making</th>
                                                <th className="px-6 py-4 text-left font-semibold">Size Grading</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Purpose</td>
                                                <td className="px-6 py-4 text-[#666666]">Creates the base garment shape and silhouette</td>
                                                <td className="px-6 py-4 text-[#666666]">Scales the base pattern into a full size range</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4] border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">When It Happens</td>
                                                <td className="px-6 py-4 text-[#666666]">First, during development and sampling</td>
                                                <td className="px-6 py-4 text-[#666666]">After the base pattern is approved</td>
                                            </tr>
                                            <tr className="bg-white border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Sizes Involved</td>
                                                <td className="px-6 py-4 text-[#666666]">One base size (usually M or L)</td>
                                                <td className="px-6 py-4 text-[#666666]">Entire size run (XS through XXL+)</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4] border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Key Skill</td>
                                                <td className="px-6 py-4 text-[#666666]">Understanding 3D body shape from 2D flat patterns</td>
                                                <td className="px-6 py-4 text-[#666666]">Knowing how body proportions change across sizes</td>
                                            </tr>
                                            <tr className="bg-white border-b border-gray-100">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">What Goes Wrong</td>
                                                <td className="px-6 py-4 text-[#666666]">Poor silhouette, bad ease, awkward seam placement</td>
                                                <td className="px-6 py-4 text-[#666666]">Fit breaks at extreme sizes, inconsistent proportions</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="px-6 py-4 font-medium text-[#2D2A2E]">Who Does It</td>
                                                <td className="px-6 py-4 text-[#666666]">Pattern maker or technical designer</td>
                                                <td className="px-6 py-4 text-[#666666]">Grading specialist or CAD technician</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* What Good Grading Looks Like */}
                            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">What Good Grading Actually Looks Like</h2>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        When grading is done right, you should be able to hold up any two sizes from your run side by side and immediately see that they are the same garment. Same proportions. Same design intent. Just scaled to fit a different body.
                                    </p>
                                    <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                        Here is what that requires behind the scenes.
                                    </p>
                                    <div className="bg-[#F8F7F4] p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-[#2D2A2E] mb-3">The Non-Negotiables</h4>
                                        <ul className="list-disc list-inside text-[#666666] leading-relaxed space-y-2">
                                            <li><strong>Custom grade rules per style:</strong> An oversized hoodie grades differently than a fitted tee. A set of generic rules across all styles will not work</li>
                                            <li><strong>Different increments per measurement:</strong> Chest might jump 2 inches between sizes, but the neckline might only move 0.25 inches</li>
                                            <li><strong>Armhole and sleeve balance:</strong> The sleeve cap and armhole must be graded in relation to each other or the sleeve will pull, twist, or restrict movement</li>
                                            <li><strong>Length ratios:</strong> Body length, sleeve length, and rise should scale proportionally, not uniformly</li>
                                            <li><strong>Fit testing on real bodies:</strong> At minimum, test the smallest, the base, and the largest size before going to bulk</li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4]">
                                        <Image src="/blog/v2-fit-testing-garment.png" alt="Garment fit testing across multiple sizes" width={800} height={600} className="w-full h-auto object-cover" />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-3 text-center">Every size should look intentional, not like a stretched or shrunken version of the sample</p>
                                </div>
                            </div>

                            {/* Common Mistakes */}
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Mistakes We See Founders Make with Fit</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-8">
                                    These are not beginner mistakes. We see established brands run into these problems because fit is genuinely one of the hardest things to get right in garment manufacturing. But being aware of them can save you a lot of money and frustration.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-red-500 font-bold text-xl">1.</span>
                                            <h3 className="text-lg font-bold text-[#2D2A2E]">Only Approving the Sample Size</h3>
                                        </div>
                                        <p className="text-[#666666] leading-relaxed">
                                            Your Medium fits perfectly. Great. But you never saw the XS or the XXL before approving bulk. When those sizes arrive and the fit is off, it is too late. Always request graded samples across at least three sizes before signing off.
                                        </p>
                                    </div>

                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-red-500 font-bold text-xl">2.</span>
                                            <h3 className="text-lg font-bold text-[#2D2A2E]">Assuming Grading is Automatic</h3>
                                        </div>
                                        <p className="text-[#666666] leading-relaxed">
                                            Some founders think the factory just &quot;makes it in other sizes&quot; once the sample is approved. Grading is a separate, skilled process. If you do not discuss grade rules with your manufacturer, they are going to use whatever default they have. And that default might not match your fit intent at all.
                                        </p>
                                    </div>

                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-red-500 font-bold text-xl">3.</span>
                                            <h3 className="text-lg font-bold text-[#2D2A2E]">Mixing Fit References from Different Brands</h3>
                                        </div>
                                        <p className="text-[#666666] leading-relaxed">
                                            &quot;I want the fit of Brand X in a Medium but Brand Y in an XL.&quot; This sounds reasonable, but it creates a grading nightmare. Every brand has its own grade rules, its own proportions, its own fit philosophy. Mixing references across sizes produces an inconsistent product that does not feel like one cohesive collection.
                                        </p>
                                    </div>

                                    <div className="bg-[#F8F7F4] p-8 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-red-500 font-bold text-xl">4.</span>
                                            <h3 className="text-lg font-bold text-[#2D2A2E]">Ignoring the Spec Sheet</h3>
                                        </div>
                                        <p className="text-[#666666] leading-relaxed">
                                            A graded spec sheet should list every measurement for every size in your range. If your manufacturer is not providing one, or if you are not reviewing it before bulk, you are flying blind. This document is your insurance policy for consistent fit.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pro Tips */}
                            <div className="mb-12 bg-gradient-to-br from-[#2D2A2E] to-[#3D3A3E] p-8 md:p-12 rounded-2xl text-white">
                                <h2 className="text-2xl font-bold mb-6">What to Ask Your Manufacturer About Fit</h2>
                                <p className="text-white/80 leading-relaxed mb-8">
                                    You do not need to become a pattern making expert. But asking the right questions will immediately separate you from 90% of brands that just hand over a sketch and hope for the best.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 text-[#CBB49A]">Ask for Their Grade Rule Table</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            A competent manufacturer should be able to show you exactly how each measurement scales between sizes. If they cannot produce this document, that is a red flag. At Krazy Kreators, we share grade rule tables as part of every development package.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 text-[#CBB49A]">Request Fit Samples in Three Sizes</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            Before bulk, ask to see the base size, the smallest size, and the largest size. This gives you a real picture of how the grading holds up at the extremes. Issues are always most visible at the ends of the size range.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 text-[#CBB49A]">Clarify Your Fit Intent Early</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            Is your brand oversized, relaxed, or true to size? This changes everything about how the pattern is drafted and how the grading rules are set. Do not assume your manufacturer knows your fit philosophy. Spell it out in the tech pack.
                                        </p>
                                    </div>
                                    <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                                        <h4 className="font-bold mb-2 text-[#CBB49A]">Review the Graded Spec Sheet</h4>
                                        <p className="text-white/80 leading-relaxed">
                                            Before production, you should receive a full graded spec sheet listing every measurement for every size. Check it against your fit intent. If the XL chest measurement does not make sense relative to the Medium, catch it now, not when 500 units land at your warehouse.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mb-12" ref={endOfArticleRef}>
                                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Your Customers Should Never Have to Guess Their Size</h2>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    Inconsistent fit across sizes is not just a production issue. It is a brand trust issue. When a customer buys a Medium from you once and it fits perfectly, they expect the next Medium to fit the same way. And they expect the Large they buy for a friend to feel proportionally right too.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    At Krazy Kreators, pattern making and grading are handled in-house by dedicated technical designers who work on your fit from the first sample through to the final graded production pattern. We do not outsource it, we do not use generic grade rules, and we do not let anything go to bulk without a full graded spec review.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                                    You focus on the design. We make sure it fits every body it is supposed to.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg mt-4 font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    Get Expert Fit Guidance
                                </Button>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-100 pt-10 mt-16 mb-12">
                            <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <h4 className="font-bold text-[#2D2A2E] text-lg">Did this guide help you understand fit better?</h4>
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
                                            placeholder="Have a question about fit or grading? Ask here..."
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
                                        <p className="text-gray-500 font-medium">No comments yet. Have a question about fit or grading? Ask below!</p>
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
