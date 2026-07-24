import { NextResponse } from "next/server";
import { getSisgescStatus, listVehicles } from "@/lib/data";
import { isSisgescConfigured } from "@/config/api";

export async function GET() {
  const status = getSisgescStatus();

  if (!isSisgescConfigured()) {
    return NextResponse.json({
      ok: true,
      mode: "mock",
      message: "SISGESC Site API not configured. Serving local demo catalog.",
      ...status,
    });
  }

  try {
    const sample = await listVehicles({ pageSize: 1 });
    return NextResponse.json({
      ok: true,
      mode: "sisgesc",
      message: "SISGESC Site API reachable via server-side key.",
      ...status,
      sampleTotal: sample.meta.total,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        mode: "sisgesc",
        message: error instanceof Error ? error.message : "SISGESC request failed",
        ...status,
      },
      { status: 502 },
    );
  }
}
