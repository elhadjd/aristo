import { prisma } from "@/lib/db";
import {
  mapDbBrand,
  mapDbCategory,
  mapDbService,
  mapDbSettings,
  mapDbTestimonial,
  mapDbVehicle,
} from "@/lib/mappers";
import {
  mockBrands,
  mockCategories,
  mockServices,
  mockSettings,
  mockTestimonials,
} from "@/data/mock-catalog";
import { mockVehicles } from "@/data/mock-vehicles";
import type {
  Brand,
  Category,
  DealershipService,
  SiteSettings,
  Testimonial,
} from "@/types/common";
import type { PaginatedResponse, Vehicle, VehicleFilters } from "@/types/vehicle";
import { filterVehicles } from "@/utils/vehicles";

async function dbReady() {
  try {
    await prisma.siteSetting.findUnique({ where: { id: "default" } });
    return true;
  } catch {
    return false;
  }
}

async function loadPublishedVehicles(): Promise<Vehicle[]> {
  try {
    const rows = await prisma.vehicle.findMany({
      where: { published: true },
      include: { images: true, attributes: true, brand: true, category: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
    });
    if (!rows.length) return mockVehicles;
    return rows.map(mapDbVehicle);
  } catch {
    return mockVehicles;
  }
}

export async function listVehicles(
  filters: VehicleFilters = {},
): Promise<PaginatedResponse<Vehicle>> {
  const vehicles = await loadPublishedVehicles();
  return filterVehicles(vehicles, filters);
}

export async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const row = await prisma.vehicle.findFirst({
      where: { id, published: true },
      include: { images: true, attributes: true, brand: true, category: true },
    });
    if (row) return mapDbVehicle(row);
  } catch {
    // fall through
  }
  return mockVehicles.find((vehicle) => vehicle.id === id) || null;
}

export async function listFeatured(limit = 6): Promise<Vehicle[]> {
  const vehicles = await loadPublishedVehicles();
  const featured = vehicles.filter((vehicle) => vehicle.featured);
  return (featured.length ? featured : vehicles).slice(0, limit);
}

export async function listLatest(limit = 8): Promise<Vehicle[]> {
  const { data } = await listVehicles({ sort: "newest", pageSize: limit });
  return data.slice(0, limit);
}

export async function listCategories(): Promise<Category[]> {
  try {
    const rows = await prisma.category.findMany({
      include: { _count: { select: { vehicles: { where: { published: true } } } } },
      orderBy: { sortOrder: "asc" },
    });
    if (!rows.length) return mockCategories;
    return rows.map((row) => mapDbCategory(row, row._count.vehicles));
  } catch {
    return mockCategories;
  }
}

export async function listBrands(): Promise<Brand[]> {
  try {
    const rows = await prisma.brand.findMany({
      include: { _count: { select: { vehicles: { where: { published: true } } } } },
      orderBy: { name: "asc" },
    });
    if (!rows.length) return mockBrands;
    return rows.map((row) => mapDbBrand(row, row._count.vehicles));
  } catch {
    return mockBrands;
  }
}

export async function listServices(): Promise<DealershipService[]> {
  try {
    const rows = await prisma.service.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    if (!rows.length) return mockServices;
    return rows.map(mapDbService);
  } catch {
    return mockServices;
  }
}

export async function listTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    if (!rows.length) return mockTestimonials;
    return rows.map(mapDbTestimonial);
  } catch {
    return mockTestimonials;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: "default" } });
    if (row) return mapDbSettings(row);
  } catch {
    // fall through
  }
  return mockSettings;
}

export async function listRelated(id: string, limit = 4): Promise<Vehicle[]> {
  const vehicle = await getVehicle(id);
  if (!vehicle) return [];
  const { data } = await listVehicles({ brand: vehicle.brand, pageSize: limit + 1 });
  return data.filter((item) => item.id !== id).slice(0, limit);
}

export async function listFaq() {
  try {
    const rows = await prisma.faqItem.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows;
  } catch {
    return [];
  }
}

export async function listArticles(publishedOnly = true) {
  try {
    return prisma.article.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getArticle(slug: string) {
  try {
    return prisma.article.findFirst({
      where: { slug, published: true },
    });
  } catch {
    return null;
  }
}

export { dbReady };
