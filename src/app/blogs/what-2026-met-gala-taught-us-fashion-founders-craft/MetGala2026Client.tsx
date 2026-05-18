"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = "what-2026-met-gala-taught-us-fashion-founders-craft";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function MetGala2026Client({ initialLikeCount, initialComments }: BlogClientProps) {
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
                    src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779091040/blog/met_gala_craft_hero.jpg"
                    alt="Hand embroidery in progress on premium fabric — the craft moat for US fashion brands in 2026"
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
                            Strategy
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">9 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 14, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        What the 2026 Met Gala<br className="hidden sm:block" /> Taught US Fashion Founders About Craft
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Why craft is becoming the only defensible moat in US fashion
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
                                <p className="text-sm text-[#666666]">Hosted on May 14, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                On May 4, this year&apos;s Met Gala raised a record <strong>$42 million</strong> under a theme that anyone running a US clothing brand should be paying attention to. Costume Art. Anna Wintour, Venus Williams, Nicole Kidman, and Beyoncé took co-chair seats. Jeff and Lauren Sánchez Bezos came on as lead sponsors. The headline numbers were a record. The signal underneath them was bigger.
                            </p>

                            <p className="mb-6">
                                Fashion&apos;s biggest stage spent the night celebrating one idea. <strong>Clothing as craft. Clothing as art.</strong> Not clothing as product, not clothing as content, not clothing as merchandise. That distinction is worth your attention, because the audience watching that carpet is the audience your customer follows next.
                            </p>
                            <p className="mb-12">
                                For founders trying to build a US clothing brand in 2026, this was not a museum moment. It was a market signal. Here is what it actually means for product strategy over the next twelve months.
                            </p>

                            {/* Section 1: The craft hours */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Craft Hours That Defined the Night</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779091041/blog/met_gala_craft_hours.jpg"
                                        alt="Hand-finished panel with hand-rolled hems, bone needle, and thread spool representing the accumulated hours of craft"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Pay attention to the numbers that got repeated in every recap.
                                </p>
                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">761 hours.</h3>
                                    <p className="text-[#666666] m-0 text-lg leading-relaxed">
                                        That is the Chanel atelier&apos;s reported figure for Margot Robbie&apos;s gown. Not budget. Not square meters of fabric. Hours. The Chanel team led with the time, and the press repeated it as the headline, because the time <em>is</em> the value. The number was the marketing.
                                    </p>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    Beyoncé&apos;s skeletal-bone gown, designed by Olivier Rousteing, was hand-built one piece at a time. Sabrina Carpenter arrived in a dress constructed from layered film strips. Bad Bunny wore a deliberately aged look pitched as &quot;53 years old.&quot; Cher closed out the night in hand-laid Burberry lace. The blindfold motif Sarah Paulson and Rachel Zegler ran with was framed as a meditation on craft and the act of seeing.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    None of these gowns are commercially relevant. The vocabulary around them is. Hours. Hand-built. One piece at a time. That is the language fashion just trained the public to associate with desirable clothing.
                                </p>
                            </div>

                            {/* Section 2: Cultural shift */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What This Does to Consumer Expectations</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-6 font-medium">
                                    For roughly a decade, mainstream fashion conversation lived in the language of trend, drop, virality, and content. Costume Art was the first major industry moment in years that put the spotlight back on how a garment is actually built.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    That shift travels downstream faster than most founders assume. When the highest-status fashion event of the year publicly anchors value to <em>craft</em>, the customer at the bottom of the funnel starts to look for the same vocabulary in the brands they spend with. Not the gown. The story behind it. The thing they can describe to a friend.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    A founder selling into the US market in late 2026 is selling into a customer who has just spent two weeks watching fashion be discussed as art, with hours and hands attached. The benchmark for what counts as a desirable product just moved. Quietly, and across the entire category.
                                </p>
                            </div>

                            {/* Section 3: Market translation */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">The Market Translation for US Founders</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">Three data points from the last twelve months tell the same story when you line them up.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">25%+</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">of US shoppers</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">are now searching aesthetic-coded terms like &quot;clean girl&quot; and &quot;quiet luxury&quot; instead of category terms. They are not asking for a t-shirt. They are asking for a t-shirt with a describable story. That is a craft signal, not a SKU signal.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">60%+</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">of US consumers</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">say they will pay more for product they perceive as eco-friendly. Strip the headline and the through-line is the same. Customers will pay more when there is a story they can repeat. Sustainability is the most visible version. Craft is the more durable one.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">25–40%</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">CAC inflation</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">DTC customer acquisition costs are up that much over twelve months across most US apparel verticals. Paid content alone no longer builds a brand. The product itself has to carry meaning, or every dollar of acquisition is leasing attention you do not own.</p>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666] mt-10">
                                    Read together, these are not three trends. They are one trend. Customers are paying for clothing they can describe. The brands that win this decade are the ones whose product can be described in the first sentence, not after a paid creative campaign explains it for them.
                                </p>
                            </div>

                            {/* Section 4: What craft means */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What &quot;Craft&quot; Actually Means in 2026</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779091042/blog/met_gala_craft_techniques.jpg"
                                        alt="French seams, hand embroidery, premium selvedge fabric, and hand-bound buttonholes — the four components of craft in 2026"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Strip the aesthetic out of the word and craft, in product terms, is four things.
                                </p>
                                <div className="space-y-6 mb-10">
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Hand-finishing</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Visible human work on the garment. Hand-rolled hems. Hand-bound buttonholes. Hand-tacked linings. Small, photographable, and instantly legible to a customer who has been trained by the Met red carpet to notice them.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Embroidery and surface detail</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Threadwork, beading, appliqué. These are the techniques that read as craft in a single product image. Customers do not need a video to understand the value.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Complex construction</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Internal structure, multi-panel patterning, French seams, real boning, real shaping. The garment holds its form for a reason a customer can feel even if they cannot name it.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Premium fabric sourcing</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Specific mills, specific yarn counts, specific finishes. The fabric is named on the product page the way a wine is named on a menu, because that level of specificity is now what credibility looks like.</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    All four of these used to read as &quot;Italy only.&quot; That is no longer the constraint. A small US brand willing to work with the right manufacturing partner — the kind of partner small US founders increasingly find after{" "}
                                    <Link href="/blogs/us-fashion-brands-moving-from-china-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        moving their sourcing out of China
                                    </Link>
                                    {" "}— can put real embroidery, real construction, and named-mill fabric on its product page within a single development cycle.
                                </p>
                            </div>

                            {/* Section 5: Concrete moves */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">Three Moves to Make Inside the Next Ninety Days</h2>
                                <p className="text-xl text-[#666666] mb-10 font-medium">Treat craft as a product decision, not a marketing decision.</p>

                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779091043/blog/met_gala_craft_moves.jpg"
                                        alt="Garment audit on an atelier bench with folded seam, inner care label, and product story card"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="bg-[#2D2A2E] p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CBB49A] opacity-10 rounded-bl-full"></div>
                                    <ol className="space-y-8 relative z-10 list-none p-0 m-0">
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">01.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Audit one product the way a customer would.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Pick your best-selling SKU. Can a real customer describe how it is made, in their own words, after reading your product page? If the answer is no, you do not have a craft problem. You have a story problem. And the story will not stick unless the product backs it up.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">02.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Move at least one SKU to a hand-finished or constructed-detail variant.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Not the whole line. One product. Hand-embroidery, a structured panel, a premium named fabric. Test it as a premium tier alongside the existing version. Pair the rollout with an{" "}
                                                    <Link href="/blogs/on-demand-clothing-manufacturing-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-white">
                                                        on-demand production approach
                                                    </Link>
                                                    {" "}so you are not gambling on inventory while you learn the price elasticity of the craft tier.
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">03.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Tell the story in the first paragraph of the product page.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Not under &quot;Details.&quot; Not behind a &quot;See more&quot; tab. The hours, the technique, the fabric, the hand-work — in the opening copy where a customer actually reads. Hours. Hand-built. One piece at a time. That is the vocabulary that just got endorsed at the highest stage in fashion. Borrow it.</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Bottom Line</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    Fashion has shown the audience what craft looks like. The audience now expects it.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    The founders who treat that as a marketing problem will lose to the ones who treat it as a product problem. Paid creative is more expensive than ever, attention is shorter than ever, and the customer is now better trained than ever to recognize when a garment is built versus assembled. The brands that can answer &quot;how was this made&quot; in a single sentence, without flinching, will not need to outspend anyone. The brands that cannot will keep paying a CAC premium for product the customer cannot describe.{" "}
                                    <Link href="/case-studies" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        See how craft-led production reads on a real product line.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Build Product Customers Can Describe</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    US founders ready to put craft on the product page — design, sampling, fabric sourcing, and craft-led production, end to end. Partner with Krazy Kreators.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Start a Conversation
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
