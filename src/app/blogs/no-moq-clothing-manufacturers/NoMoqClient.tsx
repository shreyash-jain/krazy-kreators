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

const BLOG_ID = "no-moq-clothing-manufacturers";

const HERO_IMAGE = "/blog/no-moq-clothing-manufacturers-hero.jpg";
const SECTION1_IMAGE = "/blog/no-moq-clothing-manufacturers-section1.jpg";
const GARMENT_IMAGE = "/blog/no-moq-clothing-manufacturers-garment.jpg";
const MACRO_IMAGE = "/blog/no-moq-clothing-manufacturers-macro.jpg";
const CLOSING_IMAGE = "/blog/no-moq-clothing-manufacturers-closing.jpg";
const MOQ_EXPLAINED_IMAGE = "/blog/no-moq-clothing-manufacturers-moq-explained.jpg";
const DYELOT_IMAGE = "/blog/no-moq-clothing-manufacturers-dyelot.jpg";
const CASH_IMAGE = "/blog/no-moq-clothing-manufacturers-cash.jpg";

const TOC = [
    { id: "what-no-moq-means", label: "What “no MOQ” actually means" },
    { id: "why-moqs-exist", label: "Why minimums exist at all" },
    { id: "four-routes", label: "The four routes to a first order" },
    { id: "what-it-costs", label: "What small runs cost per piece" },
    { id: "cash-at-risk", label: "The number that beats unit cost" },
    { id: "who-its-for", label: "Who no MOQ is right for" },
    { id: "the-ladder", label: "How to climb out of it" },
    { id: "counter", label: "When no MOQ is the wrong call" },
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
/* Infographic 1 — the price curve: one tee at six run sizes           */
/* Bars scale from $38 (max) = 460px                                    */
/* ------------------------------------------------------------------ */
const CURVE_ROWS = [
    { units: "10 units", display: "$38", width: 460, note: "sample-room pricing" },
    { units: "25 units", display: "$27", width: 327, note: "the first real drop" },
    { units: "50 units", display: "$20", width: 242, note: "a workshop will take it" },
    { units: "150 units", display: "$15", width: 182, note: "a full size run" },
    { units: "500 units", display: "$11", width: 133, note: "normal factory terms" },
    { units: "1,000 units", display: "$8", width: 97, note: "the curve flattens here" },
];

function PriceCurveGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The same tee, six order sizes
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Factory price per unit for one mid-weight cotton crew tee, built from your own pattern. Worked example, not a price list.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 420"
                    role="img"
                    aria-label="Bar chart of small batch clothing production cost per unit: a cotton tee costs about $38 each at 10 units, $27 at 25 units, $20 at 50 units, $15 at 150 units, $11 at 500 units and $8 at 1,000 units."
                    className="w-full h-auto min-w-[520px]"
                >
                    <title>Cost per garment by run size, 10 to 1,000 units</title>
                    {CURVE_ROWS.map((row, i) => {
                        const y = 24 + i * 64;
                        return (
                            <g key={row.units}>
                                <text x="0" y={y + 20} fontSize="16" fontWeight="600" fill="#2D2A2E">
                                    {row.units}
                                </text>
                                <rect
                                    x="150"
                                    y={y}
                                    width={row.width}
                                    height="30"
                                    rx="6"
                                    fill={i === 0 ? "#2D2A2E" : ACCENT}
                                />
                                <text
                                    x={150 + row.width + 12}
                                    y={y + 21}
                                    fontSize="18"
                                    fontWeight="800"
                                    fill={i === 0 ? "#2D2A2E" : "#8C7A5E"}
                                >
                                    {row.display}
                                </text>
                                <text x="150" y={y + 48} fontSize="13" fill="#666666">
                                    {row.note}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Read the gaps, not the bars. Going from 10 units to 50 cuts the price roughly in half. Going from 500 to
                1,000 saves three dollars. Almost all of the saving happens in the first few hundred pieces &mdash; which is
                exactly the stretch a no MOQ clothing manufacturer lets you skip past slowly instead of all at once.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 — cash at risk: 150 units vs 1,000 units              */
/* Bars scale from $8,900 (max) = 560px                                 */
/* ------------------------------------------------------------------ */
const BET_ROWS = [
    { label: "Small batch — 150 units", cash: "$3,150", width: 198, fill: ACCENT },
    { label: "Bulk order — 1,000 units", cash: "$8,900", width: 560, fill: "#2D2A2E" },
];

function CashAtRiskGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Same product, two bets
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                One tee, one pattern, $900 of development either way. The only thing that changes is how many you make.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 190"
                    role="img"
                    aria-label="Bar chart comparing cash at risk: a 150-unit small batch clothing production run ties up $3,150, while a 1,000-unit bulk order ties up $8,900."
                    className="w-full h-auto min-w-[520px]"
                >
                    <title>Cash at risk, 150-unit run versus 1,000-unit run</title>
                    {BET_ROWS.map((row, i) => {
                        const y = 30 + i * 80;
                        return (
                            <g key={row.label}>
                                <text x="0" y={y - 8} fontSize="15" fontWeight="600" fill="#2D2A2E">
                                    {row.label}
                                </text>
                                <rect x="0" y={y} width={row.width} height="34" rx="6" fill={row.fill} />
                                <text
                                    x={row.width + 12}
                                    y={y + 24}
                                    fontSize="19"
                                    fontWeight="800"
                                    fill="#2D2A2E"
                                >
                                    {row.cash}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-gray-300">
                            <th className="py-2 pr-3 font-semibold text-[#2D2A2E]"> </th>
                            <th className="py-2 px-3 font-semibold text-[#2D2A2E] text-right whitespace-nowrap">150 units</th>
                            <th className="py-2 pl-3 font-semibold text-[#2D2A2E] text-right whitespace-nowrap">1,000 units</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                            <td className="py-2 pr-3 text-[#4A484A]">Factory price per unit</td>
                            <td className="py-2 px-3 text-right tabular-nums text-[#2D2A2E]">$15.00</td>
                            <td className="py-2 pl-3 text-right tabular-nums text-[#2D2A2E]">$8.00</td>
                        </tr>
                        <tr>
                            <td className="py-2 pr-3 text-[#4A484A]">Development, spread out</td>
                            <td className="py-2 px-3 text-right tabular-nums text-[#2D2A2E]">$6.00</td>
                            <td className="py-2 pl-3 text-right tabular-nums text-[#2D2A2E]">$0.90</td>
                        </tr>
                        <tr className="bg-white/60">
                            <td className="py-2 pr-3 font-bold text-[#2D2A2E]">All-in per unit</td>
                            <td className="py-2 px-3 text-right font-bold tabular-nums text-[#2D2A2E]">$21.00</td>
                            <td className="py-2 pl-3 text-right font-bold tabular-nums text-[#2D2A2E]">$8.90</td>
                        </tr>
                        <tr>
                            <td className="py-2 pr-3 font-bold text-[#2D2A2E]">Total cash at risk</td>
                            <td className="py-2 px-3 text-right font-bold tabular-nums text-[#2D2A2E]">$3,150</td>
                            <td className="py-2 pl-3 text-right font-bold tabular-nums text-[#2D2A2E]">$8,900</td>
                        </tr>
                        <tr>
                            <td className="py-2 pr-3 text-[#4A484A]">If 150 sell at $45 retail</td>
                            <td className="py-2 px-3 text-right font-bold tabular-nums text-[#2D2A2E]">+$3,600</td>
                            <td className="py-2 pl-3 text-right font-bold tabular-nums text-[#8C7A5E]">&minus;$2,150</td>
                        </tr>
                        <tr>
                            <td className="py-2 pr-3 text-[#4A484A]">Units left in the storage unit</td>
                            <td className="py-2 px-3 text-right tabular-nums text-[#2D2A2E]">0</td>
                            <td className="py-2 pl-3 text-right tabular-nums text-[#2D2A2E]">850</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                The 1,000-unit run is cheaper per garment by $12.10 and it is the better business &mdash; if it sells. Sell the
                same 150 pieces either way and the cheap per-unit price is the one that loses money.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 3 — the MOQ ladder                                      */
/* ------------------------------------------------------------------ */
const LADDER = [
    { rung: "01", x: 20, y: 230, w: 155, h: 60, units: "10–25", price: "$27–38", fill: "#D8CBB6" },
    { rung: "02", x: 195, y: 180, w: 155, h: 110, units: "50–150", price: "$14–22", fill: "#CBB49A" },
    { rung: "03", x: 370, y: 130, w: 155, h: 160, units: "300–500", price: "$9–13", fill: "#8C7A5E" },
    { rung: "04", x: 545, y: 80, w: 135, h: 210, units: "1,000+", price: "$6.50–9", fill: "#2D2A2E" },
];

const LADDER_QUESTIONS = [
    { rung: "01", title: "Prove the garment", q: "Does it fit, hang and feel the way it did in your head?" },
    { rung: "02", title: "Prove the demand", q: "Will people who don’t know you pay full price for it?" },
    { rung: "03", title: "Prove the repeat", q: "Does it sell through twice, and which sizes go first?" },
    { rung: "04", title: "Scale it", q: "How much can this style earn now that nothing is a guess?" },
];

function MoqLadderGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 03</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The MOQ ladder: four rungs, one question each
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Each step buys an answer. Take the next one only when the last question is settled.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 330"
                    role="img"
                    aria-label="Staircase diagram of the MOQ ladder: 10 to 25 units at $27 to $38 each proves the garment, 50 to 150 units at $14 to $22 proves demand, 300 to 500 units at $9 to $13 proves repeat sales, and 1,000 or more units at $6.50 to $9 is the scale step."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>The MOQ ladder from 10 units to 1,000 units</title>
                    {LADDER.map((step, i) => (
                        <g key={step.rung}>
                            <rect x={step.x} y={step.y} width={step.w} height={step.h} rx="8" fill={step.fill} />
                            <text
                                x={step.x + step.w / 2}
                                y={step.y + 34}
                                fontSize="20"
                                fontWeight="800"
                                textAnchor="middle"
                                fill={i >= 2 ? "#FFFFFF" : "#2D2A2E"}
                            >
                                {step.units}
                            </text>
                            <text
                                x={step.x + step.w / 2}
                                y={step.y + 58}
                                fontSize="15"
                                fontWeight="600"
                                textAnchor="middle"
                                fill={i >= 2 ? "#E8E0D4" : "#4A484A"}
                            >
                                {step.price} each
                            </text>
                            <text
                                x={step.x + step.w / 2}
                                y={step.y - 10}
                                fontSize="13"
                                fontWeight="700"
                                textAnchor="middle"
                                fill="#8C7A5E"
                            >
                                RUNG {step.rung}
                            </text>
                        </g>
                    ))}
                    <line x1="20" y1="292" x2="680" y2="292" stroke="#D9D3C8" strokeWidth="2" />
                    <text x="20" y="316" fontSize="13" fill="#666666">
                        cash at risk goes up
                    </text>
                    <text x="680" y="316" fontSize="13" fill="#666666" textAnchor="end">
                        cost per garment comes down
                    </text>
                </svg>
            </div>

            <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {LADDER_QUESTIONS.map((item) => (
                    <li key={item.rung} className="text-sm text-[#2D2A2E] leading-snug">
                        <span className="font-bold text-[#8C7A5E]">{item.rung}</span>{" "}
                        <span className="font-bold">{item.title}</span>
                        <span className="block text-[#4A484A]">{item.q}</span>
                    </li>
                ))}
            </ul>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Most brands that get hurt by minimums jumped from rung one to rung four in a single order, because the
                per-unit price at the top looked irresistible on a spreadsheet.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */

export default function NoMoqClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("what-no-moq-means");
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
        showToast("Small-batch planner on the way to your inbox.", "success");
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
                    alt="A no MOQ clothing manufacturer's sewing floor mid-shift: machinists at their stations down a working line, the nearest guiding pale blue cotton under the needle, stacks of cut panels beside each bench and a full rail of finished garments at the far end, daylight from tall factory windows."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">10 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 10, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-6xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        No MOQ Clothing Manufacturers:<br className="hidden lg:block" /> What You Really Pay
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Launching without a bulk order is real, and for most new brands it is the right first move. It is also two to four times more per piece. Here is the trade, priced out.
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
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk &middot; August 10, 2026</p>
                        </div>
                    </div>

                    {/* Key takeaways */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Key takeaways</p>
                        <ul className="space-y-2 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>&bull; True zero minimum only exists where someone else already made the garment in bulk. On custom production, <strong>the fabric mill sets the real floor</strong>, not the factory.</li>
                            <li>&bull; Small batch costs roughly <strong>$27&ndash;38</strong> a tee at 10&ndash;25 units and <strong>$14&ndash;22</strong> at 50&ndash;150 &mdash; against <strong>$6.50&ndash;9</strong> at 1,000.</li>
                            <li>&bull; Judge the first run on <strong>cash at risk</strong>, not cost per unit: <strong>$3,150</strong> at 150 units against <strong>$8,900</strong> at 1,000. Sell 150 either way and the small run makes <strong>$3,600</strong> while the bulk order is down <strong>$2,150</strong>.</li>
                            <li>&bull; Climb one rung at a time &mdash; roughly <strong>25 &rarr; 150 &rarr; 500 &rarr; 1,000</strong>. Each step should answer one question before you pay for the next.</li>
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
                                        <Link href="/blogs/zero-moq-no-warehouse-launch-clothing-brand-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Zero MOQ, no warehouse: the 2026 launch playbook</p>
                                        </Link>
                                        <Link href="/blogs/on-demand-clothing-manufacturing-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">On-demand manufacturing: producing less, selling more</p>
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
                                You have a design, a name, and about eight thousand dollars. Then the first factory you email writes back asking for 500 pieces per color.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                That is the moment most clothing brands quietly die &mdash; not from a bad product, but from a minimum they could not clear. So the search begins for a no MOQ clothing manufacturer, and the results are full of suppliers promising exactly that.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Some of them mean it. Most of them mean something narrower. This is what the promise actually covers, what small batch clothing production costs when you price it honestly, and the point at which staying small stops being smart.
                            </p>

                            {/* H2 1 */}
                            <section id="what-no-moq-means" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What &ldquo;no MOQ&rdquo; actually means
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="What a small batch clothing production order looks like: two hands squaring up a short size run of folded grey unbranded cotton tees in a stepped row across a worn wooden worktable, a steel tape measure and a stack of blank cards beside them in warm window light."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>MOQ</strong> <em>(minimum order quantity &mdash; the smallest run a supplier will accept)</em> is normally set per style and per color. A factory quoting &ldquo;500 minimum&rdquo; usually means 500 of one design in one color, not 500 pieces spread across your range.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That distinction is where most of the confusion lives. A supplier can honestly advertise no minimum and still be unable to make the garment you have in mind, because the constraint sits one step upstream from them.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    In practice the phrase covers three different claims. Knowing which one you are being offered saves a lot of wasted email.
                                </p>

                                <div className="not-prose overflow-x-auto mb-6 rounded-2xl border border-gray-200">
                                    <table className="w-full text-left text-sm sm:text-base">
                                        <thead className="bg-[#2D2A2E] text-white">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">What they say</th>
                                                <th className="px-4 py-3 font-semibold">What it usually means</th>
                                                <th className="px-4 py-3 font-semibold whitespace-nowrap">Real floor</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">&ldquo;Zero MOQ&rdquo;</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Printing or embroidery on a blank garment somebody else mass-produced. Your design is on the surface, not in the pattern.</td>
                                                <td className="px-4 py-3 font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">1 piece</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">&ldquo;No MOQ&rdquo;</td>
                                                <td className="px-4 py-3 text-[#4A484A]">A sample room or small workshop that will cut and sew your pattern in tiny quantities, usually from fabric already in stock.</td>
                                                <td className="px-4 py-3 font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">10&ndash;30 pieces</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">&ldquo;Flexible MOQ&rdquo;</td>
                                                <td className="px-4 py-3 text-[#4A484A]">One minimum held across a whole collection or a season, rather than style by style. The most useful version for a real brand.</td>
                                                <td className="px-4 py-3 font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">50&ndash;150 per style</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    None of these is dishonest. They are different products. The mistake is comparing a zero-MOQ print price against a cut-and-sew quote and concluding one supplier is cheap and the other is greedy. We walked through the full launch version of this in <Link href="/blogs/zero-moq-no-warehouse-launch-clothing-brand-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the zero-MOQ, no-warehouse launch playbook</Link>.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Ask what the fabric minimum is. The factory&rsquo;s number is negotiable. The mill&rsquo;s number usually isn&rsquo;t.&rdquo;
                                </blockquote>

                            </section>

                            {/* H2 2 */}
                            <section id="why-moqs-exist" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why minimums exist at all
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It helps to know that a minimum is not a negotiating tactic. It is arithmetic, and it starts before the factory.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <span className="block rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                        <Image
                                            src={DYELOT_IMAGE}
                                            alt="Why a no MOQ clothing manufacturer still has a minimum: freshly dyed cotton jersey rolls standing on end in a dye house, two hands lifting the loose end of the nearest roll to check the shade against the light — the mill's dye lot, not the factory, sets the real floor."
                                            width={1024}
                                            height={1024}
                                            sizes="(max-width: 1024px) 100vw, 42rem"
                                            className="w-full h-auto"
                                        />
                                    </span>
                                    Fabric is made in runs. A mill knits or weaves to order and a <strong>dye lot</strong> <em>(one batch of cloth dyed together to a single color)</em> has a minimum size, because setting up a dye machine costs the same whether it processes 50 kilos or 500. Ask for 30 metres of a custom color and you are asking the mill to run a machine at a loss.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The same logic repeats down the line. Someone has to make a pattern, grade it across sizes, plan a cutting marker, thread and calibrate a sewing line, and file one customs entry. Those costs land once per style, whatever the quantity.
                                </p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 04</p>
                                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-4 leading-snug">
                                        Where a minimum order quantity actually comes from
                                    </h3>
                                    <div className="rounded-xl overflow-hidden max-w-lg mx-auto">
                                        <Image
                                            src={MOQ_EXPLAINED_IMAGE}
                                            alt="Infographic explaining minimum order quantity in clothing manufacturing: six stacked bars — mill dye lot, fabric roll, pattern and grading, cutting lay, sewing line setup and customs entry — each imposing its own minimum and flowing downward into a single bar labelled Your MOQ."
                                            width={1024}
                                            height={1024}
                                            sizes="(max-width: 1024px) 100vw, 32rem"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                                        Your MOQ is not one decision. It is six minimums stacked on each other, and only the last belongs to the factory you are emailing. That is why &ldquo;can you go lower?&rdquo; rarely works, and &ldquo;which of these can we design around?&rdquo; usually does.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Which is why a factory with a 500-piece minimum is usually telling you the truth about its own economics rather than dismissing you. And it is why every real workaround is some version of the same trick: use fabric that already exists, or share the setup cost with other people.
                                </p>

                                <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 rounded-r-2xl mb-6 not-prose">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Questions that reveal the real minimum</p>
                                    <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                        <li>&bull; Is this fabric in stock, or does it need to be knitted for me?</li>
                                        <li>&bull; What is the dye-lot minimum for this color, in kilos or metres?</li>
                                        <li>&bull; Does the minimum apply per style, per color, or across the order?</li>
                                        <li>&bull; What changes about the price if I take a color you already hold?</li>
                                    </ul>
                                </div>

                            </section>

                            {/* H2 3 */}
                            <section id="four-routes" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The four routes to a first order
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="A single unbranded cotton crew tee from a small batch clothing production run, shown on an invisible mannequin form and turned three-quarters, one hard directional light picking out the shoulder seam against a deep shadow background."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>1. Print-on-demand.</strong> Your artwork goes onto a blank garment when an order comes in, so nothing is made until something sells. The trade: you control neither fit, fabric nor construction &mdash; you are selling somebody else&rsquo;s tee with your graphic on it, and so is everyone else using that supplier. Good for testing a graphic, poor for building a garment brand. The economics are in our piece on <Link href="/blogs/on-demand-clothing-manufacturing-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">on-demand manufacturing</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>2. The sample room.</strong> Most manufacturers run one, and some will sell you short runs out of it. You get your own pattern, your own construction, and a garment that is genuinely yours. You also pay sample-room rates, because that is what it is. Ten to twenty-five pieces is the normal range.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>3. The small cut-and-sew workshop.</strong> A ten-to-thirty-machine shop that lives on short runs. Minimums are typically 30 to 100 pieces, fabric choice is limited to what is nearby or in stock, and quality varies enormously between shops. Vet this one hard &mdash; the failure modes are the ones we catalogued in <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="underline text-[#CBB49A] hover:text-[#b7a078]">the real cost of choosing the wrong manufacturer</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    <strong>4. The flexible-minimum partner.</strong> A full-service manufacturer that holds one minimum across your whole collection instead of per style. Six styles at 50 pieces each clears a 300-piece minimum, so you launch a real range rather than one hero product in six colors. Usually the best structure for a brand that intends to still exist in three years &mdash; read <Link href="/blogs/moq-worries-krazy-kreators-supports-small-brands-flexible-quantities" className="underline text-[#CBB49A] hover:text-[#b7a078]">how flexible-quantity arrangements work in practice</Link> before you negotiate one.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    A fifth option people forget: buy a factory&rsquo;s existing block and change the fabric, trims and labels. Not custom, but fast and cheap, and for some categories the correct answer &mdash; see <Link href="/blogs/private-label-vs-custom-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">private label vs. custom manufacturing</Link>.
                                </p>

                            </section>

                            {/* H2 4 */}
                            <section id="what-it-costs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What small runs cost per piece
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is the part the supplier listings leave out. Flexibility is a real service and it has a real price, and that price is charged per garment.
                                </p>

                                <PriceCurveGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then there is the cost that ignores quantity entirely. Before anything sellable exists, someone has to turn your idea into instructions: a tech pack, a base pattern, grading across your size run, two or three sample rounds, color approvals. Budget roughly <strong>$500 to $1,500 per style</strong>, and expect to pay it whether you order 30 pieces or 3,000.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    At 1,000 units, $900 of development adds ninety cents to each garment. At 150 units it adds six dollars. That single line is most of why small runs feel so expensive, and it is also the line founders most often try to skip &mdash; which is the most reliable way to pay for it twice, as we argued in <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a tech pack actually is</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Import costs work the same way, and they are worth knowing before they surprise you. Duty is charged as a percentage of value, so it scales with your order rather than penalizing small ones &mdash; a cotton knit tee sits under <a href="https://hts.usitc.gov/search?query=61091000" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">HTS 6109.10.00</a> at a <strong>16.5%</strong> general rate whether you bring in 30 pieces or 3,000. What does penalize small orders is the fixed side: customs charges a minimum processing fee per formal entry and a broker charges a flat fee to file it, so a 100-piece shipment carries those same dollars across far fewer garments.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Flexibility is not free and it is not a discount. It is a service, and it is billed per garment.&rdquo;
                                </blockquote>

                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Small-Batch Planner</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page worksheet that turns any quantity into the three numbers that decide it: all-in cost per unit, total cash at risk, and how many pieces you have to sell to get your money back. Plus the eight questions to send a supplier before you ask for a price. Spreadsheet + PDF.</p>
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
                                            Send me the planner
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Planner on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 5 */}
                            <section id="cash-at-risk" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The number that beats unit cost
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Everything so far argues for ordering more. Cost per unit falls, margin rises, the spreadsheet gets happier. And this is precisely where new brands get hurt.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Cost per unit is a measure of efficiency. It tells you nothing about risk. Before you know whether a product sells, the number that decides whether you survive is how much cash is sitting in boxes.
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CASH_IMAGE}
                                        alt="Cash at risk in small batch clothing production: a knee-high stack of folded unbranded cotton tees in the foreground against a shoulder-high wall of the same garment behind it, one hand resting on the small stack for scale."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <CashAtRiskGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The bulk order is genuinely the better business &mdash; if the product sells. Move all 1,000 at $45 and you clear about $36,100 against $3,600 on the small run. Nobody should pretend otherwise.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The question is what happens when it does not. That risk is not hypothetical: clothing retailers were carrying <a href="https://fred.stlouisfed.org/series/MRTSIR448USN" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">1.99 months of inventory against monthly sales in May 2026</a>, on Census Bureau figures &mdash; and that is the whole sector, including the operators who forecast for a living.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Meanwhile the conditions are not getting friendlier. In the McKinsey and Business of Fashion <a href="https://www.mckinsey.com/industries/retail/our-insights/state-of-fashion" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">State of Fashion 2026</a>, <strong>46% of fashion executives expected conditions to worsen</strong> over the year. Placing a large first order into that is a forecast, not a strategy.
                                </p>

                            </section>

                            {/* H2 6 */}
                            <section id="who-its-for" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Who no MOQ is right for
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Macro detail of a flatlock shoulder seam on a heavyweight cotton tee from a low MOQ clothing manufacturing run, stitch density and rib texture in sharp focus under low raking light, no labels or logos in frame."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Small runs are the right call more often than the industry admits, and the reason is simple: most brands are financing this themselves. Startups two years old or younger make up <a href="https://www.fedsmallbusiness.org/reports/survey/2026/2026-report-on-employer-firms" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">34% of all small employer firms</a> in the Federal Reserve&rsquo;s Small Business Credit Survey. Very few of them have the balance sheet to absorb a bad guess about which color sells.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    The odds argue for caution too. Of business establishments born in 2013, <a href="https://www.bls.gov/opub/ted/2024/34-7-percent-of-business-establishments-born-in-2013-were-still-operating-in-2023.htm" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">34.7% were still operating a decade later</a>, according to the Bureau of Labor Statistics. Most brands do not get a second chance to place a first order.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 mb-6">
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">Go small if</p>
                                        <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                            <li>&bull; Nobody outside your circle has paid full price for this yet.</li>
                                            <li>&bull; You are launching several styles and cannot fund a real run of each.</li>
                                            <li>&bull; Fit is still moving, or the fabric is not locked.</li>
                                            <li>&bull; You sell direct and can restock in weeks, not seasons.</li>
                                            <li>&bull; Losing the whole order would end the business.</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">Go bigger if</p>
                                        <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                            <li>&bull; The style has sold through at full price at least twice.</li>
                                            <li>&bull; You have a wholesale order or a retail date to hit.</li>
                                            <li>&bull; You know your size curve from real sales, not guesswork.</li>
                                            <li>&bull; The small-batch price is squeezing your margin below survival.</li>
                                            <li>&bull; You need a specific fabric that carries its own minimum anyway.</li>
                                        </ul>
                                    </div>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    One honest caveat. Small runs can make a good product look like a failure. A style that would earn 60% margin at 500 units might show 25% at 40 units, and a founder reading only the margin line kills it. Judge a test run on whether it sold and how fast, not on what it earned.
                                </p>

                            </section>

                            {/* H2 7 */}
                            <section id="the-ladder" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How to climb out of it
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    No MOQ is a starting position, not a business model. Stay there too long and the per-unit price quietly caps how much you can spend to acquire a customer, which caps how fast you can grow.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    The way up is one rung at a time, with each step paying for the information that justifies the next.
                                </p>

                                <MoqLadderGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two practical notes. Keep the same pattern and the same factory as you climb, because changing either resets the development cost and the learning curve. And plan the calendar backwards from your selling window &mdash; a bigger run takes longer to make, and the weeks are laid out in <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="underline text-[#CBB49A] hover:text-[#b7a078]">the lead-time timeline from design to doorstep</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The signal to move up is boring and specific: the same style sold out twice at full price, and you can name the sizes that went first. That is a restock. Anything before that is still a guess with a bigger number attached.
                                </p>

                            </section>

                            {/* H2 8 — counterexample */}
                            <section id="counter" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When no MOQ is the wrong call
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="The end of a low MOQ clothing manufacturing run: two hands wrapping a folded charcoal cotton tee in kraft paper at a packing bench, sealed mailer cartons stacked at the left, a row of folded garments in other colors waiting at the right, a tape gun on the worn bench."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Sometimes the small order is the expensive mistake. If your product depends on a specific performance fabric, a custom knit, or a matched color, no supplier can hand it to you at 30 pieces &mdash; the mill minimum makes it impossible at any price you would accept. Chasing a no-MOQ version of that garment gets you a worse product in whatever cloth was on the shelf. Wholesale shifts it too: a buyer placing a 400-piece order has already answered the demand question, and paying small-batch rates to fill it can wipe out the margin the order was worth.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    And there is a quieter failure: staying small forever. A brand that has sold the same tee out four times and is still ordering 50 at a time is paying roughly twice per garment for information it already has. That is not caution. That is a habit.
                                </p>

                            </section>

                            {/* H2 9 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Stop shopping for the lowest minimum and start shopping for the partner who will still be there at rung three. Ask every supplier the same two questions: what is your minimum per style, and what does the price look like at 50, 150 and 500. The answers tell you whether they want a transaction or a brand.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    Then size your first order by what you can afford to lose, not by what makes the unit cost look respectable. What is the smallest run that produces a garment you would put your name on &mdash; and could you write that check twice if the first one taught you something?
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
                                <Link href="/blogs/zero-moq-no-warehouse-launch-clothing-brand-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Zero MOQ, No Warehouse: The 2026 Launch Playbook</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">You know the trade-off. Here is the whole launch built around it, without a factory contract.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the playbook <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Find the right first quantity for your style</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about small-batch production &mdash; what your style costs at 50, 150 and 500, and which quantity is the right bet right now.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/on-demand-clothing-manufacturing-2026",
                                            title: "On-Demand Manufacturing in 2026",
                                            dek: "Producing less and selling more, and where the model stops working.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/private-label-vs-custom-manufacturing",
                                            title: "Private Label vs. Custom Manufacturing",
                                            dek: "Two routes to a first order, and what each one really costs you.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/lead-time-timeline-design-to-doorstep",
                                            title: "The Lead-Time Timeline",
                                            dek: "Design to doorstep, week by week — and where the weeks actually go.",
                                            read: "7 min read",
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
                        Talk to a production lead about your first run <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
