import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

const schema = z.object({
  question: z.string().min(3),
  answer: z.string().min(3),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  return NextResponse.json(await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  try {
    const payload = schema.parse(await request.json());
    return NextResponse.json(await prisma.faqItem.create({ data: payload }), { status: 201 });
  } catch {
    return jsonError("Unable to create FAQ item", 500);
  }
}
