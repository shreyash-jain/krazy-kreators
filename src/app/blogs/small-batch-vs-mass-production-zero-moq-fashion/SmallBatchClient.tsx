"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle, X } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";
import { FAQS } from "./faqs";

const BLOG_ID = "small-batch-vs-mass-production-zero-moq-fashion";

const HERO_IMAGE = "/blog/small-batch-vs-mass-production-zero-moq-fashion-hero.jpg";
const SECTION1_IMAGE = "/blog/small-batch-vs-mass-production-zero-moq-fashion-section1.jpg";
const MACRO_IMAGE = "/blog/small-batch-vs-mass-production-zero-moq-fashion-macro.jpg";
const WIDE_IMAGE = "/blog/small-batch-vs-mass-production-zero-moq-fashion-wide.jpg";
const CLOSING_IMAGE = "/blog/small-batch-vs-mass-production-zero-moq-fashion-closing.jpg";

const TOC = [
    { id: "mass-production", label: "What is mass production?" },
    { id: "small-batch", label: "What is small-batch manufacturing?" },
    { id: "key-differences", label: "Small batch vs mass production" },
    { id: "why-zero-moq", label: "Why zero MOQ is gaining ground" },
    { id: "compete", label: "Competing with bigger brands" },
    { id: "cost-effective", label: "Is zero MOQ really cheaper?" },
    { id: "choosing-partner", label: "Choosing a manufacturing partner" },
    { id: "kk-support", label: "How we support flexible production" },
    { id: "conclusion", label: "The future is flexible" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

/* Teaching graphic — unit cost vs capital-at-risk, no invented figures, directional only */
function CostVsRiskGraphic() {
    return (
        <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
            <p className="text-lg font-bold text-[#2D2A2E] mb-1">Two lines moving in opposite directions</p>
            <p className="text-sm text-[#666666] mb-4">Cost per garment falls as order size grows. Cash locked in unsold stock grows with it.</p>
            <svg
                viewBox="0 0 960 320"
                role="img"
                aria-label="Line chart with order size on the horizontal axis, from a small pilot run to a large bulk order. One line, cost per garment, starts high and falls steadily as order size increases. A second line, capital tied up in unsold stock, starts low and rises steadily as order size increases. The two lines cross roughly in the middle of the chart."
                className="w-full h-auto min-w-[640px]"
            >
                <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">Cost per garment vs. capital at risk</text>
                <text x="0" y="46" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Directional only — the actual numbers depend on your fabric and factory</text>

                {/* axes */}
                <line x1="60" y1="80" x2="60" y2="270" stroke="#B0AAA2" strokeWidth="1.5" />
                <line x1="60" y1="270" x2="920" y2="270" stroke="#B0AAA2" strokeWidth="1.5" />
                <text x="490" y="300" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Order size, small pilot run &rarr; large bulk order</text>

                {/* cost-per-unit line: falls */}
                <polyline points="60,100 260,150 460,190 660,222 860,246" fill="none" stroke="#8C7355" strokeWidth="3.5" />
                <text x="70" y="94" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#8C7355">Cost per garment</text>

                {/* capital-at-risk line: rises */}
                <polyline points="60,250 260,215 460,175 660,135 860,95" fill="none" stroke="#CBB49A" strokeWidth="3.5" />
                <text x="700" y="88" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">Cash tied up in unsold stock</text>

                {/* crossover marker */}
                <circle cx="460" cy="182" r="5" fill="#2D2A2E" />
                <text x="475" y="178" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#2D2A2E">where the two trade off</text>
            </svg>
            <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                A lower price per piece at scale is real. So is more of your cash sitting in boxes if the run does not sell. See the actual per-unit numbers at each order size in our <Link href="/blogs/no-moq-clothing-manufacturers" className="underline text-[#CBB49A] hover:text-[#b7a078]">MOQ ladder breakdown</Link>.
            </figcaption>
        </figure>
    );
}

export default function SmallBatchClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("mass-production");
    const [showStickyMobileCta, setShowStickyMobileCta] = useState(true);
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
    const asideRef = useRef<HTMLElement | null>(null);
    const tocBoxRef = useRef<HTMLDivElement | null>(null);
    const articleRef = useRef<HTMLElement | null>(null);
    const [railState, setRailState] = useState<"above" | "pinned" | "below">("above");
    const [tocGeometry, setTocGeometry] = useState<{ left: number; width: number }>({ left: 0, width: 220 });
    const [tocNaturalHeight, setTocNaturalHeight] = useState(0);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleScroll = () => {
            const top = window.scrollY;
            setScrolled(top > 100);
            const height = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(height > 0 ? Math.min(100, (top / height) * 100) : 0);

            for (let i = TOC.length - 1; i >= 0; i--) {
                const el = document.getElementById(TOC[i].id);
                if (el && el.getBoundingClientRect().top <= 140) {
                    setActiveSection(TOC[i].id);
                    break;
                }
            }

            const aside = asideRef.current;
            const article = articleRef.current;
            const tocBox = tocBoxRef.current;
            if (aside && article) {
                const asideRect = aside.getBoundingClientRect();
                const articleRect = article.getBoundingClientRect();
                const naturalH = tocNaturalHeight || tocBox?.offsetHeight || 600;
                let next: "above" | "pinned" | "below" = "above";
                if (asideRect.top < 112) {
                    next = articleRect.bottom > 112 + naturalH + 32 ? "pinned" : "below";
                }
                setRailState(next);
                setTocGeometry({ left: asideRect.left, width: asideRect.width });
                if (next === "above" && tocBox) {
                    setTocNaturalHeight(tocBox.offsetHeight);
                }
            }
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLike = async () => {
        const action = isLiked ? "unlike" : "like";
        try {
            const newCountValue = await likeBlog(BLOG_ID, action);
            recordBlogLikeUpdate(BLOG_ID, newCountValue);
            setIsLiked(!isLiked);
            setLikeCount(newCountValue);
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
            const newCountValue = await likeComment(commentId, action);
            setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: newCountValue } : c));
            setLikedComments((prev) => {
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
        setNewComment((prev) => ({ ...prev, [name]: value }));
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
                email: "",
                comment: created.comment,
                date: new Date(created.created_at).toLocaleString(),
                avatar: (created.name || "?").charAt(0).toUpperCase(),
                likes: 0,
            };
            setComments((prev) => [newCommentData, ...prev]);
            setCommentCount((prev) => prev + 1);
            setNewComment({ name: "", email: "", comment: "" });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const scrollToId = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
                <div
                    className="h-full bg-[#CBB49A] transition-[width] duration-150"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <Navbar invertTabs={!scrolled} />

            {/* Hero */}
            <section className="relative bg-[#2D2A2E] h-[64vh] min-h-[580px] max-h-[760px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image src={HERO_IMAGE} alt="Split-frame photograph: on the left, a dim, cool-lit stack of identical boxed garments receding into soft focus; on the right, a single illuminated garment on a form in warm light with open floor space around it." fill priority sizes="100vw" className="object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A2E] via-[#2D2A2E]/70 to-[#2D2A2E]/40" />
                </div>
                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Manufacturing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">8 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">November 24, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Small Batch vs. Mass Production:<br className="hidden lg:block" />{" "}
                        <span className="block lg:inline text-white">Why Zero MOQ Is the Future of Fashion</span>
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Not because small runs are cheaper. Because unsold stock is the more expensive mistake.
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">

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

                    <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-10 border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">· Production &amp; Sourcing</span></p>
                            <p className="text-sm text-[#666666]">Covers manufacturing models and production economics for US clothing founders · November 24, 2026</p>
                        </div>
                    </div>

                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Mass production lowers the price per garment. It also commits your cash to a guess before a single unit sells.</li>
                            <li>• <strong>Zero MOQ</strong> is not a promise of cheaper clothes — it is a way to test a product before you scale it.</li>
                            <li>• The real comparison is not cost per piece. It is <strong>capital at risk</strong> versus capital tied up in stock nobody asked for.</li>
                        </ul>
                    </div>

                    <div className="lg:hidden mb-10 -mx-4 px-4 overflow-x-auto">
                        <div className="flex gap-2 min-w-max pb-2">
                            {TOC.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => scrollToId(t.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${activeSection === t.id ? "bg-[#CBB49A] text-white border-[#CBB49A]" : "bg-white text-[#4A484A] border-gray-200"}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">

                        <aside ref={asideRef} className="hidden lg:block relative">
                            <div
                                ref={tocBoxRef}
                                style={
                                    railState === "pinned"
                                        ? { position: "fixed", top: 112, left: tocGeometry.left, width: tocGeometry.width, zIndex: 20, maxHeight: "calc(100vh - 132px)", overflowY: "auto" }
                                        : railState === "below"
                                            ? { position: "absolute", bottom: 0, left: 0, width: "100%" }
                                            : undefined
                                }
                            >
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-4">On this page</p>
                                <ul className="space-y-3">
                                    {TOC.map((t) => (
                                        <li key={t.id}>
                                            <button
                                                onClick={() => scrollToId(t.id)}
                                                className={`text-left text-sm leading-snug transition-colors ${activeSection === t.id ? "text-[#2D2A2E] font-semibold border-l-2 border-[#CBB49A] pl-3" : "text-[#666666] hover:text-[#2D2A2E] pl-3 border-l-2 border-transparent"}`}
                                            >
                                                {t.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-10">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-4">You might also like</p>
                                    <div className="space-y-4">
                                        <Link href="/blogs/no-moq-clothing-manufacturers" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">No MOQ clothing manufacturers</p>
                                        </Link>
                                        <Link href="/blogs/custom-clothing-manufacturing-cost" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Cost</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Manufacturing cost at every MOQ tier</p>
                                        </Link>
                                        <Link href="/blogs/on-demand-clothing-manufacturing-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">On-demand manufacturing in 2026</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {railState === "pinned" && <div aria-hidden style={{ height: tocNaturalHeight }} />}
                        </aside>

                        <article ref={articleRef} className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Opening */}
                            <p className="text-lg lg:text-xl text-[#2D2A2E] leading-snug mb-5 font-medium">
                                In March 2025, American Eagle wrote off <a href="https://www.nbcnews.com/business/business-news/american-eagle-shares-plunge-withdraws-guidance-2025-rcna206821" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">$75 million of spring and summer merchandise</a> that did not sell as planned, and pulled its guidance for the year. That is a public retailer with decades of sales data, still guessing wrong on a season&rsquo;s worth of stock committed months in advance.
                            </p>
                            <p className="mb-4 text-base lg:text-lg leading-snug">A founder placing a first production order is making the same bet with far less data and far less cash to absorb being wrong.</p>
                            <p className="mb-8 text-base lg:text-lg leading-snug">That is the real argument for small-batch and zero-MOQ manufacturing. Not that it is cheaper — it usually is not, per garment. It is that it lets you find out whether a style sells before you commit the capital a big order demands.</p>

                            {/* H2 1 — mass production */}
                            <section id="mass-production" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What Mass Production Actually Commits You To
                                </h2>

                                <figure className="not-prose my-8">
                                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4] max-w-2xl mx-auto">
                                        <Image src={WIDE_IMAGE} alt="Wide documentary photograph of a finishing warehouse: rows of identical garment bags on rolling racks receding into the distance under warm overhead light, conveying scale and uniform output rather than a sewing-machine close-up." fill sizes="(max-width: 672px) 100vw, 42rem" className="object-cover object-center" />
                                    </div>
                                    <figcaption className="mt-3 text-center text-sm text-[#666666] leading-snug">
                                        Scale is the point of mass production: identical units, identical specs, one decision made thousands of times over.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Mass production means committing to a large quantity of one design before you know whether it sells — usually because the per-unit price only gets competitive past a certain volume. The factory books your line time, buys fabric in bulk, and runs the same pattern over and over.</p>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-8 mb-3">Key characteristics</h3>
                                <ul className="list-none space-y-2.5 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li><strong className="text-[#2D2A2E]">Large quantities.</strong> Usually in the thousands per style and colour.</li>
                                    <li><strong className="text-[#2D2A2E]">Higher upfront investment.</strong> Fabric, cutting and the order itself are paid for before any garment reaches a customer.</li>
                                    <li><strong className="text-[#2D2A2E]">Standardised design.</strong> Little room to change a pattern mid-run.</li>
                                    <li><strong className="text-[#2D2A2E]">Bulk sourcing.</strong> Fabric and trims bought in the quantities the order needs, often with their own minimums.</li>
                                    <li><strong className="text-[#2D2A2E]">Longer commitments.</strong> The order, once placed, is not easily resized.</li>
                                </ul>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-8 mb-3">What it buys you, and what it risks</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">The honest trade: a lower cost per garment and output a brand can actually plan around, against a bigger bill if the forecast is wrong. It suits a label with sales history to forecast from. It punishes a guess.</p>
                                <div className="not-prose my-6 rounded-2xl border-l-4 border-[#8C7355] bg-[#F3F0EA] p-5">
                                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#8C7355] mb-2">Where this goes wrong</p>
                                    <ul className="space-y-1.5 text-sm lg:text-base text-[#4A484A] leading-snug">
                                        <li>• A style ordered at volume undersells and sits in a warehouse.</li>
                                        <li>• A design flaw found after cutting cannot be fixed mid-run.</li>
                                        <li>• A new brand with no sales history has nothing to forecast the order from.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 2 — small batch */}
                            <section id="small-batch" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What Small-Batch Clothing Manufacturing Actually Means
                                </h2>

                                <figure className="not-prose my-8">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4] max-w-xl mx-auto">
                                        <Image src={SECTION1_IMAGE} alt="A small rack holding a handful of finished garments in different colourways on hangers, one garment lit as the hero under directional light, shallow depth of field, the rest soft and unlit behind it." fill sizes="(max-width: 576px) 100vw, 36rem" className="object-cover object-center" />
                                    </div>
                                    <figcaption className="mt-3 text-center text-sm text-[#666666] leading-snug">
                                        A pilot run looks like this: one rack, a few colourways, enough to sell and learn from.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Small-batch manufacturing produces a limited quantity instead of committing to a full run. The design and the fabric are the same as any order — the difference is how much of it you make before you know it sells.</p>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-8 mb-3">How it works, in practice</h3>
                                <ol className="list-decimal pl-6 space-y-2 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li>Develop the design and a <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">tech pack</Link>.</li>
                                    <li>Build and approve samples, including a fit check.</li>
                                    <li>Produce a limited quantity — the pilot run.</li>
                                    <li>Sell it and watch what actually moves.</li>
                                    <li>Place a larger order only on the styles and colours demand supports.</li>
                                </ol>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-8 mb-3">Who this suits</h3>
                                <ul className="list-none space-y-2 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li>• Fashion startups without sales history to forecast from</li>
                                    <li>• Independent designers testing a new style or print</li>
                                    <li>• Boutique owners trying a line before a full stock commitment</li>
                                    <li>• D2C brands that can watch sell-through in real time</li>
                                    <li>• Labels deliberately keeping production closer to actual demand</li>
                                </ul>
                            </section>

                            {/* H2 3 — key differences + comparison table */}
                            <section id="key-differences" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Small Batch vs. Mass Production: The Real Differences
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Laid side by side, the two models trade the same few things against each other in opposite directions.</p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-lg font-bold text-[#2D2A2E] mb-4">Small batch vs. mass production, factor by factor</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[620px] text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="w-[26%] py-2 pr-3 text-xs font-bold uppercase tracking-[0.14em] text-[#999999]">Factor</th>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#CBB49A] rounded-tl-lg">Small batch</th>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#8C7355] rounded-tr-lg">Mass production</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-[#2D2A2E] leading-snug">
                                                {[
                                                    ["Order quantity", "Limited — a pilot run", "Large — thousands per style"],
                                                    ["Initial investment", "Relatively lower", "Higher"],
                                                    ["Inventory risk", "Lower", "Higher"],
                                                    ["Design flexibility", "High — easy to adjust next run", "Limited once the run is cut"],
                                                    ["Market testing", "Easier, built into the model", "Expensive to get wrong"],
                                                    ["Cost per unit", "Generally higher", "Generally lower"],
                                                    ["Scalability", "Gradual, demand-led", "High-volume from the start"],
                                                    ["Best suited for", "Startups and new styles", "Proven sellers with sales history"],
                                                ].map((row, i) => (
                                                    <tr key={row[0]} className={i === 0 ? "border-t border-gray-200" : "border-t border-gray-200"}>
                                                        <td className="py-3 pr-3 font-semibold">{row[0]}</td>
                                                        <td className="py-3 px-3 bg-[#F3EEE4]">{row[1]}</td>
                                                        <td className="py-3 px-3 bg-[#EFE6D9]">{row[2]}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        The right column is not wrong — it is built for a different problem than a new brand has.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Which model is right depends on what you are solving for: a known seller wants the lower unit cost of volume; an unproven one wants to spend less finding out whether it sells at all.</p>
                            </section>

                            {/* H2 4 — why zero MOQ */}
                            <section id="why-zero-moq" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why Zero MOQ Is Gaining Ground in Fashion Manufacturing
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-5">Flexible order quantities change what a new brand has to get right before it can launch at all.</p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The question is not how cheap the garment is. It is how much you have to be right about before you find out.&rdquo;
                                </blockquote>

                                <ul className="list-none space-y-4 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li><strong className="text-[#2D2A2E]">Starting without heavy upfront investment.</strong> A lower order quantity means less capital committed before the brand exists in anyone&rsquo;s hands.</li>
                                    <li><strong className="text-[#2D2A2E]">Less unsold inventory.</strong> Testing a product at pilot scale means a wrong guess costs a pilot run, not a warehouse.</li>
                                    <li><strong className="text-[#2D2A2E]">Room to test designs and trends.</strong> New colours, fabrics or patterns can be tried without a mass-production commitment behind each one.</li>
                                    <li><strong className="text-[#2D2A2E]">Faster response to real demand.</strong> Sales and customer feedback decide the next order, instead of a forecast made months earlier.</li>
                                    <li><strong className="text-[#2D2A2E]">Less pressure toward overproduction.</strong> Producing closer to what actually sells avoids manufacturing stock that was never going to move.</li>
                                </ul>
                            </section>

                            {/* H2 5 — compete */}
                            <section id="compete" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How Zero MOQ Helps Startups Compete With Established Brands
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">An established label can absorb a bad season. A new one usually cannot — so the advantage flexible manufacturing gives a startup is not matching a bigger brand&rsquo;s volume, it is not needing to.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">A smaller, more frequent launch cadence, built on pilot runs rather than seasonal bulk buys, lets a new label launch sooner, hold less exposure per style, build a genuinely niche collection instead of a broad one chasing everyone, and expand into a new market without betting the whole business on it.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">The trade is real too: a brand that never scales past pilot runs eventually caps its own margins, because per-unit cost stays high. Flexible manufacturing is a way in, not a permanent ceiling.</p>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Work out your numbers</p>
                                <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">Not sure if a pilot run pencils out for your design?</h4>
                                <p className="text-[#4A484A] leading-snug mb-4">Tell us the style, the fabric and the quantity you are weighing. We will walk you through what each option actually costs before you commit to either one.</p>
                                <button onClick={() => setContactOpen(true)} className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors inline-flex items-center gap-2">
                                    Talk through the numbers
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* H2 6 — cost effective, honest section */}
                            <section id="cost-effective" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Is Zero MOQ Manufacturing Really Cost-Effective?
                                </h2>

                                <CostVsRiskGraphic />

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-8 mb-3">What small-batch production actually costs</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">Not always, and not in the way it gets sold. Cost per garment is usually higher in a smaller run — fabric mills and dye houses have their own minimums regardless of what a factory's finished-garment MOQ says, sampling and pattern development is a flat cost whatever the quantity, and heavier customisation adds its own line item at any volume. We mapped the actual per-unit spread across order sizes in our <Link href="/blogs/no-moq-clothing-manufacturers" className="underline text-[#CBB49A] hover:text-[#b7a078]">MOQ ladder breakdown</Link>, and it is a real gap, not a rounding error.</p>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-8 mb-3">Why lower inventory risk matters more than cheap unit pricing</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">A cheaper per-piece price on stock that does not sell is not a saving. American Eagle&rsquo;s $75 million write-down was not a sign the company bought its goods badly — it was a sign that even a well-forecast order can miss, and the bill lands on whatever did not sell. A founder evaluating a first production run should weigh total cash committed and how long it sits in boxes, not only the number printed on the factory quote.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Fair concession: at genuine scale, with a proven seller, the unit-cost advantage of mass production is large enough that it usually wins outright. The comparison in this piece is for the decision a new or unproven style actually faces.</p>
                            </section>

                            {/* H2 7 — choosing partner */}
                            <section id="choosing-partner" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How to Choose the Right Clothing Manufacturing Partner
                                </h2>

                                <ul className="list-none space-y-2.5 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li><strong className="text-[#2D2A2E]">Flexible MOQ options.</strong> A real minimum, stated per style and per colour, not a marketing line.</li>
                                    <li><strong className="text-[#2D2A2E]">Fabric sourcing capability.</strong> Can they actually get your fabric at pilot-run volume?</li>
                                    <li><strong className="text-[#2D2A2E]">Sampling and design support.</strong> A tech pack process and a fit sample before anything scales.</li>
                                    <li><strong className="text-[#2D2A2E]">Quality control.</strong> Checks during the run, not only at the end. See our <Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">production timeline</Link> for where those checkpoints sit.</li>
                                    <li><strong className="text-[#2D2A2E]">Transparent pricing.</strong> A quote that shows what each line item is for.</li>
                                    <li><strong className="text-[#2D2A2E]">Production timelines.</strong> Realistic dates, stated upfront.</li>
                                    <li><strong className="text-[#2D2A2E]">Ability to scale.</strong> A partner who can take a pilot run into volume once it proves out, without starting over with someone new.</li>
                                </ul>
                            </section>

                            {/* H2 8 — KK support, named mid-body per owner's explicit brief */}
                            <section id="kk-support" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How Krazy Kreators Supports Flexible Fashion Manufacturing
                                </h2>

                                <figure className="not-prose my-8">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4] max-w-md mx-auto">
                                        <Image src={MACRO_IMAGE} alt="Macro photograph of a fabric swatch mid-cut on a pattern table, scissor blade and chalk marking visible at the fabric edge, shallow depth of field, no hands in frame." fill sizes="(max-width: 448px) 100vw, 28rem" className="object-cover object-center" />
                                    </div>
                                    <figcaption className="mt-3 text-center text-sm text-[#666666] leading-snug">
                                        Sampling and pattern work happen at pilot scale the same way they do at volume — the difference is how much gets cut after.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Krazy Kreators is a <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fashion manufacturing</Link> partner built around exactly this problem: design and tech-pack development, fabric and trim sourcing, sampling and fit development, quality inspection through the run, and small-batch or flexible-MOQ production that can scale once a style proves out.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Pilot runs of roughly 100 to 300 pieces per style or colour are workable depending on the fabric, with <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">end-to-end clothing production</Link> support available once a brand is ready to move past the pilot stage, through our wider manufacturing network for brands that need <Link href="/enterprise" className="underline text-[#CBB49A] hover:text-[#b7a078]">fashion brand manufacturing solutions</Link> at volume.
                                </p>

                                <div className="not-prose my-8 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Have an idea, not a warehouse</p>
                                    <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">Don&rsquo;t want to commit to a large production run yet?</h4>
                                    <p className="text-[#4A484A] leading-snug mb-4">Partner with Krazy Kreators to develop, sample and produce your collection with flexible manufacturing built for exactly this stage.</p>
                                    <button onClick={() => setContactOpen(true)} className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors inline-flex items-center gap-2">
                                        Explore manufacturing services
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </section>

                            {/* Conclusion */}
                            <section id="conclusion" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The Future of Fashion Is Flexible, Not Just Bigger
                                </h2>

                                <figure className="not-prose my-8">
                                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-[#F8F7F4] max-w-2xl mx-auto">
                                        <Image src={CLOSING_IMAGE} alt="An inspection lamp lit over a single finished garment laid flat on a quality-control table, a blank unmarked hangtag clipped to the sleeve, the rest of the room in soft shadow, no people in frame." fill sizes="(max-width: 672px) 100vw, 42rem" className="object-cover object-center" />
                                    </div>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fashion manufacturing is not splitting into cheap-and-risky versus expensive-and-safe. It is becoming more adaptable: small-batch production gives an emerging brand control over how much it bets before it knows the answer, and zero MOQ reduces exposure while a style is still unproven. Production can then scale as real demand, not a forecast, says it should.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    What would your next collection look like if the first run only had to prove the idea, not fund the whole season?
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-7">
                                    {FAQS.map((f) => (
                                        <div key={f.q}>
                                            <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">{f.q}</h3>
                                            <p className="text-base lg:text-lg leading-snug text-[#4A484A]">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* About Krazy Kreators */}
                            <div className="not-prose mt-12 mb-4 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">About Krazy Kreators</p>
                                <p className="text-[#4A484A] leading-snug">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design</Link>, sampling, <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">under one roof</Link>, from first sketch to shelf. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/zero-moq-no-warehouse-launch-clothing-brand-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Zero MOQ, No Warehouse: The 2026 Launch Playbook</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The three-step model for launching without a bulk order or a warehouse contract.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the playbook <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Weighing a pilot run against a bulk order?</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Tell a Krazy Kreators production lead your style, fabric and the quantities you are considering. We will tell you what each one actually costs and takes.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/no-moq-clothing-manufacturers",
                                            title: "No MOQ Clothing Manufacturers: What You Really Pay",
                                            dek: "The full per-unit cost spread, from a 10-piece pilot to a 1,000-piece order.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/custom-clothing-manufacturing-cost",
                                            title: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
                                            dek: "Where the real cost of a garment comes from, beyond the factory quote.",
                                            read: "10 min read",
                                        },
                                        {
                                            href: "/blogs/on-demand-clothing-manufacturing-2026",
                                            title: "On-Demand Manufacturing in 2026",
                                            dek: "Why the smartest new brands are producing less and selling more.",
                                            read: "8 min read",
                                        },
                                    ].map((card) => (
                                        <Link key={card.href} href={card.href} className="group block rounded-2xl border border-gray-100 overflow-hidden hover:border-[#CBB49A] transition-colors">
                                            <div className="p-6">
                                                <p className="text-xs font-medium text-[#666666] mb-2">{card.read}</p>
                                                <h4 className="text-lg font-bold text-[#2D2A2E] leading-snug mb-2 group-hover:underline">{card.title}</h4>
                                                <p className="text-sm text-[#666666] leading-relaxed">{card.dek}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="mt-16 pt-12 border-t border-gray-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <MessageSquare className="w-6 h-6 text-[#CBB49A]" />
                                    <h3 className="text-2xl font-bold text-[#2D2A2E]">Comments</h3>
                                </div>

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

                        </article>
                    </div>
                </div>
            </section>

            <Footer />
            <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
            <ToastContainer />

            {showStickyMobileCta && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#2D2A2E] text-white px-4 py-3 flex items-center justify-between shadow-2xl">
                    <button onClick={() => setContactOpen(true)} className="flex-1 text-left text-sm font-semibold">
                        Tell us your style and quantity &mdash; we&rsquo;ll tell you what it costs <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
