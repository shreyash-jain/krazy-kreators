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

const BLOG_ID = "family-matching-apparel-manufacturing";

const HERO_IMAGE = "/blog/family-matching-apparel-manufacturing-hero.jpg";
const SECTION1_IMAGE = "/blog/family-matching-apparel-manufacturing-section1.jpg";
const MACRO_IMAGE = "/blog/family-matching-apparel-manufacturing-macro.jpg";
const CLOSING_IMAGE = "/blog/family-matching-apparel-manufacturing-closing.jpg";

const TOC = [
    { id: "repeat-niche", label: "Why the set gets re-bought" },
    { id: "safety-rules", label: "Two rulebooks, one print" },
    { id: "fabric-fit", label: "One fabric, six size tables" },
    { id: "calendar", label: "When the demand arrives" },
    { id: "factory", label: "What changes at the factory" },
    { id: "sku-math", label: "The SKU arithmetic" },
    { id: "faqs", label: "FAQs" },
];

const ext = "underline text-[#CBB49A] hover:text-[#b7a078]";

type Faq = { q: string; a: string };

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
    faqs: Faq[];
};

export default function FamilyMatchingClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("repeat-niche");
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
            <section className="relative min-h-[640px] lg:min-h-[72vh] flex items-center justify-center overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20">
                <Image
                    src={HERO_IMAGE}
                    alt="Golden-hour photograph in a New England pumpkin field: a family of four in matching cream cable-knit sweaters walks away from the camera toward a line of orange maples, seen only from behind — the fall family photo outfit sets a family matching apparel brand sells into every September. No faces, no logos."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Production &amp; Sourcing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">6 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 16, 2026</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        Kidswear and Family Matching Apparel:<br className="hidden sm:block" />{" "}
                        A Growing Niche for Custom US Clothing Brands
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        One design, two rulebooks. The child&rsquo;s half of the set is a different product under US law &mdash; and everything follows from that.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · September 16, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Every kids&rsquo; piece in a set is a <strong>children&rsquo;s product</strong>: lead-tested trims, a tracking label, a certificate filed at the border. Pajamas above 9 months must also <strong>pass a flame test or be cut snug</strong>. The adult pieces face none of that.</li>
                            <li>• The niche grows per household, not per child &mdash; US births fell 1% in 2025. What keeps it repeatable is that <strong>a child needs a new size every year</strong>.</li>
                            <li>• Commit today and a new cut-and-sew set lands <strong>24 February 2027</strong>. This December is decorated blanks only; the real targets are <strong>fall-photo season and holiday 2027</strong>. One fabric, six kids&rsquo; sizes: <strong>17 SKUs per print, not 26</strong>.</li>
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
                                        <Link href="/blogs/cpsc-efiling-sb-707-apparel-compliance-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Compliance</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">CPSC eFiling and SB 707: the 2026 rules</p>
                                        </Link>
                                        <Link href="/blogs/clothing-production-timeline" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Timeline</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Sketch to store: the real 23 weeks</p>
                                        </Link>
                                        <Link href="/blogs/holiday-custom-apparel-2026-production-planning" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Holiday</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The holiday 2026 production playbook</p>
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
                                On 2 April, Sam&rsquo;s Club recalled about 18,000 Valentine&rsquo;s-themed children&rsquo;s pajama sets. They had sold for around $14, and the notice gives one reason: they violated the federal flammability standard for children&rsquo;s sleepwear (<a href="https://www.cpsc.gov/Recalls/2026/Sams-Club-Recalls-Members-Mark-Childrens-Pajama-Sets-Due-to-Burn-Hazard-Violates-Mandatory-Flammability-Standards-for-Childrens-Sleepwear" target="_blank" rel="noopener noreferrer" className={ext}>CPSC</a>).
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Nothing about the print was the problem; the same cloth cut for an adult would very likely have been legal, because a smooth-faced cotton at 2.6 ounces per square yard or heavier is exempt from adult flammability testing. That is the whole difficulty of <strong>family matching apparel manufacturing</strong>: one design, but the child&rsquo;s half is a different product under US law, so fabric, fit and labels are chosen for the strictest member of the family.
                            </p>

                            {/* H2 1 */}
                            <section id="repeat-niche" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why a family matching apparel brand gets the reorder every year
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A living room at dawn in December: three matching red-and-black buffalo-plaid flannel pajama sets in adult, child and baby sizes draped over the back of a linen sofa, a lit tree soft-focus behind — the matching family pajamas that anchor most family matching apparel brands. No people."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Kidswear has a repeat engine no adult category has. The pajamas that fit on Christmas Eve 2026 will not fit on Christmas Eve 2027, so the family buys again &mdash; and re-buys the adult pieces to keep the set complete. The occasions are fixed: search interest for &ldquo;matching family pajamas&rdquo; spikes every December (<a href="https://trends.google.com/trends/explore?date=today%205-y&geo=US&q=matching%20family%20pajamas" target="_blank" rel="noopener noreferrer" className={ext}>Google Trends</a>), and Old Navy, Target and Hanna Andersson all run a family-matching category into the holidays (<a href="https://www.today.com/shop/best-matching-family-holiday-pajamas-rcna236679" target="_blank" rel="noopener noreferrer" className={ext}>Today</a>). They own the $14 end; a small brand wins on print, fabric and fit.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The concession: the US recorded 3,606,400 births in 2025, down 1% (<a href="https://www.cdc.gov/nchs/pressroom/releases/20260409.html" target="_blank" rel="noopener noreferrer" className={ext}>CDC</a>), and Circana expected kids&rsquo; apparel dollar sales to fall 1&ndash;2% this quarter (<a href="https://www.retaildive.com/news/back-to-school-spending-moderate-circana/828013/" target="_blank" rel="noopener noreferrer" className={ext}>Retail Dive</a>). The niche grows per household, not per child. Buy to take share, not to ride a tide.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Kidswear is the only apparel category where the customer is guaranteed to need a new size next year.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="safety-rules" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Children&rsquo;s clothing safety rules: the kids&rsquo; half is a different product
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    US law calls anything intended primarily for children of 12 or younger a <em>children&rsquo;s product</em> (<a href="https://www.cpsc.gov/Business--Manufacturing/Testing-Certification/Childrens-Product-Certificate" target="_blank" rel="noopener noreferrer" className={ext}>CPSC</a>). Every kids&rsquo; piece in your set is one. Every snap, zipper, button and screen-print ink is lead-tested at a CPSC-accepted lab &mdash; 100 parts per million for components, 90 for inks (<a href="https://www.cpsc.gov/Business--Manufacturing/Business-Education/Business-Guidance/Clothing-OLD" target="_blank" rel="noopener noreferrer" className={ext}>CPSC clothing guidance</a>). Those reports back a Children&rsquo;s Product Certificate, filed at the border since 8 July (<Link href="/blogs/cpsc-efiling-sb-707-apparel-compliance-2026" className={ext}>we covered the rule</Link>), and a permanent tracking label on garment and packaging.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Sleepwear is the rule that catches matching-set brands. Above size 9 months and up to 14, sleepwear must either pass a vertical flame test or be <em>tight-fitting</em>: inside the rule&rsquo;s maximum body measurements, tapered, with the yellow &ldquo;not flame resistant&rdquo; hangtag. Infant sizes of 9 months and under are exempt if a one-piece is no longer than 25&frac34; inches (<a href="https://www.cpsc.gov/s3fs-public/1615-and-1616-Fact-Sheet-Childrens-Sleepwear-English.pdf" target="_blank" rel="noopener noreferrer" className={ext}>CPSC fact sheet, 16 CFR 1615/1616</a>).
                                </p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 470" role="img" aria-label="Comparison of what US law requires of the adult piece versus the child's piece in one matching pajama set. Adult: general clothing flammability standard only, with plain fabrics of 2.6 ounces per square yard or heavier exempt; no lead test, no certificate, no tracking label, drawstrings allowed. Child, sizes above 9 months to 14: sleepwear flame test or tight-fitting cut with the yellow hangtag; snaps, zippers, buttons and print inks lead-tested at 100 and 90 parts per million; a Children's Product Certificate filed electronically at the border; a permanent tracking label; no hood or neck drawstring from 2T to 12; pull test on attachments to size 2." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">One print, two rulebooks: the same pajama set, adult piece vs child&rsquo;s piece</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Child = sized above 9 months to 14 · US federal rules as of September 2026</text>

                                        {/* column headers */}
                                        <rect x="0" y="66" width="200" height="34" rx="6" fill="#E9E4DC" />
                                        <text x="12" y="88" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">Requirement</text>
                                        <rect x="212" y="66" width="360" height="34" rx="6" fill="#E9E4DC" />
                                        <text x="224" y="88" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">Adult piece (wearing apparel)</text>
                                        <rect x="584" y="66" width="376" height="34" rx="6" fill="#2D2A2E" />
                                        <text x="596" y="88" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF">Child&rsquo;s piece (children&rsquo;s product)</text>

                                        {[
                                            { k: "Flammability", a: "16 CFR 1610 only; plain fabric ≥ 2.6 oz/yd² exempt", c: "Sleepwear flame test, or tight-fitting cut + yellow hangtag" },
                                            { k: "Lead in trims & inks", a: "Not required", c: "Tested: 100 ppm components, 90 ppm inks and coatings" },
                                            { k: "Certificate", a: "Usually none (GCC only if 1610 applies)", c: "Children's Product Certificate, eFiled at entry" },
                                            { k: "Tracking label", a: "Not required", c: "Permanent: maker, place, date, batch — garment and pack" },
                                            { k: "Drawstrings", a: "Allowed", c: "None at hood/neck 2T–12; ≤ 3 in at waist 2T–16" },
                                            { k: "Attachments", a: "No pull test", c: "Pull test to size 2: 10 lb under 18 months, 15 lb to 36 months" },
                                        ].map((r, i) => {
                                            const y = 112 + i * 52;
                                            return (
                                                <g key={r.k}>
                                                    <line x1="0" y1={y + 40} x2="960" y2={y + 40} stroke="#E0DCD5" strokeWidth="1" />
                                                    <text x="12" y={y + 24} fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">{r.k}</text>
                                                    <text x="224" y={y + 24} fontFamily="Helvetica, Arial, sans-serif" fontSize="12.5" fill="#4A484A">{r.a}</text>
                                                    <circle cx="596" cy={y + 19} r="4" fill="#CBB49A" />
                                                    <text x="608" y={y + 24} fontFamily="Helvetica, Arial, sans-serif" fontSize="12.5" fontWeight="600" fill="#2D2A2E">{r.c}</text>
                                                </g>
                                            );
                                        })}

                                        <text x="0" y="452" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators · CPSC clothing guidance, 16 CFR 1610, 1615/1616, 1120, 1500.51–52 · infant sizes ≤ 9 months exempt from the sleepwear rule within the stated lengths</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Custom kidswear manufacturing in one table. Drawstrings: none at hood or neck on children&rsquo;s outerwear 2T&ndash;12, and no more than 3 inches outside the channel at the waist 2T&ndash;16 (<a href="https://www.cpsc.gov/FAQ/Drawstrings-in-Children%E2%80%99s-Upper-Outerwear" target="_blank" rel="noopener noreferrer" className={ext}>CPSC, 16 CFR 1120</a>). Buttons and zipper pulls are exempt from the small-parts rule, but CPSC asks for a pull test on garments up to size 2: 10 lb under 18 months, 15 lb to 36 (<a href="https://www.law.cornell.edu/cfr/text/16/1500.51" target="_blank" rel="noopener noreferrer" className={ext}>16 CFR 1500.51</a>, <a href="https://www.law.cornell.edu/cfr/text/16/1500.52" target="_blank" rel="noopener noreferrer" className={ext}>1500.52</a>).
                                    </figcaption>
                                </figure>
                            </section>

                            {/* H2 3 */}
                            <section id="fabric-fit" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Custom kidswear manufacturing: one fabric, six size tables
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro at a seam where two fabrics in the same green-and-navy tartan meet: a brushed cotton flannel with a raised nap on the left, a dense smooth cotton-spandex rib knit on the right — the two fabrics a family pajama set is usually cut from, one for the adults and one for the snug-fit kids clothing production. No text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Choose the fabric for the strictest wearer. Cotton will not pass the flame test without a chemical finish, so a cotton kids&rsquo; pajama is cut snug and tagged; polyester knits usually can be made to pass. A brushed flannel is a <em>raised-surface</em> fabric, so the adult piece loses the 2.6-ounce exemption and needs the general test too.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Fit catches founders from adult apparel. ASTM publishes separate body-measurement tables for infants, little kids, girls, boys, misses and men (<a href="https://www.astm.org/membership-participation/technical-committees/committee-d13/subcommittee-d13/jurisdiction-d1355" target="_blank" rel="noopener noreferrer" className={ext}>ASTM D13.55</a>) &mdash; six tables, six blocks <em>(the base pattern every size is graded from)</em>. A child has a larger head, no waist, and diaper room in toddler sizes. Draft the kids&rsquo; piece first: the tight-fitting measurements are ceilings, so the oversized adult silhouette cannot be mirrored down. Match the print, let the silhouette differ, and write both blocks into the <Link href="/blogs/what-is-a-tech-pack" className={ext}>tech pack</Link>.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Family-Set Compliance Checklist</h4>
                                        <p className="text-[#4A484A] leading-snug">One page: which rule attaches to which piece by size, the exact hangtag and tracking-label wording, and the lab tests to order per component. PDF.</p>
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
                            <section id="calendar" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Matching family outfits in the USA: four dates and the calendar behind them
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Demand arrives in bursts &mdash; holiday pajamas from early November to about 20 December, the fall photo session in September and October, reunions and the Fourth in matching tees, Easter in spring. A first cut-and-sew run takes about 23 weeks by sea, a reorder about 12, decorated stock blanks six to eight (<Link href="/blogs/clothing-production-timeline" className={ext}>the 23 weeks</Link>; <Link href="/blogs/holiday-custom-apparel-2026-production-planning" className={ext}>the blanks route</Link>). Commit on 16 September and a new set lands on <strong>24 February 2027</strong>.
                                </p>

                                <div className="not-prose my-8 overflow-x-auto rounded-2xl border border-gray-200">
                                    <table className="min-w-[640px] w-full text-sm">
                                        <thead>
                                            <tr className="bg-[#F8F7F4] text-left">
                                                <th className="px-4 py-3 font-bold text-[#2D2A2E]">Occasion</th>
                                                <th className="px-4 py-3 font-bold text-[#2D2A2E]">Sells</th>
                                                <th className="px-4 py-3 font-bold text-[#2D2A2E]">Stock needed by</th>
                                                <th className="px-4 py-3 font-bold text-[#2D2A2E]">Commit a first run by (23 weeks)</th>
                                                <th className="px-4 py-3 font-bold text-[#2D2A2E]">Still open from 16 Sept 2026?</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Holiday pajamas 2026</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Early Nov &ndash; 20 Dec</td>
                                                <td className="px-4 py-3 text-[#4A484A]">1 November 2026</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Late May 2026 &mdash; passed</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Decorated blanks only (lands 11 Nov)</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Easter / spring photos 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">March &ndash; early April</td>
                                                <td className="px-4 py-3 text-[#4A484A]">1 March 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Late September 2026</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Yes &mdash; this fortnight, one style</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Reunion / Fourth tees 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">June &ndash; August</td>
                                                <td className="px-4 py-3 text-[#4A484A]">1 June 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Late December 2026</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Yes &mdash; or decorate blanks in April</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Fall photo outfits 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">September &ndash; October</td>
                                                <td className="px-4 py-3 text-[#4A484A]">15 August 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Early March 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Yes &mdash; the sensible first cut-and-sew target</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Holiday pajamas 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Early Nov &ndash; 20 Dec</td>
                                                <td className="px-4 py-3 text-[#4A484A]">1 November 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Late May 2027</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Yes &mdash; the big one</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    So this December is matching tees and sweatshirts on blanks, and <Link href="/blogs/dtf-vs-screen-printing-right-for-volume" className={ext}>film transfer</Link> is the method at those quantities. The cut-and-sew line is a 2027 project, aimed first at the fall photo season. Design it to carry over: a plaid with no year on it sells next December at full price; a &ldquo;Christmas 2026&rdquo; chest print is a markdown on the 26th.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="factory" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Kids clothing production: what changes on the factory floor
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Testing becomes a line item per style. Trims change: nickel-free snaps, no functional drawstrings, and for anything sized for a baby, fabric and trims certified to OEKO-TEX Standard 100 Class I, the strictest class, for children up to 36 months (<a href="https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100/" target="_blank" rel="noopener noreferrer" className={ext}>OEKO-TEX</a>). On the floor, a kidswear line keeps a broken-needle log, passes every carton through a metal detector and trims every thread end, because a loose loop inside a sleeve can wrap a small finger.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Then the number founders resist. A size-4 pajama uses perhaps a third of the fabric of an adult XL and almost the same sewing minutes. Price it at half the adult&rsquo;s because it looks half the size, and the half of the set that drives the order is the half that loses money (<Link href="/blogs/custom-clothing-manufacturing-cost" className={ext}>where the minutes sit</Link>).
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="sku-math" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Family photo outfit sets without tripling your SKU count
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Women XS&ndash;XL, men XS&ndash;XL, kids 2T to 14 in ten steps, baby in six: <strong>26 SKUs per print</strong>, 78 for three prints, each with a size curve <em>(how many of each size you buy)</em> you are guessing at. The disciplined run is 17.
                                </p>

                                <div className="not-prose my-8 overflow-x-auto rounded-2xl border border-gray-200">
                                    <table className="min-w-[560px] w-full text-sm">
                                        <thead>
                                            <tr className="bg-[#F8F7F4] text-left">
                                                <th className="px-4 py-3 font-bold text-[#2D2A2E]">Per print</th>
                                                <th className="px-4 py-3 font-bold text-[#2D2A2E]">The naive run</th>
                                                <th className="px-4 py-3 font-bold text-[#2D2A2E]">The disciplined run</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr><td className="px-4 py-3 font-semibold text-[#2D2A2E]">Women</td><td className="px-4 py-3 text-[#4A484A]">XS&ndash;XL &middot; 5</td><td className="px-4 py-3 text-[#4A484A]">XS&ndash;XL &middot; 5</td></tr>
                                            <tr><td className="px-4 py-3 font-semibold text-[#2D2A2E]">Men</td><td className="px-4 py-3 text-[#4A484A]">XS&ndash;XL &middot; 5</td><td className="px-4 py-3 text-[#4A484A]">S&ndash;XL &middot; 4</td></tr>
                                            <tr><td className="px-4 py-3 font-semibold text-[#2D2A2E]">Kids</td><td className="px-4 py-3 text-[#4A484A]">2T&ndash;14 in ten steps, boys and girls blocks &middot; 10</td><td className="px-4 py-3 text-[#4A484A]">One unisex block: 2T, 4, 6, 8, 10, 12 &middot; 6</td></tr>
                                            <tr><td className="px-4 py-3 font-semibold text-[#2D2A2E]">Baby</td><td className="px-4 py-3 text-[#4A484A]">0&ndash;3 to 24 months &middot; 6</td><td className="px-4 py-3 text-[#4A484A]">One snug romper, 3&ndash;6 and 6&ndash;9 months (infant-exempt) &middot; 2</td></tr>
                                            <tr className="bg-[#F8F7F4]"><td className="px-4 py-3 font-bold text-[#2D2A2E]">SKUs per print</td><td className="px-4 py-3 font-bold text-[#2D2A2E]">26</td><td className="px-4 py-3 font-bold text-[#2D2A2E]">17</td></tr>
                                            <tr><td className="px-4 py-3 font-semibold text-[#2D2A2E]">Prints</td><td className="px-4 py-3 text-[#4A484A]">3 &rarr; <strong>78 SKUs</strong></td><td className="px-4 py-3 text-[#4A484A]">2 &rarr; <strong>34 SKUs</strong></td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One fabric across the whole family, so there is one strike-off <em>(the printed test swatch you approve)</em>, one dye lot and one lab report. One unisex kids&rsquo; block; nobody has ever returned a 6 because it was not a &ldquo;boys&rsquo; 6&rdquo;. Baby as a single snug romper in the two infant-exempt sizes.
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="Studio photograph against a near-black backdrop: a full-size adult tailor's form and a toddler-size form side by side in matching navy-and-cream striped pajamas — the adult cut loose, the child's cut snug and tapered at wrist and ankle as the children's sleepwear rule requires. Hard side light, no people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    In your shoes we would build the child&rsquo;s pajama first &mdash; snug cotton-spandex, one print, six sizes &mdash; prove it through the lab once, then draw the adult piece to match. Which print would you bet a dye lot on?
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-7">
                                    {faqs.map((f) => (
                                        <div key={f.q}>
                                            <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">{f.q}</h3>
                                            <p className="text-base lg:text-lg leading-snug text-[#4A484A]">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* About Krazy Kreators */}
                            <div className="not-prose mt-12 mb-4 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">About Krazy Kreators</p>
                                <p className="text-[#4A484A] leading-snug">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className={ext}>design</Link>, sampling, <Link href="/manufacturing-services" className={ext}>fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className={ext}>under one roof</Link>, from first sketch to shelf. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/cpsc-efiling-sb-707-apparel-compliance-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">CPSC eFiling and California SB 707: the 2026 apparel compliance rules</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The adult side of the flammability line, and what the certificate you now file at the border is quietly deciding about your shipments.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the compliance piece <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Send us your print and we&rsquo;ll size the family</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">The artwork, the fabric you have in mind and the occasion you are aiming at. A Krazy Kreators production lead comes back with the snug-fit kids&rsquo; block, the adult block to match, the tests each piece needs, and a date it lands &mdash; with an honest note if the window is already shut.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Send your print <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/clothing-production-timeline",
                                            title: "From Sketch to Store: A Real Clothing Production Timeline",
                                            dek: "The 23 weeks behind every date in this post, drawn week by week.",
                                            read: "11 min read",
                                        },
                                        {
                                            href: "/blogs/holiday-custom-apparel-2026-production-planning",
                                            title: "Holiday 2026 Custom Apparel Playbook",
                                            dek: "The decorated-blanks route that is still open for this December.",
                                            read: "5 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "Where the snug-fit dimensions and the two blocks get written down.",
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
                        Send your print &mdash; we&rsquo;ll size the family and date it <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
