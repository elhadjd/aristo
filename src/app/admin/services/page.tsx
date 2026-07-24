"use client";

import { SimpleResourcePage } from "@/features/admin/simple-resource-page";

export default function AdminServicesPage() {
  return (
    <SimpleResourcePage
      title="Services"
      description="Financing, inspection, delivery, and other services shown on the website."
      endpoint="/api/admin/services"
      fields={[
        { key: "name", label: "Name" },
        { key: "description", label: "Short description", type: "textarea" },
        { key: "longDescription", label: "Full description", type: "textarea" },
        { key: "icon", label: "Icon key (e.g. Wrench)" },
        { key: "image", label: "Image URL" },
        { key: "benefitsText", label: "Benefits", type: "list", hint: "One benefit per line" },
        { key: "featured", label: "Featured", type: "checkbox" },
        { key: "published", label: "Published", type: "checkbox" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      mapRow={(row) => ({
        ...row,
        title: row.name,
        subtitle: row.description,
        benefitsText: Array.isArray(row.benefits) ? row.benefits.join("\n") : "",
        featured: Boolean(row.featured),
        published: row.published !== false,
        sortOrder: Number(row.sortOrder || 0),
      })}
      toPayload={(form) => ({
        name: form.name,
        description: form.description || "",
        longDescription: form.longDescription || "",
        icon: form.icon || "Wrench",
        image: form.image || "",
        benefits: String(form.benefitsText || "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        featured: Boolean(form.featured),
        published: form.published !== false,
        sortOrder: Number(form.sortOrder || 0),
      })}
    />
  );
}
