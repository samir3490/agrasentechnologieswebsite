"use client";

import { armApi } from "@/lib/arm/paths";
import { useCallback, useEffect, useState } from "react";
import type { MaskedWorkspaceIntegrations } from "@/lib/arm/integrations/types";

const SETUP_STEPS = [
  {
    id: "email",
    service: "email" as const,
    title: "Email reminders",
    optional: false,
    signupUrl: "https://resend.com/signup",
    steps: [
      "Create a free Resend account (or use your SMTP server).",
      "Copy your API key and a verified From address.",
      "Paste them in Connections below and save.",
    ],
  },
  {
    id: "openai",
    service: "openai" as const,
    title: "AI gifts & messages",
    optional: true,
    signupUrl: "https://platform.openai.com/api-keys",
    steps: [
      "Create an OpenAI API key (optional — heuristics work without it).",
      "Paste the key in Connections and save.",
      "Open any contact and try Generate gifts.",
    ],
  },
  {
    id: "mapbox",
    service: "mapbox" as const,
    title: "Network map",
    optional: true,
    signupUrl: "https://account.mapbox.com/access-tokens/",
    steps: [
      "Create a Mapbox account and copy your default public token.",
      "Paste it in Connections and save.",
      "Add city to a contact, then open Map.",
    ],
  },
  {
    id: "googleCalendar",
    service: "googleCalendar" as const,
    title: "Google Calendar",
    optional: true,
    signupUrl: "https://console.cloud.google.com/apis/credentials",
    steps: [
      "Create an OAuth 2.0 Client ID (Web application).",
      "Add the redirect URI shown in Connections.",
      "Paste Client ID & Secret in Connections, save, then Connect Google Calendar.",
    ],
  },
  {
    id: "news",
    service: "news" as const,
    title: "Company news",
    optional: true,
    signupUrl: "https://newsapi.org/register",
    steps: [
      "Works out of the box via Google News RSS — no key required.",
      "Optional: add a NewsAPI.org key in Connections for richer headlines.",
    ],
  },
];

function statusForStep(stepId: string, masked: MaskedWorkspaceIntegrations | null) {
  if (!masked) return "pending";
  const map: Record<string, boolean> = {
    email: masked.email.configured,
    openai: masked.openai.configured,
    mapbox: masked.mapbox.configured,
    googleCalendar: masked.googleCalendar.configured,
    news: true,
  };
  return map[stepId] ? "ready" : "pending";
}

export function ConnectionSetupGuide({
  accountId,
  getIdToken,
  isAdmin,
}: {
  accountId: string;
  getIdToken: () => Promise<string | null>;
  isAdmin: boolean;
}) {
  const [masked, setMasked] = useState<MaskedWorkspaceIntegrations | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/integrations`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setMasked(await res.json());
    } finally {
      setLoading(false);
    }
  }, [accountId, getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  async function runTest(service: string) {
    if (!isAdmin) return;
    setTesting(service);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/integrations/test`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service }),
      });
      const data = await res.json();
      setTestResult((prev) => ({
        ...prev,
        [service]: data.ok ? `✓ ${data.message}` : `✗ ${data.message}`,
      }));
    } catch {
      setTestResult((prev) => ({ ...prev, [service]: "✗ Test failed" }));
    } finally {
      setTesting(null);
    }
  }

  const readyCount = SETUP_STEPS.filter((s) => statusForStep(s.id, masked) === "ready").length;

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Setup checklist</h2>
        <p className="mt-1 text-sm text-slate-500">
          Connect your own services in a few minutes. Each workspace is independent — your keys never mix with
          other customers. {readyCount}/{SETUP_STEPS.length} ready.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading status...</p>
      ) : (
        <ol className="space-y-4">
          {SETUP_STEPS.map((step, index) => {
            const status = statusForStep(step.id, masked);
            return (
              <li key={step.id} className="rounded-xl border border-slate-100 bg-white/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        status === "ready" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {status === "ready" ? "✓" : index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {step.title}{" "}
                        {step.optional && (
                          <span className="text-xs font-normal text-slate-400">(optional)</span>
                        )}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={step.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary py-1 text-xs"
                    >
                      Get API key →
                    </a>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => runTest(step.service)}
                        disabled={testing === step.service}
                        className="btn-secondary py-1 text-xs"
                      >
                        {testing === step.service ? "Testing..." : "Test"}
                      </button>
                    )}
                  </div>
                </div>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-600">
                  {step.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                {testResult[step.service] && (
                  <p className="mt-2 text-xs text-slate-600">{testResult[step.service]}</p>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <p className="text-xs text-slate-400">
        Scroll down to <strong>Connections</strong> to paste keys. Platform operator can also set default keys for
        all workspaces — yours override those when saved.
      </p>
    </section>
  );
}
