"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Check, MessageSquare, Share2, Heart, MessageCircle, X } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";
import { FAQS } from "./faqs";

const BLOG_ID = "mistakes-new-fashion-brand-founders-make";

const HERO_IMAGE = "/blog/mistakes-new-fashion-brand-founders-make-hero.jpg";
const SECTION1_IMAGE = "/blog/mistakes-new-fashion-brand-founders-make-section1.jpg";
const MACRO_IMAGE = "/blog/mistakes-new-fashion-brand-founders-make-macro.jpg";
const GARMENT_IMAGE = "/blog/mistakes-new-fashion-brand-founders-make-garment.jpg";
const CLOSING_IMAGE = "/blog/mistakes-new-fashion-brand-founders-make-closing.jpg";

const LINK = "underline text-[#A4682F] hover:text-[#7E4F22]";
const EXT = { target: "_blank", rel: "noopener noreferrer" } as const;
const H2 = "font-serif text-3xl lg:text-[2.5rem] font-bold leading-[1.12] text-[#2D2A2E] mb-6";
const P = "text-base lg:text-lg leading-snug text-[#4A484A] mb-4";

// Sources, each linked on first mention in the body.
const BLS = "https://www.bls.gov/bdm/bdmage.htm";
const HTS = "https://hts.usitc.gov/search?query=61091000";
const USTR = "https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-takes-action-forced-labor-section-301-investigations";
const NRF = "https://nrf.com/research/2025-retail-returns-landscape";
const FTC_GUIDES = "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides";
const FTC_INFLUENCERS = "https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers";
const FTC_LABELS = "https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts";
const FTC_CARE = "https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule";
const AATCC = "https://members.aatcc.org/store/tm150/556";

// This post's palette: a warm clay accent for the mistakes, on sand.
const CLAY = "#B5532F";
const SAND = "#F5EFE6";
const INK = "#2D2A2E";
const SERIF = "font-serif";

// The teaching graphic. `made` is the stage where the decision is taken, `felt` the stage where it starts to cost money.
const STAGES = ["Idea", "Brand", "Samples", "Costing", "Bulk", "Launch", "After"];
const MISTAKES = [
    { id: "audience", n: 1, short: "No defined customer", made: 0, felt: 5, cost: "slow sell-through" },
    { id: "positioning", n: 2, short: "Weak positioning", made: 1, felt: 5, cost: "launch content falls flat" },
    { id: "manufacturer", n: 3, short: "Wrong manufacturer", made: 2, felt: 4, cost: "bulk doesn't match the sample" },
    { id: "pricing", n: 4, short: "Pricing off the quote", made: 3, felt: 6, cost: "margin gone after duty and returns" },
    { id: "marketing", n: 5, short: "No marketing plan", made: 4, felt: 5, cost: "a quiet launch day" },
    { id: "inventory", n: 6, short: "No demand planning", made: 4, felt: 6, cost: "cash stuck in stock" },
    { id: "after-launch", n: 7, short: "Launch as the finish line", made: 5, felt: 6, cost: "no second orders" },
];

const TOC = [
    { id: "overview", label: "Where the mistakes hide" },
    ...MISTAKES.map((m) => ({ id: m.id, label: `${m.n}. ${m.short}` })),
    { id: "lessons", label: "What 50+ launches taught us" },
    { id: "checklist", label: "Pre-launch checklist" },
    { id: "final-thoughts", label: "Final thoughts" },
    { id: "faqs", label: "FAQs" },
];

// The brief's nine checklist items, each pointing back to the section that covers it.
const CHECKLIST = [
    { item: "Define your target audience", to: "audience" },
    { item: "Research your competitors", to: "audience" },
    { item: "Establish your brand identity", to: "positioning" },
    { item: "Finalize your product range", to: "inventory" },
    { item: "Validate manufacturing quality", to: "manufacturer" },
    { item: "Calculate pricing and profit margins", to: "pricing" },
    { item: "Prepare your marketing strategy", to: "marketing" },
    { item: "Plan inventory and fulfillment", to: "inventory" },
    { item: "Build a customer retention strategy", to: "after-launch" },
];

// The close: what Krazy Kreators does against each mistake. Every line is taken from the site's own service and case-study pages.
const WHERE_WE_HELP: Record<string, React.ReactNode> = {
    audience: <><Link href="/design-services" className={LINK}>Trend and forecast research</Link> comes before the first sketch, so the fit, the fabric and the price have a customer to answer to.</>,
    positioning: <>We develop the collection and the labels around your brand identity. Badria Al Shihhi said what impressed her most was &ldquo;their ability to translate my personal style into a cohesive brand identity.&rdquo;</>,
    manufacturer: <>Tech packs, in-house sampling, fit approvals and AQL inspections <em>(a standard method for sampling bulk quality)</em> are all <Link href="/manufacturing-services" className={LINK}>managed by us</Link>, with photos and video from the floor as it runs. Defects beyond the agreed limits get repaired, replaced or credited under the contract.</>,
    pricing: <><Link href="/end-to-end-services" className={LINK}>Open costing</Link> on request: a breakdown of fabric yield, trims, cut and make, wastage, packaging, testing and logistics, so you set the price with the real numbers in front of you.</>,
    marketing: <>For <Link href="/case-studies/badri-al-shihhi" className={LINK}>Badria Al Shihhi</Link> we planned the photoshoot from creative direction to execution, then guided the launch through her website, store opening and fashion-show debut.</>,
    inventory: <>With your forecast we can pre-book fabric or loom time to shorten reorders, and <Link href="/end-to-end-services/raw-materials" className={LINK}>stored raw materials</Link> keep the shade, weave and trims the same from one run to the next.</>,
    "after-launch": <>Your approved patterns and specs stay on file with us, so a fit correction from your return reasons can go into the next run.</>,
};

function Kicker({ n }: { n: number }) {
    return (
        <p className="not-prose flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: CLAY }}>
            <span className={`${SERIF} text-2xl normal-case tracking-normal`} style={{ color: INK }}>{String(n).padStart(2, "0")}</span>
            <span className="h-px w-10 bg-[#CBB49A]" />
            Mistake {n} of 7
        </p>
    );
}

function Avoid({ children }: { children: React.ReactNode }) {
    return (
        <p className={P}>
            <strong className="text-[#2D2A2E]">How to avoid it:</strong> {children}
        </p>
    );
}

// A short scenario for each mistake. Illustrative, and labelled as such on the page, so it can't be read as a client's history.
function Happens({ children }: { children: React.ReactNode }) {
    return (
        <aside className="not-prose my-7 rounded-2xl border border-[#2D2A2E]/15 bg-white px-5 py-5 sm:px-6 shadow-sm">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2.5">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#2D2A2E]">What actually happens</span>
                <span className="text-[11px] italic text-[#8C7355]">illustration</span>
            </p>
            <p className="text-base lg:text-[17px] leading-snug text-[#2D2A2E]">{children}</p>
        </aside>
    );
}

function Signs({ items }: { items: React.ReactNode[] }) {
    return (
        <aside className="not-prose my-7 rounded-2xl border-l-4 px-5 py-4 sm:px-6" style={{ borderColor: CLAY, backgroundColor: SAND }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: CLAY }}>Signs you&rsquo;re making this mistake</p>
            <ul className="space-y-1.5">
                {items.map((it, i) => (
                    <li key={i} className="flex gap-2.5 text-[15px] leading-snug text-[#2D2A2E]">
                        <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: CLAY }} />
                        <span className="text-[#2D2A2E]">{it}</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

// Teaching graphic: where each mistake is made, and where it starts to cost money.
function HiddenCostMap({ onJump }: { onJump: (id: string) => void }) {
    const pct = (i: number) => `${((i + 0.5) / STAGES.length) * 100}%`;
    return (
        <figure className="not-prose my-10 rounded-3xl border border-[#E6DCCD] p-5 sm:p-7" style={{ backgroundColor: SAND }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: CLAY }}>Made here, paid for later</p>
            <p className="text-sm text-[#666666] mb-6 leading-snug">
                Each line runs from the stage where the decision gets made to the stage where it starts to cost money. The longer the line, the longer it stays hidden.
            </p>

            {/* Stage header */}
            <div className="grid mb-2" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(0, 1fr))` }}>
                {STAGES.map((s) => (
                    <p key={s} className="text-center text-[9.5px] leading-tight sm:text-xs font-semibold sm:uppercase sm:tracking-wide text-[#8C7355]">{s}</p>
                ))}
            </div>

            <div className="relative">
                {/* Column guides */}
                <div aria-hidden className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${STAGES.length}, minmax(0, 1fr))` }}>
                    {STAGES.map((s) => (
                        <div key={s} className="flex justify-center"><span className="w-px h-full bg-[#DCCFBC]" /></div>
                    ))}
                </div>

                <ol className="relative space-y-4">
                    {MISTAKES.map((m) => (
                        <li key={m.id}>
                            <button onClick={() => onJump(m.id)} className="block w-full text-left group">
                                <p className="text-[13px] sm:text-sm leading-tight mb-1.5 px-0.5">
                                    <span className="font-bold text-[#2D2A2E] group-hover:underline">{m.n}. {m.short}</span>
                                    <span className="text-[#6B6560]"> · felt as {m.cost}</span>
                                </p>
                                <div className="relative h-4">
                                    <span className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full" style={{ left: pct(m.made), right: `calc(100% - ${pct(m.felt)})`, backgroundColor: CLAY, opacity: 0.85 }} />
                                    <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm" style={{ left: pct(m.made), backgroundColor: INK }} />
                                    <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rotate-45 border-2 bg-white" style={{ left: pct(m.felt), borderColor: CLAY }} />
                                </div>
                            </button>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="mt-6 pt-4 border-t border-[#DCCFBC] flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#4A484A]">
                <span className="inline-flex items-center gap-2 text-[#4A484A]"><span className="h-3 w-3 rounded-full inline-block" style={{ backgroundColor: INK }} /> Where the decision is made</span>
                <span className="inline-flex items-center gap-2 text-[#4A484A]"><span className="h-3 w-3 rotate-45 inline-block border-2 bg-white" style={{ borderColor: CLAY }} /> Where it starts to cost money</span>
                <span className="text-[#4A484A]">Bulk = bulk order and pre-launch</span>
            </div>
            <figcaption className="mt-3 text-xs text-[#999999] leading-snug">
                Krazy Kreators · how common fashion startup mistakes surface across a fashion brand launch strategy, drawn from 50+ launches · stages, not weeks
            </figcaption>
        </figure>
    );
}

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function FounderMistakesClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("overview");
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
    const [ticked, setTicked] = useState<Set<number>>(new Set());
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

    const scrollToId = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
    };

    const toggleTick = (i: number) => {
        setTicked((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Scroll progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent">
                <div className="h-full transition-[width] duration-150" style={{ width: `${scrollProgress}%`, backgroundColor: CLAY }} />
            </div>

            <Navbar invertTabs={false} />

            {/* Hero: split editorial layout on sand, then a numbered strip of the seven mistakes */}
            <section className="pt-24 lg:pt-28" style={{ backgroundColor: SAND }}>
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-center pb-10 lg:pb-14">
                    <div className="order-2 lg:order-1">
                        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs sm:text-sm">
                            <span className="px-3 py-1 rounded-full text-white font-semibold uppercase tracking-wider" style={{ backgroundColor: INK }}>Growth &amp; Business</span>
                            <span className="text-[#4A484A] font-medium">Founder field notes</span>
                            <span className="text-[#999999]">•</span>
                            <span className="text-[#4A484A]">9 min read · November 4, 2026</span>
                        </div>
                        <h1 className={`${SERIF} text-[2rem] sm:text-5xl xl:text-[3.4rem] font-bold leading-[1.06] text-[#2D2A2E] mb-5`}>
                            7 Common Mistakes New Fashion Brand Founders Make (And How to Avoid Them)
                        </h1>
                        <p className="text-lg sm:text-xl text-[#4A484A] leading-snug max-w-xl">
                            Lessons from launching 50+ fashion brands. Most of these mistakes are made months before anyone notices them.
                        </p>
                    </div>
                    <figure className="order-1 lg:order-2 relative">
                        <div className="relative aspect-[16/10] rounded-[28px] overflow-hidden shadow-2xl">
                            <Image
                                src={HERO_IMAGE}
                                alt="A small clothing label's studio in late afternoon light, a rail of finished samples beside a worktable of paper patterns, the stage of starting a clothing brand where most fashion startup mistakes are made. No people, no logos."
                                fill
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </figure>
                </div>
                {/* Seven-mistake strip */}
                <div className="grid grid-cols-7" style={{ backgroundColor: INK }}>
                    {MISTAKES.map((m) => (
                        <button key={m.id} onClick={() => scrollToId(m.id)} className="group border-r border-white/10 last:border-r-0 px-1 sm:px-3 py-3 sm:py-4 text-left hover:bg-white/5 transition-colors" aria-label={`Jump to mistake ${m.n}: ${m.short}`}>
                            <span className={`${SERIF} block text-lg sm:text-2xl text-[#E2B99A]`}>{String(m.n).padStart(2, "0")}</span>
                            <span className="hidden md:block text-xs leading-tight text-white/80 group-hover:text-white">{m.short}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Body */}
            <section className="py-14 sm:py-16 lg:py-20 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">

                    {/* Interaction bar */}
                    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-4">
                        <p className="text-sm text-[#4A484A]"><span className="font-semibold text-[#2D2A2E]">Krazy Kreators Team</span> · Growth &amp; Business · Business · November 4, 2026</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200 text-sm font-medium transition-all duration-300">
                                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                            </button>
                            <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                                <MessageCircle className="w-4 h-4" />
                                {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                            </button>
                            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 hover:opacity-90" style={{ backgroundColor: INK }}>
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-12">
                        {[
                            <>Most of these mistakes are <strong>made months before they cost anything</strong>, which is why they go unnoticed.</>,
                            <>Price from landed cost. A $14 tee from India pays <strong>$3.71 in US duty</strong> before freight.</>,
                            <>Plan the <strong>90 days after launch</strong> before you launch.</>,
                        ].map((txt, i) => (
                            <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: SAND }}>
                                <p className={`${SERIF} text-3xl mb-2`} style={{ color: CLAY }}>{i + 1}</p>
                                <p className="text-[#2D2A2E] leading-snug">{txt}</p>
                            </div>
                        ))}
                    </div>

                    {/* Mobile jump pills */}
                    <div className="lg:hidden mb-10 -mx-4 px-4 overflow-x-auto">
                        <div className="flex gap-2 min-w-max pb-2">
                            {TOC.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => scrollToId(t.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${activeSection === t.id ? "text-white border-transparent" : "bg-white text-[#4A484A] border-gray-200"}`}
                                    style={activeSection === t.id ? { backgroundColor: INK } : undefined}
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
                                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: CLAY }}>On this page</p>
                                <ol className="space-y-2.5">
                                    {TOC.map((t) => (
                                        <li key={t.id}>
                                            <button
                                                onClick={() => scrollToId(t.id)}
                                                className={`text-left text-sm leading-snug transition-colors ${activeSection === t.id ? "text-[#2D2A2E] font-semibold" : "text-[#666666] hover:text-[#2D2A2E]"}`}
                                            >
                                                {t.label}
                                            </button>
                                        </li>
                                    ))}
                                </ol>

                                <div className="mt-10">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: CLAY }}>You might also like</p>
                                    <div className="space-y-4">
                                        <Link href="/blogs/80-percent-us-clothing-brands-fail-5-years-operational-mistakes" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Growth &amp; Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The 4 operational mistakes behind failed clothing brands</p>
                                        </Link>
                                        <Link href="/blogs/custom-clothing-manufacturing-cost" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Costing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Custom clothing manufacturing cost, tier by tier</p>
                                        </Link>
                                        <Link href="/blogs/what-is-a-tech-pack" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Production</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What is a tech pack?</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {railState === "pinned" && <div aria-hidden style={{ height: tocNaturalHeight }} />}
                        </aside>

                        {/* Article */}
                        <article ref={articleRef} className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Opening */}
                            <section id="overview" className="scroll-mt-28">
                                <p className="text-lg lg:text-xl text-[#2D2A2E] leading-snug mb-5 font-medium">
                                    <span className={`${SERIF} float-left text-[4.2rem] leading-[0.8] mr-2 mt-1.5`} style={{ color: CLAY }}>M</span>
                                    ost of the founders we work with already have taste. Across the 50+ brands we have helped launch, the ones who struggled rarely had a bad product. They had made one early decision, usually about the customer or the price, that nobody tested until the money was spent.
                                </p>
                                <p className={P}>
                                    That isn&rsquo;t unique to fashion. Of the US businesses that opened in March 2021, 47.2% were still operating five years later, according to the <a href={BLS} {...EXT} className={LINK}>Bureau of Labor Statistics</a>. Clothing brands close for ordinary reasons too, and the reasons are usually visible well before the first order ships.
                                </p>
                                <p className={`${P} mb-8`}>
                                    These are the seven mistakes new fashion brand founders make most often, in roughly the order they make them. Each section shows how the mistake plays out in the garment, on the cost sheet or in the stockroom, and ends with warning signs you can check against your own plan. The &ldquo;what actually happens&rdquo; boxes are illustrations with round numbers, not accounts of specific clients; where we name a brand, the details come from its case study. Our <Link href="/blogs/costly-mistakes-startup-make" className={LINK}>earlier list of ten</Link> covers wider ground, including cash flow.
                                </p>

                                <HiddenCostMap onJump={scrollToId} />
                            </section>

                            {/* 1 — Audience */}
                            <section id="audience" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n={1} />
                                <h2 className={H2}>1. Starting Without Understanding Your Target Audience</h2>
                                <p className={P}>
                                    Most briefs we receive start with a product, a heavyweight hoodie, say, or a resort shirt. The customer comes later and is often described as someone like the founder. Designing for your own taste is how most labels begin, and it can work, but you are one buyer and you already like the product.
                                </p>
                                <p className={P}>
                                    In clothing, the customer decides things founders tend to treat as design choices. Their body sets the fit block <em>(the base pattern every size is graded from)</em> and the size range. Where they live sets the fabric weight.
                                </p>
                                <Happens>
                                    A founder orders 300 boxy hoodies in 400 GSM fleece <em>(grams per square meter, about 12 oz per square yard)</em>, sizes S to XL, at $85. The Instagram page picks up followers, mostly women in Texas and Florida. They like the look, ask for an XS and say it&rsquo;s too warm to wear until December. The hoodie is well made, but it was cut for a customer nobody defined, and most of the run is still boxed up in spring.
                                </Happens>

                                <div className="not-prose rounded-3xl overflow-hidden my-8 max-w-2xl mx-auto">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="An empty boutique fitting room in warm evening light, a single camel overshirt on a brass hook beside a half-drawn linen curtain: the moment a customer decides, which a new fashion brand has to understand before it designs. No people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className={P}>
                                    The founder of <Link href="/case-studies/las" className={LINK}>Las Loungewear</Link> did it the other way round. She knew who she was dressing: women who spend long hours traveling and want support without looking like they&rsquo;re in gym clothes.
                                </p>
                                <p className={P}>
                                    She didn&rsquo;t yet know the fabrics or the silhouettes. Those came out of our research into travelwear in the US and Gulf markets, which had a direction because the customer was already clear.
                                </p>
                                <Avoid>
                                    describe one customer in a sentence, including where they shop now and what they pay there. Look at what those brands charge for the piece you want to make, and fit your sample on someone who matches the description. Then test demand with a waitlist or pre-orders before you commit to a full run.
                                </Avoid>
                                <Signs items={[
                                    <>You describe your customer as &ldquo;anyone who likes streetwear.&rdquo;</>,
                                    <>Nobody outside your friends has seen a sample.</>,
                                ]} />
                            </section>

                            {/* 2 — Positioning */}
                            <section id="positioning" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n={2} />
                                <h2 className={H2}>2. Ignoring Brand Identity and Positioning</h2>
                                <p className={P}>
                                    Founders often give the logo weeks and the positioning an afternoon. Positioning is the harder question: why would someone buy your shirt instead of a similar one from five other labels? Without a clear answer the website and the Instagram grid start saying different things, and customers trust the brand less even when they can&rsquo;t say why.
                                </p>
                                <p className={P}>
                                    The answer also has to show up in the garment, because customers judge a brand with their hands. A claim of premium gets tested by the fabric weight, the trims <em>(buttons, zips, labels and other attached components)</em> and how the seams are finished on the inside.
                                </p>
                                <Happens>
                                    A founder launches &ldquo;premium everyday basics&rdquo; with a beautiful logo and a $48 tee. The tee is 140 GSM jersey, thin enough to see through in a pale color, and it twists at the side seam after two washes. The first comment on the launch post asks why it costs $48. The founder runs a discount in week two, and that becomes the price customers remember.
                                </Happens>
                                <p className={P}>
                                    <Link href="/case-studies/tilted-lotus" className={LINK}>Tilted Lotus</Link> began with a position before a product. Preeti Gore, its Houston-based founder, wanted South Asian art on contemporary silhouettes, made as slow fashion. Every later choice, up to the collection shown at New York Fashion Week, could be checked against that line.
                                </p>
                                <Avoid>
                                    write a one-sentence positioning statement before you brief a designer. Then hold every touchpoint up against it, from the fabric and the woven label to the product photos.
                                </Avoid>
                                <Signs items={[
                                    <>Your logo is finished but you can&rsquo;t say in one sentence why someone should buy from you.</>,
                                    <>Your website, packaging and product photos look like they belong to different brands.</>,
                                ]} />
                            </section>

                            {/* 3 — Manufacturer */}
                            <section id="manufacturer" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n={3} />
                                <h2 className={H2}>3. Choosing the Wrong Manufacturing Partner</h2>
                                <p className={P}>
                                    The usual story is a sample that&rsquo;s right and a bulk order that isn&rsquo;t. The fabric arrives lighter or a size runs small, and the invoice has already been paid. Sample quality that didn&rsquo;t hold in bulk was a problem <Link href="/case-studies/drover" className={LINK}>Drover</Link>, <Link href="/case-studies/hy-official" className={LINK}>HY Official</Link> and Tilted Lotus all listed before they started working with us.
                                </p>
                                <p className={P}>
                                    Part of the reason is that samples and bulk are made differently. A sample comes from a sample room&rsquo;s most experienced machinists and a few yards of fabric. Bulk goes through a production line on a fabric lot nobody may have tested, which is why the sample that matters most is the pre-production sample <em>(the final sample, made from the actual bulk fabric)</em>.
                                </p>
                                <Happens>
                                    A founder approves a hoodie sample and pays for 500 units. The bulk fleece comes from a different fabric lot, and nobody washes a test piece. After one wash, a customer&rsquo;s medium fits like a small. The tech pack set no shrinkage limit, so the factory says the garment is within its normal range, and the returns land on the founder.
                                </Happens>

                                <div className="not-prose grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 items-center my-8">
                                    <div className="rounded-3xl overflow-hidden">
                                        <Image
                                            src={MACRO_IMAGE}
                                            alt="Extreme close-up of the shoulder yoke of a washed indigo western shirt, two rows of even topstitching beside a plain pearl snap, the kind of construction detail a sample and a bulk run must match. No text, no logos."
                                            width={1024}
                                            height={1024}
                                            sizes="(max-width: 640px) 100vw, 24rem"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                            Drover makes western shirts that get worn hard, so we supervised the sample runs ourselves and approved the fit on different body types, moving as well as standing.
                                        </p>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                            Trial shirts went out for wear tests before anything went to bulk.
                                        </p>
                                    </div>
                                </div>

                                <p className={P}>
                                    Check the labels as well, because a factory abroad may not know US rules. The FTC requires <a href={FTC_LABELS} {...EXT} className={LINK}>fiber content, country of origin and the company&rsquo;s name or RN</a> <em>(an FTC-issued identification number)</em> on most clothing, plus a <a href={FTC_CARE} {...EXT} className={LINK}>permanent care label</a>. Cartons that arrive without them have to be relabeled before anything can be sold.
                                </p>
                                <Avoid>
                                    ask who will sew the bulk and whether your sample comes from that same unit. Put fabric weight, measurements, tolerances <em>(how far each measurement may vary)</em> and a shrinkage limit in a <Link href="/blogs/what-is-a-tech-pack" className={LINK}>tech pack</Link>, the spec document a factory builds from. Before cutting starts, approve a pre-production sample and ask for a wash test (<a href={AATCC} {...EXT} className={LINK}>AATCC TM150</a> is a common US method). Agree in writing what happens if bulk doesn&rsquo;t match, because <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className={LINK}>the cost of skipping that</Link> lands on you.
                                </Avoid>
                                <Signs items={[
                                    <>You chose the factory on unit price alone.</>,
                                    <>Your only spec is a reference photo.</>,
                                    <>You don&rsquo;t know who to call if the bulk order is late.</>,
                                ]} />
                            </section>

                            {/* 4 — Pricing */}
                            <section id="pricing" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n={4} />
                                <h2 className={H2}>4. Getting Product Pricing Wrong</h2>
                                <p className={P}>
                                    Most underpricing starts with the factory quote, which is only the first line of the cost. A garment made overseas also carries freight, US duty, customs fees, packaging, payment fees, returns and the cost of finding the customer. Read the quote itself closely too. A CMT price <em>(cut, make and trim, labor only)</em> leaves the fabric to you, while an FOB price <em>(finished garment delivered to the port)</em> includes it, so founders comparing two quotes are sometimes comparing different things.
                                </p>
                                <p className={P}>
                                    Take a cotton tee made in India for $14. Since July 24, 2026 it pays the normal <a href={HTS} {...EXT} className={LINK}>16.5% duty</a> plus a <a href={USTR} {...EXT} className={LINK}>10% Section 301 duty</a>, so $3.71 goes to duty before you count freight or fees. Returns take another share: US retailers expected 19.3% of online sales to come back in 2025, against 15.8% across all sales (<a href={NRF} {...EXT} className={LINK}>NRF</a>).
                                </p>

                                {/* Worked example */}
                                <figure className="not-prose my-8 rounded-2xl border-2 border-[#2D2A2E] bg-white overflow-hidden max-w-xl">
                                    <div className="bg-[#2D2A2E] px-5 py-3">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">One tee, before it reaches your door</p>
                                    </div>
                                    <div className="px-5 py-4 space-y-2 text-sm">
                                        <div className="flex justify-between gap-4"><span className="text-[#4A484A]">Factory price (India)</span><span className="font-semibold text-[#2D2A2E]">$14.00</span></div>
                                        <div className="flex justify-between gap-4"><span className="text-[#4A484A]">Normal US duty, 16.5%</span><span className="font-semibold text-[#2D2A2E]">$2.31</span></div>
                                        <div className="flex justify-between gap-4"><span className="text-[#4A484A]">Section 301 duty, 10%</span><span className="font-semibold text-[#2D2A2E]">$1.40</span></div>
                                        <div className="flex justify-between gap-4 border-t border-dashed border-gray-300 pt-2"><span className="font-semibold text-[#2D2A2E]">Before freight, fees, packaging and returns</span><span className={`${SERIF} text-lg font-bold`} style={{ color: CLAY }}>$17.71</span></div>
                                    </div>
                                    <figcaption className="px-5 pb-4 text-xs text-[#999999]">HTS 6109.10.00 cotton knit tee · rates in force since July 24, 2026 · checked November 4, 2026</figcaption>
                                </figure>

                                <p className={P}>
                                    Then there&rsquo;s the channel. Stores usually price at about double what they pay you, a markup the trade calls keystone, so a retail price that only works direct-to-consumer leaves no room for wholesale later.
                                </p>
                                <Happens>
                                    A founder sees that $14 quote and sets retail at $34, in line with competitors. At more than double the quote, it looks safe. Then a boutique asks for wholesale pricing, which at keystone is $17. The tee has already cost $17.71 before freight, so every piece in that order loses money.
                                </Happens>
                                <Avoid>
                                    build the price up from <Link href="/blogs/custom-clothing-manufacturing-cost" className={LINK}>landed cost</Link> (everything it costs to get the garment to your door), then check it against what competitors charge. If the two numbers don&rsquo;t meet, change the fabric or the product before you cut the margin. Leave room for end-of-season markdowns too, since part of most runs sells at a discount.
                                </Avoid>
                                <Signs items={[
                                    <>You can&rsquo;t say whether your quote is CMT or FOB.</>,
                                    <>Duty and returns aren&rsquo;t on your cost sheet.</>,
                                ]} />

                                {/* Mid-article soft CTA */}
                                <div className="not-prose my-10 rounded-2xl px-5 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-4" style={{ backgroundColor: SAND }}>
                                    <p className="flex-1 text-[#2D2A2E] leading-snug">
                                        <span className="font-bold text-[#2D2A2E]">Checking your own plan as you read?</span> The nine-point pre-launch checklist is near the end, and you can tick it off on the page.
                                    </p>
                                    <button onClick={() => scrollToId("checklist")} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: CLAY }}>
                                        Go to the checklist <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </section>

                            {/* 5 — Marketing */}
                            <section id="marketing" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n={5} />
                                <h2 className={H2}>5. Launching Without a Proper Marketing Strategy</h2>
                                <p className={P}>
                                    A launch with nobody waiting for it usually means a slow first month, however good the clothes are, and the stock is already paid for.
                                </p>
                                <p className={P}>
                                    Clothing adds a calendar problem. Stock has to land while customers are still buying for that season, and a first run takes around 23 weeks on our <Link href="/blogs/clothing-production-timeline" className={LINK}>production timeline</Link>, so the marketing and the production have to be planned back from the same date.
                                </p>
                                <Happens>
                                    A founder briefs a linen resort shirt in mid-March. On that timeline it lands in late August, when shoppers have moved on to fall. The photos get shot the week the cartons arrive, the first post goes up on launch day, and mostly friends and family see it. The shirts wait for next spring with the cash tied up in them.
                                </Happens>
                                <p className={P}>
                                    Start talking while the collection is still in sampling. Fit sessions and fabric choices make honest Instagram content, and they give people a reason to join an email list before there is anything to buy. Shoot from the pre-production sample, so the photos and the lookbook are ready before the stock is. <Link href="/case-studies/badri-al-shihhi" className={LINK}>Badria Al Shihhi</Link>&rsquo;s first collection opened with a fashion-show debut, alongside her online store and first physical shop, so the launch had a date people could plan around.
                                </p>
                                <p className={P}>
                                    Creators and paid ads come after that. If you send free product to influencers, the FTC expects the connection to be <a href={FTC_INFLUENCERS} {...EXT} className={LINK}>disclosed in the post itself</a>, and its <a href={FTC_GUIDES} {...EXT} className={LINK}>guidance to companies</a> is blunt: &ldquo;Your company is ultimately responsible for what others do on your behalf.&rdquo; Run small paid tests before launch, so the launch budget goes on the message that already works.
                                </p>
                                <Avoid>
                                    write the marketing plan when you approve the first sample, not when the stock lands. Pick the one channel your customer actually uses and build there first.
                                </Avoid>
                                <Signs items={[
                                    <>Your photos can&rsquo;t be shot until the stock lands.</>,
                                    <>You don&rsquo;t have an email list.</>,
                                ]} />
                            </section>

                            {/* 6 — Inventory */}
                            <section id="inventory" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n={6} />
                                <h2 className={H2}>6. Managing Inventory Without Demand Planning</h2>

                                <div className="not-prose grid sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-6 items-center mb-6">
                                    <div>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                            Too much stock ties your cash up in boxes, and the usual way out is a discount, which teaches customers to wait for the next sale.
                                        </p>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                            Too little is the nicer problem, but a style that sells out in a week can take months to come back. Our production timeline puts a reorder at about 12 weeks.
                                        </p>
                                    </div>
                                    <div className="rounded-3xl overflow-hidden sm:order-last order-first">
                                        <Image
                                            src={GARMENT_IMAGE}
                                            alt="A rail of identical oatmeal crewneck sweatshirts on wooden hangers in a stockroom, one empty hanger in the middle where a piece has sold, a reminder that inventory planning is one of the real clothing business challenges. No text, no logos."
                                            width={1024}
                                            height={1024}
                                            sizes="(max-width: 640px) 100vw, 22rem"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>

                                <p className={P}>
                                    Clothing makes the forecast harder because a style isn&rsquo;t one item. One shirt in three colors and five sizes is 15 separate items, and each can sell out or sit on its own. The split of units across sizes is called the size curve, and it should follow your customer, not an even spread.
                                </p>
                                <Happens>
                                    A founder orders 300 tees split evenly: 60 each in XS, S, M, L and XL. Three weeks after launch the medium and large are gone, and the remaining 180 are in sizes fewer people want. To most visitors the store looks sold out, while the cash sits in the stockroom. By the time the reorder lands it comes from a new dye lot <em>(one batch of dyed fabric)</em>, and the navy doesn&rsquo;t quite match the first run.
                                </Happens>
                                <p className={P}>
                                    Badria Al Shihhi planned for this from the start, with many styles and a small quantity of each.
                                </p>

                                <blockquote className="not-prose my-10 border-l-4 pl-6" style={{ borderColor: CLAY }}>
                                    <p className={`${SERIF} text-2xl lg:text-3xl leading-tight text-[#2D2A2E]`}>&ldquo;I want to give women something exclusive, beautiful, and accessible &mdash; not fast fashion, but fast elegance.&rdquo;</p>
                                    <span className="block mt-3 text-sm text-[#666666]">Badria Al Shihhi, founder, on the brief for her first collection</span>
                                </blockquote>

                                <p className={P}>
                                    Small batches cost more per piece. You are paying a little more on each garment so you don&rsquo;t pay for the ones nobody buys.
                                </p>
                                <Avoid>
                                    start with smaller runs and reorder what sells, weighting the size curve with whatever pre-order data you have. Keep a swatch from the first run so the mill has a shade to match. Track sell-through <em>(the share of your stock sold in a set period)</em> by style every week for the first two months, and plan bigger buys around the US retail calendar, holiday above all.
                                </Avoid>
                                <Signs items={[
                                    <>Your first order used most of your cash.</>,
                                    <>You don&rsquo;t know your sell-through by style.</>,
                                ]} />
                            </section>

                            {/* 7 — After launch */}
                            <section id="after-launch" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n={7} />
                                <h2 className={H2}>7. Treating the Launch as the Finish Line</h2>
                                <p className={P}>
                                    Launch day gets most of the planning, and the weeks after it get almost none. Your first customers are the easiest people you will ever sell to again, and they are also your best source of product feedback.
                                </p>
                                <p className={P}>
                                    Returns are the clearest version of that feedback. If one style keeps coming back for fit, the pattern needs work, and the next production run is where to fix it. On HY Official&rsquo;s camp shirt we went through several sample rounds to get the fit and the drape right before bulk, and reviews and return reasons should feed the next run in the same way.
                                </p>
                                <Avoid>
                                    plan the first 90 days after launch before you launch. That means a follow-up to first buyers that asks about fit, and a date by which you will decide on the reorder. Count repeat customers, not only first orders.
                                </Avoid>
                                <Signs items={[
                                    <>Nothing is planned for the week after launch.</>,
                                    <>You don&rsquo;t read return reasons.</>,
                                    <>Nobody has asked your first customers what they&rsquo;d change.</>,
                                ]} />
                            </section>

                            {/* Lessons */}
                            <section id="lessons" className="scroll-mt-28 mt-14 mb-12">
                                <h2 className={H2}>What We Learned From Launching 50+ Fashion Brands</h2>
                                <p className={P}>
                                    Every launch is different, and some of the advice above bends. A founder who already has an audience, a stylist or a creator for example, can spend less on pre-launch marketing and order a little deeper, because demand is partly proven. A wholesale-first label plans stock to purchase orders rather than forecasts.
                                </p>
                                <p className={P}>
                                    What stays the same is the order of decisions. Badria Al Shihhi came to fashion from chemical engineering and public leadership, and her brand launched eight months after we started.
                                </p>

                                <blockquote className="not-prose my-10 text-center px-4">
                                    <p className={`${SERIF} text-3xl lg:text-4xl leading-tight`} style={{ color: CLAY }}>&ldquo;In our experience, the founders who struggle are more often the ones who chose a factory before they chose a customer.&rdquo;</p>
                                    <span className="block mt-3 text-sm text-[#666666]">Krazy Kreators Team</span>
                                </blockquote>

                                <p className={P}>
                                    After that it comes down to repeating quality. A customer who gets the same fit and fabric on their second order as on their first is likely to place a third.
                                </p>
                            </section>

                            {/* Checklist */}
                            <section id="checklist" className="scroll-mt-28 mt-14 mb-12">
                                <h2 className={H2}>A Practical Checklist Before Launching Your Fashion Brand</h2>
                                <p className={P}>Tick these off before you place a bulk order. Each one links back to the section that covers it.</p>

                                <figure className="not-prose my-6 rounded-2xl border-2 border-[#2D2A2E] bg-white overflow-hidden">
                                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#2D2A2E] px-4 sm:px-5 py-3">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">Pre-launch checklist</p>
                                        <p className="text-xs text-gray-300">
                                            <span className="text-gray-300">{ticked.size} of {CHECKLIST.length} done</span>
                                            {ticked.size > 0 && (
                                                <button onClick={() => setTicked(new Set())} className="ml-3 underline text-gray-300 hover:text-white">Reset</button>
                                            )}
                                        </p>
                                    </div>
                                    <ul>
                                        {CHECKLIST.map((c, i) => {
                                            const on = ticked.has(i);
                                            const m = MISTAKES.find((x) => x.id === c.to);
                                            return (
                                                <li key={c.item} className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-dashed border-gray-300 last:border-b-0">
                                                    <button
                                                        onClick={() => toggleTick(i)}
                                                        aria-pressed={on}
                                                        aria-label={`Mark "${c.item}" as ${on ? "not done" : "done"}`}
                                                        className="w-6 h-6 shrink-0 rounded-md border-2 flex items-center justify-center transition-colors"
                                                        style={on ? { backgroundColor: CLAY, borderColor: CLAY } : { borderColor: INK }}
                                                    >
                                                        {on && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                                    </button>
                                                    <span className={`flex-1 text-[15px] sm:text-base font-semibold leading-tight ${on ? "line-through text-[#999999]" : "text-[#2D2A2E]"}`}>{c.item}</span>
                                                    {m && (
                                                        <button onClick={() => scrollToId(m.id)} className="shrink-0 inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: CLAY }}>
                                                            <ArrowUp className="w-3 h-3" /> Mistake {m.n}
                                                        </button>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <figcaption className="px-4 sm:px-5 py-3 text-xs text-[#999999] border-t border-gray-200">Krazy Kreators · fashion business tips for beginners, in the order the decisions get made · ticks are not saved</figcaption>
                                </figure>
                            </section>

                            {/* Final thoughts */}
                            <section id="final-thoughts" className="scroll-mt-28 mt-14 mb-12">
                                <h2 className={H2}>Final Thoughts: Build a Fashion Brand With the Right Foundation</h2>

                                <div className="not-prose rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A small independent clothing boutique early in the morning before opening, folded knitwear on an oak table and a rail along a white wall in pale daylight: what the right foundation for a new fashion brand looks like on the shop floor. No people, no signage."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className={P}>
                                    None of the mistakes new fashion brand founders make are rare, and most of them can be caught before the bulk order if you look for them. The trouble is that each one sits with a different person: a researcher, a designer, a factory, a freight forwarder, a photographer. Nobody is looking at the whole chain, so the gap between two of them is where the money goes.
                                </p>
                                <p className={P}>
                                    That gap is the job we do. Here is what we cover against each of the seven, so you can see where a partner changes the outcome and where it&rsquo;s still your call.
                                </p>

                                <div className="not-prose my-8 rounded-2xl border-2 border-[#2D2A2E] bg-white overflow-hidden">
                                    <div className="bg-[#2D2A2E] px-4 sm:px-5 py-3">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">Where we step in, mistake by mistake</p>
                                    </div>
                                    <ol>
                                        {MISTAKES.map((m) => (
                                            <li key={m.id} className="flex gap-4 px-4 sm:px-5 py-4 border-b border-dashed border-gray-300 last:border-b-0">
                                                <span className={`${SERIF} text-2xl leading-none shrink-0 w-8`} style={{ color: CLAY }}>{String(m.n).padStart(2, "0")}</span>
                                                <div>
                                                    <button onClick={() => scrollToId(m.id)} className="text-left text-sm font-bold text-[#2D2A2E] hover:underline mb-1">{m.short}</button>
                                                    <p className="text-[15px] leading-snug text-[#4A484A]">{WHERE_WE_HELP[m.id]}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                <p className={P}>
                                    Two things we don&rsquo;t do for you. We can&rsquo;t choose your customer, and we can&rsquo;t sell the collection once it exists. A founder who has not decided who the brand is for will get a well-made product either way, and that is the one mistake a partner can only point at. The sooner you have a customer in mind, the more of the rest we can take off your plate.
                                </p>
                                <p className={P}>
                                    If we were in your shoes, we would take the checklist above, mark the two items you are least sure of and settle those first. Which two would you pick?
                                </p>

                                <div className="not-prose mt-8 rounded-2xl px-5 py-6 sm:px-7 flex flex-col sm:flex-row sm:items-center gap-5" style={{ backgroundColor: SAND }}>
                                    <p className="flex-1 text-[#2D2A2E] leading-snug">
                                        <span className="block font-bold text-lg mb-1">Send us the two you marked.</span>
                                        Tell us which items you are least sure of and where your collection is today. A production lead will reply with what we would settle first.
                                    </p>
                                    <button onClick={() => setContactOpen(true)} className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: CLAY }}>
                                        Talk to a production lead <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className={H2}>Frequently Asked Questions</h2>
                                <div className="space-y-7">
                                    {FAQS.map((f) => (
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
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className={LINK}>design</Link>, sampling, <Link href="/manufacturing-services" className={LINK}>fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className={LINK}>under one roof</Link>, from first sketch to shelf. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/how-to-start-a-clothing-brand-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">How to Start a Clothing Brand in 2026: A Step-by-Step Guide</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The build order behind this checklist, step by step, with a 12-month timeline.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the guide <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Start your project</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Check your launch plan against these seven</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about your sample, your costing or your first run, before the bulk order is placed.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Talk to a production lead <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/costly-mistakes-startup-make",
                                            title: "Costly Mistakes Fashion Startups Make (and How to Avoid Them)",
                                            dek: "Our earlier, wider list of ten, including cash flow and sustainability.",
                                            read: "10 min read",
                                        },
                                        {
                                            href: "/blogs/the-real-cost-of-wrong-clothing-manufacturer",
                                            title: "The Real Cost of Choosing the Wrong Clothing Manufacturer",
                                            dek: "What mistake 3 costs, in money and in months.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/clothing-production-timeline",
                                            title: "From Sketch to Store: A Real Clothing Production Timeline",
                                            dek: "Week-by-week dates for a first run and a reorder.",
                                            read: "11 min read",
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
                    <button onClick={() => setContactOpen(true)} className="flex-1 text-left text-sm font-semibold text-white">
                        Planning to launch a fashion brand? Talk to our team <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
