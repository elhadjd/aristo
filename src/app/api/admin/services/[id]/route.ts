import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { mapDbService } from "@/lib/mappers";
import { slugify } from "@/utils/format";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string(),
  longDescription: z.string(),
  icon: z.string(),
  image: z.string(),
  benefits: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
  sortOrder: z.number().int(),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;
  try {
    const payload = schema.parse(await request.json());
    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...payload,
        slug: payload.slug || slugify(payload.name),
        benefits: JSON.stringify(payload.benefits),
      },
    });
    return NextResponse.json(mapDbService(updated));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid service data", errors: error.flatten() }, { status: 400 });
    }
    return jsonError("Unable to update service", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
