import StartClothingBrandClient from "./StartClothingBrandClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "how-to-start-a-clothing-brand-2026";
const URL = `https://www.krazykreators.com/blogs/${SLUG}`;
const TITLE = "How to Start a Clothing Brand in 2026: A Step-by-Step Guide";
const DESCRIPTION =
    "How to start a clothing brand in 2026: the 8-step build order — niche, tech pack, sampling, landed cost, labelling and your first run. Founder checklist inside.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "how to start a clothing brand",
        "start a clothing brand",
        "start your own clothing line",
        "clothing brand for beginners",
        "fashion startup checklist",
        "clothing brand business plan",
        "launch a fashion brand",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        siteName: "Krazy Kreators",
        images: ["https://www.krazykreators.com/blog/start-clothing-brand-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["https://www.krazykreators.com/blog/start-clothing-brand-hero.jpg"],
    },
};

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: TITLE,
    description: DESCRIPTION,
    image: "https://www.krazykreators.com/blog/start-clothing-brand-hero.jpg",
    datePublished: "2026-08-05",
    dateModified: "2026-08-05",
    author: { "@type": "Organization", name: "Krazy Kreators", url: "https://www.krazykreators.com" },
    publisher: {
        "@type": "Organization",
        name: "Krazy Kreators",
        url: "https://www.krazykreators.com",
        logo: { "@type": "ImageObject", url: "https://www.krazykreators.com/brands/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": URL },
    articleSection: "Business",
    keywords: "how to start a clothing brand, start a clothing brand, start your own clothing line, fashion startup checklist",
};

const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to start a clothing brand in 2026",
    description:
        "The eight-step build order for launching a clothing brand in the US, from niche definition through to the first production run.",
    totalTime: "P12M",
    step: [
        {
            "@type": "HowToStep",
            position: 1,
            name: "Pick a niche you can say in one sentence",
            text: "Name a specific customer, a specific problem, and a specific product category. Produce a one-sentence positioning statement, three named competitors, and a price band.",
            url: `${URL}#niche`,
        },
        {
            "@type": "HowToStep",
            position: 2,
            name: "Build a range plan, not a mood board",
            text: "Commit to three to five styles with colourways, size runs, and target retail prices, plus a total unit count and a decision between private label and custom development.",
            url: `${URL}#range-plan`,
        },
        {
            "@type": "HowToStep",
            position: 3,
            name: "Register the entity and clear the name",
            text: "Form the entity, get an EIN, open a business bank account, run a USPTO knock-out search in Class 25, and file the trademark application before labels are woven.",
            url: `${URL}#business-name`,
        },
        {
            "@type": "HowToStep",
            position: 4,
            name: "Write the tech pack",
            text: "Produce a tech pack per style with flat sketches, a graded measurement chart with tolerances, fabric and trim specifications, stitch types, and label and packing instructions.",
            url: `${URL}#tech-pack`,
        },
        {
            "@type": "HowToStep",
            position: 5,
            name: "Choose fabric by spec and sample until fit is signed off",
            text: "Select fabric on composition, GSM, construction, and finish, run a wash test, then complete two to three sampling rounds ending in a signed pre-production sample.",
            url: `${URL}#fabric-sampling`,
        },
        {
            "@type": "HowToStep",
            position: 6,
            name: "Cost the landed price, not the factory quote",
            text: "Add freight, duty, customs fees, brokerage, and inbound logistics to the factory price to get landed cost per unit, then set retail price from that number.",
            url: `${URL}#landed-cost`,
        },
        {
            "@type": "HowToStep",
            position: 7,
            name: "Get labelling and compliance right",
            text: "Apply fibre content, country of origin, responsible-party identity, and permanent care instructions as required by FTC rules, specified in the tech pack.",
            url: `${URL}#labels-compliance`,
        },
        {
            "@type": "HowToStep",
            position: 8,
            name: "Launch small, sell through, then scale",
            text: "Order the smallest viable first run, then measure sell-through rate and return rate by size before designing the next drop.",
            url: `${URL}#first-run`,
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "How do you start a clothing brand in 2026?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "In this order: define a one-sentence niche, build a range plan of three to five styles, register the entity and clear the name with the USPTO, write a tech pack per style, select fabric by specification and sample until fit is signed off, calculate landed cost rather than the factory quote, apply US labelling requirements, then produce a small first run and measure sell-through before scaling.",
            },
        },
        {
            "@type": "Question",
            name: "How long does it take to launch a clothing brand?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Nine to twelve months from first sketch to first shipment is a realistic, well-run timeline. Fabric sourcing and two to three sampling rounds usually take the longest, and bulk production plus ocean freight and customs clearance typically adds another two to three months on top.",
            },
        },
        {
            "@type": "Question",
            name: "What is landed cost, and why does it matter more in 2026?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Landed cost is the true per-unit cost after freight, duty, customs fees, brokerage, and inbound logistics. It matters more now because CBP indefinitely suspended the $800 de-minimis exemption on 24 June 2026, so low-value shipments carry duty and entry requirements. On a worked 500-unit tee example, the factory quote was 77% of the landed cost.",
            },
        },
        {
            "@type": "Question",
            name: "What has to be on a clothing label sold in the US?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Fibre content, country of origin, and the identity of the manufacturer or responsible business, plus permanent care instructions under the FTC's Care Labeling Rule. Specify all four in the tech pack so they are made into the garment rather than added afterwards.",
            },
        },
        {
            "@type": "Question",
            name: "Do I need a trademark before I launch a clothing brand?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Registration is not legally required, but apparel is a crowded register and rebranding after production is expensive. A US application costs a $350 base fee per class, with surcharges of $100 per class for insufficient information and $200 per class for a free-form description. Clothing is Class 25.",
            },
        },
        {
            "@type": "Question",
            name: "How many styles should be in a first collection?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Three to five. Every additional style multiplies through fabric minimums, sampling rounds, grading, photography, and inventory risk, and a narrow first drop keeps the cost sheet legible enough to actually price from.",
            },
        },
        {
            "@type": "Question",
            name: "Should a first-time founder use private label or custom manufacturing?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Private label puts your branding on an existing garment block and gets you to market faster with less development cost. Custom manufacturing builds a pattern that belongs to you and supports a real fit advantage, but takes longer and costs more upfront.",
            },
        },
        {
            "@type": "Question",
            name: "What return rate should a new clothing brand plan for?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Plan conservatively. Retailers forecast a 15.8% overall return rate and 19.3% on online sales, and apparel sits at the upper end because fit is hard to judge online. Build the assumption into your cost sheet before you set retail price.",
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

export default async function StartClothingBrandPage() {
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <BlogViewTracker slug={SLUG} />
            <StartClothingBrandClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
