import type { NextConfig } from "next";

function hostnameFrom(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const sisgescHosts = [
  hostnameFrom(process.env.SISGESC_API_URL),
  hostnameFrom(process.env.SISGESC_MEDIA_URL),
].filter((host): host is string => Boolean(host));

/**
 * Many custom hosts (incl. reverse proxies) break Next.js `/_next/image`.
 * Default to unoptimized so remote Unsplash + local `/uploads` load as normal `<img>`.
 * Set NEXT_IMAGE_UNOPTIMIZED=false on platforms that fully support the optimizer (e.g. Vercel).
 */
const imageUnoptimized = process.env.NEXT_IMAGE_UNOPTIMIZED !== "false";

const nextConfig: NextConfig = {
  images: {
    unoptimized: imageUnoptimized,
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.sisgesc.com",
      },
      {
        protocol: "http",
        hostname: "**.sisgesc.com",
      },
      {
        protocol: "https",
        hostname: "aristo.zyvoerp.com",
      },
      {
        protocol: "http",
        hostname: "aristo.zyvoerp.com",
      },
      {
        protocol: "https",
        hostname: "**.zyvoerp.com",
      },
      ...sisgescHosts.flatMap((hostname) => [
        { protocol: "https" as const, hostname },
        { protocol: "http" as const, hostname },
      ]),
    ],
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql"],
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
