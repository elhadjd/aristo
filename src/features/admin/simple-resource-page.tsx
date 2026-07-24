"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Field =
  | { key: string; label: string; type?: "text" | "number" | "textarea" | "checkbox" }
  | { key: string; label: string; type: "list"; hint?: string };

export function SimpleResourcePage({
  title,
  description,
  endpoint,
  fields,
  mapRow,
  toPayload,
}: {
  title: string;
  description: string;
  endpoint: string;
  fields: Field[];
  mapRow?: (row: Record<string, unknown>) => Record<string, unknown>;
  toPayload?: (form: Record<string, unknown>) => Record<string, unknown>;
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = () => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    let active = true;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (active) setRows(Array.isArray(data) ? data : []);
      });
    return () => {
      active = false;
    };
  }, [endpoint]);

  const reset = () => {
    setForm({});
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          const payload = toPayload ? toPayload(form) : form;
          const response = await fetch(editingId ? `${endpoint}/${editingId}` : endpoint, {
            method: editingId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok) {
            toast.error("Save failed");
            return;
          }
          toast.success(editingId ? "Updated" : "Created");
          reset();
          load();
        }}
      >
        {fields.map((field) => (
          <label key={field.key} className="block text-sm md:col-span-1">
            <span className="mb-1.5 block font-medium">{field.label}</span>
            {field.type === "textarea" || field.type === "list" ? (
              <Textarea
                rows={4}
                value={String(form[field.key] ?? "")}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.type === "list" ? field.hint || "One item per line" : undefined}
              />
            ) : field.type === "checkbox" ? (
              <input
                type="checkbox"
                checked={Boolean(form[field.key])}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.checked }))}
              />
            ) : (
              <Input
                type={field.type === "number" ? "number" : "text"}
                value={String(form[field.key] ?? "")}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.key]:
                      field.type === "number" ? Number(e.target.value) : e.target.value,
                  }))
                }
              />
            )}
          </label>
        ))}
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" variant="secondary">
            {editingId ? "Update" : "Create"}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={reset}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {rows.map((row) => {
          const view = mapRow ? mapRow(row) : row;
          return (
            <div
              key={String(row.id)}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft"
            >
              <div>
                <p className="font-medium">{String(view.title || view.name || view.question || row.id)}</p>
                <p className="text-xs text-muted">
                  {String(view.subtitle || view.description || view.role || "")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingId(String(row.id));
                    setForm(mapRow ? mapRow(row) : row);
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    if (!confirm("Delete this item?")) return;
                    const response = await fetch(`${endpoint}/${row.id}`, { method: "DELETE" });
                    if (!response.ok) {
                      toast.error("Delete failed");
                      return;
                    }
                    toast.success("Deleted");
                    load();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
