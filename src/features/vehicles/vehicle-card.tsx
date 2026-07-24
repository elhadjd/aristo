"use client";

import Image from "next/image";
import Link from "next/link";
import { Fuel, Gauge, GitCompareArrows, Heart, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { useCompareStore } from "@/store/compare-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Vehicle } from "@/types/vehicle";
import { cn } from "@/utils/cn";
import { formatCurrency, formatMileage } from "@/utils/format";

export function VehicleCard({
  vehicle,
  layout = "grid",
}: {
  vehicle: Vehicle;
  layout?: "grid" | "list";
}) {
  const wishlist = useWishlistStore();
  const compare = useCompareStore();
  const wished = wishlist.has(vehicle.id);
  const compared = compare.has(vehicle.id);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        layout === "list" && "grid md:grid-cols-[280px_1fr]",
      )}
    >
      <Link href={`/vehicles/${vehicle.id}`} className="relative block overflow-hidden">
        <div className={cn("relative aspect-[16/10]", layout === "list" && "md:h-full")}>
          <Image
            src={vehicle.images[0]}
            alt={vehicle.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          {vehicle.featured ? <Badge className="bg-secondary text-white">Featured</Badge> : null}
          <Badge className="bg-black/60 text-white backdrop-blur">{vehicle.condition}</Badge>
        </div>
      </Link>

      <div className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{vehicle.brand}</p>
            <h3 className="mt-1 font-display text-xl leading-tight">
              <Link href={`/vehicles/${vehicle.id}`} className="hover:text-secondary">
                {vehicle.year} {vehicle.model}
              </Link>
            </h3>
          </div>
          <p className="text-lg font-semibold text-secondary">{formatCurrency(vehicle.price)}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" />
            {vehicle.fuel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Settings2 className="h-3.5 w-3.5" />
            {vehicle.transmission}
          </span>
        </div>

        {layout === "list" ? (
          <p className="mt-3 line-clamp-2 text-sm text-muted">{vehicle.description}</p>
        ) : null}

        <div className="mt-5 flex items-center gap-2">
          <Link
            href={`/vehicles/${vehicle.id}`}
            className={cn(buttonVariants({ variant: "primary" }), "flex-1")}
          >
            View details
          </Link>
          <Button
            variant="outline"
            size="icon"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => {
              wishlist.toggle(vehicle.id);
              toast.success(wished ? "Removed from favorites" : "Saved to favorites");
            }}
          >
            <Heart className={cn("h-4 w-4", wished && "fill-secondary text-secondary")} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={compared ? "Remove from compare" : "Add to compare"}
            onClick={() => {
              if (!compared && !compare.canAdd) {
                toast.error("Compare up to 3 vehicles");
                return;
              }
              compare.toggle(vehicle.id);
              toast.success(compared ? "Removed from compare" : "Added to compare");
            }}
          >
            <GitCompareArrows className={cn("h-4 w-4", compared && "text-accent")} />
          </Button>
        </div>
      </div>
    </article>
  );
}
