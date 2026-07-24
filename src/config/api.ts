export const apiConfig = {
  /** Browser / same-origin API base. Empty string = relative /api */
  publicBaseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  /**
   * SISGESC host for contact/lead sync only (not catalog).
   * Example: https://erp.example.com
   */
  sisgescBaseUrl: process.env.SISGESC_API_URL || "",
  /**
   * Site API key for SISGESC contact endpoints (`key` query/header).
   * Server-side only.
   */
  sisgescSiteApiKey:
    process.env.SISGESC_SITE_API_KEY || process.env.SISGESC_API_KEY || "",
  timeoutMs: 15000,
  defaultPageSize: 12,
  cacheTtlSeconds: 60,
} as const;

export function isSisgescContactConfigured(): boolean {
  return Boolean(
    process.env.SISGESC_CONTACT_URL ||
      (apiConfig.sisgescBaseUrl && apiConfig.sisgescSiteApiKey),
  );
}

export function getApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = apiConfig.publicBaseUrl.replace(/\/$/, "");
  if (!base) return `/api${normalized.replace(/^\/api/, "")}`;
  if (base.endsWith("/api")) return `${base}${normalized.replace(/^\/api/, "")}`;
  return `${base}/api${normalized.replace(/^\/api/, "")}`;
}
