import WesternWearClient from "./WesternWearClient";
import { FAQS } from "./faqs";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "how-to-start-western-fashion-brand-2026";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "How to Start a Western Fashion Brand in 2026";
const HEADLINE = "Western Wear Is Back: How to Start a Western Fashion Brand in 2026";
const DESCRIPTION =
    "Discover how to start a western fashion brand in 2026. Explore fashion trends, fabric selection, manufacturing, branding and marketing strategies.";
const HERO = "https://www.krazykreators.com/blog/how-to-start-western-fashion-brand-2026-hero.jpg";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "how to start a western fashion brand",
        "western wear business",
        "western clothing brand",
        "clothing brand startup",
        "western wear manufacturers",
        "western fashion trends 2026",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: [HERO],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: [HERO],
    },
};

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: HEADLINE,
    description: DESCRIPTION,
    image: HERO,
    datePublished: "2026-11-19",
    dateModified: "2026-11-19",
    author: { "@type": "Organization", name: "Krazy Kreators", url: "https://www.krazykreators.com" },
    publisher: {
        "@type": "Organization",
        name: "Krazy Kreators",
        url: "https://www.krazykreators.com",
        logo: { "@type": "ImageObject", url: "https://www.krazykreators.com/brands/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    articleSection: "Business",
    keywords:
        "how to start a western fashion brand, western wear business, western clothing brand, clothing brand startup, western wear manufacturers, western fashion trends 2026",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
            <WesternWearClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
