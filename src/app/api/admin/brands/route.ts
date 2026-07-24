import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { slugify } from "@/utils/format";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  logo: z.string().default(""),
});

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  return NextResponse.json(
    await prisma.brand.findMany({
      include: { _count: { select: { vehicles: true } } },
      orderBy: { name: "asc" },
    }),
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  try {
    const payload = schema.parse(await request.json());
    const created = await prisma.brand.create({
      data: { ...payload, slug: payload.slug || slugify(payload.name) },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return jsonError("Unable to create brand", 500);
  }
}
