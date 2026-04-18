import LeadTimeTimelineClient from "./LeadTimeTimelineClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "The Lead-Time Timeline: From Design Concept to Doorstep | Krazy Kreators",
    description: "A realistic breakdown of the manufacturing calendar—sampling, sourcing, production, and shipping—and why 'rush' orders can be risky.",
};

export default async function LeadTimeTimelinePage() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') ?? 'https';
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("lead-time-timeline-design-to-doorstep", { baseUrl }),
        getComments("lead-time-timeline-design-to-doorstep", { baseUrl }),
    ]);
    return <LeadTimeTimelineClient initialLikeCount={likeCount} initialComments={comments} />;
}
