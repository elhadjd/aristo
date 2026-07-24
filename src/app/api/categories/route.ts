import { NextResponse } from "next/server";
import { listCategories } from "@/lib/data";

export async function GET() {
  const data = await listCategories();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
  });
}
