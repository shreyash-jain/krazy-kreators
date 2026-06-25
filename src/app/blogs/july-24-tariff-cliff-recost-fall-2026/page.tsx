import TariffCliffClient from "./TariffCliffClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The July 24 Tariff Cliff: Re-Cost Fall Before It Lands | Krazy Kreators",
    description:
        "Section 122's 10% blanket tariff sunsets July 24, 2026. Re-cost your Fall apparel POs across India, China, Vietnam and Bangladesh before the math moves.",
};

export default async function TariffCliffPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("july-24-tariff-cliff-recost-fall-2026", { baseUrl }),
        getComments("july-24-tariff-cliff-recost-fall-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="july-24-tariff-cliff-recost-fall-2026" />
            <TariffCliffClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
