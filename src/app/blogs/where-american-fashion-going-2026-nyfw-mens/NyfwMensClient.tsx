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

const BLOG_ID = "where-american-fashion-going-2026-nyfw-mens";

const HERO_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781067595/blog/nyfw_mens_2026_hero.jpg";
const ATELIER_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781067596/blog/nyfw_mens_2026_atelier.jpg";
const MENSWEAR_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781067597/blog/nyfw_mens_2026_menswear.jpg";
const SIGNALS_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781067597/blog/nyfw_mens_2026_signals.jpg";

const TOC = [
    { id: "craft-beat-spectacle", label: "Craft beat spectacle" },
    { id: "menswear-energy", label: "Why menswear's the energy" },
    { id: "four-signals", label: "Four signals → four moves" },
    { id: "fashion-fund-signal", label: "The Fashion Fund signal" },
    { id: "when-spectacle-wins", label: "When spectacle still wins" },
    { id: "what-wed-do", label: "What we'd do this season" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function NyfwMensClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("craft-beat-spectacle");
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
        showToast("One-pager on the way to your inbox.", "success");
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
                    alt="An editorial wide view from the photo pit at a NYFW Men's runway show — diffused warm light spilling onto a polished show floor, a single model silhouetted mid-walk, no recognizable faces, the construction of a structured tailored coat catching the light"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Strategy
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">7 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">June 10, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        NYFW Men&apos;s Just Signaled<br className="hidden sm:block" /> Where US Fashion&apos;s Headed
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Craft over spectacle, menswear on the rise — and what both mean for your next drop.
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
                            <p className="text-sm text-[#666666]">Published June 10, 2026</p>
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• The 2026 throughline across the year&apos;s fashion moments: <strong>craft over spectacle</strong>.</li>
                            <li>• <strong>Menswear</strong> is the category pulling the signal forward.</li>
                            <li>• For founders: <strong>fewer SKUs, sharper point of view, deeper construction story</strong>.</li>
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
                                        <Link href="/blogs/made-in-india-american-luxury-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Made in India: the new American luxury</p>
                                        </Link>
                                        <Link href="/blogs/the-drop-culture-model" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Model</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The drop-culture model — when it works, when it doesn&apos;t</p>
                                        </Link>
                                        <Link href="/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Category</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Streetwear 2.0: heavy GSM, puff prints, acid washes</p>
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
                                NYFW Men&apos;s just wrapped. The signal worth catching isn&apos;t any single look. It&apos;s the throughline you can now draw across the year&apos;s major fashion moments — and the direction it points US founders toward.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                Craft is winning over spectacle. Menswear is the category pulling the signal forward. The brands deciding their 2027 lines right now have one moment to read this clearly.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                What follows is the directional read — the throughline from the spring shows, the Fashion Fund roster as a confirming signal, and four founder moves the data supports.
                            </p>

                            {/* H2 1: Craft beat spectacle */}
                            <section id="craft-beat-spectacle" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What June showed: craft beat spectacle
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={ATELIER_IMAGE}
                                        alt="A medium-close documentary photograph of hands at work in a tailoring atelier — visible stitching, basted lapel construction, chalked seam lines, single shaft of natural light from a tall window. No faces in frame."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    <Link href="/blogs/what-2026-met-gala-taught-us-fashion-founders-craft" className="text-[#CBB49A] underline hover:text-[#b7a078]">The 2026 Met Gala</Link> made the most-shared garment of the year a piece with <strong>761 hours of visible hand-work</strong> behind it. Cannes pushed that further — the carpet&apos;s breakout looks averaged over <strong>22,160 hours</strong> of atelier time across the headline gowns.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    NYFW Men&apos;s this week was the third data point. The most-discussed shows weren&apos;t the ones with the biggest production budgets. They were the ones whose construction read from across the room — hand-finished lapels, visible basting, chosen-not-default fabrics.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    <Link href="/blogs/quiet-luxury-dead-whats-next-us-brands-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">Quiet luxury as an aesthetic is done</Link>. What replaced it is the same instinct made specific: a brand-defining construction story told on the garment itself.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The construction reads from across the room. That&apos;s the brief.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2: Menswear energy */}
                            <section id="menswear-energy" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why menswear is where the energy is in 2026
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MENSWEAR_IMAGE}
                                        alt="An editorial profile silhouette of a model from chest-down wearing a structured wool coat, side light raking across textured fabric, the figure's face out of frame, the photograph composed around the garment's shoulder line and lapel construction"
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The category isn&apos;t surprising anyone who&apos;s been paying attention. <Link href="/blogs/donda-core-resurgence-us-founders-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">DONDA-core&apos;s 2026 resurgence</Link> was the public version of a quieter shift: US menswear has been compounding cultural attention for three seasons, and the buy-in finally caught up with the press.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The NYFW Men&apos;s slot itself was treated as the more interesting calendar this year — not the September main cal. <strong>Pre-fall</strong> <em>(a smaller, often craft-led collection delivered between the main fall season and resort — designers use it to make a sharper point of view than the larger fall show allows)</em> reads as the season editors most-anticipated.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Translation for founders: if your category has a credible menswear cut, lead the next launch from there. Even brands that have historically run women&apos;s-first are testing the inverse.
                                </p>
                            </section>

                            {/* H2 3: Four signals */}
                            <section id="four-signals" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Four signals from the shows → four founder moves
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative h-64 lg:h-[360px] mb-7 max-w-4xl mx-auto">
                                    <Image
                                        src={SIGNALS_IMAGE}
                                        alt="A clean editorial two-column infographic on a cream paper background, four signal-and-move pairs mapped left-to-right with arrows: construction-visible-from-across-the-room → construction-as-brand-promise, named-origin craftsmanship → defendable sourcing story, fewer-better point-of-view pieces → cut the SKU count, menswear-first storytelling → lead with the men's cut"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 56rem"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-8">
                                    Four patterns reading clearly off this June, and the founder move each one calls for. Use the &quot;Signs you&apos;re missing this signal&quot; boxes below as a check on the next line plan.
                                </p>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">1. Construction visible from across the room → make construction the brand promise</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    The garments getting attention are the ones whose making is legible at four feet away — hand-finished lapels, visible basting, choose-not-default seams. The construction isn&apos;t hidden inside the garment; it&apos;s the point.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The founder move: pick the one construction detail you can defend on every SKU. Make it your brand promise, not a feature of the lookbook.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re missing this signal</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your line story still leads with print or colour, not construction.</li>
                                        <li>• Your tech pack defaults to factory-standard seams.</li>
                                        <li>• You can&apos;t name the one detail that runs across every SKU in the line.</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">2. Named-origin craftsmanship → lock a single sourcing story you can defend</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    Editorial language across the June moments leaned on specific origins — not country-of-origin labels, but named mills, named ateliers, named techniques. Buyers are buying provenance, not just product.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The founder move: pick the one sourcing story you&apos;d defend in a print interview. <Link href="/blogs/made-in-india-american-luxury-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">Named-origin craft sourcing</Link> from one place will outperform generic premium positioning every time.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re missing this signal</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your sourcing is a list of factories, not a story.</li>
                                        <li>• Your product page leads with material, not maker.</li>
                                        <li>• Your team can&apos;t answer &quot;why this mill, why this workshop?&quot; without checking notes.</li>
                                    </ul>
                                </div>

                                {/* Mid-article soft CTA */}
                                <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                    <div className="flex items-start gap-4 mb-5">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                            <Download className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                            <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The 2026 US Fashion Direction</h4>
                                            <p className="text-[#4A484A] leading-snug">A one-page read on the year&apos;s major fashion moments, the throughline across them, and four moves the data supports for US founders. PDF.</p>
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
                                                Send me the PDF
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </form>
                                    ) : (
                                        <p className="text-[#2D2A2E] font-medium">One-pager on the way. Check your inbox.</p>
                                    )}
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">3. Fewer, better, point-of-view pieces → cut the SKU count</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    The shows that read sharpest weren&apos;t the widest. They were the tightest — a <strong>capsule</strong> <em>(a tightly-scoped set of pieces designed around a single point of view, usually 8–15 SKUs)</em> instead of a sprawling <strong>ready-to-wear</strong> <em>(the main commercial line — not couture, not made-to-measure)</em> run.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The founder move: pull last season&apos;s sell-through, cut the bottom third by SKU count, and reinvest the open-to-buy into deeper construction on the remaining pieces.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-8 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re missing this signal</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your line plan grew by SKU count this season instead of shrinking.</li>
                                        <li>• Your bottom-third sell-through hasn&apos;t been reviewed before the next assortment.</li>
                                        <li>• &quot;What does this line stand for in one sentence?&quot; gets a list of features, not a point of view.</li>
                                    </ul>
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-[#2D2A2E] mb-3">4. Menswear-first storytelling → lead with the men&apos;s cut</h3>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-3">
                                    The brands getting picked up by the better stockists this season led with menswear or unisex-tailored — not the women&apos;s-first calendar most US brands default to. The cultural attention is where the editorial attention is.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The founder move: if your category has a credible men&apos;s cut, lead the next drop from there. If it doesn&apos;t, build one as a six-SKU capsule and learn what the men&apos;s editorial cycle does for the rest of the line.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs you&apos;re missing this signal</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• Your men&apos;s assortment is sized-up women&apos;s rather than designed-for-men.</li>
                                        <li>• Your editorial outreach is women&apos;s-only by default.</li>
                                        <li>• The team can&apos;t name three men&apos;s editors who&apos;d cover this brand.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 4: Fashion Fund signal */}
                            <section id="fashion-fund-signal" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The Fashion Fund roster as a directional signal
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The runway shows are one read. The <a href="https://cfda.com/programs/cfdavoguefashionfund" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">CFDA/Vogue Fashion Fund</a> roster is the quieter, sharper one — a small group of designers the industry has decided are worth betting on for the next twelve months.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This year&apos;s cycle: <strong>10 finalists</strong>, winner announced <strong>October 20</strong>, <strong>$300,000</strong> grant plus a year of structured mentorship. The selection criteria are public and the cohort is published — you don&apos;t need to predict the winner to read the signal in the shortlist itself.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Read the cohort this week. What you&apos;ll see lines up with the throughline: craft-coded brands, point-of-view-led assortments, and a meaningful menswear weighting. The Fund isn&apos;t telling you what&apos;s next — it&apos;s confirming where the industry has already pointed its money.
                                </p>
                            </section>

                            {/* H2 5: Counterexample */}
                            <section id="when-spectacle-wins" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    When spectacle still wins
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The craft thesis isn&apos;t universal. Hype-driven streetwear, logo-led drops, and performance categories still move units on theatre — the shoe brand whose entire economy is the queue, the streetwear label whose Instagram drops sell out in ninety seconds.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Those brands aren&apos;t reading the same signal because they aren&apos;t playing the same game. Their economy is FOMO, not provenance. <Link href="/blogs/the-drop-culture-model" className="text-[#CBB49A] underline hover:text-[#b7a078]">The drop-culture model</Link> is its own discipline with its own metrics.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    If your brand is positioned in that lane, optimise for spectacle. If it&apos;s anywhere else, the June signal is the one to act on.
                                </p>
                            </section>

                            {/* H2 6: Closing */}
                            <section id="what-wed-do" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&apos;d do in your shoes this season
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Open the line plan this week. Cut the bottom-third sell-through SKUs and reinvest the open-to-buy into one construction detail you can defend on every remaining piece.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    Name the one sourcing story you&apos;d give a print editor in a single sentence. If you can&apos;t, that&apos;s the missing piece — not the assortment.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E]">
                                    Then ask whether the next drop should lead from the men&apos;s cut. For more brands than will admit it, the answer in 2026 is yes.
                                </p>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/what-2026-met-gala-taught-us-fashion-founders-craft" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The 2026 Met Gala craft lesson</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">What 761 hours of hand-work taught US founders about brand promise.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the lesson <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Build a point-of-view line</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">We&apos;ll help you cut the SKU count, lock the construction story, and find the named-origin sourcing to defend it.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
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
                                            dek: "761 hours of hand-work behind a single look — and the founder lesson.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/quiet-luxury-dead-whats-next-us-brands-2026",
                                            title: "The Quiet Luxury Aesthetic Is Dead — What's Next",
                                            dek: "Aesthetics die. Perspectives don't. Here's what replaces it.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/donda-core-resurgence-us-founders-2026",
                                            title: "What US Founders Should Steal from the DONDA-Core Resurgence",
                                            dek: "Cultural anchor, limited drop, product as artifact — the menswear playbook.",
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
                        Talk to us about your next line <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
