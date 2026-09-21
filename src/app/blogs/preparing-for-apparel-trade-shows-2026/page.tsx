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
    datePublished: "2026-09-21",
    dateModified: "2026-09-21",
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
                text: "Count back from the show. Atlanta Apparel runs 2-5 February 2027 and MAGIC opens in Las Vegas on 16 February, about 21 weeks from late September 2026. A small collection built from scratch takes around 23 weeks, so it will not make it. If you already sell direct and your patterns and tech packs exist, the production and freight leg is roughly 12 weeks and February is realistic. Book the factory capacity before you book the booth.",
            },
        },
        {
            "@type": "Question",
            name: "What do wholesale buyers expect from a clothing brand?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Three things: consistency, a delivery date, and a price that leaves them margin. Consistency means unit 200 measures the same as the sample they touched. A delivery date means a window with a real date in it, not a season. Margin means a wholesale price a store can roughly double and still sell.",
            },
        },
        {
            "@type": "Question",
            name: "What goes on a line sheet for buyers?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "One block per style: a clean product image, a style number that never changes, colours, size run, fabric and weight, wholesale price, suggested retail price, the minimum per style or colour, and a delivery window with a date. Printing the suggested retail saves the buyer doing your margin sums in front of you.",
            },
        },
        {
            "@type": "Question",
            name: "How much lead time do wholesale buyers give you now?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Much less than they used to. JOOR's order data shows the average time from a wholesale order being placed to the goods shipping fell from 253 days in 2019 to 86 days in 2024. An order written at a February show is expected on the shop floor around mid-May, so factory capacity, not design, decides whether you can take it.",
            },
        },
        {
            "@type": "Question",
            name: "How do I price for wholesale without breaking my DTC pricing?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Work up from landed cost, then check the retail price it implies against what your own site charges. Stores roughly double wholesale, so a tee landing at $18.70 and sold wholesale at $28 implies $56 on the shelf. If your site sells it at $38, you are undercutting the store by $18. Raise the direct price or give wholesale its own styles.",
            },
        },
        {
            "@type": "Question",
            name: "Why do buyers pass on collections they like?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Usually fit, timelines or packaging rather than taste. Uneven grading means the store marks down the sizes that fit wrong and does not reorder. A missed delivery window is a cancelled order, because stores buy to a floor-set date. Goods without polybags, hangtags and barcodes cost the buyer labour they did not budget. And sometimes they simply bought the category last week. Follow up anyway.",
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
