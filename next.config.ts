import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loaderFile: "./src/lib/cloudinaryLoader.ts",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/Logo.ico",
      },
      {
        source: "/favicon.svg",
        destination: "/Logo.svg",
      },
      {
        source: "/apple-touch-icon.png",
        destination: "/Logo.ico",
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/Logo.ico",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/product-category/womens-collection',
        destination: '/design-services',
        permanent: true,
      },
      {
        source: '/gallery',
        destination: '/design-services',
        permanent: true,
      },
      // Host-specific versions to avoid double redirects from www → apex
      {
        source: '/about-us',
        has: [
          {
            type: 'host',
            value: 'www.krazykreators.com',
          },
        ],
        destination: 'https://krazykreators.com/about',
        permanent: true,
      },
      {
        source: '/contact-us',
        has: [
          {
            type: 'host',
            value: 'www.krazykreators.com',
          },
        ],
        destination: 'https://krazykreators.com/contact',
        permanent: true,
      },
      {
        source: '/product-category/womens-collection',
        has: [
          {
            type: 'host',
            value: 'www.krazykreators.com',
          },
        ],
        destination: 'https://krazykreators.com/design-services',
        permanent: true,
      },
      {
        source: '/gallery',
        has: [
          {
            type: 'host',
            value: 'www.krazykreators.com',
          },
        ],
        destination: 'https://krazykreators.com/design-services',
        permanent: true,
      },
      // Catch-all: redirect any www host traffic to apex
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.krazykreators.com',
          },
        ],
        destination: 'https://krazykreators.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
