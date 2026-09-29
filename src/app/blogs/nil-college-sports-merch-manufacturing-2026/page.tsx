import NilMerchClient from "./NilMerchClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "nil-college-sports-merch-manufacturing-2026";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "NIL Merch Manufacturing: How Brands Meet 2026 Demand";
const DESCRIPTION =
    "NIL deals are fueling a new wave of athlete apparel brands. Here's how US manufacturers help college athletes launch fast, low-MOQ merch lines in 2026.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "NIL merch manufacturing",
        "NIL apparel manufacturing for athletes",
        "college athlete apparel brand",
        "campus sports merchandise",
        "NIL clothing line",
        "athlete branded apparel production",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: [`https://www.krazykreators.com/blog/${SLUG}-hero.jpg`],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: [`https://www.krazykreators.com/blog/${SLUG}-hero.jpg`],
    },
};

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
        "NIL and College Sports Merch Boom: How Manufacturing Partners Are Meeting Demand in 2026",
    description: DESCRIPTION,
    image: `https://www.krazykreators.com/blog/${SLUG}-hero.jpg`,
    datePublished: "2026-09-18",
    dateModified: "2026-09-18",
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
        "NIL merch manufacturing, NIL apparel manufacturing for athletes, college athlete apparel brand, campus sports merchandise, NIL clothing line, athlete branded apparel production",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Can a college athlete put their school's logo on their own merchandise?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Not without the school's separate permission. NIL rights cover an athlete's own name, image and likeness — not a university's trademarks, colors, mascot or logo, which stay school property unless the athlete and school agree to a co-licensing deal. Many schools have declined to grant that, which is why most NIL merch uses a number or nickname instead of a crest.",
            },
        },
        {
            "@type": "Question",
            name: "What NIL deals actually have to go through NIL Go?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Any third-party NIL agreement worth $600 or more has to be reported to NIL Go, the Deloitte-run system the College Sports Commission uses, within five days of signing. As of the CSC's most recent public figures, more than 17,000 deals worth over $127 million have been cleared, and more than 500 worth almost $15 million have been rejected — mostly for lacking a real business purpose or a market-based price.",
            },
        },
        {
            "@type": "Question",
            name: "How big is the NIL merchandise market in 2026?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Opendorse projects total 2026-27 NIL athlete earnings at $4.5 billion, up 61% from the estimate it published a year earlier. Merch-specific platforms are a visible piece of that growth — NIL Club's Athlete Merch launched in March 2026 specifically to help athletes turn a design into a sellable product rather than another appearance fee.",
            },
        },
        {
            "@type": "Question",
            name: "What's a realistic first order size for an NIL merch drop?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The same range that works for any small brand's first run: roughly ten to thirty units per style through a sample-room minimum, rather than the few hundred per color a standard wholesale factory asks for. That is enough to test one design across a few SKUs without betting a season's NIL income on unsold inventory.",
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
            <NilMerchClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
