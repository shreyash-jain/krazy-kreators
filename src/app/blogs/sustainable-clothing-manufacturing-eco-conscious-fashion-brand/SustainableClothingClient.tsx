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

const BLOG_ID = "sustainable-clothing-manufacturing-eco-conscious-fashion-brand";

const HERO_IMAGE = "/blog/sustainable-clothing-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/sustainable-clothing-2026-section1.jpg";
const GARMENT_IMAGE = "/blog/sustainable-clothing-2026-garment.jpg";
const MACRO_IMAGE = "/blog/sustainable-clothing-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/sustainable-clothing-2026-closing.jpg";

const TOC = [
    { id: "claim", label: "What the word now has to prove" },
    { id: "fibre", label: "Fibre first, and the recycled trap" },
    { id: "certificates", label: "The two certificates that decide it" },
    { id: "pfas", label: "PFAS is already illegal in two states" },
    { id: "labour", label: "Ethical sourcing is an audit trail" },
    { id: "waste", label: "Where a small brand actually wins" },
    { id: "cost", label: "What it costs, and when to skip it" },
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
/* Infographic 1 — the compliance dates already on the calendar        */
/* Five fixed markers on one rule; no computed values, nothing to drift */
/* ------------------------------------------------------------------ */
const DATE_MARKERS = [
    { x: 60, date: "1 Jan 2025", head: "PFAS bans live", body: "California and New York", fill: "#2D2A2E", live: true },
    { x: 215, date: "1 Jul 2026", head: "California textile EPR", body: "Producer registration opens", fill: "#2D2A2E", live: true },
    { x: 370, date: "27 Sep 2026", head: "EU green-claims ban", body: "Generic claims need proof", fill: ACCENT, live: false },
    { x: 520, date: "1 Jan 2027", head: "California PFAS drops", body: "100 ppm becomes 50 ppm", fill: "#8C7A5E", live: false },
    { x: 655, date: "1 Jan 2028", head: "Wet-weather outerwear", body: "Last PFAS exemption ends", fill: "#8C7A5E", live: false },
];

function ComplianceTimeline() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The dates that already govern your label
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Two of these are behind us. Filled markers are law today; open markers are adopted and dated.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 740 210"
                    role="img"
                    aria-label="Timeline of apparel sustainability compliance dates: 1 January 2025, PFAS bans live in California and New York; 1 July 2026, California textile producer responsibility registration opens; 27 September 2026, the EU ban on unproven generic green claims applies; 1 January 2027, California's PFAS limit falls from 100 ppm to 50 ppm; 1 January 2028, the last exemption for severe wet weather outerwear ends."
                    className="w-full h-auto min-w-[640px]"
                >
                    <title>Apparel sustainability compliance dates, 2025 to 2028</title>
                    <line x1="30" y1="96" x2="720" y2="96" stroke="#D6D1C7" strokeWidth="3" />
                    {DATE_MARKERS.map((m) => (
                        <g key={m.date}>
                            <text x={m.x} y="46" fontSize="15" fontWeight="800" fill={m.fill} textAnchor="middle">
                                {m.date}
                            </text>
                            <text x={m.x} y="68" fontSize="13" fontWeight="600" fill="#4A484A" textAnchor="middle">
                                {m.head}
                            </text>
                            <line x1={m.x} y1="78" x2={m.x} y2="88" stroke={m.fill} strokeWidth="2" />
                            <circle cx={m.x} cy="96" r={m.live ? 11 : 9} fill={m.live ? m.fill : "#F8F7F4"} stroke={m.fill} strokeWidth="3" />
                            <text x={m.x} y="128" fontSize="12.5" fill="#666666" textAnchor="middle">
                                {m.body}
                            </text>
                        </g>
                    ))}
                    <text x="30" y="176" fontSize="13" fontWeight="700" fill="#2D2A2E">
                        Filled marker = in force now
                    </text>
                    <text x="250" y="176" fontSize="13" fill="#8C7A5E">
                        Open marker = adopted, not yet applying
                    </text>
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Nothing on this line is a proposal. The two on the left have been enforceable for months, which is the
                part most founders have not registered.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 — recycled fibre as a share of world production       */
/* Axis 0–8%; bar px = percentage x 75. 132m tonnes is the 100% base   */
/* ------------------------------------------------------------------ */
const FIBRE_ROWS = [
    { label: "Recycled fibre, all types", pct: "7.6%", width: 570, fill: "#2D2A2E" },
    { label: "Recycled polyester made from drinks bottles", pct: "6.9%", width: 518, fill: ACCENT },
    { label: "Fibre made from pre- and post-consumer textiles", pct: "below 1%", width: 68, fill: "#8C7A5E" },
];

function RecycledShareGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                What &ldquo;recycled&rdquo; is actually made of
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Shares of the 132 million tonnes of fibre produced worldwide in 2024. The axis stops at 8% because
                everything above it is virgin material.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 265"
                    role="img"
                    aria-label="Bar chart of recycled fibre as a share of the 132 million tonnes of fibre produced worldwide in 2024: recycled fibre of all types 7.6 percent, recycled polyester made from drinks bottles 6.9 percent, and fibre made from pre- and post-consumer textiles below 1 percent."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>Recycled fibre as a share of world fibre production, 2024</title>
                    {FIBRE_ROWS.map((row, i) => {
                        const y = 30 + i * 74;
                        return (
                            <g key={row.label}>
                                <text x="0" y={y - 8} fontSize="15" fontWeight="600" fill="#2D2A2E">
                                    {row.label}
                                </text>
                                <rect x="0" y={y} width={row.width} height="32" rx="6" fill={row.fill} />
                                <text x={row.width + 12} y={y + 23} fontSize="19" fontWeight="800" fill="#2D2A2E">
                                    {row.pct}
                                </text>
                            </g>
                        );
                    })}
                    <line x1="0" y1="250" x2="600" y2="250" stroke="#D6D1C7" strokeWidth="2" />
                    {[0, 2, 4, 6, 8].map((t) => (
                        <text key={t} x={t * 75} y="242" fontSize="12" fill="#666666" textAnchor={t === 0 ? "start" : "middle"}>
                            {t}%
                        </text>
                    ))}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                The bottom bar is the one that matters. Almost all recycled clothing is made from packaging, not from
                clothing &mdash; a real saving on virgin input, and not the closed loop the word implies.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Claim-to-proof table — HTML, not an image, so it cannot drift       */
/* ------------------------------------------------------------------ */
const PROOF_ROWS = [
    {
        claim: "“Organic cotton”",
        proof: "Scope certificate for the mill, plus a transaction certificate naming your shipment",
        who: "A GOTS-approved certification body",
    },
    {
        claim: "“Recycled polyester”",
        proof: "Global Recycled Standard transaction certificate, with the recycled percentage stated",
        who: "The certifier, via your fabric supplier",
    },
    {
        claim: "“PFAS-free” or sold in CA / NY",
        proof: "Signed certificate of compliance from the manufacturer",
        who: "The factory or mill, in writing",
    },
    {
        claim: "“Ethically made”",
        proof: "Dated social audit report, corrective actions, and a written subcontractor list",
        who: "The audit firm, not the factory",
    },
    {
        claim: "“Low impact” / “eco-friendly”",
        proof: "Nothing you can hold. Replace it with one named, verified attribute",
        who: "—",
    },
];
export default function SustainableClothingClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
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
        showToast("Green claims evidence file on the way to your inbox.", "success");
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
                    alt="Sustainable clothing manufacturing: a long open-sided fabric roll store at the end of the day, undyed natural cloth wound on wooden cores stacked to the ceiling, a worker's back walking the aisle with a roll on one shoulder under raking daylight from a clerestory window."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Sustainability
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">12 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 22, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-6xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        Sustainable Clothing Manufacturing:<br className="hidden lg:block" /> How to Build an Eco-Conscious Fashion Brand
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        From 27 September, &ldquo;eco-friendly&rdquo; is a claim you have to prove. Here is what has to be true at the factory before the word goes on your label.
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
                            <li>&bull; Unproven green claims stop being legal across the EU on <strong>27 September 2026</strong>, and the FTC has already taken <strong>$5.5m</strong> off two US retailers over a fibre claim.</li>
                            <li>&bull; Recycled fibre is <strong>7.6%</strong> of world production &mdash; but cloth made from old <em>clothes</em> is <strong>under 1%</strong>. Most &ldquo;recycled polyester&rdquo; is a drinks bottle.</li>
                            <li>&bull; A scope certificate proves a mill <em>can</em> run organic. Only a <strong>transaction certificate</strong> proves your fabric actually did.</li>
                            <li>&bull; PFAS in apparel has been banned in California and New York since <strong>1 January 2025</strong>, and your factory owes you a signed certificate of compliance.</li>
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
                                        <Link href="/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sustainability</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Organic cotton, GOTS and recycled polyester, simplified</p>
                                        </Link>
                                        <Link href="/blogs/eu-buyers-sustainable-manufacturing-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sustainability</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What EU buyers ask about your supply chain</p>
                                        </Link>
                                        <Link href="/blogs/fabric-sourcing-101-choose-right-material" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Fabric sourcing 101: choosing the right material</p>
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
                                On 27 September, printing the words &ldquo;eco-friendly&rdquo; on a product page becomes unlawful across twenty-seven countries unless you can produce the evidence behind them.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Most US founders read that as a European problem. It isn&rsquo;t. The Federal Trade Commission has already collected <strong>$5.5 million</strong> from two American retailers over a single fibre claim, under rules written in 2012 and still in force today.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Sustainable clothing manufacturing used to be a decision about fabric. It is now a decision about documentation &mdash; what has to be true inside your factory, and what piece of paper proves it when someone asks. Here is the whole chain, in the order you have to build it.
                            </p>

                            {/* H2 1 */}
                            <section id="claim" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What the word now has to prove
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Sustainable fashion production: a wide width of pale cloth running over steel rollers into a heated stenter frame inside a textile finishing mill, faint steam catching mixed daylight and machine lamps, a worker's back at the control panel beyond."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The FTC&rsquo;s Green Guides &mdash; the federal rulebook for environmental marketing &mdash; are blunt about the vocabulary most brands reach for first. On unqualified general claims, <a href="https://www.law.cornell.edu/cfr/text/16/260.4" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">section 260.4</a> says it is &ldquo;highly unlikely that marketers can substantiate all reasonable interpretations of these claims,&rdquo; and therefore that they &ldquo;should not make unqualified general environmental benefit claims.&rdquo;
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Read that again. Not <em>be careful with</em>. Should not make.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    In April 2022 the FTC turned that into money. Kohl&rsquo;s and Walmart paid <a href="https://www.ftc.gov/news-events/news/press-releases/2022/04/ftc-uses-penalty-offense-authority-seek-largest-ever-civil-penalty-bogus-bamboo-marketing-kohls" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">$2.5 million and $3 million respectively</a> for selling rayon as &ldquo;bamboo&rdquo; and describing the process as eco-friendly. Converting bamboo into rayon is a chemical process; the marketing said otherwise. It remains the largest penalty the agency has issued in this area.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A revision that would have defined &ldquo;sustainable&rdquo; and &ldquo;organic&rdquo; for the first time has been sitting unfinished since its comment period closed in 2023. So the 2012 text is the text you are judged against, and it never defined the word you most want to use.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Europe went the other way and wrote the definition down. The Empowering Consumers for the Green Transition Directive &mdash; a consumer-protection law adopted in 2024 &mdash; <a href="https://products.cooley.com/2026/03/16/empowering-consumers-for-the-green-transition-directive-check-your-sustainability-claims-and-warranty-information-for-compliance-with-new-eu-regime/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">applies from 27 September 2026</a> in all member states. It bans generic environmental claims made without proof, and it bans sustainability labels you invented yourself.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    If your Shopify store ships to a customer in Dublin or Berlin, that is your law too. And the same evidence trail feeds the EU&rsquo;s <Link href="/blogs/eu-digital-product-passport-fashion-brands-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">Digital Product Passport</Link>, whose textile rules are expected to be adopted in 2027.
                                </p>

                                <ComplianceTimeline />

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The question stopped being whether your factory is greener than the last one. It is whether you can show it to a regulator inside a fortnight.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="fibre" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Fibre first &mdash; and the recycled trap underneath it
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Roughly two-thirds of a garment&rsquo;s environmental footprint is decided before anyone cuts anything, in the choice of fibre and the mill that makes it. That part of the old advice holds. What has changed is the arithmetic behind one of the choices.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    World fibre production reached <a href="https://textileexchange.org/knowledge-center/reports/materials-market-report-2025/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">132 million tonnes in 2024</a>, up from about 125 million the year before. Polyester is 59% of that output, and 88% of the polyester is fossil-based.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Recycled fibre of every kind accounts for 7.6% of production. Recycled polyester made from drinks bottles is 6.9% of it. Fibre made from pre- and post-consumer <em>textiles</em> &mdash; old clothes, the thing the word implies &mdash; sits below 1% of the global market.
                                </p>

                                <RecycledShareGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That is not an argument against recycled polyester. Diverting a bottle from landfill and displacing virgin petrochemical input is a real gain, and worth paying for. It is an argument against calling it circular, which is a claim the September rules are built to catch.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The trend line is also less flattering than the marketing. Recycled polyester grew in volume last year but <em>lost</em> share, slipping from 12.5% to 12% of all polyester, because virgin production grew faster.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Cotton is the more workable lane for a first range, and not for romantic reasons. Global production sits at 24.5 million tonnes, and 34% of it now comes from certified sources &mdash; organic, Better Cotton, regenerative programmes. A certification chain that already exists is a chain you can audit, which is the whole game. We break down what each label covers in <Link href="/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester" className="underline text-[#CBB49A] hover:text-[#b7a078]">organic cotton, GOTS and recycled polyester, simplified</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Hemp and linen genuinely need less water and less chemistry. They also come with shorter supply, fewer mills, and minimums that a first-season brand usually cannot meet &mdash; the trade-offs are in <Link href="/blogs/2026-fabric-trends-hemp-bamboo" className="underline text-[#CBB49A] hover:text-[#b7a078]">our read on hemp and bamboo</Link>. Pick the fibre your volume can actually buy, then pick the one you can document. If you are starting from scratch, <Link href="/blogs/fabric-sourcing-101-choose-right-material" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing 101</Link> is the place to begin.
                                </p>

                                <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 rounded-r-2xl mb-6 not-prose">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs your fibre story will not hold</p>
                                    <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                        <li>&bull; Your site says &ldquo;recycled&rdquo; without saying recycled from what.</li>
                                        <li>&bull; Nobody has told you the recycled percentage, only that there is one.</li>
                                        <li>&bull; The word &ldquo;circular&rdquo; appears anywhere near a bottle-derived yarn.</li>
                                        <li>&bull; You chose the fibre before you checked what your order quantity can buy.</li>
                                        <li>&bull; The claim on the label is broader than the claim on the invoice.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 3 */}
                            <section id="certificates" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The two certificates that decide whether your claim survives
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="Sustainable fashion production: a single unbranded undyed cotton overshirt hanging on a wooden stand form against soft window light in a sample room, the weave and topstitching lit from behind, a bolt of natural cloth out of focus beyond it."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is where most eco-conscious brands quietly fail, and almost none of them know it.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A <strong>scope certificate</strong> &mdash; the annual licence a mill holds &mdash; confirms that a facility has been audited and is permitted to process certified goods. It says the mill <em>can</em> run organic cotton. It says nothing whatsoever about the roll of cloth in your order.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A <strong>transaction certificate</strong> &mdash; issued per shipment &mdash; is the document that ties a specific batch, quantity and buyer to the standard. It is the only paper that proves your fabric was actually made the way you are telling customers it was.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is the detail that catches people. The <a href="https://global-standards.org/suppliers/certified-suppliers" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">public GOTS database</a> lists only scope certificate holders, because that is what the database is for. So the PDF a supplier emails you when you ask about organic is, nine times in ten, a scope certificate. You feel reassured. You have been shown a capability, not a delivery.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Fix it in three moves. Ask for the scope certificate and check its licence number against the public database yourself, rather than trusting the file. Require a transaction certificate naming your purchase order and quantity, and make it a condition of final payment. Then keep both with the invoice, because a claim you cannot evidence eighteen months later is a claim you did not make.
                                </p>

                                <div className="overflow-x-auto not-prose my-8">
                                    <table className="w-full min-w-[560px] border-collapse text-left">
                                        <caption className="text-left text-sm text-[#666666] mb-3">
                                            What each claim actually requires you to hold on file.
                                        </caption>
                                        <thead>
                                            <tr className="bg-[#2D2A2E] text-white">
                                                <th scope="col" className="p-3 text-sm font-bold">If you want to say</th>
                                                <th scope="col" className="p-3 text-sm font-bold">You must be able to produce</th>
                                                <th scope="col" className="p-3 text-sm font-bold">Issued by</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {PROOF_ROWS.map((r, i) => (
                                                <tr key={r.claim} className={i % 2 ? "bg-white" : "bg-[#F8F7F4]"}>
                                                    <th scope="row" className="p-3 text-sm font-semibold text-[#2D2A2E] align-top border-b border-gray-200">{r.claim}</th>
                                                    <td className="p-3 text-sm text-[#4A484A] align-top border-b border-gray-200">{r.proof}</td>
                                                    <td className="p-3 text-sm text-[#666666] align-top border-b border-gray-200">{r.who}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Green Claims Evidence File</h4>
                                        <p className="text-[#4A484A] leading-snug">One page mapping every sustainability claim to the exact document that proves it, who issues it and when to ask &mdash; plus the fourteen questions to send a mill before you place a fabric order, and a plain-English glossary of the certifications. Spreadsheet + PDF.</p>
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
                                            Send me the file
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">On its way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="pfas" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    PFAS is already illegal in two states you sell into
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Low-impact garment production detail: extreme macro of a single water droplet beading on a tightly woven cotton canvas, individual warp and weft yarns and a faint halo of dampness sharp in a shallow band of focus under diffused window light."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    PFAS &mdash; the fluorinated chemistry behind water and stain repellency &mdash; is the one place where sustainability stops being a positioning question and becomes a line on your fabric spec.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    California and New York both banned it in apparel from <a href="https://www.morganlewis.com/pubs/2024/11/new-york-and-california-bans-on-pfas-in-textiles-and-apparel-begin-january-1-2025" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">1 January 2025</a>. California&rsquo;s <a href="https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202120220AB1817" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">AB 1817</a> sets a limit of 100 parts per million of total organic fluorine, falling to 50 ppm in 2027. New York bans intentionally added PFAS outright.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Both states put the paperwork on your supplier, not on you: the manufacturer must give whoever sells the product a signed <strong>certificate of compliance</strong>. If you have never received one, you are carrying that risk on their behalf.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Outerwear for severe wet conditions has an exemption that runs to 1 January 2028, but since 2025 it must be disclosed to the buyer. That is a narrow carve-out for technical shells, not a general reprieve.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    One more thing on the California calendar: the state&rsquo;s textile recovery law opened producer registration on 1 July 2026 for brands above $1 million in global sales, which makes end-of-life collection a cost line rather than a value. Worth knowing it exists before it finds you.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="labour" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Ethical sourcing is an audit trail, not a sentence on your About page
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A social audit &mdash; a scheduled third-party inspection of wages, hours, safety and age &mdash; is the standard instrument here. SMETA, SA8000 and WRAP are the names you will be shown.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Ask for the report, not the certificate. A certificate tells you a factory passed something once. The report tells you what the auditor found, and the corrective action list tells you what the factory did about it. Those two documents are worth more than any badge on a website.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then ask the question almost nobody asks: what leaves the building. Embroidery, printing, washing and hand-finishing are routinely sent out, and an unregistered subcontractor is where a clean audit and a real problem live at the same time. Request a written list of every outsourced process with addresses, and put it in the purchase agreement.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A concession, because this is where honest advice matters most: on a 300-unit first run, a full audit programme is not within reach, and pretending otherwise helps nobody. What is proportionate at that size is the subcontractor list, a video walkthrough of the floor, and a partner who already holds the relationship and the history.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Your wholesale buyers will get there before your customers do. The five questions European retailers are already sending are in <Link href="/blogs/eu-buyers-sustainable-manufacturing-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">what EU buyers ask about your supply chain</Link>.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="waste" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Waste is where a small brand actually beats a large one
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The national picture is grim and worth stating plainly. In its most recent published figures, the EPA counted <a href="https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/textiles-material-specific-data" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">17 million tons of textiles</a> in US municipal solid waste in 2018, of which 11.3 million tons went to landfill. The recycling rate for clothing and footwear was 13%.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    You cannot move that number. You can move the three upstream ones that nobody photographs.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Marker efficiency</strong> &mdash; how tightly your pattern pieces nest on the fabric roll before cutting &mdash; is measured as a percentage, and a factory that cannot tell you yours is not measuring it. A few points is real cloth on a production run, and it shows up in your cost per unit as well as your footprint.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Sample rounds</strong> each consume fabric, labour and air freight. The most reliable way to cut them is a complete tech pack, which is the least glamorous sustainability intervention in this article and probably the most effective &mdash; see <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a tech pack actually is</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Over-ordering</strong> is the largest of the three by a distance. A garment that never sells is 100% waste plus the cost of storing it, and no amount of organic cotton offsets a warehouse of unsold stock. Producing closer to demand is the argument we make in <Link href="/blogs/anti-fast-fashion-slow-brand" className="underline text-[#CBB49A] hover:text-[#b7a078]">building a slow brand against a fast market</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    None of this needs a certificate. All of it shows up in your margin, which is why it survives the quarter when the sustainability budget gets cut.
                                </p>

                                <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 rounded-r-2xl mb-6 not-prose">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs the waste is upstream of you</p>
                                    <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                        <li>&bull; Nobody has quoted you a marker efficiency percentage on any style.</li>
                                        <li>&bull; You are on sample round four and the comments are still about fit.</li>
                                        <li>&bull; Last season&rsquo;s carryover is bigger than this season&rsquo;s first order.</li>
                                        <li>&bull; Your minimum was set by the mill, not by your sell-through.</li>
                                        <li>&bull; Offcuts leave the factory and nobody in your business knows where.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 7 — concession */}
                            <section id="cost" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What this costs, and when you should skip it
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Certification adds cost in three places, and only one of them is the fabric. Certified cloth carries a premium and, more painfully, a higher minimum order. The audit and certificate cycle is annual and paid. And somebody in your business has to chase, read and file the documents, every season, forever.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So here is the unpopular version. If you are launching one style in the low hundreds, a full chain of custody is usually out of reach, because certified fabric minimums sit above your order before you have sold a thing.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    What works at that size is narrower and completely defensible: buy from a stockist who holds the transaction certificate for the roll, make one specific claim you can evidence &mdash; &ldquo;the shell is GOTS-certified organic cotton, certificate on request&rdquo; &mdash; and say nothing else. One provable sentence beats a page of atmosphere.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Being small is not the failure. Making a large claim on a small evidence base is, and that is the exact pattern both the FTC and the September rules are built to find.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    More on how we think about this across a production run is on our <Link href="/sustainability" className="underline text-[#CBB49A] hover:text-[#b7a078]">sustainability page</Link>, and the fibre-and-ethics groundwork sits in our earlier guide to <Link href="/blogs/sustainable-manufacturing-eco-friendly-fashion-brand" className="underline text-[#CBB49A] hover:text-[#b7a078]">building an eco-friendly fashion brand</Link>.
                                </p>
                            </section>

                            {/* H2 8 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="Green fashion supply chain: a cutting-room floor at the end of a shift, a long table with a laid fabric spread and neatly bagged offcuts sorted into labelled bins beside it, a worker's back sweeping the aisle, late daylight through high windows against overhead strip lights."
                                        width={1376}
                                        height={768}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Audit your own product pages this month, before September does it for you. Every green word on the site gets matched to a document you can put your hand on, and anything that fails the test gets replaced with a narrower claim that passes.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    Then work backwards to the mill and ask for the two certificates by name. If you found more claims than documents this morning &mdash; which one would you defend first?
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
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design</Link>, sampling, <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">under one roof</Link>, from first sketch to shelf. How we approach responsible production is on our <Link href="/sustainability" className="underline text-[#CBB49A] hover:text-[#b7a078]">sustainability page</Link>. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Organic Cotton, GOTS and Recycled Polyester, Simplified</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">You know which documents to ask for. This is what each certification actually covers, and where each one stops.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Build the evidence file with your next run</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about sustainable clothing manufacturing &mdash; which mills hold live certification for your fabric, what the transaction certificates will say, and which claims your range can actually stand behind.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/eu-digital-product-passport-fashion-brands-2026",
                                            title: "The EU Digital Product Passport",
                                            dek: "The data every garment will have to carry, and who has to collect it.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/eu-buyers-sustainable-manufacturing-2026",
                                            title: "What EU Buyers Ask About Your Supply Chain",
                                            dek: "The five questions wholesale accounts send before they open a purchase order.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/anti-fast-fashion-slow-brand",
                                            title: "Building a Slow Brand in a Fast Market",
                                            dek: "Producing closer to demand — the waste reduction that also protects margin.",
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
                        Talk to a production lead about certified fabric for your next run <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
