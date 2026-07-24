"use client";

import { SimpleResourcePage } from "@/features/admin/simple-resource-page";

export default function AdminCategoriesPage() {
  return (
    <SimpleResourcePage
      title="Categories"
      description="Body styles / inventory categories for filters and homepage."
      endpoint="/api/admin/categories"
      fields={[
        { key: "name", label: "Name" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "image", label: "Image", type: "image" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      mapRow={(row) => ({
        ...row,
        title: row.name,
        subtitle: row.description,
        sortOrder: Number(row.sortOrder || 0),
      })}
    />
  );
}
