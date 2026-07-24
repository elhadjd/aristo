/**
 * Generates public/sitemap.xml during `npm run build`.
 * Uses the same entries as app/sitemap.ts so search engines always get a fresh map.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

async function main() {
  const { getSitemapEntries, sitemapEntriesToXml } = await import("../src/lib/sitemap-entries");
  const entries = await getSitemapEntries();
  const xml = sitemapEntriesToXml(entries);
  const outDir = path.join(process.cwd(), "public");
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "sitemap.xml");
  await writeFile(outFile, xml, "utf8");
  console.log(`[seo] Wrote ${entries.length} URLs to public/sitemap.xml`);
}

main().catch((error) => {
  console.error("[seo] Failed to generate sitemap.xml", error);
  process.exit(1);
});
