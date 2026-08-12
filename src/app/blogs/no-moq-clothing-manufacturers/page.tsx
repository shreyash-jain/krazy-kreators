import NoMoqClient from "./NoMoqClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "no-moq-clothing-manufacturers";
const URL = `https://krazykreators.com/blogs/${SLUG}`;

export const metadata = {
    title: "No MOQ Clothing Manufacturers: What You Really Pay | Krazy Kreators",
    description:
        "How a no MOQ clothing manufacturer actually works, what small batch clothing production costs per piece, and when launching without a bulk order pays off.",
    keywords: [
        "no MOQ clothing manufacturer",
        "low MOQ clothing manufacturing",
        "small batch clothing production",
        "minimum order quantity clothing",
        "start clothing brand small batch",
        "flexible MOQ apparel manufacturer",
        "no minimum order clothing manufacturer",
        "clothing manufacturer for small brands",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: "No MOQ Clothing Manufacturers: What You Really Pay",
        description:
            "Launching without a bulk order is real. It also costs more per piece than anyone tells you. Here is the trade, priced out.",
        images: ["/blog/no-moq-clothing-manufacturers-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "No MOQ Clothing Manufacturers: What You Really Pay",
        description:
            "Launching without a bulk order is real. It also costs more per piece than anyone tells you. Here is the trade, priced out.",
        images: ["/blog/no-moq-clothing-manufacturers-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "What is a no MOQ clothing manufacturer?",
        a: "A production partner that will make your garment without a fixed minimum order quantity per style. In practice it means one of four setups: print-on-demand on blank garments, a sample room selling short runs, a small cut-and-sew workshop, or a full-service partner holding one flexible minimum across a whole collection. Very few factories genuinely start at one piece — most of what is marketed as no MOQ is a low MOQ of roughly 10 to 50 units per style.",
    },
    {
        q: "Is zero MOQ clothing manufacturing actually possible?",
        a: "Yes, but only for certain routes. Print-on-demand is genuinely one piece at a time, because you are printing on a blank someone else already made in bulk. True custom cut-and-sew from your own pattern almost never starts at one, because the fabric mill, the dye house and the cutting table all have minimums of their own. When a supplier advertises zero MOQ on custom production, ask what the fabric minimum is. That is where the real floor sits.",
    },
    {
        q: "How much does small batch clothing production cost per piece?",
        a: "For a mid-weight cotton crew tee built from your own pattern: roughly $30 to $45 a unit at 10 to 25 pieces, $20 to $30 at 25 to 50, $14 to $22 at 50 to 150, $9 to $13 at 300 to 500, and $6.50 to $9 at 1,000 and up. On top of any of those, one-time development for the style — tech pack, pattern, grading, samples — runs about $500 to $1,500 and does not get cheaper with quantity.",
    },
    {
        q: "What is the catch with no MOQ clothing manufacturing?",
        a: "Three things. You pay two to four times more per garment, because the fixed cost of setting up a style is shared across very few units. Your fabric and color choices narrow to whatever the supplier already holds. And the per-unit economics can look so bad that a product which would be profitable at 500 units reads as a failure at 30 — so judge a small run on whether it sells, not on its margin.",
    },
    {
        q: "When should a brand move from no MOQ to a bulk order?",
        a: "When the same style has sold through at full price at least twice, and you can name the sizes and colors that sold first. That is the point where a bigger run stops being a guess and starts being a restock. Moving up one rung at a time — roughly 25, then 150, then 500 — keeps cash at risk low while each step buys you real information about demand.",
    },
];

export default async function NoMoqPage() {
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
                headline: "No MOQ Clothing Manufacturers: What You Really Pay",
                description:
                    "How a no MOQ clothing manufacturer actually works, what small batch clothing production costs per piece, and when launching without a bulk order pays off.",
                image: "https://krazykreators.com/blog/no-moq-clothing-manufacturers-hero.jpg",
                datePublished: "2026-08-10",
                dateModified: "2026-08-10",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Manufacturing",
                keywords:
                    "no MOQ clothing manufacturer, low MOQ clothing manufacturing, small batch clothing production, minimum order quantity clothing, flexible MOQ apparel manufacturer",
            },
            {
                "@type": "FAQPage",
                mainEntity: FAQS.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: "https://krazykreators.com" },
                    { "@type": "ListItem", position: 2, name: "Blogs", item: "https://krazykreators.com/blogs" },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "No MOQ Clothing Manufacturers: What You Really Pay",
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
            <NoMoqClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
