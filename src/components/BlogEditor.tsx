"use client";
import { useEffect, useRef, useMemo } from "react";

type EditorData = {
  time: number;
  blocks: Array<{ type: string; data: Record<string, unknown> }>;
  version: string;
};

type BlogEditorProps = {
  initialData?: EditorData;
  onChange: (data: EditorData) => void;
  slug: string;
  onReady?: (getContent: () => Promise<EditorData | null>) => void;
};

export default function BlogEditor({ initialData, onChange, slug, onReady }: BlogEditorProps) {
  const editorRef = useRef<{ destroy?: () => void; save: () => Promise<EditorData> } | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const initializedDataRef = useRef<string | null>(null);

  // Keep refs updated to avoid re-initializing editor when props change
  const latestProps = useRef({ onChange, slug });
  useEffect(() => {
    latestProps.current = { onChange, slug };
  }, [onChange, slug]);

  // Create a stable string representation of initialData to detect changes
  const initialDataKey = useMemo(() => {
    if (!initialData) return null;
    return JSON.stringify(initialData);
  }, [initialData]);

  useEffect(() => {
    let isMounted = true;
    let initTimeoutId: NodeJS.Timeout | null = null;

    async function init() {
      // Wait for the DOM to be ready
      if (!holderRef.current) {
        // Retry after a short delay if the ref isn't ready yet
        initTimeoutId = setTimeout(init, 50);
        return;
      }

      // If we've already initialized with this exact data, don't reinitialize
      if (initialDataKey && initializedDataRef.current === initialDataKey) {
        // But make sure editor still exists
        if (editorRef.current) {
          return;
        }
      }

      // Destroy any existing editor instance first if we have one
      if (editorRef.current?.destroy) {
        try {
          editorRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying previous editor:', e);
        }
        editorRef.current = null;
      }

      const EditorJS = (await import("@editorjs/editorjs")).default as new (config: unknown) => { destroy?: () => void; save: () => Promise<EditorData> };
      const Header = (await import("@editorjs/header")).default as unknown;
      const List = (await import("@editorjs/list")).default as unknown;
      const Quote = (await import("@editorjs/quote")).default as unknown;
      const Delimiter = (await import("@editorjs/delimiter")).default as unknown;
      const Table = (await import("@editorjs/table")).default as unknown;
      const ImageTool = (await import("@editorjs/image")).default as unknown;
      const TwoColumnTool = (await import("./TwoColumnTool")).default as unknown;

      if (!isMounted || !holderRef.current) return;

      const editorData = initialData ?? { time: Date.now(), blocks: [], version: "2.29.0" };

      const editor = new EditorJS({
        holder: holderRef.current,
        data: editorData,
        autofocus: false,
        onChange: async () => {
          try {
            const data = await editor.save();
            if (data) latestProps.current.onChange(data);
          } catch (error) {
            console.warn('Error saving editor content in onChange:', error);
          }
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
      if (initialDataKey) {
        initializedDataRef.current = initialDataKey;
      }
      
      // Expose a way for parent to get current content
      if (onReady) {
        onReady(async () => {
          if (editorRef.current?.save) {
            try {
              const data = await editorRef.current.save();
              return data;
            } catch (error) {
              console.error('Error getting editor content:', error);
              return null;
            }
          }
          return null;
        });
      }
      
      console.log('EditorJS initialized successfully with data:', editorData);
    }
    
    init();
    
    return () => {
      isMounted = false;
      if (initTimeoutId) clearTimeout(initTimeoutId);
      // Don't destroy editor in cleanup if we're just updating data
      // Only destroy on unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDataKey]); // Reinitialize when initialData changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        editorRef.current?.destroy?.();
      } catch {
        // Ignore errors during cleanup
      }
      editorRef.current = null;
      initializedDataRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only initialize once on mount

  return <div ref={holderRef} />;
}


