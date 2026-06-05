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

const BLOG_ID = "holiday-2026-production-window-us-founders-order-now";

const HERO_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780646331/blog/holiday_production_window_hero.jpg";
const SECTION1_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780646342/blog/holiday_production_window_floor.jpg";
const TIMELINE_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780646348/blog/holiday_production_window_timeline.jpg";
const DECISIONS_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780646354/blog/holiday_production_window_decisions.jpg";

const TOC = [
    { id: "real-deadline", label: "The real deadline" },
    { id: "overseas-cycle", label: "The 4–5 month cycle" },
    { id: "three-decisions", label: "Three decisions to lock" },
    { id: "when-timeline-breaks", label: "When the timeline doesn't apply" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function HolidayProductionWindowClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("real-deadline");
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
    const [tocPinned, setTocPinned] = useState(false);
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

            // JS-driven sticky TOC (CSS sticky breaks because globals.css forces overflow-x: hidden on html/body)
            const aside = asideRef.current;
            const article = articleRef.current;
            const tocBox = tocBoxRef.current;
            if (aside && article) {
                const asideRect = aside.getBoundingClientRect();
                const articleRect = article.getBoundingClientRect();
                const shouldPin = asideRect.top < 112 && articleRect.bottom > 200;
                setTocPinned(shouldPin);
                setTocGeometry({ left: asideRect.left, width: asideRect.width });
                if (!shouldPin && tocBox) {
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
        showToast("Checklist on the way to your inbox.", "success");
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
            <section className="relative h-[60vh] min-h-[560px] max-h-[720px] flex items-center justify-center overflow-hidden">
                <Image
                    src={HERO_IMAGE}
                    alt="A US clothing brand studio in early June — a wall calendar marked with Black Friday Nov 27, design samples and fabric POs spread across the desk, late-afternoon light"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Manufacturing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">June 5, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        What to Lock for Holiday<br className="hidden sm:block" /> Before the Window Closes
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Black Friday lands Nov 27 — and the production clock means your real deadline is this month.
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">

                    {/* Interaction bar */}
                    <div className="mb-12 p-4 bg-[#F8F7F4] rounded-xl flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-4">
                            <button onClick={handleLike} aria-pressed={isLiked} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200 text-sm font-medium transition-all duration-300">
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
                            <p className="text-sm text-[#666666]">Published June 5, 2026</p>
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Black Friday 2026 lands <strong>Friday, Nov 27</strong>.</li>
                            <li>• The overseas cycle — tech pack → sampling → bulk → QC → sea freight — runs <strong>4 to 5 months</strong>, so the real deadline is June–July.</li>
                            <li>• Three things to lock this month: <strong>styles, materials, production slot</strong>.</li>
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

                    {/* Two-column: sticky TOC + article */}
                    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">

                        {/* Desktop JS-pinned rail — TOC + suggested reads pinned together */}
                        <aside ref={asideRef} className="hidden lg:block">
                            <div
                                ref={tocBoxRef}
                                style={tocPinned ? { position: "fixed", top: 112, left: tocGeometry.left, width: tocGeometry.width, zIndex: 20, maxHeight: "calc(100vh - 132px)", overflowY: "auto" } : undefined}
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
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Reference</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What&apos;s a tech pack, and why you need one</p>
                                        </Link>
                                        <Link href="/blogs/fabric-sourcing-101-choose-right-material" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Foundations</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Fabric sourcing 101: choosing the right material</p>
                                        </Link>
                                        <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Case</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The real cost of the wrong manufacturer</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Spacer preserves the aside cell footprint when the rail is pinned */}
                            {tocPinned && <div aria-hidden style={{ height: tocNaturalHeight }} />}
                        </aside>

                        {/* Article */}
                        <article ref={articleRef} className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Opening */}
                            <p className="text-lg lg:text-xl text-[#2D2A2E] leading-snug mb-5 font-medium">
                                Holiday revenue is built on a date that didn&apos;t move. Black Friday 2026 lands on <strong>Friday, November 27</strong> (<a href="https://nrf.com/topics/holiday-and-seasonal-trends" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">per NRF&apos;s US holiday calendar</a>). What did move — and what most US founders are still pricing wrong — is the production calendar that has to sit behind it.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                The window for overseas holiday production opens once a year, and it opens now. Start the cycle in late August and you do not ship holiday — you ship March arrivals and apology emails.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                What follows is the math, the calendar, and the three things to lock this month if you want product on shelves, not in next year&apos;s clearance bin.
                            </p>

                            {/* H2 1: Real deadline */}
                            <section id="real-deadline" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The actual deadline is this month, not November
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative h-64 lg:h-[380px] mb-7">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A wide documentary shot of a partially staffed apparel production floor in late afternoon, sewing stations lit but quiet, the moment before the holiday rush begins"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The instinct is to count back from Black Friday. The actual reference point is the date your retail partners and your DTC warehouse expect product on the shelf — for a smooth launch, that&apos;s <strong>early November</strong>, not late.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Back of envelope: product has to land in the US warehouse roughly three weeks before it sells. That anchors the &quot;in-warehouse&quot; date around the <strong>second week of October</strong>. Everything else falls out of that one number.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-7">
                                    So when a founder asks in August whether there&apos;s still time, the honest answer is no. The honest answer in June is &quot;yes, if you act this month.&quot;
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The cost of being three weeks late on a holiday SKU isn&apos;t a delay. The shelf goes to a competitor.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That gap between when founders think the deadline is and when it actually is — that&apos;s where most of <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="text-[#CBB49A] underline hover:text-[#b7a078]">the brand-killing missed seasons</Link> happen. Holiday is the single season where landed cost matters less than landed-on-time.
                                </p>
                            </section>

                            {/* H2 2: Overseas cycle */}
                            <section id="overseas-cycle" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What a 4–5 month overseas cycle actually looks like
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative h-64 lg:h-[380px] mb-7">
                                    <Image
                                        src={TIMELINE_IMAGE}
                                        alt="A six-stage countdown timeline diagram from June through November, each stage labeled — tech pack, sampling, bulk, QC, sea freight, in-warehouse — with weeks marked"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The overseas-manufacturing cycle is five stages, each with a non-negotiable floor on time. Compress one stage and cost or defect rate moves into the next. Compress two and the chain breaks.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Here&apos;s the realistic stage-by-stage. Each duration assumes a competent factory with an existing relationship — first-time engagements add 2–4 weeks for onboarding and trust-building (<a href="https://www.mckinsey.com/industries/retail/our-insights/state-of-fashion" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">McKinsey&apos;s State of Fashion</a> tracks this drift year on year).
                                </p>

                                <ol className="space-y-3 mb-7">
                                    <li className="flex gap-5 p-5 bg-[#F8F7F4] rounded-xl">
                                        <div className="flex-shrink-0 w-10 h-10 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold">1</div>
                                        <div>
                                            <p className="font-semibold text-[#2D2A2E] mb-1">Tech pack approval → first sample request</p>
                                            <p className="text-[#666666] leading-relaxed"><em>Tech pack: the engineering spec for a garment — measurements, materials, construction, trims.</em> <strong>2 weeks.</strong></p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5 p-5 bg-[#F8F7F4] rounded-xl">
                                        <div className="flex-shrink-0 w-10 h-10 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold">2</div>
                                        <div>
                                            <p className="font-semibold text-[#2D2A2E] mb-1">Sampling → approval</p>
                                            <p className="text-[#666666] leading-relaxed"><em>Sampling: iterative back-and-forth where the factory builds prototypes until the brand signs off.</em> <strong>3–4 weeks</strong>, longer for premium fabrics or first-time construction.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5 p-5 bg-[#F8F7F4] rounded-xl">
                                        <div className="flex-shrink-0 w-10 h-10 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold">3</div>
                                        <div>
                                            <p className="font-semibold text-[#2D2A2E] mb-1">Bulk production</p>
                                            <p className="text-[#666666] leading-relaxed"><em>Bulk run: the main production order after sample approval.</em> <strong>6–8 weeks</strong>, gated by factory capacity and fabric lead time.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5 p-5 bg-[#F8F7F4] rounded-xl">
                                        <div className="flex-shrink-0 w-10 h-10 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold">4</div>
                                        <div>
                                            <p className="font-semibold text-[#2D2A2E] mb-1">In-line and final QC</p>
                                            <p className="text-[#666666] leading-relaxed"><em>AQL: Acceptable Quality Level — the statistical sampling standard used to accept or reject a finished run.</em> <strong>1 week.</strong></p>
                                        </div>
                                    </li>
                                    <li className="flex gap-5 p-5 bg-[#F8F7F4] rounded-xl">
                                        <div className="flex-shrink-0 w-10 h-10 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold">5</div>
                                        <div>
                                            <p className="font-semibold text-[#2D2A2E] mb-1">Sea freight to US port</p>
                                            <p className="text-[#666666] leading-relaxed"><strong>4–6 weeks</strong> depending on origin and carrier reliability; add 1 week for US inland transit.</p>
                                        </div>
                                    </li>
                                </ol>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Add it up: roughly <strong>16 to 21 weeks</strong> door-to-door for a competent overseas cycle. That&apos;s <strong>4 to 5 months</strong>, every time. Counting back from an October 12 in-warehouse date lands you at a late-May-to-late-June production start — for most US brands, that&apos;s this month.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;16 to 21 weeks door-to-door. That is 4 to 5 months, every time.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Domestic and near-shore production change this math — see the counterexample below. But for anyone ordering from India, Vietnam, Bangladesh, Turkey, or Indonesia, the calendar is the calendar.
                                </p>
                            </section>

                            {/* H2 3: Three decisions */}
                            <section id="three-decisions" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Three decisions to lock by the end of this month
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative h-64 lg:h-[380px] mb-7">
                                    <Image
                                        src={DECISIONS_IMAGE}
                                        alt="Three objects on a designer's desk in a single shaft of light — a tech pack page, a stack of premium fabric swatches, and a wall calendar with one date circled — the three June decisions"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-8">
                                    If overseas production is the path, three things have to be locked before July. Each one gates the next stage of the calendar. Each one fails the same way — quietly, in slow motion.
                                </p>

                                {/* Decision 1: Styles */}
                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4">1. Lock your styles (carryover vs. new)</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Every holiday assortment splits into two buckets: carryover styles your retail partners already know, and new styles you&apos;re betting on. The fastest way to miss the window is to leave that ratio undecided.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Carryover rides a shorter cycle — the tech pack is approved and the factory has run it before. New styles need full sampling and approval, which is where the three-to-four-week stage actually lives.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The June decision isn&apos;t just &quot;what styles.&quot; It&apos;s <strong>which styles are new and which are carryover</strong>, and how many of each.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re making this mistake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your line plan still has &quot;TBD&quot; next to half the holiday SKUs in June.</li>
                                        <li>• Your sales team is pushing one more new style with no carryover discipline.</li>
                                        <li>• Last year&apos;s holiday sell-through report hasn&apos;t been opened before deciding the 2026 mix.</li>
                                    </ul>
                                </div>

                                {/* Decision 2: Materials */}
                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4">2. Lock your materials (premium fabric is the slowest input)</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fabric is the longest-lead input in the entire cycle. Standard mill-stock fabrics ship in 1–2 weeks; mill-to-order or premium fabrics run 6–10 weeks before they even reach the factory.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Founders who try to spec a &quot;new fabric&quot; experience in August aren&apos;t adding a fabric — they&apos;re cancelling holiday. Same for any fabric that needs development: custom prints, branded weaves, specialty finishes.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The June decision is to lock fabric on every new style: confirm GSM <em>(grams per square metre — the standard fabric-weight unit)</em>, composition, mill, and whether it&apos;s stock or mill-to-order. Then place the deposit.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re making this mistake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• You&apos;re shopping for &quot;interesting fabrics&quot; with no PO behind them.</li>
                                        <li>• You&apos;re betting holiday on a custom print where the strike-off hasn&apos;t been approved.</li>
                                        <li>• Your fabric supplier hasn&apos;t quoted a delivery date to your factory yet.</li>
                                    </ul>
                                </div>

                                {/* Mid-article lead-magnet CTA — between decision 2 and 3 (~55% scroll) */}
                                <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                            <Download className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                            <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Holiday 2026 Production Countdown</h4>
                                            <p className="text-[#4A484A] leading-relaxed">A one-page calendar with every decision date, deposit milestone, and QC checkpoint between June and the October in-warehouse anchor. PDF.</p>
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
                                                Send me the PDF
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </form>
                                    ) : (
                                        <p className="text-[#2D2A2E] font-medium">Checklist on the way. Check your inbox.</p>
                                    )}
                                </div>

                                {/* Decision 3: Slot */}
                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-4">3. Lock your production slot</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Factories sell time. Holiday is the season every brand pulls forward into — which means by mid-July, the best factories&apos; calendars are gone. You aren&apos;t paying for fabric and labor. You&apos;re paying for a slot on a finite calendar.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A locked slot means a deposit paid, a PO acknowledged, and a production start date written into the factory&apos;s master plan. A verbal commitment isn&apos;t a slot.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Without one, you&apos;re sourcing from leftover capacity in September — at rush rates, with the QC discipline that gets sacrificed when a factory is on the back foot. That&apos;s where <Link href="/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes" className="text-[#CBB49A] underline hover:text-[#b7a078]">most missed-holiday brand failures</Link> trace back to.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-6 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re making this mistake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• You&apos;re still in &quot;quote shopping&quot; mode in late June.</li>
                                        <li>• No deposit has changed hands by the end of July.</li>
                                        <li>• Your factory hasn&apos;t named a specific bulk-production start date.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 4: Counterexample */}
                            <section id="when-timeline-breaks" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When the standard timeline doesn&apos;t apply
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two operating models break the 4–5 month rule, both at a cost.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Domestic or near-shore production</strong> (US, Mexico, Caribbean Basin) compresses the calendar to roughly 8–10 weeks. Freight collapses, the factory is on the same time zone, and reorders are realistic mid-season. The trade-off is unit cost — and for some categories, a narrower fabric and finish library than India or Vietnam offer.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong><Link href="/blogs/on-demand-clothing-manufacturing-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">On-demand production</Link></strong> shortens the window further, because there is no bulk to schedule. The trade-off is a different per-unit cost and a different brand promise — on-demand is its own operating model, not a backup plan for missing a June lock. Brands that work this way design their merchandising calendar around it from day one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Reading this in June with an overseas partner: the window is open. Reading this in August on bulk-overseas: the window is closed, and the conversation shifts to spring 2027.
                                </p>
                            </section>

                            {/* H2 5: Closing — what we'd do */}
                            <section id="what-wed-do" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&apos;d do in your shoes this month
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Pull last year&apos;s holiday sell-through on Monday, lock the carryover-versus-new split by Friday, and have fabric POs in by end of next week.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Pay the slot deposit before issuing the next sample request — slots are the constraint, not samples.
                                </p>
                                <p className="text-lg leading-relaxed text-[#2D2A2E]">
                                    Treat July as the month you <em>execute</em> the plan you make in June, not the month you make it.
                                </p>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">How a 90-day production timeline shakes out</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The design-to-doorstep walkthrough, stage by stage.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the timeline <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Lock your holiday slot</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">We&apos;ll pull your line plan, check fabric availability, and quote a realistic delivery date by end of week.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/lead-time-timeline-design-to-doorstep",
                                            title: "The Lead-Time Timeline: Design to Doorstep",
                                            dek: "Every stage of the 90-day cycle, with realistic week counts.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/on-demand-clothing-manufacturing-2026",
                                            title: "On-Demand Clothing Manufacturing in 2026",
                                            dek: "The model that compresses lead time — and what it costs to use it.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes",
                                            title: "Why 80–90% of US Clothing Brands Fail in 5 Years",
                                            dek: "Four operational mistakes — including the missed-window one.",
                                            read: "9 min read",
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

            {/* Mobile sticky bottom CTA */}
            {showStickyMobileCta && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#2D2A2E] text-white px-4 py-3 flex items-center justify-between shadow-2xl">
                    <button onClick={() => setContactOpen(true)} className="flex-1 text-left text-sm font-semibold">
                        Talk to a production lead <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}