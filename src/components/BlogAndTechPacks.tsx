import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const categoryColors: Record<string, string> = {
  design: "bg-blue-100 text-blue-700",
  manufacturing: "bg-amber-100 text-amber-700",
  sustainability: "bg-emerald-100 text-emerald-700",
  business: "bg-purple-100 text-purple-700",
  "business strategy": "bg-purple-100 text-purple-700",
  default: "bg-[#CBB49A]/20 text-[#8B6B4A]",
};

const featuredPosts = blogPosts.slice(0, 3);

export default function BlogAndTechPacks() {
  return (
    <section className="w-full bg-[#F8F7F4] py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <p className="text-[#CBB49A] font-semibold text-sm uppercase tracking-widest mb-3">From the Studio</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2A2E] leading-tight">
              Insights & Resources
            </h2>
            <p className="text-gray-500 mt-3 text-base sm:text-lg max-w-xl">
              Expert guides on manufacturing, design, and building a fashion brand that lasts.
            </p>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[#2D2A2E] font-semibold text-sm hover:text-[#CBB49A] transition-colors whitespace-nowrap group"
          >
            See All Blogs
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredPosts.map((post) => {
            const colorClass = categoryColors[post.category.toLowerCase()] ?? categoryColors.default;
            const imageSrc = post.card_image ?? post.image;
            return (
              <Link
                key={post.id}
                href={`/blogs/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden flex-shrink-0">
                  <Image
                    src={imageSrc}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full capitalize ${colorClass}`}>
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#2D2A2E] leading-snug mb-3 group-hover:text-[#CBB49A] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors">
                    Read Article
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
