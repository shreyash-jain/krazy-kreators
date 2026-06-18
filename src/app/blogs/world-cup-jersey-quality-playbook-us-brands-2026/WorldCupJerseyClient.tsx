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

const BLOG_ID = "world-cup-jersey-quality-playbook-us-brands-2026";

const HERO_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781769714/blog/wc_jersey_hero.jpg";
const STADIUM_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781769715/blog/wc_jersey_stadium.jpg";
const FABRIC_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781769716/blog/wc_jersey_fabric_macro.jpg";
const IDENTITY_IMAGE = "https://res.cloudinary.com/dprx4pret/image/upload/v1781769717/blog/wc_jersey_identity.jpg";

const TOC = [
    { id: "most-scrutinized", label: "The most-scrutinized shirt on earth" },
    { id: "quality-fibre", label: "Quality moved into the fibre" },
    { id: "tier-ladder", label: "One design, two SKUs" },
    { id: "material-signal", label: "Material as a public signal" },
    { id: "identity-woven", label: "Identity woven in" },
    { id: "launch-drop", label: "The launch is the product" },
    { id: "challenger-proof", label: "You don't need Nike's scale" },
    { id: "what-wed-do", label: "What we'd do in your shoes" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function WorldCupJerseyClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("most-scrutinized");
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

            {/* Hero */}
            <section className="relative h-[60vh] min-h-[560px] max-h-[720px] flex items-center justify-center overflow-hidden">
                <Image
                    src={HERO_IMAGE}
                    alt="A generic, unbranded footballer caught mid-action on a floodlit pitch at night — motion, dramatic stadium light, the plain kit and its construction catching the light. No team crest, no brand logo, no readable text or number, no identifiable real player."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">8 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">June 18, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The Jersey Standard:<br className="hidden sm:block" /> Product as Global Stage
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        Nike, adidas, and Puma spent four years making one shirt survive a 4K close-up in front of billions. Here&apos;s the playbook a founder can run at any scale.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Priya Anand <span className="text-[#666666] font-normal">· Culture Desk</span></p>
                            <p className="text-sm text-[#666666]">Writes on US fashion culture and brand strategy for Krazy Kreators · June 18, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• The 2026 kits prove technical apparel competes on <strong>fibre and construction, not print</strong> — cooling and graphics are built into the textile.</li>
                            <li>• All three giants run the same <strong>good/better/best ladder</strong>: one design, an authentic SKU and a replica SKU.</li>
                            <li>• <strong>Specificity is the trust signal</strong> — vague &quot;recycled&quot; claims now invite fact-checks.</li>
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
                                        <Link href="/blogs/tunnel-fit-economy-nba-us-menswear-dtc-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Culture</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The tunnel-fit economy: a hero piece that survives the close-up</p>
                                        </Link>
                                        <Link href="/blogs/the-drop-culture-model" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Model</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The drop-culture model — when it works, when it doesn&apos;t</p>
                                        </Link>
                                        <Link href="/blogs/made-in-india-american-luxury-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Made in India: the new American luxury</p>
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
                                Right now, one shirt is being judged in 4K by more people than any other object on earth. Not a phone, not a car — a football jersey.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                The 2026 World Cup is projected to draw <a href="https://www.sportspro.com/analysis/sponsorship-marketing/fifa-world-cup-2026-business-revenue-ticketing-broadcast-sponsorship/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">roughly six billion engagements</a> across broadcast and streaming. Every crest, seam, and fibre on the pitch sits under that lens. You don&apos;t have six billion viewers — but the discipline it takes to survive that scrutiny is the same discipline that builds a brand at any scale.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Nike, adidas, and Puma each spent four years engineering a single shirt to hold up to the close-up. Here&apos;s what they obsessed over — fibre, tiering, identity, the launch itself — and how each move ports down to a line you&apos;re building today.
                            </p>

                            {/* H2 1 */}
                            <section id="most-scrutinized" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The most-scrutinized garment on earth
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={STADIUM_IMAGE}
                                        alt="A generic footballer seen from behind on the pitch, the back of a plain unbranded jersey prominent, a vast blurred floodlit crowd filling the stands behind — one shirt under the gaze of a full stadium. No crest, no logo, no readable text or number, no identifiable real player."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The June 11 opener was already the most-watched World Cup match in US history — <a href="https://www.nbcuniversal.com/article/telemundo-and-peacock-kick-fifa-world-cup-2026tm-record-breaking-viewership-across-opening-weekend" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">about 13.4 million viewers on Telemundo and Peacock</a> for the Spanish-language broadcast alone. No consumer product gets that many eyes on its construction at once.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That is exactly why kit makers over-invest in detail. A puckered seam or a muddy crest doesn&apos;t just look cheap — it looks cheap to a stadium, a broadcast, and a hundred million phones running the replay. The garment has to be right at four feet and at four hundred.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    We&apos;ve made this argument before in a different arena: <Link href="/blogs/tunnel-fit-economy-nba-us-menswear-dtc-2026" className="text-[#CBB49A] underline hover:text-[#b7a078]">the NBA tunnel turned a hallway into a runway</Link>, where a hero piece either survives the close-up or files a return. The World Cup is the same lesson at the largest scale sport has.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;The jersey is the most over-engineered shirt on earth because it&apos;s the most-watched. Discipline, not budget, is what survives the close-up.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 2 */}
                            <section id="quality-fibre" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Quality moved into the fibre
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={FABRIC_IMAGE}
                                        alt="An extreme macro photograph of technical performance jersey fabric: open and closed mesh ventilation zones, a fine ripstop grid, the texturised knit lifting off the surface, raking light revealing the three-dimensional structure. Pure fabric, no logos, no text, no faces."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The three giants converged on the same answer this cycle: lighter weight, fewer seams, and ventilation engineered <em>into</em> the textile instead of printed on top. Nike&apos;s Aero-FIT kits claim <a href="https://about.nike.com/en/newsroom/collections/nike-football-unveils-2026-federation-kits-featuring-aero-fit-performance-cooling-technology" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">more than twice the airflow of legacy fabrics</a>, with the graphics knitted in rather than added on.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Puma went further into the weave. Its ULTRAWEAVE authentic jersey runs a <a href="https://www.just-style.com/news/puma-jersey-ultraweave-technology/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">72-gram woven ripstop chassis with the panel count cut from four-to-eight down to two</a> — fewer seams, fewer chafe points, less to fail under a zoom.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A few terms worth pinning down. <strong>Knit vs woven</strong> <em>(knit is looped yarn, the default for football shirts; woven interlaces threads — Puma&apos;s woven ripstop is the unusual, technical choice)</em>. <strong>Ripstop</strong> <em>(a weave with a reinforcing grid that stops small tears spreading)</em>. <strong>Laser-cut ventilation</strong> <em>(airflow holes cut or bonded into the fabric, no stitch holes or seam bulk)</em>. And <Link href="/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight" className="text-[#CBB49A] underline hover:text-[#b7a078]"><strong>GSM</strong> — grams per square metre, the measure of fabric weight</Link> that separates a featherweight on-pitch shirt from a heavier fan one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    The founder lesson is not &quot;buy Nike&apos;s machines.&quot; It&apos;s that performance now lives in the material choice and the construction — and those are the parts of the story worth telling, because they&apos;re the parts a camera can see.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Quality stopped being something you print on a shirt. It&apos;s now something you build into the yarn.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3 */}
                            <section id="tier-ladder" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    One design, two SKUs, a 45–70% gap
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Every federation kit ships in two versions off one design. The <strong>authentic</strong> <em>(the exact on-pitch, player-version shirt)</em> and the <strong>replica</strong> <em>(the relaxed-fit fan version)</em>. The <a href="https://www.soccer.com/guide/authentic-vs-replica-world-cup-2026-jerseys-guide" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">authentic runs around $150 to the replica&apos;s ~$100</a> — a consistent 45–70% premium.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    What you&apos;re paying for is <a href="https://www.nbcnews.com/select/shopping/best-fifa-world-cup-2026-jerseys-rcna349286" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">construction, not a different logo</a>. A <strong>heat-pressed crest</strong> <em>(applied flat with heat, not stitched)</em> instead of an embroidered badge; laser-cut vents instead of heavier double-knit; a slim athletic cut instead of a relaxed one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For a founder, this is the most copyable move in the whole tournament. One silhouette can serve a performance buyer and a price-sensitive one — if the gap between your tiers is real, and you can name it in a sentence.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your tier ladder is fake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• The only thing that changed between tiers is the trim or the hangtag.</li>
                                        <li>• The fit is identical across the &quot;good&quot; and &quot;better&quot; versions.</li>
                                        <li>• You can&apos;t name the construction difference in one sentence to a customer.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Tier-Ladder Spec Sheet</h4>
                                        <p className="text-[#4A484A] leading-snug">A one-page template that maps the five construction levers — seam/panel count, crest application, ventilation, fit, and weight — into a real good/better/best grid for your own product. PDF.</p>
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
                                            Send me the spec sheet
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Spec sheet on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="material-signal" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Material as a public signal — and where it gets dangerous
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Recycled content is now table stakes at the elite tier, not a budget compromise. Nike says its 2026 federation kits are its <a href="https://www.footyheadlines.com/2025/10/all-new-nike-aero-fit-kit-technology-revealed-debut-in-2026-world-cup.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">first elite apparel made from 100% textile waste</a>, via <strong>chemical recycling</strong> <em>(breaking old textiles down to molecular building blocks to spin new yarn — distinct from bottle-to-textile recycling, which critics call downcycling)</em>. Puma supplies 11 nations with replica kits <a href="https://www.sgieurope.com/products/pumas-biggest-world-cup-kit-roster-in-20-years/121460.article" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">made via RE:FIBRE from at least 95% recycled textile waste</a>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Notice what makes those claims land: a named figure. <Link href="/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester" className="text-[#CBB49A] underline hover:text-[#b7a078]">A specific recycled percentage</Link> reads as quality; &quot;made with recycled materials&quot; reads as a hedge.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;Specificity is the trust signal. A named recycled percentage reads as quality; &lsquo;made with recycled materials&rsquo; reads as a hedge.&rdquo;
                                </blockquote>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here&apos;s the part the marketing skips. A December 2025 study found recycled polyester <a href="https://theecologist.org/2025/dec/09/recycling-worsens-microplastics-problem" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">sheds roughly 55% more microplastic than virgin</a> in the wash. And adidas&apos;s decade-long Parley partnership <a href="https://www.sgieurope.com/adidas-ends-partnership-with-parley-for-the-oceans/108180.article" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">collapsed amid claims its flagship kits contained little to none of the advertised ocean plastic</a>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The giants can absorb that scrutiny. A smaller brand can&apos;t — the same fact-check that&apos;s a footnote for Nike is a brand-ending headline for a startup. So claim only what you can document.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your material claim is a liability</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• You say &quot;recycled&quot; or &quot;sustainable&quot; without a number or a certificate behind it.</li>
                                        <li>• You can&apos;t name the feedstock or trace the chain of custody.</li>
                                        <li>• You haven&apos;t asked what an NGO fact-check would actually find.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 5 */}
                            <section id="identity-woven" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Identity woven in, not printed on
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={IDENTITY_IMAGE}
                                        alt="A photographic close-up of a folded generic jersey where an abstract heritage-style motif — a weathered copper-to-patina gradient — is woven into the textile rather than printed on top. Evokes storytelling through material, with no identifiable crest, flag detail, or text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The strongest 2026 kits tell a story you can read in a glance. For the first time, U.S. Soccer commissioned <a href="https://www.footyheadlines.com/2026/03/bespoke-nike-2026-kit-fonts.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">fully bespoke &quot;Stars&quot; and &quot;Stripes&quot; typefaces</a> exclusively for the federation — owning a visual language rather than borrowing one.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Mexico&apos;s home kit carries an <a href="https://news.adidas.com/football/adidas-reveals-largest-ever-collection-of-home-kits-ahead-of-fifa-world-cup-2026-/s/a62a06a3-ea5a-4cb7-a585-0379b40ab18f" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Aztec Sun Stone motif used under license from a national museum</a>. France built a <a href="https://www.footyheadlines.com/2026/02/france-2026-lifestyle-jersey.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Statue of Liberty concept across two shirts</a>, home in original copper, away in oxidized patina. The motif is in the material, not slapped on as a print.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The founder move: tie one specific, ownable story to your colour, motif, and even type — and build it in. A borrowed aesthetic is a trend; an owned one is a brand.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    There&apos;s a hard limit, though. FIFA forced Haiti to <a href="https://www.espn.com/soccer/story/_/id/49029805/fifa-forces-haiti-remove-political-imagery-world-cup-jersey" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">strip a depiction of its 1803 independence battle</a> from its shirt days before kickoff. Heritage and licensing carry real legal edges — know where they are before you weave a story in.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="launch-drop" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The launch is the product
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The 2026 reveals were run as fashion drops, not catalogue updates. <a href="https://www.thefader.com/2026/06/05/2026-world-cup-collab-kits-nike-drake-slawn" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Nike&apos;s X2 capsule paired seven federations with seven collaborators</a>, Drake&apos;s NOCTA designed Canada&apos;s, and adidas marked Messi&apos;s 20-year anniversary with a Kith collaboration.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It converts. adidas&apos;s football-category sales <a href="https://www.adidas-group.com/en/media/press-releases/adidas-records-strong-start-to-the-year-in-the-first-quarter-of-2026" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">rose sharply in Q1 2026 on World Cup demand</a>, with roughly €250M of tournament product booked before kickoff (the ~49% football figure comes from earnings-call coverage; adidas officially reports its broader Performance line). Treating <Link href="/blogs/the-drop-culture-model" className="text-[#CBB49A] underline hover:text-[#b7a078]">a release as a timed, collaboration-driven event</Link> is the move.
                                </p>
                                <div className="bg-white border-2 border-[#CBB49A] p-5 rounded-2xl mb-6 shadow-sm">
                                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#CBB49A] mb-3">Signs your launch is just a restock</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>• There&apos;s no date, no window, no reason to show up on day one.</li>
                                        <li>• No collaborator, no story, no point of view beyond &quot;it&apos;s available now.&quot;</li>
                                        <li>• It&apos;s last season&apos;s drop with a new colourway and the same energy.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 7 */}
                            <section id="challenger-proof" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    You don&apos;t need Nike&apos;s scale to run this
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The obvious objection: this is a giant&apos;s game. The evidence says otherwise. Challenger brand Castore <a href="https://www.welltodoglobal.com/post/sportswear-brand-castore-raises-145m-hits-950m-valuation/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">scaled from £4.3M in 2019 to £250M+ by 2024 and a ~£950M valuation</a> — on a pure technical-quality narrative, not scale.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    And the biggest stage is increasingly open: challenger kit brands supply <a href="https://www.footyheadlines.com/2025/09/2026-world-cup-kit-battle.html" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">23% of teams at the 2026 World Cup, up from 18% in 2022</a>. The four moves — material as signal, a real tier ladder, an owned identity, a launch with intent — are scale-independent. The giants just run them at extreme stakes.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Lead with a credible quality story and a legible identity. That is what survives the close-up at any size.
                                </p>
                            </section>

                            {/* H2 8 — Closing */}
                            <section id="what-wed-do" className="scroll-mt-28 mt-12 mb-10">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What we&apos;d do in your shoes
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-3">
                                    We&apos;d pick one move to run this quarter — usually the tier ladder, because it monetizes a single design twice, or one material claim we could document to the letter. We&apos;d make the quality visible and specific, make the story ownable, and never claim what we couldn&apos;t stand behind under a zoom.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#2D2A2E] mb-6">
                                    The jersey works because every choice on it can survive a freeze-frame. So: which choice on your best piece would you be glad to see zoomed in on by the whole world — and which one are you quietly hoping nobody looks at too closely?
                                </p>
                            </section>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-16 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/tunnel-fit-economy-nba-us-menswear-dtc-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">The product the whole world watches</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The NBA-tunnel version of the same lesson — a hero piece that has to survive the close-up.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the playbook <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Engineer the quality into your product</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">We&apos;ll help you spec the fibre, build a real authentic-vs-replica tier ladder, and make a material claim you can actually stand behind.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/the-drop-culture-model",
                                            title: "The Drop-Culture Model — When It Works, When It Doesn't",
                                            dek: "Turning a release into a timed, scarcity-built event — the discipline behind it.",
                                            read: "7 min read",
                                        },
                                        {
                                            href: "/blogs/made-in-india-american-luxury-2026",
                                            title: "The 'Made in India' Trend Reshaping American Luxury",
                                            dek: "When craft becomes the positioning — quality as a brand's whole argument.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/where-american-fashion-going-2026-nyfw-mens",
                                            title: "Where US Fashion Is Heading After NYFW Men's",
                                            dek: "Craft over spectacle, menswear in front — the directional read for founders.",
                                            read: "7 min read",
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
                        Talk to us about your product quality <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
