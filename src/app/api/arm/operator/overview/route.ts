export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { requireOperator } from "@/lib/arm/operator/auth";
import { buildOperatorOverview } from "@/lib/arm/operator/metrics";

export async function GET(request: Request) {
  try {
    requireOperator(request);
    const overview = await buildOperatorOverview(getAdminDb());
    return NextResponse.json(overview);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
