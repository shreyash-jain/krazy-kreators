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

const BLOG_ID = "how-to-start-western-fashion-brand-2026";

const HERO_IMAGE = "/blog/how-to-start-western-fashion-brand-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/how-to-start-western-fashion-brand-2026-section1.jpg";
const MACRO_IMAGE = "/blog/how-to-start-western-fashion-brand-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/how-to-start-western-fashion-brand-2026-closing.jpg";

const TOC = [
    { id: "trends", label: "Why western wear is growing" },
    { id: "niche", label: "Step 1: Choose your niche" },
    { id: "research", label: "Step 2: Research the market" },
    { id: "fabric", label: "Step 3: Choose your fabrics" },
    { id: "design", label: "Step 4: Design your collection" },
    { id: "manufacturer", label: "Step 5: Find a manufacturer" },
    { id: "costs", label: "Step 6: Calculate your costs" },
    { id: "brand-store", label: "Step 7: Brand and online store" },
    { id: "marketing", label: "Step 8: Market your brand" },
    { id: "mistakes", label: "Mistakes to avoid" },
    { id: "key-takeaways", label: "Key takeaways" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function WesternWearClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("trends");
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
                    alt="A sunlit design studio with a rail of western-cut denim jackets, fringe-trimmed overshirts and suede-toned pieces, morning light across a wooden worktable scattered with trim swatches and a tape measure. No people, no logos, no legible text."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Growth &amp; Business
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">November 19, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Western Wear Is Back:<br className="hidden lg:block" />{" "}
                        <span className="block lg:inline text-white">How to Start a Western Fashion Brand in 2026</span>
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        A build order, step by step, for turning a trending aesthetic into a brand that still stands a year in.
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
                            <p className="text-sm text-[#666666]">Covers brand launches and go-to-market for US clothing founders · November 19, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• Western wear is selling on comfort and versatility, not costume — oversized denim, fringe and co-ords are the entry points.</li>
                            <li>• Fabric choice (cotton, denim, linen, rayon, satin) decides fit and feel more than the pattern does.</li>
                            <li>• A reliable manufacturer who samples before bulk matters more than a low quote.</li>
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
                                        <Link href="/blogs/how-to-start-a-clothing-brand-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">How to Start a Clothing Brand in 2026</p>
                                        </Link>
                                        <Link href="/blogs/what-is-a-tech-pack" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">What Is a Tech Pack?</p>
                                        </Link>
                                        <Link href="/blogs/mistakes-new-fashion-brand-founders-make" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Business</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">7 Mistakes New Fashion Founders Make</p>
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
                                Western wear has moved off the specialty rack and onto the main feed. Oversized denim, fringe jackets and co-ord sets turn up in styling videos as often as almost anything else right now, and shoppers who found the look online are already looking for somewhere to buy it.
                            </p>
                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                For someone thinking about starting a clothing brand, that is an opening: a defined aesthetic, a customer who already knows what she wants, and a short list of fabrics and silhouettes to build around.
                            </p>
                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                None of that works without three things handled early: the right fabric for each piece, a manufacturer who samples before bulk, and a brand that looks considered rather than copied. Here is the build order, step by step.
                            </p>

                            {/* H2 — Trends */}
                            <section id="trends" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why is western wear a growing business opportunity in 2026?
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="A single oversized western denim jacket with fringe trim on a wooden dress form, dramatic side window light, soft shadow falling across a bare studio wall behind it. No logos, no lettering, no people."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Western wear earns its current attention honestly. Comfortable, versatile pieces keep outselling anything occasion-only or heavily structured, and a look this photogenic travels well on video, which is where a lot of shoppers now discover a new label before they ever see a website.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Online stores make the category easier to test, too. A founder can launch a handful of styles, see what actually moves, and adjust before committing to a full range rather than guessing at scale from day one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That popularity brings competition with it. The aesthetic is easy to copy and easy to overbuy, so the founders who hold onto a style once it is trending tend to differentiate on fit and fabric rather than on simply being first.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Western fashion trends to watch in 2026</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Oversized shirts and relaxed fits</li>
                                        <li>• Denim jackets and jeans as the backbone of the category</li>
                                        <li>• Co-ord sets built around one silhouette</li>
                                        <li>• Statement tops and dresses with western detailing</li>
                                        <li>• Comfortable, easy-care fabrics over anything precious</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Step 1 */}
                            <section id="niche" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 1 — Choose your western fashion brand niche
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A general &ldquo;western wear&rdquo; store competes with every retailer already in the category. A specific one does not. Decide which version of the look you are building before anything else, because that choice shapes the fabric, the price point and the customer who finds you.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Popular western wear categories</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Women&rsquo;s casual western wear</li>
                                        <li>• Premium western fashion</li>
                                        <li>• Streetwear and oversized silhouettes</li>
                                        <li>• Sustainable, easy-care western pieces</li>
                                        <li>• Indo-western fusion</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-6 mb-3">Understand your target audience</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Write down who you are designing for in concrete terms: an age range, a budget, how often they buy clothes online, and whether they are shopping for a complete look or single statement pieces. That answer shapes every choice that follows, from fabric weight to where you advertise.
                                </p>
                            </section>

                            {/* H2 — Step 2 */}
                            <section id="research" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 2 — Research the market and competitors
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Once the niche is set, build a working list of five or six labels selling into it at a similar price point and aesthetic, and treat their product pages as a dataset rather than inspiration. Note which SKUs carry a &ldquo;bestseller&rdquo; or &ldquo;low stock&rdquo; badge, which have the most reviews, and which colourways or sizes sell out first &mdash; that says more about real demand than a single viral post does.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Reviews are the fastest competitive intelligence available, and most founders skim past them. Read the one- and two-star reviews on four or five competitor products specifically. The complaint that keeps repeating &mdash; fringe shedding after a few washes, a cut that runs small, a fabric that pills by the third wear &mdash; is usually the exact gap you can build a brand around.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">A 30-minute research routine</p>
                                    <ol className="space-y-1.5 text-[#2D2A2E] leading-snug list-decimal list-inside">
                                        <li>Pull up five or six competitor sites in the same niche and price band.</li>
                                        <li>Sort each by bestseller or most-reviewed; note the three styles that keep reappearing across all of them.</li>
                                        <li>Read 15&ndash;20 one- and two-star reviews across those styles and log the complaint that repeats.</li>
                                        <li>Check Google Trends for your core search term over the last 12 months to confirm the interest is steady, not a single spike.</li>
                                        <li>Save 20&ndash;30 reference images to one folder, tagged by silhouette rather than just &ldquo;inspo.&rdquo;</li>
                                    </ol>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The goal is not to copy a competitor&rsquo;s range. It is to find the one thing they are doing poorly and build your unique selling proposition around fixing it.
                                </p>
                            </section>

                            {/* H2 — Step 3 */}
                            <section id="fabric" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 3 — Select the right fabrics for western wear
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro close-up of raw denim weave beside a line of fringe trim stitched along a seam edge, shallow depth of field, natural side light picking out individual threads. No labels, no logos, no lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Fabric choice decides more about the finished garment than the pattern does. The same denim jacket wears differently depending on the weight and weave of the cloth underneath it, and a customer feels that difference the first time they put it on.
                                </p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-lg font-bold text-[#2D2A2E] mb-1">Where the five core western-wear fabrics work best</p>
                                    <p className="text-sm text-[#666666] mb-4">Match the fibre to the piece before you match it to the design</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[560px] text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#8C7355] rounded-tl-lg">Fabric</th>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[#666666] bg-[#EDE9E2]">Common applications</th>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[#666666] bg-[#EDE9E2] rounded-tr-lg">Breathability &amp; care</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-[#2D2A2E] leading-snug">
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 px-3 font-semibold bg-[#F3F0EA]">Cotton</td>
                                                    <td className="py-3 px-3">Shirts and casual tops</td>
                                                    <td className="py-3 px-3">Breathable, machine-washable, can shrink slightly on first wash</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 px-3 font-semibold bg-[#F3F0EA]">Denim</td>
                                                    <td className="py-3 px-3">Jeans, skirts and jackets</td>
                                                    <td className="py-3 px-3">Durable and heavier; colour can transfer when new</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 px-3 font-semibold bg-[#F3F0EA]">Linen</td>
                                                    <td className="py-3 px-3">Summer dresses and shirts</td>
                                                    <td className="py-3 px-3">Very breathable, creases by design, best hand- or gentle-washed</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 px-3 font-semibold bg-[#F3F0EA]">Rayon</td>
                                                    <td className="py-3 px-3">Dresses and flowy tops</td>
                                                    <td className="py-3 px-3">Soft drape, moderate breathability, loses shape if over-washed hot</td>
                                                </tr>
                                                <tr className="border-t border-b border-gray-200">
                                                    <td className="py-3 px-3 font-semibold bg-[#F3F0EA] rounded-bl-lg">Satin</td>
                                                    <td className="py-3 px-3">Partywear and statement outfits</td>
                                                    <td className="py-3 px-3 rounded-br-lg">Low breathability, snags easily, usually dry-clean or delicate-cycle</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Treat this as a starting shortlist, not a ceiling. A design that mixes two of these — denim with a rayon lining, cotton with satin trim — is common in the category.
                                    </figcaption>
                                </figure>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A fabric that looks right in a sample and performs differently in the customer&rsquo;s washing machine is a return, not a sale.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Beyond the fibre itself, ask your supplier about shrinkage after washing, whether the dye lot holds its colour run to run, and what care the fabric actually needs. Those three questions catch most of the problems a swatch alone will not show you.
                                </p>
                            </section>

                            {/* H2 — Step 4 */}
                            <section id="design" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 4 — Design your first clothing collection
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Keep the first collection small enough to execute well. Five to eight styles built around one consistent idea will outperform twenty styles built around none.
                                </p>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-6 mb-3">Start with a small collection</h3>
                                <div className="not-prose my-5 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Oversized shirts</li>
                                        <li>• Casual tops</li>
                                        <li>• One co-ord set</li>
                                        <li>• A denim-inspired piece</li>
                                        <li>• One statement dress or jacket</li>
                                    </ul>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Work from a mood board and a fixed colour palette before you sketch, so every piece reads as part of one line rather than five unrelated ideas. Build the size run early and fit-test it on real bodies, not only the sample size, before committing to a production quantity.
                                </p>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Work through it with us</p>
                                <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">Have a first western-wear collection sketched out?</h4>
                                <p className="text-[#4A484A] leading-snug mb-4">Send us the styles you are planning and the fabric you have in mind. We will tell you what a sample round on it would realistically need.</p>
                                <button onClick={() => setContactOpen(true)} className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors inline-flex items-center gap-2">
                                    Send us your collection
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* H2 — Step 5 */}
                            <section id="manufacturer" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 5 — Find a reliable clothing manufacturer
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Manufacturing is where a good design either survives or falls apart, and the difference rarely shows up in the first conversation with a factory. It shows up in the first washed sample. A reliable partner starts from a <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">tech pack</Link>: a spec sheet with exact measurements graded across your size run, construction notes and trim placement called out piece by piece, built from your sketch or a reference garment before a single yard of fabric is cut. Skip that step and two &ldquo;identical&rdquo; production runs can come back measuring differently, with nobody able to say why.
                                </p>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-6 mb-3">What happens between a sketch and a finished sample</h3>
                                <div className="not-prose my-5 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>&bull; <span className="font-semibold">Tech pack and pattern</span> &mdash; measurements graded across the full size run, with construction and trim called out piece by piece.</li>
                                        <li>&bull; <span className="font-semibold">Proto sample</span> &mdash; a first fit sample, usually revised once or twice before the fit is locked.</li>
                                        <li>&bull; <span className="font-semibold">Pre-production sample</span> &mdash; built in the actual bulk fabric and trims, not a substitute. This is the sample to approve, because it is the version the factory will try to match at scale.</li>
                                        <li>&bull; <span className="font-semibold">Inline and final inspection</span> &mdash; checks during cutting and sewing, then a random check across the finished run for stitch density, measurement tolerance and trim security before it ships.</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-6 mb-3">Fabric-specific checks a western-wear line needs</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Western wear has its own failure points, and they are specific enough that a generic quality checklist misses them.
                                </p>
                                <div className="not-prose my-5 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>&bull; Raw or rigid denim can shrink several percent on its first wash &mdash; a swatch should be pre-washed and measured before patterns are cut, not after.</li>
                                        <li>&bull; Fringe and suede-look trims need a rub and colourfastness check, since a dark dye can transfer onto a lighter base fabric in the customer&rsquo;s wash, not just the factory&rsquo;s.</li>
                                        <li>&bull; Fringe should be bar-tacked or lock-stitched at the base, not run on a single straight stitch &mdash; that is the difference between fringe that survives a season and fringe that is gone after three washes.</li>
                                        <li>&bull; Die-cut fringe comes out even length to length; hand-trimmed fringe does not, and the inconsistency shows in a flat-lay or product photo even when it reads fine on the body.</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-6 mb-3">A realistic timeline</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A first western-wear order typically moves through tech pack finalisation, two to three sample rounds, bulk cutting and sewing, and then four to six weeks of ocean freight to the US. Budgeting three to four months end to end, sampling included, keeps a launch date honest instead of aspirational.
                                </p>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-6 mb-3">Questions to ask your manufacturer</h3>
                                <div className="not-prose my-5 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <ol className="space-y-1.5 text-[#2D2A2E] leading-snug list-decimal list-inside">
                                        <li>Can you provide a pre-production sample in the actual bulk fabric before cutting the full run?</li>
                                        <li>Do you pre-wash and measure denim before patterns are cut?</li>
                                        <li>How is fringe or trim attached &mdash; bar-tacked or straight-stitched?</li>
                                        <li>What inspection happens between cutting, sewing and shipment, and who signs off at each stage?</li>
                                    </ol>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    None of this is guesswork a factory can shortcut. It is a sequence, and skipping a step &mdash; approving a proto sample instead of the pre-production sample, say &mdash; is how a brand discovers a problem only after a few hundred units have already shipped.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs you are making this mistake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>&bull; You approved the fit sample, not the pre-production sample, before bulk cutting started</li>
                                        <li>&bull; Nobody can tell you whether fringe is bar-tacked or straight-stitched</li>
                                        <li>&bull; Your denim was never pre-washed and measured before the patterns were cut</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Step 6 */}
                            <section id="costs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 6 — Calculate your clothing brand startup costs
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The major expenses sit in a short list: fabric and raw materials, sampling and stitching, manufacturing, packaging and labels, a website, and marketing. A simple way to see where the money goes is to cost one product end to end.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Costs founders forget to budget for</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>&bull; Ocean freight and import duties on top of the factory price, not folded into it</li>
                                        <li>&bull; A second or third sample round, since the first fit sample is rarely the one you approve</li>
                                        <li>&bull; Payment-processing and marketplace fees, which take a cut of every sale before it reaches your account</li>
                                        <li>&bull; Product photography, shot separately from any lookbook or campaign imagery</li>
                                        <li>&bull; A returns and damaged-stock buffer, since western wear&rsquo;s fit-sensitive fringe and denim pieces return more than a basic tee</li>
                                    </ul>
                                </div>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 760 180" role="img" aria-label="A worked example, not a quote: an illustrative per-piece cost breakdown for one western-wear top adding fabric $4.50, trims $0.60, stitching and labour $3.00, packaging and labels $0.70, totalling $8.80 before shipping and overhead." className="w-full h-auto min-w-[480px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="16" fontWeight="700" fill="#2D2A2E">One piece, costed end to end — a worked example</text>
                                        <text x="0" y="46" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666">Illustrative figures for one oversized western top, not a quote</text>
                                        {[
                                            { label: "Fabric", v: "$4.50" },
                                            { label: "Trims", v: "$0.60" },
                                            { label: "Stitching & labour", v: "$3.00" },
                                            { label: "Packaging & labels", v: "$0.70" },
                                        ].map((row, i) => (
                                            <g key={row.label}>
                                                <text x="0" y={82 + i * 26} fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#2D2A2E">{row.label}</text>
                                                <text x="700" y={82 + i * 26} fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E" textAnchor="end">{row.v}</text>
                                            </g>
                                        ))}
                                        <line x1="0" y1="186" x2="760" y2="186" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="178" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fontWeight="700" fill="#2D2A2E">Landed cost per piece</text>
                                        <text x="700" y="178" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fontWeight="700" fill="#8C7355" textAnchor="end">$8.80</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Your own numbers will move with fabric, trims and order size. The point of the exercise is pricing from a real total, not a guess.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Hold a realistic margin above that landed cost rather than pricing off instinct, and recheck the number once you have an actual quote from your manufacturer. Multiply the per-piece figure by the quantities you actually plan to produce across every style in the first collection, not the quantities you hope to sell &mdash; that total, plus the forgotten costs above, is the number to have in hand before you commit to a production run.
                                </p>
                            </section>

                            {/* H2 — Step 7 */}
                            <section id="brand-store" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 7 — Build your brand identity and online store
                                </h2>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-2 mb-3">Create a recognisable brand identity</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A brand identity for western wear earns its keep in photos as much as on a hangtag: a memorable name, a logo and colour palette that read clearly in a square product shot, consistent packaging and labels, and a brand story that explains why you are making this particular version of the look.
                                </p>

                                <div className="not-prose my-5 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Before you call the branding &ldquo;done&rdquo;</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>&bull; Run the name through the USPTO&rsquo;s trademark database and check the matching domain and social handles are actually available &mdash; a name you cannot register or claim online costs more to fix later than to check now.</li>
                                        <li>&bull; Lock a three-colour palette and test it against an actual product photo, not just a mood board. Western wear&rsquo;s warm denim and suede tones can clash with a palette chosen on a screen.</li>
                                        <li>&bull; Decide the unboxing sequence before you order packaging &mdash; mailer or box, tissue or none, one insert card with care instructions and your story rather than five, since every added piece is a per-unit cost that compounds across the whole run.</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-6 mb-3">Launch your online store</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Shopify or WooCommerce both handle a small catalogue well. What matters more than the platform is the basics: real product photography, a size guide specific to your patterns, detailed descriptions, and a checkout that works cleanly on a phone, since most of this category gets bought on one.
                                </p>
                            </section>

                            {/* H2 — Step 8 */}
                            <section id="marketing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Step 8 — Market your western fashion brand
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A moody, backlit silhouette of fringe trim swaying against a dark studio wall, hard directional light creating long shadow lines across a denim-toned backdrop. No people, no logos, no legible text."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-[#2D2A2E] mt-2 mb-3">Effective marketing strategies</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Marketing for this category leans visual before it leans anything else. Instagram Reels and short styling videos do more for a western-wear piece than a product description ever will, and a handful of well-chosen influencer collaborations can introduce a new label to an audience that already wants the look.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Pinterest works as a slower, longer-running source of the same traffic. SEO-friendly product pages and blog content build on top of that over time, paid ads on Meta and Google fill the gaps, and customer reviews with real photos do the final convincing.
                                </p>
                            </section>

                            {/* Teaching graphic — build order */}
                            <section className="scroll-mt-28 mt-4 mb-12">
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 500" role="img" aria-label="The 8-step western wear brand build order, each step completed before the next begins: one, choose your niche; two, research the market; three, select your fabrics; four, design your first collection; five, find a manufacturer; six, calculate your costs; seven, build your brand and online store; eight, market your brand." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">The 8-step western wear brand build order</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Each step is completed before the next one begins</text>

                                        {[
                                            "Choose your niche",
                                            "Research the market",
                                            "Select your fabrics",
                                            "Design your first collection",
                                            "Find a manufacturer",
                                            "Calculate your costs",
                                            "Build your brand & store",
                                            "Market your brand",
                                        ].map((label, i) => {
                                            const y = 72 + i * 50;
                                            const barWidth = 560;
                                            return (
                                                <g key={label}>
                                                    <rect x="48" y={y} width={barWidth} height="32" rx="6" fill={i % 2 === 0 ? "#CBB49A" : "#DCCDBA"} />
                                                    <circle cx="28" cy={y + 16} r="15" fill="#8C7355" />
                                                    <text x="28" y={y + 21} fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF" textAnchor="middle">{i + 1}</text>
                                                    <text x="64" y={y + 21} fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fontWeight="700" fill="#2D2A2E">{label}</text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Every row above is a section on this page, in the same order. Skipping ahead — designing before the fabric is chosen, or marketing before a sample exists — is the most common way this build order goes wrong.
                                    </figcaption>
                                </figure>
                            </section>

                            {/* H2 — Mistakes */}
                            <section id="mistakes" className="scroll-mt-28 mt-4 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Common mistakes to avoid when starting a western wear brand
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The mistakes that sink a western-wear launch are rarely about the aesthetic itself.
                                </p>
                                <div className="not-prose my-5 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Skipping market research before committing to a niche</li>
                                        <li>• Choosing fabric on price instead of performance</li>
                                        <li>• Ordering too much inventory before demand is proven</li>
                                        <li>• Picking a manufacturer purely on the lowest quote</li>
                                        <li>• Copying a competitor&rsquo;s range directly</li>
                                        <li>• Ignoring early customer feedback</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 — Key takeaways */}
                            <section id="key-takeaways" className="scroll-mt-28 mt-4 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Key takeaways
                                </h2>
                                <div className="not-prose my-5 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <ul className="space-y-2.5 text-[#2D2A2E] leading-snug">
                                        <li>• Western wear is selling on comfort and versatility, discovered on video first — not on costume appeal.</li>
                                        <li>• Pick a specific niche inside the category before anything else; a general &ldquo;western wear&rdquo; store competes with everyone.</li>
                                        <li>• Fabric decides fit and feel more than the pattern does — check shrinkage, dye-lot consistency and care before committing.</li>
                                        <li>• Keep the first collection small: five to eight styles built around one idea outperform twenty built around none.</li>
                                        <li>• A manufacturer who samples before bulk matters more than a low quote.</li>
                                        <li>• Price from a real landed cost per piece, not a guess — then hold a realistic margin above it.</li>
                                        <li>• Marketing for this category is visual-first: Reels, influencer collabs, Pinterest and real customer photos do the convincing.</li>
                                        <li>• Most launches fail on execution, not aesthetics — skipped research, cheap fabric, overordering and copying a competitor&rsquo;s range.</li>
                                    </ul>
                                </div>
                            </section>

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

                            {/* Closing */}
                            <section className="scroll-mt-28 mt-4 mb-4">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Build your western fashion brand with the right manufacturing partner
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    None of the steps above matter much without the fabric and the manufacturing behind them. A western-wear line stands or falls on whether the denim holds its shape, whether the fringe is sewn to survive a season, and whether the sample you approved is the piece that actually ships.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Which part of your first collection are you least sure about right now &mdash; the fabric, the fit, or the factory?
                                </p>
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
                                <Link href="/blogs/how-to-start-a-clothing-brand-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">How to Start a Clothing Brand in 2026</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The full step-by-step build order this post draws its structure from, for any category.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the guide <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Planning to launch your own western fashion brand?</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Start with the right manufacturing foundation. Connect with Krazy Kreators to explore textile and manufacturing opportunities and take your fashion ideas closer to reality.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/how-to-start-a-clothing-brand-2026",
                                            title: "How to Start a Clothing Brand in 2026",
                                            dek: "The full build order, from niche to first launch, for any category.",
                                            read: "15 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "The document that makes your sample match the bulk order.",
                                            read: "12 min read",
                                        },
                                        {
                                            href: "/blogs/mistakes-new-fashion-brand-founders-make",
                                            title: "7 Common Mistakes New Fashion Brand Founders Make",
                                            dek: "Real launch examples, and the warning signs to check against your plan.",
                                            read: "9 min read",
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

            {showStickyMobileCta && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#2D2A2E] text-white px-4 py-3 flex items-center justify-between shadow-2xl">
                    <button onClick={() => setContactOpen(true)} className="flex-1 text-left text-sm font-semibold">
                        Send us your first collection &mdash; we&rsquo;ll tell you what it takes <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
