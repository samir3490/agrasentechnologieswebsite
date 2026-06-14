export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import {
  buildGoogleAuthUrl,
  isGoogleCalendarConfigured,
  signOAuthState,
} from "@/lib/arm/calendar/oauth";

export async function GET(request: Request) {
  try {
    if (!isGoogleCalendarConfigured()) {
      return NextResponse.json({ error: "Google Calendar is not configured on the server." }, { status: 503 });
    }

    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    if (!accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 });
    }

    await requireAccountAccess(accountId, user.uid);
    const state = signOAuthState({ userId: user.uid, accountId });
    return NextResponse.json({ url: buildGoogleAuthUrl(state) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to start Google Calendar connect";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
