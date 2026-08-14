import PrivateLabelVsCustomClient from "./PrivateLabelVsCustomClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "private-label-vs-custom-clothing-manufacturing";
const URL = `https://krazykreators.com/blogs/${SLUG}`;

export const metadata = {
    title: "Private Label vs Custom Clothing Manufacturing | Krazy Kreators",
    description:
        "Private label vs custom clothing manufacturing, compared in plain English: real per-unit costs, MOQs, timelines, and which model fits your brand right now.",
    keywords: [
        "private label vs custom clothing manufacturing",
        "private label clothing manufacturing",
        "custom clothing manufacturing vs private label",
        "private label fashion brand",
        "white label clothing",
        "custom apparel production",
        "which manufacturing model to choose",
        "cut and sew vs private label",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: "Private Label vs Custom Clothing Manufacturing",
        description:
            "One route rents you a garment. The other builds one you own. Here is what each costs, how long each takes, and which fits where you are now.",
        images: ["/blog/private-label-vs-custom-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Private Label vs Custom Clothing Manufacturing",
        description:
            "One route rents you a garment. The other builds one you own. Here is what each costs, how long each takes, and which fits where you are now.",
        images: ["/blog/private-label-vs-custom-hero.jpg"],
    },
};

export default async function PrivateLabelVsCustomPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(SLUG, { baseUrl }),
        getComments(SLUG, { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                headline: "Private Label vs Custom Clothing Manufacturing",
                description:
                    "Private label vs custom clothing manufacturing, compared in plain English: real per-unit costs, MOQs, timelines, and which model fits your brand right now.",
                image: "https://krazykreators.com/blog/private-label-vs-custom-hero.jpg",
                datePublished: "2026-08-14",
                dateModified: "2026-08-14",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Manufacturing",
                keywords:
                    "private label vs custom clothing manufacturing, private label clothing manufacturing, custom clothing manufacturing vs private label, white label clothing, custom apparel production",
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: "https://krazykreators.com" },
                    { "@type": "ListItem", position: 2, name: "Blogs", item: "https://krazykreators.com/blogs" },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "Private Label vs Custom Clothing Manufacturing",
                        item: URL,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogViewTracker slug={SLUG} />
            <PrivateLabelVsCustomClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
            />
        </>
    );
}
