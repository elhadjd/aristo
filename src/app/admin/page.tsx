"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/utils/cn";

type Stats = {
  vehicles: number;
  publishedVehicles: number;
  services: number;
  leads: number;
  articles: number;
  testimonials: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const cards = [
    { label: "Vehicles", value: stats?.vehicles ?? "—", href: "/admin/vehicles" },
    { label: "Published", value: stats?.publishedVehicles ?? "—", href: "/admin/vehicles" },
    { label: "Services", value: stats?.services ?? "—", href: "/admin/services" },
    { label: "Contact leads", value: stats?.leads ?? "—", href: "/admin/leads" },
    { label: "Articles", value: stats?.articles ?? "—", href: "/admin/articles" },
    { label: "Testimonials", value: stats?.testimonials ?? "—", href: "/admin/testimonials" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">
            Full control of everything visitors see on the Fellah Express LLC website.
          </p>
        </div>
        <Link href="/admin/vehicles/new" className={cn(buttonVariants({ variant: "secondary" }))}>
          Add vehicle
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-4xl">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
