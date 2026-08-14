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
        a: "Private label starts from a garment that already exists. A supplier has already designed it, cut it, and sewn it, and you buy it, put your own label in the neck, and usually add your artwork. Custom manufacturing, also called cut and sew, starts from your own pattern: you choose the fabric, the fit, the construction and the trims, and the factory builds a garment that did not exist before you ordered it. The short version is that private label decides how a finished garment is branded, and custom decides how the garment itself is made.",
    },
    {
        q: "Is private label clothing manufacturing cheaper than custom?",
        a: "Per piece, yes, and by a wide margin at small quantities. On a worked example of a mid-weight cotton crew tee at 300 units, private label lands near $8.48 a unit all-in against about $14.80 for custom, because the custom route also has to absorb roughly $900 of one-time development for the style. But that gap closes as volume grows: development is a fixed cost, so it falls from $9.00 a garment at 100 units to about $0.90 at 1,000. At real volume the two routes converge, and custom often wins on fabric cost because you are buying the cloth directly instead of paying someone else's margin on it.",
    },
    {
        q: "What is the minimum order for private label vs custom manufacturing?",
        a: "Private label minimums are low because the hard part is already done — commonly 24 to 100 pieces per style and color, and sometimes as few as a dozen if you are decorating stock blanks. Custom cut and sew usually starts around 300 to 500 pieces per style, per color, and the reason is the fabric mill rather than the factory: knitting and dyeing a specific cloth carries its own minimum that no sewing floor can waive. Small workshops and sample rooms will go lower, roughly 30 to 50 pieces, but you pay a premium per garment for it.",
    },
    {
        q: "How long does each production model take?",
        a: "Private label is fast because you are only changing the branding on something that already exists: roughly three to five weeks from approved artwork to delivered stock, and often less if the blanks are already sitting in a domestic warehouse. Custom is a different order of magnitude. Tech pack and pattern, fabric sourcing and lab dips, two or three sample rounds, then production and freight adds up to roughly four to six months door to door for a first style. The second style in the same fabric is much faster, because the development is already paid for.",
    },
    {
        q: "When should a brand switch from private label to custom manufacturing?",
        a: "When the thing that makes your product good stops living in the artwork and starts living in the garment. If customers are buying you for a graphic, a private label blank carries it fine. If they keep asking why the fit is a bit boxy, or the fabric feels thin next to a competitor's, you have hit the ceiling of what a borrowed garment can do. The practical trigger is commercial as well as creative: the same style has sold through at full price at least twice, so a 300-piece custom run is a restock rather than a guess.",
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
