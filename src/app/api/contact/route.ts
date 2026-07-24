import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
  vehicleId: z.string().optional(),
  interest: z
    .enum(["purchase", "financing", "trade-in", "service", "general"])
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = contactSchema.parse(body);

    // JWT-ready lead capture stub — replace with SISGESC CRM webhook when available.
    const id = `lead_${Date.now()}`;
    console.info("[ARISTO] Lead captured", { id, ...payload });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid form data", errors: error.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json({ message: "Unable to submit request" }, { status: 500 });
  }
}
