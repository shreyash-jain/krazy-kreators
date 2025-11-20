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
import { likeBlog, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";
import BlogRenderer from "@/components/BlogRenderer";
import { format } from "date-fns";

type BlogSlugClientProps = {
    blog: any; // Using any for now as the Supabase type isn't strictly defined here, but we know the shape
    initialLikeCount: number;
    initialComments: PublicComment[];
};

export default function BlogSlugClient({ blog, initialLikeCount, initialComments }: BlogSlugClientProps) {
    const [contactOpen, setContactOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [commentCount] = useState(initialComments.length);
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
        // If we have a comments section, scroll to it. 
        // Currently the design doesn't explicitly show where comments go, 
        // but the original code had a button for it.
        // We might need to add a comments section or just keep the button for future use.
        const el = document.querySelector("[data-comments-section]");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Format date
    const formattedDate = blog.published_at
        ? format(new Date(blog.published_at), "MMMM d, yyyy")
        : "Recently";

    // Estimate read time if not provided (simple estimation)
    const readTime = "5 min read";

    return (
        <div className="min-h-screen bg-white">
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
