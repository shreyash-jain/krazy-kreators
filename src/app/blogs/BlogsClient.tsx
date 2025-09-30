"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Share2, Heart, Eye } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/Toast";

export default function BlogsClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [sharedPosts, setSharedPosts] = useState<Set<number>>(new Set());
  const postsPerPage = 6;
  const { showToast, ToastContainer } = useToast();

  const blogPosts = [
    {
      id: 1,
      title: "How We Translate Mood Boards Into Manufacturable Garments",
      excerpt: "Discover the intricate process of transforming creative mood boards into production-ready garments that maintain design integrity while meeting manufacturing standards.",
      category: "design",
      author: "Krazy Kreators Team",
      date: "December 20, 2024",
      readTime: "8 min read",
      image: "/blog/blog 1.png",
      slug: "mood-boards-to-manufacturable-garments",
      readers: 1247,
      likes: 89
    },
    {
      id: 2,
      title: "Why Print, Pattern & Prototyping Matters",
      excerpt: "Understanding the critical role of print placement, pattern accuracy, and prototyping in creating garments that not only look great but fit perfectly and function as intended.",
      category: "manufacturing",
      author: "Krazy Kreators Team",
      date: "December 18, 2024",
      readTime: "6 min read",
      image: "/blog/blog -2 image.png",
      slug: "print-pattern-prototyping-matters",
      readers: 892,
      likes: 67
    },
    {
      id: 3,
      title: "Bridging the Gap Between Designers & Factories: The Krazy Kreators Way",
      excerpt: "How we solve the biggest disconnect in fashion: making design intent and factory execution speak the same language through dedicated project management and quality control.",
      category: "manufacturing",
      author: "Krazy Kreators Team",
      date: "December 15, 2024",
      readTime: "7 min read",
      image: "/blog/blog 3.png",
      slug: "bridging-gap-designers-factories",
      readers: 1456,
      likes: 112
    },
    {
      id: 4,
      title: "Why the Best Fashion Brands Work With Dedicated Supply Chain Partners",
      excerpt: "Discover why top fashion brands choose dedicated supply chain partners over traditional manufacturing approaches for better quality, reliability, and growth.",
      category: "business",
      author: "Krazy Kreators Team",
      date: "December 12, 2024",
      readTime: "9 min read",
      image: "/blog/blog 4_banner.png",
      slug: "why-best-fashion-brands-work-with-dedicated-supply-chain-partners",
      readers: 1123,
      likes: 78
    },
    {
      id: 5,
      title: "Exporting Apparel from India: A Checklist for First-Time Buyers",
      excerpt: "A comprehensive guide for international buyers looking to source apparel from India, covering everything from vendor selection to quality control and logistics.",
      category: "business",
      author: "Krazy Kreators Team",
      date: "December 10, 2024",
      readTime: "11 min read",
      image: "/blog/blog 5_3.png",
      slug: "exporting-apparel-from-india-checklist-first-time-buyers",
      readers: 987,
      likes: 65
    },
    {
      id: 6,
      title: "MOQ Worries? How Krazy Kreators Supports Small Brands with Flexible Quantities",
      excerpt: "Learn how we help emerging fashion brands overcome minimum order quantity challenges with flexible production solutions tailored to small-scale operations.",
      category: "manufacturing",
      author: "Krazy Kreators Team",
      date: "December 8, 2024",
      readTime: "8 min read",
      image: "/blog/blog 6_5.png",
      slug: "moq-worries-krazy-kreators-supports-small-brands-flexible-quantities",
      readers: 1345,
      likes: 92
    },
    {
      id: 7,
      title: "How Creative Collaboration Fuels Great Fashion Collections",
      excerpt: "Explore the power of collaborative design processes and how working with experienced partners can elevate your fashion collections to new heights.",
      category: "design",
      author: "Krazy Kreators Team",
      date: "December 5, 2024",
      readTime: "10 min read",
      image: "/blog/blog 7_3.png",
      slug: "how-creative-collaboration-fuels-great-fashion-collections",
      readers: 1567,
      likes: 118
    }
  ];

  const categories = [
    { id: "all", label: "All Posts", count: blogPosts.length },
    { id: "design", label: "Design", count: blogPosts.filter(post => post.category === "design").length },
    { id: "manufacturing", label: "Manufacturing", count: blogPosts.filter(post => post.category === "manufacturing").length },
    { id: "business", label: "Business", count: blogPosts.filter(post => post.category === "business").length }
  ];

  const filteredPosts = activeFilter === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeFilter);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleShare = async (post: { id: number; title: string; excerpt: string; slug: string }, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/blogs/${post.slug}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copied to clipboard!', 'success');
      setSharedPosts(prev => {
        const newSet = new Set(prev);
        newSet.add(post.id);
        setTimeout(() => {
          setSharedPosts(prevSet => {
            const updatedSet = new Set(prevSet);
            updatedSet.delete(post.id);
            return updatedSet;
          });
        }, 2000);
        return newSet;
      });
    } catch (err) {
      console.log('Error copying to clipboard:', err);
      showToast('Failed to copy link', 'error');
    }
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'design': return 'bg-blue-100 text-blue-600';
      case 'manufacturing': return 'bg-green-100 text-green-600';
      case 'business': return 'bg-purple-100 text-purple-600';
      case 'sustainability': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#F8F7F4] to-white py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D2A2E] mb-8">
              Insights & Stories
            </h1>
            <p className="text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
              Discover the latest trends, insights, and stories from the world of fashion design, manufacturing, and business growth.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category.id
                    ? 'bg-[#CBB49A] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <Link key={post.id} href={`/blogs/${post.slug}`} className="group">
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                    <span className="text-sm text-[#666666]">{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-[#666666] text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-[#666666] mb-4">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-[#666666]">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.readers.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-[#CBB49A] text-[#CBB49A]' : ''}`} />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                          likedPosts.has(post.id)
                            ? "bg-[#CBB49A]/10 text-[#CBB49A]"
                            : "bg-gray-100 text-gray-600 hover:bg-[#CBB49A]/10 hover:text-[#CBB49A]"
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${likedPosts.has(post.id) ? 'fill-[#CBB49A]' : ''}`} />
                        {likedPosts.has(post.id) ? 'Liked' : 'Like'}
                      </button>
                      
                      <button
                        onClick={(e) => handleShare(post, e)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                          sharedPosts.has(post.id)
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {sharedPosts.has(post.id) ? (
                          <>
                            <span className="text-green-600">✓</span>
                            Copied!
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3" />
                            Share
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#666666] hover:text-[#2D2A2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#CBB49A] text-white'
                      : 'text-[#666666] hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#666666] hover:text-[#2D2A2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-[#F8F7F4] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#2D2A2E] mb-4">
            Ready to Bring Your Vision to Life?
          </h2>
          <p className="text-lg text-[#666666] mb-8">
            Let&apos;s discuss how we can help you create exceptional fashion pieces that stand out in the market.
          </p>
          <Button
            onClick={() => setContactOpen(true)}
            className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Footer />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <ToastContainer />
    </div>
  );
}