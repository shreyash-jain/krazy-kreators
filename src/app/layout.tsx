import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krazy Kreators | Start a Clothing Brand | Custom Clothing Production",
  description:
    "Create your own fashion brand with Krazy Kreators. End-to-end clothing manufacturing services — design, sampling, and custom clothing production. Start today.",
  metadataBase: new URL("https://www.krazykreators.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Logo.ico",
    shortcut: "/Logo.ico",
    apple: "/Logo.ico",
  },
  openGraph: {
    title: "Krazy Kreators | Start a Clothing Brand | Custom Clothing Production",
    description:
      "Create your own fashion brand with Krazy Kreators. End-to-end clothing manufacturing services — design, sampling, and custom clothing production.",
    url: "/",
    siteName: "Krazy Kreators",
    images: [
      {
        url: "/brands/hy-official-coverimage.png",
        width: 1200,
        height: 630,
        alt: "Create your own fashion brand with clothing manufacturing services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Start a Clothing Brand | Custom Clothing Production",
    description:
      "Create your own fashion brand with end-to-end clothing manufacturing services by Krazy Kreators.",
    images: ["/brands/hy-official-coverimage.png"],
  },
  keywords: [
    "create your own fashion brand",
    "start a clothing brand",
    "clothing manufacturing services",
    "fashion brand manufacturing",
    "custom clothing production",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Krazy Kreators",
    url: "https://www.krazykreators.com/",
    description:
      "Clothing manufacturing services for founders to create their own fashion brand — design, sampling, and custom clothing production.",
    areaServed: "Worldwide",
    sameAs: [
      "https://www.instagram.com/krazy_kreators/",
      "https://www.linkedin.com/company/krazy-kreators/",
      "https://www.pinterest.com/",
    ],
    logo: "https://www.krazykreators.com/brands/logo.svg",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} antialiased bg-white min-h-screen`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Navbar />
        {children}
        {/* <BottomNav /> */}
      </body>
    </html>
  );
}
