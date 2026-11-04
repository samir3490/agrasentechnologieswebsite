export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { requireOperator } from "@/lib/arm/operator/auth";
import { buildOperatorAccountDetail } from "@/lib/arm/operator/metrics";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireOperator(request);
    const { id } = await params;
    const detail = await buildOperatorAccountDetail(getAdminDb(), id);
    if (!detail) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
