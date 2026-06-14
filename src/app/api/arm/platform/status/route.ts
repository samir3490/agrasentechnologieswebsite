export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/arm/auth/account-access";
import { isGoogleCalendarConfigured } from "@/lib/arm/calendar/oauth";
import { isOpenAiConfigured } from "@/lib/arm/ai/openai";
import { isPlatformEmailConfigured } from "@/lib/arm/notifications/send";
import { getPublicMapboxToken, isMapboxConfigured } from "@/lib/arm/map/geocode";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    return NextResponse.json({
      email: isPlatformEmailConfigured(),
      openai: isOpenAiConfigured(),
      googleCalendar: isGoogleCalendarConfigured(),
      mapbox: isMapboxConfigured(),
      mapboxPublic: Boolean(getPublicMapboxToken()),
      cronSecret: Boolean(process.env.CRON_SECRET?.trim()),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
