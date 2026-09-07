import BackToSchoolApparelClient from "./BackToSchoolApparelClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "back-to-school-custom-apparel-2026";
const URL = `https://krazykreators.com/blogs/${SLUG}`;
const TITLE = "Back-to-School 2026 Custom Apparel: How Small Brands Can Capture the Fall Merch Rush";

export const metadata = {
    title: "Back-to-School 2026 Custom Apparel: The Fall Merch Window | Krazy Kreators",
    description:
        "Back-to-school is a major custom apparel window. A planning guide for small US brands launching fall 2026 merch drops with fast-turnaround manufacturing.",
    keywords: [
        "back to school custom apparel 2026",
        "back to school apparel manufacturing",
        "fall merch drop ideas",
        "custom college apparel",
        "campus streetwear brand",
        "back to school t-shirt printing",
        "DTF printing short run apparel",
        "collegiate licensed apparel",
        "fall capsule production timeline",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description:
            "$103.5 billion moved through back-to-college this year. What decides who gets a share of it is a calendar most brands start reading too late.",
        images: ["/blog/back-to-school-apparel-2026-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description:
            "$103.5 billion moved through back-to-college this year. What decides who gets a share of it is a calendar most brands start reading too late.",
        images: ["/blog/back-to-school-apparel-2026-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "When should a small brand start production for a back-to-school apparel drop?",
        a: "Eight weeks before you want stock on the shelf, and ten if it is a first order with a new factory. Most four-year campuses run move-in across the middle two weeks of August, so stock on hand by mid-August means production finished by the end of July and week one falling in the first week of June. The October tail is more forgiving: homecoming and family weekends run through the month, so an eight-week clock started in early September still lands in front of them.",
    },
    {
        q: "How big is the back-to-school window for custom apparel?",
        a: "The National Retail Federation's July 2026 survey of 7,533 consumers puts the whole season at $146.8 billion — $43.3 billion for K-12 and a record $103.5 billion for college, the first time the college figure has passed $100 billion. Clothing and accessories account for $12.5 billion of the K-12 total and $13.1 billion of the college total. There are far fewer college students than school children, and they still buy more apparel in aggregate.",
    },
    {
        q: "Why is DTF printing better than screen printing for a fall merch drop?",
        a: "Because of the shape of the order rather than its size. Screen printing charges a setup per colour per design, so six designs at four colours means twenty-four screens before the first garment is printed — cheap only if you spread it over deep quantities of the same design. DTF, or direct-to-film, prints artwork onto a film that is powdered with adhesive and heat-pressed on, so there are no screens, full colour costs what one colour costs, and the per-piece price barely moves between forty units and four hundred. The trade-off is hand feel: on a premium heavyweight crewneck a DTF transfer sits on the surface as a thin film in a way a discharge screen print does not.",
    },
    {
        q: "Can I put a university's name on a shirt without a licence?",
        a: "No. University names, nicknames and logos are registered trademarks, and selling apparel carrying them requires a licence. The Collegiate Licensing Company handles this for a large share of US institutions: a retail licence carries a $250 non-refundable application fee plus $125 for each additional school, and every licensee must hold general liability insurance of at least $2 million in the aggregate and $1 million per occurrence. Royalties are set by each institution — the University of Kansas requires at least 12 percent of the wholesale selling cost per item. The legitimate alternative is to sell the place rather than the institution: a town, a street, a neighbourhood or a local reference that no athletics department owns.",
    },
    {
        q: "Which categories sell best for campus apparel in fall?",
        a: "Fleece carries the season. A hooded sweatshirt and a crewneck are the two garments a student wears in public most days for four months, which is what gives them a repeat-purchase habit. Weight is the quality signal — roughly 380 to 450 gsm reads as substantial and holds shape through a term of laundry, while 280 gsm tells the buyer what it cost. Dorm merchandise such as blankets and mugs sells well in August but runs on a different supply chain with different minimums and testing rules, so it is a second business rather than an extra SKU.",
    },
    {
        q: "How do you raise average order value in a six-week selling window?",
        a: "Bundle, because there is no time to build repeat purchase. Three that work on campus are the move-in kit (hoodie, tee and beanie at a set price under the sum of the parts), the roommate two-pack that turns one buyer into two garments with no second acquisition cost, and the family-weekend gift bundle aimed at a parent buying for someone else. Have bundles assembled at the factory during the packing week rather than by hand after the stock lands, or the order value you gained is paid for in late shipments.",
    },
];

export default async function BackToSchoolApparelPage() {
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
                    "Back-to-school is a major custom apparel window. A planning guide for small US brands launching fall 2026 merch drops with fast-turnaround manufacturing.",
                image: "https://krazykreators.com/blog/back-to-school-apparel-2026-hero.jpg",
                datePublished: "2026-09-03",
                dateModified: "2026-09-03",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Manufacturing",
                keywords:
                    "back to school custom apparel 2026, back to school apparel manufacturing, fall merch drop ideas, custom college apparel, campus streetwear brand, back to school t-shirt printing",
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
            <BackToSchoolApparelClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
