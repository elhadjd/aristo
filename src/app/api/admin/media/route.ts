import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { mediaOriginFromRequest, resolveMediaSrc } from "@/lib/media-url";
import {
  isAllowedImageUpload,
  MAX_IMAGE_UPLOAD_BYTES,
} from "@/lib/image-upload";
import {
  ensureUploadsDir,
  getUploadsDir,
  sanitizeUploadFilename,
  uploadApiPath,
} from "@/lib/uploads";

export async function GET(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;

  const origin = mediaOriginFromRequest(request);
  const rows = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(
    rows.map((row) => ({
      ...row,
      url: resolveMediaSrc(row.url, origin),
    })),
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return jsonError("File is required");
    }

    if (!isAllowedImageUpload(file)) {
      return jsonError(
        "Unsupported file type. Use JPG, PNG, WEBP, GIF, AVIF, HEIC, BMP, TIFF, or SVG.",
        400,
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.byteLength > MAX_IMAGE_UPLOAD_BYTES) {
      return jsonError("Image must be 20MB or smaller", 400);
    }

    const safeName = sanitizeUploadFilename(file.name || "image.jpg");
    const filename = `${Date.now()}-${safeName}`;
    await ensureUploadsDir();
    await writeFile(path.join(getUploadsDir(), filename), bytes);

    // Persist a stable app path; clients receive an absolute URL for display.
    const storedPath = uploadApiPath(filename);
    const origin = mediaOriginFromRequest(request);
    const absoluteUrl = resolveMediaSrc(storedPath, origin);

    const asset = await prisma.mediaAsset.create({
      data: {
        url: storedPath,
        filename,
        alt: form.get("alt")?.toString() || file.name,
      },
    });

    return NextResponse.json(
      {
        ...asset,
        url: absoluteUrl,
        path: storedPath,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return jsonError("Upload failed", 500);
  }
}
