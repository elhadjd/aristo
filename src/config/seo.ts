import { siteConfig } from "@/config/site";

/** High-intent keywords for a Columbus / Central Ohio dealership. */
export const defaultKeywords = [
  "ARISTO",
  "ARISTO Auto Group",
  "used cars Columbus OH",
  "used cars Columbus Ohio",
  "luxury cars Columbus",
  "pre-owned cars Columbus",
  "car dealership Columbus OH",
  "auto dealer Westerville Rd",
  "cars for sale Columbus Ohio",
  "certified pre-owned Columbus",
  "SUV for sale Columbus",
  "sedan for sale Columbus",
  "car financing Columbus OH",
  "auto loans Columbus Ohio",
  "trade in car Columbus",
  "sell my car Columbus OH",
  "test drive Columbus",
  "best used car dealership Columbus",
  "Central Ohio car dealer",
  "3431 Westerville Rd",
] as const;

export type PageSeoKey =
  | "home"
  | "inventory"
  | "financing"
  | "tradeIn"
  | "services"
  | "about"
  | "testimonials"
  | "faq"
  | "contact"
  | "articles"
  | "privacy"
  | "terms";

export type PageSeoEntry = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
};

export const pageSeo: Record<PageSeoKey, PageSeoEntry> = {
  home: {
    title: siteConfig.name,
    description:
      "ARISTO is a premium used and luxury car dealership in Columbus, Ohio. Shop curated inventory, get transparent financing, trade in your car, and schedule a test drive at 3431 Westerville Rd.",
    path: "/",
    keywords: [
      ...defaultKeywords,
      "buy used car Columbus",
      "luxury dealership Columbus Ohio",
      "premium pre-owned vehicles",
    ],
  },
  inventory: {
    title: "Used & Luxury Cars for Sale in Columbus, OH",
    description:
      "Browse ARISTO inventory in Columbus, Ohio — used cars, SUVs, sedans, and luxury vehicles with transparent pricing. Filter by brand, year, price, and body style. Test drive today.",
    path: "/inventory",
    keywords: [
      ...defaultKeywords,
      "cars for sale near me Columbus",
      "used SUV Columbus OH",
      "used sedan Columbus",
      "luxury SUV Columbus",
      "cheap used cars Columbus Ohio",
      "vehicle inventory Columbus",
    ],
  },
  financing: {
    title: "Car Financing & Auto Loans in Columbus, OH",
    description:
      "Get car financing at ARISTO in Columbus, Ohio. Competitive auto loans, flexible terms, and specialists who help excellent, fair, and rebuilding credit. Apply or get a payment estimate online.",
    path: "/financing",
    keywords: [
      ...defaultKeywords,
      "car financing Columbus",
      "auto loan Columbus OH",
      "bad credit car loans Columbus",
      "first time buyer car financing Ohio",
      "monthly car payment calculator",
      "finance used car Columbus",
    ],
  },
  tradeIn: {
    title: "Car Trade-In Value in Columbus, OH",
    description:
      "Get a fair trade-in appraisal at ARISTO in Columbus, Ohio. Sell or trade your car, unlock equity, and apply value toward your next vehicle with a fast complimentary estimate.",
    path: "/trade-in",
    keywords: [
      ...defaultKeywords,
      "trade in car Columbus OH",
      "sell my car Columbus",
      "car appraisal Columbus Ohio",
      "trade-in value calculator",
      "upgrade my car Columbus",
      "cash for cars Columbus OH",
    ],
  },
  services: {
    title: "Dealership Services in Columbus, OH",
    description:
      "ARISTO dealership services in Columbus, Ohio: financing, trade-ins, multi-point inspections, warranties, maintenance support, vehicle import help, and concierge delivery across Ohio.",
    path: "/services",
    keywords: [
      ...defaultKeywords,
      "car inspection Columbus",
      "auto warranty Columbus OH",
      "vehicle delivery Ohio",
      "dealership services Columbus",
      "pre purchase inspection Columbus",
    ],
  },
  about: {
    title: "About ARISTO — Columbus Car Dealership",
    description:
      "Meet ARISTO, a premium automotive dealership on Westerville Rd in Columbus, Ohio. We focus on curated inventory, transparent pricing, and an elevated buying experience for Central Ohio drivers.",
    path: "/about",
    keywords: [
      ...defaultKeywords,
      "about ARISTO dealership",
      "Columbus OH auto dealer",
      "trusted car dealer Central Ohio",
    ],
  },
  testimonials: {
    title: "Customer Reviews — ARISTO Columbus",
    description:
      "Read ARISTO customer reviews from buyers across Columbus and Central Ohio. Real stories about financing, trade-ins, inventory quality, and our dealership experience.",
    path: "/testimonials",
    keywords: [
      ...defaultKeywords,
      "ARISTO reviews",
      "car dealership reviews Columbus OH",
      "best car dealer Columbus reviews",
      "customer testimonials used cars",
    ],
  },
  faq: {
    title: "FAQ — Buying, Financing & Trade-Ins",
    description:
      "FAQs about buying a used or luxury car at ARISTO in Columbus, Ohio — financing, trade-ins, inspections, warranties, delivery, test drives, and reserving a vehicle.",
    path: "/faq",
    keywords: [
      ...defaultKeywords,
      "car buying FAQ Columbus",
      "used car warranty questions",
      "how to finance a car Ohio",
      "schedule test drive Columbus",
    ],
  },
  contact: {
    title: "Contact ARISTO — Columbus, OH Dealership",
    description:
      "Contact ARISTO in Columbus, Ohio. Call +1 (614) 592-0280, WhatsApp, email, or visit 3431 Westerville Rd, Columbus, OH 43224. Sales, financing, and test drive appointments.",
    path: "/contact",
    keywords: [
      ...defaultKeywords,
      "contact car dealer Columbus",
      "ARISTO phone number",
      "car dealership near Westerville Rd",
      "visit ARISTO Columbus",
    ],
  },
  articles: {
    title: "Car Buying Guides & Dealership News",
    description:
      "ARISTO articles and guides for Columbus drivers — used car tips, financing advice, trade-in insights, and dealership updates from our Ohio team.",
    path: "/articles",
    keywords: [
      ...defaultKeywords,
      "car buying tips Columbus",
      "used car guide Ohio",
      "auto financing tips",
      "dealership blog Columbus",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "ARISTO privacy policy: how we collect, use, and protect personal information from website visitors and customers at our Columbus, Ohio dealership.",
    path: "/privacy",
    keywords: ["ARISTO privacy policy", "dealership privacy Columbus OH"],
  },
  terms: {
    title: "Terms of Service",
    description:
      "Terms of service for using the ARISTO dealership website, including inventory, pricing, financing inquiries, and online communications.",
    path: "/terms",
    keywords: ["ARISTO terms of service", "dealership website terms"],
  },
};

export const staticSitemapPaths: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] =
  [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/inventory", priority: 0.95, changeFrequency: "daily" },
    { path: "/financing", priority: 0.85, changeFrequency: "weekly" },
    { path: "/trade-in", priority: 0.85, changeFrequency: "weekly" },
    { path: "/services", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.75, changeFrequency: "monthly" },
    { path: "/testimonials", priority: 0.7, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.85, changeFrequency: "monthly" },
    { path: "/articles", priority: 0.75, changeFrequency: "weekly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" },
  ];
