export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAccess, requireAccountWrite } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { writeAuditLog } from "@/lib/arm/audit/log";

const settingsSchema = z.object({
  notificationEmail: z.string().email().optional(),
  emailRemindersEnabled: z.boolean().optional(),
  dailyDigestEnabled: z.boolean().optional(),
  digestHour: z.number().min(0).max(23).optional(),
  reminderIntervals: z.array(z.number().min(0).max(365)).optional(),
  googleCalendarSyncEnabled: z.boolean().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid);

    const snap = await getAdminDb().doc(`ripAccounts/${accountId}`).get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ settings: snap.data()?.settings ?? {} });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountWrite(accountId, user.uid);

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const ref = getAdminDb().doc(`ripAccounts/${accountId}`);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const current = snap.data()?.settings ?? {};
    const settings = { ...current, ...parsed.data };

    if (parsed.data.googleCalendarSyncEnabled === true) {
      settings.googleCalendarSyncedBy = user.uid;
    } else if (parsed.data.googleCalendarSyncEnabled === false) {
      settings.googleCalendarSyncedBy = null;
    }

    await ref.update({ settings });

    await writeAuditLog(getAdminDb(), accountId, {
      action: "settings.updated",
      actorUserId: user.uid,
      actorEmail: user.email,
      summary: "Updated workspace notification settings",
    });

    if (parsed.data.googleCalendarSyncEnabled === true) {
      const { syncAccountToGoogleCalendar } = await import("@/lib/arm/calendar/sync");
      await syncAccountToGoogleCalendar(getAdminDb(), accountId, user.uid).catch((e) => {
        console.error("Google Calendar sync after enable failed:", e);
      });
    }

    return NextResponse.json({ settings });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
