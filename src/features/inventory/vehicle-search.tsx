"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/utils/cn";

const brands = [
  "Any brand",
  "Mercedes-Benz",
  "BMW",
  "Porsche",
  "Tesla",
  "Audi",
  "Lexus",
  "Land Rover",
  "Cadillac",
];

const bodyStyles = ["Any body style", "SUV", "Sedan", "Coupe", "Truck", "Electric"];

export function VehicleSearch({ light = false }: { light?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("Any brand");
  const [bodyStyle, setBodyStyle] = useState("Any body style");
  const suggestions = useMemo(() => {
    if (!q.trim()) return [] as string[];
    return ["BMW M340i", "Tesla Model Y", "Mercedes GLE", "Porsche Cayenne"]
      .filter((item) => item.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 4);
  }, [q]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (brand !== "Any brand") params.set("brand", brand);
    if (bodyStyle === "Electric") params.set("fuel", "Electric");
    else if (bodyStyle !== "Any body style") params.set("bodyStyle", bodyStyle);
    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="relative grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
      <div className="relative">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Make, model, or keyword"
          aria-label="Search keyword"
          className={cn(
            light && "border-white/20 bg-[#111827]/95 text-white placeholder:text-white/55",
          )}
          autoComplete="off"
        />
        {suggestions.length > 0 ? (
          <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-lift">
            {suggestions.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted-bg"
                  onClick={() => {
                    setQ(item);
                    router.push(`/inventory?q=${encodeURIComponent(item)}`);
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <Select
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        aria-label="Brand"
        className={cn(
          light &&
            "border-white/20 bg-[#111827]/95 text-white [&_option]:bg-[#111827] [&_option]:text-white",
        )}
      >
        {brands.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </Select>
      <Select
        value={bodyStyle}
        onChange={(e) => setBodyStyle(e.target.value)}
        aria-label="Body style"
        className={cn(
          light &&
            "border-white/20 bg-[#111827]/95 text-white [&_option]:bg-[#111827] [&_option]:text-white",
        )}
      >
        {bodyStyles.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </Select>
      <Button type="submit" variant="secondary" size="lg">
        Search
      </Button>
    </form>
  );
}
