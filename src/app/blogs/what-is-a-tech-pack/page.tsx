import TechPackExplainedClient from "./TechPackExplainedClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "what-is-a-tech-pack";
const URL = `https://krazykreators.com/blogs/${SLUG}`;

const TITLE = "What Is a Tech Pack? The File Your Factory Builds From";
const DESCRIPTION =
    "What is a tech pack? A plain-English guide to every page in a fashion tech pack, why factories won't quote without one, and what skipping it really costs.";

export const metadata = {
    title: `${TITLE} | Krazy Kreators`,
    description: DESCRIPTION,
    keywords: [
        "what is a tech pack",
        "tech pack for clothing",
        "fashion tech pack",
        "tech pack template",
        "clothing spec sheet",
        "tech pack vs CAD",
        "free tech pack design",
        "garment tech pack",
        "apparel tech pack",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description:
            "Every line in a tech pack exists because somebody once got a garment back wrong. Here is what goes in one, page by page.",
        images: ["/blog/what-is-a-tech-pack-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description:
            "Every line in a tech pack exists because somebody once got a garment back wrong. Here is what goes in one, page by page.",
        images: ["/blog/what-is-a-tech-pack-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "What is a tech pack in fashion?",
        a: "A tech pack is the technical specification document a clothing brand hands its manufacturer to get a garment made exactly as intended. It is not a mood board and not a sketch. It is a set of pages that together answer every question a factory would otherwise have to guess at: what the garment looks like from every angle, what it measures at every point and in every size, what fabric and trims go into it, how each seam is sewn, what colors it comes in, and what has to appear on the label and the carton. A fashion tech pack is the difference between ordering a garment and describing one.",
    },
    {
        q: "What should a tech pack include?",
        a: "Eight things, at minimum: a cover sheet with the style number, season and size range; technical flat sketches of the front, back and every detail; a points-of-measure chart in one base size; grading rules showing how each measurement changes across the size run; a bill of materials listing every fabric, trim, thread and label with placement; construction and stitching notes naming the seam and stitch type at each join; colorways and artwork with print placement and scale; and labeling and packing instructions covering fiber content, country of origin, care, hangtags and cartons. Anything you leave out becomes a decision somebody on the factory floor makes for you.",
    },
    {
        q: "What is the difference between a tech pack and a CAD?",
        a: "A CAD, or technical flat, is one page inside a tech pack. It is a scaled line drawing that shows what the garment looks like, drawn straight on rather than on a body. A tech pack is the whole document the CAD sits in, and it also carries the measurement chart, grading rules, bill of materials, construction notes, colorways and labeling. Sending a factory a CAD alone tells them the shape you want. It does not tell them the fabric, the fit, the stitch, or the size run, so they will either come back with questions or fill the gaps themselves.",
    },
    {
        q: "Is a clothing spec sheet the same as a tech pack?",
        a: "No, though the terms get used interchangeably. A clothing spec sheet is usually just the measurement chart: the list of points of measure and their target values, plus tolerances. It answers how big the garment is. A tech pack contains the spec sheet and everything else needed to actually build it. If a supplier asks for your spec sheet and you send only measurements, expect a follow-up email asking for fabric, trims and construction.",
    },
    {
        q: "Do I need a tech pack for a single sample or a small order?",
        a: "Yes, and arguably more so. On a small run the development cost is spread across very few units, so a wasted sample round hurts proportionally more. A tech pack also gives you something a small order cannot otherwise buy: a written record of what you asked for. Without it, a fit problem in the finished garment is a disagreement about memory. With it, it is a measurement against a number both sides already agreed to.",
    },
    {
        q: "Can I build a tech pack myself from a template?",
        a: "You can, and for a simple garment such as a tee or a hoodie a good template will get you most of the way. The parts founders most often get wrong are the ones a template cannot fill in for you: grading rules across the size run, stitch and seam types at each join, tolerances, and the labeling requirements that apply once the garment enters the United States. If you build your own, have a pattern maker or a technical designer read it before it goes to a factory. An hour of review is cheaper than a sample round.",
    },
];

const GLOSSARY = [
    { term: "Tech pack", def: "The technical specification document a brand gives a manufacturer so a garment can be built exactly as intended." },
    { term: "Technical flat (CAD)", def: "A scaled, straight-on line drawing of the garment showing seams, stitching and details, drawn without a body in it." },
    { term: "Point of measure (POM)", def: "A single named place on the garment that gets measured, such as chest width or sleeve length." },
    { term: "Tolerance", def: "The amount a finished garment is allowed to differ from its target measurement before it is rejected." },
    { term: "Grading", def: "The rules that turn one base size into a full size run by changing each point of measure by a set amount." },
    { term: "Bill of materials (BOM)", def: "The itemised list of every fabric, trim, thread and label in the garment, with supplier and placement." },
    { term: "Colorway", def: "One specific color combination a style is produced in; the same style in three colors is three colorways." },
    { term: "Pre-production sample (PP sample)", def: "The last sample, made in the real fabric on the real line, that you approve before bulk cutting starts." },
];

export default async function TechPackExplainedPage() {
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
                image: "https://krazykreators.com/blog/what-is-a-tech-pack-hero.jpg",
                datePublished: "2026-08-10",
                dateModified: "2026-08-10",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Design",
                keywords:
                    "what is a tech pack, tech pack for clothing, fashion tech pack, tech pack template, clothing spec sheet, tech pack vs CAD",
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
                "@type": "DefinedTermSet",
                name: "Tech pack terms, in plain English",
                hasDefinedTerm: GLOSSARY.map((g) => ({
                    "@type": "DefinedTerm",
                    name: g.term,
                    description: g.def,
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
            <TechPackExplainedClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
                glossary={GLOSSARY}
            />
        </>
    );
}
