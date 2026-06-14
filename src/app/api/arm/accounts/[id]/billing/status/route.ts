export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAccess, requireAccountAdmin } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { getBillingStatus, upgradeAccountPlan, verifyPaymentSignature } from "@/lib/arm/billing/razorpay";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid);

    const snap = await getAdminDb().doc(`ripAccounts/${accountId}`).get();
    if (!snap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(getBillingStatus(snap.data()!));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    const body = await request.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;
    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const db = getAdminDb();
    const pendingSnap = await db.doc(`ripAccounts/${accountId}/private/billingPending`).get();
    const pending = pendingSnap.data();
    if (!pending || pending.orderId !== razorpay_order_id) {
      return NextResponse.json({ error: "Order not found for this workspace" }, { status: 400 });
    }

    await upgradeAccountPlan(db, accountId, pending.plan, razorpay_payment_id);
    await db.doc(`ripAccounts/${accountId}/private/billingPending`).delete();

    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    return NextResponse.json(getBillingStatus(accountSnap.data()!));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
