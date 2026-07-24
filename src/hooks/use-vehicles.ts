"use client";

import { useEffect, useMemo, useState } from "react";
import { getVehicles } from "@/services/vehicles";
import type { PaginatedResponse, Vehicle, VehicleFilters } from "@/types/vehicle";

export function useVehicles(filters: VehicleFilters) {
  const [data, setData] = useState<PaginatedResponse<Vehicle> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    let active = true;
    const parsed = JSON.parse(filterKey) as VehicleFilters;

    queueMicrotask(() => {
      if (!active) return;
      setLoading(true);
      setError(null);
    });

    getVehicles(parsed)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: { message?: string }) => {
        if (active) setError(err.message || "Failed to load vehicles");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filterKey]);

  return { data, loading, error };
}
