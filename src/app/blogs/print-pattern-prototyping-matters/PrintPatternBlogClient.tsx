"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle, Eye } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { getRandomBlogs } from "@/lib/blogUtils";
import { useToast } from "@/components/Toast";
import { likeBlog, addComment, likeComment, type PublicComment } from "@/lib/blogApi";
import { recordBlogLikeUpdate } from "@/lib/blogLikeSync";

const BLOG_ID = 'print-pattern-prototyping-matters';

type PrintPatternBlogClientProps = {
  initialLikeCount: number;
  initialComments: PublicComment[];
};

export default function PrintPatternBlogClient({ initialLikeCount, initialComments }: PrintPatternBlogClientProps) {
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
  const [relatedBlogs] = useState(() => getRandomBlogs(2));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Disabled auto-scroll to prevent scroll conflicts
  // useEffect(() => {
  //   if (!endOfArticleRef.current || hasAutoOpenedComments.current) return;

  //   const observer = new IntersectionObserver((entries) => {
  //     const [entry] = entries;
  //     if (entry?.isIntersecting && !hasAutoOpenedComments.current) {
  //       hasAutoOpenedComments.current = true;
  //       const commentForm = document.querySelector('[data-comment-form]');
  //       if (commentForm) {
  //         setTimeout(() => {
  //           commentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //         }, 100);
  //       }
  //     }
  //   }, {
  //     root: null,
  //     threshold: 0.1,
  //     rootMargin: '0px 0px -100px 0px'
  //   });

  //   observer.observe(endOfArticleRef.current);

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [endOfArticleRef]);

  const handleLike = async () => {
    try {
      const action = isLiked ? 'unlike' : 'like';
      const newCount = await likeBlog(BLOG_ID, action);
      recordBlogLikeUpdate(BLOG_ID, newCount);
      setIsLiked(!isLiked);
      setLikeCount(newCount);
    } catch (_) {}
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!', 'success');
    } catch (error) {
      console.log('Error copying to clipboard:', error);
      showToast('Failed to copy link', 'error');
    }
  };

  const handleComment = () => {
    // Scroll to existing comments when comments button is clicked
    const commentsSection = document.querySelector('[data-comments-section]');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    } catch (_) {
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
      alert('Please fill in all fields');
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar with dynamic text color */}
      <Navbar invertTabs={!scrolled} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src="/blog/blog -2 image.png"
          alt="Print, Pattern & Prototyping Process"
          fill
          className="object-cover"
          style={{
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </section>


      {/* Main Content */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
          <div className="w-full">
            {/* Article Title and Category */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2A2E] mb-4">
                Why Print, Pattern & Prototyping Matters
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">
                  Manufacturing
                </span>
                <span className="text-sm text-[#666666]">6 min read</span>
                <span className="text-sm text-[#666666]">•</span>
                <span className="text-sm text-[#666666]">Posted on March 10, 2025</span>
              </div>

              {/* Social Interaction Section */}
              <div className="mb-8 p-4 bg-[#F8F7F4] rounded-xl">
                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isLiked
                          ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                          : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                      {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                    </button>
                    
                    <button
                      onClick={handleComment}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Mobile Layout */}
                <div className="flex flex-col gap-3 sm:hidden">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 mr-2 ${
                        isLiked
                          ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                          : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                      {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                    </button>
                    
                    <button
                      onClick={handleComment}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300 flex-1 ml-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300 w-full"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg text-[#666666] leading-relaxed mb-6">
                When we see a beautiful outfit in a store or online, we usually notice the color, design, or style. But what we don&apos;t see is the hard work that goes into making that piece look and feel perfect. Behind every successful garment, there are three important steps: Print, Pattern, and Prototyping.
              </p>
            </div>

            {/* Featured Image */}
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/blog/blog -2 image.png"
                alt="Print, Pattern & Prototyping Process"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                style={{
                  WebkitTransform: 'translateZ(0)',
                  transform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
                onLoad={() => {
                  if (typeof window !== 'undefined') {
                    const img = document.querySelector('img[src="/blog/blog -2 image.png"]') as HTMLImageElement;
                    if (img) {
                      img.style.opacity = '1';
                    }
                  }
                }}
              />
            </div>

            {/* Post Details */}
            <div className="bg-[#F8F7F4] rounded-2xl p-6 mb-12">
              <h3 className="text-lg font-semibold text-[#2D2A2E] mb-4">Post Details</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CBB49A] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Hosted by March 10, 2025</p>
                  <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-[#666666] leading-relaxed mb-8">
                When we see a beautiful outfit in a store or online, we usually notice the color, design, or style. But what we don&apos;t see is the hard work that goes into making that piece look and feel perfect. Behind every successful garment, there are three important steps: Print, Pattern, and Prototyping.
              </p>

              {/* Prints Section */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Prints - The First Detail That Catches the Eye</h2>
                  <p className="text-lg text-[#666666] leading-relaxed mb-6">
                    Prints are the first detail that catches the eye. They tell a story, connect with emotions, and help a brand build its own voice.
                  </p>
                  <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2">
                    <li><strong>Creates Identity:</strong> Prints can give a brand its own style. When people see a certain print, they connect it with that brand.</li>
                    <li><strong>Adds Emotion:</strong> Prints can express feelings. Some look calm and soft, others look bold and energetic. They help the garment speak without words.</li>
                    <li><strong>Makes You Stand Out:</strong> In a market full of simple, plain clothes, a unique print can grab attention and make the collection different.</li>
                  </ul>
                </div>
                <div>
                  {/* Strategic Image 1: Prints */}
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/blog/blog 2_1.png"
                      alt="Fashion prints and patterns"
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                      style={{
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pattern Section */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/blog/blog 2_2.png"
                      alt="Pattern making and garment construction"
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                      style={{
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Pattern – The Fit & Foundation</h2>
                  <p className="text-lg text-[#666666] leading-relaxed mb-6">
                    Patterns are like the blueprint of a garment. They decide how the fabric will be cut and stitched, and how the final piece will fit the body.
                  </p>
                  <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2 mb-6">
                    <li><strong>A good pattern</strong> = clothes that fit well, look stylish, and feel comfortable.</li>
                    <li><strong>A poor pattern</strong> = clothes that feel awkward, don&apos;t sit right, and lose value.</li>
                  </ul>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    Even the best fabric won&apos;t work if the pattern isn&apos;t right. For example, the same cotton fabric can look completely different as an oversized streetwear tee versus a slim-fit formal shirt – and that&apos;s all because of the pattern.
                  </p>
                </div>
              </div>

              {/* Prototyping Section */}
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">Prototyping – The First Real Test</h2>
                  <p className="text-lg text-[#666666] leading-relaxed mb-6">
                    Prototyping is simply making the first sample of your design. It&apos;s the stage where ideas meet reality.
                  </p>
                  <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2 mb-6">
                    <li>It shows if the print looks good on fabric.</li>
                    <li>It tests whether the pattern gives the right fit.</li>
                    <li>It helps find small mistakes before bulk production.</li>
                  </ul>
                  <p className="text-lg text-[#2D2A2E] leading-relaxed font-medium">
                    For designers and brands, prototyping is like a safety net. It saves money, time, and ensures the final product matches the vision.
                  </p>
                </div>
                <div>
                  {/* Strategic Image 3: Prototyping */}
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src="/blog/blog 2_3.png"
                      alt="Prototyping and sample making process"
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                      style={{
                        WebkitTransform: 'translateZ(0)',
                        transform: 'translateZ(0)',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Conclusion */}
              <div className="mb-12">
                <p className="text-lg text-[#2D2A2E] leading-relaxed font-medium">
                  Print, Pattern, and Prototyping are the three pillars that transform a design concept into a successful garment. Each step builds upon the previous one, creating a foundation for fashion that not only looks great but feels right and functions perfectly.
                </p>
              </div>
            </div>

            {/* End of Article Marker */}
            <div className="h-4"></div>

            {/* Post-Content Social Interaction with Integrated Comments */}
            <div className="border-t border-gray-200 pt-8 mb-12">
              <div className="p-6 bg-[#F8F7F4] rounded-xl">
                {/* Social Interaction Buttons */}
                <div className="mb-8">
                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                          isLiked
                              ? "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                              : "bg-white text-gray-600 hover:bg-[#CBB49A] hover:text-white border border-gray-200"
                        }`}
                      >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                      </button>
                      
                      <button
                        onClick={handleComment}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 text-sm font-medium transition-all duration-300"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
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

                  {/* Mobile Layout */}
                  <div className="flex flex-col gap-4 sm:hidden">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex-1 mr-2 ${
                          isLiked
                              ? "bg-white text-gray-600 border border-gray-200"
                              : "bg-white text-gray-600 border border-gray-200"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#CBB49A]' : ''}`} />
                        {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
                      </button>
                      
                      <button
                        onClick={handleComment}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-gray-600 border border-gray-200 text-sm font-medium transition-all duration-300 flex-1 ml-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                      </button>
                    </div>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#CBB49A] text-white hover:bg-[#b7a078] text-sm font-medium transition-all duration-300 w-full"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Article
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-6" data-comments-section>
                  <h4 className="text-lg font-semibold text-[#2D2A2E] mb-4">Comments ({commentCount})</h4>
                  
                  {comments.length > 0 ? (
                    <>
                      {/* Comments List */}
                      <div className="space-y-6">
                        {(showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
                          <div key={comment.id} id={`comment-${comment.id}`} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
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
                      </div>
                      
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
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBB49A] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Share your thoughts on this article..."
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#999999]">
                    Your email will not be published. Required fields are marked *.
                  </p>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newComment.name.trim() || !newComment.email.trim() || !newComment.comment.trim()}
                    className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Blogs Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F7F4]">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 md:px-6 lg:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">
              Explore More Insights
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Discover more articles about fashion design, manufacturing, and industry insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group">
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        blog.category === 'design' ? 'bg-blue-100 text-blue-600' :
                        blog.category === 'manufacturing' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
                      </span>
                      <span className="text-sm text-[#666666]">{blog.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    
                    <p className="text-[#666666] text-sm leading-relaxed mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-[#666666] mb-4">
                      <span>{blog.author}</span>
                      <span>{blog.date}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-[#666666]">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.readers.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{blog.likes}</span>
                        </div>
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
        <div className="min-w-[80%] lg-max-w-[80%] mx-auto px-4 md:px-6 lg:px-0 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-6">
            Ready to Transform Your Vision Into Reality?
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8">
            Let&apos;s work together to bring your fashion vision to life with our comprehensive design and manufacturing services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={() => setContactOpen(true)}
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-[#F8F7F4] text-[#2D2A2E] hover:bg-[#F8F7F4] hover:text-[#2D2A2E] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
              onClick={() => setContactOpen(true)}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Get Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <ToastContainer />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}