import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.sisgesc.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sisgesc.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
