export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAdmin } from "@/lib/arm/auth/account-access";
import { listAuditLogs } from "@/lib/arm/audit/log";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    const { getAdminDb } = await import("@/lib/arm/firebase/admin");
    const logs = await listAuditLogs(getAdminDb(), accountId);
    return NextResponse.json({ logs });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
