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

const BLOG_ID = "how-to-start-a-clothing-brand-2026";

const HERO_IMAGE = "/blog/start-clothing-brand-hero.jpg";
const SECTION1_IMAGE = "/blog/start-clothing-brand-section1.jpg";
const TEACHING_IMAGE = "/blog/start-clothing-brand-teaching.jpg";
const MACRO_IMAGE = "/blog/start-clothing-brand-macro.jpg";
const CLOSING_IMAGE = "/blog/start-clothing-brand-closing.jpg";

const TOC = [
    { id: "reality-check", label: "What the first year actually costs you" },
    { id: "niche", label: "Step 1 — A niche you can say in one sentence" },
    { id: "range-plan", label: "Step 2 — A range plan, not a mood board" },
    { id: "business-name", label: "Step 3 — Entity, name, and the trademark" },
    { id: "tech-pack", label: "Step 4 — The tech pack is the contract" },
    { id: "fabric-sampling", label: "Step 5 — Fabric, then samples until fit is boring" },
    { id: "landed-cost", label: "Step 6 — Cost the landed price, not the quote" },
    { id: "labels-compliance", label: "Step 7 — Labels are federal law, not decoration" },
    { id: "first-run", label: "Step 8 — Launch small, sell through, then scale" },
    { id: "build-order", label: "The 12-month build order" },
    { id: "bottom-line", label: "The bottom line" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function StartClothingBrandClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("reality-check");
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
                    alt="A first-time clothing founder's work table at dawn: an open sketchbook and a printed spec sheet sharp in the mid-ground, a single unbranded sample tee on a form softly out of focus behind, cool window light. No faces, no logos, no readable text."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Growth &amp; Business
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">11 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 5, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        How to Start a Clothing Brand in 2026:<br className="hidden sm:block" /> A Step-by-Step Guide
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Eight decisions, in the order they actually bite — and the one document, number, or filing each one has to produce before you move on.
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
                            <p className="text-sm text-[#666666]">Covers brand launches and unit economics for Krazy Kreators · August 5, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• To start a clothing brand in 2026, work in this order: <strong>niche → range plan → entity and trademark → tech pack → fabric and sampling → landed cost → labelling → first production run</strong>.</li>
                            <li>• The step most first-time founders skip is <strong>landed cost</strong>. Since the $800 de-minimis exemption was suspended, the factory quote is roughly <strong>77%</strong> of what a garment really costs you.</li>
                            <li>• Budget <strong>9–12 months</strong> from first sketch to first shipment, and don&apos;t design the second run until the first one sells through.</li>
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
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What is a tech pack — and why you can&apos;t manufacture without one</p>
                                        </Link>
                                        <Link href="/blogs/fabric-sourcing-101-choose-right-material" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Fabric sourcing 101: choosing the right material</p>
                                        </Link>
                                        <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Production</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The lead-time timeline: design concept to doorstep</p>
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
                                Almost nobody fails at the idea. They fail somewhere between the idea and the second production run.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                The US apparel market will turn over roughly <strong>$373 billion in 2026</strong> (<a href="https://www.statista.com/outlook/cmo/apparel/united-states/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Statista</a>). At the same time, about one in five new US businesses closes inside its first year, and only around half are still trading at year five (<a href="https://www.bls.gov/bdm/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Bureau of Labor Statistics</a>).
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Both numbers are true at once, and the distance between them is almost entirely sequence. Below is the build order that gets a first collection made and sold — eight steps, each one ending in a specific document, number, or filing you can point at before you spend money on the next.
                            </p>

                            {/* H2 — reality check */}
                            <section id="reality-check" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What the first year of a clothing brand actually costs you
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A documentary-wide view of a small design studio at golden hour: a long table with rolled fabric, a dress form holding one unfinished sample, taped spec sheets on the wall behind, warm low sun through a dusty window. No faces, no brand marks, no readable text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The honest answer: it costs time before it costs money, and then it costs money in a lump. Nine to twelve months from first sketch to first shipment is a normal, well-run timeline — not a slow one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three costs surprise first-time founders every single time. The first is <strong>sampling</strong> <em>(the paid rounds of prototypes before bulk production)</em>, which almost always takes more rounds than planned. The second is <strong>landed cost</strong> <em>(the true per-unit cost once freight, duty, and fees are added)</em>, which is not the number on the factory quote.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The third is returns. Retailers forecast a <strong>15.8% overall return rate</strong> and <strong>19.3% on online sales</strong> (<a href="https://nrf.com/research/2025-retail-returns-landscape" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">NRF &amp; Happy Returns</a>), and apparel sits at the high end of that range because fit is the hardest thing to judge from a product page. Every point of return rate comes straight out of the margin you costed in Step 6.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A first collection is not a creative project with a budget attached. It&apos;s a costing exercise with a creative brief attached.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    None of that is a reason not to start. It is a reason to start in order — and the failure patterns are consistent enough that we mapped them separately in <Link href="/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes" className="underline text-[#CBB49A] hover:text-[#b7a078]">the four operational mistakes behind most US clothing-brand failures</Link>.
                                </p>
                            </section>

                            {/* H2 — Step 1 */}
                            <section id="niche" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 1 — Pick a niche you can say in one sentence
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A workable niche names a specific customer, a specific problem, and a specific product category. &ldquo;Elevated basics for everyone&rdquo; is not a niche. &ldquo;Heavyweight cotton tees cut for men over 6&apos;2&quot; who can&apos;t find length&rdquo; is.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The test is repeatability. If a customer can describe your brand accurately to a friend in one sentence, your positioning works and your marketing gets cheaper. If they can&apos;t, you will pay for every single customer, forever.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Narrow also fixes a production problem. A tight niche means fewer styles, fewer fabrics, and fewer size curves — which means lower minimums, faster sampling, and a cost sheet you can actually understand.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A niche you can say in one sentence is a niche a customer can repeat to a friend. Everything else is a mood board.&rdquo;
                                </blockquote>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Step 1 is done when you have</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• One sentence naming the customer, the problem, and the category.</li>
                                        <li>• Three named competitors and the specific reason a buyer picks you over each.</li>
                                        <li>• A price band you believe that customer will pay, written down.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Step 2 */}
                            <section id="range-plan" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 2 — Build a range plan, not a mood board
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A <strong>range plan</strong> <em>(the list of styles, colourways, and sizes you will actually produce)</em> is the first document with money attached. It converts a Pinterest board into a number of units.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Keep the first drop to three to five styles. Every extra style multiplies through fabric minimums, sampling rounds, grading, photography, and inventory risk — and it is the fastest way to turn a launch budget into a warehouse.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then decide the manufacturing route, because it changes everything downstream. <Link href="/blogs/private-label-vs-custom-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">Private label versus custom manufacturing</Link> is the real fork: private label puts your label on an existing block and gets you to market fast; custom development builds a pattern that is yours and takes longer.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Step 2 is done when you have</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• 3–5 styles, each with colourways, a size run, and a target retail price.</li>
                                        <li>• A total unit count for the first run — the number every quote will hang off.</li>
                                        <li>• A decision, in writing, between private label and custom development.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Step 3 */}
                            <section id="business-name" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 3 — Register the entity and clear the name before you print it
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Form the business entity, get an EIN, open a business bank account, and register for sales tax where you have nexus. That part is administrative. The part that ends brands is the name.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Search the USPTO register before you buy the domain, and file early. Since the January 2025 fee restructure, a US trademark application costs a <strong>$350 base fee per class</strong>, with surcharges that stack — <strong>$100 per class</strong> for insufficient information and <strong>$200 per class</strong> for writing your own free-form description instead of using the ID Manual (<a href="https://www.federalregister.gov/documents/2024/11/18/2024-26644/setting-and-adjusting-trademark-fees-during-fiscal-year-2025" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Register</a>; <a href="https://www.uspto.gov/trademarks/fees-payment-information" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USPTO fee schedule</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Apparel is Class 25. Filing before your first labels are woven costs a few hundred dollars; discovering a conflict after 500 garments carry the name costs the run.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Step 3 is done when you have</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• A registered entity, an EIN, and a business bank account.</li>
                                        <li>• A clean USPTO knock-out search on the name in Class 25.</li>
                                        <li>• An application filed — or a conscious, documented decision to wait.</li>
                                    </ul>
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The First-Year Clothing Brand Checklist</h4>
                                        <p className="text-[#4A484A] leading-snug">All eight steps as a printable checklist, with the document each one has to produce, a blank landed-cost worksheet, and the labelling fields US law requires. PDF.</p>
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
                                    <p className="text-[#2D2A2E] font-medium">Checklist on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 — Step 4 */}
                            <section id="tech-pack" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 4 — The tech pack is the contract
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A <strong>tech pack</strong> <em>(the technical specification a factory manufactures from)</em> carries the flat sketch, the graded measurement chart, the fabric and trim specification, stitch types, seam allowances, label placement, and packing instructions. It is the difference between ordering a garment and describing one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Send a sketch and a reference photo, and the factory will fill every gap with the cheapest reasonable option — different thread, different interlining, a hem that reads wrong. That is not sabotage. It is what an unspecified field means.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A tech pack is also the only way to compare quotes honestly. Two factories quoting from the same spec are quoting the same garment; two factories quoting from a photo are quoting two different products. We broke the document down field by field in <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a tech pack is and why you can&apos;t manufacture without one</Link>.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Everything you don&apos;t write down, someone else decides for you — usually the cheapest way.&rdquo;
                                </blockquote>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Step 4 is done when you have</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• A tech pack per style, with a graded size chart and tolerances.</li>
                                        <li>• Named fabric and trims — composition, weight in GSM, and finish.</li>
                                        <li>• Label, care-label, and packing specifications included, not deferred.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Step 5 */}
                            <section id="fabric-sampling" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 5 — Choose fabric by spec, then sample until the fit is boring
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of heavyweight cotton jersey at a shoulder seam — individual knit loops, the ridge of a twin-needle topstitch, and a hint of rib collar, raking side light, very shallow depth of field. No logos, no readable text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fabric is chosen on four specifications, not on how a swatch feels in a showroom: composition, <strong>GSM</strong> <em>(grams per square metre — the weight of the cloth)</em>, construction, and finish. Those four decide drape, durability, shrinkage, and roughly half your cost sheet.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Ask for a wash test before you commit. A jersey that loses 6% in length after three washes will generate returns that no photography fixes — and the return, not the garment, is what your customer remembers. Our <Link href="/blogs/fabric-sourcing-101-choose-right-material" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing guide</Link> walks the selection criteria in detail.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then sample. Expect two to three rounds: a proto for the pattern, a fit sample on a real body in your base size, and a pre-production sample that is signed off and becomes the quality benchmark for the whole run. Approve nothing on a photo.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Step 5 is done when you have</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• A signed-off pre-production sample per style, physically in your hands.</li>
                                        <li>• Wash-test and shrinkage results on the actual production fabric.</li>
                                        <li>• A graded fit checked on a real fit model, not a mannequin alone.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Step 6 */}
                            <section id="landed-cost" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 6 — Cost the landed price, not the factory quote
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is the step that separates brands that survive from brands that are quietly unprofitable at full price. The factory quote is an input. <strong>Landed cost</strong> is the number you price from.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    2026 made this unavoidable. CBP indefinitely suspended the <strong>$800 de-minimis exemption</strong> on 24 June 2026, so low-value shipments now require formal or informal entry and carry duty, taxes, and fees (<a href="https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Register</a>). The &ldquo;ship it direct and skip the paperwork&rdquo; model that a lot of launch advice still assumes is gone.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is a 500-unit run of cotton tees, classified under HTS 6109.10.00, which carries a <strong>16.5%</strong> general duty rate (<a href="https://hts.usitc.gov/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USITC Harmonized Tariff Schedule</a>):
                                </p>

                                <div className="overflow-x-auto mb-5">
                                    <table className="w-full text-left text-sm sm:text-base border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#CBB49A]">
                                                <th className="py-2 pr-4 font-bold text-[#2D2A2E]">Cost line</th>
                                                <th className="py-2 font-bold text-[#2D2A2E]">Per unit (500-unit run)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[#4A484A]">
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Factory price (FOB)</td><td className="py-2">$12.00</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Ocean freight + insurance</td><td className="py-2">$0.85</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">US duty @ 16.5%</td><td className="py-2">$1.98</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Customs fees + broker</td><td className="py-2">$0.30</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">Inbound to 3PL + inspection</td><td className="py-2">$0.45</td></tr>
                                            <tr className="border-t-2 border-[#CBB49A]"><td className="py-2 pr-4 font-bold text-[#2D2A2E]">Landed cost</td><td className="py-2 font-bold text-[#2D2A2E]">$15.58</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The factory quote is <strong>77%</strong> of the real cost. A founder who prices at 4× the quote thinks they have built a $48 tee at a healthy margin; they have actually built a $48 tee on a $15.58 cost, before returns, shipping, payment fees, and acquisition. Price off the wrong number and the gap never shows up until the third month of settlements.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Treat those figures as a worked structure, not a quote. Duty depends on the exact classification, the country of origin, and whatever trade actions are live when your goods clear — get the HTS code confirmed for your specific garment before you commit to a retail price. Lead times move too, which is why the <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="underline text-[#CBB49A] hover:text-[#b7a078]">design-to-doorstep timeline</Link> belongs in the same spreadsheet.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The factory quote is about three-quarters of what the garment actually costs you. Price off the quote and you&apos;ve already given the margin away.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 — Step 7 */}
                            <section id="labels-compliance" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 7 — Labels are federal law, not decoration
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Every garment you sell in the US needs three things on a permanent label: <strong>fibre content</strong>, <strong>country of origin</strong>, and the <strong>identity of the manufacturer or the business responsible</strong> — either a company name or a registered identification number (<a href="https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">FTC, Threading Your Way Through the Labeling Requirements</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A fourth requirement comes from a separate rule. The FTC&apos;s <strong>Care Labeling Rule</strong> requires permanent care instructions on textile wearing apparel, and the brand must have a reasonable basis for the instruction it prints (<a href="https://www.ftc.gov/legal-library/browse/rules/care-labeling-textile-wearing-apparel-certain-piece-goods" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">16 CFR Part 423</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Put all four in the tech pack in Step 4. Adding them after the run means relabelling every unit by hand, and that cost lands the week you were meant to launch.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Step 7 is done when you have</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Fibre content, country of origin, and responsible-party ID on a permanent label.</li>
                                        <li>• Care instructions you can substantiate, on a permanent care label.</li>
                                        <li>• All of it specified in the tech pack — approved on the pre-production sample.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Step 8 */}
                            <section id="first-run" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 8 — Launch small, sell through, then scale
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Order the smallest run your economics tolerate. Unsold inventory is the most expensive mistake in apparel because it consumes the cash you need for the reorder of the thing that <em>did</em> sell.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then measure two numbers before designing anything new: <strong>sell-through rate</strong> <em>(the percentage of a run sold in a set window)</em> and return rate by size. Sell-through tells you whether the product works; returns by size tell you whether the grading does.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>The counterexample — when to break this sequence.</strong> If you already have an audience, run it backwards: take pre-orders or run a small made-to-order drop from the sampling stage, and let real demand size the first production run. Founders with distribution should validate before they invest in tooling; founders without distribution should build the product first. Choose based on which one you actually have, not on which is more comfortable.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Sell through the first run before you design the second. That one rule prevents most inventory graveyards.&rdquo;
                                </blockquote>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re scaling too early</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• You&apos;re designing drop two while drop one is under 60% sold through.</li>
                                        <li>• Your best-selling size is out of stock and the reorder isn&apos;t funded.</li>
                                        <li>• Return rate is above your baseline and you haven&apos;t traced it to a size.</li>
                                        <li>• You added styles before you re-costed the ones you already make.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Build order / teaching graphic */}
                            <section id="build-order" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The 12-month build order, in one view
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={TEACHING_IMAGE}
                                        alt="A clean branded infographic titled 'The First-Year Build Order' showing a 12-month horizontal timeline with eight labelled bands: Months 1-2 Niche; Months 2-3 Range plan; Months 3-4 Entity, name, trademark; Months 4-5 Tech pack; Months 5-7 Fabric and sampling; Months 7-8 Landed cost and labelling; Months 8-10 First production run; Months 10-12 Launch and sell-through review. Flat editorial data-viz on off-white, no photographic elements."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <div className="overflow-x-auto mb-5">
                                    <table className="w-full text-left text-sm sm:text-base border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#CBB49A]">
                                                <th className="py-2 pr-4 font-bold text-[#2D2A2E]">Months</th>
                                                <th className="py-2 pr-4 font-bold text-[#2D2A2E]">Step</th>
                                                <th className="py-2 font-bold text-[#2D2A2E]">What it has to produce</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[#4A484A]">
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">1–2</td><td className="py-2 pr-4">Niche</td><td className="py-2">One-sentence positioning + price band</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">2–3</td><td className="py-2 pr-4">Range plan</td><td className="py-2">3–5 styles and a total unit count</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">3–4</td><td className="py-2 pr-4">Entity, name, trademark</td><td className="py-2">EIN + Class 25 filing</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">4–5</td><td className="py-2 pr-4">Tech pack</td><td className="py-2">Graded spec per style</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">5–7</td><td className="py-2 pr-4">Fabric &amp; sampling</td><td className="py-2">Signed pre-production sample</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">7–8</td><td className="py-2 pr-4">Landed cost &amp; labelling</td><td className="py-2">Cost sheet + compliant label set</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">8–10</td><td className="py-2 pr-4">First production run</td><td className="py-2">Goods cleared and at the 3PL</td></tr>
                                            <tr><td className="py-2 pr-4">10–12</td><td className="py-2 pr-4">Launch</td><td className="py-2">Sell-through and return-rate read</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Bands overlap in practice — sampling runs while the trademark sits in examination, and photography is booked while goods are on the water. What does not overlap is the dependency chain: no fabric decision without a tech pack, no cost sheet without a fabric decision, no retail price without a cost sheet.
                                </p>
                            </section>

                            {/* Closing prose */}
                            <section id="bottom-line" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A single finished unbranded heavyweight tee on a matte display form in clean directional studio light, one sealed shipping carton just visible and out of focus behind it, wood floor, calm and resolved. No logos, no readable text, no faces."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Starting a clothing brand in 2026 is not a creativity problem. It is a sequencing problem: the founders who get to a second run are the ones who refused to move to the next step until the current one produced a document they could point at.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    If we were in your shoes, we&apos;d spend this week on Steps 1 and 6 — the sentence and the cost sheet — because those two decide whether everything in between is worth building. So: can you say your niche in one sentence, and do you know your landed cost per unit? If either answer is no, that is where the next month goes.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-6 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How do you start a clothing brand in 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">In this order: define a one-sentence niche, build a range plan of three to five styles, register the entity and clear the name with the USPTO, write a tech pack per style, select fabric by specification and sample until fit is signed off, calculate landed cost rather than the factory quote, apply US labelling requirements, then produce a small first run and measure sell-through before scaling.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How long does it take to launch a clothing brand?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Nine to twelve months from first sketch to first shipment is a realistic, well-run timeline. Fabric sourcing and two to three sampling rounds usually take the longest, and bulk production plus ocean freight and customs clearance typically adds another two to three months on top.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What is landed cost, and why does it matter more in 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Landed cost is the true per-unit cost after freight, duty, customs fees, brokerage, and inbound logistics. It matters more now because CBP indefinitely suspended the $800 de-minimis exemption on 24 June 2026 (<a href="https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Register</a>), so low-value shipments now carry duty and entry requirements. On a worked 500-unit tee example, the factory quote was 77% of the landed cost.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What has to be on a clothing label sold in the US?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Fibre content, country of origin, and the identity of the manufacturer or responsible business — plus permanent care instructions under the FTC&apos;s Care Labeling Rule (<a href="https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">FTC</a>). Specify all four in the tech pack so they are made into the garment rather than added afterwards.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Do I need a trademark before I launch a clothing brand?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">You are not legally required to register one, but apparel is a crowded register and rebranding after production is expensive. A US application costs a $350 base fee per class, with surcharges of $100 per class for insufficient information and $200 per class for a free-form description (<a href="https://www.federalregister.gov/documents/2024/11/18/2024-26644/setting-and-adjusting-trademark-fees-during-fiscal-year-2025" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Register</a>). Clothing is Class 25.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How many styles should be in a first collection?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Three to five. Every additional style multiplies through fabric minimums, sampling rounds, grading, photography, and inventory risk — and a narrow first drop keeps the cost sheet legible enough to actually price from.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Should a first-time founder use private label or custom manufacturing?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Private label puts your branding on an existing garment block and gets you to market faster with less development cost. Custom manufacturing builds a pattern that belongs to you and supports a real fit advantage, but takes longer and costs more upfront. The <Link href="/blogs/private-label-vs-custom-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">full comparison is here</Link>.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What return rate should a new clothing brand plan for?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Plan conservatively. Retailers forecast a 15.8% overall return rate and 19.3% on online sales (<a href="https://nrf.com/research/2025-retail-returns-landscape" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">NRF &amp; Happy Returns</a>), and apparel sits at the upper end because fit is hard to judge online. Build the assumption into your cost sheet before you set retail price.</p>
                                    </div>
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">What Is a Tech Pack? (And Why You Can&apos;t Manufacture Without One)</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">Step 4 in full — every field a factory needs, and what happens to the ones you leave blank.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <div className="block p-7 rounded-2xl bg-[#2D2A2E] text-white">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2">Get your first collection through Steps 4 to 8</h4>
                                    <p className="text-gray-300 leading-relaxed mb-5">Talk to a Krazy Kreators production lead about starting your clothing brand — tech packs, fabric sourcing, sampling, and a costed first run under one roof.</p>
                                    <div className="flex flex-col gap-3">
                                        <Link href="/end-to-end-services" className="inline-flex items-center justify-between gap-2 px-5 py-3 rounded-full bg-[#CBB49A] text-white font-semibold hover:bg-[#b7a078] transition-colors">
                                            Explore End-to-End Services <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <Link href="/design-services" className="inline-flex items-center justify-between gap-2 px-5 py-3 rounded-full border border-white/40 text-white font-semibold hover:border-[#CBB49A] hover:text-[#CBB49A] transition-colors">
                                            Start with Design Services <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => setContactOpen(true)} className="text-left text-sm text-gray-300 underline hover:text-white transition-colors">
                                            Or send us your concept and we&apos;ll tell you what it takes to make
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/zero-moq-no-warehouse-launch-clothing-brand-2026",
                                            title: "Zero MOQ, No Warehouse, No Factory Contract",
                                            dek: "The lower-risk route to a first drop when cash is the constraint.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/the-real-cost-of-wrong-clothing-manufacturer",
                                            title: "The Real Cost of the Wrong Clothing Manufacturer",
                                            dek: "Wrong samples, defective bulk, no one to call — where a first run dies.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes",
                                            title: "Why Most US Clothing Brands Fail in 5 Years",
                                            dek: "The four operational mistakes behind the failure rate.",
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

                            {/* About Krazy Kreators */}
                            <div className="mt-16 p-6 rounded-2xl bg-[#F8F7F4] border border-gray-100">
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">About Krazy Kreators</p>
                                <p className="text-base leading-relaxed text-[#4A484A]">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders — design, sampling, fabric sourcing, retail-grade production, and packaging, under one roof, from first sketch to shelf. <a href="https://www.krazykreators.com" className="underline text-[#CBB49A] hover:text-[#b7a078]">krazykreators.com</a>
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
                        Start your clothing brand with Krazy Kreators <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
