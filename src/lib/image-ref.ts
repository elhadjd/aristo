import { z } from "zod";

/** Accepts absolute http(s) URLs or local uploaded paths like `/uploads/...`. */
export function isImageRef(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/uploads/")) return true;
  return /^https?:\/\//i.test(trimmed);
}

export const imageRefSchema = z
  .string()
  .trim()
  .refine(isImageRef, "Must be an image URL or /uploads/... path");

export const optionalImageRefSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || isImageRef(value), "Must be an image URL or /uploads/... path");
