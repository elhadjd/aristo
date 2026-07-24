"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ImageField({
  label,
  value,
  onChange,
  hint = "Paste a URL or upload a file from your computer.",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
      onChange(String(data.url));
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
          placeholder="https://... or /uploads/photo.jpg"
          onChange={(e) => onChange(e.target.value)}
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
      {value ? (
        <div className="mt-2 overflow-hidden rounded-xl border border-border bg-surface">
          {/* Admin preview supports both remote URLs and /uploads paths */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-28 w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
