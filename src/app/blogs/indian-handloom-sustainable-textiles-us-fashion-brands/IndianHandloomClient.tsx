"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle, X, Check } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = "indian-handloom-sustainable-textiles-us-fashion-brands";

const HERO_IMAGE = "/blog/indian-handloom-sustainable-textiles-us-fashion-brands-hero.jpg";
const SECTION1_IMAGE = "/blog/indian-handloom-sustainable-textiles-us-fashion-brands-section1.jpg";
const GARMENT_IMAGE = "/blog/indian-handloom-sustainable-textiles-us-fashion-brands-garment.jpg";
const CLOSING_IMAGE = "/blog/indian-handloom-sustainable-textiles-us-fashion-brands-closing.jpg";

const LINK = "underline text-[#CBB49A] hover:text-[#b7a078]";
const EXT = { target: "_blank", rel: "noopener noreferrer" } as const;

// Sources, checked 23 October 2026.
const SRC = {
    draft: "https://www.texmin.gov.in/static/uploads/2026/01/661cbb634cad1baf24069355c6445138.pdf",
    wto: "https://elplaw.in/wp-content/uploads/2026/03/ELP-Trade-Update-New-Marking-Requirements-for-Handlooms-Key-Features-and-Implications-for-Stakeholders.pdf",
    handloomDay: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/aug/doc202686945201.pdf",
    khadiCourt: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1848058",
    khadiAbroad: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1734415",
    khadiNotices: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1807594&reg=48&lang=2",
    vogue: "https://www.vogue.in/content/14-brands-that-prove-handloom-textiles-can-go-beyond-saris-and-kurtis",
    gi: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2021/nov/doc2021112441.pdf",
    green: "https://www.ftc.gov/news-events/topics/truth-advertising/green-guides",
    textileRules: "https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts",
};

const TOC = [
    { id: "different", label: "What makes handloom different" },
    { id: "why-us-brands", label: "Why US brands are looking" },
    { id: "sustainable", label: "Is it sustainable?" },
    { id: "sourcing", label: "What to check when sourcing" },
    { id: "krazy-kreators", label: "Handloom into a collection" },
    { id: "faqs", label: "FAQs" },
    { id: "closing", label: "What we'd do" },
];

// Infographic 1. Every figure is cited in the body.
const STATS = [
    { big: "3.52M", label: "handloom weavers and allied workers, over 72% of them women", src: "Handloom Census 2019-20" },
    { big: "2.82M", label: "handlooms counted across India, nine in ten of them rural", src: "Handloom Census 2019-20" },
    { big: "29,402", label: "Handloom Mark registrations issued by 30 June 2026", src: "Ministry of Textiles, Aug 2026" },
    { big: "₹1,331 cr", label: "handloom exports in 2025-26, with the US among the leading buyers", src: "Ministry of Textiles, Aug 2026" },
];

// Infographic 2. Handloom vs power loom.
const COMPARE = [
    { row: "What drives the loom", hand: "The weaver's hands and feet", power: "An electric motor" },
    { row: "Texture", hand: "Small shifts in density, the odd slub", power: "Even, unless set up to imitate hand weaving" },
    { row: "Two lots of the same cloth", hand: "Differ slightly in shade and handle", power: "Close to identical" },
    { row: "Speed", hand: "Slow. Suits capsules and limited runs", power: "Fast. Suits repeat basics" },
    { row: "Proof it is hand-woven", hand: "Handloom Mark label with a unique number", power: "None. It cannot carry the Mark" },
    { row: "Where it earns its place", hand: "Hero pieces, resort shirting, capsules", power: "Core basics that need a perfect repeat" },
];

// Infographic 3. Six handloom traditions and where they fit in a US line.
const WEAVES = [
    { name: "Khadi", swatch: "#D8C7A6", what: "Cotton spun by hand and woven by hand", use: "Casual shirts, relaxed dresses", note: "“Khadi” is a KVIC trademark" },
    { name: "Ikat", swatch: "#3E4A6B", what: "Yarn tie-dyed before weaving, so the edges blur", use: "Jackets, statement shirts", note: "Pochampally ikat is GI-registered" },
    { name: "Chanderi", swatch: "#E8D9B0", what: "Sheer silk-cotton from Madhya Pradesh", use: "Occasion wear, overlays", note: "GI-registered" },
    { name: "Jamdani", swatch: "#EDE6DA", what: "Motifs inserted into the weave by hand, one at a time", use: "Premium detailing, yokes", note: "The slowest on this list" },
    { name: "Handloom cotton", swatch: "#C9B48F", what: "Plain, striped or checked everyday cloth", use: "Resort sets, shirting", note: "Shade shifts between lots" },
    { name: "Banarasi", swatch: "#7A2E2E", what: "Brocade woven with metallic zari in Varanasi", use: "Luxury and occasion pieces", note: "Ask whether zari is real or imitation metal" },
];

// Infographic 4. The proof stack, from "is it hand-woven" to "will it survive a wash".
const PROOF = [
    { name: "Handloom Mark", proves: "The cloth was woven on a handloom", ask: ["The label and its unique number,", "plus the supplier's registration"] },
    { name: "India Handloom Brand", proves: "Quality, natural fibre, dyes, social compliance", ask: ["Registration for that", "product category"] },
    { name: "GI registration", proves: "A named weave comes from its home region", ask: ["Registered-user status, e.g. for", "Chanderi or Pochampally ikat"] },
    { name: "Fibre certificate", proves: "Organic or recycled fibre, through processing", ask: ["GOTS or similar, plus a transaction", "certificate for your lot"] },
    { name: "Lab tests", proves: "Your actual fabric behaves", ask: ["Shrinkage, colourfastness and", "GSM tested on the sample lot"] },
];

// Infographic 5. Handloom to finished collection.
const JOURNEY = [
    { step: "Design collaboration", note: "Mood boards, tech packs" },
    { step: "Sourcing + sampling", note: "Handloom checked, sampled, washed" },
    { step: "Bulk production", note: "One fabric lot, in-line checks" },
    { step: "QC + dispatch", note: "Final inspection, packed for the US" },
];

const FAQS = [
    {
        q: "Why are US fashion brands sourcing textiles from India?",
        a: "For cloth they cannot get elsewhere. India still has about 3.5 million handloom weavers and allied workers alongside a large mill sector, so a brand can buy hand-woven ikat, Chanderi or khadi and mill-made basics from the same country. The US was among India's leading handloom export markets in 2025-26.",
    },
    {
        q: "Are Indian handloom textiles sustainable?",
        a: "Some are, and none is automatically. The weaving runs on human power and in short runs, which helps. But the yarn is usually mill-spun, the dyes may be synthetic, and the dye house matters as much as the loom. Under the FTC Green Guides, claim only what you can document: the fibre certificate, the dye process, where the cloth was made.",
    },
    {
        q: "What Indian fabrics are popular for sustainable fashion?",
        a: "Khadi (hand-spun, hand-woven cotton), handloom cotton, ikat, Chanderi, Jamdani and Banarasi brocade are the best known. For a sustainability claim, the fibre and dye matter more than the weave: organic cotton with a GOTS certificate and natural or low-impact dyes give you something to prove.",
    },
    {
        q: "Can Indian handloom fabrics be used for modern Western clothing?",
        a: "Yes. Handloom cotton makes a strong resort shirt, ikat works as a camp-collar shirt or light jacket, and Chanderi suits occasion tops and overlays. Plan for slight variation between fabric lots and test a washed sample before you approve production.",
    },
    {
        q: "How can US brands verify sustainable textile suppliers in India?",
        a: "Ask for the Handloom Mark label number and the supplier's registration to prove the cloth is hand-woven, India Handloom Brand registration for quality and dye standards, GI registered-user status for named weaves, a fibre certificate such as GOTS with a transaction certificate for your lot, and lab results for shrinkage and colourfastness.",
    },
    {
        q: "How does textile sourcing affect the sustainability of a collection?",
        a: "Most of a garment's footprint is set before it is sewn: the fibre, how the yarn was spun, how the cloth was dyed and finished, and how much of it ends up unsold. Choosing a certified fibre, a responsible dye house and a run size close to real demand does more than any label on the finished piece.",
    },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function IndianHandloomClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("different");
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

            <Navbar invertTabs={!scrolled} />

            {/* Hero banner */}
            <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden">
                <Image
                    src={HERO_IMAGE}
                    alt="Three wooden handlooms in a sunlit Indian village weaving room, each with a half-woven length of indigo, rust and ecru striped cotton, bobbins of yarn on a bench beside them: where Indian handloom textiles for US fashion brands are made. No people, no logos."
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 pt-36 pb-16 sm:pb-20">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                                Production &amp; Sourcing
                            </span>
                            <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-200 font-medium tracking-wide">October 23, 2026</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg mb-6 tracking-tight">
                            Indian Handloom &amp; Sustainable Textiles: Why They Are Trending Among US Fashion Brands
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-200 font-medium drop-shadow-md leading-relaxed border-l-4 border-[#CBB49A] pl-5 mb-8">
                            India is turning &ldquo;handloom&rdquo; into a word you need a numbered government label to use. For a US brand buying hand-woven cloth, the claim gets easier to prove and harder to fake.
                        </p>
                        <button
                            onClick={() => setContactOpen(true)}
                            className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors inline-flex items-center gap-2"
                        >
                            Plan a handloom collection
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · October 23, 2026 · Figures last checked 23 October 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• India&rsquo;s draft rules make a numbered <strong>Handloom Mark label</strong> compulsory on anything sold as handloom, exports included.</li>
                            <li>• That label proves the cloth was <strong>hand-woven</strong>. It says nothing about the fibre or the dye.</li>
                            <li>• Use handloom for <strong>capsules and hero pieces</strong>, buy each style in one lot, and claim only what you can document.</li>
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

                                <button
                                    onClick={() => setContactOpen(true)}
                                    className="mt-8 w-full text-left p-4 rounded-xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors"
                                >
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Sourcing handloom?</p>
                                    <p className="text-sm font-semibold leading-snug">Tell us the fabric. We&rsquo;ll tell you what proof it needs. <ArrowRight className="inline w-3.5 h-3.5" /></p>
                                </button>

                                <div className="mt-10">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-4">You might also like</p>
                                    <div className="space-y-4">
                                        <Link href="/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sustainability</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Organic cotton, GOTS and recycled polyester</p>
                                        </Link>
                                        <Link href="/blogs/eu-green-claims-directive-2026-fashion-brands" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Compliance</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What the EU now wants you to prove</p>
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
                            <p className="text-lg lg:text-xl text-[#2D2A2E] leading-snug mb-5 font-medium">
                                Two shirts hang on the same rail, both tagged &ldquo;handloom cotton.&rdquo; One was woven on a wooden frame loom, the weaver throwing the shuttle and working the pedals by hand. The other came off a power loom set up to fake the slubs. Most shoppers can&rsquo;t tell them apart, and until now very little stopped the second being sold as the first.
                            </p>

                            <p className="mb-5 text-base lg:text-lg leading-snug">
                                India is changing that. In January the Ministry of Textiles published draft Handloom Mark Standards (Labelling and Display) Regulations. Under them, anything sold, displayed or advertised as &ldquo;handloom&rdquo; must carry a numbered Handloom Mark label, export goods included, and selling it without one counts as misleading (<a href={SRC.draft} {...EXT} className={LINK}>Ministry of Textiles draft</a>). India told the WTO in March that it planned to bring the rules into force on 1 October 2026 (<a href={SRC.wto} {...EXT} className={LINK}>ELP summary of the WTO notice</a>). When we checked on 23 October, the final version had not yet appeared in India&rsquo;s official gazette. US brands buying hand-woven cloth should plan for it anyway.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                At <Link href="/end-to-end-services/raw-materials" className={LINK}>Krazy Kreators</Link> we source hand-woven Indian fabric for US labels and turn it into finished collections. Below is what we tell founders before they order the first metre.
                            </p>

                            {/* Infographic 1 — stat strip */}
                            <figure className="not-prose my-8 rounded-2xl bg-[#2D2A2E] p-5 sm:p-7">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-5">India&rsquo;s handloom sector, in four numbers</p>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                    {STATS.map((s) => (
                                        <div key={s.big} className="border-t-2 border-[#CBB49A] pt-3">
                                            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.big}</p>
                                            <p className="mt-1 text-sm text-gray-300 leading-snug">{s.label}</p>
                                            <p className="mt-2 text-[11px] text-gray-500">{s.src}</p>
                                        </div>
                                    ))}
                                </div>
                                <figcaption className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-400 leading-snug">
                                    Krazy Kreators · Indian handloom textiles by the numbers · sources linked in the text · checked 23 October 2026
                                </figcaption>
                            </figure>

                            {/* H2 1 */}
                            <section id="different" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What Makes Indian Handloom Textiles Different?
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The draft rules define handloom cloth plainly. It is woven on a pit loom, a frame loom or something like them, where the weaver works the loom by hand and controls the whole process. No motor drives the shuttle, and that is where the look comes from. Each row of weft is beaten in by hand, a little harder on some rows than others, so the cloth carries small shifts in density and the odd thick slub.
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 my-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Close-up of the selvedge of freshly hand-woven ecru cotton on the cloth beam of a wooden handloom, showing the slubs and uneven beat that set Indian handloom fabric apart from power-loom cloth. No people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    India still weaves this way at scale. The last handloom census counted 35.22 lakh, about 3.5 million, weavers and allied workers, more than 72% of them women, working 28.2 lakh looms, almost all of them in villages (<a href={SRC.handloomDay} {...EXT} className={LINK}>Ministry of Textiles via PIB</a>).
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Khadi is a trademark as well as a fabric</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Khadi is cotton spun by hand as well as woven by hand. The word is also a registered trademark of the Khadi and Village Industries Commission (KVIC), and the Delhi High Court ruled it a well-known mark in July 2022 (<a href={SRC.khadiCourt} {...EXT} className={LINK}>PIB</a>). KVIC had sent 2,172 notices over unauthorised use by January 2022 (<a href={SRC.khadiNotices} {...EXT} className={LINK}>PIB</a>), and it has filed to register the mark abroad, the US included (<a href={SRC.khadiAbroad} {...EXT} className={LINK}>PIB</a>). Check with your supplier before &ldquo;khadi&rdquo; goes on a hangtag.
                                </p>

                                {/* Infographic 2 — handloom vs power loom */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="bg-[#2D2A2E] px-5 py-4">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A]">Handloom vs power loom</p>
                                        <p className="text-sm text-gray-300">What changes for a US collection</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm min-w-[560px]">
                                            <thead>
                                                <tr className="bg-[#F8F7F4] text-left">
                                                    <th className="px-4 py-3 font-semibold text-[#666666] w-[30%]"></th>
                                                    <th className="px-4 py-3 font-bold text-[#2D2A2E]">Handloom</th>
                                                    <th className="px-4 py-3 font-bold text-[#2D2A2E]">Power loom</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {COMPARE.map((c, i) => (
                                                    <tr key={c.row} className={i % 2 ? "bg-[#F8F7F4]/60" : "bg-white"}>
                                                        <td className="px-4 py-3 font-semibold text-[#2D2A2E] align-top">{c.row}</td>
                                                        <td className="px-4 py-3 text-[#2D2A2E] align-top border-l-4 border-[#CBB49A]">{c.hand}</td>
                                                        <td className="px-4 py-3 text-[#666666] align-top">{c.power}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <figcaption className="px-5 py-3 text-xs text-[#999999] bg-white border-t border-gray-100">Krazy Kreators · Indian handloom fabric compared with power-loom cloth</figcaption>
                                </figure>
                            </section>

                            {/* H2 2 */}
                            <section id="why-us-brands" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why US Fashion Brands Are Exploring Indian Textiles
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Handloom gives a small brand something hard to get anywhere else: cloth a competitor can&rsquo;t reorder from the same catalogue. Indian labels have spent years cutting it into shirts, jackets and dresses rather than saris and kurtas (<a href={SRC.vogue} {...EXT} className={LINK}>Vogue India</a>), so a US designer no longer has to imagine what it looks like in a modern silhouette.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    American buyers are already there. India exported about &#8377;1,331 crore, roughly $150 million, of handloom products in 2025-26, and named the United States among its leading markets alongside the UAE, France, the UK and Spain (<a href={SRC.handloomDay} {...EXT} className={LINK}>Ministry of Textiles via PIB</a>).
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 my-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="An oversized short-sleeve resort shirt in ecru handloom cotton with fine indigo pinstripes, hanging on a wooden hanger against a lime-plastered wall in dappled palm shade: Indian handloom fabric cut for modern US resort wear. No people, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                {/* Infographic 3 — weaves */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Six Indian handloom traditions, cut for a US line</p>
                                    <p className="text-sm text-[#666666] mb-5">What each one is, where it fits, and the thing to ask first</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {WEAVES.map((w) => (
                                            <div key={w.name} className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                                                <div className="h-3" style={{ background: `repeating-linear-gradient(90deg, ${w.swatch} 0 6px, #ffffff33 6px 7px)` }} />
                                                <div className="p-4">
                                                    <p className="font-bold text-[#2D2A2E]">{w.name}</p>
                                                    <p className="mt-1 text-sm text-[#4A484A] leading-snug">{w.what}</p>
                                                    <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-[#8C7355]">Use it for</p>
                                                    <p className="text-sm text-[#2D2A2E] leading-snug">{w.use}</p>
                                                    <p className="mt-3 text-xs text-[#666666] italic leading-snug">{w.note}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-4 text-xs text-[#999999]">Krazy Kreators · GI = Geographical Indication, India&rsquo;s legal protection for a product tied to a place (<a href={SRC.gi} {...EXT} className="underline">PIB</a>)</figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The point is to adapt the cloth, not export the costume: a traditional weave as an oversized shirt, handloom cotton as a resort set, ikat on a streetwear jacket, a handwoven panel on a minimal dress.
                                </p>
                            </section>

                            {/* H2 3 */}
                            <section id="sustainable" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How Indian Handloom Supports Sustainable Fashion, and Where It Doesn&rsquo;t
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The case for it is real. The loom runs on human power. Hand weaving works in short runs, so you can order closer to what you will actually sell. And it keeps paid, skilled work in villages that have few other options.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    But the loom is one step of many. Unless the cloth is khadi, the yarn usually comes from a mill. The dye may be synthetic, and what matters most is how the dye house treats its water. Hand-woven doesn&rsquo;t mean organic, and it doesn&rsquo;t mean low-impact.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The Handloom Mark proves who wove the cloth. It says nothing about the dye.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The FTC&rsquo;s Green Guides warn US marketers off broad claims like &ldquo;eco-friendly&rdquo; that they can&rsquo;t back up (<a href={SRC.green} {...EXT} className={LINK}>FTC</a>), so say what you can prove: &ldquo;hand-woven in Telangana,&rdquo; &ldquo;GOTS-certified organic cotton.&rdquo; India&rsquo;s separate India Handloom Brand label goes further than the Handloom Mark. It covers natural fibre, fast colours, skin-friendly dyes and social compliance, and had 2,305 registrations by June 2026 (<a href={SRC.handloomDay} {...EXT} className={LINK}>PIB</a>). Our <Link href="/blogs/sustainable-clothing-manufacturing-eco-conscious-fashion-brand" className={LINK}>sustainable manufacturing guide</Link> covers the rest of the evidence.
                                </p>
                            </section>

                            {/* Mid-article lead CTA */}
                            <div className="not-prose my-10 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#2D2A2E] to-[#3d3940] text-white shadow-xl relative overflow-hidden">
                                <svg aria-hidden className="absolute right-0 top-0 h-full w-40 opacity-20" viewBox="0 0 40 100" preserveAspectRatio="none">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <line key={i} x1={i * 3.5 + 2} y1="0" x2={i * 3.5 + 2} y2="100" stroke="#CBB49A" strokeWidth="0.6" />
                                    ))}
                                </svg>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Have a handloom fabric in mind?</p>
                                <h4 className="text-2xl font-extrabold mb-2 text-white">Send us the name or a photo.</h4>
                                <p className="text-gray-300 leading-snug mb-5 max-w-xl">We&rsquo;ll tell you what proof it should come with, how it is likely to behave in a US wash test, and which piece in your line it suits.</p>
                                <button
                                    onClick={() => setContactOpen(true)}
                                    className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors inline-flex items-center gap-2"
                                >
                                    Ask about a fabric
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* H2 4 */}
                            <section id="sourcing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What US Fashion Brands Should Consider When Sourcing Indian Textiles
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Each proof answers a different question, so ask for the ones your claims rely on before you approve a sample.
                                </p>

                                {/* Infographic 4 — proof stack */}
                                <figure className="not-prose my-6 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 900 400" role="img" aria-label="The handloom proof stack, five layers. Handloom Mark: proves the cloth was woven on a handloom; ask for the label with its unique number and the supplier's registration. India Handloom Brand: proves quality, natural fibre, dyes and social compliance; ask for registration for that product category. GI registration: proves a named weave comes from its home region; ask for registered-user status. Fibre certificate: proves organic or recycled fibre through processing; ask for GOTS or similar plus a transaction certificate for your lot. Lab tests: prove your actual fabric behaves; ask for shrinkage, colourfastness and GSM on the sample lot." className="w-full h-auto min-w-[680px]">
                                        <text x="0" y="22" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">The handloom proof stack</text>
                                        <text x="0" y="44" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">From &quot;is it hand-woven?&quot; to &quot;will it survive a wash?&quot; · each layer proves something the one above can&apos;t</text>
                                        {PROOF.map((p, i) => {
                                            const y = 66 + i * 64;
                                            const inset = i * 18;
                                            const dark = i === 0;
                                            return (
                                                <g key={p.name}>
                                                    <rect x={inset} y={y} width={900 - inset * 2} height="54" rx="8" fill={dark ? "#2D2A2E" : "#FFFFFF"} stroke="#CBB49A" strokeWidth="1.5" />
                                                    <text x={inset + 18} y={y + 23} fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="700" fill={dark ? "#CBB49A" : "#8C7355"}>{`0${i + 1}`}</text>
                                                    <text x={inset + 44} y={y + 23} fontFamily="Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill={dark ? "#FFFFFF" : "#2D2A2E"}>{p.name}</text>
                                                    <text x={inset + 44} y={y + 42} fontFamily="Helvetica, Arial, sans-serif" fontSize="11.5" fill={dark ? "#E5E0D8" : "#4A484A"}>{`Proves: ${p.proves}`}</text>
                                                    <text x="530" y={y + 20} fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fontWeight="700" fill={dark ? "#CBB49A" : "#8C7355"}>ASK FOR</text>
                                                    {p.ask.map((line, k) => (
                                                        <text key={line} x="530" y={y + 34 + k * 13} fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill={dark ? "#E5E0D8" : "#4A484A"}>{line}</text>
                                                    ))}
                                                </g>
                                            );
                                        })}
                                    </svg>
                                    <figcaption className="mt-2 text-xs text-[#999999]">Krazy Kreators · how to verify Indian handloom and sustainable textile suppliers</figcaption>
                                </figure>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Plan for the cloth to vary</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Handloom has limits a US production plan has to allow for. It is slower than power-loom cloth, and two lots of the same fabric rarely match exactly. Buy all the fabric for a style in one lot, check its weight against your spec (our <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className={LINK}>GSM guide</Link> explains how), and wash-test a sample before you approve it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    If a style needs the same shade across thousands of units for three seasons, handloom is the wrong cloth for it. Keep it for the capsule, and write the variation into the product copy so customers expect it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Nothing changes on the US side. Every garment still needs its fibre content and country of origin on the label (<a href={SRC.textileRules} {...EXT} className={LINK}>FTC Textile Rules</a>).
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="krazy-kreators" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How Krazy Kreators Helps Fashion Brands Turn Textile Ideas Into Collections
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    We start with <Link href="/design-services" className={LINK}>design</Link>: your mood board and a <Link href="/blogs/what-is-a-tech-pack" className={LINK}>tech pack</Link> that names the cloth. Then we <Link href="/end-to-end-services/raw-materials" className={LINK}>source the handloom</Link>, collect the proof that backs your claims, and sample until the drape and the wash are right. <Link href="/manufacturing-services" className={LINK}>Bulk production</Link> runs from one fabric lot with checks on the line, followed by a final inspection, packing and dispatch to the US.
                                </p>

                                {/* Infographic 5 — journey */}
                                <figure className="not-prose my-6 rounded-2xl bg-[#2D2A2E] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 900 190" role="img" aria-label="From handloom to finished collection with Krazy Kreators, in four stages: design collaboration (mood boards, tech packs), sourcing and sampling (handloom checked, sampled, washed), bulk production (one fabric lot, in-line checks), QC and dispatch (final inspection, packed for the US)." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="22" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#FFFFFF">From handloom to finished collection</text>
                                        <text x="0" y="44" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#B0AAA2">One team, four stages, India to your US door</text>
                                        {JOURNEY.map((j, i) => {
                                            const x = i * 225;
                                            return (
                                                <g key={j.step}>
                                                    <rect x={x} y="72" width="205" height="92" rx="12" fill={i === 1 ? "#CBB49A" : "#3d3940"} stroke="#CBB49A" strokeWidth="1.5" />
                                                    <text x={x + 18} y="100" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fontWeight="700" fill={i === 1 ? "#2D2A2E" : "#CBB49A"}>{`0${i + 1}`}</text>
                                                    <text x={x + 18} y="125" fontFamily="Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill={i === 1 ? "#2D2A2E" : "#FFFFFF"}>{j.step}</text>
                                                    <text x={x + 18} y="147" fontFamily="Helvetica, Arial, sans-serif" fontSize="11.5" fill={i === 1 ? "#2D2A2E" : "#B0AAA2"}>{j.note}</text>
                                                    {i < JOURNEY.length - 1 && <path d={`M${x + 207} 118 L${x + 222} 118`} stroke="#CBB49A" strokeWidth="2" markerEnd="url(#hlArrow)" />}
                                                </g>
                                            );
                                        })}
                                        <defs>
                                            <marker id="hlArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                                <path d="M0 0 L10 5 L0 10 Z" fill="#CBB49A" />
                                            </marker>
                                        </defs>
                                    </svg>
                                    <figcaption className="mt-2 text-xs text-gray-400">Krazy Kreators · design, sourcing, production and dispatch under one roof</figcaption>
                                </figure>

                                {/* Inline lead CTA */}
                                <div className="not-prose mt-7 rounded-2xl border border-[#CBB49A]/50 bg-[#F8F7F4] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Planning a handloom capsule?</p>
                                        <p className="text-[#2D2A2E] leading-snug">
                                            Looking to create a fashion collection with Indian textiles? Tell us the pieces and the quantities you have in mind, and we&rsquo;ll plan the route from design and sourcing to sampling and production.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setContactOpen(true)}
                                        className="shrink-0 px-6 py-3 bg-[#2D2A2E] text-white font-semibold rounded-full hover:bg-[#1f1d20] transition-colors inline-flex items-center justify-center gap-2"
                                    >
                                        Start your project
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs About Indian Handloom &amp; Sustainable Textiles
                                </h2>
                                <div className="space-y-7">
                                    {FAQS.map((f) => (
                                        <div key={f.q}>
                                            <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">{f.q}</h3>
                                            <p className="text-base lg:text-lg leading-snug text-[#4A484A]">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Closing */}
                            <section id="closing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What We&rsquo;d Do in Your Shoes
                                </h2>

                                <div className="not-prose rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="An empty wooden handloom at dusk in an Indian village weaving room, a half-woven length of indigo and white handloom cotton on it and the shuttle resting on the cloth, lit by a single warm lamp. No people, no logos."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 60rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Start with one hero piece in a hand-woven cloth, and ask for its Handloom Mark number before the sample. Sell the variation as the point of the piece. Which piece in your line would you weave by hand first?
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
                                <Link href="/blogs/sustainable-clothing-manufacturing-eco-conscious-fashion-brand" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Sustainable Clothing Manufacturing: How to Build an Eco-Conscious Fashion Brand</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The rest of the evidence chain: what has to be provable at the factory before a green claim goes on the tag.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the guide <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Start your project</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Talk to a Krazy Kreators production lead about Indian handloom</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Send a sketch, a mood board or a style that sold. We&rsquo;ll come back with the hand-woven fabrics that suit it, the proof each one carries, and a dated plan from sampling to delivery.</p>
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
                                            href: "/blogs/sourcing-clothing-manufacturing-from-india-2026",
                                            title: "Beyond China: Why More Fashion Brands Are Sourcing From India in 2026",
                                            dek: "The duty, lead-time and country comparison behind the fabric decision.",
                                            read: "11 min read",
                                        },
                                        {
                                            href: "/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester",
                                            title: "Sustainability Simplified: Organic Cotton, GOTS, and Recycled Polyester",
                                            dek: "What layer four of the proof stack actually certifies, fibre by fibre.",
                                            read: "8 min read",
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
                        Sourcing Indian handloom? Talk to us <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
