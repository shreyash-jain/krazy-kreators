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

const BLOG_ID = "us-plus-one-sourcing-playbook-2026";

type BlogClientProps = {
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function PlusOneSourcingClient({ initialLikeCount, initialComments }: BlogClientProps) {
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
        const action = isLiked ? "unlike" : "like";
        try {
            const newCount = await likeBlog(BLOG_ID, action);
            recordBlogLikeUpdate(BLOG_ID, newCount);
            setIsLiked(!isLiked);
            setLikeCount(newCount);
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
            const newCount = await likeComment(commentId, action);
            setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: newCount } : c));
            setLikedComments(prev => {
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
                    src="https://res.cloudinary.com/dprx4pret/image/upload/v1779966507/blog/plus_one_sourcing_hero.jpg"
                    alt="Stylized world map with subtle lines connecting the US to India — the Plus-One sourcing diversification reshaping US apparel in 2026"
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
                            Business
                        </span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">9 min read</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-200 font-medium tracking-wide">May 28, 2026</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-lg mb-6 tracking-tight">
                        The US &lsquo;Plus-One&rsquo; Sourcing Playbook<br className="hidden sm:block" /> for Clothing Brand Founders in 2026
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-medium max-w-3xl drop-shadow-md leading-relaxed">
                        US brands are not leaving China. They are adding. The country you add shapes everything.
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
                                <p className="text-sm text-[#666666]">Hosted on May 28, 2026</p>
                                <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none text-[#4A484A]">
                            <p className="text-xl text-[#2D2A2E] leading-relaxed mb-10 font-medium">
                                The story you are hearing about US fashion sourcing is that brands are leaving China. That is not quite right, and the distinction matters.
                            </p>

                            <p className="mb-6">
                                What is actually happening is more strategic. US brands are not leaving China. They are <strong>adding</strong>. Adding a second country to the sourcing footprint. Adding a partner who can do what the first partner cannot. Adding redundancy that did not feel necessary until tariff policy made it expensive to operate without it. The shape of US apparel sourcing in 2026 is not a migration. It is a diversification.
                            </p>
                            <p className="mb-12">
                                The industry has a name for this. <strong>Plus-One sourcing</strong>. The principle is that one country can no longer hold everything. The execution is a brand decision, not a cost decision. The country you add to your sourcing footprint shapes what you can charge, what story you can tell, and what shelves you can land on. For apparel in 2026, India is winning the largest share of US Plus-One reshoring. This is what the playbook actually looks like.
                            </p>

                            {/* Section 1: Why Plus-One */}
                            <div className="mt-16 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why Plus-One, Not Move</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The reflex when tariffs hit a single sourcing country is to move production wholesale to a cheaper one. Most US founders who tried that in 2024 and early 2025 are now retracing those steps.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    Wholesale moves are slow. They burn the calendar that was supposed to ship the next season. They require rebuilding a relationship that took the founder two years to build with the original factory. And they replicate the original mistake: depending on a single country for everything.
                                </p>
                                <p className="text-lg leading-relaxed text-[#666666] mb-6">
                                    Plus-One is the operational answer to the same problem with none of those costs. Keep the existing relationship for what it does well. Add a second sourcing country for what the first one cannot do — or for what the first one does but at a tariff penalty the brand can no longer absorb. The result is redundancy if a tariff event or a port closure disrupts one country, optionality on routing different categories to the country that does each best, faster iteration because small-batch experimentation lives in the country with the right MOQ infrastructure, and category-specific routing where knitwear can be sourced from India and Turkey simultaneously while technical sportswear runs through Vietnam and Indonesia.
                                </p>

                                <div className="bg-[#F8F7F4] border-l-4 border-[#CBB49A] p-8 rounded-r-2xl mb-10 shadow-sm">
                                    <h3 className="text-2xl font-bold text-[#CBB49A] mb-3">Two partners, not one.</h3>
                                    <p className="text-[#666666] m-0 text-lg leading-relaxed">
                                        Most US brands need two sourcing partners for the next decade — one for volume, one for craft. The Plus-One question is which country becomes the second one, and which category it serves first.
                                    </p>
                                </div>
                            </div>

                            {/* Section 2: Which countries by category */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Which Countries Are Winning Plus-One, By Category</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1779966508/blog/plus_one_sourcing_categories.jpg"
                                        alt="Editorial flat-lay of distinct apparel samples from different sourcing geographies — the visual map of category-specific Plus-One routing"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-12 font-medium">
                                    Stripped of the narrative noise, the 2026 picture is category-specific. Different US brand categories are landing on different Plus-One countries based on what the category actually needs.
                                </p>

                                <div className="space-y-6 mb-10">
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Premium apparel with craft and complex construction → India</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">India is winning this slot decisively. Hand embroidery, hand-finishing, named-mill fabric, and small-batch capability that used to be Italy-exclusive at much higher prices.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Mass-volume basics → Vietnam, Bangladesh</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Vietnam and Bangladesh remain the volume answer. Scale economics, mature export infrastructure, and tariff treatment that still works for unit costs measured in single digits.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Technical and performance sportswear → Vietnam, Indonesia</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Both have the fabric mills, the seam-sealing capability, and the construction precision that performance categories require. The category is also where Vietnam holds the deepest bench of factories with proven export experience to US retailers.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Knitwear → India, Turkey</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">India and Turkey split this. India for the price and the small-batch flexibility. Turkey for the proximity to European customers and the heritage on certain fabric types where the mill tradition matters.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">5</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Leather goods and shoes → India, Portugal</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">India for the hand-finishing tradition and the small-batch leather workshops. Portugal for the European premium positioning and the proximity to Italian leather supply chains. The split is brand-positioning driven, not cost driven.</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666]">
                                    A US brand that ships across multiple categories — and most do — should expect to land on two Plus-One countries inside the next twelve months, not one. The country that fits the brand&apos;s flagship category becomes the primary Plus-One. A second sits in reserve for the categories the primary cannot serve.
                                </p>
                            </div>

                            {/* Section 3: Why India is leading apparel Plus-One */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">Why India Is Leading the Apparel Plus-One Race</h2>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1779966509/blog/plus_one_sourcing_india.jpg"
                                        alt="Close-up of an Indian artisan's hands hand-finishing a premium garment — the capability layer that is pulling the largest share of US Plus-One apparel reshoring in 2026"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-12 font-medium">
                                    For US apparel brands specifically, India is the Plus-One country pulling the most reshoring share in 2026. Four reasons converge.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Capability</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Hand-finishing at scale</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Indian ateliers run hand-finishing, embroidery, and complex construction at a level European mills can no longer staff for. The work that used to be quietly serviced for Paris and Milan luxury houses under non-disclosure is now available to US brands by name.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Tariff Math</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Premium at Vietnam-level cost</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Landed cost from India is competitive with Vietnam and beats China on quality at small-batch volumes. The math is not about saving money. It is about paying roughly what a high-end Vietnam run costs and getting the hand-finishing that justifies a premium price point.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">MOQ Economics</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Built for 500-unit runs</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">Indian small-batch infrastructure is built for 500-unit runs. Chinese factories are not. For US brands that are running drops or testing SKUs before committing to scale, the difference is whether the brand can pilot the product at all.</p>
                                    </div>

                                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#CBB49A]/20 to-transparent"></div>
                                        <h3 className="text-2xl font-black text-[#2D2A2E] mb-4">Cultural Moment</h3>
                                        <p className="text-base font-semibold text-[#CBB49A] uppercase tracking-wider mb-3">Craft-coded in 2026</p>
                                        <p className="text-lg text-[#666666] leading-relaxed">&quot;Made in India&quot; reframed from cost-coded to craft-coded over the last twenty-four months. Prada&apos;s Kolhapuri collection, Harry Styles in Harago, Sabyasachi at global scale. The customer the US brand is selling to has been taught by the highest stages in fashion to read Indian craft as desirable.</p>
                                    </div>
                                </div>

                                <p className="text-lg leading-relaxed text-[#666666]">
                                    These four are not independent. They compound. Capability that the customer recognizes, at a tariff-adjusted price that holds margin, with MOQ economics that let the brand experiment. The four conditions that have to align for a Plus-One country to actually become the operational backbone of a US brand are aligned for India in 2026 in a way they were not in 2022.{" "}
                                    <Link href="/blogs/made-in-india-american-luxury-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        The full cultural reframe is its own piece.
                                    </Link>
                                </p>
                            </div>

                            {/* Section 4: The Plus-One Playbook */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-8 pb-4 border-b border-gray-200">The Plus-One Playbook</h2>
                                <p className="text-xl text-[#666666] mb-10 font-medium">Five steps. None are tactical. All are sequenced.</p>

                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative h-80 lg:h-[480px] mb-10">
                                    <Image
                                        src="https://res.cloudinary.com/dprx4pret/image/upload/v1779966510/blog/plus_one_sourcing_playbook.jpg"
                                        alt="A founder's planning desk with a sourcing audit document, fabric swatches, and a country map — the Plus-One decision being made on paper before it is made in production"
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
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Audit the current sourcing footprint by category.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">List every SKU. Tag the country it currently ships from, the lead time, the per-unit cost, and the tariff classification. The audit is the only document the playbook depends on. Most brands have never built it.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">02.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Identify which categories carry the most brand-positioning weight.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Usually the highest-priced items, the craft-heavy items, and the items most photographed for the brand&apos;s marketing. These are the categories where the Plus-One decision will move the brand the most. The volume basics are not the priority for the first move.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">03.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Pilot Plus-One sourcing on ONE high-positioning SKU first.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">Pick the single product where the brand&apos;s story most needs a country with craft credibility. Run it through the candidate Plus-One country. Measure four things: landed cost, finish quality, lead time, and customer response in the first thirty days post-launch. The pilot answers in one quarter what a whole-line move would take three years to answer.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">04.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Scale the Plus-One country to all categories where it outperforms.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">After the pilot lands, route the next adjacent categories to the same country. Build the relationship across multiple categories. The Plus-One country becomes the brand&apos;s craft and small-batch backbone over six to nine months.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-4">
                                            <span className="flex-shrink-0 text-[#CBB49A] font-bold text-2xl">05.</span>
                                            <div>
                                                <p className="text-xl text-white font-semibold leading-relaxed m-0 mb-2">Keep the original sourcing country for volume basics where craft positioning does not matter.</p>
                                                <p className="text-base text-gray-300 leading-relaxed m-0">The brand&apos;s $30 unisex tee does not need to move. The brand&apos;s $250 hand-finished overshirt does. Plus-One is about routing the right product to the right country, not replacing one with the other.{" "}
                                                    <Link href="/blogs/us-fashion-brands-moving-from-china-2026" className="text-[#CBB49A] underline underline-offset-4 hover:text-white">
                                                        The full case for why US brands are restructuring around this is its own piece.
                                                    </Link>
                                                </p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            {/* Section 5: Common Mistakes */}
                            <div className="mt-20 mb-20">
                                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2D2A2E] mb-10 pb-4 border-b border-gray-200">The Common Plus-One Mistakes</h2>
                                <p className="text-xl leading-relaxed text-[#4A484A] mb-8 font-medium">
                                    The mistakes are predictable and expensive. Four patterns cost US brands the first year of Plus-One execution.
                                </p>

                                <div className="space-y-6 mb-10">
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Treating Plus-One as a cost decision instead of a brand decision.</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">The whole point is positioning, not procurement. If the only metric is per-unit cost, the wrong country will win every time. The brand will discover within a year that the cost saving was a positioning loss the customer paid for.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Picking the wrong country for the category.</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">Routing technical sportswear to a craft country, or routing craft product to a volume country. The country has to match what the category actually needs, not what is convenient. A mismatch is felt in the product on first touch and the customer reads it before the marketing can.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Trying to switch everything at once instead of piloting.</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">The pilot is the de-risking step. Skipping it means absorbing a year of unknowns at full scale before any of them are answered. Brands that move whole categories before piloting one SKU usually rebuild the relationship from scratch six months later.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 bg-[#F8F7F4] rounded-2xl">
                                        <div className="flex-shrink-0 w-12 h-12 bg-[#CBB49A] text-white rounded-full flex items-center justify-center font-bold text-lg">4</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#2D2A2E] mb-2">Not naming the new origin in product copy.</h4>
                                            <p className="text-lg text-[#666666] leading-relaxed">If the product page still reads &quot;imported&quot; after the Plus-One sourcing is in place, the brand has paid the cost of the Plus-One without claiming the positioning lift. That is the most expensive of the four — full cost, zero return.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-16 border-[#EBEBEB]" />

                            <div className="bg-gradient-to-br from-[#F8F7F4] to-white p-10 rounded-3xl border border-[#EBEBEB]">
                                <h3 className="text-3xl font-bold text-[#2D2A2E] mb-6">Plus-One Is a 2026 Decision, Not a 2027 One</h3>
                                <p className="text-xl text-[#4A484A] leading-relaxed mb-6 font-medium">
                                    The decision is in front of US brands now, and the capacity is going to allocate itself over the next twelve months whether founders act on it or not.
                                </p>
                                <p className="text-lg text-[#666666] leading-relaxed">
                                    The US brands that lock in their Plus-One country in 2026 own the next ten years of premium positioning, because they will have the operational relationship, the named origin on the product page, and the customer trained to recognize the story. The brands that wait will source from whoever has capacity left after the leaders pick first. The math on that gap compounds every quarter.{" "}
                                    <Link href="/case-studies" className="text-[#CBB49A] underline underline-offset-4 hover:text-[#b7a078]">
                                        See how Plus-One looks on the production side of a live US brand.
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Conclusion CTA */}
                        <div className="bg-[#2D2A2E] text-white p-10 lg:p-12 rounded-2xl mb-12 mt-12 relative overflow-hidden text-center" ref={endOfArticleRef}>
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6">Lock In Your Plus-One</h3>
                                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                                    US founders ready to lock in their Plus-One — partner with Krazy Kreators. We move US brands into Indian craft-led production without losing the year.
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
