import { NextResponse } from "next/server";
import { requireAdminResponse } from "@/lib/admin-api";
import { getContactEndpoint, isSisgescContactConfigured } from "@/lib/sisgesc-contact";

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;

  const endpoint = getContactEndpoint();

  return NextResponse.json({
    configured: isSisgescContactConfigured(),
    endpoint: endpoint || null,
    required: process.env.SISGESC_CONTACT_REQUIRED === "true",
  });
}
