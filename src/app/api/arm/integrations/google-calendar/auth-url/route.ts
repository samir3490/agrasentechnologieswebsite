export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import {
  buildGoogleAuthUrl,
  signOAuthState,
} from "@/lib/arm/calendar/oauth";
import {
  isGoogleCalendarConfiguredForResolved,
  resolveGoogleOAuthForAccount,
  resolveIntegrations,
} from "@/lib/arm/integrations/resolve";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    if (!accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 });
    }

    await requireAccountAccess(accountId, user.uid);
    const resolved = await resolveIntegrations(accountId);
    if (!isGoogleCalendarConfiguredForResolved(resolved)) {
      return NextResponse.json(
        { error: "Google Calendar OAuth is not configured. Add your Google OAuth app in Settings → Connections." },
        { status: 503 }
      );
    }

    const oauthConfig = await resolveGoogleOAuthForAccount(accountId);
    const state = signOAuthState({ userId: user.uid, accountId });
    return NextResponse.json({ url: buildGoogleAuthUrl(state, oauthConfig) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to start Google Calendar connect";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
