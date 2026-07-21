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

const BLOG_ID = "dtc-margin-after-prime-day-2026";

const HERO_IMAGE = "/blog/prime-day-hero.jpg";
const TAG_IMAGE = "/blog/prime-day-section1.jpg";
const TABLE_IMAGE = "/blog/prime-day-teaching.jpg";
const MACRO_IMAGE = "/blog/prime-day-macro.jpg";
const CLOSING_IMAGE = "/blog/prime-day-closing.jpg";

const TOC = [
    { id: "event-ends", label: "The event ends. The settlement doesn't." },
    { id: "make-vs-discount", label: "The make-vs-discount math founders skip" },
    { id: "marketplace-tax", label: "The marketplace tax nobody re-priced" },
    { id: "just-move-units", label: "Why 'just move units' is the trap" },
    { id: "build-margin-back", label: "Building margin back in" },
    { id: "the-move", label: "The move for your next drop" },
    { id: "bottom-line", label: "The bottom line" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function PrimeDayMarginClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("event-ends");
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
                    alt="A small clothing brand's back-office studio late at night, a laptop glowing with a margin spreadsheet out of focus in the foreground, a neat stack of plain folded tees sharp in the mid-ground, a blurred packing station behind, warm low tungsten light. No people, no readable logos."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">July 21, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Prime Day&apos;s Over.<br className="hidden sm:block" /> Your Margin Report Isn&apos;t.
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The event ends in a weekend. The margin damage takes a quarter to surface — and the make-vs-discount math founders skip is the part that prevents it.
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
                            <p className="text-sm text-[#666666]">Covers DTC growth and unit economics for Krazy Kreators · July 21, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• A weekend of discounts shows up as a quarter of thinned margin — the settlement, not the sale, is the real number.</li>
                            <li>• A 30% cut on a 40%-margin tee needs <strong>4× the units</strong> just to hold the same profit dollars.</li>
                            <li>• The lever founders skip isn&apos;t a deeper discount — it&apos;s a lower <strong>landed cost</strong>, which adds margin at every price, on every drop.</li>
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
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Every Parcel Pays Now: the end of the $800 rule</p>
                                        </Link>
                                        <Link href="/blogs/rebuild-landed-cost-august-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">After the Cliff: rebuild your August landed cost</p>
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
                                The deals are gone. The number they created is not.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Prime Day 2026 ran June 23&ndash;26 — four days, Prime-exclusive, with fashion marked up to 40% off (<a href="https://www.aboutamazon.com/news/retail/amazon-prime-day-2026-date" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">About Amazon</a>). That was three weeks ago. The revenue line looked great on June 26.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                The margin line is the one landing right now — in your July settlement, after the refunds clear, the fulfillment fees post, and the ad spend that chased the spike gets counted. This is the part nobody screenshots for the founder group chat.
                            </p>

                            {/* H2 1 */}
                            <section id="event-ends" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The event ends. The settlement doesn&apos;t
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={TAG_IMAGE}
                                        alt="A blank unbranded garment price tag on a string caught in motion blur against a nearly empty clothing rack, one hard shaft of directional light cutting across the frame, everything else in deep shadow. No logos, no readable text, no faces."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A discount is instant. Its cost is not. You gave up margin dollars in a weekend; you&apos;ll spend a quarter finding out how many.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The marketplace discount cycle — Prime Day, then Labor Day, then the Black Friday run, then a &ldquo;New Year&rdquo; clearance — trains two things at once. It trains inventory to move. It also trains your customer to <em>wait</em>, which quietly repriced every full-price week between the events.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <strong>Contribution margin</strong> <em>(what&apos;s left from a sale after the variable cost of making and delivering that unit)</em> is the number that actually pays your rent. Public DTC apparel brands run a median gross margin around 55&ndash;57% (<a href="https://eightx.co/blog/average-dtc-gross-margin-public-companies" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Eightx, SEC 10-K data</a>) — and still go underwater at the contribution line once the discount and the fulfillment stack eat the rest.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The revenue spike is a number you feel on the day. The margin cost is a number you read a quarter later — and by then the next discount window is already open.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="make-vs-discount" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The make-vs-discount math founders skip
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here&apos;s the math that gets skipped, because it&apos;s uncomfortable and it isn&apos;t on the sales dashboard. Take a $50 tee at a 40% gross margin — $30 to make and land, $20 of margin. Watch what each discount tier does to the <em>units you now have to sell just to keep the same profit dollars</em> (<a href="https://www.phoenixstrategy.group/blog/how-discounting-affects-profit-margins" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Phoenix Strategy Group</a>).
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={TABLE_IMAGE}
                                        alt="A clean branded infographic titled 'The Prime-Day discount ladder — a $50 tee at 40% margin' showing four rows: 0% off = $50.00 sale, $20.00 margin per unit, 1.0x units; 10% = $45.00, $15.00, 1.3x; 20% = $40.00, $10.00, 2.0x; 30% = $35.00, $5.00, 4.0x. A rising break-even bar beside a falling margin bar, flat editorial data-viz on off-white. No photographic elements."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <div className="overflow-x-auto mb-5">
                                    <table className="w-full text-left text-sm sm:text-base border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-[#CBB49A]">
                                                <th className="py-2 pr-4 font-bold text-[#2D2A2E]">Discount</th>
                                                <th className="py-2 pr-4 font-bold text-[#2D2A2E]">Sale price</th>
                                                <th className="py-2 pr-4 font-bold text-[#2D2A2E]">Margin kept / unit</th>
                                                <th className="py-2 font-bold text-[#2D2A2E]">Units to hold profit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[#4A484A]">
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">0%</td><td className="py-2 pr-4">$50.00</td><td className="py-2 pr-4">$20.00</td><td className="py-2">1.0×</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">10%</td><td className="py-2 pr-4">$45.00</td><td className="py-2 pr-4">$15.00</td><td className="py-2">1.3×</td></tr>
                                            <tr className="border-b border-gray-200"><td className="py-2 pr-4">20%</td><td className="py-2 pr-4">$40.00</td><td className="py-2 pr-4">$10.00</td><td className="py-2">2.0×</td></tr>
                                            <tr><td className="py-2 pr-4">30%</td><td className="py-2 pr-4">$35.00</td><td className="py-2 pr-4">$5.00</td><td className="py-2">4.0×</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    A 30% cut doesn&apos;t cost you 30%. It quarters your margin per unit, so you need <strong>four times the volume</strong> to stand still. Prime Day gives you a volume bump — rarely a 4× one. The gap is your loss, and it posts in July.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A 30% discount doesn&apos;t cost 30%. It quarters your per-unit margin — and the marketplace fee comes out of what&apos;s left.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3 */}
                            <section id="marketplace-tax" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The marketplace tax nobody re-priced
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    If any of that volume ran through Amazon, a second layer came out before you saw a cent. Apparel <strong>referral fees</strong> are tiered — roughly 5% under $15, 10% from $15&ndash;$20, and about 17% above $20 (<a href="https://ecomcalctools.com/blog/fees-amazon/amazon-clothing-referral-fee/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">EcomCalc</a>), and they&apos;re frozen at those levels through 2026.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Fulfillment moved, though. As of April 17, 2026, Amazon added a <strong>3.5% surcharge on all US FBA fulfillment fees</strong>, on top of a January fee revision (<a href="https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Amazon Selling Partners</a>). Most founders re-priced their retail for the discount and never re-priced for the fee. On that same $50 tee, ~17% referral plus fulfillment plus the discount can leave a contribution margin you&apos;d never have greenlit on paper.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Make-vs-Discount Margin Sheet</h4>
                                        <p className="text-[#4A484A] leading-snug">Drop in your sale price, landed cost, marketplace fee and return rate. It shows your real contribution margin per unit — and the break-even volume for any discount depth. PDF.</p>
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
                                            Send me the sheet
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Worksheet on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="just-move-units" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why &ldquo;just move units&rdquo; is the trap
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The instinct after a soft margin report is to run another promo and make it up on volume. In apparel, three forces make that the most expensive instinct you have.
                                </p>
                                <ul className="space-y-2 text-[#2D2A2E] leading-snug mb-5 list-disc pl-5">
                                    <li><strong>Returns.</strong> Apparel returns run 25&ndash;40% of gross sales, and a 30% return rate can raise your <em>realized</em> customer acquisition cost by around 43% on the customers who keep the product (<a href="https://ask-luca.com/blogs/ecommerce-profit-margins" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Luca</a>). A discount-driven buyer returns more, not less.</li>
                                    <li><strong>Repeat rate.</strong> Apparel has the lowest repeat-purchase rate in DTC — under 10% (<a href="https://eightx.co/blog/average-cac-ecommerce-vertical" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Eightx</a>). A discount buyer rarely comes back at full price to fix the economics.</li>
                                    <li><strong>CAC.</strong> Apparel customer acquisition costs sit near $90 (<a href="https://eightx.co/blog/average-cac-ecommerce-vertical" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Eightx</a>). Spend that to acquire a one-time, deep-discount, high-return buyer and the unit was underwater before it shipped.</li>
                                </ul>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>The counterexample — when the discount is the right call.</strong> Sometimes it is. Clearing end-of-life inventory, funding a genuine first-order acquisition play with a real repeat engine behind it, or avoiding a carrying cost that exceeds the margin you&apos;d give up — those make a deep cut the disciplined move, not the desperate one. Markdown <em>optimization</em> (right depth, right timing) is shown to lift margin rate by 4&ndash;8 points versus reflexive, across-the-board cuts (<a href="https://onebeat.co/blog/markdown-effectiveness-in-retail-how-to-phase-discounts-without-killing-margin/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Onebeat</a>). The problem is never discounting. It&apos;s discounting without the math.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your Prime Day was a margin loss, not a win</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Revenue set a record but July contribution margin fell versus a normal week.</li>
                                        <li>• Return rate on discounted orders is running above your full-price baseline.</li>
                                        <li>• You needed the next promo to move the inventory the last promo left behind.</li>
                                        <li>• Your retail price was re-set for the discount but never for the 2026 marketplace fees.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 5 */}
                            <section id="build-margin-back" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Building margin back in — before the next drop
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of a cotton jersey tee's knit loops and one clean flatlock seam, raking side light revealing texture and individual threads, very shallow depth of field. No logos, no readable text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here&apos;s the lever the discount conversation skips entirely: the <strong>make</strong> side. A discount <em>subtracts</em> margin per unit and trains the customer to wait. A lower landed cost <em>adds</em> margin per unit — at full price, at every price, on every future drop, with no behavior to un-train. They point in opposite directions.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Shave that $50 tee&apos;s landed cost from $30 to $27 — through better fabric sourcing, a tighter tech pack, smarter trims, consolidated production — and you&apos;ve added $3 of margin per unit at full price. That&apos;s more durable profit than a 15%-off weekend delivers, and the customer never learns to hold out for it. It&apos;s the difference between the <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="underline text-[#CBB49A] hover:text-[#b7a078]">real cost of the wrong clothing manufacturer</Link> and a make partner who builds margin headroom in at the tech-pack stage.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Do it before the sample is approved, not after the settlement lands. And read it alongside the two costs already moving underneath you: the <Link href="/blogs/july-24-tariff-cliff-recost-fall-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">July 24 tariff cliff</Link> and the <Link href="/blogs/rebuild-landed-cost-august-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">August landed-cost rebuild</Link>. Margin you design in survives the discount cycle. Margin you discount away doesn&apos;t come back.
                                </p>
                            </section>

                            {/* H2 6 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The move for your next drop
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A single plain premium unbranded t-shirt on a matte display form under clean soft directional studio light, window light and a wood floor behind, no tags or sale stickers in sight. No logos, no readable text, no faces."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Prime Day is a volume event wearing a growth costume. The founders who win the next one aren&apos;t the ones who discount deeper — they&apos;re the ones who walked in with enough margin headroom that a promotion is a choice, not a rescue.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    So before the Labor Day window opens: which of your top sellers could carry a 40% marketplace discount and <em>still</em> clear contribution margin — and which ones can&apos;t, no matter how many units move? If you can&apos;t answer that per SKU, that&apos;s the sheet to run this week. What would you do — cut the discount, or fix the make?
                                </p>
                            </section>

                            {/* Conclusion */}
                            <section id="bottom-line" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Prime Day didn&apos;t grow your margin — it borrowed against it, and the July settlement is the bill. A brand still reading the revenue spike as the result is measuring the wrong number.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Cost every SKU on contribution margin, know its break-even volume before you set a discount depth, and put the real work into the make — because $3 of landed cost taken out at the tech pack beats a discount weekend on every drop that follows. Do that and the next event is a lever you pull on purpose, not a hole you spend a quarter climbing out of.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-6 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">When was Prime Day 2026, and why does the margin hit land in July?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Prime Day 2026 ran June 23&ndash;26 (<a href="https://www.aboutamazon.com/news/retail/amazon-prime-day-2026-date" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">About Amazon</a>). The revenue posts on the day, but refunds, fulfillment fees and ad spend settle over the following weeks — so the true DTC profit margin shows up in the July report, not on the sales dashboard.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How much extra volume does a Prime Day discount need to break even?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">On a 40%-gross-margin item, a 10% discount needs about 1.3× the units to hold the same profit dollars, a 20% discount needs 2×, and a 30% discount needs 4× (<a href="https://www.phoenixstrategy.group/blog/how-discounting-affects-profit-margins" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Phoenix Strategy Group</a>). Most events don&apos;t deliver a 4× volume lift — the gap is your margin loss.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What are Amazon&apos;s 2026 apparel fees?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Apparel referral fees are tiered — about 5% under $15, 10% from $15&ndash;$20, and ~17% above $20 (<a href="https://ecomcalctools.com/blog/fees-amazon/amazon-clothing-referral-fee/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">EcomCalc</a>) — and frozen through 2026. FBA fulfillment carries a 3.5% surcharge added April 17, 2026 (<a href="https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Amazon Selling Partners</a>).</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Is discounting always bad for margin?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">No. Clearing end-of-life stock, funding a real acquisition play with a repeat engine behind it, or avoiding carrying costs can justify a deep cut. Markdown optimization lifts margin rate 4&ndash;8 points over reflexive cuts (<a href="https://onebeat.co/blog/markdown-effectiveness-in-retail-how-to-phase-discounts-without-killing-margin/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Onebeat</a>). The issue is discounting without the break-even math.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What is the &ldquo;make-vs-discount&rdquo; math?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">A discount subtracts margin per unit and trains customers to wait. Lowering landed cost adds margin per unit at full price — permanently, on every drop. Shaving $3 off a $30 landed cost beats a 15%-off weekend and costs you no future full-price sales.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How do I know if my Prime Day was actually a loss?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Compare July&apos;s contribution margin to a normal full-price week, check whether discounted orders returned above baseline, and confirm your retail was re-priced for 2026 marketplace fees — not just for the promo.</p>
                                    </div>
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/de-minimis-end-us-brands-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Every Parcel Pays Now: The End of the $800 Rule</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The de-minimis change that just re-priced every unit you import — and why brokerage can outrun duty.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Build margin back into your next drop</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to Krazy Kreators about building margin back into your next drop — a lower landed cost designed in at the tech pack, so a promotion stays a choice, not a rescue.</p>
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
                                            dek: "What the end of de-minimis does to your per-unit cost.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/rebuild-landed-cost-august-2026",
                                            title: "After the Cliff: Rebuild Your Cost Sheet for August",
                                            dek: "Three duty scenarios and the real August landed cost of a $14 tee.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/the-real-cost-of-wrong-clothing-manufacturer",
                                            title: "The Real Cost of the Wrong Clothing Manufacturer",
                                            dek: "Where margin quietly leaks between sketch and shelf.",
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
                        Build margin back into your next drop <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
