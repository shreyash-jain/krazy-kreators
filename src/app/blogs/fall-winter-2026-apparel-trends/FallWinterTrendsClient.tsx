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

const BLOG_ID = "fall-winter-2026-apparel-trends";

const HERO_IMAGE = "/blog/fall-winter-2026-apparel-trends-hero.jpg";
const SECTION1_IMAGE = "/blog/fall-winter-2026-apparel-trends-section1.jpg";
const MACRO_IMAGE = "/blog/fall-winter-2026-apparel-trends-macro.jpg";
const CLOSING_IMAGE = "/blog/fall-winter-2026-apparel-trends-closing.jpg";

const TOC = [
    { id: "the-palette", label: "What the forecast said" },
    { id: "small-collection", label: "Five colours, not fifteen" },
    { id: "fabrics", label: "The fabrics that sell in the cold" },
    { id: "timeline", label: "The windows still open" },
    { id: "faqs", label: "FAQs" },
];

// Pantone Fashion Color Trend Report, NYFW Autumn/Winter 2026/2027 — codes and hex values as published by Pantone.
const PALETTE = [
    { code: "19-1521", name: "Red Mahogany", hex: "#60373D", role: "Core colour", dark: true },
    { code: "18-0521", name: "Burnt Olive", hex: "#646049", role: "Core colour", dark: true },
    { code: "11-0103", name: "Egret", hex: "#F3ECE0", role: "Seasonless neutral", dark: false },
    { code: "15-1213", name: "Candied Ginger", hex: "#BFA387", role: "Seasonless neutral", dark: false },
    { code: "16-1710", name: "Foxglove", hex: "#B98391", role: "The one accent", dark: false },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function FallWinterTrendsClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("the-palette");
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
        showToast("Line-sheet template on the way to your inbox.", "success");
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
                    alt="A New York design studio at dusk — a long cutting table under a single pendant lamp with a rolled bolt of red-mahogany bouclé, a folded length of burnt-olive wool and a half-finished plum tailored jacket on a form, city windows glowing blue behind. Fall winter 2026 fashion trends in progress. No people, no logos."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Production &amp; Sourcing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">5 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 11, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Color and Fabric Trends for Fall/Winter 2026:<br className="hidden lg:block" />{" "}
                        <span className="block lg:inline text-white">What to Manufacture Next</span>
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The season is already on the shelf. Here is what the forecast is still good for &mdash; and the two windows that are actually open.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">· Production &amp; Sourcing</span></p>
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · September 11, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Two forecasts, one overlap: <strong>red-brown, olive, a purple-pink accent, and warm off-white neutrals</strong>. Build a five-colour palette from that, not fifteen.</li>
                            <li>• Fabric is moving toward weight: <strong>rigid denim up to 14.5 oz</strong>, yarn-dyed jacquards, bouclé and sherpa pile. Weight reads as quality this year.</li>
                            <li>• A from-scratch run committed now lands <strong>22 February 2027</strong>. The open windows are a 12-week colour-up of a proven style and Fall/Winter 2027 samples for the <strong>16 February</strong> buying shows.</li>
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
                                        <Link href="/blogs/2026-fabric-trends-hemp-bamboo" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Fabric</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">2026 fabric trends: hemp and bamboo</p>
                                        </Link>
                                        <Link href="/blogs/clothing-production-timeline" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Timeline</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Sketch to store: the real 23 weeks</p>
                                        </Link>
                                        <Link href="/blogs/custom-clothing-manufacturing-cost" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Costing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Manufacturing cost at every MOQ tier</p>
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
                                Pantone published its Fall/Winter 2026 palette on 11 February. The coats it described have been on US shop floors since July.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                That is the awkward truth about <strong>fall winter 2026 fashion trends</strong> for a small brand reading about them in September: the stores bought this season in March. A from-scratch collection committed on Monday lands on 22 February 2027, after the markdowns. So here is the palette and the fabric list, verified against the forecasters&rsquo; own publications &mdash; and the two windows that are actually open.
                            </p>

                            {/* H2 1 */}
                            <section id="the-palette" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What the Fall/Winter 2026 forecast actually said
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A single shaft of late-afternoon window light falling across a row of wool coats hanging on a plain steel rail — red mahogany, burnt olive, creamy off-white, warm camel and a muted mauve-pink — the colour trends 2026 apparel buyers were shown in February. Deep shadow either side, no people, no labels."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two forecasts matter for a US brand. Pantone&rsquo;s New York Fashion Week report names ten colours and five &ldquo;seasonless&rdquo; neutrals for Autumn/Winter 2026/2027 (<a href="https://www.pantone.com/na/en-us/articles/fashion-color-trend-report/new-york-fashion-week-autumn-winter-2026-2027" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Pantone Color Institute</a>). WGSN and Coloro named five key colours for the same season, led by Transformative Teal (<a href="https://www.wgsn.com/en/blog/key-colours-w-26-27" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">WGSN</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Where they agree is what you can bank. Both put a red-toned brown at the centre &mdash; Pantone&rsquo;s Red Mahogany, WGSN&rsquo;s Cocoa Powder. Both carry a purple: Foxglove and Festival Fuchsia on one list, Fresh Purple on the other. Both include an acid yellow-green, and both rest on a warm off-white, the same territory as Cloud Dancer, Pantone&rsquo;s Colour of the Year (<a href="https://www.pantone.com/articles/press-releases/pantone-announces-color-of-the-year-2026-cloud-dancer" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Pantone</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The runways confirmed the purple: Net-a-Porter&rsquo;s buyers saw &ldquo;chartreuse and purple appearing consistently throughout fashion month&rdquo; (<a href="https://www.whowhatwear.com/fashion/runway/net-a-porter-fall-2026-trends" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Who What Wear</a>). A colour only one forecaster names is a house opinion. Treat it as optional &mdash; the same discipline we argued for when <Link href="/blogs/quiet-luxury-dead-whats-next-us-brands-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">quiet luxury ran out</Link>.
                                </p>
                            </section>

                            {/* H2 2 */}
                            <section id="small-collection" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Color trends 2026 apparel: five colours, not fifteen
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fifteen colours is a department-store palette. A small brand&rsquo;s constraint is the dye lot <em>(the minimum quantity a mill will dye in one colour)</em>: every colour you add is another minimum to meet and another lab dip to approve. Five is what a first or second collection can carry &mdash; two neutrals Pantone itself calls seasonless, two core colours both forecasters agree on, one accent bought at the minimum.
                                </p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 400" role="img" aria-label="Five-swatch Fall/Winter 2026 palette for a small US apparel brand, drawn from Pantone's NYFW Autumn/Winter 2026/2027 report: Red Mahogany 19-1521 and Burnt Olive 18-0521 as core colours; Egret 11-0103 and Candied Ginger 15-1213 as seasonless neutrals; Foxglove 16-1710 as the single accent." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">A five-colour Fall/Winter 2026 palette a small brand can dye</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Pantone TCX codes from the NYFW Autumn/Winter 2026/2027 report · two neutrals, two core colours, one accent</text>

                                        {PALETTE.map((c, i) => {
                                            const x = i * 188;
                                            const labelFill = c.dark ? "#FFFFFF" : "#2D2A2E";
                                            return (
                                                <g key={c.code}>
                                                    <rect x={x} y="72" width="172" height="200" rx="12" fill={c.hex} stroke="#D9D3CA" strokeWidth="1" />
                                                    <text x={x + 14} y="250" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill={labelFill} opacity="0.85">{c.code} TCX</text>
                                                    <text x={x + 14} y="300" fontFamily="Helvetica, Arial, sans-serif" fontSize="16" fontWeight="700" fill="#2D2A2E">{c.name}</text>
                                                    <text x={x + 14} y="322" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666">{c.role}</text>
                                                    <text x={x + 14} y="342" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#999999">{c.hex}</text>
                                                </g>
                                            );
                                        })}

                                        <line x1="0" y1="366" x2="928" y2="366" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="390" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators · Pantone codes and hex values as published by the Pantone Color Institute, 11 February 2026</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Fall winter 2026 apparel trends as one dye house can run them. The two neutrals carry into Spring 2027.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The caveat: if your customer buys black, charcoal and one blue, do not dye a hoodie purple because a report said so. Take the neutrals and the mahogany and leave the accent to a brand whose customer has shown they will pay for colour.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A colour both forecasters name is a signal. A colour one of them names is an opinion you are paying a dye lot to test.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3 */}
                            <section id="fabrics" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Fabric trends for clothing brands: the weights that sell in the cold
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of a yarn-dyed wool jacquard where a burnt-olive ground meets a red-mahogany figure — individual looped bouclé yarns catching raking window light, the weave structure visible thread by thread, fabric trends for clothing brands at the scale of the loom. Very shallow depth of field, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The fabric story is weight and structure. Fashion month ran on &ldquo;rich brocade and jacquard fabric,&rdquo; shearling and plaid (<a href="https://www.whowhatwear.com/fashion/runway/fashion-week-trends-fall-winter-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Who What Wear</a>), and the fit went slimmer &mdash; coats at Prada and Jil Sander &ldquo;so fitted they almost looked a size too small.&rdquo; Denim mills say it plainly: Candiani&rsquo;s new range runs to 14.5 oz, about 490 g/m², and Artistic Milliners told Sourcing Journal that &ldquo;consumers are increasingly associating weight with quality&rdquo; (<a href="https://wwd.com/sourcing-journal/sj-denim/fall-winter-2026-2027-denim-mills-practical-heritage-trends-1238850322/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Sourcing Journal</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For a small brand that sorts into three tiers. <strong>Easy:</strong> heavier weights of what you already run &mdash; a 400 g/m² fleece instead of 320, a 13 oz rigid denim instead of 10 oz stretch; our <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="underline text-[#CBB49A] hover:text-[#b7a078]">GSM guide</Link> explains what those numbers mean on the body. <strong>Medium:</strong> yarn-dyed checks and sherpa pile <em>(a knitted fabric brushed to mimic sheepskin)</em>, which most mills stock. <strong>Hard:</strong> jacquard <em>(a pattern woven in on the loom, not printed)</em> and bouclé <em>(a looped, knobbly yarn woven into a nubby cloth)</em>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Hard because a jacquard needs its own loom set-up per design and a minimum per colourway &mdash; our <Link href="/blogs/custom-clothing-manufacturing-cost" className="underline text-[#CBB49A] hover:text-[#b7a078]">cost-by-tier breakdown</Link> shows where that lands on a unit price &mdash; and bouclé snags, slips at the seams and needs a lining. Put it on one style, in one colour, on a block you already trust. And write the colour as a Pantone code and the cloth as a composition and a weight; that is what a <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">tech pack</Link> exists to hold.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    None of this cancels the fibre story: hemp and bamboo blends sit comfortably in these weights, and <Link href="/blogs/2026-fabric-trends-hemp-bamboo" className="underline text-[#CBB49A] hover:text-[#b7a078]">our earlier piece on 2026 fabric trends</Link> is the sustainable companion to this one. <Link href="/blogs/fabric-sourcing-101-choose-right-material" className="underline text-[#CBB49A] hover:text-[#b7a078]">Fabric Sourcing 101</Link> walks the choice from the fibre up.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Forecast-to-Line-Sheet Template</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page spreadsheet: the five Pantone codes above with hex values for your design files, a 60/30/10 style grid with colour-per-style slots, a fabric-consolidation column, and the 12-week and 23-week date maths pre-filled from the day you open it. Excel and Google Sheets.</p>
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
                                            Send me the template
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Template on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="timeline" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    F/W 2026 manufacturing: the two windows still open
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    US wholesale delivers Fall in July and August and Holiday in October and November, against orders written between January and May (<a href="https://www.aims360.com/fashion-business-resources/fashion-wholesale-season-calendar-key-deadlines-distribution-channels-and-apparel-wholesale-software-strategies" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">AIMS360</a>). A first run of a small collection takes about 23 weeks by sea &mdash; 11 development, 7 making, 5 moving &mdash; and a reorder of a style whose pattern and fabric exist takes 12; <Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">we drew that timeline</Link> week by week.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Commit on Monday 14 September and the arithmetic is fixed. A from-scratch line lands <strong>22 February 2027</strong>. A 12-week colour-up lands <strong>7 December</strong>, or 9 November if you fly it. And Fall/Winter 2027 gets bought at MAGIC Las Vegas on <strong>16&ndash;18 February 2027</strong> (<a href="https://www.magicfashionevents.com/events/magic-las-vegas/event-information/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">MAGIC</a>), so samples are due at the start of that month.
                                </p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 330" role="img" aria-label="Timeline from 14 September 2026 to the end of February 2027 showing three lanes: a 12-week colour-up of an existing style landing 7 December 2026; Fall/Winter 2027 development of 11 weeks finishing 30 November with samples due before MAGIC Las Vegas on 16 to 18 February 2027; and a 23-week from-scratch collection landing 22 February 2027, after the Holiday delivery window of October and November." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">Three things you can start on 14 September, and where each one lands</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Weeks from commit · sea freight unless stated</text>

                                        {/* month axis: 14 Sep 2026 → 1 Mar 2027 ≈ 24 weeks; x = 200 + weeks*32 */}
                                        {[
                                            { label: "Sep", w: 0 },
                                            { label: "Oct", w: 2.3 },
                                            { label: "Nov", w: 6.7 },
                                            { label: "Dec", w: 11.1 },
                                            { label: "Jan", w: 15.6 },
                                            { label: "Feb", w: 20 },
                                        ].map((m) => (
                                            <g key={m.label}>
                                                <line x1={200 + m.w * 32} y1="72" x2={200 + m.w * 32} y2="270" stroke="#E0DCD5" strokeWidth="1" />
                                                <text x={200 + m.w * 32 + 4} y="286" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">{m.label}</text>
                                            </g>
                                        ))}

                                        {/* Holiday delivery window: Oct–Nov */}
                                        <rect x={200 + 2.3 * 32} y="72" width={(11.1 - 2.3) * 32} height="198" fill="#CBB49A" opacity="0.12" />
                                        <text x={200 + 2.3 * 32 + 6} y="88" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#8C7355">Holiday delivery window · Oct–Nov</text>

                                        {/* Lane 1: 12-week colour-up */}
                                        <text x="188" y="122" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Colour-up, 12 weeks</text>
                                        <rect x="200" y="106" width={12 * 32} height="26" rx="4" fill="#CBB49A" />
                                        <text x={200 + 12 * 32 + 8} y="124" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#2D2A2E">7 Dec</text>
                                        <rect x="200" y="106" width={8 * 32} height="26" rx="4" fill="none" stroke="#2D2A2E" strokeWidth="1" strokeDasharray="4 3" />
                                        <text x={200 + 8 * 32 - 4} y="147" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#666666" textAnchor="end">by air: 9 Nov</text>

                                        {/* Lane 2: FW27 development → samples → MAGIC */}
                                        <text x="188" y="184" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">F/W 2027 samples</text>
                                        <rect x="200" y="168" width={11 * 32} height="26" rx="4" fill="#B99C79" />
                                        <text x={200 + 11 * 32 + 8} y="186" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#2D2A2E">dev done 30 Nov</text>
                                        <rect x={200 + 22.1 * 32} y="164" width="10" height="34" rx="2" fill="#2D2A2E" />
                                        <text x={200 + 22.1 * 32 - 6} y="186" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="700" fill="#2D2A2E" textAnchor="end">MAGIC 16–18 Feb</text>

                                        {/* Lane 3: 23-week from scratch */}
                                        <text x="188" y="246" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">From scratch, 23 weeks</text>
                                        <rect x="200" y="230" width={23 * 32} height="26" rx="4" fill="#8C7355" />
                                        <text x={200 + 23 * 32 - 8} y="248" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#FFFFFF" textAnchor="end">22 Feb 2027</text>

                                        <line x1="200" y1="270" x2="940" y2="270" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="318" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators · 23 weeks = 11 development + 7 making + 5 moving; a reorder skips the 11 · MAGIC dates per the organiser</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        F/W 2026 manufacturing, honestly drawn. Only the colour-up reaches the shaded delivery window, and only by air.
                                    </figcaption>
                                </figure>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A single unbranded dark-indigo denim trucker jacket on a matte black tailor's form, lit by one hard light from the left so the heavy fabric holds its creases and the copper-toned shank buttons catch a point of light — the evergreen piece in a fall winter 2026 apparel line. Near-black background, no lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So the first open window is a colour-up: your best-selling block in Red Mahogany or Burnt Olive, one weight up, landing in early December for your own site&rsquo;s January and February floor. Wholesale will not take it this late; your own channel will, and the report is titled Autumn/Winter 2026/<em>2027</em> for a reason.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The second is bigger. The eleven development weeks you would spend on a from-scratch line are the same eleven that produce Fall/Winter 2027 samples, finishing 30 November with two months to fit and price before Las Vegas. In your shoes we would do both, and spend nothing new on a block. Which style would you trust with the first colour-up?
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-7">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What are the key fall winter 2026 apparel trends in colour?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">The colours both major forecasters agree on are a red-toned brown (Pantone Red Mahogany 19-1521 and Arabian Spice; WGSN Cocoa Powder), a purple-pink (Pantone Foxglove 16-1710 and Festival Fuchsia; WGSN Fresh Purple), an acid yellow-green (Pantone Acacia; WGSN Green Glow), and a warm creamy off-white (Pantone Egret 11-0103; WGSN Wax Paper). Pantone&rsquo;s seasonless neutrals for the season are Egret, Candied Ginger, Toffee, Underworld and Poseidon.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Which fabrics are trending for Fall/Winter 2026 clothing brands?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Weight and visible structure: yarn-dyed jacquards and brocades, bouclé, shearling and sherpa pile, plaid and tartan checks, and rigid or raw denim in heavier weights &mdash; Candiani&rsquo;s new range runs to 14.5 oz, about 490 g/m². For a small brand the practical order is heavier versions of fabrics you already run first, stocked checks and sherpa second, and custom jacquard or bouclé last, on one style only.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Is it too late to manufacture a Fall/Winter 2026 collection?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">For a from-scratch line, yes: about 23 weeks from a mid-September commit lands on 22 February 2027, after the season is marked down. Two windows are open. A 12-week colour-up of a style whose pattern and fabric already exist lands on 7 December by sea, or around 9 November by air, for your own site&rsquo;s winter floor. And the same development weeks produce Fall/Winter 2027 samples in time for MAGIC Las Vegas on 16&ndash;18 February 2027.</p>
                                    </div>
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
                                    <p className="text-[#666666] leading-relaxed mb-4">The 23 weeks under this post, drawn week by week &mdash; and the 12-week reorder that makes the December colour-up possible.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the timeline <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Send us your best seller and we&rsquo;ll cost the colour-up</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">A photo or tech pack of the style, the fabric it is in now, and the quantity you sold last winter. A Krazy Kreators production lead comes back with the same style one weight up in two of the season&rsquo;s colours, dated to land before December &mdash; and a note on whether it is worth doing at all.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Send your best seller <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/2026-fabric-trends-hemp-bamboo",
                                            title: "2026 Fabric Trends: Why Hemp and Bamboo Are Taking Over",
                                            dek: "The fibre side of this season's fabric story — the sustainable companion to this post.",
                                            read: "6 min read",
                                        },
                                        {
                                            href: "/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight",
                                            title: "Understanding Fabric GSM: Choosing the Right Weight",
                                            dek: "What 320 versus 400 g/m² means on the body before you order one weight up.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "Where the Pantone code and the fabric weight have to be written down.",
                                            read: "12 min read",
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
                        Send your best seller &mdash; we&rsquo;ll cost the December colour-up <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
