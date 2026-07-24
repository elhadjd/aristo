import type { MetadataRoute } from "next";
import { staticSitemapPaths } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { listArticles, listVehicles } from "@/lib/data";

export type SitemapEntry = MetadataRoute.Sitemap[number];

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: SitemapEntry[] = staticSitemapPaths.map((route) => ({
    url: `${base}${route.path === "/" ? "/" : route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [{ data: vehicles }, articles] = await Promise.all([
    listVehicles({ pageSize: 5000 }),
    listArticles(true),
  ]);

  const vehicleRoutes: SitemapEntry[] = vehicles.map((vehicle) => ({
    url: `${base}/vehicles/${vehicle.id}`,
    lastModified: new Date(vehicle.updated_at || now),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const articleRoutes: SitemapEntry[] = articles.map((article) => ({
    url: `${base}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt || now),
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  return [...staticRoutes, ...vehicleRoutes, ...articleRoutes];
}

export function sitemapEntriesToXml(entries: SitemapEntry[]): string {
  const body = entries
    .map((entry) => {
      const lastmod =
        entry.lastModified instanceof Date
          ? entry.lastModified.toISOString()
          : entry.lastModified
            ? new Date(entry.lastModified).toISOString()
            : new Date().toISOString();
      return [
        "  <url>",
        `    <loc>${escapeXml(entry.url)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        entry.changeFrequency ? `    <changefreq>${entry.changeFrequency}</changefreq>` : null,
        typeof entry.priority === "number" ? `    <priority>${entry.priority.toFixed(1)}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
