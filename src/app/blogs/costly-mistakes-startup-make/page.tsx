import CostlyMistakesBlogClient from "./CostlyMistakesBlogClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Costly Mistakes Fashion Startups Make (and How to Avoid Them) | Krazy Kreators",
  description: "Learn about the common pitfalls that derail fashion startups and discover practical strategies to avoid costly mistakes in design, manufacturing, and business operations.",
};

export default async function CostlyMistakesBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount("costly-mistakes-startup-make", { baseUrl }),
    getComments("costly-mistakes-startup-make", { baseUrl }),
  ]);
  return <CostlyMistakesBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}

