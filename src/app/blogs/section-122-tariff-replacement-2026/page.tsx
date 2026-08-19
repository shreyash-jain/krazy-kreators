import Section122ReplacementClient from "./Section122ReplacementClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "section-122-tariff-replacement-2026";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "Section 122 Is Gone. Here's What Replaced It.";
const DESCRIPTION =
    "Section 122's 10% tariff expired July 24, 2026. A Section 301 forced-labor duty replaced it at 10% or 12.5% — here's what it does to your apparel cost sheet.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "Section 122 tariff replacement 2026",
        "Section 122 tariff expired",
        "Section 301 tariff 2026",
        "apparel tariff update July 2026",
        "landed cost after Section 122",
        "US apparel import duty 2026",
        "tariff rate by country apparel",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: ["https://www.krazykreators.com/blog/section-122-replacement-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["https://www.krazykreators.com/blog/section-122-replacement-hero.jpg"],
    },
};

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: TITLE,
    description: DESCRIPTION,
    image: "https://www.krazykreators.com/blog/section-122-replacement-hero.jpg",
    datePublished: "2026-08-19",
    dateModified: "2026-08-19",
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
        "Section 122 tariff replacement 2026, Section 122 tariff expired, Section 301 tariff 2026, apparel tariff update July 2026, landed cost after Section 122",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What replaced the Section 122 tariff in 2026?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "A Section 301 forced-labor duty on 60 economies, finalised by the US Trade Representative on 23 July 2026 and effective 12:01 a.m. Eastern on 24 July — the same minute Section 122 lapsed. It charges 10% or 12.5% depending on whether the country imposes and enforces a prohibition on the importation of goods produced with forced labor.",
            },
        },
        {
            "@type": "Question",
            name: "Which apparel countries pay 10% and which pay 12.5%?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The 10% lane covers India, Bangladesh, Cambodia, Indonesia, Pakistan, Sri Lanka, Malaysia, Jordan, Mexico, Canada, the United Kingdom, Argentina, Ecuador, El Salvador, Guatemala, Honduras and Trinidad and Tobago. Every other investigated economy pays 12.5%, including Vietnam, China, Turkey, Thailand, the Philippines, Egypt and Morocco.",
            },
        },
        {
            "@type": "Question",
            name: "Did the duty on Indian apparel go up on 24 July 2026?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "No. India adopted a forced-labor import prohibition after the June 2026 proposal and was placed in the 10% lane in the final notice, which matches what the Section 122 blanket charged. A cotton knit T-shirt from India was 26.5% all-in before 24 July and is 26.5% after.",
            },
        },
        {
            "@type": "Question",
            name: "Does the Section 301 forced-labor duty stack on top of the normal tariff?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. The Federal Register notice provides that goods subject to the new duty remain subject to the general rates of duty in chapters 1 to 97 and to other additional duties, so China's legacy Section 301 duty stacks as well. A cotton knit T-shirt from China carries 16.5% MFN plus 12.5% plus the older 7.5% List 4A duty, for 36.5% in total.",
            },
        },
        {
            "@type": "Question",
            name: "Is any apparel exempt from the Section 301 forced-labor tariff?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Three lanes are exempt. Textile and apparel goods of Costa Rica, the Dominican Republic, El Salvador, Guatemala, Honduras or Nicaragua entered free of duty under CAFTA-DR; products of Mexico and Canada entered free of duty under USMCA; and goods of the European Union, Taiwan, Japan, Korea or Switzerland whose MFN duty already equals or exceeds the 10% or 12.5% cap, which covers most apparel.",
            },
        },
        {
            "@type": "Question",
            name: "How long will the Section 301 forced-labor tariff last?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "There is no expiry date. Section 122 carried a 150-day statutory limit; this action does not, and remains in place until the US Trade Representative amends it. A country's rate can be reduced if USTR determines it now imposes and effectively enforces a forced-labor import prohibition, which is how six economies moved from 12.5% to 10% before the action took effect.",
            },
        },
    ],
};

const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.krazykreators.com/" },
        { "@type": "ListItem", position: 2, name: "Blogs", item: "https://www.krazykreators.com/blogs" },
        { "@type": "ListItem", position: 3, name: TITLE, item: URL },
    ],
};

export default async function Section122ReplacementPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(SLUG, { baseUrl }),
        getComments(SLUG, { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <BlogViewTracker slug={SLUG} />
            <Section122ReplacementClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
