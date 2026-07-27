import type {
  Brand as DbBrand,
  Category as DbCategory,
  Service as DbService,
  SiteSetting,
  Testimonial as DbTestimonial,
  Vehicle as DbVehicle,
  VehicleAttribute,
  VehicleImage,
} from "@/generated/prisma/client";
import type { Brand, Category, DealershipService, SiteSettings, Testimonial } from "@/types/common";
import type {
  BodyStyle,
  DriveType,
  FuelType,
  TransmissionType,
  Vehicle,
  VehicleCondition,
} from "@/types/vehicle";
import { resolveMediaSrc } from "@/lib/media-url";

type VehicleWithRelations = DbVehicle & {
  images: VehicleImage[];
  attributes: VehicleAttribute[];
  brand?: DbBrand | null;
  category?: DbCategory | null;
};

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function mapDbVehicle(vehicle: VehicleWithRelations): Vehicle {
  const images = [...vehicle.images]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => resolveMediaSrc(image.url))
    .filter(Boolean);

  const attributeFeatures = [...vehicle.attributes]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((attr) => `${attr.label}: ${attr.value}`);

  return {
    id: vehicle.id,
    name: vehicle.name,
    brand: vehicle.brand?.name || vehicle.brandName || "Unknown",
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel as FuelType,
    transmission: vehicle.transmission as TransmissionType,
    engine: vehicle.engine,
    doors: vehicle.doors,
    color: vehicle.color,
    condition: vehicle.condition as VehicleCondition,
    description: vehicle.description,
    images: images.length
      ? images
      : [
          "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
        ],
    featured: vehicle.featured,
    bodyStyle: vehicle.bodyStyle as BodyStyle,
    driveType: vehicle.driveType as DriveType,
    vin: vehicle.vin || undefined,
    mpgCity: vehicle.mpgCity ?? undefined,
    mpgHighway: vehicle.mpgHighway ?? undefined,
    features: [...new Set([...parseJsonArray(vehicle.features), ...attributeFeatures])],
    categoryId: vehicle.categoryId ?? undefined,
    created_at: vehicle.createdAt.toISOString(),
    updated_at: vehicle.updatedAt.toISOString(),
  };
}

export function mapDbService(service: DbService): DealershipService {
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    longDescription: service.longDescription || service.description,
    icon: service.icon || "Wrench",
    image: resolveMediaSrc(
      service.image ||
        "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1400&q=80",
    ),
    benefits: parseJsonArray(service.benefits),
    featured: service.featured,
    comingSoon: service.slug === "financing",
  };
}

export function mapDbCategory(category: DbCategory, vehicleCount = 0): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: resolveMediaSrc(
      category.image ||
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80",
    ),
    vehicleCount,
  };
}

export function mapDbBrand(brand: DbBrand, vehicleCount = 0): Brand {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: brand.logo ? resolveMediaSrc(brand.logo) : undefined,
    vehicleCount,
  };
}

export function mapDbTestimonial(item: DbTestimonial): Testimonial {
  return {
    id: item.id,
    name: item.name,
    role: item.role,
    rating: item.rating,
    content: item.content,
    avatar: item.avatar ? resolveMediaSrc(item.avatar) : undefined,
    vehiclePurchased: item.vehiclePurchased || undefined,
    created_at: item.createdAt.toISOString(),
  };
}

export function mapDbSettings(settings: SiteSetting): SiteSettings {
  let social: SiteSettings["social"] = {};
  try {
    social = JSON.parse(settings.socialJson || "{}");
  } catch {
    social = {};
  }

  return {
    companyName: settings.companyName,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    heroImage: resolveMediaSrc(settings.heroImage),
    financingRateFrom: settings.financingRateFrom,
    social,
  };
}
