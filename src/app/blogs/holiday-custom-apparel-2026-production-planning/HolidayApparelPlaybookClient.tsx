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

const BLOG_ID = "holiday-custom-apparel-2026-production-planning";

const HERO_IMAGE = "/blog/holiday-custom-apparel-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/holiday-custom-apparel-2026-section1.jpg";
const GARMENT_IMAGE = "/blog/holiday-custom-apparel-2026-garment.jpg";
const MACRO_IMAGE = "/blog/holiday-custom-apparel-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/holiday-custom-apparel-2026-closing.jpg";

const TOC = [
    { id: "math", label: "When should you start?" },
    { id: "buildable", label: "What can you still produce?" },
    { id: "categories", label: "Building the collection" },
    { id: "overstock", label: "Bulk vs the markdown" },
    { id: "preorder", label: "Pre-orders and packaging" },
    { id: "countdown", label: "T-shirt production timeline" },
    { id: "the-move", label: "Planning for 2027" },
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
/* Infographic 1 - the fifteen weeks you have vs the clocks you can    */
/* run. Bars scale at 25px per week against a 24-week axis. Every      */
/* figure here is repeated verbatim in the body text.                  */
/* ------------------------------------------------------------------ */
const LANE_ROWS = [
    { label: "Stock blanks, decorated and shipped domestically", weeks: 8, note: "6\u20138 weeks", width: 200, fill: ACCENT },
    { label: "Reorder of an existing style, flown in", weeks: 13.5, note: "12 weeks + 8\u201310 days", width: 338, fill: ACCENT },
    { label: "Reorder of an existing style, by sea", weeks: 17, note: "12 weeks + 30\u201340 days", width: 425, fill: "#8C7A5E" },
    { label: "A first run from scratch, by sea", weeks: 23, note: "23 weeks, tech pack to shelf", width: 575, fill: "#2D2A2E" },
];

function LaneGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Holiday collection production: fifteen weeks against the clocks you can run
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Every route to holiday custom apparel 2026, in elapsed weeks from a start date of 3 September. The dashed
                line is 17 December &mdash; the last ground shipping date USPS committed to in 2025. Anything crossing it
                arrives after Christmas.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 760 300"
                    role="img"
                    aria-label="Bar chart comparing four production routes against the fifteen weeks available between 3 September and 17 December 2026. Decorating stock blanks takes six to eight weeks and finishes inside the window. A reorder of an existing style flown in takes about thirteen and a half weeks and finishes inside the window. The same reorder sent by sea takes seventeen weeks and misses. A first run from scratch takes twenty-three weeks and misses by a wide margin."
                    className="w-full h-auto min-w-[620px]"
                >
                    <title>Production routes against the fifteen weeks remaining to 17 December 2026</title>
                    {LANE_ROWS.map((row, i) => {
                        const y = 34 + i * 62;
                        const missed = row.weeks > 15;
                        return (
                            <g key={row.label}>
                                <text x="0" y={y - 8} fontSize="14.5" fontWeight="600" fill="#2D2A2E">
                                    {row.label}
                                </text>
                                <rect x="0" y={y} width={row.width} height="26" rx="6" fill={row.fill} />
                                <text x={row.width + 12} y={y + 19} fontSize="13" fontWeight="700" fill={missed ? "#8C2F1F" : "#2D2A2E"}>
                                    {row.note}
                                </text>
                            </g>
                        );
                    })}
                    <line x1="375" y1="20" x2="375" y2="268" stroke="#8C2F1F" strokeWidth="2" strokeDasharray="6 5" />
                    <text x="375" y="14" fontSize="13" fontWeight="800" fill="#8C2F1F" textAnchor="middle">
                        15 weeks &mdash; 17 Dec
                    </text>
                    <line x1="0" y1="285" x2="600" y2="285" stroke="#D6D1C7" strokeWidth="2" />
                    {[0, 4, 8, 12, 16, 20, 24].map((t) => (
                        <text key={t} x={t * 25} y="278" fontSize="12" fill="#666666" textAnchor={t === 0 ? "start" : "middle"}>
                            {t} wk
                        </text>
                    ))}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Two of the four routes finish in time, and neither of them involves making a new garment. That is the
                whole decision this September, and it is easier to accept in a chart than in a supplier call.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 - the countdown. x = 60 + (days after 1 Oct) * 10.4,  */
/* so 17 Dec (day 77) lands at 861. Labels alternate above and below   */
/* because Black Friday and Cyber Monday sit three days apart.         */
/* ------------------------------------------------------------------ */
const COUNTDOWN = [
    { x: 60, date: "1 Oct", label: "Range locked, blanks ordered", up: true, key: true },
    { x: 206, date: "15 Oct", label: "Photography done, pages built", up: false, key: false },
    { x: 382, date: "1 Nov", label: "Pre-order opens", up: true, key: true },
    { x: 455, date: "8 Nov", label: "Diwali \u2014 Indian lines reduced", up: false, key: false },
    { x: 653, date: "27 Nov", label: "Black Friday", up: true, key: true },
    { x: 684, date: "30 Nov", label: "Cyber Monday", up: false, key: false },
    { x: 767, date: "8 Dec", label: "Last inbound stock receipt", up: true, key: false },
    { x: 861, date: "17 Dec", label: "Ground shipping cutoff", up: false, key: true },
];

function CountdownGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The countdown: 1 October to 17 December
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                The selling spine of a seasonal clothing brand launch, drawn to scale across 77 days. Two dates are
                fixed by the calendar rather than by you, and both bite Christmas apparel manufacturing &mdash; Diwali
                on 8 November and Black Friday on 27 November.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 940 250"
                    role="img"
                    aria-label="A timeline from 1 October to 17 December 2026. 1 October: range locked and blanks ordered. 15 October: photography done and product pages built. 1 November: pre-order opens. 8 November: Diwali, Indian production lines reduced. 27 November: Black Friday. 30 November: Cyber Monday. 8 December: last inbound stock receipt. 17 December: ground shipping cutoff."
                    className="w-full h-auto min-w-[800px]"
                >
                    <title>Holiday 2026 countdown, 1 October to 17 December</title>
                    <line x1="40" y1="120" x2="900" y2="120" stroke="#D6D1C7" strokeWidth="3" />
                    <rect x="440" y="111" width="32" height="18" rx="4" fill="#E4DCCB" />
                    {COUNTDOWN.map((m) => {
                        const fill = m.key ? "#2D2A2E" : ACCENT;
                        const dateY = m.up ? 46 : 206;
                        const labelY = m.up ? 66 : 226;
                        const tickTop = m.up ? 76 : 132;
                        const tickBottom = m.up ? 110 : 168;
                        return (
                            <g key={m.date}>
                                <text x={m.x} y={dateY} fontSize="15" fontWeight="800" fill={fill} textAnchor="middle">
                                    {m.date}
                                </text>
                                <text x={m.x} y={labelY} fontSize="12.5" fill="#4A484A" textAnchor="middle">
                                    {m.label}
                                </text>
                                <line x1={m.x} y1={tickTop} x2={m.x} y2={tickBottom} stroke={fill} strokeWidth="2" />
                                <circle cx={m.x} cy="120" r={m.key ? 9 : 6} fill={fill} />
                            </g>
                        );
                    })}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                October looks quiet and is not. Everything that happens in November and December is decided by whether
                the first two markers were hit.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* The three open lanes - HTML, not an image, so it cannot drift from  */
/* Infographic 01 or from the body text.                               */
/* ------------------------------------------------------------------ */
const PRINT_ROWS = [
    {
        factor: "What you are actually buying",
        blanks: "A garment that already exists, with your artwork on it",
        air: "A second cut of a style you have already sold",
        pre: "A promise, paid for now",
    },
    {
        factor: "Time to first shipment",
        blanks: "6\u20138 weeks",
        air: "About 13\u00bd weeks",
        pre: "Sells now, ships January",
    },
    {
        factor: "What it costs you",
        blanks: "Fit, fabric weight, every construction detail",
        air: "Air freight, on every single unit",
        pre: "Everyone who will not wait",
    },
    {
        factor: "Stock left in January",
        blanks: "Whatever did not sell",
        air: "Whatever did not sell",
        pre: "None",
    },
    {
        factor: "Use it when",
        blanks: "The graphic is the product",
        air: "The style is already proven",
        pre: "You would rather hold cash than stock",
    },
];

export default function HolidayApparelPlaybookClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("claim");
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
        showToast("Holiday Countdown on the way to your inbox.", "success");
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
                    alt="Holiday custom apparel 2026: a narrow city street at blue hour in December, wet asphalt reflecting the warm light of a small independent clothing shop window showing a rail of plain knitwear, bare trees and a single figure walking away far down the block."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">5 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 3, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-6xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        Holiday 2026 Custom Apparel Playbook:<br className="hidden lg:block" /> Planning Your Christmas and Gifting Collection Early
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Christmas is fifteen weeks away. A first production run takes twenty-three. Here is what a US brand can still ship this December &mdash; and the date next June when the 2027 collection really begins.
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
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk &middot; September 3, 2026</p>
                        </div>
                    </div>

                    {/* Key takeaways */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Key takeaways</p>
                        <ul className="space-y-2 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>&bull; There are <strong>fifteen weeks</strong> between today and the ground shipping cutoff. A first run needs twenty-three.</li>
                            <li>&bull; Two routes still finish in time, and neither makes a new garment: <strong>decorated blanks</strong>, and a <strong>pre-order</strong> you cut in January.</li>
                            <li>&bull; Buy deep on loungewear that still sells in March. Buy shallow on anything with a snowflake on it.</li>
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
                                        <Link href="/blogs/custom-clothing-manufacturing-cost" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What custom clothing manufacturing actually costs</p>
                                        </Link>
                                        <Link href="/blogs/clothing-production-timeline" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">From sketch to store: a real production timeline</p>
                                        </Link>
                                        <Link href="/blogs/holiday-2026-production-window-us-founders-order-now" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The holiday window, and when to place the order</p>
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
                                Fifteen weeks from today, the post office stops promising Christmas. In 2025 the last date USPS would commit to for Ground Advantage was <a href="https://about.usps.com/newsroom/national-releases/2025/0917-usps-recommends-2025-holiday-mailing-and-shipping-dates.htm" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">17 December</a>, and the 2026 dates land in mid-September.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                A first production run with a new factory takes about twenty-three weeks. That is not a scheduling problem urgency can fix. It is arithmetic, and it has already decided most of what you will sell this December.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                So this is not a piece about planning early. It is about holiday custom apparel 2026 as it stands today: what a US founder can still put in front of a buyer, and the date next June when the 2027 collection starts.
                            </p>

                            {/* H2 1 */}
                            <section id="math" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Holiday Apparel Production Planning: When Should You Start?
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Holiday apparel production planning: an almost empty stockroom rail in cold north light, one heavyweight cream fleece sweatshirt and matching pant hanging alone beside a crowd of bare metal hangers."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The season is worth the trouble. November and December run at <a href="https://nrf.com/research-insights/holiday-data-and-trends/winter-holidays/winter-holiday-faqs" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">about 19% of annual US retail</a>, and 2025 was the first year the pair <a href="https://nrf.com/media-center/press-releases/nrf-says-holiday-season-was-a-notable-success-as-consumers-came-out-to-spend-" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">cleared $1 trillion</a>. Clothing sits near the top of the gift list: <a href="https://nrf.com/media-center/press-releases/consumers-to-spend-second-highest-amount-on-record-according-to-nrf-holiday-survey" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">46% of shoppers said they wanted clothing or accessories</a>, behind only gift cards.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of that moves the calendar. Holiday apparel manufacturing runs on the ordinary clock: our own <Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">stage-by-stage timeline</Link> puts a first run at twenty-three weeks from tech pack to shelf &mdash; development, sampling, bulk, then freight. Ocean from India is <a href="https://www.freightos.com/shipping-routes/shipping-from-india-to-the-united-states/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">30 to 40 days door to door</a>; air is 8 to 10.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Start today and a from-scratch collection lands in February. Even a reorder of a garment you already sell &mdash; roughly twelve weeks of making, plus the crossing &mdash; is a January delivery.
                                </p>

                                <LaneGraphic />
                            </section>

                            {/* H2 2 */}
                            <section id="buildable" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Christmas Merch Manufacturing: What Can You Still Produce?
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three Christmas merch manufacturing lanes are open, and each is narrower than the last.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Decoration on stock blanks.</strong> The fastest holiday clothing production route: you buy garments that already exist, decorate them, and ship domestically. Six to eight weeks, no fabric development, no ocean. You give up fit, fabric weight, and every construction detail that would have made the garment yours &mdash; a real cost, not a footnote. For a graphic hoodie in September it is usually the honest answer.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>A reorder, flown in.</strong> If a style already sells, cutting it again is about twelve weeks and then 8 to 10 days in a plane, which lands stock in early December at a freight cost that eats the margin you were protecting. Worth it on a proven seller. Never worth it on a guess.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Selling the thing before it exists.</strong> More on that below.
                                </p>

                                <div className="not-prose my-8 overflow-x-auto rounded-2xl border border-gray-200">
                                    <table className="w-full min-w-[720px] border-collapse bg-white text-left">
                                        <thead className="bg-[#F8F7F4]">
                                            <tr>
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">&nbsp;</th>
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">Decorated blanks</th>
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">Reorder by air</th>
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">Pre-order</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {PRINT_ROWS.map((row) => (
                                                <tr key={row.factor} className="align-top">
                                                    <td className="p-4 border-b border-gray-100 font-semibold text-[#2D2A2E]">{row.factor}</td>
                                                    <td className="p-4 border-b border-gray-100 text-[#4A484A]">{row.blanks}</td>
                                                    <td className="p-4 border-b border-gray-100 text-[#4A484A]">{row.air}</td>
                                                    <td className="p-4 border-b border-gray-100 text-[#4A484A]">{row.pre}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* H2 3 */}
                            <section id="categories" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Building a Gifting Apparel Collection
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="Gifting apparel collection: one unbranded oatmeal fleece crewneck with dropped shoulders and a ribbed hem on a matte black stand form, soft directional window light from the left raking across the looped surface, the dark olive-grey wall falling away behind."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three categories: matching family sets, cozy loungewear, novelty prints. Same season, wildly different risk.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Matching sets</strong> are the strongest gifting proposition in custom holiday apparel, because the buyer is not the wearer and one transaction moves four garments that then get photographed. The trap is the size curve: a four-piece set is dead the moment one size sells out.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Loungewear</strong> is the safest and least seasonal. A heavyweight fleece set still sells in January, which is why it deserves your deepest buy.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Novelty prints</strong> are where founders lose money. Cheap to design, impossible to reorder in time, and the demand curve falls off a cliff on 26 December. Print them shallow, on blanks, and accept that you are renting the season, not building a category.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Holiday Countdown</h4>
                                        <p className="text-[#4A484A] leading-snug">Every date in Infographic 02 as a working sheet: what has to be signed by each one, the buy-depth rule per category, and a pre-order page checklist with the ship-date wording that keeps a January delivery from turning into a refund. Spreadsheet + PDF.</p>
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
                                            Send me the countdown
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">On its way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="overstock" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Bulk pricing against the January markdown
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Deeper buys cost less per unit. True, and every seasonal apparel manufacturing quote leans on it &mdash; <Link href="/blogs/no-moq-clothing-manufacturers" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a low-minimum run really costs you</Link> is the other half of that sum.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is the half founders skip. Retailers expect <a href="https://nrf.com/media-center/press-releases/consumers-expected-to-return-nearly-850-billion-in-merchandise-in-2025" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">17% of holiday sales to come back as returns</a>, against 15.8% across the year, and online runs higher still at 19.3%. Those returns arrive in January, when the goods are worth whatever a clearance page will pay.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So a lower unit cost is only a saving if the unit sells at full price. Buy deep on the loungewear that still moves in March. Buy shallow on anything with a snowflake on it. A <Link href="/blogs/zero-moq-no-warehouse-launch-clothing-brand-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">no-warehouse launch</Link> gives up margin per piece to avoid precisely this trade.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="preorder" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Pre-orders, drops, and the box it arrives in
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Christmas merch manufacturing detail: extreme macro in ecru, a looped bouclé pile on one side of a diagonal covered seam and a dense two-by-two rib on the other, individual fibres catching soft window light in a razor-thin plane of focus."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A pre-order moves the risk onto the customer&rsquo;s calendar instead of your warehouse. Take the order in November, promise January, cut only what sold. <Link href="/blogs/the-drop-culture-model" className="underline text-[#CBB49A] hover:text-[#b7a078]">The drop model</Link> does the same job with a deadline instead of a delivery date.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The condition is that you say the date out loud &mdash; on the product page, in the confirmation email, on the packing slip. Founders who bury it get the sale and lose the customer.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Packaging is the cheapest quality signal you can buy, and holiday is the one season where the box is opened by someone who did not choose what is inside it. A branded mailer, tissue, a card &mdash; <Link href="/blogs/essential-trimmings-quality" className="underline text-[#CBB49A] hover:text-[#b7a078]">trim-level spend</Link> that reads as expensive and takes weeks rather than months. Order it alongside the garments, not after them.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="countdown" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Holiday T-Shirt Production Timeline
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The production timeline ends where the selling calendar begins, and two of its dates are not yours to move.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <a href="https://www.almanac.com/content/diwali" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Diwali falls on 8 November</a> and Indian factories run reduced through that week. If you make in India, <Link href="/blogs/monsoon-production-december-delivery-us-brands-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">that sits inside your window</Link> and needs planning around rather than discovering.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Black Friday is 27 November, Cyber Monday 30 November. And <a href="https://nrf.com/media-center/press-releases/consumers-to-spend-second-highest-amount-on-record-according-to-nrf-holiday-survey" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">42% of shoppers start before November</a> &mdash; so the October work below is not early. It is on time.
                                </p>

                                <CountdownGraphic />
                            </section>

                            {/* H2 7 - Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Seasonal Clothing Brand Launch: Planning for 2027
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="Holiday t-shirt production timeline: two hands cropped at the forearms tying an unbleached cotton ribbon around a folded stack of plain knitwear on a worn walnut table under warm lamp light."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Pick one lane this week and commit. If nothing is in production today, that lane is blanks and decoration for the December sale, plus a pre-order on one hero piece you cut in January. Do not attempt a full collection &mdash; you will pay air freight for goods that arrive in time to be marked down.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then put a note in the calendar for the first week of June 2027 &mdash; when the launch aimed at next Christmas actually begins, and when <Link href="/blogs/holiday-2026-production-window-us-founders-order-now" className="underline text-[#CBB49A] hover:text-[#b7a078]">the holiday window opens</Link>. Everything here is a consequence of that date passing unnoticed.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So: what are you actually shipping this December?
                                </p>
                            </section>

                            {/* FAQ */}
                            <section id="faq" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Common questions
                                </h2>
                                <div className="space-y-6">
                                    {faqs.map((f) => (
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
                                <Link href="/blogs/clothing-production-timeline" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">From Sketch to Store: A Real Clothing Production Timeline</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">Where the twenty-three weeks actually go, stage by stage &mdash; and the three fixed dates that bend everyone&rsquo;s calendar.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the timeline <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Put a real date on your holiday collection</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about holiday apparel production planning &mdash; which lane your product actually fits this year, how deep to buy by category, and what has to be signed to make the 2027 window instead of the 2026 one.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related - 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/holiday-2026-production-window-us-founders-order-now",
                                            title: "What to Lock for Holiday Before the Window Closes",
                                            dek: "The June companion to this post: the three decisions that decide a December delivery.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/the-drop-culture-model",
                                            title: "The Drop Culture Model",
                                            dek: "How limited releases sell out a collection without a warehouse full of guesses.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/no-moq-clothing-manufacturers",
                                            title: "No MOQ Manufacturers: What You Really Pay",
                                            dek: "The unit-cost maths behind buying shallow, laid out honestly.",
                                            read: "10 min read",
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
                        Talk to a production lead about your holiday collection <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
