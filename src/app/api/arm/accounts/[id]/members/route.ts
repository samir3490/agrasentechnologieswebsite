export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAccess, requireAccountAdmin } from "@/lib/arm/auth/account-access";
import { getAdminAuth, getAdminDb } from "@/lib/arm/firebase/admin";
import { writeAuditLog } from "@/lib/arm/audit/log";

const addSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member", "viewer"]).default("member"),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid);

    const snap = await getAdminDb().collection(`ripAccounts/${accountId}/members`).get();
    const members = snap.docs.map((d) => ({
      userId: d.id,
      ...d.data(),
    }));

    return NextResponse.json({ members });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    const body = await request.json();
    const parsed = addSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    let targetUser;
    try {
      targetUser = await getAdminAuth().getUserByEmail(email);
    } catch {
      return NextResponse.json(
        {
          error: `${email} has not signed up yet. Ask them to create an account first, then add them again.`,
        },
        { status: 404 }
      );
    }

    const db = getAdminDb();
    const memberRef = db.doc(`ripAccounts/${accountId}/members/${targetUser.uid}`);
    if ((await memberRef.get()).exists) {
      return NextResponse.json({ error: "This person is already a member of this workspace." }, { status: 409 });
    }

    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    const accountName = accountSnap.data()?.name as string;
    const now = new Date().toISOString();

    await memberRef.set({
      userId: targetUser.uid,
      role: parsed.data.role,
      email,
      joinedAt: now,
    });

    await db.doc(`ripUsers/${targetUser.uid}/accountMemberships/${accountId}`).set({
      accountId,
      role: parsed.data.role,
      accountName,
      joinedAt: now,
    });

    await writeAuditLog(db, accountId, {
      action: "member.added",
      actorUserId: user.uid,
      actorEmail: user.email,
      resourceType: "member",
      resourceId: targetUser.uid,
      summary: `Added ${email} as ${parsed.data.role}`,
    });

    return NextResponse.json({ ok: true, userId: targetUser.uid, email, role: parsed.data.role });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add member";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
