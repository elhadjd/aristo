"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    companyName: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    financingRateFrom: 4.9,
    facebook: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          companyName: data.companyName || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          address: data.address || "",
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroImage: data.heroImage || "",
          financingRateFrom: data.financingRateFrom || 4.9,
          facebook: data.social?.facebook || "",
          instagram: data.social?.instagram || "",
          youtube: data.social?.youtube || "",
        });
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Site settings</h1>
        <p className="mt-2 text-sm text-muted">
          Hero, contact details, and brand content used across the public site.
        </p>
      </div>
      <form
        className="grid gap-4 rounded-2xl border border-border bg-white p-5 shadow-soft md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          const response = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              social: {
                facebook: form.facebook,
                instagram: form.instagram,
                youtube: form.youtube,
              },
            }),
          });
          if (!response.ok) {
            toast.error("Save failed");
            return;
          }
          toast.success("Settings saved");
        }}
      >
        {(
          [
            ["companyName", "Company name"],
            ["phone", "Phone"],
            ["whatsapp", "WhatsApp"],
            ["email", "Email"],
            ["address", "Address"],
            ["heroTitle", "Hero title"],
            ["heroImage", "Hero image URL"],
            ["facebook", "Facebook URL"],
            ["instagram", "Instagram URL"],
            ["youtube", "YouTube URL"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1.5 block font-medium">{label}</span>
            <Input
              value={form[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          </label>
        ))}
        <label className="block text-sm md:col-span-2">
          <span className="mb-1.5 block font-medium">Hero subtitle</span>
          <Textarea
            value={form.heroSubtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Financing rate from (%)</span>
          <Input
            type="number"
            step="0.1"
            value={form.financingRateFrom}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, financingRateFrom: Number(e.target.value) }))
            }
          />
        </label>
        <div className="md:col-span-2">
          <Button type="submit" variant="secondary">
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}
