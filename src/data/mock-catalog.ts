import { siteConfig } from "@/config/site";
import type {
  Brand,
  Category,
  DealershipService,
  SiteSettings,
  Testimonial,
} from "@/types/common";
import { mockVehicles } from "./mock-vehicles";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const mockCategories: Category[] = [
  {
    id: "suv",
    name: "SUVs",
    slug: "suv",
    description: "Commanding utility with premium comfort.",
    image: img("photo-1519641471654-76ce0107ad1b"),
    vehicleCount: mockVehicles.filter((v) => v.bodyStyle === "SUV").length,
  },
  {
    id: "sedan",
    name: "Sedans",
    slug: "sedan",
    description: "Refined daily drivers with athletic presence.",
    image: img("photo-1555215695-3004980ad54e"),
    vehicleCount: mockVehicles.filter((v) => v.bodyStyle === "Sedan").length,
  },
  {
    id: "electric",
    name: "Electric",
    slug: "electric",
    description: "Silent performance and modern efficiency.",
    image: img("photo-1560958089-b8a1929cea89"),
    vehicleCount: mockVehicles.filter((v) => v.fuel === "Electric").length,
  },
  {
    id: "truck",
    name: "Trucks",
    slug: "truck",
    description: "Capable workhorses with luxury cabins.",
    image: img("photo-1533473359331-0135ef1b58bf"),
    vehicleCount: mockVehicles.filter((v) => v.bodyStyle === "Truck").length,
  },
  {
    id: "coupe",
    name: "Coupes",
    slug: "coupe",
    description: "Sculpted performance for the open road.",
    image: img("photo-1552519507-da3b142c6e3d"),
    vehicleCount: mockVehicles.filter((v) => v.bodyStyle === "Coupe").length,
  },
];

export const mockBrands: Brand[] = Array.from(
  mockVehicles.reduce((map, vehicle) => {
    const current = map.get(vehicle.brand) || 0;
    map.set(vehicle.brand, current + 1);
    return map;
  }, new Map<string, number>()),
)
  .map(([name, vehicleCount], index) => ({
    id: `brand-${index + 1}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    vehicleCount,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const mockServices: DealershipService[] = [
  {
    id: "svc-financing",
    name: "Financing",
    slug: "financing",
    description: "Competitive rates tailored to your profile.",
    longDescription:
      "Our finance specialists work with a curated lender network to structure clear monthly payments, competitive APRs, and flexible terms—without pressure.",
    icon: "CreditCard",
    image: img("photo-1554224155-6726b3ff858f"),
    benefits: ["Multiple lender options", "Same-day pre-approval", "Transparent terms"],
    featured: true,
  },
  {
    id: "svc-import",
    name: "Vehicle Import",
    slug: "vehicle-import",
    description: "Source rare inventory across markets.",
    longDescription:
      "Looking for a specific configuration? ARISTO can coordinate sourcing and import logistics for qualified clients seeking exclusive vehicles.",
    icon: "Ship",
    image: img("photo-1492144534655-ae79c964c9d7"),
    benefits: ["Global sourcing", "Compliance support", "Concierge updates"],
    featured: true,
  },
  {
    id: "svc-inspection",
    name: "Inspection",
    slug: "inspection",
    description: "Multi-point checks before every delivery.",
    longDescription:
      "Each vehicle is evaluated across mechanical, safety, and cosmetic systems so you can buy with confidence.",
    icon: "ClipboardCheck",
    image: img("photo-1486262715619-67b85e0b08d3"),
    benefits: ["Certified technicians", "Detailed reports", "Road testing"],
    featured: true,
  },
  {
    id: "svc-warranty",
    name: "Warranty",
    slug: "warranty",
    description: "Extended protection for peace of mind.",
    longDescription:
      "Protect your investment with coverage options that complement factory warranties and safeguard major components.",
    icon: "ShieldCheck",
    image: img("photo-1486262715619-67b85e0b08d3"),
    benefits: ["Flexible plans", "Nationwide repair network", "Clear exclusions"],
    featured: false,
  },
  {
    id: "svc-maintenance",
    name: "Maintenance",
    slug: "maintenance",
    description: "Scheduled care that preserves value.",
    longDescription:
      "From oil services to seasonal inspections, keep your vehicle performing like the day you drove it home.",
    icon: "Wrench",
    image: img("photo-1487754180451-c456f719a1fc"),
    benefits: ["OEM-quality parts", "Loaner availability", "Digital service history"],
    featured: false,
  },
  {
    id: "svc-trade-in",
    name: "Trade-In",
    slug: "trade-in",
    description: "Fair appraisals applied to your next vehicle.",
    longDescription:
      "Receive a competitive offer on your current vehicle and streamline your upgrade in a single visit.",
    icon: "ArrowLeftRight",
    image: img("photo-1449965408869-eaa3f722e40d"),
    benefits: ["Same-day appraisal", "Equity toward purchase", "No-obligation estimate"],
    featured: true,
  },
  {
    id: "svc-delivery",
    name: "Delivery",
    slug: "delivery",
    description: "Concierge delivery across the region.",
    longDescription:
      "Prefer your driveway to our showroom? We deliver thoroughly prepared vehicles on a schedule that fits your life.",
    icon: "Truck",
    image: img("photo-1449965408869-eaa3f722e40d"),
    benefits: ["White-glove handoff", "Flexible scheduling", "Regional coverage"],
    featured: true,
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "t-001",
    name: "Marcus Ellison",
    role: "Columbus, OH",
    rating: 5,
    content:
      "ARISTO made the entire process feel elevated. Transparent pricing, a pristine vehicle, and a team that actually listened.",
    vehiclePurchased: "2024 Mercedes-Benz GLE 450",
    created_at: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "t-002",
    name: "Priya Shah",
    role: "Dublin, OH",
    rating: 5,
    content:
      "Financing was clear and fast. I left with a Model Y I love and zero surprises on paperwork.",
    vehiclePurchased: "2024 Tesla Model Y",
    created_at: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "t-003",
    name: "James Okonkwo",
    role: "Westerville, OH",
    rating: 5,
    content:
      "Trade-in appraisal was fair and the delivery experience felt boutique. This is how car buying should work.",
    vehiclePurchased: "2025 BMW M340i",
    created_at: "2026-06-20T10:00:00.000Z",
  },
  {
    id: "t-004",
    name: "Elena Vargas",
    role: "Upper Arlington, OH",
    rating: 5,
    content:
      "From first inquiry on WhatsApp to keys in hand, every interaction was polished and professional.",
    vehiclePurchased: "2023 Porsche Cayenne S",
    created_at: "2026-07-01T10:00:00.000Z",
  },
];

export const mockSettings: SiteSettings = {
  companyName: siteConfig.name,
  phone: siteConfig.phone,
  whatsapp: siteConfig.whatsapp,
  email: siteConfig.email,
  address: siteConfig.address.full,
  heroTitle: "Drive Distinction",
  heroSubtitle:
    "Curated luxury and performance vehicles with transparent pricing, white-glove service, and financing built around you.",
  heroImage: img("photo-1492144534655-ae79c964c9d7"),
  financingRateFrom: 4.9,
  social: siteConfig.social,
};
