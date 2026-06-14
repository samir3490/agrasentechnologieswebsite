export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess, requireAccountWrite } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { contactUpdateSchema } from "@/lib/arm/validation/contact";
import { syncContactEventsAndReminders, removeContactEventsAndReminders } from "@/lib/arm/reminders/sync";
import {
  maybeRemoveGoogleCalendarForContact,
  maybeSyncGoogleCalendarForContact,
} from "@/lib/arm/calendar/sync";
import type { Contact, AccountSettings } from "@/lib/arm/types";

type RouteParams = { params: Promise<{ id: string; cid: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId, cid } = await params;
    await requireAccountAccess(accountId, user.uid);

    const snap = await getAdminDb().doc(`ripAccounts/${accountId}/contacts/${cid}`).get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ id: snap.id, ...snap.data() });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch contact";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId, cid } = await params;
    await requireAccountWrite(accountId, user.uid);

    const body = await request.json();
    const parsed = contactUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = db.doc(`ripAccounts/${accountId}/contacts/${cid}`);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const updates = { ...parsed.data, updatedAt: new Date().toISOString() };
    await ref.update(updates);

    const merged = { id: cid, ...snap.data(), ...updates } as Contact;
    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    const settings = (accountSnap.data()?.settings || {}) as AccountSettings;
    await syncContactEventsAndReminders(db, accountId, cid, merged, settings);
    await maybeSyncGoogleCalendarForContact(db, accountId, cid, merged, settings);

    return NextResponse.json(merged);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update contact";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId, cid } = await params;
    await requireAccountWrite(accountId, user.uid);

    const db = getAdminDb();
    const ref = db.doc(`ripAccounts/${accountId}/contacts/${cid}`);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    const settings = (accountSnap.data()?.settings || {}) as AccountSettings;

    await maybeRemoveGoogleCalendarForContact(db, accountId, cid, settings);
    await removeContactEventsAndReminders(db, accountId, cid);
    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete contact";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
