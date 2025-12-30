import BlogsClient from "./BlogsClient";
import { getBlogLikeCount } from "@/lib/blogApi";
import { blogPosts, BlogPostMeta } from "@/data/blogPosts";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const metadata = {
  title: "Blogs | Krazy Kreators",
  description: "Dive into the world of fashion-tech innovation. From e-commerce strategies to sustainable manufacturing, we share the insights that drive the industry forward.",
};

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const supabase = getSupabaseClient();
  let dbBlogs: BlogPostMeta[] = [];

  if (supabase) {
    console.log('Fetching blogs from Supabase...');
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, excerpt, category, author, image, published_at, slug')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blogs from Supabase:', error);
    } else {
      console.log(`Found ${data?.length || 0} blogs in Supabase`);
    }

    if (data) {
      type SupabaseBlog = {
        id: string;
        title: string;
        excerpt: string | null;
        category: string | null;
        author: string | null;
        image: string | null;
        published_at: string;
        slug: string;
      };

      dbBlogs = data.map((b: SupabaseBlog) => ({
        id: b.id,
        title: b.title,
        excerpt: b.excerpt || '',
        category: b.category || 'general',
        author: b.author || 'Krazy Kreators Team',
        date: new Date(b.published_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        readTime: '5 min read',
        image: b.image || '/placeholder.png',
        slug: b.slug,
        readers: 0,
        likes: 0,
      }));
    }
  } else {
    console.log('Supabase client not available');
  }

  // Merge DB blogs with static blogs. 
  // You might want to sort them by date if needed, but for now just concatenating.
  const allPosts = [...dbBlogs, ...blogPosts];
  console.log(`Total posts to display: ${allPosts.length} (${dbBlogs.length} from DB, ${blogPosts.length} static)`);

  const entries = await Promise.all(
    allPosts.map(async (post) => [post.slug, await getBlogLikeCount(post.slug)] as const)
  );
  const initialLikeCounts: Record<string, number> = {};
  for (const [slug, count] of entries) initialLikeCounts[slug] = count;

  return <BlogsClient initialLikeCounts={initialLikeCounts} posts={allPosts} />;
}
