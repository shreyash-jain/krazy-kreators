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

const BLOG_ID = "de-minimis-hangover-2026-parcel-costs";

const HERO_IMAGE = "/blog/de-minimis-hangover-hero.jpg";
const SORTATION_IMAGE = "/blog/de-minimis-hangover-section1.jpg";
const TEACHING_IMAGE = "/blog/de-minimis-hangover-teaching.jpg";
const MACRO_IMAGE = "/blog/de-minimis-hangover-macro.jpg";
const CLOSING_IMAGE = "/blog/de-minimis-hangover-closing.jpg";

const TOC = [
    { id: "volume-voted", label: "Six months in, the volume voted" },
    { id: "parcel-math", label: "What one parcel actually costs now" },
    { id: "bulk-3pl", label: "The same tee, bulk-imported" },
    { id: "break-even", label: "The break-even line: $62 vs $14" },
    { id: "returns", label: "Returns are where the duty dies" },
    { id: "still-direct", label: "Who should still ship direct" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
    { id: "bottom-line", label: "The bottom line" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function DeMinimisHangoverClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("volume-voted");
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
                    alt="A single unbranded kraft-paper parcel standing alone on a dark concrete floor under one hard overhead light, its long shadow running toward a stack of shrink-wrapped cartons dissolving into darkness behind it. No logos, no labels, no faces."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">10 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">July 27, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The De Minimis Hangover:<br className="hidden sm:block" /> 6 Months, Real Numbers
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        One tee, two routes. Shipping it direct costs <strong className="font-semibold">$46.91</strong> a parcel. Bulk-importing it into a US 3PL costs <strong className="font-semibold">$13.13</strong>. Here&apos;s where the other $33.78 went.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · July 27, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• On a direct parcel, duty is charged on the <strong>retail price your customer paid</strong> — on bulk inventory, it&apos;s charged on your <strong>factory price</strong>. Same tee, same rate, <strong>$12.72 vs $2.39</strong>.</li>
                            <li>• Add the fees that don&apos;t scale — a flat MPF, a per-parcel disbursement fee, international freight — and one $48 order costs <strong>$46.91</strong> to deliver direct versus <strong>$13.13</strong> from a US 3PL.</li>
                            <li>• Ship-direct doesn&apos;t turn contribution-positive until roughly a <strong>$62</strong> order. Bulk-import plus a US 3PL crosses at about <strong>$14</strong>.</li>
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
                                        <Link href="/blogs/de-minimis-end-us-brands-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Trade</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Every Parcel Pays Now: The End of the $800 Rule</p>
                                        </Link>
                                        <Link href="/blogs/rebuild-landed-cost-august-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Costing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">After the Cliff: Rebuild Your Cost Sheet for August</p>
                                        </Link>
                                        <Link href="/blogs/dtc-margin-after-prime-day-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Prime Day&apos;s Over. Your Margin Report Isn&apos;t.</p>
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
                                The $800 exemption died on a Friday in August 2025. The bill for it arrives on a Tuesday in July 2026, buried in a fulfillment invoice nobody reads line by line.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                2026 is the first full year in which every parcel entering the United States owes duty. The temporary flat-fee bridge for postal shipments is gone, and in June, <strong>CBP</strong> <em>(US Customs and Border Protection — the agency that clears every import)</em> made the suspension indefinite by rule rather than by executive order.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                We covered the rule when it landed — <Link href="/blogs/de-minimis-end-us-brands-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">every parcel pays now</Link>. This is the mid-year check with numbers instead of forecasts: one tee, two routes, and the arithmetic that has quietly reorganized how clothing gets to American doorsteps.
                            </p>

                            {/* H2 1 */}
                            <section id="volume-voted" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Six months in, the volume voted
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SORTATION_IMAGE}
                                        alt="A cinematic documentary wide of a cavernous international mail sortation hall at dawn, cold blue light through high clerestory windows, one long conveyor running almost empty past rows of idle chutes, a lone worker seen only as a silhouette at the far end. No logos, no faces, no signage."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>De minimis</strong> <em>(the rule that let shipments under $800 enter duty-free)</em> was not a loophole at the margins. It was the road. More than a billion low-value shipments a year came through it before the suspension took effect on August 29, 2025 (<a href="https://www.cbp.gov/sites/default/files/2025-08/factsheet_suspension_of_duty-free_de_minimis_treatment.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">CBP</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then the road closed. US-bound postal volumes fell by more than 80% on carrier measures, and at least 88 national postal operators suspended US-bound parcel acceptance at some point during the transition (<a href="https://www.aircargonews.net/e-commerce-logistics/us-postal-volumes-plummet-following-de-minimis-suspension/1080612.article" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Air Cargo News</a>). The USPS filing for fiscal 2026 projects a <strong>42% revenue decline</strong> in its international mail and packages segment, including a <strong>56% drop for inbound</strong> (<a href="https://www.supplychaindive.com/news/us-postal-service-2026-shipping-projections/806121/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Supply Chain Dive</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Anyone still waiting for a reversal should read June. On <strong>June 24, 2026</strong>, CBP issued two interim final rules that suspend the exemption indefinitely — <a href="https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">one covering every mode except international mail</a>, and <a href="https://www.federalregister.gov/documents/2026/06/24/2026-12669/indefinite-suspension-of-the-de-minimis-exemption-for-mail-shipments-and-new-postal-informal-entry" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">one covering mail</a>, which also builds a new postal informal-entry process for goods valued at $2,500 or less. The postal rule took effect July 24, with a compliance date of <strong>October 22, 2026</strong> (<a href="https://www.thompsonhinesmartrade.com/2026/06/cbp-issues-interim-final-rules-indefinitely-suspending-the-de-minimis-exemption-for-imports/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Thompson Hine</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    A regime that moves from an emergency order into the Code of Federal Regulations is not a regime that expects to be temporary. Plan against the rule, not the appeal.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;When a policy stops being an executive order and starts being a regulation, it has stopped being a news story and started being your cost sheet.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="parcel-math" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What one parcel actually costs now
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Take a real unit. A cotton knit tee, made in India, <strong>$9.00 FOB</strong> <em>(free on board — the supplier&apos;s price at the origin port, before freight and duty)</em>, sold direct to a US customer at <strong>$48</strong>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Start with the number most founders get wrong. Duty is assessed on <strong>transaction value</strong> <em>(the price actually paid for the goods sold for export to the US)</em>. When you ship direct to a consumer, that transaction is the retail sale — so the duty base is the <strong>$48 your customer paid</strong>, not the $9 you paid the factory (<a href="https://passportglobal.com/blog/after-de-minimis-navigating-tariffs-and-customs-valuation-in-a-new-era/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Passport</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    The rate: cotton knit tees carry a <strong>16.5% MFN</strong> <em>(most-favored-nation — the baseline WTO rate)</em> duty under <a href="https://hts.usitc.gov/search?query=6109.10" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">HTS 6109.10.00</a>, plus the <strong>10%</strong> Section 301 forced-labor surcharge that replaced the expired Section 122 blanket for India and 16 other economies on <a href="https://globalimportblog.bakermckenzie.com/2026/07/24/united-states-new-10-to-12-5-section-301-forced-labor-tariffs-on-over-60-countries-take-effect-july-24-2026-replacing-current-10-section-122-duties/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">July 24, 2026</a>. Call it <strong>26.5%</strong>.
                                </p>

                                <div className="overflow-x-auto mb-4 rounded-2xl border border-gray-200">
                                    <table className="w-full text-left text-sm lg:text-base">
                                        <caption className="sr-only">Cost to deliver one $48 tee as a direct parcel from India</caption>
                                        <thead className="bg-[#F8F7F4] text-[#2D2A2E]">
                                            <tr>
                                                <th scope="col" className="py-3 px-4 font-bold">Route A — ship direct</th>
                                                <th scope="col" className="py-3 px-4 font-bold text-right whitespace-nowrap">Per parcel</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[#4A484A]">
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Duty, 26.5% of the $48 paid</td><td className="py-3 px-4 text-right whitespace-nowrap">$12.72</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">MPF, informal entry (automated), FY2026</td><td className="py-3 px-4 text-right whitespace-nowrap">$2.69</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Carrier disbursement fee</td><td className="py-3 px-4 text-right whitespace-nowrap">$17.50</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">International parcel freight, ~500 g</td><td className="py-3 px-4 text-right whitespace-nowrap">$14.00</td></tr>
                                            <tr className="border-t-2 border-[#CBB49A] bg-[#F8F7F4] font-bold text-[#2D2A2E]"><td className="py-3 px-4">Total per order</td><td className="py-3 px-4 text-right whitespace-nowrap">$46.91</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm text-[#666666] leading-snug mb-5">
                                    <strong>MPF</strong> <em>(merchandise processing fee)</em> on an automated informal entry is a flat <a href="https://www.ecfr.gov/current/title-19/chapter-I/part-24/section-24.23" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">$2.69 in FY2026</a>. The disbursement fee is what a carrier charges to front your duty: FedEx raised its to the greater of <a href="https://www.fedex.com/en-us/shipping/rate-changes/additional-shipping-fees.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">$17.50 or 2.5%</a> on July 20, 2026. Some services bill a separate clearance-entry fee on top.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Now finish the sum. Forty-eight dollars in, $46.91 of delivery cost out, and the tee itself still cost $9.00 to make. That order is <strong>$7.91 underwater</strong> — before payment processing, before a dollar of paid acquisition, before anyone gets paid.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    That is the whole reason a billion parcels stopped moving. Not principle. Arithmetic.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your parcel math is still stale</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your cost sheet still applies duty to your <strong>FOB price</strong> on orders you ship direct.</li>
                                        <li>• You budget duty as a percentage and have no <strong>fixed per-parcel line</strong> for MPF and disbursement.</li>
                                        <li>• Your CFO number for shipping is a blended average that <strong>predates August 2025</strong>.</li>
                                        <li>• Nobody has checked whether your origin sits in the <strong>10% or 12.5%</strong> Section 301 bucket.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 3 */}
                            <section id="bulk-3pl" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The same tee, bulk-imported into a US 3PL
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Same tee. Same duty rate. Different door. Import 3,000 units on one ocean entry, receive them into a <strong>3PL</strong> <em>(third-party logistics provider — a warehouse that stores and ships your inventory)</em>, and fulfil the same $48 order domestically.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Now the duty base is what you actually paid the factory: $9.00. The customs bill drops from $12.72 to $2.39 without a single line of trade policy changing.
                                </p>

                                <div className="overflow-x-auto mb-4 rounded-2xl border border-gray-200">
                                    <table className="w-full text-left text-sm lg:text-base">
                                        <caption className="sr-only">Cost to deliver the same tee from a US 3PL after a 3,000-unit bulk import</caption>
                                        <thead className="bg-[#F8F7F4] text-[#2D2A2E]">
                                            <tr>
                                                <th scope="col" className="py-3 px-4 font-bold">Route B — bulk import + US 3PL</th>
                                                <th scope="col" className="py-3 px-4 font-bold text-right whitespace-nowrap">Per order</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[#4A484A]">
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Duty, 26.5% of the $9.00 FOB</td><td className="py-3 px-4 text-right whitespace-nowrap">$2.39</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">MPF, 0.3464% of $27,000, spread over 3,000</td><td className="py-3 px-4 text-right whitespace-nowrap">$0.03</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Harbor maintenance fee, 0.125%, spread</td><td className="py-3 px-4 text-right whitespace-nowrap">$0.01</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Ocean freight + drayage ($1,350), spread</td><td className="py-3 px-4 text-right whitespace-nowrap">$0.45</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Customs brokerage, one entry ($150), spread</td><td className="py-3 px-4 text-right whitespace-nowrap">$0.05</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">3PL receiving</td><td className="py-3 px-4 text-right whitespace-nowrap">$0.10</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Storage, ~60 days average</td><td className="py-3 px-4 text-right whitespace-nowrap">$0.15</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Pick and pack, first item</td><td className="py-3 px-4 text-right whitespace-nowrap">$2.75</td></tr>
                                            <tr className="border-t border-gray-200"><td className="py-3 px-4">Domestic ground, 1 lb</td><td className="py-3 px-4 text-right whitespace-nowrap">$7.20</td></tr>
                                            <tr className="border-t-2 border-[#CBB49A] bg-[#F8F7F4] font-bold text-[#2D2A2E]"><td className="py-3 px-4">Total per order</td><td className="py-3 px-4 text-right whitespace-nowrap">$13.13</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-sm text-[#666666] leading-snug mb-5">
                                    Pick-and-pack benchmarks against the 2026 US average of <a href="https://eightx.co/blog/average-ecommerce-3pl-pick-pack-cost-by-order-size-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">$2.75 for the first item and $0.50 for each additional</a>. Freight, storage and brokerage are representative mid-market figures — swap in your own quotes.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>$46.91 versus $13.13.</strong> A gap of $33.78 on every single order. On the same $48 sale, Route B leaves $25.87 of contribution after product cost; Route A leaves a hole.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    This is the move the giants already made — Temu standing up forward warehouses, Shein splitting into bestsellers-from-US-stock and long-tail-from-origin. They didn&apos;t rebuild their logistics out of preference. They rebuilt it because the duty base moved.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Nothing about the tariff changed between those two columns. The only thing that moved was which number the duty is a percentage of.&rdquo;
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Parcel-vs-Bulk Landed-Cost Worksheet</h4>
                                        <p className="text-[#4A484A] leading-snug">Both columns from this article as a blank sheet — duty on retail vs duty on FOB, the fixed per-parcel fees, the spread-over-units lines, and the break-even formula. Drop in your FOB, retail and order volume and it prints your two numbers. PDF.</p>
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
                            <section id="break-even" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The break-even line: $62 vs $14
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={TEACHING_IMAGE}
                                        alt="A clean editorial infographic titled 'The Break-Even Order Value' on an off-white background: two rising contribution lines against an order-value axis from $0 to $100, the Ship Direct line crossing zero at $62 and the Bulk Import plus US 3PL line crossing at $14, with a labelled fixed-cost floor of $34.19 per parcel and a callout reading '$46.91 vs $13.13 on a $48 order.' Warm neutral palette, one accent colour, flat vector data-viz, small KK watermark."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The reason Route A hurts so much on a $48 order isn&apos;t the tariff. It&apos;s the floor. <strong>$34.19</strong> of that parcel — MPF, disbursement fee and international freight — is fixed. It does not care whether the box holds a $20 tee or a $200 coat.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Run both routes as a formula against order value, holding our tee&apos;s cost ratio (FOB at roughly 19% of retail), and you get two crossing points. Ship-direct turns contribution-positive at about a <strong>$62 order</strong>. Bulk-import into a US 3PL crosses at about <strong>$14</strong>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Both figures sit before marketing and payment processing, so your real break-even is higher than either. The ranking doesn&apos;t move, though — and that spread is the number to take into your next planning meeting, not the headline tariff rate.
                                </p>

                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">The three costs that refuse to scale down</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• <strong>MPF on an informal entry</strong> — a flat $2.69, charged per parcel, not per dollar.</li>
                                        <li>• <strong>Carrier disbursement</strong> — $17.50 minimum, whatever the duty was.</li>
                                        <li>• <strong>International parcel freight</strong> — roughly $14 for 500 g, and the cheap postal lane largely isn&apos;t there anymore.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 5 */}
                            <section id="returns" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Returns are where the duty dies
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="An extreme macro of the torn edge of a kraft mailer, packing-tape adhesive lifting in a thin translucent ribbon, individual paper fibres and one frayed cotton thread razor-sharp in a narrow band of focus, everything else falling into deep bokeh under soft raking window light. No text, no barcodes, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Apparel returns run near <a href="https://www.fulfyld.com/data/apparel-fulfillment-benchmarks/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">25% of outbound orders</a>. That rate was survivable when the parcel carried no duty. It isn&apos;t now.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    On a direct parcel, the $12.72 of duty and $17.50 of disbursement die with the return. The unit is 8,000 miles from your warehouse, drawback on a single parcel costs more to file than it recovers, and the money is simply gone. You paid the customs bill on four units to keep three.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    On a bulk import, duty was paid once at the dock and it stays with the good. A returned unit goes back on the 3PL shelf and resells at full price, carrying its $2.39 of duty with it. Duty on a parcel is a cost per <em>transaction</em>; duty on inventory is a cost per <em>unit</em> — and units get second chances.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="still-direct" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Who should still ship direct
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The math above is not an instruction to bulk-import everything. There are three cases where shipping direct still wins, and one of them is probably yours.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>High average order value.</strong> That fixed $34.19 is 71% of a $48 order and 14% of a $250 one. Outerwear, tailoring, occasion pieces — direct shipping stays comfortably positive, and the duty premium on retail-value costing is one you can price for.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Genuinely unforecastable SKUs.</strong> Made-to-order, personalised, deep size-and-fit variance — anything where a bulk buy is a guess dressed as a plan. Duty is expensive; dead stock is worse.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Pre-launch and low volume.</strong> Our 3,000-unit buy is roughly <strong>$36,000 of cash on the floor</strong> before the first sale — product, duty, freight, brokerage and receiving. At 60 orders a month that&apos;s a four-year buy, and nobody should finance four years of inventory to save $33 an order. If that&apos;s where you are, <Link href="/blogs/zero-moq-no-warehouse-launch-clothing-brand-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the low-minimum, no-warehouse route</Link> is still the right one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Which is why the answer most brands land on is a split, not a switch: pre-import the styles you can forecast, ship the rest direct until they earn a forecast of their own.
                                </p>
                            </section>

                            {/* H2 7 — Closing */}
                            <section id="what-wed-do" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&apos;d do in your shoes
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A warm documentary wide of a small American fulfilment room at end of day, late golden light across a packing bench, one open carton of neatly folded unbranded tees in sharp focus mid-frame, a rack of shelved cartons softening into the background, the hands of a worker only just entering the edge of frame. No logos, no faces, no signage."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    We&apos;d pull the last 90 days of orders, sort by SKU, and take the top decile — the handful of styles that make 60 to 70% of units. Those get costed as a bulk import: duty on FOB, one entry, one 3PL, and a first buy sized to eight or ten weeks of demand rather than a year of it. Everything else keeps shipping direct until its sell-through earns a forecast.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    And we&apos;d re-run the duty line against the rate on the day the goods clear, not the rate you costed at in spring — the mistake that broke a lot of <Link href="/blogs/rebuild-landed-cost-august-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">August cost sheets</Link>. So: what does your top-selling SKU actually cost to deliver today — and have you run that number since the postal lane closed?
                                </p>
                            </section>

                            {/* Conclusion */}
                            <section id="bottom-line" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Six months of real data say the same thing the volume charts do. The end of de minimis didn&apos;t just add a tariff — it changed what the tariff is charged on, and it bolted a fixed toll onto every box crossing the border. Duty on the retail price plus $34.19 of unavoidable per-parcel cost is a different business model from duty on the factory price spread across three thousand units.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For most US clothing brands that means a split book: forecastable styles pre-imported and fulfilled domestically, the long tail shipped direct, and a break-even number you can actually name for each. The brands that got hurt this year weren&apos;t the ones on the wrong route. They were the ones who never re-ran the arithmetic after August.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    October 22 is the next date on the calendar, when the new postal informal-entry process reaches its compliance deadline. That&apos;s the window to have your two columns costed — before peak, not during it.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-6 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Is the $800 de minimis exemption coming back in 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Nothing in the current record points that way. What began as an executive-order suspension in August 2025 became regulation on June 24, 2026, when CBP issued interim final rules suspending the exemption indefinitely for postal and non-postal shipments alike. Plan against the rule as written.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What does one parcel actually cost to import now?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">For a $48 cotton tee shipped direct from India: $12.72 duty at 26.5%, $2.69 merchandise processing fee, a $17.50 carrier disbursement fee and about $14.00 of international freight — $46.91 in total. Your figures will move with origin, fibre, weight and carrier contract, but the shape of the stack is the same.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Why is duty higher on a direct-to-consumer parcel than on bulk inventory?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Because duty is charged on transaction value — the price paid for the goods sold for export to the US. On a direct parcel that transaction is the retail sale, so the base is what your customer paid. On a bulk import it&apos;s what you paid the factory. Same rate, very different base.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What is the merchandise processing fee on a low-value parcel in 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">An automated informal entry carries a flat MPF of $2.69 in fiscal 2026. Formal entries are charged 0.3464% of customs value with a $33.58 minimum and a $651.50 maximum — which is why spreading one formal entry across thousands of units costs pennies apiece.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">At what order value does shipping direct still make sense?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">On the cost ratios in this article, direct shipping turns contribution-positive at roughly a $62 order, against about $14 for bulk-import plus a US 3PL. Both sit before marketing and payment fees. High-AOV categories and genuinely unforecastable SKUs are where direct still earns its place.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What changes on October 22, 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">That&apos;s the compliance date for CBP&apos;s new postal informal-entry process for goods valued at $2,500 or less — the bonding and data-reporting requirements that come with it. The rule itself took effect on July 24; October 22 is when the postal-specific obligations bite.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How much inventory do I need to buy for bulk import to be worth it?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">It&apos;s a cash question more than a unit-count one. The per-order saving is there from the first unit, but a 3,000-piece buy of a $9 tee ties up roughly $36,000 landed before the first sale. Size the first buy to eight to ten weeks of proven demand on your top-selling styles rather than a full year of a full range.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Does the duty rate depend on where I manufacture?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Yes, and it changed again in July. The Section 122 flat blanket expired on July 23, 2026 and was replaced the next day by Section 301 forced-labor tariffs at 10% for India, Bangladesh, Cambodia, Indonesia, Pakistan and a dozen others, and 12.5% for the remaining investigated economies. That sits on top of the MFN rate for your fibre and construction.</p>
                                    </div>
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/de-minimis-end-us-brands-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Every Parcel Pays Now: The End of the $800 Rule</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The rule change this piece measures — what the end of de minimis actually did to low-value imports, and who it hit first.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the explainer <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Model bulk-import + US 3PL against your parcel costs</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Ask Krazy Kreators to model bulk-import + US 3PL against your parcel costs — your FOB, your origin, your order profile, both columns side by side.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/de-minimis-end-us-brands-2026",
                                            title: "Every Parcel Pays Now: The End of the $800 Rule",
                                            dek: "The rule change this mid-year check measures against.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/rebuild-landed-cost-august-2026",
                                            title: "After the Cliff: Rebuild Your Cost Sheet for August",
                                            dek: "Duty follows the clearance date — how to re-cost for it.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/dtc-margin-after-prime-day-2026",
                                            title: "Prime Day's Over. Your Margin Report Isn't.",
                                            dek: "The other half of the margin story: fees, refunds, discounts.",
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
                        Model bulk-import + US 3PL against your parcel costs <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
