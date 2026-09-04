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

const BLOG_ID = "back-to-school-custom-apparel-2026";

const HERO_IMAGE = "/blog/back-to-school-apparel-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/back-to-school-apparel-2026-section1.jpg";
const GARMENT_IMAGE = "/blog/back-to-school-apparel-2026-garment.jpg";
const MACRO_IMAGE = "/blog/back-to-school-apparel-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/back-to-school-apparel-2026-closing.jpg";

const TOC = [
    { id: "window", label: "Where the money actually is" },
    { id: "categories", label: "What actually sells in fall" },
    { id: "leadtime", label: "Pick the date, count backward" },
    { id: "dtf", label: "Why film beats screens" },
    { id: "bundles", label: "Bundles and order value" },
    { id: "timeline", label: "The eight-week capsule" },
    { id: "the-move", label: "What we’d do in your shoes" },
    { id: "faq", label: "Common questions" },
];

const ACCENT = "#CBB49A";

type Faq = { q: string; a: string };

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
    faqs: Faq[];
};

/* ------------------------------------------------------------------ */
/* Infographic 1 — where the back-to-school dollar actually goes       */
/* Bars scale at 5px per $1bn against a 110bn axis. Figures are NRF's  */
/* July 2026 survey and are repeated verbatim in the body text.        */
/* ------------------------------------------------------------------ */
const SPEND_ROWS = [
    { label: "Back-to-college, total", value: "$103.5bn", width: 518, fill: "#2D2A2E" },
    { label: "Back-to-college, clothing and accessories", value: "$13.1bn", width: 66, fill: ACCENT },
    { label: "K-12 back-to-school, total", value: "$43.3bn", width: 217, fill: "#2D2A2E" },
    { label: "K-12, clothing and accessories", value: "$12.5bn", width: 63, fill: ACCENT },
];

function SpendSplitGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 01</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Where the back-to-school dollar goes
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                US spending intentions for the 2026 season, from the National Retail Federation&rsquo;s July survey of
                7,533 consumers. Dark bars are the whole season; gold bars are the apparel slice inside it.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 700 330"
                    role="img"
                    aria-label="Bar chart of 2026 US back-to-school spending intentions: back-to-college total 103.5 billion dollars, of which clothing and accessories is 13.1 billion; K-12 back-to-school total 43.3 billion dollars, of which clothing and accessories is 12.5 billion."
                    className="w-full h-auto min-w-[560px]"
                >
                    <title>US back-to-school and back-to-college spending intentions, 2026</title>
                    {SPEND_ROWS.map((row, i) => {
                        const y = 30 + i * 70;
                        return (
                            <g key={row.label}>
                                <text x="0" y={y - 8} fontSize="15" fontWeight="600" fill="#2D2A2E">
                                    {row.label}
                                </text>
                                <rect x="0" y={y} width={row.width} height="30" rx="6" fill={row.fill} />
                                <text x={row.width + 12} y={y + 22} fontSize="19" fontWeight="800" fill="#2D2A2E">
                                    {row.value}
                                </text>
                            </g>
                        );
                    })}
                    <line x1="0" y1="315" x2="550" y2="315" stroke="#D6D1C7" strokeWidth="2" />
                    {[0, 25, 50, 75, 100].map((t) => (
                        <text key={t} x={t * 5} y="307" fontSize="12" fill="#666666" textAnchor={t === 0 ? "start" : "middle"}>
                            ${t}bn
                        </text>
                    ))}
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                The two gold bars are almost the same length. There are far fewer college students than school
                children, and they still buy slightly more clothing &mdash; which is the whole argument for pointing a
                small brand at campus rather than at carpool.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Infographic 2 — the 8-week fall capsule                             */
/* Week numbers and labels are identical to the body list below.       */
/* ------------------------------------------------------------------ */
const WEEK_STEPS = [
    { wk: "Week 1", head: "Range locked", body: "Tech packs out", fill: "#2D2A2E" },
    { wk: "Week 2", head: "Blanks confirmed", body: "Colours approved", fill: "#2D2A2E" },
    { wk: "Week 3", head: "Print proofs", body: "On the real blank", fill: ACCENT },
    { wk: "Week 4", head: "Sample signed", body: "Fit and hand feel", fill: ACCENT },
    { wk: "Weeks 5–6", head: "Bulk production", body: "The long pole", fill: "#8C7A5E" },
    { wk: "Week 7", head: "QC and packing", body: "Bundles built here", fill: "#8C7A5E" },
    { wk: "Week 8", head: "Freight in", body: "Stock on your shelf", fill: "#2D2A2E" },
];

function CapsuleTimelineGraphic() {
    return (
        <figure className="my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-7 not-prose">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Infographic 02</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D2A2E] mb-1 leading-snug">
                Eight weeks, counted backward from the date you want stock
            </h3>
            <p className="text-sm text-[#666666] mb-5">
                A realistic clock for a printed fleece capsule of four to six designs. Read it right to left: fix the
                delivery date first, then find week one.
            </p>

            <div className="overflow-x-auto">
                <svg
                    viewBox="0 0 900 200"
                    role="img"
                    aria-label="Eight-week production timeline for a fall apparel capsule: week 1 range locked and tech packs out; week 2 blanks confirmed and colours approved; week 3 print proofs on the real blank; week 4 sample signed off for fit and hand feel; weeks 5 to 6 bulk production; week 7 quality control, packing and bundle assembly; week 8 freight inbound and stock on the shelf."
                    className="w-full h-auto min-w-[760px]"
                >
                    <title>Eight-week fall capsule production timeline</title>
                    <line x1="30" y1="96" x2="870" y2="96" stroke="#D6D1C7" strokeWidth="3" />
                    {WEEK_STEPS.map((s, i) => {
                        const x = 62 + i * 129;
                        return (
                            <g key={s.wk}>
                                <text x={x} y="44" fontSize="14" fontWeight="800" fill={s.fill} textAnchor="middle">
                                    {s.wk}
                                </text>
                                <text x={x} y="66" fontSize="13" fontWeight="600" fill="#4A484A" textAnchor="middle">
                                    {s.head}
                                </text>
                                <line x1={x} y1="76" x2={x} y2="88" stroke={s.fill} strokeWidth="2" />
                                <circle cx={x} cy="96" r="9" fill={s.fill} />
                                <text x={x} y="126" fontSize="12.5" fill="#666666" textAnchor="middle">
                                    {s.body}
                                </text>
                            </g>
                        );
                    })}
                    <text x="30" y="172" fontSize="13" fontWeight="700" fill="#2D2A2E">
                        Weeks 5&ndash;6 are the only ones a factory cannot compress for you.
                    </text>
                </svg>
            </div>

            <figcaption className="mt-4 text-sm text-[#4A484A] leading-snug border-t border-gray-200 pt-4">
                Every week left of bulk is a decision you control. Founders lose the window in weeks one to four, then
                ask production to make it up in five and six &mdash; which is the one place it cannot be made up.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* Print-method comparison — HTML, not an image, so it cannot drift    */
/* ------------------------------------------------------------------ */
const PRINT_ROWS = [
    {
        factor: "Setup per design",
        screen: "One screen per colour, per design, remade each run",
        dtf: "None. The file is the setup",
    },
    {
        factor: "Cost curve",
        screen: "Falls steeply with quantity of the same design",
        dtf: "Close to flat per piece, whatever the quantity",
    },
    {
        factor: "Full-colour artwork",
        screen: "Expensive — every colour is another screen",
        dtf: "Priced the same as one colour",
    },
    {
        factor: "Adding a design late",
        screen: "New screens, new setup, new minimum",
        dtf: "Send the file",
    },
    {
        factor: "Hand feel on heavy fleece",
        screen: "Softer, especially discharge and water-based",
        dtf: "A thin film you can feel on a premium crewneck",
    },
];
export default function BackToSchoolApparelClient({ initialLikeCount, initialComments, faqs }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("claim");
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
        showToast("Fall Drop Countdown on the way to your inbox.", "success");
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
                    alt="Back to school custom apparel 2026: a university quad at first light in early autumn, three students walking away from camera in heavyweight unbranded hooded sweatshirts, long shadows across wet stone paving, brick and glass buildings soft in the background."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Manufacturing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">5 min read</span>
                        <span className="text-sm text-gray-400">&bull;</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 3, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-6xl drop-shadow-lg mb-6 tracking-tight text-balance">
                        Back-to-School 2026 Custom Apparel:<br className="hidden lg:block" /> How Small Brands Can Capture the Fall Merch Rush
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        $103.5 billion moved through back-to-college this year. What decides who gets a share of it is not demand &mdash; it is a calendar most brands start reading too late.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">&middot; Production &amp; Sourcing</span></p>
                            <p className="text-sm text-[#666666]">The Krazy Kreators production &amp; sourcing desk &middot; September 3, 2026</p>
                        </div>
                    </div>

                    {/* At a glance — the plan in one panel */}
                    <div className="not-prose border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-4">Plan your fall drop &mdash; at a glance</p>
                        <dl className="divide-y divide-gray-200">
                            {[
                                { k: "Design trends", v: <>Heavy loopback fleece, boxy cuts, raised puff prints, washed colour</> },
                                { k: "Ideal products", v: <>Four SKUs: hoodie in two colours, matching crewneck, tee, one accessory</> },
                                { k: "Fabric weight", v: <>380&ndash;450 gsm (11&ndash;13 oz/yd&sup2;) &mdash; what holds a $78 price through a term of washing</> },
                                { k: "Print method", v: <>Many designs in small numbers &rarr; DTF. One design in depth &rarr; screens</> },
                                { k: "Production timeline", v: <><strong>8 weeks</strong> from locked range to stock on the shelf; add 2&ndash;4 for custom fabric or embroidery</> },
                                { k: "Watch out for", v: <>University names and logos are trademarks &mdash; you need a licence to sell them</> },
                                {
                                    k: "MOQ &amp; pricing",
                                    v: (
                                        <>
                                            Depends on fabric, print method and run size &mdash; see{" "}
                                            <Link href="/blogs/custom-clothing-manufacturing-cost" className="underline text-[#CBB49A] hover:text-[#b7a078]">cost at every MOQ tier</Link>{" "}
                                            and{" "}
                                            <Link href="/blogs/no-moq-clothing-manufacturers" className="underline text-[#CBB49A] hover:text-[#b7a078]">what a no-MOQ run really costs</Link>
                                        </>
                                    ),
                                },
                            ].map((row) => (
                                <div key={row.k} className="py-2.5 sm:grid sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-4">
                                    <dt
                                        className="text-sm font-bold uppercase tracking-wide text-[#2D2A2E]"
                                        dangerouslySetInnerHTML={{ __html: row.k }}
                                    />
                                    <dd className="text-[#4A484A] leading-snug mt-0.5 sm:mt-0">{row.v}</dd>
                                </div>
                            ))}
                        </dl>
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
                                        <Link href="/blogs/dtf-vs-screen-printing-right-for-volume" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">DTF vs screen printing: which is right for your volume</p>
                                        </Link>
                                        <Link href="/blogs/clothing-production-timeline" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">From sketch to store: a real production timeline</p>
                                        </Link>
                                        <Link href="/blogs/holiday-2026-production-window-us-founders-order-now" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The holiday window, and when to place the order</p>
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
                                American college students and their families spent <strong>$103.5 billion</strong> getting ready for this school year. It is the first time that number has passed a hundred billion. Very little of it reached a small brand.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                That is a timing problem, not a demand one. <a href="https://nrf.com/media-center/press-releases/majority-of-back-to-school-shoppers-get-a-head-start-on-the-season" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Most shoppers had already started buying by early July</a>. Begin designing in July and the money is already moving without you.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                The useful part: the fall season does not end at move-in. Homecoming and family weekends run right through October, and here is how to land a drop in time for them.
                            </p>

                            {/* H2 1 */}
                            <section id="window" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The season splits in two, and one half is much bigger
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The National Retail Federation asked 7,533 shoppers in July what they planned to spend. Families with school-age children came to $43.3 billion. College came to $103.5 billion.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Now look only at clothing. School families plan $250.29 each, which adds up to $12.5 billion. College shoppers plan less each &mdash; $182.39 &mdash; and it still adds up to <strong>$13.1 billion</strong>.
                                </p>

                                <SpendSplitGraphic />
                            </section>

                            {/* H2 2 */}
                            <section id="categories" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What actually sells in fall
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Custom college apparel: a wall of folded heavyweight fleece sweatshirts in muted campus colours on open timber shelving in a small independent shop, warm afternoon light from a shopfront window, no branding visible."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fleece carries the season. A hoodie and a crewneck are the two things a student wears in public nearly every day for four months, which is what turns them into repeat purchases.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Weight is what makes a $78 crewneck feel like one. Heavy fleece &mdash; 380 to 450 grams per square metre, or 11 to 13 ounces per square yard &mdash; keeps its shape through a term of washing; thin fleece tells the buyer what you paid. Our <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="underline text-[#CBB49A] hover:text-[#b7a078]">guide to fabric weight</Link> has the range, and the campus streetwear look is unpacked in <Link href="/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes" className="underline text-[#CBB49A] hover:text-[#b7a078]">heavy fleece and puff prints</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One warning before you draw anything. University names, nicknames and logos are trademarks, and selling them needs a licence &mdash; Kansas asks for <a href="https://services.ku.edu/TDClient/818/Portal/KB/Article/21420/Trademark-Licensing-Policy" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">at least 12 percent of the wholesale price</a> on every item sold. Selling the town instead of the college costs nothing and usually makes a better brand.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">The four-SKU fall capsule</p>
                                    <ul className="space-y-2 text-[#2D2A2E] leading-snug">
                                        <li>&bull; One heavy hoodie in two colours &mdash; the margin engine</li>
                                        <li>&bull; One crewneck sharing the hoodie&rsquo;s fabric and print &mdash; no new setup</li>
                                        <li>&bull; One tee as the entry price and the bundle filler</li>
                                        <li>&bull; One cheap accessory &mdash; beanie, cap or socks &mdash; to finish a bundle</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 3 */}
                            <section id="leadtime" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Pick the date first, then count backward
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Most four-year campuses move students in across the middle two weeks of August, and sales peak in the first fortnight of term. To have boxes on hand by mid-August, production has to finish by the end of July &mdash; which puts week one in the first week of June. Our <Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">sketch-to-store timeline</Link> shows where those weeks go.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    October is the forgiving part. Rutgers holds <a href="https://scarletknights.com/news/2026/4/14/football-2026-homecoming-family-weekend-oct-3-vs-indiana" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">homecoming on 3 October</a>, and Kansas has set <a href="https://kuathletics.com/news/2026/2/12/football-kansas-sets-2026-homecoming-family-weekend-dates" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">its 114th homecoming for 24 October</a>. Both bring paying parents onto campus, and eight weeks started in early September clears them.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Put import duty in the price, not in a footnote. A cotton T-shirt enters the US at a <a href="https://hts.usitc.gov/search?query=61091000" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">16.5% base rate</a> before anything else is added, and 2026 has added plenty &mdash; we covered <Link href="/blogs/section-122-tariff-replacement-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">what replaced Section 122</Link> separately.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Fall Drop Countdown</h4>
                                        <p className="text-[#4A484A] leading-snug">Put in the date you want stock on the shelf and this one-pager gives you the eight dates before it, with what has to be signed at each one. Includes the trademark questions to settle first and a landed-cost line for the blanks. Spreadsheet + PDF.</p>
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
                                            Send me the countdown
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">On its way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="dtf" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why film beats screens on a fall drop
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Back to school t-shirt printing: an extreme close-up of the boundary between a flat printed area and raw heavyweight fleece, individual loops of yarn standing along the edge, hard raking sidelight against deep shadow."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Screen printing charges you before it prints anything. Every colour in every design needs its own screen, made fresh for the run &mdash; six designs in four colours is twenty-four screens. Make forty of each and those screens are most of what you paid.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    DTF works the other way round. The design is printed onto a thin film, dusted with glue powder and pressed on with heat. No screens, full colour costs what one colour costs, and the price per shirt barely moves between forty pieces and four hundred.
                                </p>

                                <div className="not-prose my-7 overflow-x-auto rounded-2xl border border-gray-200">
                                    <table className="w-full min-w-[640px] text-left border-collapse bg-white">
                                        <thead>
                                            <tr className="bg-[#F8F7F4]">
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">Factor</th>
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">Screen printing</th>
                                                <th className="p-4 text-sm font-bold uppercase tracking-wider text-[#2D2A2E] border-b border-gray-200">DTF</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {PRINT_ROWS.map((row) => (
                                                <tr key={row.factor} className="align-top">
                                                    <td className="p-4 border-b border-gray-100 font-semibold text-[#2D2A2E]">{row.factor}</td>
                                                    <td className="p-4 border-b border-gray-100 text-[#4A484A]">{row.screen}</td>
                                                    <td className="p-4 border-b border-gray-100 text-[#4A484A]">{row.dtf}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So it is not about how much you make, but how many designs &mdash; and a campus drop is nearly always many designs, few of each. See the <Link href="/blogs/dtf-vs-screen-printing-right-for-volume" className="underline text-[#CBB49A] hover:text-[#b7a078]">full cost comparison</Link> and <Link href="/blogs/no-moq-clothing-manufacturers" className="underline text-[#CBB49A] hover:text-[#b7a078]">what you really pay with a no-MOQ manufacturer</Link>.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The honest downside is feel. On a heavy $95 crewneck you can feel a DTF print sitting on the surface, where a screen print sinks in. If one design will carry the drop, print that one on screens.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="bundles" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Bundles lift the value of a single order
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="Campus streetwear brand: a single heavyweight unbranded hooded sweatshirt on a matte black display form, boxy cut and thick ribbing catching a hard directional key light, deep charcoal background falling away behind it."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Six weeks is not long enough to build loyalty. It is long enough to make one order bigger, and that is the only lever you have inside the window. Three bundles work on campus.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Three bundles that work</p>
                                    <ul className="space-y-2 text-[#2D2A2E] leading-snug">
                                        <li>&bull; <strong>The move-in kit</strong> &mdash; hoodie, tee and beanie for less than the three cost apart</li>
                                        <li>&bull; <strong>The roommate two-pack</strong> &mdash; one buyer, two garments, no second ad spend</li>
                                        <li>&bull; <strong>The family-weekend gift box</strong> &mdash; for a parent buying for someone else</li>
                                    </ul>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of them talk anyone into spending more; they meet a decision the buyer had already made. Have them assembled at the factory during the packing week &mdash; a bundle built by hand at 2am ships late. A card naming the drop and a sheet of stickers cost very little, and the stickers end up on a laptop and walk into every lecture. If you would rather not hold stock, <Link href="/blogs/on-demand-clothing-manufacturing-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">on-demand production</Link> trades margin for that freedom.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="timeline" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The eight-week fall capsule
                                </h2>

                                <CapsuleTimelineGraphic />

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Weeks one to four are decisions, and the biggest is the tech pack &mdash; the file the factory builds from, and <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">here is what belongs in it</Link>. Check the print on the real garment, not on paper.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Weeks five and six are the making, and they are the only stretch a factory cannot speed up for you. Week seven is checking and packing. Week eight is freight.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Eight weeks suits a printed fleece capsule. Custom fabric, embroidery or garment dyeing adds two to four more, and a first order with a new factory deserves a fortnight of slack on top. What each quantity actually costs is in our guide to <Link href="/blogs/custom-clothing-manufacturing-cost" className="underline text-[#CBB49A] hover:text-[#b7a078]">manufacturing cost at every MOQ</Link>.
                                </p>
                            </section>

                            {/* H2 7 — Closing */}
                            <section id="the-move" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&rsquo;d do in your shoes
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="Fall merch drop ideas: a small studio packing bench at night under a single lamp, folded fleece stacked beside grey mailers and a roll of tape, a pair of hands mid-fold, everything else falling into shadow."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Pick one campus and four designs, not six campuses and twenty. Write down the date you want stock &mdash; the Saturday of a homecoming you can name, not &ldquo;the fall&rdquo; &mdash; and count back eight weeks. Settle the trademark question before you draw anything; it is the only thing here that can cost you the whole run after it is printed.
                                </p>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Which date are you counting back from?
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

                            {/* About Krazy Kreators */}
                            <div className="not-prose mt-12 mb-4 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">About Krazy Kreators</p>
                                <p className="text-[#4A484A] leading-snug">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design</Link>, sampling, <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">under one roof</Link>, from first sketch to shelf. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/dtf-vs-screen-printing-right-for-volume" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">DTF vs Screen Printing: Which Is Right for Your Volume</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">You know which shape of order suits film. This is where the two cost curves actually cross, design by design.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Plan Your Back-to-School Collection with Krazy Kreators</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Bring us the date you want stock on the shelf and we will work backward from it &mdash; fleece weight against the price you want to hold, the print method that suits your number of designs, quantities and costing for your run, and what has to be signed each week to land it before homecoming.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/holiday-2026-production-window-us-founders-order-now",
                                            title: "The Holiday Window Is Already Open",
                                            dek: "Fall stock lands, then Q4 starts. The dates to place the next order against.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes",
                                            title: "Heavy GSM, Puff Prints and Acid Washes",
                                            dek: "The construction vocabulary behind the campus streetwear look, decoded.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/clothing-production-timeline",
                                            title: "From Sketch to Store: A Real Timeline",
                                            dek: "Where the weeks actually go on a first run, stage by stage.",
                                            read: "9 min read",
                                        },
                                    ].map((card) => (
                                        <Link key={card.href} href={card.href} className="group block rounded-2xl border border-gray-100 overflow-hidden hover:border-[#CBB49A] transition-colors">
                                            <div className="p-6">
                                                <p className="text-xs font-medium text-[#666666] mb-2">{card.read}</p>
                                                <h4
                                                    className="text-lg font-bold text-[#2D2A2E] leading-snug mb-2 group-hover:underline"
                                                    dangerouslySetInnerHTML={{ __html: card.title }}
                                                />
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
                        Plan your back-to-school collection with Krazy Kreators <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
