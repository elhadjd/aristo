import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireAdminResponse() {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}
