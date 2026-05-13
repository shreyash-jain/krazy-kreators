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

const BLOG_ID = "on-demand-clothing-manufacturing-2026";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function OnDemandManufacturingClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
                    src="/blog/on_demand_hero.png"
                    alt="On-demand clothing manufacturing for 2026 fashion brands"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">8 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 13, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        On-Demand Manufacturing in 2026<br className="hidden sm:block" /> Why Smart Brands Produce Less and Sell More
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The Zero MOQ playbook for launching without inventory risk
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
                                <p className="text-sm text-[#666666]">Hosted on May 13, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                There is a quiet shift happening in how clothing brands launch in 2026, and it is showing up in the only place that matters. The P&amp;L. Brands sitting on warehouses of unsold inventory from last season are watching their margins crater, while a new generation of founders is doing the opposite. They are producing 50 units. Then 200. Then 1,000. And they are doing it after the sale happens, not before.
                            </p>

                            <p className="mb-6">
                                The model has a name. <strong>On-demand manufacturing.</strong> Search volume for the term more than tripled across 2025, and the founders typing <strong>on demand clothing manufacturing 2026</strong> into a browser are not researching for fun. They are researching because the brand next to them just outsold them on half the inventory and a fraction of the capital risk.
                            </p>
                            <p className="mb-12">
                                Here is what the model actually is, why bulk stopped working for startups, and how to apply it to your own production without losing sleep over capacity or cost.
                            </p>

                            {/* Section 1 */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What On-Demand Manufacturing Actually Means at the Production Level</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Strip the buzzword off the model and it is straightforward. You produce garments in response to confirmed demand. Not forecasts, not a vibe from your founder gut, not a number a sourcing agent recommended over WhatsApp. A specific batch of orders comes in. That number of garments gets produced and shipped. The inventory loop runs almost flat.
                                </p>
                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">The three things that change</h3>
                                    <p className="text-[#666666] m-0 text-lg leading-relaxed">
                                        First, the factory holds raw materials and capacity, not finished garments. Second, batch sizes scale up and down per drop without renegotiating the relationship. Third, your cost-per-unit floats slightly with volume, but it no longer hides 30 percent waste from the units you never sold.
                                    </p>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    A brand running on-demand is not making garments cheaper per unit. It is making fewer wrong units. That is the whole game.
                                </p>
                            </div>

                            {/* Section 2 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why Bulk Became the Default and Why It No Longer Works for Startups</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-6 font-medium">
                                    Bulk ordering made sense in 2010. Factories needed predictable runs to schedule labor. Cost-per-unit dropped sharply at 1,000 pieces. Shipping containers were a fixed cost and you wanted them full. Retail stocking depended on physical shelves that had to be filled six months in advance.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    None of those constraints still hold for a 2026 D2C brand. You do not need 1,000 units to fill a shelf. You need 50 to validate, 200 to grow, and 1,000 only after the data tells you 1,000 is the right number. The factories that work with startups have already rebuilt around small batches because the demand pattern shifted under them.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The brands still ordering 1,000 units on day one are paying for a system designed for the brands they want to compete with, not the brand they actually are. The math punishes them on the way in and again on the way out.
                                </p>
                            </div>

                            {/* Section 3 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">The Real Cost of Unsold Inventory</h2>
                                <p className="text-xl text-[#666666] mb-12 font-medium">Most founders calculate inventory cost wrong. They look at cost of goods, multiply by units, and treat anything sold as profit. The math leaves out four numbers that quietly destroy small brands.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Warehousing</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Every unit you do not sell sits somewhere, and that somewhere has a monthly rate. A 1,000-unit overrun in a third-party 3PL adds anywhere from 200 to 800 dollars a month in pure storage, ticking until the inventory clears. For most early brands, that is more than their first month of paid ads.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Locked Capital</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Cash spent on bulk inventory is cash you cannot spend on creative, marketing, samples, or the next collection. Founders almost always discover this two months in, when the second drop is delayed because the first one is still in boxes.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Forced Discounting</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Unsold inventory has an expiry written into the cash flow statement. By month three you are running 20 percent off. By month six it is 40. The discount is not a marketing decision. It is the only way to free up working capital, and it trains your audience to wait for the next sale.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Seasonal Write-Off</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">If a style does not move by season end, the value collapses. The fabric is the same. The make is the same. The market just stopped caring. Brands holding bulk are forced to write this off as dead stock, and the loss rarely shows up in the founder&apos;s mental P&amp;L until it is too late.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">How On-Demand Production Works Step by Step</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-10 font-medium">
                                    The model has a rhythm. Once you have it set up with the right manufacturing partner, a complete run from order to shipment looks like this.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Tech pack and sample approval once per style</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Before any order goes live, the style is sampled, fit-approved, and locked. The factory now has a production-ready file it can run any time, in any quantity.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Fabric and trims held in batch lots</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Materials for that style are pre-sourced and held by the factory, not bought line-item per order. That single decision removes weeks of lead time on every reorder.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Order signal triggers a production batch</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">A preorder window closes, a drop sells out, or a wholesale PO lands. The order count becomes the batch size. Fifty units, two hundred, a thousand — the run starts at the number the market just confirmed.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Small-batch cut, sew, and finish</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Production runs on a short cycle because the file is locked and the materials are ready. A well-run small batch can move from trigger to packed in seven to fourteen days for most knit and woven categories.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">5</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">QC, finishing, and packaging</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Every batch is inspected before it leaves. The quality bar does not relax because the run is small. Care labels, hangtags, and polybags are added the same way they would be for a 5,000-unit order.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">6</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Direct ship to customer or 3PL</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Finished goods either ship straight to your fulfillment partner for a drop, or in some D2C setups, direct to the end customer. Either way, the goods do not sit. The next batch starts when the next signal lands.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5 */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Which Product Categories Benefit Most</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-10 font-medium">
                                    On-demand is not a universal answer. It rewards some categories aggressively and is neutral or wrong for others. Know which side your line sits on before you commit to the model.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Knits and cut-and-sew basics</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Tees, hoodies, joggers, sweats. Fabric is widely available, the process is fast, and the categories are the most price-sensitive to overproduction. On-demand is the dominant model here in 2026.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Printed graphics and streetwear drops</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Where the artwork is the draw, the body of the garment is a commodity. DTF and screen printing both adapt cleanly to short runs. Drop culture is built around this rhythm.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Limited editions and preorder collections</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Any style designed to live for a specific window. Preorder collections close before production even begins, which makes the order count the only number that matters. Inventory risk drops to near zero.</p>
                                    </div>
                                    <div className="p-8 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-4">Categories where on-demand is neutral or wrong</h4>
                                        <p className="text-lg text-[#666666] leading-relaxed">Heavy outerwear with long material lead times. Highly trimmed evening wear with custom hardware. Mass-market basics where per-unit price advantage at 5,000-plus volume actually does beat the inventory savings. Bulk still wins in those corners.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 6: Krazy Kreators */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">How Krazy Kreators&apos; Zero MOQ Model Is Built on the On-Demand Principle</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Zero MOQ is what on-demand manufacturing looks like when it is built into the partner relationship from day one. No floor, no commitment to a minimum, no penalty for starting small. The whole point is to remove the gap between confirmed demand and shippable product.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">One sample, no minimum</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">The first production run can be as small as the order count needs it to be. Test fifty units before scaling to two hundred. No penalty pricing, no hidden setup fees once the style is locked.</p>
                                    </div>
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">Reusable style files</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">Once a style is approved, the tech pack, fit notes, and material spec stay live. Restocks do not restart the timeline. A reorder can move from trigger to in-production the same week.</p>
                                    </div>
                                    <div className="p-8 bg-[#F8F7F4] rounded-2xl">
                                        <h4 className="text-xl font-bold text-[#2D2A2E] mb-3">Production on signal</h4>
                                        <p className="text-base text-[#666666] leading-relaxed">You decide what triggers the next batch. A preorder window closing. A wholesale PO arriving. A sellout on a drop. We schedule capacity around your signal, not a six-month forecast.</p>
                                    </div>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The brands we onboard on this model usually describe the same feeling after their first three drops. They sold every unit they produced, they did not pay for inventory they could not move, and they spent that capital on growth instead. That is the whole point.
                                </p>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Bottom Line</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    In a market where more than 60 percent of global shoppers are cutting fashion spending, the brands holding bulk inventory are competing on the wrong axis.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    The structural advantage in 2026 belongs to the brands that only produce what they sell. Smaller drops, faster cycles, less locked capital, no fire-sale at the end of the season. On-demand manufacturing is not a hack and it is not a trend that will reverse. It is the new floor for how lean fashion brands operate. The earlier you build your supply chain around it, the more your second year looks like growth instead of inventory cleanup.
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Only Produce What You Sell</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    Krazy Kreators&apos; Zero MOQ model gives you that control from your first order. Start your first on-demand production run with us — book a free call and we will map the timeline to your launch.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Start Your First On-Demand Run
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
