import EndToEndServicesClient from "./EndToEndServicesClient";

export const metadata = {
  title: "Krazy Kreators End-to-End Services | Full Fashion Brand Solution",
  description:
    "Subscription-based end-to-end solution for fashion brands: trend research, design, sampling, manufacturing, 100% inspection, packaging, storage, and real-time updates.",
  alternates: { canonical: "/end-to-end-services" },
  keywords: [
    "end-to-end fashion services",
    "fashion brand subscription",
    "garment production management",
    "100% inspection",
    "design to manufacturing",
    "real-time production updates",
  ],
};

export default function Page() {
  return <EndToEndServicesClient />;
}

