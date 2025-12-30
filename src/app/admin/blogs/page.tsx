/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X, Search, Edit2, Trash2, FileText, Link2 as LinkIcon } from "lucide-react";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<Blog>({ title: "", slug: "" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    } catch {
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
        setIsCreateOpen(false);
        router.push(`/admin/blogs/${data.blog.id}`);
        return;
      }
      if (!res.ok) setError(data?.error || "Failed to create blog");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog(id?: string) {
    if (!id || !confirm("Are you sure you want to delete this blog?")) return;
    const res = await fetch(`/api/admin/blogs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) loadBlogs();
  }

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your blog posts and content</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Create New Blog
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading blogs...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredBlogs.map((b) => (
              <div key={b.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {b.image ? (
                      <img src={b.image} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <FileText className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{b.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">/{b.slug}</span>
                      {b.category && <span>• {b.category}</span>}
                      {b.author && <span>• {b.author}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {b.id && (
                    <Link
                      href={`/admin/blogs/${b.id}`}
                      className="p-2 text-gray-600 hover:text-black hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/blogs/${b.slug}`);
                      alert("Copied to clipboard!");
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                    title="Copy URL"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteBlog(b.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredBlogs.length === 0 && (
              <div className="p-8 text-center text-gray-500">No blogs found.</div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Create New Blog</h2>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  placeholder="Enter blog title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || toSlug(e.target.value) })}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all font-mono text-sm"
                  placeholder="url-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: toSlug(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black/5 outline-none transition-all bg-white"
                  value={form.category ?? ""}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  <option value="design">Design</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="business">Business</option>
                </select>
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!canSave || saving}
                  onClick={createBlog}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Creating..." : "Create & Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

