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

const BLOG_ID = "blokecore-away-kit-fashion-us-brands-2026";

const HERO_IMAGE = "/blog/awaykit_hero.jpg";
const DETAIL_IMAGE = "/blog/awaykit_detail.jpg";
const COMPARE_IMAGE = "/blog/awaykit_compare.jpg";
const DROP_IMAGE = "/blog/awaykit_drop.jpg";

const TOC = [
    { id: "the-bleecker-street-test", label: "The Bleecker Street Test: A Kit With No Team" },
    { id: "why-the-away-shirt-won", label: "Why the Away Shirt Won the Fashion Argument" },
    { id: "the-team-agnostic-buyer", label: "The Team-Agnostic Buyer Is Your Buyer" },
    { id: "the-colorway-is-the-product", label: "The Colorway Is the Product, Not the Crest" },
    { id: "where-this-play-breaks", label: "Where This Play Breaks" },
    { id: "the-monday-move", label: "The Monday Move" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function AwayKitClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("the-bleecker-street-test");
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
                    alt="A young person crossing a sunlit city street wearing South Korea's 2026 floral-violet away kit as everyday streetwear, styled with loose denim — the breakout blokecore look of the World Cup summer."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">June 21, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The Away Kit Became<br className="hidden sm:block" /> the Real Fashion Object
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Off-palette secondary jerseys, not match-day primaries, are driving summer&apos;s biggest aesthetic — and you don&apos;t need a license to build one.
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
                            <p className="text-sm text-[#666666]">Writes on US fashion culture and brand strategy for Krazy Kreators · June 21, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Away and third kits, not home shirts, became 2026&apos;s breakout fashion objects — their <strong>off-palette colorways read as design, not merch</strong>.</li>
                            <li>• US buyers are <strong>team-agnostic</strong>: they buy the look, not the loyalty — which opens the door to unlicensed, fashion-first jerseys.</li>
                            <li>• The founder move: a <strong>limited, off-palette colorway</strong> of a silhouette you already sell, framed as a collectible drop.</li>
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
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Model</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The drop-culture model — when it works, when it doesn&apos;t</p>
                                        </Link>
                                        <Link href="/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Aesthetic</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Streetwear 2.0 — heavy GSM, puff prints, acid washes</p>
                                        </Link>
                                        <Link href="/blogs/world-cup-jersey-quality-playbook-us-brands-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Companion</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The jersey standard — product as global stage</p>
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
                                A man crosses Bleecker Street on a Tuesday in a violet football shirt — ribbed collar, mesh side panels, a crest you can&apos;t quite place. There&apos;s no match today, no bar he&apos;s headed to, no allegiance you could name if you stopped him. He&apos;s wearing it the way someone wore a band tee in 2008: as the whole outfit, a statement about taste rather than tribe.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                That shirt is the most interesting object in American fashion right now. It isn&apos;t because of who&apos;s playing — it&apos;s because of how it looks.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                The 2026 FIFA World Cup — 11 June through 19 July, hosted across the United States, Canada and Mexico, the <a href="https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-world-cup-2026-hosts-cities-dates-usa-mexico-canada" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">first World Cup run by three nations, with 48 teams</a> — has pushed the football shirt to the center of summer style. But the shirts driving the conversation aren&apos;t the ones the teams wear at kickoff. They&apos;re the away kits.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                And for a US clothing founder, that distinction is the entire opportunity.
                            </p>

                            {/* H2 1 */}
                            <section id="the-bleecker-street-test" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The Bleecker Street test: a kit with no team
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={DETAIL_IMAGE}
                                        alt="An extreme close-up of South Korea's 2026 floral-violet away kit — the blooming-flower-inspired tonal graphic, the ribbed knit collar, and the athletic mesh texture that make a national away shirt read as a fashion object."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Start with the aesthetic everyone is suddenly fluent in. <strong>Blokecore</strong> <em>(a look built on football jerseys — vintage or streetwear-inspired — worn as everyday clothing)</em> was <a href="https://hbx.com/journal/2024/05/blokecore-where-fashion-fuses-with-football" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">largely born from a 2021 TikTok by Brandon Huntley</a>, who fused the British slang &ldquo;bloke&rdquo; with the &ldquo;-core&rdquo; suffix. What started as a lad-in-a-pub joke is now a US product category.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It didn&apos;t stay on resale, either. The Globe and Mail&apos;s March 2026 read on the trend <a href="https://www.theglobeandmail.com/life/style/fashion-and-beauty/article-with-the-world-cup-around-the-corner-soccer-kits-have-become-a-style/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">names Aimé Leon Dore, Kith, and Stüssy</a> among streetwear labels working football codes, with Prada and Martine Rose entering from the high-fashion side. The piece explains why kits translate so cleanly: they&apos;re &ldquo;modelled after traditional T-shirts with added design flourishes such as collars, ribbed sleeve cuffs and athletic textiles.&rdquo;
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A kit is a T-shirt with opinions — a collar, a cuff, a crest, and a reason to look twice.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That last point is what most founders miss. A blokecore buyer doesn&apos;t want a printed blank — they want the visual grammar of a real kit attached to a garment that owes nothing to any club. The Bleecker Street man passes the test precisely because you can&apos;t name his team.
                                </p>
                            </section>

                            {/* H2 2 */}
                            <section id="why-the-away-shirt-won" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why the away shirt won the fashion argument
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={COMPARE_IMAGE}
                                        alt="A flat-lay comparison of South Korea's 2026 kit: the red home shirt beside the floral-violet away shirt, labelled home and away — the same nation, one anchored to tradition, one freed to be a fashion object."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here&apos;s the structural reason away kits, not home kits, became the fashion objects of this cycle. A home shirt is anchored — it has to carry the national colors, the flag&apos;s palette, the look the broadcast graphic expects. The away shirt exists, by definition, to look different from the home, and that single rule hands designers permission to play.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Dazed&apos;s June 2026 roundup of the tournament&apos;s most stylish kits puts it plainly: secondary kits let designers <a href="https://www.dazeddigital.com/fashion/article/70487/1/world-cup-2026-most-stylish-football-kits" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">&ldquo;play around with fresh concepts.&rdquo;</a> The receipts are specific. South Korea&apos;s away shirt is purple — <a href="https://sports.yahoo.com/articles/why-south-korea-wearing-purple-020226344.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">officially &ldquo;floral violet,&rdquo;</a> a near-absent color in football, with red kept as the home look.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Japan&apos;s adidas away kit, a collaboration with Yohji Yamamoto, lays twelve colored vertical stripes across an off-white base. Switzerland&apos;s Puma away mimics the interior pages of a Swiss passport and goes UV-reactive. Belgium&apos;s pays tribute to surrealist René Magritte in light blue, pink and white.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of those are templated color swaps. They&apos;re cultural reference points the home shirt could never carry — which is exactly why they read as fashion, not merch.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The home shirt has a job. The away shirt has a license to be interesting.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The lesson for a founder isn&apos;t &ldquo;make it purple.&rdquo; It&apos;s structural: the most fashion-forward object in a lineup is almost always the one freed from the obligation to be on-brand. Your evergreen line <em>(the permanent, always-available core of your range)</em> is your home kit; the away-style colorway <em>(a specific color treatment of an existing silhouette)</em> is where you get to be weird on purpose.
                                </p>
                            </section>

                            {/* H2 3 */}
                            <section id="the-team-agnostic-buyer" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The team-agnostic buyer is your buyer
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Now the part that makes this a real US business and not a London curiosity. Front Office Sports identifies the reason American buyers treat football shirts as fashion: the pre-owned market is <a href="https://frontofficesports.com/vintage-soccer-jerseys-us-market/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">growing more than 100% year over year</a>, and the shirts carry more fashion versatility than NBA or NFL jerseys.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The decisive factor is the last one — US buyers are &ldquo;team-agnostic.&rdquo; No inherited club loyalty. They buy a shirt for its look, not its allegiance.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Sit with that, because it inverts the usual logic of sports apparel. In England, the shirt says who you support; in America, it says something about taste. The buyer was never buying the badge — which means a US founder doesn&apos;t need a FIFA or club license to sell into this demand.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The crest is decoration, not declaration — the buyer was never buying the badge.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The commercial footprint backs it up. Vintage specialist Cult Kits saw <a href="https://frontofficesports.com/vintage-soccer-jerseys-us-market/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">US sales rise 70% over eighteen months</a>, with the US becoming its largest market by revenue. New-shirt sales globally clear <a href="https://frontofficesports.com/vintage-soccer-jerseys-us-market/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">beyond $6 billion a year</a>, per The Chernin Group&apos;s Greg Bettinelli, who framed the movement in one line: &ldquo;I see [soccer] shirts as the sneaker culture of 10 years ago.&rdquo;
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    If he&apos;s right — and the resale curve suggests he is — you want to be making the object, not chasing it on the secondary market.
                                </p>
                            </section>

                            {/* H2 4 */}
                            <section id="the-colorway-is-the-product" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The colorway is the product, not the crest
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={DROP_IMAGE}
                                        alt="A small, deliberately limited rail of South Korea's floral-violet 2026 away kit, shot to evoke scarcity and collectibility — one loud colorway against a calm neutral backdrop."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So what do you actually build? Not a knockoff of anyone&apos;s kit. The move is to take a core silhouette you already sell — or could — and design a fashion-first secondary colorway using away-kit logic.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Off-palette comes first. It means choosing the color football usually avoids, the way Nike chose floral violet. If your evergreen line lives in black, sand and forest green, the away colorway is the acid wash, the puff-print graphic, the heavy-<strong>GSM</strong> <em>(grams per square meter, the weight measure that separates a substantial garment from a flimsy one)</em> statement piece — the territory we mapped in <Link href="/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes" className="text-[#CBB49A] underline hover:text-[#b7a078]">streetwear 2.0</Link>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The crest is where trademark discipline matters. You&apos;re not borrowing a club&apos;s badge — you&apos;re designing an original emblem that reads in the language of a crest: a shield, a wordmark, a year, a motto in a typeface no federation owns.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The visual vocabulary the Globe and Mail describes — &ldquo;big stripes, pinstripes, club crests and bold logos&rdquo; — is a vocabulary, not a set of copyrighted assets. You can speak it without quoting anyone.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Then frame it as a drop: pair a limited away-style run beside your evergreen line so the colorway is scarce by design — the timed-release mechanics that turn scarcity into resale demand are their own discipline, which we break down in <Link href="/blogs/the-drop-culture-model" className="text-[#CBB49A] underline hover:text-[#b7a078]">the drop-culture model</Link>.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">The away-kit playbook</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Off-palette color over on-brand color.</li>
                                        <li>• Original crest-language over borrowed badges.</li>
                                        <li>• Limited run over open stock — the fashion lives in the design choices, not the affiliation.</li>
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Away-Kit Colorway Worksheet</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page planner that walks the four decisions in order — off-palette color, original crest language, limited-run framing, and the evergreen pairing — so the design choices, not the affiliation, carry the piece. PDF.</p>
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

                            {/* H2 5 */}
                            <section id="where-this-play-breaks" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Where this play breaks
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It doesn&apos;t work everywhere, and pretending otherwise is how founders lose a season&apos;s margin. The away-kit move assumes a buyer who reads design fluently and shops on taste. If your customer base is genuinely team-loyal — supporters buying official kit to wear to a match — an unlicensed fashion colorway reads as a hollow imitation, and they&apos;ll spend with the federation&apos;s shop instead.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It also breaks when the colorway is the only idea. An off-palette shirt with no construction behind it — no collar, no ventilation, no badge weight — is just a loud blank, and the blokecore buyer can feel the difference in the first ten seconds of handling it. The aesthetic is downstream of the build.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    And it breaks on timing. This window is open because of a tournament with fixed dates, and the cultural attention has a back wall in mid-July. Blokecore as a broader menswear current will outlast the World Cup — it&apos;s part of the larger 2026 direction we trace in <Link href="/blogs/where-american-fashion-going-2026-nyfw-mens" className="text-[#CBB49A] underline hover:text-[#b7a078]">where American fashion is going</Link> — but the specific surge of attention is seasonal, and seasons close.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs the away-kit play isn&apos;t your play</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your buyers wear kit to support a team, not to make an outfit.</li>
                                        <li>• The colorway is the whole product — there&apos;s no construction underneath it.</li>
                                        <li>• It won&apos;t ship until August, when the tournament — and the attention — is over.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 6 — Closing */}
                            <section id="the-monday-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The Monday move
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Pull one evergreen silhouette, pick the color football is afraid of, and sketch an original crest in the language of a kit — yours, not anyone&apos;s. The away kit won because it was allowed to be interesting, and your version wins on the same terms: built like a real one, not printed like a blank. So what&apos;s the one off-palette colorway your brand has been too on-brand to try?
                                </p>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/the-drop-culture-model" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The Drop-Culture Model</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">How timed, scarce releases turn a single colorway into resale demand — the commercial engine behind a collectible drop.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the playbook <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Build a fashion-first away colorway</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">We&apos;ll help you spec retail-grade jersey construction, an original crest-style badge, and a boxy retro fit — sampled to feel like an authentic kit, not a printed blank.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/the-drop-culture-model",
                                            title: "The Drop-Culture Model — When It Works, When It Doesn't",
                                            dek: "How timed, scarce releases manufacture the resale demand a collectible colorway rewards.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes",
                                            title: "Streetwear 2.0: Heavy GSM, Puff Prints, Acid Washes",
                                            dek: "The finish-and-colorway vocabulary that gives an off-palette away piece its weight and hand-feel.",
                                            read: "6 min read",
                                        },
                                        {
                                            href: "/blogs/where-american-fashion-going-2026-nyfw-mens",
                                            title: "Where American Fashion Is Heading After NYFW Men's",
                                            dek: "The craft-over-spectacle direction that frames blokecore as a trend with staying power.",
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
                        Talk to us about your next colorway <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
