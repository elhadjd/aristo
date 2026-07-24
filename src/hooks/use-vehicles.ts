"use client";

import { useEffect, useState } from "react";
import { getVehicles } from "@/services/vehicles";
import type { PaginatedResponse, Vehicle, VehicleFilters } from "@/types/vehicle";

export function useVehicles(filters: VehicleFilters) {
  const [data, setData] = useState<PaginatedResponse<Vehicle> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getVehicles(filters)
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
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
}
