import LoungewearClient from "./LoungewearClient";
import { FAQS } from "./faqs";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "start-a-loungewear-clothing-brand";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "Why Loungewear Is the Smartest Category to Launch Your Clothing Brand";
const HEADLINE = "Why Loungewear Is the Smartest Category to Launch Your Clothing Brand In";
const DESCRIPTION =
    "Discover why loungewear is a smart category for new fashion brands, from product variety and comfort to manufacturing flexibility and brand growth.";
const HERO = "https://www.krazykreators.com/blog/start-a-loungewear-clothing-brand-1.jpg";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "start a loungewear clothing brand",
        "loungewear manufacturing",
        "loungewear business",
        "private label clothing manufacturer",
        "clothing brand startup",
        "custom loungewear manufacturer",
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
    datePublished: "2026-11-16",
    dateModified: "2026-11-16",
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
        "start a loungewear clothing brand, loungewear manufacturing, loungewear business, private label clothing manufacturer, clothing brand startup, custom loungewear manufacturer",
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
            <LoungewearClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
