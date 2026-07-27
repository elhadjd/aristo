import path from "node:path";
import { mkdir } from "node:fs/promises";

export { mediaOriginFromRequest, resolveMediaSrc } from "@/lib/media-url";

/** Writable uploads directory (works on hosts where runtime writes to public/ are not served). */
export function getUploadsDir() {
  return path.join(process.cwd(), "uploads");
}

/** Legacy location used by earlier versions of the app. */
export function getLegacyUploadsDir() {
  return path.join(process.cwd(), "public", "uploads");
}

export async function ensureUploadsDir() {
  await mkdir(getUploadsDir(), { recursive: true });
}

export function sanitizeUploadFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export function uploadApiPath(filename: string) {
  return `/api/uploads/${sanitizeUploadFilename(filename)}`;
}

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export function contentTypeForFilename(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  return MIME[ext] || "application/octet-stream";
}
