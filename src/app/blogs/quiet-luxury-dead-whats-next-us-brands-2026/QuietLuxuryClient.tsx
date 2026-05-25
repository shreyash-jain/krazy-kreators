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

const BLOG_ID = "quiet-luxury-dead-whats-next-us-brands-2026";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function QuietLuxuryClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
                    src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779715991/blog/quiet_luxury_hero.jpg"
                    alt="Editorial diptych of a minimalist beige cashmere sweater on the left and a maximalist gold-embroidered ivory silk jacket on the right — the death of one aesthetic and the rise of the next"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 22, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The Quiet Luxury Aesthetic Is Dead.<br className="hidden sm:block" /> What&apos;s Next for US Brands?
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Aesthetics die. Perspectives don&apos;t. Build like one.
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
                                <p className="text-sm text-[#666666]">Hosted on May 22, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                The aesthetics that defined US fashion for the last twenty-four months — <strong>quiet luxury, clean girl, old money</strong> — are not on their way out. They are already out. They are in every Target collection, every Shein dupe, every algorithm-served Instagram grid. The category has collapsed into sameness, and the brands that built their entire identity around it now look indistinguishable from the mass-market interpretations.
                            </p>

                            <p className="mb-6">
                                This is not a hot take. It is a calendar entry. Aesthetic cycles compress every year, and the one that just compressed was the one most US contemporary brands were anchored on.
                            </p>
                            <p className="mb-12">
                                The honest question is not whether quiet luxury is dead. It is whether your brand was built on an aesthetic or on a perspective. Because the brands built on an aesthetic die when the aesthetic dies. The brands built on a perspective evolve through three of them and never lose the customer.
                            </p>

                            {/* Section 1: The Signs */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">How We Know It Is Over</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The death of quiet luxury was not sudden. It was a fade, and three signals are now all pointing the same way.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Peak in 2024</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Search trend</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Aesthetic search terms like &quot;clean girl&quot; and &quot;quiet luxury&quot; peaked in 2024 and have been steadily declining since. The Google Trends curve looks like every prior aesthetic cycle — normcore, athleisure, balletcore — at the same point in the fade.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Met Gala 2026</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Cultural counter-signal</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">This year&apos;s Costume Art theme was explicitly the opposite of quiet luxury. Maximal craft, statement-making, hours-of-work as the marketing. The biggest cultural moment in fashion in 2026 was a public vote against minimalism.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">+30% YoY</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Techwear searches</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">25%+ of US shoppers still search by aesthetic, but where they are searching has shifted. Techwear, gorpcore-adjacent, and craft-coded terms are up 30% year over year. The audience did not stop shopping by vibe. They changed the vibe.</p>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666]">
                                    None of these alone would close the case. Together they describe one motion. A category that peaked, saturated, commodified, and is now being actively replaced by the audience itself.
                                </p>
                            </div>

                            {/* Section 2: What Dies / What Doesn't */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What Dies. What Doesn&apos;t.</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779715996/blog/quiet_luxury_commodified.jpg"
                                        alt="Overhead flat-lay of seven near-identical beige and oatmeal minimalist sweaters folded in a stack — the visual of total category commoditization"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Pull the lens back. Aesthetics have always died. Crafts never have.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    Normcore peaked in 2014 and dissolved by 2016. Athleisure peaked in 2018 and was a Target category by 2020. Balletcore peaked in 2023 and is currently a Shein search filter. Quiet luxury is now joining that list, on roughly the same compression curve. None of these aesthetics actually disappeared from clothing. They disappeared as a positioning lever. The minute Target can interpret an aesthetic, the brand that built its identity on it is competing with Target.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    Craft does not run that curve. Hand embroidery has been a positioning asset for two hundred years. Hand-finishing, named fabric provenance, complex construction — none of these have ever been commoditized by a fast-fashion retailer because the cost structure does not allow for it. A brand whose product is genuinely hand-finished in a named region cannot be replicated by Target. It can be undercut on price. It cannot be replicated on signal. That is the difference between an aesthetic and a craft, and that is what makes the difference durable.{" "}
                                    <Link href="/blogs/what-2026-met-gala-taught-us-fashion-founders-craft" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        The 2026 Met Gala made this explicit in front of every fashion customer at once.
                                    </Link>
                                </p>
                            </div>

                            {/* Section 3: What's Next */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What Is Actually Next</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779715999/blog/quiet_luxury_next.jpg"
                                        alt="A single technical charcoal nylon coat with a tonal embroidered crest and exposed-zipper system on a matte-black hanger — the perspective-driven hybrid that signals post-quiet-luxury positioning"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-12 font-medium">
                                    Three durable signals are replacing the aesthetic-anchored model. Each is already in motion in the data.
                                </p>

                                <div className="space-y-6 mb-10">
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Craft-coded fashion</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">The Met Gala 2026 vocabulary — hours, hand-built, one piece at a time — has now landed in the language the customer uses to describe desirable product. The Made-in-India wave is the same signal at the sourcing layer. Craft is the most durable replacement for aesthetic because it cannot be commoditized at scale.{" "}
                                                <Link href="/blogs/made-in-india-american-luxury-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                                    The cultural reframe is underway in real time.
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Techwear and tech-integrated apparel</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Techwear search is up 30 percent year over year. Functional fabrics, exposed zipper systems, water-resistant coatings, modular pocket geometry — the things that were niche in 2022 are now sitting in the contemporary band. The category rewards brands that can credibly engineer a garment, not just style one.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">DONDA-core / limited-drop streetwear</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">The TLOP ten-year anniversary in February pulled an entire generation back into the limited-drop, culturally-anchored streetwear playbook. Small batches, named collaborators, drops that close in hours. This is not a return to 2016. It is a return to a model — scarcity plus cultural anchor — that consistently outperforms aesthetic cycles.</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666]">
                                    These three are not mutually exclusive. The strongest US brands of the next twenty-four months will pick one as the anchor and let the others show up at the edges of the line.
                                </p>
                            </div>

                            {/* Section 4: Aesthetic vs Perspective */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">Aesthetic or Perspective</h2>
                                <p className="text-xl text-[#666666] mb-10 font-medium">The audit is one question, answered honestly.</p>

                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dn9snfizy/image/upload/v1779716006/blog/quiet_luxury_perspective.jpg"
                                        alt="A designer's working table with overlapping fabric swatches, a sketch on cream paper, and a leather-bound notebook — a brand's perspective being built before the aesthetic resolves"
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
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Write your brand in one sentence without using an aesthetic word.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">No &quot;minimalist.&quot; No &quot;quiet.&quot; No &quot;clean.&quot; No &quot;old money.&quot; If you cannot describe the brand without leaning on the aesthetic vocabulary, the brand is the aesthetic. That brand is in trouble. The brand whose sentence holds without those words has a perspective and is fine.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">02.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Ask whether your customer can describe what the brand stands for.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Not how it looks — what it stands for. If the answer is some version of &quot;clean, minimal, neutral,&quot; the customer is describing the aesthetic. If the answer is a point of view on how the customer wants to live, dress, or move through a day, the customer is describing a perspective. The first will erode with the cycle. The second compounds across cycles.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">03.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Check whether your next collection could change aesthetic without breaking the brand.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">If you launched a craft-heavy or techwear-leaning capsule tomorrow, would your customer still recognize the brand? Perspective-anchored brands can move through aesthetics; aesthetic-anchored brands cannot. The whiplash test is the cheapest diagnostic you have.</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* Section 5: Manufacturing implication */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why This Is a Manufacturing Decision</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Both replacements for quiet luxury — craft-coded and tech-integrated — sit on the same operational requirement.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    A craft-heavy capsule needs hand embroidery, hand-finished construction, and named-mill fabric. A techwear capsule needs functional fabric sourcing, seam-sealing capability, and reinforced pocket construction. A drop-anchored streetwear capsule needs the ability to run small batches with controlled fabric and trims. None of these are commodity-factory deliverables.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    A brand moving from an aesthetic anchor to a perspective anchor needs a manufacturing partner who can iterate fabric and construction at the speed of the brand&apos;s thinking. Sample turns measured in weeks. Small-batch runs that do not penalize the brand for moving with the customer. The partner is not the one optimizing for the lowest unit cost on a single SKU. The partner is the one optimizing for the brand&apos;s ability to keep up with itself.
                                </p>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Quiet Luxury Was a Moment</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    The brands that anchored on it are now competing with Old Navy. The brands that used quiet luxury as an aesthetic but anchored on a perspective are entering the back half of 2026 with optionality.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    None of this means the brands currently sitting in the quiet luxury category are finished. It means the work for the next twelve months is to surface the perspective that the aesthetic was masking and re-cut the product around it. Craft, tech, drop — the lane is a choice. The lane is also urgent.{" "}
                                    <Link href="/case-studies" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        See how perspective-led brands move from aesthetic to anchor on a real product line.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Rebuild Around a Perspective</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    US founders rebuilding around a perspective, not an aesthetic — design-to-production agility for the next era. Partner with Krazy Kreators.
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
