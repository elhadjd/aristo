import { Suspense } from "react";
import { InventoryFilters } from "@/features/inventory/inventory-filters";
import { InventoryToolbar } from "@/features/inventory/inventory-toolbar";
import { Pagination } from "@/features/inventory/pagination";
import { VehicleCard } from "@/features/vehicles/vehicle-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { Skeleton } from "@/components/ui/skeleton";
import { listBrands, listVehicles } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { VehicleFilters, VehicleSortOption } from "@/types/vehicle";

export const metadata = buildMetadata({
  title: "Inventory",
  description:
    "Browse ARISTO's curated inventory of luxury, performance, and everyday premium vehicles in Columbus, Ohio.",
  path: "/inventory",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function InventoryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters: VehicleFilters = {
    q: first(params.q),
    brand: first(params.brand),
    model: first(params.model),
    fuel: first(params.fuel),
    transmission: first(params.transmission),
    color: first(params.color),
    bodyStyle: first(params.bodyStyle),
    driveType: first(params.driveType),
    condition: first(params.condition),
    yearMin: first(params.yearMin) ? Number(first(params.yearMin)) : undefined,
    yearMax: first(params.yearMax) ? Number(first(params.yearMax)) : undefined,
    mileageMax: first(params.mileageMax) ? Number(first(params.mileageMax)) : undefined,
    priceMin: first(params.priceMin) ? Number(first(params.priceMin)) : undefined,
    priceMax: first(params.priceMax) ? Number(first(params.priceMax)) : undefined,
    page: first(params.page) ? Number(first(params.page)) : 1,
    pageSize: 9,
    sort: (first(params.sort) as VehicleSortOption) || "newest",
  };
  const layout = first(params.layout) === "list" ? "list" : "grid";

  const [result, brands] = await Promise.all([listVehicles(filters), listBrands()]);

  const flatParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, first(value)]),
  );

  return (
    <>
      <PageHero
        title="Inventory"
        description="Advanced filters, transparent pricing, and vehicles synchronized from SISGESC."
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Inventory" }]} />
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Suspense fallback={<Skeleton className="h-[640px] w-full" />}>
            <InventoryFilters brands={brands.map((brand) => brand.name)} />
          </Suspense>
          <div>
            <Suspense fallback={<Skeleton className="mb-6 h-16 w-full" />}>
              <InventoryToolbar total={result.meta.total} />
            </Suspense>
            {result.data.length === 0 ? (
              <EmptyState
                title="No vehicles match"
                description="Try adjusting filters or browse the full collection."
              />
            ) : (
              <div
                className={
                  layout === "list"
                    ? "grid gap-5"
                    : "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                }
              >
                {result.data.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} layout={layout} />
                ))}
              </div>
            )}
            <Pagination
              page={result.meta.page}
              totalPages={result.meta.totalPages}
              searchParams={flatParams}
            />
          </div>
        </div>
      </section>
    </>
  );
}
