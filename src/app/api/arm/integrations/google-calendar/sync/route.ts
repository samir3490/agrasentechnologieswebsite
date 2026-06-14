export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth, requireAccountWrite } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { syncAccountToGoogleCalendar } from "@/lib/arm/calendar/sync";
import { getGoogleCalendarIntegration } from "@/lib/arm/calendar/google-client";

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = (await request.json()) as { accountId?: string };
    if (!body.accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 });
    }

    await requireAccountWrite(body.accountId, user.uid);
    const db = getAdminDb();
    const integration = await getGoogleCalendarIntegration(db, user.uid);
    if (!integration) {
      return NextResponse.json({ error: "Connect Google Calendar first." }, { status: 400 });
    }

    const result = await syncAccountToGoogleCalendar(db, body.accountId, user.uid);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
