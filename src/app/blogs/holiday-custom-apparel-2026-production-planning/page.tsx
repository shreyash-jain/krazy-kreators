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
        a: "The first week of June, for anything made from scratch. Work it backwards rather than forwards: fix the date you want stock in the warehouse, subtract the crossing, subtract the sewing, subtract sampling, and subtract the weeks of development before that — and week one lands in early June. Founders miss it because they count forwards from the idea instead. One practical addition: book the factory slot separately from placing the order. Capacity for October and November is committed months earlier, and a confirmed order against an unbooked slot is not a schedule, it is a queue position.",
    },
    {
        q: "Can I still make a Christmas collection if I start in September?",
        a: "Not a new one, and it is worth being blunt about it. Christmas clothing production does not compress on request. There are roughly fifteen weeks between early September and the ground shipping cutoff, which in 2025 fell on 17 December. Decorating stock blanks takes six to eight weeks and fits comfortably. A reorder of a style you already sell is about twelve weeks of production plus 8 to 10 days by air, so about thirteen and a half weeks — it fits, but you pay air freight on every unit. A reorder sent by sea is seventeen weeks and misses. A first run from scratch is twenty-three weeks and misses badly.",
    },
    {
        q: "Which apparel categories sell best as holiday gifts?",
        a: "Matching family sets, loungewear and novelty prints, in that order of gifting strength. But the more useful thing to understand is why gift buying behaves differently: the person paying is not the person wearing it, and they are usually guessing at a size. That single fact should shape the range. Relaxed and oversized cuts, ribbed and elasticated waists, and one-size pieces such as beanies, scarves and socks all survive a wrong guess; a tailored or slim fit does not. Publish real garment measurements rather than S/M/L alone, include a gift receipt in every parcel, and set the January expectation as an exchange rather than a refund — an exchange keeps the money and the customer.",
    },
    {
        q: "How do pre-orders reduce the risk of a holiday collection?",
        a: "By turning stock you might not sell into stock you already have. There is a legal frame around it in the US that founders often miss. Under the FTC's Mail, Internet, or Telephone Order Merchandise Rule you must have a reasonable basis for the shipping date you advertise, and if you state none you are held to 30 days. Miss it, and you have to get the buyer's agreement to the delay or refund them. For a delay of up to 30 days silence counts as agreement; beyond that the order cancels automatically unless the customer actively says otherwise, and a cancellation means a prompt refund. So the delivery date on a pre-order is a commitment with teeth, not marketing copy. Give yourself a date the factory has actually confirmed, then add a fortnight.",
    },
    {
        q: "How much holiday stock should I buy?",
        a: "Let shelf life set the depth, and split the buy rather than placing it all at once. A useful way to size a first cut is to ask how many units you would be comfortable still owning on 2 January, because that is the number you are really committing to. Buy that much, then hold the rest of the budget as reserved factory capacity for one reorder on whatever sells fastest in the first fortnight. Two things follow from this. Selling out early costs you less than it feels like it does, because a markdown takes the margin off every remaining unit rather than a few. And a garment that is still sellable in March can carry a deeper buy than one that stops meaning anything the day after Christmas.",
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
