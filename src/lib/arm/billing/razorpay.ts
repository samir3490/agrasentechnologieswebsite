import crypto from "crypto";
import type { Firestore } from "firebase-admin/firestore";
import { BILLING_PLANS, PLAN_LIMITS } from "@/lib/arm/constants/plans";
import type { AccountPlan } from "@/lib/arm/types";

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID?.trim() && process.env.RAZORPAY_KEY_SECRET?.trim());
}

export function getRazorpayPublicKey() {
  return process.env.RAZORPAY_KEY_ID?.trim() || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
}

function authHeader() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) throw new Error("Razorpay is not configured on the platform.");
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export async function createCheckoutOrder(accountId: string, plan: keyof typeof BILLING_PLANS) {
  const planDef = BILLING_PLANS[plan];
  const receipt = `arm_${accountId}_${plan}_${Date.now()}`;

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: planDef.priceInPaisa,
      currency: "INR",
      receipt,
      notes: { accountId, plan },
    }),
  });

  const data = (await res.json()) as { id?: string; error?: { description?: string } };
  if (!res.ok || !data.id) {
    throw new Error(data.error?.description || "Failed to create Razorpay order");
  }

  return { orderId: data.id, amount: planDef.priceInPaisa, currency: "INR", plan, receipt };
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return expected === signature;
}

export function verifyWebhookSignature(body: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export async function upgradeAccountPlan(
  db: Firestore,
  accountId: string,
  plan: Exclude<AccountPlan, "free" | "enterprise">,
  paymentId: string
) {
  const planDef = BILLING_PLANS[plan];
  const now = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + planDef.periodDays);

  await db.doc(`ripAccounts/${accountId}`).update({
    plan,
    contactLimit: PLAN_LIMITS[plan],
    billing: {
      lastPaymentAt: now.toISOString(),
      planExpiresAt: expires.toISOString(),
      razorpayPaymentId: paymentId,
      activePlan: plan,
    },
  });
}

export function getBillingStatus(account: Record<string, unknown>) {
  const billing = (account.billing || {}) as {
    planExpiresAt?: string;
    lastPaymentAt?: string;
    activePlan?: AccountPlan;
  };
  const plan = (account.plan as AccountPlan) || "free";
  const contactLimit = (account.contactLimit as number) || PLAN_LIMITS.free;
  const expired = billing.planExpiresAt ? new Date(billing.planExpiresAt) < new Date() : false;

  return {
    plan,
    contactLimit,
    planExpiresAt: billing.planExpiresAt || null,
    lastPaymentAt: billing.lastPaymentAt || null,
    expired: plan !== "free" && expired,
    plans: BILLING_PLANS,
    razorpayConfigured: isRazorpayConfigured(),
    publicKey: getRazorpayPublicKey() || null,
  };
}
