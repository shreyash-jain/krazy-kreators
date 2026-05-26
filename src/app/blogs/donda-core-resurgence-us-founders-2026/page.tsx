import DondaCoreClient from "./DondaCoreClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "What US Founders Should Steal from the DONDA-Core Resurgence | Krazy Kreators",
    description:
        "February 2026 marked the ten-year anniversary of The Life of Pablo. DONDA-era references are back across resale, runway, and US streetwear collabs. For US founders, the resurgence is not nostalgia — it is a blueprint. Cultural anchor, limited drop, product as artifact. Here is the playbook to steal.",
};

export default async function DondaCorePage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("donda-core-resurgence-us-founders-2026", { baseUrl }),
        getComments("donda-core-resurgence-us-founders-2026", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="donda-core-resurgence-us-founders-2026" />
            <DondaCoreClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
