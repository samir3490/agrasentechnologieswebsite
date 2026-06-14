export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAdmin } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { writeAuditLog } from "@/lib/arm/audit/log";

const patchSchema = z.object({
  role: z.enum(["admin", "member", "viewer"]),
});

type RouteParams = { params: Promise<{ id: string; uid: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId, uid: memberId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    const accountSnap = await getAdminDb().doc(`ripAccounts/${accountId}`).get();
    if (accountSnap.data()?.ownerId === memberId) {
      return NextResponse.json({ error: "Cannot change the workspace owner's role." }, { status: 400 });
    }

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const db = getAdminDb();
    const memberRef = db.doc(`ripAccounts/${accountId}/members/${memberId}`);
    const memberSnap = await memberRef.get();
    if (!memberSnap.exists) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    await memberRef.update({ role: parsed.data.role });
    await db.doc(`ripUsers/${memberId}/accountMemberships/${accountId}`).update({ role: parsed.data.role });

    await writeAuditLog(db, accountId, {
      action: "member.role_changed",
      actorUserId: user.uid,
      actorEmail: user.email,
      resourceType: "member",
      resourceId: memberId,
      summary: `Changed ${memberSnap.data()?.email} role to ${parsed.data.role}`,
    });

    return NextResponse.json({ ok: true, role: parsed.data.role });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId, uid: memberId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    const db = getAdminDb();
    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    if (accountSnap.data()?.ownerId === memberId) {
      return NextResponse.json({ error: "Cannot remove the workspace owner." }, { status: 400 });
    }

    const memberSnap = await db.doc(`ripAccounts/${accountId}/members/${memberId}`).get();
    if (!memberSnap.exists) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    await db.doc(`ripAccounts/${accountId}/members/${memberId}`).delete();
    await db.doc(`ripUsers/${memberId}/accountMemberships/${accountId}`).delete();

    await writeAuditLog(db, accountId, {
      action: "member.removed",
      actorUserId: user.uid,
      actorEmail: user.email,
      resourceType: "member",
      resourceId: memberId,
      summary: `Removed ${memberSnap.data()?.email} from workspace`,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
