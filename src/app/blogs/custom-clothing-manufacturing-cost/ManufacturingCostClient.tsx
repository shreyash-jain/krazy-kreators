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

const BLOG_ID = "custom-clothing-manufacturing-cost";

const HERO_IMAGE = "/blog/custom-manufacturing-cost-hero.jpg";
const SECTION1_IMAGE = "/blog/custom-manufacturing-cost-section1.jpg";
const GARMENT_IMAGE = "/blog/custom-manufacturing-cost-garment.jpg";
const MACRO_IMAGE = "/blog/custom-manufacturing-cost-macro.jpg";
const CLOSING_IMAGE = "/blog/custom-manufacturing-cost-closing.jpg";

const TOC = [
    { id: "whats-in-the-price", label: "What the price is actually made of" },
    { id: "moq-tiers", label: "Cost per garment at every MOQ tier" },
    { id: "development", label: "The cost that doesn't scale" },
    { id: "fabric", label: "Why fabric beats volume" },
    { id: "landed", label: "The lines the quote leaves out" },
    { id: "reading-a-quote", label: "How to read a quote" },
    { id: "counter", label: "When the bigger run is the wrong call" },
    { id: "the-move", label: "What we'd do in your shoes" },
    { id: "faq", label: "Common questions" },
];

const ACCENT = "#CBB49A";

type Faq = { q: string; a: string };

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
    faqs: Faq[];
};

/* ------------------------------------------------------------------ */
/* Infographic 1 — how one-time development cost spreads across a run */
/* ------------------------------------------------------------------ */
const AMORT_ROWS = [
    { units: "100 units", display: "$9.00", width: 380 },
    { units: "500 units", display: "$1.80", width: 76 },
    { units: "1,000 units", display: "$0.90", width: 38 },
    { units: "5,000 units", display: "$0.18", width: 10 },
];

function AmortizationGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The same $900 of development, spread four ways
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                One-time cost per style — tech pack, patterns, grading, three sample rounds, lab dips — divided by the number of units it is shared across.
            </p>

            <svg
                viewBox="0 0 700 300"
                role="img"
                aria-label="Bar chart: $900 of one-time development cost divided across a production run adds $9.00 per unit at 100 units, $1.80 at 500 units, $0.90 at 1,000 units and $0.18 at 5,000 units."
                className="w-full h-auto"
            >
                <title>Development cost per unit by run size</title>
                {AMORT_ROWS.map((row, i) => {
                    const y = 28 + i * 68;
                    return (
                        <g key={row.units}>
                            <text x="0" y={y + 20} fontSize="17" fontWeight="600" fill="#2D2A2E">
                                {row.units}
                            </text>
                            <rect x="150" y={y} width={row.width} height="30" rx="6" fill={i === 0 ? "#2D2A2E" : ACCENT} />
                            <text
                                x={150 + row.width + 12}
                                y={y + 21}
                                fontSize="18"
                                fontWeight="800"
                                fill={i === 0 ? "#2D2A2E" : "#8C7A5E"}
                            >
                                {row.display}
                            </text>
                            <text x="150" y={y + 50} fontSize="13" fill="#666666">
                                added to every single garment
                            </text>
                        </g>
                    );
                })}
            </svg>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Development is a fixed cost. It does not get cheaper when you order more — it just gets divided by a
                bigger number. That, far more than any factory discount, is what makes small runs expensive per unit.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 — the landed-cost stack on a single 1,000-unit tee    */
/* ------------------------------------------------------------------ */
const STACK = [
    { label: "Factory price (FOB)", amount: "$8.50", x: 40, w: 455, fill: "#2D2A2E" },
    { label: "Ocean freight + drayage", amount: "$0.60", x: 495, w: 32, fill: ACCENT },
    { label: "US duty @ 16.5%", amount: "$1.40", x: 527, w: 75, fill: "#8C7A5E" },
    { label: "MPF + HMF", amount: "$0.04", x: 602, w: 2, fill: "#B9A88C" },
    { label: "Customs brokerage", amount: "$0.15", x: 604, w: 8, fill: "#D8CBB6" },
    { label: "Development, spread out", amount: "$0.90", x: 612, w: 48, fill: "#6E6357" },
];

function LandedCostGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                One tee, quoted at $8.50, landed at $11.59
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                A 180 GSM cotton crew tee on a 1,000-unit run, shipped by sea and cleared into the US.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 130"
                    role="img"
                    aria-label="Stacked bar: a tee quoted at $8.50 FOB adds $0.60 freight, $1.40 duty, $0.04 in CBP fees, $0.15 brokerage and $0.90 of spread-out development, reaching $11.59 landed."
                    className="w-full h-auto min-w-[520px]"
                >
                    <title>Landed-cost stack for a 1,000-unit cotton tee</title>
                    {STACK.map((seg) => (
                        <rect key={seg.label} x={seg.x} y="30" width={seg.w} height="46" fill={seg.fill} />
                    ))}
                    <rect x="40" y="30" width="620" height="46" rx="6" fill="none" stroke="#E3DED5" strokeWidth="1" />
                    <text x="52" y="60" fontSize="18" fontWeight="700" fill="#FFFFFF">
                        $8.50 factory price
                    </text>
                    <text x="40" y="102" fontSize="13" fill="#666666">
                        $0.00
                    </text>
                    <text x="600" y="102" fontSize="15" fontWeight="800" fill="#2D2A2E">
                        $11.59
                    </text>
                    <text x="40" y="20" fontSize="13" fill="#666666">
                        73% of the real number is the part the factory quotes you
                    </text>
                </svg>
            </div>

            <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                {STACK.map((seg) => (
                    <li key={seg.label} className="flex items-center justify-between gap-3 text-sm text-[#2D2A2E]">
                        <span className="flex items-center gap-2 min-w-0">
                            <span
                                aria-hidden
                                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: seg.fill }}
                            />
                            <span className="truncate">{seg.label}</span>
                        </span>
                        <span className="font-bold tabular-nums">{seg.amount}</span>
                    </li>
                ))}
                <li className="flex items-center justify-between gap-3 text-sm text-[#2D2A2E] sm:col-span-2 border-t border-gray-200 pt-2 mt-1">
                    <span className="font-bold uppercase tracking-wider text-xs text-[#8C7A5E]">Landed cost per unit</span>
                    <span className="font-extrabold tabular-nums text-base">$11.59</span>
                </li>
            </ul>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Figures are worked from published rates: 16.5% duty on cotton knit tees, a 0.3464% merchandise
                processing fee and a 0.125% harbor maintenance fee. Brokerage is a flat entry fee spread over the run.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */

export default function ManufacturingCostClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("whats-in-the-price");
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
        showToast("Cost sheet on the way to your inbox.", "success");
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
                    alt="A costing desk at a garment studio in late-afternoon light: a printed cost sheet with a calculator resting on it, a folded unbranded cotton tee just behind, a pencil mid-annotation. Warm raking window light, shallow depth of field, no faces and no logos."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">10 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 7, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Custom Clothing Manufacturing Cost<br className="hidden sm:block" /> at Every MOQ Tier
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Fabric, sampling and finishing move your number more than order size does. Here is what each line really costs — and what the quote leaves out.
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
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk · August 7, 2026</p>
                        </div>
                    </div>

                    {/* Key takeaways */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Key takeaways</p>
                        <ul className="space-y-2 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• A garment price is five lines — fabric, trims, cut-make, finishing, and the factory&rsquo;s own costs. <strong>Fabric is usually the biggest</strong>, about a third of the total.</li>
                            <li>• Price drops with quantity because fixed costs get shared: roughly <strong>$14&ndash;22</strong> a tee at 50&ndash;150 units, <strong>$5&ndash;7</strong> at 5,000. Past 1,000 the curve flattens.</li>
                            <li>• One-time development (<strong>$500&ndash;1,500</strong> a style) never scales. It adds <strong>$9.00</strong> to every garment at 100 units and <strong>18 cents</strong> at 5,000.</li>
                            <li>• Fabric moves the price more than order size does. A 180&rarr;240 GSM organic upgrade adds <strong>$3.22</strong> a unit; a five-times bigger run only saves <strong>$2.50</strong>.</li>
                            <li>• An <strong>$8.50</strong> factory quote lands at <strong>$11.59</strong> once freight, 16.5% duty, CBP fees and brokerage are counted — the quote is <strong>73%</strong> of the real number.</li>
                            <li>• Before you know the product sells, compare <strong>total cash at risk</strong>, not cost per unit: $30,900 against $6,400.</li>
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
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What is a tech pack, and why you can&rsquo;t manufacture without one</p>
                                        </Link>
                                        <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Fabric</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Understanding GSM: choosing the right fabric weight</p>
                                        </Link>
                                        <Link href="/blogs/private-label-vs-custom-manufacturing" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Private label vs. custom manufacturing: which fits your brand?</p>
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
                                Ask three factories what a custom cotton tee costs. You will get three numbers that look nothing alike. None of them is lying.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                They are quoting different things. One is pricing the sewing only. One is pricing sewing plus fabric. One is pricing everything up to a packed box at the port — and quietly assuming an order size you never agreed to.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                So the useful question is not &ldquo;what does it cost.&rdquo; It is <em>what is in this number, and what lands on me later?</em> Custom clothing manufacturing cost comes down to five parts, plus a few more you pay after the goods leave the factory. Here is each one, priced at four order sizes. Every figure below is a worked example — swap in your own numbers and it still works.
                            </p>

                            {/* H2 1 */}
                            <section id="whats-in-the-price" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What the price is actually made of
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A garment costing table mid-review, seen from above and to one side: seven or eight printed cost sheets spread and overlapping across a wooden desk, coffee rings on two of them, a swatch card of plain cloth folded open at the left edge, an unfinished calico garment piece bundled at the far corner, and a worn wooden chair pulled back and empty. Cool daylight from a window onto a brick wall. Nobody in frame, no logos, no legible text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Custom manufacturing means the garment is built to your pattern and your spec. It is not pulled off a factory&rsquo;s existing block. Know that difference before you compare two quotes, because it is usually why the numbers sit so far apart. We covered the trade-off in detail in <Link href="/blogs/private-label-vs-custom-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">private label vs. custom manufacturing</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Almost every custom garment price is five lines. Fabric. Trims. Cut-make. Finishing. And the factory&rsquo;s own running costs and profit. On a plain 180 GSM cotton crew tee at 1,000 units, a typical split looks like this:
                                </p>

                                <div className="not-prose overflow-x-auto mb-6 rounded-2xl border border-gray-200">
                                    <table className="w-full text-left text-sm sm:text-base">
                                        <thead className="bg-[#2D2A2E] text-white">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">Cost line</th>
                                                <th className="px-4 py-3 font-semibold">What it covers</th>
                                                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Per unit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Fabric</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Knitted, dyed and finished cloth, plus cutting waste</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E]">$2.95</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Trims</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Neck label, care label, thread, hangtag, polybag</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E]">$0.55</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Cut-make</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Cutting, sewing labor, machine time</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E]">$2.20</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Finishing &amp; QC</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Pressing, thread-trim, inspection, folding, packing</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E]">$0.45</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Overhead &amp; margin</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Factory floor cost, admin, the factory&rsquo;s profit</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E]">$1.35</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="px-4 py-3 font-extrabold text-[#2D2A2E]" colSpan={2}>FOB price <span className="font-normal text-[#666666]">(free on board — goods loaded at the origin port)</span></td>
                                                <td className="px-4 py-3 text-right font-extrabold tabular-nums text-[#2D2A2E]">$8.50</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two things stand out. Fabric is the biggest single line, about a third of the price. And the quote stops at the port. Everything between that port and your warehouse is still yours to pay.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The useful question isn&rsquo;t what it costs. It&rsquo;s which lines are in this number, and which ones land on me later.&rdquo;
                                </blockquote>

                            </section>

                            {/* H2 2 */}
                            <section id="moq-tiers" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Cost per garment at every MOQ tier
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>MOQ</strong> <em>(minimum order quantity — the smallest run a factory will take)</em> is the first thing most founders try to change. It does move the price. Just not for the reason people think. Price drops with quantity because the fixed costs get shared out, not because the sewing gets faster.
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="A single unbranded cotton crew tee on an invisible mannequin form, turned three-quarters, one hard directional light from camera left carving the shoulder seam and neck rib out of a deep shadow background. No print, no label, no face."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Here is the same tee at four order sizes. Treat these as ranges, not a price list. Your own quote will move with the fabric, how the garment is built, any printing, and where it is made.
                                </p>

                                <div className="not-prose overflow-x-auto mb-6 rounded-2xl border border-gray-200">
                                    <table className="w-full text-left text-sm sm:text-base">
                                        <thead className="bg-[#2D2A2E] text-white">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold whitespace-nowrap">Tier</th>
                                                <th className="px-4 py-3 font-semibold whitespace-nowrap">FOB per unit</th>
                                                <th className="px-4 py-3 font-semibold">What you are really buying</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E] whitespace-nowrap">50&ndash;150<br /><span className="text-xs font-normal text-[#666666]">Test run</span></td>
                                                <td className="px-4 py-3 font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">$14&ndash;22</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Proof that the garment sells. Fabric is bought at or near dye-lot minimums, so you pay a surcharge or over-buy cloth.</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E] whitespace-nowrap">300&ndash;500<br /><span className="text-xs font-normal text-[#666666]">First real drop</span></td>
                                                <td className="px-4 py-3 font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">$9&ndash;13</td>
                                                <td className="px-4 py-3 text-[#4A484A]">A full size run with enough of each size to actually sell. The first tier where a normal dye lot works for you rather than against you.</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E] whitespace-nowrap">1,000&ndash;2,500<br /><span className="text-xs font-normal text-[#666666]">Repeat program</span></td>
                                                <td className="px-4 py-3 font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">$6.50&ndash;9</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Real unit economics. Setup and paperwork costs stop skewing the price, and the factory can plan its line around you.</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E] whitespace-nowrap">5,000+<br /><span className="text-xs font-normal text-[#666666]">Volume</span></td>
                                                <td className="px-4 py-3 font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">$5&ndash;7</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Fabric straight from the mill and a line of your own. Past this point the savings flatten out — most of the drop has already happened.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Notice where the curve bends. Going from 150 to 500 units roughly halves the price per tee. Going from 1,000 to 5,000 saves about $2.50. The first jump changes the business. The second only tunes it. That shape matters when you are deciding how big a bet to place on your first order.
                                </p>

                            </section>

                            {/* H2 3 */}
                            <section id="development" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The cost that doesn&rsquo;t scale
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Before a factory sews a single sellable unit, someone has to turn your idea into instructions a machine operator can follow. That work is billed separately. It happens once per style. And it is the line most first-time founders forget to budget for.
                                </p>

                                <div className="not-prose overflow-x-auto mb-6 rounded-2xl border border-gray-200">
                                    <table className="w-full text-left text-sm sm:text-base">
                                        <thead className="bg-[#2D2A2E] text-white">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">One-time development</th>
                                                <th className="px-4 py-3 font-semibold">Why it exists</th>
                                                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Typical range</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Tech pack</td>
                                                <td className="px-4 py-3 text-[#4A484A]">The spec document a factory quotes and builds from</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">$150&ndash;600</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Pattern + grading</td>
                                                <td className="px-4 py-3 text-[#4A484A]">The base pattern, then scaling it across your size run</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">$100&ndash;350</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Samples &times; 3 rounds</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Proto, fit, then the sealed pre-production sample</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">$200&ndash;450</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Lab dips &amp; strike-offs</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Color and print approvals before bulk dyeing starts</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E] whitespace-nowrap">$50&ndash;160</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="px-4 py-3 font-extrabold text-[#2D2A2E]" colSpan={2}>Development per style, before a single unit exists</td>
                                                <td className="px-4 py-3 text-right font-extrabold tabular-nums text-[#2D2A2E] whitespace-nowrap">$500&ndash;1,500</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Call it $900 for a simple style. That $900 is the same whether you make 100 pieces or 5,000. This is where the real MOQ math lives.
                                </p>

                                <AmortizationGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A thin tech pack is the most expensive way to save $400. Every unclear detail turns into another sample round, and each extra round costs money and about ten to fourteen days. Two rounds you could have avoided cost more than the document you skipped — which is the argument we made in <Link href="/blogs/what-is-a-tech-pack-why-you-need-it" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a tech pack actually is</Link>.
                                </p>

                            </section>

                            {/* H2 4 */}
                            <section id="fabric" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why fabric beats volume
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme close-up of a cutting-table lay: forty plies of pale cotton jersey stacked and squared, a printed marker sheet pinned across the top with pattern outlines nested edge to edge, one chalked notch in sharp focus. Low raking light rakes the layered edges. No hands, no logos, no readable text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fabric is sold by weight, so two things set this line: what the cloth costs per kilo, and how many kilos your garment uses. <strong>GSM</strong> <em>(grams per square metre — how heavy the cloth is)</em> decides the second one. A heavier tee uses the same area of cloth; that cloth just weighs more.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Raw cotton sets the floor under all of it. The <a href="https://www.cotlook.com/prices/cotlook-a-index/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Cotlook A Index</a>, the standard world benchmark for raw cotton, sat at <strong>93.00 US cents per pound on 5 August 2026</strong>. Knitting, dyeing and finishing multiply that several times over before the cloth reaches a cutting table. So ask for the finished-fabric price, not the raw cotton price.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Here is the same tee body in three cloths, at the same 1,000-unit run:
                                </p>

                                <div className="not-prose overflow-x-auto mb-6 rounded-2xl border border-gray-200">
                                    <table className="w-full text-left text-sm sm:text-base">
                                        <thead className="bg-[#2D2A2E] text-white">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">Fabric</th>
                                                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Cost / kg</th>
                                                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">kg / tee</th>
                                                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Fabric cost</th>
                                                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">180 GSM combed cotton jersey</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-[#4A484A]">$7.00</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-[#4A484A]">0.42</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E]">$2.94</td>
                                                <td className="px-4 py-3 text-right text-[#666666]">baseline</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">220 GSM heavyweight cotton</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-[#4A484A]">$7.50</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-[#4A484A]">0.51</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E]">$3.83</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#8C7A5E]">+$0.89</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">240 GSM certified organic knit</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-[#4A484A]">$11.00</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-[#4A484A]">0.56</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#2D2A2E]">$6.16</td>
                                                <td className="px-4 py-3 text-right font-bold tabular-nums text-[#8C7A5E]">+$3.22</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Read those last two columns together. Upgrading the cloth adds <strong>$3.22</strong> a unit. Going from 1,000 units to 5,000 saves about <strong>$2.50</strong>. So the fabric choice matters more than the order size — and it is the one you usually make in an afternoon, on feel.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That is not an argument for cheap cloth. Better fabric is often exactly what a brand should be selling. Customers can see it and feel it, and it justifies a higher price far better than a logo does. It is an argument for choosing on purpose, with the number in front of you. Which weights suit which garments is laid out in our <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="underline text-[#CBB49A] hover:text-[#b7a078]">guide to GSM and fabric weight</Link>.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Upgrading the cloth costs more than quintupling the order saves. Customers can feel one of those decisions.&rdquo;
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Garment Cost Sheet</h4>
                                        <p className="text-[#4A484A] leading-snug">A blank version of every table on this page — five cost lines, four MOQ tiers, the development spreader and the landed-cost stack. Enter your own fabric price and quantity; it fills in the rest. Spreadsheet + PDF.</p>
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
                                            Send me the cost sheet
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Cost sheet on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 5 */}
                            <section id="landed" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The lines the quote leaves out
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    An FOB quote ends at the port where your goods get loaded. Between there and your warehouse sit four more costs. All four are published, so you can look every one of them up before you sign anything.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Freight.</strong> Sea freight is priced by the container, so it only becomes a per-unit number after you divide. Drewry&rsquo;s <a href="https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">World Container Index</a> put the global composite at <strong>$4,297 per 40ft container on 6 August 2026</strong>. Spread across roughly 12,000 tees, that is about 36 cents a unit before drayage and terminal charges — call it $0.60 all-in. Air freight costs many times more — you pick it to save time, not money.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Duty.</strong> This is the big one, and it is fixed by what the garment is made of, not who made it. A cotton knit tee falls under <a href="https://hts.usitc.gov/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">HTS 6109.10.00</a> at a <strong>16.5%</strong> general rate. The same tee in a man-made fiber pays roughly double. Change the fiber and you change the duty. Most brands make that costing decision by accident. Additional trade actions can stack on top of that base rate, and they move — we tracked the current regime in <Link href="/blogs/july-24-tariff-cliff-recost-fall-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the July 24 tariff cliff</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    <strong>Federal fees and brokerage.</strong> Small, fixed, and easy to forget. For fiscal 2026 the merchandise processing fee is <a href="https://www.federalregister.gov/documents/2025/07/23/2025-13869/customs-user-fees-to-be-adjusted-for-inflation-in-fiscal-year-2026-cbp-dec-25-10" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">0.3464% of value, with a $33.58 floor and a $651.50 ceiling per formal entry</a>. That floor is the detail that bites. On a small shipment you pay $33.58 either way — spread over 200 units that is 17 cents a garment, but over 2,000 units it is under two cents. Ocean shipments add a 0.125% harbor maintenance fee, and a customs broker charges a flat fee per entry.
                                </p>

                                <LandedCostGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The whole point of that chart is the gap. Quoted at $8.50, landed at $11.59 — the factory price is <strong>73%</strong> of the real number. Set your retail price off $8.50 and you have built your whole margin on three-quarters of your cost.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    If you want to sanity-check any of this against reality, the Commerce Department&rsquo;s <a href="https://www.trade.gov/otexa-trade-data-page" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Office of Textiles and Apparel publishes US apparel import data</a> by country and category, including average unit values. It is the closest thing to a public benchmark for what garments actually cross the border at.
                                </p>

                            </section>

                            {/* H2 6 */}
                            <section id="reading-a-quote" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How to read a quote in five minutes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A single number in an email is not a quote. It is a starting point. These five questions turn it into something you can actually compare — and a factory that answers all five straight has told you a lot about how it works.
                                </p>

                                <div className="not-prose mb-6 space-y-3">
                                    {[
                                        {
                                            n: "01",
                                            q: "Is this FOB, EXW or landed?",
                                            a: "EXW means the goods sit at the factory door and every step after is yours. FOB means loaded at the origin port. Landed means delivered, duty paid. Comparing an EXW price to a landed price is not a comparison.",
                                        },
                                        {
                                            n: "02",
                                            q: "What fabric price and consumption is this built on?",
                                            a: "Ask for cost per kilo and estimated kilos per garment. If the two quotes differ and the fabric line explains the gap, you are not looking at two prices — you are looking at two different garments.",
                                        },
                                        {
                                            n: "03",
                                            q: "How many sample rounds are included?",
                                            a: "Three is normal — proto, fit, pre-production. Find out what the fourth costs, because you will probably want it.",
                                        },
                                        {
                                            n: "04",
                                            q: "What quantity is this price valid at, and what is the tolerance?",
                                            a: "Every quote assumes a quantity. Most also allow a shipping tolerance — usually a few percent over or under — and you are billed for what actually ships. Get both numbers before you plan your stock.",
                                        },
                                        {
                                            n: "05",
                                            q: "What happens if bulk fails inspection?",
                                            a: "The most expensive line on any quote is the one nobody wrote down. Ask who pays for rework, who inspects, and at what stage. Get the answer before the deposit, not after.",
                                        },
                                    ].map((item) => (
                                        <div key={item.n} className="flex gap-4 p-4 rounded-2xl border border-gray-200 bg-white">
                                            <span className="text-2xl font-extrabold text-[#CBB49A] tabular-nums flex-shrink-0">{item.n}</span>
                                            <div>
                                                <p className="font-bold text-[#2D2A2E] mb-1 leading-snug">{item.q}</p>
                                                <p className="text-sm sm:text-base text-[#4A484A] leading-snug">{item.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The cheapest quote in a set of three is often the one with the most missing lines. It gets expensive later, in rework, in a fourth sample round nobody budgeted, in a shipment that arrives after the season — the failure modes we catalogued in <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="underline text-[#CBB49A] hover:text-[#b7a078]">the real cost of choosing the wrong manufacturer</Link>. A higher quote that includes three sample rounds and inline inspection can be the cheaper number by the time goods land.
                                </p>

                            </section>

                            {/* H2 7 — counterexample */}
                            <section id="counter" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When the bigger run is the wrong call
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A quiet stockroom at end of day: sealed cartons stacked shoulder-high on one side, a single short stack of four boxes on the other, long shadows from a high window falling between them. Cinematic, lived-in, no faces, no logos, no readable labels."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Everything above points one way: bigger runs are cheaper per unit. That is true. It is also the most reliable way for a new brand to lose money.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Run the total, not the unit. Five thousand tees at $6.18 all-in is <strong>$30,900 of inventory</strong>. Five hundred at $12.80 is <strong>$6,400</strong>. The 5,000-unit price is less than half per garment — and if you sell 400 pieces, the cheap decision left you sitting on roughly $28,000 of cotton in a storage unit, while the expensive one left you with a sell-out, a waiting list, and cash to reorder.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Cost per unit is the right thing to chase once you know the product sells. Before that, the number that matters is how much cash is at risk. The smallest run that gets you a garment you would put your name on is usually the right order. The expensive per-unit price is buying you information, and information is cheaper than a warehouse.
                                </p>

                            </section>

                            {/* H2 8 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Build the cost sheet before you ask for a quote, not after. Write down your fabric, your target GSM, your size run and your quantity, then add the four costs that come after the port. You will get better quotes, because a factory can tell from one email whether you know what you are asking for.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    Then price your first order for information, not for margin. What is the smallest run that gets you a garment you would stand behind, and what does it land at with every cost counted? If you can answer that with one number, you are ahead of most brands that have already launched.
                                </p>
                            </section>

                            {/* FAQ */}
                            <section id="faq" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Common questions
                                </h2>
                                <div className="not-prose space-y-4">
                                    {faqs.map((f) => (
                                        <div key={f.q} className="rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5">
                                            <h3 className="font-bold text-[#2D2A2E] mb-2 leading-snug text-lg">{f.q}</h3>
                                            <p className="text-[#4A484A] leading-snug">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Lead Times: Design to Doorstep, Week by Week</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">You have the cost. Here is the calendar it runs on — and where the weeks actually go.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the timeline <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Get your style costed, line by line</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about costing your style — every line broken out, from fabric through to landed, before you commit to a quantity.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/what-is-a-tech-pack-why-you-need-it",
                                            title: "What Is a Tech Pack?",
                                            dek: "The document that decides how many sample rounds you pay for.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/private-label-vs-custom-manufacturing",
                                            title: "Private Label vs. Custom Manufacturing",
                                            dek: "Two routes to a first order, and what each one really costs you.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/the-real-cost-of-wrong-clothing-manufacturer",
                                            title: "The Real Cost of the Wrong Manufacturer",
                                            dek: "Wrong samples, defective bulk, nobody to call — priced out.",
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
                        Talk to a production lead about costing your style <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
