"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/features/admin/image-field";

export type VehicleFormValues = {
  name: string;
  brandName: string;
  brandId?: string | null;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  engine: string;
  doors: number;
  color: string;
  condition: string;
  description: string;
  bodyStyle: string;
  driveType: string;
  vin: string;
  mpgCity?: number | null;
  mpgHighway?: number | null;
  featured: boolean;
  published: boolean;
  categoryId?: string | null;
  features: string[];
  images: string[];
  attributes: { label: string; value: string }[];
  sortOrder: number;
};

const emptyValues: VehicleFormValues = {
  name: "",
  brandName: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuel: "Gasoline",
  transmission: "Automatic",
  engine: "",
  doors: 4,
  color: "",
  condition: "Used",
  description: "",
  bodyStyle: "Sedan",
  driveType: "FWD",
  vin: "",
  featured: false,
  published: true,
  features: [],
  images: [""],
  attributes: [{ label: "", value: "" }],
  sortOrder: 0,
};

export function VehicleForm({
  initial,
  vehicleId,
  brands = [],
  categories = [],
}: {
  initial?: Partial<VehicleFormValues>;
  vehicleId?: string;
  brands?: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<VehicleFormValues>({ ...emptyValues, ...initial });
  const [featuresText, setFeaturesText] = useState((initial?.features || []).join("\n"));
  const [saving, setSaving] = useState(false);

  const imageList = useMemo(() => values.images, [values.images]);

  const update = <K extends keyof VehicleFormValues>(key: K, value: VehicleFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      className="space-y-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        const payload: VehicleFormValues = {
          ...values,
          features: featuresText
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          images: values.images.map((item) => item.trim()).filter(Boolean),
          attributes: values.attributes.filter((item) => item.label && item.value),
          brandId: values.brandId || null,
          categoryId: values.categoryId || null,
        };

        try {
          const response = await fetch(
            vehicleId ? `/api/admin/vehicles/${vehicleId}` : "/api/admin/vehicles",
            {
              method: vehicleId ? "PUT" : "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            },
          );
          const data = await response.json();
          if (!response.ok) {
            toast.error(data.message || "Save failed");
            return;
          }
          toast.success(vehicleId ? "Vehicle updated" : "Vehicle created");
          router.push("/admin/vehicles");
          router.refresh();
        } catch {
          toast.error("Save failed");
        } finally {
          setSaving(false);
        }
      }}
    >
      <section className="grid gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft md:grid-cols-2">
        <Field label="Display name">
          <Input value={values.name} onChange={(e) => update("name", e.target.value)} required />
        </Field>
        <Field label="Brand">
          <Input
            list="brand-options"
            value={values.brandName}
            onChange={(e) => {
              const brandName = e.target.value;
              const match = brands.find((brand) => brand.name === brandName);
              setValues((prev) => ({ ...prev, brandName, brandId: match?.id || null }));
            }}
            required
          />
          <datalist id="brand-options">
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name} />
            ))}
          </datalist>
        </Field>
        <Field label="Model">
          <Input value={values.model} onChange={(e) => update("model", e.target.value)} required />
        </Field>
        <Field label="Year">
          <Input
            type="number"
            value={values.year}
            onChange={(e) => update("year", Number(e.target.value))}
            required
          />
        </Field>
        <Field label="Price (USD)">
          <Input
            type="number"
            value={values.price}
            onChange={(e) => update("price", Number(e.target.value))}
            required
          />
        </Field>
        <Field label="Mileage">
          <Input
            type="number"
            value={values.mileage}
            onChange={(e) => update("mileage", Number(e.target.value))}
          />
        </Field>
        <Field label="Fuel">
          <Select value={values.fuel} onChange={(e) => update("fuel", e.target.value)}>
            {["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Transmission">
          <Select
            value={values.transmission}
            onChange={(e) => update("transmission", e.target.value)}
          >
            {["Automatic", "Manual", "CVT", "Dual-Clutch"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Body style">
          <Select value={values.bodyStyle} onChange={(e) => update("bodyStyle", e.target.value)}>
            {["Sedan", "SUV", "Coupe", "Convertible", "Truck", "Hatchback", "Wagon", "Van"].map(
              (item) => (
                <option key={item}>{item}</option>
              ),
            )}
          </Select>
        </Field>
        <Field label="Drive type">
          <Select value={values.driveType} onChange={(e) => update("driveType", e.target.value)}>
            {["FWD", "RWD", "AWD", "4WD"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Color">
          <Input value={values.color} onChange={(e) => update("color", e.target.value)} />
        </Field>
        <Field label="Condition">
          <Select value={values.condition} onChange={(e) => update("condition", e.target.value)}>
            {["New", "Certified Pre-Owned", "Used"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </Field>
        <Field label="Engine">
          <Input value={values.engine} onChange={(e) => update("engine", e.target.value)} />
        </Field>
        <Field label="VIN">
          <Input value={values.vin} onChange={(e) => update("vin", e.target.value)} />
        </Field>
        <Field label="Category">
          <Select
            value={values.categoryId || ""}
            onChange={(e) => update("categoryId", e.target.value || null)}
          >
            <option value="">None</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Doors">
          <Input
            type="number"
            value={values.doors}
            onChange={(e) => update("doors", Number(e.target.value))}
          />
        </Field>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
        <h2 className="font-display text-2xl">Description</h2>
        <Textarea
          className="mt-3"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          rows={5}
        />
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Gallery images</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => update("images", [...values.images, ""])}
          >
            Add image
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted">
          Use an image URL or upload a file for each gallery slot.
        </p>
        <div className="mt-4 space-y-4">
          {imageList.map((image, index) => (
            <div key={index} className="space-y-2">
              <ImageField
                label={`Image ${index + 1}`}
                value={image}
                onChange={(value) => {
                  const next = [...values.images];
                  next[index] = value;
                  update("images", next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => update("images", values.images.filter((_, i) => i !== index))}
              >
                Remove image
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <h2 className="font-display text-2xl">Features</h2>
          <p className="mt-1 text-sm text-muted">One feature per line.</p>
          <Textarea
            className="mt-3"
            rows={8}
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
          />
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Attributes</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                update("attributes", [...values.attributes, { label: "", value: "" }])
              }
            >
              Add
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            {values.attributes.map((attr, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  placeholder="Label"
                  value={attr.label}
                  onChange={(e) => {
                    const next = [...values.attributes];
                    next[index] = { ...next[index], label: e.target.value };
                    update("attributes", next);
                  }}
                />
                <Input
                  placeholder="Value"
                  value={attr.value}
                  onChange={(e) => {
                    const next = [...values.attributes];
                    next[index] = { ...next[index], value: e.target.value };
                    update("attributes", next);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    update(
                      "attributes",
                      values.attributes.filter((_, i) => i !== index),
                    )
                  }
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => update("published", e.target.checked)}
          />
          Published on website
        </label>
        <Button type="submit" variant="secondary" disabled={saving} className="ml-auto">
          {saving ? "Saving…" : vehicleId ? "Update vehicle" : "Create vehicle"}
        </Button>
      </section>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  );
}
