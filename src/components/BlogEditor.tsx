"use client";
import { useEffect, useRef } from "react";

type EditorData = {
  time: number;
  blocks: Array<{ type: string; data: Record<string, unknown> }>;
  version: string;
};

type BlogEditorProps = {
  initialData?: EditorData;
  onChange: (data: EditorData) => void;
  slug: string;
};

export default function BlogEditor({ initialData, onChange, slug }: BlogEditorProps) {
  const editorRef = useRef<{ destroy?: () => void; saver?: { save: () => Promise<EditorData> } } | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);

  // Keep refs updated to avoid re-initializing editor when props change
  const latestProps = useRef({ onChange, slug });
  useEffect(() => {
    latestProps.current = { onChange, slug };
  }, [onChange, slug]);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      if (!holderRef.current) return;
      const EditorJS = (await import("@editorjs/editorjs")).default as new (config: unknown) => { destroy?: () => void; saver?: { save: () => Promise<EditorData> } };
      const Header = (await import("@editorjs/header")).default as unknown;
      const List = (await import("@editorjs/list")).default as unknown;
      const Quote = (await import("@editorjs/quote")).default as unknown;
      const Delimiter = (await import("@editorjs/delimiter")).default as unknown;
      const Table = (await import("@editorjs/table")).default as unknown;
      const ImageTool = (await import("@editorjs/image")).default as unknown;
      const TwoColumnTool = (await import("./TwoColumnTool")).default as unknown;

      const editor = new EditorJS({
        holder: holderRef.current,
        data: initialData ?? { time: Date.now(), blocks: [], version: "2.29.0" },
        autofocus: false,
        onChange: async () => {
          const data = await editor.saver?.save();
          if (data) latestProps.current.onChange(data);
        },
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
              placeholder: 'Enter a heading',
            },
          },
          list: List,
          quote: Quote,
          delimiter: Delimiter,
          table: Table,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  const form = new FormData();
                  form.append("file", file);
                  form.append("slug", latestProps.current.slug);
                  const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error || "Upload failed");
                  return {
                    success: 1,
                    file: { url: data.url },
                  };
                },
              },
            },
          },
          twoColumn: TwoColumnTool,
        },
      });
      if (!isMounted) {
        try { editor.destroy?.(); } catch { }
        return;
      }
      editorRef.current = editor;
      console.log('EditorJS initialized with header levels:', [1, 2, 3, 4, 5, 6]);
    }
    init();
    return () => {
      isMounted = false;
      try { editorRef.current?.destroy?.(); } catch { }
      editorRef.current = null;
    };
  }, [initialData]); // Re-initialize when initialData changes

  return <div ref={holderRef} />;
}


