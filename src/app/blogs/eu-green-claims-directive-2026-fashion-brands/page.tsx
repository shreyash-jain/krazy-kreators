import EuGreenClaimsClient from "./EuGreenClaimsClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "eu-green-claims-directive-2026-fashion-brands";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "EU Green Claims Directive 2026: What Fashion Brands Must Prove";
const DESCRIPTION =
    "From Sept 27, 2026, \"eco-friendly\" and \"sustainable\" labels need proof, not intention. Here's what the EU's new law requires — and how to get compliant.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "EU green claims directive fashion",
        "green claims directive 2026",
        "greenwashing regulation clothing brands",
        "EU sustainability claims law fashion",
        "ECGT directive textiles",
        "Directive 2024/825 apparel",
        "clothing manufacturer with sustainability documentation",
        "how to prove sustainability claims clothing brand",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: ["https://www.krazykreators.com/blog/eu-green-claims-directive-2026-fashion-brands-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["https://www.krazykreators.com/blog/eu-green-claims-directive-2026-fashion-brands-hero.jpg"],
    },
};

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
        "EU Green Claims Directive 2026: What Fashion Brands Must Prove Before September 27",
    description: DESCRIPTION,
    image: "https://www.krazykreators.com/blog/eu-green-claims-directive-2026-fashion-brands-hero.jpg",
    datePublished: "2026-09-22",
    dateModified: "2026-09-22",
    author: { "@type": "Organization", name: "Krazy Kreators", url: "https://www.krazykreators.com" },
    publisher: {
        "@type": "Organization",
        name: "Krazy Kreators",
        url: "https://www.krazykreators.com",
        logo: { "@type": "ImageObject", url: "https://www.krazykreators.com/brands/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    articleSection: "Sustainability",
    keywords:
        "EU green claims directive fashion, green claims directive 2026, greenwashing regulation clothing brands, EU sustainability claims law fashion, ECGT directive textiles, Directive 2024/825 apparel",
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What is the EU Green Claims Directive (ECGT Directive)?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The law applying from 27 September 2026 is Directive (EU) 2024/825, the Empowering Consumers for the Green Transition (ECGT) Directive. It amends EU consumer-protection law to ban generic environmental claims that cannot be backed by recognised excellent environmental performance, sustainability labels that are not based on a third-party certification scheme or set by a public authority, and claims about a whole product that only apply to one part of it. The separate 'Green Claims Directive' proposal, which would have set detailed substantiation rules, was slated for withdrawal in June 2025 and has stalled since.",
            },
        },
        {
            "@type": "Question",
            name: "When does the Green Claims Directive take effect?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Directive (EU) 2024/825 entered into force in March 2024. Member states had to transpose it into national law by 27 March 2026, and the rules apply to traders from 27 September 2026. There is no transition period for products already on sale.",
            },
        },
        {
            "@type": "Question",
            name: "Can I still use the word 'sustainable' on my clothing brand?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "On its own, no. 'Sustainable', 'eco-friendly' and 'green' are generic environmental claims, banned unless the trader holds a recognised top-tier award such as the EU Ecolabel. The word becomes usable when its specification sits next to it on the same medium — for example 'made with 100% GOTS-certified organic cotton' with the certificate on file. The rule targets vagueness, not the topic.",
            },
        },
        {
            "@type": "Question",
            name: "Does this law apply if my brand isn't based in the EU?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. The directive amends the Unfair Commercial Practices Directive, which applies to any trader selling to consumers in the EU regardless of where the business is registered. A US brand selling through an EU marketplace, an EU-facing web store or a European stockist is in scope.",
            },
        },
        {
            "@type": "Question",
            name: "What evidence do I need to back up a sustainability claim?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Evidence that matches the exact scope of the claim and can be produced on request: the mill's scope certificate under the scheme you name, a transaction certificate tying your fabric batch to that certificate, the dye house's process records, and a tech pack that states fibre content and finish. A supplier invoice that says 'organic cotton' is a claim, not evidence. Most of these documents are created by the manufacturer, which is why the paper trail is a sourcing question before it is a marketing one.",
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
            <EuGreenClaimsClient
                initialLikeCount={initialLikeCount}
                initialComments={initialComments}
            />
        </>
    );
}
