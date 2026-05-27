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

const BLOG_ID = "80-percent-us-clothing-brands-fail-5-years-operational-mistakes";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function FiveYearFailClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
        const action = isLiked ? "unlike" : "like";
        try {
            const newCount = await likeBlog(BLOG_ID, action);
            recordBlogLikeUpdate(BLOG_ID, newCount);
            setIsLiked(!isLiked);
            setLikeCount(newCount);
        } catch (error) {
            console.error(`Failed to ${action} blog ${BLOG_ID}`, error);
            showToast("Failed to update like. Please try again.", "error");
        }
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
        } catch (error) {
            console.error("Failed to update comment like", error);
            showToast("Failed to update comment like", "error");
        }
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
                    src="https://res.cloudinary.com/dprx4pret/image/upload/v1780041209/blog/five_year_fail_hero.jpg"
                    alt="A single garment being inspected close-up on a daylit factory floor — the operational scrutiny moment that decides whether a US clothing brand survives year five"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 26, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Why 80–90% of US Clothing Brands<br className="hidden sm:block" /> Fail in 5 Years
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The failure is almost never creative. It is four operational decisions made in the first 90 days.
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
                                <p className="text-sm text-[#666666]">Hosted on May 26, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                Between <strong>80 and 90 percent</strong> of new US clothing brands fail by year five. The One Fourth data is widely cited and rarely interrogated.
                            </p>

                            <p className="mb-6">
                                The story most founders tell themselves about that data is that the failure was creative. The product wasn&apos;t right. The aesthetic didn&apos;t land. The market shifted underneath them. A bigger brand happened to launch the same idea three months earlier. That story is almost never true.
                            </p>
                            <p className="mb-12">
                                The failure is operational. And not in some abstract &quot;execution beats ideas&quot; sense. In a much more specific one: four decisions, all made in the first ninety days, all before a single garment ships, account for most of the closures. None of them are creative failures. All of them are visible at the time they happen, to anyone willing to look. This is the operational map of where US clothing brands actually die — what the four mistakes are, how they compound, and what the surviving ten to twenty percent did differently.
                            </p>

                            {/* Mistake 1: Wrong Manufacturer */}
                            <div className="mt-16 mb-20">
                                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-200">
                                    <span className="text-2xl font-black text-[#CBB49A] tracking-tight">MISTAKE 01</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10">Wrong Manufacturer</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The pattern is consistent across the founders who do not make it to year three. Pick a manufacturer on price. The factory turns out to be cheap, slow, or unaccountable — usually all three.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The first sample takes six weeks instead of three. The bulk order ships late, then ships defective. The founder spends the next four months chasing the factory by email, by WhatsApp, by escalation, and through a relationship that was never built to absorb that level of accountability in the first place.
                                </p>

                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">The cost is not the cheap unit price.</h3>
                                    <p className="text-[#666666] m-0 text-lg leading-relaxed mb-4">
                                        It is the season-long delays that destroy the launch calendar. Bulk orders that cannot be sold at full margin because the product was already discounted by the time it shipped. Founder time consumed entirely by factory management when it should be on brand-building.
                                    </p>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The harder part: this mistake is highly visible <em>before</em> signing. The signal is in the sourcing conversation itself. A factory that takes four days to respond to a sourcing inquiry will take six days to respond to a production crisis. A factory that will not share its AQL standards is a factory whose QC standards are negotiable. A factory that will not connect you with two comparable-size brand references is a factory that knows those brands would not recommend it.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    A founder who treats the manufacturer-selection conversation like a vendor pitch instead of a long partnership audit pays for that compression later, at a multiple.{" "}
                                    <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        The full cost of getting this one wrong is its own piece.
                                    </Link>
                                </p>
                            </div>

                            {/* Mistake 2: Wrong MOQ Math */}
                            <div className="mt-20 mb-20">
                                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-200">
                                    <span className="text-2xl font-black text-[#CBB49A] tracking-tight">MISTAKE 02</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10">Wrong MOQ Math</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780041211/blog/five_year_fail_inventory.jpg"
                                        alt="Stacks of unsold cardboard inventory boxes in a warehouse — the operational cost of accepting a 5,000-unit MOQ when the brand actually needed 500"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The pattern is simpler. The factory&apos;s minimum order quantity is 5,000 units. The brand needs 500.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The founder runs the math, decides 5,000 units is &quot;fine because it lowers the per-unit cost,&quot; signs the PO, and ships the first collection into a warehouse. Eight months later, the brand has sold 700 units. The other 4,300 are tying up the capital that was supposed to fund the next collection. The brand has no runway, and the next collection has no money, and the cycle ends.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The math is more brutal than that summary makes it sound. If the brand sells 500 units at $150 each in eight months, that is $75,000 in revenue against a production cost that was probably $200,000 to $250,000 for the full 5,000-unit run. The &quot;lower per-unit cost&quot; looks like savings on paper. It is a forty-percent capital sink in practice.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The fix is structural, not tactical. The brand does not need to negotiate the factory&apos;s minimum down. It needs a manufacturing partner whose model accommodates small-batch from the start. The brands that built around small-batch from the first run are the ones still operating in year five —{" "}
                                    <Link href="/blogs/zero-moq-no-warehouse-launch-clothing-brand-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        the Zero MOQ playbook is what that looks like operationally.
                                    </Link>
                                    {" "}Founders who interpret &quot;MOQ is just how the industry works&quot; as fact have already made the mistake. It is no longer how the industry works. It is how a specific tier of factories still works.
                                </p>
                            </div>

                            {/* Mistake 3: Wrong Sampling Cycle */}
                            <div className="mt-20 mb-20">
                                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-200">
                                    <span className="text-2xl font-black text-[#CBB49A] tracking-tight">MISTAKE 03</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10">Wrong Sampling Cycle</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780041212/blog/five_year_fail_samples.jpg"
                                        alt="A garment rack holding five near-identical sample iterations of the same piece, each with a sample tag — the visible cost of a sampling cycle that should have taken two rounds and took five"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The pattern shows up in the calendar.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    A brand that should take two sample iterations to get to production-ready takes five. Each iteration burns one to three weeks of calendar time, depending on shipping, fabric availability, and the factory&apos;s queue. Five iterations instead of two is, conservatively, eight extra weeks. Eight weeks is the difference between launching with a season and missing it.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The cost is rarely visible in the moment because each individual iteration feels reasonable. &quot;We just need to revise the placket.&quot; &quot;The fabric weight is a touch off.&quot; &quot;Let&apos;s tweak the rib at the cuff.&quot; Every revision is justifiable in isolation. The aggregate is a launch date that slips by two months, a marketing campaign that gets spent on product that is not on the shelf, and a brand that runs out of attention before the product is ready.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The fix is upstream. A partner that reads the tech pack the first time, asks the questions that prevent the second and third iteration upfront, and ships the second sample close to production-ready is solving a calendar problem before it becomes a cash problem. The number of sample iterations a brand needs in its first season is a clean diagnostic for whether the manufacturing relationship is going to survive year two. Two samples is healthy. Three is acceptable. Five is the failure mode in motion.
                                </p>
                            </div>

                            {/* Mistake 4: Wrong Fabric Sourcing */}
                            <div className="mt-20 mb-20">
                                <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-200">
                                    <span className="text-2xl font-black text-[#CBB49A] tracking-tight">MISTAKE 04</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10">Wrong Fabric Sourcing</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780041214/blog/five_year_fail_fabric.jpg"
                                        alt="A flat-lay of four premium fabric swatches with small handwritten provenance tags — what naming the mill on the product page actually requires upstream"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The pattern is the most expensive of the four because it does not show up as a single failure event. It shows up as a slow erosion of every other metric.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The brand prices the product into the premium band — somewhere between $150 and $400 per piece — but the fabric was sourced on a procurement basis. Generic mill, no name on the product page, no story the customer can repeat. The garment arrives. The customer can feel the gap between the price and the hand. The return rate climbs. The reviews soften from &quot;love it&quot; to &quot;fine for the price.&quot; Repeat purchase rates drop. Customer acquisition cost, which was already expensive, effectively doubles because retention is no longer absorbing the spend.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    This is the mistake that founders almost always misdiagnose as a marketing problem. &quot;The brand needs better positioning. The campaign isn&apos;t landing. The audience isn&apos;t right.&quot; None of that is true. The product is undermining the brand on first touch, every time.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The fix is to treat fabric as a positioning lever, not a procurement decision. Name the mill on the product page. Source from suppliers whose hand actually matches the price point the brand is asking the customer to pay. Specify yarn count, weave structure, and finish on the spec sheet the way a wine list specifies vintage. The brands that win the premium contemporary band in 2026 are the brands whose fabric story is on the product page in the first paragraph, not under &quot;details.&quot;
                                </p>
                            </div>

                            {/* The Common Thread */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Common Thread</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    All four mistakes share a single feature.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    They are all decisions made in the first ninety days, before a single garment ships. They are pre-product. They are pre-launch. They are pre-the-moment-the-founder-thinks-the-real-work-starts. By the time the first collection is in the field, the four decisions have already been made, and the brand&apos;s chances of being in business in year five have been substantially set.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    This is the part of the failure rate that the lazy creative narrative misses entirely. The brands that fail are not the ones with bad ideas. The brands that fail are the ones who protected a creative idea from operational scrutiny in the months when scrutiny would have been free. The brands that survive year five are not the most original. They are the ones who got the manufacturer right, the MOQ math right, the sampling cycle right, and the fabric story right, before the brand had a single follower. A founder who treats year-one operations as something to figure out after launch is a founder writing year-five&apos;s obituary in advance.
                                </p>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Operational Discipline, Not Originality</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    The ten-to-twenty percent of US clothing brands that survive year five share a pattern. Operational discipline in the first ninety days. None of the four mistakes above, or at most one of them caught early enough to course-correct without burning the cash runway.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    The brands that fail share the opposite pattern. A creative idea protected from operational scrutiny long enough to become the entire brand. By the time the operational reality lands, the brand is too late to absorb the correction.{" "}
                                    <Link href="/case-studies" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        See how this looks on the production side of brands that crossed year five.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Build to Survive Year Five</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    US founders building to survive year five — partner with Krazy Kreators in the first ninety days. We take the operational risk off the table before your product ships.
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
