export type FuelType =
  | "Gasoline"
  | "Diesel"
  | "Hybrid"
  | "Electric"
  | "Plug-in Hybrid";

export type TransmissionType = "Automatic" | "Manual" | "CVT" | "Dual-Clutch";

export type DriveType = "FWD" | "RWD" | "AWD" | "4WD";

export type BodyStyle =
  | "Sedan"
  | "SUV"
  | "Coupe"
  | "Convertible"
  | "Truck"
  | "Hatchback"
  | "Wagon"
  | "Van";

export type VehicleCondition = "New" | "Certified Pre-Owned" | "Used";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: FuelType;
  transmission: TransmissionType;
  engine: string;
  doors: number;
  color: string;
  condition: VehicleCondition;
  description: string;
  images: string[];
  featured: boolean;
  bodyStyle: BodyStyle;
  driveType: DriveType;
  vin?: string;
  mpgCity?: number;
  mpgHighway?: number;
  features: string[];
  categoryId?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleFilters {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  fuel?: FuelType | string;
  transmission?: TransmissionType | string;
  priceMin?: number;
  priceMax?: number;
  color?: string;
  bodyStyle?: BodyStyle | string;
  driveType?: DriveType | string;
  condition?: VehicleCondition | string;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: VehicleSortOption;
}

export type VehicleSortOption =
  | "price_asc"
  | "price_desc"
  | "year_desc"
  | "year_asc"
  | "mileage_asc"
  | "newest";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
