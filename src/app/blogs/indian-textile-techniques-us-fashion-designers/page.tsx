import IndianTextileTechniquesClient from "./IndianTextileTechniquesClient";
import { FAQS } from "./faqs";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "indian-textile-techniques-us-fashion-designers";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const HEADLINE = "Indian Textile Techniques US Fashion Designers Should Know in 2026";
const TITLE = "Indian Textile Techniques for US Designers (2026)";
const DESCRIPTION =
    "Explore Indian textile techniques for US fashion brands, from block printing and Chikankari to Ikat, handloom and natural dyeing, plus 2026 sourcing trends.";
const HERO = "https://www.krazykreators.com/blog/indian-textile-techniques-us-fashion-designers-hero.jpg";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "Indian textile techniques",
        "Indian textiles for US fashion brands",
        "Indian textile sourcing",
        "Indian clothing manufacturers",
        "Indian fabric suppliers",
        "sustainable Indian textiles",
        "Indian craftsmanship for fashion brands",
        "apparel manufacturing in India",
        "textile sourcing from India",
        "traditional Indian textiles",
        "Indian handloom techniques",
        "source clothing from India",
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
    datePublished: "2026-10-26",
    dateModified: "2026-10-26",
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
        "Indian textile techniques, Indian textiles for US fashion brands, Indian textile sourcing, Indian clothing manufacturers, Indian fabric suppliers, sustainable Indian textiles, apparel manufacturing in India",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com" },
        { "@type": "ListItem", position: 2, name: "Blogs", item: "https://www.krazykreators.com/blogs" },
        { "@type": "ListItem", position: 3, name: HEADLINE, item: URL },
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
            {[articleJsonLd, faqJsonLd, breadcrumbJsonLd].map((ld, i) => (
                <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
            ))}
            <BlogViewTracker slug={SLUG} />
            <IndianTextileTechniquesClient initialLikeCount={initialLikeCount} initialComments={initialComments} />
        </>
    );
}
