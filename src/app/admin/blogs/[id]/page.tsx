"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import CoverImagePicker from "./CoverImagePicker";

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
  const [content, setContent] = useState("{\n  \"time\": 0,\n  \"blocks\": [],\n  \"version\": \"2.29.0\"\n}");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Blog</h1>
        <button onClick={save} disabled={!canSave} className="px-3 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50">Save</button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <input className="border rounded px-3 py-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="border rounded px-3 py-2 w-full" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <input className="border rounded px-3 py-2 w-full" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <input className="border rounded px-3 py-2 w-full" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="border rounded px-3 py-2 w-full" placeholder="Cover Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
            <CoverImagePicker slug={slug || id} value={image} onChange={setImage} />
            <textarea className="border rounded px-3 py-2 w-full" placeholder="Excerpt" rows={4} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Content</div>
            <BlogEditor
              slug={slug || id}
              initialData={parseJsonSafe(content) ?? { time: Date.now(), blocks: [], version: "2.29.0" }}
              onChange={(data) => setContent(JSON.stringify(data))}
            />
          </div>
        </div>
      )}
    </div>
  );
}


