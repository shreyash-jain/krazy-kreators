import IndianTextilesClient from "./IndianTextilesClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "indian-textiles-for-us-fashion-brands";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "Indian Textiles for US Fashion Brands: What India Offers";
const DESCRIPTION =
    "What Indian textiles offer US fashion brands: handloom range, craft, customization and small-batch production, plus what to check before you pick a manufacturer.";
const HERO = "https://www.krazykreators.com/blog/indian-textiles-for-us-fashion-brands-hero.jpg";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "Indian textiles for US fashion brands",
        "Indian textile manufacturers",
        "Indian textile sourcing",
        "Indian clothing manufacturers",
        "textile sourcing in India",
        "fashion manufacturing in India",
        "sustainable Indian textiles",
        "Indian handloom fabrics",
        "custom clothing manufacturing in India",
        "clothing manufacturer for US brands",
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
    headline: "What Indian Textiles Offer US Fashion Brands",
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
        "Indian textiles for US fashion brands, Indian textile manufacturers, Indian textile sourcing, Indian clothing manufacturers, textile sourcing in India, fashion manufacturing in India, sustainable Indian textiles",
};

// Kept in step with FAQS in IndianTextilesClient.tsx (answer 6 spells the steps out for search).
const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        ["Why are US fashion brands sourcing textiles from India?", "For range and craft more than price. India is the sixth-largest textile and apparel exporter in the world and still has a large handloom sector, so one country can supply mill-made cotton, hand-woven silk, ikat and block prints. Since 24 July 2026 Indian goods pay the normal US duty plus a 10% Section 301 duty, the lower of the two new tiers."],
        ["What types of Indian textiles can US fashion brands source?", "Cotton in woven and knit forms, khadi, Chanderi, ikat, mulberry and tussar silk, linen blends, handloom fabrics and hand block-printed cloth, along with embroidery such as zardozi and aari work. Most of these can be cut into contemporary silhouettes rather than traditional dress."],
        ["Can Indian manufacturers produce custom clothing for US brands?", "Yes. Fabric, colour, print, embroidery, construction and finishing can all be specified in a tech pack and sampled before production. The tighter your tech pack, the fewer sample rounds you need."],
        ["Can US startups order small quantities from Indian manufacturers?", "Many Indian manufacturers run small batches, though minimums vary by fabric and technique. Hand-woven and hand-printed cloth is often made in short runs anyway. Ask each manufacturer for the minimum per style and per colour before you commit."],
        ["How do I choose an Indian clothing manufacturer?", "Check fabric quality (composition, GSM, durability, colourfastness), how sampling and approval work, minimum order quantity and capacity, quality control during and after production, how they communicate, and how they pack and ship to the US. Ask for it in writing before the first sample."],
        ["How does textile sourcing from India work?", "Design and tech pack, fabric selection, sampling, approval, production, quality control and shipping. The bigger choice is whether you buy fabric only and arrange the sewing and shipping yourself, or use one partner for the whole chain."],
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
            <IndianTextilesClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
