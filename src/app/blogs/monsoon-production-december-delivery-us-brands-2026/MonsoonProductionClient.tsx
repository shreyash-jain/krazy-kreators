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

const BLOG_ID = "monsoon-production-december-delivery-us-brands-2026";

const HERO_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780913835/blog/monsoon_production_hero.jpg";
const WINDOW_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780913836/blog/monsoon_production_window.jpg";
const DRYING_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780913838/blog/monsoon_production_drying.jpg";
const DOCK_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780913839/blog/monsoon_production_dock.jpg";
const CALENDAR_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1780913840/blog/monsoon_production_calendar.jpg";

const TOC = [
    { id: "june-sept-window", label: "The June–Sept window" },
    { id: "humidity-impact", label: "What humidity does" },
    { id: "logistics-friction", label: "The friction in logistics" },
    { id: "monsoon-ready", label: "What a monsoon-ready floor does" },
    { id: "when-it-doesnt-apply", label: "When this doesn't apply" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function MonsoonProductionClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("june-sept-window");
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
        showToast("One-pager on the way to your inbox.", "success");
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
                    alt="An Indian apparel factory exterior during heavy monsoon rain at golden hour — covered fabric being staged at the loading bay, the seasonal collision between June rain and December delivery in a single frame"
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">June 8, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Monsoon Math: June Rain<br className="hidden sm:block" /> and Your December Delivery
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Your holiday stock is cut and dyed mid-monsoon. Plan for the humidity, or pay for it in December.
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
                            <p className="text-sm text-[#666666]">Published June 8, 2026</p>
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Monsoon runs <strong>June–September</strong> across the South Asian belt where much quality apparel is made.</li>
                            <li>• Humidity slows dyeing and drying, shifts color consistency batch to batch, and adds port and road friction.</li>
                            <li>• Your December stock is produced <strong>mid-monsoon</strong> — your partner must have a plan for it.</li>
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

                        {/* Desktop JS-pinned rail — TOC + suggested reads with 3-state pin (above / pinned / below) */}
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
                                        <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Reference</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Understanding GSM: choosing the right fabric weight</p>
                                        </Link>
                                        <Link href="/blogs/pigment-dye-vs-reactive-dye" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Reference</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Pigment dye vs. reactive dye: which holds color</p>
                                        </Link>
                                        <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Foundations</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Lead-time timeline: design to doorstep</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Spacer preserves aside cell footprint when rail is pinned (not needed in "below" — already absolute-bottom-anchored) */}
                            {railState === "pinned" && <div aria-hidden style={{ height: tocNaturalHeight }} />}
                        </aside>

                        {/* Article */}
                        <article ref={articleRef} className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Opening */}
                            <p className="text-lg lg:text-xl text-[#2D2A2E] leading-snug mb-5 font-medium">
                                Your holiday and December orders aren&apos;t made in October. They&apos;re cut, dyed, and finished in <strong>July and August</strong> — the middle of monsoon — in the same factories that will hand them to a vessel by mid-September.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                That seasonal collision is what makes this a different production conversation than any other quarter. Rain doesn&apos;t just delay shipments — it shifts how fabric absorbs dye, how garments dry, and which finishing techniques hold up.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                If your supply partner&apos;s answer to &quot;how does the schedule change in monsoon?&quot; is anything short of specific, you are paying for that absence of plan in December.
                            </p>

                            {/* H2 1: June-Sept window */}
                            <section id="june-sept-window" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The June–September window every US brand is paying for
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={WINDOW_IMAGE}
                                        alt="Wide documentary view of a Tirupur-style apparel production floor during peak monsoon — rain visible through tall windows, sewing stations active, fabric rolls stacked under tarp on one side"
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The South Asian summer monsoon runs roughly <strong>June 1 through September 30</strong> (<a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">per India Meteorological Department reporting</a>). For the major apparel-manufacturing hubs — Tirupur, Bangalore, Noida, Ludhiana, Dhaka, Chittagong — that window collides head-on with peak production for US holiday and Q1 stock.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The math is unforgiving. A bulk run that arrives at a US warehouse in October started cutting in early August. A vessel that hits the US west coast in late November cast off from Mundra or Chittagong in mid-October.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    In other words: every December delivery you&apos;re tracking right now is being made <em>during</em> the monsoon. The factory&apos;s monsoon discipline is your December delivery discipline — full stop.
                                </p>
                            </section>

                            {/* H2 2: What humidity does */}
                            <section id="humidity-impact" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What humidity actually does to color, drying, and finishing
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={DRYING_IMAGE}
                                        alt="Split-frame editorial comparison — left: a climate-controlled dehumidified drying room with neat hanging fabric, right: traditional open-air drying with fabric strung across courtyard lines, both during monsoon"
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Rain itself doesn&apos;t slow a sewing machine. Humidity does. Three operational things shift in monsoon, and any one of them can break a holiday SKU.
                                </p>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">Dye absorption shifts batch to batch</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A <strong>dye lot</strong> <em>(the unit of fabric dyed together to a specific colour recipe — colour consistency is tracked at the lot level)</em> behaves differently at 90% humidity than at 60%. The same recipe, the same mill, the same fabric — and the post-wash shade pulls warmer in some lots, cooler in others.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Brands that don&apos;t catch this in QC ship a December order where the navy jacket and the navy pant on the same model are visibly two different navies.
                                </p>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">Drying time stretches — and finishing waits</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fabric can&apos;t be cut, sewn, or <strong>finished</strong> <em>(the last-mile garment treatments — printing, embroidery, garment-wash, brushing, pressing — that happen after the bulk seams are stitched)</em> while it&apos;s holding moisture. In dry months, post-dye drying is a half-day step.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    In monsoon, without controlled drying, the same fabric can sit 36 to 72 hours before it&apos;s stable enough for the next stage. Each delay compounds, and the finishing window for printing or embroidery gets squeezed against the cutting deadline behind it.
                                </p>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">GSM isn&apos;t a fixed number in humid air</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Heavier fabrics absorb more atmospheric moisture. A <strong>GSM</strong> <em>(grams per square metre — the standard fabric-weight unit)</em> reading taken in July can differ measurably from one taken in November on the same fabric, because the cloth itself is heavier with absorbed water.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Anything weight-spec sensitive — fleece, heavy knits, midweight wovens — drifts off-spec in monsoon-only readings. Sample-vs-bulk weight discrepancies that look mysterious in spec sheets are often just humidity, measured at different points in the calendar.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The factory&apos;s monsoon discipline is your December delivery discipline — full stop.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3: Logistics friction */}
                            <section id="logistics-friction" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The friction monsoon adds to ports, roads, and vessels
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={DOCK_IMAGE}
                                        alt="Wide documentary view from inside a covered loading dock during peak monsoon — fabric pallets wrapped in plastic stacked in the foreground, a forklift parked off to the side, heavy rain visible beyond the bay edge with distant trucks waiting under the storm"
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Beyond the factory, monsoon adds logistical friction that lands directly against your December deadline. Heavy rain closes inland roads in pockets of Maharashtra, Karnataka, and Tamil Nadu — sometimes for days at a time.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Cyclone warnings around the Bay of Bengal pull east-coast vessel schedules a week off, and trans-Pacific freight rates tend to peak August through October partly because every brand is rushing the same window (<a href="https://www.mckinsey.com/industries/retail/our-insights/state-of-fashion" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">McKinsey&apos;s State of Fashion</a> tracks this seasonality year on year).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    None of this is unmanageable. It is manageable only if your partner is anticipating it before bookings open in late June — not negotiating around it after the rain has started.
                                </p>
                            </section>

                            {/* H2 4: Monsoon-ready floor */}
                            <section id="monsoon-ready" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What a monsoon-ready factory does differently
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative h-64 lg:h-[360px] mb-7 max-w-4xl mx-auto">
                                    <Image
                                        src={CALENDAR_IMAGE}
                                        alt="An editorial production calendar diagram from June through December, with the monsoon window highlighted, fabric staging, dyeing, finishing, QC, and shipping stages mapped on a cream background — the timeline of a monsoon-aware factory"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-8">
                                    Four operational things separate a factory that handles monsoon from one that absorbs the damage as missed shipments. Use the &quot;Signs&quot; boxes below as a checklist when you next visit the floor or call the project manager.
                                </p>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">1. Stages fabric before peak monsoon</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    Premium fabric and mill-to-order lots are POed and physically delivered to the factory before late June, when the peak rain hits. A monsoon-ready floor plans the fabric pipeline backwards from August cutting — not the other way around.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The reason: fabric in transit during peak monsoon is fabric exposed to road closures, port back-ups, and warehouse humidity it was never specified for.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your factory isn&apos;t doing this</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Fabric POs for September cutting are still being placed in July.</li>
                                        <li>• Premium fabric is in transit (not on the factory floor) when monsoon peaks.</li>
                                        <li>• The factory has no covered, climate-controlled fabric storage.</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">2. Finishes in controlled environments</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    Dyeing, washing, drying, and finishing happen in climate-controlled rooms with dehumidified air — not in open-shed bays at the back of the floor. The capital cost is real. The alternative is the colour-consistency problem above, repeated across every lot.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    On a site visit, ask to see the dye-and-finish room. The honest factories want to show it; the ones that don&apos;t want to are telling you something.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your factory isn&apos;t doing this</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Fabric is dried in open courtyards or on rooftop lines.</li>
                                        <li>• The factory tours you through sewing floors but skips the dye-and-finish room.</li>
                                        <li>• There&apos;s no humidity reading written on the QC sheets.</li>
                                    </ul>
                                </div>

                                {/* Mid-article soft CTA — between decision 2 and 3 (~55% scroll) */}
                                <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                            <Download className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                            <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">Monsoon-Season Supplier Questions</h4>
                                            <p className="text-[#4A484A] leading-snug">A one-page list of the exact questions to put to your sourcing partner this week — schedule, fabric drying, buffer, dye-lot management. PDF.</p>
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
                                        <p className="text-[#2D2A2E] font-medium">One-pager on the way. Check your inbox.</p>
                                    )}
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">3. Builds a written schedule buffer</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    A monsoon-ready production plan has a built-in 5 to 7 day buffer between dye-finish and cut-start, and another between QC and dispatch. The buffer lives on the production sheet, not in the project manager&apos;s head.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Buffer is not slack you negotiate down. Buffer is the reason the rest of the calendar holds when one stage slips three days in a wet week. <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="text-[#CBB49A] underline hover:text-[#b7a078]">The full 90-day timeline</Link> assumes buffer; without it, the math doesn&apos;t close.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your factory isn&apos;t doing this</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• The factory&apos;s production schedule reads exactly the same in July as in February.</li>
                                        <li>• &quot;We&apos;ll catch up in August&quot; is a sentence anyone has said aloud about your order.</li>
                                        <li>• The PM treats buffer requests as negotiation room rather than monsoon discipline.</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">4. Manages dye lots tightly across humidity</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    Dye lots are sequenced so that a single garment&apos;s colour-coordinated pieces — a three-piece tracksuit, a coordinated outerwear set — come from the same lot, dyed in the same humidity window. Mixing lots across a wet weekend is what produces the navy-jacket-navy-pant problem.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The QC sheet for every shipment names which lots fed which SKUs. If it doesn&apos;t, the factory doesn&apos;t know — and the colour-mismatch claim will arrive at your warehouse instead.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your factory isn&apos;t doing this</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• There&apos;s no dye-lot reference on the QC report you receive.</li>
                                        <li>• Lot mismatches are discovered at the US warehouse, not at the factory.</li>
                                        <li>• The factory can&apos;t tell you which lots are running which SKUs this week.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 5: Counterexample */}
                            <section id="when-it-doesnt-apply" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When the monsoon math doesn&apos;t apply
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two scenarios where this conversation is less load-bearing.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Synthetic-heavy lines</strong> — pure polyester, nylon-blend technical wear, and most performance fabrics — are far less monsoon-sensitive than natural fibres. The fibres themselves don&apos;t absorb atmospheric moisture, drying times stay short, and dye-absorption shifts are smaller. If your line is 80%-plus synthetic, monsoon discipline is &quot;nice to have&quot; rather than &quot;ship or not.&quot;
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Factories with fully climate-controlled production</strong> from cut to finish — the small but growing tier of mills and units that have invested in HVAC across the entire floor — operate close to dry-season tolerances year-round. They cost more per unit. They&apos;re worth it for any brand whose colour and consistency promise is part of the price.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    If neither describes your sourcing partner, monsoon discipline <em>is</em> the conversation. <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">Plus-one sourcing</Link> is one way to route monsoon-sensitive categories to climate-stable geographies for the months it matters most.
                                </p>
                            </section>

                            {/* H2 6: Closing — what we'd do */}
                            <section id="what-wed-do" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&apos;d do in your shoes this month
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Get a written answer this week to four questions: how does the schedule change in monsoon, where does the fabric dry, what buffer is in my timeline, and how is colour held in humidity.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Compare the answers against the &quot;Signs&quot; boxes above. The factory with specific, line-item answers is the factory that ships December cleanly.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E]">
                                    Treat the absence of a specific answer as the answer itself.
                                </p>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/holiday-2026-production-window-us-founders-order-now" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">What to lock for holiday this month</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The three decisions that gate every December delivery.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the holiday brief <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">How we schedule around monsoon</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">We&apos;ll walk through fabric staging, dye-lot sequencing, and buffer for your December calendar.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/holiday-2026-production-window-us-founders-order-now",
                                            title: "What to Lock for Holiday Before the Window Closes",
                                            dek: "The three June decisions every US brand has to lock now.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/us-plus-one-sourcing-playbook-2026",
                                            title: "The US Plus-One Sourcing Playbook",
                                            dek: "Why adding a second country beats moving — and which to add.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/us-fashion-brands-moving-from-china-2026",
                                            title: "Why US Fashion Brands Are Leaving China in 2026",
                                            dek: "The tariff math, the alternatives, and the brands moving first.",
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
