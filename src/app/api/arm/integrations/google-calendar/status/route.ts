export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { getGoogleCalendarIntegration } from "@/lib/arm/calendar/google-client";
import { isGoogleCalendarConfigured } from "@/lib/arm/calendar/oauth";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import type { AccountSettings } from "@/lib/arm/types";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    if (!accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 });
    }

    await requireAccountAccess(accountId, user.uid);
    const db = getAdminDb();
    const integration = await getGoogleCalendarIntegration(db, user.uid);
    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    const settings = (accountSnap.data()?.settings ?? {}) as AccountSettings;

    return NextResponse.json({
      configured: isGoogleCalendarConfigured(),
      connected: Boolean(integration),
      connectedEmail: integration?.connectedEmail ?? null,
      syncEnabled:
        settings.googleCalendarSyncEnabled === true && settings.googleCalendarSyncedBy === user.uid,
      lastSyncAt: settings.googleCalendarLastSyncAt ?? null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load calendar status";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth(request);
    const db = getAdminDb();
    const { deleteGoogleCalendarIntegration } = await import("@/lib/arm/calendar/google-client");
    await deleteGoogleCalendarIntegration(db, user.uid);

    const memberships = await db.collection(`ripUsers/${user.uid}/accountMemberships`).get();
    const batch = db.batch();
    for (const m of memberships.docs) {
      const ref = db.doc(`ripAccounts/${m.id}`);
      const snap = await ref.get();
      if (!snap.exists) continue;
      const settings = snap.data()?.settings ?? {};
      if (settings.googleCalendarSyncedBy === user.uid) {
        batch.update(ref, {
          settings: {
            ...settings,
            googleCalendarSyncEnabled: false,
            googleCalendarSyncedBy: null,
          },
        });
      }
    }
    await batch.commit();

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to disconnect";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
