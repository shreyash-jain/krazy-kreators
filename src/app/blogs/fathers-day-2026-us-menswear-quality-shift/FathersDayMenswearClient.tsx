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

const BLOG_ID = "fathers-day-2026-us-menswear-quality-shift";

const HERO_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781695354/blog/fathers_day_2026_hero.jpg";
const PIECE_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781695355/blog/fathers_day_2026_piece.jpg";
const GROWTH_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781697645/blog/fathers_day_2026_growth.jpg";
const ATELIER_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781695356/blog/fathers_day_2026_atelier.jpg";
const COMPARISON_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781695357/blog/fathers_day_2026_comparison.jpg";

const TOC = [
    { id: "the-conversation", label: "The conversation" },
    { id: "growing-up", label: "How fast a small thing grows" },
    { id: "first-choice", label: "The first time he chooses" },
    { id: "receiving", label: "What the father receives" },
    { id: "the-piece", label: "What that demands of the piece" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function FathersDayMenswearClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("the-conversation");
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
                    alt="Editorial product photograph of a single well-made menswear piece — a folded oat-coloured wool sweater on a clean wooden surface, soft side light raking across the texture, no face, no logos"
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
                        Wasn&apos;t He Six<br className="hidden sm:block" /> Just Yesterday?
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        What a grown son brings home this Father&apos;s Day isn&apos;t the piece. It&apos;s a sentence the father said in the kitchen, long forgotten — handed back.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Priya Anand · Culture Desk</p>
                            <p className="text-sm text-[#666666]">Writes on US fashion culture and brand strategy for Krazy Kreators · Published June 17, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Father&apos;s Day 2026 is a <strong>$27.9 billion</strong> record — and the son choosing on his own dime for the first time is the shopper most of that record runs through.</li>
                            <li>• What he&apos;s buying isn&apos;t the piece. It&apos;s a sentence his father said when he was six and has long forgotten — handed back, slightly later than scheduled.</li>
                            <li>• For US menswear, the brief is to build pieces <strong>worth the handing-over moment</strong>. Heavy in the hand, named at the origin, repeatable in a single sentence.</li>
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

                        {/* Desktop JS-pinned rail */}
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
                                        <Link href="/blogs/what-2026-met-gala-taught-us-fashion-founders-craft" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Craft</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What the 2026 Met Gala taught US founders about craft</p>
                                        </Link>
                                        <Link href="/blogs/hailey-bieber-rhode-1-billion-lesson-us-brand-founders" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Discipline</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The Hailey Bieber / Rhode $1B lesson</p>
                                        </Link>
                                        <Link href="/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Category</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Streetwear 2.0: heavy GSM, puff prints, acid washes</p>
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
                                There&apos;s a sentence his father said to him when he was six. The father has long forgotten saying it. The son hasn&apos;t.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                That asymmetry is the entire grammar of Father&apos;s Day. A father has been giving for thirty years. The son has been receiving. The relationship is a one-way ledger that has just started to be read in the other direction.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                What follows is the moment, the numbers behind it, and the kind of piece that survives the moment intact — both for the son who chooses it and for the father whose hands it lands in.
                            </p>

                            {/* H2 1: The conversation */}
                            <section id="the-conversation" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The conversation he can&apos;t remember saying
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={PIECE_IMAGE}
                                        alt="A single warm-toned menswear piece in good natural daylight — a marled rust knit polo folded on weathered oak with a small terracotta dish of brass buttons beside it. The piece a son chose, simply shot."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    He was six. His father said something — about losing, or about being seen, or about staying steady when someone else got loud. The exact words don&apos;t exist any more. The kitchen counter does. The light does. The smell of toast and the scrape of the chair on the linoleum.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    He carried the sentence the way you carry a small heavy thing in your pocket — most days you forget it&apos;s there. Some days you put your hand in and feel it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The son is now thirty. He used to stand on a chair to reach the cereal. This morning he stood in his own kitchen on his own feet and picked a gift for his father — not the one his mother chose for him to wrap, not the gag socks his sister suggested. The one he chose.
                                </p>
                            </section>

                            {/* H2 2: Growing up */}
                            <section id="growing-up" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How fast a small thing grows up
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative h-64 lg:h-[360px] mb-7 max-w-4xl mx-auto">
                                    <Image
                                        src={GROWTH_IMAGE}
                                        alt="A split-frame editorial photograph labelled PAST and PRESENT — left side, a small child&apos;s hand placing a hand-drawn paper tie into the father&apos;s open weathered palm; right side, a grown son&apos;s arm handing the same father a boxed leather wallet through a sunlit window. The dad&apos;s hand is in both frames. No faces. The growing-up arc in one image."
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Pew Research finds that <strong>59%</strong> of US young adults rate their relationship with their parents as excellent or very good. The mother number (<strong>63%</strong>) sits stubbornly above the father number (<strong>53%</strong>) (<a href="https://www.pewresearch.org/social-trends/2024/01/25/young-adults-relationship-with-their-parents/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">per Pew&apos;s 2024 study on young adults and their parents</a>). Young men, more than young women, ask their parents for emotional support less.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of that means the bond is weaker. It means the bond is quieter. The things that bridge it tend to be small and chosen, not large and performative — a sentence remembered from a kitchen counter, a piece picked carefully off a shelf.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The son who chooses a gift this June isn&apos;t trying to win a category. He&apos;s closing the ten-point gap between the mother number and the father number — quietly, one piece at a time. The brands he&apos;ll choose from don&apos;t know any of this. They will be evaluated on it anyway.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;He used to stand on a chair to reach the cereal. This morning he stood in his own kitchen on his own feet.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3: First choice */}
                            <section id="first-choice" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The first time the son chooses
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={ATELIER_IMAGE}
                                        alt="A sun-flooded menswear workshop in motion — a cutting table mid-work with chalked pattern pieces, a rust linen panel draped over the edge, brass shears open, a small ceramic cup of coffee with mint, bolts of fabric on the side. The kind of place where things get made well enough to be chosen."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Father&apos;s Day 2026 will move a record <strong>$27.9 billion</strong> across US retail, with <strong>58%</strong> of shoppers planning to gift clothing (<a href="https://nrf.com/topics/holiday-and-seasonal-trends/fathers-day" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">per the NRF&apos;s June projection</a>). The headline number isn&apos;t the story. The decomposition is.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>44%</strong> of those shoppers say the most important thing is choosing something <em>unique or different</em>. <strong>34%</strong> want a gift that creates a <em>special memory</em>. Same NRF release. That is not a gift-card economy and it is not a gag-mug economy. That is people walking into the choosing moment with intent — and a quiet majority of them are first-time choosers.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    When the son chooses, he is making three small decisions at once. He is closing the 10-point gap between the mother number and the father number. He is repaying a sentence his father has long forgotten. And he is buying a piece that has to be heavy enough in the hand to carry both.
                                </p>

                                {/* Mid-article CTA */}
                                <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                            <Download className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                            <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">Build the Piece Worth Choosing</h4>
                                            <p className="text-[#4A484A] leading-snug">A one-page spec sheet of what makes a piece read as &quot;chosen, not bought&quot; — the construction details, the hand-feel benchmarks, the named-origin language a son can use when handing it over. PDF.</p>
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
                            </section>

                            {/* H2 4: Receiving */}
                            <section id="receiving" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What the father is actually receiving
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative h-64 lg:h-[360px] mb-7 max-w-4xl mx-auto">
                                    <Image
                                        src={COMPARISON_IMAGE}
                                        alt="An editorial split-frame comparison — left side a richly hand-finished tan oiled-leather card holder on warm sunlit weathered oak with a sprig of rosemary; right side a glossy synthetic-leather card holder on a cold blue-grey plastic surface with a blank sale tag dangling. The piece a son chooses next to the piece an algorithm chose for him."
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    On the receiving end, the father knows what is happening before he opens the box.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    He has been giving for three decades. He has spent most Father&apos;s Days saying &quot;nothing, just spend time with me&quot; and mostly meaning it, because asking would be giving in the wrong direction. What lands in his hands this June is the first object his son chose for him, on his son&apos;s own money, with his son&apos;s own taste, against his son&apos;s own clock.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The piece is light. The weight is somewhere else. What he is receiving is not the wool or the leather or the wallet — it is the receipt of a relationship and the report that the boy he tried to be steady for grew up steady.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The piece is the receipt. What he is receiving is the report.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 5: The piece */}
                            <section id="the-piece" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What that demands of the piece
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A piece that has to carry all of that has constraints most gifts don&apos;t. It can&apos;t read as bought — it has to read as chosen. It can&apos;t feel light in the hand — the weight has to match the weight of the moment, in <strong>hand-feel</strong> <em>(the immediate tactile impression a garment gives — weight, density, drape)</em>, in <strong>construction</strong> <em>(the engineering of how a piece is built — seams, linings, basting, finishing)</em>, and in the story that comes with it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Four things separate a piece that lands from one that doesn&apos;t. It has the heft the price implies — the wool falls instead of crumpling, the leather pulls instead of plasticking. The construction reads from across a dinner table, not just from two inches away. It carries a <Link href="/blogs/made-in-india-american-luxury-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">named origin</Link> the son can credit (&quot;it&apos;s from this mill, this workshop&quot;), and it gives the father a single sentence he can repeat the first time someone notices it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    These aren&apos;t marketing decisions. They are made decisions — specced into the tech pack, sampled at the mill, sourced into the fabric, run into the bulk. <Link href="/blogs/where-american-fashion-going-2026-nyfw-mens" className="text-[#CBB49A] underline hover:text-[#b7a078]">The throughline US menswear has been moving along all season</Link> ends here, in this kitchen, with this box on the table.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    A footnote, in fairness: there are dads for whom the wink gift <em>is</em> the gift — the absurd mug, the joke socks, the inside reference that only the two of them get. For those, none of this applies. For everyone else — the quiet majority — it does.
                                </p>
                            </section>

                            {/* H2 6: Closing */}
                            <section id="what-wed-do" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&apos;d do in your shoes this week
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    If you are building US menswear right now, build for the son in that kitchen. He is the shopper whose intent the NRF data describes. He is the receipt the father has been waiting on for thirty years.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    He will look at your piece in his hands and ask one question: is this worth handing over? The answer is decided long before he walks into the store — in the tech pack, in the sampling, in the mill, on the production floor. <Link href="/blogs/donda-core-resurgence-us-founders-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">DONDA-core proved</Link> US shoppers will pay for a piece that has an opinion. Father&apos;s Day proves they will <em>choose</em> a piece that has weight.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E]">
                                    Brands that build for that don&apos;t need to plan for Father&apos;s Day. They&apos;ve already been planning. And in fairness to the son in the kitchen, so has his father.
                                </p>
                            </section>

                            {/* End CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/where-american-fashion-going-2026-nyfw-mens" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The tunnel-fit economy</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">Where NYFW Men&apos;s signalled the next eighteen months of US menswear.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the brief <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Build menswear worth handing over</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Sketch through bulk: we build pieces that earn the moment a grown child decides to give back. Construction in the tech pack, hand-feel in the sampling, named origin in the sourcing — and the production discipline to ship the box that lands cleanly. One project lead, the whole calendar.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/where-american-fashion-going-2026-nyfw-mens",
                                            title: "NYFW Men's Just Signaled Where US Fashion's Headed",
                                            dek: "Craft over spectacle, menswear momentum, and the founder moves the data supports.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/quiet-luxury-dead-whats-next-us-brands-2026",
                                            title: "The Quiet Luxury Aesthetic Is Dead — What's Next",
                                            dek: "Aesthetics die. Perspectives don't. Here's what replaces it.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/donda-core-resurgence-us-founders-2026",
                                            title: "What US Founders Should Steal from the DONDA-Core Resurgence",
                                            dek: "Cultural anchor, limited drop, product as artifact — the menswear playbook.",
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
                        Build menswear worth handing over <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
