"use client";

import { armApi } from "@/lib/arm/paths";
import { useCallback, useEffect, useState } from "react";

type BillingStatus = {
  plan: string;
  contactLimit: number;
  planExpiresAt: string | null;
  lastPaymentAt: string | null;
  expired: boolean;
  razorpayConfigured: boolean;
  publicKey: string | null;
  plans: Record<string, { label: string; priceInPaisa: number; description: string; contactLimit: number }>;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export function BillingPanel({
  accountId,
  getIdToken,
  isAdmin,
}: {
  accountId: string;
  getIdToken: () => Promise<string | null>;
  isAdmin: boolean;
}) {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/billing/status`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setStatus(await res.json());
    } finally {
      setLoading(false);
    }
  }, [accountId, getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  async function upgrade(plan: "pro" | "business") {
    if (!isAdmin) return;
    setBusy(true);
    setMessage("");
    try {
      await loadRazorpayScript();
      const token = await getIdToken();
      const checkoutRes = await fetch(armApi(`/accounts/${accountId}/billing/checkout`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });
      const checkout = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkout.error || "Checkout failed");

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key: checkout.keyId,
          amount: checkout.amount,
          currency: checkout.currency,
          name: "AI Relationship Manager",
          description: `${checkout.planLabel} plan — 30 days`,
          order_id: checkout.orderId,
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const verifyRes = await fetch(armApi(`/accounts/${accountId}/billing/status`), {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(response),
              });
              const data = await verifyRes.json();
              if (!verifyRes.ok) throw new Error(data.error || "Verification failed");
              setStatus(data);
              setMessage(`Upgraded to ${checkout.planLabel}. Thank you!`);
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });
        rzp.open();
      });
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading plan...</p>;
  if (!status) return null;

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Plan & billing</h2>
        <p className="mt-1 text-sm text-slate-500">
          Each workspace has its own plan and contact limit. Upgrade this workspace independently.
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white/60 p-4 text-sm">
        <p>
          Current plan: <strong className="capitalize">{status.plan}</strong>
        </p>
        <p className="text-slate-600">Contact limit: {status.contactLimit.toLocaleString()}</p>
        {status.planExpiresAt && (
          <p className="text-slate-600">Renews / expires: {new Date(status.planExpiresAt).toLocaleDateString()}</p>
        )}
        {status.expired && <p className="text-amber-700">Plan expired — upgrade to restore limits.</p>}
      </div>

      {!status.razorpayConfigured ? (
        <p className="text-sm text-amber-700">
          Platform billing is not configured. Self-hosted operators can set Razorpay keys on the server, or run on
          the free plan with your own API keys in Connections.
        </p>
      ) : isAdmin ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(["pro", "business"] as const).map((plan) => {
            const def = status.plans[plan];
            if (!def) return null;
            return (
              <div key={plan} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                <h3 className="font-semibold">{def.label}</h3>
                <p className="mt-1 text-sm text-slate-600">{def.description}</p>
                <p className="mt-2 text-lg font-bold">₹{(def.priceInPaisa / 100).toLocaleString("en-IN")}/mo</p>
                <button
                  type="button"
                  disabled={busy || status.plan === plan}
                  onClick={() => upgrade(plan)}
                  className="btn-primary mt-3 text-sm"
                >
                  {status.plan === plan ? "Current plan" : busy ? "Processing..." : `Upgrade to ${def.label}`}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Only workspace owners/admins can change the plan.</p>
      )}

      {message && <p className="text-sm text-indigo-600">{message}</p>}
    </section>
  );
}
