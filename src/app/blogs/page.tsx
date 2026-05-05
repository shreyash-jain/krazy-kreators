import BlogsClient from "./BlogsClient";
import { getBlogLikeCount, getBlogViewCount } from "@/lib/blogApi";
import { blogPosts, BlogPostMeta } from "@/data/blogPosts";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const metadata = {
  title: "Blogs | Krazy Kreators",
  description: "Dive into the world of fashion-tech innovation. From e-commerce strategies to sustainable manufacturing, we share the insights that drive the industry forward.",
};

export const dynamic = "force-dynamic";
export const runtime = 'edge';

export default async function BlogsPage() {
  const supabase = getSupabaseClient();
  let dbBlogs: BlogPostMeta[] = [];
  let data: unknown[] | null = null;

  if (supabase) {
    console.log('Fetching blogs from Supabase...');
    try {
      // Try with card_image first
      // Use .filter() instead of .not() as it's more reliable
      const { data: queryData, error: initialError } = await supabase
        .from('blogs')
        .select('id, title, excerpt, category, author, image, card_image, published_at, slug')
        .filter('published_at', 'not.is', null)
        .order('published_at', { ascending: false });

      let error = initialError;

      // If error occurs, try without card_image (in case column doesn't exist)
      if (error) {
        console.warn('Error with card_image column, retrying without it:', error.message || error);
        const retry = await supabase
          .from('blogs')
          .select('id, title, excerpt, category, author, image, published_at, slug')
          .filter('published_at', 'not.is', null)
          .order('published_at', { ascending: false });

        if (retry.error) {
          console.error('Error fetching blogs from Supabase:', {
            message: retry.error.message,
            details: retry.error.details,
            hint: retry.error.hint,
            code: retry.error.code,
            fullError: JSON.stringify(retry.error, Object.getOwnPropertyNames(retry.error))
          });
          error = retry.error;
        } else {
          // Map the data to include card_image as null
          data = retry.data?.map((b: Record<string, unknown>) => ({ ...b, card_image: null })) || null;
          error = null;
        }
      } else {
        data = queryData;
      }

      if (error) {
        console.error('Error fetching blogs from Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
        });
      } else {
        console.log(`Found ${data?.length || 0} blogs in Supabase`);
      }
    } catch (err) {
      console.error('Exception while fetching blogs from Supabase:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;
      console.error('Error details:', { message: errorMessage, stack: errorStack });
      data = null; // Ensure data is null on error
    }
  } else {
    console.log('Supabase client not available');
  }

  if (data) {
    type SupabaseBlog = {
      id: string;
      title: string;
      excerpt: string | null;
      category: string | null;
      author: string | null;
      image: string | null;
      card_image: string | null;
      published_at: string;
      slug: string;
    };

    dbBlogs = (data as SupabaseBlog[]).map((b) => ({
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
      card_image: b.card_image || undefined, // Use card_image if available, otherwise undefined (will fallback to image)
      slug: b.slug,
      readers: 0,
      likes: 0,
    }));
  }

  // Merge DB blogs with static blogs: deduplicate by slug (DB takes priority) and sort by date
  const slugSet = new Set<string>();
  const merged: BlogPostMeta[] = [];

  // DB blogs first (they take priority for duplicates)
  for (const post of dbBlogs) {
    if (!slugSet.has(post.slug)) {
      slugSet.add(post.slug);
      merged.push(post);
    }
  }
  // Then static blogs (skip if slug already seen from DB)
  for (const post of blogPosts) {
    if (!slugSet.has(post.slug)) {
      slugSet.add(post.slug);
      merged.push(post);
    }
  }

  // Sort all posts by date descending (newest first)
  const allPosts = merged.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  console.log(`Total posts to display: ${allPosts.length} (${dbBlogs.length} from DB, ${blogPosts.length} static)`);

  const [likeEntries, viewEntries] = await Promise.all([
    Promise.all(allPosts.map(async (post) => [post.slug, await getBlogLikeCount(post.slug)] as const)),
    Promise.all(allPosts.map(async (post) => [post.slug, await getBlogViewCount(post.slug)] as const)),
  ]);
  const initialLikeCounts: Record<string, number> = {};
  for (const [slug, count] of likeEntries) initialLikeCounts[slug] = count;
  const initialViewCounts: Record<string, number> = {};
  for (const [slug, count] of viewEntries) initialViewCounts[slug] = count;

  return (
    <BlogsClient
      initialLikeCounts={initialLikeCounts}
      initialViewCounts={initialViewCounts}
      posts={allPosts}
    />
  );
}
