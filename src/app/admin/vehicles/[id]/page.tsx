"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VehicleForm, type VehicleFormValues } from "@/features/admin/vehicle-form";
import type { Vehicle } from "@/types/vehicle";

export default function EditVehiclePage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<VehicleFormValues | null>(null);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/vehicles/${params.id}`).then((res) => res.json()),
      fetch("/api/admin/brands").then((res) => res.json()),
      fetch("/api/admin/categories").then((res) => res.json()),
    ]).then(
      ([vehicle, brandRows, categoryRows]: [
        Vehicle & {
          published?: boolean;
          sortOrder?: number;
          attributes?: { label: string; value: string }[];
        },
        { id: string; name: string }[],
        { id: string; name: string }[],
      ]) => {
        setBrands(brandRows);
        setCategories(categoryRows);
        setInitial({
          name: vehicle.name,
          brandName: vehicle.brand,
          brandId: brandRows.find((brand) => brand.name === vehicle.brand)?.id || null,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          mileage: vehicle.mileage,
          fuel: vehicle.fuel,
          transmission: vehicle.transmission,
          engine: vehicle.engine,
          doors: vehicle.doors,
          color: vehicle.color,
          condition: vehicle.condition,
          description: vehicle.description,
          bodyStyle: vehicle.bodyStyle,
          driveType: vehicle.driveType,
          vin: vehicle.vin || "",
          mpgCity: vehicle.mpgCity,
          mpgHighway: vehicle.mpgHighway,
          featured: vehicle.featured,
          published: vehicle.published !== false,
          categoryId: vehicle.categoryId || null,
          features: vehicle.features,
          images: vehicle.images,
          attributes: vehicle.attributes || [],
          sortOrder: vehicle.sortOrder || 0,
        });
      },
    );
  }, [params.id]);

  if (!initial) {
    return <p className="text-sm text-muted">Loading vehicle…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Edit vehicle</h1>
        <p className="mt-2 text-sm text-muted">{initial.name}</p>
      </div>
      <VehicleForm
        vehicleId={params.id}
        initial={initial}
        brands={brands}
        categories={categories}
      />
    </div>
  );
}
