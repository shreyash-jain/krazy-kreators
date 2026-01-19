export type BlogPostMeta = {
  id: string | number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  card_image?: string; // Optional: if not provided, use image (cover image) as fallback
  slug: string;
  readers: number;
  likes: number;
};

export const blogPosts: BlogPostMeta[] = [
  {
    id: 9,
    title: "Launching a Global Clothing Brand in 2026: The Strategic Playbook",
    excerpt: "A comprehensive guide for modern fashion entrepreneurs on navigating global manufacturing, AI efficiencies, and compliance standards for scalable success.",
    category: "business",
    author: "Krazy Kreators Team",
    date: "January 19, 2026",
    readTime: "8 min read",
    image: "/blog/how-to-start-clothing-brand-2026-banner.jpg",
    slug: "how-to-start-clothing-brand-2026",
    readers: 156,
    likes: 24,
  },
  {
    id: 8,
    title: "Costly Mistakes Fashion Startups Make (and How to Avoid Them)",
    excerpt: "Learn about the common pitfalls that derail fashion startups and discover practical strategies to avoid costly mistakes in design, manufacturing, and business operations.",
    category: "business",
    author: "Krazy Kreators Team",
    date: "December 22, 2024",
    readTime: "10 min read",
    image: "/blog/costly-mistakes-startup-make-thumbnail.jpg",
    slug: "costly-mistakes-startup-make",
    readers: 1890,
    likes: 145,
  },
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
    likes: 93,
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
    likes: 84,
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
    likes: 123,
  },
  {
    id: 4,
    title: "Why the Best Fashion Brands Work With Dedicated Supply Chain Partners",
    excerpt: "Discover why top fashion brands choose dedicated supply chain partners over traditional manufacturing approaches for better quality, reliability, and growth.",
    category: "business",
    author: "Krazy Kreators Team",
    date: "December 12, 2024",
    readTime: "9 min read",
    image: "/blog/blog_4_banner.png",
    slug: "why-best-fashion-brands-work-with-dedicated-supply-chain-partners",
    readers: 1123,
    likes: 64,
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
    likes: 87,
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
    likes: 98,
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
    likes: 112,
  },
];

export const BLOG_SLUGS = blogPosts.map((post) => post.slug);

