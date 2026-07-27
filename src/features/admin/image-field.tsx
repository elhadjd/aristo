"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveMediaSrc } from "@/lib/media-url";

export function ImageField({
  label,
  value,
  onChange,
  hint = "Paste a full image URL (https://...) or upload a file from your computer.",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const previewSrc = useMemo(() => resolveMediaSrc(value, origin), [value, origin]);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Upload failed");
        return;
      }
      // Prefer absolute URL from API so <img> always has a complete src.
      setBroken(false);
      onChange(String(data.url || data.path || ""));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="block text-sm md:col-span-1">
      <span className="mb-1.5 block font-medium">{label}</span>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={value}
          placeholder="https://example.com/photo.jpg"
          onChange={(e) => {
            setBroken(false);
            onChange(e.target.value);
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
        >
          {uploading ? "Uploading…" : "Upload file"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
      <p className="mt-1 text-xs text-muted">{hint}</p>
      {previewSrc ? (
        <div className="mt-2 overflow-hidden rounded-xl border border-border bg-muted-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={previewSrc}
            src={previewSrc}
            alt=""
            className="h-28 w-full object-cover"
            onError={() => setBroken(true)}
            onLoad={() => setBroken(false)}
          />
          {broken ? (
            <p className="border-t border-border px-3 py-2 text-xs text-secondary">
              Preview failed. Use a full https:// URL, or re-upload the file.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
