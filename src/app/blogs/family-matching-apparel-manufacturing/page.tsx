import FamilyMatchingClient from "./FamilyMatchingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const SLUG = "family-matching-apparel-manufacturing";
const URL = `https://krazykreators.com/blogs/${SLUG}`;
// Headline supplied in the brief and used verbatim (82 chars, over the 62-char house
// cap — the owner's wording wins). The shorter `metadata.title` below is set separately
// so the SERP does not truncate mid-word.
const TITLE =
    "Kidswear and Family Matching Apparel: A Growing Niche for Custom US Clothing Brands";
const DEK =
    "The set is one design, but the child's half is a different product under US law. What that does to fabric, fit, labels, the calendar and your SKU count.";

export const metadata = {
    title: "Family Matching Apparel Manufacturing for US Brands | Krazy Kreators",
    description:
        "Family matching apparel is a growing US niche. What clothing brands need to know about kidswear safety rules, sizing and seasonal demand in 2026.",
    keywords: [
        "family matching apparel brand",
        "family matching apparel manufacturing",
        "custom kidswear manufacturing",
        "matching family outfits USA",
        "kids clothing production",
        "family photo outfit sets",
        "matching family pajamas manufacturer",
        "children's sleepwear flammability 16 CFR 1615",
        "CPSIA children's clothing requirements",
        "kidswear tracking label",
        "family pajama set production",
        "mommy and me outfits manufacturing",
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: "article",
        url: URL,
        title: TITLE,
        description: DEK,
        images: ["/blog/family-matching-apparel-manufacturing-hero.jpg"],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DEK,
        images: ["/blog/family-matching-apparel-manufacturing-hero.jpg"],
    },
};

const FAQS = [
    {
        q: "What safety rules apply to the kids' pieces in a family matching set?",
        a: "Every piece sized for a child of 12 or under is a children's product under US law, whatever the adult pieces are. That means accessible components such as snaps, zippers and buttons are tested for lead at a CPSC-accepted laboratory (the limit is 100 parts per million; 90 for paints and screen-print inks), the garment carries a permanent tracking label naming the maker, where and when it was made and a batch code, and you issue a Children's Product Certificate that is filed electronically at the border. If the piece is pajamas, a nightgown, a robe or loungewear in a size above 9 months, it must also either pass the children's sleepwear flame test or be cut tight-fitting to the dimensions in the regulation and carry the yellow hangtag. Hood and neck drawstrings are out on children's outerwear from 2T to 12.",
    },
    {
        q: "Do matching family pajamas have to be flame resistant?",
        a: "The children's pieces do, or they have to be tight-fitting instead. Above size 9 months and up to size 14, children's sleepwear either passes a vertical flame test on the fabric, the seams and the finished garments, or it is cut snug to the maximum chest, waist, seat, arm, thigh, wrist and ankle measurements in the rule, with tapered sleeves and legs and no trim standing more than a quarter inch off the garment. Most cotton sets take the snug route because cotton will not pass the flame test without a chemical finish; polyester knits usually can. The adult pieces are not covered by the sleepwear rule at all. They fall under the general clothing flammability standard, which most plain fabrics of 2.6 ounces per square yard or heavier are exempt from, though a brushed flannel is a raised-surface fabric and does need the test.",
    },
    {
        q: "Is family matching apparel actually a growing market?",
        a: "Growing per household, not because there are more children. US births fell 1% in 2025 to about 3.6 million, and Circana expected kids' apparel dollar sales to fall 1% to 2% in the third quarter of 2026. What is growing is the number of occasions a family dresses alike for: Christmas pajamas, the fall family-photo session, Easter, the Fourth of July, reunions, trips. And kidswear has a repeat engine no adult category has: the child needs a new size every year, and the family re-buys the adult pieces to keep the set complete. Plan to take share on print, fabric and fit, not to ride a demographic tide.",
    },
    {
        q: "How many sizes does a family matching set need?",
        a: "Fewer than you think if you decide it early. A naive run — women XS to XL, men XS to XL, kids 2T to 14 in ten steps, baby in six — is 26 SKUs per print, and three prints is 78. A disciplined run holds one fabric across the family, one unisex kids' block in six sizes (2T, 4, 6, 8, 10, 12), baby as a single snug romper in the two sizes the infant exemption covers, women in five sizes and men in four: 17 per print, 34 for two. Sizes come from six different ASTM body-measurement tables, so the kids' block is drafted, not scaled down from the adult.",
    },
    {
        q: "When should a brand order family matching sets for the holidays?",
        a: "A first cut-and-sew run takes about 23 weeks, a reorder of an existing style about 12, and decorated stock blanks six to eight. Commit on 16 September 2026 and a new set lands on 24 February 2027, after the season; a reorder lands 9 December, which is too late to reach customers before Christmas Eve by ground; decorated blanks land 11 November, which is why matching tees and sweatshirts printed on blanks are the only family product still open for this December. For cut-and-sew, the honest targets are the fall photo season of 2027 (stock by mid-August, so commit by early March) and holiday 2027 (stock by 1 November, so commit by late May).",
    },
];

export default async function FamilyMatchingPage() {
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
                description: DEK,
                image: "https://krazykreators.com/blog/family-matching-apparel-manufacturing-hero.jpg",
                datePublished: "2026-09-16",
                dateModified: "2026-09-16",
                author: { "@type": "Organization", name: "Krazy Kreators", url: "https://krazykreators.com" },
                publisher: {
                    "@type": "Organization",
                    name: "Krazy Kreators",
                    url: "https://krazykreators.com",
                },
                mainEntityOfPage: { "@type": "WebPage", "@id": URL },
                articleSection: "Manufacturing",
                keywords:
                    "family matching apparel brand, family matching apparel manufacturing, custom kidswear manufacturing, matching family outfits USA, kids clothing production, family photo outfit sets",
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
            <FamilyMatchingClient
                initialLikeCount={likeCount}
                initialComments={sanitizedComments}
                faqs={FAQS}
            />
        </>
    );
}
