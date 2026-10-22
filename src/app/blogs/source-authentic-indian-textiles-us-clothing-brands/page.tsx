import IndianTextileSourcingClient from "./IndianTextileSourcingClient";
import { FAQS } from "./faqs";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "source-authentic-indian-textiles-us-clothing-brands";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "Indian Textiles for US Fashion Brands: A Sourcing Guide";
const HEADLINE = "From Indian Art to Global Fashion: How US Clothing Brands Can Source Authentic Indian Textiles";
const DESCRIPTION =
    "Discover how US clothing brands can source authentic Indian textiles, evaluate suppliers, develop samples and create modern fashion collections with Indian craftsmanship.";
const HERO = `https://www.krazykreators.com/blog/${SLUG}-hero.jpg`;

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "Indian textiles for US clothing brands",
        "Indian textile manufacturers",
        "source Indian textiles",
        "Indian fabric suppliers",
        "Indian textile sourcing",
        "Indian clothing manufacturers",
        "Indian craftsmanship in fashion",
        "textile manufacturing in India",
        "custom clothing manufacturing India",
        "Indian fabrics for fashion brands",
        "sustainable Indian textiles",
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
    datePublished: "2026-10-03",
    dateModified: "2026-10-03",
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
        "Indian textiles for US clothing brands, source Indian textiles, Indian fabric suppliers, Indian textile sourcing, Indian textile manufacturers, Indian clothing manufacturers, custom clothing manufacturing India",
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
            <IndianTextileSourcingClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
