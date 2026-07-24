import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  isSisgescContactConfigured,
  sendLeadToSisgesc,
  sisgescUserMessage,
} from "@/lib/sisgesc-contact";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  subject: z.string().optional(),
  message: z.string().optional(),
  vehicleId: z.string().optional(),
  interest: z
    .enum(["purchase", "financing", "trade-in", "service", "general"])
    .optional(),
  service: z.union([z.string(), z.number()]).optional(),
  serviceType: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

function syncStatusCode(status?: number) {
  if (status === 422) return 422;
  if (status === 401 || status === 403) return 502;
  if (status === 404) return 502;
  return 502;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = contactSchema.parse(body);

    const lead = await prisma.contactLead.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        subject: payload.subject || "",
        message: payload.message || "",
        vehicleId: payload.vehicleId || "",
        interest: payload.interest || "general",
        status: "new",
        sisgescSync: "pending",
      },
    });

    const sync = await sendLeadToSisgesc({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
      vehicleId: payload.vehicleId,
      interest: payload.interest,
      service: payload.service,
      serviceType: payload.serviceType || payload.interest,
      metadata: {
        page_url: request.headers.get("referer") || undefined,
        local_lead_id: lead.id,
        ...(payload.metadata || {}),
      },
    });

    const sisgescState = sync.ok
      ? "synced"
      : sync.configured === false
        ? "unconfigured"
        : "failed";

    await prisma.contactLead.update({
      where: { id: lead.id },
      data: {
        sisgescSync: sisgescState,
        sisgescRef: sync.reference || sync.error || "",
      },
    });

    // When SISGESC is configured, a failed sync is a hard error for the visitor.
    // The lead is still kept locally so Admin can Resync later.
    if (!sync.ok && sync.configured !== false) {
      console.error(
        `[ARISTO] Contact saved locally (${lead.id}) but SISGESC sync failed:`,
        sync.error,
      );
      return NextResponse.json(
        {
          success: false,
          message: sisgescUserMessage(sync),
          detail: sync.error,
          id: lead.id,
          sisgesc: "failed",
          sisgescError: sync.error,
          sisgescConfigured: true,
          endpoint: sync.endpoint,
        },
        { status: syncStatusCode(sync.status) },
      );
    }

    // Not configured: only fail if explicitly required.
    if (!sync.ok && process.env.SISGESC_CONTACT_REQUIRED === "true") {
      return NextResponse.json(
        {
          success: false,
          message: sisgescUserMessage(sync),
          detail: sync.error,
          id: lead.id,
          sisgesc: "not_configured",
          sisgescError: sync.error,
          sisgescConfigured: false,
        },
        { status: 503 },
      );
    }

    if (!sync.ok) {
      console.warn(
        `[ARISTO] Contact saved locally (${lead.id}) without SISGESC:`,
        sync.error,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent. Our team will respond shortly.",
        id: lead.id,
        sisgesc: sync.ok ? "synced" : "not_configured",
        sisgescRef: sync.reference,
        sisgescConfigured: isSisgescContactConfigured(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid form data. Please check the highlighted fields.",
          errors: error.flatten(),
        },
        { status: 422 },
      );
    }
    console.error("[ARISTO] Contact submit failed", error);
    return NextResponse.json(
      { success: false, message: "Unable to submit request. Please try again." },
      { status: 500 },
    );
  }
}
