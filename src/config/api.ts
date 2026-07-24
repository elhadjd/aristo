function parseIdList(value: string | undefined): number[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
}

export const apiConfig = {
  /** Browser / same-origin API base. Empty string = relative /api */
  publicBaseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  /**
   * SISGESC host only, e.g. https://erp.example.com
   * Site catalog lives at `{host}/api/site/...`
   */
  sisgescBaseUrl: process.env.SISGESC_API_URL || "",
  /**
   * Site API key (`key` query/header). Kept server-side only.
   * Accepts SISGESC_SITE_API_KEY or legacy SISGESC_API_KEY.
   */
  sisgescSiteApiKey:
    process.env.SISGESC_SITE_API_KEY || process.env.SISGESC_API_KEY || "",
  /** Optional company id for `/api/site/product/{company}/{product}` */
  sisgescCompanyId: process.env.SISGESC_COMPANY_ID
    ? Number(process.env.SISGESC_COMPANY_ID)
    : undefined,
  /**
   * product_type_id values treated as services.
   * Example from SISGESC docs: service rows often use type id 2.
   */
  sisgescServiceTypeIds: parseIdList(process.env.SISGESC_SERVICE_TYPE_IDS || "2"),
  /** Optional public media/CDN host when product.image is relative */
  sisgescMediaBaseUrl:
    process.env.SISGESC_MEDIA_URL || process.env.SISGESC_API_URL || "",
  timeoutMs: 15000,
  defaultPageSize: 12,
  cacheTtlSeconds: 60,
} as const;

export function isSisgescConfigured(): boolean {
  return Boolean(apiConfig.sisgescBaseUrl && apiConfig.sisgescSiteApiKey);
}

export function getApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = apiConfig.publicBaseUrl.replace(/\/$/, "");
  if (!base) return `/api${normalized.replace(/^\/api/, "")}`;
  if (base.endsWith("/api")) return `${base}${normalized.replace(/^\/api/, "")}`;
  return `${base}/api${normalized.replace(/^\/api/, "")}`;
}
