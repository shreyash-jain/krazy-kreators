"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle, X, Download, Check, Plus } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";
import { FAQS } from "./faqs";

const BLOG_ID = "indian-textile-art-us-fashion-brands";

const HERO_IMAGE = "/blog/indian-textile-art-us-fashion-brands-hero.jpg";
const SECTION1_IMAGE = "/blog/indian-textile-art-us-fashion-brands-section1.jpg";
const MACRO_IMAGE = "/blog/indian-textile-art-us-fashion-brands-macro.jpg";
const GARMENT_IMAGE = "/blog/indian-textile-art-us-fashion-brands-garment.jpg";
const CLOSING_IMAGE = "/blog/indian-textile-art-us-fashion-brands-closing.jpg";

const LINK = "underline text-[#CBB49A] hover:text-[#b7a078]";
const EXT = { target: "_blank", rel: "noopener noreferrer" } as const;

const TOC = [
    { id: "why-attention", label: "Why it's getting attention" },
    { id: "six-crafts", label: "Six crafts to explore" },
    { id: "what-to-create", label: "What you can create" },
    { id: "craft-to-collection", label: "Craft to collection" },
    { id: "manufacturing", label: "Why Indian manufacturing" },
    { id: "sustainable", label: "Craft and sustainability" },
    { id: "sourcing", label: "Sourcing successfully" },
    { id: "storytelling", label: "Storytelling" },
    { id: "new-opportunities", label: "New pairings" },
    { id: "krazy-kreators", label: "How we can help" },
    { id: "faqs", label: "FAQs" },
    { id: "conclusion", label: "Conclusion" },
];

// Infographic 1. Every region and technique here matches the H3 text below; GI names are as
// they appear in the IP India register linked in the body.
const CRAFTS = [
    { n: "01", name: "Hand block printing", region: "Bagru & Sanganer, Rajasthan", gi: "Bagru Hand Block Print · Sanganeri Hand Block Printing", how: "Carved wooden blocks, one per colour, stamped by hand", best: "Dresses, shirts, scarves, resortwear", watch: "Screen prints sold as block prints", swatch: "#9C4A2F" },
    { n: "02", name: "Ikat", region: "Pochampally, Telangana", gi: "Pochampalli Ikat", how: "Yarn tied and dyed before weaving, so edges blur", best: "Camp shirts, overshirts, light jackets", watch: "A new design means a new warp", swatch: "#2F3E63" },
    { n: "03", name: "Kalamkari", region: "Srikalahasti & Machilipatnam, Andhra Pradesh", gi: "Srikalahasthi Kalamkari · Machilipatnam Kalamkari", how: "Drawn with a bamboo pen or block printed, filled with natural dyes", best: "Statement panels, printed dresses", watch: "Sacred motifs need the artisans' guidance", swatch: "#7A5A2E" },
    { n: "04", name: "Ajrakh", region: "Kutch, Gujarat", gi: "Kutch Ajrakh", how: "Resist printing, then rounds of indigo and madder dyeing and washing", best: "Scarves, shirts, lined jackets", watch: "The process takes weeks", swatch: "#1F2E4D" },
    { n: "05", name: "Chikankari", region: "Lucknow, Uttar Pradesh", gi: "Lucknow Chikan Craft", how: "White-thread hand embroidery on fine cotton", best: "Occasionwear, premium shirting", watch: "Heavy work is slow and costly to make", swatch: "#E9E3D6" },
    { n: "06", name: "Kantha", region: "West Bengal", gi: "Nakshi Kantha", how: "Layers of cloth held with rows of running stitch", best: "Chore jackets, bags, overshirts", watch: "Layers can shrink unevenly", swatch: "#B5603A" },
];

// Infographic 2. The brief's product-opportunity table.
const PRODUCTS = [
    ["Dresses", "Block prints, Kalamkari, embroidery"],
    ["Shirts", "Ikat, hand block printing"],
    ["Jackets", "Kantha, handwoven textiles"],
    ["Scarves", "Block printing, Ajrakh"],
    ["Bags", "Kantha, handwoven fabrics"],
    ["Resortwear", "Lightweight printed textiles"],
    ["Home-fashion collections", "Handcrafted Indian fabrics"],
];

// Infographic 3. Craft to collection, seven steps.
const STEPS = [
    { step: "Select the craft", note: "Pick for the customer" },
    { step: "Define the customer", note: "Who wears it, where" },
    { step: "Set the palette", note: "Colour modernizes" },
    { step: "Adapt the pattern", note: "Scale + silhouette" },
    { step: "Prototype", note: "Strike-offs, samples" },
    { step: "Test the fabric", note: "Wash, rub, shrink" },
    { step: "Produce", note: "Small batch, then scale" },
];

// Infographic 4. Sourcing checklist, mirrors the four H3s in the sourcing section.
const CHECKS = [
    { head: "Define your product requirements", items: ["Fabric type", "Quantity", "GSM / weight", "Colours", "Print or embroidery", "Target price"] },
    { head: "Request samples", items: ["Fabric quality", "Colour consistency", "Shrinkage after washing", "Durability and rub test"] },
    { head: "Discuss customization", items: ["Custom prints", "Custom colours", "Private-label manufacturing", "Packaging and labelling"] },
    { head: "Verify production & quality", items: ["Manufacturing capacity", "Quality-control process", "Lead times", "Export experience", "Documents and compliance"] },
];

// Infographic 5. Heritage + modern design pairings.
const PAIRINGS = [
    { craft: "Indian block prints", modern: "minimalist US silhouettes", swatch: "#9C4A2F" },
    { craft: "Ikat", modern: "contemporary streetwear", swatch: "#2F3E63" },
    { craft: "Kalamkari", modern: "resort collections", swatch: "#7A5A2E" },
    { craft: "Kantha", modern: "modern outerwear", swatch: "#B5603A" },
    { craft: "Chikankari", modern: "premium occasionwear", swatch: "#5B5249" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function IndianTextileArtClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("why-attention");
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
        showToast("Test sheet on the way to your inbox.", "success");
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

            {/* Hero banner: the headline is typeset into the image itself */}
            <section className="bg-[#1B1819] pt-20 sm:pt-24">
                <div className="relative w-full max-w-[1822px] mx-auto aspect-[1822/1024]">
                    <Image
                        src={HERO_IMAGE}
                        alt="Banner: Indian Textile Art Meets Modern Fashion, what US brands can create with Indian craftsmanship. Six lengths of Indian handmade fabric hang from an oak rail in a studio: a rust block print, an indigo ikat, an indigo-and-red Ajrakh, an earthy Kalamkari, a white Chikankari muslin and a patchwork Kantha."
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="h-1.5 flex">
                    {CRAFTS.map((c) => (
                        <div key={c.n} className="flex-1" style={{ backgroundColor: c.swatch }} />
                    ))}
                </div>
            </section>

            {/* Article header */}
            <section className="bg-[#F8F7F4] border-b border-gray-200">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 py-10 sm:py-14 text-center flex flex-col items-center">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Production &amp; Sourcing
                        </span>
                        <span className="text-sm text-[#666666] font-medium tracking-wide">6 min read</span>
                        <span className="text-sm text-[#B0AAA2]">•</span>
                        <span className="text-sm text-[#666666] font-medium tracking-wide">October 13, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2D2A2E] leading-tight max-w-5xl mb-5 tracking-tight">
                        Indian Textile Art Meets Modern Fashion:<br />
                        What US Brands Can Create With Indian Craftsmanship
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-[#4A484A] font-medium max-w-3xl leading-relaxed">
                        Six hand techniques, what each one suits in a modern collection, and where each one gets difficult.
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="pt-10 sm:pt-12 pb-16 sm:pb-20 lg:pb-24 bg-white">
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
                            <p className="text-sm text-[#666666]">October 13, 2026 · Manufacturing · 6 min read · Sources checked 3 October 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Six Indian crafts translate well into modern clothing, and each one has a <strong>limit</strong> worth knowing before you design around it.</li>
                            <li>• Modernize through colour, scale and cut. Keep the technique as it is.</li>
                            <li>• Wash-test every sample, and only claim &ldquo;handmade&rdquo; or &ldquo;sustainable&rdquo; when you hold the <strong>proof</strong>.</li>
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
                                        <Link href="/blogs/indian-textiles-for-us-fashion-brands" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Why US brands are choosing Indian textiles</p>
                                        </Link>
                                        <Link href="/blogs/what-2026-met-gala-taught-us-fashion-founders-craft" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Culture &amp; Brand</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What the 2026 Met Gala taught founders about craft</p>
                                        </Link>
                                        <Link href="/blogs/made-in-india-american-luxury-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Culture &amp; Brand</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The &lsquo;Made in India&rsquo; trend in American luxury</p>
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
                                A length of Ajrakh leaves Kutch after weeks of printing, dyeing and washing. Cut into a boxy shirt and hung on a rail in Brooklyn, it looks like nothing else there. That is the appeal of Indian textile art for a US label.
                            </p>
                            <p className="mb-5 text-base lg:text-lg leading-snug">
                                India is the world&rsquo;s sixth-largest exporter of textiles and apparel (<a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234442" {...EXT} className={LINK}>PIB, March 2026</a>), and it still has 35.22 lakh, about 3.5 million, handloom weavers and allied workers (<a href="https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/aug/doc202686945201.pdf" {...EXT} className={LINK}>Ministry of Textiles via PIB</a>). Most of what it ships is mill-made. This piece is about the hand-made part.
                            </p>
                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                If you are still deciding whether to source from India at all, start with <Link href="/blogs/indian-textiles-for-us-fashion-brands" className={LINK}>our companion piece on Indian textiles</Link>.
                            </p>

                            {/* H2 — why */}
                            <section id="why-attention" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why Indian Textile Art Is Gaining Attention in Global Fashion
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Carved teak printing blocks wet with rust-red dye resting on a padded table beside a half-printed length of off-white cotton in a hand block-printing workshop near Jaipur, one of the traditional Indian textiles crafts open to US brands. No people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Each region has its own technique, and many are legally tied to their place. Lucknow Chikan, Pochampally Ikat, Kutch Ajrakh, Bagru hand block print, both Srikalahasti and Machilipatnam Kalamkari, and West Bengal&rsquo;s Nakshi Kantha are all registered Geographical Indications, India&rsquo;s protection for goods that come from a specific region (<a href="https://ipindia.gov.in/storage/uploads/docs-operator/aa9ef4c8-ae0e-4717-9181-52b6a9479b82.pdf" {...EXT} className={LINK}>IP India GI register</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    For a brand selling limited runs, hand-made cloth is hard for a competitor to copy, and it gives the product page something true to say, as long as the claim is accurate.
                                </p>
                            </section>

                            {/* H2 — six crafts */}
                            <section id="six-crafts" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    6 Indian Textile Crafts US Fashion Brands Can Explore
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-2">
                                    The chart covers all six; the notes under it add what a chart can&rsquo;t.
                                </p>

                                {/* Infographic 1 — six crafts at a glance */}
                                <figure className="not-prose my-8 rounded-2xl bg-[#2D2A2E] p-5 sm:p-7">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Six Indian crafts at a glance</p>
                                    <p className="text-sm text-gray-400 mb-6">Where each comes from, how it&rsquo;s made, what it suits, and the one thing to watch</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {CRAFTS.map((c) => (
                                            <div key={c.n} className="rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden">
                                                <div className="h-2" style={{ backgroundColor: c.swatch }} />
                                                <div className="p-4">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xs font-bold text-[#CBB49A]">{c.n}</span>
                                                        <p className="font-bold text-white text-lg leading-tight">{c.name}</p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-400">{c.region}</p>
                                                    <p className="mt-3 text-sm text-gray-200 leading-snug">{c.how}</p>
                                                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#CBB49A]">Best for</p>
                                                    <p className="text-sm text-white leading-snug">{c.best}</p>
                                                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#E39A7B]">Watch for</p>
                                                    <p className="text-sm text-gray-200 leading-snug">{c.watch}</p>
                                                    <p className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gray-500 leading-snug">GI: {c.gi}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-400 leading-snug">
                                        Krazy Kreators · Indian crafts for fashion brands · GI names as listed in the IP India register
                                    </figcaption>
                                </figure>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">1. Hand Block Printing</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Printers carve the pattern into wooden blocks, one per colour, and stamp it along the cloth by hand. Blocks can be cut from your own artwork, so the print is yours. Ask to see them, because plenty of &ldquo;block print&rdquo; cloth is screen printed to look the part. See our <Link href="/prints" className={LINK}>print options</Link>.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">2. Ikat</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    The yarn is tied and dyed before weaving, so the pattern is woven in and its edges blur. A bold ikat suits a camp-collar shirt or an unstructured jacket. Because the design lives in the yarn, changing it means a new warp, so settle colourways early.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">3. Kalamkari</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    The name means &ldquo;pen work&rdquo;. In Srikalahasti the outlines are drawn freehand with a bamboo pen; in Machilipatnam they are block printed. Much of the imagery comes from temple stories, so ask the artisans which motifs suit a commercial garment.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">4. Ajrakh</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Ajrakh is resist printed, then dyed and washed repeatedly until the dense geometry and deep indigo and red build up. It belongs in a premium or slow-fashion line, not on a tight delivery date.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">5. Chikankari</h3>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme close-up of white-on-white Chikankari hand embroidery on sheer cotton mulmul, a trellis of shadow-work vines and leaves with tiny raised knots, lit from the side: Indian craftsmanship suited to premium occasionwear. No people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    White-thread embroidery from Lucknow, traditionally on fine cotton. It reads as quiet luxury on a shirt yoke or an occasionwear panel. Every stitch is by hand, so heavy work is slow. More on <Link href="/hand-embroidery" className={LINK}>hand embroidery</Link>.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">6. Kantha</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Kantha began as a way to layer old saris into a quilt with running stitch. The rippled surface suits jackets, bags and overshirts. Wash a sample before you grade the pattern, because layered cloth can shrink unevenly.
                                </p>
                            </section>

                            {/* H2 — what to create */}
                            <section id="what-to-create" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What Can US Fashion Brands Create With Indian Craftsmanship?
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-2">
                                    Start from the product you already sell and find the craft that fits it.
                                </p>

                                {/* Infographic 2 — product opportunity table */}
                                <figure className="not-prose my-6 rounded-2xl border border-gray-200 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-[#2D2A2E]">
                                            <tr>
                                                <th className="px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#CBB49A]">Product category</th>
                                                <th className="px-4 sm:px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#CBB49A]">Indian craftsmanship opportunity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {PRODUCTS.map(([cat, craft], i) => (
                                                <tr key={cat} className={i % 2 ? "bg-[#F8F7F4]" : "bg-white"}>
                                                    <td className="px-4 sm:px-6 py-3 font-semibold text-[#2D2A2E] text-sm sm:text-base">{cat}</td>
                                                    <td className="px-4 sm:px-6 py-3 text-[#4A484A] text-sm sm:text-base">{craft}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <figcaption className="px-4 sm:px-6 py-3 text-xs text-[#999999] bg-white border-t border-gray-100">Krazy Kreators · product opportunities for Indian handmade fabrics</figcaption>
                                </figure>
                            </section>

                            {/* H2 — craft to collection */}
                            <section id="craft-to-collection" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    From Traditional Craft to Modern Fashion Collection
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Colour does most of the modernizing. Ajrakh in its usual indigo and red reads as heritage. Run the same block in one dark colour on undyed cotton and it reads as a contemporary print. Keep the motif and its structure, and change the palette, the scale and the cut.
                                </p>

                                {/* Infographic 3 — seven steps */}
                                <figure className="not-prose my-6 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 980 220" role="img" aria-label="From traditional craft to modern collection in seven steps: select the craft, define the US customer, set a contemporary palette, adapt the pattern to modern silhouettes, prototype and sample, test fabric quality and durability, then move into small-batch or larger production. Testing is the gate before production." className="w-full h-auto min-w-[720px]">
                                        <text x="0" y="22" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">From traditional craft to modern collection</text>
                                        <text x="0" y="44" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Seven steps · fabric testing is the gate before you pay for production</text>
                                        {STEPS.map((p, i) => {
                                            const x = i * 140;
                                            const gate = i === 5;
                                            return (
                                                <g key={p.step}>
                                                    <path
                                                        d={`M${x} 72 L${x + 122} 72 L${x + 136} 112 L${x + 122} 152 L${x} 152 L${x + 14} 112 Z`}
                                                        fill={gate ? "#2D2A2E" : "#FFFFFF"}
                                                        stroke={gate ? "#2D2A2E" : "#CBB49A"}
                                                        strokeWidth="1.5"
                                                    />
                                                    <text x={x + 24} y="98" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="700" fill={gate ? "#CBB49A" : "#8C7355"}>{`0${i + 1}`}</text>
                                                    <text x={x + 24} y="118" fontFamily="Helvetica, Arial, sans-serif" fontSize={p.step.length > 14 ? 11.5 : 13} fontWeight="700" fill={gate ? "#FFFFFF" : "#2D2A2E"}>{p.step}</text>
                                                    <text x={x + 24} y="136" fontFamily="Helvetica, Arial, sans-serif" fontSize="10.5" fill={gate ? "#E5E0D8" : "#666666"}>{p.note}</text>
                                                </g>
                                            );
                                        })}
                                        <line x1="0" y1="182" x2="976" y2="182" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="204" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#4A484A">Steps 4 to 6 often loop. Natural dyes and hand stitching behave differently from mill cloth, so expect more than one sample round.</text>
                                    </svg>
                                    <figcaption className="mt-2 text-xs text-[#999999]">Krazy Kreators · custom textile manufacturing in India, craft to collection</figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Most first attempts go wrong at step 2: brands start from a craft they love, then look for someone to sell it to.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Keep the technique as it is. Change the colour, the scale and the cut.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 — manufacturing */}
                            <section id="manufacturing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why US Fashion Brands Are Exploring Indian Textile Manufacturing
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    One country can supply mill cotton for basics, craft cloth for hero pieces, and the units to cut and sew both. Hand workshops make short lengths, which suits a capsule. Since 24 July 2026, Indian apparel pays the normal US duty plus a 10% Section 301 duty, the lower of the two new tiers (<a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-takes-action-forced-labor-section-301-investigations" {...EXT} className={LINK}>USTR</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    For duty, lead times and how India compares with Vietnam and Bangladesh, see <Link href="/blogs/sourcing-clothing-manufacturing-from-india-2026" className={LINK}>our India sourcing guide</Link>.
                                </p>
                            </section>

                            {/* H2 — sustainability */}
                            <section id="sustainable" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Indian Craftsmanship and Sustainable Fashion
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Part of the case is real. A handloom runs without power, and a well-made piece gets kept. But handmade is not automatically sustainable. Natural dyeing uses a lot of water and mordants <em>(metal salts that fix dye)</em>, a hand print can sit on conventional cotton, and conditions vary between workshops.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The FTC&rsquo;s Green Guides warn US sellers off broad claims like &ldquo;eco-friendly&rdquo; (<a href="https://www.ftc.gov/news-events/topics/truth-advertising/green-guides" {...EXT} className={LINK}>FTC</a>). Claim only what you can document. Our <Link href="/sustainability" className={LINK}>sustainability page</Link> sets out what we check.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Craft Sample Test Sheet</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page sheet for your first craft sample: the wash, rub and shrinkage checks for each of the six techniques, with space to note what passed.</p>
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
                                            Send me the sheet
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Sheet on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 — sourcing */}
                            <section id="sourcing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How US Brands Can Source Indian Textiles Successfully
                                </h2>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Define Your Product Requirements</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Fabric, quantity, weight in GSM <em>(grams per square metre)</em>, colours, decoration and target cost, written down before you contact anyone. A <Link href="/blogs/what-is-a-tech-pack" className={LINK}>tech pack</Link> holds it in one file.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Request Samples</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Wash it the way your customer will, then check colour and shrinkage. Natural dyes can bleed in the first wash; better to learn that now than from a return.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Discuss Customization</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-6">
                                    Prints, colours, private label, packaging and labelling can all be yours. Ask which parts the craft fixes and which it leaves open.
                                </p>

                                <h3 className="text-2xl font-bold text-[#2D2A2E] mb-3">Verify Production &amp; Quality Standards</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Check capacity, quality control, lead times and export experience. Every garment sold in the US needs a label giving its fibre content and country of origin (<a href="https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts" {...EXT} className={LINK}>FTC</a>). If you want to say &ldquo;handloom&rdquo;, ask whether the cloth carries India&rsquo;s <a href="https://nhdc.org.in/en/Indian-Handloom-Brand" {...EXT} className={LINK}>India Handloom Brand</a> label or the Handloom Mark.
                                </p>

                                {/* Infographic 4 — sourcing checklist */}
                                <figure className="not-prose my-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">The Indian textile sourcing checklist</p>
                                    <p className="text-sm text-[#666666] mb-5">Four stages, in order, before you approve production</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {CHECKS.map((c, i) => (
                                            <div key={c.head} className="rounded-xl bg-[#F8F7F4] p-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="w-7 h-7 rounded-full bg-[#2D2A2E] text-[#CBB49A] text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                                    <p className="font-bold text-[#2D2A2E] text-base">{c.head}</p>
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
                                    <figcaption className="mt-4 text-xs text-[#999999]">Krazy Kreators · working with Indian textile suppliers and manufacturers</figcaption>
                                </figure>
                            </section>

                            {/* H2 — storytelling */}
                            <section id="storytelling" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why Storytelling Matters When Using Indian Textile Art
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="A relaxed, boxy jacket in faded indigo and rust Kantha-quilted cotton patchwork, rows of running stitch rippling its surface, hanging on a wooden hanger against a limewashed wall in hard side light: Indian textile art cut as modern outerwear. No people, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Name the technique, the place and what was done by hand. &ldquo;Kantha-quilted in West Bengal, every stitch by hand&rdquo; is specific and checkable. Use the same wording on the product page, hangtag, social posts and stockist pitch.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Credit the craft rather than passing the pattern off as your own idea, and don&rsquo;t use a protected name like &ldquo;Lucknow Chikan&rdquo; unless the work really comes from there.
                                </p>
                            </section>

                            {/* H2 — new opportunities */}
                            <section id="new-opportunities" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Indian Textile Art + Modern Design = New Opportunities for US Brands
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-2">
                                    These pairings are a starting point. Not every one will suit your customer, so sample one before you build a capsule around it.
                                </p>

                                {/* Infographic 5 — pairings */}
                                <figure className="not-prose my-6 rounded-2xl bg-[#2D2A2E] p-5 sm:p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-5">Indian heritage + contemporary design</p>
                                    <div className="space-y-3">
                                        {PAIRINGS.map(({ craft, modern, swatch }) => (
                                            <div key={craft} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                                <div className="rounded-lg px-4 py-3 text-right font-semibold text-white" style={{ backgroundColor: swatch }}>{craft}</div>
                                                <Plus className="w-5 h-5 text-[#CBB49A]" />
                                                <div className="rounded-lg px-4 py-3 bg-white/[0.06] border border-white/10 text-gray-200">{modern}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-5 pt-4 border-t border-white/10 text-xs text-gray-400">Krazy Kreators · heritage, contemporary design, customization and responsible sourcing</figcaption>
                                </figure>
                            </section>

                            {/* H2 — Krazy Kreators */}
                            <section id="krazy-kreators" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How Krazy Kreators Can Help US Fashion Brands
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A small US boutique at dusk, a pale oak rail of minimalist clothing that includes a black-and-white ikat camp shirt and an indigo block-printed midi dress under warm pendant lights: Indian craftsmanship on a modern American rail. No people, no logos."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Krazy Kreators works with US clothing founders from first sketch to delivered carton, manufacturing in India. We handle <Link href="/end-to-end-services/raw-materials" className={LINK}>textile sourcing</Link> and custom development, sampling, <Link href="/manufacturing-services" className={LINK}>garment manufacturing</Link> and bulk production, and we fit the craft to your <Link href="/design-services" className={LINK}>design</Link> rather than the other way round.
                                </p>

                                {/* Lead-gen CTA */}
                                <div className="not-prose mt-7 rounded-2xl border border-[#CBB49A]/50 bg-[#F8F7F4] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Planning your next collection?</p>
                                        <p className="text-[#2D2A2E] leading-snug">
                                            Looking to bring Indian craftsmanship into your next fashion collection? Explore custom textile and manufacturing possibilities with Krazy Kreators.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setContactOpen(true)}
                                        className="shrink-0 px-6 py-3 bg-[#2D2A2E] text-white font-semibold rounded-full hover:bg-[#1f1d20] transition-colors inline-flex items-center justify-center gap-2"
                                    >
                                        Talk to us
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs About Indian Textile Art and Fashion
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
                                    Indian textile art gives a US label something its competitors can&rsquo;t reorder, and a true story to tell about it. Getting there takes a clear spec, patient sampling and claims you can back up. If you could put one of these six crafts into your next drop, which would it be?
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    When you&rsquo;re ready, <Link href="/contact" className={LINK}>start your project</Link> with Krazy Kreators.
                                </p>
                            </section>

                            {/* About Krazy Kreators */}
                            <div className="not-prose mt-12 mb-4 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">About Krazy Kreators</p>
                                <p className="text-[#4A484A] leading-snug">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className={LINK}>design</Link>, sampling, <Link href="/manufacturing-services" className={LINK}>fabric sourcing, and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className={LINK}>under one roof</Link>, from first sketch to shelf. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/indian-textiles-for-us-fashion-brands" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Why US Fashion Brands Are Choosing Indian Textiles for Their Next Collection</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The companion piece: the business case for Indian fabric and how to choose a manufacturer.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the companion piece <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Start your project</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Talk to a Krazy Kreators production lead about Indian craft</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Send a sketch or a style that sold. We&rsquo;ll suggest the craft that suits it and a dated plan from sample to delivery.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start your project <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/what-2026-met-gala-taught-us-fashion-founders-craft",
                                            title: "What the 2026 Met Gala Taught US Fashion Founders About Craft",
                                            dek: "Why hand work is reading as value again on the US rail.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/made-in-india-american-luxury-2026",
                                            title: "The 'Made in India' Trend Reshaping American Luxury in 2026",
                                            dek: "How Indian craft moved from the souvenir shelf to the luxury rail.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/eu-green-claims-directive-2026-fashion-brands",
                                            title: "EU Green Claims Directive 2026: What Fashion Brands Must Prove",
                                            dek: "What a sustainability claim needs on file before it goes on a hangtag.",
                                            read: "5 min read",
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
                        Bringing Indian craft into a collection? Talk to us <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
