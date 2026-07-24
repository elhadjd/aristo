import { NextResponse } from "next/server";
import { listTestimonials } from "@/lib/data";

export async function GET() {
  const data = await listTestimonials();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
  });
}
