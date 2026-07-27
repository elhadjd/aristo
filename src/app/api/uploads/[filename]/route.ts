import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  contentTypeForFilename,
  getLegacyUploadsDir,
  getUploadsDir,
  sanitizeUploadFilename,
} from "@/lib/uploads";

type Params = { params: Promise<{ filename: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { filename: raw } = await params;
  const filename = sanitizeUploadFilename(raw || "");
  if (!filename || filename !== raw || filename.includes("..")) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const candidates = [
    path.join(getUploadsDir(), filename),
    path.join(getLegacyUploadsDir(), filename),
  ];

  for (const filePath of candidates) {
    try {
      const bytes = await readFile(filePath);
      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": contentTypeForFilename(filename),
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Length": String(bytes.byteLength),
        },
      });
    } catch {
      // try next location
    }
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
