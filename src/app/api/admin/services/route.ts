import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { mapDbService } from "@/lib/mappers";
import { slugify } from "@/utils/format";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().default(""),
  longDescription: z.string().default(""),
  icon: z.string().default("Wrench"),
  image: z.string().default(""),
  benefits: z.array(z.string()).default([]),
  featured: z.boolean().default(true),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const rows = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(
    rows.map((row) => ({
      ...mapDbService(row),
      published: row.published,
      sortOrder: row.sortOrder,
    })),
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  try {
    const payload = schema.parse(await request.json());
    const created = await prisma.service.create({
      data: {
        ...payload,
        slug: payload.slug || slugify(payload.name),
        benefits: JSON.stringify(payload.benefits),
      },
    });
    return NextResponse.json(mapDbService(created), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid service data", errors: error.flatten() }, { status: 400 });
    }
    return jsonError("Unable to create service", 500);
  }
}
