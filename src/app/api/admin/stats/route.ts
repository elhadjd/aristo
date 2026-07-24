import { NextResponse } from "next/server";
import { requireAdminResponse } from "@/lib/admin-api";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireAdminResponse();
  if (auth.error) return auth.error;

  const [vehicles, publishedVehicles, services, leads, articles, testimonials] =
    await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { published: true } }),
      prisma.service.count({ where: { published: true } }),
      prisma.contactLead.count(),
      prisma.article.count(),
      prisma.testimonial.count({ where: { published: true } }),
    ]);

  return NextResponse.json({
    vehicles,
    publishedVehicles,
    services,
    leads,
    articles,
    testimonials,
  });
}
