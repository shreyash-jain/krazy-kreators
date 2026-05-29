import PlusOneSourcingClient from "./PlusOneSourcingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The US 'Plus-One' Sourcing Playbook for Clothing Brand Founders in 2026 | Krazy Kreators",
    description:
        "US brands aren't leaving China. They're adding. Plus-One sourcing is the operational answer to the tariff era — one country can't hold everything anymore. Here is what's actually happening, why India is winning the apparel Plus-One race in 2026, the five-step playbook, and the four mistakes to avoid.",
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
    );
}
