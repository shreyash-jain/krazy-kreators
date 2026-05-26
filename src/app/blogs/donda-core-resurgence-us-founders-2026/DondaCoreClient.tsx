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

const BLOG_ID = "donda-core-resurgence-us-founders-2026";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function DondaCoreClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
                    src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779781812/blog/donda_core_hero.jpg"
                    alt="Macro close-up of a heavyweight cotton streetwear hoodie — visible rib-knit cuff, dense brushed-fleece interior, reinforced hem stitching — the construction layer underneath a culturally-anchored drop"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">8 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 23, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        What US Founders Should Steal<br className="hidden sm:block" /> from the DONDA-Core Resurgence
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The era is incidental. The model is the lesson.
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
                                <p className="text-sm text-[#666666]">Hosted on May 23, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                February 2026 marked the <strong>ten-year anniversary</strong> of The Life of Pablo. By March, DONDA-era references were back across resale platforms, runway shows, and US streetwear collabs. Throwback hockey jerseys sold out in twenty-four hours. Bright camo was on the front of the line again. Limited drops with cultural anchoring outperformed every traditional collection-launch this quarter.
                            </p>

                            <p className="mb-6">
                                The reflex read of all this is nostalgia. The era is back. People miss the moment. Buy the merch. That read misses the actual story.
                            </p>
                            <p className="mb-12">
                                DONDA-core in 2026 is not a costume. It is a blueprint. The brands paying attention — Kith, Aimé Leon Dore, Supreme, Corteiz, Denim Tears, Greedy Unit, Organic Garmentz, Homerun — are not selling the throwback. They are running the playbook the throwback came from. Cultural anchor. Limited unit count. Product that holds up as an artifact. This is what US founders should actually be taking from the resurgence. The era is incidental. The model is the lesson.
                            </p>

                            {/* Section 1: Three mechanics */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Three Mechanics Underneath</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-12 font-medium">
                                    Strip the throwback aesthetic out and the mechanics underneath are simple. They have been simple for ten years. The brands operating them well are the ones outperforming.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Cultural anchoring</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Verifiable, specific</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Every drop is tied to a specific moment, song, place, or memory. Not &quot;inspired by the era.&quot; Anchored to something the audience can verify in five seconds — a date, a venue, a track listing, a city. The verification is the point. The audience that knows is the audience that buys.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Scarcity by design</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">200–500 units</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Limited unit counts, sold once, never restocked. Not 5,000 pieces. Not 1,500. Two hundred to five hundred units per drop, sold to a list that has been earned by the brand, gone before noon. The scarcity is not artificial — it is a manufacturing decision made at the spec sheet, months before launch.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Product as artifact</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Built for the archive</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Every piece feels like it has a place in a cultural archive, not a seasonal catalog. Premium construction. Named fabric. The story of the drop printed on the inside of the garment, not buried on a marketing landing page. The product is the marketing.</p>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666]">
                                    None of these three on their own are new. The brands that have been compounding for ten years are the ones running all three together, every drop, without compromising any of them the moment growth pressure arrives.
                                </p>
                            </div>

                            {/* Section 2: The data */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Data Behind It</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779781813/blog/donda_core_scarcity.jpg"
                                        alt="A single streetwear garment displayed alone on a sparse industrial rack against a concrete wall — scarcity by design, not by stockout"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The case is no longer anecdotal. Three data points from the last twelve months close it.
                                </p>
                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <ul className="space-y-4 m-0 p-0 list-none">
                                        <li className="text-[#666666] text-lg leading-relaxed m-0">
                                            <strong className="text-[#2D2A2E]">DTC CAC is up 25 to 40 percent year over year</strong> across most US apparel verticals. Traditional collection launches are getting more expensive to acquire customers for, every quarter, in a way that does not have a cheap fix.
                                        </li>
                                        <li className="text-[#666666] text-lg leading-relaxed m-0">
                                            <strong className="text-[#2D2A2E]">Drop-based cadences show better full-price sell-through and lower returns.</strong> Customers who buy a limited drop do not return it for a refund the way they return a seasonal piece bought on a coupon.
                                        </li>
                                        <li className="text-[#666666] text-lg leading-relaxed m-0">
                                            <strong className="text-[#2D2A2E]">Resale value on drop products is the cleanest signal of cultural confidence.</strong> A piece that trades above retail on resale is a piece whose next drop sells out faster than the last.
                                        </li>
                                    </ul>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    Read together, these are not three trends. They are the same trend. The economics of the seasonal collection launch are eroding. The economics of the culturally-anchored drop are improving. The gap widens every quarter.
                                </p>
                            </div>

                            {/* Section 3: What founders should steal */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">What US Founders Should Steal</h2>
                                <p className="text-xl text-[#666666] mb-10 font-medium">Four moves. Treat them as an operating standard, not a marketing tone.</p>

                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779781814/blog/donda_core_artifact.jpg"
                                        alt="A single folded streetwear piece presented on a dark museum-style platform with a small inscribed brass plate — product treated as an artifact, not a catalog item"
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
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Stop launching &quot;spring collection.&quot;</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Launch one piece tied to one moment. The collection launch is the lowest-converting unit of fashion marketing in 2026. The drop is the highest. Pick one piece, write the story behind it, set a date, ship it. Iterate from there.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">02.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Anchor every drop to a specific cultural reference your audience can verify.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Not vague. Not generic. A specific year, venue, song, color, athlete, neighborhood. The audience that can verify the reference is the audience that becomes a buyer. The reference does the work no paid campaign can do at the same cost.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">03.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Build product that holds up as an artifact.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Premium construction. Named fabric. Hand-finishing where it shows. The drop story printed on the inside of the garment tag. A drop product that feels like a catalog piece will not get the resale lift that makes the next drop sell out faster. The artifact is the marketing asset.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">04.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Skip discounts on drop products. Ever.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Let them sell out at full price. The minute a drop product is discounted, the cultural confidence in the next drop drops with it. Customers learn fast. If your drops are going to be discounted in eight weeks, they will wait eight weeks. The discount is the death of the model.</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* Section 4: Manufacturing implication */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why the Drop Model Is a Manufacturing Decision</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779781815/blog/donda_core_batch.jpg"
                                        alt="A small batch of identical streetwear garments in an atelier — controlled run, full construction quality, the manufacturing reality behind a drop-based brand"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The reason most US brands cannot run a drop model — even when they understand it — is the manufacturing relationship.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The traditional 5,000-unit collection-launch factory is not designed for drops. Minimums are wrong. Fabric is sourced as a one-time buy, not from a partner who can hold a small reorder six months later. QC is built around scale, not artifact-level finishing on a two-hundred-piece run. A brand running drops needs a partner who can do 200 to 500 unit runs at full construction quality. Fabric sourced from named mills that can serve the next drop. QC that treats every piece in a 300-unit run the way a luxury house treats a 30-piece runway capsule. Sample-to-bulk drift treated as a defect, not a tolerance.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    This is also where the model meets the broader 2026 shift away from aesthetic-anchored brands. The drop model is the operational expression of a{" "}
                                    <Link href="/blogs/quiet-luxury-dead-whats-next-us-brands-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        perspective-anchored brand
                                    </Link>
                                    . It is also the natural pairing with the{" "}
                                    <Link href="/blogs/made-in-india-american-luxury-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        Made-in-India craft positioning
                                    </Link>
                                    {" "}some founders are now building on. Different positioning lever, same operational requirement: a partner built for small-batch, repeatable, high-finish runs.
                                </p>
                            </div>

                            {/* Section 5: What to avoid */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What to Avoid</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The downside of a cultural moment opening up is that brands without the product depth try to ride it.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    Performative DONDA-core — the aesthetic without the artifact — reads as costume. A throwback graphic on a low-GSM hoodie that ships from the same factory as every other DTC brand will sell the first drop on hype and the second drop never. The audience that knows the reference is the audience that can spot the gap between the reference and the product, inside the first purchase.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The brands that earn the next five years of US streetwear are the brands whose product survives the scrutiny of the customer who knows. The brands that engineer a one-quarter spike on the aesthetic and then run out of cultural credit do not get a second window.
                                </p>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">A Model, Not a Moment</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    DONDA-core in 2026 is a model, not a moment. The US brands that copy the merch lose. The US brands that internalize the playbook — cultural anchor, limited drop, product as artifact — own the next five years of US streetwear.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    The era is incidental. The mechanics are not. The brands that built the original wave were operating these mechanics ten years ago, in real time, in front of an audience that did not need them explained. The 2026 advantage is that the playbook is now visible. The work is to run it.{" "}
                                    <Link href="/case-studies" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        See how drop-based product runs on a real production line.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Build for the Drop Model</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    US streetwear founders building drop-based models — 200 units or 5,000, every drop ships to the same construction standard. Partner with Krazy Kreators.
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
