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

const BLOG_ID = "us-apparel-import-tariffs-2026";

const HERO_IMAGE = "/blog/us-apparel-import-tariffs-2026-hero.jpg";
const SECTION1_IMAGE = "/blog/us-apparel-import-tariffs-2026-section1.jpg";
const MACRO_IMAGE = "/blog/us-apparel-import-tariffs-2026-macro.jpg";
const CLOSING_IMAGE = "/blog/us-apparel-import-tariffs-2026-closing.jpg";

const TOC = [
    { id: "where-they-stand", label: "Where US apparel tariffs stand" },
    { id: "quota-gap", label: "The quota that was due September 1" },
    { id: "landed-cost", label: "How duties hit your landed cost" },
    { id: "map-moved", label: "Why the map moved when rates didn't" },
    { id: "pricing-risk", label: "Pricing tariff risk in" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function TariffWatchClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("where-they-stand");
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
        showToast("Tariff worksheet on the way to your inbox.", "success");
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
                    alt="A container terminal an hour after sunset — long rows of stacked shipping containers receding into blue dusk under two silhouetted gantry cranes, the entry point where US apparel import tariffs are assessed on arriving garment freight. Wet asphalt holding sodium light. No markings legible, no logos."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Production &amp; Sourcing
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">6 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 7, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        US Tariff Watch 2026: How Apparel Import Duties<br className="hidden lg:block" />{" "}
                        <span className="block lg:inline text-white">Are Reshaping Manufacturing</span>
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The rates barely moved this summer. The duty-free lane everyone was promised still hasn&apos;t opened.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · September 7, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• The duty gap between the two main Asian sourcing tiers is <strong>2.5 percentage points</strong>. That is the whole spread.</li>
                            <li>• The <strong>duty-free quota</strong> for Bangladesh, Cambodia, Indonesia and Malaysia was expected on <strong>1 September</strong>. Nothing has been published — all four still pay the full 10%.</li>
                            <li>• Volumes moved far more than rates: <strong>China &minus;34%, India &minus;26%, Cambodia +10%</strong> in the year to July. The rate is not what is driving it.</li>
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
                                        <Link href="/blogs/section-122-tariff-replacement-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Manufacturing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Section 122 is gone — what actually replaced it</p>
                                        </Link>
                                        <Link href="/blogs/second-origin-costed-30-days" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sourcing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">A second origin, costed in 30 days</p>
                                        </Link>
                                        <Link href="/blogs/custom-clothing-manufacturing-cost" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Costing</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Manufacturing cost at every MOQ tier</p>
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
                                September 1 was supposed to open a duty-free lane. It came and went with nothing published.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                The Section 301 forced-labor action that took effect on 24 July directed USTR to build tariff-rate quotas <em>(a set volume allowed in at a lower rate, with the normal rate above it)</em> for Bangladesh, Cambodia, Indonesia and Malaysia — a quantity of apparel made from US cotton and fabric entering free of the new duty, for three years. Trade coverage pointed at 1 September. Nothing has appeared.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                That absence is the real story in <strong>US apparel tariffs 2026</strong>. The rates themselves barely moved this summer. What moved is how much weight founders are putting on a lane that has no legal text behind it yet.
                            </p>

                            {/* H2 1 */}
                            <section id="where-they-stand" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Where US apparel tariffs stand in September 2026
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="The hard geometric shadow of a gantry crane's steel latticework thrown diagonally across an empty concrete quay at noon — the structure through which clothing import duties in the USA are levied, reduced to a lattice of bars. Almost monochrome, cracked oil-stained concrete, no text or logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    On 24 July the flat 10% surcharge under Section 122 expired and a Section 301 forced-labor duty started in the same minute. It sorts countries by behaviour rather than by product: an economy that imposes and enforces a ban on forced-labour imports pays 10%, one that does not pays 12.5% (<a href="https://ustr.gov/about/policy-offices/press-office/press-releases/2026/july/ustr-takes-action-forced-labor-section-301-investigations" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">USTR</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    That stacks on the normal rate — a cotton knit T-shirt already carries 16.5% — so the all-in figure runs from 26.5% to 36.5% depending on where it was cut. The chart places every major origin.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three lanes pay nothing extra: qualifying CAFTA-DR apparel, USMCA-qualifying Mexican and Canadian goods, and EU, Japanese, Korean, Taiwanese and Swiss apparel, where the normal rate already exceeds the cap. Full mechanics in <Link href="/blogs/section-122-tariff-replacement-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">the piece we ran when the action landed</Link>.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Hold on to one number. <strong>2.5 points</strong> is the entire duty difference between the two Asian tiers.
                                </p>

                                {/* Teaching graphic 1 */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 430" role="img" aria-label="Bar chart of total US duty on a cotton knit T-shirt by origin as of September 2026: qualifying CAFTA-DR and USMCA apparel 0 percent; the EU, Japan, Korea, Taiwan and Switzerland 16.5 percent; India, Bangladesh, Cambodia, Indonesia, Pakistan and Sri Lanka 26.5 percent; Vietnam, Turkey, Thailand and the Philippines 29 percent; China 36.5 percent including its legacy List 4A duty." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">All-in US duty on a cotton knit T-shirt, by origin</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">16.5% normal rate plus the Section 301 forced-labor duty · effective 24 July 2026</text>

                                        {/* gridlines */}
                                        {[0, 10, 20, 30, 40].map((v) => (
                                            <g key={v}>
                                                <line x1={310 + v * 15.5} y1="72" x2={310 + v * 15.5} y2="378" stroke="#E0DCD5" strokeWidth="1" />
                                                <text x={310 + v * 15.5} y="398" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">{v}%</text>
                                            </g>
                                        ))}

                                        {/* rows */}
                                        <text x="298" y="104" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">CAFTA-DR · USMCA qualifying</text>
                                        <rect x="310" y="88" width="3" height="30" fill="#CBB49A" />
                                        <text x="322" y="108" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">0%</text>

                                        <text x="298" y="164" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">EU · Japan · Korea · Taiwan · Swiss</text>
                                        <rect x="310" y="148" width="256" height="30" fill="#DCCDBA" />
                                        <text x="576" y="168" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">16.5%</text>

                                        <text x="298" y="217" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">India · Bangladesh · Cambodia</text>
                                        <text x="298" y="233" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Indonesia · Pakistan · Sri Lanka</text>
                                        <rect x="310" y="208" width="411" height="30" fill="#CBB49A" />
                                        <text x="731" y="228" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">26.5%</text>

                                        <text x="298" y="284" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Vietnam · Turkey · Thailand · Philippines</text>
                                        <rect x="310" y="268" width="450" height="30" fill="#B99C79" />
                                        <text x="770" y="288" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">29%</text>

                                        <text x="298" y="344" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">China — incl. legacy List 4A</text>
                                        <rect x="310" y="328" width="566" height="30" fill="#8C7355" />
                                        <text x="886" y="348" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">36.5%</text>

                                        <line x1="310" y1="378" x2="930" y2="378" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="422" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators · rates per the USTR final action of 23 July 2026</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Garment manufacturing tariffs by sourcing country. The two Asian tiers sit 2.5 points apart; the real cliff is China, and the real prize is a qualifying CAFTA-DR or USMCA lane.
                                    </figcaption>
                                </figure>
                            </section>

                            {/* H2 2 */}
                            <section id="quota-gap" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The duty-free quota that was due September 1
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of the wound surface of a cone of raw natural cotton yarn, individual fibres catching diffused window light — the US-grown input a brand must buy to qualify for the promised tariff-rate quota. Warm ecru tones, shallow depth of field, no text or branding."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The memorandum behind the action carries a second instruction. &ldquo;As soon as the Trade Representative determines that it is feasible,&rdquo; USTR is to establish those quotas — three years initially, sized by how much US cotton and fabric each economy buys (<a href="https://ustr.gov/sites/default/files/files/Press/Releases/2026/FLIP%20301%20Investigation%20Final%20Action%20FRN%207-23-26%20FINAL.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Federal Register notice</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    &ldquo;As soon as feasible&rdquo; is not a date. USTR&apos;s signalling put it near 1 September, and CBP told filers the full 10% applies until then (<a href="https://www.kelleydrye.com/viewpoints/blogs/trade-and-manufacturing-monitor/ustr-announces-final-tariff-rates-exclusions-and-tariff-rate-quotas" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Kelley Drye</a>). As of this week USTR&apos;s notices page still shows nothing on it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    So the four countries named as beneficiaries are, right now, paying exactly what everyone else in their tier pays. A Spring &rsquo;27 cost sheet with a duty-free Cambodia line on it is holding a number with no legal text behind it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Worth conceding: when it lands it will be genuinely valuable, particularly for brands already running US-cotton programmes. The mistake is not watching for it. It is pricing it in early.
                                </p>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A rate you can look up is a cost. A rate you are expecting is a bet.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3 */}
                            <section id="landed-cost" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How clothing import duties hit your landed cost
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Duty is charged on the declared value of the goods, not on what you sell them for. Take a 5,000-piece run of a cotton tee at $14 FOB <em>(the price at the exporting port, before freight)</em> — $70,000 on the invoice.
                                </p>

                                {/* Teaching graphic 2 */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 360" role="img" aria-label="Bar chart of total duty payable on a 5,000-piece run of a cotton T-shirt at 14 dollars FOB, a 70,000 dollar invoice: qualifying CAFTA-DR or USMCA apparel 0 dollars; India or Bangladesh at 26.5 percent, 18,550 dollars or 3 dollars 71 a unit; Vietnam at 29 percent, 20,300 dollars or 4 dollars 06 a unit; China at 36.5 percent, 25,550 dollars or 5 dollars 11 a unit." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">Duty payable on one 5,000-piece run</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Cotton tee at $14 FOB · $70,000 invoiced · duty charged on declared value</text>

                                        {[0, 7000, 14000, 21000, 28000].map((v) => (
                                            <g key={v}>
                                                <line x1={310 + v * 0.02214} y1="72" x2={310 + v * 0.02214} y2="300" stroke="#E0DCD5" strokeWidth="1" />
                                                <text x={310 + v * 0.02214} y="320" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">${v / 1000}k</text>
                                            </g>
                                        ))}

                                        <text x="298" y="102" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">CAFTA-DR · USMCA qualifying</text>
                                        <rect x="310" y="86" width="3" height="28" fill="#CBB49A" />
                                        <text x="322" y="105" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$0</text>

                                        <text x="298" y="158" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">India · Bangladesh — 26.5%</text>
                                        <rect x="310" y="142" width="411" height="28" fill="#CBB49A" />
                                        <text x="731" y="161" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$18,550 · $3.71/unit</text>

                                        <text x="298" y="214" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">Vietnam — 29%</text>
                                        <rect x="310" y="198" width="450" height="28" fill="#B99C79" />
                                        <text x="770" y="217" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">$20,300 · $4.06/unit</text>

                                        <text x="298" y="270" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#2D2A2E" textAnchor="end">China — 36.5%</text>
                                        <rect x="310" y="254" width="566" height="28" fill="#8C7355" />
                                        <text x="700" y="273" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF">$25,550 · $5.11/unit</text>

                                        <line x1="310" y1="300" x2="930" y2="300" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="348" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators · worked at the rates in force from 24 July 2026</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Apparel sourcing costs on a single style. India to Vietnam is $1,750 across the run; India to China is $7,000.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The gap between the two big Asian tiers is <strong>$1,750</strong> on that run. Real money, and worth costing properly. But it is not the number that should decide where a collection is made — moving an origin to capture it usually costs more than that in sampling, fit correction and a first-run yield hit.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    China is a different argument. $7,000 on one style at one size run is structural, not a rounding error.
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
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Two-Lane Tariff Worksheet</h4>
                                        <p className="text-[#4A484A] leading-snug">One page: every apparel-sourcing country in its 10% / 12.5% / exempt lane as of September, the normal duty rates for the common garment codes, and a second column to re-cost each style at the tier above it. PDF.</p>
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
                                            Send me the worksheet
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Worksheet on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 4 */}
                            <section id="map-moved" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Why the sourcing map moved when the rates didn&apos;t
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Here is what makes the rate a poor predictor. US apparel imports for January to July 2026 came to $41.83 billion, down 8.65% on the year (<a href="https://www.thedailystar.net/business/news/bangladesh-overtakes-china-again-apparel-exports-us-4265426" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">OTEXA data via The Daily Star</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Underneath it: China down 34.2% to $4.55bn. India down 25.8% to $2.45bn. Bangladesh down 6.5% to $4.66bn, enough to pass China again. Vietnam roughly flat at &minus;1.03% and still the largest supplier. Cambodia up 10.5%, Indonesia up 2.8%.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Read India and Vietnam next to each other. India sits in the cheaper 10% lane and lost a quarter of its US volume. Vietnam pays 2.5 points more and barely moved.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Duty is not what is driving this. Capacity, lead-time reliability, whether a factory has passed a US compliance audit, and a country&apos;s wider trade position all outweigh 2.5 points. Brands are spreading production across origins because they do not want to re-tool twice in one year — not because one column is cheaper. Our <Link href="/blogs/second-origin-costed-30-days" className="underline text-[#CBB49A] hover:text-[#b7a078]">second-origin costing piece</Link> walks the arithmetic of adding one properly.
                                </p>
                            </section>

                            {/* H2 5 */}
                            <section id="pricing-risk" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Pricing tariff risk in before the Spring &rsquo;27 buys
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A plain unbranded heavyweight cotton crew-neck T-shirt on a matte black tailor's form, lit by a single hard light from the left so the ribbed collar and shoulder seam carve out shadow against a near-black background — the single style whose duty lane decides the margin. No logos or lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Model the rate as a range, not a figure. Cost every style at its current lane, then re-cost it at the tier above. If the higher number still clears your margin floor, the tariff is not your risk; if it does not, you have a pricing problem the tariff merely exposed.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Three things to watch through Q4: whether USTR publishes the quota rules and how volumes get allocated; whether any 12.5% economy passes an enforcement law and drops a lane, as six did between the June proposal and the July final notice; and whether your CAFTA-DR or USMCA claim actually holds under the yarn-forward rule <em>(the yarn and the fabric both have to originate inside the bloc)</em>. That last one catches people — shipping from Mexico is not the same as qualifying under USMCA, and the difference is the whole exemption.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    None of this justifies moving production by itself; <Link href="/blogs/sourcing-clothing-manufacturing-from-india-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">India&apos;s year</Link> shows how little the rate explains. It justifies knowing which lane every style sits in. If you are re-costing for Spring &rsquo;27, which style would you check first?
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-7">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What are the US apparel import tariffs in 2026?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Since 24 July a Section 301 forced-labor duty of 10% or 12.5% sits on top of the normal rate, about 16.5% on a cotton knit tee. That puts clothing import duties from India, Bangladesh, Cambodia, Indonesia, Pakistan and Sri Lanka at roughly 26.5% all-in, Vietnam, Turkey, Thailand and the Philippines at 29%, and China at 36.5%. Qualifying CAFTA-DR and USMCA apparel pays no additional duty.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Has the duty-free quota for Bangladesh and Cambodia started?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">No. USTR was directed to establish three-year tariff-rate quotas for Bangladesh, Cambodia, Indonesia and Malaysia, letting a volume of apparel made with US cotton and fabric enter free of the duty. It was expected around 1 September 2026 and the allocation rules have not been published. Until they are, all four pay the full 10% and no brand can claim the lane.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">How much do clothing import duties add to a production run?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Duty is charged on the declared FOB value, not the retail price. On 5,000 tees at $14 FOB — $70,000 invoiced — 26.5% from India or Bangladesh costs $18,550, or $3.71 a unit. Vietnam at 29% costs $20,300; China at 36.5% costs $25,550. The apparel sourcing cost difference between the two main Asian tiers is $1,750 on that run.</p>
                                    </div>
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
                                <Link href="/blogs/section-122-tariff-replacement-2026" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Section 122 Is Gone — Here&apos;s What Actually Replaced It</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The mechanics under this post: which countries switched lanes at the last minute, and the three exemptions worth checking against your own styles.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the breakdown <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Send us three things and we&rsquo;ll compare the lanes</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Your style (a tech pack or a photo is enough), your current FOB, and your target market. A Krazy Kreators production lead sends back the same garment costed across sourcing options — duty lane by duty lane — so you can see the tariff impact before you commit a run.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Send your style, FOB and market <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/second-origin-costed-30-days",
                                            title: "A Second Origin, Costed in 30 Days",
                                            dek: "What diversifying actually costs before it saves you anything.",
                                            read: "9 min read",
                                        },
                                        {
                                            href: "/blogs/sourcing-clothing-manufacturing-from-india-2026",
                                            title: "Beyond China: Sourcing From India in 2026",
                                            dek: "The origin in the cheap lane that still lost a quarter of its volume.",
                                            read: "10 min read",
                                        },
                                        {
                                            href: "/blogs/custom-clothing-manufacturing-cost",
                                            title: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
                                            dek: "The unit cost sitting underneath the duty line.",
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
                        Send your style + FOB + market &mdash; we&rsquo;ll compare the lanes <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
