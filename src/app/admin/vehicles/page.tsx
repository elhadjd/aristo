"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/format";
import type { Vehicle } from "@/types/vehicle";

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/vehicles")
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setVehicles(data);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Vehicles</h1>
          <p className="mt-2 text-sm text-muted">
            Cars, galleries, prices, and attributes shown on the public inventory.
          </p>
        </div>
        <Link href="/admin/vehicles/new" className={cn(buttonVariants({ variant: "secondary" }))}>
          Add vehicle
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted-bg/70 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={4}>
                  Loading…
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted" colSpan={4}>
                  No vehicles yet.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{vehicle.name}</p>
                    <p className="text-xs text-muted">
                      {vehicle.year} · {vehicle.brand} · {vehicle.mileage.toLocaleString()} mi
                    </p>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(vehicle.price)}</td>
                  <td className="px-4 py-3">
                    {vehicle.featured ? "Featured · " : ""}
                    {(vehicle as Vehicle & { published?: boolean }).published === false
                      ? "Draft"
                      : "Published"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/vehicles/${vehicle.id}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                        onClick={async () => {
                          if (!confirm("Delete this vehicle?")) return;
                          const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
                            method: "DELETE",
                          });
                          if (!response.ok) {
                            toast.error("Delete failed");
                            return;
                          }
                          toast.success("Vehicle deleted");
                          load();
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
