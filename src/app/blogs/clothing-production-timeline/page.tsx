import ProductionTimelineClient from "./ProductionTimelineClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "clothing-production-timeline";
const URL = `https://krazykreators.com/blogs/${SLUG}`;

export const metadata = {
    title: "From Sketch to Store: A Real Clothing Production Timeline | Krazy Kreators",
    description:
        "How long does it take to go from design to delivery? A realistic, stage-by-stage clothing production timeline for new fashion brands.",
    keywords: [
        "clothing production timeline",
        "fashion collection production process",
        "how long does clothing manufacturing take",
        "design to production timeline",
        "apparel manufacturing process steps",
        "sampling to bulk production time",
        "garment production schedule",
        "fashion brand lead time",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: "From Sketch to Store: A Real Clothing Production Timeline",
        description:
            "Four months is the honest answer — and about half of it happens before a single garment is cut. Here is where every week actually goes.",
        images: ["/blog/production-timeline-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: "From Sketch to Store: A Real Clothing Production Timeline",
        description:
            "Four months is the honest answer — and about half of it happens before a single garment is cut. Here is where every week actually goes.",
        images: ["/blog/production-timeline-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "How long does clothing manufacturing take from design to delivery?",
        a: "Plan on 16 to 29 weeks for a first collection, depending on how fast you make decisions. Sixteen weeks is the fast lane: one simple style, an approval turned around the same day it lands, and air freight at the end. Around 23 weeks is what a small first collection usually takes on ocean freight. Twenty-nine weeks is what it looks like when you are learning the process while running it. Repeat orders on a pattern you already own are far shorter, because the development half is already paid for.",
    },
    {
        q: "Which stage of the clothing production timeline takes the longest?",
        a: "Development — everything before the first bulk garment is cut. Range planning, tech packs, fabric sourcing, lab dips, patterns and fit samples take 8 to 14 weeks, which is roughly half the whole schedule. Founders consistently underestimate it because nothing visible is being produced. Actual sewing is one of the shorter stages, usually 3 to 5 weeks.",
    },
    {
        q: "How long does sampling take before bulk production starts?",
        a: "Budget 5 to 8 weeks from a finished tech pack to an approved pre-production sample. That covers the pattern and first prototype, two or three fit rounds, and the final sign-off sample the factory keeps as the reference for bulk. Fabric runs alongside it: lab dips, the small swatches dyed to your exact colour, take 2 to 4 weeks and often decide when sampling can actually finish.",
    },
    {
        q: "When should I place my order to have stock on the shelf for a specific date?",
        a: "Count 23 weeks backwards from the date you need stock in the warehouse, not the date you want to launch, then subtract another two weeks for photography and listings. A 1 March 2027 drop is a 21 September 2026 decision. Then check that nothing in the middle lands on a factory blackout — Lunar New Year falls on 6 February 2027, and factories across Asia run at reduced capacity until March.",
    },
    {
        q: "Can a clothing production timeline be rushed?",
        a: "Some of it, and the parts that compress are not the ones founders expect. You can pay for air freight, which takes about three weeks off the end, and you can shorten development by turning approvals around in hours instead of weeks. You cannot rush the mill: knitting and dyeing cloth takes the time it takes. Rushing usually means skipping a fit round, which is the most expensive way to save two weeks.",
    },
];

export default async function ProductionTimelinePage() {
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
                headline: "From Sketch to Store: A Real Clothing Production Timeline",
                description:
                    "How long does it take to go from design to delivery? A realistic, stage-by-stage clothing production timeline for new fashion brands.",
                image: "https://krazykreators.com/blog/production-timeline-hero.jpg",
                datePublished: "2026-08-15",
                dateModified: "2026-08-15",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Manufacturing",
                keywords:
                    "clothing production timeline, fashion collection production process, how long does clothing manufacturing take, design to production timeline, apparel manufacturing process steps, sampling to bulk production time",
            },
            {
                "@type": "HowTo",
                name: "The clothing production timeline, stage by stage",
                description:
                    "The ten stages a fashion collection passes through between a first sketch and delivered stock, with realistic durations for a small first collection on ocean freight.",
                totalTime: "P23W",
                step: [
                    {
                        "@type": "HowToStep",
                        position: 1,
                        name: "Range plan and line sheet",
                        text: "Decide how many styles, in which colours and sizes, at what price. Two weeks.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 2,
                        name: "Sketches and tech packs",
                        text: "Turn each style into a spec a factory can build from: flat sketches, measurements, stitch types, trims and labels. Two weeks.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 3,
                        name: "Fabric sourcing and lab dips",
                        text: "Choose the cloth, order hangers, and approve lab dips — small swatches dyed to your exact colour. Three weeks.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 4,
                        name: "Pattern and first sample",
                        text: "A pattern maker drafts your shape and the sample room sews the first prototype. Two weeks.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 5,
                        name: "Fit rounds and pre-production sign-off",
                        text: "Two or three rounds of fit corrections, then a final approved sample the factory keeps as the bulk reference. Two weeks.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 6,
                        name: "Bulk fabric knitting and dyeing",
                        text: "The mill makes your actual cloth in production quantity. Two weeks.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 7,
                        name: "Cut, sew and finish",
                        text: "The factory cuts the fabric, sews the run and finishes the garments. Four weeks.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 8,
                        name: "Final quality check and packing",
                        text: "Inspection against the approved sample, then folding, tagging, polybagging and cartoning. One week.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 9,
                        name: "Ocean freight",
                        text: "Sea transit from the factory's port to yours. Four weeks.",
                    },
                    {
                        "@type": "HowToStep",
                        position: 10,
                        name: "Customs clearance and inland delivery",
                        text: "Entry filing, duty payment, release and the truck to your warehouse. One week.",
                    },
                ],
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
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "From Sketch to Store: A Real Clothing Production Timeline",
                        item: URL,
                    },
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
            <ProductionTimelineClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
