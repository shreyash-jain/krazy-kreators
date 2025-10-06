import BlogsClient from "./BlogsClient";
import { getBlogLikeCount } from "@/lib/blogApi";
import { blogPosts } from "@/data/blogPosts";

export const metadata = {
  title: "Blogs | Krazy Kreators",
  description: "Dive into the world of fashion-tech innovation. From e-commerce strategies to sustainable manufacturing, we share the insights that drive the industry forward.",
};

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const entries = await Promise.all(
    blogPosts.map(async (post) => [post.slug, await getBlogLikeCount(post.slug)] as const)
  );
  const initialLikeCounts: Record<string, number> = {};
  for (const [slug, count] of entries) initialLikeCounts[slug] = count;
  return <BlogsClient initialLikeCounts={initialLikeCounts} />;
}
