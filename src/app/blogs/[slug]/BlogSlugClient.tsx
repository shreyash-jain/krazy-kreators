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
import { likeBlog, addComment, likeComment, getComments, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";
import BlogRenderer from "@/components/BlogRenderer";
import BlogViewTracker from "@/components/BlogViewTracker";
import { format } from "date-fns";

type Blog = {
    id?: string | number;
    title: string;
    slug: string;
    excerpt?: string;
    author?: string;
    image?: string;
    category?: string;
    published_at?: string;
    content_json?: { blocks?: Array<{ type: string; data: Record<string, unknown> }> } | null;
};

type BlogSlugClientProps = {
    blog: Blog;
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function BlogSlugClient({ blog, initialLikeCount, initialComments }: BlogSlugClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [commentCount, setCommentCount] = useState(initialComments.length);
    const [comments, setComments] = useState<Array<{ id: string; name: string; email: string; comment: string; date: string; avatar: string; likes: number }>>(() =>
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
    const [newComment, setNewComment] = useState({
        name: "",
        email: "",
        comment: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const { showToast, ToastContainer } = useToast();

    // Filter related blogs, excluding the current one
    const [relatedBlogs] = useState(() =>
        blogPosts
            .filter((post) => post.slug !== blog.slug)
            .slice(0, 3)
    );

    useEffect(() => {
        if (typeof window === "undefined") return;
        const onScroll = () => setScrolled(window.scrollY > 100);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Refetch comments on mount to ensure we have the latest data (including deletions)
    useEffect(() => {
        const fetchLatestComments = async () => {
            try {
                const latestComments = await getComments(blog.slug);
                const formattedComments = (latestComments || []).map((c) => ({
                    id: c.id,
                    name: c.name,
                    email: c.email,
                    comment: c.comment,
                    date: new Date(c.created_at).toLocaleString(),
                    avatar: (c.name || '?').charAt(0).toUpperCase(),
                    likes: c.likes ?? 0,
                }));
                setComments(formattedComments);
                setCommentCount(formattedComments.length);
            } catch (error) {
                console.error('Error fetching latest comments:', error);
                // If fetch fails, keep using initial comments
            }
        };

        fetchLatestComments();
    }, [blog.slug]);

    const handleLike = async () => {
        try {
            const action = isLiked ? 'unlike' : 'like';
            const newCount = await likeBlog(blog.slug, action);
            recordBlogLikeUpdate(blog.slug, newCount);
            setIsLiked(!isLiked);
            setLikeCount(newCount);
        } catch {
            // Ignore like errors to keep UI stable
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast("Link copied to clipboard!", "success");
        } catch (e) {
            console.log(e);
            showToast("Failed to copy link", "error");
        }
    };

    const handleComment = () => {
        // Scroll to existing comments when comments button is clicked
        const commentsSection = document.querySelector("[data-comments-section]");
        if (commentsSection) {
            setTimeout(() => {
                commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    };

    const handleCommentLike = async (commentId: string) => {
        try {
            const action = likedComments.has(commentId) ? 'unlike' : 'like';
            const newCount = await likeComment(commentId, action);
            setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, likes: newCount } : c));
            
            // Toggle the liked state only if API call succeeds
            setLikedComments(prev => {
                const newSet = new Set(prev);
                if (newSet.has(commentId)) {
                    newSet.delete(commentId);
                } else {
                    newSet.add(commentId);
                }
                return newSet;
            });
        } catch {
            // If API call fails, don't change the liked state
            console.error('Failed to toggle like for comment:', commentId);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const created = await addComment({ 
                blogId: blog.slug, 
                name: newComment.name.trim(), 
                email: newComment.email.trim(), 
                comment: newComment.comment.trim() 
            });
            const newCommentData = {
                id: created.id,
                name: created.name,
                email: created.email,
                comment: created.comment,
                date: new Date(created.created_at).toLocaleString(),
                avatar: (created.name || '?').charAt(0).toUpperCase(),
                likes: 0,
            };
            setComments(prev => [newCommentData, ...prev]);
            setCommentCount(prev => prev + 1);
            setNewComment({ name: "", email: "", comment: "" });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            setTimeout(() => {
                const el = document.getElementById(`comment-${newCommentData.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            showToast('Comment posted successfully!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to post comment. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format date
    const formattedDate = blog.published_at
        ? format(new Date(blog.published_at), "MMMM d, yyyy")
        : "Recently";

    // Estimate read time if not provided (simple estimation)
    const readTime = "5 min read";

    return (
        <div className="min-h-screen bg-white">
            <BlogViewTracker slug={blog.slug} />
            <Navbar invertTabs={!scrolled} />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
                {blog.image ? (
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)", WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden" }}
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Cover Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40" />
            </section>

            {/* Content Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="w-full">
                        <div className="mb-8">
                            <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2A2E] mb-4">{blog.title}</h1>
                            <div className="flex items-center gap-4 mb-6 flex-wrap">
                                <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">
                                    {blog.category || "Insights"}
                                </span>
                                <span className="text-sm text-[#666666]">{readTime}</span>
                                <span className="text-sm text-[#666666]">•</span>
                                <span className="text-sm text-[#666666]">Posted on {formattedDate}</span>
                                {blog.author && (
                                    <>
                                        <span className="text-sm text-[#666666]">•</span>
                                        <span className="text-sm text-[#666666]">By {blog.author}</span>
                                    </>
                                )}
                            </div>

                            {/* Interaction Bar */}
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

                                {/* Mobile Interaction Bar */}
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

                        {/* Blog Content */}
                        <div className="prose prose-lg max-w-none">
                            {blog.content_json?.blocks ? (
                                <BlogRenderer blocks={blog.content_json.blocks} />
                            ) : (
                                <p className="text-gray-500 italic">No content available.</p>
                            )}
                        </div>

                        {/* Comments Display */}
                        <div className="space-y-6 mt-12" data-comments-section>
                            {/* Existing Comments */}
                            {comments.length > 0 ? (
                                <>
                                    {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                                        <div key={comment.id} id={`comment-${comment.id}`} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#CBB49A] rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0">
                                                    {comment.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    {/* Desktop Layout */}
                                                    <div className="hidden sm:flex items-center gap-3 mb-3">
                                                        <h5 className="font-semibold text-[#2D2A2E] text-lg">{comment.name}</h5>
                                                        <span className="text-sm text-[#666666]">•</span>
                                                        <span className="text-sm text-[#666666]">{comment.date}</span>
                                                    </div>
                                                    
                                                    {/* Mobile Layout */}
                                                    <div className="flex flex-col gap-2 sm:hidden mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <h5 className="font-semibold text-[#2D2A2E] text-base">{comment.name}</h5>
                                                            <span className="text-xs text-[#666666]">{comment.date}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-[#F8F7F4] rounded-lg p-3 sm:p-4">
                                                        <p className="text-[#2D2A2E] leading-relaxed text-sm sm:text-base break-words mb-3">
                                                            {comment.comment}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <button
                                                                onClick={() => handleCommentLike(comment.id)}
                                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                                                                    likedComments.has(comment.id)
                                                                        ? "bg-[#CBB49A]/10 text-[#CBB49A]"
                                                                        : "bg-gray-100 text-gray-600 hover:bg-[#CBB49A]/10 hover:text-[#CBB49A]"
                                                                }`}
                                                            >
                                                                <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? 'fill-[#CBB49A]' : ''}`} />
                                                                {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* See More Button */}
                                    {comments.length > 3 && !showAllComments && (
                                        <div className="text-center py-4">
                                            <button
                                                onClick={() => setShowAllComments(true)}
                                                className="text-[#CBB49A] hover:text-[#b7a078] font-medium transition-colors duration-300"
                                            >
                                                See More ({comments.length - 3} more comment{comments.length - 3 !== 1 ? 's' : ''})
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* See Less Button */}
                                    {comments.length > 3 && showAllComments && (
                                        <div className="text-center py-4">
                                            <button
                                                onClick={() => setShowAllComments(false)}
                                                className="text-[#CBB49A] hover:text-[#b7a078] font-medium transition-colors duration-300"
                                            >
                                                See Less
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageCircle className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h5 className="text-xl font-semibold text-[#2D2A2E] mb-3">No comments yet</h5>
                                    <p className="text-[#666666] text-lg">Be the first to share your thoughts on this article!</p>
                                    <p className="text-sm text-[#999999] mt-2">Your comment will help others learn and engage with the content.</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Comment Form - Always Visible (Below Comments) */}
                        <div className="bg-white rounded-2xl p-8 mt-8 shadow-lg border border-gray-100" data-comment-form>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-[#CBB49A] rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-[#2D2A2E]">Share Your Thoughts</h4>
                            </div>

                            {/* Success Message */}
                            {showSuccessMessage && (
                                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                                    <span className="text-lg">✅</span>
                                    <span>Thank you! Your comment has been posted successfully.</span>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmitComment} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-[#2D2A2E] mb-3">Your Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={newComment.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBB49A] focus:border-transparent transition-all duration-300"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-[#2D2A2E] mb-3">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={newComment.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBB49A] focus:border-transparent transition-all duration-300"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-[#2D2A2E] mb-3">Your Comment *</label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        value={newComment.comment}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBB49A] focus:border-transparent transition-all duration-300 resize-none"
                                        placeholder="Share your thoughts, questions, or feedback about this article..."
                                        required
                                    ></textarea>
                                    <p className="text-xs text-[#666666] mt-2">
                                        Your email will be visible to other readers. Please be respectful in your comments.
                                    </p>
                                </div>
                                
                                {/* Desktop Layout */}
                                <div className="hidden sm:flex items-center justify-between pt-4">
                                    <div className="text-sm text-[#666666]">
                                        <span className="font-medium">{commentCount}</span> comment{commentCount !== 1 ? 's' : ''} so far
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()}
                                        className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <MessageCircle className="w-4 h-4" />
                                                Post Comment
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Mobile Layout */}
                                <div className="flex flex-col gap-4 sm:hidden pt-4">
                                    <div className="text-sm text-[#666666] text-center">
                                        <span className="font-medium">{commentCount}</span> comment{commentCount !== 1 ? 's' : ''} so far
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()}
                                        className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <MessageCircle className="w-4 h-4" />
                                                Post Comment
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Blogs Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F7F4]">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">Explore More Insights</h2>
                        <p className="text-lg text-[#666666] max-w-2xl mx-auto">Discover more articles about fashion design, manufacturing, and industry insights.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedBlogs.map((post) => (
                            <Link key={post.id} href={`/blogs/${post.slug}`} className="group">
                                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                                    <div className="aspect-video relative overflow-hidden">
                                        <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.category === "design" ? "bg-blue-100 text-blue-600" : post.category === "manufacturing" ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"}`}>{post.category.charAt(0).toUpperCase() + post.category.slice(1)}</span>
                                            <span className="text-sm text-[#666666]">{post.readTime}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2">{post.title}</h2>
                                        <p className="text-[#666666] text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                                        <div className="flex items-center justify-between text-sm text-[#666666] mb-4">
                                            <span>{post.author}</span>
                                            <span>{post.date}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-[#666666]">
                                                <div className="flex items-center gap-1"><Eye className="w-4 h-4" /><span>{post.readers.toLocaleString()}</span></div>
                                                <div className="flex items-center gap-1"><Heart className="w-4 h-4" /><span>{post.likes}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F8F7F4] to-white">
                <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-6">Ready to Transform Your Vision Into Reality?</h2>
                    <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8">Let&apos;s work together to bring your fashion vision to life with our comprehensive design and manufacturing services.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105" onClick={() => setContactOpen(true)}>
                            Start Your Project
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" className="border-[#F8F7F4] text-[#2D2A2E] hover:bg-[#F8F7F4] hover:text-[#2D2A2E] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300" onClick={() => setContactOpen(true)}>
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Get Consultation
                        </Button>
                    </div>
                </div>
            </section>

            <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
            <ToastContainer />
            <Footer />
        </div>
    );
}
