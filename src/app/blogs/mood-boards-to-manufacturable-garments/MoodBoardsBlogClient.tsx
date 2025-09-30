"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, User, Share2, Heart, MessageCircle, Eye } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { getRandomBlogs } from "@/lib/blogUtils";
import { useToast } from "@/components/Toast";

const MOCK_COMMENTS = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah@example.com",
    comment:
      "This is incredibly insightful! I've always wondered about the technical process behind mood boards. The step-by-step breakdown really helps understand how creativity meets manufacturing.",
      date: "2 days ago",
    avatar: "S",
    likes: 34
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      email: "marcus@example.com",
    comment:
      "The prototyping section really resonated with me. It's amazing how much iteration goes into getting the perfect fit and feel. Thanks for sharing this behind-the-scenes look!",
      date: "1 week ago",
    avatar: "M",
    likes: 27
    },
    {
      id: 3,
      name: "Alex Thompson",
      email: "alex@example.com",
    comment:
      "As someone new to fashion design, this article was a goldmine of information. The tech pack section especially helped me understand the importance of clear documentation.",
      date: "2 weeks ago",
    avatar: "A",
    likes: 28
  }
];

export default function MoodBoardsBlogClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => MOCK_COMMENTS.reduce((acc, comment) => acc + (comment.likes ?? 0), 0) || 89);
  const [commentCount, setCommentCount] = useState(MOCK_COMMENTS.length);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const endOfArticleRef = useRef<HTMLDivElement | null>(null);
  const hasAutoOpenedComments = useRef(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };

    // Set initial scroll state
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!endOfArticleRef.current || hasAutoOpenedComments.current) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        hasAutoOpenedComments.current = true;
        // Scroll to comment form when user reaches end of article
        const commentForm = document.querySelector('[data-comment-form]');
        if (commentForm) {
          commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, {
      root: null,
      threshold: 0.2
    });

    observer.observe(endOfArticleRef.current);

    return () => {
      observer.disconnect();
    };
  }, [endOfArticleRef]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
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

  const handleCommentLike = (commentId: number) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
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

    // Simulate API call
    setTimeout(() => {
      const newCommentData = {
        id: comments.length + 1,
        name: newComment.name.trim(),
        email: newComment.email.trim(),
        comment: newComment.comment.trim(),
        date: "Just now",
        avatar: newComment.name.charAt(0).toUpperCase(),
        likes: 0
      };

      setComments(prev => [newCommentData, ...prev]);
      setCommentCount(prev => prev + 1);
      setNewComment({ name: "", email: "", comment: "" });
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      // Scroll to the new comment
      setTimeout(() => {
        const commentElement = document.getElementById(`comment-${newCommentData.id}`);
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar with dynamic text color */}
      <Navbar invertTabs={!scrolled} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src="/blog/blog 1.png"
          alt="Mood Boards to Manufacturable Garments Process"
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
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Article Title and Category */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2A2E] mb-4">
                How We Translate Mood Boards Into Manufacturable Garments
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-[#CBB49A] text-white text-sm font-semibold rounded-full">
                  Design
                </span>
                <span className="text-sm text-[#666666]">8 min read</span>
                <span className="text-sm text-[#666666]">•</span>
                <span className="text-sm text-[#666666]">Posted on March 15, 2025</span>
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
                Every garment begins with a story — and often, that story is captured on a mood board. A mood board is not just a collage of images, colors, and textures. It&apos;s the foundation of a collection, the emotional DNA that guides the design process. But how do we move from this abstract world of inspiration to a garment that is manufacturable, wearable, and ready to reach the customer?
              </p>
              <p className="text-lg text-[#666666] leading-relaxed">
                Here&apos;s the journey step by step:
              </p>
            </div>

            {/* Featured Image */}
            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/blog/blog 1.png"
                alt="Mood Boards to Manufacturable Garments Process"
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
                    const img = document.querySelector('img[src="/blog/blog 1.png"]') as HTMLImageElement;
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
                  <p className="text-sm text-[#666666]">Hosted by March 15, 2025</p>
                  <p className="text-sm font-medium text-[#2D2A2E]">Krazy Kreators Team</p>
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-[#666666] leading-relaxed mb-8">
                Every garment begins with a story — and often, that story is captured on a mood board. A mood board is not just a collage of images, colors, and textures. It&apos;s the foundation of a collection, the emotional DNA that guides the design process. But how do we move from this abstract world of inspiration to a garment that is manufacturable, wearable, and ready to reach the customer?
              </p>

              <p className="text-lg text-[#666666] leading-relaxed mb-12">
                Here&apos;s the journey step by step:
              </p>

              {/* Step 1 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">1. Reading the Mood Board</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  The first step is interpretation. A mood board holds hidden clues — a certain shade of pink, a fluid drape in a photo, a bold geometric silhouette, or a cultural motif.
                </p>
                <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2 mb-6">
                  <li>Colors become Pantone references.</li>
                  <li>Textures hint at fabrics — silk, denim, knits, or organza.</li>
                  <li>Imagery sparks silhouettes and details — oversized sleeves, cinched waists, or minimalist cuts.</li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">2. From Inspiration to Initial Sketches</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Once the mood board direction is clear, designers begin sketching. These sketches translate abstract emotions into wearable shapes. Each detail — neckline, hemline, fit — begins to align with the board&apos;s story.
                </p>
              </div>

              {/* Step 3 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">3. Fabric & Material Selection</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  A mood board&apos;s colors and textures are matched with real-world fabrics. This step answers: What fabric will best express the drape, comfort, and mood intended? Along with base fabric, trims and accessories — zippers, buttons, embroidery, laces — are chosen to reinforce the design language.
                </p>
              </div>

              {/* Step 4 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">4. Creating the Tech Pack</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Here the idea starts becoming technical. The tech pack is the designer&apos;s language for manufacturers, including:
                </p>
                <ul className="list-disc list-inside text-lg text-[#666666] leading-relaxed space-y-2 mb-6">
                  <li>Flat sketches</li>
                  <li>Measurements and grading</li>
                  <li>Stitching details</li>
                  <li>Fabric and trim specifications</li>
                </ul>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  This is where creativity meets precision. Without this, a design can&apos;t be accurately reproduced.
                </p>
              </div>

              {/* Step 5 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">5. Prototyping</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  The first tangible form of the garment is created. A prototype or test fit (made from test fabric) helps check silhouette, fit, and construction. Adjustments are made until the garment feels true to the original vision.
                </p>
                
                {/* Strategic Image 1: Design Process */}
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/blog/blog 1_1.png"
                    alt="Design process from mood board to sketches"
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

              {/* Step 6 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">6. Sampling in Main Fabric (Designer & Client Approval)</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Once the prototype is approved, the garment is made in the actual fabric and trims chosen for production. This is the most important checkpoint — because only in the main fabric can one judge the real drape, shine, and finish. Both designers and clients review and approve this sample before moving forward.
                </p>
              </div>

              {/* Step 7 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">7. Pre-Production & Scaling</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  Once samples are approved, the garment goes into pre-production. At this stage, patterns are finalized, fabric orders placed, and manufacturing timelines locked.
                </p>
                
                {/* Strategic Image 2: Manufacturing Process */}
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/blog/blog 1_2.png"
                    alt="Manufacturing and production process"
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

              {/* Step 8 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#2D2A2E] mb-6">8. Production & Quality Checks</h2>
                <p className="text-lg text-[#666666] leading-relaxed mb-6">
                  The garment is finally manufactured in bulk. Quality checks ensure every piece matches the sample — in fit, stitching, and finish.
                </p>
                
                {/* Strategic Image 3: Final Product */}
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/blog/blog 1_3.png"
                    alt="Final manufactured garments and quality control"
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

              {/* Conclusion */}
              <div className="mb-12">
                <p className="text-lg text-[#2D2A2E] leading-relaxed font-medium">
                  Each step ensures the original inspiration doesn&apos;t get lost in the process but instead evolves into something both beautiful and manufacturable.
                </p>
              </div>

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
                        Share Article
                      </button>
                    </div>
                  </div>

                  {/* Comments Display */}
                  <div className="space-y-6" data-comments-section>
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
                                      {likedComments.has(comment.id) ? comment.likes + 1 : comment.likes} {comment.likes === 0 && !likedComments.has(comment.id) ? '' : 'likes'}
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
              </div>
            </div>
          </div>
        </section>


      {/* Other Blogs Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F7F4]">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">
              Explore More Insights
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Discover more articles about fashion design, manufacturing, and industry insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getRandomBlogs(1).map((blog) => (
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
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
