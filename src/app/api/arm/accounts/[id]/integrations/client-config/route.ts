export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { resolveIntegrations } from "@/lib/arm/integrations/resolve";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid);

    const integrations = await resolveIntegrations(accountId);
    return NextResponse.json({
      mapboxToken: integrations.mapbox.accessToken || null,
      mapboxSource: integrations.mapbox.source,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
