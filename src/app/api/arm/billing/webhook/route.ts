export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { upgradeAccountPlan, verifyWebhookSignature } from "@/lib/arm/billing/razorpay";

export async function POST(request: NextRequest) {
  const bodyText = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  if (!verifyWebhookSignature(bodyText, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(bodyText) as {
    event?: string;
    payload?: {
      payment?: { entity?: { id?: string; order_id?: string; notes?: { accountId?: string; plan?: string } } };
    };
  };

  if (payload.event !== "payment.captured") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const payment = payload.payload?.payment?.entity;
  const accountId = payment?.notes?.accountId;
  const plan = payment?.notes?.plan;
  if (!accountId || !plan || !payment?.id || (plan !== "pro" && plan !== "business")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const db = getAdminDb();
  await upgradeAccountPlan(db, accountId, plan, payment.id);
  await db.doc(`ripAccounts/${accountId}/private/billingPending`).delete().catch(() => {});

  return NextResponse.json({ ok: true });
}
