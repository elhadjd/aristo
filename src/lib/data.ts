import {
  mockBrands,
  mockCategories,
  mockServices,
  mockSettings,
  mockTestimonials,
} from "@/data/mock-catalog";
import { mockVehicles } from "@/data/mock-vehicles";
import { fetchFromSisgesc } from "@/lib/sisgesc";
import type {
  Brand,
  Category,
  DealershipService,
  SiteSettings,
  Testimonial,
} from "@/types/common";
import type { PaginatedResponse, Vehicle, VehicleFilters } from "@/types/vehicle";
import { filterVehicles } from "@/utils/vehicles";

export async function listVehicles(
  filters: VehicleFilters = {},
): Promise<PaginatedResponse<Vehicle>> {
  const remote = await fetchFromSisgesc<PaginatedResponse<Vehicle>>(
    `/vehicles?${new URLSearchParams(
      Object.entries(filters).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          acc[key] = String(value);
        }
        return acc;
      }, {}),
    ).toString()}`,
  ).catch(() => null);

  if (remote) return remote;
  return filterVehicles(mockVehicles, filters);
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const remote = await fetchFromSisgesc<Vehicle>(`/vehicles/${id}`).catch(() => null);
  if (remote) return remote;
  return mockVehicles.find((vehicle) => vehicle.id === id) || null;
}

export async function listFeatured(limit = 6): Promise<Vehicle[]> {
  const remote = await fetchFromSisgesc<Vehicle[]>(`/featured?limit=${limit}`).catch(() => null);
  if (remote) return remote;
  return mockVehicles.filter((v) => v.featured).slice(0, limit);
}

export async function listLatest(limit = 8): Promise<Vehicle[]> {
  const remote = await fetchFromSisgesc<Vehicle[]>(`/latest?limit=${limit}`).catch(() => null);
  if (remote) return remote;
  return [...mockVehicles]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function listCategories(): Promise<Category[]> {
  const remote = await fetchFromSisgesc<Category[]>("/categories").catch(() => null);
  return remote || mockCategories;
}

export async function listBrands(): Promise<Brand[]> {
  const remote = await fetchFromSisgesc<Brand[]>("/brands").catch(() => null);
  return remote || mockBrands;
}

export async function listServices(): Promise<DealershipService[]> {
  const remote = await fetchFromSisgesc<DealershipService[]>("/services").catch(() => null);
  return remote || mockServices;
}

export async function listTestimonials(): Promise<Testimonial[]> {
  const remote = await fetchFromSisgesc<Testimonial[]>("/testimonials").catch(() => null);
  return remote || mockTestimonials;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const remote = await fetchFromSisgesc<SiteSettings>("/settings").catch(() => null);
  return remote || mockSettings;
}

export async function listRelated(id: string, limit = 4): Promise<Vehicle[]> {
  const vehicle = await getVehicle(id);
  if (!vehicle) return [];
  const { data } = await listVehicles({ brand: vehicle.brand, pageSize: limit + 1 });
  return data.filter((item) => item.id !== id).slice(0, limit);
}
