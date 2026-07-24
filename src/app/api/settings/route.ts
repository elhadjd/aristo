import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data";

export async function GET() {
  const data = await getSiteSettings();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
