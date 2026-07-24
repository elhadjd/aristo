"use client";

import { SimpleResourcePage } from "@/features/admin/simple-resource-page";

export default function AdminFaqPage() {
  return (
    <SimpleResourcePage
      title="FAQ"
      description="Questions and answers displayed on the FAQ page."
      endpoint="/api/admin/faq"
      fields={[
        { key: "question", label: "Question" },
        { key: "answer", label: "Answer", type: "textarea" },
        { key: "published", label: "Published", type: "checkbox" },
        { key: "sortOrder", label: "Sort order", type: "number" },
      ]}
      mapRow={(row) => ({
        ...row,
        title: row.question,
        subtitle: row.answer,
        published: row.published !== false,
        sortOrder: Number(row.sortOrder || 0),
      })}
    />
  );
}
