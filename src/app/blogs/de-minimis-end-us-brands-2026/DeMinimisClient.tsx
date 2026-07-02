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

const BLOG_ID = "de-minimis-end-us-brands-2026";

// Local images — generate from the image prompts and drop into public/blog/ at these names.
// They 404 until the assets exist; the loader serves local /blog/* paths natively.
const HERO_IMAGE = "/blog/de_minimis_hero.jpg";
const LABEL_IMAGE = "/blog/de_minimis_label_macro.jpg";
const COMPARE_IMAGE = "/blog/de_minimis_cost_compare.jpg";
const CLOSING_IMAGE = "/blog/de_minimis_closing.jpg";

const TOC = [
    { id: "what-was", label: "What the $800 rule was — and what killed it" },
    { id: "model-broke", label: "The model that just broke" },
    { id: "forty-dollar", label: "The $40 order, before and after" },
    { id: "the-move", label: "The move: stop shipping parcels" },
    { id: "staying-put", label: "When staying put still makes sense" },
    { id: "bottom-line", label: "The bottom line" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function DeMinimisClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("what-was");
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
        showToast("Calculator on the way to your inbox.", "success");
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
                    alt="Inside a US fulfillment warehouse at golden hour — long rows of kraft-brown parcels on a conveyor and steel shelving receding into soft depth, dust catching low directional light. No people, no readable labels or logos."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">June 29, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Every Parcel Pays Now:<br className="hidden sm:block" /> The End of the $800 Rule
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The duty-free shortcut a generation of DTC brands quietly built on is gone for good. Here&apos;s the per-parcel math that replaced it — and the one fulfillment move that survives it.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · June 29, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• The <strong>$800 de minimis exemption is gone</strong> — China since May 2025, every other country since Aug 29, 2025. 2026 is the first full year every import pays.</li>
                            <li>• On a small parcel, the <strong>brokerage + entry fee ($15–25) often costs more than the duty itself</strong> — that&apos;s what broke the ship-direct-from-overseas model.</li>
                            <li>• The fix isn&apos;t a cheaper country. It&apos;s <strong>consolidating into bulk import + a US 3PL</strong>: one entry, duty paid once, orders shipped domestically.</li>
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
                                        <Link href="/blogs/july-24-tariff-cliff-recost-fall-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The July 24 tariff cliff: re-cost Fall before it lands</p>
                                        </Link>
                                        <Link href="/blogs/us-fashion-brands-moving-from-china-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Why US brands are moving production from China</p>
                                        </Link>
                                        <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The US-Plus-One sourcing playbook for 2026</p>
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
                                For about a decade, a quiet rule did more for small US clothing brands than most of them realized.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Any shipment under $800 entered the country duty-free, with no formal customs paperwork. It made shipping single orders straight from an overseas factory or warehouse to a US doorstep not just possible, but cheap.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                That rule is gone. As of 2026, it&apos;s the first full year in which essentially every package — any value, any country, any carrier — owes duty and a customs entry. If your unit economics were ever built on parcels slipping in under $800, the floor moved. Here&apos;s where it landed.
                            </p>

                            {/* H2 1 */}
                            <section id="what-was" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What the $800 rule was — and what killed it
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={LABEL_IMAGE}
                                        alt="Extreme macro of a single kraft-paper parcel corner with a blank customs declaration label and stamped ink marks, shallow depth of field, one hard shaft of side light raking across the paper and packing tape. No readable text or brand marks."
                                        width={1024}
                                        height={1280}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The mechanism is called <strong>de minimis</strong> <em>(Latin for &ldquo;too small to matter&rdquo; — the import value below which the government waved a shipment through duty-free)</em>. It lives in <strong>Section 321</strong> of the Tariff Act, and in 2016 Congress raised the ceiling from $200 to $800 under the <a href="https://www.congress.gov/crs-product/R48380" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Trade Facilitation and Trade Enforcement Act</a>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The volume that poured through that door is the whole story. De minimis shipments grew from <a href="https://www.congress.gov/crs-product/R48380" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">140 million in 2014 to 1.36 billion in 2024</a> — roughly four million packages a day. A rule meant for tourists&apos; souvenirs had become the plumbing of cross-border e-commerce.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Then it closed in two steps: <a href="https://www.ghy.com/trade-compliance/us-to-end-de-minimis-exemption-for-low-value-imports-on-august-29/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">China and Hong Kong on May 2, 2025, and every other country on August 29, 2025</a>. This isn&apos;t a tariff that sunsets — the <a href="https://www.tariffstool.com/guides/de-minimis-exemption-ended-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">One Big Beautiful Bill Act gives statutory authority to keep de minimis eliminated from July 1, 2027</a>. Plan as if it&apos;s permanent, because the law is built that way.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The duty was never the thing that mattered most. The paperwork was. De minimis didn&apos;t just waive a fee — it waived an entire customs process, and that process is back.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="model-broke" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The model that just broke
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Picture the setup a lot of brands ran: inventory sits in an overseas 3PL <em>(third-party logistics warehouse)</em>, and each US order ships individually, direct to the customer, under $800. No duty, no broker, no entry. The landed cost of a tee was basically its factory price plus postage.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Every one of those individual parcels now needs a customs entry — <a href="https://www.tariffstool.com/guides/de-minimis-exemption-ended-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">informal for shipments under $2,500, formal above it</a> — plus duty and a <strong>Merchandise Processing Fee</strong> <em>(the CBP charge on imports, 0.3464% of value with a floor and ceiling)</em>. On top of that sits the part nobody budgeted for: a per-parcel <strong>brokerage fee</strong> <em>(what a customs broker charges to file each entry)</em>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The result is a fixed toll on every box, and fixed tolls punish small orders hardest. <a href="https://www.dhl.com/discover/en-us/global-logistics-advice/logistics-insights/the-end-of-de-minimis-exemption-meaning-for-your-business" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Brokerage and processing run roughly $15 to $25 per parcel</a> — a rounding error on a pallet, a margin-killer on a single tee.
                                </p>
                            </section>

                            {/* H2 3 */}
                            <section id="forty-dollar" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The $40 order, before and after
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={COMPARE_IMAGE}
                                        alt="A clean flat infographic titled 'The $40 order: two ways to bring it in', comparing two cost bars — 1,000 parcels shipped direct (tall, with duty, MPF and per-parcel brokerage) versus one bulk entry to a US 3PL (short, with duty, a single brokerage fee, and freight-per-unit). Indigo and steel-blue bars on off-white, no photographic elements."
                                        width={1024}
                                        height={1280}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Run a real one. A $40 cross-border order of a single knit top, shipped direct from an overseas warehouse.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Before:</strong> $0 duty, no entry, no broker. The cost was the garment and the postage.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>After:</strong> duty on $40 of apparel is only six or seven dollars — but the entry and brokerage add <a href="https://www.dhl.com/discover/en-us/global-logistics-advice/logistics-insights/the-end-of-de-minimis-exemption-meaning-for-your-business" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">another fifteen to twenty-five</a>. <a href="https://www.tariffstool.com/guides/de-minimis-exemption-ended-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">For parcels under about $200, the fixed processing cost routinely exceeds the duty itself</a>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That&apos;s the line worth sitting with: the tariff isn&apos;t what broke direct-ship. The <em>fee</em> is. You can&apos;t out-source-country your way around a flat charge that lands on every box regardless of where it came from.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Don&apos;t re-cost per garment. Re-cost per parcel. The new tax is on the act of shipping a box across the border — not on the shirt inside it.&rdquo;
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Post-$800 Import Model Calculator</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page sheet that runs your monthly order volume both ways — parcel-by-parcel entry vs. bulk import + US 3PL — and shows the exact volume where consolidating starts paying for itself. PDF.</p>
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
                                            Send me the calculator
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Calculator on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The move: stop shipping parcels across the border
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The fix isn&apos;t a cheaper origin. It&apos;s changing how the goods enter the country.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Consolidate.</strong> Instead of a thousand small parcels each triggering their own entry, send one bulk ocean or air shipment to a <strong>US 3PL</strong> <em>(a domestic warehouse that stores your inventory and ships orders for you)</em>. <a href="https://www.retailtouchpoints.com/executive-viewpoints/the-structural-reset-navigating-the-post-de-minimis-era-in-dtc-ecommerce/619621" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">You file a single customs entry, pay duty once on the whole batch, and fulfill US orders domestically</a>. One $15–25 brokerage fee spread across thousands of units is cents, not dollars, per garment.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    The freight math currently helps. <a href="https://www.retailtouchpoints.com/executive-viewpoints/the-structural-reset-navigating-the-post-de-minimis-era-in-dtc-ecommerce/619621" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">A 40-foot container from Shanghai to LA was running around $2,256 in early 2026</a> — well off the 2024 peaks — and a container holds thousands of units, so amortized freight per piece is trivial. The window to build inventory cheaply is open right now.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your import model is still stuck in the old rules</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your COGS sheet still assumes &ldquo;duty-free under $800.&rdquo;</li>
                                        <li>• Orders ship one-by-one from an overseas warehouse, not a US one.</li>
                                        <li>• You&apos;re comparing factory countries instead of comparing per-parcel vs. bulk entry.</li>
                                        <li>• You haven&apos;t priced a US 3PL because &ldquo;we&apos;ve always shipped direct.&rdquo;</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 5 */}
                            <section id="staying-put" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When staying put still makes sense
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A single small kraft parcel alone on a scratched steel table, half lit by a hard shaft of window light and half in deep shadow, a faint price-tag string trailing off the edge. Moody and quiet, no faces, no readable text."
                                        width={1280}
                                        height={720}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This isn&apos;t universal. If you already import in bulk and fulfill from the US — which most brands selling through wholesale or a US marketplace do — almost nothing here changes; you were never exposed.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    And consolidation has a real cost: you&apos;re now holding inventory, which ties up cash and adds the risk of buying the wrong sizes. A true made-to-order or ultra-low-volume brand may still find per-parcel entry cheaper than a warehouse full of stock it hasn&apos;t sold. The right answer is a calculation, not a reflex — run your actual order volume against the fixed-fee-per-parcel before you sign a 3PL.
                                </p>
                            </section>

                            {/* H2 6 — Closing */}
                            <section id="bottom-line" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    The $800 rule rewarded brands for staying small and shipping direct; the new rules reward brands for buying ahead and landing inventory in bulk. That&apos;s not a tax change — it&apos;s a different operating model, and the founders who rebuild around it now will quietly out-margin the ones still paying a toll on every box. If you mapped your last hundred orders against a single bulk entry, which way would the math fall?
                                </p>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/july-24-tariff-cliff-recost-fall-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The July 24 Tariff Cliff: Re-Cost Fall Before It Lands</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The other half of 2026&apos;s import-cost story — the blanket tariff every Fall PO is betting on.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Rebuild around bulk, not parcels</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about moving from direct-ship to bulk production and US fulfillment.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/july-24-tariff-cliff-recost-fall-2026",
                                            title: "The July 24 Tariff Cliff: Re-Cost Fall Before It Lands",
                                            dek: "The blanket tariff that expires mid-summer — and the bet every Fall PO makes.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/us-plus-one-sourcing-playbook-2026",
                                            title: "The US-Plus-One Sourcing Playbook for 2026",
                                            dek: "Spread risk across origins without doubling your overhead.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/on-demand-clothing-manufacturing-2026",
                                            title: "On-Demand Manufacturing in 2026",
                                            dek: "When made-to-order beats holding inventory — and when it doesn't.",
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
                        Talk to a production lead about bulk + US fulfillment <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
