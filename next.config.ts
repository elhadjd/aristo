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

const nextConfig: NextConfig = {
  images: {
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
        hostname: "**.sisgesc.com",
      },
      {
        protocol: "http",
        hostname: "**.sisgesc.com",
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
