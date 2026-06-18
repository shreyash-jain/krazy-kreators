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

const BLOG_ID = "tunnel-fit-economy-nba-us-menswear-dtc-2026";

const HERO_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781692537/blog/tunnel_fit_hero.jpg";
const CORRIDOR_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781691537/blog/tunnel_fit_corridor.jpg";
const ANATOMY_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781691541/blog/tunnel_fit_anatomy.jpg";
const CLOSEUP_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781691542/blog/tunnel_fit_closeup.jpg";
const STATEMENT_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781691539/blog/tunnel_fit_statement.jpg";
const STUDIO_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781691540/blog/tunnel_fit_studio.jpg";

const TOC = [
    { id: "tunnel-became-runway", label: "The tunnel became the runway" },
    { id: "finals-2026-read", label: "What the 2026 Finals showed" },
    { id: "small-brand-opening", label: "The small-brand opening" },
    { id: "survives-the-closeup", label: "Surviving the close-up" },
    { id: "the-play", label: "The play: three moves" },
    { id: "when-tunnel-wont-save", label: "When the tunnel won't save you" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function TunnelFitClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("tunnel-became-runway");
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
                    alt="A wide, cinematic view down a darkened NBA arena tunnel — warm overhead light spilling onto a polished concrete corridor, a single figure mid-stride in a structured statement coat, photographed from behind so no face is visible, the garment's shoulder line and fabric catching the light"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Strategy
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">June 17, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The Tunnel-Fit Economy<br className="hidden sm:block" /> Reshaping US Menswear
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        NBA tunnels became menswear&apos;s biggest runway. A small brand can ride it — if the bulk matches the sample.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Priya Anand <span className="text-[#666666] font-normal">· Culture Desk</span></p>
                            <p className="text-sm text-[#666666]">Writes on US fashion culture and brand strategy for Krazy Kreators · June 17, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• NBA tunnel walks are now <strong>menswear&apos;s biggest runway</strong>.</li>
                            <li>• A player wearing a small label can <strong>sell it out overnight</strong>.</li>
                            <li>• The spike only converts if the <strong>construction holds up to the close-up</strong>.</li>
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
                                        <Link href="/blogs/where-american-fashion-going-2026-nyfw-mens" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Direction</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Where US fashion is heading after NYFW Men&apos;s</p>
                                        </Link>
                                        <Link href="/blogs/donda-core-resurgence-us-founders-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Playbook</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What to steal from the DONDA-core resurgence</p>
                                        </Link>
                                        <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Production</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The real cost of the wrong clothing manufacturer</p>
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
                                A basketball player walked through an arena tunnel this June wearing a jacket almost nobody could name. By the fourth quarter, the brand&apos;s site had sold out. That sequence — corridor, camera, checkout — is now one of the most reliable discovery engines in US menswear.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                The runway used to decide what mattered. In 2026, a ninety-foot walk from the team bus to the locker room does more for a small label than a season of lookbooks.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                The question for founders isn&apos;t whether to pay attention. It&apos;s whether your product could survive the moment if it ever arrived. Here&apos;s how the tunnel-fit economy actually works — and the one place it quietly punishes the unprepared.
                            </p>

                            {/* H2 1: The tunnel became the runway */}
                            <section id="tunnel-became-runway" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How a hallway replaced the runway
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CORRIDOR_IMAGE}
                                        alt="An atmospheric documentary photograph inside an arena player-entrance corridor — a forest of raised phone screens held up by anonymous hands capturing someone walking in, motion blur at the edges, warm tunnel lighting, no faces in frame, focus on the act of being photographed"
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For most of fashion history, discovery ran on a calendar. Shows in February and September, editors in the front row, a trickle down to the shopper months later. The NBA collapsed that timeline into a hallway.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A <strong>tunnel fit</strong> <em>(the outfit a player wears walking from the team bus through the arena tunnel to the locker room, photographed and broadcast before tip-off)</em> is now a fashion event with a bigger live audience than any catwalk. League photographers cover it like a red carpet. Dedicated accounts grade it nightly.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The tunnel is the only runway that broadcasts before the clothes are for sale.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The shift matters because the audience is already in buying posture. They&apos;re watching their team, the player they follow is wearing the piece, and the brand is one search away. Compare that to a runway look the average shopper never sees, worn by a model they can&apos;t name, available in nine months.
                                </p>
                            </section>

                            {/* H2 2: What the 2026 Finals showed */}
                            <section id="finals-2026-read" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What the 2026 Finals actually showed
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={STATEMENT_IMAGE}
                                        alt="A headless, neck-down editorial photograph of a tall figure standing in an arena corridor in a bold monochrome pinstriped tailored look — the statement-fit silhouette, shoulders and lapel construction in sharp focus, the face out of frame. No logos, no readable text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This year&apos;s Finals — the <a href="https://www.nba.com/playoffs" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">New York Knicks against the San Antonio Spurs</a> — made the point at full volume. The series was a basketball story. The tunnel was a menswear one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three looks did the rounds. A monochrome pinstriped tuxedo that treated the corridor like a black-tie event. A patterned work jacket layered over a preppy base — high-low, done on purpose. And a rookie in a downtown New York streetwear label most of the audience had never heard of before that night.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Notice what they share. None of them were quiet. Each was a single, legible, photographable idea — a statement piece built to read at a glance and survive a freeze-frame.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Two of those three pieces came from established houses with full ateliers behind them. One came from a small label that woke up to a sold-out site. That gap — between the brands that can absorb the moment and the ones it catches flat — is the whole story for founders.
                                </p>
                            </section>

                            {/* H2 3: The small-brand opening */}
                            <section id="small-brand-opening" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why this is a real opening for small brands
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={STUDIO_IMAGE}
                                        alt="An intimate, warmly-lit small-studio scene — a single statement jacket on a rolling rack beside an open laptop on a worktable, a maker's hands (no face) steadying the garment. The founder's-desk side of the tunnel-fit economy. No logos, no readable text on screen."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here&apos;s why this is a genuine opening and not just spectacle for the big names. The discovery that used to require a wholesale account, a showroom, and a PR budget now needs one player and one good piece.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A brand selling <strong>DTC</strong> <em>(direct-to-consumer — straight to the shopper through your own site, with no wholesale middleman)</em> can convert a tunnel moment in real time. There&apos;s no retailer sitting between the broadcast and the buy. A well-timed <strong>drop</strong> <em>(a limited release sold in a short window rather than an always-on catalogue)</em> turns that spike into a sell-out instead of a stockout you can&apos;t refill.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    This is the same signal we read off the runways — <Link href="/blogs/where-american-fashion-going-2026-nyfw-mens" className="text-[#CBB49A] underline hover:text-[#b7a078]">menswear is where the cultural attention sits right now</Link>. The tunnel is just its fastest, least forgiving version. Player wears it, the clip travels, search spikes, and the site either converts or it doesn&apos;t.
                                </p>
                            </section>

                            {/* H2 4: Surviving the close-up */}
                            <section id="survives-the-closeup" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The catch: surviving the close-up
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSEUP_IMAGE}
                                        alt="An extreme macro photograph of a statement jacket's construction under hard directional light — dense topstitching, the grain of a heavyweight wool, a metal snap catching a highlight, every thread and seam sharply resolved to evoke a 4K camera freeze-frame. No logos, no faces."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here&apos;s the part nobody posts about. The tunnel camera is 4K, shot under arena light, then frozen and zoomed by millions of phones. It shows everything.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The piece a player wears is almost always a <strong>sample</strong> — the one perfect unit your factory hand-finished for approval. The units you ship are <strong>bulk</strong> — the hundreds that come off the line when demand hits. The distance between those two, the <strong>bulk-vs-sample gap</strong>, is where most small brands lose the moment they just won.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A million views can&apos;t fix a crooked seam. The camera that made the sale also files the return.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A puckered seam, a fused panel that should have been stitched, a dye lot two shades off — none of it shows on the sample. All of it shows on the bulk unit a customer films for their unboxing, and <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="text-[#CBB49A] underline hover:text-[#b7a078]">the wrong manufacturer turns that gap into a refund queue</Link>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The spike is the easy part. Holding it — shipping six hundred units that look like the one on the broadcast — is what separates a brand from a one-night trend.
                                </p>
                            </section>

                            {/* H2 5: The play */}
                            <section id="the-play" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The play: fewer, bolder, better-built
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative h-64 lg:h-[360px] mb-7 max-w-4xl mx-auto">
                                    <Image
                                        src={ANATOMY_IMAGE}
                                        alt="A clean editorial infographic on a cream paper background titled 'Anatomy of a viral menswear piece' — a single statement jacket drawn center-frame with three annotation callout lines pointing to labelled details: fabric weight (GSM), construction and finishing, and drop timing. Minimal, branded, no photographic faces."
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-8">
                                    If you want to be the small brand that converts a tunnel moment instead of the one that refunds it, the play is narrow. Fewer pieces, built past your basics, timed to be available. Three moves, each with a &quot;Signs you&apos;re making this mistake&quot; check.
                                </p>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">1. Build fewer, bolder hero pieces</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    A statement piece is the only thing the tunnel rewards. Quiet, versatile, safe — none of it reads at broadcast distance. Pick the one or two pieces a year you&apos;d want frozen on a million screens, and put the budget there.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The founder move: stop spreading the line evenly. Decide which piece is the one you&apos;d bet the broadcast on, and let the rest of the catalogue support it.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re making this mistake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your line is twenty safe SKUs and no single piece you&apos;d bet the broadcast on.</li>
                                        <li>• &quot;What&apos;s our hero piece?&quot; gets a shrug or a list.</li>
                                        <li>• Your boldest design got value-engineered into your blandest.</li>
                                    </ul>
                                </div>

                                {/* Mid-article soft CTA */}
                                <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                            <Download className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                            <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Statement-Piece Construction Checklist</h4>
                                            <p className="text-[#4A484A] leading-snug">The fabric weight, finishing, and bulk-approval steps that decide whether your hero piece survives a 4K freeze-frame. One page. PDF.</p>
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

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">2. Set the construction bar above your basics</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    A hero piece carries a different build standard than a catalogue tee. Heavier fabric, real finishing, hardware that holds — the things a freeze-frame can actually see. Spec the <strong>GSM</strong> <em>(grams per square meter — the standard measure of how heavy and substantial a fabric feels)</em> high enough that the piece drapes and photographs like the sample.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The founder move: hold your flagship to a higher bar than the rest of the line. <Link href="/blogs/made-in-india-american-luxury-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">This is where a premium construction story earns its cost</Link> — and where cutting it shows up first.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re making this mistake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your hero piece runs the same fabric weight and finishing as your basics.</li>
                                        <li>• You approved the sample without ever seeing a bulk unit off the real line.</li>
                                        <li>• Nobody on the team can name the GSM or the seam type on your flagship.</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">3. Time the drop so the moment can land</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    Virality you can&apos;t fulfill is a refund queue with extra steps. Build the inventory or the made-to-order capacity before the moment, not after. A drop calendar that can flex — restock fast, or take orders against a lead time you&apos;d actually quote — beats a sold-out page with no plan behind it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The founder move: decide today what happens the night a player wears your work. The answer can&apos;t be &quot;we&apos;ll figure it out.&quot;
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re making this mistake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your big piece sells out and the next question — &quot;when can we remake it?&quot; — has no answer.</li>
                                        <li>• There&apos;s no plan for the night the moment actually arrives.</li>
                                        <li>• Your lead time is a guess, not a number you&apos;d quote a customer.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 6: Counterexample */}
                            <section id="when-tunnel-wont-save" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When the tunnel won&apos;t save you
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of this guarantees anything. The honest read: the small-brand opening is real, but it&apos;s crowded, and the odds still favor the houses.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Most viral tunnel pieces come from established brands — the ones with the relationships, the gifting budgets, and the stylists who dress players on retainer. A small label getting picked is closer to a lottery than a plan. You can&apos;t manufacture the moment; you can only be built for it if it comes.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    And some categories don&apos;t play here at all. If your brand lives on basics, performance, or anything bought on repeat rather than on statement, the tunnel isn&apos;t your channel — and chasing it will distort a line that was working.
                                </p>
                            </section>

                            {/* H2 7: Closing */}
                            <section id="what-wed-do" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&apos;d do in your shoes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    We&apos;d pick one hero piece and over-build it — heavier fabric, real finishing, a sample we&apos;d already matched against a bulk unit before we ever needed to. We&apos;d keep the rest of the catalogue lean and let that one piece carry the brand if the moment lands.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    The tunnel isn&apos;t a strategy you can schedule. So the only useful question is the one to ask now: if a player wore your best piece tonight, would the bulk you ship tomorrow look like the sample they wore?
                                </p>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/where-american-fashion-going-2026-nyfw-mens" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Where US fashion is heading</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The runway read behind the tunnel signal — craft over spectacle, menswear out in front.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the direction <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Build a hero piece that survives the close-up</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">We&apos;ll help you spec the fabric, set the construction bar, and match bulk to sample before the moment finds you.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/where-american-fashion-going-2026-nyfw-mens",
                                            title: "Where US Fashion Is Heading After NYFW Men's",
                                            dek: "Craft over spectacle, menswear in front — the directional read for founders.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/donda-core-resurgence-us-founders-2026",
                                            title: "What US Founders Should Steal from the DONDA-Core Resurgence",
                                            dek: "Cultural anchor, limited drop, product as artifact — the menswear playbook.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/what-2026-met-gala-taught-us-fashion-founders-craft",
                                            title: "What the 2026 Met Gala Taught US Fashion Founders About Craft",
                                            dek: "761 hours of hand-work behind a single look — and the founder lesson.",
                                            read: "8 min read",
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
                        Talk to us about your hero piece <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}