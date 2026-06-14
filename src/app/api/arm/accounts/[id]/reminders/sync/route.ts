export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth, requireAccountWrite } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { syncContactEventsAndReminders } from "@/lib/arm/reminders/sync";
import type { Contact, AccountSettings } from "@/lib/arm/types";

type RouteParams = { params: Promise<{ id: string }> };

/** Re-sync events/reminders for all contacts (e.g. after changing reminder intervals). */
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountWrite(accountId, user.uid);

    const db = getAdminDb();
    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    if (!accountSnap.exists) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const settings = (accountSnap.data()?.settings || {}) as AccountSettings;
    const contactsSnap = await db.collection(`ripAccounts/${accountId}/contacts`).get();
    let synced = 0;

    for (const doc of contactsSnap.docs) {
      const contact = { id: doc.id, ...doc.data() } as Contact;
      await syncContactEventsAndReminders(db, accountId, doc.id, contact, settings);
      synced++;
    }

    return NextResponse.json({ ok: true, synced });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 403 });
  }
}
