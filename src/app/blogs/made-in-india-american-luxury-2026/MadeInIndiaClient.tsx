"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = "made-in-india-american-luxury-2026";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function MadeInIndiaClient({ initialLikeCount, initialComments }: BlogClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
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
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLike = async () => {
        try {
            const action = isLiked ? "unlike" : "like";
            const newCount = await likeBlog(BLOG_ID, action);
            recordBlogLikeUpdate(BLOG_ID, newCount);
            setIsLiked(!isLiked);
            setLikeCount(newCount);
        } catch { }
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
            const newCount = await likeComment(commentId, action);
            setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: newCount } : c));
            setLikedComments(prev => {
                const newSet = new Set(prev);
                if (newSet.has(commentId)) newSet.delete(commentId);
                else newSet.add(commentId);
                return newSet;
            });
        } catch { }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prev => ({ ...prev, [name]: value }));
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
                email: created.email,
                comment: created.comment,
                date: new Date(created.created_at).toLocaleString(),
                avatar: (created.name || "?").charAt(0).toUpperCase(),
                likes: 0,
            };
            setComments(prev => [newCommentData, ...prev]);
            setCommentCount(prev => prev + 1);
            setNewComment({ name: "", email: "", comment: "" });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar invertTabs={!scrolled} />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://res.cloudinary.com/dprx4pret/image/upload/v1780041179/blog/made_in_india_hero.jpg"
                    alt="Macro photograph of artisan hands working hand embroidery in fine gold zari thread on cream silk — the unbranded capability that European luxury houses are now naming openly"
                    fill
                    className="object-cover"
                    style={{
                        WebkitTransform: "translateZ(0)",
                        transform: "translateZ(0)",
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                    }}
                    priority
                />
                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 w-full min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center flex flex-col items-center mt-16">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
                        <span className="px-4 py-1.5 bg-[#CBB49A] text-white text-xs sm:text-sm font-semibold rounded-full uppercase tracking-wider">
                            Strategy
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">9 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 22, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The &lsquo;Made in India&rsquo; Trend<br className="hidden sm:block" /> Reshaping American Luxury in 2026
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        The reframe is from cost to craft. The window is open for one year.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">
                        {/* Social Interaction Container */}
                        <div className="mb-0">
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
                        </div>

                        {/* Post Details */}
                        <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-12 border border-gray-100 flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-[#666666]">Hosted on May 22, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                Prada announced a Made-in-India <strong>Kolhapuri chappal collection</strong> for fall 2026. Harry Styles wore hand-embroidered <strong>Harago</strong>, a small menswear label out of Jaipur, in public this spring. Sabyasachi is opening more flagship doors this year than any single luxury house. India&apos;s domestic luxury fashion market is on track to clear <strong>$2.12 billion by 2028</strong>.
                            </p>

                            <p className="mb-6">
                                These are not isolated stories. They are a pattern. And for US clothing founders, the pattern is happening in real time.
                            </p>
                            <p className="mb-12">
                                For most of the last twenty years, &quot;Made in India&quot; meant cost. In 2026 it means craft. The capability — hand embroidery, complex construction, premium fabric sourcing — was always there. It was just unbranded. The brands that name it openly in the next twelve months will own the next decade of premium India-coded positioning. The ones who wait will compete for spillover. This is what changed, why it is not reversing, and how to position around it.
                            </p>

                            {/* Section 1: What changed */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What &quot;Made in India&quot; Actually Means Now</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    For roughly two decades, the phrase &quot;Made in India&quot; lived in the same sentence as terms like &quot;low cost&quot; and &quot;high volume.&quot;
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    That framing came from a specific era of fashion sourcing — the early 2000s rush to find cheaper alternatives to a maturing Chinese supply chain. India absorbed that demand at the low end of the spectrum. The capability at the high end — the workshops doing hand-finished couture for Paris and Milan houses, the ateliers running zari and chikankari for European maisons under non-disclosure — never went anywhere. It was simply never named on the product page.
                                </p>
                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">Three converging moves.</h3>
                                    <p className="text-[#666666] m-0 text-lg leading-relaxed">
                                        First, the European luxury houses started naming Indian craft openly. Prada&apos;s Kolhapuri collection is not a one-off; it is the loudest signal of a multi-year shift where craft attribution has become a marketing asset. Second, a generation of India-rooted founders — Sabyasachi, Manish Malhotra, Anita Dongre, the Harago team — has built global retail without code-switching the origin. Third, the customer at the top of the market has caught up. India-coded craft, named and visible, reads as desirable in 2026 in a way it simply did not five years ago.
                                    </p>
                                </div>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The reframe is not a marketing fad. It is the same shift that happened to Japanese denim in the 2000s and Portuguese knitwear in the 2010s. The underlying capability existed in both cases for decades. The repositioning was what unlocked the premium. For India, that repositioning is the story of 2026.
                                </p>
                            </div>

                            {/* Section 2: Capability map */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Capability Map</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780041183/blog/made_in_india_capabilities.jpg"
                                        alt="Editorial flat-lay of four Indian craft samples — zari embroidery, indigo block print, handwoven khadi, hand-burnished leather — laid out as a curated capability index"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-12 font-medium">
                                    Strip the trend layer and look at what India actually does best, at a level that is hard to replicate inside any other sourcing geography at small-batch volumes.
                                </p>

                                <div className="space-y-6 mb-10">
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Hand embroidery</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Chikankari, zari, threadwork. Ateliers in Lucknow and Mumbai run hand embroidery at a level European mills can no longer staff for. A single chikankari panel can run two to three weeks of artisan work. The technique reads in a single product image; the customer does not need a video to understand the value.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Block printing and natural dyeing</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Bagru and Jaipur house multi-generation block-printing workshops. The carved wooden blocks, the hand-mixed indigo, the layered registration — every step is visibly different from a digital print. The aesthetic is also distinct enough that it can carry the entire product story.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Hand-finished leather</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Kolhapuri is the obvious anchor, but the broader tradition of hand-burnished, vegetable-tanned leather extends across Tamil Nadu and Rajasthan. Prada&apos;s announcement is downstream of capability that has been quietly servicing Italian leather goods houses for years.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Complex construction at small batch</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Gussets, plackets, hand-rolled hems, hand-bound buttonholes, French seams. Indian ateliers can hold this kind of construction on small runs — 50 to 200 pieces — where many large factories cannot.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">5</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Premium fabric weaving</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Handwoven khadi, raw silk, fine mulmul cotton. The mills around Varanasi, Maheshwar, and Bhagalpur produce yardage with named provenance and identifiable weave structure — the kind of fabric you can name on a product page the way a wine is named on a menu.</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666]">
                                    None of these are speculative. All five are operating capabilities that can be plugged into a US-bound product line within a single development cycle, with the right partner — the kind of partner most US founders find after they stop trying to compete on Vietnam pricing and start{" "}
                                    <Link href="/blogs/us-fashion-brands-moving-from-china-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        moving sourcing decisions out of China
                                    </Link>
                                    .
                                </p>
                            </div>

                            {/* Section 3: The tariff math */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Tariff Math</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    Pure cost is no longer the right frame, but the math should still close.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    For craft-intensive categories at small-batch volumes, India&apos;s tariff-adjusted landed cost is competitive with Vietnam and beats China on quality at the same price point. The 2026 US tariff picture has reshuffled the deck. Where China-sourced apparel now carries duty rates that push small-batch landed cost well above where it sat in 2022, India has remained inside a workable band for product where the per-unit margin is set by craft rather than commodity weave.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    The math is not &quot;save money by switching to India.&quot; The math is &quot;pay roughly what you would pay for a high-end Vietnam run, and get the hand-finishing your brand needs to defend a premium price.&quot; For a brand pricing into the $200 to $600 per-unit retail band — the band where most contemporary US labels live — the difference shows up entirely in what the customer sees and feels in the garment. That is the only argument that closes.
                                </p>
                            </div>

                            {/* Section 4: How to position */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">How US Founders Should Position</h2>
                                <p className="text-xl text-[#666666] mb-10 font-medium">Three rules. Treat them as product-page architecture, not marketing tone.</p>

                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780041186/blog/made_in_india_positioning.jpg"
                                        alt="A single premium cream silk garment on a wooden hanger with a visible hand-embroidered detail — the kind of finish that lets a US brand lead the product page with craft, not cost"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="bg-[#2D2A2E] p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CBB49A] opacity-10 rounded-bl-full"></div>
                                    <ol className="space-y-8 relative z-10 list-none p-0 m-0">
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">01.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Name it openly in the first paragraph.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Not under &quot;Details.&quot; Not behind &quot;See more.&quot; The first paragraph of the product page should name the country, the region, and the technique. &quot;Hand-embroidered in Lucknow.&quot; &quot;Block-printed in Bagru.&quot; &quot;Hand-finished in Kolhapur.&quot; Specificity is what reads as authentic in 2026; vague &quot;imported&quot; or &quot;globally sourced&quot; language reads as evasive, and the customer can tell.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">02.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Lead with craft, not cost.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">The framing on the product page should never imply that India is where the brand goes to save money. The framing should be the framing the European houses use: India is where this technique is done at the highest level, by people who have been doing it for generations, on equipment and with materials that cannot be reproduced anywhere else. Cost is a private operational fact. Craft is the product story.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">03.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Use city or region anchors, not country labels.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">&quot;Made in India&quot; is the starting point. The version that converts is more specific. &quot;Hand-loomed in Maheshwar.&quot; &quot;Zari work from a Lucknow atelier.&quot; Cities and regions activate the craft tradition; the country label by itself reads generic. The brands doing this well are already at the city level, and the customer rewards them for it.</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* Section 5: What NOT to do */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">What NOT to Do</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1780041189/blog/made_in_india_window.jpg"
                                        alt="A quiet artisan workbench in warm daylight — embroidery frame, brass thimble, spools of fine thread, scissors, and a cup of tea — dignified workspace, not a factory floor"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The downside of a cultural moment opening up is that brands without the actual sourcing relationship try to ride the aesthetic. The customer notices.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Don&apos;t appropriate the aesthetic.</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Block prints designed in a US studio, manufactured in a Chinese commodity factory, marketed with vague &quot;inspired by India&quot; language — this combination breaks in 2026. The customer paying attention to Prada and Sabyasachi is the customer who can spot the gap between marketing and product.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Don&apos;t bury the origin.</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">Putting a &quot;Made in India&quot; tag inside the garment but writing &quot;imported&quot; on the product page is the worst of both worlds — you lose the positioning lever without gaining anything in return. Either commit to the origin as a brand asset or do not put your product in this category.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Don&apos;t use &quot;imported&quot; language.</h3>
                                        <p className="text-lg text-[#666666] leading-relaxed">In 2026, that word reads as evasive. The brands moving into the premium India-coded segment are saying exactly where, exactly who, and exactly how. Anything less reads as a brand trying to obscure the answer.</p>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666] mt-10">
                                    This is not a tone preference. The customer in this segment is doing more product diligence than any cohort the apparel industry has ever sold to.
                                </p>
                            </div>

                            {/* Section 6: The window */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Window</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The cultural moment is open right now. The brands moving in 2026 will own the premium India-coded positioning for the next decade. The brands waiting will compete for spillover.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    The pattern is identical to two previous shifts. Japanese denim repositioned in the early 2000s; the brands that named the mill, the loom, and the indigo dye process in that window built defensible premium positions that have held for twenty years. Portuguese knitwear repositioned in the 2010s; the contemporary brands that named the Vila Nova de Gaia mills in their first three years of operation have outperformed brands that quietly sourced from the same mills without naming them. The repositioning was where the premium lived.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666]">
                                    India is in the same moment, larger in scale. The brands that name the city, the technique, and the workshop tradition openly in the next twelve months are the brands that will sit on top of the category in 2030. Building this kind of supply chain is also the kind of decision that pairs naturally with{" "}
                                    <Link href="/blogs/on-demand-clothing-manufacturing-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        on-demand production
                                    </Link>
                                    , where small-batch craft runs are the unit of operation rather than the exception.
                                </p>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">The Closing Move</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    Prada did not pioneer the craft. The Kolhapuri tradition is centuries old; the workshops Prada announced as partners were operating before the brand opened its first store. What Prada did was name it. The capability was already there. The naming made it commercial.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    US clothing founders are in the same position, with a smaller scale of decision to make. The craft is available. The cultural framing is already in motion. The only question is whether you put your customer on a product page that names it, or one that does not.{" "}
                                    <Link href="/case-studies" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        See how craft-led production reads on a real product line.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Build a Brand on Indian Craft, Named Openly</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    US founders ready to build on Indian craft — end-to-end design, sourcing, and craft-led production from India to your US customer. Partner with Krazy Kreators.
                                </p>
                                <Button
                                    onClick={() => setContactOpen(true)}
                                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] border-none px-8 py-6 text-lg rounded-full transition-all shadow-lg hover:shadow-[#CBB49A]/30"
                                >
                                    Start a Conversation
                                </Button>
                            </div>
                        </div>

                        {/* Post-Content Social Interaction */}
                        <div className="border-t border-gray-200 pt-8 mb-12">
                            <div className="p-6 bg-[#F8F7F4] rounded-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={handleLike}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLiked
                                                ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                                                : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                                                }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                                            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                                        </button>

                                        <button
                                            onClick={handleComment}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Share Article
                                    </button>
                                </div>
                                {/* Comments Display */}
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
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
            <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
            <ToastContainer />
        </div>
    );
}
