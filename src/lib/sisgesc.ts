import { apiConfig, isSisgescConfigured } from "@/config/api";
import type {
  SisgescCompanyInfo,
  SisgescLaravelPaginated,
  SisgescPriceContext,
  SisgescProduct,
  SisgescSiteInfo,
} from "@/types/sisgesc";

type SiteFetchOptions = {
  init?: RequestInit;
  priceContext?: SisgescPriceContext;
  /** When false, missing config returns null instead of throwing. Default true for “optional” usage. */
  required?: boolean;
};

function buildSiteUrl(path: string, extraParams?: Record<string, string | undefined>) {
  const base = apiConfig.sisgescBaseUrl.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}/api/site${normalized.replace(/^\/api\/site/, "")}`);

  url.searchParams.set("key", apiConfig.sisgescSiteApiKey);

  if (extraParams) {
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  return url;
}

/**
 * Low-level SISGESC Site API fetch.
 * Auth uses the site `key` (query recommended for CORS; also sent as header).
 * Returns null when SISGESC is not configured.
 */
export async function fetchSiteApi<T>(
  path: string,
  options: SiteFetchOptions = {},
): Promise<T | null> {
  if (!isSisgescConfigured()) {
    if (options.required) {
      throw new Error("SISGESC Site API is not configured");
    }
    return null;
  }

  const url = buildSiteUrl(path, {
    destination_state: options.priceContext?.destination_state,
    customer_reference: options.priceContext?.customer_reference,
    customer_session: options.priceContext?.customer_session,
  });

  const headers = new Headers(options.init?.headers);
  headers.set("Accept", "application/json");
  headers.set("key", apiConfig.sisgescSiteApiKey);

  const response = await fetch(url.toString(), {
    ...options.init,
    headers,
    next: { revalidate: apiConfig.cacheTtlSeconds },
  });

  if (response.status === 403) {
    throw new Error("SISGESC Site API key missing or invalid (403)");
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`SISGESC Site API failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

/** Absolute image URL helper for relative SISGESC media paths. */
export function resolveSisgescMediaUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const mediaBase = (apiConfig.sisgescMediaBaseUrl || apiConfig.sisgescBaseUrl).replace(
    /\/$/,
    "",
  );
  if (!mediaBase) return path;
  return `${mediaBase}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function fetchSiteProducts(priceContext?: SisgescPriceContext) {
  return fetchSiteApi<SisgescProduct[]>("/products", { priceContext });
}

export async function fetchSiteProductsPaginated(
  pageSize: number,
  priceContext?: SisgescPriceContext,
) {
  return fetchSiteApi<SisgescLaravelPaginated<SisgescProduct>>(`/products/${pageSize}`, {
    priceContext,
  });
}

export async function searchSiteProducts(
  name: string,
  priceContext?: SisgescPriceContext,
) {
  const term = encodeURIComponent(name.trim());
  return fetchSiteApi<SisgescLaravelPaginated<SisgescProduct>>(
    `/searchProducts/${term}`,
    { priceContext },
  );
}

export async function fetchSiteProduct(
  companyId: number | string,
  productId: number | string,
  priceContext?: SisgescPriceContext,
) {
  return fetchSiteApi<SisgescProduct>(`/product/${companyId}/${productId}`, {
    priceContext,
  });
}

export async function fetchSiteInfo() {
  return fetchSiteApi<SisgescSiteInfo>("/");
}

export async function fetchSiteCompany() {
  return fetchSiteApi<SisgescCompanyInfo>("/company");
}

/** @deprecated Use fetchSiteApi — kept for any residual imports. */
export async function fetchFromSisgesc<T>(path: string, init?: RequestInit): Promise<T | null> {
  return fetchSiteApi<T>(path, { init });
}
