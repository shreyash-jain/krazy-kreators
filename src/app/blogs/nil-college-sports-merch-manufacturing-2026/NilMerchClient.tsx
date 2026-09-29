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

const BLOG_ID = "nil-college-sports-merch-manufacturing-2026";

const HERO_IMAGE = "/blog/nil-college-sports-merch-manufacturing-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/nil-college-sports-merch-manufacturing-2026-section1.jpg";
const MACRO_IMAGE = "/blog/nil-college-sports-merch-manufacturing-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/nil-college-sports-merch-manufacturing-2026-closing.jpg";

const TOC = [
    { id: "nil-boom", label: "How NIL became a product business" },
    { id: "what-athletes-need", label: "What a manufacturing partner owes them" },
    { id: "formats", label: "The formats actually selling" },
    { id: "one-design-many-skus", label: "One graphic, six SKUs" },
    { id: "season-calendar", label: "Built around a season, not a calendar" },
    { id: "brand-consistency", label: "Keeping the brand consistent" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function NilMerchClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("nil-boom");
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
        showToast("Launch checklist on the way to your inbox.", "success");
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
                    alt="A small campus print shop late in the evening after a home game: a heat press mid-cycle with steam lifting off a folded stack of plain grey hoodies, a rolling rack of blank tees behind, a worker's back and forearms bent over the press. NIL merch manufacturing in progress. No faces, no logos, no school crests."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 18, 2026</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        NIL and College Sports Merch Boom:<br />
                        How Manufacturing Partners Are Meeting Demand in 2026
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The deals move at the speed of a viral clip. The garments now have to move just as fast &mdash; and that is a manufacturing problem, not a marketing one.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · September 18, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• NIL athlete earnings are projected to hit <strong>$4.5 billion</strong> in 2026-27, up 61% from last year&rsquo;s estimate &mdash; and merch-specific platforms are now built specifically to turn a design into a product.</li>
                            <li>• A manufacturing partner needs three things a wholesale account never asked for: real <strong>low MOQ</strong>, turnaround measured in days, and a clean line between what the athlete owns and what the school owns.</li>
                            <li>• Any merch royalty worth <strong>$600 or more</strong> now gets filed with a Deloitte-run compliance clearinghouse &mdash; so a clean paper trail matters almost as much as print quality.</li>
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
                                        <Link href="/blogs/no-moq-clothing-manufacturers" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">MOQ</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">No MOQ clothing manufacturers: what you really pay</p>
                                        </Link>
                                        <Link href="/blogs/the-drop-culture-model" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Drops</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The drop culture model</p>
                                        </Link>
                                        <Link href="/blogs/tenniscore-wimbledon-us-brands-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sports &amp; culture</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Tennis-core won Wimbledon. Can your brand?</p>
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
                                On March 31, a platform called NIL Club opened storefronts for college athletes who had never sourced a garment in their life.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                It called the feature Athlete Merch: pick a graphic, tie it to your name, and it becomes a sellable product within days (<a href="https://www.prnewswire.com/news-releases/nil-club-introduces-athlete-merch-giving-student-athletes-a-new-way-to-earn-302729870.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">PR Newswire</a>). Nobody on the platform asked where the shirt actually gets printed.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                That gap is now real money. Opendorse &mdash; the firm the industry itself uses to track this &mdash; puts total 2026-27 NIL athlete earnings at $4.5 billion, 61% higher than the estimate it published twelve months earlier (<a href="https://biz.opendorse.com/blog/nil-market-size-2026/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Opendorse</a>). A growing slice of that is not an appearance fee or a sponsored post; it is a physical product with one person&rsquo;s name on it, made to order and shipped to a stranger&rsquo;s door. That is <strong>NIL merch manufacturing</strong>, and it runs on a different clock than any university licensing office ever did.
                            </p>

                            {/* H2 1 */}
                            <section id="nil-boom" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How NIL turned athletes into apparel founders
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For most of NIL&rsquo;s first four years, that money bought an athlete&rsquo;s face for someone else&rsquo;s product. LSU gymnast Livvy Dunne fronted a national ad campaign for the activewear brand Vuori (<a href="https://businessofcollegesports.com/marketingpr/livvy-dunne-promotes-vuoris-newest-activewear-line/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Business of College Sports</a>). The athlete supplied the audience. Someone else&rsquo;s warehouse, quality control and factory relationships supplied the actual product.
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A cluttered small-business fulfillment desk: two hands folding a plain heather-grey hoodie into a shipping box, a roll of shipping labels and a tape gun at the edge of frame, an order screen glowing softly out of focus behind. College athlete apparel brand fulfillment, no face, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    2026 changed the second half of that sentence. NIL Club&rsquo;s Athlete Merch uses built-in design tools to take an athlete from an idea to a sellable graphic fast, without a design team of their own. Individual schools are building the same thing at campus scale: the University of Denver opened an officially licensed NIL storefront this spring, run through the print company Campus Ink, so any Denver athlete can sell branded gear without negotiating their own manufacturing deal (<a href="https://denverpioneers.com/news/2026/4/22/athletics-nil-store-launches-officially-licensed-apparel-platform-for-denver-athletes" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Denver Pioneers</a>).
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Part of the reason is the House settlement. Schools can now pay athletes directly, up to a cap of roughly $20.5 million per school for 2025-26 that climbs every year of the ten-year deal (<a href="https://www.espn.com/college-sports/story/_/id/45467505/judge-grants-final-approval-house-v-ncaa-settlement" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">ESPN</a>). That cap did not slow spending down. It pushed schools, collectives and agents toward everything sitting above it, and Opendorse counts an extra $735 million in athlete earnings coming from exactly those above-cap deals this year. Merchandise, run correctly, is one of the few above-cap categories an athlete can own outright.
                                </p>
                            </section>

                            {/* H2 2 */}
                            <section id="what-athletes-need" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What NIL apparel manufacturing actually requires from a partner
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A university athletics department is a stable, patient customer: one order a year, placed months ahead, paid on invoice. An individual athlete with a merch drop is nothing like that. They need speed, real low minimums, and &mdash; the part a lot of print shops skip &mdash; a clear line between what they own and what the school owns.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That line matters more than it looks. An athlete&rsquo;s NIL rights cover their own name, image and likeness &mdash; not their university&rsquo;s trademarks, colors, mascot or logo, which stay school property unless the school signs off on a co-licensing deal (<a href="https://sportslitigationalert.com/trademark-considerations-for-the-ncaas-nil-policy/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Sports Litigation Alert</a>). Plenty of schools have simply declined to sign off. That is the real reason so much NIL merch reads as a jersey number, a nickname or a signature phrase rather than a team crest: it is the safe side of a line the athlete doesn&rsquo;t get to draw for themselves.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    There is a second line now, and it is new for 2026. Any third-party NIL deal worth $600 or more has to be filed with NIL Go, the review platform Deloitte runs for the College Sports Commission, within five days of being signed. The CSC has cleared more than 17,000 of those deals worth over $127 million &mdash; and rejected more than 500 worth almost $15 million, mostly for lacking a real business reason or a market-based price (<a href="https://africa.espn.com/espn/story/_/id/47591684/college-watchdog-group-rejected-500-plus-nil-deals-worth-nearly-15-million" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">ESPN</a>). A merch royalty between an athlete and a factory is exactly the kind of deal that draws that scrutiny.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;None of this makes the factory a law firm. It means the paper trail is now part of the product.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    A manufacturing partner who can produce a real per-unit royalty structure, an actual invoice and a shipped-unit count is doing part of the athlete&rsquo;s compliance work along with the printing. One who can&rsquo;t is handing the athlete&rsquo;s agent a problem instead of a product.
                                </p>
                            </section>

                            {/* H2 3 */}
                            <section id="formats" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The formats actually selling: game-day tees, warm-ups, limited drops
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three formats cover almost everything moving right now. A <strong>game-day tee</strong>, built around one specific matchup and meant to sell out before kickoff and go stale by Monday. A <strong>warm-up or hoodie</strong> carrying the athlete&rsquo;s own number or nickname rather than the team&rsquo;s branding, worn as everyday streetwear instead of fan gear. And a <strong>limited drop</strong> tied to a single moment &mdash; a viral highlight, a senior night, a walk-off &mdash; priced and positioned like a collectible rather than a restockable product.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    What ties the three together is that none of them is planned on a season calendar. They are triggered by an event, and the event sets the deadline. A clip that goes viral on Saturday creates demand that is real by Sunday and mostly gone by the following weekend &mdash; which is a genuinely tighter production brief than the low-inventory drop model DTC brands already use (<Link href="/blogs/the-drop-culture-model" className="underline text-[#CBB49A] hover:text-[#b7a078]">our earlier piece on the drop-culture model</Link>).
                                </p>
                            </section>

                            {/* H2 4 */}
                            <section id="one-design-many-skus" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    One graphic, six SKUs: building a real line from a single drop
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of a heat press lifting off a plain cotton t-shirt, a DTF transfer film peeling away from the fabric at one corner, individual threads catching raking light with a thin curl of steam. NIL clothing line production detail, no legible lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Most athletes start with exactly one piece of intellectual property &mdash; a signature, a number, a catchphrase &mdash; and need it to become six or eight sellable SKUs almost overnight: a tee in two colors, a hoodie, a cap, maybe a crewneck. That is a different job than designing six garments. It is one graphic, applied fast and cleanly across garments that already exist.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Print method decides how fast that happens. A direct-to-film transfer gets printed once and pressed onto a tee, a hoodie and a cap with no new screens or setup cost per color &mdash; which is why DTF, not screen printing, is the default at NIL order volumes, where a single drop might be a few hundred units split across five SKUs rather than a few thousand of one style (<Link href="/blogs/dtf-vs-screen-printing-right-for-volume" className="underline text-[#CBB49A] hover:text-[#b7a078]">our DTF-versus-screen-printing breakdown</Link>).
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The bigger decision is private label versus custom. Private label means printing on a blank garment that already exists, and it can ship in three to five weeks. A fully custom garment, built from the athlete&rsquo;s own pattern and fabric, takes fourteen to twenty-six weeks &mdash; most of it before a single unit is cut (<Link href="/blogs/private-label-vs-custom-clothing-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">the private-label-versus-custom math</Link>). An NIL merch window rarely has fourteen weeks in it.
                                </p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 1020 300" role="img" aria-label="Timeline in weeks from 0 to 26 comparing private label production at 3 to 5 weeks and fully custom production at 14 to 26 weeks against three NIL commercial windows: a single game week at 1 week, a tournament run at 3 weeks, and a full college season at 13 weeks. Only private label finishes inside a game week or a tournament run, and custom production does not even finish inside a full season." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">Why private label is the only lane that fits inside a live season</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Weeks from the day a design is approved</text>

                                        {/* week axis: 0-26 weeks, x = 200 + week*30 */}
                                        {[0, 5, 10, 15, 20, 25].map((w) => (
                                            <g key={w}>
                                                <line x1={200 + w * 30} y1="70" x2={200 + w * 30} y2="230" stroke="#E0DCD5" strokeWidth="1" />
                                                <text x={200 + w * 30} y="246" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">{w}wk</text>
                                            </g>
                                        ))}

                                        {/* Commercial windows as dashed markers */}
                                        <line x1={200 + 1 * 30} y1="70" x2={200 + 1 * 30} y2="230" stroke="#2D2A2E" strokeWidth="1.5" strokeDasharray="3 3" />
                                        <text x={200 + 1 * 30} y="62" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="600" fill="#2D2A2E" textAnchor="middle">Game week</text>
                                        <line x1={200 + 3 * 30} y1="70" x2={200 + 3 * 30} y2="230" stroke="#2D2A2E" strokeWidth="1.5" strokeDasharray="3 3" />
                                        <text x={200 + 3 * 30 + 6} y="62" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="600" fill="#2D2A2E">Tournament run</text>
                                        <line x1={200 + 13 * 30} y1="70" x2={200 + 13 * 30} y2="230" stroke="#2D2A2E" strokeWidth="1.5" strokeDasharray="3 3" />
                                        <text x={200 + 13 * 30 + 6} y="62" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="600" fill="#2D2A2E">Full season</text>

                                        {/* Private label bar: 3-5 weeks */}
                                        <text x="188" y="140" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Private label</text>
                                        <rect x={200 + 3 * 30} y="122" width={(5 - 3) * 30} height="30" rx="4" fill="#CBB49A" />
                                        <text x={200 + 5 * 30 + 8} y="142" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#2D2A2E">3&ndash;5 weeks</text>

                                        {/* Custom bar: 14-26 weeks */}
                                        <text x="188" y="200" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Custom pattern</text>
                                        <rect x={200 + 14 * 30} y="182" width={(26 - 14) * 30} height="30" rx="4" fill="#8C7355" />
                                        <text x={200 + 14 * 30 + 8} y="202" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill="#FFFFFF">14&ndash;26 weeks</text>

                                        <line x1="200" y1="230" x2="980" y2="230" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="278" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators · private label and custom lead times per our private-label-vs-custom breakdown · season lengths are calendar facts, not survey data</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        A full custom pattern doesn&rsquo;t even clear a full 13-week season. Private label is the only format that reliably beats a live commercial window.
                                    </figcaption>
                                </figure>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The NIL Merch Launch Checklist</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page rundown: the trademark line between an athlete&rsquo;s own NIL and a school&rsquo;s marks, what to have ready before a deal crosses the $600 NIL Go threshold, a starter SKU grid (tee, hoodie, cap), and the private-label lead times from the chart above.</p>
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

                            {/* H2 5 */}
                            <section id="season-calendar" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Built around a season, not a retail calendar
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Traditional apparel plans around buying markets that sit months apart, and a factory calendar built for that rhythm can hold a twenty-three-week lead time without anyone losing money on it (<Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">our week-by-week production timeline</Link>). A college season doesn&rsquo;t offer that room. A football regular season runs about thirteen weeks. March Madness compresses an entire tournament into three. A single-elimination loss can end an athlete&rsquo;s commercial peak on a Tuesday.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That is the argument for building the season into the plan rather than reacting to it: pre-approve the SKU set and the blank garments before the season opens, so the only thing that has to happen fast once a moment hits is printing and shipping, not sourcing and sampling. It&rsquo;s the same logic a holiday apparel plan runs backward from a fixed shipping cutoff (<Link href="/blogs/holiday-custom-apparel-2026-production-planning" className="underline text-[#CBB49A] hover:text-[#b7a078]">our holiday production playbook</Link>) &mdash; except the deadline here is a scoreboard, not a calendar date, and nobody tells you in advance which week it lands.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The counterexample is the athlete whose season never really ends &mdash; a pro prospect whose name keeps selling well past their last college game. For everyone else, a merch line built for one live season and wound down cleanly afterward is the more honest plan than treating a single drop like the start of a permanent product line.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="brand-consistency" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Keeping one athlete&rsquo;s brand consistent as the portfolio grows
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A small warehouse packing station late at night: a short stack of identical plain shipping boxes ready to go, a few folded hoodies and caps staged beside an open box, a worker's back mid-motion taping a box shut. Athlete branded apparel production at drop volume, no faces, no logos."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The risk changes once an athlete has shipped four or five drops instead of one. A slightly different shade of grey between the first hoodie and the third, a transfer that cracks after two washes, a cap that runs a size small &mdash; none of it reads as a print-quality issue anymore. It reads as a trust issue, because the entire appeal of NIL merch is that it is genuinely that person&rsquo;s, not mass merch with a name printed on.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The fix is the one wholesale apparel brands already use: one point of production accountability across every SKU and every drop, instead of re-sourcing a new blank or a new print vendor each time the design changes. That consistency is invisible when it works and very visible in a one-star review when it doesn&rsquo;t.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    This doesn&rsquo;t apply evenly across the market. An athlete whose NIL value is large enough to run a real operation &mdash; a handful of football and basketball stars carry a disproportionate share of that $4.5 billion figure &mdash; can absorb an in-house apparel team. For the far larger group of athletes now filing their first $600 NIL Go report, the manufacturing relationship isn&rsquo;t a vendor. For a season or two, it&rsquo;s the entire operation.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-7">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Can a college athlete put their school&rsquo;s logo on their own merchandise?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Not without the school&rsquo;s separate permission. NIL rights cover an athlete&rsquo;s own name, image and likeness &mdash; not a university&rsquo;s trademarks, colors, mascot or logo, which stay school property unless the athlete and school agree to a co-licensing deal. Many schools have declined to grant that, which is why most NIL merch uses a number or nickname instead of a crest.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What NIL deals actually have to go through NIL Go?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Any third-party NIL agreement worth $600 or more has to be reported to NIL Go, the Deloitte-run system the College Sports Commission uses, within five days of signing. As of the CSC&rsquo;s most recent public figures, more than 17,000 deals worth over $127 million have been cleared, and more than 500 worth almost $15 million have been rejected &mdash; mostly for lacking a real business purpose or a market-based price.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How big is the NIL merchandise market in 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Opendorse projects total 2026-27 NIL athlete earnings at $4.5 billion, up 61% from the estimate it published a year earlier. Merch-specific platforms are a visible piece of that growth &mdash; NIL Club&rsquo;s Athlete Merch launched in March 2026 specifically to help athletes turn a design into a sellable product rather than another appearance fee.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What&rsquo;s a realistic first order size for an NIL merch drop?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">The same range that works for any small brand&rsquo;s first run: roughly ten to thirty units per style through a sample-room minimum, rather than the few hundred per color a standard wholesale factory asks for (<Link href="/blogs/no-moq-clothing-manufacturers" className="underline text-[#CBB49A] hover:text-[#b7a078]">our no-MOQ cost breakdown</Link>). That is enough to test one design across a few SKUs without betting a season&rsquo;s NIL income on unsold inventory.</p>
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
                                <Link href="/blogs/no-moq-clothing-manufacturers" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">No MOQ Clothing Manufacturers: What You Really Pay</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The real per-unit math behind the ten-to-thirty-unit runs an NIL merch drop actually needs.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Talk to a Krazy Kreators production lead about your first NIL run</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Send the graphic, the garments you want it on, and the date it needs to ship by. A production lead comes back with a private-label SKU plan and a realistic turnaround &mdash; and tells you plainly if the window has already closed.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Send your graphic <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/the-drop-culture-model",
                                            title: "The 'Drop Culture' Model: Strategies for Sold-Out Collections",
                                            dek: "Why low-MOQ drops sell out without inventory risk — the mechanic behind every NIL limited drop.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/private-label-vs-custom-clothing-manufacturing",
                                            title: "Private Label vs Custom Clothing Manufacturing",
                                            dek: "The 3–5 week private-label lane versus the 14–26 week custom one, worked in full.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/dtf-vs-screen-printing-right-for-volume",
                                            title: "DTF vs. Screen Printing: Which Is Right for Your Volume?",
                                            dek: "Why one design across five SKUs favors DTF over screens at NIL order sizes.",
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
                        Talk to us about your first NIL merch run <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
