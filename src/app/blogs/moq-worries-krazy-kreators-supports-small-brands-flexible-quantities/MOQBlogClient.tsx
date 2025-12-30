"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Share2, Heart, MessageCircle, Eye } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'moq-worries-krazy-kreators-supports-small-brands-flexible-quantities';

type MOQBlogClientProps = {
  initialLikeCount: number;
  initialComments: PublicComment[];
};

export default function MOQBlogClient({ initialLikeCount, initialComments }: MOQBlogClientProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialComments.length);
  const [comments, setComments] = useState(() =>
    (initialComments || []).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      comment: c.comment,
      date: new Date(c.created_at).toLocaleString(),
      avatar: (c.name || '?').charAt(0).toUpperCase(),
      likes: c.likes ?? 0,
    }))
  );
  const [newComment, setNewComment] = useState({ name: "", email: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const { showToast, ToastContainer } = useToast();
  const [relatedBlogs] = useState(() =>
    blogPosts
      .filter((blog) => blog.slug !== BLOG_ID)
      .slice(0, 3)
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLike = async () => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      const newCount = await likeBlog(BLOG_ID, action);
      recordBlogLikeUpdate(BLOG_ID, newCount);
      setIsLiked(!isLiked);
      setLikeCount(newCount);
    } catch {}
  };
  const handleShare = async () => { const url = window.location.href; try { await navigator.clipboard.writeText(url); showToast("Link copied to clipboard!", "success"); } catch { showToast("Failed to copy link", "error"); } };
  const handleComment = () => { const el = document.querySelector("[data-comments-section]"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const handleCommentLike = async (id: string) => {
    try {
      const action = likedComments.has(id) ? 'unlike' : 'like';
      const newCount = await likeComment(id, action);
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, likes: newCount } : c));
      
      // Toggle the liked state only if API call succeeds
      setLikedComments(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } catch {
      // If API call fails, don't change the liked state
      console.error('Failed to toggle like for comment:', id);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setNewComment((prev) => ({ ...prev, [name]: value })); };
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()) { alert("Please fill in all fields"); return; }
    setIsSubmitting(true);
    try {
      const created = await addComment({ blogId: BLOG_ID, name: newComment.name.trim(), email: newComment.email.trim(), comment: newComment.comment.trim() });
      const data = { id: created.id, name: created.name, email: created.email, comment: created.comment, date: new Date(created.created_at).toLocaleString(), avatar: (created.name || '?').charAt(0).toUpperCase(), likes: 0 };
      setComments((p) => [data, ...p]); setCommentCount((p) => p + 1); setNewComment({ name: "", email: "", comment: "" }); setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setTimeout(() => { const el = document.getElementById(`comment-${data.id}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar invertTabs={!scrolled} />

      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image src="/blog/blog 6.png" alt="MOQ flexibility for small brands" fill className="object-cover" style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)", WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }} />
        <div className="absolute inset-0 bg-black/40" />
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2A2E] mb-4">MOQ Worries? How Krazy Kreators Supports Small Brands with Flexible Quantities</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">Manufacturing</span>
                <span className="text-sm text-[#666666]">8 min read</span>
                <span className="text-sm text-[#666666]">•</span>
                <span className="text-sm text-[#666666]">Posted on December 8, 2024</span>
              </div>

              <div className="mb-8 p-4 bg-[#F8F7F4] rounded-xl">
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isLiked ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200" : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"}`}>
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                    </button>
                    <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                      <MessageCircle className="w-4 h-4" />
                      {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                    </button>
                  </div>
                  <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                <div className="flex flex-col gap-3 sm:hidden">
                  <div className="flex items-center justify-between">
                    <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 mr-2 ${isLiked ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200" : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"}`}>
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                      {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                    </button>
                    <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300 flex-1 ml-2">
                      <MessageCircle className="w-4 h-4" />
                      {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                    </button>
                  </div>
                  <button onClick={handleShare} className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300 w-full">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="mb-12">
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  When starting a fashion brand, one of the biggest hurdles entrepreneurs face is MOQ (Minimum Order Quantity). Manufacturers often require hundreds—sometimes thousands—of units per style, which can overwhelm emerging labels. At Krazy Kreators, we understand these challenges, so we designed our production model around flexibility and partnership.
                </p>
                <p className="text-lg text-[#666666] leading-relaxed">
                  We make it possible for small brands, independent designers, and startups to launch collections without being crushed under large volume commitments. Here’s how we empower you to grow on your own terms:
                </p>
              </div>

              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Flexible Order Quantities That Match Your Stage</h2>
                  <p className="text-lg text-[#666666] leading-relaxed mb-6">
                    While most manufacturers demand 300–500 units per design, we comfortably start at 20–50 pieces so you can test the market without overcommitting.
                  </p>
                  <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                    <li>Test new designs with minimal risk.</li>
                    <li>Launch your brand without tying up cash in inventory.</li>
                    <li>Avoid excess stock that sits unsold.</li>
                  </ul>
                </div>
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog 6_1.png" alt="Flexible MOQ support" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog 6_2.png" alt="Supporting emerging fashion brands" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Helping Startups, Creators & Niche Brands</h2>
                  <p className="text-lg text-[#666666] leading-relaxed mb-6">
                    Innovation often starts with small teams. We partner with brands that experiment with sustainable fabrics, inclusive sizing, and bold design directions.
                  </p>
                  <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                    <li>Startup fashion labels launching their first lines.</li>
                    <li>Custom merch creators releasing limited drops.</li>
                    <li>Boutique brands serving niche communities.</li>
                    <li>Sustainable designers producing intentional, eco-friendly runs.</li>
                  </ul>
                </div>
              </div>

              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Quality Over Quantity</h2>
                  <p className="text-lg text-[#666666] leading-relaxed mb-6">
                    Smaller orders never mean lower standards. Every piece—whether you order 20 or 20,000—goes through the same rigorous process.
                  </p>
                  <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                    <li>Fabric inspections to ensure durability and feel.</li>
                    <li>Stitching checks for strength, comfort, and finish.</li>
                    <li>Final finishing controls so your collection reflects your brand values.</li>
                  </ul>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    Your customers will recognize the craftsmanship, and your reputation grows with every launch.
                  </p>
                </div>
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog 6_3.png" alt="Quality control processes" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog 6_4.png" alt="Scaling production support" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#2D2A2E] mb-6">Scaling with You as You Grow</h2>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    We evolve alongside your brand. Start with 30 units per style today, scale to hundreds or thousands tomorrow—without changing manufacturers or rebuilding your supply chain. Our infrastructure expands with your demand.
                  </p>
                </div>
              </div>

              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Personalized Support & Guidance</h2>
                  <p className="text-lg text-[#666666] leading-relaxed mb-6">
                    From sourcing to export, production can feel overwhelming. We guide you at every step so you can focus on creativity.
                  </p>
                  <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2 mb-6">
                    <li>Fabric sourcing advice that balances your vision and budget.</li>
                    <li>Design feasibility feedback to align creativity with production reality.</li>
                    <li>Launch timeline planning to keep collections on schedule.</li>
                    <li>Documentation support when you’re shipping globally.</li>
                  </ul>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    Think of us as your production partner and consultant rolled into one team.
                  </p>
                </div>
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image src="/blog/blog 6_5.png" alt="Hands-on production guidance" width={800} height={600} className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Why Flexible MOQs Matter for Small Brands</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Our approach gives emerging labels the freedom to experiment, adapt, and succeed without unnecessary stress.
                </p>
                <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                  <li>Lower startup costs with manageable cash flow.</li>
                  <li>Faster time-to-market with pilot collections.</li>
                  <li>Freedom to iterate and innovate without large inventory risk.</li>
                  <li>Less storage and wastage—more creativity.</li>
                </ul>
                <p className="text-lg text-[#666666] leading-relaxed">
                  MOQ worries stop too many talented designers from launching their dreams. We’re rewriting the rules with flexible order quantities that match your journey—whether you’re just starting or ready to scale.
                </p>
              </div>
            </div>

            {/* Post-Content Social Interaction with Integrated Comments */}
            <div className="border-t border-gray-200 pt-8 mb-12">
              <div className="p-6 bg-[#F8F7F4] rounded-xl">
                <div className="mb-8">
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button onClick={handleLike} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isLiked ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200" : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"}`}>
                        <Heart className={`w-5 h-5 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                      </button>
                      <button onClick={handleComment} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300">
                        <MessageCircle className="w-5 h-5" />
                        {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                      </button>
                    </div>
                    <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300">
                      <Share2 className="w-5 h-5" />
                      Share Article
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 sm:hidden">
                    <div className="flex items-center justify-between">
                      <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 mr-2 ${isLiked ? "bg-white text-gray-600 border border-gray-200" : "bg-white text-gray-600 border border-gray-200"}`}>
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-[#CBB49A]" : ""}`} />
                        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
                      </button>
                      <button onClick={handleComment} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 border border-gray-200 text-sm font-medium transition-all duration-300 flex-1 ml-2">
                        <MessageCircle className="w-4 h-4" />
                        {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
                      </button>
                    </div>
                    <button onClick={handleShare} className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300 w-full">
                      <Share2 className="w-4 h-4" />
                      Share Article
                    </button>
                  </div>
                </div>

                <div className="space-y-6" data-comments-section>
                  {comments.length > 0 ? (
                    <>
                      {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                        <div key={comment.id} id={`comment-${comment.id}`} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">{comment.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <div className="hidden sm:flex items-center gap-3 mb-3"><h5 className="font-semibold text-[#2D2A2E] text-lg">{comment.name}</h5><span className="text-sm text-[#666666]">•</span><span className="text-sm text-[#666666]">{comment.date}</span></div>
                              <div className="flex flex-col gap-2 sm:hidden mb-3"><div className="flex items-center gap-2"><h5 className="font-semibold text-[#2D2A2E] text-base">{comment.name}</h5><span className="text-xs text-[#666666]">{comment.date}</span></div></div>
                              <div className="bg-[#F8F7F4] rounded-lg p-3 sm:p-4">
                                <p className="text-[#2D2A2E] leading-relaxed text-sm sm:text-base break-words mb-3">{comment.comment}</p>
                                <div className="flex items-center justify-between">
                                  <button onClick={() => handleCommentLike(comment.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${likedComments.has(comment.id) ? "bg-[#CBB49A]/10 text-[#CBB49A]" : "bg-gray-100 text-gray-600 hover:bg-[#CBB49A]/10 hover:text-[#CBB49A]"}`}>
                                    <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? "fill-[#CBB49A]" : ""}`} />
                                    {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {comments.length > 3 && !showAllComments && (<div className="text-center py-4"><button onClick={() => setShowAllComments(true)} className="text-[#CBB49A] hover:text-[#b7a078] font-medium transition-colors duration-300">See More ({comments.length - 3} more comment{comments.length - 3 !== 1 ? "s" : ""})</button></div>)}
                      {comments.length > 3 && showAllComments && (<div className="text-center py-4"><button onClick={() => setShowAllComments(false)} className="text-[#CBB49A] hover:text-[#b7a078] font-medium transition-colors duration-300">See Less</button></div>)}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"><MessageCircle className="w-10 h-10 text-gray-400" /></div>
                      <h5 className="text-xl font-semibold text-[#2D2A2E] mb-3">No comments yet</h5>
                      <p className="text-[#666666] text-lg">Be the first to share your thoughts on this article!</p>
                      <p className="text-sm text-[#999999] mt-2">Your comment will help others learn and engage with the content.</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-8 mt-8 shadow-lg border border-gray-100" data-comment-form>
                  <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div><h4 className="text-xl font-semibold text-[#2D2A2E]">Share Your Thoughts</h4></div>
                  {showSuccessMessage && (<div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2"><span className="text-lg">✅</span><span>Thank you! Your comment has been posted successfully.</span></div>)}
                  <form onSubmit={handleSubmitComment} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label htmlFor="name" className="block text-sm font-medium text-[#2D2A2E] mb-3">Your Name *</label><input id="name" name="name" value={newComment.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBB49A] focus:border-transparent transition-all duration-300" placeholder="Enter your full name" required /></div>
                      <div><label htmlFor="email" className="block text-sm font-medium text-[#2D2A2E] mb-3">Email Address *</label><input id="email" name="email" type="email" value={newComment.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBB49A] focus:border-transparent transition-all duration-300" placeholder="your.email@example.com" required /></div>
                    </div>
                    <div><label htmlFor="comment" className="block text-sm font-medium text-[#2D2A2E] mb-3">Your Comment *</label><textarea id="comment" name="comment" value={newComment.comment} onChange={handleInputChange} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBB49A] focus:border-transparent transition-all duration-300 resize-none" placeholder="Share your thoughts, questions, or feedback about this article..." required /></div>
                    <div className="hidden sm:flex items-center justify-between pt-4"><div className="text-sm text-[#666666]"><span className="font-medium">{commentCount}</span> comment{commentCount !== 1 ? "s" : ""} so far</div><Button type="submit" disabled={isSubmitting || !newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()} className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">{isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Posting...</>) : (<><MessageCircle className="w-4 h-4" /> Post Comment</>)}</Button></div>
                    <div className="flex flex-col gap-4 sm:hidden pt-4"><div className="text-sm text-[#666666] text-center"><span className="font-medium">{commentCount}</span> comment{commentCount !== 1 ? "s" : ""} so far</div><Button type="submit" disabled={isSubmitting || !newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()} className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full">{isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Posting...</>) : (<><MessageCircle className="w-4 h-4" /> Post Comment</>)}</Button></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F7F4]">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
          <div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">Explore More Insights</h2><p className="text-lg text-[#666666] max-w-2xl mx-auto">Discover more articles about fashion design, manufacturing, and industry insights.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group">
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden">
                    <Image src={blog.image} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3"><span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.category === "design" ? "bg-blue-100 text-blue-600" : blog.category === "manufacturing" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"}`}>{blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}</span><span className="text-sm text-[#666666]">{blog.readTime}</span></div>
                    <h2 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2">{blog.title}</h2>
                    <p className="text-[#666666] text-sm leading-relaxed mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-[#666666] mb-4"><span>{blog.author}</span><span>{blog.date}</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-4 text-sm text-[#666666]"><div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{blog.readers.toLocaleString()}</span></div><div className="flex items-center gap-1"><Heart className="w-4 h-4" /><span>{blog.likes}</span></div></div></div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F8F7F4] to-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-6">Ready to Transform Your Vision Into Reality?</h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8">Let&apos;s work together to bring your fashion vision to life with our comprehensive design and manufacturing services.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105" onClick={() => setContactOpen(true)}>Start Your Project<ArrowRight className="ml-2 h-5 w-5" /></Button>
            <Button variant="outline" className="border-[#F8F7F4] text-[#2D2A2E] hover:bg-[#F8F7F4] hover:text-[#2D2A2E] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300" onClick={() => setContactOpen(true)}><MessageSquare className="mr-2 h-5 w-5" />Get Consultation</Button>
          </div>
        </div>
      </section>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <ToastContainer />
      <Footer />
    </div>
  );
}