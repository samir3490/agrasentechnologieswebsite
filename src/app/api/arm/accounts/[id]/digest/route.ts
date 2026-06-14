export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { buildDailyDigest } from "@/lib/arm/reminders/digest";
import { toDateKey } from "@/lib/arm/reminders/dates";
import type { Contact, DailyDigest } from "@/lib/arm/types";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid);

    const today = toDateKey(new Date());
    const db = getAdminDb();
    const digestRef = db.doc(`ripAccounts/${accountId}/digests/${today}`);
    const cached = await digestRef.get();

    if (cached.exists) {
      return NextResponse.json(cached.data() as DailyDigest);
    }

    const contactsSnap = await db.collection(`ripAccounts/${accountId}/contacts`).get();
    const contacts = contactsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Contact[];
    const digest = buildDailyDigest(accountId, today, contacts);

    return NextResponse.json(digest);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch digest";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
