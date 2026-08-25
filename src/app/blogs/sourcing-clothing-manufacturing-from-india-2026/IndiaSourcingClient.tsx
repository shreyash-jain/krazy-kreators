"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle, X, Download } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = "sourcing-clothing-manufacturing-from-india-2026";

const HERO_IMAGE = "/blog/india-sourcing-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/india-sourcing-2026-section1.jpg";
const GARMENT_IMAGE = "/blog/india-sourcing-2026-garment.jpg";
const MACRO_IMAGE = "/blog/india-sourcing-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/india-sourcing-2026-closing.jpg";

const TOC = [
    { id: "losing-orders", label: "India spent this year losing US orders" },
    { id: "july-24", label: "What changed on July 24" },
    { id: "not-cheap", label: "Level, not cheap" },
    { id: "what-india-has", label: "What India has that the tier doesn’t" },
    { id: "cost-sheet", label: "The cost sheet, both ways" },
    { id: "where-it-costs", label: "Where India will cost you" },
    { id: "vetting", label: "Vetting a partner before you move a style" },
    { id: "the-move", label: "What we’d do in your shoes" },
    { id: "faq", label: "Common questions" },
];

const ACCENT = "#CBB49A";

type Faq = { q: string; a: string };

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
    faqs: Faq[];
};

/* ------------------------------------------------------------------ */
/* Infographic 1 — duty by origin on one $14 cotton knit tee           */
/* HTS 6109.10.00 general rate 16.5% + the Section 301 tier            */
/* Bar px = rate percentage x 14, so bar length is 100x the $ duty     */
/* ------------------------------------------------------------------ */
const ORIGIN_ROWS = [
    { origin: "India", stack: "16.5% + 10%", rate: "26.5%", duty: "$3.71", width: 371, fill: "#2D2A2E" },
    { origin: "Bangladesh", stack: "16.5% + 10%", rate: "26.5%", duty: "$3.71", width: 371, fill: ACCENT },
    { origin: "Vietnam", stack: "16.5% + 12.5%", rate: "29%", duty: "$4.06", width: 406, fill: ACCENT },
    { origin: "China", stack: "16.5% + 12.5% + 7.5%", rate: "36.5%", duty: "$5.11", width: 511, fill: "#8C7A5E" },
];

function OriginDutyGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                One $14 tee, four origins, after July 24
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Duty on a cotton knit tee at a $14 factory price. General rate of 16.5% plus the Section 301 tier the
                origin sits in. China also still carries its legacy 7.5% List 4A duty.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 300"
                    role="img"
                    aria-label="Bar chart of US duty by origin on a $14 cotton knit tee after 24 July 2026: India 26.5% or $3.71, Bangladesh 26.5% or $3.71, Vietnam 29% or $4.06, and China 36.5% or $5.11."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>Duty per tee by country of origin, August 2026</title>
                    {ORIGIN_ROWS.map((row, i) => {
                        const y = 20 + i * 68;
                        return (
                            <g key={row.origin}>
                                <text x="0" y={y + 20} fontSize="17" fontWeight="700" fill="#2D2A2E">
                                    {row.origin}
                                </text>
                                <rect x="120" y={y} width={row.width} height="30" rx="6" fill={row.fill} />
                                <text
                                    x={120 + row.width + 12}
                                    y={y + 21}
                                    fontSize="18"
                                    fontWeight="800"
                                    fill="#2D2A2E"
                                >
                                    {row.duty}
                                </text>
                                <text x="120" y={y + 48} fontSize="13" fill="#666666">
                                    {row.stack} = {row.rate}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                India and Bangladesh draw the identical bar. That is the point of the chart: the July action did not put
                India ahead of the rest of Asia, it stopped putting India behind.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 — the same duty across a 5,000-unit order             */
/* Bars scale from $25,550 (max) = 560px                                */
/* ------------------------------------------------------------------ */
const ORDER_ROWS = [
    { label: "India — 5,000 tees at $3.71 duty", total: "$18,550", delta: "", width: 407, fill: "#2D2A2E" },
    { label: "Vietnam — 5,000 tees at $4.06 duty", total: "$20,300", delta: "+$1,750", width: 445, fill: ACCENT },
    { label: "China — 5,000 tees at $5.11 duty", total: "$25,550", delta: "+$7,000", width: 560, fill: "#8C7A5E" },
];

function OrderDeltaGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                What the gap is worth on one order
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                The same 5,000-piece run, same $14 factory price, three origins. Duty only — freight, fees and brokerage
                sit on top of all three.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 270"
                    role="img"
                    aria-label="Bar chart of total duty on a 5,000-unit tee order: India $18,550, Vietnam $20,300 which is $1,750 more, and China $25,550 which is $7,000 more."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>Total duty on a 5,000-unit order by origin</title>
                    {ORDER_ROWS.map((row, i) => {
                        const y = 34 + i * 78;
                        return (
                            <g key={row.label}>
                                <text x="0" y={y - 8} fontSize="15" fontWeight="600" fill="#2D2A2E">
                                    {row.label}
                                </text>
                                <rect x="0" y={y} width={row.width} height="34" rx="6" fill={row.fill} />
                                <text x={row.width + 12} y={y + 24} fontSize="19" fontWeight="800" fill="#2D2A2E">
                                    {row.total}
                                </text>
                                {row.delta && (
                                    <text x={row.width + 108} y={y + 24} fontSize="15" fontWeight="700" fill="#8C7A5E">
                                        {row.delta}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Against China the gap is real money. Against Vietnam it is $1,750 &mdash; about the cost of one extra
                sample round and a fit correction. Do not move a supply chain for it.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */

export default function IndiaSourcingClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("losing-orders");
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
    const [magnetEmail, setMagnetEmail] = useState("");
    const [magnetSubmitted, setMagnetSubmitted] = useState(false);
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

            // JS-driven sticky rail with 3 states (CSS sticky breaks because globals.css forces overflow-x: hidden on html/body)
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

    const handleMagnetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!magnetEmail.trim()) return;
        setMagnetSubmitted(true);
        showToast("Origin comparison sheet on the way to your inbox.", "success");
    };

    const scrollToId = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Scroll progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
                <div
                    className="h-full bg-[#CBB49A] transition-[width] duration-150"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <Navbar invertTabs={!scrolled} />

            {/* Hero */}
            <section className="relative min-h-[640px] lg:min-h-[72vh] flex items-center justify-center overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20">
                <Image
                    src={HERO_IMAGE}
                    alt="Clothing manufacturing India export floor: a long steel rail of finished unbranded cotton shirts receding down a high-ceilinged concrete finishing hall, a worker's back sliding hangers along the rail under daylight from tall industrial windows."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Manufacturing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">11 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 22, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-6xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        Beyond China: Why More Fashion Brands<br className="hidden lg:block" /> Are Sourcing From India in 2026
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        India&rsquo;s US tariff penalty ended on July 24. The trade data hasn&rsquo;t caught up yet &mdash; and the duty change on its own will not pick your factory.
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">

                    {/* Interaction bar */}
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

                    {/* Byline */}
                    <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-10 border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">&middot; Production &amp; Sourcing</span></p>
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk &middot; August 22, 2026</p>
                        </div>
                    </div>

                    {/* Key takeaways */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Key takeaways</p>
                        <ul className="space-y-2 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>&bull; A cotton tee from India now clears at <strong>26.5%</strong>, against <strong>29%</strong> from Vietnam and <strong>36.5%</strong> from China &mdash; a change that took effect on <strong>24 July 2026</strong>.</li>
                            <li>&bull; The trade data still shows the old world: US apparel imports from India fell <strong>26.4%</strong> in the first five months of the year.</li>
                            <li>&bull; <strong>Bangladesh, Cambodia, Indonesia, Pakistan and Sri Lanka pay the same 26.5%.</strong> The duty removed India&rsquo;s penalty; it did not hand India an edge.</li>
                            <li>&bull; What decides it is non-tariff &mdash; the domestic fibre-to-garment chain on one side, a thin man-made-fibre base and incentive schemes with expiry dates on the other.</li>
                        </ul>
                    </div>

                    {/* Mobile jump pills */}
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

                    {/* Two-column: pinned rail + article */}
                    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">

                        {/* Desktop JS-pinned rail — 3-state (above / pinned / below) */}
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
                                        <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The US plus-one sourcing playbook</p>
                                        </Link>
                                        <Link href="/blogs/second-origin-costed-30-days" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">A second origin, costed in 30 days</p>
                                        </Link>
                                        <Link href="/blogs/exporting-apparel-from-india-checklist-first-time-buyers" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Exporting apparel from India: a first-time buyer&rsquo;s checklist</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {railState === "pinned" && <div aria-hidden style={{ height: tocNaturalHeight }} />}
                        </aside>

                        {/* Article */}
                        <article ref={articleRef} className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Opening */}
                            <p className="text-lg lg:text-xl text-[#2D2A2E] leading-snug mb-5 font-medium">
                                Sourcing clothing manufacturing from India got materially cheaper for US brands on 24 July, and almost nobody has re-run their numbers since.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Look up the trade data and you will think the opposite is happening. It shows India losing US orders all year, heavily. That data is a rear-view mirror, and what it is reflecting ended five weeks ago.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Here is what actually changed on that date, what it conspicuously did not change, and why the gap between the published figures and the current rate is the whole opportunity.
                            </p>

                            {/* H2 1 */}
                            <section id="losing-orders" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    India spent this year losing US orders
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Clothing manufacturing India quality control: two hands running a width of undyed cotton greige fabric across a backlit inspection frame in an Indian textile mill, the weave structure and a small slub flaw glowing through the light box."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Start with the awkward part. Over January to May, US apparel imports from India fell <strong>26.4%</strong>, while the total US apparel import market fell 9.3% &mdash; on <a href="https://www.apparelviews.com/bangladesh-retains-2nd-spot-in-us-apparel-market" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">OTEXA figures reported in July</a>. India did not hold its share. It lost roughly three times more than the market did.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Meanwhile the China volume everyone talks about did move. Shipments from China dropped 42.8% to $2.80 billion over the same five months. Cambodia took 14.9% more, Indonesia 5.5% more, and Vietnam held the top spot at $6.39 billion.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So the diversification is real, and it has been running for two years &mdash; we mapped where it was going in <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the US plus-one sourcing playbook</Link>. India simply was not the destination.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is the part that gets missed, though. India&rsquo;s apparel exports did not shrink &mdash; they were redirected. Ready-made garment exports grew <a href="https://openthemagazine.com/business/ready-made-garments-drive-indias-textile-export-growth-in-fy26" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">2.9% across the financial year to March 2026</a>, and shipments to the EU hit a record <a href="https://apparelresources.com/business-news/trade-business-news/indias-apparel-exports-eu-reach-record-us4-66-bn-fy26/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">$4.66 billion</a>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The US remains India&rsquo;s largest apparel customer at <a href="https://apparelresources.com/business-news/trade-business-news/indias-apparel-exports-eu-reach-record-us4-66-bn-fy26/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">$5,330 million, or 33.37% of the book</a>. But the EU is now within striking distance of it, which tells you those factories found other work.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The capacity did not disappear while America was not buying. It went to Rotterdam and Felixstowe.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That matters commercially. A factory that spent a year filling European orders is not a distressed supplier who will take anything, and it will not price like one.
                                </p>

                            </section>

                            {/* H2 2 */}
                            <section id="july-24" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What changed on July 24
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The temporary Section 122 duties ran out of time. What replaced them, at 12:01 a.m. eastern on 24 July, was the final action in the USTR&rsquo;s <a href="https://ustr.gov/about/policy-offices/press-office/fact-sheets/2026/july/fact-sheet-ustr-section-301-action-response-failure-60-economies-ban-imports-produced-forced-labor" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">forced-labor Section 301 investigations covering 60 economies</a>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It sorts trading partners into two tiers. Economies that have adopted a forced-labor import prohibition, or committed to one, pay an extra <strong>10%</strong>. Everyone else pays <strong>12.5%</strong>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    India landed in the 10% tier. Vietnam, Turkey, Thailand, the Philippines and China did not &mdash; <a href="https://www.gtlaw.com/en/insights/2026/7/ustr-imposes-new-section-301-forced-labor-tariffs-on-imports-from-60-economies" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Greenberg Traurig&rsquo;s breakdown lists both groups in full</a>. We covered the proposal stage of this action back in <Link href="/blogs/apparel-tariffs-july-2026-forced-labor-301-regime" className="underline text-[#CBB49A] hover:text-[#b7a078]">July, when the tiers were still a proposal</Link>; several countries moved between the two before the final notice.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    These duties stack. They sit on top of the <strong>MFN rate</strong> <em>(most-favoured-nation &mdash; the standard duty a product carries by classification)</em>, and on top of any other trade remedy already in force. A cotton knit tee sits under <a href="https://hts.usitc.gov/search?query=61091000" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">HTS 6109.10.00</a> at 16.5%, so India&rsquo;s tee pays 16.5 plus 10.
                                </p>

                                <OriginDutyGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    China is the outlier because it keeps its legacy List 4A duty as well. That is where the ten-point gap between India and China comes from &mdash; two separate actions, not one. The full origin-by-origin map of the new regime, including the three lanes that now pay nothing extra, is in <Link href="/blogs/section-122-tariff-replacement-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">what actually replaced Section 122</Link>.
                                </p>

                            </section>

                            {/* H2 3 */}
                            <section id="not-cheap" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The tariff made India level, not cheap
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is the sentence most coverage of the July action skipped. Bangladesh, Cambodia, Indonesia, Pakistan and Sri Lanka are all in the same 10% tier as India.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Which means a cotton tee from Dhaka and a cotton tee from Tiruppur now clear US customs at exactly the same 26.5%. Against China and Vietnam, India gained something real. Against the rest of Asia, it gained nothing at all.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    So if you are choosing between India and Bangladesh, put the duty line away. It is identical, and every argument that decides the question is somewhere else: fabric, development, communication, how a sample round actually goes.
                                </p>

                                <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 rounded-r-2xl mb-6 not-prose">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">The counterexample worth knowing</p>
                                    <p className="text-[#2D2A2E] text-base leading-snug">
                                        Qualifying apparel from the DR-CAFTA countries and from Canada and Mexico under USMCA is exempt from these duties entirely. If your garment can meet those rules of origin &mdash; and yarn-forward rules are strict &mdash; nothing in Asia competes with zero. For most cotton-led programmes that route is closed on fabric availability, which is exactly why it is worth ten minutes of checking rather than an assumption.
                                    </p>
                                </div>

                            </section>

                            {/* H2 4 */}
                            <section id="what-india-has" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What India has that the rest of the tier doesn&rsquo;t
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="India apparel manufacturer for startups: macro detail of freshly spun cotton yarn winding onto a bobbin on a ring-spinning frame, fibre twist and lint halo sharp in a narrow band of focus, rows of bobbins soft behind."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One structural thing, and it starts several steps before a sewing machine. India grows its own cotton &mdash; more of it than anyone &mdash; then spins, weaves, knits, dyes and cuts it without the cloth leaving the country. <a href="https://www.ibef.org/industry/textiles" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">India Brand Equity Foundation</a> puts the workforce across that chain at over 45 million.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Most competing origins import their fabric. That is the whole difference, and you feel it in two places.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Development gets faster.</strong> Changing a yarn count, a GSM or a shade means a conversation with a mill a few hours away, not a fabric order with its own lead time and its own customs entry. Short runs work for the same reason: the cloth already exists somewhere in the chain.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    <strong>Craft capacity is unusual.</strong> Hand embroidery, hand-finishing and small-batch surface work sit inside the same supply base as volume production &mdash; which is why the premium end of the market went there first, as we argued in <Link href="/blogs/made-in-india-american-luxury-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the &ldquo;Made in India&rdquo; shift in American luxury</Link>.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Ask where the fabric comes from. In most origins that is a shipping question. In India it is a driving question.&rdquo;
                                </blockquote>

                            </section>

                            {/* H2 5 */}
                            <section id="cost-sheet" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The cost sheet, both ways
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="Sourcing clothing manufacturing from India: an unbranded cream cotton poplin shirt on a tailor's dress form in hard raking afternoon light, collar roll and placket in relief, a half-finished muslin toile hanging behind."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Take a mid-weight cotton tee at a $14 factory price and run 5,000 of them. Duty is the only line changing here; freight, fees and brokerage land on all three origins.
                                </p>

                                <OrderDeltaGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Read the second gap more carefully than the first. Seven thousand dollars against China is a genuine argument for moving. One thousand seven hundred and fifty against Vietnam is not &mdash; a single fit problem, a delayed shipment or a 2% defect rate erases it without noticing.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Duty is also the line you control least. A factory price two dollars lower, or a lead time three weeks shorter, moves more money than the entire tariff difference between the two 10%-tier countries you are agonising over. The full re-costing method is in <Link href="/blogs/second-origin-costed-30-days" className="underline text-[#CBB49A] hover:text-[#b7a078]">a second origin, costed in 30 days</Link>.
                                </p>

                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Origin Comparison Sheet</h4>
                                        <p className="text-[#4A484A] leading-snug">One page that costs the same style across four origins side by side &mdash; factory price, duty at the current tier, freight, fees and landed cost per unit &mdash; plus the eleven questions to send a supplier before you request a quote. Spreadsheet + PDF.</p>
                                    </div>
                                </div>
                                {!magnetSubmitted ? (
                                    <form onSubmit={handleMagnetSubmit} className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            required
                                            value={magnetEmail}
                                            onChange={(e) => setMagnetEmail(e.target.value)}
                                            placeholder="Your work email"
                                            className="flex-1 px-4 py-3 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#CBB49A] outline-none text-[#2D2A2E]"
                                        />
                                        <button type="submit" className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors flex items-center justify-center gap-2">
                                            Send me the sheet
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">On its way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 6 — concession */}
                            <section id="where-it-costs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Where sourcing clothing manufacturing from India will cost you
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three things, and none of them are secret. Any Indian exporter will tell you the same if you ask directly.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Synthetics are the weak lane.</strong> India&rsquo;s strength is cotton, but a large share of world apparel trade is man-made fibre &mdash; performance knits, technical outerwear, anything with stretch and recovery. Despite a <a href="https://www.deccanherald.com/india/centre-approves-rs-10683-cr-pli-scheme-for-textiles-1028301.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">₹10,683 crore production-linked incentive scheme</a> aimed squarely at that gap, garment-side capacity has not caught up. For a technical product, Vietnam&rsquo;s 29% may still be the cheaper number.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Scale is not China&rsquo;s scale.</strong> India&rsquo;s entire ready-made garment export book runs to roughly $15.8 billion a year. Vietnam shipped $6.39 billion to the US alone in five months. If your programme needs 50,000 units of one style from one roof, the shortlist is short.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>The incentives have expiry dates.</strong> Indian quotes are shaped by export support schemes, and those schemes keep moving. Rates under the RoDTEP remission scheme were <a href="https://www.fibre2fashion.com/news/textile-news/india-halves-export-incentive-under-rodtep-scheme-308604-newsdetails.htm" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">cut by half</a> against a reduced budget, while the garment-specific RoSCTL rebate and a raw-cotton duty exemption <a href="https://www.fibre2fashion.com/news/textile-news/india-extends-rosctl-to-september-30-as-pli-anchors-growth-312000-newsdetails.htm" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">run only to 30 September and 31 October 2026</a> respectively.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    So a quote you accept in September may be resting on a subsidy that lapses before your goods ship. Ask what the price looks like without it.
                                </p>

                                <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 rounded-r-2xl mb-6 not-prose">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs you are comparing the wrong things</p>
                                    <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                        <li>&bull; Your spreadsheet has a duty column but no lead-time column.</li>
                                        <li>&bull; You are choosing between two countries in the same tariff tier on tariff grounds.</li>
                                        <li>&bull; Nobody has told you which mill the fabric comes from.</li>
                                        <li>&bull; The quote is valid for 90 days and the incentive behind it expires in 40.</li>
                                        <li>&bull; You are pricing a synthetic garment against a cotton benchmark.</li>
                                    </ul>
                                </div>

                            </section>

                            {/* H2 7 */}
                            <section id="vetting" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Vetting a partner before you move a style
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="India apparel manufacturer sampling room at dusk: paper pattern pieces and a steel rule on a long cutting table, calico toiles on a rail, warm desk lamps against blue evening light in the window, a person's back pinning a half-made garment to a stand form."
                                        width={1376}
                                        height={768}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Move one style, not a range.</strong> Pick the garment you understand best &mdash; the one whose fit problems you could describe from memory. A new origin should be tested against a known quantity, not a new design.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Ask about the mill, not just the factory.</strong> Who knits or weaves the cloth, where, and what is their run size. In India that answer is usually specific and nearby, and a supplier who cannot give it is buying on the open market &mdash; which is fine, but it changes your lead time and your shade consistency.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Send a real tech pack and budget two sample rounds.</strong> Most origin switches that go wrong go wrong here, not at the price stage &mdash; a point we have made at length in <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a tech pack actually is</Link>. Judge the second sample, not the first; the first tells you about the pattern, the second tells you about the factory.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Get the paperwork right before the goods move.</strong> Country of origin, the HTS classification you believe applies, and the duty stack on it all belong in writing with the commercial invoice terms. The mechanics for first-time importers are in <Link href="/blogs/exporting-apparel-from-india-checklist-first-time-buyers" className="underline text-[#CBB49A] hover:text-[#b7a078]">our checklist for exporting apparel from India</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <strong>Write a duty-adjustment clause.</strong> This regime is four weeks old and carries no expiry date, which is not the same as permanence. Any contract delivering more than a quarter out should say who absorbs a rate change, in a sentence, agreed in advance. Founders who had that clause in place on 24 July had a much better week than founders who did not &mdash; the background is in <Link href="/blogs/us-fashion-brands-moving-from-china-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">why US brands started moving production out of China</Link>.
                                </p>

                            </section>

                            {/* H2 8 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Cost one style in India properly this quarter, while the rest of the market is still reading trade data from the old regime and drawing the wrong conclusion from it. Do not move the whole range, and do not move anything at all on a 2.5-point duty gap.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    Move because the fabric conversation gets shorter and the development cycle gets faster, and let the duty be the reason it now pencils. If you costed India in the spring and put it aside &mdash; is the number you rejected even the right number any more?
                                </p>
                            </section>

                            {/* FAQ */}
                            <section id="faq" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Common questions
                                </h2>
                                <div className="not-prose space-y-4">
                                    {faqs.map((f) => (
                                        <div key={f.q} className="rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5">
                                            <h3 className="font-bold text-[#2D2A2E] mb-2 leading-snug text-lg">{f.q}</h3>
                                            <p className="text-[#4A484A] leading-snug">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* About Krazy Kreators */}
                            <div className="not-prose mt-12 mb-4 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">About Krazy Kreators</p>
                                <p className="text-[#4A484A] leading-snug">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design</Link>, sampling, <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">under one roof</Link>, from first sketch to shelf. Recent work is in the <Link href="/portfolio/luxury-wear" className="underline text-[#CBB49A] hover:text-[#b7a078]">luxury wear portfolio</Link>. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/second-origin-costed-30-days" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">A Second Origin, Costed in 30 Days</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">You know the rate. This is the four-week sprint that turns it into a real quote you can compare.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the sprint <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Cost one style in India this quarter</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about sourcing clothing manufacturing from India &mdash; the mill behind the fabric, the sample rounds, and what your style lands at after duty.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/us-plus-one-sourcing-playbook-2026",
                                            title: "The US Plus-One Sourcing Playbook",
                                            dek: "Why brands added an origin instead of replacing one — and where the money went.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/made-in-india-american-luxury-2026",
                                            title: "The &ldquo;Made in India&rdquo; Trend in American Luxury",
                                            dek: "The craft capacity that pulled the premium end of the market east first.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/why-fashion-brands-moving-manufacturing-to-india",
                                            title: "Moving Manufacturing to India",
                                            dek: "The case beyond cost — capability, chain control and what changes day to day.",
                                            read: "7 min read",
                                        },
                                    ].map((card) => (
                                        <Link key={card.href} href={card.href} className="group block rounded-2xl border border-gray-100 overflow-hidden hover:border-[#CBB49A] transition-colors">
                                            <div className="p-6">
                                                <p className="text-xs font-medium text-[#666666] mb-2">{card.read}</p>
                                                <h4
                                                    className="text-lg font-bold text-[#2D2A2E] leading-snug mb-2 group-hover:underline"
                                                    dangerouslySetInnerHTML={{ __html: card.title }}
                                                />
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
                                                                <span className="text-sm text-[#666666]">&bull;</span>
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

            {/* Mobile sticky bottom CTA */}
            {showStickyMobileCta && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#2D2A2E] text-white px-4 py-3 flex items-center justify-between shadow-2xl">
                    <button onClick={() => setContactOpen(true)} className="flex-1 text-left text-sm font-semibold">
                        Talk to a production lead about costing a style in India <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
