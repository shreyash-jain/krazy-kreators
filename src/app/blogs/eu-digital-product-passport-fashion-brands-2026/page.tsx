import EuDigitalProductPassportClient from "./EuDigitalProductPassportClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "What the EU Digital Product Passport Means for Your Clothing Brand in 2026 | Krazy Kreators",
    description:
        "The EU Digital Product Passport rolls out in 2027 and will require full textile traceability. Here is what fashion founders need to collect from their manufacturer right now, who is affected, and how documented production protects your brand before EU retailers start asking.",
};

export default async function EuDigitalProductPassportPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("eu-digital-product-passport-fashion-brands-2026", { baseUrl }),
        getComments("eu-digital-product-passport-fashion-brands-2026", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="eu-digital-product-passport-fashion-brands-2026" />
            <EuDigitalProductPassportClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
