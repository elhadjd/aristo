import type { PaginatedResponse, Vehicle, VehicleFilters } from "@/types/vehicle";
import { cachedGet, http } from "./http";

function toParams(filters: VehicleFilters = {}) {
  const params: Record<string, string | number> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value as string | number;
    }
  });
  return params;
}

export async function getVehicles(
  filters: VehicleFilters = {},
): Promise<PaginatedResponse<Vehicle>> {
  const key = `vehicles:${JSON.stringify(filters)}`;
  return cachedGet(key, async () => {
    const { data } = await http.get<PaginatedResponse<Vehicle>>("/vehicles", {
      params: toParams(filters),
    });
    return data;
  });
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  return cachedGet(`vehicle:${id}`, async () => {
    try {
      const { data } = await http.get<Vehicle>(`/vehicles/${id}`);
      return data;
    } catch (error) {
      const err = error as { status?: number };
      if (err.status === 404) return null;
      throw error;
    }
  });
}

export async function getFeaturedVehicles(limit = 6): Promise<Vehicle[]> {
  return cachedGet(`featured:${limit}`, async () => {
    const { data } = await http.get<Vehicle[]>("/featured", { params: { limit } });
    return data;
  });
}

export async function getLatestVehicles(limit = 8): Promise<Vehicle[]> {
  return cachedGet(`latest:${limit}`, async () => {
    const { data } = await http.get<Vehicle[]>("/latest", { params: { limit } });
    return data;
  });
}

export async function getRelatedVehicles(id: string, limit = 4): Promise<Vehicle[]> {
  const vehicle = await getVehicleById(id);
  if (!vehicle) return [];
  const { data } = await getVehicles({
    brand: vehicle.brand,
    pageSize: limit + 1,
    sort: "newest",
  });
  return data.filter((item) => item.id !== id).slice(0, limit);
}
