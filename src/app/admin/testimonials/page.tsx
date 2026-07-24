"use client";

import { SimpleResourcePage } from "@/features/admin/simple-resource-page";

export default function AdminTestimonialsPage() {
  return (
    <SimpleResourcePage
      title="Testimonials"
      description="Customer reviews shown on the homepage and testimonials page."
      endpoint="/api/admin/testimonials"
      fields={[
        { key: "name", label: "Customer name" },
        { key: "role", label: "Role / location" },
        { key: "rating", label: "Rating (1-5)", type: "number" },
        { key: "content", label: "Review", type: "textarea" },
        { key: "vehiclePurchased", label: "Vehicle purchased" },
        { key: "published", label: "Published", type: "checkbox" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      mapRow={(row) => ({
        ...row,
        title: row.name,
        subtitle: row.role,
        rating: Number(row.rating || 5),
        published: row.published !== false,
        sortOrder: Number(row.sortOrder || 0),
      })}
    />
  );
}
