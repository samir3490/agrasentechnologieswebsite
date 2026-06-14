"use client";

import { armApi } from "@/lib/arm/paths";
import { useCallback, useEffect, useState } from "react";
import type { MaskedWorkspaceIntegrations } from "@/lib/arm/integrations/types";

type FormState = {
  openaiApiKey: string;
  openaiModel: string;
  mapboxAccessToken: string;
  newsApiKey: string;
  emailProvider: "resend" | "smtp";
  resendApiKey: string;
  emailFrom: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  googleOAuthClientId: string;
  googleOAuthClientSecret: string;
};

const emptyForm = (): FormState => ({
  openaiApiKey: "",
  openaiModel: "",
  mapboxAccessToken: "",
  newsApiKey: "",
  emailProvider: "resend",
  resendApiKey: "",
  emailFrom: "",
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  googleOAuthClientId: "",
  googleOAuthClientSecret: "",
});

function SourceBadge({ source }: { source: string }) {
  const label =
    source === "workspace" ? "Your keys" : source === "platform" ? "Platform default" : "Not configured";
  const cls =
    source === "workspace"
      ? "bg-emerald-100 text-emerald-800"
      : source === "platform"
        ? "bg-sky-100 text-sky-800"
        : "bg-slate-100 text-slate-600";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

export function WorkspaceIntegrationsPanel({
  accountId,
  getIdToken,
  isAdmin,
}: {
  accountId: string;
  getIdToken: () => Promise<string | null>;
  isAdmin: boolean;
}) {
  const [masked, setMasked] = useState<MaskedWorkspaceIntegrations | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/integrations`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = (await res.json()) as MaskedWorkspaceIntegrations;
        setMasked(data);
        setForm((f) => ({
          ...f,
          openaiModel: data.openai.model || "",
          emailProvider: data.email.provider || "resend",
          emailFrom: data.email.emailFrom || "",
          smtpHost: data.email.smtpHost || "",
          googleOAuthClientId: data.googleCalendar.clientId || "",
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [accountId, getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    setMessage("");
    try {
      const token = await getIdToken();
      const body: Record<string, unknown> = {
        openaiModel: form.openaiModel || undefined,
        emailProvider: form.emailProvider,
        emailFrom: form.emailFrom || undefined,
        smtpHost: form.smtpHost || undefined,
        smtpPort: form.smtpPort ? Number(form.smtpPort) : undefined,
        googleOAuthClientId: form.googleOAuthClientId || undefined,
      };
      if (form.openaiApiKey) body.openaiApiKey = form.openaiApiKey;
      if (form.mapboxAccessToken) body.mapboxAccessToken = form.mapboxAccessToken;
      if (form.newsApiKey) body.newsApiKey = form.newsApiKey;
      if (form.resendApiKey) body.resendApiKey = form.resendApiKey;
      if (form.smtpUser) body.smtpUser = form.smtpUser;
      if (form.smtpPass) body.smtpPass = form.smtpPass;
      if (form.googleOAuthClientSecret) body.googleOAuthClientSecret = form.googleOAuthClientSecret;

      const res = await fetch(armApi(`/accounts/${accountId}/integrations`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMasked(data);
      setForm((f) => ({
        ...emptyForm(),
        openaiModel: data.openai.model || "",
        emailProvider: data.email.provider || "resend",
        emailFrom: data.email.emailFrom || "",
        smtpHost: data.email.smtpHost || "",
        googleOAuthClientId: data.googleCalendar.clientId || "",
      }));
      setMessage("Connections saved for this workspace.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save connections.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading connections...</p>;

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Connections (bring your own keys)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Connect your own OpenAI, Mapbox, email, news, and Google OAuth apps for this workspace. Workspace keys
          override platform defaults — so anyone can run ARM with their own services.
        </p>
      </div>

      {!masked?.encryptionReady && isAdmin && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          The platform operator must set <code className="text-xs">INTEGRATIONS_ENCRYPTION_KEY</code> before
          workspace secrets can be saved.
        </p>
      )}

      {!isAdmin && (
        <p className="text-sm text-slate-500">Only workspace owners/admins can edit connections.</p>
      )}

      <form onSubmit={save} className="space-y-6">
        <IntegrationBlock title="OpenAI" badge={<SourceBadge source={masked?.openai.source || "none"} />}>
          <Field
            label="API key"
            type="password"
            placeholder={masked?.openai.apiKeyMask || "sk-..."}
            value={form.openaiApiKey}
            onChange={(v) => setForm({ ...form, openaiApiKey: v })}
            disabled={!isAdmin}
          />
          <Field
            label="Model"
            value={form.openaiModel}
            onChange={(v) => setForm({ ...form, openaiModel: v })}
            placeholder="gpt-4o-mini"
            disabled={!isAdmin}
          />
        </IntegrationBlock>

        <IntegrationBlock title="Mapbox" badge={<SourceBadge source={masked?.mapbox.source || "none"} />}>
          <Field
            label="Access token"
            type="password"
            placeholder={masked?.mapbox.tokenMask || "pk...."}
            value={form.mapboxAccessToken}
            onChange={(v) => setForm({ ...form, mapboxAccessToken: v })}
            disabled={!isAdmin}
          />
        </IntegrationBlock>

        <IntegrationBlock title="News API" badge={<SourceBadge source={masked?.news.source || "none"} />}>
          <Field
            label="NewsAPI.org key (optional — Google News RSS works without)"
            type="password"
            placeholder={masked?.news.apiKeyMask || "Optional"}
            value={form.newsApiKey}
            onChange={(v) => setForm({ ...form, newsApiKey: v })}
            disabled={!isAdmin}
          />
        </IntegrationBlock>

        <IntegrationBlock title="Email" badge={<SourceBadge source={masked?.email.source || "none"} />}>
          <select
            className="input-field mb-3"
            value={form.emailProvider}
            onChange={(e) => setForm({ ...form, emailProvider: e.target.value as "resend" | "smtp" })}
            disabled={!isAdmin}
          >
            <option value="resend">Resend</option>
            <option value="smtp">SMTP</option>
          </select>
          <Field
            label="From address"
            value={form.emailFrom}
            onChange={(v) => setForm({ ...form, emailFrom: v })}
            disabled={!isAdmin}
          />
          {form.emailProvider === "resend" ? (
            <Field
              label="Resend API key"
              type="password"
              placeholder={masked?.email.resendKeyMask || "re_..."}
              value={form.resendApiKey}
              onChange={(v) => setForm({ ...form, resendApiKey: v })}
              disabled={!isAdmin}
            />
          ) : (
            <>
              <Field label="SMTP host" value={form.smtpHost} onChange={(v) => setForm({ ...form, smtpHost: v })} disabled={!isAdmin} />
              <Field label="SMTP port" value={form.smtpPort} onChange={(v) => setForm({ ...form, smtpPort: v })} disabled={!isAdmin} />
              <Field label="SMTP user" value={form.smtpUser} onChange={(v) => setForm({ ...form, smtpUser: v })} disabled={!isAdmin} />
              <Field
                label="SMTP password"
                type="password"
                placeholder={masked?.email.smtpUserMask ? "****" : ""}
                value={form.smtpPass}
                onChange={(v) => setForm({ ...form, smtpPass: v })}
                disabled={!isAdmin}
              />
            </>
          )}
        </IntegrationBlock>

        <IntegrationBlock
          title="Google Calendar OAuth app"
          badge={<SourceBadge source={masked?.googleCalendar.source || "none"} />}
        >
          <p className="mb-3 text-xs text-slate-500">
            Create a Google Cloud OAuth client and add redirect URI:{" "}
            <code className="break-all">{window.location.origin}/api/arm/integrations/google-calendar/callback</code>
          </p>
          <Field
            label="Client ID"
            value={form.googleOAuthClientId}
            onChange={(v) => setForm({ ...form, googleOAuthClientId: v })}
            disabled={!isAdmin}
          />
          <Field
            label="Client secret"
            type="password"
            placeholder={masked?.googleCalendar.clientSecretMask || ""}
            value={form.googleOAuthClientSecret}
            onChange={(v) => setForm({ ...form, googleOAuthClientSecret: v })}
            disabled={!isAdmin}
          />
        </IntegrationBlock>

        {isAdmin && (
          <button type="submit" disabled={saving || !masked?.encryptionReady} className="btn-primary">
            {saving ? "Saving..." : "Save workspace connections"}
          </button>
        )}
        {message && <p className="text-sm text-indigo-600">{message}</p>}
      </form>
    </section>
  );
}

function IntegrationBlock({
  title,
  badge,
  children,
}: {
  title: string;
  badge: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="font-medium text-slate-900">{title}</h3>
        {badge}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
