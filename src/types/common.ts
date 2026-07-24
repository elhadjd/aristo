export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  vehicleCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  vehicleCount: number;
}

export interface DealershipService {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  benefits: string[];
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  content: string;
  avatar?: string;
  vehiclePurchased?: string;
  created_at: string;
}

export interface SiteSettings {
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  financingRateFrom: number;
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    x?: string;
  };
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  vehicleId?: string;
  interest?: "purchase" | "financing" | "trade-in" | "service" | "general";
  service?: number | string;
  serviceType?: string;
  metadata?: Record<string, unknown>;
}

export interface TradeInPayload {
  name: string;
  email: string;
  phone: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  condition: string;
  notes?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
