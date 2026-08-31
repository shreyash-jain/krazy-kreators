import SustainableClothingClient from "./SustainableClothingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "sustainable-clothing-manufacturing-eco-conscious-fashion-brand";
const URL = `https://krazykreators.com/blogs/${SLUG}`;
const TITLE = "Sustainable Clothing Manufacturing: How to Build an Eco-Conscious Fashion Brand";

export const metadata = {
    title: "Sustainable Clothing Manufacturing: Build an Eco-Conscious Brand | Krazy Kreators",
    description:
        "A practical guide to sustainable clothing manufacturing — fabric choices, ethical sourcing, and waste reduction for new fashion brands.",
    keywords: [
        "sustainable clothing manufacturing",
        "eco-friendly fashion brand",
        "sustainable fashion production",
        "sustainable fabric sourcing",
        "ethical clothing manufacturer",
        "low-impact garment production",
        "green fashion supply chain",
        "GOTS transaction certificate",
        "PFAS ban apparel",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description:
            "From 27 September, “eco-friendly” is a claim you have to prove. What has to be true at the factory before the word goes on your label.",
        images: ["/blog/sustainable-clothing-2026-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description:
            "From 27 September, “eco-friendly” is a claim you have to prove. What has to be true at the factory before the word goes on your label.",
        images: ["/blog/sustainable-clothing-2026-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "What does sustainable clothing manufacturing actually require in 2026?",
        a: "Evidence, in three layers. A fibre choice you can name and trace; a transaction certificate proving the specific batch of fabric you bought was made to the standard you are claiming; and a compliance certificate from the manufacturer covering restricted chemistry such as PFAS, which is banned in apparel in California and New York. A general commitment to being green is no longer a position you can hold — from 27 September 2026 the EU requires proof for any generic environmental claim, and the FTC's Green Guides have discouraged unqualified claims since 2012.",
    },
    {
        q: "What is the difference between a scope certificate and a transaction certificate?",
        a: "A scope certificate is the annual licence a mill or factory holds. It confirms the facility was audited and may process certified goods — it says the mill can run organic cotton. A transaction certificate is issued per shipment and ties a specific batch, quantity and buyer to the standard. Only the transaction certificate proves your fabric was actually made the way you say it was. The public GOTS database lists scope certificate holders only, which is why the document most suppliers send on request proves capability rather than delivery.",
    },
    {
        q: "Is recycled polyester a genuinely sustainable choice for a fashion brand?",
        a: "It is a real reduction in virgin petrochemical input, and it is not circular. Recycled fibre of all kinds was 7.6% of the 132 million tonnes of fibre produced worldwide in 2024, and recycled polyester made from drinks bottles accounted for 6.9% of that. Fibre made from pre- and post-consumer textiles — actual old clothes — is below 1% of the global market. Recycled polyester's share of all polyester also fell from 12.5% to 12% in 2024 as virgin production grew faster. Use it, price it honestly, and do not call it closed-loop.",
    },
    {
        q: "Do US brands have to worry about the EU rules on green claims?",
        a: "If you sell to EU customers, yes. The Empowering Consumers for the Green Transition Directive applies from 27 September 2026 across all twenty-seven member states and bans generic environmental claims made without proof, along with sustainability labels a brand created for itself. A direct-to-consumer store that ships to Ireland or Germany is trading in those markets. Separately, the EU Digital Product Passport rules for textiles are expected to be adopted in 2027, and they draw on the same evidence trail.",
    },
    {
        q: "Can a small brand afford ethical, low-impact garment production?",
        a: "Partly, and it is better to be honest about which part. Certified fabric carries both a price premium and a higher minimum order, so a first run in the low hundreds usually cannot support a full chain of custody. What works at that size is buying from a stockist who holds the transaction certificate for the roll, making one narrow claim you can evidence, and saying nothing beyond it. The upstream waste levers — marker efficiency, fewer sample rounds, ordering closer to real demand — cost nothing and improve margin at any volume.",
    },
    {
        q: "What is the PFAS rule for apparel sold in the US?",
        a: "California and New York both banned PFAS in apparel from 1 January 2025. California's AB 1817 sets a limit of 100 parts per million of total organic fluorine, dropping to 50 ppm in 2027, while New York prohibits intentionally added PFAS. In both states the manufacturer must supply a signed certificate of compliance to whoever offers the product for sale. Outdoor apparel for severe wet conditions is exempt until 1 January 2028 but must be disclosed to the buyer from 2025.",
    },
];

export default async function SustainableClothingPage() {
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
                description:
                    "A practical guide to sustainable clothing manufacturing — fabric choices, ethical sourcing, and waste reduction for new fashion brands.",
                image: "https://krazykreators.com/blog/sustainable-clothing-2026-hero.jpg",
                datePublished: "2026-08-22",
                dateModified: "2026-08-22",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Sustainability",
                keywords:
                    "sustainable clothing manufacturing, eco-friendly fashion brand, sustainable fashion production, sustainable fabric sourcing, ethical clothing manufacturer, low-impact garment production, green fashion supply chain",
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
            <SustainableClothingClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
