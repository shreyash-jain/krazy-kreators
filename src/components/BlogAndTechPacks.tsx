import { Button } from "@/components/ui/button";

const featuredBlogs = [
  {
    title: "The Future of Sustainable Fashion Manufacturing",
    summary: "Discover how eco-friendly practices are reshaping the industry and what it means for your brand.",
    author: "Sarah Chen",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center",
  },
  {
    title: "From Concept to Collection: A Designer's Journey",
    summary: "Follow the complete process of bringing a fashion vision to life, from initial sketches to final production.",
    author: "Marcus Rodriguez",
    date: "March 12, 2024",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center",
  },
  {
    title: "Tech Packs That Actually Work: Best Practices",
    summary: "Learn the essential elements that make tech packs effective and how to avoid common pitfalls.",
    author: "Emma Thompson",
    date: "March 10, 2024",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop&crop=center",
  },
];

const techPacks = [
  {
    title: "Luxe Resortwear Pack",
    description: "Complete technical specifications for premium resortwear collection",
    tag: "Sample Tech Pack",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop&crop=center",
    downloadUrl: "#",
  },
  {
    title: "Urban Streetwear Essentials",
    description: "Technical documentation for contemporary streetwear line",
    tag: "Sample Tech Pack",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center",
    downloadUrl: "#",
  },
  {
    title: "Eco-Friendly Activewear",
    description: "Sustainable materials and construction for active lifestyle",
    tag: "Sample Tech Pack",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    downloadUrl: "#",
  },
];

export default function BlogAndTechPacks() {
  return (
    <section className="w-full bg-[#F8F7F4] py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="min-w-[80%] xl:max-w-[75%] 2xl:max-w-[70%] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        
        {/* Part 1: Featured Blogs */}
        <div className="mb-20 sm:mb-24 md:mb-28 lg:mb-32">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#2D2A2E] mb-4 sm:mb-6 leading-snug tracking-tight relative">
              From Sketch to Success: Insights from the Studio
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#6BA292] rounded-full"></div>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Expert insights, industry trends, and behind-the-scenes stories from our design studio.
            </p>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
            {featuredBlogs.map((blog, index) => (
              <article
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl border border-[#ECE9E2] shadow-[0_2px_12px_0_rgba(44,42,46,0.06)] overflow-hidden hover:shadow-[0_4px_20px_0_rgba(44,42,46,0.12)] transition-all duration-300"
              >
                {/* Blog Image */}
                <div className="h-40 sm:h-48 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Blog Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E] mb-2 sm:mb-3 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mb-3 sm:mb-4 leading-relaxed">
                    {blog.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="border-[#6BA292] text-[#6BA292] hover:bg-[#6BA292] hover:text-white transition-all duration-200 font-medium text-sm sm:text-base"
            >
              See All Blogs
            </Button>
          </div>
        </div>

        {/* Part 2: Tech Pack Downloads */}
        <div>
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#2D2A2E] mb-4 sm:mb-6 leading-snug tracking-tight relative">
              Real Tools. Real Results.
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#6BA292] rounded-full"></div>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-2xl mx-auto px-4">
              Download sample tech packs to see the level of detail and professionalism we bring to every project.
            </p>
          </div>

          {/* Tech Pack Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {techPacks.map((pack, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl border border-[#ECE9E2] shadow-[0_2px_12px_0_rgba(44,42,46,0.06)] overflow-hidden hover:shadow-[0_4px_20px_0_rgba(44,42,46,0.12)] transition-all duration-300"
              >
                {/* Tech Pack Cover */}
                <div className="h-40 sm:h-48 relative overflow-hidden">
                  <img
                    src={pack.image}
                    alt={pack.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="bg-[#6BA292] text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                      {pack.tag}
                    </span>
                  </div>
                </div>
                
                {/* Tech Pack Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#2D2A2E] mb-2 leading-tight">
                    {pack.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mb-3 sm:mb-4 leading-relaxed">
                    {pack.description}
                  </p>
                  
                  {/* Download Button */}
                  <Button
                    variant="default"
                    size="default"
                    className="w-full bg-[#6BA292] hover:bg-[#5A8A7A] text-white font-medium transition-all duration-200 text-sm sm:text-base"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 