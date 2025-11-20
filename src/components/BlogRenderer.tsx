import Image from "next/image";

type Block = {
  type: string;
  data: any;
};

export default function BlogRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <article className="prose max-w-none">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "header": {
            const level = Math.min(Math.max(Number(block.data?.level ?? 2), 1), 4);
            const Tag = ("h" + level) as keyof JSX.IntrinsicElements;
            return <Tag key={idx} dangerouslySetInnerHTML={{ __html: block.data?.text || "" }} />;
          }
          case "paragraph": {
            return <p key={idx} dangerouslySetInnerHTML={{ __html: block.data?.text || "" }} />;
          }
          case "list": {
            const items: string[] = block.data?.items ?? [];
            if (block.data?.style === "ordered") {
              return (
                <ol key={idx} className="list-decimal pl-6">
                  {items.map((it, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
                  ))}
                </ol>
              );
            }
            return (
              <ul key={idx} className="list-disc pl-6">
                {items.map((it, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
                ))}
              </ul>
            );
          }
          case "quote": {
            return (
              <blockquote key={idx}>
                <div dangerouslySetInnerHTML={{ __html: block.data?.text || "" }} />
                {block.data?.caption && <cite className="block text-sm opacity-70">{block.data.caption}</cite>}
              </blockquote>
            );
          }
          case "delimiter": {
            return <hr key={idx} />;
          }
          case "image": {
            const url: string | undefined = block.data?.file?.url || block.data?.url;
            if (!url) return null;
            const caption: string | undefined = block.data?.caption;
            const stretched: boolean = Boolean(block.data?.stretched);
            return (
              <figure key={idx} className={stretched ? "-mx-4 md:-mx-8" : undefined}>
                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                  <Image src={url} alt={caption || ""} fill sizes="100vw" className="object-cover rounded" />
                </div>
                {caption && <figcaption className="text-sm opacity-70 mt-2">{caption}</figcaption>}
              </figure>
            );
          }
          case "callout": {
            const style = block.data?.style || "info";
            const className = style === "warning" ? "bg-yellow-50 border-yellow-300" : "bg-blue-50 border-blue-300";
            return (
              <div key={idx} className={`border rounded p-4 ${className}`} dangerouslySetInnerHTML={{ __html: block.data?.text || "" }} />
            );
          }
          case "table": {
            const rows: string[][] = block.data?.content || [];
            return (
              <div key={idx} className="overflow-x-auto">
                <table className="min-w-full">
                  <tbody>
                    {rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c} className="border px-3 py-2" dangerouslySetInnerHTML={{ __html: cell }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          case "image-grid": {
            const cols = Math.min(Math.max(Number(block.data?.cols ?? 2), 2), 3);
            const items: Array<{ url: string; alt?: string }>
              = block.data?.items ?? [];
            return (
              <div key={idx} className={`grid gap-3 ${cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                {items.map((it, i) => (
                  <div key={i} className="relative w-full" style={{ aspectRatio: "1/1" }}>
                    <Image src={it.url} alt={it.alt || ""} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover rounded" />
                  </div>
                ))}
              </div>
            );
          }
          case "embed": {
            const url = block.data?.embed || block.data?.source;
            if (!url) return null;
            return (
              <div key={idx} className="aspect-video">
                <iframe src={url} className="w-full h-full rounded" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </article>
  );
}


