"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle, X, Download, Check } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = "indian-textiles-for-us-fashion-brands";

const HERO_IMAGE = "/blog/indian-textiles-for-us-fashion-brands-hero.jpg";
const SECTION1_IMAGE = "/blog/indian-textiles-for-us-fashion-brands-section1.jpg";
const MACRO_IMAGE = "/blog/indian-textiles-for-us-fashion-brands-macro.jpg";
const GARMENT_IMAGE = "/blog/indian-textiles-for-us-fashion-brands-garment.jpg";

const LINK = "underline text-[#CBB49A] hover:text-[#b7a078]";

const TOC = [
    { id: "why-india", label: "Why brands look at India" },
    { id: "fabric-variety", label: "1. The fabric range" },
    { id: "craftsmanship", label: "2. Craft, modern cut" },
    { id: "customization", label: "3. Customization" },
    { id: "small-batch", label: "4. Small-batch production" },
    { id: "sustainability", label: "5. Sustainability" },
    { id: "end-to-end", label: "6. End-to-end manufacturing" },
    { id: "brand-story", label: "7. Brand story" },
    { id: "checklist", label: "8. Choosing a manufacturer" },
    { id: "krazy-kreators", label: "9. Working with us" },
    { id: "faqs", label: "FAQs" },
    { id: "conclusion", label: "Conclusion" },
];

// Infographic 1. Every figure here is cited in the opening section of the body.
const STATS = [
    { big: "6th", label: "largest exporter of textiles and apparel in the world", src: "PIB, Mar 2026" },
    { big: "~4%", label: "share of world textile and apparel exports", src: "PIB, Mar 2026" },
    { big: "3.52M", label: "handloom weavers and allied workers (35.22 lakh)", src: "Handloom Census 2019-20" },
    { big: "27.8%", label: "of the world's GOTS-certified facilities, more than any other country", src: "GOTS, 2025" },
];

// Infographic 2. Fabric guide. The four handloom fabrics get a close-up photo beside the description.
const CLOSEUPS = [
    {
        name: "Khadi",
        img: "/blog/indian-textiles-for-us-fashion-brands-khadi.jpg",
        alt: "Draped undyed khadi cotton in window light, its soft, slightly uneven hand-spun texture setting it apart from mill cotton. No text.",
        what: "Cotton spun and woven by hand. The threads vary in thickness, so the cloth feels dry and slightly uneven, and it breathes.",
        use: "Summer shirts, relaxed trousers",
    },
    {
        name: "Chanderi",
        img: "/blog/indian-textiles-for-us-fashion-brands-chanderi.jpg",
        alt: "Sheer ivory Chanderi silk-cotton hanging against window light, small gold zari motifs woven into it. No text.",
        what: "Sheer silk-cotton from Madhya Pradesh, light enough to see through, often with small gold zari motifs woven in.",
        use: "Evening tops, overlays, resortwear",
    },
    {
        name: "Ikat",
        img: "/blog/indian-textiles-for-us-fashion-brands-ikat.jpg",
        alt: "Macro of indigo, rust and cream ikat cotton showing the feathered edges where resist-dyed threads meet. No text.",
        what: "The yarn is tie-dyed before it goes on the loom, so the pattern edges come out feathered rather than crisp.",
        use: "Statement shirts, light jackets",
    },
    {
        name: "Block print",
        img: "/blog/indian-textiles-for-us-fashion-brands-blockprint.jpg",
        alt: "Hand block-printed cotton in indigo and madder red with faint overlaps where each wooden block was set down. No text.",
        what: "Pattern stamped by hand with carved wooden blocks. Look closely and you can see where each block was set down.",
        use: "Dresses, loungewear, scarves",
    },
];

const OTHER_FABRICS = [
    { name: "Cotton", swatch: "#E9E1D3", what: "Mill-woven poplin, voile and twill, plus knit jersey.", use: "Tees, shirting, dresses" },
    { name: "Silk", swatch: "#B88A4A", what: "Smooth mulberry silk or textured, slubby tussar.", use: "Slip dresses, luxury tops" },
    { name: "Linen blends", swatch: "#CFC6B4", what: "Linen with cotton for less crease and a softer hand.", use: "Resort sets, overshirts" },
    { name: "Handloom", swatch: "#A2543A", what: "Any cloth woven on a hand-operated loom, usually in short runs.", use: "Limited capsules, hero pieces" },
];

// Infographic 3. Prototype to production.
const PROCESS = [
    { step: "Design", note: "Sketch + tech pack" },
    { step: "Fabric selection", note: "Swatches, lab dips" },
    { step: "Sampling", note: "First physical piece" },
    { step: "Approval", note: "Fit, colour, wash test" },
    { step: "Production", note: "The approved run" },
    { step: "Quality control", note: "In-line + final checks" },
    { step: "Shipping", note: "Packed, dispatched to US" },
];

// Infographic 4. The manufacturer checklist.
const CHECKS = [
    { head: "Fabric quality", items: ["Fibre composition, in writing", "GSM (fabric weight, grams per square metre)", "Durability after washing", "Colourfastness (how well dye resists fading and bleeding)"] },
    { head: "Sampling & prototyping", items: ["Who develops the sample", "How many revision rounds", "A written approval step before production"] },
    { head: "MOQ & capacity", items: ["Minimum order quantity per style and colour", "Whether they run small batches", "Room to scale a style that sells"] },
    { head: "Quality control", items: ["Inspection during production", "Final checks before packing"] },
    { head: "Communication", items: ["One named contact", "Regular updates without chasing", "Dates held, or flagged early"] },
    { head: "International shipping", items: ["Packaging spec", "Dispatch and paperwork", "Realistic delivery timelines"] },
];

const FAQS = [
    {
        q: "Why are US fashion brands sourcing textiles from India?",
        a: "For range and craft more than price. India is the sixth-largest textile and apparel exporter in the world and still has a large handloom sector, so one country can supply mill-made cotton, hand-woven silk, ikat and block prints. Since 24 July 2026 Indian goods pay the normal US duty plus a 10% Section 301 duty, the lower of the two new tiers.",
    },
    {
        q: "What types of Indian textiles can US fashion brands source?",
        a: "Cotton in woven and knit forms, khadi, Chanderi, ikat, mulberry and tussar silk, linen blends, handloom fabrics and hand block-printed cloth, along with embroidery such as zardozi and aari work. Most of these can be cut into contemporary silhouettes rather than traditional dress.",
    },
    {
        q: "Can Indian manufacturers produce custom clothing for US brands?",
        a: "Yes. Fabric, colour, print, embroidery, construction and finishing can all be specified in a tech pack and sampled before production. The tighter your tech pack, the fewer sample rounds you need.",
    },
    {
        q: "Can US startups order small quantities from Indian manufacturers?",
        a: "Many Indian manufacturers run small batches, though minimums vary by fabric and technique. Hand-woven and hand-printed cloth is often made in short runs anyway. Ask each manufacturer for the minimum per style and per colour before you commit.",
    },
    {
        q: "How do I choose an Indian clothing manufacturer?",
        a: "Check fabric quality (composition, GSM, durability, colourfastness), how sampling and approval work, minimum order quantity and capacity, quality control during and after production, how they communicate, and how they pack and ship to the US. Ask for it in writing before the first sample.",
    },
    {
        q: "How does textile sourcing from India work?",
        a: "It follows the seven steps in section 4. The bigger choice is whether you buy fabric only and arrange the sewing and shipping yourself, or use one partner for the whole chain.",
    },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function IndianTextilesClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
    const [magnetName, setMagnetName] = useState("");
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
        if (!magnetName.trim() || !magnetEmail.trim()) return;
        setMagnetSubmitted(true);
        showToast("Sourcing brief on the way to your inbox.", "success");
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
                    alt="Hand-dyed yarn hanks in saffron, madder red, indigo and turmeric yellow drying on bamboo poles in an Indian weaving village courtyard at golden hour, the raw material behind the Indian textiles US fashion brands are sourcing. No people, no logos."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/55 to-black/70" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Production &amp; Sourcing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">October 3, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        What Indian Textiles Offer US Fashion Brands
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        US imports from India fell this year. What India offers a design-led label, in fabric, craft and room to customise, did not.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · October 3, 2026 · Figures last checked 3 October 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• India&rsquo;s draw for a US label is <strong>range</strong>: mill cotton and hand-woven ikat, Chanderi and block prints from one country, cut into modern clothes.</li>
                            <li>• Since 24 July 2026 Indian goods pay a <strong>10% Section 301 duty</strong> on top of the normal rate, the lower of the two new tiers.</li>
                            <li>• Before you call any of it sustainable, get the <strong>certificate</strong> for that fabric on file.</li>
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
                                        <Link href="/blogs/sourcing-clothing-manufacturing-from-india-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Beyond China: sourcing from India in 2026</p>
                                        </Link>
                                        <Link href="/blogs/made-in-india-american-luxury-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Culture &amp; Brand</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The &lsquo;Made in India&rsquo; trend in American luxury</p>
                                        </Link>
                                        <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Fabric</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Understanding fabric GSM</p>
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
                                Hold a length of Chanderi up to a window and you can see your hand through it. A hand block-printed cotton shows the faint overlaps where the printer lifted the wooden block and set it down again. You can&rsquo;t get either from a rotary print line, which is why designers who want a collection that looks like nobody else&rsquo;s keep asking Indian mills for swatches.
                            </p>

                            <p className="mb-5 text-base lg:text-lg leading-snug">
                                This is not a story about more brands buying from India. US clothing imports from India fell 25.8% to $2.45 billion in the first seven months of 2026, after a year of tariff swings (<a href="https://www.thedailystar.net/business/news/bangladesh-overtakes-china-again-apparel-exports-us-4265426" target="_blank" rel="noopener noreferrer" className={LINK}>OTEXA data via The Daily Star</a>). Most of that drop is big retailers buying basics by the container. What India offers a smaller label choosing its next fabric is a separate question, and it is the one this piece answers.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                India is the world&rsquo;s sixth-largest exporter of textiles and apparel, with about 4% of world exports (<a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234442" target="_blank" rel="noopener noreferrer" className={LINK}>PIB, March 2026</a>). It also still weaves by hand. The last national census counted 35.22 lakh, roughly 3.5 million, handloom weavers and allied workers (<a href="https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/aug/doc202686945201.pdf" target="_blank" rel="noopener noreferrer" className={LINK}>Ministry of Textiles via PIB</a>). Modern mills and a living craft sector in the same supply base is the real reason to look.
                            </p>

                            {/* Infographic 1 — stat strip */}
                            <figure className="not-prose my-8 rounded-2xl bg-[#2D2A2E] p-5 sm:p-7">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-5">India&rsquo;s textile base, in four numbers</p>
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
                                    Krazy Kreators · sources linked in the text · checked 3 October 2026
                                </figcaption>
                            </figure>

                            {/* H2 — why */}
                            <section id="why-india" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why Are US Fashion Brands Looking at India for Textile Sourcing?
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Textile sourcing in India appeals for practical reasons. The fabric range runs from mill-made jersey to hand-woven silk, sometimes within one state, and most mills and garment units will change a colour, a print or a weave for you.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Duty is also less of an obstacle than it was in 2025. Since 24 July 2026, Indian goods pay the normal US rate plus a 10% Section 301 duty, the lower of the two new tiers (<a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-takes-action-forced-labor-section-301-investigations" target="_blank" rel="noopener noreferrer" className={LINK}>USTR</a>). Our <Link href="/blogs/us-apparel-import-tariffs-2026" className={LINK}>tariff tracker</Link> has the full rates by country.
                                </p>
                            </section>

                            {/* H2 1 */}
                            <section id="fabric-variety" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    1. Access to a Wide Variety of Indian Textiles
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A wooden handloom in a whitewashed Indian weaving shed in morning light, an ikat warp stretched tight with its blurred pattern already dyed into the threads, one of the Indian handloom fabrics US brands can source. No people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Popular Indian Textiles for Modern Fashion</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Most founders know Indian cotton. Fewer have worked with the hand-woven cloth, and that is where a collection starts to look different. Chanderi from Madhya Pradesh and Pochampally ikat from Telangana are both protected Geographical Indications, India&rsquo;s legal mark for products tied to a place (<a href="https://static.pib.gov.in/WriteReadData/specificdocs/documents/2021/nov/doc2021112441.pdf" target="_blank" rel="noopener noreferrer" className={LINK}>PIB</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The four handloom fabrics below are easiest to tell apart up close.
                                </p>

                                {/* Infographic 2 — fabric guide with close-ups */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Indian textiles, up close</p>
                                    <p className="text-sm text-[#666666] mb-5">Four handloom fabrics, what each one is, and where it earns a place on a US line sheet</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {CLOSEUPS.map((f) => (
                                            <div key={f.name} className="flex gap-4 rounded-xl bg-white border border-gray-200 p-3">
                                                <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 rounded-lg overflow-hidden">
                                                    <Image src={f.img} alt={f.alt} fill sizes="144px" className="object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-[#2D2A2E]">{f.name}</p>
                                                    <p className="mt-1 text-sm text-[#4A484A] leading-snug">{f.what}</p>
                                                    <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[#8C7355]">Use it for</p>
                                                    <p className="text-sm text-[#2D2A2E] leading-snug">{f.use}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-6 mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C7355]">Also in the range</p>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        {OTHER_FABRICS.map((f) => (
                                            <div key={f.name} className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                                                <div className="h-2" style={{ backgroundColor: f.swatch }} />
                                                <div className="p-3">
                                                    <p className="font-bold text-sm text-[#2D2A2E]">{f.name}</p>
                                                    <p className="mt-1 text-xs text-[#4A484A] leading-snug">{f.what}</p>
                                                    <p className="mt-2 text-xs text-[#2D2A2E]"><span className="font-semibold text-[#8C7355]">For:</span> {f.use}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-4 text-xs text-[#999999]">Krazy Kreators · Indian handloom fabrics and mill textiles for US fashion brands</figcaption>
                                </figure>
                            </section>

                            {/* H2 2 */}
                            <section id="craftsmanship" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    2. Traditional Indian Craftsmanship Meets Modern Fashion
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme close-up of hand embroidery on ivory silk: gold zardozi coils, seed beads and indigo chain stitch, the kind of Indian artisan craftsmanship a US designer can place on a single panel of a modern garment. No hands, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Indian weaving, embroidery and printing are still done for paying customers every week. Embroiderers work zardozi <em>(raised metallic-thread embroidery)</em> and aari <em>(fine chain stitch made with a hooked needle)</em>. Printers carve their own blocks. The trick is to use the technique on a new shape: a block print scaled up and run in one colour, or a single hand-embroidered panel on an otherwise plain jacket.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">How US Designers Can Use Indian Craftsmanship</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Heritage doesn&rsquo;t have to mean traditional clothing. Ikat and block prints suit resortwear and loungewear. Chanderi or cotton voile with an embroidered yoke makes a dress that sells on detail. Streetwear can carry a kantha-quilted <em>(running-stitch quilting from Bengal)</em> overshirt, and luxury lines can put zardozi on a silk shirt or a cropped jacket.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Hand work does bring variation. Two block-printed dresses from the same order won&rsquo;t match exactly. If a style needs a perfect repeat across a large run, print it by machine and keep the hand work for a smaller capsule.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;What a US designer takes from Indian craft is the technique, not the costume.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3 */}
                            <section id="customization" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    3. Customization for US Fashion Brands
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The fabric weight and weave can change. So can the dye shade, matched to your colour reference, and the print, redrawn at your scale. Embroidery placement, seam construction and the final wash or finish are all yours to specify. All of it goes into a <Link href="/blogs/what-is-a-tech-pack" className={LINK}>tech pack</Link> <em>(the specification file the factory builds from)</em>.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Why Custom Manufacturing Matters for Fashion Startups</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    A young brand&rsquo;s pitch to a buyer is that its product isn&rsquo;t already on the next rail. Custom clothing manufacturing in India lets you own a print or a fabric a competitor can&rsquo;t order from the same catalogue.
                                </p>
                            </section>

                            {/* H2 4 */}
                            <section id="small-batch" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    4. Flexible Manufacturing and Small-Batch Production
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Emerging brands rarely know which style will sell. Ordering deep on one design is how a first collection ends up on the sale rail. What you want from Indian clothing manufacturers is the willingness to run small and then scale the styles that work.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">From Prototype to Production</h3>

                                {/* Infographic 3 — process */}
                                <figure className="not-prose my-6 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 980 220" role="img" aria-label="From prototype to production in seven steps: design (sketch and tech pack), fabric selection (swatches and lab dips), sampling (first physical piece), approval (fit, colour and wash test), production (the approved run), quality control (in-line and final checks), shipping (packed and dispatched to the US). The approval step is the gate before money is committed to production." className="w-full h-auto min-w-[720px]">
                                        <text x="0" y="22" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">From prototype to production</text>
                                        <text x="0" y="44" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Seven steps with a clothing manufacturer for US brands · approval is the gate before you pay for a run</text>
                                        {PROCESS.map((p, i) => {
                                            const x = i * 140;
                                            const gate = p.step === "Approval";
                                            return (
                                                <g key={p.step}>
                                                    <path
                                                        d={`M${x} 72 L${x + 122} 72 L${x + 136} 112 L${x + 122} 152 L${x} 152 L${x + 14} 112 Z`}
                                                        fill={gate ? "#2D2A2E" : "#FFFFFF"}
                                                        stroke={gate ? "#2D2A2E" : "#CBB49A"}
                                                        strokeWidth="1.5"
                                                    />
                                                    <text x={x + 24} y="98" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="700" fill={gate ? "#CBB49A" : "#8C7355"}>{`0${i + 1}`}</text>
                                                    <text x={x + 24} y="118" fontFamily="Helvetica, Arial, sans-serif" fontSize={p.step.length > 12 ? 12 : 14} fontWeight="700" fill={gate ? "#FFFFFF" : "#2D2A2E"}>{p.step}</text>
                                                    <text x={x + 24} y="136" fontFamily="Helvetica, Arial, sans-serif" fontSize="10.5" fill={gate ? "#E5E0D8" : "#666666"}>{p.note}</text>
                                                </g>
                                            );
                                        })}
                                        <line x1="0" y1="182" x2="976" y2="182" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="204" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#4A484A">Steps 1 to 4 can repeat. A second or third sample round costs far less than a production run you can&apos;t sell.</text>
                                    </svg>
                                    <figcaption className="mt-2 text-xs text-[#999999]">Krazy Kreators · the sampling-first path for Indian clothing manufacturers</figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    A sample shows you how a hand-woven fabric really drapes, whether a print holds its colour through a wash, and whether the fit works, all before you&rsquo;ve paid for production. Our <Link href="/blogs/clothing-production-timeline" className={LINK}>production timeline</Link> lays out the full calendar.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Indian Textile Sourcing Brief</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page sheet to send with your first fabric request: the eight fabrics above with their usual widths and handle, the questions to ask about each, and a blank column for swatch notes.</p>
                                    </div>
                                </div>
                                {!magnetSubmitted ? (
                                    <form onSubmit={handleMagnetSubmit} className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            required
                                            value={magnetName}
                                            onChange={(e) => setMagnetName(e.target.value)}
                                            placeholder="Your name"
                                            className="flex-1 px-4 py-3 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#CBB49A] outline-none text-[#2D2A2E]"
                                        />
                                        <input
                                            type="email"
                                            required
                                            value={magnetEmail}
                                            onChange={(e) => setMagnetEmail(e.target.value)}
                                            placeholder="Your work email"
                                            className="flex-1 px-4 py-3 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#CBB49A] outline-none text-[#2D2A2E]"
                                        />
                                        <button type="submit" className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors flex items-center justify-center gap-2">
                                            Send me the brief
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Brief on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 5 */}
                            <section id="sustainability" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    5. Sustainability and Responsible Textile Sourcing
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Sustainable Indian textiles are a real story, and an easy one to overstate. India has more GOTS-certified facilities than any other country, 27.8% of the 17,800 worldwide in 2025 (<a href="https://global-standard.org/images/260522_RZ_GOTS_Annual_Report_2025_Screen.pdf" target="_blank" rel="noopener noreferrer" className={LINK}>GOTS Annual Report 2025</a>). GOTS, the Global Organic Textile Standard, certifies organic fibre through spinning, dyeing and sewing. A handloom also runs without power.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of that makes a given fabric sustainable. Hand-woven doesn&rsquo;t mean organic, natural fibre doesn&rsquo;t mean low-impact, and the dye house can matter as much as the loom.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">What Brands Should Verify Before Making Sustainability Claims</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The FTC&rsquo;s Green Guides tell US marketers not to make broad, unqualified claims like &ldquo;eco-friendly&rdquo; (<a href="https://www.ftc.gov/news-events/topics/truth-advertising/green-guides" target="_blank" rel="noopener noreferrer" className={LINK}>FTC</a>), and the EU&rsquo;s rules are now stricter (<Link href="/blogs/eu-green-claims-directive-2026-fashion-brands" className={LINK}>our explainer</Link>). Before a word goes on a hangtag, have these on file:
                                </p>
                                <ul className="not-prose space-y-2 mb-2">
                                    {[
                                        "The fabric certificate, and a transaction certificate for your batch",
                                        "Where the fibre and the cloth came from",
                                        "How it was dyed and finished, and in what conditions",
                                        "How the unit handles waste and wastewater",
                                        "Supplier documents you hold yourself, not just a promise on an invoice",
                                    ].map((item) => (
                                        <li key={item} className="flex gap-3 items-start text-base lg:text-lg text-[#2D2A2E] leading-snug">
                                            <Check className="w-5 h-5 text-[#CBB49A] flex-shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* H2 6 */}
                            <section id="end-to-end" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    6. India Offers End-to-End Fashion Manufacturing
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    You can buy fabric in India and sew somewhere else. Then you&rsquo;re the one shipping rolls between countries and chasing a shade match between two companies, and when the shirts shrink, nobody agrees whose fault it was. Fashion manufacturing in India with an end-to-end partner puts the whole chain with one team, so one team answers for the result.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">What Can an End-to-End Manufacturer Handle?</h3>
                                <div className="not-prose flex flex-wrap gap-2 mb-5">
                                    {["Design", "Fabric sourcing", "Sampling", "Prototyping", "Manufacturing", "Quality control", "Packaging", "Dispatch"].map((s) => (
                                        <span key={s} className="px-4 py-2 rounded-full bg-[#F8F7F4] border border-[#CBB49A]/50 text-sm font-medium text-[#2D2A2E]">{s}</span>
                                    ))}
                                </div>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The trade-off is choice. With one partner you work from its mills and units, rather than picking the best supplier for each step yourself.
                                </p>
                            </section>

                            {/* H2 7 */}
                            <section id="brand-story" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    7. Indian Textiles Can Help Build a Stronger Fashion Brand Story
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="A contemporary camp-collar shirt in indigo and rust ikat handloom cotton on a black dress form in a New York loft studio, window light from the left, showing how Indian textiles work in modern US fashion. No people, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A fabric with a place and a process behind it gives you something true to say. &ldquo;Ikat hand-woven in Telangana, the yarn dyed before it reached the loom&rdquo; is a product description people remember, and it holds up if a customer asks.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Why Product Storytelling Matters for US Fashion Brands</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The same facts work on your website, in product descriptions and social posts, in a campaign shoot, and in how you pitch a stockist. Keep them accurate. If the cloth is mill-made with a hand-finished print, say that rather than &ldquo;handmade&rdquo;. People who buy for craft do check.
                                </p>
                            </section>

                            {/* H2 8 */}
                            <section id="checklist" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    8. What Should US Fashion Brands Check Before Choosing an Indian Manufacturer?
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Get answers to these in writing before the first sample. A manufacturer who is slow to answer now will be slow in production too. If GSM is new to you, our <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className={LINK}>GSM guide</Link> covers it.
                                </p>

                                {/* Infographic 4 — checklist */}
                                <figure className="not-prose my-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">The Indian manufacturer checklist</p>
                                    <p className="text-sm text-[#666666] mb-5">Six areas to cover before you approve a first sample</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {CHECKS.map((c, i) => (
                                            <div key={c.head} className="rounded-xl bg-[#F8F7F4] p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="w-7 h-7 rounded-full bg-[#2D2A2E] text-[#CBB49A] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                                    <h3 className="font-bold text-[#2D2A2E] text-base">{c.head}</h3>
                                                </div>
                                                <ul className="space-y-1.5">
                                                    {c.items.map((it) => (
                                                        <li key={it} className="flex gap-2 items-start text-sm text-[#4A484A] leading-snug">
                                                            <Check className="w-4 h-4 text-[#CBB49A] flex-shrink-0 mt-0.5" />
                                                            {it}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-4 text-xs text-[#999999]">Krazy Kreators · how to choose among Indian clothing manufacturers</figcaption>
                                </figure>
                            </section>

                            {/* H2 9 */}
                            <section id="krazy-kreators" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    9. Why US Fashion Brands Can Partner With Krazy Kreators
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Krazy Kreators is that single partner for US clothing founders, with <Link href="/end-to-end-services/raw-materials" className={LINK}>textile sourcing</Link> and <Link href="/manufacturing-services" className={LINK}>manufacturing</Link> in India and delivery to your door. What matters for this topic is that the people who choose your khadi or ikat also sign off the finished piece, so a fabric problem gets caught before it becomes a garment problem. Our <Link href="/case-studies" className={LINK}>case studies</Link> show work for other brands.
                                </p>

                                {/* Lead-gen CTA */}
                                <div className="not-prose mt-7 rounded-2xl border border-[#CBB49A]/50 bg-[#F8F7F4] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Planning your next collection?</p>
                                        <p className="text-[#2D2A2E] leading-snug">
                                            Looking for an Indian textile and clothing manufacturing partner for your US fashion brand? Talk to Krazy Kreators about your next collection.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setContactOpen(true)}
                                        className="shrink-0 px-6 py-3 bg-[#2D2A2E] text-white font-semibold rounded-full hover:bg-[#1f1d20] transition-colors inline-flex items-center justify-center gap-2"
                                    >
                                        Talk to us about your collection
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Frequently Asked Questions
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

                            {/* Conclusion */}
                            <section id="conclusion" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Conclusion
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    India gives a US brand a wide fabric range, craft that still works for a living, room to customise, and factories that can start small and grow with you. None of it replaces checking the fabric and the paperwork yourself. If you were starting your next collection this month, which fabric would you want in your hands first?
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Planning your next fashion collection? <Link href="/contact" className={LINK}>Explore Krazy Kreators</Link> for textile sourcing, product development and clothing manufacturing in India.
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
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Talk to a Krazy Kreators production lead about Indian textiles</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Send a sketch, a mood board or a style that sold, and we&rsquo;ll suggest the Indian fabrics that suit it.</p>
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
                                            href: "/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester",
                                            title: "Sustainability Simplified: Organic Cotton, GOTS, and Recycled Polyester",
                                            dek: "What the certificates in section 5 actually certify, fibre by fibre.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "Where every customisation in this post has to be written down first.",
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
                        Sourcing Indian textiles? Talk to us <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
