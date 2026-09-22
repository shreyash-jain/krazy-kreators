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

const BLOG_ID = "eu-green-claims-directive-2026-fashion-brands";

const HERO_IMAGE = "/blog/eu-green-claims-directive-2026-fashion-brands-hero.jpg";
const SECTION1_IMAGE = "/blog/eu-green-claims-directive-2026-fashion-brands-section1.jpg";
const MACRO_IMAGE = "/blog/eu-green-claims-directive-2026-fashion-brands-macro.jpg";
const CLOSING_IMAGE = "/blog/eu-green-claims-directive-2026-fashion-brands-closing.jpg";

const TOC = [
    { id: "what-it-is", label: "What the law actually is" },
    { id: "what-counts", label: "What counts as a green claim" },
    { id: "who-it-applies-to", label: "Who it applies to" },
    { id: "paper-trail", label: "Where the proof lives" },
    { id: "evidence-trail", label: "How we build the trail" },
    { id: "checklist", label: "Five moves before you ship" },
    { id: "penalties", label: "If you don't comply" },
    { id: "faqs", label: "FAQs" },
];

// Vague-vs-compliant pairs. The rule: the specification has to sit next to the claim on the same medium
// (Directive (EU) 2024/825, recital 9) and the evidence has to exist on file.
const CLAIM_PAIRS = [
    {
        vague: "“Eco-friendly fabric”",
        compliant: "“Made with 100% GOTS-certified organic cotton” — transaction certificate on file",
        why: "Generic word, no specification. Banned unless you hold an EU Ecolabel-type award.",
    },
    {
        vague: "“Sustainable collection”",
        compliant: "“Shell fabric is 80% GRS-certified recycled polyester” — scope certificate on file",
        why: "“Sustainable” on its own is generic. The fibre share and the scheme make it specific.",
    },
    {
        vague: "“Made with recycled material” (only the polybag is)",
        compliant: "“Shipped in a 100% recycled-content polybag”",
        why: "Claiming the whole product when one part qualifies is blacklisted outright.",
    },
    {
        vague: "Your own green leaf badge",
        compliant: "The scheme’s licensed mark, used under its rules",
        why: "A sustainability label must sit on a third-party-verified scheme or be set by a public authority.",
    },
    {
        vague: "“Climate neutral” via purchased offsets",
        compliant: "“Factory runs on 100% renewable electricity” — supplier records on file",
        why: "Neutral, reduced or positive-impact claims based on offsetting are blacklisted.",
    },
];

// The evidence chain behind one specific claim, and who holds each document.
const CHAIN = [
    { who: "Your product page", doc: "The claim", note: "“Made with 100% GOTS-certified organic cotton”" },
    { who: "Brand / partner", doc: "Tech pack", note: "Fibre content and finish, written down" },
    { who: "Partner / mill", doc: "Transaction certificate", note: "Ties this fabric batch to the mill’s licence" },
    { who: "Mill", doc: "Scope certificate", note: "Proof the mill is licensed under the scheme" },
    { who: "Dye house", doc: "Process records", note: "What was used to dye and finish it" },
];

const CHECKLIST = [
    "Pull every environmental word off your product pages, hangtags and ads into one list.",
    "Sort each one: specific and evidenced, specific but unevidenced, or generic.",
    "For anything you keep, name the scheme and get the certificate into a folder you control.",
    "Rewrite or delete the rest before the next EU order ships — stock on shelves counts too.",
    "Ask your manufacturer, in writing, which documents come with the next batch.",
];

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function EuGreenClaimsClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string>("what-it-is");
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
        showToast("Audit checklist on the way to your inbox.", "success");
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
                    alt="Cotton bales stacked in a ginning yard at first light, one bale cut open to show raw fibre, long shadows across the ground — the start of the evidence chain the EU green claims directive asks fashion brands to prove. No people, no logos."
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
                        <span className="text-sm text-gray-200 font-medium tracking-wide">5 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">September 22, 2026</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        EU Green Claims Directive 2026:<br className="hidden lg:block" />{" "}
                        What Fashion Brands Must Prove Before September 27
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The law does not ban &ldquo;sustainable.&rdquo; It bans &ldquo;sustainable&rdquo; without a document behind it &mdash; and that document lives with your manufacturer.
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
                            <p className="text-sm text-[#666666]">Covers US apparel manufacturing and sourcing for Krazy Kreators · September 22, 2026 · Last verified against the directive text 22 September 2026</p>
                        </div>
                    </div>

                    {/* TL;DR */}
                    <div className="border-l-4 border-[#CBB49A] bg-[#F8F7F4] p-5 sm:p-6 rounded-r-2xl mb-10">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">TL;DR</p>
                        <ul className="space-y-1.5 text-[#2D2A2E] text-base sm:text-lg leading-snug">
                            <li>• From <strong>27 September 2026</strong>, generic words like &ldquo;eco-friendly&rdquo; and &ldquo;sustainable&rdquo; are banned on their own across the EU, and self-made eco badges are out. Any brand selling to EU consumers is in, wherever it sits.</li>
                            <li>• A <strong>specific</strong> claim &mdash; &ldquo;100% GOTS-certified organic cotton&rdquo; &mdash; is still legal. It needs evidence on file, not a certificate for every sentence.</li>
                            <li>• That evidence (scope certificates, transaction certificates, dye records, tech pack) is <strong>created by the manufacturer</strong>. Fix the sourcing file first, then the copy.</li>
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
                                        <Link href="/blogs/sustainable-clothing-manufacturing-eco-conscious-fashion-brand" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Sustainability</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">Sustainable clothing manufacturing, from the factory side</p>
                                        </Link>
                                        <Link href="/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Certifications</p>
                                            <p className="text-sm font-semibold text-[#2D2A2E] leading-snug group-hover:underline">GOTS, organic cotton and recycled polyester, explained</p>
                                        </Link>
                                        <Link href="/blogs/what-is-a-tech-pack" className="group block p-4 rounded-xl border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                            <p className="text-[11px] font-medium text-[#666666] mb-1">Documentation</p>
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
                                On 27 September 2026, the word &ldquo;eco-friendly&rdquo; on a hangtag becomes a legal claim in 27 countries. Not a mood. A claim, with a burden of proof attached.
                            </p>

                            <p className="mb-5 text-base lg:text-lg leading-snug">
                                That is the short version of the <strong>EU green claims directive for fashion</strong> brands, and the reason a US label with a web store that ships to Berlin should read on. The law does not ban sustainability. It bans sustainability you cannot show a document for &mdash; and self-made &ldquo;eco&rdquo; badges are gone outright.
                            </p>

                            <p className="mb-8 text-base lg:text-lg leading-snug">
                                Most of the coverage treats this as a legal or marketing problem. It is mostly a sourcing problem. The proof the law wants &mdash; fibre origin, dye process, certificates &mdash; sits with whoever made the garment, not with whoever wrote the product page.
                            </p>

                            {/* H2 1 */}
                            <section id="what-it-is" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What the Green Claims Directive (ECGT) actually is
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={SECTION1_IMAGE}
                                        alt="An unbranded oatmeal organic-cotton crewneck on a tailor's form in a white-walled European boutique at blue hour, window light from the left, the shop rail out of focus behind — a garment whose label now has to be provable under the ECGT directive for textiles. No people, no logos, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Two EU laws share the nickname, and the mix-up matters. The one with the September date is <strong>Directive (EU) 2024/825</strong>, the Empowering Consumers for the Green Transition Directive, adopted in February 2024 and applying from 27 September 2026 (<a href="https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/sustainable-consumption_en" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">European Commission</a>). The separate &ldquo;Green Claims Directive&rdquo; proposal &mdash; the one that would have set detailed substantiation rules &mdash; was slated for withdrawal in June 2025 and has been stalled since (<a href="https://www.lw.com/en/insights/european-commission-announces-intention-to-withdraw-eu-green-claims-directive-proposal" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Latham &amp; Watkins</a>).
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    So the deadline is real, but the rulebook is the consumer-protection one. Three things change on the 27th. Generic environmental words are banned unless you hold a top-tier award such as the EU Ecolabel. A sustainability logo or badge must sit on a certification scheme verified by an independent third party, or be set by a public authority. And a claim about the whole product when only one part qualifies &mdash; &ldquo;made with recycled material&rdquo; when only the packaging is &mdash; is blacklisted (<a href="https://eur-lex.europa.eu/eli/dir/2024/825/oj" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">EUR-Lex, Annex I points 2a, 4a and 4b</a>).
                                </p>
                            </section>

                            {/* H2 2 */}
                            <section id="what-counts" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What counts as a green claim now
                                </h2>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The test is specificity on the same medium. The directive&rsquo;s own examples of banned generic wording are &ldquo;environmentally friendly&rdquo;, &ldquo;eco-friendly&rdquo;, &ldquo;green&rdquo;, &ldquo;climate friendly&rdquo;, &ldquo;biodegradable&rdquo; and &ldquo;similar statements&rdquo; (<a href="https://eur-lex.europa.eu/eli/dir/2024/825/oj" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">recital 9</a>); law firms read &ldquo;sustainable&rdquo; as squarely inside that catch-all (<a href="https://products.cooley.com/2026/03/16/empowering-consumers-for-the-green-transition-directive-check-your-sustainability-claims-and-warranty-information-for-compliance-with-new-eu-regime/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Cooley</a>). A claim stops being generic when its specification sits next to it &mdash; on the same hangtag, the same product page &mdash; in clear terms.
                                </p>

                                <div className="not-prose my-8 overflow-x-auto rounded-2xl border border-gray-200">
                                    <table className="min-w-[640px] w-full text-sm">
                                        <caption className="text-left px-5 pt-4 pb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A]">Vague claim vs compliant claim under Directive (EU) 2024/825</caption>
                                        <thead>
                                            <tr className="bg-[#F8F7F4] text-left">
                                                <th className="px-5 py-3 font-semibold text-[#2D2A2E]">Vague (banned)</th>
                                                <th className="px-5 py-3 font-semibold text-[#2D2A2E]">Compliant (specific, evidenced)</th>
                                                <th className="px-5 py-3 font-semibold text-[#2D2A2E]">Why</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {CLAIM_PAIRS.map((row) => (
                                                <tr key={row.vague} className="border-t border-gray-100 align-top">
                                                    <td className="px-5 py-3 text-[#8C3A3A] font-medium">{row.vague}</td>
                                                    <td className="px-5 py-3 text-[#2D2A2E] font-medium">{row.compliant}</td>
                                                    <td className="px-5 py-3 text-[#666666]">{row.why}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    Note what the compliant column does not require: a certificate for every sentence. A specific claim needs evidence you can produce on demand. A logo needs a third-party scheme. A vague word needs an Ecolabel, which for a small brand means it needs to go.
                                </p>
                            </section>

                            {/* Mid-article soft CTA — the audit checklist */}
                            <div className="my-10 p-6 rounded-3xl bg-gradient-to-br from-[#F8F7F4] to-white border border-[#CBB49A]/40 shadow-md">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-2">Free download</p>
                                        <h4 className="text-2xl font-extrabold text-[#2D2A2E] mb-2">The Sustainability Claims Audit Checklist</h4>
                                        <p className="text-[#4A484A] leading-snug">Not sure your product copy would pass? A one-page checklist to run your listings and hangtags against: Do you say &ldquo;eco-friendly&rdquo;? Can you name the certification body? Is the certificate on file, and does it cover this batch? Twelve questions, a pass/fix column, and the documents to ask your manufacturer for.</p>
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
                                            Send me the checklist
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-[#2D2A2E] font-medium">Checklist on the way. Check your inbox.</p>
                                )}
                            </div>

                            {/* H2 3 */}
                            <section id="who-it-applies-to" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Who it applies to (and why &ldquo;I&rsquo;m not in the EU&rdquo; doesn&rsquo;t help)
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The directive amends the Unfair Commercial Practices Directive, which covers any trader selling to consumers in the EU, wherever the company sits (<a href="https://products.cooley.com/2026/03/16/empowering-consumers-for-the-green-transition-directive-check-your-sustainability-claims-and-warranty-information-for-compliance-with-new-eu-regime/" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">Cooley</a>). A US brand on an EU marketplace, an EU-facing web store, or a Copenhagen stockist&rsquo;s shelf is in.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    There is no phase-in for stock already on shelves. The law regulates the claim at the moment of sale, so a hangtag printed in March is judged in October. Nothing is grandfathered.
                                </p>
                            </section>

                            {/* H2 4 */}
                            <section id="paper-trail" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    The real problem: the paper trail sits with your manufacturer
                                </h2>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={MACRO_IMAGE}
                                        alt="Extreme macro of raw cotton fibre pulled from a boll beside a single strand of spun undyed yarn, on a dark surface under raking light — fibre origin, the first link in the evidence chain a clothing manufacturer with sustainability documentation has to hold. Very shallow depth of field, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    A founder can want to comply and still fail. Ask most small brands to prove &ldquo;organic cotton&rdquo; and you get a supplier invoice that says &ldquo;organic cotton&rdquo;. That is a claim, not evidence.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    Evidence is a chain. The mill holds a scope certificate <em>(proof it is licensed under a scheme such as GOTS)</em>. Each shipment carries a transaction certificate <em>(a scheme document tying that batch to that licence)</em>. The dye house holds its own process records. Your <Link href="/blogs/what-is-a-tech-pack" className="underline text-[#CBB49A] hover:text-[#b7a078]">tech pack</Link> <em>(the specification file the factory builds from)</em> states the fibre content and finish. Every link lives in a different building, and a brand running five uncoordinated vendors owns none of them.
                                </p>

                                <figure className="not-prose my-8 rounded-2xl border border-gray-200 bg-[#F8F7F4] p-5 sm:p-6 overflow-x-auto">
                                    <svg viewBox="0 0 960 330" role="img" aria-label="The evidence chain behind one specific claim, 'Made with 100% GOTS-certified organic cotton': the claim on the product page; the tech pack held by the brand or partner stating fibre content and finish; the transaction certificate from the partner or mill tying this batch to the mill's licence; the mill's scope certificate proving it is licensed under the scheme; and the dye house's process records. Each document is held by a different party." className="w-full h-auto min-w-[640px]">
                                        <text x="0" y="24" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fontWeight="700" fill="#2D2A2E">Where the proof for one claim actually lives</text>
                                        <text x="0" y="48" fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fill="#666666">Sourcing documentation for green claims compliance · one claim, five documents, four different buildings</text>

                                        {CHAIN.map((c, i) => {
                                            const x = i * 190;
                                            const isClaim = i === 0;
                                            return (
                                                <g key={c.doc}>
                                                    <text x={x + 12} y="82" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="700" fill="#8C7355" letterSpacing="1">{c.who.toUpperCase()}</text>
                                                    <rect x={x} y="94" width="176" height="150" rx="12" fill={isClaim ? "#2D2A2E" : "#FFFFFF"} stroke={isClaim ? "#2D2A2E" : "#CBB49A"} strokeWidth="1.5" />
                                                    <text x={x + 12} y="124" fontFamily="Helvetica, Arial, sans-serif" fontSize="15" fontWeight="700" fill={isClaim ? "#FFFFFF" : "#2D2A2E"}>{c.doc}</text>
                                                    <foreignObject x={x + 12} y="136" width="152" height="100">
                                                        <p style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 12, lineHeight: "16px", color: isClaim ? "#E5E0D8" : "#666666", margin: 0 }}>{c.note}</p>
                                                    </foreignObject>
                                                    {i < CHAIN.length - 1 && (
                                                        <path d={`M${x + 176} 169 L${x + 190} 169`} stroke="#CBB49A" strokeWidth="2" markerEnd="url(#arrow)" />
                                                    )}
                                                </g>
                                            );
                                        })}
                                        <defs>
                                            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M0 0 L10 5 L0 10 z" fill="#CBB49A" />
                                            </marker>
                                        </defs>

                                        <line x1="0" y1="272" x2="936" y2="272" stroke="#B0AAA2" strokeWidth="1" />
                                        <text x="0" y="296" fontFamily="Helvetica, Arial, sans-serif" fontSize="12" fill="#4A484A">The brand writes the first box. The manufacturer creates, or fails to create, the other four.</text>
                                        <text x="0" y="318" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#999999">Krazy Kreators · Directive (EU) 2024/825 recital 9 and Annex I · scheme documents as GOTS defines them</text>
                                    </svg>
                                    <figcaption className="mt-3 text-sm text-[#666666] leading-snug">
                                        How to prove a sustainability claim for a clothing brand: the same chain for GRS recycled polyester, OEKO-TEX or any named scheme.
                                    </figcaption>
                                </figure>

                                <blockquote className="border-l-4 border-[#CBB49A] pl-5 my-7 text-xl lg:text-2xl font-serif italic text-[#2D2A2E] leading-snug">
                                    &ldquo;A supplier invoice that says &lsquo;organic&rsquo; is a claim. A transaction certificate is evidence. The law only counts the second.&rdquo;
                                </blockquote>
                            </section>

                            {/* H2 5 */}
                            <section id="evidence-trail" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    How Krazy Kreators builds the evidence trail for you
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    This is where an end-to-end partner earns the description. Krazy Kreators sources only from certified mills and vendors, prioritising GRS-certified recycled polyester and organic cotton, and handles the documentation and audit work around them (<Link href="/sustainability" className="underline text-[#CBB49A] hover:text-[#b7a078]">our sustainability commitments</Link>). Raw materials are bought and held per brand under one roof (<Link href="/end-to-end-services/raw-materials" className="underline text-[#CBB49A] hover:text-[#b7a078]">raw materials, managed responsibly</Link>), so a batch can be tied to a certificate, a certificate to a tech pack, and a tech pack to the garment on the shelf.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A]">
                                    One project owner holds the whole file. That is the structural difference: a clean evidence trail across one partner is a filing job; across five vendors it is an investigation. It is the same discipline our earlier piece on <Link href="/blogs/sustainable-clothing-manufacturing-eco-conscious-fashion-brand" className="underline text-[#CBB49A] hover:text-[#b7a078]">sustainable clothing manufacturing</Link> argued for from the factory side.
                                </p>

                                {/* Inline CTA — medium commitment */}
                                <div className="not-prose mt-7 rounded-2xl border border-[#CBB49A]/50 bg-[#F8F7F4] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-1">Selling into the EU now?</p>
                                        <p className="text-[#2D2A2E] leading-snug">
                                            Tell us the claims on your product pages and the fabrics behind them, and a Krazy Kreators production lead will tell you which documents we can hand you with your next order &mdash; and which claims to rewrite before it ships.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setContactOpen(true)}
                                        className="shrink-0 px-6 py-3 bg-[#2D2A2E] text-white font-semibold rounded-full hover:bg-[#1f1d20] transition-colors inline-flex items-center justify-center gap-2"
                                    >
                                        Ask what documentation we provide
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </section>

                            {/* H2 6 */}
                            <section id="checklist" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    Five moves before your next EU order ships
                                </h2>
                                <div className="not-prose rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                    <ol className="space-y-3">
                                        {CHECKLIST.map((item, i) => (
                                            <li key={item} className="flex gap-4 items-start">
                                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#CBB49A] text-white font-bold text-sm flex items-center justify-center">{i + 1}</span>
                                                <p className="text-[#2D2A2E] leading-snug pt-1">{item}</p>
                                            </li>
                                        ))}
                                    </ol>
                                    <p className="mt-5 text-sm text-[#666666]">The downloadable audit checklist above is the long version of this list, with a column for each document.</p>
                                </div>
                            </section>

                            {/* H2 7 */}
                            <section id="penalties" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    What happens if you don&rsquo;t comply
                                </h2>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    For cross-border cases, member states must be able to fine at least 4% of a trader&rsquo;s annual turnover in the countries concerned, or &euro;2 million where turnover is unknown (<a href="https://eur-lex.europa.eu/eli/dir/2019/2161/oj" target="_blank" rel="noopener noreferrer" className="underline text-[#CBB49A] hover:text-[#b7a078]">EUR-Lex, Directive 2019/2161</a>). Day-to-day enforcement sits with 27 national authorities and consumer groups can bring collective actions, so the practical risk is uneven &mdash; and unknown until the first cases land.
                                </p>
                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    The concession: a brand that never sells into the EU and never plans to can leave its copy alone. Everyone else should treat unsupported wording as a defect to fix now, not a risk to price later.
                                </p>

                                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 my-7 max-w-2xl mx-auto bg-[#F8F7F4]">
                                    <Image
                                        src={CLOSING_IMAGE}
                                        alt="A textile dye house at night — steel dye vats, drifting steam and warm tungsten light, a worker's back in silhouette at the far end — the process records here are part of the evidence chain a fashion brand's EU compliance manufacturer has to keep. No faces, no logos, no text."
                                        width={1024}
                                        height={1024}
                                        sizes="(max-width: 1024px) 100vw, 42rem"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <p className="text-base lg:text-lg leading-snug text-[#4A484A] mb-4">
                                    After 27 September, &ldquo;sustainable&rdquo; is something you prove, not something you choose. The document that proves it was created, or not created, on the day the fabric was bought. In your shoes we would open the last purchase order before we opened the product page &mdash; which of your claims could you back by Friday?
                                </p>

                                <p className="not-prose text-sm text-[#666666] leading-snug border-t border-gray-200 pt-4">
                                    This article is general information, not legal advice. Enforcement practice will settle after 27 September 2026 and differs by member state; confirm claim-specific questions with counsel in the markets you sell into. Last verified against the directive text on 22 September 2026.
                                </p>
                            </section>

                            {/* FAQs */}
                            <section id="faqs" className="scroll-mt-28 mt-12 mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[#2D2A2E] mb-5 pb-2 border-b border-gray-200">
                                    FAQs
                                </h2>
                                <div className="space-y-7">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What is the EU Green Claims Directive (ECGT Directive)?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">The law applying from 27 September 2026 is Directive (EU) 2024/825, the Empowering Consumers for the Green Transition (ECGT) Directive. It amends EU consumer-protection law to ban generic environmental claims that cannot be backed by recognised excellent environmental performance, sustainability labels that are not based on a third-party certification scheme or set by a public authority, and claims about a whole product that only apply to one part of it. The separate &ldquo;Green Claims Directive&rdquo; proposal, which would have set detailed substantiation rules, was slated for withdrawal in June 2025 and has stalled since.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">When does the Green Claims Directive take effect?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Directive (EU) 2024/825 entered into force in March 2024. Member states had to transpose it into national law by 27 March 2026, and the rules apply to traders from 27 September 2026. There is no transition period for products already on sale.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Can I still use the word &ldquo;sustainable&rdquo; on my clothing brand?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">On its own, no. &ldquo;Sustainable&rdquo;, &ldquo;eco-friendly&rdquo; and &ldquo;green&rdquo; are generic environmental claims, banned unless the trader holds a recognised top-tier award such as the EU Ecolabel. The word becomes usable when its specification sits next to it on the same medium &mdash; for example &ldquo;made with 100% GOTS-certified organic cotton&rdquo; with the certificate on file. The rule targets vagueness, not the topic.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">Does this law apply if my brand isn&rsquo;t based in the EU?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Yes. The directive amends the Unfair Commercial Practices Directive, which applies to any trader selling to consumers in the EU regardless of where the business is registered. A US brand selling through an EU marketplace, an EU-facing web store or a European stockist is in scope.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D2A2E] mb-2">What evidence do I need to back up a sustainability claim?</h3>
                                        <p className="text-base lg:text-lg leading-snug text-[#4A484A]">Evidence that matches the exact scope of the claim and can be produced on request: the mill&rsquo;s scope certificate under the scheme you name, a transaction certificate tying your fabric batch to that certificate, the dye house&rsquo;s process records, and a tech pack that states fibre content and finish. A supplier invoice that says &ldquo;organic cotton&rdquo; is a claim, not evidence. Most of these documents are created by the manufacturer, which is why the paper trail is a sourcing question before it is a marketing one.</p>
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
                                <Link href="/blogs/sustainable-clothing-manufacturing-eco-conscious-fashion-brand" className="group block p-7 rounded-2xl bg-[#F8F7F4] border border-gray-100 hover:border-[#CBB49A] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Read next</p>
                                    <h4 className="text-xl font-bold text-[#2D2A2E] mb-2 group-hover:underline">Sustainable Clothing Manufacturing: How to Build an Eco-Conscious Fashion Brand</h4>
                                    <p className="text-[#666666] leading-relaxed mb-4">What has to be true at the factory before the word goes on the label &mdash; fabric choices, ethical sourcing and the waste reduction that pays for itself.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Read the factory side <ArrowRight className="w-4 h-4" /></span>
                                </Link>
                                <button onClick={() => setContactOpen(true)} className="group block text-left p-7 rounded-2xl bg-[#2D2A2E] text-white hover:bg-[#1f1d20] transition-colors">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#CBB49A] mb-3">Start your project</p>
                                    <h4 className="text-xl font-bold mb-2 group-hover:underline">Build the next collection with the paper trail already in it</h4>
                                    <p className="text-gray-300 leading-relaxed mb-4">Send a sketch, a sample or a style that sold, and the claims you want to make about it. A Krazy Kreators production lead comes back with the fabric options that can carry those claims, the certificates that come with each, and a dated plan from sampling to shelf.</p>
                                    <span className="inline-flex items-center gap-2 text-[#CBB49A] font-semibold">Start your project <ArrowRight className="w-4 h-4" /></span>
                                </button>
                            </div>

                            {/* Related — 3 curated cards */}
                            <div className="mt-20 mb-16">
                                <h3 className="text-2xl font-extrabold text-[#2D2A2E] mb-8">Read next</h3>
                                <div className="grid sm:grid-cols-3 gap-6">
                                    {[
                                        {
                                            href: "/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester",
                                            title: "Sustainability Simplified: Organic Cotton, GOTS, and Recycled Polyester",
                                            dek: "What the certifications named in this post actually certify, fibre by fibre.",
                                            read: "8 min read",
                                        },
                                        {
                                            href: "/blogs/cpsc-efiling-sb-707-apparel-compliance-2026",
                                            title: "CPSC eFiling and California SB 707: The 2026 Apparel Compliance Rules",
                                            dek: "The US side of the same year: two rules that also run on records, not intentions.",
                                            read: "4 min read",
                                        },
                                        {
                                            href: "/blogs/what-is-a-tech-pack",
                                            title: "What Is a Tech Pack? The File Your Factory Builds From",
                                            dek: "Where fibre content and finish have to be written down before anyone can prove them.",
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
                        Selling into the EU? Ask what documentation we provide <ArrowRight className="inline w-4 h-4 ml-1" />
                    </button>
                    <button onClick={() => setShowStickyMobileCta(false)} aria-label="Dismiss" className="ml-3 p-1 text-gray-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
