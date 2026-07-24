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
  mileage: z.number().int().min(0),
  fuel: z.string(),
  transmission: z.string(),
  engine: z.string(),
  doors: z.number().int(),
  color: z.string(),
  condition: z.string(),
  description: z.string(),
  bodyStyle: z.string(),
  driveType: z.string(),
  vin: z.string().optional(),
  mpgCity: z.number().int().optional().nullable(),
  mpgHighway: z.number().int().optional().nullable(),
  featured: z.boolean(),
  published: z.boolean(),
  categoryId: z.string().optional().nullable(),
  features: z.array(z.string()),
  images: z.array(z.string()),
  attributes: z.array(z.object({ label: z.string(), value: z.string() })),
  sortOrder: z.number().int().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;

  const row = await prisma.vehicle.findUnique({
    where: { id },
    include: { images: true, attributes: true, brand: true, category: true },
  });
  if (!row) return jsonError("Vehicle not found", 404);
  return NextResponse.json({
    ...mapDbVehicle(row),
    published: row.published,
    sortOrder: row.sortOrder,
    attributes: row.attributes
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((attr) => ({ label: attr.label, value: attr.value })),
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;

  try {
    const payload = vehicleSchema.parse(await request.json());

    await prisma.vehicleImage.deleteMany({ where: { vehicleId: id } });
    await prisma.vehicleAttribute.deleteMany({ where: { vehicleId: id } });

    const updated = await prisma.vehicle.update({
      where: { id },
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
        vin: payload.vin || "",
        mpgCity: payload.mpgCity ?? null,
        mpgHighway: payload.mpgHighway ?? null,
        featured: payload.featured,
        published: payload.published,
        categoryId: payload.categoryId || null,
        features: JSON.stringify(payload.features),
        sortOrder: payload.sortOrder ?? 0,
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

    return NextResponse.json(mapDbVehicle(updated));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid vehicle data", errors: error.flatten() }, { status: 400 });
    }
    return jsonError("Unable to update vehicle", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;
  const { id } = await params;
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
