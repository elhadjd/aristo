import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { listVehicles } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const staticRoutes = [
    "",
    "/inventory",
    "/financing",
    "/trade-in",
    "/services",
    "/about",
    "/testimonials",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const { data: vehicles } = await listVehicles({ pageSize: 100 });
  const vehicleRoutes = vehicles.map((vehicle) => ({
    url: `${base}/vehicles/${vehicle.id}`,
    lastModified: new Date(vehicle.updated_at),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
