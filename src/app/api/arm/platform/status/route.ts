export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/arm/auth/account-access";
import { isGoogleCalendarConfigured } from "@/lib/arm/calendar/oauth";
import { isOpenAiConfigured } from "@/lib/arm/ai/openai";
import { isPlatformEmailConfigured } from "@/lib/arm/notifications/send";
import { getPublicMapboxToken, isMapboxConfigured } from "@/lib/arm/map/geocode";
import { isNewsApiConfigured } from "@/lib/arm/news/fetch";
import { isIntegrationsEncryptionConfigured } from "@/lib/arm/integrations/crypto";
import { isRazorpayConfigured } from "@/lib/arm/billing/razorpay";

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    return NextResponse.json({
      email: isPlatformEmailConfigured(),
      openai: isOpenAiConfigured(),
      googleCalendar: isGoogleCalendarConfigured(),
      mapbox: isMapboxConfigured(),
      mapboxPublic: Boolean(getPublicMapboxToken()),
      newsApi: isNewsApiConfigured(),
      integrationsEncryption: isIntegrationsEncryptionConfigured(),
      razorpay: isRazorpayConfigured(),
      cronSecret: Boolean(process.env.CRON_SECRET?.trim()),
      multiTenant: true,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
