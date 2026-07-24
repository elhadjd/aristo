import { NextRequest, NextResponse } from "next/server";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { sendLeadToSisgesc } from "@/lib/sisgesc-contact";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;

  const { id } = await params;
  const lead = await prisma.contactLead.findUnique({ where: { id } });
  if (!lead) return jsonError("Lead not found", 404);

  const sync = await sendLeadToSisgesc({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    subject: lead.subject || undefined,
    message: lead.message || undefined,
    vehicleId: lead.vehicleId || undefined,
    interest: lead.interest || undefined,
    serviceType: lead.interest || undefined,
    metadata: {
      form: "admin-resync",
      local_lead_id: lead.id,
    },
  });

  const updated = await prisma.contactLead.update({
    where: { id: lead.id },
    data: {
      sisgescSync: sync.ok ? "synced" : sync.configured === false ? "unconfigured" : "failed",
      sisgescRef: sync.reference || sync.error || "",
    },
  });

  if (!sync.ok) {
    return NextResponse.json(
      {
        message: sync.error || "SISGESC sync failed",
        lead: updated,
      },
      { status: sync.configured === false ? 503 : sync.status === 422 ? 422 : 502 },
    );
  }

  return NextResponse.json({ success: true, lead: updated });
}
