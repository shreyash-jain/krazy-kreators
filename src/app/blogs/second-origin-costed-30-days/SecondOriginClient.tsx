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

const BLOG_ID = "second-origin-costed-30-days";

const HERO_IMAGE = "/blog/second-origin-costed-30-days-hero.jpg";
const FLOOR_IMAGE = "/blog/second-origin-costed-30-days-section1.jpg";
const SPRINT_IMAGE = "/blog/second-origin-costed-30-days-teaching.jpg";
const MACRO_IMAGE = "/blog/second-origin-costed-30-days-macro.jpg";
const CLOSING_IMAGE = "/blog/second-origin-costed-30-days-closing.jpg";

const TOC = [
    { id: "single-point", label: "One origin is a single point of failure" },
    { id: "what-it-is", label: "What a “costed second origin” actually is" },
    { id: "thirty-day-sprint", label: "The 30-day sprint: parallel, not relay" },
    { id: "sampling", label: "Sampling: two to three rounds, decided upstream" },
    { id: "moq-leadtime", label: "MOQ and lead-time, negotiated honestly" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
    { id: "bottom-line", label: "The bottom line" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function SecondOriginClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("single-point");
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
                    alt="A single unbranded heavyweight cotton crew tee on a matte grey dress form, one hard directional side light raking across the shoulder seam, deep falloff into shadow. No tags, no logos, no text."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">8 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">July 23, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        A Second Origin,<br className="hidden sm:block" /> Costed in 30 Days
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        One tariff ruling shouldn&apos;t reprice your whole buy. Here&apos;s how to stand up a sampled, MOQ-cleared alternate origin — in a month, not a quarter.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · July 23, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• A second origin isn&apos;t a whole-line move — it&apos;s a <strong>costed, sampled, MOQ-cleared backup</strong> for your highest-exposure styles, ready to take a real PO.</li>
                            <li>• You can stand one up for your <strong>top 3 styles in 30 days</strong> — if sampling, MOQ and lead-time run <strong>in parallel</strong>, not as a relay.</li>
                            <li>• The comparison isn&apos;t &ldquo;second origin vs. today&apos;s cost.&rdquo; It&apos;s &ldquo;second origin vs. what today&apos;s origin costs the day a ruling hits.&rdquo;</li>
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
                                        <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The US-Plus-One sourcing playbook for 2026</p>
                                        </Link>
                                        <Link href="/blogs/why-fashion-brands-moving-manufacturing-to-india" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Why fashion brands are moving manufacturing to India</p>
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
                                The founders who stayed calm through the last three tariff shocks weren&apos;t the ones sourcing from the cheapest country. They were the ones who already knew, to the cent, what their top styles cost somewhere else.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                That&apos;s the whole idea behind a &ldquo;plus-one&rdquo; origin: a second, proven place to make your product, held in reserve so a single ruling can&apos;t reprice your entire buy. The strategy has a name and a case — we made it in <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the US-Plus-One sourcing playbook</Link>.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                This is the execution. How you actually stand a second origin up — costed, sampled, and ready to take a PO — in about 30 days rather than a season. The realities that decide whether you make it: sampling rounds, MOQ, and lead time.
                            </p>

                            {/* H2 1 */}
                            <section id="single-point" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    One origin is a single point of failure
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={FLOOR_IMAGE}
                                        alt="A wide documentary shot of a bright modern Indian garment sampling floor at golden hour, low raking sunlight through tall windows, layered depth from soft fabric rolls in the foreground to a sharp cutting table, workers seen only as backs and hands. No logos, no faces."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Concentrate your production in one country and you&apos;ve tied your cost sheet to that country&apos;s trade politics. A tariff action, a forced-labor ruling, a port disruption — any one of them reprices goods you&apos;ve already designed and can&apos;t easily move. The exposure isn&apos;t theoretical: US apparel imports have been shifting origin steadily as brands hedge exactly this risk (<a href="https://www.trade.gov/otexa" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">OTEXA</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Put a number on it. A fleece hoodie at <strong>$16 FOB</strong> <em>(free on board — the supplier&apos;s price at the origin port, before freight and duty)</em>, and a single <strong>Section 301</strong> action <em>(a US trade investigation that can add duties by country)</em> lands 12.5 points of new duty on your origin. That&apos;s about <strong>$2 a unit</strong> — roughly <strong>$8,000</strong> appearing overnight on a 4,000-piece buy, on one style.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    There are <a href="https://ustr.gov/issue-areas/enforcement/section-301-investigations" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">multiple Section 301 investigations</a> open at any given time, which is why supply-chain diversification has moved from prudent to standard practice (<a href="https://www.mckinsey.com/industries/retail/our-insights/state-of-fashion" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">McKinsey, State of Fashion</a>). A second origin is how you cap that exposure before it lands.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A second origin isn&apos;t a hedge you buy once and forget. It&apos;s a line you can turn on the week a ruling reprices your primary buy.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="what-it-is" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What a &ldquo;costed second origin&rdquo; actually is
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It is a fully costed, sample-approved production line in a country other than your primary one — ready to take a real order, not just a quote on paper. The point isn&apos;t to move your whole buy. It&apos;s to hold a proven backup for the styles that carry the most revenue and the most risk.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That word <em>proven</em> is the whole job. A price emailed by a factory you&apos;ve never sampled with is not a second origin — it&apos;s a hope. A second origin means an approved fit sample, a landed cost you trust, an MOQ you can live with, and a lead time you&apos;ve confirmed. India has become the default second slot for many US brands for exactly these reasons — <Link href="/blogs/why-fashion-brands-moving-manufacturing-to-india" className="underline text-[#CBB49A] hover:text-[#b7a078]">capability depth across the full stack, at workable minimums</Link>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One honest counterpoint: a second origin isn&apos;t free, and it isn&apos;t for everyone. If you run a single hero style at low volume, or your primary origin is already low-risk or domestic, the sampling and management overhead may not pay for itself. The move earns its keep when you have real tariff exposure across a few high-revenue styles — not as a reflex for every line.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">A second origin is real only when it has all four</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• An <strong>approved sample</strong> — fit and construction signed off, not just quoted.</li>
                                        <li>• A <strong>landed cost</strong> you trust — duty, freight and fees in, not FOB alone.</li>
                                        <li>• An <strong>MOQ</strong> you can absorb on the styles you&apos;d actually shift.</li>
                                        <li>• A <strong>lead time</strong> you&apos;ve confirmed against a real production calendar.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 3 */}
                            <section id="thirty-day-sprint" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The 30-day sprint: parallel, not relay
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SPRINT_IMAGE}
                                        alt="A clean editorial infographic titled 'The 30-Day Second-Origin Sprint,' scope top 3 styles, showing three parallel horizontal tracks over a Day 1 to Day 30 axis — Sampling (2 to 3 rounds), MOQ and pricing, and Lead-time and compliance — with Day 1 marked 'Tech-pack handoff' and Day 30 marked 'Costed, PO-ready.' Warm neutral palette, one accent color, flat vector data-viz."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Thirty days is enough — but only if the workstreams run at the same time. The mistake that blows the timeline is treating sampling, MOQ negotiation and lead-time validation as a relay, where each waits for the last to finish. Run them as three parallel tracks over the same month.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Scope it first: your top 3 styles.</strong> The three that pair the highest revenue with the thinnest margin — where a tariff swing does the most damage. Prove the model there before you extend it across the range.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3"><strong>The three tracks, Day 1 to Day 30:</strong></p>
                                <ul className="space-y-1.5 text-[#2D2A2E] leading-snug mb-4 list-disc pl-5">
                                    <li><strong>Track A — Sampling:</strong> tech-pack handoff on Day 1, then 2–3 rounds (proto → fit → approval).</li>
                                    <li><strong>Track B — MOQ &amp; pricing:</strong> negotiated in parallel, not after the sample lands.</li>
                                    <li><strong>Track C — Lead-time &amp; compliance:</strong> capacity, social-compliance and origin docs validated to close it out.</li>
                                </ul>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Day 1 is a clean tech-pack handoff; Day 30 is a costed, PO-ready line. What makes it fit in a month isn&apos;t a faster factory — it&apos;s refusing to let the three tracks queue behind each other.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The 30 days aren&apos;t won on the sewing floor. They&apos;re won by starting sampling, pricing and lead-time on the same morning.&rdquo;
                                </blockquote>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The 30-Day Second-Origin Sprint Checklist</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page plan that runs the three parallel tracks — sampling rounds, MOQ &amp; pricing, lead-time &amp; compliance — with the Day-1 tech-pack handoff and the Day-30 PO-ready gate laid out for your top 3 styles. PDF.</p>
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

                            {/* H2 4 */}
                            <section id="sampling" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Sampling: two to three rounds, decided upstream
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="An extreme macro close-up of a crisp double-needle seam on unbranded heavyweight cotton, individual stitches and weave texture razor-sharp, the rest falling into shallow bokeh, a blurred metal measuring-tape edge intruding at the frame edge, soft grazing window sidelight. No logos, no paper tags."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Plan for two to three sampling rounds — proto, fit, then approval. A well-documented handoff can land the fit right on the first or second round; a vague one pushes it to four or more and breaks the 30-day math. The quality of your inputs, not the factory&apos;s speed, usually decides this.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That handoff is the <strong>tech pack</strong> <em>(the spec document — measurements, materials, construction, tolerances — a factory builds from)</em>. Hand a new origin a graded, unambiguous tech pack and the first proto comes back close; hand it a sketch and a hope and you&apos;ll spend your month in revision emails. If yours isn&apos;t airtight, fix that before you start the clock — <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="underline text-[#CBB49A] hover:text-[#b7a078]">here&apos;s what a production-ready tech pack contains</Link>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Sample the styles you&apos;d actually shift under pressure, not the easy ones. A knit tee samples fast and tells you little; the hoodie with the tricky panel or the bonded seam is where a new origin&apos;s real capability shows — and where <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="underline text-[#CBB49A] hover:text-[#b7a078]">the wrong factory quietly costs you later</Link>.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="moq-leadtime" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    MOQ and lead-time, negotiated honestly
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>MOQ</strong> <em>(minimum order quantity — the smallest run a factory will take)</em> feels like a wall, but it&apos;s usually a negotiation. It moves when it&apos;s framed as the first tranche of an ongoing relationship rather than a one-off trial — and when you start with a focused style count instead of your whole range.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Lead time is the number brands validate last and regret most. Confirm it against a real production calendar — fabric availability, capacity in your window, and the compliance and origin paperwork a new supplier needs — not a best-case quote. A second origin that can&apos;t deliver inside your season isn&apos;t a backup; it&apos;s a brochure.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    And cost the comparison correctly. A slightly higher steady-state landed cost at the second origin is not a loss — it&apos;s the premium on an option. Measure it against what your primary origin costs the day a ruling hits, the same way you&apos;d <Link href="/blogs/rebuild-landed-cost-august-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">rebuild a landed-cost sheet when duty changes at the dock</Link> — not against today&apos;s undisturbed number.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your &ldquo;second origin&rdquo; is really just a quote</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• You have a price, but no approved fit sample in hand.</li>
                                        <li>• The MOQ was quoted once and never negotiated against a real order.</li>
                                        <li>• Lead time is a best-case number, unchecked against your season.</li>
                                        <li>• Nobody has confirmed the compliance and origin paperwork.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 6 — Closing */}
                            <section id="what-wed-do" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&apos;d do in your shoes
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="Two identical unbranded tees on two matte dress forms in a dim studio — the front form sharply lit by a single warm key light, the second standing behind in soft shadow, two stops darker and gently out of focus, conveying a ready backup. No faces, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    We&apos;d pick the three styles on next season&apos;s PO with the thinnest margin cushion and the most tariff exposure, and start all three tracks on the same morning — tech pack out, MOQ conversation open, lead-time and compliance in validation. We&apos;d aim for an approved sample and a landed cost we trust by Day 30, while the window is open and nobody&apos;s negotiating under a deadline.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    We wouldn&apos;t wait for the ruling that forces the move — that&apos;s when leverage is lowest and lead times are longest. So: what are your three styles, and is there a costed alternate origin sitting behind each one yet?
                                </p>
                            </section>

                            {/* Conclusion */}
                            <section id="bottom-line" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A second origin isn&apos;t a hedge you buy once and forget — it&apos;s a live capability. A costed, sampled, MOQ-cleared line you can turn on the week a ruling reprices your primary buy. Thirty days is enough to build it, but only if sampling, MOQ and lead-time run in parallel rather than in sequence.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Start with the three styles that carry the most revenue and the most exposure. Cost them in a second origin now, while the window is open — so the next ruling meets a plan, not a scramble.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-6 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What does &ldquo;a second origin&rdquo; actually mean for a clothing brand?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">A fully costed, sample-approved production line in a country other than your primary one — ready to take a real PO, not just a quote on paper. The point isn&apos;t to move your whole buy; it&apos;s to hold a proven backup for your highest-exposure styles so a single ruling or disruption can&apos;t reprice your season.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Can you really stand one up in 30 days?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">For your top few styles, yes — if the workstreams run in parallel. Tech-pack handoff and first sampling start on Day 1, MOQ and pricing negotiate alongside, and lead-time and compliance close it out. What blows the timeline is treating sampling, costing and MOQ as a relay instead of a sprint.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How many sampling rounds should I budget for?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Plan for two to three — proto, fit, approval. A well-documented, graded tech pack can land it on the first or second round; vague inputs push it to four or more and break the 30-day math. The quality of your handoff, not the factory&apos;s speed, usually decides this.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Won&apos;t a smaller order at a new origin mean punishing MOQs?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Not necessarily. MOQ is negotiable when it&apos;s framed as the first tranche of an ongoing relationship rather than a one-off trial. Starting with a focused style count — rather than your full range — keeps per-style minimums workable while you validate quality.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Does a second origin mean my landed cost goes up?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Sometimes — and that&apos;s the wrong number to optimize. The comparison isn&apos;t &ldquo;second origin vs. today&apos;s cost,&rdquo; it&apos;s &ldquo;second origin vs. what today&apos;s origin costs the day a ruling hits.&rdquo; A slightly higher steady-state landed cost is cheap insurance against a buy that gets repriced overnight.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Which styles should I cost first?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">The three that pair the highest revenue with the thinnest margin — the ones where a tariff swing does the most damage. Prove the model on those, then decide whether to extend it across the range.</p>
                                    </div>
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The US-Plus-One Sourcing Playbook</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The strategy behind the plus-one move — why a second origin, which countries, and how the diversification math works.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the playbook <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Cost a second origin for your top 3 styles</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Ask Krazy Kreators to cost a second origin for your top 3 styles — sampled, MOQ-cleared and lead-time-confirmed, so one ruling can&apos;t reprice your whole buy.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/us-plus-one-sourcing-playbook-2026",
                                            title: "The US-Plus-One Sourcing Playbook",
                                            dek: "The strategy this piece executes on — why, where, and the math.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/why-fashion-brands-moving-manufacturing-to-india",
                                            title: "Why Fashion Brands Are Moving Manufacturing to India",
                                            dek: "Why India keeps winning the second-origin slot for US brands.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/us-fashion-brands-moving-from-china-2026",
                                            title: "Why US Fashion Brands Are Moving Production From China",
                                            dek: "The exposure a pre-costed plus-one origin is built to cap.",
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
                        Cost a second origin for your top 3 styles <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
