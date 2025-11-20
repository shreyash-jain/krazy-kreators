import { getSupabaseClient } from "@/lib/supabaseClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogSlugClient from "./BlogSlugClient";
import { blogPosts } from "@/data/blogPosts";

export const dynamic = 'force-dynamic';

async function fetchBlog(slug: string) {
  const supabase = getSupabaseClient();
  let data = null;

  if (supabase) {
    const result = await supabase
      .from("blogs")
      .select("id, title, excerpt, author, image, published_at, content_json, category, slug")
      .eq("slug", slug)
      .maybeSingle();
    data = result.data;
  }

  if (!data) {
    const staticPost = blogPosts.find(p => p.slug === slug);
    if (staticPost) {
      return {
        ...staticPost,
        published_at: staticPost.date, // Map date to published_at
        content_json: null // Static posts don't have content_json yet
      };
    }
  }

  return data as any;
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogBySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const blog = await fetchBlog(slug);

  if (!blog) {
    return <div className="p-6">Not found</div>;
  }

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount(slug, { baseUrl }),
    getComments(slug, { baseUrl }),
  ]);

  return (
    <BlogSlugClient
      blog={blog}
      initialLikeCount={likeCount}
      initialComments={comments}
    />
  );
}


