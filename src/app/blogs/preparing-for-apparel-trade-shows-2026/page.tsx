import TradeShowReadyClient from "./TradeShowReadyClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "preparing-for-apparel-trade-shows-2026";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "Trade Show Ready: Preparing Your Line for Wholesale Buyers";
const DESCRIPTION =
    "Ready to pitch wholesale buyers? A production-readiness checklist for apparel brands preparing samples, line sheets and capacity for trade shows in 2026.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "preparing for apparel trade shows",
        "trade show ready apparel manufacturing",
        "wholesale buyers clothing brand",
        "retail expansion for fashion startups",
        "line sheet for buyers",
        "trade show apparel manufacturing",
        "apparel wholesale pricing",
        "MAGIC Las Vegas 2027",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: ["https://www.krazykreators.com/blog/preparing-for-apparel-trade-shows-2026-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["https://www.krazykreators.com/blog/preparing-for-apparel-trade-shows-2026-hero.jpg"],
    },
};

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
        "Trade Shows and Wholesale Buyers in 2026: Preparing Your Apparel Line for Retail",
    description: DESCRIPTION,
    image: "https://www.krazykreators.com/blog/preparing-for-apparel-trade-shows-2026-hero.jpg",
    datePublished: "2026-09-09",
    dateModified: "2026-09-09",
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
        "preparing for apparel trade shows, trade show ready apparel manufacturing, wholesale buyers clothing brand, retail expansion for fashion startups, line sheet for buyers, trade show apparel manufacturing",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "When should I start preparing for apparel trade shows?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Count back from the show, not forward from today. Atlanta Apparel runs 2-5 February 2027 and MAGIC and PROJECT open in Las Vegas on 16 February 2027 — about 23 weeks from early September 2026, which is what a realistic small collection takes from sampling to delivered goods. If you already sell direct to consumer and your patterns and tech packs exist, your real runway is the 12-week production and freight leg, but the show sample set is a separate build that competes for the same factory time. Book capacity before you book the booth.",
            },
        },
        {
            "@type": "Question",
            name: "What do wholesale buyers expect from a clothing brand?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Three things, in this order: consistency, a delivery date, and a price that leaves them margin. Consistency means unit 200 measures the same as the sample they touched. A delivery date means a window with an actual date in it, not a season. Margin means a wholesale price that a store can roughly double to reach a retail price its customers will pay. The collection gets you the appointment; those three answers get you the order.",
            },
        },
        {
            "@type": "Question",
            name: "What goes on a line sheet for buyers?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "One block per style: a clean product image, a style number that never changes, the colourways, the size run, the fabric and weight, the wholesale price, the suggested retail price, the minimum per style or per colourway, and a delivery window with a date. Printing the suggested retail price matters — it saves the buyer doing your margin arithmetic in front of you, and it signals you understand how their business works.",
            },
        },
        {
            "@type": "Question",
            name: "How much lead time do wholesale buyers give you now?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Far less than they used to. JOOR's transaction data shows the average time from a wholesale order being placed to the product shipping fell from 253 days in 2019 to 86 days in 2024, a 66% drop. An order written at a February show is expected on the retail floor around mid-May. That collapse is why production capacity, not collection design, is now the thing that decides whether you can accept the order in front of you.",
            },
        },
        {
            "@type": "Question",
            name: "How do I price for wholesale without breaking my DTC pricing?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Work from landed cost up, then check the retail price it implies against what you already charge on your own site. Retail convention is roughly a doubling from wholesale to shelf, so a garment landing at $18.70 and selling wholesale at $28 implies a $56 retail price. If your own site sells the same garment at $38, you are undercutting the store that just stocked you by $18. Fix that before the show, either by raising your direct price or by giving wholesale a distinct assortment.",
            },
        },
        {
            "@type": "Question",
            name: "Why do buyers pass on collections they like?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Usually fit, timelines, or floor-readiness rather than taste. Inconsistent grading means the store marks down the sizes that fit wrong and does not reorder. A delivery window you miss is a cancelled order, because retail buys to a floor-set date. And goods that arrive without the polybags, hangtags and barcodes a store needs cost the buyer labour they did not budget. Sometimes it is none of those — they simply bought the category last week. Follow up anyway.",
            },
        },
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <BlogViewTracker slug={SLUG} />
            <TradeShowReadyClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
