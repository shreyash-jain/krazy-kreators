import ForcedLaborTariffClient from "./ForcedLaborTariffClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The 10% Tariff Floor Expires July 24 — Then What? | Krazy Kreators",
    description:
        "Section 122's flat 10% apparel tariff expires July 24, 2026. Here's the Section 301 forced-labor regime replacing it — and how to re-cost your Fall POs.",
};

export default async function ForcedLaborTariffPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("apparel-tariffs-july-2026-forced-labor-301-regime", { baseUrl }),
        getComments("apparel-tariffs-july-2026-forced-labor-301-regime", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="apparel-tariffs-july-2026-forced-labor-301-regime" />
            <ForcedLaborTariffClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
