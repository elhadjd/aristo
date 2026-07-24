"use client";

import { useEffect, useState } from "react";
import { VehicleForm } from "@/features/admin/vehicle-form";

export default function NewVehiclePage() {
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/brands").then((res) => res.json()),
      fetch("/api/admin/categories").then((res) => res.json()),
    ]).then(([brandRows, categoryRows]) => {
      setBrands(brandRows);
      setCategories(categoryRows);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Add vehicle</h1>
        <p className="mt-2 text-sm text-muted">Create a complete listing with gallery and attributes.</p>
      </div>
      <VehicleForm brands={brands} categories={categories} />
    </div>
  );
}
