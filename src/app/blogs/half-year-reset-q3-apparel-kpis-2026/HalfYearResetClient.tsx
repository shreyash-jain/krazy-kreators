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

const BLOG_ID = "half-year-reset-q3-apparel-kpis-2026";

const HERO_IMAGE = "/blog/half-year-reset-hero.jpg";
const SECTION1_IMAGE = "/blog/half-year-reset-section1.jpg";
const MACRO_IMAGE = "/blog/half-year-reset-macro.jpg";
const CLOSING_IMAGE = "/blog/half-year-reset-closing.jpg";

const TOC = [
    { id: "duty-line", label: "1. Landed cost per unit" },
    { id: "sell-through", label: "2. Sell-through at week 8" },
    { id: "moq-exposure", label: "3. MOQ exposure in dollars" },
    { id: "lead-time", label: "4. The lead time you can defend" },
    { id: "cash-cycle", label: "5. Days your cash is out" },
    { id: "what-to-reset", label: "What to reset this week" },
    { id: "bottom-line", label: "The bottom line" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function HalfYearResetClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("duty-line");
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
        showToast("Worksheet on the way to your inbox.", "success");
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
                    alt="A container terminal at first light seen from a distance, stacked boxes in long rows, a gantry crane silhouetted against low sun, haze and dust in the air. Documentary wide, no people, no readable logos or brand marks."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-24 sm:mt-20">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Growth &amp; Business
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">9 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">July 27, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] max-w-5xl drop-shadow-lg mb-5 tracking-tight">
                        The Half-Year Reset:<br className="hidden sm:block" /> 5 Numbers to Re-Check for Q3
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-2xl drop-shadow-md leading-snug">
                        The duty line changed three days ago. Four more went stale while you weren&apos;t looking &mdash; re-derive all five before the Fall PO.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">· Growth &amp; Business</span></p>
                            <p className="text-sm text-[#666666]">Covers unit economics and operations for US clothing founders · July 27, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• The July 24 duty change moved the rate for some countries and removed the <em>expiry date</em> for all of them &mdash; re-derive landed cost, don&apos;t reuse it.</li>
                            <li>• Four of the five numbers are ratios you already have; the fifth, <strong>cash-cycle cost</strong>, is the one almost nobody puts on the cost sheet &mdash; about <strong>$0.25 a unit</strong> on our worked example.</li>
                            <li>• Reset them before the Fall PO, not after the Holiday markdown.</li>
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
                                        <Link href="/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Why 80&ndash;90% of US clothing brands fail in 5 years</p>
                                        </Link>
                                        <Link href="/blogs/rebuild-landed-cost-august-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">After the Cliff: rebuild your August landed cost</p>
                                        </Link>
                                        <Link href="/blogs/holiday-2026-production-window-us-founders-order-now" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Production</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What to lock for Holiday before the window closes</p>
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
                                Half the year is gone. The assumptions you built it on are older than that.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Most Q3 planning starts with a calendar &mdash; Fall ships, Holiday follows, lock the dates. That part is easy and it is not where brands get hurt. The damage comes from carrying a spring cost sheet into an autumn purchase order and finding out in November which line went stale.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Five numbers went stale between January and now. One of them changed three days ago. Here they are, each with the arithmetic to re-derive it, and each with the specific decision it should change before you sign the next PO.
                            </p>

                            {/* H2 1 */}
                            <section id="duty-line" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    1. Your landed cost per unit &mdash; the duty line moved on Friday
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A single shaft of hard afternoon light falling across a customs entry desk, a rubber date stamp and an ink pad sharp in the light, the rest of the frame in deep shadow. Abstract and moody, no faces, no readable text, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The flat 10% Section 122 surcharge that had covered every sourcing country since February expired at 12:01 a.m. on July 24, by operation of law, exactly 150 days after it began (<a href="https://www.tradelawcounsel.com/insights-news/2026/7/4/section-122-surcharge-sunsets-july-24-what-importers-should-do-beforeand-afterthe-150-day-clock-runs-out" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Nakachi Eckhardt &amp; Jacobson</a>). The same morning, USTR&apos;s forced-labor <strong>Section 301</strong> action <em>(a trade-law tool that lets the US impose duties in response to another country&apos;s practices)</em> took effect on 60 economies (<a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-takes-action-forced-labor-section-301-investigations" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USTR</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Seventeen economies &mdash; India, Bangladesh, Pakistan, Sri Lanka, Cambodia, Indonesia, Malaysia among them &mdash; pay <strong>10%</strong>. The other thirty-eight, including China, Vietnam and T&uuml;rkiye, pay <strong>12.5%</strong> (<a href="https://globaltradealert.org/blog/forced-labour-section-301-final-action" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Global Trade Alert</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Read that carefully, because the trap is in what <em>didn&apos;t</em> change. If you source from India, the ad valorem number on your cost sheet is identical to last week&apos;s. What disappeared was the sunset. Section 122 carried a statutory 150-day clock; this action carries none (<a href="https://www.chrobinson.com/en-us/resources/insights-and-advisories/client-advisories/2026q3/07-24-26-client-advisory-new-section-301-forced-labor-tariffs-now-in-effect/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">C.H. Robinson</a>). The rate you were treating as temporary is now the baseline you plan against.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The number on the cost sheet didn&apos;t move. The expiry date did &mdash; and that is the more expensive change.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-5">
                                    So re-derive the whole line. Here is a mid-weight cotton knit tee <em>(HTS 6109.10.00, the 16.5% MFN line)</em> made in India, quoted at $8.00 <strong>FOB</strong> <em>(the price at the exporter&apos;s port, before freight and duty)</em>, moving one 40-foot container of 8,000 units.
                                </p>

                                {/* Teaching graphic — inline SVG so the figures are generated from the same
                                    values as the table below and cannot drift out of sync with the body. */}
                                <figure className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <svg
                                        viewBox="0 0 800 540"
                                        role="img"
                                        aria-label="One tee, two duty lines, July 2026. A cost ladder for an $8.00 FOB cotton tee from India, 8,000 units per 40ft container: FOB $8.00, duty $2.12 at 26.5% or $2.32 at 29%, merchandise processing fee $0.03, harbor maintenance fee $0.01, ocean freight $0.57, brokerage $0.05, drayage and 3PL $0.15. Landed cost $10.93 in a 10% country or $11.13 in a 12.5% country, a gap of $0.20 per unit or $1,600 per container."
                                        className="w-full h-auto"
                                    >
                                        <rect width="800" height="540" fill="#F8F7F4" />

                                        <text x="40" y="46" fontSize="27" fontWeight="800" fill="#2D2A2E">One tee, two duty lines &mdash; July 2026</text>
                                        <text x="40" y="74" fontSize="15" fill="#666666">A $8.00 FOB cotton tee, India, 8,000 units per 40ft container</text>
                                        <line x1="40" y1="92" x2="760" y2="92" stroke="#CBB49A" strokeWidth="2" />

                                        {/* FOB */}
                                        <text x="195" y="133" fontSize="15" fill="#2D2A2E" textAnchor="end">FOB</text>
                                        <rect x="210" y="118" width="440" height="18" rx="2" fill="#CBB49A" />
                                        <text x="760" y="133" fontSize="15" fontWeight="700" fill="#2D2A2E" textAnchor="end">$8.00</text>

                                        {/* Duty — two rates */}
                                        <text x="195" y="178" fontSize="15" fill="#2D2A2E" textAnchor="end">Duty</text>
                                        <rect x="210" y="157" width="117" height="16" rx="2" fill="#CBB49A" />
                                        <text x="337" y="170" fontSize="12" fill="#666666">26.5%</text>
                                        <text x="760" y="170" fontSize="15" fontWeight="700" fill="#2D2A2E" textAnchor="end">$2.12</text>
                                        <rect x="210" y="179" width="128" height="16" rx="2" fill="#2D2A2E" />
                                        <text x="348" y="192" fontSize="12" fill="#666666">29%</text>
                                        <text x="760" y="192" fontSize="15" fontWeight="700" fill="#2D2A2E" textAnchor="end">$2.32</text>

                                        {/* Fees and logistics */}
                                        <text x="195" y="223" fontSize="15" fill="#2D2A2E" textAnchor="end">Merchandise processing fee</text>
                                        <rect x="210" y="213" width="2" height="12" fill="#CBB49A" />
                                        <text x="760" y="223" fontSize="15" fill="#4A484A" textAnchor="end">$0.03</text>

                                        <text x="195" y="257" fontSize="15" fill="#2D2A2E" textAnchor="end">Harbor maintenance fee</text>
                                        <rect x="210" y="247" width="2" height="12" fill="#CBB49A" />
                                        <text x="760" y="257" fontSize="15" fill="#4A484A" textAnchor="end">$0.01</text>

                                        <text x="195" y="291" fontSize="15" fill="#2D2A2E" textAnchor="end">Ocean freight</text>
                                        <rect x="210" y="281" width="31" height="12" rx="2" fill="#CBB49A" />
                                        <text x="760" y="291" fontSize="15" fill="#4A484A" textAnchor="end">$0.57</text>

                                        <text x="195" y="325" fontSize="15" fill="#2D2A2E" textAnchor="end">Brokerage + entry bond</text>
                                        <rect x="210" y="315" width="3" height="12" fill="#CBB49A" />
                                        <text x="760" y="325" fontSize="15" fill="#4A484A" textAnchor="end">$0.05</text>

                                        <text x="195" y="359" fontSize="15" fill="#2D2A2E" textAnchor="end">Drayage + 3PL intake</text>
                                        <rect x="210" y="349" width="8" height="12" rx="2" fill="#CBB49A" />
                                        <text x="760" y="359" fontSize="15" fill="#4A484A" textAnchor="end">$0.15</text>

                                        <line x1="40" y1="382" x2="760" y2="382" stroke="#E5E1DA" strokeWidth="1" />

                                        {/* Totals */}
                                        <rect x="40" y="404" width="345" height="86" rx="10" fill="#FFFFFF" stroke="#CBB49A" strokeWidth="2" />
                                        <text x="62" y="431" fontSize="13" fill="#666666">10% country (India) &middot; 26.5% duty</text>
                                        <text x="62" y="470" fontSize="30" fontWeight="800" fill="#2D2A2E">$10.93</text>

                                        <rect x="415" y="404" width="345" height="86" rx="10" fill="#2D2A2E" />
                                        <text x="437" y="431" fontSize="13" fill="#CBB49A">12.5% country &middot; 29% duty</text>
                                        <text x="437" y="470" fontSize="30" fontWeight="800" fill="#FFFFFF">$11.13</text>

                                        <text x="400" y="518" fontSize="15" fontWeight="600" fill="#2D2A2E" textAnchor="middle">+$0.20 per unit &middot; $1,600 per 40ft container</text>

                                        <text x="770" y="530" fontSize="13" fontWeight="700" fill="#CBB49A" textAnchor="end">KK</text>
                                    </svg>
                                </figure>

                                <div className="overflow-x-auto mb-5">
                                    <table className="w-full text-left text-sm sm:text-base border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#CBB49A]">
                                                <th className="py-2 pr-4 font-bold text-[#2D2A2E]">Cost line</th>
                                                <th className="py-2 pr-4 font-bold text-[#2D2A2E]">Basis</th>
                                                <th className="py-2 font-bold text-[#2D2A2E]">Per unit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[#4A484A]">
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">FOB, India</td><td className="py-2 pr-4">quoted</td><td className="py-2">$8.00</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Duty</td><td className="py-2 pr-4">16.5% MFN + 10% §301 = 26.5%</td><td className="py-2">$2.12</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Merchandise processing fee</td><td className="py-2 pr-4">0.3464%</td><td className="py-2">$0.03</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Harbor maintenance fee</td><td className="py-2 pr-4">0.125%</td><td className="py-2">$0.01</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Ocean freight</td><td className="py-2 pr-4">$4,547 per 40ft ÷ 8,000</td><td className="py-2">$0.57</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Brokerage + entry bond</td><td className="py-2 pr-4">~$400 per entry ÷ 8,000</td><td className="py-2">$0.05</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Drayage + 3PL intake</td><td className="py-2 pr-4">~$1,200 ÷ 8,000</td><td className="py-2">$0.15</td></tr>
                                            <tr className="border-b-2 border-[#CBB49A]"><td className="py-2 pr-4 font-bold text-[#2D2A2E]">Landed cost</td><td className="py-2 pr-4"></td><td className="py-2 font-bold text-[#2D2A2E]">$10.93</td></tr>
                                            <tr><td className="py-2 pr-4">Same tee, 12.5% country</td><td className="py-2 pr-4">16.5% + 12.5% = 29%</td><td className="py-2 font-bold text-[#2D2A2E]">$11.13</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The fee lines are small and fixed: the FY2026 merchandise processing fee stays at 0.3464% with a $33.58 floor and a $651.50 ceiling per entry (<a href="https://www.federalregister.gov/documents/2025/07/23/2025-13869/customs-user-fees-to-be-adjusted-for-inflation-in-fiscal-year-2026-cbp-dec-25-10" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Register</a>), and the harbor maintenance fee holds at 0.125% of declared value (<a href="https://www.ecfr.gov/current/title-19/chapter-I/part-24/section-24.24" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">19 CFR 24.24</a>). The 2.5-point country spread is worth $0.20 a unit &mdash; $1,600 on that one container. Small per tee. Not small per season.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-5">
                                    If you have goods on the water right now, there is a narrow carve-out: cargo laden before July 24 and entered for consumption before 12:01 a.m. on <strong>July 28</strong> escapes the new duty (<a href="https://www.chrobinson.com/en-us/resources/insights-and-advisories/client-advisories/2026q3/07-24-26-client-advisory-new-section-301-forced-labor-tariffs-now-in-effect/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">C.H. Robinson</a>). That window closes tomorrow. Call your broker today, not Wednesday.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">The counterexample worth knowing</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Goods entering duty-free under USMCA, and CAFTA-DR textile and apparel goods, are fully exempt from this action.</li>
                                        <li>• Tariff-rate quotas &mdash; duty relief up to a set volume &mdash; are being set up for Bangladesh, Cambodia, Indonesia and Malaysia for an initial three years.</li>
                                        <li>• If your program sits inside one of those, the July 24 change may cost you nothing. Confirm it with your broker rather than assuming either way.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 2 */}
                            <section id="sell-through" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    2. Sell-through at week 8 &mdash; not at season end
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Sell-through</strong> <em>(the share of a buy that has sold in a given window)</em> measured at season end is a postmortem. Measured at week 8, it is a decision: reprice, reallocate, or hold the reorder.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For the category baseline, US clothing stores were carrying an inventories-to-sales ratio of <strong>2.11</strong> in May 2026 (<a href="https://fred.stlouisfed.org/series/MRTSIR448USS" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Census, via FRED</a>) &mdash; roughly nine weeks of cover sitting on shelves before your Fall goods arrive on top of it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Demand is real but not a rescue. Clothing and accessories store sales were up <strong>4.8% year over year</strong> in June (<a href="https://bankingjournal.aba.com/2026/07/retail-sales-edged-up-0-2-in-june/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Census advance estimates, via ABA</a>). A mid-single-digit lift does not absorb a buy sized for a double-digit one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-5">
                                    The reset is one line of work: before the drop lands, write down the week-8 threshold for each style &mdash; the percentage below which you act. Committing to the number in advance is what stops the week-12 conversation from becoming a markdown by default.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your sell-through read is too late to act on</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• You only look at sell-through when someone asks about markdowns.</li>
                                        <li>• The number is reported for the collection, never per style and size curve.</li>
                                        <li>• Your reorder decision and your sell-through read happen in different months.</li>
                                        <li>• Nobody wrote down the threshold before the goods landed.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 3 */}
                            <section id="moq-exposure" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    3. MOQ exposure &mdash; in dollars, not units
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of the ribbed collar and shoulder taping on a plain cotton jersey tee, raking side light picking out individual loops of yarn, very shallow depth of field. No logos, no readable text, no faces."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>MOQ</strong> <em>(the smallest order a factory will run)</em> is quoted in units, which is why founders discuss it in units. Your exposure is a dollar figure, and it is the part that shows up in the bank account.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Take the container above. Eight thousand units, and a realistic 55% gone by week 12 leaves 3,600 units. At $10.93 landed that is <strong>$39,348 of capital parked in a warehouse</strong>. Financed at the current 6.75% bank prime rate (<a href="https://www.federalreserve.gov/releases/h15/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Reserve H.15</a>), the carry alone runs about $2,656 a year &mdash; roughly $664 a quarter, before you discount a single unit or pay a month of storage.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;An MOQ you can afford to buy is not the same as an MOQ you can afford to hold.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Where this rule breaks.</strong> Residue is not automatically a mistake. A season-agnostic black tee at 3,600 units left is a carry-forward, not dead stock &mdash; the same units will sell at full price in February, and the freight and duty on them are already paid. What makes residue expensive is a print, a colorway or a trend cut that has a shelf life. Sort the leftover by whether it survives a season change, then price the exposure only on the part that doesn&apos;t.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That distinction is the whole argument for splitting a buy: core in volume, seasonal in a smaller first run with a reorder path. It is also one of the four operational mistakes behind <Link href="/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes" className="underline text-[#CBB49A] hover:text-[#b7a078]">why most US clothing brands don&apos;t reach year five</Link>.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Q3 Five-Number Worksheet</h4>
                                        <p className="text-[#4A484A] leading-snug">One page, five inputs. Enter FOB, duty rate, order quantity, week-8 sell-through and your credit rate; it returns landed cost, MOQ exposure in dollars, and your cash-cycle cost per unit. PDF.</p>
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
                                            Send me the worksheet
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Worksheet on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="lead-time" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    4. The lead time you can actually defend
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Your quoted transit time is a median. Fall and Holiday need the bad case, because that is the one that misses a launch date.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    In June 2026, global container schedule reliability fell to <strong>56.6%</strong> &mdash; down 3.7 points from May and 2.3 points below June 2025 &mdash; with late vessels arriving an average of 3.8 days behind schedule (<a href="https://mykn.kuehne-nagel.com/news/article/seaexplorer-schedule-reliability-report-jun26" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Kuehne+Nagel seaexplorer</a>). Better than four in ten sailings land late. That is not an exception to plan around; it is the distribution.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Rates are cooling off a peak, not collapsing. Drewry&apos;s composite index sat at <strong>$4,547 per 40-foot container</strong> on July 16, with Shanghai&ndash;Los Angeles at $6,272 and Shanghai&ndash;New York at $7,879 (<a href="https://www.thedcn.com.au/news/world-container-index-16-july-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Drewry WCI, via DCN</a>). And thinner volumes are not buying you reliability: US apparel imports fell about 9.3% over January&ndash;May, with India&apos;s shipments down 26.4% (<a href="https://www.textiletoday.com.bd/otexa-data-shows-mixed-recovery-in-us-apparel-sourcing-during-the-first-five-months-of-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">OTEXA data, via Textile Today</a>). Carriers answer soft demand by pulling capacity, which keeps both rates and delays where they are.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The reset: stop counting forward from the PO and count backward from the on-shelf date, with the late case built in. Our own <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="underline text-[#CBB49A] hover:text-[#b7a078]">design-to-doorstep timeline</Link> and the <Link href="/blogs/holiday-2026-production-window-us-founders-order-now" className="underline text-[#CBB49A] hover:text-[#b7a078]">Holiday production window</Link> both run that direction for a reason.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="cash-cycle" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    5. The number of days your cash is out
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The <strong>cash conversion cycle</strong> <em>(days between paying for goods and collecting from the customer)</em> is the number that decides whether growth is survivable. Almost nobody puts a price on it per unit, so here it is.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Same container. Deposit goes out at the PO, the balance plus freight and duty clears at shipment, total landed cash out is 8,000 &times; $10.93 = <strong>$87,440</strong>. Production and transit put the goods on a shelf around day 80. Sold across twelve weeks, the average dollar comes back near day 122.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Financing $87,440 for 122 days at 6.75% costs about <strong>$1,973</strong> &mdash; roughly <strong>$0.25 a unit</strong>. Set that beside the government fees on the same tee: merchandise processing, harbor maintenance and brokerage together come to $0.09. Your working capital costs you nearly three times what CBP does, and only one of those two lines is usually on the cost sheet.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Time is a line item. Most cost sheets have a row for duty and no row for the ninety days the money was gone.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Add the row. Then every lever that shortens the cycle &mdash; a smaller first run, a nearer port, a faster approval loop on the sample, a wholesale term you actually enforce &mdash; gets valued in dollars instead of argued about in feelings. A four-week faster sample round on this order is worth about $650, which is real money against the cost of doing samples properly.
                                </p>
                            </section>

                            {/* H2 6 — Closing */}
                            <section id="what-to-reset" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What to reset this week
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A calm brand studio at the end of a working day, a fabric header card and a single folded sample sharp on a wide table in the foreground, an empty rail and window light behind, warm and lived-in. Documentary, no people, no logos, no readable text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    In your shoes we would do three things before Friday: call the broker about anything on the water ahead of the July 28 cut-off, rebuild the landed-cost line for every SKU in the Fall buy at the rate that applies to <em>your</em> country of origin, and add a financing row to the cost sheet so the cash cycle stops being invisible.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    The rest can wait until the Fall PO is drafted. So: of your five numbers, which one has not been re-derived since January &mdash; and what would it change if it were?
                                </p>
                            </section>

                            {/* Conclusion */}
                            <section id="bottom-line" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A half-year reset is not a strategy exercise. It is five pieces of arithmetic you already have the inputs for, redone against the world as it is on July 27 rather than the one you costed in January. The duty regime lost its expiry date, the shelf in front of you is holding about nine weeks of cover, four in ten sailings run late, and money costs 6.75%.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    None of those, on its own, breaks a brand. Together, carried unexamined into a Fall and Holiday buy, they are how a good season turns into a February full of markdowns. Re-derive the five, write the week-8 thresholds down before the goods land, and the second half gets to pay for the first.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-6 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What changed on July 24, 2026, and does it affect my cost sheet?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">The flat 10% Section 122 surcharge expired by operation of law after its 150-day statutory run, and USTR&apos;s forced-labor Section 301 duties took effect the same morning on 60 economies at either 10% or 12.5% (<a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-takes-action-forced-labor-section-301-investigations" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USTR</a>). If you source from a 10% country the rate is unchanged; if you source from a 12.5% country it rose 2.5 points. Either way the new duty has no scheduled expiry, so it should be planned as permanent.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How do I calculate apparel landed cost in 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Start from FOB, add duty at your MFN line plus any Section 301 rate for your country of origin, add the merchandise processing fee at 0.3464% (floor $33.58, ceiling $651.50 per entry) and the harbor maintenance fee at 0.125%, then allocate ocean freight, brokerage and bond, drayage and 3PL intake across the order quantity. On our worked example &mdash; a $8.00 FOB cotton tee from India, 8,000 units &mdash; that gives $10.93 a unit at 26.5% duty and $11.13 at 29%.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What is a reasonable sell-through benchmark to plan against?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">There is no universal figure, and any single number quoted as one should be treated with suspicion. Use the category context instead: US clothing stores were holding an inventories-to-sales ratio of 2.11 in May 2026, about nine weeks of cover (<a href="https://fred.stlouisfed.org/series/MRTSIR448USS" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Census, via FRED</a>), while clothing store sales grew 4.8% year over year in June. Set your own week-8 threshold per style from your history, and write it down before the drop lands.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How do I put a dollar figure on MOQ exposure?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Multiply the units you realistically will not sell inside the season by landed cost, then apply your borrowing rate to that balance. On an 8,000-unit run with 55% gone by week 12, that is 3,600 units &times; $10.93 = $39,348 parked, carrying about $2,656 a year at the 6.75% prime rate. Exclude any leftover that is genuine carry-forward core &mdash; that is inventory, not exposure.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How much buffer should I build into Q3 lead times?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Enough to cover the late case, not the median. Global schedule reliability was 56.6% in June 2026 with late vessels averaging 3.8 days behind schedule (<a href="https://mykn.kuehne-nagel.com/news/article/seaexplorer-schedule-reliability-report-jun26" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Kuehne+Nagel</a>), so roughly four sailings in ten arrive late. Plan backward from the on-shelf date with vessel delay, customs examination and 3PL intake all counted separately.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What does my cash conversion cycle actually cost per unit?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Take total landed cash out, multiply by your borrowing rate, and pro-rate for the days between paying and collecting. On the worked example, $87,440 financed for 122 days at 6.75% is about $1,973, or $0.25 a unit &mdash; nearly three times the $0.09 of merchandise processing, harbor maintenance and brokerage on the same tee. Adding that row is what makes cycle-shortening decisions arguable in dollars.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Is any apparel exempt from the new Section 301 duties?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Yes. Goods entering duty-free under USMCA and CAFTA-DR textile and apparel goods are fully exempt, and tariff-rate quotas are being established for Bangladesh, Cambodia, Indonesia and Malaysia for an initial three-year period (<a href="https://www.chrobinson.com/en-us/resources/insights-and-advisories/client-advisories/2026q3/07-24-26-client-advisory-new-section-301-forced-labor-tariffs-now-in-effect/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">C.H. Robinson</a>). Confirm your specific program with your customs broker before assuming either treatment.</p>
                                    </div>
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Why 80&ndash;90% of US Clothing Brands Fail in 5 Years</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The four operational mistakes behind it &mdash; wrong manufacturer, wrong MOQ math, wrong sampling cycle, wrong fabric sourcing.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Book a production &amp; margin review for H2</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Book a Krazy Kreators production and margin review for H2 &mdash; we rebuild the landed-cost line, size the buy against your sell-through, and shorten the cycle before the Fall PO goes out.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes",
                                            title: "Why 80–90% of US Clothing Brands Fail in 5 Years",
                                            dek: "The four operational mistakes made in the first 90 days.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/rebuild-landed-cost-august-2026",
                                            title: "After the Cliff: Rebuild Your Cost Sheet for August",
                                            dek: "Duty follows the entry date — three scenarios for August-clearing goods.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/holiday-2026-production-window-us-founders-order-now",
                                            title: "What to Lock for Holiday Before the Window Closes",
                                            dek: "The calendar math behind a Black Friday that lands November 27.",
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

                            {/* About Krazy Kreators */}
                            <div className="mt-16 p-6 rounded-2xl bg-[#F8F7F4] border border-gray-100">
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">About Krazy Kreators</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; design, sampling, fabric sourcing, retail-grade production, and packaging, under one roof, from first sketch to shelf. krazykreators.com
                                </p>
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
                        Book an H2 production &amp; margin review <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
