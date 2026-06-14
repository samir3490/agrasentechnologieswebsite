export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAdmin } from "@/lib/arm/auth/account-access";
import { testWorkspaceIntegration, type IntegrationTestService } from "@/lib/arm/integrations/test";

const bodySchema = z.object({
  service: z.enum(["openai", "mapbox", "email", "news", "googleCalendar"]),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await testWorkspaceIntegration(accountId, parsed.data.service as IntegrationTestService);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Test failed";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
