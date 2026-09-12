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

const BLOG_ID = "preparing-for-apparel-trade-shows-2026";

const HERO_IMAGE = "/blog/preparing-for-apparel-trade-shows-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/preparing-for-apparel-trade-shows-2026-section1.jpg";
const MACRO_IMAGE = "/blog/preparing-for-apparel-trade-shows-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/preparing-for-apparel-trade-shows-2026-closing.jpg";

const TOC = [
    { id: "what-buyers-expect", label: "What wholesale buyers expect" },
    { id: "line-sheet", label: "The line sheet and sample set" },
    { id: "capacity", label: "Capacity planning before you sell" },
    { id: "pricing", label: "Wholesale margin vs your DTC price" },
    { id: "why-buyers-pass", label: "Why buyers pass on good lines" },
    { id: "checklist", label: "The pre-show checklist" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function TradeShowReadyClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("what-buyers-expect");
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
        showToast("Pre-show checklist on the way to your inbox.", "success");
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
                    alt="A convention-centre exhibition hall at dawn on set-up day, seen down a long empty aisle — rows of bare white booth frames and unfilled garment rails receding into soft grey light from the roof glazing, the floor where wholesale buyers meet clothing brands. No signage legible, no logos."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">9 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 9, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Trade Shows and Wholesale Buyers in 2026:<br className="hidden lg:block" />{" "}
                        <span className="block lg:inline text-white">Preparing Your Apparel Line for Retail</span>
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Buyers are not judging your collection. They are judging whether you can ship it twice.
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
                            <p className="text-sm text-[#666666]">Covers retail expansion and wholesale for US clothing founders · September 9, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Wholesale order-to-ship time fell from <strong>253 days to 86</strong>. Buyers no longer fund your runway — capacity does.</li>
                            <li>• February&rsquo;s shows are <strong>23 weeks out</strong>. A realistic production run takes 23 weeks. There is no slack in that.</li>
                            <li>• The most common reason a good line gets passed over is <strong>a delivery date the buyer does not believe</strong>.</li>
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
                                        <Link href="/blogs/what-is-a-tech-pack" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Design</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What is a tech pack?</p>
                                        </Link>
                                        <Link href="/blogs/us-apparel-import-tariffs-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Costing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">US apparel import tariffs in 2026</p>
                                        </Link>
                                        <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The real cost of the wrong manufacturer</p>
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
                                The Coterie floor at the Javits Center opened this morning. If you are reading this and you are not on it, that is not your problem.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Your problem is February. Atlanta Apparel runs 2&ndash;5 February 2027 (<a href="https://www.atlanta-apparel.com/Markets/atlanta-apparel" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Atlanta Apparel</a>); MAGIC and PROJECT open in Las Vegas on 16 February (<a href="https://www.magicfashionevents.com/events/magic-las-vegas/event-information/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">MAGIC</a>). From today that is twenty-three weeks. A realistic small collection also takes <Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">twenty-three weeks</Link>, sampling to delivered goods.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Which is the whole argument of this piece. <strong>Preparing for apparel trade shows</strong> is not a marketing exercise that starts in January with a booth deposit and a business-card order. It is a manufacturing decision, and the window on it is open now.
                            </p>

                            {/* H2 1 */}
                            <section id="what-buyers-expect" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What wholesale buyers expect: consistency, MOQ and lead times
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A quiet wholesale showroom in morning window light before an appointment begins — a long chrome rail of plain unbranded garments in stone, ecru, olive and charcoal facing two empty bentwood chairs at a bare wooden table, the room where a clothing brand meets its wholesale buyers. No people, no labels, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Something structural changed in wholesale and most brand-side advice has not caught up with it. The average time from a wholesale order being placed to the product shipping fell from <strong>253 days in 2019 to 86 days in 2024</strong> &mdash; a 66% drop, measured across JOOR&rsquo;s own transaction data (<a href="https://www.joor.com/insights/available-to-sell-digital-tradeshow" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">JOOR</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Read that as a founder rather than an analyst. Buyers used to write nine months out, which meant their order effectively financed your production. Now they write three months out, and an order taken at MAGIC in mid-February is expected on a shop floor around the middle of May.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The same data shows evergreen styles &mdash; <em>the pieces you carry season after season rather than replace</em> &mdash; have climbed to 47% of total sales, up from 37% five years ago. Buyers are hedging against unsold stock by ordering things they can reorder. Which puts a specific question in front of you, and it is not a design question.
                                </p>

                                {/* Teaching graphic 1 */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 400" role="img" aria-label="Bar chart comparing wholesale order-to-ship time against production time. In 2019 the average time from a wholesale order being placed to the product shipping was 253 days. In 2024 it was 86 days, a 66 percent fall. A realistic small production run, sampling to delivered goods, takes about 161 days or 23 weeks — nearly twice the time a buyer now expects to wait." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">The wholesale clock collapsed. The factory clock did not.</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Average days from wholesale order placed to product shipped, per JOOR transaction data</text>

                                        {[0, 70, 140, 210, 280].map((v) => (
                                            <g key={v}>
                                                <line x1={340 + v * 2.071} y1="76" x2={340 + v * 2.071} y2="310" stroke="#E0DCD5" strokeWidth="1" />
                                                <text x={340 + v * 2.071} y="330" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">{v}</text>
                                            </g>
                                        ))}
                                        <text x="630" y="352" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">days</text>

                                        <text x="328" y="120" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Order to ship &mdash; 2019</text>
                                        <rect x="340" y="100" width="524" height="32" fill="#DCCDBA" />
                                        <text x="874" y="121" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">253</text>

                                        <text x="328" y="185" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Order to ship &mdash; 2024</text>
                                        <rect x="340" y="165" width="178" height="32" fill="#CBB49A" />
                                        <text x="528" y="186" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">86</text>

                                        <line x1="0" y1="222" x2="920" y2="222" stroke="#E0DCD5" strokeWidth="1" strokeDasharray="4 4" />

                                        <text x="328" y="258" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">What a run actually takes</text>
                                        <text x="328" y="274" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666" textAnchor="end">sampling to delivered goods</text>
                                        <rect x="340" y="245" width="333" height="32" fill="#8C7355" />
                                        <text x="683" y="266" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">161 &middot; 23 weeks</text>

                                        <line x1="340" y1="310" x2="920" y2="310" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="386" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators &middot; order-to-ship figures from JOOR; production span from our own 23-week timeline</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        The gap is the story. A buyer now waits about 86 days; a collection built from scratch needs roughly 161. You close that gap before the show or you do not close it at all.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The buyer you meet has also changed. Independent boutiques now account for 62% of transaction volume, up from 49% five years ago, and have grown their order volume 27% since 2020 while department stores fell 13% (<a href="https://wwd.com/sourcing-journal/industry-news/digital-first-wholesale-strategies-from-joors-2026-report-1238915864/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">JOOR&rsquo;s 2026 Wholesale Landscape, via Sourcing Journal</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    An independent opens small. A handful of units per style, per size run, spread across three colourways. That is wonderful for your risk and brutal for your minimums &mdash; if your factory will not cut under 300 pieces a colourway, you need six accounts saying yes before you can produce for one. Worth reading our <Link href="/blogs/custom-clothing-manufacturing-cost" className="underline text-[#CBB49A] hover:text-[#b7a078]">breakdown of what unit cost does at each MOQ tier</Link> before you quote anyone.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    And consistency is not a virtue here, it is the product. The buyer is not purchasing the sample in their hand. They are purchasing the two-hundredth one, and the four-hundredth after that, and they need those to measure the same. That promise lives in a document, not in a conversation &mdash; which is what a <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">tech pack</Link> is for.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs you are not ready to take the order</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>&bull; You cannot name a ship date without phoning your factory first</li>
                                        <li>&bull; Your minimum per colourway is larger than three accounts combined would order</li>
                                        <li>&bull; Your best sample was made by someone who will not be sewing the bulk</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 2 */}
                            <section id="line-sheet" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Building a line sheet for buyers and a sample set that reads as retail-ready
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A line sheet is the order document, not the lookbook: one block per style carrying a clean product image, a style number, colourways, size run, fabric and weight, wholesale price, suggested retail, the minimum, and a delivery window. The lookbook sells the world. The line sheet gets signed.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Four things separate one that reads professional from one that reads like a first attempt. Style numbers that never change between seasons. A delivery window with an actual date in it rather than &ldquo;Spring.&rdquo; The size run stated, not implied. And the suggested retail price printed next to the wholesale price &mdash; so the buyer is not doing your margin arithmetic in front of you.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That last one does quiet work. It tells a buyer you understand that they have to make money on this too, which is a different conversation from one where you are hoping they like it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Your sample set has a harder job than it used to. Some 43% of buyers surveyed said they plan to conduct the majority of their appointments virtually, so your images, measurements and specifications carry weight your booth never gets to. But the samples that do get touched must be production-quality, not prototypes. If your sample is finished better than the bulk you can actually ship, you have written a cheque the run will not cash.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The collection gets you the appointment. The lead time gets you the order.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3 */}
                            <section id="capacity" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Production capacity planning before you commit to wholesale orders
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro along the edge of a stack of identically folded plain jersey garments, the same shoulder seam repeating down the pile in perfect registration — the consistency a wholesale buyer is actually purchasing across a production run. Raking side light, visible knit texture, no labels, no printing, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is the arithmetic nobody does before the booth deposit. Twenty-three weeks from now is MAGIC. If you are starting a collection from a blank sketchbook, you arrive on the show floor with the goods finishing, not with goods to sell into a February order.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Now the honest version, because most brands reading this are not starting from blank. You have DTC traction, which means patterns exist, tech packs exist, fits are signed off. Your real runway is the production and freight leg &mdash; roughly twelve of those twenty-three weeks &mdash; and that changes everything about what is achievable.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It does not make you free. Your show sample set is a separate build competing for the same factory hours as your DTC restocks, and the wholesale order that follows lands on the same calendar again. Three demands, one production line. Brands discover this in March.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So reserve the capacity rather than assuming it. Tell your manufacturer in October what February might bring, in units and in weeks, and ask them to hold a window. A factory that cannot answer that question is a factory you will be apologising for in May &mdash; which is the expensive version of <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="underline text-[#CBB49A] hover:text-[#b7a078]">picking the wrong manufacturer</Link>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    If your minimums are the binding constraint rather than your calendar, the route is usually a different production model, not a different factory. Our comparison of <Link href="/blogs/private-label-vs-custom-clothing-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">private label against fully custom manufacturing</Link> lays out which one survives small opening orders, and <Link href="/blogs/no-moq-clothing-manufacturers" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a &ldquo;no MOQ&rdquo; promise actually costs per unit</Link>.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The 23-Week Pre-Show Production Checklist</h4>
                                        <p className="text-[#4A484A] leading-snug">One page, counted back from 16 February 2027: when to lock the range, when to book factory capacity, when samples must be sewn, when the line sheet has to be finished, and the last date an order taken on the floor can still ship on time. PDF.</p>
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
                                <p className="mt-4 text-sm text-[#666666] leading-snug">
                                    Would rather talk it through than read it?{" "}
                                    <button onClick={() => setContactOpen(true)} className="underline text-[#CBB49A] hover:text-[#b7a078] font-medium">Send us your show date and style count</button>{" "}
                                    and we will tell you what is buildable in the time left.
                                </p>
                            </div>

                            {/* H2 4 */}
                            <section id="pricing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Wholesale margin vs your DTC pricing: the two-number problem
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Retail convention is that a store roughly doubles what it pays to reach the price on the tag. That single habit is what turns wholesale pricing into a trap for brands that grew up selling direct, because it works backwards from a number you do not control.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Work an actual garment. A cotton tee at $14 FOB <em>(the price at the exporting port, before freight)</em> carries $3.71 of duty at the 26.5% all-in rate now applying to most Asian origins &mdash; the full lane-by-lane picture is in our <Link href="/blogs/us-apparel-import-tariffs-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">2026 tariff breakdown</Link>. Add about a dollar of freight and handling and it lands at $18.70.
                                </p>

                                {/* Teaching graphic 2 */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 400" role="img" aria-label="Bar chart of one cotton T-shirt priced four ways. Landed cost 18 dollars 70, being 14 dollars FOB plus 3 dollars 71 duty at 26.5 percent plus about 1 dollar freight. Wholesale price 28 dollars, leaving the brand 9 dollars 30 or 33 percent. The brand's current direct-to-consumer price 38 dollars, leaving 19 dollars 30 or 51 percent. The retail price implied by doubling wholesale, 56 dollars. The direct price sits 18 dollars below the shelf price of the store that stocks it." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">One tee, four prices &mdash; and the gap that loses the account</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">$14 FOB &middot; 26.5% duty &middot; ~$1 freight &middot; retail taken as roughly double wholesale</text>

                                        {[0, 15, 30, 45, 60].map((v) => (
                                            <g key={v}>
                                                <line x1={300 + v * 10} y1="72" x2={300 + v * 10} y2="318" stroke="#E0DCD5" strokeWidth="1" />
                                                <text x={300 + v * 10} y="338" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">${v}</text>
                                            </g>
                                        ))}

                                        <text x="288" y="117" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Landed cost</text>
                                        <rect x="300" y="95" width="187" height="34" fill="#8C7355" />
                                        <text x="497" y="117" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$18.70</text>

                                        <text x="288" y="177" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Wholesale price</text>
                                        <rect x="300" y="155" width="280" height="34" fill="#B99C79" />
                                        <text x="590" y="177" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$28.00 &middot; you keep $9.30 (33%)</text>

                                        <text x="288" y="237" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Your DTC price today</text>
                                        <rect x="300" y="215" width="380" height="34" fill="#CBB49A" />
                                        <text x="690" y="237" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$38.00 &middot; you keep $19.30 (51%)</text>

                                        <text x="288" y="297" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Retail price this implies</text>
                                        <rect x="300" y="275" width="560" height="34" fill="#DCCDBA" />
                                        <text x="870" y="297" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$56.00</text>

                                        <line x1="680" y1="215" x2="680" y2="275" stroke="#8C7355" strokeWidth="1" strokeDasharray="3 3" />
                                        <line x1="860" y1="275" x2="860" y2="309" stroke="#8C7355" strokeWidth="1" strokeDasharray="3 3" />
                                        <text x="770" y="268" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#8C7355" textAnchor="middle">$18 below the shelf</text>

                                        <line x1="300" y1="318" x2="900" y2="318" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="382" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators &middot; worked example, one style &mdash; duty rate per the tariff schedule in force from 24 July 2026</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        The same garment earns you $9.30 through a store and $19.30 through your own site. That is not an argument against wholesale &mdash; it is the reason the two prices have to be designed together.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Look at the bottom two bars. A store that buys at $28 puts the tee on the floor at $56, while your own site is still selling it at $38. You have just handed a retailer a product their customer can buy $18 cheaper by typing your name into a search bar.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    There are only three honest exits. Raise your direct price toward the implied retail. Give wholesale a distinct assortment that does not sit on your own site. Or accept the thinner margin and treat the store as paid distribution &mdash; a defensible choice, as long as you have made it deliberately rather than discovered it in month four.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Price pressure is real and getting worse: 35% of brands now cite lower price points as critical to winning retail partnerships, up from 25% three years ago. So is the other side of the ledger &mdash; 49% of brands say they now prioritise a retailer&rsquo;s ability to pay on time. Terms are part of your price. Net 60 means you are financing the run for two months after it ships.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;If your own site undercuts the store that stocks you, you have not expanded. You have competed.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 5 */}
                            <section id="why-buyers-pass" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why buyers pass on collections they actually like
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Almost never taste. Three things do most of the damage, and all three are manufacturing problems wearing commercial clothing.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Fit.</strong> American shoppers returned $849.9 billion of merchandise in 2025 &mdash; 15.8% of annual retail sales, and 19.3% of everything bought online (<a href="https://nrf.com/media-center/press-releases/consumers-expected-to-return-nearly-850-billion-in-merchandise-in-2025" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">NRF and Happy Returns</a>). A buyer carries that cost. If your size 12 fits like a 10 because the grading was guessed rather than <Link href="/blogs/grading-vs-pattern-making-perfect-fit" className="underline text-[#CBB49A] hover:text-[#b7a078]">properly drafted from the base pattern</Link>, they mark down the sizes that fail and quietly do not reorder.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Floor-readiness.</strong> Goods that turn up without polybags, hangtags or scannable barcodes cost the store labour it did not budget for. A buyer will not raise this at the booth. They will simply choose the brand whose cartons open onto a shop floor.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Timelines.</strong> Retail buys to a floor-set date. Miss the window and the order is not late, it is cancelled &mdash; the shelf has already gone to whoever did deliver.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One concession, and it matters: sometimes a pass has nothing to do with you. They bought the category last week, the budget is committed, the shop is three-deep in cotton tees. That is a timing loss, not a verdict, and the brands that end up stocked are the ones who send the line sheet again in June without being asked.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Worth saying plainly too: wholesale is not automatically the right next move. On the numbers above, a brand with genuinely strong direct margin can take an order, deliver it perfectly, and still make less money than it did before. <strong>Retail expansion for fashion startups</strong> buys reach, credibility and a customer you could not have found alone. It does not buy margin, and any advice that suggests otherwise is selling something.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs you will get passed over</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>&bull; Your size run was graded by scaling one pattern up and down by eye</li>
                                        <li>&bull; Nobody has priced the polybag, hangtag and barcode into the unit cost</li>
                                        <li>&bull; Your delivery window is a season, not a date you would put in writing</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 6 */}
                            <section id="checklist" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    A pre-trade-show production checklist, counted back from February
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A single plain unbranded heavyweight cotton overshirt on a matte black tailor's form against a near-black ground, lit by one hard directional light that carves out the placket, chest pocket and shoulder seam — the production-quality sample a wholesale buyer will handle at a trade show. No lettering, no labels, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Dates below are counted back from 16 February 2027. Move them if your show is Atlanta on 2 February, or Atlanta&rsquo;s October market on the 6th if you want a lower-stakes first outing before the big rooms.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
                                    <ol className="space-y-4 text-[#2D2A2E] leading-snug list-none">
                                        <li><span className="font-bold text-[#CBB49A]">Now &mdash; September.</span> Lock the range. Decide which styles are evergreen and reorderable, and cut anything you could not produce again in twelve weeks.</li>
                                        <li><span className="font-bold text-[#CBB49A]">October.</span> Book factory capacity for a February order in writing, in units and weeks. Confirm minimums per style and per colourway.</li>
                                        <li><span className="font-bold text-[#CBB49A]">October.</span> Finish tech packs and graded size specs for every style going on the rail. Fit sessions happen here or they happen in front of a buyer.</li>
                                        <li><span className="font-bold text-[#CBB49A]">November.</span> Sew the show samples at production quality, from bulk fabric &mdash; not from whatever the sample room had left.</li>
                                        <li><span className="font-bold text-[#CBB49A]">December.</span> Build the line sheet: landed cost, wholesale, suggested retail, minimums, delivery window with a date. Set your terms and your account tiers.</li>
                                        <li><span className="font-bold text-[#CBB49A]">January.</span> Price-check your own site against the retail your wholesale implies. Fix the gap before a buyer finds it.</li>
                                        <li><span className="font-bold text-[#CBB49A]">February.</span> Walk in able to answer one question without hesitating: <em>when can you ship, and can you do it again in ninety days?</em></li>
                                    </ol>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of this is about the booth. Every item on that list is a manufacturing commitment made months before anyone sees the collection, which is exactly why <strong>trade show ready apparel manufacturing</strong> is decided in October and merely revealed in February.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Krazy Kreators builds to this calendar with founders every season &mdash; the sampling, the graded specs, the capacity booked before it is needed. If you are aiming at a February room, the honest question is not whether the collection is ready. It is whether your factory could take the order twice. Which of those two are you less sure about?
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-7">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">When should I start preparing for apparel trade shows?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Count back from the show, not forward from today. Atlanta Apparel runs 2&ndash;5 February 2027 and MAGIC and PROJECT open in Las Vegas on 16 February 2027 &mdash; about 23 weeks from early September, which is what a realistic small collection takes from sampling to delivered goods. If you already sell direct and your patterns and tech packs exist, your real runway is the 12-week production and freight leg, but the show sample set is a separate build competing for the same factory time. Book capacity before you book the booth.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What do wholesale buyers expect from a clothing brand?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Three things, in this order: consistency, a delivery date, and a price that leaves them margin. Consistency means unit 200 measures the same as the sample they touched. A delivery date means a window with a date in it, not a season. Margin means a wholesale price a store can roughly double to reach a shelf price its customers will pay. The collection gets you the appointment; those three answers get you the order.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What goes on a line sheet for buyers?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">One block per style: a clean product image, a style number that never changes, colourways, size run, fabric and weight, wholesale price, suggested retail price, the minimum per style or colourway, and a delivery window with a date. Printing the suggested retail matters &mdash; it saves the buyer doing your margin arithmetic in front of you, and it signals you understand how their business works.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How much lead time do wholesale buyers give you now?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Far less than they used to. JOOR&rsquo;s transaction data shows the average time from a wholesale order being placed to the product shipping fell from 253 days in 2019 to 86 days in 2024, a 66% drop. An order written at a February show is expected on the retail floor around mid-May. That collapse is why production capacity, rather than collection design, now decides whether you can accept the order in front of you.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How do I price for wholesale without breaking my DTC pricing?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Work from landed cost up, then check the retail price it implies against what you already charge on your own site. Retail convention is roughly a doubling from wholesale to shelf, so a garment landing at $18.70 and selling wholesale at $28 implies $56 at retail. If your own site sells it at $38, you are undercutting the store that just stocked you by $18. Fix that before the show &mdash; raise the direct price, or give wholesale a distinct assortment.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Why do buyers pass on collections they like?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Usually fit, timelines or floor-readiness rather than taste. Inconsistent grading means the store marks down the sizes that fit wrong and does not reorder. A missed delivery window is a cancelled order, because retail buys to a floor-set date. Goods arriving without polybags, hangtags and barcodes cost the buyer labour they did not budget. And sometimes it is none of those &mdash; they simply bought the category last week. Follow up anyway.</p>
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
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">From Sketch to Store: A Real Production Timeline</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The 23 weeks underneath this post, broken into phases &mdash; and the three versions of it, depending on whether you are fast, realistic, or doing this for the first time.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">See the week-by-week <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Send us your show date and we will work the calendar back</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Your show, your style count, and where you are now &mdash; sketches, samples, or already selling. A Krazy Kreators production lead sends back what is genuinely buildable in the weeks left, and what the first reorder would take.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Get your countback <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/custom-clothing-manufacturing-cost",
                                            title: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
                                            dek: "What your unit cost really does as the order size moves.",
                                            read: "10 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "The document that makes unit 200 match the sample.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/how-to-start-a-clothing-brand-2026",
                                            title: "How to Start a Clothing Brand in 2026",
                                            dek: "The groundwork underneath any retail expansion plan.",
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
                        Send your show date &mdash; we&rsquo;ll work the calendar back <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
