"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Select } from "@/components/ui/select";
import { cn } from "@/utils/cn";

export function InventoryToolbar({ total }: { total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("layout") === "list" ? "list" : "grid";
  const sort = searchParams.get("sort") || "newest";

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        <span className="font-semibold text-foreground">{total}</span> vehicles found
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          aria-label="Sort vehicles"
          className="w-44"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest</option>
          <option value="year_asc">Year: Oldest</option>
          <option value="mileage_asc">Mileage: Low to High</option>
        </Select>
        <div className="inline-flex rounded-xl border border-border p-1">
          <button
            type="button"
            aria-label="Grid view"
            className={cn(
              "rounded-lg p-2",
              view === "grid" ? "bg-muted-bg text-foreground" : "text-muted",
            )}
            onClick={() => setParam("layout", "grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            className={cn(
              "rounded-lg p-2",
              view === "list" ? "bg-muted-bg text-foreground" : "text-muted",
            )}
            onClick={() => setParam("layout", "list")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
