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
import { FAQS } from "./faqs";

const BLOG_ID = "source-authentic-indian-textiles-us-clothing-brands";

const HERO_IMAGE = "/blog/source-authentic-indian-textiles-us-clothing-brands-hero.jpg";
const SECTION1_IMAGE = "/blog/source-authentic-indian-textiles-us-clothing-brands-section1.jpg";
const MACRO_IMAGE = "/blog/source-authentic-indian-textiles-us-clothing-brands-macro.jpg";
const GARMENT_IMAGE = "/blog/source-authentic-indian-textiles-us-clothing-brands-garment.jpg";
const CLOSING_IMAGE = "/blog/source-authentic-indian-textiles-us-clothing-brands-closing.jpg";

const LINK = "underline text-[#CBB49A] hover:text-[#b7a078]";

const TOC = [
    { id: "journey", label: "The five stages" },
    { id: "spec", label: "1. Write the fabric spec" },
    { id: "supplier", label: "2. Find and check a supplier" },
    { id: "samples", label: "3. Samples" },
    { id: "testing", label: "4. Test before bulk" },
    { id: "production", label: "5. Production and US entry" },
    { id: "contemporary", label: "Making it feel modern" },
    { id: "krazy-kreators", label: "Working with us" },
    { id: "faqs", label: "FAQs" },
    { id: "conclusion", label: "Conclusion" },
];

// Banner + infographic 1. The five stages and the document you should be holding at the end of each.
const STAGES = [
    { n: "01", stage: "Spec", hold: "A written fabric spec with tolerances" },
    { n: "02", stage: "Supplier", hold: "A shortlist, with proof behind every claim" },
    { n: "03", stage: "Samples", hold: "Approved lab dip, strike-off and garment sample" },
    { n: "04", stage: "Testing", hold: "A lab report and an approved shade band" },
    { n: "05", stage: "Production & entry", hold: "Inspection report, labels, customs paperwork" },
];

// Infographic 2. The fabric spec sheet.
const SPEC = [
    { field: "Fibre content", eg: "100% cotton, handloom", hand: false },
    { field: "Weight (GSM)", eg: "110 GSM, ± agreed range", hand: true },
    { field: "Usable width", eg: "Ask first: handlooms can run narrow", hand: true },
    { field: "Construction", eg: "Plain weave, hand-woven", hand: false },
    { field: "Colour reference", eg: "Physical standard you both hold", hand: false },
    { field: "Print + repeat", eg: "Hand block print, repeat size in cm", hand: true },
    { field: "Finish", eg: "Washed, pre-shrunk", hand: false },
    { field: "End use", eg: "Midi shirt-dress", hand: false },
    { field: "Target price", eg: "Per metre, at your quantity", hand: false },
];

// Infographic 3. Claim on the sales deck vs proof to ask for.
const PROOF = [
    { claim: "“Handloom”", proof: "Handloom Mark registration, or a visit to the looms" },
    { claim: "“Authentic Chanderi / Pochampally ikat”", proof: "Registered authorised user of that Geographical Indication" },
    { claim: "“Organic cotton”", proof: "GOTS scope certificate, plus a transaction certificate for your batch" },
    { claim: "“Indian cotton”", proof: "Yarn and cotton origin records, mill by mill" },
    { claim: "“We export to the US”", proof: "A US buyer reference you can call" },
];

// Infographic 4. Tests before bulk.
const TESTS = [
    { test: "Colourfastness to laundering", method: "AATCC TM61", catches: "Dye that fades or bleeds in the wash" },
    { test: "Shrinkage", method: "AATCC TM135", catches: "Cloth that moves after home washing" },
    { test: "Crocking (rub-off)", method: "AATCC TM8", catches: "Colour that rubs onto skin or a white sofa" },
    { test: "Strength", method: "ASTM D5034", catches: "Loose hand-woven cloth that tears at seams" },
];

// Infographic 5. Duty on two garments. MFN rates from hts.usitc.gov; +10% Section 301 (heading 9903.05.44) for India.
const ENTRY = [
    { item: "Women\u2019s cotton dress", hts: "6204.42.30", mfn: 8.4, value: 25 },
    { item: "Men\u2019s woven cotton shirt", hts: "6205.20.20", mfn: 19.7, value: 15 },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function IndianTextileSourcingClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("journey");
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
        showToast("Spec sheet on the way to your inbox.", "success");
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
            <section className="relative h-[72vh] min-h-[620px] max-h-[820px] flex items-end overflow-hidden">
                <Image
                    src={HERO_IMAGE}
                    alt="Banner: how US clothing brands can source authentic Indian textiles, in five stages from spec to US entry. Long lengths of freshly hand block-printed cotton in indigo, madder red and ochre drying on sandy ground in a Rajasthan village at sunrise. No people, no logos."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a1d]/95 via-[#1c1a1d]/55 to-[#1c1a1d]/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1c1a1d]/70 via-transparent to-transparent" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 pb-10 sm:pb-12 mt-28">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Production &amp; Sourcing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">8 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">October 3, 2026</span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#CBB49A] mb-3">The sourcing journey · swatch to US shelf</p>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.08] max-w-5xl drop-shadow-lg mb-5 tracking-tight">
                        From Indian Art to Global Fashion:<br />
                        <span className="text-[#E9D9C2]">How US Clothing Brands Can Source Authentic Indian Textiles</span>
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-snug mb-8">
                        The swatch is the easy part. This is the work between it and finished pieces clearing US customs.
                    </p>

                    {/* Banner stage strip */}
                    <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 max-w-5xl">
                        {STAGES.map((s) => (
                            <li key={s.n} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2.5 last:col-span-2 sm:last:col-span-1">
                                <span className="block text-[11px] font-bold tracking-[0.2em] text-[#CBB49A]">{s.n}</span>
                                <span className="block text-sm sm:text-base font-bold text-white leading-tight">{s.stage}</span>
                            </li>
                        ))}
                    </ol>
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · October 3, 2026 · Rules and rates last checked 3 October 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Write the fabric spec first, with tolerances. Hand-woven and hand-printed cloth varies, so agree how much in writing.</li>
                            <li>• Ask for proof behind every craft claim, and lab-test the fabric before you pay for bulk.</li>
                            <li>• Since 24 July 2026 Indian goods pay their normal US duty <strong>plus 10%</strong>, small parcels included, and a garment sewn outside India can&rsquo;t be labelled &ldquo;Made in India&rdquo;.</li>
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
                                        <Link href="/blogs/indian-textile-art-us-fashion-brands" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Culture &amp; Brand</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Indian textile art meets modern fashion</p>
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
                                Most US founders meet Indian textiles through a single piece of cloth. It might be a block-printed cotton bought in Jaipur, an ikat a customer wore to a fitting, or a swatch a mill posted after a message on Instagram. Getting from that one piece to three hundred finished dresses in a New Jersey warehouse is five separate jobs, and most of the trouble happens in the gaps between them.
                            </p>
                            <p className="mb-5 text-base lg:text-lg leading-snug">
                                We have already written about <Link href="/blogs/indian-textiles-for-us-fashion-brands" className={LINK}>why US brands are choosing Indian textiles</Link> and <Link href="/blogs/indian-textile-art-us-fashion-brands" className={LINK}>which Indian crafts suit a modern collection</Link>. This post is the practical part. It covers what goes on the spec sheet, how to check a supplier, which samples and tests to pay for, and what US customs expects when the cartons land.
                            </p>
                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                India is the world&rsquo;s sixth-largest exporter of textiles and apparel, with about 4% of world exports and $37.75 billion shipped in 2024&ndash;25 (<a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2234442" target="_blank" rel="noopener noreferrer" className={LINK}>PIB</a>). A supply base that size gives you plenty of choice, and that makes picking the right supplier harder.
                            </p>

                            {/* Infographic 1 — the journey */}
                            <section id="journey" className="scroll-mt-28">
                                <figure className="not-prose my-8 rounded-2xl bg-[#2D2A2E] p-5 sm:p-7">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">The Indian textile sourcing journey</p>
                                    <p className="text-sm text-gray-300 mb-6">Five stages, and the document you should be holding at the end of each one</p>
                                    <ol className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                                        {STAGES.map((s, i) => (
                                            <li key={s.n} className="relative border-t-2 border-[#CBB49A] pt-3">
                                                <span className="text-3xl font-extrabold text-white/90 tracking-tight">{s.n}</span>
                                                <p className="mt-1 text-base font-bold text-white">{s.stage}</p>
                                                <p className="mt-1 text-sm text-gray-300 leading-snug">{s.hold}</p>
                                                {i < STAGES.length - 1 && <span aria-hidden className="hidden sm:block absolute -right-3 top-6 text-[#CBB49A]">→</span>}
                                            </li>
                                        ))}
                                    </ol>
                                    <figcaption className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-400 leading-snug">
                                        Krazy Kreators · if you can&rsquo;t produce the document, the stage isn&rsquo;t finished
                                    </figcaption>
                                </figure>
                            </section>

                            {/* Step 1 */}
                            <section id="spec" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 1: Define Your Fabric Requirements Before You Contact Anyone
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A small brass thread-counter magnifier standing on off-white hand-woven cotton on a teak work table in raking morning light, a measuring tape in the foreground: checking Indian fabric against a written spec before sourcing. No people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A supplier can only quote for what you describe. Ask five mills for &ldquo;soft indigo block-printed cotton&rdquo; and you will get five prices for five different fabrics, with no way to compare them.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Put the nine fields below in writing, including weight in GSM <em>(grams per square metre; a 60 GSM voile is sheer, a 200 GSM twill makes trousers)</em>. Handmade cloth needs two extra lines. Ask the usable width before your pattern is graded, because some handlooms weave narrower than a mill. And agree a tolerance, since hand-woven weight and hand-printed colour shift a little from bolt to bolt.
                                </p>

                                {/* Infographic 2 — spec sheet */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Anatomy of a fabric spec</p>
                                    <p className="text-sm text-[#666666] mb-5">Nine fields to send with your first request. <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#A2543A] align-middle mx-1" /> marks the lines that matter more for handmade cloth.</p>
                                    <div className="rounded-xl bg-white border border-gray-200 divide-y divide-gray-100">
                                        {SPEC.map((f) => (
                                            <div key={f.field} className="grid grid-cols-[1fr_1.4fr] sm:grid-cols-[180px_1fr_auto] gap-3 px-4 py-3 items-center">
                                                <p className="text-sm font-bold text-[#2D2A2E]">{f.field}</p>
                                                <p className="text-sm text-[#4A484A] leading-snug">{f.eg}</p>
                                                {f.hand ? <span className="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-[#A2543A]" aria-label="matters more for handmade cloth" /> : <span className="hidden sm:inline-block w-2.5" />}
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-4 text-xs text-[#999999]">Krazy Kreators · example values for an Indian handloom cotton shirt-dress</figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The fabric spec later sits inside your <Link href="/blogs/what-is-a-tech-pack" className={LINK}>tech pack</Link> <em>(the full specification file the factory builds from)</em>. If weight is new to you, our <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className={LINK}>GSM guide</Link> covers it.
                                </p>
                            </section>

                            {/* Step 2 */}
                            <section id="supplier" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 2: Find the Right Indian Textile Supplier, Then Check the Claims
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Start with the export councils. The <a href="https://hepcindia.com/" target="_blank" rel="noopener noreferrer" className={LINK}>Handloom Export Promotion Council</a> represents exporters of hand-woven cloth, and the <a href="https://www.aepcindia.com/" target="_blank" rel="noopener noreferrer" className={LINK}>Apparel Export Promotion Council</a> represents garment makers. Trade fairs let you handle the fabric before you commit. Bharat Tex, India&rsquo;s largest textile fair, runs in New Delhi from 31 March to 3 April 2027 (<a href="https://bharat-tex.com/" target="_blank" rel="noopener noreferrer" className={LINK}>Bharat Tex</a>), and closer to home, Texworld New York is at the Javits Center on 19&ndash;21 January 2027 (<a href="https://texworld-usa.us.messefrankfurt.com/new-york/en.html" target="_blank" rel="noopener noreferrer" className={LINK}>Messe Frankfurt</a>). A referral from a founder who has already shipped with a supplier is often worth more than either.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Ask every candidate the same things. Do they make your fabric or buy it in? Can they sample before bulk, and what can they make in a month? Have they shipped to US buyers? Notice how fast they answer. A supplier who takes a week to reply now will take a week when a shipment is late.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then check the craft claims, because &ldquo;handloom&rdquo; and &ldquo;authentic&rdquo; cost nothing to print on a sales deck.
                                </p>

                                {/* Infographic 3 — proof table */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-white overflow-hidden">
                                    <div className="px-5 sm:px-6 pt-5 sm:pt-6">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">What they say vs what to ask for</p>
                                        <p className="text-sm text-[#666666] mb-4">Five supplier claims and the proof that backs each one</p>
                                    </div>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-[#2D2A2E] text-left">
                                                <th className="px-5 sm:px-6 py-3 font-bold text-[#CBB49A] w-2/5">The claim</th>
                                                <th className="px-5 sm:px-6 py-3 font-bold text-white">Ask for</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {PROOF.map((p) => (
                                                <tr key={p.claim} className="align-top">
                                                    <td className="px-5 sm:px-6 py-3 font-semibold text-[#2D2A2E]">{p.claim}</td>
                                                    <td className="px-5 sm:px-6 py-3 text-[#4A484A] leading-snug">{p.proof}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <figcaption className="px-5 sm:px-6 py-4 text-xs text-[#999999]">Krazy Kreators · Handloom Mark is run by the Textiles Committee, Government of India · Chanderi, Pochampalli Ikat, Bagh prints and Sanganeri hand block printing are registered GIs (IP India)</figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The cotton line in that table matters more than it looks. US customs presumes that any goods made with inputs from China&rsquo;s Xinjiang region were made with forced labour, wherever the garment was sewn (<a href="https://www.cbp.gov/trade/forced-labor/faqs-uflpa-enforcement" target="_blank" rel="noopener noreferrer" className={LINK}>CBP</a>). Shipments of Indian origin appear in its <a href="https://www.cbp.gov/newsroom/stats/trade/uyghur-forced-labor-prevention-act-statistics" target="_blank" rel="noopener noreferrer" className={LINK}>detention statistics</a>, so find out which mills spun the yarn, and keep those records yourself.
                                </p>
                            </section>

                            {/* Step 3 */}
                            <section id="samples" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 3: Request Fabric Samples in the Right Order
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Six cotton lab-dip strips clipped on a wire in an Indian dye house, stepping from deep indigo to pale blue, with a steaming dye vat and brick walls behind: colour sampling before bulk production of Indian fabric. No people, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Samples come in a sequence, and skipping one usually costs a round later. Start with swatches to judge the handle. Next come lab dips <em>(small pieces dyed to match your colour reference)</em>, and for a printed fabric, a strike-off <em>(a short test run of your design on the actual cloth)</em>. Embroidery gets its own sample panel. Only once all of those are approved does it make sense to sew a garment sample.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Approve colour against a physical standard that you and the supplier both hold. A photo on a phone screen is not a colour standard, and it is the most common reason a delivered shade &ldquo;isn&rsquo;t what we agreed&rdquo;.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Indian Fabric Spec Sheet</h4>
                                        <p className="text-[#4A484A] leading-snug">The nine-field spec from step 1 as a fill-in sheet, with the sample sequence and the four lab tests on the back. Send it with your first enquiry.</p>
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

                            {/* Step 4 */}
                            <section id="testing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 4: Test Quality Before Bulk Production
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A sample that looks right can still fail in a customer&rsquo;s washing machine. Hand-dyed and natural-dyed cloth is where this bites hardest, so send the approved fabric to an independent lab before you sign off bulk. Four tests, published by <a href="https://members.aatcc.org/store/tm61/495/" target="_blank" rel="noopener noreferrer" className={LINK}>AATCC</a> and <a href="https://www.astm.org/Standards/D5034.htm" target="_blank" rel="noopener noreferrer" className={LINK}>ASTM</a>, cover most of the risk.
                                </p>

                                {/* Infographic 4 — tests */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Four lab tests before bulk</p>
                                    <p className="text-sm text-[#666666] mb-5">The US test methods to name on your purchase order</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {TESTS.map((t) => (
                                            <div key={t.test} className="rounded-xl bg-white border border-gray-200 p-4">
                                                <p className="text-[11px] font-bold tracking-wider text-[#8C7355]">{t.method}</p>
                                                <p className="mt-1 font-bold text-[#2D2A2E]">{t.test}</p>
                                                <p className="mt-1 text-sm text-[#4A484A] leading-snug">Catches: {t.catches}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-4 text-xs text-[#999999]">Krazy Kreators · test methods published by AATCC and ASTM · one TM61 run approximates five home washes · D5034 is for woven cloth, not knits</figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Testing one sample doesn&rsquo;t prove the whole run will match it. Hand-dyed cloth is dyed in lots, and each lot comes out slightly different. Ask for a shade band <em>(cuttings from every dye lot, side by side)</em> and approve it before cutting, so the shirts in one size don&rsquo;t come out a different blue from the next.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Lab fees are real money on a first run of a few hundred pieces, and some founders skip them. If the fabric is a mill cotton the supplier has already tested for another US buyer, a recent report on that exact quality may be enough. For a new hand-dyed cloth, pay for the tests.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Testing one sample doesn&rsquo;t prove the whole run will match it.&rdquo;
                                </blockquote>
                            </section>

                            {/* Step 5 */}
                            <section id="production" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 5: Move From Textile to Finished Garment, and Into the US
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="A finished off-white midi shirt-dress hand block-printed with small rust and indigo motifs, belted, on a black dress form in a sampling room with brown paper patterns on the cutting table behind: Indian textiles turned into a finished garment for a US brand. No people, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Once the shade band is approved, the order moves through cutting, sewing, quality control, packing and shipping. Every handover is a place where responsibility can slip, which is why it helps when fabric and sewing happen in the same country. It matters at the border, too. Under US origin rules, a sewn garment comes from the country where it was wholly assembled (<a href="https://www.ecfr.gov/current/title-19/chapter-I/part-102/section-102.21" target="_blank" rel="noopener noreferrer" className={LINK}>19 CFR 102.21</a>). Indian fabric sewn into dresses in another country doesn&rsquo;t make them &ldquo;Made in India&rdquo;, and the label can&rsquo;t say so.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Every garment needs a label showing fibre content by percentage, the country of origin, and your company name or RN <em>(a registration number the FTC issues to US businesses)</em> (<a href="https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts" target="_blank" rel="noopener noreferrer" className={LINK}>FTC</a>). It also needs permanent care instructions that you have a reasonable basis for (<a href="https://www.ftc.gov/business-guidance/resources/clothes-captioning-complying-care-labeling-rule" target="_blank" rel="noopener noreferrer" className={LINK}>FTC Care Labeling Rule</a>). The wash tests from step 4 are that basis.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then the cartons have to clear customs. Since 24 July 2026, Indian goods have paid their normal US duty plus an extra 10%, and apparel is not exempt (<a href="https://ustr.gov/sites/default/files/files/Press/Releases/2026/FLIP%20301%20Investigation%20Final%20Action%20FRN%207-23-26%20FINAL.pdf" target="_blank" rel="noopener noreferrer" className={LINK}>USTR</a>). The duty-free allowance for small parcels is gone indefinitely, so even a courier box of samples pays (<a href="https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other" target="_blank" rel="noopener noreferrer" className={LINK}>Federal Register</a>). Ocean freight needs an Importer Security Filing at least 24 hours before the cargo is loaded in India (<a href="https://www.ecfr.gov/current/title-19/chapter-I/part-149/section-149.2" target="_blank" rel="noopener noreferrer" className={LINK}>19 CFR 149.2</a>). Shipments worth more than $2,500 generally need a formal customs entry (<a href="https://www.ecfr.gov/current/title-19/chapter-I/part-143/subpart-C/section-143.21" target="_blank" rel="noopener noreferrer" className={LINK}>19 CFR 143.21</a>). On the water, Maersk moved its India&ndash;US East Coast service back through the Red Sea in July, which it says saves about a week on westbound sailings (<a href="https://www.maersk.com/news/articles/2026/07/09/structural-changes-to-mecl" target="_blank" rel="noopener noreferrer" className={LINK}>Maersk</a>). That can change again if security does.
                                </p>

                                {/* Infographic 5 — US entry */}
                                <figure className="not-prose my-8 rounded-2xl bg-[#2D2A2E] p-5 sm:p-7">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">What two Indian garments pay at the US border</p>
                                    <p className="text-sm text-gray-300 mb-6">Normal US duty plus the 10% added on 24 July 2026, on the declared value of one piece</p>
                                    <div className="space-y-6">
                                        {ENTRY.map((e) => (
                                            <div key={e.item}>
                                                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                                                    <p className="font-bold text-white">{e.item} <span className="text-xs font-normal text-gray-400">HTS {e.hts} · ${e.value.toFixed(2)} value</span></p>
                                                    <p className="text-sm text-[#CBB49A] font-bold">{(e.mfn + 10).toFixed(1)}% = ${(e.value * (e.mfn + 10) / 100).toFixed(2)} duty</p>
                                                </div>
                                                <div className="flex h-7 w-full rounded-md overflow-hidden bg-white/5" role="img" aria-label={`${e.item}: ${e.mfn}% normal duty plus 10% additional duty`}>
                                                    <div className="h-full bg-[#CBB49A] flex items-center pl-2 text-[11px] font-bold text-[#2D2A2E]" style={{ width: `${(e.mfn / 30) * 100}%` }}>{e.mfn}%</div>
                                                    <div className="h-full bg-[#A2543A] flex items-center pl-2 text-[11px] font-bold text-white" style={{ width: `${(10 / 30) * 100}%` }}>+10%</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {["Fibre, origin + RN label", "Care label", "ISF, 24h before loading", "Formal entry over $2,500"].map((d) => (
                                            <div key={d} className="rounded-lg border border-white/15 px-3 py-2 text-xs sm:text-sm text-gray-200 flex gap-2 items-start">
                                                <Check className="w-4 h-4 text-[#CBB49A] flex-shrink-0 mt-0.5" />{d}
                                            </div>
                                        ))}
                                    </div>
                                    <figcaption className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-400 leading-snug">
                                        Krazy Kreators · normal rates from the US Harmonized Tariff Schedule (hts.usitc.gov), checked 3 October 2026 · illustrative values, not a quote · bar scale 0&ndash;30%
                                    </figcaption>
                                </figure>
                            </section>

                            {/* Contemporary */}
                            <section id="contemporary" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How to Make Indian Textiles Feel Contemporary for the US Market
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Let the fabric carry the heritage and keep the cut modern: a block print on an oversized shirt, ikat on a short jacket. The craft post covers <Link href="/blogs/indian-textile-art-us-fashion-brands" className={LINK}>which techniques suit which products</Link>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Tell the story only as far as your paperwork goes. &ldquo;Hand block-printed in Rajasthan&rdquo; is a good product line if you can name the workshop. And learn what a motif means before you put it on a hoodie, because some carry religious or community meaning.
                                </p>
                            </section>

                            {/* Krazy Kreators */}
                            <section id="krazy-kreators" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How Krazy Kreators Helps US Brands Turn Indian Textiles Into Finished Collections
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Each of the five stages above is something Krazy Kreators runs for US founders in one place. That covers <Link href="/design-services" className={LINK}>design support</Link> and tech packs, <Link href="/end-to-end-services/raw-materials" className={LINK}>fabric sourcing</Link>, sampling, <Link href="/manufacturing-services" className={LINK}>production</Link>, quality control, packaging and dispatch to the US. The team that picks your fabric is the team that signs off the finished garment.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    For <Link href="/case-studies/tilted-lotus" className={LINK}>Tilted Lotus</Link>, that started with research into South Asian motifs, colour and textile technique before any sketching. The result was a contemporary Western collection that kept the cultural references intact.
                                </p>

                                {/* Lead-gen CTA */}
                                <div className="not-prose mt-7 rounded-2xl border border-[#CBB49A]/50 bg-[#F8F7F4] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Sourcing Indian textiles?</p>
                                        <p className="text-[#2D2A2E] leading-snug">
                                            Looking to source Indian textiles and turn your ideas into a production-ready fashion collection? Talk to Krazy Kreators about your next clothing line.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setContactOpen(true)}
                                        className="shrink-0 px-6 py-3 bg-[#2D2A2E] text-white font-semibold rounded-full hover:bg-[#1f1d20] transition-colors inline-flex items-center justify-center gap-2"
                                    >
                                        Talk to us about your line
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

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A single cargo ship far out on a calm grey-blue ocean at dawn, seen past dark wet rocks through sea mist: the last leg of sourcing Indian textiles for a US clothing brand. No people, no text."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The cloth is the reason to source from India. The spec, the proof, the tests and the customs paperwork are what get it onto a US rail looking the way it did in the swatch. Which of the five stages would you rather hand to someone else?
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
                                <Link href="/blogs/indian-textiles-for-us-fashion-brands" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Why US Fashion Brands Are Choosing Indian Textiles for Their Next Collection</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The fabric guide behind this post: eight Indian textiles and where each one fits on a US line sheet.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the fabric guide <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Start your project</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Talk to a Krazy Kreators production lead about sourcing Indian textiles</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Send the swatch, sketch or style you have in mind. We&rsquo;ll come back with a fabric spec and a dated plan from sampling to US delivery.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start your project <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/indian-textile-art-us-fashion-brands",
                                            title: "Indian Textile Art Meets Modern Fashion: What US Brands Can Create With Indian Craftsmanship",
                                            dek: "Six crafts, what each suits in a modern collection, and where each gets difficult.",
                                            read: "6 min read",
                                        },
                                        {
                                            href: "/blogs/sourcing-clothing-manufacturing-from-india-2026",
                                            title: "Beyond China: Why More Fashion Brands Are Sourcing From India in 2026",
                                            dek: "The duty and cost-sheet side of choosing India over Vietnam or China.",
                                            read: "11 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "Where your fabric spec ends up, alongside every other instruction.",
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
