"use client";
import { useRef, useState } from "react";

export default function CoverImagePicker({ slug, value, onChange }: { slug: string; value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  async function pick() {
    inputRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("slug", slug);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button onClick={pick} className="px-3 py-2 rounded border" disabled={uploading}>{uploading ? "Uploading..." : "Upload Cover"}</button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
      {value && <div className="text-xs break-all">{value}</div>}
    </div>
  );
}

