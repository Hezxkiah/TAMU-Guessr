// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options here */
  async redirects() {
    return [
      {
        source: '/', // The incoming request path (the root)
        destination: '/home', // The path you want to redirect to
        permanent: true, // Set to true for a 308 permanent redirect (good for SEO)
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        pathname: '/images/stock/**',
      } as any, // 👈 Use 'as any' as the fallback
    ],
  },
};

export default nextConfig;