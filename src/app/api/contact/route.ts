import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendLeadToSisgesc } from "@/lib/sisgesc-contact";

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
      service: payload.service ?? payload.vehicleId,
      serviceType: payload.serviceType || payload.interest,
      metadata: {
        page_url: request.headers.get("referer") || undefined,
        local_lead_id: lead.id,
        ...(payload.metadata || {}),
      },
    });

    await prisma.contactLead.update({
      where: { id: lead.id },
      data: {
        sisgescSync: sync.ok ? "synced" : "failed",
        sisgescRef: sync.reference || sync.error || "",
      },
    });

    if (!sync.ok && process.env.SISGESC_CONTACT_REQUIRED === "true") {
      return NextResponse.json(
        {
          message: "Unable to reach SISGESC contact API",
          detail: sync.error,
        },
        { status: sync.status === 422 ? 422 : 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: lead.id,
        sisgesc: sync.ok ? "synced" : "queued_locally",
        sisgescRef: sync.reference,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid form data", errors: error.flatten() },
        { status: 422 },
      );
    }
    console.error("[ARISTO] Contact submit failed", error);
    return NextResponse.json({ message: "Unable to submit request" }, { status: 500 });
  }
}
