"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CoverImagePicker from "@/components/CoverImagePicker";

type Blog = {
  id?: string;
  title: string;
  slug: string;
  category?: string | null;
  excerpt?: string | null;
  author?: string | null;
  image?: string | null;
  published_at?: string | null;
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Blog>({ title: "", slug: "" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(() => form.title.trim() && form.slug.trim(), [form]);

  function toSlug(input: string) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function loadBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs", { cache: "no-store" });
      const data = await res.json();
      setBlogs(data?.blogs ?? []);
    } catch (_) {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  async function createBlog() {
    if (!canSave) return;
    setSaving(true);
    try {
      setError(null);
      const payload = {
        ...form,
        content_json: { time: Date.now(), blocks: [], version: "2.29.0" },
      };
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data?.blog?.id) {
        setForm({ title: "", slug: "" });
        router.push(`/admin/blogs/${data.blog.id}`);
        return;
      }
      if (!res.ok) setError(data?.error || "Failed to create blog");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog(id?: string) {
    if (!id) return;
    const res = await fetch(`/api/admin/blogs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) loadBlogs();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Blogs</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="font-semibold">Add Blog</div>
          <div className="grid gap-2">
            <input className="border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || toSlug(e.target.value) })} />
            <input className="border rounded px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: toSlug(e.target.value) })} />
            <select className="border rounded px-3 py-2" value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              <option value="design">Design</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="business">Business</option>
            </select>
            <input className="border rounded px-3 py-2" placeholder="Author" value={form.author ?? ""} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            <CoverImagePicker slug={form.slug || "new"} value={form.image ?? ""} onChange={(url) => setForm({ ...form, image: url })} />
            <textarea className="border rounded px-3 py-2" placeholder="Excerpt" value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            <button disabled={!canSave || saving} onClick={createBlog} className="px-3 py-2 rounded bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50">
              {saving ? "Saving..." : "Create"}
            </button>
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">All Blogs</div>
            <button onClick={loadBlogs} className="text-sm underline">Refresh</button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-2">
              {blogs.map((b) => (
                <div key={b.id} className="border rounded p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{b.title}</div>
                      <div className="text-xs text-muted-foreground">/{b.slug}</div>
                    </div>
                    <div className="flex gap-2">
                      {b.id && <Link href={`/admin/blogs/${b.id}`} className="text-sm underline">Open Editor</Link>}
                      <button onClick={() => deleteBlog(b.id)} className="text-red-600 text-sm">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && <div className="text-muted-foreground">No blogs found.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


