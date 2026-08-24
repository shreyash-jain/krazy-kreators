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

const FAQS = [
    {
        q: "What is the difference between private label and custom clothing manufacturing?",
        a: "Private label starts from a garment that already exists: a supplier designed and made it, you buy it and sew your own label in. Custom, or cut and sew, starts from your own pattern — you choose the fabric, fit and construction, and the factory builds something that did not exist before you ordered it. Everything else, price, minimums and lead time, follows from that one difference.",
    },
    {
        q: "Is private label clothing manufacturing cheaper than custom?",
        a: "Per piece yes, especially in small runs. On a worked 300-piece cotton tee, private label lands near $8.48 a unit against about $14.80 for custom. But $3.00 of that gap is one-time development, which falls to $0.90 a garment at 1,000 units and $0.18 at 5,000. At volume the two converge, and custom often wins on fabric because you buy the cloth directly instead of paying someone else's margin on it.",
    },
    {
        q: "What is the minimum order for private label vs custom manufacturing?",
        a: "Private label minimums are low because the hard part is already done — commonly 24 to 100 pieces per style and colour, and sometimes as few as a dozen if you are decorating stock blanks. Custom cut and sew usually starts at 300 to 500 per style and colour, and the constraint is the fabric mill rather than the factory: knitting and dyeing a specific cloth carries its own minimum that no sewing floor can waive.",
    },
    {
        q: "Which manufacturing model should I choose for my brand?",
        a: "Choose by where your product's value sits. If customers buy you for the artwork, a good blank carries it and private label is enough. Move to custom when the fit or the fabric is the product — and when the same style has sold out at full price twice, so a 300-piece run is a restock rather than a guess. On timing, expect 3 to 5 weeks for private label against 14 to 26 weeks for a first custom style.",
    },
];

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
                faqs={FAQS}
            />
        </>
    );
}
