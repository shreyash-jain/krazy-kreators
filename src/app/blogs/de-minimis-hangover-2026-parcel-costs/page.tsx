import DeMinimisHangoverClient from "./DeMinimisHangoverClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The De Minimis Hangover: 6 Months, Real Numbers | Krazy Kreators",
    description:
        "De minimis 2026, six months in: what one parcel really costs now — $46.91 shipping direct vs $13.13 bulk-imported into a US 3PL. The per-parcel duty math.",
    keywords:
        "de minimis 2026, de minimis end 2026, $800 de minimis rule, per-parcel duty cost 2026, bulk import vs ship direct, de minimis hangover, US 3PL fulfillment cost 2026, apparel import duty 2026, postal informal entry October 2026, landed cost per parcel, Section 301 forced labor tariff apparel, merchandise processing fee informal entry, DTC parcel duty cost, carrier disbursement fee 2026, break-even order value ecommerce",
    openGraph: {
        title: "The De Minimis Hangover: 6 Months, Real Numbers",
        description:
            "Six months into the first full year every parcel owes duty, the gap between shipping direct and bulk-importing into a US 3PL is $33.78 an order. Here's the math.",
        images: ["/blog/de-minimis-hangover-hero.jpg"],
    },
};

export default async function DeMinimisHangoverPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("de-minimis-hangover-2026-parcel-costs", { baseUrl }),
        getComments("de-minimis-hangover-2026-parcel-costs", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="de-minimis-hangover-2026-parcel-costs" />
            <DeMinimisHangoverClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
