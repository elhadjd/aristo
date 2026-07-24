function readSisgescBaseUrl() {
  return (process.env.SISGESC_API_URL || "").trim();
}

function readSisgescSiteApiKey() {
  return (process.env.SISGESC_SITE_API_KEY || process.env.SISGESC_API_KEY || "").trim();
}

export const apiConfig = {
  /** Browser / same-origin API base. Empty string = relative /api */
  get publicBaseUrl() {
    return process.env.NEXT_PUBLIC_API_URL || "";
  },
  /**
   * SISGESC host for contact/lead sync only (not catalog).
   * Example: https://erp.example.com
   */
  get sisgescBaseUrl() {
    return readSisgescBaseUrl();
  },
  /**
   * Site API key for SISGESC contact endpoints (`key` query/header).
   * Server-side only.
   */
  get sisgescSiteApiKey() {
    return readSisgescSiteApiKey();
  },
  timeoutMs: 15000,
  defaultPageSize: 12,
  cacheTtlSeconds: 60,
};

export { isSisgescContactConfigured } from "@/lib/sisgesc-contact";

export function getApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = apiConfig.publicBaseUrl.replace(/\/$/, "");
  if (!base) return `/api${normalized.replace(/^\/api/, "")}`;
  if (base.endsWith("/api")) return `${base}${normalized.replace(/^\/api/, "")}`;
  return `${base}/api${normalized.replace(/^\/api/, "")}`;
}
