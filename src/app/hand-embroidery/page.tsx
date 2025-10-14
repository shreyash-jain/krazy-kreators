import { Metadata } from "next";
import HandEmbroideryClient from "./HandEmbroideryClient";

export const metadata: Metadata = {
  title: "Hand Embroidery Services | Krazy Kreators - Artisanal Craftsmanship",
  description: "Discover our hand embroidery services featuring Zardozi, Aari, Resham, and more traditional techniques. Premium detailing for bridal couture and contemporary wear at Krazy Kreators.",
  keywords: "hand embroidery, zardozi, aari work, resham embroidery, beadwork, threadwork, appliqué, bridal couture, artisanal craftsmanship, luxury fashion",
  openGraph: {
    title: "Hand Embroidery Services | Krazy Kreators",
    description: "Where craft meets couture - Premium hand embroidery services featuring traditional techniques for luxury fashion brands.",
    url: "https://www.krazykreators.com/hand-embroidery",
    siteName: "Krazy Kreators",
    images: [
      {
        url: "/services/design/hand-embriodery.png",
        width: 1200,
        height: 630,
        alt: "Hand Embroidery Services by Krazy Kreators",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hand Embroidery Services | Krazy Kreators",
    description: "Where craft meets couture - Premium hand embroidery services featuring traditional techniques for luxury fashion brands.",
    images: ["/services/design/hand-embriodery.png"],
  },
  alternates: {
    canonical: "https://www.krazykreators.com/hand-embroidery",
  },
};

export default function HandEmbroideryPage() {
  return <HandEmbroideryClient />;
}
