import IndianTextileArtClient from "./IndianTextileArtClient";
import { FAQS } from "./faqs";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "indian-textile-art-us-fashion-brands";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const HEADLINE = "Indian Textile Art Meets Modern Fashion: What US Brands Can Create With Indian Craftsmanship";
const TITLE = "Indian Textile Art for US Fashion Brands | Indian Craftsmanship";
const DESCRIPTION =
    "Discover how US fashion brands can use Indian textile art, traditional craftsmanship, and custom textiles to create distinctive modern fashion collections.";
const HERO = "https://www.krazykreators.com/blog/indian-textile-art-us-fashion-brands-hero.jpg";

export const metadata = {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
        "Indian textile art",
        "Indian craftsmanship",
        "Indian textiles for US fashion brands",
        "Indian textile manufacturers",
        "traditional Indian textiles",
        "Indian handmade fabrics",
        "sustainable Indian textiles",
        "Indian textile suppliers",
        "custom textile manufacturing India",
        "Indian crafts for fashion brands",
        "ethical fashion sourcing India",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: HEADLINE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: [HERO],
    },
    twitter: {
        card: "summary_large_image",
        title: HEADLINE,
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
    datePublished: "2026-10-14",
    dateModified: "2026-10-14",
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
        "Indian textile art, Indian craftsmanship, Indian textiles for US fashion brands, traditional Indian textiles, Indian handmade fabrics, custom textile manufacturing India, ethical fashion sourcing India",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
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
            <IndianTextileArtClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
