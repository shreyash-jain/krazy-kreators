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

const BLOG_ID = "cpsc-efiling-sb-707-apparel-compliance-2026";

const HERO_IMAGE = "/blog/cpsc-sb707-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/cpsc-sb707-2026-section1.jpg";
const GARMENT_IMAGE = "/blog/cpsc-sb707-2026-garment.jpg";
const MACRO_IMAGE = "/blog/cpsc-sb707-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/cpsc-sb707-2026-closing.jpg";

const TOC = [
    { id: "two-rules", label: "Two rules, one week apart" },
    { id: "seven-fields", label: "What you have to file" },
    { id: "fabric-spec", label: "The exemption most brands miss" },
    { id: "warnings", label: "Warnings, not rejections" },
    { id: "sb707", label: "California, and what it costs" },
    { id: "the-move", label: "What we'd do in your shoes" },
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
/* Infographic 01 — the two compliance calendars on one rule           */
/* Every date is taken from the primary source and matches the body    */
/* Row pitch 58px, first row at y=26, six rows => 374px of art         */
/* ------------------------------------------------------------------ */
const TIMELINE = [
    { date: "1 Jul 2026", who: "CA", label: "Producers must have joined the approved PRO, Landbell USA." },
    { date: "8 Jul 2026", who: "US", label: "CPSC eFiling live. Warning messages, not rejections." },
    { date: "8 Jan 2027", who: "US", label: "Goods withdrawn from a foreign trade zone come into scope." },
    { date: "1 Mar 2027", who: "CA", label: "The PRO's first needs assessment is due to CalRecycle." },
    { date: "1 Jul 2028", who: "CA", label: "CalRecycle regulations take effect — at the earliest." },
    { date: "1 Jul 2030", who: "CA", label: "Plan approved. Civil penalties attach from here." },
];

function ComplianceCalendarGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Two calendars a US clothing brand is now on
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Federal dates in dark, California dates in bronze. The first two have already passed; the rest are the
                ones worth putting in a diary.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 384"
                    role="img"
                    aria-label="Timeline of apparel compliance dates: 1 July 2026 California producers join the approved PRO Landbell USA; 8 July 2026 CPSC eFiling goes live with warning messages rather than rejections; 8 January 2027 goods withdrawn from a foreign trade zone come into scope; 1 March 2027 the PRO's first needs assessment is due; 1 July 2028 CalRecycle regulations take effect at the earliest; 1 July 2030 the plan must be approved and civil penalties attach."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>Apparel compliance dates, 2026 to 2030</title>
                    <line x1="150" y1="18" x2="150" y2="352" stroke="#DDD7CC" strokeWidth="2" />
                    {TIMELINE.map((row, i) => {
                        const y = 26 + i * 58;
                        const fill = row.who === "US" ? "#2D2A2E" : "#8C7A5E";
                        return (
                            <g key={row.date}>
                                <text x="132" y={y + 6} fontSize="15" fontWeight="700" fill="#2D2A2E" textAnchor="end">
                                    {row.date}
                                </text>
                                <circle cx="150" cy={y} r="7" fill={fill} />
                                <text x="174" y={y + 6} fontSize="14.5" fill="#4A484A">
                                    {row.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Only one of these dates carries a fine, and it is four years out. The two that have already passed carry
                something slower instead &mdash; a record.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 02 — does an adult garment need a certificate?          */
/* Reads straight off 16 CFR 1610.1(d)(1) and (d)(2). 2.6 oz/sq yd     */
/* converts at 33.906 g/m2 per oz/yd2 => 88.2, quoted as "about 88".   */
/* Block pitch 140px, first block at y=8, three blocks => 428px        */
/* ------------------------------------------------------------------ */
const FLAM_STEPS = [
    {
        n: "1",
        q: [
            "Is the cloth made entirely from acrylic, modacrylic, nylon,",
            "olefin, polyester or wool — or only those fibres blended?",
        ],
        a: { kind: "exempt", text: "Yes → exempt from testing, 1610.1(d)(2). No filing." },
        b: { kind: "next", text: "No → go to step 2." },
    },
    {
        n: "2",
        q: [
            "Is the face smooth — no deliberately raised fibre,",
            "which means no pile, no nap and no tuft?",
        ],
        a: { kind: "scope", text: "No, it is raised → test it and certify it." },
        b: { kind: "next", text: "Yes → go to step 3." },
    },
    {
        n: "3",
        q: ["Does the cloth weigh 2.6 ounces per square yard", "— about 88 g/m² — or more?"],
        a: { kind: "exempt", text: "Yes → exempt from testing, 1610.1(d)(1). No filing." },
        b: { kind: "scope", text: "No → test it and certify it." },
    },
];

const PILL_FILL: Record<string, { bg: string; stroke: string; text: string }> = {
    exempt: { bg: "#EFEAE1", stroke: "#EFEAE1", text: "#2D2A2E" },
    scope: { bg: "#2D2A2E", stroke: "#2D2A2E", text: "#FFFFFF" },
    next: { bg: "#FFFFFF", stroke: "#DDD7CC", text: "#666666" },
};

function FlammabilityDecisionGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Does this adult garment need a certificate?
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                Three questions, all answered off the fabric spec sheet. They come straight from 16 CFR 1610.1(d),
                which is the only place the real answer lives.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 434"
                    role="img"
                    aria-label="Three-step decision chart for whether adult apparel needs a CPSC certificate. Step one: if the cloth is made entirely from acrylic, modacrylic, nylon, olefin, polyester or wool it is exempt from testing under 16 CFR 1610.1(d)(2) and needs no filing; otherwise go to step two. Step two: if the face has a raised surface with pile, nap or tuft it must be tested and certified; if the face is smooth go to step three. Step three: if the cloth weighs 2.6 ounces per square yard, about 88 grams per square metre, or more it is exempt from testing under 1610.1(d)(1) and needs no filing; if it is lighter it must be tested and certified."
                    className="w-full h-auto min-w-[600px]"
                >
                    <title>Certificate decision chart for adult apparel under 16 CFR 1610</title>
                    {FLAM_STEPS.map((step, i) => {
                        const y0 = 8 + i * 140;
                        const pa = PILL_FILL[step.a.kind];
                        const pb = PILL_FILL[step.b.kind];
                        return (
                            <g key={step.n}>
                                <rect
                                    x="1"
                                    y={y0}
                                    width="698"
                                    height="126"
                                    rx="14"
                                    fill="#FFFFFF"
                                    stroke="#E3DED5"
                                    strokeWidth="1.5"
                                />
                                <circle cx="34" cy={y0 + 32} r="15" fill="#CBB49A" />
                                <text
                                    x="34"
                                    y={y0 + 38}
                                    fontSize="15"
                                    fontWeight="800"
                                    fill="#FFFFFF"
                                    textAnchor="middle"
                                >
                                    {step.n}
                                </text>
                                <text x="62" y={y0 + 28} fontSize="15" fontWeight="700" fill="#2D2A2E">
                                    {step.q[0]}
                                </text>
                                <text x="62" y={y0 + 49} fontSize="15" fontWeight="700" fill="#2D2A2E">
                                    {step.q[1]}
                                </text>

                                <rect
                                    x="62"
                                    y={y0 + 70}
                                    width="300"
                                    height="40"
                                    rx="9"
                                    fill={pa.bg}
                                    stroke={pa.stroke}
                                />
                                <text x="76" y={y0 + 95} fontSize="12.5" fontWeight="600" fill={pa.text}>
                                    {step.a.text}
                                </text>

                                <rect
                                    x="376"
                                    y={y0 + 70}
                                    width="300"
                                    height="40"
                                    rx="9"
                                    fill={pb.bg}
                                    stroke={pb.stroke}
                                />
                                <text x="390" y={y0 + 95} fontSize="12.5" fontWeight="600" fill={pb.text}>
                                    {step.b.text}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                A 180 g/m&sup2; cotton tee leaves at step 3. A 100% polyester dress leaves at step 1. A brushed cotton
                fleece and a 70 g/m&sup2; rayon blouse do not leave at all.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */

export default function ComplianceClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("two-rules");
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
        showToast("Certificate readiness checklist on the way to your inbox.", "success");
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
                    alt="Apparel import compliance 2026: an importer's operations room late in the day, long desks of monitors showing entry data, banker boxes of clipped customs paperwork stacked along a filing wall, one person's back at the far screen under mixed fluorescent and window light."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Compliance
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">4 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 26, 2026</span>
                    </div>
                    <h1 className="text-[26px] sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.18] max-w-5xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        CPSC eFiling and California SB 707: What the New 2026 Apparel Compliance Rules Mean for Your Brand
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Neither rule will fine you this month. Both are building a record on your brand right now &mdash; and your fabric specification decides most of it.
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
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk &middot; August 26, 2026</p>
                        </div>
                    </div>

                    {/* Key takeaways */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Key takeaways</p>
                        <ul className="space-y-2 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>&bull; Since <strong>8 July 2026</strong>, your safety certificate has to reach Customs electronically as the goods arrive &mdash; <strong>seven pieces of information</strong>, per product.</li>
                            <li>&bull; Most adult clothing is <strong>exempt</strong>, and it is your <strong>fabric spec</strong> that decides. Two things settle it: the weight, and whether the surface is smooth or brushed.</li>
                            <li>&bull; Nothing is being turned away at the border yet. Your filings are quietly building a <strong>risk score</strong> instead &mdash; and that score decides whose containers get held in 2027.</li>
                            <li>&bull; California&rsquo;s <strong>SB 707</strong> told brands over <strong>$1m in global sales</strong> to register by 1 July. Real fees are years away, and the choices that set them are made in the tech pack.</li>
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
                                        <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Design</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What a tech pack actually is</p>
                                        </Link>
                                        <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Fabric GSM, and choosing the right weight</p>
                                        </Link>
                                        <Link href="/blogs/made-in-usa-clothing-label-rules-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Compliance</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The rules behind a &ldquo;Made in USA&rdquo; label</p>
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
                                When the Consumer Product Safety Commission added up the paperwork its new import rule would create, clothing came out on top by a distance: <a href="https://www.federalregister.gov/documents/2025/01/08/2024-30826/certificates-of-compliance" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">16,290,891 certificate filings a year</a> &mdash; more than ten times the number it expects from toys.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Since 8 July, all of them are supposed to arrive electronically, the moment your goods reach the border. A week before that, California started a list of its own.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Here is the part almost everyone gets wrong. Neither rule is going to fine you this month.
                            </p>

                            {/* H2 1 */}
                            <section id="two-rules" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Two rules, one week apart
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="Product safety documentation apparel: a single unbranded lightweight plain-weave blouse on a headless dress form, hard window backlight driving through the cloth so the weave reads almost translucent, sample room and garment rail lost in shadow behind."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The federal rule is about the border. Since <strong>8 July 2026</strong>, your safety certificate has to be filed electronically with Customs as the goods arrive, instead of being dug out weeks later when an inspector asks.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The Californian one is about what happens after the garment wears out. <a href="https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240SB707" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">SB 707</a> told every covered brand to join the state&rsquo;s approved recycling body by <strong>1 July 2026</strong>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    They look unrelated. You answer both out of the same folder: the fabric spec, the test report, the bill of materials, the factory address. In most young brands that folder belongs to the factory.
                                </p>
                            </section>

                            {/* H2 2 */}
                            <section id="seven-fields" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What you actually have to file
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    eFiling means the data goes into ACE, the system Customs already uses for your entry. Section 1110.11 lists seven things, and no others.
                                </p>

                                <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 rounded-r-2xl mb-6 not-prose">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">The seven fields</p>
                                    <ol className="space-y-2 text-[#2D2A2E] text-base leading-snug list-decimal pl-5">
                                        <li>A product identifier and enough description to match the certificate.</li>
                                        <li>Every safety rule you are certifying to, listed separately.</li>
                                        <li>The certifier&rsquo;s name, address, email and phone.</li>
                                        <li>The same for whoever keeps the records behind it.</li>
                                        <li>Date and place of manufacture.</li>
                                        <li>Date and place of testing, or the exclusion you claim instead.</li>
                                        <li>An attestation that it is true.</li>
                                    </ol>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Send all seven with every shipment, or load them into CPSC&rsquo;s Product Registry once and send a reference number after that. Small parcels are no way around it either &mdash; the rule covers <Link href="/blogs/de-minimis-hangover-2026-parcel-costs" className="underline text-[#CBB49A] hover:text-[#b7a078]">de-minimis parcels</Link> too.
                                </p>

                                <ComplianceCalendarGraphic />
                            </section>

                            {/* H2 3 */}
                            <section id="fabric-spec" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The exemption most brands do not know they have
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro under raking sidelight of two cloths meeting: a brushed raised-nap fleece with fibres standing proud on the left, a flat plain weave with crisp warp and weft on the right — the surface difference that decides CPSC flammability scope."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Ordinary adult clothing is touched by exactly one CPSC rule: 16 CFR 1610, the flammability standard. And <a href="https://www.ecfr.gov/current/title-16/chapter-II/subchapter-D/part-1610/subpart-A/section-1610.1" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">section 1610.1(d)</a> lets most of what the industry makes off the hook.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two kinds of fabric are exempt from testing. Any smooth-faced cloth weighing 2.6 ounces per square yard or more, whatever it is made of &mdash; roughly <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="underline text-[#CBB49A] hover:text-[#b7a078]">88 g/m&sup2;</Link>, lighter than any jersey you would cut a tee from. And any cloth at all, at any weight, made entirely from acrylic, modacrylic, nylon, olefin, polyester or wool.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    CPSC said so directly in the new rule: no certificate is required where a product relies on enforcement discretion, &ldquo;such as adult wearing apparel relying on 16 CFR 1610.1(d).&rdquo; So a cotton tee, a polyester dress and a wool coat need no filing.
                                </p>

                                <FlammabilityDecisionGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Now the half that catches people. Smooth-faced means no deliberately raised fibre &mdash; no pile, no nap, no tuft. Brushed flannel, fleece, terry and corduroy are all raised, so unless they are made from those six fibres they are outside the exemption at any weight. So is a light rayon blouse or a silk georgette. Those need testing, a certificate, and a filing at the border.
                                </p>

                                <blockquote className="not-prose my-8 border-l-4 border-[#CBB49A] pl-6 py-2">
                                    <p className="text-2xl lg:text-3xl font-serif leading-snug text-[#2D2A2E]">
                                        Weight and surface. Two lines on a spec sheet now decide whether a style is a customs filing or nothing at all.
                                    </p>
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Certificate Readiness Checklist</h4>
                                        <p className="text-[#4A484A] leading-snug">One page per style: the seven fields, the exact question to ask your factory for each, and the decision chart above as a printable.</p>
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
                                            Send me the checklist
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">On its way. Check your inbox.</p>
                                )}
                            </div>


                            {/* H2 4 */}
                            <section id="warnings" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Nobody is being turned away. That is the trap.
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Six weeks in, the disaster everyone braced for has not arrived. CPSC has said it <a href="https://diaztradelaw.com/mandatory-cpsc-efiling-importer-compliance/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">does not intend to reject entries</a> purely because the data is missing. You get a warning instead.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That is not a grace period. CPSC is still enforcing the certificate requirement, and it wrote the real mechanism into the rule: importers who consistently file good data should &ldquo;see a reduction in their risk scores, which may result in fewer holds for exams, fewer warehouse charges.&rdquo;
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That works both ways, and nobody writes to tell you your score has slipped. The cost of a sloppy first year is not a fine. It is that in eighteen months your containers get pulled and a competitor&rsquo;s sail through.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="sb707" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    California, and what it will really cost
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Customs compliance clothing brand: a hand holding a round fabric test disc up to window light on a scarred oak worktable, a steel GSM cutting die and four discs of different weights fanned out on brown paper beside it, rolls of greige cloth racked behind."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    SB 707 catches any brand selling into California with more than <strong>$1m in annual global sales</strong> &mdash; global, not Californian. Covered products run past clothing into bedding, towels and footwear. Registration for this early phase is a flat $1,000 a year.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Do not let anyone rush you into spending beyond that. The fees are not set and the real penalties do not bite until 2030. The scheme is also being <a href="https://www.mondaq.com/unitedstates/environmental-law/1829358/california-court-tentatively-denies-injunction-against-textile-epr-program" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">challenged in court</a> by the industry&rsquo;s own trade body, though a judge declined to halt it on 6 August.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    What will cost you eventually is the fee design: lower rates for garments that are easy to recycle, penalty rates for the ones that are not. Those choices get made in the tech pack &mdash; <Link href="/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester" className="underline text-[#CBB49A] hover:text-[#b7a078]">the fibre blend</Link>, the trims, and whether you built something a recycler will take or a poly-cotton-elastane sandwich none of them will.
                                </p>
                            </section>

                            {/* H2 6 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A design studio wall at dusk covered in a pinned grid of tech-pack printouts and flat sketches marked up in pen, a person's back reviewing them, angled desk lamp against blue evening window light."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Pull your ten biggest styles. Weigh the cloth, note whether the face is smooth or brushed, and split them into two piles: needs a certificate, does not. A brand with a <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="underline text-[#CBB49A] hover:text-[#b7a078]">proper tech pack</Link> already holds most of this. One running on email threads will be rebuilding it under pressure.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    One caveat: this is enforcement discretion, not a permanent exemption, and it can be narrowed without a new rule. Keep the test reports you have. And a question worth sitting with &mdash; if someone asked you this afternoon for the factory address behind your best-selling style, how long would it take you to answer?
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
                                <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">What a Tech Pack Actually Is</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">Three of the five documents above start life here. This is what a complete one contains.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Get your documentation straight before the next run</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about the spec, the test reports and the records behind a style &mdash; the paperwork that decides how your entries are scored.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight",
                                            title: "Fabric GSM, and Choosing the Right Weight",
                                            dek: "The number that now decides whether a style is a customs filing or nothing at all.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/made-in-usa-clothing-label-rules-2026",
                                            title: "The Rules Behind a &ldquo;Made in USA&rdquo; Label",
                                            dek: "The other claim on your garment that has to survive a regulator reading it.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/apparel-tariffs-july-2026-forced-labor-301-regime",
                                            title: "The Forced-Labor Duty Regime",
                                            dek: "What else your country of origin is now deciding at the moment of entry.",
                                            read: "9 min read",
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
                        Talk to a production lead about your documentation <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
