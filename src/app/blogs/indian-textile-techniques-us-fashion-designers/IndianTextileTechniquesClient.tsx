"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Share2, Heart, MessageCircle, X } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";
import { FAQS } from "./faqs";

const BLOG_ID = "indian-textile-techniques-us-fashion-designers";

const HERO_IMAGE = "/blog/indian-textile-techniques-us-fashion-designers-hero.jpg";
const SECTION1_IMAGE = "/blog/indian-textile-techniques-us-fashion-designers-section1.jpg";
const MACRO_IMAGE = "/blog/indian-textile-techniques-us-fashion-designers-macro.jpg";
const GARMENT_IMAGE = "/blog/indian-textile-techniques-us-fashion-designers-garment.jpg";
const CLOSING_IMAGE = "/blog/indian-textile-techniques-us-fashion-designers-closing.jpg";

const LINK = "underline text-[#CBB49A] hover:text-[#b7a078]";
const EXT = { target: "_blank", rel: "noopener noreferrer" } as const;
const H2 = "font-serif text-3xl lg:text-[2.6rem] font-bold leading-[1.12] text-[#2D2A2E] mb-6";
const H3 = "text-2xl font-bold text-[#2D2A2E] mt-8 mb-3";
const P = "text-base lg:text-lg leading-snug text-[#4A484A] mb-4";

const USFIA = "https://www.usfashionindustry.com/pdf_files/2026/2026_USFIA_Benchmarking_Study.pdf";
const GT = "https://www.gtlaw.com/en/insights/2026/7/ustr-imposes-new-section-301-forced-labor-tariffs-on-imports-from-60-economies";
const GI = "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2021/nov/doc2021112441.pdf";

const TOC = [
    { id: "why-india", label: "Why designers look at India" },
    { id: "techniques", label: "The 7 techniques" },
    { id: "modern-collections", label: "Into a modern collection" },
    { id: "sourcing-2026", label: "2026 sourcing trends" },
    { id: "checklist", label: "Before you source" },
    { id: "which-technique", label: "Which technique?" },
    { id: "partner", label: "Choosing a partner" },
    { id: "faqs", label: "FAQs" },
    { id: "final-thoughts", label: "Final thoughts" },
];

// Infographic 1. Every figure is cited in the body where it first appears.
const STATS = [
    { big: "#1", label: "business challenge for US fashion firms: trade policy and tariffs", src: "USFIA 2026" },
    { big: "4.0/5", label: "India's vertical integration score, second only to China (4.8)", src: "USFIA 2026" },
    { big: "~1 in 3", label: "surveyed firms plan to buy more from India over the next two years", src: "USFIA 2026" },
    { big: "10%", label: "Section 301 duty tier for India since 24 July 2026, on top of normal duty", src: "USTR via Greenberg Traurig" },
];

// The seven techniques. `lead` and `drift` are 1-3 ratings (Krazy Kreators' assessment), plotted in infographic 2.
const TECHNIQUES: { id: string; name: string; where: string; lead: number; drift: number; test: string; body: React.ReactNode; use: string; caveat: string }[] = [
    {
        id: "block", name: "Hand block printing", where: "Sanganer and Bagru, Rajasthan", lead: 2, drift: 2, test: "Wash fastness, print alignment",
        body: <>Printers near Jaipur stamp cloth with carved wooden blocks, one block for each colour (<a href="https://www.india.gov.in/explore-india/odop/details/sanganeri-hand-block-printing" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">National Portal of India</a>).</>,
        use: "Shirts, dresses, resort wear, co-ords",
        caveat: "Small misalignments between blocks are part of the look. No two pieces will match exactly.",
    },
    {
        id: "chikankari", name: "Chikankari", where: "Lucknow, Uttar Pradesh", lead: 3, drift: 1, test: "Tracing-ink washout, shrinkage",
        body: <>White-on-white embroidery on fine cotton or georgette, with shadow stitches showing through from behind. It reads as quiet luxury.</>,
        use: "Blouses, slip dresses, occasion wear",
        caveat: "Every motif is stitched by hand, so the embroidery sets your lead time, not the sewing.",
    },
    {
        id: "ajrakh", name: "Ajrakh", where: "Kutch, Gujarat", lead: 3, drift: 3, test: "Wash and rub fastness",
        body: <>Geometric prints in indigo and madder red, built up through rounds of resist printing, dyeing and washing.</>,
        use: "Shirts, unstructured jackets",
        caveat: "The longest process of the seven, and the colour moves from batch to batch.",
    },
    {
        id: "ikat", name: "Ikat", where: "Telangana, Odisha, Gujarat", lead: 3, drift: 2, test: "Colour approved before dyeing",
        body: <>The yarn is tied and dyed before weaving, which gives ikat its feathered edges. Pochampally and Sambalpuri ikat are protected Geographical Indications (<a href="https://static.pib.gov.in/WriteReadData/specificdocs/documents/2021/nov/doc2021112441.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">PIB</a>).</>,
        use: "Statement shirts, resort dresses",
        caveat: "The pattern is fixed before the loom is threaded. Approve colour early, because nothing changes after dyeing.",
    },
    {
        id: "kantha", name: "Kantha", where: "West Bengal", lead: 2, drift: 1, test: "Weight and drape after stitching",
        body: <>Rows of running stitch, often through layered cotton, giving a rippled, quilted surface.</>,
        use: "Overshirts, jackets, accessories",
        caveat: "Layering adds weight and stiffness. Sample the drape before you commit to a shape.",
    },
    {
        id: "handloom", name: "Handloom", where: "Across India", lead: 2, drift: 2, test: "Width, shrinkage, slubs",
        body: <>Cloth woven on a hand-operated loom, with slubs and an uneven beat that mill fabric doesn&rsquo;t have.</>,
        use: "Premium basics, small capsules",
        caveat: "Widths are often narrower than mill cloth, which changes how many garments you cut from a metre.",
    },
    {
        id: "natural-dye", name: "Natural dyeing", where: "Across India", lead: 2, drift: 3, test: "Light and wash fastness",
        body: <>Indigo, madder, turmeric, pomegranate rind. Designers like the depth and the soft variation. The FTC&rsquo;s <a href="https://www.ftc.gov/news-events/topics/truth-advertising/green-guides" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Green Guides</a> still warn against broad terms like &ldquo;eco-friendly&rdquo;.</>,
        use: "Natural-colour capsules, knits, shirting",
        caveat: "Some natural colours fade fast in light. Get wash and light fastness results before you sell it.",
    },
];

// Infographic 3. Concept to shipping.
const PROCESS = [
    { step: "Design concept", note: "Sketch, mood, tech pack" },
    { step: "Textile selection", note: "Pick 1-2 techniques" },
    { step: "Fabric sourcing", note: "Base cloth, strike-off" },
    { step: "Sampling", note: "First real garment" },
    { step: "Fit & testing", note: "Fit, wash, colour" },
    { step: "Production", note: "The approved run" },
    { step: "Quality control", note: "In-line + final" },
    { step: "Shipping", note: "Packed for the US" },
];

// Infographic 4. The buyer checklist, all twelve items from the brief.
const CHECKS = [
    { item: "Fabric quality", note: "Composition and GSM in writing" },
    { item: "MOQ", note: "Minimum per style and per colour" },
    { item: "Sampling capability", note: "Who makes it, how many rounds" },
    { item: "Customization", note: "Your colours, scale and placement" },
    { item: "Production capacity", note: "Room to reorder what sells" },
    { item: "Quality control", note: "During the run, not only after" },
    { item: "Lead time", note: "Dated, per technique" },
    { item: "Compliance", note: "Labels, fibre content, origin" },
    { item: "Colourfastness testing", note: "Wash, light and rub results" },
    { item: "Packaging", note: "Folding, bagging, carton spec" },
    { item: "Shipping and logistics", note: "Who books it, who clears it" },
    { item: "Total landed cost", note: "Price + duty + freight + fees" },
];

// Infographic 5. Collection need to technique (the brief's table).
const NEEDS = [
    { need: "Resort wear", techs: ["block", "ikat"] },
    { need: "Luxury and occasion wear", techs: ["chikankari"] },
    { need: "Contemporary prints", techs: ["ajrakh", "block"] },
    { need: "Premium textured garments", techs: ["handloom"] },
    { need: "Artisan-inspired pieces", techs: ["kantha"] },
    { need: "Natural-colour concepts", techs: ["natural-dye"] },
];

// This post's own palette: the dye colours the techniques are known for.
const INDIGO = "#2F3F6B";
const MADDER = "#A2412F";
const TURMERIC = "#C99A2E";
const CREAM = "#F4EFE6";
const SERIF = "font-serif";

// Hand-drawn SVG swatch for each technique, so the post reads as a swatch book.
function Swatch({ id, uid, className = "" }: { id: string; uid: string; className?: string }) {
    const p = `sw-${id}-${uid}`;
    const fill = `url(#${p})`;
    const defs: Record<string, React.ReactNode> = {
        block: (
            <pattern id={p} width="24" height="24" patternUnits="userSpaceOnUse">
                <rect width="24" height="24" fill={CREAM} />
                <circle cx="12" cy="12" r="3" fill={MADDER} />
                {[0, 90, 180, 270].map((r) => (
                    <ellipse key={r} cx="12" cy="5.5" rx="2.2" ry="3.4" fill={INDIGO} opacity="0.85" transform={`rotate(${r} 12 12)`} />
                ))}
            </pattern>
        ),
        chikankari: (
            <pattern id={p} width="28" height="28" patternUnits="userSpaceOnUse">
                <rect width="28" height="28" fill="#D8CFBF" />
                <path d="M2 22 C 8 14, 14 14, 14 8 M14 8 C 14 14, 20 14, 26 6" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
                <circle cx="14" cy="8" r="2" fill="#FFFFFF" />
                <circle cx="6" cy="17" r="1.3" fill="#FFFFFF" />
                <circle cx="22" cy="11" r="1.3" fill="#FFFFFF" />
            </pattern>
        ),
        ajrakh: (
            <pattern id={p} width="30" height="30" patternUnits="userSpaceOnUse">
                <rect width="30" height="30" fill={INDIGO} />
                <path d="M15 3 L19 11 L27 15 L19 19 L15 27 L11 19 L3 15 L11 11 Z" fill={MADDER} />
                <circle cx="15" cy="15" r="2.5" fill={CREAM} />
                <circle cx="0" cy="0" r="2" fill={CREAM} />
                <circle cx="30" cy="30" r="2" fill={CREAM} />
            </pattern>
        ),
        ikat: (
            <pattern id={p} width="36" height="36" patternUnits="userSpaceOnUse">
                <rect width="36" height="36" fill={CREAM} />
                <path d="M18 2 L21 6 L20 9 L24 12 L23 15 L28 18 L23 21 L24 24 L20 27 L21 30 L18 34 L15 30 L16 27 L12 24 L13 21 L8 18 L13 15 L12 12 L16 9 L15 6 Z" fill={INDIGO} />
                <path d="M18 11 L21 15 L20 18 L21 21 L18 25 L15 21 L16 18 L15 15 Z" fill={MADDER} />
            </pattern>
        ),
        kantha: (
            <pattern id={p} width="20" height="10" patternUnits="userSpaceOnUse">
                <rect width="20" height="10" fill="#B4573A" />
                <path d="M0 5 H20" stroke={CREAM} strokeWidth="1.4" strokeDasharray="4 3" />
            </pattern>
        ),
        handloom: (
            <pattern id={p} width="12" height="12" patternUnits="userSpaceOnUse">
                <rect width="12" height="12" fill="#E3D8C3" />
                <path d="M0 3 H12 M0 9 H12" stroke="#C9B998" strokeWidth="1" />
                <path d="M3 0 V12" stroke="#B9A782" strokeWidth="1.6" />
                <path d="M9 0 V12" stroke="#D2C3A4" strokeWidth="0.8" />
            </pattern>
        ),
        "natural-dye": (
            <linearGradient id={p} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={TURMERIC} />
                <stop offset="0.55" stopColor="#C77B5E" />
                <stop offset="1" stopColor="#9E4E5A" />
            </linearGradient>
        ),
    };
    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className={className}>
            <defs>{defs[id]}</defs>
            <rect width="100" height="100" fill={fill} />
        </svg>
    );
}

// Infographic 2. Where each technique sits: lead-time pressure (x) against batch-to-batch colour variation (y).
const MAP_COLS = ["Low", "Medium", "High"];
const MAP_ROWS = ["High", "Medium", "Low"];

function Kicker({ n, label }: { n: string; label: string }) {
    return (
        <p className="not-prose flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: MADDER }}>
            <span className={`${SERIF} text-2xl normal-case tracking-normal`} style={{ color: INDIGO }}>{n}</span>
            <span className="h-px w-10 bg-[#CBB49A]" />
            {label}
        </p>
    );
}

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function IndianTextileTechniquesClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("why-india");
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

            <Navbar invertTabs={false} />

            {/* Hero banner: split editorial layout, cream panel + photo + swatch strip */}
            <section className="pt-24 lg:pt-28" style={{ backgroundColor: CREAM }}>
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 items-center pb-10 lg:pb-14">
                    <div className="order-2 lg:order-1">
                        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs sm:text-sm">
                            <span className="px-3 py-1 rounded-full text-white font-semibold uppercase tracking-wider" style={{ backgroundColor: INDIGO }}>Production &amp; Sourcing</span>
                            <span className="text-[#4A484A] font-medium">A designer&rsquo;s field guide</span>
                            <span className="text-[#999999]">•</span>
                            <span className="text-[#4A484A]">6 min read · October 26, 2026</span>
                        </div>
                        <h1 className={`${SERIF} text-[2.1rem] sm:text-5xl xl:text-[3.6rem] font-bold leading-[1.05] text-[#2D2A2E] mb-5`}>
                            Indian Textile Techniques US Fashion Designers Should Know in 2026
                        </h1>
                        <p className="text-lg sm:text-xl text-[#4A484A] leading-snug max-w-xl mb-7">
                            Pick a technique and you have also picked a workshop, a sampling calendar and a set of tests.
                        </p>
                        <ol className="grid grid-cols-2 gap-x-6 gap-y-1.5 max-w-md">
                            {TECHNIQUES.map((t, i) => (
                                <li key={t.id}>
                                    <button onClick={() => scrollToId(`t-${t.id}`)} className="flex items-baseline gap-2 text-left text-sm text-[#2D2A2E] hover:underline">
                                        <span className={`${SERIF} text-base`} style={{ color: MADDER }}>{String(i + 1).padStart(2, "0")}</span>
                                        {t.name}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <figure className="order-1 lg:order-2 relative">
                        <div className="relative aspect-[4/3] lg:aspect-[4/4.4] rounded-[28px] overflow-hidden shadow-2xl">
                            <Image
                                src={HERO_IMAGE}
                                alt="Lengths of indigo and madder-red Ajrakh resist-printed cotton laid out in rows to dry on open ground in Kutch at first light, one of the Indian textile techniques US fashion designers can build a collection around. No people, no logos."
                                fill
                                sizes="(max-width: 1024px) 100vw, 45vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                        <figcaption className="absolute -bottom-4 left-5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#2D2A2E] shadow-md">
                            Ajrakh drying in Kutch, Gujarat
                        </figcaption>
                    </figure>
                </div>
                {/* Swatch strip */}
                <div className="grid grid-cols-7 h-14 sm:h-20">
                    {TECHNIQUES.map((t) => (
                        <button key={t.id} onClick={() => scrollToId(`t-${t.id}`)} className="relative group" aria-label={`Jump to ${t.name}`}>
                            <Swatch id={t.id} uid="strip" className="absolute inset-0 w-full h-full" />
                            <span className="absolute inset-x-0 bottom-0 bg-black/55 text-white text-[10px] sm:text-xs font-semibold py-0.5 sm:py-1 opacity-0 group-hover:opacity-100 transition-opacity">{t.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Body */}
            <section className="py-14 sm:py-16 lg:py-20 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">

                    {/* Interaction bar */}
                    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-4">
                        <p className="text-sm text-[#4A484A]"><span className="font-semibold text-[#2D2A2E]">Krazy Kreators Team</span> · Production &amp; Sourcing · Manufacturing · Figures checked 3 October 2026</p>
                        <div className="flex flex-wrap items-center gap-3">
                            <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200 text-sm font-medium transition-all duration-300">
                                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                            </button>
                            <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                                <MessageCircle className="w-4 h-4" />
                                {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                            </button>
                            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-300 hover:opacity-90" style={{ backgroundColor: INDIGO }}>
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>

                    {/* TL;DR as three numbered takeaways */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-12">
                        {[
                            <>Seven techniques, each judged on what it does to <strong>lead time, colour consistency and testing</strong>.</>,
                            <>Big US brands are <strong>cutting vendor lists</strong> in 2026. Pick techniques one partner can run.</>,
                            <>India now pays the <strong>lower 10% tier</strong> of the new US duty. That still isn&rsquo;t the same as cheapest.</>,
                        ].map((txt, i) => (
                            <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: CREAM }}>
                                <p className={`${SERIF} text-3xl mb-2`} style={{ color: MADDER }}>{i + 1}</p>
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
                                    style={activeSection === t.id ? { backgroundColor: INDIGO } : undefined}
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
                                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: MADDER }}>On this page</p>
                                <ol className="space-y-3">
                                    {TOC.map((t, i) => (
                                        <li key={t.id}>
                                            <button
                                                onClick={() => scrollToId(t.id)}
                                                className={`flex gap-2 text-left text-sm leading-snug transition-colors ${activeSection === t.id ? "text-[#2D2A2E] font-semibold" : "text-[#666666] hover:text-[#2D2A2E]"}`}
                                            >
                                                <span className={`${SERIF} w-5 shrink-0`} style={{ color: activeSection === t.id ? MADDER : "#B0AAA2" }}>{String(i + 1).padStart(2, "0")}</span>
                                                {t.label}
                                            </button>
                                        </li>
                                    ))}
                                </ol>

                                <div className="mt-10">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: MADDER }}>You might also like</p>
                                    <div className="space-y-4">
                                        <Link href="/blogs/sourcing-clothing-manufacturing-from-india-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Beyond China: sourcing from India in 2026</p>
                                        </Link>
                                        <Link href="/blogs/made-in-india-american-luxury-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Culture &amp; Brand</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The &lsquo;Made in India&rsquo; trend in American luxury</p>
                                        </Link>
                                        <Link href="/blogs/clothing-production-timeline" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Production</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">A real clothing production timeline</p>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {railState === "pinned" && <div aria-hidden style={{ height: tocNaturalHeight }} />}
                        </aside>

                        {/* Article */}
                        <article ref={articleRef} className="prose prose-lg max-w-none text-[#4A484A]">

                            {/* Opening, with a drop cap */}
                            <p className="text-lg lg:text-xl text-[#2D2A2E] leading-snug mb-5 font-medium">
                                <span className={`${SERIF} float-left text-[4.2rem] leading-[0.8] mr-2 mt-1.5`} style={{ color: INDIGO }}>A</span>
                                length of Ajrakh is printed, dyed, washed and printed again over several days before anyone can cut it. Ikat&rsquo;s pattern is dyed into the yarn before the loom is even set up. For a US designer those two facts matter more than how either cloth looks, because they set your sampling calendar.
                            </p>

                            <p className={P}>
                                The calendar matters more this year. Trade policy and tariffs are the top business worry for US fashion companies in the <a href={USFIA} {...EXT} className={LINK}>2026 USFIA Fashion Industry Benchmarking Study</a>, and the response has changed. Companies are adding fewer countries and fewer vendors, and working more closely with the partners they keep.
                            </p>

                            <p className={`${P} mb-8`}>
                                So what follows covers seven Indian textile techniques, and for each one what it asks of production. The aim is a shortlist one capable partner can actually make.
                            </p>

                            {/* Infographic 1 — ledger of four numbers */}
                            <figure className="not-prose my-10 rounded-3xl border border-[#E5DCCB] p-5 sm:p-7" style={{ backgroundColor: CREAM }}>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: MADDER }}>The 2026 sourcing ledger</p>
                                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#D9CDB6]">
                                    {STATS.map((s) => (
                                        <div key={s.big} className="py-4 lg:py-0 lg:px-5 first:lg:pl-0">
                                            <p className={`${SERIF} text-4xl sm:text-5xl font-bold`} style={{ color: INDIGO }}>{s.big}</p>
                                            <p className="mt-2 text-sm text-[#2D2A2E] leading-snug pr-3">{s.label}</p>
                                            <p className="mt-2 text-[11px] uppercase tracking-wider text-[#8C7355]">{s.src}</p>
                                        </div>
                                    ))}
                                </div>
                                <figcaption className="mt-6 pt-4 border-t border-[#D9CDB6] text-xs text-[#666666] leading-snug">
                                    Krazy Kreators · USFIA surveyed 30 US fashion companies, April to June 2026 · sources linked in the text · checked 3 October 2026
                                </figcaption>
                            </figure>

                            {/* Why */}
                            <section id="why-india" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n="01" label="The case" />
                                <h2 className={H2}>Why US Fashion Designers Are Looking at Indian Textile Craftsmanship</h2>
                                <p className={P}>
                                    India is one of very few places where big mills and hand workshops share a supply base. In the USFIA survey India scored 4.0 out of 5 for vertical integration <em>(fibre, fabric and garment made in one country)</em>, behind only China&rsquo;s 4.8. In practice the block printer, the weaver and the sewing unit can sit a day&rsquo;s drive apart, which is what makes a short custom run workable.
                                </p>
                                <p className={P}>
                                    That matters to a small label. A print nobody else can order, or one hand-finished panel on a plain jacket, is how a new collection stands apart on a buyer&rsquo;s rail.
                                </p>
                            </section>

                            {/* The seven techniques, as a swatch book */}
                            <section id="techniques" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n="02" label="The swatch book" />
                                <h2 className={H2}>7 Indian Textile Techniques Every US Fashion Designer Should Know</h2>
                                <p className={P}>Each page shows what the technique is, where it works in a US line, and the catch that shows up in your sampling calendar.</p>

                                <div className="not-prose rounded-3xl overflow-hidden my-8 max-w-2xl mx-auto">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Undyed warp yarn bound in sections on a wooden frame in an Indian ikat workshop, ready for resist dyeing, the step that fixes an ikat pattern before weaving begins. No people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <div className="not-prose space-y-5">
                                    {TECHNIQUES.map((t, i) => (
                                        <div key={t.id} id={`t-${t.id}`} className="scroll-mt-28">
                                            <div className="grid sm:grid-cols-[150px_minmax(0,1fr)] rounded-3xl overflow-hidden border border-[#E5DCCB] bg-white">
                                                <div className="relative h-24 sm:h-auto">
                                                    <Swatch id={t.id} uid="page" className="absolute inset-0 w-full h-full" />
                                                    <span className={`${SERIF} absolute top-3 left-3 text-2xl font-bold text-white bg-[#2D2A2E]/70 rounded-lg px-2 py-0.5`}>{String(i + 1).padStart(2, "0")}</span>
                                                </div>
                                                <div className="p-5 sm:p-6">
                                                    <h3 className={`${SERIF} text-2xl font-bold text-[#2D2A2E] leading-tight`}>{t.name}</h3>
                                                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] mt-1 mb-3" style={{ color: MADDER }}>{t.where}</p>
                                                    <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">{t.body}</p>
                                                    <p className="text-sm text-[#2D2A2E] mb-3"><span className="font-semibold">Use it for:</span> {t.use}</p>
                                                    <p className="text-sm leading-snug rounded-xl px-4 py-3 text-[#2D2A2E]" style={{ backgroundColor: CREAM }}>
                                                        <span className="font-bold" style={{ color: MADDER }}>The catch · </span>{t.caveat}
                                                    </p>
                                                </div>
                                            </div>
                                            {t.id === "ikat" && (
                                                <div className="rounded-3xl overflow-hidden my-5 max-w-2xl mx-auto">
                                                    <Image
                                                        src={MACRO_IMAGE}
                                                        alt="Extreme close-up of hand-woven silk ikat where indigo, rust and cream meet in a feathered blur, the mark of yarn dyed before weaving. No text."
                                                        width={1024}
                                                        height={1024}
                                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                                        className="w-full h-auto"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Infographic 2 — technique map */}
                                <figure className="not-prose my-10 rounded-3xl bg-white border border-[#E5DCCB] p-5 sm:p-7">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: MADDER }}>The technique map</p>
                                    <p className="text-sm text-[#666666] mb-5">Where each technique sits on lead-time pressure and batch-to-batch colour variation. Machine print is shown for comparison.</p>
                                    <div className="flex gap-3">
                                        <div className="flex items-center">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C7355] [writing-mode:vertical-rl] rotate-180">Colour variation →</p>
                                        </div>
                                        <div className="flex-1">
                                            <div className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] gap-1.5">
                                                {MAP_ROWS.map((row, ri) => (
                                                    <div key={row} className="contents">
                                                        <p className="text-[11px] text-[#666666] self-center pr-1 w-12">{row}</p>
                                                        {MAP_COLS.map((_, ci) => {
                                                            const drift = 3 - ri;
                                                            const lead = ci + 1;
                                                            const here = TECHNIQUES.filter((t) => t.drift === drift && t.lead === lead);
                                                            const isMill = drift === 1 && lead === 1;
                                                            const hot = drift + lead >= 5;
                                                            return (
                                                                <div key={ci} className="min-h-[74px] rounded-xl p-2 flex flex-col gap-1 justify-center" style={{ backgroundColor: hot ? "#F3E2DC" : CREAM }}>
                                                                    {here.map((t) => (
                                                                        <span key={t.id} className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2D2A2E] leading-tight">
                                                                            <Swatch id={t.id} uid="map" className="w-4 h-4 rounded-full shrink-0 overflow-hidden" />
                                                                            {t.name}
                                                                        </span>
                                                                    ))}
                                                                    {isMill && <span className="text-xs italic text-[#666666]">Machine print</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                                <span />
                                                {MAP_COLS.map((c) => (
                                                    <p key={c} className="text-[11px] text-[#666666] text-center pt-1">{c}</p>
                                                ))}
                                            </div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C7355] text-center mt-1">Lead-time pressure →</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                                        {TECHNIQUES.map((t) => (
                                            <p key={t.id} className="text-sm text-[#4A484A]"><span className="font-semibold text-[#2D2A2E]">{t.name}:</span> test {t.test.charAt(0).toLowerCase() + t.test.slice(1)}</p>
                                        ))}
                                    </div>
                                    <p className="mt-5 text-sm rounded-xl px-4 py-3 text-white" style={{ backgroundColor: INDIGO }}>
                                        Need an identical repeat across a big run, or the same shade on reorder? Print it by machine and keep hand work for a capsule.
                                    </p>
                                    <figcaption className="mt-4 text-xs text-[#999999]">Krazy Kreators&rsquo; assessment of Indian textile techniques for US fashion brands · positions are relative, not measured</figcaption>
                                </figure>
                            </section>

                            {/* Modern collections */}
                            <section id="modern-collections" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n="03" label="The method" />
                                <h2 className={H2}>How US Fashion Brands Can Turn Indian Textile Techniques Into Modern Collections</h2>

                                <div className="not-prose grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-6 items-center mb-6">
                                    <div className="rounded-3xl overflow-hidden">
                                        <Image
                                            src={GARMENT_IMAGE}
                                            alt="A cropped boxy long-sleeve top in naturally dyed handloom cotton, turmeric yellow fading into madder rose, on a black dress form in window light: Indian craftsmanship cut into a modern US silhouette. No people, no logos."
                                            width={1024}
                                            height={1024}
                                            sizes="(max-width: 640px) 100vw, 24rem"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                            Use the technique on a new shape, not the traditional garment. Scale a block motif up and run it in one colour. Put Chikankari on one yoke rather than the whole dress.
                                        </p>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                            Choose the base fabric&rsquo;s weight for a US climate and a US fit (our <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className={LINK}>GSM guide</Link> covers this), write all of it into your <Link href="/blogs/what-is-a-tech-pack" className={LINK}>tech pack</Link>, and ask for a strike-off <em>(a test print or weave on the real fabric)</em> before any sample is sewn.
                                        </p>
                                    </div>
                                </div>

                                {/* Infographic 3 — the thread: concept to shipping */}
                                <figure className="not-prose my-8 rounded-3xl p-5 sm:p-7" style={{ backgroundColor: INDIGO }}>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E9C9A0] mb-1">The thread, concept to shipping</p>
                                    <p className="text-sm text-[#C9D0E0] mb-6">Eight steps. Testing is the gate before you pay for a production run.</p>
                                    <ol className="relative grid sm:grid-cols-2 gap-x-10">
                                        <span aria-hidden className="absolute left-[15px] top-2 bottom-2 border-l-2 border-dashed border-[#E9C9A0]/60 sm:hidden" />
                                        {PROCESS.map((p, i) => {
                                            const gate = p.step === "Fit & testing";
                                            return (
                                                <li key={p.step} className="relative flex gap-4 py-2.5">
                                                    <span className={`${SERIF} relative z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold`} style={gate ? { backgroundColor: "#E9C9A0", color: INDIGO } : { backgroundColor: INDIGO, color: "#E9C9A0", border: "2px dashed #E9C9A0" }}>{i + 1}</span>
                                                    <div>
                                                        <p className="font-bold text-white leading-tight">{p.step}{gate && <span className="ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E9C9A0] text-[#2F3F6B] align-middle">Gate</span>}</p>
                                                        <p className="text-sm text-[#C9D0E0]">{p.note}</p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                    <p className="mt-5 pt-4 border-t border-white/15 text-sm text-[#C9D0E0]">Steps 2 to 5 can repeat. On a hand technique, plan for more than one sample round.</p>
                                    <figcaption className="mt-2 text-xs text-[#9AA5BF]">Krazy Kreators · apparel manufacturing in India, concept to shipping</figcaption>
                                </figure>

                                <p className={P}>
                                    Our <Link href="/blogs/clothing-production-timeline" className={LINK}>production timeline</Link> puts dates against each step.
                                </p>
                            </section>

                            {/* 2026 sourcing trends */}
                            <section id="sourcing-2026" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n="04" label="The context" />
                                <h2 className={H2}>Indian Textiles + 2026 US Fashion Sourcing Trends</h2>

                                <h3 className={H3}>Tariff uncertainty is changing sourcing decisions</h3>
                                <p className={P}>
                                    In the first four months of 2026, the average duty on US clothing imports from India was 37.8%, according to USFIA&rsquo;s reading of USITC data. Since 24 July India has sat in the lower 10% tier of the new Section 301 duty, which is added to the normal rate (<a href={GT} {...EXT} className={LINK}>Greenberg Traurig</a>). Lower isn&rsquo;t cheapest, though. The same survey rated India less competitive on cost than China or Bangladesh. Our <Link href="/blogs/us-apparel-import-tariffs-2026" className={LINK}>tariff tracker</Link> has rates by country.
                                </p>

                                <blockquote className="not-prose my-10 text-center px-4">
                                    <p className={`${SERIF} text-3xl lg:text-4xl leading-tight`} style={{ color: INDIGO }}>&ldquo;Lower number of vendors to stabilize lead time and cost.&rdquo;</p>
                                    <span className="block mt-3 text-sm text-[#666666]">A respondent to the 2026 USFIA Benchmarking Study</span>
                                </blockquote>

                                <h3 className={H3}>Supply-chain diversification</h3>
                                <p className={P}>
                                    The big brands are not abandoning diversification. They are going narrower. About a third of USFIA respondents plan to buy more from India, the same share as for Vietnam and Pakistan. But fewer plan to add new countries or vendors than in 2025. For a smaller label the lesson carries over: one partner who can run three techniques beats three workshops you manage yourself.
                                </p>

                                <h3 className={H3}>Sustainability is becoming a sourcing consideration</h3>
                                <p className={P}>
                                    Buyers ask where fibre came from and how it was dyed. Hold the certificates and test reports yourself. If you sell into Europe too, the rules are stricter (<Link href="/blogs/eu-green-claims-directive-2026-fashion-brands" className={LINK}>our EU explainer</Link>).
                                </p>
                            </section>

                            {/* Checklist */}
                            <section id="checklist" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n="05" label="The spec sheet" />
                                <h2 className={H2}>What US Fashion Designers Should Check Before Sourcing From India</h2>
                                <p className={P}>Get these answers in writing before you approve a first sample.</p>

                                {/* Infographic 4 — sourcing spec sheet */}
                                <figure className="not-prose my-6 rounded-2xl border-2 border-[#2D2A2E] bg-white overflow-hidden">
                                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#2D2A2E] px-4 sm:px-5 py-3">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">Sourcing spec sheet · India</p>
                                        <p className="text-[11px] text-gray-400">Style ____ · Technique ____ · Supplier ____</p>
                                    </div>
                                    <div className="grid sm:grid-cols-2">
                                        {CHECKS.map((c, i) => (
                                            <div key={c.item} className="flex items-start gap-3 px-4 sm:px-5 py-3 border-b border-dashed border-gray-300 sm:odd:border-r">
                                                <span className="mt-0.5 font-mono text-[11px] text-[#8C7355] w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                                                <div className="flex-1">
                                                    <p className="font-bold text-[#2D2A2E] text-sm leading-tight">{c.item}</p>
                                                    <p className="text-xs text-[#666666] leading-snug mt-0.5">{c.note}</p>
                                                </div>
                                                <span aria-hidden className="w-4 h-4 mt-0.5 rounded-[3px] border-2 border-[#2D2A2E] shrink-0" />
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="px-4 sm:px-5 py-3 text-xs text-[#999999]">Krazy Kreators · twelve things to settle with Indian fabric suppliers and clothing manufacturers</figcaption>
                                </figure>

                                <p className={P}>
                                    Our <Link href="/blogs/exporting-apparel-from-india-checklist-first-time-buyers" className={LINK}>first-time buyer&rsquo;s checklist</Link> covers the export paperwork.
                                </p>
                            </section>

                            {/* Which technique */}
                            <section id="which-technique" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n="06" label="The match" />
                                <h2 className={H2}>Which Indian Textile Technique Is Right for Your Collection?</h2>
                                <p className={P}>Start from what the collection needs, not from the technique you like best.</p>

                                {/* Infographic 5 — need to technique flow */}
                                <figure className="not-prose my-6 rounded-3xl border border-[#E5DCCB] p-4 sm:p-6" style={{ backgroundColor: CREAM }}>
                                    <div className="space-y-2.5">
                                        {NEEDS.map((n) => (
                                            <div key={n.need} className="grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1.15fr)] sm:grid-cols-[minmax(0,1fr)_60px_minmax(0,1.3fr)] items-center">
                                                <p className="rounded-xl bg-white px-3 sm:px-4 py-2.5 text-sm sm:text-base font-semibold text-[#2D2A2E] shadow-sm">{n.need}</p>
                                                <svg viewBox="0 0 60 10" preserveAspectRatio="none" aria-hidden className="w-full h-3">
                                                    <path d="M0 5 H52" stroke={MADDER} strokeWidth="1.5" strokeDasharray="4 3" />
                                                    <path d="M50 1 L58 5 L50 9" fill="none" stroke={MADDER} strokeWidth="1.5" />
                                                </svg>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {n.techs.map((id) => {
                                                        const t = TECHNIQUES.find((x) => x.id === id);
                                                        return (
                                                            <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-white pl-1 pr-3 py-1 text-xs sm:text-sm font-medium text-[#2D2A2E] border border-[#E5DCCB]">
                                                                <Swatch id={id} uid="flow" className="w-5 h-5 rounded-full overflow-hidden" />
                                                                {t?.name}{id === "chikankari" ? " & embroidery" : ""}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-4 text-xs text-[#999999]">Krazy Kreators · collection need to Indian textile technique</figcaption>
                                </figure>
                            </section>

                            {/* Partner */}
                            <section id="partner" className="scroll-mt-28 mt-14 mb-12">
                                <Kicker n="07" label="The partner" />
                                <h2 className={H2}>Why Choosing the Right Indian Manufacturing Partner Matters</h2>
                                <p className={P}>
                                    Split the work across a printer, a weaver and a sewing unit and you become the one matching shades between them. When a shirt shrinks, nobody owns it. A partner who sources the textile, develops the design, samples it, makes it, checks it and ships it answers for the result, and understands what a US buyer will reject.
                                </p>
                                <p className={P}>
                                    That is how <Link href="/end-to-end-services" className={LINK}>Krazy Kreators</Link> works with US clothing founders: <Link href="/end-to-end-services/raw-materials" className={LINK}>textile sourcing</Link>, <Link href="/design-services" className={LINK}>design development</Link>, sampling, <Link href="/manufacturing-services" className={LINK}>production</Link>, quality control and shipping, run by one team.
                                </p>

                                {/* Lead-gen CTA */}
                                <div className="not-prose mt-8 rounded-3xl overflow-hidden grid sm:grid-cols-[110px_minmax(0,1fr)]" style={{ backgroundColor: INDIGO }}>
                                    <div className="relative h-16 sm:h-auto">
                                        <Swatch id="ajrakh" uid="cta" className="absolute inset-0 w-full h-full" />
                                    </div>
                                    <div className="p-6 flex flex-col lg:flex-row lg:items-center gap-4">
                                        <div className="flex-1">
                                            <p className={`${SERIF} text-2xl text-white mb-1`}>Planning your next fashion collection?</p>
                                            <p className="text-[#C9D0E0] leading-snug">
                                                Looking for Indian textile sourcing, custom apparel manufacturing, sampling or production support for your US fashion brand? Talk to Krazy Kreators about your collection.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setContactOpen(true)}
                                            className="shrink-0 px-6 py-3 bg-[#E9C9A0] text-[#2F3F6B] font-semibold rounded-full hover:bg-white transition-colors inline-flex items-center justify-center gap-2"
                                        >
                                            Talk to us about your collection
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
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

                            {/* Final thoughts */}
                            <section id="final-thoughts" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className={H2}>Final Thoughts</h2>

                                <div className="not-prose rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="An empty garment sampling room at dusk: paper patterns on a cutting table, a muslin toile pinned on a dress form and one ikat sample shirt on a rail, where an Indian textile technique becomes a production-ready style. No people, no text."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className={P}>
                                    A beautiful fabric is half the decision. The other half is whether someone can sample it, test it, repeat it and land it at a cost your price can carry. If we were in your shoes, we&rsquo;d pick one technique, write a tight production brief and ask for a strike-off this month. Which technique would you sample first?
                                </p>
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
                                <Link href="/blogs/sourcing-clothing-manufacturing-from-india-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Beyond China: Why More Fashion Brands Are Sourcing From India in 2026</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The production side of the same decision: duty, lead times and how India compares with Bangladesh and Vietnam.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the sourcing case <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Start your project</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Talk to a Krazy Kreators production lead about Indian textile techniques</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Send a sketch or a mood board. We&rsquo;ll tell you which technique suits it, what to test, and a dated plan from strike-off to delivery.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start your project <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/made-in-india-american-luxury-2026",
                                            title: "The 'Made in India' Trend Reshaping American Luxury in 2026",
                                            dek: "How Indian craft moved from the souvenir shelf to the US luxury rail.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/clothing-production-timeline",
                                            title: "From Sketch to Store: A Real Clothing Production Timeline",
                                            dek: "The dates behind the eight steps in this post.",
                                            read: "11 min read",
                                        },
                                        {
                                            href: "/blogs/exporting-apparel-from-india-checklist-first-time-buyers",
                                            title: "Exporting Apparel from India: A Checklist for First-Time Buyers",
                                            dek: "The paperwork side of sourcing clothing from India.",
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
                    <button onClick={() => setContactOpen(true)} className="flex-1 text-left text-sm font-semibold">
                        Planning a collection with Indian textiles? Talk to us <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
