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

const BLOG_ID = "us-fashion-brands-moving-from-china-2026";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function UsFashionBrandsClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
            avatar: (c.name || "?").charAt(0).toUpperCase(),
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
        if (typeof window === "undefined") return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLike = async () => {
        try {
            const action = isLiked ? "unlike" : "like";
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
            showToast("Link copied to clipboard!", "success");
        } catch {
            showToast("Failed to copy link", "error");
        }
    };

    const handleComment = () => {
        const commentsSection = document.querySelector("[data-comments-section]");
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleCommentLike = async (commentId: string) => {
        try {
            const action = likedComments.has(commentId) ? "unlike" : "like";
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
            alert("Please fill in all fields");
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
                avatar: (created.name || "?").charAt(0).toUpperCase(),
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
                    src="/blog/apparel_sourcing_hero.png"
                    alt="US Fashion Brands Moving Manufacturing Away from China in 2026"
                    fill
                    className="object-cover"
                    style={{
                        WebkitTransform: "translateZ(0)",
                        transform: "translateZ(0)",
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 9, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Why US Fashion Brands<br className="hidden sm:block" /> Are Moving Away From China in 2026
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        And what that means for your next manufacturing decision
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
                                        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                                    </button>
                                    <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                                        <MessageCircle className="w-4 h-4" />
                                        {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
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
                                <p className="text-sm text-[#666666]">Hosted on May 9, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                If you launched a clothing brand in 2024, you probably picked your manufacturer the way most founders did. A contact in Guangzhou. A friend who knew a sourcing agent in Yiwu. A platform that promised low MOQs out of Shenzhen. That math worked then. It does not work anymore.
                            </p>

                            <p className="mb-6">
                                Through 2025 and into 2026, the cost of importing finished apparel from China into the US has climbed in ways that have made even loyal brands open their search bar and type something like <strong>fashion manufacturing India vs China 2026</strong>. If that is roughly the search that brought you here, you are in the right place.
                            </p>
                            <p className="mb-12">
                                What follows is a plain-English breakdown of what changed, what it actually costs you, and how to think about your next production run without losing sleep over it.
                            </p>

                            {/* Section 1 */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What Changed Between the US and China</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Through late 2024 and across 2025, the US layered new tariffs onto Chinese-made apparel. Section 301 duties expanded. The de minimis loophole that let small parcels enter duty-free was tightened. A wave of additional surcharges pushed effective import costs on many garment categories well past the 40 percent mark.
                                </p>
                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">What that looks like in real numbers</h3>
                                    <p className="text-[#666666] m-0 text-lg leading-relaxed">
                                        A hoodie that landed in your warehouse for $14 in 2023 may now land for $22 to $26 once duties, broker fees, and the new compliance paperwork are accounted for. Multiply that by a 500-unit drop and the math gets uncomfortable fast.
                                    </p>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    For early-stage brands running on tight margins, the difference is often the gap between a profitable launch and a sold-out collection that lost money. The brands that adjusted early did three things. They moved final assembly out of China. They restructured their cost sheets. And they quietly told their accountants what they were doing.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why India Has Become the Most Searched Alternative</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                                    <div>
                                        <p className="text-xl leading-relaxed text-[#4A484A] mb-6 font-medium">
                                            There are other options. Vietnam, Bangladesh, Turkey, Portugal, Mexico. Each one makes a case. But search data through the first half of 2026 tells a clear story.
                                        </p>
                                        <p className="text-lg leading-relaxed text-[#666666]">
                                            India is the destination US founders are researching the most, and four reasons explain why.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-full min-h-[400px]">
                                        <Image
                                            src="/blog/indian_apparel_facility.png"
                                            alt="Modern Indian apparel manufacturing facility in 2026"
                                            fill
                                            className="object-cover transform hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Tariff Treatment</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">India is not subject to the same Section 301 surcharges that hit China. Standard duty rates apply, and the maturing India-EU FTA conversation has put India in stronger long-term standing than several alternatives.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Capacity at the Right Scale</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Vietnam is excellent for high-volume basics, but accessing it as a small founder is hard. Indian factories in Tirupur, Ludhiana, and the NCR are set up for the 50 to 5,000 unit range that growing US brands actually need.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">English-First Communication</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Tech packs, sample feedback, and contracts all happen in English without a translation layer. That alone removes a category of mistakes that costs founders weeks every season.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Technical Depth</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">India is one of the few countries that handles the full vertical stack. Fabric milling, dyeing, printing, hand embroidery, cut and sew, finishing, often within driving distance. You are not relying on subcontractors you have never met.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: China vs India */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">The Real Difference Between China and India</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">Founders ask this question all the time. The honest answer is: it depends on what you make and how you like to work. Here is a fair comparison without the marketing spin.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Quality</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Chinese factories built around fast fashion are excellent at producing huge volumes of consistent, simple garments quickly. India tends to outperform when designs involve detail. Embroidery. Custom prints. Garment dyeing. Mixed fabrics. If your brand identity leans on craft, India is usually the stronger choice.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Cost</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">The headline price in China is sometimes lower. The landed cost in 2026, after tariffs and duty, rarely is. For most US brands, the all-in cost from India now matches or beats China for orders under a few thousand units.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Communication</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">This is the silent killer. Most production failures trace back to a tech pack misread, a fabric substitution that was never approved, or feedback that took ten days to make it through three middlemen. India removes most of those friction points by default.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Speed</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">China still has the edge on raw turnaround for very large orders of basics. For smaller, design-led runs, India is competitive and often faster because you are not waiting on Chinese New Year shutdowns or shipping delays out of crowded ports.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: What to look for */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What to Look For in an India-Based Manufacturing Partner</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-10 font-medium">
                                    Switching countries is not the same as switching factories. You are inheriting a new supply chain, new compliance norms, and a new operating rhythm. Before you sign anything, look for these five things.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">A real sampling process</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Any partner you work with should commit to a fit sample, a pre-production sample, and a top-of-production sample. If they want to skip straight to bulk after one round, walk away.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Vertical capability or a tight network</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">You want someone who controls the fabric, trims, printing, and stitching, or who has trusted partners for each. Chains of unfamiliar subcontractors are how things go wrong.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">A single point of contact</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Not an inbox. Not a WhatsApp group with seven people in it. One project manager who owns your account and answers within a working day.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Transparent pricing</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Cost sheets that show fabric, trims, labor, and overhead separately. If you only see one final number, you cannot negotiate intelligently or plan a second order.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">5</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Compliance documentation</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Your buyers in 2026 will ask. EU shipments increasingly require Digital Product Passport readiness. US wholesale partners are asking for SA8000 or BSCI audit reports. Confirm your partner can produce these.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: 5 Questions */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">Five Questions to Ask Before Switching Production to a New Country</h2>
                                <p className="text-xl text-[#666666] mb-10 font-medium">Print these out before your next sourcing call.</p>

                                <div className="bg-[#2D2A2E] p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CBB49A] opacity-10 rounded-bl-full"></div>
                                    <ol className="space-y-6 relative z-10 list-none p-0 m-0">
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">01.</span>
                                            <p className="text-lg text-gray-200 leading-relaxed m-0">What is your minimum order quantity per style and per color, and is that flexible for a first-time order?</p>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">02.</span>
                                            <p className="text-lg text-gray-200 leading-relaxed m-0">Who is the dedicated project manager assigned to my account, and how do I reach them outside business hours?</p>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">03.</span>
                                            <p className="text-lg text-gray-200 leading-relaxed m-0">Can you walk me through every step from tech pack receipt to shipment, with realistic timelines?</p>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">04.</span>
                                            <p className="text-lg text-gray-200 leading-relaxed m-0">What happens if a sample fails approval. Who absorbs the cost and the time?</p>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">05.</span>
                                            <p className="text-lg text-gray-200 leading-relaxed m-0">Can you share three references from US brands at my volume that I can call directly?</p>
                                        </li>
                                    </ol>
                                    <p className="text-base text-gray-400 mt-8 relative z-10 italic">If a manufacturer cannot answer any of these clearly, that is your answer.</p>
                                </div>
                            </div>

                            {/* Section 6: How Krazy Kreators helps */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">How Krazy Kreators Supports US Brands Through the Transition</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Switching countries is the part most founders dread. Not because the destination is wrong, but because the move itself feels risky. We have helped US brands rebuild their supply chain in India end to end, and the way we structure the transition is designed to take that risk off your plate.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">One Dedicated Project Manager</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">Tech packs, samples, fabric approvals, and production updates all run through one person who answers in your time zone.</p>
                                    </div>
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">Zero MOQ on First Orders</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">Test a small run before committing to volume. No pressure to over-order on a market you are still validating.</p>
                                    </div>
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">Full Vertical Coverage</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">Fabric sourcing through finishing under one roof. You do not coordinate between a milling factory, a print shop, and a stitching unit yourself.</p>
                                    </div>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    Most of the founders we onboard tell us the same thing about three weeks in. It is the first time they have actually been able to focus on their brand instead of chasing factory updates.
                                </p>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Bottom Line</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    The 2025 tariff shift was not a temporary spike. It is the new structural reality of sourcing apparel for the US market.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    Brands that move thoughtfully now will spend the second half of 2026 building product and marketing campaigns. Brands that wait will spend it doing the same research everyone else is doing, six months later and with less leverage. If you are weighing the move, the most important thing you can do this week is talk to a partner who has actually run the transition for brands like yours. The math is rarely as scary as it looks once you see it on a real cost sheet.
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Switching Your Production Partner?</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Krazy Kreators manages the entire transition. Zero minimum order. One dedicated project manager. Book a free consultation and we will map out the move based on your real cost sheet.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Book a Free Consultation
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
                                            <Heart className={`w-5 h-5 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                                            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                                        </button>

                                        <button
                                            onClick={handleComment}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
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
                                                                        <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? "fill-[#CBB49A]" : ""}`} />
                                                                        {comment.likes} {comment.likes === 1 ? "Like" : "Likes"}
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
                                                    {showAllComments ? "Show Less Comments" : `Show All ${comments.length} Comments`}
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
