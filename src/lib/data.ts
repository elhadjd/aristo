import { apiConfig, isSisgescConfigured } from "@/config/api";
import {
  mockBrands,
  mockCategories,
  mockServices,
  mockSettings,
  mockTestimonials,
} from "@/data/mock-catalog";
import { mockVehicles } from "@/data/mock-vehicles";
import {
  mapProductsToBrands,
  mapProductsToCategories,
  mapSiteSettings,
  splitCatalog,
} from "@/lib/sisgesc-mappers";
import {
  fetchSiteCompany,
  fetchSiteInfo,
  fetchSiteProduct,
  fetchSiteProducts,
  searchSiteProducts,
} from "@/lib/sisgesc";
import type {
  Brand,
  Category,
  DealershipService,
  SiteSettings,
  Testimonial,
} from "@/types/common";
import type { SisgescProduct } from "@/types/sisgesc";
import type { PaginatedResponse, Vehicle, VehicleFilters } from "@/types/vehicle";
import { filterVehicles } from "@/utils/vehicles";

type CatalogSnapshot = {
  products: SisgescProduct[];
  vehicles: Vehicle[];
  services: DealershipService[];
  fetchedAt: number;
};

let catalogCache: CatalogSnapshot | null = null;

async function loadCatalog(force = false): Promise<CatalogSnapshot | null> {
  if (!isSisgescConfigured()) return null;

  const fresh =
    catalogCache && Date.now() - catalogCache.fetchedAt < apiConfig.cacheTtlSeconds * 1000;
  if (!force && fresh && catalogCache) return catalogCache;

  try {
    const products = (await fetchSiteProducts()) || [];
    const { vehicles, services } = splitCatalog(products);
    catalogCache = {
      products,
      vehicles,
      services,
      fetchedAt: Date.now(),
    };
    return catalogCache;
  } catch (error) {
    console.error("[ARISTO] Failed to load SISGESC catalog", error);
    return catalogCache;
  }
}

export async function listVehicles(
  filters: VehicleFilters = {},
): Promise<PaginatedResponse<Vehicle>> {
  const catalog = await loadCatalog();

  if (catalog) {
    if (filters.q?.trim()) {
      try {
        const remote = await searchSiteProducts(filters.q.trim());
        if (remote?.data) {
          const { vehicles } = splitCatalog(remote.data);
          return filterVehicles(vehicles, { ...filters, q: undefined, page: filters.page, pageSize: filters.pageSize, sort: filters.sort });
        }
      } catch (error) {
        console.error("[ARISTO] SISGESC search failed, using local filter", error);
      }
    }
    return filterVehicles(catalog.vehicles, filters);
  }

  return filterVehicles(mockVehicles, filters);
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const catalog = await loadCatalog();

  if (catalog) {
    const fromList = catalog.vehicles.find((vehicle) => vehicle.id === id);
    if (fromList) {
      const raw = catalog.products.find((product) => String(product.id) === id);
      const companyId = apiConfig.sisgescCompanyId || raw?.company_id;
      if (companyId != null) {
        try {
          const detailed = await fetchSiteProduct(companyId, id);
          if (detailed) {
            const { vehicles } = splitCatalog([detailed]);
            return vehicles[0] || fromList;
          }
        } catch (error) {
          console.error("[ARISTO] SISGESC product detail failed", error);
        }
      }
      return fromList;
    }

    if (apiConfig.sisgescCompanyId != null) {
      try {
        const detailed = await fetchSiteProduct(apiConfig.sisgescCompanyId, id);
        if (detailed) {
          const { vehicles } = splitCatalog([detailed]);
          return vehicles[0] || null;
        }
      } catch (error) {
        console.error("[ARISTO] SISGESC product detail failed", error);
      }
    }

    return null;
  }

  return mockVehicles.find((vehicle) => vehicle.id === id) || null;
}

export async function listFeatured(limit = 6): Promise<Vehicle[]> {
  const { data } = await listVehicles({ sort: "newest", pageSize: Math.max(limit * 2, 12) });
  const featured = data.filter((vehicle) => vehicle.featured);
  return (featured.length ? featured : data).slice(0, limit);
}

export async function listLatest(limit = 8): Promise<Vehicle[]> {
  const { data } = await listVehicles({ sort: "newest", pageSize: limit });
  return data.slice(0, limit);
}

export async function listCategories(): Promise<Category[]> {
  const catalog = await loadCatalog();
  if (catalog) {
    const categories = mapProductsToCategories(catalog.products);
    return categories.length ? categories : mockCategories;
  }
  return mockCategories;
}

export async function listBrands(): Promise<Brand[]> {
  const catalog = await loadCatalog();
  if (catalog) {
    const brands = mapProductsToBrands(catalog.products);
    return brands.length ? brands : mockBrands;
  }
  return mockBrands;
}

export async function listServices(): Promise<DealershipService[]> {
  const catalog = await loadCatalog();
  if (catalog) {
    return catalog.services.length ? catalog.services : mockServices;
  }
  return mockServices;
}

export async function listTestimonials(): Promise<Testimonial[]> {
  // Site API does not expose testimonials in the documented routes.
  return mockTestimonials;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSisgescConfigured()) return mockSettings;

  try {
    const [site, company] = await Promise.all([fetchSiteInfo(), fetchSiteCompany()]);
    return mapSiteSettings(site, company, mockSettings);
  } catch (error) {
    console.error("[ARISTO] Failed to load SISGESC site/company settings", error);
    return mockSettings;
  }
}

export async function listRelated(id: string, limit = 4): Promise<Vehicle[]> {
  const vehicle = await getVehicle(id);
  if (!vehicle) return [];
  const { data } = await listVehicles({ brand: vehicle.brand, pageSize: limit + 1 });
  return data.filter((item) => item.id !== id).slice(0, limit);
}

export function getSisgescStatus() {
  return {
    configured: isSisgescConfigured(),
    host: apiConfig.sisgescBaseUrl || null,
    companyId: apiConfig.sisgescCompanyId ?? null,
    cacheAgeMs: catalogCache ? Date.now() - catalogCache.fetchedAt : null,
    productCount: catalogCache?.products.length ?? null,
  };
}
