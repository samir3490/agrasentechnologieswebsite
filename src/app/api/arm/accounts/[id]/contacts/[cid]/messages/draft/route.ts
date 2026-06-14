export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { generateMessageDraft } from "@/lib/arm/ai/messages";
import { resolveIntegrations } from "@/lib/arm/integrations/resolve";
import type { Contact } from "@/lib/arm/types";

const bodySchema = z.object({
  purpose: z.enum(["birthday", "check_in", "thank_you", "follow_up"]),
  tone: z.string().max(120).optional(),
});

type RouteParams = { params: Promise<{ id: string; cid: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId, cid } = await params;
    await requireAccountAccess(accountId, user.uid);

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const snap = await getAdminDb().doc(`ripAccounts/${accountId}/contacts/${cid}`).get();
    if (!snap.exists) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

    const contact = { id: snap.id, ...snap.data() } as Contact;
    const integrations = await resolveIntegrations(accountId);
    const result = await generateMessageDraft(contact, parsed.data.purpose, parsed.data.tone, integrations);

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to generate draft";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
