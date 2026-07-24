import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { optionalImageRefSchema } from "@/lib/image-ref";
import { mapDbSettings } from "@/lib/mappers";

const schema = z.object({
  companyName: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  phone: z.string(),
  whatsapp: z.string(),
  email: z.string().email(),
  address: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: optionalImageRefSchema,
  financingRateFrom: z.number(),
  mapEmbedUrl: z.string().optional(),
  hoursJson: z.string().optional(),
  social: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      youtube: z.string().optional(),
      x: z.string().optional(),
    })
    .optional(),
});

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const row = await prisma.siteSetting.findUnique({ where: { id: "default" } });
  if (!row) return jsonError("Settings not found", 404);
  return NextResponse.json({ ...mapDbSettings(row), raw: row });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  try {
    const payload = schema.parse(await request.json());
    const row = await prisma.siteSetting.upsert({
      where: { id: "default" },
      update: {
        companyName: payload.companyName,
        tagline: payload.tagline || "",
        description: payload.description || "",
        phone: payload.phone,
        whatsapp: payload.whatsapp,
        email: payload.email,
        address: payload.address,
        heroTitle: payload.heroTitle,
        heroSubtitle: payload.heroSubtitle,
        heroImage: payload.heroImage,
        financingRateFrom: payload.financingRateFrom,
        mapEmbedUrl: payload.mapEmbedUrl || "",
        hoursJson: payload.hoursJson || "[]",
        socialJson: JSON.stringify(payload.social || {}),
      },
      create: {
        id: "default",
        companyName: payload.companyName,
        tagline: payload.tagline || "",
        description: payload.description || "",
        phone: payload.phone,
        whatsapp: payload.whatsapp,
        email: payload.email,
        address: payload.address,
        heroTitle: payload.heroTitle,
        heroSubtitle: payload.heroSubtitle,
        heroImage: payload.heroImage,
        financingRateFrom: payload.financingRateFrom,
        mapEmbedUrl: payload.mapEmbedUrl || "",
        hoursJson: payload.hoursJson || "[]",
        socialJson: JSON.stringify(payload.social || {}),
      },
    });
    return NextResponse.json(mapDbSettings(row));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid settings", errors: error.flatten() }, { status: 400 });
    }
    return jsonError("Unable to save settings", 500);
  }
}
