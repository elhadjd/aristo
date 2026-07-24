/**
 * Expansion interfaces for future SISGESC / admin integrations.
 * Keep contracts stable so UI can evolve independently of upstream APIs.
 */

import type {
  Brand,
  Category,
  ContactPayload,
  DealershipService,
  SiteSettings,
  Testimonial,
  TradeInPayload,
} from "@/types/common";
import type { PaginatedResponse, Vehicle, VehicleFilters } from "@/types/vehicle";

export interface IVehicleRepository {
  list(filters?: VehicleFilters): Promise<PaginatedResponse<Vehicle>>;
  getById(id: string): Promise<Vehicle | null>;
  getFeatured(limit?: number): Promise<Vehicle[]>;
  getLatest(limit?: number): Promise<Vehicle[]>;
  getRelated(id: string, limit?: number): Promise<Vehicle[]>;
}

export interface ICatalogRepository {
  getCategories(): Promise<Category[]>;
  getBrands(): Promise<Brand[]>;
  getServices(): Promise<DealershipService[]>;
  getTestimonials(): Promise<Testimonial[]>;
  getSettings(): Promise<SiteSettings>;
}

export interface ILeadRepository {
  submitContact(payload: ContactPayload): Promise<{ success: boolean; id?: string }>;
  submitTradeIn(payload: TradeInPayload): Promise<{ success: boolean; id?: string }>;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: "customer" | "admin" | "sales";
  };
}

export interface IAuthProvider {
  login(email: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
  refresh(refreshToken: string): Promise<AuthSession>;
  getSession(): AuthSession | null;
}
