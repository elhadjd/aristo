"use client";

import { SimpleResourcePage } from "@/features/admin/simple-resource-page";

export default function AdminBrandsPage() {
  return (
    <SimpleResourcePage
      title="Brands"
      description="Manufacturer brands linked to vehicles."
      endpoint="/api/admin/brands"
      fields={[
        { key: "name", label: "Name" },
        { key: "logo", label: "Logo", type: "image" },
      ]}
      mapRow={(row) => ({ ...row, title: row.name, subtitle: row.slug })}
    />
  );
}
