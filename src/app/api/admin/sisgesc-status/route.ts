import { NextResponse } from "next/server";
import { requireAdminResponse } from "@/lib/admin-api";
import { isSisgescContactConfigured } from "@/lib/sisgesc-contact";

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;

  const contactUrl = (process.env.SISGESC_CONTACT_URL || "").trim();
  const baseUrl = (process.env.SISGESC_API_URL || "").trim().replace(/\/$/, "");
  const endpoint =
    contactUrl ||
    (baseUrl ? `${baseUrl}/api/site/contacts/submit` : "");

  return NextResponse.json({
    configured: isSisgescContactConfigured(),
    endpoint: endpoint || null,
    required: process.env.SISGESC_CONTACT_REQUIRED === "true",
  });
}
