export const apiConfig = {
  /** Browser / same-origin API base. Empty string = relative /api */
  publicBaseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  /** Optional upstream SISGESC REST API */
  sisgescBaseUrl: process.env.SISGESC_API_URL || "",
  sisgescApiKey: process.env.SISGESC_API_KEY || "",
  timeoutMs: 15000,
  defaultPageSize: 12,
  cacheTtlSeconds: 60,
} as const;

export function getApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = apiConfig.publicBaseUrl.replace(/\/$/, "");
  if (!base) return `/api${normalized.replace(/^\/api/, "")}`;
  if (base.endsWith("/api")) return `${base}${normalized.replace(/^\/api/, "")}`;
  return `${base}/api${normalized.replace(/^\/api/, "")}`;
}
