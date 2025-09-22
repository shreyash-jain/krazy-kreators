"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function BlogsClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const postsPerPage = 6;

  const blogPosts = [
    {
      id: 1,
      title: "How We Translate Mood Boards Into Manufacturable Garments",
      excerpt: "Discover the intricate process of transforming creative mood boards into production-ready garments that maintain design integrity while meeting manufacturing standards.",
      category: "design",
      author: "Krazy Kreators Team",
      date: "March 15, 2025",
      readTime: "8 min read",
      image: "/brands/design.jpg",
      slug: "mood-boards-to-manufacturable-garments"
    },
    {
      id: 2,
      title: "Why Print, Pattern & Prototyping Matters",
      excerpt: "Understanding the critical role of print placement, pattern accuracy, and prototyping in creating garments that not only look great but fit perfectly and function as intended.",
      category: "manufacturing",
      author: "Krazy Kreators Team",
      date: "March 10, 2025",
      readTime: "6 min read",
      image: "/brands/manufacturing.jpg",
      slug: "print-pattern-prototyping-matters"
    },
    {
      id: 3,
      title: "Sustainable Fashion: The Future of Manufacturing",
      excerpt: "Explore how sustainable practices are revolutionizing the fashion industry and learn about eco-friendly manufacturing processes that don't compromise on quality.",
      category: "sustainability",
      author: "Krazy Kreators Team",
      date: "March 5, 2025",
      readTime: "10 min read",
      image: "/brands/end-to-end.jpg",
      slug: "sustainable-fashion-future"
    },
    {
      id: 4,
      title: "Building Your Fashion Brand: A Complete Guide",
      excerpt: "From concept to launch, discover the essential steps to building a successful fashion brand that resonates with your target audience and stands out in the market.",
      category: "business",
      author: "Krazy Kreators Team",
      date: "February 28, 2025",
      readTime: "12 min read",
      image: "/brands/about-hero.jpg",
      slug: "building-fashion-brand-guide"
    },
    {
      id: 5,
      title: "The Art of Tech Pack Creation",
      excerpt: "Master the technical documentation that bridges the gap between design and production, ensuring your vision becomes reality with precision and efficiency.",
      category: "design",
      author: "Krazy Kreators Team",
      date: "February 20, 2025",
      readTime: "7 min read",
      image: "/brands/design-hero.jpg",
      slug: "art-of-tech-pack-creation"
    },
    {
      id: 6,
      title: "Quality Control in Fashion Manufacturing",
      excerpt: "Learn about the rigorous quality control processes that ensure every garment meets the highest standards before reaching your customers.",
      category: "manufacturing",
      author: "Krazy Kreators Team",
      date: "February 15, 2025",
      readTime: "9 min read",
      image: "/brands/manufacturing-plan.jpg",
      slug: "quality-control-fashion-manufacturing"
    },
    {
      id: 7,
      title: "Fashion Tech Innovation: The Next Frontier",
      excerpt: "Explore cutting-edge technologies that are reshaping the fashion industry, from AI-powered design tools to smart manufacturing processes.",
      category: "business",
      author: "Krazy Kreators Team",
      date: "February 10, 2025",
      readTime: "11 min read",
      image: "/brands/design.jpg",
      slug: "fashion-tech-innovation"
    },
    {
      id: 8,
      title: "Sustainable Materials in Modern Fashion",
      excerpt: "Discover innovative eco-friendly materials and sustainable practices that are revolutionizing the way we create and consume fashion.",
      category: "sustainability",
      author: "Krazy Kreators Team",
      date: "February 5, 2025",
      readTime: "9 min read",
      image: "/brands/end-to-end.jpg",
      slug: "sustainable-materials-fashion"
    },
    {
      id: 9,
      title: "Digital Pattern Making: A Complete Guide",
      excerpt: "Master the art of digital pattern making and learn how modern technology is streamlining the design-to-production workflow.",
      category: "design",
      author: "Krazy Kreators Team",
      date: "January 30, 2025",
      readTime: "8 min read",
      image: "/brands/design-hero.jpg",
      slug: "digital-pattern-making-guide"
    },
    {
      id: 10,
      title: "Fashion E-commerce: Trends and Strategies",
      excerpt: "Stay ahead of the curve with the latest e-commerce trends and strategies that are driving success in the digital fashion marketplace.",
      category: "business",
      author: "Krazy Kreators Team",
      date: "January 25, 2025",
      readTime: "13 min read",
      image: "/brands/about-hero.jpg",
      slug: "fashion-ecommerce-trends"
    },
    {
      id: 11,
      title: "Textile Innovation: Smart Fabrics and Beyond",
      excerpt: "Explore the future of textiles with smart fabrics, performance materials, and innovative technologies that are changing the game.",
      category: "manufacturing",
      author: "Krazy Kreators Team",
      date: "January 20, 2025",
      readTime: "10 min read",
      image: "/brands/manufacturing-plan.jpg",
      slug: "textile-innovation-smart-fabrics"
    },
    {
      id: 12,
      title: "Fashion Brand Storytelling: Connecting with Customers",
      excerpt: "Learn how to craft compelling brand stories that resonate with your audience and create lasting emotional connections in the fashion world.",
      category: "business",
      author: "Krazy Kreators Team",
      date: "January 15, 2025",
      readTime: "7 min read",
      image: "/brands/design.jpg",
      slug: "fashion-brand-storytelling"
    }
  ];

  // Filter categories
  const filterCategories = [
    { id: "all", name: "All Posts" },
    { id: "design", name: "Design" },
    { id: "manufacturing", name: "Manufacturing" },
    { id: "business", name: "Business" },
    { id: "sustainability", name: "Sustainability" },
  ];

  // Filter posts based on active filter
  const filteredPosts = activeFilter === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeFilter);

  // Sort posts by date (latest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate pagination
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-br from-[#F8F7F4] to-white overflow-hidden">
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D2A2E] mb-6">
              Ideas Worth Sharing
            </h1>
            <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto mb-8">
              Dive into the world of fashion-tech innovation. From e-commerce strategies to sustainable manufacturing, we share the insights that drive the industry forward.
            </p>
            <div className="w-16 h-0.5 bg-[#CBB49A] mx-auto mb-8"></div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Right Column (Mobile: Top, Desktop: Right) */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="space-y-8">
                {/* Filter by Category */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-[#2D2A2E] mb-4">Filter by Category</h3>
                  <div className="space-y-2">
                    {filterCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleFilterChange(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeFilter === category.id
                            ? "bg-[#CBB49A] text-white"
                            : "bg-[#F8F7F4] text-[#2D2A2E] hover:bg-[#CBB49A]/10"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-[#2D2A2E] mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <Link key={post.id} href={`/blogs/${post.slug}`} className="group flex gap-3 hover:bg-[#F8F7F4] p-2 rounded-lg transition-colors">
                        <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            style={{
                              WebkitTransform: 'translateZ(0)',
                              transform: 'translateZ(0)',
                              WebkitBackfaceVisibility: 'hidden',
                              backfaceVisibility: 'hidden',
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <p className="text-xs text-[#999999]">{post.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Left Column (Mobile: Bottom, Desktop: Left) */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              {currentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentPosts.map((post) => (
                    <Link key={post.id} href={`/blogs/${post.slug}`} className="group h-full">
                      <article
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 cursor-pointer h-full flex flex-col"
                        style={{
                          WebkitTransform: 'translateZ(0)',
                          transform: 'translateZ(0)',
                          WebkitBackfaceVisibility: 'hidden',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <div className="relative h-64 overflow-hidden flex-shrink-0">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            style={{
                              WebkitTransform: 'translateZ(0)',
                              transform: 'translateZ(0)',
                              WebkitBackfaceVisibility: 'hidden',
                              backfaceVisibility: 'hidden',
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                            onLoad={() => {
                              if (typeof window !== 'undefined') {
                                const img = document.querySelector(`img[src="${post.image}"]`) as HTMLImageElement;
                                if (img) {
                                  img.style.opacity = '1';
                                }
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                          
                          {/* Category chip positioned on top left */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-block px-3 py-1 bg-[#CBB49A] text-white text-xs font-semibold rounded-full shadow-lg">
                              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-[#2D2A2E] mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2 leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-[#666666] text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center text-[#CBB49A] hover:text-[#b7a078] font-medium text-sm transition-colors duration-300 group-hover:translate-x-1 mt-auto">
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-[#F8F7F4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-[#CBB49A]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2D2A2E] mb-2">No posts found</h3>
                  <p className="text-[#666666]">Check back later for new blog posts.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-[#CBB49A] text-[#CBB49A] hover:bg-[#CBB49A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          currentPage === page
                            ? "bg-[#CBB49A] text-white"
                            : "border-[#CBB49A] text-[#CBB49A] hover:bg-[#CBB49A] hover:text-white"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border-[#CBB49A] text-[#CBB49A] hover:bg-[#CBB49A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F8F7F4] to-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-6">
            Ready to Start Your Fashion Journey?
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
