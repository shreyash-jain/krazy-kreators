import HolidayApparelPlaybookClient from "./HolidayApparelPlaybookClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "holiday-custom-apparel-2026-production-planning";
const URL = `https://krazykreators.com/blogs/${SLUG}`;
const TITLE =
    "Holiday 2026 Custom Apparel Playbook: Planning Your Christmas and Gifting Collection Early";
const DEK =
    "Christmas is fifteen weeks away and a first production run takes twenty-three. What a US brand can still ship this December — and when the 2027 collection really begins.";

export const metadata = {
    // Deliberately shorter than the H1 so the SERP does not truncate mid-word.
    title: "Holiday Custom Apparel 2026: The Production Timeline | Krazy Kreators",
    description:
        "Holiday sales depend on early planning. A production-timeline guide to launching a Christmas and gifting apparel collection for US brands in 2026.",
    keywords: [
        "holiday custom apparel 2026",
        "holiday apparel production planning",
        "Christmas merch manufacturing",
        "gifting apparel collection",
        "holiday t-shirt production timeline",
        "seasonal clothing brand launch",
        "holiday apparel manufacturing",
        "Christmas apparel manufacturing",
        "custom holiday apparel",
        "holiday clothing production",
        "holiday apparel production timeline",
        "Christmas clothing production",
        "seasonal apparel manufacturing",
        "holiday collection production",
        "matching family sets manufacturing",
        "apparel pre-order strategy",
        "holiday packaging for clothing brands",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DEK,
        images: ["/blog/holiday-custom-apparel-2026-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DEK,
        images: ["/blog/holiday-custom-apparel-2026-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "When should holiday apparel production planning start?",
        a: "For a collection made from scratch, the first week of June. The holiday apparel production timeline is longer than most founders expect: a first run takes about twenty-three weeks from tech pack to shelf — development, sampling, bulk production, then freight — and ocean shipping from India adds 30 to 40 days door to door on top of the making. Counting back from a mid-December shipping cutoff puts week one in early June. Anything started in September is not a new collection; it is decorated stock blanks, a reorder flown in, or a pre-order you cut in January.",
    },
    {
        q: "Can I still make a Christmas collection if I start in September?",
        a: "Not a new one, and it is worth being blunt about it. Christmas clothing production does not compress on request. There are roughly fifteen weeks between early September and the ground shipping cutoff, which in 2025 fell on 17 December. Decorating stock blanks takes six to eight weeks and fits comfortably. A reorder of a style you already sell is about twelve weeks of production plus 8 to 10 days by air, so about thirteen and a half weeks — it fits, but you pay air freight on every unit. A reorder sent by sea is seventeen weeks and misses. A first run from scratch is twenty-three weeks and misses badly.",
    },
    {
        q: "Which apparel categories sell best as holiday gifts?",
        a: "Matching family sets, cozy loungewear and novelty prints — and they carry very different risk. Matching sets are the strongest gifting proposition because the buyer is not the wearer and one transaction moves four garments, but a four-piece set is dead the moment one size sells out. Loungewear is the safest because it is the least seasonal: a heavyweight fleece set still sells in January, which is why it deserves the deepest buy. Novelty prints are the most dangerous — cheap to design, impossible to reorder in time, and worthless on 26 December.",
    },
    {
        q: "How do pre-orders reduce the risk of a holiday collection?",
        a: "A pre-order moves the risk onto the customer's calendar instead of your warehouse. You take the order in November, promise January delivery, and cut only the units that actually sold — so there is no January overstock and no clearance page. The condition is that the ship date is stated plainly on the product page, in the confirmation email and on the packing slip. Founders who bury the date get the sale and lose the customer. The cost is real: everyone who will not wait for January does not buy.",
    },
    {
        q: "How much holiday stock should I buy?",
        a: "Depth should follow how long the garment stays sellable, not how good the unit price looks. Retailers expect 17% of holiday sales to come back as returns, against 15.8% across the year, and online returns run at 19.3% — and holiday apparel returns arrive in January when the goods are worth whatever a clearance page will pay. So a lower unit cost is only a saving if the unit sells at full price. Buy deep on loungewear that still moves in March, and shallow on anything explicitly Christmas.",
    },
    {
        q: "Does Diwali affect holiday production in India?",
        a: "Yes, and it lands inside the window for anyone doing Christmas apparel manufacturing in India. Diwali falls on 8 November 2026, with the festival running roughly 6 to 10 November, and Indian factories run at reduced capacity through that week. If your production sits in India, that reduction overlaps the run-up to Black Friday on 27 November. It needs planning around at the point you place the order rather than discovering when a shipment slips.",
    },
];

export default async function HolidayApparelPlaybookPage() {
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
                headline: TITLE,
                description:
                    "Holiday sales depend on early planning. A production-timeline guide to launching a Christmas and gifting apparel collection for US brands in 2026.",
                image: "https://krazykreators.com/blog/holiday-custom-apparel-2026-hero.jpg",
                datePublished: "2026-09-03",
                dateModified: "2026-09-03",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Manufacturing",
                keywords:
                    "holiday custom apparel 2026, holiday apparel production planning, Christmas merch manufacturing, gifting apparel collection, holiday t-shirt production timeline, seasonal clothing brand launch, holiday apparel manufacturing, Christmas apparel manufacturing, custom holiday apparel, holiday clothing production, holiday apparel production timeline, Christmas clothing production, seasonal apparel manufacturing, holiday collection production",
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
                    { "@type": "ListItem", position: 3, name: TITLE, item: URL },
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
            <HolidayApparelPlaybookClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
