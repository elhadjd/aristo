import { NextResponse } from "next/server";
import { requireAdminResponse } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const leads = await prisma.contactLead.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(leads);
}
