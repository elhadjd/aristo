import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { slugify } from "@/utils/format";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  excerpt: z.string(),
  content: z.string(),
  coverImage: z.string(),
  published: z.boolean(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;
  try {
    const payload = schema.parse(await request.json());
    const existing = await prisma.article.findUnique({ where: { id } });
    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...payload,
        slug: payload.slug || slugify(payload.title),
        publishedAt:
          payload.published && !existing?.publishedAt ? new Date() : existing?.publishedAt,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return jsonError("Unable to update article", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
