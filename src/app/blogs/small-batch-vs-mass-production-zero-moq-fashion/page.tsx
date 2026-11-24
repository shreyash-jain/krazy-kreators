import SmallBatchClient from "./SmallBatchClient";
import { FAQS } from "./faqs";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "small-batch-vs-mass-production-zero-moq-fashion";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "Small Batch vs Mass Production: Why Zero MOQ Is the Future";
const HEADLINE = "Small Batch vs. Mass Production: Why Zero MOQ Is the Future of Fashion";
const DESCRIPTION =
    "Discover why zero MOQ and small-batch clothing manufacturing are changing the fashion industry. Explore cost, flexibility, sustainability and business benefits.";
const HERO = "https://www.krazykreators.com/blog/small-batch-vs-mass-production-zero-moq-fashion-hero.jpg";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "zero MOQ clothing manufacturer",
        "small batch clothing manufacturing",
        "small batch vs mass production",
        "low MOQ clothing manufacturers",
        "zero MOQ fashion manufacturing",
        "clothing manufacturing for startups",
        "custom clothing manufacturing",
        "sustainable fashion production",
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
    datePublished: "2026-11-24",
    dateModified: "2026-11-24",
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
        "zero MOQ clothing manufacturer, small batch clothing manufacturing, small batch vs mass production, low MOQ clothing manufacturers, zero MOQ fashion manufacturing, clothing manufacturing for startups",
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
            <SmallBatchClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
