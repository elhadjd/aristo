import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { slugify } from "@/utils/format";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().default(""),
  image: z.string().default(""),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const rows = await prisma.category.findMany({
    include: { _count: { select: { vehicles: true } } },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  try {
    const payload = schema.parse(await request.json());
    const created = await prisma.category.create({
      data: {
        ...payload,
        slug: payload.slug || slugify(payload.name),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return jsonError("Unable to create category", 500);
  }
}
