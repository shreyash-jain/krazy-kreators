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

const BLOG_ID = "private-label-vs-custom-clothing-manufacturing";

const HERO_IMAGE = "/blog/private-label-vs-custom-hero.jpg";
const SECTION1_IMAGE = "/blog/private-label-vs-custom-section1.jpg";
const GARMENT_IMAGE = "/blog/private-label-vs-custom-garment.jpg";
const MACRO_IMAGE = "/blog/private-label-vs-custom-macro.jpg";
const CLOSING_IMAGE = "/blog/private-label-vs-custom-closing.jpg";

const TOC = [
    { id: "two-models", label: "The two models, in plain English" },
    { id: "three-words", label: "Three words, three different deals" },
    { id: "compare", label: "The comparison, on one screen" },
    { id: "cost", label: "What each one costs per piece" },
    { id: "time", label: "How long each one takes" },
    { id: "own", label: "What you own when it’s over" },
    { id: "landed-cost", label: "The cost line both models share" },
    { id: "pick", label: "Three questions that decide it" },
    { id: "wrong", label: "When custom is the wrong call" },
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
/* Infographic 1 — the cost stack at 300 units                         */
/* Scale: $14.80 (max) = 520px, so 1 dollar = 35.135px                 */
/* Segment widths are pre-computed and sum exactly to the bar totals.  */
/* ------------------------------------------------------------------ */
const PRIVATE_STACK = [
    { label: "Finished blank garment", value: "$4.50", w: 158, fill: "#2D2A2E" },
    { label: "Your label sewn in", value: "$0.60", w: 21, fill: "#8C7A5E" },
    { label: "Print / decoration", value: "$2.20", w: 77, fill: ACCENT },
    { label: "Finishing and pack", value: "$0.35", w: 12, fill: "#D8CBB6" },
    { label: "Development, spread", value: "$0.83", w: 30, fill: "#E5D9C6" },
];

const CUSTOM_STACK = [
    { label: "Fabric, 240 GSM cotton", value: "$6.30", w: 221, fill: "#2D2A2E" },
    { label: "Trims and labels", value: "$0.90", w: 32, fill: "#8C7A5E" },
    { label: "Cut and make", value: "$3.80", w: 133, fill: ACCENT },
    { label: "Finishing, QC, pack", value: "$0.80", w: 28, fill: "#D8CBB6" },
    { label: "Development, spread", value: "$3.00", w: 106, fill: "#E5D9C6" },
];

function CostStackGraphic() {
    const rows = [
        { name: "Private label", total: "$8.48", stack: PRIVATE_STACK, y: 56 },
        { name: "Custom cut and sew", total: "$14.80", stack: CUSTOM_STACK, y: 156 },
    ];

    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The same tee, both ways, at 300 units
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                One mid-weight cotton crew tee, 300 pieces, all-in cost per garment before freight and duty. Worked
                example, not a price list.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 250"
                    role="img"
                    aria-label="Stacked bar chart comparing private label and custom clothing manufacturing at 300 units. Private label totals $8.48 a garment: $4.50 blank, $0.60 label, $2.20 print, $0.35 pack and $0.83 of spread development. Custom cut and sew totals $14.80: $6.30 fabric, $0.90 trims, $3.80 cut and make, $0.80 finishing and $3.00 of spread development."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>All-in cost per garment at 300 units, private label versus custom</title>
                    {rows.map((row) => {
                        let x = 170;
                        return (
                            <g key={row.name}>
                                <text x="0" y={row.y - 12} fontSize="16" fontWeight="700" fill="#2D2A2E">
                                    {row.name}
                                </text>
                                <text x="0" y={row.y + 30} fontSize="26" fontWeight="800" fill="#2D2A2E">
                                    {row.total}
                                </text>
                                <text x="0" y={row.y + 50} fontSize="12" fill="#666666">
                                    per garment
                                </text>
                                {row.stack.map((seg) => {
                                    const segX = x;
                                    x += seg.w;
                                    return (
                                        <rect
                                            key={seg.label}
                                            x={segX}
                                            y={row.y}
                                            width={seg.w}
                                            height="44"
                                            fill={seg.fill}
                                            stroke="#F8F7F4"
                                            strokeWidth="1.5"
                                        />
                                    );
                                })}
                            </g>
                        );
                    })}
                    <line x1="170" y1="228" x2="690" y2="228" stroke="#D9D3C8" strokeWidth="2" />
                    <text x="170" y="246" fontSize="12" fill="#666666">
                        $0
                    </text>
                    <text x="690" y="246" fontSize="12" fill="#666666" textAnchor="end">
                        $14.80
                    </text>
                </svg>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {rows.map((row) => (
                    <div key={row.name}>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-2">{row.name}</p>
                        <ul className="space-y-1.5">
                            {row.stack.map((seg) => (
                                <li key={seg.label} className="flex items-center gap-2 text-sm text-[#4A484A]">
                                    <span
                                        className="inline-block w-3 h-3 rounded-sm flex-shrink-0 border border-black/10"
                                        style={{ backgroundColor: seg.fill }}
                                    />
                                    <span className="flex-1">{seg.label}</span>
                                    <span className="tabular-nums font-semibold text-[#2D2A2E]">{seg.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Custom costs $6.32 more a garment here, and $1,896 more in total cash for the run. Note where the gap
                actually comes from: $3.00 of it is development, a one-time cost that gets cheaper every time you
                reorder, while the private label bar never gets much cheaper than the blank inside it.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 — the calendar                                        */
/* Axis 0–26 weeks across 590px from x=90, so 1 week = 22.69px         */
/* ------------------------------------------------------------------ */
const PRIVATE_PHASES = [
    { label: "Pick blank, confirm colour", x: 90, w: 23, fill: "#2D2A2E" },
    { label: "Label + print setup, strike-off", x: 113, w: 45, fill: ACCENT },
    { label: "Decorate, relabel, pack", x: 158, w: 45, fill: "#D8CBB6" },
];

const CUSTOM_PHASES = [
    { label: "Tech pack + pattern", x: 90, w: 68, fill: "#2D2A2E" },
    { label: "Fabric sourcing + lab dips", x: 158, w: 91, fill: "#8C7A5E" },
    { label: "Sampling, 2–3 rounds", x: 249, w: 136, fill: ACCENT },
    { label: "Production", x: 385, w: 182, fill: "#D8CBB6" },
    { label: "Freight + customs", x: 567, w: 113, fill: "#E5D9C6" },
];

const TICKS = [
    { week: 0, x: 90 },
    { week: 5, x: 204 },
    { week: 10, x: 317 },
    { week: 15, x: 430 },
    { week: 20, x: 544 },
    { week: 25, x: 657 },
];

function CalendarGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Weeks to delivered stock, first style
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Typical ranges for a first order. A repeat order on the same pattern and fabric skips most of the custom
                bar.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 260"
                    role="img"
                    aria-label="Timeline comparing lead times. Private label takes about 5 weeks: 1 week to pick the blank and confirm colour, 2 weeks for label and print setup and strike-off approval, 2 weeks to decorate, relabel and pack. Custom cut and sew takes about 26 weeks: 3 weeks tech pack and pattern, 4 weeks fabric sourcing and lab dips, 6 weeks sampling, 8 weeks production and 5 weeks freight and customs."
                    className="w-full h-auto min-w-[620px]"
                >
                    <title>Lead time in weeks, private label versus custom cut and sew</title>

                    {TICKS.map((t) => (
                        <g key={t.week}>
                            <line x1={t.x} y1="40" x2={t.x} y2="200" stroke="#E4DFD6" strokeWidth="1" />
                            <text x={t.x} y="222" fontSize="12" fill="#666666" textAnchor="middle">
                                wk {t.week}
                            </text>
                        </g>
                    ))}

                    <text x="0" y="60" fontSize="15" fontWeight="700" fill="#2D2A2E">
                        Private label
                    </text>
                    <text x="0" y="78" fontSize="13" fill="#8C7A5E" fontWeight="700">
                        3–5 weeks
                    </text>
                    {PRIVATE_PHASES.map((p) => (
                        <rect
                            key={p.label}
                            x={p.x}
                            y="52"
                            width={p.w}
                            height="34"
                            fill={p.fill}
                            stroke="#F8F7F4"
                            strokeWidth="1.5"
                        />
                    ))}

                    <text x="0" y="150" fontSize="15" fontWeight="700" fill="#2D2A2E">
                        Custom
                    </text>
                    <text x="0" y="168" fontSize="13" fill="#8C7A5E" fontWeight="700">
                        14–26 weeks
                    </text>
                    {CUSTOM_PHASES.map((p) => (
                        <rect
                            key={p.label}
                            x={p.x}
                            y="142"
                            width={p.w}
                            height="34"
                            fill={p.fill}
                            stroke="#F8F7F4"
                            strokeWidth="1.5"
                        />
                    ))}

                    <line x1="90" y1="200" x2="680" y2="200" stroke="#D9D3C8" strokeWidth="2" />
                    <text x="90" y="248" fontSize="13" fill="#666666">
                        artwork approved
                    </text>
                    <text x="680" y="248" fontSize="13" fill="#666666" textAnchor="end">
                        stock on your shelf
                    </text>
                </svg>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-2">Private label</p>
                    <ul className="space-y-1.5">
                        {PRIVATE_PHASES.map((p) => (
                            <li key={p.label} className="flex items-center gap-2 text-sm text-[#4A484A]">
                                <span
                                    className="inline-block w-3 h-3 rounded-sm flex-shrink-0 border border-black/10"
                                    style={{ backgroundColor: p.fill }}
                                />
                                {p.label}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-2">Custom</p>
                    <ul className="space-y-1.5">
                        {CUSTOM_PHASES.map((p) => (
                            <li key={p.label} className="flex items-center gap-2 text-sm text-[#4A484A]">
                                <span
                                    className="inline-block w-3 h-3 rounded-sm flex-shrink-0 border border-black/10"
                                    style={{ backgroundColor: p.fill }}
                                />
                                {p.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                The custom bar is long, but only the first time. Roughly half of it &mdash; pattern, fabric approval,
                sampling &mdash; is development you never pay for again on that style. Reorders drop to production and
                freight alone.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 3 — three questions                                     */
/* ------------------------------------------------------------------ */
const QUESTIONS = [
    {
        n: "01",
        l1: "Does the thing that makes it good live",
        l2: "in the fabric or the fit?",
        y: 10,
    },
    {
        n: "02",
        l1: "Has anyone outside your circle paid",
        l2: "full price for it yet?",
        y: 118,
    },
    {
        n: "03",
        l1: "Could you lose the whole first order",
        l2: "and still trade next month?",
        y: 226,
    },
];

function DecisionGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 03</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Three questions, one answer
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Answer honestly. The model you should use is the one you say three times.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 336"
                    role="img"
                    aria-label="Decision chart with three questions. One: does the thing that makes it good live in the fabric or the fit? Two: has anyone outside your circle paid full price for it yet? Three: could you lose the whole first order and still trade next month? Yes to all three points to custom manufacturing; any no points to private label."
                    className="w-full h-auto min-w-[600px]"
                >
                    <title>Three questions deciding between private label and custom manufacturing</title>
                    {QUESTIONS.map((q) => (
                        <g key={q.n}>
                            <rect
                                x="0"
                                y={q.y}
                                width="420"
                                height="92"
                                rx="12"
                                fill="#FFFFFF"
                                stroke="#D9D3C8"
                                strokeWidth="1.5"
                            />
                            <text x="20" y={q.y + 28} fontSize="13" fontWeight="800" fill="#8C7A5E">
                                {q.n}
                            </text>
                            <text x="20" y={q.y + 54} fontSize="16" fontWeight="600" fill="#2D2A2E">
                                {q.l1}
                            </text>
                            <text x="20" y={q.y + 76} fontSize="16" fontWeight="600" fill="#2D2A2E">
                                {q.l2}
                            </text>

                            <line
                                x1="420"
                                y1={q.y + 46}
                                x2="458"
                                y2={q.y + 46}
                                stroke="#CBB49A"
                                strokeWidth="2"
                            />

                            <rect x="462" y={q.y + 6} width="230" height="36" rx="18" fill="#2D2A2E" />
                            <text x="482" y={q.y + 30} fontSize="15" fontWeight="700" fill="#FFFFFF">
                                Yes &rarr; Custom
                            </text>

                            <rect
                                x="462"
                                y={q.y + 50}
                                width="230"
                                height="36"
                                rx="18"
                                fill="#FFFFFF"
                                stroke="#CBB49A"
                                strokeWidth="1.5"
                            />
                            <text x="482" y={q.y + 74} fontSize="15" fontWeight="700" fill="#8C7A5E">
                                No &rarr; Private label
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Three yeses and custom is the right call. A single no usually means it is simply too early &mdash; which
                is not a failure, it is a sequence. Most brands that end up with a strong custom range got there by
                selling private label first.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */

export default function PrivateLabelVsCustomClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("two-models");
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
        showToast("Decision sheet on the way to your inbox.", "success");
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
                    alt="A design studio table at the moment of the decision: a plain finished blank tee folded on the left, and on the right the same garment taken apart into a paper pattern, a fabric header and a spec sheet, hands resting between the two."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 14, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-6xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        Private Label vs Custom<br className="hidden lg:block" /> Clothing Manufacturing
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        One route rents you a garment someone else already made. The other builds one you own. Here is
                        what each costs, how long each takes, and which fits where you are right now.
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
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk &middot; August 14, 2026</p>
                        </div>
                    </div>

                    {/* Key takeaways */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Key takeaways</p>
                        <ul className="space-y-2 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>&bull; <strong>Private label</strong> puts your label on a garment that already exists. <strong>Custom</strong> builds a garment from your own pattern. Everything else follows from that one difference.</li>
                            <li>&bull; On a worked 300-piece tee, private label lands near <strong>$8.48</strong> a unit and custom near <strong>$14.80</strong> &mdash; but <strong>$3.00</strong> of that gap is one-time development that shrinks to <strong>$0.90</strong> at 1,000 units.</li>
                            <li>&bull; Private label delivers in <strong>3&ndash;5 weeks</strong>. A first custom style takes <strong>14&ndash;26 weeks</strong>. Reorders are far quicker, because the development is already done.</li>
                            <li>&bull; Go custom when the thing that makes your product good lives in the <strong>fabric or the fit</strong>. If it lives in the artwork, a blank carries it fine.</li>
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
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Custom clothing manufacturing cost at every MOQ tier</p>
                                        </Link>
                                        <Link href="/blogs/no-moq-clothing-manufacturers" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">No MOQ clothing manufacturers: what you really pay</p>
                                        </Link>
                                        <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Design</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What is a tech pack, and why you can&rsquo;t manufacture without one</p>
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
                                Two suppliers quote your tee. One says $9 a piece, 50 minimum, three weeks. The other says $12, 300 minimum, four months.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                It looks like the first one is simply better at their job. It is not. They are selling two different things, and the quotes are not comparable in any useful way.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                This is the difference between private label and custom clothing manufacturing, explained without the jargon: what each one actually is, what each really costs, how long each takes, and how to tell which one your brand needs right now.
                            </p>

                            {/* H2 1 */}
                            <section id="two-models" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The two models, in plain English
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A private label decorating room: a worker at a screen-printing carousel lifting a freshly printed cotton tee off the platen, a stack of undecorated blanks beside them and a curing dryer behind, daylight through high windows, no visible brand marks."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Private label</strong> means you start from a garment that already exists. A supplier has already drawn the pattern, chosen the cloth, and made that tee in bulk. You buy it, they cut out their label and sew in yours, and you usually add a print or an embroidery.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Custom manufacturing</strong> &mdash; the trade calls it <em>cut and sew</em> (built from flat fabric to your own pattern) &mdash; starts from nothing. You pick the fabric, the fit, the seams, the trims. The factory makes a garment that did not exist before you ordered it.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    That is the whole difference. Everything else in this article &mdash; price, minimums, timing, control &mdash; is a consequence of it.
                                </p>

                                <div className="not-prose rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 mb-2">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">The one-line test</p>
                                    <p className="text-[#2D2A2E] text-base sm:text-lg leading-snug">
                                        If a customer could buy the same garment from another brand with a different logo on it, you are doing private label. If they could not, you are doing custom.
                                    </p>
                                </div>
                            </section>

                            {/* H2 2 */}
                            <section id="three-words" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Three words, three different deals
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Suppliers use these three terms loosely, and the gap between them is where founders get surprised. Ask which one a quote refers to before you compare prices.
                                </p>

                                <div className="not-prose space-y-4 mb-6">
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="font-bold text-[#2D2A2E] mb-1">White label</p>
                                        <p className="text-[#4A484A] leading-snug">A finished, unbranded garment sold to anyone who wants it. You add your label. So can your competitor, on the identical piece. Cheapest and fastest, and the least defensible.</p>
                                    </div>
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="font-bold text-[#2D2A2E] mb-1">Private label</p>
                                        <p className="text-[#4A484A] leading-snug">The same idea, but with some exclusivity attached &mdash; often a colourway, a print or a small spec change made only for you. Sometimes it means a genuinely exclusive make. Sometimes it means a white label garment with a nicer word on the invoice.</p>
                                    </div>
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="font-bold text-[#2D2A2E] mb-1">Custom / cut and sew</p>
                                        <p className="text-[#4A484A] leading-snug">Your pattern, your fabric, your construction. Nobody else can order it because it does not exist anywhere else. Slowest and most expensive to start, and the only one that leaves you owning something.</p>
                                    </div>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    One question separates them all: <em>who owns the pattern?</em> If the answer is the supplier, you are renting. Ask it early, in writing, and ask whether the exclusivity has an end date.
                                </p>
                            </section>

                            {/* H2 3 — the master comparison table */}
                            <section id="compare" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The comparison, on one screen
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Everything that follows in detail, side by side first. Figures are typical ranges for a simple knit style; your numbers will move with fabric, country and complexity.
                                </p>

                                <div className="not-prose overflow-x-auto rounded-2xl border border-gray-200 mb-6">
                                    <table className="w-full text-left text-sm min-w-[640px]">
                                        <thead>
                                            <tr className="bg-[#2D2A2E] text-white">
                                                <th className="py-3 px-4 font-semibold w-[26%]"> </th>
                                                <th className="py-3 px-4 font-semibold">Private label</th>
                                                <th className="py-3 px-4 font-semibold">Custom (cut and sew)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">You start from</td>
                                                <td className="py-3 px-4 text-[#4A484A]">A finished garment that already exists</td>
                                                <td className="py-3 px-4 text-[#4A484A]">A sketch and a roll of fabric</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">Typical minimum</td>
                                                <td className="py-3 px-4 text-[#4A484A]">24&ndash;100 per style and colour</td>
                                                <td className="py-3 px-4 text-[#4A484A]">300&ndash;500 per style and colour</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">Cost per piece <span className="font-normal text-[#666666]">(worked tee, 300 units)</span></td>
                                                <td className="py-3 px-4 text-[#4A484A]"><strong className="text-[#2D2A2E]">$8.48</strong> all-in</td>
                                                <td className="py-3 px-4 text-[#4A484A]"><strong className="text-[#2D2A2E]">$14.80</strong> all-in</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">Money up front before stock</td>
                                                <td className="py-3 px-4 text-[#4A484A]">~$250 in screens and label setup</td>
                                                <td className="py-3 px-4 text-[#4A484A]">~$900 in pattern, tech pack and samples</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">Time to delivered stock</td>
                                                <td className="py-3 px-4 text-[#4A484A]">3&ndash;5 weeks</td>
                                                <td className="py-3 px-4 text-[#4A484A]">14&ndash;26 weeks for the first style</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">You control</td>
                                                <td className="py-3 px-4 text-[#4A484A]">Colour, artwork, labels, packaging</td>
                                                <td className="py-3 px-4 text-[#4A484A]">Fabric, fit, weight, seams, trims, everything</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">You cannot change</td>
                                                <td className="py-3 px-4 text-[#4A484A]">The fit, the cloth, the way it is built</td>
                                                <td className="py-3 px-4 text-[#4A484A]">Very little &mdash; but every change costs time</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">You own afterwards</td>
                                                <td className="py-3 px-4 text-[#4A484A]">Your artwork and your customers</td>
                                                <td className="py-3 px-4 text-[#4A484A]">A graded pattern and a fabric spec, reusable forever</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">Can a rival sell the same garment?</td>
                                                <td className="py-3 px-4 text-[#4A484A]">Yes, often literally the same one</td>
                                                <td className="py-3 px-4 text-[#4A484A]">No</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="py-3 px-4 font-semibold text-[#2D2A2E]">Best when</td>
                                                <td className="py-3 px-4 text-[#4A484A]">Testing demand, graphic-led product, tight cash, fast drops</td>
                                                <td className="py-3 px-4 text-[#4A484A]">Fit or fabric is the product, proven demand, repeat styles</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Read the last two rows first. Everything above them is logistics; those two are the actual strategic question.
                                </p>
                            </section>

                            {/* H2 4 */}
                            <section id="cost" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What each one costs per piece
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Take one mid-weight cotton crew tee and price it both ways at 300 pieces. The private label route buys a finished blank and decorates it. The custom route buys cloth and builds the garment.
                                </p>

                                <CostStackGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Custom is $6.32 more per garment here, which reads as a straightforward loss. It is not, because $3.00 of that gap is <strong>development</strong> &mdash; the tech pack, the pattern, the grading and the sample rounds &mdash; and development is paid once per style, no matter how many you make.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Spread that $900 across a bigger run and it thins out fast. This is the single most misunderstood line in a custom quote.
                                </p>

                                <div className="not-prose overflow-x-auto rounded-2xl border border-gray-200 mb-6">
                                    <table className="w-full text-left text-sm min-w-[520px]">
                                        <thead>
                                            <tr className="border-b border-gray-300 bg-[#F8F7F4]">
                                                <th className="py-3 px-4 font-semibold text-[#2D2A2E]">Units in the run</th>
                                                <th className="py-3 px-4 font-semibold text-[#2D2A2E] text-right">$900 development, per garment</th>
                                                <th className="py-3 px-4 font-semibold text-[#2D2A2E] text-right">Gap vs private label</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">100</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$9.00</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">widest</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">300</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$3.00</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$6.32</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">500</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$1.80</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">narrowing</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">1,000</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$0.90</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">narrow</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="py-3 px-4 font-bold text-[#2D2A2E]">5,000</td>
                                                <td className="py-3 px-4 text-right font-bold tabular-nums text-[#2D2A2E]">$0.18</td>
                                                <td className="py-3 px-4 text-right font-bold tabular-nums text-[#2D2A2E]">effectively gone</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    There is a second effect the table does not show. On private label you pay someone else&rsquo;s margin on the cloth, because it is already inside the price of the blank. On custom you buy the cloth yourself, so at volume the fabric line usually comes in cheaper than the blank it replaces. The full tier-by-tier breakdown sits in <Link href="/blogs/custom-clothing-manufacturing-cost" className="underline text-[#CBB49A] hover:text-[#b7a078]">what custom clothing manufacturing costs at every MOQ tier</Link>.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Private label rents you a garment. Custom builds you one you own.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 5 */}
                            <section id="time" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How long each one takes
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="A single unbranded cotton crew tee on a dress form under one hard directional light, sleeve caught mid-movement, the shoulder seam and neck rib sharp against a deep charcoal backdrop."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Time is where the two models separate hardest, and where founders most often get caught. Private label is quick because the slow part already happened in someone else&rsquo;s factory, months ago.
                                </p>

                                <CalendarGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two things make the custom bar shorter in practice. The first is deciding fabric early, because lab dips (small test swatches dyed to your colour for approval) sit on the critical path and every re-do costs a week. The second is a complete tech pack up front &mdash; the spec document a factory builds from &mdash; which is the difference between two sample rounds and five. That document is covered in <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a tech pack is and why you can&rsquo;t manufacture without one</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Work backwards from the date you need stock, not forwards from today. A custom style aimed at a November drop is a June decision, and the brands that miss the season are almost always the ones who started the maths from the wrong end.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="own" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What you own when it&rsquo;s over
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of the edge of a manila pattern card: punched drill holes, cut notches and pencilled grading lines stepping outward across the board, a folded edge of cotton jersey beneath it slightly out of focus."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Run private label for two years and you finish with your artwork, your audience and your customer list. Those are real assets. What you do not have is the garment &mdash; the supplier still owns the pattern, and can sell it to whoever asks next.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Run custom for two years and you finish with a graded pattern (your fit, sized across the range), a fabric specification and a set of suppliers who know your standard. Season two starts from that instead of from zero, which is why custom gets cheaper and faster the longer you do it.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Worth being precise about one thing: neither route protects your <em>brand</em>. That comes from a registered trademark, and in the US a Class 25 apparel filing starts at <a href="https://www.uspto.gov/trademarks/fees-payment-information" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">$350 per class</a> at the USPTO. Own the name whichever model you pick.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The blank is available to everyone. That includes the brand that undercuts you next season.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That is not an argument for going custom on day one. It is an argument for knowing what you are buying, so the decision to move is yours and not a surprise.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Production Model Decision Sheet</h4>
                                        <p className="text-[#4A484A] leading-snug">One page. Both models costed side by side with your own numbers, the eleven questions to ask a supplier before you compare quotes, and the pattern-ownership clause to look for in writing. Spreadsheet + PDF.</p>
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
                                    <p className="text-[#2D2A2E] font-medium">Decision sheet on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 7 */}
                            <section id="landed-cost" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The cost line both models share
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Whichever route you take, the factory price is not the price. Cotton knit tees enter the US at a <a href="https://hts.usitc.gov/search?query=61091000" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">16.5% duty rate under heading 6109.10.00</a>, and since CBP moved to an <a href="https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">indefinite suspension of the $800 de minimis exemption</a> in June 2026, nothing arrives duty-free any more.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Here is the custom tee from earlier, carried through to the warehouse door.
                                </p>

                                <div className="not-prose overflow-x-auto rounded-2xl border border-gray-200 mb-6">
                                    <table className="w-full text-left text-sm min-w-[460px]">
                                        <thead>
                                            <tr className="border-b border-gray-300 bg-[#F8F7F4]">
                                                <th className="py-3 px-4 font-semibold text-[#2D2A2E]">Line</th>
                                                <th className="py-3 px-4 font-semibold text-[#2D2A2E] text-right">Per garment</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">Factory price (the quote you were given)</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$11.80</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">Freight and insurance</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$0.85</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">Duty at 16.5%</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$1.95</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">CBP processing fees</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$0.30</td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-[#4A484A]">Customs brokerage</td>
                                                <td className="py-3 px-4 text-right tabular-nums text-[#2D2A2E]">$0.45</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="py-3 px-4 font-bold text-[#2D2A2E]">Landed cost</td>
                                                <td className="py-3 px-4 text-right font-bold tabular-nums text-[#2D2A2E]">$15.35</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The factory quote is <strong>77% of the real number</strong>. Miss that and a range planned at 60% margin ships at closer to 50%.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Private label has the same costs, they are just harder to see: if you buy blanks from a US wholesaler, the duty was already paid by whoever imported them and is baked into the price you pay. That is a genuine convenience. It also means you are paying it plus their margin, and you cannot audit either. The parcel-level version of this maths is in <Link href="/blogs/de-minimis-hangover-2026-parcel-costs" className="underline text-[#CBB49A] hover:text-[#b7a078]">the de minimis hangover</Link>.
                                </p>
                            </section>

                            {/* H2 8 */}
                            <section id="pick" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Three questions that decide it
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Forget the price comparison for a moment. The model is chosen by where your product&rsquo;s value sits and how much room you have to be wrong.
                                </p>

                                <DecisionGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Question one does most of the work. If people buy your tee for the graphic on it, a well-chosen blank carries that perfectly, and spending four months and $900 to build your own version of a garment that already exists is money going nowhere. If people keep telling you the fit is boxy or the fabric feels thin, no amount of artwork fixes it.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Question three is the one founders skip. Roughly a third of business establishments are still trading a decade in &mdash; <a href="https://www.bls.gov/opub/ted/2024/34-7-percent-of-business-establishments-born-in-2013-were-still-operating-in-2023.htm" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">34.7% of those born in 2013</a>, on Bureau of Labor Statistics figures. A first order you cannot survive losing is not a bold bet, it is the whole company on one guess about a colour.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5">
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">Signs you should stay private label</p>
                                        <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                            <li>&bull; Nobody outside your circle has paid full price yet.</li>
                                            <li>&bull; The design is the graphic, not the garment.</li>
                                            <li>&bull; You are testing several ideas at once.</li>
                                            <li>&bull; You need stock this quarter, not next season.</li>
                                            <li>&bull; A dead order would end the business.</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">Signs you have outgrown it</p>
                                        <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                            <li>&bull; Customers ask for a fit the blank cannot give.</li>
                                            <li>&bull; The same style has sold out at full price twice.</li>
                                            <li>&bull; A competitor is selling your identical blank, cheaper.</li>
                                            <li>&bull; Your supplier discontinued a style you depend on.</li>
                                            <li>&bull; You want a fabric nobody stocks as a blank.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* H2 9 — counterexample */}
                            <section id="wrong" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When custom is the wrong call
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="One unbranded tee on a hanger against a bare studio wall, throwing a long hard shadow across the plaster, with a densely packed rail of identical garment silhouettes dissolving into shadow behind it."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Custom is not the mature choice and private label is not the beginner one. Plenty of profitable brands never leave blanks, because their product genuinely is the artwork &mdash; tour merch, creator drops, club and team kit, anything where speed and design turnover beat construction.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Custom done badly is also worse than private label done well. A mediocre bespoke tee at $18 loses to an excellent blank at $9 every time, and the customer never once wonders who owned the pattern. If you cannot yet specify what you want the fabric and the fit to do, custom will simply produce an expensive version of your uncertainty.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Timing argues for caution too. Clothing retailers were carrying <a href="https://fred.stlouisfed.org/series/MRTSIR448USN" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">1.99 months of inventory against monthly sales in May 2026</a> on Census Bureau figures, and in the McKinsey and Business of Fashion <a href="https://www.mckinsey.com/industries/retail/our-insights/state-of-fashion" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">State of Fashion 2026</a>, 46% of executives expected conditions to worsen. Committing four months and a 300-piece minimum into that needs a better reason than wanting to be a real brand.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    There is a mirror failure, though. A brand that has sold the same borrowed tee out five times and still has no pattern of its own has spent years building demand for a garment it cannot protect. That is not caution either.
                                </p>
                            </section>

                            {/* H2 10 — closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Stop treating it as a permanent identity and treat it as a sequence. Prove the demand on private label, where being wrong costs weeks instead of seasons, then move your one proven best-seller to custom and leave the rest on blanks.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    Almost nobody needs to convert a whole range at once. So: which single style of yours has earned its own pattern &mdash; and what is stopping you moving just that one?
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

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/custom-clothing-manufacturing-cost" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Custom Clothing Manufacturing Cost at Every MOQ Tier</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">You know which model fits. Here is what the custom route actually costs at 50, 300, 1,000 and 5,000 pieces.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Work out which model your style needs</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about private label vs custom manufacturing &mdash; what your style costs each way, and which one is the right move for the season you are planning.</p>
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
                                            title: "No MOQ Clothing Manufacturers",
                                            dek: "What a small first run really costs, and when staying small stops being smart.",
                                            read: "10 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack-why-you-need-it",
                                            title: "What Is a Tech Pack?",
                                            dek: "The spec document that decides whether custom takes two sample rounds or five.",
                                            read: "6 min read",
                                        },
                                        {
                                            href: "/blogs/how-to-start-a-clothing-brand-2026",
                                            title: "How to Start a Clothing Brand in 2026",
                                            dek: "The eight-step build order, from niche to first production run.",
                                            read: "15 min read",
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
                        Talk to a production lead about your style <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
