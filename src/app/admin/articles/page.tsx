"use client";

import { SimpleResourcePage } from "@/features/admin/simple-resource-page";

export default function AdminArticlesPage() {
  return (
    <SimpleResourcePage
      title="Articles"
      description="News and editorial content published on the website."
      endpoint="/api/admin/articles"
      fields={[
        { key: "title", label: "Title" },
        { key: "excerpt", label: "Excerpt", type: "textarea" },
        { key: "content", label: "Content", type: "textarea" },
        { key: "coverImage", label: "Cover image URL" },
        { key: "published", label: "Published", type: "checkbox" },
      ]}
      mapRow={(row) => ({
        ...row,
        title: row.title,
        subtitle: row.excerpt,
        published: Boolean(row.published),
      })}
    />
  );
}
