import ComplianceClient from "./ComplianceClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "cpsc-efiling-sb-707-apparel-compliance-2026";
const URL = `https://krazykreators.com/blogs/${SLUG}`;

const TITLE =
    "CPSC eFiling and California SB 707: What the New 2026 Apparel Compliance Rules Mean for Your Brand";
const DEK =
    "Neither rule will fine you this month. Both are building a record on your brand right now — and your fabric specification decides most of it.";
const DESCRIPTION =
    "CPSC eFiling and California SB 707 both took effect in July 2026. What US clothing brands actually need on file — and the apparel exemption most summaries miss.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "CPSC eFiling apparel 2026",
        "CPSC eFiling apparel",
        "California SB 707 clothing",
        "apparel import compliance 2026",
        "textile EPR law California",
        "product safety documentation apparel",
        "customs compliance clothing brand",
        "16 CFR 1610 general certificate of conformity",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DEK,
        images: ["/blog/cpsc-sb707-2026-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DEK,
        images: ["/blog/cpsc-sb707-2026-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "Does adult clothing need a CPSC certificate to import in 2026?",
        a: "Usually not. If your fabric falls inside the 16 CFR 1610.1(d) exemption, no certificate is needed, and CPSC said so in the new rule. Two kinds qualify: any smooth-faced cloth weighing 2.6 ounces per square yard or more, whatever it is made of; and any cloth at all made entirely from acrylic, modacrylic, nylon, olefin, polyester or wool. A brushed fleece or a light rayon blouse does not qualify, and needs testing, a certificate and an electronic filing. Note this is enforcement discretion, not a permanent exemption in law.",
    },
    {
        q: "Will my shipment be rejected if the certificate data is missing?",
        a: "Not right now. CPSC has said it does not intend to reject entries or refuse goods purely because the eFiling is missing, and sends a warning instead. It is still enforcing the certificate requirement itself and still using your filings to set a risk score on each entry. That score is why this is worth getting right now rather than in a year.",
    },
    {
        q: "Who has to register under California SB 707, and by when?",
        a: "Any brand selling covered apparel or textiles into California with more than $1 million in annual global sales had to join the state's approved recycling body by 1 July 2026. The million is measured globally, not just in California, and it applies wherever your office is. Covered products include bedding, towels, curtains and footwear as well as clothing.",
    },
    {
        q: "What should I be asking my manufacturer for?",
        a: "Five things, in writing, before the goods ship: the fabric spec with a measured weight and whether the surface is smooth or raised; the test report from a CPSC-accepted laboratory for styles that need one; the full factory address with month and year of production; the bill of materials down to trims; and the laboratory's own name and address. If a factory cannot hand you these, that is not a problem you can solve at the port.",
    },
];

export default async function CpscSb707Page() {
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
                description: DESCRIPTION,
                image: "https://krazykreators.com/blog/cpsc-sb707-2026-hero.jpg",
                datePublished: "2026-08-26",
                dateModified: "2026-08-26",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Compliance",
                keywords:
                    "CPSC eFiling apparel 2026, California SB 707 clothing, apparel import compliance 2026, textile EPR law California, product safety documentation apparel, customs compliance clothing brand",
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
            <ComplianceClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
