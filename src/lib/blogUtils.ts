// Blog data for random selection
export const blogPosts = [
  {
    id: 1,
    title: "How We Translate Mood Boards Into Manufacturable Garments",
    excerpt: "Discover the intricate process of transforming creative mood boards into production-ready garments that maintain design integrity while meeting manufacturing standards.",
    category: "design",
    author: "Krazy Kreators Team",
    date: "December 20, 2024",
    readTime: "8 min read",
    image: "/blog/blog_1.png",
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
    image: "/blog/blog_2_image.png",
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
    image: "/blog/blog_3.png",
    slug: "bridging-gap-designers-factories",
    readers: 1456,
    likes: 112
  },
  {
    id: 4,
    title: "Why Best Fashion Brands Work with Dedicated Supply Chain Partners",
    excerpt: "Discover how top fashion brands leverage dedicated supply chain partnerships to streamline operations, reduce costs, and accelerate time-to-market.",
    category: "business",
    author: "Krazy Kreators Team",
    date: "December 12, 2024",
    readTime: "9 min read",
    image: "/blog/blog_4_banner.png",
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
    image: "/blog/blog_5_3.png",
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
    image: "/blog/blog_6_5.png",
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
    image: "/blog/blog_7_3.png",
    slug: "how-creative-collaboration-fuels-great-fashion-collections",
    readers: 1567,
    likes: 118
  }
];

// Function to get random blogs excluding current blog
export const getRandomBlogs = (currentBlogId: number, count: number = 3) => {
  const otherBlogs = blogPosts.filter(blog => blog.id !== currentBlogId);
  const shuffled = [...otherBlogs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
