/**
 * Client-safe media URL helpers (no Node.js imports).
 */

/**
 * Build a browser-usable media URL.
 * - Keeps http(s) / data URLs as-is
 * - Maps `/uploads/...` → `/api/uploads/...` (served by Next route)
 * - Prefixes with site origin when provided
 */
export function resolveMediaSrc(src: string, origin?: string | null): string {
  const value = (src || "").trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  let pathname = value.startsWith("/") ? value : `/${value}`;
  if (pathname.startsWith("/uploads/")) {
    pathname = pathname.replace(/^\/uploads\//, "/api/uploads/");
  }

  const base = (origin || (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_SITE_URL : "") || "")
    .toString()
    .replace(/\/$/, "");
  if (!base) return pathname;
  return `${base}${pathname}`;
}

export function mediaOriginFromRequest(request: { headers: Headers; url: string }) {
  const env = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  if (env) return env.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost.split(",")[0].trim()}`;
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return "";
  }
}
