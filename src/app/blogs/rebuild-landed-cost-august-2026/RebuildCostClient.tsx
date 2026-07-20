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

const BLOG_ID = "rebuild-landed-cost-august-2026";

const HERO_IMAGE = "/blog/rebuild-cost-august-hero.jpg";
const STACK_IMAGE = "/blog/rebuild-cost-august-section1.jpg";
const TABLE_IMAGE = "/blog/rebuild-cost-august-teaching.jpg";
const CLOSING_IMAGE = "/blog/rebuild-cost-august-closing.jpg";

const TOC = [
    { id: "what-changed", label: "The date passed. Your cost sheet didn't." },
    { id: "entry-not-po", label: "Duty follows the entry date, not the PO" },
    { id: "tee-three-ways", label: "The $14 tee's August landed cost, three ways" },
    { id: "fixed-fees", label: "The fees that don't care who wins in court" },
    { id: "rebuild-four-lines", label: "Rebuild the sheet in four lines" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
    { id: "bottom-line", label: "The bottom line" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function RebuildCostClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("what-changed");
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
                    alt="A US third-party-logistics receiving dock at dawn — poly-wrapped apparel cartons stacked on a wooden pallet, a printed cost sheet on a clipboard resting in the soft-focus foreground, long raking morning light across sealed concrete. No people, no readable logos or text."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">9 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">July 20, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        After the Cliff:<br className="hidden sm:block" /> Rebuild Your Cost Sheet for August
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Duty is assessed the day your goods clear customs — not the day you signed the PO. Here&apos;s the landed-cost rebuild that survives all three post-July outcomes.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · July 20, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Section 122&apos;s 10% blanket lapsed <strong>July 24</strong>. Goods clearing customs in August pay whatever regime is live <em>then</em> — not the rate you costed at in spring.</li>
                            <li>• Cost a $14 tee three ways: <strong>16.5%</strong> if the blanket lapses clean, <strong>26.5%</strong> at Section 301&apos;s 10% floor, <strong>29%</strong> at 12.5% — a $1.75/unit swing.</li>
                            <li>• Rebuild on <strong>landed cost</strong>: duty at the clearance-date scenario, plus the fixed CBP fees, consolidated into one entry, with a pass-through clause.</li>
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
                                        <Link href="/blogs/apparel-tariffs-july-2026-forced-labor-301-regime" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The 10% tariff floor expires July 24 — then what?</p>
                                        </Link>
                                        <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The US-Plus-One sourcing playbook for 2026</p>
                                        </Link>
                                        <Link href="/blogs/us-fashion-brands-moving-from-china-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Why US brands are moving production from China</p>
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
                                The cliff everyone spent June bracing for had an anticlimax built into it: nothing on your cost sheet actually changed the moment it passed.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Section 122&apos;s flat 10% surcharge hit its 150-day statutory limit on July 24, 2026 and lapsed — the President can&apos;t renew it alone (<a href="https://www.congress.gov/crs-product/IF13199" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Congressional Research Service</a>). What comes next is a duty assessed the day your goods clear US customs, which for a Fall program is sometime in August — not the day you signed the PO in May.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                So the sheet you built at 26.5% is now a guess about a number that gets fixed at the dock. This is the rebuild — line by line, across all three outcomes still on the table.
                            </p>

                            {/* H2 1 */}
                            <section id="what-changed" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The date passed. Your cost sheet didn&apos;t
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={STACK_IMAGE}
                                        alt="A single finished natural-cotton crew tee draped over a matte-black display form, one hard directional shaft of studio light raking across the shoulder and sleeve, deep falloff into shadow behind. No tags, no logos, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three outcomes are live for goods clearing in August, and your cost sheet has to hold up under each. The first: the blanket lapses with nothing behind it, and duty falls to the <strong>MFN rate</strong> alone <em>(most-favored-nation — the WTO baseline every member&apos;s goods pay), about 16.5% on a cotton knit tee</em> (<a href="https://www.tariffstool.com/guides/section-122-expires-july-24-2026-importer-playbook" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Tariffs Tool</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The second and third are USTR&apos;s <strong>Section 301 forced-labor duties</strong> <em>(a trade action sorting suppliers by whether they ban forced-labor imports)</em>. The proposal sets <strong>+10%</strong> for the 14 economies that prohibit such imports — Bangladesh, Cambodia, Pakistan, Indonesia, Mexico — and <strong>+12.5%</strong> for the 46 that don&apos;t, a group that includes China, India and Vietnam (<a href="https://www.whitecase.com/insight-alert/ustr-proposes-10-125-tariffs-section-301-investigations-regulation-imports-produced" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">White &amp; Case</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    We mapped the full country-by-country stack in <Link href="/blogs/apparel-tariffs-july-2026-forced-labor-301-regime" className="underline text-[#CBB49A] hover:text-[#b7a078]">the breakdown of the 10% floor and what replaces it</Link>. The point here is narrower: your August number is no longer a rate you know. It&apos;s a range you have to plan around.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;For a few months the blanket made every sourcing country cost the same. August is where that flat line fractures back into a spread — sorted by policy, not price.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="entry-not-po" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Duty follows the entry date, not the PO
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here&apos;s the mechanic that trips up most cost sheets: US Customs assesses duty at the rate in force on the <strong>date of entry</strong> <em>(when the goods are released into US commerce)</em> — not the day you ordered, and not the day the container left the origin port. Goods that clear in August pay August&apos;s regime.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That&apos;s why the 10% you locked into a spring PO tells you almost nothing about what you&apos;ll actually owe. The June re-costing exercise — done <Link href="/blogs/july-24-tariff-cliff-recost-fall-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">before the cliff, while the blanket still applied</Link> — protected the order. This one protects the clearance.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One real exception is worth pricing in. If your goods originate in Mexico and qualify under <strong>USMCA</strong> yarn-forward rules, the 16.5% MFN line can fall to zero — though how the new Section 301 duty interacts with USMCA origin is still unsettled, so confirm it with your broker before you bank the saving.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your cost sheet is still living in July</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• The duty line still reads a flat 10%, carried over from the spring PO.</li>
                                        <li>• Landed cost is pegged to order date, not projected clearance date.</li>
                                        <li>• There&apos;s one duty figure on the sheet, not a low-mid-high range.</li>
                                        <li>• Nobody has asked the broker which regime an August entry will hit.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 3 */}
                            <section id="tee-three-ways" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The $14 tee&apos;s August landed cost, three ways
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={TABLE_IMAGE}
                                        alt="A clean branded infographic titled 'The $14 tee's August landed cost, three ways' — three stacked columns (122 lapses; Section 301 at 10%; Section 301 at 12.5%) breaking a cotton tee into FOB, duty, and the fixed CBP fees, totalling $16.43, $17.83 and $18.18. Indigo and steel-blue bars on off-white, flat editorial data-viz, no photographic elements."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Put a real garment through it: a blank cotton knit tee at <strong>$14 FOB</strong> <em>(free on board — the supplier&apos;s price at the origin port, before freight and duty)</em>, on a 5,000-unit run cleared as one consolidated ocean entry. Duty is assessed on that customs value.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3"><strong>The duty line, three ways:</strong></p>
                                <ul className="space-y-1.5 text-[#2D2A2E] leading-snug mb-4 list-disc pl-5">
                                    <li><strong>Blanket lapses (MFN only):</strong> 16.5% = <strong>$2.31/tee</strong></li>
                                    <li><strong>Section 301 at 10%</strong> (Bangladesh, Cambodia): 16.5% + 10% = 26.5% = <strong>$3.71/tee</strong></li>
                                    <li><strong>Section 301 at 12.5%</strong> (India, Vietnam): 16.5% + 12.5% = 29% = <strong>$4.06/tee</strong></li>
                                    <li><strong>China</strong> adds its legacy 7.5% List 4A duty on top: 36.5% = <strong>$5.11/tee</strong></li>
                                </ul>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Set China aside and the swing across the three mainstream outcomes is <strong>$1.75 a tee</strong> — about <strong>$8,750</strong> of unknown on that 5,000-piece run. That&apos;s the number your Fall margin has to be able to absorb, not the single figure sitting on the sheet today.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Cost at the low number and a mid-outcome eats your margin. Cost at the high number and a lapse hands it back. Only one of those mistakes is recoverable.&rdquo;
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The August Landed-Cost Rebuild Worksheet</h4>
                                        <p className="text-[#4A484A] leading-snug">One page that runs any FOB price and quantity across all three post-July scenarios — duty, MPF, HMF and brokerage baked in — and flags the margin gap between the low and high outcome. PDF.</p>
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
                            <section id="fixed-fees" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The fees that don&apos;t care who wins in court
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    While everyone watches the duty line, three smaller charges sit underneath it and don&apos;t move with the tariff fight at all. They&apos;re the reason a rebuilt sheet has to be landed cost, not FOB plus a duty guess.
                                </p>
                                <ul className="space-y-1.5 text-[#2D2A2E] leading-snug mb-4 list-disc pl-5">
                                    <li>The <strong>Merchandise Processing Fee (MPF)</strong> — 0.3464% of customs value on a formal entry, floored at $33.58 and capped at $651.50 for FY2026 (<a href="https://www.cbp.gov/trade/basic-import-export/user-fee-table" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">US Customs and Border Protection</a>).</li>
                                    <li>The <strong>Harbor Maintenance Fee (HMF)</strong> — 0.125% of value on ocean shipments, same source.</li>
                                    <li><strong>Customs brokerage</strong> — roughly $150–$400 per formal entry in 2026 (<a href="https://www.greenwich-mercantile.com/resources/guides/customs-broker-cost" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Greenwich Mercantile</a>).</li>
                                </ul>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    On our 5,000-unit consolidated entry that&apos;s about <strong>$0.05</strong> MPF, <strong>$0.02</strong> HMF and <strong>$0.05</strong> brokerage per tee — roughly <strong>$0.12</strong> a unit. Trivial at that scale, which is exactly the tell: these are near-fixed <em>per entry</em>, so they punish fragmentation, not volume.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Split that same run into small direct shipments and the brokerage alone can outrun the duty — the math that <Link href="/blogs/de-minimis-end-us-brands-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">broke the ship-direct model when the $800 de minimis exemption ended</Link>. Consolidation is the one landed-cost lever the court docket can&apos;t touch.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="rebuild-four-lines" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Rebuild the sheet in four lines
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    You don&apos;t need to predict which outcome lands. You need a sheet that stays solvent under any of them.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>One — cost on landed, not FOB.</strong> Roll duty, MPF, HMF, brokerage and freight into the unit number, so the figure you price against is the one that clears customs. <strong>Two — use the clearance-date scenario.</strong> Cost against the regime your August entry will actually hit; if it&apos;s still unresolved, cost at the worst credible case (12.5%) and treat a lapse to 16.5% as recovered margin, not a surprise.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Three — consolidate entries.</strong> One bulk import into a US 3PL beats fragmented parcels on every fixed fee, and it&apos;s the move a <Link href="/blogs/us-plus-one-sourcing-playbook-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">split-origin sourcing plan</Link> should be built around. <strong>Four — name who eats the delta.</strong> A tariff pass-through clause between order and clearance decides, in advance, whether you or the factory absorbs a mid-shipment change — so a ruling in August doesn&apos;t become a renegotiation.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    One nuance can lower the ceiling: the Section 301 proposal carries a <strong>textile mechanism</strong> that would let a set volume of apparel from certain economies enter at a reduced rate (<a href="https://www.tariffstool.com/guides/section-122-expires-july-24-2026-importer-playbook" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Tariffs Tool</a>). If your origin qualifies, your August number could sit below the headline — worth confirming before you assume the worst case.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">The four-line rebuild, at a glance</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• <strong>Landed, not FOB</strong> — duty + MPF + HMF + brokerage + freight in the unit cost.</li>
                                        <li>• <strong>Clearance-date scenario</strong> — cost the worst credible case; a lapse is upside.</li>
                                        <li>• <strong>Consolidate</strong> — one entry, not many, to blunt the fixed fees.</li>
                                        <li>• <strong>Pass-through clause</strong> — decide who absorbs a mid-shipment change now.</li>
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
                                        alt="A freshly printed cost sheet with three side-by-side columns and a small calculator and pen resting on a brushed-steel desk, one hard shaft of window light splitting the frame so half the page is bright and half falls into deep shadow. No faces, no readable text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    We&apos;d re-cost every August-clearing PO at the 29% line and sign nothing whose margin only survives at 16.5%. We&apos;d consolidate the run into a single entry, put a pass-through clause in every open contract, and ask the broker — in writing — which regime our entry date lands under.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    The blanket made every sourcing decision look equal for a few months, and that quiet is over. If your Fall goods cleared customs next week, is your cost sheet built on the rate you paid in spring — or the one you&apos;ll actually owe?
                                </p>
                            </section>

                            {/* Conclusion */}
                            <section id="bottom-line" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The bottom line
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    July 24 didn&apos;t settle your costs — it handed them a range. A cost sheet still quoting a flat 10% is pricing a Fall program against a rate that no longer exists.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Rebuild it on landed cost, at the scenario your clearance date will actually hit, with the fixed fees in and a pass-through clause naming who carries the swing. Do that and the August outcome — lapse, 10% or 12.5% — becomes a number you planned for, not one that plans for you.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-6 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Did Section 122&apos;s 10% tariff really expire on July 24, 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Yes. Section 122 caps a balance-of-payments surcharge at 150 days, and the clock that started February 24 ran out July 24. Only an act of Congress can extend it — the President has no unilateral power to (<a href="https://www.congress.gov/crs-product/IF13199" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">CRS</a>).</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Which duty applies — the rate when I ordered, or when the goods arrive?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">When they arrive. US Customs assesses duty at the rate in force on the date of entry, so goods clearing in August pay August&apos;s regime regardless of when the PO was signed. Cost against projected clearance, not order date.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What are the three scenarios I should cost against?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">The blanket lapsing clean (MFN alone, ~16.5% on a cotton tee); Section 301 forced-labor duty at 10% for the 14 economies that ban forced-labor imports; and 12.5% for the other 46, which include China, India and Vietnam (<a href="https://www.whitecase.com/insight-alert/ustr-proposes-10-125-tariffs-section-301-investigations-regulation-imports-produced" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">White &amp; Case</a>).</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Do the CBP fees change with the tariff outcome?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">No. The MPF (0.3464% of value) and HMF (0.125% on ocean freight) are separate statutory fees, and brokerage is charged per entry (<a href="https://www.cbp.gov/trade/basic-import-export/user-fee-table" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">CBP</a>). Because they&apos;re near-fixed per entry, consolidating shipments — not chasing a cheaper country — is the lever that moves them.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">If duty drops to 16.5%, do I just keep the difference?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Only if your contract says so. Without a pass-through clause, a supplier or customer can lay claim to the saving, and a mid-shipment increase becomes a renegotiation instead of a settled term. Write who carries the swing into the PO before August.</p>
                                    </div>
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/apparel-tariffs-july-2026-forced-labor-301-regime" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The 10% Tariff Floor Expires July 24 — Then What?</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The country-by-country stack that replaces the blanket, and the textile mechanism buried in the fine print.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Rebuild your post-July landed-cost model</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Have a Krazy Kreators lead rebuild your post-July landed-cost model — every August-clearing PO costed across all three outcomes, with consolidation and a pass-through clause built in.</p>
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
                                            dek: "The pre-cliff re-costing that protects the order, not just the clearance.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/de-minimis-end-us-brands-2026",
                                            title: "Every Parcel Pays Now: The End of the $800 Rule",
                                            dek: "Why brokerage can outrun duty — and the case for consolidating.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/us-fashion-brands-moving-from-china-2026",
                                            title: "Why US Fashion Brands Are Moving Production From China",
                                            dek: "The legacy 7.5% that stacks on top of everything else.",
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
                        Have a KK lead rebuild your landed-cost model <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
