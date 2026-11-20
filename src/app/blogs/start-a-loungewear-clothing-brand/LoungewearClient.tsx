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
import { FAQS } from "./faqs";

const BLOG_ID = "start-a-loungewear-clothing-brand";

const HERO_IMAGE = "/blog/start-a-loungewear-clothing-brand-hero.jpg";
const SECTION1_IMAGE = "/blog/start-a-loungewear-clothing-brand-section1.jpg";
const MACRO_IMAGE = "/blog/start-a-loungewear-clothing-brand-macro.jpg";
const CLOSING_IMAGE = "/blog/start-a-loungewear-clothing-brand-closing.jpg";
const ENTRY_IMAGE = "/blog/start-a-loungewear-clothing-brand-entry.jpg";
const REPEAT_IMAGE = "/blog/start-a-loungewear-clothing-brand-repeat.jpg";
const STEPS_IMAGE = "/blog/start-a-loungewear-clothing-brand-steps.jpg";
const RIGHTCAT_IMAGE = "/blog/start-a-loungewear-clothing-brand-rightcat.jpg";

const TOC = [
    { id: "comfort", label: "Comfort and everyday fashion" },
    { id: "entry", label: "Lower entry barriers" },
    { id: "products", label: "Product opportunities" },
    { id: "customisation", label: "Customisation" },
    { id: "repeat", label: "Repeat purchases" },
    { id: "planning", label: "Collection planning" },
    { id: "manufacturer", label: "The right manufacturer" },
    { id: "mistakes", label: "Common mistakes" },
    { id: "steps", label: "Step-by-step approach" },
    { id: "right-category", label: "Is it the right category?" },
    { id: "conclusion", label: "Conclusion" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function LoungewearClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("comfort");
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

            {/* Hero */}
            <section className="relative h-[60vh] min-h-[560px] max-h-[720px] flex items-center justify-center overflow-hidden">
                <Image
                    src={HERO_IMAGE}
                    alt="A sunlit living room on a slow morning: a sage-green fleece sweatshirt and matching joggers draped over the arm of a grey linen sofa, a single ceramic mug on the wooden floor, sheer curtains glowing with low sun and a leafy plant out of focus in the foreground. No people, no text, no logos."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Business
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">November 16, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Why Loungewear Is the Smartest Category<br className="hidden lg:block" />{" "}
                        <span className="block lg:inline text-white">to Launch Your Clothing Brand In</span>
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Plain shapes, one fabric and a small first drop. And the places it still goes wrong.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">· Growth &amp; Business</span></p>
                            <p className="text-sm text-[#666666]">Covers category choice and first-collection planning for US clothing founders · November 16, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Comfort sells: in one 2026 US survey, <strong>sweats and joggers</strong> topped the clothing people planned to buy.</li>
                            <li>• Loungewear is a good <strong>first category</strong>: plain shapes, many products from one fabric, a small first drop.</li>
                            <li>• Simple is not easy: the <strong>fabric and the fit</strong> decide whether it works, so the manufacturer matters most.</li>
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
                                        <Link href="/blogs/family-matching-apparel-manufacturing" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Compliance</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Family matching apparel</p>
                                        </Link>
                                        <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Fabric</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Understanding fabric GSM</p>
                                        </Link>
                                        <Link href="/blogs/private-label-vs-custom-clothing-manufacturing" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Private label vs custom manufacturing</p>
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
                                Ask American shoppers what they plan to buy this year and the answer is not a blazer. In Cotton Incorporated&rsquo;s <a href="https://www.cottoninc.com/wp-content/uploads/2026/01/New-Years-compressed.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">2026 New Year survey of 891 US consumers</a>, sweatpants, sweatshirts and joggers topped the list of clothing people tied to their resolutions, at 62%. T-shirts came next at 56%, then activewear at 55%.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">It is one survey, from a cotton trade body, and it records intentions, not sales. It still matches what any founder can see: people dress for comfort first.</p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">That is why we think a founder who wants to start a loungewear clothing brand is making a reasonable bet. The shapes are plain, one fabric becomes several products, and a small first drop tells you quickly whether anyone wants it. The traps are in the cloth and the fit.</p>

                            {/* H2 1 */}
                            <section id="comfort" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Growing Consumer Preference for Comfort and Everyday Fashion
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="An oatmeal crewneck sweatshirt hanging from a wooden peg by a hallway door, a green canvas tote and a set of house keys on the shelf beside it, soft window light from the right. The everyday setting for a loungewear piece. No labels, no logos, no lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Comfort used to be what you gave up to look put together. For much everyday clothing that has flipped. The same sweatshirt now goes to the school gate, a video call from the kitchen table and an airport.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">That wider use is the opening for a new brand. A lounge set bought for evenings in gets worn on Saturday errands, so it has to look decent in daylight and survive a weekly wash.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">The catch: everyone can see this, and every large retailer sells a jogger. &ldquo;Comfortable&rdquo; is the entry ticket, not a position. You need a view on who the clothes are for.</p>
                            </section>

                            {/* H2 2 */}
                            <section id="entry" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Lower Entry Barriers for New Clothing Brands
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={ENTRY_IMAGE}
                                        alt="Charcoal fleece joggers with a drawstring and gathered ankles draped over a pale wooden chair beside a small black carry-on suitcase in a sunlit hotel room, a white bed behind. No people, no logos, no lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>


                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">A tailored jacket has a lining, interfacing and a collar that must roll correctly. A sweatshirt has a body, two sleeves, a neckband, two cuffs and a hem. A jogger is two legs, a waistband and elastic. Fewer pieces to pattern and sew means fewer arguments at the fit sample (the trial garment you check against your measurements).</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Simple shapes also let you start small: a few styles in one fabric, then the colours and cuts people ask for.</p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Simple to make is not the same as simple to make well.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">A plain sweatshirt shows every flaw: a rippling neckband, a twisting side seam, uneven sleeves. The barrier to trying is low. The standard you are judged on is not.</p>
                            </section>

                            {/* H2 3 */}
                            <section id="products" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Multiple Product Opportunities Within One Category
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">One fabric can become a sweatshirt, a short, a jogger and a set, and each is another reason to buy again. The table sets out the six families new brands usually choose from.</p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-lg font-bold text-[#2D2A2E] mb-1">Six loungewear families, and where each one slips</p>
                                    <p className="text-sm text-[#666666] mb-4">Typical fabric direction and the common fault to check at sampling</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[620px] text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="w-[24%] py-2 pr-3 text-xs font-bold uppercase tracking-[0.14em] text-[#999999]">Product</th>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[#666666] bg-[#EDE9E2] rounded-tl-lg">Fabric direction</th>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#8C7355] rounded-tr-lg">Watch for</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-[#2D2A2E] leading-snug">
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">Matching lounge sets</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA]">Jersey, French terry or brushed knit, cut from one roll</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9]">Top and bottom drifting apart in colour or shrinkage</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">Oversized T-shirts</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA]">Heavier cotton jersey</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9]">A rippling neckline; length lost in the first wash</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">Shorts and joggers</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA]">French terry, fleece, light jersey</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9]">A waistband that rolls; drawcords and elastic that fail first</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">Sleepwear and pajama sets</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA]">Cotton or modal knit, woven cotton, flannel</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9]">Seams that chafe; children&rsquo;s sizes carry federal flammability rules</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">Sweatshirts and hoodies</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA]">Fleece, French terry</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9]">Pilling; cuff and hem rib that stops springing back</td>
                                                </tr>
                                                <tr className="border-t border-b border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">Co-ord sets and casual homewear</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA] rounded-bl-lg">Waffle, rib, light knits and weaves</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9] rounded-br-lg">Pieces dyed in different batches that no longer match</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        French terry is a knit with soft loops on the inside. For how weight changes the feel, see our <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="underline text-[#CBB49A] hover:text-[#b7a078]">guide to fabric GSM</Link>.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Colour and print multiply this further: one jogger in four colours is four products to the customer and one pattern to the manufacturer.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Sleepwear deserves a flag. In the US, <a href="https://www.cpsc.gov/s3fs-public/1615-and-1616-Fact-Sheet-Childrens-Sleepwear-English.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">children&rsquo;s sleepwear above 9 months and up to size 14</a> must pass a flame test or be cut snug and labelled as such. Adult pajamas fall outside those rules, so a kids&rsquo; version of the same print is a different product, as our post on <Link href="/blogs/family-matching-apparel-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">family matching apparel</Link> explains.</p>
                            </section>

                            {/* H2 4 */}
                            <section id="customisation" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Opportunities for Customisation and Brand Differentiation
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme close-up of sage French terry fabric with a flat cover-stitched seam running diagonally across the frame, the soft loops of the knit catching side light. No labels, no logos, no lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Loungewear lets a small brand look different without inventing a new garment. There are four levers: print and colour; fabric weight and hand-feel; fit, such as a longer sleeve or a size range competitors skip; and trims, like a woven neck label or tonal embroidery.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Pick one or two. A brand known for one rib texture or colour palette is easier to remember than one with custom everything, and each custom element adds sampling time.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Know how <Link href="/blogs/private-label-vs-custom-clothing-manufacturing" className="underline text-[#CBB49A] hover:text-[#b7a078]">private label clothing manufacturing</Link> differs from fully custom work before you brief anyone. The first adapts styles a manufacturer already makes. The second builds fit and fabric from your design.</p>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Work through it with us</p>
                                <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">Got a loungewear idea you are still turning over?</h4>
                                <p className="text-[#4A484A] leading-snug mb-4">Tell us the piece you would build first and the fabric you have in mind. We will point out where it is likely to go wrong before you spend anything on it.</p>
                                <button onClick={() => setContactOpen(true)} className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors inline-flex items-center gap-2">
                                    Send us your idea
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* H2 5 */}
                            <section id="repeat" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why Loungewear Can Support Repeat Purchases
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={REPEAT_IMAGE}
                                        alt="Close-up of a heather-grey fleece sweatshirt sleeve with a ribbed cuff resting on a marble cafe table beside a white espresso cup and saucer, soft window light. No people, no logos, no lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>


                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Nobody re-orders a bad sweatshirt. These clothes get worn and washed weekly, so the first wash is your real launch. A set that keeps its colour sends a customer back for a second one. One that pills by week three gets a one-star review.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Structure helps. Matching sets give a reason to return for the missing piece, and new colours each season give buyers something to add.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">All of it rests on product quality, customer satisfaction, pricing and a clear brand position. A discount code will not fix a garment that did not last.</p>
                            </section>

                            {/* H2 6 */}
                            <section id="planning" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Easier Collection Planning for Emerging Fashion Brands
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">The usual first-collection mistake is launching a whole wardrobe. Four styles in two colours is eight colour-styles. In five sizes, XS to XL, that is 40 items to make and stock. Double both and it is 160.</p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 250" role="img" aria-label="Two bars showing how stock lines multiply. Four styles times two colours times five sizes is 40 stock lines. Eight styles times four colours times five sizes is 160 stock lines, four times as many." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">How fast stock lines multiply</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Styles &times; colours &times; sizes (XS to XL), bars drawn at 4 px per item</text>

                                        <text x="0" y="96" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fontWeight="700" fill="#2D2A2E">A focused first drop</text>
                                        <text x="0" y="114" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666">4 styles &times; 2 colours &times; 5 sizes</text>
                                        <rect x="250" y="80" width="160" height="40" fill="#CBB49A" />
                                        <text x="422" y="106" fontFamily="Helvetica, Arial, sans-serif" fontSize="16" fontWeight="700" fill="#2D2A2E">40 items</text>

                                        <text x="0" y="176" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fontWeight="700" fill="#2D2A2E">The whole wardrobe at once</text>
                                        <text x="0" y="194" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666">8 styles &times; 4 colours &times; 5 sizes</text>
                                        <rect x="250" y="160" width="640" height="40" fill="#8C7355" />
                                        <text x="780" y="186" fontFamily="Helvetica, Arial, sans-serif" fontSize="16" fontWeight="700" fill="#FFFFFF" textAnchor="end">160 items</text>

                                        <line x1="250" y1="70" x2="250" y2="214" stroke="#B0AAA2" strokeWidth="1" />
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Doubling the range quadruples the stock, and every extra style also needs its own pattern, fit sample and photography.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Start with four styles in one fabric, say a hero set, a tee and a short, in two colours: one neutral, one that photographs well. Read the reorders and the returns, then plan the next season around what sold.</p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">A small range can look thin online. If so, add colours before styles: the pattern and fit are already approved, so a new colour is a smaller risk than a new shape.</p>
                            </section>

                            {/* H2 7 */}
                            <section id="manufacturer" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Choosing the Right Loungewear Manufacturer Matters
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A bright product-development studio: a dress form wearing a half-finished sage jersey lounge set with pinned seams, a rail of unbranded oat, grey and sage sweatshirts, joggers and tees behind it, and a roll of sage knit fabric with scissors and a tape measure on a wooden table by a tall window. No people, no logos, no lettering."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">If the category is simple, the manufacturer decides whether it looks simple. Most loungewear complaints trace back to six production decisions.</p>
                                <ul className="list-none space-y-3 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li><strong className="text-[#2D2A2E]">Fabric.</strong> Is the bulk cloth the cloth you approved, washed and measured for shrinkage before cutting?</li>
                                    <li><strong className="text-[#2D2A2E]">Pattern and sampling.</strong> A <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">tech pack</Link> (the document the factory builds from) and a fit sample you wear and wash.</li>
                                    <li><strong className="text-[#2D2A2E]">Stitching and finish.</strong> Necklines that recover, flat seams that will not chafe, waistbands that stay put.</li>
                                    <li><strong className="text-[#2D2A2E]">Sizing.</strong> A medium in the first order that matches the medium in the reorder.</li>
                                    <li><strong className="text-[#2D2A2E]">Production checks.</strong> Inspection during sewing, not only at the end. Our <Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">clothing production process</Link> post shows where the checkpoints fall.</li>
                                    <li><strong className="text-[#2D2A2E]">Branding.</strong> Labels, hangtags and packaging to your spec.</li>
                                </ul>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Krazy Kreators is a clothing manufacturing partner that helps fashion brands develop and make their collections, from fabric sourcing and sampling to production. You can see how that works across our <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">clothing manufacturing services</Link>, and where a brand wants one team on all of it, our <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fashion brand manufacturing</Link> service covers it end to end.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">Whoever you pick, ask to see a wash-tested sample, and ask what happens when bulk differs from the sample you approved.</p>
                            </section>

                            {/* H2 8 */}
                            <section id="mistakes" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Common Mistakes to Avoid When Starting a Loungewear Brand
                                </h2>

                                <ul className="list-none space-y-3 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li><strong className="text-[#2D2A2E]">Picking fabric on the swatch.</strong> Soft in the hand, pilled in the wash.</li>
                                    <li><strong className="text-[#2D2A2E]">Ignoring fit and sizing consistency.</strong> Relaxed fit should not mean sizes that drift between batches.</li>
                                    <li><strong className="text-[#2D2A2E]">Launching too many products.</strong> Thin stock in every size and no clear signal on what sold.</li>
                                    <li><strong className="text-[#2D2A2E]">Compromising on stitching and finishing.</strong> It is the first thing a customer feels and the last thing you can fix.</li>
                                    <li><strong className="text-[#2D2A2E]">Not knowing who it is for.</strong> &ldquo;Everyone who likes comfort&rdquo; is not a customer.</li>
                                    <li><strong className="text-[#2D2A2E]">Hiring a manufacturer without checking what it can make.</strong> Ask for samples of the exact kind of garment.</li>
                                </ul>
                            </section>

                            {/* H2 9 */}
                            <section id="steps" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How to Start Your Own Loungewear Clothing Brand: A Step-by-Step Approach
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={STEPS_IMAGE}
                                        alt="A plain white garment rail on a sunlit seaside terrace holding black, charcoal and heather-grey lounge sets on wooden hangers, a white balustrade and palm trees behind. No people, no logos, no lettering."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>


                                <ol className="list-decimal pl-6 space-y-2.5 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li>Research your audience and the brands already selling to them.</li>
                                    <li>Define your positioning in one sentence.</li>
                                    <li>Finalise a small range, around four styles.</li>
                                    <li>Select the fabric first, then the colours and designs.</li>
                                    <li>Find a manufacturer that can show you the same kind of garment.</li>
                                    <li>Develop samples and check quality, washing them before you approve.</li>
                                    <li>Plan pricing, packaging and branding from your real unit cost.</li>
                                    <li>Launch online, to a small audience first.</li>
                                    <li>Collect feedback and returns, and let them shape the next collection.</li>
                                </ol>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">For the groundwork around these steps, such as the legal entity and the trademark, see our guide on <Link href="/blogs/how-to-start-a-clothing-brand-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">how to start a clothing brand</Link>.</p>
                            </section>

                            {/* H2 10 */}
                            <section id="right-category" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Is Loungewear the Right Category for Your Fashion Startup?
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={RIGHTCAT_IMAGE}
                                        alt="A long black knit hooded cardigan hanging on a wooden coat stand in a white-tiled entryway, a patch of afternoon sun across the tiles and a grey canvas weekend bag on the floor. No people, no logos, no lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>


                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Not always. Five questions will tell you.
                                </p>
                                <ul className="list-none space-y-3 mb-5 text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <li><strong className="text-[#2D2A2E]">Who is the buyer?</strong> If you cannot describe them in a sentence, you are not ready to pick fabric.</li>
                                    <li><strong className="text-[#2D2A2E]">What can you afford to get wrong?</strong> Cost moves with fabric, styles, sampling rounds and run size. Get quotes on a small, specific range.</li>
                                    <li><strong className="text-[#2D2A2E]">What is your edge?</strong> A fabric, a fit, a look. Being cheaper is not one.</li>
                                    <li><strong className="text-[#2D2A2E]">Who else sells this?</strong> Their one-star reviews are your brief.</li>
                                    <li><strong className="text-[#2D2A2E]">Where does it go next?</strong> Outerwear, kidswear, a second fabric family.</li>
                                </ul>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">And there are exceptions. If your skill is tailoring or occasion wear, loungewear may pull you off what you do best. If you cannot sell on fabric and fit, the category is crowded enough to punish you.</p>
                            </section>

                            {/* Conclusion */}
                            <section id="conclusion" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Build Your Clothing Brand Around Everyday Comfort
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    If you want to start a loungewear clothing brand, the case is a plain one: shapes people already wear every day, many products from a few fabrics, and a small first drop that tells you what to make next. What decides it is the manufacturing partner you pick, so choose that before you choose the second colour.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    If you could launch with only four pieces, which would they be?
                                </p>
                            </section>

                            {/* Closing commercial block */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Start your collection</p>
                                <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">Planning to launch your own loungewear collection?</h4>
                                <p className="text-[#4A484A] leading-snug mb-4">Partner with Krazy Kreators to bring your clothing brand ideas to life with quality-focused clothing manufacturing.</p>
                                <button onClick={() => setContactOpen(true)} className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors inline-flex items-center gap-2">
                                    Talk to us about your collection
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs
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

                            {/* About Krazy Kreators */}
                            <div className="not-prose mt-12 mb-4 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">About Krazy Kreators</p>
                                <p className="text-[#4A484A] leading-snug">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design</Link>, sampling, <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">under one roof</Link>, from first sketch to shelf. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/private-label-vs-custom-clothing-manufacturing" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Private Label vs Custom Clothing Manufacturing</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">Which route fits your first loungewear collection, and when to move from one to the other.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the comparison <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Ready to plan your first loungewear collection?</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Tell a Krazy Kreators production lead about the four pieces you would launch with and the fabric you have in mind. We will tell you what it takes to get them designed, sampled and produced.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "The document that makes unit 200 match the sample.",
                                            read: "12 min read",
                                        },
                                        {
                                            href: "/blogs/clothing-production-timeline",
                                            title: "From Sketch to Store: A Real Clothing Production Timeline",
                                            dek: "How long each stage takes on a real calendar.",
                                            read: "11 min read",
                                        },
                                        {
                                            href: "/blogs/how-to-start-a-clothing-brand-2026",
                                            title: "How to Start a Clothing Brand in 2026",
                                            dek: "The groundwork underneath any category choice.",
                                            read: "15 min read",
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
                        Send us your loungewear idea &mdash; we&rsquo;ll tell you what it takes <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
