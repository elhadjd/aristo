import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap-entries";

/** Rebuild sitemap HTML route on every production build. */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
