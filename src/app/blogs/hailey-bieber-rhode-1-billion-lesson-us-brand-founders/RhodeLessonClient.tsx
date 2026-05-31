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

const BLOG_ID = "hailey-bieber-rhode-1-billion-lesson-us-brand-founders";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function RhodeLessonClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
                    src="https://res.cloudinary.com/dprx4pret/image/upload/v1780142709/blog/rhode_lesson_hero.jpg"
                    alt="A single ivory wool coat hanging on a long, otherwise empty industrial garment rack against a soft cream plaster wall — SKU restraint rendered as a single image"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 21, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Why Hailey Bieber&apos;s $1B Rhode Sale<br className="hidden sm:block" /> Matters for Every US Brand Founder
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The lesson is not celebrity. It is product discipline.
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
                                <p className="text-sm text-[#666666]">Hosted on May 21, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                In May 2025, e.l.f. Beauty acquired Hailey Bieber&apos;s Rhode for <strong>$1 billion</strong>. The brand was three years old. Projected FY26 revenue: <strong>$260–265 million</strong>. In April this year, Rhode dropped a single product — a pair of $490 carpenter-cut jeans — and it <strong>sold out in twenty-four hours</strong>.
                            </p>

                            <p className="mb-6">
                                Every US clothing founder reading those numbers assumes the lesson is celebrity. Rhode had a famous face. The conclusion travels something like: get famous, launch a product, exit at unicorn. <strong>That reading is wrong.</strong> And it is the most expensive reading a US founder can make this year.
                            </p>
                            <p className="mb-12">
                                Read the deal at the level e.l.f.&apos;s diligence team read it, and a different story comes out. The billion-dollar exit was not paid for personality. It was paid for product discipline. Here is what that actually means at the SKU level, and what US clothing founders should do with it in the next twelve months.
                            </p>

                            {/* Section 1: The wrong lesson */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Wrong Lesson</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Plenty of celebrity-fronted brands launched in the same window Rhode grew in. Most stalled.
                                </p>
                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">Same playbook. Different ending.</h3>
                                    <p className="text-[#666666] m-0 text-lg leading-relaxed">
                                        Kylie Jenner&apos;s KHY launched in October 2023 with arguably more raw reach than Rhode had at the same stage. The last twelve months have been a quiet pivot toward a more personal, LA-rooted positioning. The press was there. The unicorn offer was not. The variable is not the celebrity. The variable is what the celebrity is selling.
                                    </p>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    Rhode is not a face. It is a tightly run product company that happens to have one. When e.l.f.&apos;s deal team modeled the acquisition, they were not modeling Instagram followers. They were modeling SKU productivity, repeat-purchase rates, gross margin per unit, and the operational maturity to ship the same product, in spec, in every market e.l.f. would put it in.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The deal closed because that model worked. Not because Bieber&apos;s audience showed up — though it did — but because the underlying business had been built to survive the audience walking away. That is the lesson worth $260M in projected ARR. And it is available to any US clothing founder in 2026 who is willing to take it seriously.
                                </p>
                            </div>

                            {/* Section 2: What Rhode actually got right */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What Rhode Actually Got Right</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780142711/blog/rhode_lesson_sku_discipline.jpg"
                                        alt="Five garments laid flat in a disciplined row — the visual logic of a brand that ships fewer SKUs, each one earning its place"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-12 font-medium">
                                    At the operational level, Rhode broke from category norms in three specific places. None of the three require a celebrity to execute.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">SKU restraint</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Two-thirds fewer</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Rhode shipped roughly two-thirds fewer SKUs than the average DTC beauty brand at its stage. Where the category norm runs ten to twelve hero products plus twenty line extensions inside three years, Rhode held the line at a fraction of that. Every product earned its shelf. There was no graveyard of slow-movers being subsidized by the winners.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Describability</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">One sentence each</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Every Rhode product can be summarized in one sentence by a customer who has never used it. &quot;Lip tint with a peptide stick attached.&quot; &quot;The barrier-restoring face cream.&quot; &quot;The carpenter jeans.&quot; That clarity is not marketing copy applied after the fact. It is the product definition driving the brief upstream.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Repeatable quality</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Every batch, same spec</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Every batch shipped to the same standard. There is no Rhode review thread anywhere about formula drift between drops, color inconsistency, or packaging changes nobody announced. Rhode treated batch consistency as a product feature, not a manufacturing afterthought.</p>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666] mt-10">
                                    Three blocks. All three are decisions a founder makes at the product-development stage, with the right manufacturing partner, before a single dollar is spent on acquisition. None of them get easier later.
                                </p>
                            </div>

                            {/* Section 3: Why celebrity brands fail */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why Most Celebrity Brands Stall</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780142712/blog/rhode_lesson_authenticity.jpg"
                                        alt="Two near-identical white shirts hanging side by side — the quiet difference between an operated brand and a licensed one shows up in the product first"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The DTC graveyard is full of celebrity-fronted brands that did everything Rhode did, except the product work.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The pattern reads the same every time. A famous founder partners with a licensing agency or a fast-turn manufacturer. The product gets to market in months. The first drop sells through on the strength of the name. The second drop does sixty percent of the first. The third sells out only after a markdown. By month eighteen the brand is on a shelf at a discount retailer, or quietly winding down its DTC operation.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    Customers can tell the difference between a brand whose founder is operating it and a brand whose founder is licensing it. That difference shows up in the product before it shows up anywhere else. Inconsistent batches. Generic packaging that could belong to any brand. Product descriptions that read like they were written by a third party — because they were. The signals leak before the marketing can catch them.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    Authenticity, in 2026, is verifiable. The market punishes the licensed brand and rewards the operated one because the product itself tells the customer which is which, inside the first purchase. Rhode passed that test on the first lip tint. That is what acquirers were underwriting.
                                </p>
                            </div>

                            {/* Section 4: What founders should steal */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">What US Clothing Founders Should Steal</h2>
                                <p className="text-xl text-[#666666] mb-10 font-medium">Three moves. None of them cost more than a planning afternoon.</p>

                                <div className="bg-[#2D2A2E] p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CBB49A] opacity-10 rounded-bl-full"></div>
                                    <ol className="space-y-8 relative z-10 list-none p-0 m-0">
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">01.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Audit your SKU count against the first customer&apos;s memory.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Pull your current line. Can a person who has never used your brand hold every product in their head after reading the homepage once? If the answer is more than a brief hesitation, the line is too long. Rhode&apos;s discipline is not an aesthetic choice. It is a cognitive one. Customers do not buy from a shelf they cannot remember.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">02.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Write the one-sentence customer description for every product.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">For each SKU, in plain language, write the sentence a stranger could repeat to a friend after using the product once. If the sentence does not come out cleanly, the product is not finished. Either fix the product or cut the SKU. A line of eight products that can be described in eight sentences will out-sell a line of twenty that needs a hundred-word landing page to explain.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">03.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Move repeatability from marketing to manufacturing.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Repeatable quality is not a positioning statement. It is a manufacturing decision. It lives in fabric sourcing, in QC protocols, in whether your partner can ship the same garment, in the same fabric weight, in the same color, twelve months from now. If repeatability is something the brand promises but the factory cannot guarantee, the brand will break the promise on the third drop. That is the failure mode Rhode designed around from the first product.</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* Section 5: Manufacturing implication */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why This Is a Manufacturing Problem, Not a Marketing One</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780142713/blog/rhode_lesson_repeatability.jpg"
                                        alt="Three identical garments on dress forms in a working atelier — the manufacturing reality behind a brand that can promise the same product, twelve months from now"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The reason most US clothing brands cannot execute the Rhode playbook is that they do not have the manufacturing relationship to support it.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    A cheap factory will quote a great price on the first run, ship a B-grade batch on the third, and lose your tech pack on the fifth. That is not a manufacturing failure. That is the natural lifecycle of a transactional supplier relationship. It is also incompatible with the product discipline Rhode was built on. The brands paying for that lesson in real time are the ones that{" "}
                                    <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        chose the wrong manufacturer
                                    </Link>
                                    {" "}before they understood what consistency would cost them later.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    Repeatable product discipline at scale requires a partner who treats your spec sheet as a contract, not a suggestion. Fabric sourced from the same mill on every reorder. Construction standards documented and enforced. QC at the batch level, not the order level. Sample-to-bulk drift treated as a defect, not a tolerance.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The brands that exit at Rhode-level multiples in the next three years are the ones whose tenth batch is indistinguishable from their first. Many of the founders building toward that discipline are designers who already understand the importance of spec — the same kind of founder profiled in our piece on{" "}
                                    <Link href="/blogs/freelance-designers-launch-clothing-brand-90-days" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        launching a brand from a design background in ninety days
                                    </Link>
                                    . The discipline starts at the brief.
                                </p>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The 90/10 Ratio</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    Read the Rhode deal back through the deal model, not the press release. The exit was roughly 90 percent product and 10 percent personality. The personality opened the door. The product is what was inside the room.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    US clothing founders who flip that ratio in their own brands — 90 percent attention to founder presence, 10 percent attention to the product — will spend year five wondering why the acquirers stopped calling. Founders who hold the Rhode ratio will spend year five fielding offers. The math is unforgiving and it is also widely available. The only barrier between a US clothing brand and the kind of discipline that gets bought is whether the founder decides to build that way before the first SKU ships.{" "}
                                    <Link href="/case-studies" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        See how product-disciplined brands ship from design to delivery.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Build a Brand Acquirers Underwrite</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    US founders building for repeatable product discipline at scale — design, sampling, fabric sourcing, and consistent batch production, end to end. Partner with Krazy Kreators.
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
