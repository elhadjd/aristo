import type { PaginatedResponse, Vehicle, VehicleFilters } from "@/types/vehicle";

export function filterVehicles(
  vehicles: Vehicle[],
  filters: VehicleFilters = {},
): PaginatedResponse<Vehicle> {
  let result = [...vehicles];

  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.color.toLowerCase().includes(q),
    );
  }

  if (filters.brand) {
    result = result.filter((v) => v.brand.toLowerCase() === filters.brand!.toLowerCase());
  }
  if (filters.model) {
    result = result.filter((v) => v.model.toLowerCase().includes(filters.model!.toLowerCase()));
  }
  if (filters.fuel) {
    result = result.filter((v) => v.fuel.toLowerCase() === filters.fuel!.toLowerCase());
  }
  if (filters.transmission) {
    result = result.filter(
      (v) => v.transmission.toLowerCase() === filters.transmission!.toLowerCase(),
    );
  }
  if (filters.color) {
    result = result.filter((v) => v.color.toLowerCase().includes(filters.color!.toLowerCase()));
  }
  if (filters.bodyStyle) {
    result = result.filter(
      (v) => v.bodyStyle.toLowerCase() === filters.bodyStyle!.toLowerCase(),
    );
  }
  if (filters.driveType) {
    result = result.filter(
      (v) => v.driveType.toLowerCase() === filters.driveType!.toLowerCase(),
    );
  }
  if (filters.condition) {
    result = result.filter(
      (v) => v.condition.toLowerCase() === filters.condition!.toLowerCase(),
    );
  }
  if (filters.yearMin != null) {
    result = result.filter((v) => v.year >= filters.yearMin!);
  }
  if (filters.yearMax != null) {
    result = result.filter((v) => v.year <= filters.yearMax!);
  }
  if (filters.mileageMax != null) {
    result = result.filter((v) => v.mileage <= filters.mileageMax!);
  }
  if (filters.priceMin != null) {
    result = result.filter((v) => v.price >= filters.priceMin!);
  }
  if (filters.priceMax != null) {
    result = result.filter((v) => v.price <= filters.priceMax!);
  }

  switch (filters.sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "year_asc":
      result.sort((a, b) => a.year - b.year);
      break;
    case "year_desc":
      result.sort((a, b) => b.year - a.year);
      break;
    case "mileage_asc":
      result.sort((a, b) => a.mileage - b.mileage);
      break;
    case "newest":
    default:
      result.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      break;
  }

  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.max(1, filters.pageSize || 12);
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = result.slice(start, start + pageSize);

  return {
    data,
    meta: { page, pageSize, total, totalPages },
  };
}

export function estimateMonthlyPayment(
  price: number,
  downPayment = 0,
  annualRate = 5.9,
  months = 60,
): number {
  const principal = Math.max(price - downPayment, 0);
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment);
}
