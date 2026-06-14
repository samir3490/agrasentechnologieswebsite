export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAdmin } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { createCheckoutOrder, getRazorpayPublicKey, isRazorpayConfigured } from "@/lib/arm/billing/razorpay";
import { BILLING_PLANS } from "@/lib/arm/constants/plans";

const bodySchema = z.object({
  plan: z.enum(["pro", "business"]),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Platform billing is not configured. Contact the operator or use a self-hosted deployment with Razorpay keys." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const order = await createCheckoutOrder(accountId, parsed.data.plan);
    const db = getAdminDb();
    await db.doc(`ripAccounts/${accountId}/private/billingPending`).set({
      orderId: order.orderId,
      plan: parsed.data.plan,
      amount: order.amount,
      createdAt: new Date().toISOString(),
      createdBy: user.uid,
    });

    return NextResponse.json({
      ...order,
      keyId: getRazorpayPublicKey(),
      planLabel: BILLING_PLANS[parsed.data.plan].label,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
