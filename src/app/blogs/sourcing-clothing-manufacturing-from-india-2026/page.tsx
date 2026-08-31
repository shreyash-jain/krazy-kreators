import IndiaSourcingClient from "./IndiaSourcingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "sourcing-clothing-manufacturing-from-india-2026";
const URL = `https://krazykreators.com/blogs/${SLUG}`;

export const metadata = {
    title: "Beyond China: Why Brands Are Sourcing From India in 2026 | Krazy Kreators",
    description:
        "Fashion brands are diversifying away from China in 2026 — why sourcing clothing manufacturing from India now costs 26.5%, and how to vet a partner there.",
    keywords: [
        "sourcing clothing manufacturing from India",
        "clothing manufacturing India",
        "sourcing from India vs China",
        "India apparel manufacturer for startups",
        "China plus one sourcing strategy",
        "best countries for clothing manufacturing 2026",
        "India garment export incentives",
        "India apparel tariff 2026",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: "Beyond China: Why More Fashion Brands Are Sourcing From India in 2026",
        description:
            "India's US tariff penalty ended on July 24. The trade data hasn't caught up yet — and the duty change alone will not pick your factory.",
        images: ["/blog/india-sourcing-2026-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Beyond China: Why More Fashion Brands Are Sourcing From India in 2026",
        description:
            "India's US tariff penalty ended on July 24. The trade data hasn't caught up yet — and the duty change alone will not pick your factory.",
        images: ["/blog/india-sourcing-2026-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "What tariff do US brands pay on clothing made in India in 2026?",
        a: "A cotton knit tee from India lands at 26.5% — the 16.5% general rate for that classification plus the 10% Section 301 forced-labor duty that took effect on 24 July 2026. The same garment from Vietnam pays 29%, and from China 36.5%, because China still carries a legacy Section 301 duty on top. Rates vary by product classification, so check the one your garment actually falls under rather than assuming the tee rate.",
    },
    {
        q: "Is sourcing clothing manufacturing from India cheaper than China now?",
        a: "On duty, yes — ten percentage points cheaper on a cotton tee, which is roughly $1.40 a unit on a $14 factory price. On the total landed number it depends on your product. China still holds a deeper man-made-fibre base and larger single-factory capacity, so for technical outerwear or a 50,000-unit programme the duty saving can be swallowed by price and lead time. For cotton-led product in the low thousands, India usually comes out ahead.",
    },
    {
        q: "Does India have a tariff advantage over Bangladesh or Sri Lanka?",
        a: "No. Bangladesh, Cambodia, Indonesia, Pakistan and Sri Lanka all sit in the same 10% tier as India, so a cotton tee from any of them clears at the same 26.5%. The July action removed India's penalty rather than granting it an edge. Anything that makes India the better choice over those origins is non-tariff — the domestic fibre-to-garment chain, short-run flexibility, and how a factory handles development.",
    },
    {
        q: "Why did US apparel imports from India fall in 2026 if India is competitive?",
        a: "Because for most of the year India was carrying a punitive US rate that its competitors were not. Shipments to the US fell 26.4% over January to May while the whole market fell 9.3%. India's global apparel exports still grew 2.9% in the same financial year — the goods went to the EU and the UK instead. The rate that caused the diversion ended on 24 July.",
    },
    {
        q: "How should a small brand vet an India manufacturer?",
        a: "Move one style, not a range. Ask which mill the fabric comes from rather than only about the factory, because the mill sets the real lead time and the real minimum. Budget two sample rounds before you talk price. Get the country of origin and the duty stack written into the commercial invoice terms, and put a duty-adjustment clause in any contract that delivers more than a quarter out.",
    },
];

export default async function IndiaSourcingPage() {
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
                headline: "Beyond China: Why More Fashion Brands Are Sourcing From India in 2026",
                description:
                    "Fashion brands are diversifying away from China in 2026 — why sourcing clothing manufacturing from India now costs 26.5%, and how to vet a partner there.",
                image: "https://krazykreators.com/blog/india-sourcing-2026-hero.jpg",
                datePublished: "2026-08-22",
                dateModified: "2026-08-22",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Manufacturing",
                keywords:
                    "sourcing clothing manufacturing from India, clothing manufacturing India, sourcing from India vs China, India apparel manufacturer for startups, China plus one sourcing strategy, India garment export incentives",
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
                        name: "Beyond China: Why More Fashion Brands Are Sourcing From India in 2026",
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
            <IndiaSourcingClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
