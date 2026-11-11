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

const BLOG_ID = "how-to-build-a-premium-clothing-brand";

const HERO_IMAGE = "/blog/how-to-build-a-premium-clothing-brand-hero.jpg";
const SECTION1_IMAGE = "/blog/how-to-build-a-premium-clothing-brand-section1.jpg";
const GARMENT_IMAGE = "/blog/how-to-build-a-premium-clothing-brand-garment.jpg";
const CLOSING_IMAGE = "/blog/how-to-build-a-premium-clothing-brand-closing.jpg";

const TOC = [
    { id: "meaning", label: "What quiet luxury means" },
    { id: "fabric", label: "Choosing premium fabrics" },
    { id: "fit-details", label: "Fit, construction, details" },
    { id: "sourcing", label: "Sourcing and sampling" },
    { id: "pricing-marketing", label: "Pricing and marketing" },
    { id: "partner", label: "A manufacturing partner" },
    { id: "faqs", label: "FAQs" },
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function QuietLuxuryClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("meaning");
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
                    alt="A convention-centre exhibition hall at dawn on set-up day, seen down a long empty aisle — rows of bare white booth frames and unfilled garment rails receding into soft grey light from the roof glazing, the floor where wholesale buyers meet clothing brands. No signage legible, no logos."
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Culture &amp; Brand
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">5 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">November 11, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        Quiet Luxury Explained:<br className="hidden lg:block" />{" "}
                        <span className="block lg:inline text-white">How to Build a Premium Clothing Brand Without Loud Logos</span>
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        A garment with no logo has to be believed on its fabric, its fit and its finish.
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
                            <p className="text-sm font-semibold text-[#2D2A2E]">Krazy Kreators Team <span className="text-[#666666] font-normal">· Culture &amp; Brand</span></p>
                            <p className="text-sm text-[#666666]">Covers brand positioning and product quality for US clothing founders · November 11, 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• A no-logo brand can scale: Brunello Cucinelli closed 2025 at <strong>&euro;1.41 billion, up 10.1%</strong>. A new label has to earn that trust in the cloth.</li>
                            <li>• With no logo, the garment is the argument: <strong>fibre, weight, fit</strong> and five places customers check by hand.</li>
                            <li>• Most of the work is in sampling: <strong>five approvals</strong> before bulk, and the cheapest quote tends to skip one.</li>
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
                                        <Link href="/blogs/quiet-luxury-dead-whats-next-us-brands-2026" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Strategy</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">The Quiet Luxury Aesthetic Is Dead</p>
                                        </Link>
                                        <Link href="/blogs/grading-vs-pattern-making-perfect-fit" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Fit</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Grading vs. pattern making</p>
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
                                Brunello Cucinelli sells cashmere with no logo on the front and closed 2025 at <a href="https://www.emarketstorage.it/sites/default/files/comunicati/2026-01/20260112_176299.pdf" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">&euro;1.41 billion in revenue, up 10.1%</a>. The Americas were its largest region, at &euro;520.5 million. A brand that never prints its name across the chest is clearly not a niche.
                            </p>

                            <p className="mb-4 text-base lg:text-lg leading-snug">
                                A new label cannot copy that, though. Cucinelli has decades of reputation sitting behind every plain sweater. A founder starting out has the opposite problem: no reputation, and nothing on the garment to borrow one from. The work moves into the cloth, the cut and the sewing.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                That is what this post is about: how to build a premium clothing brand when the garment has to make the argument on its own.
                            </p>

                            {/* H2 1 */}
                            <section id="meaning" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Quiet luxury fashion: what it means, and why it still sells
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="Extreme close-up of a fine-gauge oatmeal merino knit, individual stitch loops and a ribbed cuff edge in raking side light, the surface a customer notices only by touching it. No labels, no logos, no lettering."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Quiet luxury means clothes that tell people who know what they are looking at that the garment is good, and tell everyone else nothing. No monogram, a plain label sewn inside, a fabric that hangs well enough that you only notice it when you touch it.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    It is not the same as minimalism, which is a look. A plain white tee from a fast-fashion rack is minimalist. Traditional luxury sells a name, and the logo is the receipt. Quiet luxury sells the object itself, and the proof is in the fit, the weight and the stitching, which a screen print cannot fake.
                                </p>

                                {/* Graphic 1 — comparison */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-lg font-bold text-[#2D2A2E] mb-1">Where a garment shows its value</p>
                                    <p className="text-sm text-[#666666] mb-4">Logo-led fashion against quiet luxury, row by row</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[560px] text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="w-[26%] py-2 pr-3 text-xs font-bold uppercase tracking-[0.14em] text-[#999999]"></th>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-[#666666] bg-[#EDE9E2] rounded-tl-lg">Logo-led</th>
                                                    <th className="py-2 px-3 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#8C7355] rounded-tr-lg">Quiet luxury</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-[#2D2A2E] leading-snug">
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">Where the value shows</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA]">On the chest, from across the street</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9]">In the cloth, seams and hang, up close</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">What the customer checks</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA]">Whether the brand is the real one</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9]">Weight, hand-feel, fit, finishing</td>
                                                </tr>
                                                <tr className="border-t border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">What breaks it</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA]">A fake, or a logo that goes out of fashion</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9]">Pilling, twisting seams, a size run that fits unevenly</td>
                                                </tr>
                                                <tr className="border-t border-b border-gray-200">
                                                    <td className="py-3 pr-3 font-semibold">Where production effort goes</td>
                                                    <td className="py-3 px-3 bg-[#F3F0EA] rounded-bl-lg">Print, placement, brand assets</td>
                                                    <td className="py-3 px-3 bg-[#EFE6D9] rounded-br-lg">Fabric, extra sampling rounds, finishing</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Most real brands sit between the two columns. The point is which column your customer will check first.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Is the aesthetic finished? We argued that it has been picked clean in <Link href="/blogs/quiet-luxury-dead-whats-next-us-brands-2026" className="underline text-[#CBB49A] hover:text-[#b7a078]">The Quiet Luxury Aesthetic Is Dead</Link>, because mass retail copied the palette. What it could not copy is the cloth. That gap is where a small brand has room.
                                </p>
                            </section>

                            {/* H2 2 */}
                            <section id="fabric" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Choosing premium fabrics for a quiet luxury clothing brand
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Decide who you are selling to before you pick a single swatch of anything. Someone buying one coat to wear for ten years wants wool that keeps its shape. Someone buying a summer shirt wants linen and is happy for it to crease. Fabric follows the customer, not the other way round.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Five fibres come up in almost every brief like this, and each has a weak spot. Organic cotton is only as good as its fibre length, and the organic label says nothing about that. Linen creases, which is fine if you design for it. Tencel, the trade name for lyocell <em>(a soft fibre made from wood pulp)</em>, drapes beautifully but can show wear at the seams. Merino is warm and fine but costs more and needs careful care instructions. Viscose can look rich and then lose its shape after a few washes if the grade is poor.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Weight is the easiest number to ask for. GSM <em>(grams per square metre, how heavy the cloth is)</em> tells you roughly how a fabric will hang.
                                </p>

                                {/* Graphic 2 — GSM ladder */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 330" role="img" aria-label="A scale of T-shirt jersey fabric weights in grams per square metre. Light jersey is roughly 120 to 160 GSM. Premium ringspun tees are roughly 180 to 220 GSM. Heavyweight tees are roughly 220 to 330 GSM. Makers label these ranges differently." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">Fabric weight, read as a range and not a promise</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">T-shirt jersey weight bands in GSM, as commonly quoted by tee makers</text>

                                        {[100, 140, 180, 220, 260, 300, 340].map((v) => (
                                            <g key={v}>
                                                <line x1={60 + (v - 100) * 3.4} y1="72" x2={60 + (v - 100) * 3.4} y2="262" stroke="#E0DCD5" strokeWidth="1" />
                                                <text x={60 + (v - 100) * 3.4} y="282" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">{v}</text>
                                            </g>
                                        ))}
                                        <text x="468" y="304" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999" textAnchor="middle">GSM</text>

                                        <rect x="128" y="86" width="136" height="36" fill="#DCCDBA" />
                                        <text x="274" y="108" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">Light jersey &middot; about 120&ndash;160</text>

                                        <rect x="332" y="144" width="136" height="36" fill="#CBB49A" />
                                        <text x="478" y="166" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">Premium ringspun tee &middot; about 180&ndash;220</text>

                                        <rect x="468" y="202" width="370" height="36" fill="#8C7355" />
                                        <text x="478" y="224" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF">Heavyweight tee &middot; about 220&ndash;330</text>

                                        <line x1="60" y1="262" x2="900" y2="262" stroke="#B0AAA2" strokeWidth="1" />
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        Ranges as quoted by <a href="https://www.tapstitch.com/blog/post/how-much-does-a-shirt-weigh" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Tapstitch</a>; other makers draw the lines elsewhere, and 220 sits in both of the top two bands. Weight alone proves nothing: a badly knitted 220 GSM jersey still pills. Ask for the fibre, the yarn and the knit as well as the number.
                                    </figcaption>
                                </figure>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A customer who cannot see your name will look for your standards instead.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 3 */}
                            <section id="fit-details" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Fit, construction and the details that replace a logo
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={GARMENT_IMAGE}
                                        alt="A single pair of stone-coloured wool trousers hung by the waistband on a plain wooden hanger against a bare plaster wall, a crisp front pleat and clean hem in hard window light. No labels, no lettering, no logos."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Without print to look at, people look at the garment. They notice whether the shoulder seam sits where the shoulder ends, whether the hem hangs level, whether the buttons are sewn on firmly. Choose a silhouette you can stand behind for several seasons and spend your fit-testing on that rather than on a new shape every drop.
                                </p>

                                {/* Graphic 3 — anatomy */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 470" role="img" aria-label="Diagram of a plain overshirt with five numbered places a customer judges quality when there is no logo: one, the collar and neckline holding its shape; two, a shoulder seam that sits on the shoulder; three, the placket and button stitching; four, cuffs and hem that sit flat and even; five, the inside seams and a soft woven label." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">Five places a no-logo garment gets read</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">What the customer checks with their eyes and hands</text>

                                        <path d="M450 92 L370 112 L292 312 L334 328 L386 212 L386 422 L574 422 L574 212 L626 328 L668 312 L590 112 L510 92 L480 122 Z" fill="#E7DDCD" stroke="#8C7355" strokeWidth="2" strokeLinejoin="round" />
                                        <line x1="480" y1="122" x2="480" y2="422" stroke="#8C7355" strokeWidth="1.5" />
                                        {[160, 224, 288, 352].map((y) => (
                                            <circle key={y} cx="494" cy={y} r="4" fill="#FFFFFF" stroke="#8C7355" strokeWidth="1.5" />
                                        ))}
                                        <line x1="386" y1="196" x2="574" y2="196" stroke="#B99C79" strokeWidth="1" strokeDasharray="3 3" />

                                        {/* callouts left */}
                                        <line x1="452" y1="98" x2="250" y2="98" stroke="#8C7355" strokeWidth="1" />
                                        <circle cx="236" cy="98" r="13" fill="#8C7355" />
                                        <text x="236" y="103" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF" textAnchor="middle">1</text>
                                        <text x="216" y="94" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E" textAnchor="end">Collar and neckline</text>
                                        <text x="216" y="111" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666" textAnchor="end">holds its shape unbuttoned</text>

                                        <line x1="382" y1="118" x2="250" y2="168" stroke="#8C7355" strokeWidth="1" />
                                        <circle cx="236" cy="172" r="13" fill="#8C7355" />
                                        <text x="236" y="177" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF" textAnchor="middle">2</text>
                                        <text x="216" y="168" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E" textAnchor="end">Shoulder seam</text>
                                        <text x="216" y="185" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666" textAnchor="end">sits on the shoulder bone</text>

                                        <line x1="316" y1="322" x2="250" y2="322" stroke="#8C7355" strokeWidth="1" />
                                        <circle cx="236" cy="322" r="13" fill="#8C7355" />
                                        <text x="236" y="327" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF" textAnchor="middle">4</text>
                                        <text x="216" y="318" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E" textAnchor="end">Cuffs and hem</text>
                                        <text x="216" y="335" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666" textAnchor="end">flat, level, even stitch</text>

                                        {/* callouts right */}
                                        <line x1="500" y1="288" x2="708" y2="228" stroke="#8C7355" strokeWidth="1" />
                                        <circle cx="722" cy="224" r="13" fill="#8C7355" />
                                        <text x="722" y="229" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF" textAnchor="middle">3</text>
                                        <text x="744" y="220" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">Placket and buttons</text>
                                        <text x="744" y="237" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666">sewn firm, no puckering</text>

                                        <line x1="540" y1="410" x2="708" y2="400" stroke="#8C7355" strokeWidth="1" />
                                        <circle cx="722" cy="399" r="13" fill="#8C7355" />
                                        <text x="722" y="404" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF" textAnchor="middle">5</text>
                                        <text x="744" y="395" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E">Inside seams and label</text>
                                        <text x="744" y="412" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666">clean finish, soft woven label</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        None of these show up in a product photo at a glance, and every one shows up in a customer&rsquo;s hands.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Colour works the same way. A tight palette of stone, ivory, charcoal and navy lets every piece sit with every other, so a customer who buys twice can already build outfits from your line. Add a seasonal shade in small amounts and keep the base steady.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For the branding itself, think tonal embroidery, a woven neck label in the colour of the garment, a care label that is easy to read. A small mark is not a betrayal of the idea. Wrap the parcel in good tissue and a plain box, and treat the unboxing as part of the finish.
                                </p>
                            </section>

                            {/* Mid-article soft CTA */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Work through it with us</p>
                                <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">Have a fabric and a silhouette in mind?</h4>
                                <p className="text-[#4A484A] leading-snug mb-4">Send us the piece you would build first, with the fibre you are considering. We will tell you where it is likely to go wrong in sampling.</p>
                                <button onClick={() => setContactOpen(true)} className="px-6 py-3 bg-[#CBB49A] text-white font-semibold rounded-full hover:bg-[#b7a078] transition-colors inline-flex items-center gap-2">
                                    Send us your piece
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* H2 4 */}
                            <section id="sourcing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Sourcing and manufacturing quiet luxury clothing
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is where plain garments get expensive, and it is the part founders underestimate. With nothing to look at but the garment, every flaw is visible. Start with a <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">tech pack</Link> that states the fabric, the weight, the stitch type, the trims and the measurements, so the factory is building to a document and not to a mood.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Then sample in stages and approve each one before the next starts.
                                </p>

                                {/* Graphic 4 — checkpoints */}
                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 250" role="img" aria-label="Five approval checkpoints from fabric to finished garment: one, fabric approval with hand-feel, wash and shrinkage test; two, first prototype checking silhouette and proportion; three, fit sample with measurements signed off; four, pre-production sample made from bulk fabric and final trims; five, inspection of the finished goods against the tech pack." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">Five approvals before the first order ships</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Each one is signed off before the next begins</text>

                                        <line x1="96" y1="104" x2="864" y2="104" stroke="#CBB49A" strokeWidth="3" />
                                        {[
                                            { n: "1", t: "Fabric approval", a: "Hand-feel, wash", b: "and shrinkage test" },
                                            { n: "2", t: "First prototype", a: "Silhouette and", b: "proportion" },
                                            { n: "3", t: "Fit sample", a: "Measurements", b: "signed off" },
                                            { n: "4", t: "Pre-production sample", a: "Bulk fabric and", b: "final trims" },
                                            { n: "5", t: "Inspection", a: "Finished goods against", b: "the tech pack" },
                                        ].map((s, i) => (
                                            <g key={s.n}>
                                                <circle cx={96 + i * 192} cy="104" r="22" fill={i === 4 ? "#8C7355" : "#CBB49A"} />
                                                <text x={96 + i * 192} y="110" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill={i === 4 ? "#FFFFFF" : "#2D2A2E"} textAnchor="middle">{s.n}</text>
                                                <text x={96 + i * 192} y="156" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="700" fill="#2D2A2E" textAnchor="middle">{s.t}</text>
                                                <text x={96 + i * 192} y="178" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666" textAnchor="middle">{s.a}</text>
                                                <text x={96 + i * 192} y="195" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#666666" textAnchor="middle">{s.b}</text>
                                            </g>
                                        ))}
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        For how long each stage takes on a real calendar, see <Link href="/blogs/clothing-production-timeline" className="underline text-[#CBB49A] hover:text-[#b7a078]">the production timeline</Link>.
                                    </figcaption>
                                </figure>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Be wary of the cheapest quote. It usually got there by dropping a sampling round or swapping a trim, and in a garment with no logo those are the two things the customer will notice. Fabric and trim suppliers should show you wash results, not just a swatch.
                                </p>

                                <div className="not-prose my-7 rounded-2xl border border-[#CBB49A]/40 bg-[#F8F7F4] p-5 sm:p-6">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Signs you are making this mistake</p>
                                    <ul className="space-y-1.5 text-[#2D2A2E] leading-snug">
                                        <li>&bull; The design looks expensive in the render and ordinary in the cloth</li>
                                        <li>&bull; You picked the factory on the lowest quote and skipped a fit round to hold it</li>
                                        <li>&bull; You are launching a full range before one piece has sold twice</li>
                                    </ul>
                                </div>
                            </section>

                            {/* H2 5 */}
                            <section id="pricing-marketing" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Pricing and marketing a quiet luxury clothing brand
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A narrow atelier corridor with a long wooden rail of unbranded wool jackets and coats in oatmeal, charcoal and navy receding into depth, a single shaft of low sun across the oak floor. No people, no labels, no logos."
                                        width={1822}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A premium price needs reasons the customer can verify. Put the fibre, the weight and the construction on the product page, shoot close-ups of the seam and the cuff, and let the copy say what the cloth is made of. A discount tells people the first price was a guess, so a quiet luxury brand has less room for them than most.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    There is a real limit here. Shoppers can only price quality they can judge, and a brand nobody has touched yet has to earn that. Start with one or two pieces done properly. <Link href="/blogs/custom-clothing-manufacturing-cost" className="underline text-[#CBB49A] hover:text-[#b7a078]">Unit cost moves with order size</Link>, so decide the price after you know what a small first run costs. Instagram and Pinterest suit this kind of product because the pictures do the explaining.
                                </p>
                            </section>

                            {/* H2 6 */}
                            <section id="partner" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    A manufacturing partner for a brand with nothing to hide behind
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    HY Official is not a no-logo brand. It describes itself as streetwear with luxury craftsmanship and carries a Rising Star emblem. But its <Link href="/case-studies/hy-official" className="underline text-[#CBB49A] hover:text-[#b7a078]">case study</Link> lists the same trouble spots: sample quality that did not match bulk, and no single place that handled design, sampling and production. Logo or none, the garment stands or falls on those.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Krazy Kreators is a manufacturing partner for that stage: <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design development</Link>, fabric sourcing, tech packs, sampling, quality control and <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">production</Link>, which can run as <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">one end-to-end service</Link> for US founders.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    If your garment had to sell with the label cut out, which part would you worry about first: the fabric, the fit or the finishing?
                                </p>
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

                            {/* About Krazy Kreators */}
                            <div className="not-prose mt-12 mb-4 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-6">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">About Krazy Kreators</p>
                                <p className="text-[#4A484A] leading-snug">
                                    Krazy Kreators is the end-to-end brand-building partner for US clothing founders &mdash; <Link href="/design-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">design</Link>, sampling, <Link href="/manufacturing-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">fabric sourcing and retail-grade production</Link>, and packaging, <Link href="/end-to-end-services" className="underline text-[#CBB49A] hover:text-[#b7a078]">under one roof</Link>, from first sketch to shelf. krazykreators.com
                                </p>
                            </div>

                            {/* End-of-post CTA pair */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12 mb-16" ref={endOfArticleRef}>
                                <Link href="/blogs/what-is-a-tech-pack" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">What Is a Tech Pack? The File Your Factory Builds From</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">The document that holds fabric, stitch type and measurements, so a plain garment is built to a spec and not to a mood.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the guide <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Talk to us</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Ready to build your own premium clothing brand?</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Tell a Krazy Kreators production lead about the first piece you would make and the fabric you have in mind. We will tell you what it takes to get it designed, sampled and produced.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start the conversation <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/custom-clothing-manufacturing-cost",
                                            title: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
                                            dek: "What your unit cost really does as the order size moves.",
                                            read: "10 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "The document that makes unit 200 match the sample.",
                                            read: "12 min read",
                                        },
                                        {
                                            href: "/blogs/how-to-start-a-clothing-brand-2026",
                                            title: "How to Start a Clothing Brand in 2026",
                                            dek: "The groundwork underneath any retail expansion plan.",
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
                        Send us your first piece &mdash; we&rsquo;ll tell you what it takes <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
