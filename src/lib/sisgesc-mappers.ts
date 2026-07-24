import { apiConfig } from "@/config/api";
import { resolveSisgescMediaUrl } from "@/lib/sisgesc";
import type { Brand, Category, DealershipService, SiteSettings } from "@/types/common";
import type { SisgescCompanyInfo, SisgescNamedEntity, SisgescProduct, SisgescSiteInfo } from "@/types/sisgesc";
import type {
  BodyStyle,
  DriveType,
  FuelType,
  TransmissionType,
  Vehicle,
  VehicleCondition,
} from "@/types/vehicle";
import { slugify } from "@/utils/format";

function asText(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function entityLabel(entity?: string | SisgescNamedEntity | null): string {
  if (!entity) return "";
  if (typeof entity === "string") return entity.trim();
  return asText(entity.name || entity.nome || entity.title || entity.value);
}

function listLabels(items?: Array<string | SisgescNamedEntity> | null): string[] {
  if (!items?.length) return [];
  return items
    .map((item) => {
      if (typeof item === "string") return item.trim();
      const label = entityLabel(item);
      const value = asText(item.value);
      if (label && value && label !== value) return `${label}: ${value}`;
      return label || value;
    })
    .filter(Boolean);
}

function featureMap(items?: Array<string | SisgescNamedEntity> | null): Record<string, string> {
  const map: Record<string, string> = {};
  if (!items) return map;
  for (const item of items) {
    if (typeof item === "string") {
      const [key, ...rest] = item.split(":");
      if (rest.length) map[key.trim().toLowerCase()] = rest.join(":").trim();
      continue;
    }
    const key = asText(item.name || item.nome || item.title).toLowerCase();
    const value = asText(item.value || item.description);
    if (key) map[key] = value || "true";
  }
  return map;
}

function pickFeature(map: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    const hit = Object.entries(map).find(([k]) => k.includes(key));
    if (hit?.[1]) return hit[1];
  }
  return undefined;
}

function parseYear(name: string, features: Record<string, string>): number {
  const fromFeature = pickFeature(features, ["year", "ano"]);
  if (fromFeature && /^\d{4}$/.test(fromFeature)) return Number(fromFeature);
  const match = name.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : new Date().getFullYear();
}

function parseFuel(value?: string): FuelType {
  const v = (value || "").toLowerCase();
  if (v.includes("plug") || v.includes("phev")) return "Plug-in Hybrid";
  if (v.includes("hybrid") || v.includes("híbrid") || v.includes("hibrid")) return "Hybrid";
  if (v.includes("electric") || v.includes("elétr") || v.includes("eletr")) return "Electric";
  if (v.includes("diesel")) return "Diesel";
  return "Gasoline";
}

function parseTransmission(value?: string): TransmissionType {
  const v = (value || "").toLowerCase();
  if (v.includes("cvt")) return "CVT";
  if (v.includes("dual") || v.includes("dct")) return "Dual-Clutch";
  if (v.includes("manual")) return "Manual";
  return "Automatic";
}

function parseDrive(value?: string): DriveType {
  const v = (value || "").toUpperCase();
  if (v.includes("4WD") || v.includes("4X4")) return "4WD";
  if (v.includes("AWD") || v.includes("4MATIC") || v.includes("XDRIVE") || v.includes("QUATTRO")) {
    return "AWD";
  }
  if (v.includes("RWD") || v.includes("REAR")) return "RWD";
  return "FWD";
}

function parseBody(value?: string, category?: string): BodyStyle {
  const v = `${value || ""} ${category || ""}`.toLowerCase();
  if (v.includes("suv") || v.includes("crossover")) return "SUV";
  if (v.includes("truck") || v.includes("pickup") || v.includes("pick-up")) return "Truck";
  if (v.includes("coupe") || v.includes("coupé")) return "Coupe";
  if (v.includes("convert")) return "Convertible";
  if (v.includes("hatch")) return "Hatchback";
  if (v.includes("wagon") || v.includes("estate")) return "Wagon";
  if (v.includes("van") || v.includes("minivan")) return "Van";
  return "Sedan";
}

function parseCondition(value?: string): VehicleCondition {
  const v = (value || "").toLowerCase();
  if (v.includes("certified") || v.includes("cpo")) return "Certified Pre-Owned";
  if (v.includes("new") || v.includes("novo")) return "New";
  return "Used";
}

export function isSisgescService(product: SisgescProduct): boolean {
  if (
    product.product_type_id != null &&
    apiConfig.sisgescServiceTypeIds.includes(Number(product.product_type_id))
  ) {
    return true;
  }

  const typeLabel = entityLabel(product.product_type).toLowerCase();
  if (
    typeLabel.includes("serv") ||
    typeLabel.includes("serviço") ||
    typeLabel.includes("servico")
  ) {
    return true;
  }

  return false;
}

function collectImages(product: SisgescProduct): string[] {
  const images: string[] = [];
  const main = resolveSisgescMediaUrl(product.image);
  if (main) images.push(main);

  const media = product.catalog_product?.media || [];
  for (const item of media) {
    const url = resolveSisgescMediaUrl(item.url || item.path || item.image);
    if (url && !images.includes(url)) images.push(url);
  }

  if (!images.length) {
    images.push(
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
    );
  }

  return images;
}

export function mapProductToVehicle(product: SisgescProduct): Vehicle {
  const name = asText(product.name || product.nome) || `Product ${product.id}`;
  const features = listLabels(product.features);
  const benefits = listLabels(product.benefits);
  const fmap = featureMap(product.features);
  const categoryName = entityLabel(product.category);

  const brand =
    asText(product.manufacturer) ||
    pickFeature(fmap, ["brand", "make", "marca"]) ||
    categoryName ||
    "ARISTO";

  const model =
    asText(product.reference) ||
    asText(product.code) ||
    pickFeature(fmap, ["model", "modelo"]) ||
    name;

  const price = asNumber(product.quoted_price ?? product.price ?? product.price_out_iva);
  const mileage = asNumber(
    pickFeature(fmap, ["mileage", "odometer", "km", "quilometr", "milhagem"]),
    0,
  );

  return {
    id: String(product.id),
    name,
    brand,
    model,
    year: parseYear(name, fmap),
    price,
    mileage,
    fuel: parseFuel(pickFeature(fmap, ["fuel", "combust"])),
    transmission: parseTransmission(pickFeature(fmap, ["transmission", "caixa", "gear"])),
    engine: pickFeature(fmap, ["engine", "motor"]) || asText(product.code) || "—",
    doors: asNumber(pickFeature(fmap, ["doors", "portas"]), 4),
    color: pickFeature(fmap, ["color", "colour", "cor"]) || "—",
    condition: parseCondition(pickFeature(fmap, ["condition", "estado", "condição", "condicao"])),
    description: asText(product.description) || `${name} available at ARISTO.`,
    images: collectImages(product),
    featured: Boolean(product.promotion_product),
    bodyStyle: parseBody(pickFeature(fmap, ["body", "carroceria", "style"]), categoryName),
    driveType: parseDrive(pickFeature(fmap, ["drive", "drivetrain", "tração", "tracao"])),
    vin: asText(product.barr_code) || undefined,
    features: [...new Set([...features, ...benefits])],
    categoryId: product.category_product_id != null ? String(product.category_product_id) : undefined,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || product.created_at || new Date().toISOString(),
  };
}

const SERVICE_ICONS = [
  "CreditCard",
  "Ship",
  "ClipboardCheck",
  "ShieldCheck",
  "Wrench",
  "ArrowLeftRight",
  "Truck",
] as const;

export function mapProductToService(product: SisgescProduct, index = 0): DealershipService {
  const name = asText(product.name || product.nome) || `Service ${product.id}`;
  const description = asText(product.description) || "Premium dealership service.";
  const benefits = listLabels(product.benefits);
  const features = listLabels(product.features);

  return {
    id: String(product.id),
    name,
    slug: slugify(name) || `service-${product.id}`,
    description,
    longDescription: description,
    icon: SERVICE_ICONS[index % SERVICE_ICONS.length],
    image: collectImages(product)[0],
    benefits: benefits.length ? benefits : features.slice(0, 3),
    featured: index < 4 || Boolean(product.promotion_product),
  };
}

export function mapProductsToCategories(products: SisgescProduct[]): Category[] {
  const map = new Map<string, Category>();

  for (const product of products) {
    if (isSisgescService(product)) continue;
    const id = String(product.category_product_id || entityLabel(product.category) || "general");
    const name = entityLabel(product.category) || "Inventory";
    const existing = map.get(id);
    if (existing) {
      existing.vehicleCount += 1;
      continue;
    }
    map.set(id, {
      id,
      name,
      slug: slugify(name) || id,
      description: `${name} vehicles from SISGESC inventory.`,
      image: collectImages(product)[0],
      vehicleCount: 1,
    });
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function mapProductsToBrands(products: SisgescProduct[]): Brand[] {
  const map = new Map<string, Brand>();

  for (const product of products) {
    if (isSisgescService(product)) continue;
    const vehicle = mapProductToVehicle(product);
    const key = vehicle.brand.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.vehicleCount += 1;
      continue;
    }
    map.set(key, {
      id: slugify(vehicle.brand) || key,
      name: vehicle.brand,
      slug: slugify(vehicle.brand) || key,
      vehicleCount: 1,
    });
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function mapSiteSettings(
  site: SisgescSiteInfo | null,
  company: SisgescCompanyInfo | null,
  fallback: SiteSettings,
): SiteSettings {
  const companyName =
    asText(company?.name || company?.nome || site?.name || site?.nome || site?.title) ||
    fallback.companyName;

  return {
    ...fallback,
    companyName,
    phone: asText(company?.phone || site?.phone) || fallback.phone,
    whatsapp: asText(company?.whatsapp || site?.whatsapp) || fallback.whatsapp,
    email: asText(company?.email || site?.email) || fallback.email,
    address: asText(company?.address || site?.address) || fallback.address,
    heroTitle: asText(site?.title || site?.name) || fallback.heroTitle,
    heroSubtitle: asText(site?.description) || fallback.heroSubtitle,
    heroImage:
      resolveSisgescMediaUrl(site?.image || site?.logo) || fallback.heroImage,
  };
}

export function splitCatalog(products: SisgescProduct[]) {
  const vehicles: Vehicle[] = [];
  const services: DealershipService[] = [];

  products.forEach((product, index) => {
    if (isSisgescService(product)) {
      services.push(mapProductToService(product, index));
    } else {
      vehicles.push(mapProductToVehicle(product));
    }
  });

  return { vehicles, services };
}
