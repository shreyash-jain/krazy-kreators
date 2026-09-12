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

const BLOG_ID = "custom-packaging-for-streetwear-brands";

const HERO_IMAGE = "/blog/streetwear-packaging-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/streetwear-packaging-2026-section1.jpg";
const MACRO_IMAGE = "/blog/streetwear-packaging-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/streetwear-packaging-2026-closing.jpg";

const TOC = [
    { id: "part-of-product", label: "When everything ships at once" },
    { id: "formats", label: "Mailer, box, and what sits between" },
    { id: "usps", label: "The 166-to-139 change" },
    { id: "cost", label: "What it costs at drop volume" },
    { id: "sustainable", label: "The label you cannot safely print" },
    { id: "epr", label: "Seven states now charge a fee" },
    { id: "sharing", label: "What packaging really does" },
    { id: "timeline", label: "Packaging has a lead time" },
    { id: "the-move", label: "The bottom line" },
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
/* Infographic 1 — the July 2026 USPS dimensional-weight change        */
/* Bars scale at 24px per billable pound. Every figure below is        */
/* repeated verbatim in the body text of the "usps" section.           */
/* Volumes: 12x15 flat mailer (under 1 cu ft), 14x10x4 = 560 cu in,    */
/* 18x14x8 = 2,016 cu in. 2016/166 = 12.14 -> 13 lb; 2016/139 = 14.50  */
/* -> 15 lb. DIM applies only above 1,728 cu in (one cubic foot).      */
/* ------------------------------------------------------------------ */
const DIM_ROWS = [
    {
        label: "Poly mailer, one hoodie",
        sub: "Flat — never reaches one cubic foot",
        before: 2,
        after: 2,
    },
    {
        label: "Mailer box, 14 × 10 × 4 in",
        sub: "560 cu in — under the limit, so you pay on real weight",
        before: 2,
        after: 2,
    },
    {
        label: "Presentation box, 18 × 14 × 8 in",
        sub: "2,016 cu in — over one cubic foot, so the size rule kicks in",
        before: 13,
        after: 15,
    },
];

function DimWeightGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Which parcels the July change actually hits
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                What USPS charges you for, on the same hoodie in three kinds of packaging, before and after 12 July
                2026. Dark bars are the old rule, gold bars the new one. The size rule only kicks in above one cubic
                foot, which is why the first two parcels do not move at all.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 360"
                    role="img"
                    aria-label="Bar chart comparing billable weight before and after the USPS dimensional weight change of 12 July 2026. A poly mailer holding one hoodie is billed at 2 pounds before and after. A 14 by 10 by 4 inch mailer box, 560 cubic inches, is billed at 2 pounds before and after. An 18 by 14 by 8 inch presentation box, 2,016 cubic inches, rises from 13 billable pounds to 15 billable pounds because the dimensional divisor fell from 166 to 139."
                    className="w-full h-auto min-w-[600px]"
                >
                    <title>USPS billable weight by packaging format, before and after 12 July 2026</title>
                    {DIM_ROWS.map((row, i) => {
                        const y = 34 + i * 108;
                        return (
                            <g key={row.label}>
                                <text x="0" y={y - 12} fontSize="15" fontWeight="700" fill="#2D2A2E">
                                    {row.label}
                                </text>
                                <text x="0" y={y + 4} fontSize="12" fill="#666666">
                                    {row.sub}
                                </text>
                                <rect x="0" y={y + 14} width={row.before * 24} height="22" rx="5" fill="#2D2A2E" />
                                <text x={row.before * 24 + 10} y={y + 31} fontSize="14" fontWeight="700" fill="#2D2A2E">
                                    {row.before} lb
                                </text>
                                <rect x="0" y={y + 42} width={row.after * 24} height="22" rx="5" fill={ACCENT} />
                                <text x={row.after * 24 + 10} y={y + 59} fontSize="14" fontWeight="700" fill="#2D2A2E">
                                    {row.after} lb
                                </text>
                            </g>
                        );
                    })}
                    <line x1="0" y1="344" x2="420" y2="344" stroke="#D6D1C7" strokeWidth="2" />
                    {[0, 5, 10, 15].map((t) => (
                        <text key={t} x={t * 24} y="337" fontSize="12" fill="#666666" textAnchor={t === 0 ? "start" : "middle"}>
                            {t} lb
                        </text>
                    ))}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                This is not a general price rise on packaging. It is a charge for empty space. Two extra pounds on
                every order is what it costs to make the box big enough to feel like an occasion.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 — the packaging-fee scope test                        */
/* Thresholds match the body text: Oregon ORS 459A.863(32) $5m gross   */
/* revenue or 1 metric ton; Colorado's dollar limit CPI-adjusted each  */
/* 1 July ($5,632,843 as at 1 July 2025). Tonnage arithmetic below is  */
/* stated as an assumption in the caption, not as a sourced figure.    */
/* ------------------------------------------------------------------ */
const SCOPE_GATES = [
    {
        n: "1",
        q: "Gross revenue under $5 million last fiscal year?",
        out: "You owe nothing — no registering, no reporting, no fee",
        good: true,
    },
    {
        n: "2",
        q: "Above that, but sending under one metric ton of packaging into that state this year?",
        out: "You still owe nothing — the weight test works on its own",
        good: true,
    },
    {
        n: "3",
        q: "Neither of the above.",
        out: "Register with the state's producer organization, report what you ship, pay the fee",
        good: false,
    },
];

function ScopeTestGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Whether the packaging fee reaches you at all
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                The test, run state by state and re-run every year. Oregon&rsquo;s numbers are shown; Colorado uses the
                same two, with its dollar figure adjusted for inflation each July.
            </p>

            <div className="space-y-3">
                {SCOPE_GATES.map((g) => (
                    <div
                        key={g.n}
                        className={`rounded-xl border p-4 sm:flex sm:items-start sm:gap-4 ${g.good ? "border-[#CBB49A]/50 bg-white" : "border-[#2D2A2E]/20 bg-[#2D2A2E]/[0.04]"}`}
                    >
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold mb-2 sm:mb-0 ${g.good ? "bg-[#CBB49A] text-white" : "bg-[#2D2A2E] text-white"}`}
                        >
                            {g.n}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-[#2D2A2E] leading-snug">{g.q}</p>
                            <p className={`text-sm leading-snug mt-1 ${g.good ? "text-[#8C7A5E]" : "text-[#4A484A]"}`}>
                                &rarr; {g.out}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                To picture the second test: one metric ton is about 70,000 parcels if you ship in a poly mailer
                weighing around 14 grams, roughly half an ounce &mdash; or about 4,500 if you ship a box weighing
                around 220 grams, about half a pound, with tissue and a card inside. Those are typical weights, not
                measured ones. Weigh one of your own filled parcels before you rely on the math.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Format comparison — figures repeated in the body of "formats"       */
/* ------------------------------------------------------------------ */
const FORMAT_ROWS = [
    {
        format: "Poly mailer",
        forWhat: "Tees, hoodies, anything that folds without creasing badly",
        against: "No structure, so it feels purely practical unless you dress it up",
    },
    {
        format: "Mailer box (folding corrugated)",
        forWhat: "Multi-item orders, anything with a brim or a panel to protect",
        against: "Heavier, bulkier, and the only format that can cross a cubic foot",
    },
    {
        format: "Rigid presentation box",
        forWhat: "A collaboration piece, an archive release, a genuine gift purchase",
        against: "Expensive per unit, slow to make, and the customer either keeps it or throws it out",
    },
    {
        format: "Tissue, sticker, card, tape",
        forWhat: "Carrying the drop's artwork without locking your mailers into it",
        against: "Adds a few seconds of packing per order, which adds up over 800 parcels",
    },
];

export default function StreetwearPackagingClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("part-of-product");
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
        showToast("Drop Packaging Spec Sheet on the way to your inbox.", "success");
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
                    alt="Custom packaging for streetwear brands: the dispatch corner of a small clothing studio at first light, a rail of dark heavyweight garments beside a steel table of flat unprinted grey mailers, sealed parcels stacked on the floor in cold window light."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Business
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">10 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 7, 2026</span>
                    </div>
                    {/* No <span> inside this h1: globals.css @layer base sets
                        `p, span, li { color: #3D3846 }`, which overrides the inherited
                        white and renders the wrapped line near-invisible on the dark hero. */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        Custom Streetwear Packaging and Unboxing:<br className="hidden sm:block" />{" "}
                        Turning DTF-Printed Drops into a Brand Experience
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Not advice about pretty boxes. What the parcel does to your packing line, your shipping bill, your returns and your compliance in the 48 hours after a drop sells out.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">&middot; Growth &amp; Business</span></p>
                            <p className="text-sm text-[#666666]">The Krazy Kreators growth &amp; business desk &middot; September 7, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="not-prose border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">The short version</p>
                        <ul className="space-y-2 text-[#2D2A2E] leading-snug">
                            <li>&bull; A drop ships everything in the same two days, so packaging is a throughput problem first. A boxed parcel with inserts takes roughly three times as long to pack as a mailer with a sticker.</li>
                            <li>&bull; USPS cut its dimensional divisor from 166 to 139 on 12 July. It only bites above one cubic foot &mdash; which is exactly where presentation boxes live.</li>
                            <li>&bull; Keep the film plain and put the drop&rsquo;s artwork on stickers and cards. Seven states now charge a packaging fee, but under $5 million in revenue you are exempt.</li>
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
                                        <Link href="/blogs/the-drop-culture-model" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Strategy</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The drop-culture model, and why scarcity sells</p>
                                        </Link>
                                        <Link href="/blogs/dtf-vs-screen-printing-right-for-volume" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">DTF vs screen printing: which is right for your volume</p>
                                        </Link>
                                        <Link href="/blogs/de-minimis-hangover-2026-parcel-costs" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What the end of de minimis did to parcel costs</p>
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
                                A drop that sells out in forty minutes hands you a different problem by lunchtime: several hundred parcels that have to be out of the door within two days, packed in whatever you decided to buy months ago.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                That is the moment packaging stops being a design question. It becomes a question of how fast you can pack, what the carrier charges for the size of the box, what happens when a parcel comes back, and &mdash; since this summer &mdash; whether what is printed on it is legal. None of that shows up on a mood board.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Custom packaging for streetwear brands has been creeping closer to the product itself for years, and most of what gets written about it is advice on making it prettier. This is not that. It is about the operational decisions hiding inside the parcel &mdash; and about three rules that changed between 12 July and 27 August that made each of them more expensive to get wrong.
                            </p>

                            {/* H2 1 */}
                            <section id="part-of-product" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why packaging is part of the product when everything ships at once
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Streetwear unboxing experience: an extreme close-up of a thumb pressing the adhesive seal strip of a matte charcoal poly mailer closed, hard raking sidelight across the creased film."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A drop squeezes a season&rsquo;s worth of shipping into a weekend. A normal shop sends parcels at the rate customers turn up. A drop sends all of them at the rate the checkout closed. Whatever your parcel is, you are about to build several hundred of it by hand, against a clock.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So time one before you decide anything else. Say a mailer with a sticker takes thirty seconds &mdash; fold, bag, seal, sticker, label &mdash; and a box with tissue, a card and branded tape takes ninety. Then 800 orders is about seven hours of packing against about twenty. Your own timings will differ. The ratio between them usually does not.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That is what &ldquo;part of the product&rdquo; really means here. The parcel is the last step you control, the first thing the customer handles, and the only part of the <Link href="/blogs/the-drop-culture-model" className="underline text-[#CBB49A] hover:text-[#b7a078]">drop</Link> that gets built after the money has landed. Slow it down and you are writing a delay email to every buyer. Get it wrong and all that waiting ends in a late, creased delivery.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    How you print the garments sets the pace of all this. With DTF, the design goes onto a sheet of film and is heat-pressed onto the shirt, so there are no screens to make and nothing to set up between one design and the next. That means lots of designs in small runs, which is why DTF brands drop more often and change their artwork more often. It is the whole appeal. It is also why tying your packaging to any single design gets expensive. If you are still weighing the method itself, we compared it against screen printing in <Link href="/blogs/dtf-vs-screen-printing-right-for-volume" className="underline text-[#CBB49A] hover:text-[#b7a078]">DTF vs screen printing</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This argument gets pushed too far, so here is where it stops. Packaging keeps customers. It does not win them. Nobody buys a hoodie because of the mailer, and a beautiful parcel will not save a garment whose <Link href="/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes" className="underline text-[#CBB49A] hover:text-[#b7a078]">weight and finish</Link> disappoint when it comes out of the bag. Spend here once the product is right. Never instead of getting it right.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">The questions a parcel has to answer before it looks like anything</p>
                                    <ul className="space-y-2 text-[#2D2A2E] leading-snug">
                                        <li>&bull; <strong>Who packs it.</strong> You, or a fulfilment warehouse &mdash; which will charge for every extra insert, needs your packaging on its shelf before the drop, and may refuse a multi-step unboxing outright</li>
                                        <li>&bull; <strong>What happens when it comes back.</strong> A mailer with a second peel strip means a return goes out in the bag it came in; without one, every return costs a new bag</li>
                                        <li>&bull; <strong>What it does when it is thrown.</strong> Fleece survives a mailer. A cap, or anything with a structured panel, does not &mdash; that item needs a box whatever the rest of the range ships in</li>
                                        <li>&bull; <strong>What runs out first.</strong> A drop that oversells or takes backorders will outrun its packaging. Buy plain mailers with a buffer above the garment count, and print only the insert</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 2 */}
                            <section id="formats" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Mailer, box, and what sits between them
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    There are only three ways to ship a garment, plus the small stuff you put inside, which does most of the branding work. A poly mailer is the sealed plastic envelope. A mailer box is folding cardboard &mdash; flat when it arrives, a shallow box once you fold it up. A rigid presentation box is the sturdy lidded kind people keep on a shelf.
                                </p>

                                <div className="not-prose my-7 overflow-x-auto rounded-2xl border border-gray-200">
                                    <table className="w-full min-w-[640px] text-left border-collapse bg-white">
                                        <thead>
                                            <tr className="bg-[#F8F7F4]">
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">Format</th>
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">What it is for</th>
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">What it costs you</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {FORMAT_ROWS.map((row) => (
                                                <tr key={row.format} className="align-top">
                                                    <td className="p-4 border-b border-gray-100 font-semibold text-[#2D2A2E]">{row.format}</td>
                                                    <td className="p-4 border-b border-gray-100 text-[#4A484A]">{row.forWhat}</td>
                                                    <td className="p-4 border-b border-gray-100 text-[#4A484A]">{row.against}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Most established drop brands end up in the same place: a plain mailer, with a printed sticker, a card and branded tape doing all the talking. Change the sticker, change the drop.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-6">
                                    <p className="text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                        &ldquo;Print the thing you can reprint in a week. Keep the thing you buy ten thousand of plain.&rdquo;
                                    </p>
                                </div>
                            </section>

                            {/* H2 3 */}
                            <section id="usps" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The 166-to-139 change, and who it actually hits
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Carriers charge you for whichever is bigger: what your parcel actually weighs, or what its size says it ought to weigh. They work that second figure out by multiplying length by width by height, then dividing by a number they pick themselves. The trade calls it dimensional weight. The smaller their number, the more you pay for empty space.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    On <a href="https://support.pirateship.com/en/articles/15453569-july-2026-usps-rate-and-rule-changes" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">12 July 2026, USPS cut that number from 166 to 139</a> and started rounding every part-inch up to the next full inch. Ground Advantage Commercial rates went up about 11.8% on average the same day.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is the part packaging suppliers tend to leave out. USPS only uses dimensional weight on parcels <a href="https://www.dclcorp.com/blog/shipping/usps-dim-weight-changes-2026/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">bigger than one cubic foot</a>, which is 1,728 cubic inches. A hoodie in a poly mailer is nowhere near that. A hoodie in a 14 by 10 by 4 inch mailer box comes to 560 cubic inches &mdash; still comfortably under.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    An 18 by 14 by 8 inch presentation box is 2,016 cubic inches. That one crosses the line. Under the old number it was billed as 13 pounds. Under the new one, 15. You now pay for two extra pounds on every order in the drop, to ship a garment that weighs less than two.
                                </p>

                                <DimWeightGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So this is not an argument against nice packaging. It is an argument against empty space, and it rewards anyone who measures the folded garment and buys a box that fits it, instead of picking a stock size with three inches of air inside.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Drop Packaging Spec Sheet</h4>
                                        <p className="text-[#4A484A] leading-snug">One page to fill in before you talk to a packaging supplier: the folded size of every garment in the range, the cubic-foot check, your insert list, the date the artwork has to be final, and the state-by-state fee questions to answer once a year. Spreadsheet + PDF.</p>
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
                                            Send me the spec sheet
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">On its way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="cost" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What custom apparel packaging design costs at drop volume
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Limited drop presentation: an angled view into an open plain kraft box on a timber bench, a folded dark heavyweight sweatshirt nested in unprinted cream tissue, one hand entering the frame mid-fold in warm afternoon light."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The price per bag is the easy part. One supplier&rsquo;s <a href="https://www.ecopackables.com/blogs/news/how-much-does-packaging-cost" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">published 2026 price guide</a> puts custom-printed poly mailers somewhere between eight cents and eighty cents each. Minimum orders usually start around 500 for a standard size, and 1,000 to 2,500 if you want your own size. Order 5,000 instead of 500 and the price per bag drops by 30 to 50 percent.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That discount is a trap for drop brands in particular. The quantity that makes printed film cheap is far bigger than any one drop. Buy at the price that looks sensible and you have just bought packaging for four drops you have not designed yet.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fine, if the artwork is just your logo. Expensive, if the artwork names the drop &mdash; because whether that drop sells out in an hour or barely moves, you are left holding film you can never use again. Plain film plus a printed insert exists to solve exactly this.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs you are over-buying packaging</p>
                                    <ul className="space-y-2 text-[#2D2A2E] leading-snug">
                                        <li>&bull; The artwork on the mailer names a season, a year or a collaboration</li>
                                        <li>&bull; You ordered more <em>printed</em> packaging than garments &mdash; plain film can carry a buffer for oversells, printed film cannot</li>
                                        <li>&bull; You picked the box off a stock size chart instead of measuring a folded garment</li>
                                        <li>&bull; Nobody has weighed a filled parcel on the scale you actually ship from</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 5 */}
                            <section id="sustainable" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The recycling label you cannot safely print yet
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    California&rsquo;s SB 343 was written to stop the little triangle of chasing arrows turning up on things that never actually get recycled. Under it, you can only print that symbol if the material is <a href="https://calrecycle.ca.gov/wcs/recyclinglabels" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">collected by recycling programs covering at least 60% of Californians</a>, and sorted by facilities serving at least 60% of those programs. It applies to anything made after 4 October 2026.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then on 14 July, a federal court in San Diego <a href="https://www.nortonrosefulbright.com/en-us/knowledge/publications/a9452502/federal-court-enjoins-californias-sb-343-truth-in-recycling-law" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">blocked California from enforcing it</a>, saying the law was too vague and got in the way of truthful speech. So the deadline is still on the books, but nobody is enforcing it, and an appeal could send it either way.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    If you are ordering a print run this month, the safe move is to print only what you can back up and leave the symbol off. Name the material, and tell people where it goes. &ldquo;Recycle at a store drop-off&rdquo; is true for poly film, and it holds up whichever way this law lands. Chasing arrows on a mailer that no curbside program accepts is the claim you would have to defend.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The same logic applies to the word recyclable on the garment itself, which we covered in <Link href="/blogs/sustainable-clothing-manufacturing-eco-conscious-fashion-brand" className="underline text-[#CBB49A] hover:text-[#b7a078]">building an eco-conscious brand without the greenwash</Link>.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="epr" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Seven states now charge a fee on your packaging
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Seven states &mdash; California, Colorado, Maine, Maryland, Minnesota, Oregon and Washington &mdash; have passed laws making the companies that send packaging into a state help pay for collecting it again. The trade name for this is extended producer responsibility, usually shortened to EPR. Oregon&rsquo;s producer organization has been <a href="https://www.oregon.gov/deq/recycling/pages/producers-of-covered-products.aspx" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">charging fees since 1 July 2025</a>; Colorado&rsquo;s obligations began in January 2026.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The companies paying those fees argued they were unconstitutional. On 27 August, after a five-day trial, a federal judge <a href="https://www.opb.org/article/2026/08/28/oregon-recycling-wholesale-distributors-lawsuit/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">upheld Oregon&rsquo;s law in full</a> and lifted the order that had protected some of them since February. For practical purposes, that argument is over.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Now the part that matters to you, and it is good news. Oregon charges nothing to a company with <a href="https://oregon.public.law/statutes/ors_459a.863" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">gross revenue under $5 million</a>, and nothing to a company of any size that sends less than one metric ton of packaging &mdash; about 2,200 pounds &mdash; into the state in a year. Colorado uses the same two tests, and raises its dollar figure with inflation every July.
                                </p>

                                <ScopeTestGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Most brands reading this owe nothing, and will owe nothing for years. The catch is that both tests get run every year. The year you cross the line, registering stops being optional, and in Oregon not registering is a violation carrying penalties of up to $25,000 a day. Check it once a year, in the same week you close your books.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One more thing worth knowing: California now runs a separate program for the clothing itself, not just the box. We went through the July deadline in <Link href="/blogs/cpsc-efiling-sb-707-apparel-compliance-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">SB 707 and apparel compliance</Link>.
                                </p>
                            </section>

                            {/* H2 7 */}
                            <section id="sharing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What packaging really does for sharing and repeat orders
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is where the evidence gets thin, and it is worth saying so plainly, because these numbers get quoted at founders as though they settle the argument.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The figure everyone quotes &mdash; that around three-quarters of Americans say packaging design affects what they buy &mdash; comes from an <a href="https://www.ipsos.com/en-us/news-polls/Most-Americans-Say-That-the-Design-of-a-Products-Packaging-Often-Influences-Their-Purchase-Decisions" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Ipsos poll of 2,002 adults</a>. The real number is 72%, it was taken in April 2018, and it was paid for by the Paper and Packaging Board &mdash; a paper industry group asking the public whether they like paper. The claim that unboxing drives social sharing goes back to a <a href="https://www.prweb.com/releases/new_study_finds_40_percent_of_consumers_have_shared_product_photos_or_videos_on_social_media/prweb12797936.htm" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">2015 survey of 524 shoppers</a>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of that makes packaging worthless. It means the industry-wide numbers are no use for setting your budget. A drop brand has a better option anyway: ship one drop in the upgraded packaging and the next one plain, then compare how many people came back within 90 days.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-6">
                                    <p className="text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                        &ldquo;A statistic funded by someone selling you the answer is a sales aid, not evidence.&rdquo;
                                    </p>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One thing holds up without any survey behind it. The cheapest thing in the parcel worth sharing is almost never the parcel. A sticker sheet ends up on a laptop lid, and travels a lot further than any box ever will.
                                </p>
                            </section>

                            {/* H2 8 */}
                            <section id="timeline" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Packaging has a lead time, and it runs against your drop date
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Most founders plan the garment first and buy the packaging afterwards. That order is backwards the moment your packaging is printed, because printed film and custom board each need their own artwork sign-off, their own physical proof and their own production run. Four to eight weeks, start to finish.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    If the factory is packing your order rather than you, the packaging has to reach the factory <em>before</em> the garments come off the line. That pulls your artwork deadline forward again, by however long it takes to ship the packaging out there. It is the step that catches people out. Our <Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">sketch-to-store timeline</Link> shows where the garment weeks go; packaging runs alongside them, not after.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Always ask for a physical proof, and sign it yourself. Matte film and uncoated cardboard both dull color, and your screen will not warn you. The other reliable way to get this wrong is ordering a stock-size box before anyone has folded the actual garment. Fold it, measure it, then buy the box that fits.
                                </p>
                            </section>

                            {/* H2 9 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="DTC brand packaging: a single sealed kraft parcel resting on a worn concrete doorstep at night, held in a pool of warm porch light, the doorway and street beyond falling into darkness."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Packaging deserves the attention drop brands give it. It just deserves it as an operations decision &mdash; packing time, billable weight, returns, compliance &mdash; made before the artwork, not as a design decision made after it.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    If we were in your shoes: pack one parcel against a stopwatch, then fold the garment, measure it, and buy the smallest thing that protects it &mdash; checking the one-cubic-foot line before anything else. Keep the film plain, and spend the design money on the insert you can reprint in a week. Only print claims you can back up. Then set one reminder a year to check whether your revenue has crossed a line in any of those seven states.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So what is your next drop actually shipping in &mdash; and has anyone packed one with a stopwatch running yet?
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
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design</Link>, sampling, <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">under one roof</Link>, from first sketch to shelf. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/the-drop-culture-model" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The Drop Culture Model</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">You know what the parcel has to do. This is the machine it arrives at the end of &mdash; scarcity, timing, and why the calendar matters more than the discount.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Plan Your Drop Packaging with Krazy Kreators</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Bring us the range and the date it ships. We will work through the folded size of every piece, the format that protects it without paying for empty space, the inserts that carry your artwork, and a packaging schedule that runs alongside production instead of behind it.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/de-minimis-hangover-2026-parcel-costs",
                                            title: "The De Minimis Hangover",
                                            dek: "What the end of duty-free parcels did to the cost of shipping a single order.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes",
                                            title: "Heavy GSM, Puff Prints and Acid Washes",
                                            dek: "The construction vocabulary behind the current streetwear look, decoded.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/cpsc-efiling-sb-707-apparel-compliance-2026",
                                            title: "SB 707 and Apparel Compliance",
                                            dek: "California's textile scheme, and which brands the July deadline actually reached.",
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
                        Plan your drop packaging with Krazy Kreators <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
