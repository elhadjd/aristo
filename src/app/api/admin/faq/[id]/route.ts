import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

const schema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
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
    return NextResponse.json(await prisma.faqItem.update({ where: { id }, data: payload }));
  } catch {
    return jsonError("Unable to update FAQ item", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;
  await prisma.faqItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
