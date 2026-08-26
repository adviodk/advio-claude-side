import { NextResponse } from "next/server";
import { computeAvailability } from "@/lib/availability";

export async function GET() {
  try {
    const data = await computeAvailability();
    return NextResponse.json({ ok: true, ...data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 502 },
    );
  }
}
