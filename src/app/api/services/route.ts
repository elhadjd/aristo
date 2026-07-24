import { NextResponse } from "next/server";
import { listServices } from "@/lib/data";

export async function GET() {
  const data = await listServices();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
  });
}
