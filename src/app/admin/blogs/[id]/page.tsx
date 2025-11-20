"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import CoverImagePicker from "./CoverImagePicker";
import BlogSlugClient from "../../../blogs/[slug]/BlogSlugClient";
import BlogRenderer from "@/components/BlogRenderer";
import { Eye, X, Save, ArrowLeft, Columns2, Maximize2 } from "lucide-react";
import Link from "next/link";

function parseJsonSafe<T>(text: string): T | null {
  try { return JSON.parse(text) as T; } catch { return null; }
}

export default function AdminBlogEditorPage() {
  const routeParams = useParams();
  const id = String((routeParams as Record<string, string | string[]>)?.id ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [content, setContent] = useState("{\n  \"time\": 0,\n  \"blocks\": [],\n  \"version\": \"2.29.0\"\n}");
  const [previewMode, setPreviewMode] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "side-by-side">("single");

  const canSave = useMemo(() => title.trim() && slug.trim(), [title, slug]);

  async function loadBlog() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/blogs`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load blog");
      const blog = (data?.blogs ?? []).find((b: any) => b.id === id);
      if (!blog) return;
      setTitle(blog.title || "");
      setSlug(blog.slug || "");
      setExcerpt(blog.excerpt || "");
      setAuthor(blog.author || "");
      setImage(blog.image || "");
      setCategory(blog.category || "");
      setPublishedAt(blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : "");
      setContent(JSON.stringify(blog.content_json ?? { time: 0, blocks: [], version: "2.29.0" }, null, 2));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (id) loadBlog(); }, [id]);

  async function save() {
    const contentJson = parseJsonSafe(content);
    const payload: Record<string, unknown> = {
      id,
      title, slug, excerpt, author, image, category,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      content_json: contentJson,
    };
    const res = await fetch(`/api/admin/blogs`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || "Failed to save");
      return;
    }
    alert("Saved");
  }

  if (previewMode) {
    const blogData = {
      title,
      slug,
      excerpt,
      author,
      image,
      category,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(), // Preview as if published now or selected date
      content_json: parseJsonSafe(content),
    };

    return (
      <div className="fixed inset-0 z-50 bg-white overflow-auto">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
            Close Preview
          </button>
        </div>
        <BlogSlugClient
          blog={blogData}
          initialLikeCount={0}
          initialComments={[]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm py-4 z-10 border-b mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Edit Blog</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("single")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "single" ? "bg-white shadow-sm" : "hover:bg-gray-50"
                }`}
            >
              <Maximize2 className="w-4 h-4" />
              Single
            </button>
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === "side-by-side" ? "bg-white shadow-sm" : "hover:bg-gray-50"
                }`}
            >
              <Columns2 className="w-4 h-4" />
              Side-by-Side
            </button>
          </div>
          <button
            onClick={() => setPreviewMode(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Full Preview
          </button>
          <button
            onClick={save}
            disabled={!canSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className={viewMode === "side-by-side" ? "grid gap-8 lg:grid-cols-[300px_1fr_1fr]" : "grid gap-8 lg:grid-cols-[350px_1fr]"}>
          <div className="space-y-6">
            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h2 className="font-semibold text-lg">Settings</h2>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all font-mono text-sm"
                  placeholder="url-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Author</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  placeholder="Author Name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="design">Design</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Published Date</label>
                <input
                  type="datetime-local"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cover Image</label>
                <div className="space-y-2">
                  <input
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all text-sm"
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <CoverImagePicker slug={slug || id} value={image} onChange={setImage} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Excerpt</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all min-h-[100px]"
                  placeholder="Brief summary..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[calc(100vh-200px)]">
              <div className="border-b p-4 bg-gray-50/50 rounded-t-xl">
                <h2 className="font-semibold text-gray-900">Content Editor</h2>
              </div>
              <div className="p-6">
                <BlogEditor
                  slug={slug || id}
                  initialData={parseJsonSafe(content) ?? { time: Date.now(), blocks: [], version: "2.29.0" }}
                  onChange={(data) => setContent(JSON.stringify(data))}
                />
              </div>
            </div>
          </div>

          {viewMode === "side-by-side" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[calc(100vh-200px)] overflow-auto">
                <div className="border-b p-4 bg-gray-50/50 rounded-t-xl sticky top-0 z-10">
                  <h2 className="font-semibold text-gray-900">Live Preview</h2>
                </div>
                <div className="p-6">
                  {title && <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>}
                  {excerpt && <p className="text-lg text-gray-600 mb-6">{excerpt}</p>}
                  {image && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img src={image} alt={title} className="w-full h-auto" />
                    </div>
                  )}
                  <div className="prose prose-lg max-w-none">
                    <BlogRenderer blocks={(parseJsonSafe<{ blocks?: any[] }>(content)?.blocks) ?? []} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


