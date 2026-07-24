import { NextRequest, NextResponse } from "next/server";
import { listVehicles } from "@/lib/data";
import type { VehicleFilters } from "@/types/vehicle";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filters: VehicleFilters = {
    brand: searchParams.get("brand") || undefined,
    model: searchParams.get("model") || undefined,
    fuel: searchParams.get("fuel") || undefined,
    transmission: searchParams.get("transmission") || undefined,
    color: searchParams.get("color") || undefined,
    bodyStyle: searchParams.get("bodyStyle") || undefined,
    driveType: searchParams.get("driveType") || undefined,
    condition: searchParams.get("condition") || undefined,
    q: searchParams.get("q") || undefined,
    sort: (searchParams.get("sort") as VehicleFilters["sort"]) || undefined,
    yearMin: searchParams.get("yearMin") ? Number(searchParams.get("yearMin")) : undefined,
    yearMax: searchParams.get("yearMax") ? Number(searchParams.get("yearMax")) : undefined,
    mileageMax: searchParams.get("mileageMax")
      ? Number(searchParams.get("mileageMax"))
      : undefined,
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 12,
  };

  const result = await listVehicles(filters);
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
