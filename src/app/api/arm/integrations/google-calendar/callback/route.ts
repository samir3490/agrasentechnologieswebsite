export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { armPath } from "@/lib/arm/paths";
import { exchangeCodeForTokens, verifyOAuthState } from "@/lib/arm/calendar/oauth";
import {
  fetchGoogleUserEmail,
  saveGoogleCalendarIntegration,
} from "@/lib/arm/calendar/google-client";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { syncAccountToGoogleCalendar } from "@/lib/arm/calendar/sync";
import { resolveGoogleOAuthForAccount } from "@/lib/arm/integrations/resolve";

function redirectToSettings(request: NextRequest, query: string) {
  const base = (process.env.NEXT_PUBLIC_APP_URL?.trim() || new URL(request.url).origin).replace(/\/$/, "");
  return NextResponse.redirect(`${base}${armPath("/settings")}?calendar=${query}`);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      return redirectToSettings(request, "denied");
    }
    if (!code || !state) {
      return redirectToSettings(request, "invalid");
    }

    const payload = verifyOAuthState(state);
    const oauthConfig = await resolveGoogleOAuthForAccount(payload.accountId);
    const tokens = await exchangeCodeForTokens(code, oauthConfig);
    if (!tokens.refresh_token) {
      return redirectToSettings(request, "no_refresh");
    }

    const email = tokens.access_token ? await fetchGoogleUserEmail(tokens.access_token) : undefined;
    const db = getAdminDb();

    await saveGoogleCalendarIntegration(db, payload.userId, {
      refreshToken: tokens.refresh_token,
      calendarId: "primary",
      connectedEmail: email,
      connectedAt: new Date().toISOString(),
      oauthSource: oauthConfig.source === "workspace" ? "workspace" : "platform",
      oauthClientId: oauthConfig.clientId,
    });

    const accountRef = db.doc(`ripAccounts/${payload.accountId}`);
    const accountSnap = await accountRef.get();
    if (accountSnap.exists) {
      const settings = accountSnap.data()?.settings ?? {};
      await accountRef.update({
        settings: {
          ...settings,
          googleCalendarSyncEnabled: true,
          googleCalendarSyncedBy: payload.userId,
        },
      });
      await syncAccountToGoogleCalendar(db, payload.accountId, payload.userId).catch((e) => {
        console.error("Initial Google Calendar sync failed:", e);
      });
    }

    return redirectToSettings(request, "connected");
  } catch (e) {
    console.error("Google Calendar callback error:", e);
    return redirectToSettings(request, "error");
  }
}
