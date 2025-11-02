import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'gov-web-sing.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Ensure API routes don't interfere with Express server
  async rewrites() {
    return [];
  },
  // Optimize production builds
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
