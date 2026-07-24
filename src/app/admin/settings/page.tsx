"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageField } from "@/features/admin/image-field";

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
  const [sisgesc, setSisgesc] = useState<{ configured: boolean; endpoint?: string } | null>(null);

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

    fetch("/api/admin/sisgesc-status")
      .then((res) => res.json())
      .then(setSisgesc)
      .catch(() => setSisgesc({ configured: false }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Site settings</h1>
        <p className="mt-2 text-sm text-muted">
          Hero, contact details, and brand content used across the public site.
        </p>
      </div>

      {sisgesc ? (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            sisgesc.configured
              ? "border-border bg-white text-ink"
              : "border-secondary/40 bg-secondary/5 text-ink"
          }`}
        >
          <p className="font-medium">
            SISGESC contact sync: {sisgesc.configured ? "configured" : "not configured"}
          </p>
          <p className="mt-1 text-muted">
            {sisgesc.configured
              ? `Leads are forwarded to ${sisgesc.endpoint || "the configured endpoint"}.`
              : "Set SISGESC_API_URL and SISGESC_SITE_API_KEY in `.env` / `.env.local`, then restart the server."}
          </p>
        </div>
      ) : null}

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
        <div className="md:col-span-2">
          <ImageField
            label="Hero image"
            value={form.heroImage}
            onChange={(heroImage) => setForm((prev) => ({ ...prev, heroImage }))}
          />
        </div>
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
