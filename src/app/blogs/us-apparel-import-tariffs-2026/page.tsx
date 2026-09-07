import TariffWatchClient from "./TariffWatchClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "us-apparel-import-tariffs-2026";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "US Apparel Import Tariffs 2026: What Actually Changed";
const DESCRIPTION =
    "2026 tariff changes are reshaping apparel sourcing costs. A founder's guide to US apparel tariffs 2026 and protecting margin on your next production run.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "US apparel tariffs 2026",
        "US apparel import tariffs 2026",
        "clothing import duties USA",
        "tariff impact on fashion brands",
        "apparel sourcing costs",
        "garment manufacturing tariffs",
        "Section 301 forced labor tariff apparel",
        "apparel tariff rate quota 2026",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: ["https://www.krazykreators.com/blog/us-apparel-import-tariffs-2026-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["https://www.krazykreators.com/blog/us-apparel-import-tariffs-2026-hero.jpg"],
    },
};

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
        "US Tariff Watch 2026: How Apparel Import Duties Are Reshaping Manufacturing",
    description: DESCRIPTION,
    image: "https://www.krazykreators.com/blog/us-apparel-import-tariffs-2026-hero.jpg",
    datePublished: "2026-09-07",
    dateModified: "2026-09-07",
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
        "US apparel tariffs 2026, US apparel import tariffs 2026, clothing import duties USA, tariff impact on fashion brands, apparel sourcing costs, garment manufacturing tariffs",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What are the US apparel import tariffs in 2026?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Since 24 July 2026 a Section 301 forced-labor duty of 10% or 12.5% sits on top of the normal MFN rate, which is about 16.5% on a cotton knit T-shirt. That puts clothing import duties from India, Bangladesh, Cambodia, Indonesia, Pakistan and Sri Lanka at roughly 26.5% all-in, Vietnam, Turkey, Thailand and the Philippines at 29%, and China at 36.5% once its older List 4A duty is counted. Qualifying CAFTA-DR and USMCA apparel pays no additional duty.",
            },
        },
        {
            "@type": "Question",
            name: "Has the duty-free tariff-rate quota for Bangladesh and Cambodia started?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No. The July action directed USTR to establish three-year tariff-rate quotas for Bangladesh, Cambodia, Indonesia and Malaysia, letting a volume of apparel made with US cotton and fabric enter free of the Section 301 duty. It was expected around 1 September 2026, but USTR has not published the allocation rules. Until it does, all four countries pay the full 10%, and no brand can claim the duty-free lane.",
            },
        },
        {
            "@type": "Question",
            name: "How much do clothing import duties add to a production run?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Duty is charged on the declared FOB value, not the retail price. On a 5,000-piece run of a cotton tee at $14 FOB — $70,000 invoiced — a 26.5% rate from India or Bangladesh costs $18,550, or $3.71 a unit. Vietnam at 29% costs $20,300 and China at 36.5% costs $25,550. The apparel sourcing cost difference between the two main Asian tiers on that run is $1,750.",
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
            <TariffWatchClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
