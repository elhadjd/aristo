import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { slugify } from "@/utils/format";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  excerpt: z.string().default(""),
  content: z.string().default(""),
  coverImage: z.string().default(""),
  published: z.boolean().default(false),
});

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  return NextResponse.json(await prisma.article.findMany({ orderBy: { updatedAt: "desc" } }));
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  try {
    const payload = schema.parse(await request.json());
    const created = await prisma.article.create({
      data: {
        ...payload,
        slug: payload.slug || slugify(payload.title),
        publishedAt: payload.published ? new Date() : null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return jsonError("Unable to create article", 500);
  }
}
