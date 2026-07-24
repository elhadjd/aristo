import { NextRequest, NextResponse } from "next/server";
import { listFeatured } from "@/lib/data";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") || 6);
  const data = await listFeatured(limit);
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
