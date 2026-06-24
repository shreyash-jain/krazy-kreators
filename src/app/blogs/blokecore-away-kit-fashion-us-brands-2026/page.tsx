import AwayKitClient from "./AwayKitClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The Away Kit Became the Real Fashion Object | Krazy Kreators",
    description:
        "Away kits are the breakout fashion object of the 2026 World Cup. Here's how US DTC founders can ride blokecore with a fashion-first colorway — no license required.",
};

export default async function AwayKitPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("blokecore-away-kit-fashion-us-brands-2026", { baseUrl }),
        getComments("blokecore-away-kit-fashion-us-brands-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="blokecore-away-kit-fashion-us-brands-2026" />
            <AwayKitClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
