import IndianHandloomClient from "./IndianHandloomClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "indian-handloom-sustainable-textiles-us-fashion-brands";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "Indian Handloom & Sustainable Textiles for US Fashion Brands";
const DESCRIPTION =
    "Discover why US fashion brands are exploring Indian handloom and sustainable textiles for distinctive, responsible and modern clothing collections.";
const HERO = "https://www.krazykreators.com/blog/indian-handloom-sustainable-textiles-us-fashion-brands-hero.jpg";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "Indian handloom textiles",
        "sustainable textiles from India",
        "Indian textiles for US fashion brands",
        "sustainable fashion sourcing",
        "Indian handloom fabric",
        "ethical textile manufacturing",
        "sustainable clothing manufacturing",
        "Indian textile manufacturers",
        "sourcing textiles from India",
        "eco-friendly fabrics",
        "Indian craftsmanship in fashion",
        "Handloom Mark",
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
    headline: "Indian Handloom & Sustainable Textiles: Why They Are Trending Among US Fashion Brands",
    description: DESCRIPTION,
    image: HERO,
    datePublished: "2026-10-23",
    dateModified: "2026-10-23",
    author: { "@type": "Organization", name: "Krazy Kreators", url: "https://www.krazykreators.com" },
    publisher: {
        "@type": "Organization",
        name: "Krazy Kreators",
        url: "https://www.krazykreators.com",
        logo: { "@type": "ImageObject", url: "https://www.krazykreators.com/brands/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    articleSection: "Sustainability",
    keywords:
        "Indian handloom textiles, sustainable textiles from India, Indian textiles for US fashion brands, sustainable fashion sourcing, Indian handloom fabric, ethical textile manufacturing, Handloom Mark",
};

// Kept in step with FAQS in IndianHandloomClient.tsx.
const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        ["Why are US fashion brands sourcing textiles from India?", "For cloth they cannot get elsewhere. India still has about 3.5 million handloom weavers and allied workers alongside a large mill sector, so a brand can buy hand-woven ikat, Chanderi or khadi and mill-made basics from the same country. The US was among India's leading handloom export markets in 2025-26."],
        ["Are Indian handloom textiles sustainable?", "Some are, and none is automatically. The weaving runs on human power and in short runs, which helps. But the yarn is usually mill-spun, the dyes may be synthetic, and the dye house matters as much as the loom. Under the FTC Green Guides, claim only what you can document: the fibre certificate, the dye process, where the cloth was made."],
        ["What Indian fabrics are popular for sustainable fashion?", "Khadi (hand-spun, hand-woven cotton), handloom cotton, ikat, Chanderi, Jamdani and Banarasi brocade are the best known. For a sustainability claim, the fibre and dye matter more than the weave: organic cotton with a GOTS certificate and natural or low-impact dyes give you something to prove."],
        ["Can Indian handloom fabrics be used for modern Western clothing?", "Yes. Handloom cotton makes a strong resort shirt, ikat works as a camp-collar shirt or light jacket, and Chanderi suits occasion tops and overlays. Plan for slight variation between fabric lots and test a washed sample before you approve production."],
        ["How can US brands verify sustainable textile suppliers in India?", "Ask for the Handloom Mark label number and the supplier's registration to prove the cloth is hand-woven, India Handloom Brand registration for quality and dye standards, GI registered-user status for named weaves, a fibre certificate such as GOTS with a transaction certificate for your lot, and lab results for shrinkage and colourfastness."],
        ["How does textile sourcing affect the sustainability of a collection?", "Most of a garment's footprint is set before it is sewn: the fibre, how the yarn was spun, how the cloth was dyed and finished, and how much of it ends up unsold. Choosing a certified fibre, a responsible dye house and a run size close to real demand does more than any label on the finished piece."],
    ].map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })),
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
            <IndianHandloomClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
