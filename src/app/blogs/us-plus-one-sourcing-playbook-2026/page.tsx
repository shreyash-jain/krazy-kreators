import PlusOneSourcingClient from "./PlusOneSourcingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Why US Brands Aren't Leaving China in 2026 — They're Adding to It | Krazy Kreators",
    description:
        "US brands aren't leaving China — they're adding. The 2026 US plus-one sourcing strategy reshaping which apparel founders hit premium positioning and which compete for spillover.",
};

export default async function PlusOneSourcingPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("us-plus-one-sourcing-playbook-2026", { baseUrl }),
        getComments("us-plus-one-sourcing-playbook-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="us-plus-one-sourcing-playbook-2026" />
            <PlusOneSourcingClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
