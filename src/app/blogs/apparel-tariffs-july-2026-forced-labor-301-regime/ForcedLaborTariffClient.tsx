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

const BLOG_ID = "apparel-tariffs-july-2026-forced-labor-301-regime";

const HERO_IMAGE = "/blog/apparel-tariffs-301-hero.jpg";
const MAP_IMAGE = "/blog/apparel-tariffs-301-section1.jpg";
const STACK_IMAGE = "/blog/apparel-tariffs-301-teaching.jpg";
const CLOSING_IMAGE = "/blog/apparel-tariffs-301-closing.jpg";

const TOC = [
    { id: "the-floor", label: "The floor everyone got used to" },
    { id: "hard-date", label: "Why July 24 is a real date" },
    { id: "new-map", label: "The new map: 10% vs 12.5%" },
    { id: "textile-mechanism", label: "The textile mechanism in the fine print" },
    { id: "counter-case", label: "Why 2.5 points isn't the whole story" },
    { id: "the-move", label: "The move before Fall POs lock" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function ForcedLaborTariffClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("the-floor");
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
                    alt="A single crisp cotton button-down shirt on an invisible mannequin form, caught mid-motion against a bright sunlit coral backdrop — luminous daylight, clean whites, airy 2026 lookbook energy. No logos, no faces, no readable text."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Sourcing &amp; Trade
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">July 5, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The 10% Tariff Floor Expires July 24<br className="hidden sm:block" /> — Then What?
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The blanket rate that made every country look the same is ending. What replaces it sorts suppliers by forced-labor policy — not just cost.
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
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk · July 5, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• The flat 10% Section 122 surcharge that leveled every country expires <strong>July 24, 2026</strong> — and the proposed replacement is a <strong>split rate</strong>.</li>
                            <li>• Under USTR&apos;s Section 301 forced-labor plan, suppliers split into <strong>10%</strong> (Bangladesh, Cambodia, Pakistan, Indonesia, Mexico) and <strong>12.5%</strong> (China, India, Vietnam).</li>
                            <li>• Comments close <strong>July 6</strong>, hearings run <strong>July 7</strong> — so your Fall PO gets costed against a moving number. Re-cost now.</li>
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
                                        <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The US-Plus-One sourcing playbook for 2026</p>
                                        </Link>
                                        <Link href="/blogs/de-minimis-end-us-brands-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Every parcel pays now: the end of the $800 rule</p>
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
                                For five months, the tariff math on apparel has been unusually simple. That&apos;s about to change on a specific date.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                After the Supreme Court struck down the administration&apos;s IEEPA &ldquo;reciprocal&rdquo; tariffs in February — <a href="https://www.scotusblog.com/2026/02/supreme-court-strikes-down-tariffs/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">a 6&ndash;3 ruling</a> that emergency powers don&apos;t include the power to tax imports — the White House replaced them with a single flat surcharge. It applied to nearly everyone the same way.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                That flatness is the thing about to end. And what replaces it turns your sourcing decision into a compliance decision — because your country choice now sets your tariff rate. Here&apos;s the new country-by-country stack, and the move before Fall POs lock.
                            </p>

                            {/* H2 1 */}
                            <section id="the-floor" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The floor everyone got used to
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MAP_IMAGE}
                                        alt="A sunlit garment-sourcing showroom mid-flow: rolls of neutral apparel fabric stacked beside a huge bright window, two people in motion comparing bolts, daylight flooding a pale teal-and-white space. Faces turned away or cropped, no logos or readable text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The surcharge on the way out is <strong>Section 122</strong> <em>(a balance-of-payments tool that lets the President impose up to 15% for a strictly limited window)</em>. It went live at a flat <strong>10% on February 24, 2026</strong>, and it applied to nearly everyone alike (<a href="https://www.ghy.com/trade-compliance/us-10-section-122-tariff-in-effect-feb-24-ieepa-tariffs-directed-to-wind-down-de-minimis-suspension-continues/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">GHY International</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Vietnam, India, Bangladesh, Indonesia — the country you sourced from stopped changing your surcharge. The rate was a floor, and the floor was flat.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That uniformity is exactly what&apos;s about to break. Section 122&apos;s authority expires by its own terms on <strong>July 24, 2026</strong>, and it can&apos;t simply be renewed at will. When it goes, so does the one number that made your sourcing map look the same everywhere.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The rate was a floor, and the floor was flat. That flatness is the thing about to end.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="hard-date" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why July 24 is a real date, not a headline
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two forces make this a hard deadline rather than a maybe. First, the statute: Section 122 duties are capped at 150 days, and February 24 plus 150 days lands on July 24. There&apos;s no discretionary extension inside the law.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Second, the courts are pulling the same direction. In May, the Court of International Trade <a href="https://www.hklaw.com/en/insights/publications/2026/05/us-court-of-international-trade-invalidates-the-administrations" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">invalidated the Section 122 tariffs outright</a>, though the ruling&apos;s <a href="https://www.skadden.com/insights/publications/2026/05/us-trade-court-strikes-down-section-122-tariffs" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">practical effect is limited</a> while it&apos;s appealed. The point for a founder isn&apos;t the litigation — it&apos;s that the 10% floor is living on borrowed time from two directions at once, and planning as if it&apos;s permanent is the mistake.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    So the administration is building the replacement in the open. The vehicle is <strong>Section 301</strong> <em>(the same trade-law hook used for the China tariffs)</em> — this time aimed at forced labor. USTR <a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/june/ustr-makes-findings-and-proposes-action-60-section-301-investigations-relating-failures-take-action" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">announced findings and proposed actions across 60 economies in June</a>, with <a href="https://www.beneschlaw.com/insight/forced-labor-tariffs-public-comments-due-next-week-for-ustr-section-301-investigation/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">written comments due July 6 and hearings July 7</a>. That timeline is why this lands on your desk now: the number your Fall program gets costed against is still being written.
                                </p>
                            </section>

                            {/* H2 3 */}
                            <section id="new-map" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The new map: 10% vs 12.5%
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here&apos;s the mechanic that changes sourcing from a cost question into a compliance one. USTR <a href="https://www.whitecase.com/insight-alert/ustr-proposes-10-125-tariffs-section-301-investigations-regulation-imports-produced" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">proposes two rates</a>: <strong>10%</strong> for economies that already ban forced-labor imports (or have committed to, or run a partial regime that blocks them), and <strong>12.5%</strong> for everyone else. The dividing line isn&apos;t your cost sheet. It&apos;s the exporting country&apos;s own forced-labor enforcement policy.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    And the two buckets cut straight through the apparel-sourcing world. The <strong>10%</strong> group <a href="https://www.greenworldwide.com/ustr-proposes-10-and-12-5-tariffs-on-60-economies-in-section-301-forced-labor-investigation/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">includes Bangladesh, Cambodia, Pakistan, Indonesia, Malaysia, Mexico, Canada, Guatemala, Taiwan, and the EU/UK</a> — 14 economies in all. The <strong>12.5%</strong> group is the remaining 46, and it includes <strong>China, India, and Vietnam</strong> — three of the four countries that make most of the world&apos;s clothes.
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={STACK_IMAGE}
                                        alt="A clean, bright infographic titled 'The Surcharge Stack: Before & After July 24' on an off-white background — three vertical bars showing MFN base plus flat 10% (Section 122, now), MFN base plus 10% (301, Bangladesh/Cambodia/Pakistan/Indonesia/Mexico/Canada/EU/UK/Taiwan), and MFN base plus 12.5% (301, China/India/Vietnam), footnoted '2.5-pt delta ≈ $50,000/yr on a $2M FOB program.' Brand navy bars, sunlit-yellow accent, no photographic elements."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Read that against a real cost stack. Base <strong>MFN duty</strong> <em>(most-favored-nation — the baseline rate WTO members&apos; goods pay)</em> on apparel already runs <a href="https://shenglufashion.com/2026/03/09/tariffs-impact-u-s-apparel-sourcing-and-trade-beyond-just-price-updated-march-2026/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">roughly 8% to 17% depending on fiber and construction</a> — and layered surcharges pushed the average effective apparel duty to 35.1% by December 2025, up from 14.7% a year earlier. Against numbers that big, a flat 10% floor was noise. A 10%-vs-12.5% <em>split</em> is a lever — because now the surcharge moves with the country.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The dividing line isn&apos;t your cost sheet. It&apos;s the exporting country&apos;s forced-labor policy.&rdquo;
                                </blockquote>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs the split will actually hit your margin</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your Fall program is single-sourced in a <strong>12.5% country</strong> (China, India, or Vietnam) with no second origin costed.</li>
                                        <li>• Your customs value per unit is high enough that <strong>2.5 points</strong> clears your per-unit margin cushion.</li>
                                        <li>• You&apos;ve been quoting Fall landed costs off the <strong>flat 10% floor</strong> and haven&apos;t re-run them against the split.</li>
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Fall Re-Cost Worksheet</h4>
                                        <p className="text-[#4A484A] leading-snug">A three-scenario landed-cost grid — 122-lapse, 301-at-10%, 301-at-12.5% — with the country-bucket list built in. Runs any FOB price across every outcome. PDF.</p>
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

                            {/* H2 4 */}
                            <section id="textile-mechanism" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The textile mechanism nobody&apos;s pricing yet
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    There&apos;s a release valve buried in the proposal, and it&apos;s aimed directly at apparel. USTR floated a <strong>textile mechanism</strong>: a certain volume of apparel and textile imports from a given country could enter at a <em>reduced</em> Section 301 rate (<a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/june/ustr-makes-findings-and-proposes-action-60-section-301-investigations-relating-failures-take-action" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USTR</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The volume isn&apos;t arbitrary. It&apos;s tied to how much that country buys from the US — specifically, the quantity of US textile exports it takes, plus the volume of US cotton and cotton products it imports. In other words, countries that buy American cotton earn a reduced-rate quota back on the apparel they ship in.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That&apos;s not final, and the mechanics — who administers the quota, how it&apos;s allocated — are exactly what the July 7 hearings exist to resolve. But it means the headline country rate isn&apos;t necessarily your rate. If your mill&apos;s country is a large US-cotton buyer, some of your volume may land under the reduced tier — worth asking your supplier before you assume the sticker rate.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="counter-case" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The counter-case: why 2.5 points isn&apos;t the whole story
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A playful graphic editorial still: two folded apparel pieces side by side on a bold sunny-yellow seamless background, one tagged with a small clean '10%' card and the other '12.5%', crisp geometry, a hard-edged blue shadow shape, bright high-key studio light. Generic unbranded garments, no logos, no faces."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It would be easy to read this as &ldquo;flee the 12.5% countries.&rdquo; Don&apos;t — at least not on the tariff alone. The gap between India at 12.5% and Bangladesh at 10% is <strong>2.5 points of customs value</strong>. On a $2M FOB Fall program that&apos;s about <strong>$50,000 a year</strong> — real, but small next to what a bad move can cost.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Because tariff is one line in a landed cost, and the rest of the lines don&apos;t move with it. Re-tooling a proven program into a new country to chase 2.5 points can hand back the savings in sampling rounds, quality drift, longer lead times, and MOQ resets — and the shelf date doesn&apos;t wait. A 12.5% origin with a mill that hits your quality and your calendar can still beat a 10% origin you&apos;ve never run.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The honest read: the split is a reason to <strong>re-cost and diversify</strong>, not to panic-migrate. Know your number under each scenario, get a second origin costed so you have a lever — and treat the forced-labor rate as one input, not the verdict. That&apos;s the discipline behind a <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">US-plus-one sourcing setup</Link>: a primary you trust, plus a costed alternate you can pull when the map moves.
                                </p>
                            </section>

                            {/* H2 6 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The move before Fall POs lock
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    The window is open right now, and it closes on the calendar. Comments and hearings run July 6&ndash;7; the floor lifts July 24; Fall POs are landing in exactly that gap. Re-cost every open Fall program under three scenarios — 122 lapses to MFN only, 301 lands at 10%, 301 lands at 12.5% — so you&apos;re quoting a range, not a stale floor.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    The flat floor made sourcing feel settled. It wasn&apos;t — it was just paused. If your Fall program is single-sourced in a 12.5% country and still quoted off the old 10% floor, the question isn&apos;t whether to worry; it&apos;s what your number is under each of the three outcomes. What we&apos;d do in your shoes: re-cost this week, and get one alternate origin on paper before the POs lock.
                                </p>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/july-24-tariff-cliff-recost-fall-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The July 24 Tariff Cliff: Re-Cost Fall Before It Lands</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The deadline mechanics and the exact re-cost math for a Fall program.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Re-cost your Fall program</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about re-costing your Fall program against the new tariff map — and getting a second origin on paper before POs lock.</p>
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
                                            title: "The July 24 Tariff Cliff",
                                            dek: "The deadline mechanics and the exact re-cost math for a Fall program.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/de-minimis-end-us-brands-2026",
                                            title: "Every Parcel Pays Now: The End of the $800 Rule",
                                            dek: "What the end of duty-free small parcels means for DTC brands.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/us-plus-one-sourcing-playbook-2026",
                                            title: "The US-Plus-One Sourcing Playbook",
                                            dek: "Keep a primary origin and a costed alternate you can pull on demand.",
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
                        Talk to a production lead about re-costing your Fall program <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
