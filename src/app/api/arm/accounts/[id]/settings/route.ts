export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAccess, requireAccountWrite } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";

const settingsSchema = z.object({
  notificationEmail: z.string().email().optional(),
  emailRemindersEnabled: z.boolean().optional(),
  dailyDigestEnabled: z.boolean().optional(),
  digestHour: z.number().min(0).max(23).optional(),
  reminderIntervals: z.array(z.number().min(0).max(365)).optional(),
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
    await ref.update({ settings });

    return NextResponse.json({ settings });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
