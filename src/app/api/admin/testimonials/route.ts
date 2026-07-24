import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1),
  role: z.string().default(""),
  rating: z.number().int().min(1).max(5).default(5),
  content: z.string().min(5),
  avatar: z.string().default(""),
  vehiclePurchased: z.string().default(""),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  return NextResponse.json(await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  try {
    const payload = schema.parse(await request.json());
    return NextResponse.json(await prisma.testimonial.create({ data: payload }), { status: 201 });
  } catch {
    return jsonError("Unable to create testimonial", 500);
  }
}
