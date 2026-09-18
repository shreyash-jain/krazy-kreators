import FallWinterTrendsClient from "./FallWinterTrendsClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "fall-winter-2026-apparel-trends";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "Fall/Winter 2026 Apparel Trends: What to Manufacture Next";
const DESCRIPTION =
    "Fall/Winter 2026 color and fabric trends, translated into a practical, manufacturable collection plan for small and emerging US apparel brands.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "fall winter 2026 fashion trends",
        "fall winter 2026 apparel trends",
        "color trends 2026 apparel",
        "fabric trends for clothing brands",
        "seasonal collection planning",
        "F/W 2026 manufacturing",
        "Pantone fall winter 2026 colors",
        "fall 2026 fabric trends",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: ["https://www.krazykreators.com/blog/fall-winter-2026-apparel-trends-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["https://www.krazykreators.com/blog/fall-winter-2026-apparel-trends-hero.jpg"],
    },
};

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
        "Color and Fabric Trends for Fall/Winter 2026: What to Manufacture Next",
    description: DESCRIPTION,
    image: "https://www.krazykreators.com/blog/fall-winter-2026-apparel-trends-hero.jpg",
    datePublished: "2026-09-11",
    dateModified: "2026-09-11",
    author: { "@type": "Organization", name: "Krazy Kreators", url: "https://www.krazykreators.com" },
    publisher: {
        "@type": "Organization",
        name: "Krazy Kreators",
        url: "https://www.krazykreators.com",
        logo: { "@type": "ImageObject", url: "https://www.krazykreators.com/brands/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    articleSection: "Manufacturing",
    keywords:
        "fall winter 2026 fashion trends, fall winter 2026 apparel trends, color trends 2026 apparel, fabric trends for clothing brands, seasonal collection planning, F/W 2026 manufacturing",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What are the key fall winter 2026 apparel trends in colour?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The colours both major forecasters agree on are a red-toned brown (Pantone Red Mahogany 19-1521 and Arabian Spice; WGSN Cocoa Powder), a purple-pink (Pantone Foxglove 16-1710 and Festival Fuchsia; WGSN Fresh Purple), an acid yellow-green (Pantone Acacia; WGSN Green Glow), and a warm creamy off-white (Pantone Egret 11-0103; WGSN Wax Paper). Pantone's seasonless neutrals for the season are Egret, Candied Ginger, Toffee, Underworld and Poseidon.",
            },
        },
        {
            "@type": "Question",
            name: "Which fabrics are trending for Fall/Winter 2026 clothing brands?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Weight and visible structure: yarn-dyed jacquards and brocades, bouclé, shearling and sherpa pile, plaid and tartan checks, and rigid or raw denim in heavier weights — Candiani's new range runs to 14.5 oz, about 490 g/m². For a small brand the practical order is heavier versions of fabrics you already run first, stocked checks and sherpa second, and custom jacquard or bouclé last, on one style only.",
            },
        },
        {
            "@type": "Question",
            name: "Is it too late to manufacture a Fall/Winter 2026 collection?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "For a from-scratch line, yes: about 23 weeks from a mid-September commit lands on 22 February 2027, after the season is marked down. Two windows are open. A 12-week colour-up of a style whose pattern and fabric already exist lands on 7 December by sea, or around 9 November by air, for your own site's winter floor. And the same development weeks produce Fall/Winter 2027 samples in time for MAGIC Las Vegas on 16–18 February 2027.",
            },
        },
    ],
};

export default async function Page() {
    const h = await headers();
    const host = h.get("host") ?? "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const [initialLikeCount, initialComments] = await Promise.all([
        getBlogLikeCount(SLUG, { baseUrl }),
        getComments(SLUG, { baseUrl }),
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <BlogViewTracker slug={SLUG} />
            <FallWinterTrendsClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
