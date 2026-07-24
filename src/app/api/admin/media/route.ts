import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  return NextResponse.json(
    await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
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

    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filename = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    const url = `/uploads/${filename}`;
    const asset = await prisma.mediaAsset.create({
      data: {
        url,
        filename,
        alt: form.get("alt")?.toString() || file.name,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error(error);
    return jsonError("Upload failed", 500);
  }
}
