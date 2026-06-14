export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth, requireAccountAdmin } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { buildWorkspaceExport } from "@/lib/arm/export/workspace-export";
import { writeAuditLog } from "@/lib/arm/audit/log";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    const db = getAdminDb();
    const data = await buildWorkspaceExport(db, accountId);

    await writeAuditLog(db, accountId, {
      action: "export.downloaded",
      actorUserId: user.uid,
      actorEmail: user.email,
      summary: "Workspace data export downloaded",
    });

    const filename = `arm-export-${accountId.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`;
    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Export failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
