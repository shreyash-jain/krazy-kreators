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

const BLOG_ID = "what-is-a-tech-pack";

const HERO_IMAGE = "/blog/what-is-a-tech-pack-hero.jpg";
const SECTION1_IMAGE = "/blog/what-is-a-tech-pack-section1.jpg";
const MACRO_IMAGE = "/blog/what-is-a-tech-pack-macro.jpg";
const PATTERNS_IMAGE = "/blog/what-is-a-tech-pack-patterns.jpg";
const CLOSING_IMAGE = "/blog/what-is-a-tech-pack-closing.jpg";

/* Teaching photos — one per tech pack page. Labels live in the figcaption,
   never inside the image, so nothing can come back garbled. */
const FLATS_IMAGE = "/blog/what-is-a-tech-pack-flats.jpg";
const POM_IMAGE = "/blog/what-is-a-tech-pack-pom.jpg";
const GRADING_IMAGE = "/blog/what-is-a-tech-pack-grading.jpg";
const BOM_IMAGE = "/blog/what-is-a-tech-pack-bom.jpg";
const SAMPLING_IMAGE = "/blog/what-is-a-tech-pack-sampling.jpg";

const TOC = [
    { id: "what-it-is", label: "What a tech pack actually is" },
    { id: "why-factories-ask", label: "Why no factory will quote without one" },
    { id: "whats-inside", label: "The eight pages, and what each prevents" },
    { id: "vs-cad", label: "Tech pack, CAD or spec sheet?" },
    { id: "cost-of-skipping", label: "What skipping it actually costs" },
    { id: "how-its-built", label: "How a tech pack gets built" },
    { id: "the-check", label: "The check before you hit send" },
    { id: "plain-english", label: "The terms, in plain English" },
    { id: "when-you-dont", label: "When you don’t need the full document" },
    { id: "the-move", label: "What we’d do in your shoes" },
    { id: "faq", label: "Common questions" },
];

type Faq = { q: string; a: string };
type GlossaryItem = { term: string; def: string };

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
    faqs: Faq[];
    glossary: GlossaryItem[];
};

/* ------------------------------------------------------------------ */
/* Teaching photo — a labelled figure whose caption is real HTML text  */
/* ------------------------------------------------------------------ */
function TeachingPhoto({
    src,
    alt,
    label,
    caption,
}: {
    src: string;
    alt: string;
    label: string;
    caption: string;
}) {
    return (
        <figure className="not-prose my-7 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-4 sm:p-5 max-w-xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">{label}</p>
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <Image src={src} alt={alt} width={1024} height={1024} sizes="(max-width: 1024px) 100vw, 36rem" className="w-full h-auto" />
            </div>
            <figcaption className="mt-3 text-sm text-[#4A484A] leading-snug">{caption}</figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 1 — the eight pages of a tech pack                      */
/* Rendered as HTML (not a generated image) so the labels cannot drift */
/* ------------------------------------------------------------------ */
const PAGES = [
    {
        n: "01",
        name: "Cover / style summary",
        answers: "Which style is this, for which season, in which sizes?",
        prevents: "The wrong style getting cut when three of yours are in the factory at once.",
    },
    {
        n: "02",
        name: "Technical flats",
        answers: "What does it look like from the front, the back and up close?",
        prevents: "A pocket in the wrong place, a hood without a drawcord channel.",
    },
    {
        n: "03",
        name: "Points of measure",
        answers: "How big is it, at every named place on the garment?",
        prevents: "A sample that fits nobody and an argument about whose fault that is.",
    },
    {
        n: "04",
        name: "Grading rules",
        answers: "How does each measurement change from XS to XXL?",
        prevents: "A small that fits beautifully and a large that fits like a tent.",
    },
    {
        n: "05",
        name: "Bill of materials",
        answers: "What fabric, thread, trim and label goes in it, and where?",
        prevents: "Your 340 GSM hoodie arriving in 240 GSM because nobody named the weight.",
    },
    {
        n: "06",
        name: "Construction & stitching",
        answers: "How is every seam joined, and with which stitch?",
        prevents: "A single-needle hem where you specified a coverstitch, on all 500 units.",
    },
    {
        n: "07",
        name: "Colorways & artwork",
        answers: "Which colors, which print, at what size and placement?",
        prevents: "A chest print sized for a men’s XL landing on a women’s XS.",
    },
    {
        n: "08",
        name: "Labeling & packing",
        answers: "What has to be on the label, the hangtag and the carton?",
        prevents: "A shipment that clears the factory and then sits at the border.",
    },
];

function AnatomyGraphic() {
    return (
        <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                The eight pages of a tech pack
            </h3>
            <p className="text-sm text-[#666666] mb-6">
                Every page answers a question the factory would otherwise answer for you. Read the third column as the
                reason the page exists.
            </p>

            <ol className="grid sm:grid-cols-2 gap-4">
                {PAGES.map((p) => (
                    <li key={p.n} className="rounded-xl border border-gray-200 bg-white p-4 flex gap-3">
                        <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#2D2A2E] text-white text-sm font-extrabold flex items-center justify-center tabular-nums">
                            {p.n}
                        </span>
                        <div className="min-w-0">
                            <p className="font-bold text-[#2D2A2E] leading-snug">{p.name}</p>
                            <p className="text-sm text-[#4A484A] leading-snug mt-1">{p.answers}</p>
                            <p className="text-sm text-[#8C7A5E] leading-snug mt-2">
                                <span className="font-semibold">Prevents:</span> {p.prevents}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>

            <figcaption className="mt-5 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                A tech pack for clothing is not eight documents. It is one file that a merchandiser, a pattern maker, a
                cutting room, a sewing line and a quality checker all read different pages of &mdash; which is why a gap on
                any single page stops being your problem and becomes somebody else&rsquo;s guess.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 — the same mistake, four places to catch it           */
/* Step heights show sequence, not scale (stated in the caption)       */
/* ------------------------------------------------------------------ */
const STAGES = [
    { n: "01", x: 20, y: 232, w: 155, h: 58, where: "In the tech pack", cost: "$0", fill: "#D8CBB6" },
    { n: "02", x: 195, y: 190, w: 155, h: 100, where: "In the first sample", cost: "$150", fill: "#CBB49A" },
    { n: "03", x: 370, y: 135, w: 155, h: 155, where: "In the PP sample", cost: "$900", fill: "#8C7A5E" },
    { n: "04", x: 545, y: 78, w: 135, h: 212, where: "In the bulk run", cost: "$11,500", fill: "#2D2A2E" },
];

const STAGE_NOTES = [
    { n: "01", title: "You change a number", note: "Ten minutes and a new version number. Nothing has been cut yet." },
    { n: "02", title: "One extra sample round", note: "Re-sew, re-ship, re-review. Roughly ten days off your calendar." },
    { n: "03", title: "Re-grade and re-cut", note: "The pattern moves, every size moves with it, and you buy another PP sample. About three weeks." },
    { n: "04", title: "The whole run is wrong", note: "500 units at $23 all-in, made correctly to an instruction that was wrong." },
];

function ErrorCostGraphic() {
    return (
        <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                One wrong sleeve length, four places to catch it
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                The same half-inch error, priced at each stage it survives to. Worked example on a 500-unit run, not a
                price list.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 330"
                    role="img"
                    aria-label="Step diagram showing the cost of one specification error by the stage it is caught: zero dollars if caught in the tech pack, about $150 if caught in the first sample, about $900 if caught in the pre-production sample, and about $11,500 if it survives into a 500-unit bulk run."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>Cost of a single spec error by the stage it is caught</title>
                    {STAGES.map((s, i) => (
                        <g key={s.n}>
                            <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="8" fill={s.fill} />
                            <text
                                x={s.x + s.w / 2}
                                y={s.y + 36}
                                fontSize="22"
                                fontWeight="800"
                                textAnchor="middle"
                                fill={i >= 2 ? "#FFFFFF" : "#2D2A2E"}
                            >
                                {s.cost}
                            </text>
                            <text
                                x={s.x + s.w / 2}
                                y={s.y + 58}
                                fontSize="14"
                                fontWeight="600"
                                textAnchor="middle"
                                fill={i >= 2 ? "#E8E0D4" : "#4A484A"}
                            >
                                {s.where}
                            </text>
                            <text
                                x={s.x + s.w / 2}
                                y={s.y - 10}
                                fontSize="13"
                                fontWeight="700"
                                textAnchor="middle"
                                fill="#8C7A5E"
                            >
                                STAGE {s.n}
                            </text>
                        </g>
                    ))}
                    <line x1="20" y1="292" x2="680" y2="292" stroke="#D9D3C8" strokeWidth="2" />
                    <text x="20" y="316" fontSize="13" fill="#666666">
                        cheapest place to be wrong
                    </text>
                    <text x="680" y="316" fontSize="13" fill="#666666" textAnchor="end">
                        most expensive place to be wrong
                    </text>
                </svg>
            </div>

            <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {STAGE_NOTES.map((item) => (
                    <li key={item.n} className="text-sm text-[#2D2A2E] leading-snug">
                        <span className="font-bold text-[#8C7A5E]">{item.n}</span>{" "}
                        <span className="font-bold">{item.title}</span>
                        <span className="block text-[#4A484A]">{item.note}</span>
                    </li>
                ))}
            </ul>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Step heights show the sequence, not the scale &mdash; stage four is roughly <strong>77 times</strong> stage two.
                Nothing about the error changes between the steps. Only the number of garments already made to it does.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 3 — how a tech pack gets built, 12 working days         */
/* Bars are proportional: 12 working days across a 660px track         */
/* ------------------------------------------------------------------ */
const BUILD_PHASES = [
    { n: "01", label: "Flats & measurements", short: "Flats & measures", days: "Days 1–3", x: 20, w: 165, fill: "#D8CBB6", detail: "Sketches become straight-on line drawings, then a points-of-measure chart in one base size." },
    { n: "02", label: "Bill of materials", short: "Materials", days: "Days 4–6", x: 185, w: 165, fill: "#CBB49A", detail: "Every fabric, thread, trim and label named, with weight, composition, supplier and placement." },
    { n: "03", label: "Construction & grading", short: "Construction", days: "Days 7–9", x: 350, w: 165, fill: "#8C7A5E", detail: "Seam and stitch type at each join, then the rules that turn one size into your whole size run." },
    { n: "04", label: "Labeling & packing", short: "Labeling", days: "Days 10–12", x: 515, w: 165, fill: "#2D2A2E", detail: "Fiber content, country of origin, care instructions, hangtags, polybag and carton markings." },
];

function BuildTimelineGraphic() {
    return (
        <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 03</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Twelve working days, four passes
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                A typical build for one straightforward style. Each pass is finished before the next starts, because each
                one depends on the last.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 150"
                    role="img"
                    aria-label="Timeline of building a fashion tech pack over twelve working days: days 1 to 3 flats and measurements, days 4 to 6 bill of materials, days 7 to 9 construction and grading, days 10 to 12 labeling and packing."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>Tech pack build timeline, twelve working days</title>
                    {BUILD_PHASES.map((p, i) => (
                        <g key={p.n}>
                            <text x={p.x} y="26" fontSize="13" fontWeight="700" fill="#8C7A5E">
                                {p.days}
                            </text>
                            <rect x={p.x} y="38" width={p.w} height="42" rx="6" fill={p.fill} />
                            <text
                                x={p.x + 14}
                                y="64"
                                fontSize="15"
                                fontWeight="700"
                                fill={i >= 2 ? "#FFFFFF" : "#2D2A2E"}
                            >
                                {p.n}
                            </text>
                            <text
                                x={p.x + 40}
                                y="64"
                                fontSize="14"
                                fontWeight="600"
                                fill={i >= 2 ? "#FFFFFF" : "#2D2A2E"}
                            >
                                {p.short}
                            </text>
                        </g>
                    ))}
                    <line x1="20" y1="98" x2="680" y2="98" stroke="#D9D3C8" strokeWidth="2" />
                    <text x="20" y="122" fontSize="13" fill="#666666">
                        brief in
                    </text>
                    <text x="680" y="122" fontSize="13" fill="#666666" textAnchor="end">
                        first sample can be cut
                    </text>
                </svg>
            </div>

            <ol className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {BUILD_PHASES.map((p) => (
                    <li key={p.n} className="text-sm text-[#2D2A2E] leading-snug">
                        <span className="font-bold text-[#8C7A5E]">{p.n}</span>{" "}
                        <span className="font-bold">{p.label}</span>
                        <span className="block text-[#4A484A]">{p.detail}</span>
                    </li>
                ))}
            </ol>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Twelve days sounds slow until you price the alternative. It is the cheapest two and a half weeks in the
                whole calendar, because it is the only stretch where changing your mind costs nothing but time.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */

export default function TechPackExplainedClient({ initialLikeCount, initialComments, faqs, glossary }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("what-it-is");
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
        showToast("Tech pack starter kit on the way to your inbox.", "success");
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

            {/* Hero — container grows with the title (see PIPELINE: fixed-height hero clipped 3-line titles) */}
            <section className="relative min-h-[640px] lg:min-h-[72vh] flex items-center justify-center overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-20">
                <Image
                    src={HERO_IMAGE}
                    alt="A printed fashion tech pack open on a workroom table beside a steel rule and tailor's chalk, cutting table and fabric rolls behind it in morning light."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Design
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">12 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">August 10, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-6xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        What Is a Tech Pack?<br className="hidden lg:block" /> The File Your Factory Builds From
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Almost every line in one exists because somebody, somewhere, once opened a box of 500 garments and found the wrong thing inside.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">&middot; Design &amp; Product Development</span></p>
                            <p className="text-sm text-[#666666]">The Krazy Kreators design &amp; product development desk &middot; August 10, 2026</p>
                        </div>
                    </div>

                    {/* Key takeaways */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Key takeaways</p>
                        <ul className="space-y-2 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>&bull; A tech pack is the <strong>build instruction</strong> for a garment &mdash; flats, measurements, grading, materials, construction, colorways and labeling in one file.</li>
                            <li>&bull; A CAD is <strong>one page inside</strong> a tech pack. A clothing spec sheet is <strong>another page</strong>. Neither is the whole document.</li>
                            <li>&bull; Factories ask for one because without it they have to <strong>guess</strong>, and a guess that gets sewn 500 times is nobody&rsquo;s idea of a good day.</li>
                            <li>&bull; The same half-inch error costs <strong>$0</strong> in the tech pack, <strong>$150</strong> in the first sample, <strong>$900</strong> in the PP sample and <strong>$11,500</strong> in a 500-unit run.</li>
                            <li>&bull; A straightforward style takes about <strong>12 working days</strong> to spec properly &mdash; the cheapest two and a half weeks in your whole calendar.</li>
                            <li>&bull; The pages founders skip most are the ones with legal weight: <strong>fiber content, country of origin, care and flammability</strong>.</li>
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
                                        <Link href="/blogs/grading-vs-pattern-making-perfect-fit" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Design</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Grading vs. pattern making, and why one size fits and the rest don&rsquo;t</p>
                                        </Link>
                                        <Link href="/blogs/mood-boards-to-manufacturable-garments" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Design</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">How mood boards become manufacturable garments</p>
                                        </Link>
                                        <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The lead-time timeline, from design concept to doorstep</p>
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
                                You send a factory three photos, a sketch and a paragraph describing the fit you want. Six weeks later a box arrives, and the garment inside is technically exactly what you asked for.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                It is also two inches too wide across the chest, hemmed with the wrong stitch, and made in a cotton that feels nothing like the one in your head. Nobody lied to you. You simply never said.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                The document that would have prevented all of it is called a tech pack, and it is the single most requested and least understood file in apparel. This is what one contains, why every manufacturer asks for it before quoting, and what it costs when it is missing.
                            </p>

                            {/* H2 1 */}
                            <section id="what-it-is" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What a tech pack actually is
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Taking a point of measure for a clothing tech pack: hands drawing a tape measure across the chest of an unbranded grey cotton tee laid flat on a studio table."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A <strong>tech pack</strong> <em>(the technical specification document a brand gives a factory to build a garment)</em> is a set of pages that turns a design into instructions. Not a description of the garment. Instructions for making it.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The distinction matters more than it sounds. A description leaves room for interpretation, and a factory floor is the worst possible place for room. An instruction has a number attached to it, and a number can be checked.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Think of it the way a builder thinks of a drawing set. Nobody hands a construction crew a photograph of a house they admire and expects the right building. The photograph is the reference. The drawing set is the contract. A tech pack for clothing does the same job, and the step from one to the other is the one we walked through in <Link href="/blogs/mood-boards-to-manufacturable-garments" className="underline text-[#CBB49A] hover:text-[#b7a078]">how mood boards become manufacturable garments</Link>.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A photograph is the reference. The tech pack is the contract. Only one of them can be checked against a finished garment.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    That last part is the quiet function nobody advertises. A tech pack is also the written record of what you asked for &mdash; which is what turns &ldquo;this isn&rsquo;t what I wanted&rdquo; from an opinion into a measurement.
                                </p>

                            </section>

                            {/* H2 2 */}
                            <section id="why-factories-ask" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why no factory will quote without one
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Ask a manufacturer to price a garment from a photo and the honest ones will decline. It is not gatekeeping. It is that a price is built from a list of costs, and the photo does not contain the list.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fabric weight changes the fabric cost. Stitch type changes the machine and the minutes. A bartack at each pocket corner adds seconds per unit, and seconds per unit is how sewing is priced. Change any of those after quoting and the quote was never real.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So a factory looking at an underspecified design has two choices. Guess, and risk making the wrong thing correctly. Or ask, which means a fortnight of email that the tech pack would have answered on page three. Most of the friction founders blame on communication is really a missing document, a point we made at length in <Link href="/blogs/bridging-gap-designers-factories" className="underline text-[#CBB49A] hover:text-[#b7a078]">bridging the gap between designers and factories</Link>.
                                </p>

                                <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 rounded-r-2xl mb-6 not-prose">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs your spec is too thin to quote</p>
                                    <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                        <li>&bull; The supplier&rsquo;s first reply is a list of questions rather than a number.</li>
                                        <li>&bull; Two factories quote the same garment 40% apart &mdash; they are pricing two different garments.</li>
                                        <li>&bull; Your quote arrives with the words &ldquo;approximate&rdquo; or &ldquo;subject to sample&rdquo; attached to the unit price.</li>
                                        <li>&bull; You are asked to approve a fabric you never specified.</li>
                                    </ul>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    There is a second reason, and it is the one that costs money later. A tech pack is what a quality checker inspects against. With no written spec, &ldquo;pass&rdquo; means the garment matches the sample the factory made from its own guess.
                                </p>

                            </section>

                            {/* H2 3 */}
                            <section id="whats-inside" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The eight pages, and what each prevents
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    There is no legally fixed format. There is, however, a set of pages that every competent factory expects to find, and a shorthand for judging any tech pack template you are handed: does it have these eight, and does it fill them in with numbers rather than adjectives?
                                </p>

                                <AnatomyGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Four of those pages deserve a closer look, because they are where founders lose the most money.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Points of measure.</strong> A <strong>POM</strong> <em>(a single named place on the garment that gets measured)</em> is only useful with a <strong>tolerance</strong> <em>(how far the finished garment may differ before it is rejected)</em> beside it. A chest width of 21 inches with no tolerance is a wish. The same number at plus or minus a quarter inch is a standard.
                                </p>

                                <TeachingPhoto
                                    src={POM_IMAGE}
                                    alt="Points of measure on a garment: four tape measures laid across an unbranded tee at chest width, body length, sleeve length and hem opening at once."
                                    label="Page 03 — points of measure"
                                    caption="Four tapes, four numbers, one garment. Every measurement your spec names has to be findable by somebody who has never seen the design — which is why POMs are defined by where they start and stop, not by what they are called."
                                />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Grading rules.</strong> This is the page that decides whether your size run works. Bodies do not scale evenly, so a garment cannot either &mdash; and the industry has published tables for exactly this, such as <a href="https://store.astm.org/d5585-21.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">ASTM D5585-21</a>, the standard body measurements for adult female misses sizing. Why a great small can become a poor large is the whole subject of <Link href="/blogs/grading-vs-pattern-making-perfect-fit" className="underline text-[#CBB49A] hover:text-[#b7a078]">grading vs. pattern making</Link>.
                                </p>

                                <TeachingPhoto
                                    src={GRADING_IMAGE}
                                    alt="Grading a size run: three nested paper patterns of the same garment front in small, medium and large, stacked and offset so the growth between sizes is visible."
                                    label="Page 04 — grading rules"
                                    caption="The same piece in three sizes, stacked. Notice the gaps are not even — a shoulder grows less than a chest, and a neckline barely moves. That uneven growth is the whole page, and it is why scaling a pattern up by a percentage produces a garment nobody fits."
                                />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <strong>Bill of materials.</strong> Name the fabric by composition, construction and weight, not by feel &mdash; &ldquo;heavyweight French terry&rdquo; is not a spec, and <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="underline text-[#CBB49A] hover:text-[#b7a078]">340 GSM is</Link>. The same discipline applies to every zipper, cord tip and label, because <Link href="/blogs/essential-trimmings-quality" className="underline text-[#CBB49A] hover:text-[#b7a078]">trims are where perceived quality actually lives</Link>.
                                </p>

                                <TeachingPhoto
                                    src={BOM_IMAGE}
                                    alt="A bill of materials for one garment: a spool of thread, a brass zipper, a drawcord with metal tips, two buttons, a blank label and a roll of grey fleece laid out on a workbench."
                                    label="Page 05 — bill of materials"
                                    caption="One hoodie, taken apart into things you have to buy. Each of these carries its own supplier, its own lead time and its own minimum — which is why the BOM is the page that quietly sets your delivery date."
                                />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    <strong>Construction and stitching.</strong> There is a shared vocabulary here, set out in <a href="https://store.astm.org/d6193-16r20.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">ASTM D6193</a>, which classifies stitches into six classes and seams into eight types. Writing &ldquo;coverstitch hem, 1/4 inch&rdquo; instead of &ldquo;neat hem&rdquo; is the difference between an instruction and a hope.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Adjectives are how designers talk to each other. Numbers are how designers talk to factories.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Page eight, labeling and packing, is the one that gets skipped most and carries the most legal weight. In the United States most textile garments must carry fiber content, country of origin and the identity of the responsible company, all set out in the FTC&rsquo;s <a href="https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">guide to the Textile and Wool Acts</a>. Care instructions are separately mandated by the <a href="https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Care Labeling Rule</a>, and the fabric itself has to pass the flammability standard at <a href="https://www.ecfr.gov/current/title-16/chapter-II/subchapter-D/part-1610" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">16 CFR Part 1610</a>. None of that is your factory&rsquo;s job to remember for you.
                                </p>

                            </section>

                            {/* H2 4 */}
                            <section id="vs-cad" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Tech pack, CAD or spec sheet?
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    These three words get used as though they mean the same thing, and the confusion is expensive. Two of them are pages. One of them is the document those pages live in.
                                </p>

                                <TeachingPhoto
                                    src={FLATS_IMAGE}
                                    alt="A technical flat, or CAD: a precise black line drawing of a hoodie front and back on gridded paper, showing seams, topstitching, pocket and hood construction, drawn straight on with no body in it."
                                    label="Page 02 — the technical flat (CAD)"
                                    caption="This is a CAD, and this alone is what most founders send a factory. It is accurate, it is necessary, and it answers exactly one question: what does it look like. Nothing here says how big, in what, or sewn how."
                                />

                                <div className="not-prose overflow-x-auto mb-6 rounded-2xl border border-gray-200">
                                    <table className="w-full text-left text-sm sm:text-base">
                                        <thead className="bg-[#2D2A2E] text-white">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold whitespace-nowrap">What you send</th>
                                                <th className="px-4 py-3 font-semibold">What it is</th>
                                                <th className="px-4 py-3 font-semibold">What it answers</th>
                                                <th className="px-4 py-3 font-semibold">Who reads it</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">CAD / technical flat</td>
                                                <td className="px-4 py-3 text-[#4A484A]">A scaled, straight-on line drawing of the garment, seams and details included, with no body in it.</td>
                                                <td className="px-4 py-3 text-[#4A484A]">What does it look like?</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Designer, pattern maker</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-[#2D2A2E]">Clothing spec sheet</td>
                                                <td className="px-4 py-3 text-[#4A484A]">The measurement chart on its own: every point of measure, its target value, and its tolerance.</td>
                                                <td className="px-4 py-3 text-[#4A484A]">How big is it?</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Sample room, quality control</td>
                                            </tr>
                                            <tr className="bg-[#F8F7F4]">
                                                <td className="px-4 py-3 font-bold text-[#2D2A2E]">Tech pack</td>
                                                <td className="px-4 py-3 text-[#4A484A]">All eight pages: flats, spec, grading, materials, construction, colorways, labeling and packing.</td>
                                                <td className="px-4 py-3 text-[#4A484A]">How is it made, in what, at what size, with what on the label?</td>
                                                <td className="px-4 py-3 text-[#4A484A]">Everyone above, plus cutting, sewing, compliance and shipping</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    So the answer to &ldquo;tech pack vs CAD&rdquo; is that it is not a versus. Sending a CAD alone tells a factory the shape you want and nothing about the garment. Sending a spec sheet alone tells them the size of something they cannot picture.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Tech Pack Starter Kit</h4>
                                        <p className="text-[#4A484A] leading-snug">A blank tech pack template covering all eight pages, a points-of-measure sheet for tees, hoodies and woven shirts with standard tolerances already filled in, and the 12-point check on this page as a printable list. Spreadsheet + PDF.</p>
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
                                            Send me the starter kit
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Starter kit on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 5 */}
                            <section id="cost-of-skipping" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What skipping it actually costs
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="What a tech pack's construction page specifies: macro of a flatlock seam in contrasting tan thread on grey cotton jersey, both needle rows and the interlooping visible."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Development work feels like the easiest line to cut, because at the moment you cut it nothing bad happens. The bill arrives later, and it arrives multiplied.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Take one error &mdash; a sleeve half an inch short of what you pictured &mdash; and follow it forward through the four places it can be caught.
                                </p>

                                <TeachingPhoto
                                    src={SAMPLING_IMAGE}
                                    alt="Three sample rounds of the same unbranded hoodie hanging side by side on a rail, the proto in the wrong fabric, the fit sample corrected, and the pre-production sample in the final cloth."
                                    label="Where errors get caught — the sample rounds"
                                    caption="The same style, three rounds: proto, fit, pre-production. Each hanger is a chance to catch the error cheaply, and each one you skip moves the mistake one step closer to the 500 units on the right of the chart below."
                                />

                                <ErrorCostGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The garment is not defective at any point in that sequence. It is built correctly, every time, to an instruction that was wrong. That is what makes specification errors so expensive: no inspection catches them, because there is nothing to catch.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then there is the slower cost, the one that shows up as a refund. Retailers expect to take back <a href="https://nrf.com/research/2025-retail-returns-landscape" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">15.8% of everything sold, rising to 19.3% of online sales</a>, according to the National Retail Federation. For a direct-to-consumer brand, a size run that grades badly is a return rate you pay for every month, quietly, forever.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    And an undocumented order removes your recourse. When the spec lives in an email thread, a dispute is two memories arguing &mdash; which is the mechanism behind most of the horror stories in <Link href="/blogs/the-real-cost-of-wrong-clothing-manufacturer" className="underline text-[#CBB49A] hover:text-[#b7a078]">the real cost of choosing the wrong manufacturer</Link>.
                                </p>

                            </section>

                            {/* H2 6 */}
                            <section id="how-its-built" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How a tech pack gets built
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={PATTERNS_IMAGE}
                                        alt="Paper garment pattern pieces on a studio rail under one hard shaft of light — the physical output of a fashion tech pack's flats and grading rules."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It is less mysterious than it looks. Four passes, each one finished before the next begins, because each pass depends on a decision made in the one before it.
                                </p>

                                <BuildTimelineGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two things about that calendar are worth internalising. It runs before your first sample, not alongside it &mdash; a sample cut from an unfinished spec is a sample of nothing. And it repeats, in miniature, after every fit session, because a tech pack is a living file with version numbers, not a document you finish once.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Where it sits in the wider schedule matters too, and it sits early: everything downstream of it &mdash; sampling, fabric booking, bulk, shipping &mdash; is laid out week by week in <Link href="/blogs/lead-time-timeline-design-to-doorstep" className="underline text-[#CBB49A] hover:text-[#b7a078]">the lead-time timeline from design to doorstep</Link>.
                                </p>

                            </section>

                            {/* H2 7 */}
                            <section id="the-check" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The check before you hit send
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Run this before a tech pack leaves your desk. Each line is here because leaving it out has cost somebody a sample round.
                                </p>

                                <div className="not-prose grid sm:grid-cols-2 gap-5 mb-6">
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">The garment</p>
                                        <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                            <li>&bull; Every point of measure has a tolerance next to it.</li>
                                            <li>&bull; The measurement chart names its base size, and the grading page covers every size you intend to sell.</li>
                                            <li>&bull; Flats show the back and any detail that is hard to see &mdash; cuff, placket, pocket bag, drawcord channel.</li>
                                            <li>&bull; Every seam has a named stitch type, including the hem and the neckline finish.</li>
                                            <li>&bull; Fabric is written as composition, construction and weight, never as a texture.</li>
                                            <li>&bull; Every trim has a supplier reference or a physical sample attached.</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C7A5E] mb-3">Everything after the garment</p>
                                        <ul className="space-y-2 text-[#2D2A2E] text-base leading-snug">
                                            <li>&bull; Artwork is supplied as a vector file with a printed size in inches, not a percentage.</li>
                                            <li>&bull; Colors are given as a physical standard or a lab dip reference, not a screen color.</li>
                                            <li>&bull; The label page lists fiber content, country of origin and your responsible-party identity.</li>
                                            <li>&bull; Care instructions are stated, and someone has confirmed the fabric can survive them.</li>
                                            <li>&bull; Packing says how each unit is folded, bagged, labeled and cartoned.</li>
                                            <li>&bull; The file carries a version number and a date, and the factory has the latest one.</li>
                                        </ul>
                                    </div>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The last line is the one people laugh at and then get caught by. A factory working from version two while you review version four is the most common self-inflicted wound in production.
                                </p>

                            </section>

                            {/* H2 8 — glossary */}
                            <section id="plain-english" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The terms, in plain English
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Most of the intimidation in this subject is vocabulary. Here is the whole vocabulary.
                                </p>

                                <dl className="not-prose grid sm:grid-cols-2 gap-4">
                                    {glossary.map((g) => (
                                        <div key={g.term} className="rounded-xl border border-gray-200 bg-[#F8F7F4] p-4">
                                            <dt className="font-bold text-[#2D2A2E] leading-snug mb-1">{g.term}</dt>
                                            <dd className="text-sm text-[#4A484A] leading-snug">{g.def}</dd>
                                        </div>
                                    ))}
                                </dl>

                            </section>

                            {/* H2 9 — counterexample */}
                            <section id="when-you-dont" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When you don&rsquo;t need the full document
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="The garment a tech pack for clothing produces: an unbranded heavyweight hoodie on an invisible form, shoulder seam, drawcord and cuff rib lit hard from the right."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Honesty demands the exception. If you are printing your artwork on a blank garment somebody else already manufactured, you do not need a tech pack. You need an artwork file, a placement diagram and a print size. The garment&rsquo;s construction is not yours to specify.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Similarly, if you are buying a factory&rsquo;s existing block and changing the fabric and labels, most of the spec already exists in their system. You are editing a tech pack rather than writing one, and pretending otherwise wastes money on both sides.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    There is also a version of this document that is too heavy. A forty-page pack for a single jersey tee, full of pages copied from a template and never filled in, is worse than a tight eight-page one &mdash; because a factory that finds three empty pages stops trusting the other five.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A factory that finds three empty pages stops trusting the other five.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The test is not length. It is whether a stranger could build your garment from it without calling you.
                                </p>

                            </section>

                            {/* H2 10 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Before you email another factory, take your best-fitting existing garment off its hanger and measure it at ten points. That single sheet will tell you more about the fit you actually want than another week of reference images, and it is the honest start of a real spec.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    Then get the rest of it drawn properly &mdash; by a technical designer, a pattern maker, or the <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design and product development team</Link> at Krazy Kreators, who build the tech pack alongside your first order rather than billing it as a separate project. So: if you handed your current spec to a factory on the other side of the world tomorrow, which page would they call you about first?
                                </p>
                            </section>

                            {/* FAQ */}
                            <section id="faq" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Common questions
                                </h2>
                                <div className="not-prose space-y-4">
                                    {faqs.map((f) => (
                                        <div key={f.q} className="rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5">
                                            <h3 className="font-bold text-[#2D2A2E] mb-2 leading-snug text-lg">{f.q}</h3>
                                            <p className="text-[#4A484A] leading-snug">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/grading-vs-pattern-making-perfect-fit" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Grading vs. Pattern Making</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">Page four of your tech pack, in full: why the sample fits beautifully and the size run doesn&rsquo;t.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the guide <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Get your tech pack built with your first order</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Talk to a Krazy Kreators production lead about your style. Design and the full tech pack come with your first order &mdash; flats, measurements, grading, materials, construction and labeling, ready for the sample room.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/mood-boards-to-manufacturable-garments",
                                            title: "Mood Boards to Manufacturable Garments",
                                            dek: "The step before the tech pack: turning a reference wall into something buildable.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight",
                                            title: "Understanding Fabric GSM",
                                            dek: "How to write your fabric page in numbers instead of adjectives.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/costly-mistakes-startup-make",
                                            title: "Costly Mistakes Fashion Startups Make",
                                            dek: "The spec gap is one of them. Here are the rest, and what they cost.",
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

                            {/* About Krazy Kreators */}
                            <div className="mt-16 p-6 rounded-2xl bg-[#F8F7F4] border border-gray-100">
                                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">About Krazy Kreators</p>
                                <p className="text-base leading-relaxed text-[#4A484A]">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; design, sampling, fabric sourcing, retail-grade production, and packaging, under one roof, from first sketch to shelf. <a href="https://www.krazykreators.com" className="underline text-[#CBB49A] hover:text-[#b7a078]">krazykreators.com</a>
                                </p>
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
                                                                <span className="text-sm text-[#666666]">&bull;</span>
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
                        Get your tech pack built with your first order <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
