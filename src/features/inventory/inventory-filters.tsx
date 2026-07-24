"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const fuels = ["", "Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"];
const transmissions = ["", "Automatic", "Manual", "CVT", "Dual-Clutch"];
const bodyStyles = ["", "Sedan", "SUV", "Coupe", "Convertible", "Truck", "Hatchback"];
const driveTypes = ["", "FWD", "RWD", "AWD", "4WD"];

export function InventoryFilters({ brands }: { brands: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    params.delete("page");
    startTransition(() => {
      router.push(`/inventory?${params.toString()}`);
    });
  };

  const clear = () => {
    startTransition(() => router.push("/inventory"));
  };

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clear} disabled={pending}>
          Reset
        </Button>
      </div>
      <div className="space-y-4">
        <Field label="Search">
          <Input
            defaultValue={searchParams.get("q") || ""}
            placeholder="Keyword"
            onChange={(e) => update("q", e.target.value)}
          />
        </Field>
        <Field label="Brand">
          <Select
            value={searchParams.get("brand") || ""}
            onChange={(e) => update("brand", e.target.value)}
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Model">
          <Input
            defaultValue={searchParams.get("model") || ""}
            placeholder="Model"
            onChange={(e) => update("model", e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Year min">
            <Input
              type="number"
              defaultValue={searchParams.get("yearMin") || ""}
              onChange={(e) => update("yearMin", e.target.value)}
            />
          </Field>
          <Field label="Year max">
            <Input
              type="number"
              defaultValue={searchParams.get("yearMax") || ""}
              onChange={(e) => update("yearMax", e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price min">
            <Input
              type="number"
              defaultValue={searchParams.get("priceMin") || ""}
              onChange={(e) => update("priceMin", e.target.value)}
            />
          </Field>
          <Field label="Price max">
            <Input
              type="number"
              defaultValue={searchParams.get("priceMax") || ""}
              onChange={(e) => update("priceMax", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Max mileage">
          <Input
            type="number"
            defaultValue={searchParams.get("mileageMax") || ""}
            onChange={(e) => update("mileageMax", e.target.value)}
          />
        </Field>
        <Field label="Fuel">
          <Select
            value={searchParams.get("fuel") || ""}
            onChange={(e) => update("fuel", e.target.value)}
          >
            {fuels.map((fuel) => (
              <option key={fuel || "any"} value={fuel}>
                {fuel || "Any"}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Transmission">
          <Select
            value={searchParams.get("transmission") || ""}
            onChange={(e) => update("transmission", e.target.value)}
          >
            {transmissions.map((item) => (
              <option key={item || "any"} value={item}>
                {item || "Any"}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Body style">
          <Select
            value={searchParams.get("bodyStyle") || ""}
            onChange={(e) => update("bodyStyle", e.target.value)}
          >
            {bodyStyles.map((item) => (
              <option key={item || "any"} value={item}>
                {item || "Any"}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Drive type">
          <Select
            value={searchParams.get("driveType") || ""}
            onChange={(e) => update("driveType", e.target.value)}
          >
            {driveTypes.map((item) => (
              <option key={item || "any"} value={item}>
                {item || "Any"}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Color">
          <Input
            defaultValue={searchParams.get("color") || ""}
            placeholder="Color"
            onChange={(e) => update("color", e.target.value)}
          />
        </Field>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  );
}
