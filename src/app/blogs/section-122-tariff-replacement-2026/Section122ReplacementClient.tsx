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

const BLOG_ID = "section-122-tariff-replacement-2026";

const HERO_IMAGE = "/blog/section-122-replacement-hero.jpg";
const SECTION1_IMAGE = "/blog/section-122-replacement-section1.jpg";
const GARMENT_IMAGE = "/blog/section-122-replacement-garment.jpg";
const MACRO_IMAGE = "/blog/section-122-replacement-macro.jpg";
const CLOSING_IMAGE = "/blog/section-122-replacement-closing.jpg";

const TOC = [
    { id: "what-expired", label: "What actually expired on July 24" },
    { id: "what-replaced", label: "What replaced it — and why it isn't a blanket" },
    { id: "rate-map", label: "The new duty map, origin by origin" },
    { id: "who-moved", label: "Six countries switched lanes at the last minute" },
    { id: "zero-lanes", label: "Three lanes that now pay nothing extra" },
    { id: "cost-sheet", label: "Your next cost sheet: a $14 tee, five origins" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
    { id: "bottom-line", label: "The bottom line" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function Section122ReplacementClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("what-expired");
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
        showToast("Rate card on the way to your inbox.", "success");
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
                    alt="A garment export packing floor late in the shift — a long rail of poly-bagged finished shirts receding into the depth of the room, stacked brown export cartons banked along the right wall, one worker's back and forearms mid-frame lifting a carton. High-bay light mixed with daylight from clerestory windows. No faces, no brand marks, carton markings soft and unreadable."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">10 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 19, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Section 122 Is Gone.<br className="hidden sm:block" /> Here&apos;s What Replaced It.
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The flat 10% on everything ended. What took its place charges different countries different rates — and some apparel lanes nothing at all.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · August 19, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Section 122&apos;s flat 10% ended at 12:01 a.m. on <strong>July 24, 2026</strong>. A Section 301 forced-labour duty started the same minute — <strong>10% or 12.5%</strong>, depending on the country.</li>
                            <li>• <strong>India, Bangladesh, Cambodia, Indonesia, Pakistan and Sri Lanka pay 10%.</strong> <strong>Vietnam, China, Turkey, Thailand and the Philippines pay 12.5%.</strong></li>
                            <li>• Three lanes now pay <strong>no extra duty at all</strong>: qualifying CAFTA-DR apparel, USMCA-qualifying Mexican and Canadian goods, and apparel from the EU, Japan, Korea, Taiwan and Switzerland.</li>
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
                                        <Link href="/blogs/rebuild-landed-cost-august-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">After the cliff: rebuild your cost sheet for August</p>
                                        </Link>
                                        <Link href="/blogs/second-origin-costed-30-days" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">A second origin, costed in 30 days</p>
                                        </Link>
                                        <Link href="/blogs/why-fashion-brands-moving-manufacturing-to-india" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Why fashion brands are moving manufacturing to India</p>
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
                                For five months, every country cost the same. That is the part that ended on July 24.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Section 122&apos;s flat 10% surcharge sat on top of almost everything you imported, wherever it came from. It expired at 12:01 a.m. Eastern on July 24, 2026, and a different duty started in the same minute.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                The replacement is not a blanket. It charges some countries 10%, others 12.5%, and a few nothing at all. Here is what changed, in plain terms, and what it does to the next cost sheet you build.
                            </p>

                            {/* H2 1 */}
                            <section id="what-expired" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What actually expired on July 24
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Two hands working through a thick clipped stack of customs entry paperwork on a cluttered import desk, a ballpoint held mid-annotation, a scuffed keyboard and a dried coffee ring at the edge of frame. Ordinary overhead office light, unstyled. No face, no logos, all print soft and unreadable."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Section 122</strong> <em>(a law letting the President add a temporary import surcharge to correct a trade imbalance)</em> has a hard limit written into it: 150 days, and no more than 15%. The 10% surcharge started on February 24, so the clock ran out on July 24.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Nobody had to cancel it. It simply stopped, and the President cannot renew it alone — only Congress can extend it (<a href="https://www.congress.gov/crs-product/IF13199" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Congressional Research Service</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That is the whole of the expiry. We covered the run-up in <Link href="/blogs/july-24-tariff-cliff-recost-fall-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the July 24 tariff cliff</Link>, and the costing of goods clearing afterwards in <Link href="/blogs/rebuild-landed-cost-august-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the August landed-cost rebuild</Link>. Both were written while the replacement was still a proposal. It is final now, and some of the country numbers moved.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The blanket didn&apos;t get lifted. It ran out of road — and something narrower was already parked behind it.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="what-replaced" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What replaced it — and why it isn&apos;t a blanket
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    On July 23 the US Trade Representative finalised a <strong>Section 301</strong> action <em>(a trade tool aimed at one specific unfair practice by one specific country)</em> covering 60 economies. The practice being targeted is failing to ban — or failing to enforce a ban on — imports made with forced labour (<a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-takes-action-forced-labor-section-301-investigations" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USTR</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It took effect at 12:01 a.m. Eastern on July 24 — the same minute Section 122 lapsed, so there was no gap. Goods already loaded on the water had until July 28 to clear at the old rate, and that window has closed (<a href="https://ustr.gov/sites/default/files/files/Press/Releases/2026/FLIP%20301%20Investigation%20Final%20Action%20FRN%207-23-26%20FINAL.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Register notice</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two things matter more than the headline rate. It is sorted by <strong>country behaviour, not by product</strong>: a country that bans forced-labour imports pays 10%, one that does not pays 12.5%. And it has <strong>no end date</strong> — unlike Section 122, it stays until USTR changes it.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">The four differences that matter</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• <strong>Old:</strong> one rate for everyone. <strong>New:</strong> a rate per country.</li>
                                        <li>• <strong>Old:</strong> 150 days, then automatic expiry. <strong>New:</strong> indefinite.</li>
                                        <li>• <strong>Old:</strong> a balance-of-payments measure. <strong>New:</strong> a forced-labour enforcement measure — so a country can get its rate cut by changing its own law.</li>
                                        <li>• <strong>Both:</strong> charged on top of the normal duty, not instead of it.</li>
                                    </ul>
                                </div>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That last point is the one people get wrong. The new duty is added to the regular tariff your product already pays, and to any older Section 301 duty on Chinese goods (<a href="https://www.hklaw.com/en/insights/publications/2026/07/and-the-tariff-beat-goes-on" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Holland &amp; Knight</a>). Nothing is replaced. Layers are added.
                                </p>
                            </section>

                            {/* H2 3 — teaching graphic 1 (inline SVG) */}
                            <section id="rate-map" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The new duty map, origin by origin
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Here is the total duty on one ordinary product — a cotton knit T-shirt, tariff code 6109.10.00, which carries a <strong>16.5%</strong> normal rate before anything is added (<a href="https://hts.usitc.gov/search?query=61091000" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USITC Harmonized Tariff Schedule</a>).
                                </p>

                                <figure className="mb-7 rounded-2xl border border-gray-100 bg-[#F8F7F4] p-4 sm:p-6 shadow-sm overflow-x-auto">
                                    <svg viewBox="0 0 960 430" role="img" aria-label="Bar chart of total US duty on a cotton knit T-shirt by country of origin from 24 July 2026: Mexico under USMCA 0 percent, Central America under CAFTA-DR 0 percent, the EU, Taiwan, Japan, Korea and Switzerland 16.5 percent, India, Bangladesh, Cambodia, Indonesia, Pakistan and Sri Lanka 26.5 percent, Vietnam, Turkey, Thailand and the Philippines 29 percent, and China 36.5 percent." className="w-full h-auto min-w-[640px]">
                                        <rect x="0" y="0" width="960" height="430" fill="#FFFFFF" />
                                        <text x="24" y="34" fontFamily="Georgia, serif" fontSize="21" fontWeight="700" fill="#2D2A2E">Total duty on a cotton knit tee, from 24 July 2026</text>
                                        <text x="24" y="56" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Normal rate 16.5% (HTS 6109.10.00) plus the Section 301 forced-labour duty. Dollar figure is per tee at $14 FOB.</text>

                                        <line x1="300" y1="78" x2="300" y2="374" stroke="#DDD8D0" strokeWidth="1" />
                                        <line x1="440" y1="78" x2="440" y2="374" stroke="#EDE9E3" strokeWidth="1" />
                                        <line x1="580" y1="78" x2="580" y2="374" stroke="#EDE9E3" strokeWidth="1" />
                                        <line x1="720" y1="78" x2="720" y2="374" stroke="#EDE9E3" strokeWidth="1" />
                                        <text x="440" y="394" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">10%</text>
                                        <text x="580" y="394" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">20%</text>
                                        <text x="720" y="394" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">30%</text>

                                        <text x="288" y="105" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Mexico — USMCA qualifying</text>
                                        <rect x="300" y="88" width="4" height="24" fill="#D8CEBE" />
                                        <text x="314" y="105" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">0% · $0.00</text>

                                        <text x="288" y="153" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Central America — CAFTA-DR apparel</text>
                                        <rect x="300" y="136" width="4" height="24" fill="#D8CEBE" />
                                        <text x="314" y="153" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">0% · $0.00</text>

                                        <text x="288" y="201" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">EU · Taiwan · Japan · Korea · Switzerland</text>
                                        <rect x="300" y="184" width="231" height="24" fill="#CBB49A" />
                                        <text x="541" y="201" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">16.5% · $2.31</text>

                                        <text x="288" y="244" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">India · Bangladesh · Cambodia</text>
                                        <text x="288" y="260" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Indonesia · Pakistan · Sri Lanka</text>
                                        <rect x="300" y="232" width="371" height="24" fill="#A98F6F" />
                                        <text x="681" y="249" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">26.5% · $3.71</text>

                                        <text x="288" y="305" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Vietnam · Turkey · Thailand · Philippines</text>
                                        <rect x="300" y="288" width="406" height="24" fill="#7E6647" />
                                        <text x="716" y="305" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">29% · $4.06</text>

                                        <text x="288" y="353" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">China — incl. legacy 7.5% List 4A</text>
                                        <rect x="300" y="336" width="511" height="24" fill="#2D2A2E" />
                                        <text x="821" y="353" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">36.5% · $5.11</text>

                                        <text x="936" y="418" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="700" fill="#CBB49A" textAnchor="end">KK</text>
                                    </svg>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The spread between the cheapest dutiable lane and China is now <strong>20 percentage points</strong> on the same T-shirt. Under the blanket that gap was 7.5 points, and all of it was China&apos;s older duty.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    If you are comparing quotes across two countries, the duty column is doing more of the work than it has in years. That is the argument for <Link href="/blogs/second-origin-costed-30-days" className="underline text-[#CBB49A] hover:text-[#b7a078]">costing a second origin properly</Link> rather than guessing at it.
                                </p>
                            </section>

                            {/* H2 4 */}
                            <section id="who-moved" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Six countries switched lanes at the last minute
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is the part most summaries published in June got wrong, and it is worth checking your own notes against.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    When USTR proposed the action on June 2, only six of the sixty economies had a forced-labour import ban on the books. Between the proposal and the final decision, <strong>Cambodia, Guatemala, Honduras, India, Sri Lanka and Trinidad and Tobago each adopted one</strong>, and Jordan committed to one in a trade agreement. All seven landed in the 10% lane instead of the 12.5% lane (<a href="https://ustr.gov/sites/default/files/files/Press/Releases/2026/FLIP%20301%20Investigation%20Final%20Action%20FRN%207-23-26%20FINAL.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Register notice</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For a US brand producing in India that is the difference between a 29% total duty and a 26.5% one — and any spreadsheet built in June off the proposal has India in the wrong column. Our own <Link href="/blogs/rebuild-landed-cost-august-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">August cost-sheet piece</Link> costed India at 12.5% on that basis. The final rate is 10%.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A country changed its own law and its exporters got 2.5 points back. That is not a loophole — it is the entire design of the thing.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    It also means the map is not fixed. Any of the 12.5% economies can pass an enforcement law and be moved down. Treat the rate as current, not permanent — the same discipline that makes <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">a two-country sourcing plan</Link> worth maintaining even when one origin looks cheapest today.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Post-Section-122 Apparel Rate Card</h4>
                                        <p className="text-[#4A484A] leading-snug">One page: every apparel-sourcing country in its correct 10% / 12.5% / exempt lane as of July 24, the normal duty rates for the common garment codes, and a blank column to write your own FOB against. PDF.</p>
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
                                            Send me the rate card
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Rate card on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 5 */}
                            <section id="zero-lanes" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Three lanes that now pay nothing extra
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of a thumb and forefinger lifting a small woven country-of-origin label out of a garment's inside side seam, the label's woven edge and the overlock stitching razor sharp, the printed face angled away from the camera. Soft diffused window light. No legible lettering or numbers, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three groups of goods are carved out entirely, and two of them are specific to apparel.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>One — CAFTA-DR apparel.</strong> Textile and apparel goods from Costa Rica, the Dominican Republic, El Salvador, Guatemala, Honduras or Nicaragua that already enter duty-free under that agreement pay <strong>no Section 301 duty at all</strong>. Not a reduced rate — none.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Two — USMCA goods.</strong> Products of Mexico and Canada entering duty-free under USMCA are exempt too, which for apparel means meeting the yarn-forward rule <em>(the yarn and the fabric both have to originate inside the trade bloc)</em>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Three — the capped countries.</strong> For the EU, Taiwan, Japan, Korea and Switzerland the rule is a ceiling rather than an addition: the normal duty and the new duty together cannot exceed 10% (EU, Taiwan) or 12.5% (Japan, Korea, Switzerland). Apparel already sits above both ceilings, so the extra duty on a 16.5% T-shirt is <strong>zero</strong>.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Before you bank an exemption</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• CAFTA-DR only helps if the garment <em>actually qualifies</em> — the wrong yarn origin loses it.</li>
                                        <li>• The Mexico and Canada carve-out requires goods to enter free of duty under USMCA, not merely to ship from there.</li>
                                        <li>• The EU and Japan ceilings save nothing on a low-duty product — only on high-duty ones, which is most apparel.</li>
                                        <li>• Get the classification confirmed by your broker in writing before you re-quote a customer.</li>
                                    </ul>
                                </div>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    One more line is worth watching. USTR has been directed to build a quota letting a set volume of apparel from <strong>Bangladesh, Cambodia, Indonesia and Malaysia</strong> enter free of the new duty, tied to how much US cotton and fabric those countries buy, running three years once it starts. It does not exist yet — until USTR publishes it, those four pay the full 10%.
                                </p>
                            </section>

                            {/* H2 6 — teaching graphic 2 (inline SVG) */}
                            <section id="cost-sheet" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Your next cost sheet: a $14 tee, five origins
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Take a blank cotton tee at <strong>$14 FOB</strong> <em>(the supplier&apos;s price at the origin port, before freight and duty)</em> on a 5,000-piece run brought in as one ocean entry. Here is the duty per tee before July 24 and after.
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="A single unbranded cotton crew tee held up by two hands against soft window light in a sample room, the jersey backlit just enough to show the knit and the shoulder seam, an open export carton of folded tees blurred behind. No face, no tags, no printing, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <figure className="mb-7 rounded-2xl border border-gray-100 bg-[#F8F7F4] p-4 sm:p-6 shadow-sm overflow-x-auto">
                                    <svg viewBox="0 0 960 470" role="img" aria-label="Paired bar chart comparing duty per tee on a 14 dollar cotton T-shirt before and after 24 July 2026: India unchanged at 3 dollars 71, Vietnam rising from 3 dollars 71 to 4 dollars 06, China rising from 4 dollars 76 to 5 dollars 11, the EU, Japan and Korea falling from 3 dollars 71 to 2 dollars 31, and CAFTA-DR and USMCA apparel unchanged at zero." className="w-full h-auto min-w-[640px]">
                                        <rect x="0" y="0" width="960" height="470" fill="#FFFFFF" />
                                        <text x="24" y="34" fontFamily="Georgia, serif" fontSize="21" fontWeight="700" fill="#2D2A2E">Duty per tee on a $14 FOB cotton T-shirt</text>
                                        <text x="24" y="56" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">The Section 122 blanket (to 23 July) against the Section 301 forced-labour duty (from 24 July).</text>

                                        <rect x="300" y="72" width="14" height="12" fill="#D8CEBE" />
                                        <text x="320" y="82" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666">Before</text>
                                        <rect x="380" y="72" width="14" height="12" fill="#7E6647" />
                                        <text x="400" y="82" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666">After</text>

                                        <line x1="300" y1="98" x2="300" y2="414" stroke="#DDD8D0" strokeWidth="1" />
                                        <line x1="460" y1="98" x2="460" y2="414" stroke="#EDE9E3" strokeWidth="1" />
                                        <line x1="620" y1="98" x2="620" y2="414" stroke="#EDE9E3" strokeWidth="1" />
                                        <line x1="780" y1="98" x2="780" y2="414" stroke="#EDE9E3" strokeWidth="1" />
                                        <text x="460" y="434" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">$2</text>
                                        <text x="620" y="434" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">$4</text>
                                        <text x="780" y="434" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">$6</text>

                                        <text x="288" y="128" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">India</text>
                                        <rect x="300" y="108" width="297" height="14" fill="#D8CEBE" />
                                        <rect x="300" y="126" width="297" height="14" fill="#7E6647" />
                                        <text x="607" y="130" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$3.71 → $3.71</text>
                                        <text x="760" y="130" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#666666">no change</text>

                                        <text x="288" y="190" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Vietnam</text>
                                        <rect x="300" y="170" width="297" height="14" fill="#D8CEBE" />
                                        <rect x="300" y="188" width="325" height="14" fill="#7E6647" />
                                        <text x="635" y="192" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$3.71 → $4.06</text>
                                        <text x="788" y="192" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#8A5A3B">+$0.35</text>

                                        <text x="288" y="252" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">China</text>
                                        <rect x="300" y="232" width="381" height="14" fill="#D8CEBE" />
                                        <rect x="300" y="250" width="409" height="14" fill="#2D2A2E" />
                                        <text x="719" y="254" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$4.76 → $5.11</text>
                                        <text x="872" y="254" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#8A5A3B">+$0.35</text>

                                        <text x="288" y="314" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">EU · Japan · Korea</text>
                                        <rect x="300" y="294" width="297" height="14" fill="#D8CEBE" />
                                        <rect x="300" y="312" width="185" height="14" fill="#CBB49A" />
                                        <text x="607" y="316" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$3.71 → $2.31</text>
                                        <text x="760" y="316" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#3F6B4A">−$1.40</text>

                                        <text x="288" y="376" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">CAFTA-DR &amp; USMCA apparel</text>
                                        <rect x="300" y="356" width="4" height="14" fill="#D8CEBE" />
                                        <rect x="300" y="374" width="4" height="14" fill="#7E6647" />
                                        <text x="314" y="376" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$0.00 → $0.00</text>
                                        <text x="467" y="376" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#666666">exempt under both</text>

                                        <text x="936" y="458" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="700" fill="#CBB49A" textAnchor="end">KK</text>
                                    </svg>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Read the India row first, because it is the surprising one. For the largest 10%-lane apparel exporter the number did not move: 26.5% before, 26.5% now. A brand producing there and bracing for a July increase does not have one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Vietnam and China each pay <strong>35 cents more per tee</strong> — about <strong>$1,750</strong> across that 5,000-piece run. Real, but not the cliff people braced for. The bigger movements on this chart are the EU line falling $1.40 and the exempt lanes sitting flat at zero.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    None of this includes the fixed charges underneath the duty: the Merchandise Processing Fee at 0.3464% of value, floored at $33.58 and capped at $651.50 for FY2026, and the Harbor Maintenance Fee at 0.125% on ocean freight (<a href="https://www.cbp.gov/trade/basic-import-export/user-fee-table" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">US Customs and Border Protection</a>). On this consolidated entry they add roughly <strong>$0.12</strong> a tee — near-fixed per entry, which is why splitting a run into small parcels hurts far more than the tariff does. It is the same arithmetic that <Link href="/blogs/de-minimis-end-us-brands-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">broke the ship-direct model when the $800 de minimis exemption ended</Link>.
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
                                        alt="A third-party warehouse receiving bay mid-afternoon — shrink-wrapped pallets of plain cartons staged in a row, a worker's back in the middle distance pushing a pallet jack, a half-raised roller door letting flat daylight in against cold overhead fluorescents, scuffed floor paint and stray tape on the concrete. No faces, no logos, markings unreadable."
                                        width={1376}
                                        height={768}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    We&apos;d pull up every cost sheet written between June and late July and check one cell: the country rate. If it came from the proposal rather than the final notice, India, Cambodia and Sri Lanka are all 2.5 points too high on it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Then we&apos;d ask the broker to confirm in writing which tariff line each style enters under, and whether anything in the range could qualify for a CAFTA-DR or USMCA exemption we are not currently claiming. Those are worth more than any rate difference on this chart.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    The blanket made sourcing a price question for five months. It is a policy question again. Does your current cost sheet carry the July 23 numbers — or the June ones?
                                </p>
                            </section>

                            {/* Conclusion */}
                            <section id="bottom-line" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Section 122 expired on schedule and a Section 301 forced-labour duty replaced it the same minute — 10% for seventeen economies, 12.5% for the rest, and nothing for qualifying CAFTA-DR, USMCA and high-duty European and East Asian goods.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    For most apparel founders the total change is small: unchanged from India and Bangladesh, 35 cents a tee more from Vietnam and China, and a genuine saving on a handful of lanes. The risk is not the rate. It is running Q4 off a June spreadsheet with six countries in the wrong column.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-6 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What replaced the Section 122 tariff in 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">A Section 301 forced-labour duty on 60 economies, finalised by USTR on July 23, 2026 and effective 12:01 a.m. Eastern on July 24 — the same minute Section 122 lapsed. It charges 10% or 12.5% depending on whether the country bans and enforces a prohibition on forced-labour imports (<a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-takes-action-forced-labor-section-301-investigations" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USTR</a>).</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Which apparel countries pay 10% and which pay 12.5%?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">The 10% lane covers India, Bangladesh, Cambodia, Indonesia, Pakistan, Sri Lanka, Malaysia, Jordan, Mexico, Canada, the UK, Argentina, Ecuador, El Salvador, Guatemala, Honduras and Trinidad and Tobago. Every other investigated economy pays 12.5%, including Vietnam, China, Turkey, Thailand, the Philippines, Egypt and Morocco (<a href="https://www.bakerdonelson.com/forced-labor-section-301-tariffs-imposed-to-replace-expiring-section-122-tariffs-what-importers-need-to-know" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Baker Donelson</a>).</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Did the duty on Indian apparel go up on July 24?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">No. India adopted a forced-labour import prohibition after the June proposal and was placed in the 10% lane in the final notice — exactly what the Section 122 blanket charged. A cotton tee from India was 26.5% all-in before July 24 and is 26.5% after.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Does the new duty stack on top of the normal tariff?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Yes. The Federal Register notice states that goods subject to the new duty remain subject to the general rates in chapters 1 to 97, and to other additional duties — so China&apos;s legacy Section 301 duty stacks as well. A cotton tee from China carries 16.5% plus 12.5% plus the older 7.5% List 4A duty: 36.5% in total.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Is any apparel exempt from the Section 301 forced-labor tariff?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Three lanes are. Textile and apparel goods from Costa Rica, the Dominican Republic, El Salvador, Guatemala, Honduras or Nicaragua entering free of duty under CAFTA-DR; products of Mexico and Canada entering free of duty under USMCA; and goods from the EU, Taiwan, Japan, Korea or Switzerland whose normal duty already exceeds the 10% or 12.5% cap, which covers most apparel.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How long will the Section 301 forced-labor tariff last?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">There is no expiry date. Section 122 carried a 150-day statutory limit; this action does not, and stays until USTR amends it. A country&apos;s rate can be cut if USTR determines it now bans and enforces against forced-labour imports — which is how six economies moved from 12.5% to 10% before the action even started.</p>
                                    </div>
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/apparel-tariffs-july-2026-forced-labor-301-regime" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The 10% Tariff Floor Expires July 24 — Then What?</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The piece we wrote before the action was final — useful for the mechanism, and a good check on how much moved between proposal and law.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Re-cost your range against the July 24 rates</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Have a Krazy Kreators production lead re-cost your range against the final Section 301 rates — every style in its correct lane, exemptions checked, landed cost rebuilt.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/rebuild-landed-cost-august-2026",
                                            title: "After the Cliff: Rebuild Your Cost Sheet for August",
                                            dek: "The line-by-line landed-cost rebuild, now that the rates are final.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/exporting-apparel-from-india-checklist-first-time-buyers",
                                            title: "Exporting Apparel From India: A First-Timer's Checklist",
                                            dek: "Paperwork and process for the origin that stayed in the 10% lane.",
                                            read: "11 min read",
                                        },
                                        {
                                            href: "/blogs/custom-clothing-manufacturing-cost",
                                            title: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
                                            dek: "What sits under the duty line — the unit cost the tariff is charged on.",
                                            read: "10 min read",
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
                        Have a KK lead re-cost your range at the July 24 rates <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
