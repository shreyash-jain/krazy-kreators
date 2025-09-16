import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async redirects() {
    return [
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
