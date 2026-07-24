import { NextResponse } from "next/server";
import { listBrands } from "@/lib/data";

export async function GET() {
  const data = await listBrands();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
  });
}
