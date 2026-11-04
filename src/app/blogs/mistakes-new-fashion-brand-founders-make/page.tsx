import FounderMistakesClient from "./FounderMistakesClient";
import { FAQS } from "./faqs";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "mistakes-new-fashion-brand-founders-make";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const HEADLINE = "7 Common Mistakes New Fashion Brand Founders Make (And How to Avoid Them)";
const TITLE = "7 Mistakes New Fashion Brand Founders Make | Expert Insights";
const DESCRIPTION =
    "Planning to launch a fashion brand? Discover 7 common mistakes new founders make and learn practical lessons from launching 50+ fashion brands.";
const HERO = "https://www.krazykreators.com/blog/mistakes-new-fashion-brand-founders-make-hero.jpg";

export const metadata = {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
        "mistakes new fashion brand founders make",
        "how to start a fashion brand",
        "fashion startup mistakes",
        "starting a clothing brand",
        "fashion brand launch strategy",
        "clothing business challenges",
        "how to grow a fashion brand",
        "fashion business tips for beginners",
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
    alternativeHeadline: "Lessons From Launching 50+ Fashion Brands",
    description: DESCRIPTION,
    image: HERO,
    datePublished: "2026-11-04",
    dateModified: "2026-11-04",
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
        "mistakes new fashion brand founders make, how to start a fashion brand, fashion startup mistakes, starting a clothing brand, fashion brand launch strategy, clothing business challenges, how to grow a fashion brand, fashion business tips for beginners",
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
            <FounderMistakesClient initialLikeCount={initialLikeCount} initialComments={initialComments} />
        </>
    );
}
