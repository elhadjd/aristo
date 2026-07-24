import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { slugify } from "@/utils/format";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  logo: z.string(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;
  try {
    const payload = schema.parse(await request.json());
    const updated = await prisma.brand.update({
      where: { id },
      data: { ...payload, slug: payload.slug || slugify(payload.name) },
    });
    return NextResponse.json(updated);
  } catch {
    return jsonError("Unable to update brand", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;
  await prisma.brand.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
