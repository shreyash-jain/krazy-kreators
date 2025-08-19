import DesignServicesClient from "./DesignServicesClient";

export const metadata = {
  title: "Krazy Kreators Design Services | From Concept to Collection",
  description:
    "Fashion design services for brands: trend forecasting, print and pattern design, new collection development, garment sampling services, and more.",
  alternates: { canonical: "/design-services" },
  keywords: [
    "fashion design services",
    "trend forecasting",
    "garment sampling services",
    "print and pattern design",
    "fashion design retainership",
  ],
};

export default function Page() {
  return <DesignServicesClient />;
}