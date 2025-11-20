import { getSupabaseClient } from "@/lib/supabaseClient";
import BlogRenderer from "@/components/BlogRenderer";

export const dynamic = 'force-dynamic';

async function fetchBlog(slug: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("blogs")
    .select("id, title, excerpt, author, image, published_at, content_json")
    .eq("slug", slug)
    .maybeSingle();
  return data as any;
}

export default async function BlogBySlugPage({ params }: { params: { slug: string } }) {
  const blog = await fetchBlog(params.slug);
  if (!blog) {
    return <div className="p-6">Not found</div>;
  }
  const blocks = Array.isArray(blog?.content_json?.blocks) ? blog.content_json.blocks : [];
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      {blog.excerpt && <p className="text-muted-foreground">{blog.excerpt}</p>}
      <BlogRenderer blocks={blocks} />
    </div>
  );
}


