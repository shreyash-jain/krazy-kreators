import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
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
