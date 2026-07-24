import { apiConfig } from "@/config/api";

/**
 * Optional proxy helper for SISGESC upstream.
 * When SISGESC_API_URL is unset, local API routes serve curated mock data.
 */
export async function fetchFromSisgesc<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!apiConfig.sisgescBaseUrl) return null;

  const url = `${apiConfig.sisgescBaseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (apiConfig.sisgescApiKey) {
    headers.set("Authorization", `Bearer ${apiConfig.sisgescApiKey}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
    next: { revalidate: apiConfig.cacheTtlSeconds },
  });

  if (!response.ok) {
    throw new Error(`SISGESC request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
