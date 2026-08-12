import ManufacturingCostClient from "./ManufacturingCostClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "custom-clothing-manufacturing-cost";
const URL = `https://krazykreators.com/blogs/${SLUG}`;

export const metadata = {
    title: "Custom Clothing Manufacturing Cost at Every MOQ Tier | Krazy Kreators",
    description:
        "Real custom clothing manufacturing cost ranges by MOQ tier — plus what drives the price: fabric, sampling, finishing, duty and freight. Read a quote line by line.",
    keywords: [
        "custom clothing manufacturing cost",
        "custom clothing manufacturing",
        "clothing manufacturing cost",
        "cost to manufacture clothing",
        "low MOQ clothing manufacturer",
        "clothing production pricing",
        "cost per garment",
        "manufacturing quote breakdown",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
        description:
            "What a custom garment actually costs at 100, 500, 1,000 and 5,000 units — and the lines a factory quote leaves out.",
        images: ["/blog/custom-manufacturing-cost-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
        description:
            "What a custom garment actually costs at 100, 500, 1,000 and 5,000 units — and the lines a factory quote leaves out.",
        images: ["/blog/custom-manufacturing-cost-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "How much does it cost to manufacture custom clothing?",
        a: "For a mid-weight cotton crew tee, factory (FOB) quotes typically run about $14–22 per unit at 50–150 units, $9–13 at 300–500, $6.50–9 at 1,000–2,500, and $5–7 at 5,000 and above. Those are per-unit production prices only. Add one-time development — tech pack, patterns, grading, samples, lab dips — of roughly $500–1,500 per style, plus freight, duty and customs fees on the way in.",
    },
    {
        q: "Why is the cost per garment higher at low MOQ?",
        a: "Two reasons. Fixed costs — pattern making, marker planning, machine setup, a dye lot minimum, one customs entry — are the same whether you make 100 units or 5,000, so each unit carries a bigger share. And mills price fabric in minimum dye-lot quantities, so a small order often pays a surcharge or buys more cloth than it uses.",
    },
    {
        q: "What drives clothing manufacturing cost the most?",
        a: "Fabric, usually. On a basic tee, fabric is commonly the single largest line in the factory price. Moving from a 180 GSM combed cotton jersey to a 240 GSM certified-organic knit can add more per unit than quintupling your order quantity saves.",
    },
    {
        q: "What does a clothing manufacturing quote leave out?",
        a: "Most quotes are FOB — the goods loaded at the origin port. They usually exclude ocean or air freight, drayage, US duty (16.5% on cotton knit tees under HTS 6109.10.00), the merchandise processing and harbor maintenance fees, customs brokerage, and the development cost you already spent getting to a sealed sample.",
    },
    {
        q: "Is a low MOQ clothing manufacturer cheaper overall?",
        a: "Cheaper in total outlay, more expensive per unit — and that is usually the right trade before demand is proven. A 5,000-unit run at $6.18 all-in is $30,900 of inventory. If you sell 400 units, the cheap per-unit price was the expensive decision.",
    },
];

export default async function ManufacturingCostPage() {
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
                headline: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
                description:
                    "Real custom clothing manufacturing cost ranges by MOQ tier — plus what drives the price: fabric, sampling, finishing, duty and freight.",
                image: "https://krazykreators.com/blog/custom-manufacturing-cost-hero.jpg",
                datePublished: "2026-08-07",
                dateModified: "2026-08-07",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Manufacturing",
                keywords:
                    "custom clothing manufacturing cost, clothing manufacturing cost, cost per garment, low MOQ clothing manufacturer, manufacturing quote breakdown",
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
                        name: "Custom Clothing Manufacturing Cost at Every MOQ Tier",
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
            <ManufacturingCostClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
