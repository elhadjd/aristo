import path from "node:path";

/** Max upload size for admin media. */
export const MAX_IMAGE_UPLOAD_BYTES = 20 * 1024 * 1024;

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".jfif",
  ".pjpeg",
  ".pjp",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".bmp",
  ".dib",
  ".tif",
  ".tiff",
  ".svg",
  ".ico",
  ".heic",
  ".heif",
]);

const IMAGE_MIME_PREFIXES = ["image/"];

/** MIME types some devices send for photos that are still images. */
const EXTRA_IMAGE_MIMES = new Set([
  "application/octet-stream",
  "binary/octet-stream",
  "",
]);

export function isAllowedImageUpload(file: { name: string; type: string }): boolean {
  const mime = (file.type || "").toLowerCase().trim();
  if (IMAGE_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix))) {
    return true;
  }

  const ext = path.extname(file.name || "").toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext) && EXTRA_IMAGE_MIMES.has(mime)) {
    return true;
  }

  // Some Android/iOS pickers leave type empty but keep a photo filename.
  if (!mime && IMAGE_EXTENSIONS.has(ext)) {
    return true;
  }

  return false;
}

export function imageAcceptAttribute() {
  return [
    "image/*",
    ".jpg",
    ".jpeg",
    ".jfif",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".bmp",
    ".tif",
    ".tiff",
    ".heic",
    ".heif",
    ".svg",
  ].join(",");
}
