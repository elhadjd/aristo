import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminResponse, jsonError } from "@/lib/admin-api";
import { prisma } from "@/lib/db";
import { mapDbVehicle } from "@/lib/mappers";

const vehicleSchema = z.object({
  name: z.string().min(2),
  brandName: z.string().min(1),
  brandId: z.string().optional().nullable(),
  model: z.string().min(1),
  year: z.number().int().min(1980),
  price: z.number().min(0),
  mileage: z.number().int().min(0).default(0),
  fuel: z.string().default("Gasoline"),
  transmission: z.string().default("Automatic"),
  engine: z.string().default(""),
  doors: z.number().int().min(2).default(4),
  color: z.string().default(""),
  condition: z.string().default("Used"),
  description: z.string().default(""),
  bodyStyle: z.string().default("Sedan"),
  driveType: z.string().default("FWD"),
  vin: z.string().default(""),
  mpgCity: z.number().int().optional().nullable(),
  mpgHighway: z.number().int().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  categoryId: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  attributes: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([]),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;

  const rows = await prisma.vehicle.findMany({
    include: { images: true, attributes: true, brand: true, category: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  return NextResponse.json(
    rows.map((row) => ({
      ...mapDbVehicle(row),
      published: row.published,
      sortOrder: row.sortOrder,
      attributes: row.attributes
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((attr) => ({ label: attr.label, value: attr.value })),
    })),
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;

  try {
    const payload = vehicleSchema.parse(await request.json());
    const created = await prisma.vehicle.create({
      data: {
        name: payload.name,
        brandName: payload.brandName,
        brandId: payload.brandId || null,
        model: payload.model,
        year: payload.year,
        price: payload.price,
        mileage: payload.mileage,
        fuel: payload.fuel,
        transmission: payload.transmission,
        engine: payload.engine,
        doors: payload.doors,
        color: payload.color,
        condition: payload.condition,
        description: payload.description,
        bodyStyle: payload.bodyStyle,
        driveType: payload.driveType,
        vin: payload.vin,
        mpgCity: payload.mpgCity ?? null,
        mpgHighway: payload.mpgHighway ?? null,
        featured: payload.featured,
        published: payload.published,
        categoryId: payload.categoryId || null,
        features: JSON.stringify(payload.features),
        sortOrder: payload.sortOrder,
        images: {
          create: payload.images.map((url, index) => ({
            url,
            alt: payload.name,
            sortOrder: index,
          })),
        },
        attributes: {
          create: payload.attributes.map((attr, index) => ({
            label: attr.label,
            value: attr.value,
            sortOrder: index,
          })),
        },
      },
      include: { images: true, attributes: true, brand: true, category: true },
    });

    return NextResponse.json(mapDbVehicle(created), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid vehicle data", errors: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return jsonError("Unable to create vehicle", 500);
  }
}
