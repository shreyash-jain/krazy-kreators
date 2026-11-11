import QuietLuxuryClient from "./QuietLuxuryClient";
import { FAQS } from "./faqs";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "how-to-build-a-premium-clothing-brand";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "How to Build a Premium Clothing Brand Without Loud Logos";
const HEADLINE =
    "Quiet Luxury Explained: How to Build a Premium Clothing Brand Without Loud Logos";
const DESCRIPTION =
    "Learn how to build a premium clothing brand using quiet luxury principles, quality fabrics, timeless designs, and expert clothing manufacturing.";
const HERO = "https://www.krazykreators.com/blog/how-to-build-a-premium-clothing-brand-hero.jpg";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "how to build a premium clothing brand",
        "quiet luxury clothing brand",
        "how to start a luxury clothing brand",
        "premium clothing manufacturing",
        "quiet luxury fashion",
        "clothing brand manufacturer",
        "premium fabric sourcing",
        "luxury clothing design",
        "custom clothing production",
        "private label clothing manufacturer",
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
    datePublished: "2026-11-11",
    dateModified: "2026-11-11",
    author: { "@type": "Organization", name: "Krazy Kreators", url: "https://www.krazykreators.com" },
    publisher: {
        "@type": "Organization",
        name: "Krazy Kreators",
        url: "https://www.krazykreators.com",
        logo: { "@type": "ImageObject", url: "https://www.krazykreators.com/brands/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    articleSection: "Strategy",
    keywords:
        "how to build a premium clothing brand, quiet luxury clothing brand, how to start a luxury clothing brand, premium clothing manufacturing, quiet luxury fashion, clothing brand manufacturer, premium fabric sourcing",
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
            <QuietLuxuryClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
