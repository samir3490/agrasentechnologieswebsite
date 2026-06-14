"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { DEFAULT_REMINDER_INTERVALS } from "@/lib/arm/constants/plans";
import { WorkspaceIntegrationsPanel } from "@/components/arm/settings/WorkspaceIntegrationsPanel";
import { BillingPanel } from "@/components/arm/settings/BillingPanel";
import { ConnectionSetupGuide } from "@/components/arm/settings/ConnectionSetupGuide";
import { TeamPanel } from "@/components/arm/settings/TeamPanel";
import { CompliancePanel } from "@/components/arm/settings/CompliancePanel";

interface AccountSettingsForm {
  notificationEmail: string;
  emailRemindersEnabled: boolean;
  dailyDigestEnabled: boolean;
  digestHour: number;
  reminderIntervals: string;
}

export default function SettingsPage() {
  const { user, currentAccount, getIdToken, accounts } = useAuth();
  const isAdmin = accounts.find((a) => a.id === currentAccount?.id)?.role === "owner" ||
    accounts.find((a) => a.id === currentAccount?.id)?.role === "admin";
  const [form, setForm] = useState<AccountSettingsForm>({
    notificationEmail: user?.email ?? "",
    emailRemindersEnabled: true,
    dailyDigestEnabled: true,
    digestHour: 8,
    reminderIntervals: DEFAULT_REMINDER_INTERVALS.join(", "),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${currentAccount.id}/settings`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const s = data.settings ?? {};
        setForm({
          notificationEmail: s.notificationEmail ?? user?.email ?? "",
          emailRemindersEnabled: s.emailRemindersEnabled !== false,
          dailyDigestEnabled: s.dailyDigestEnabled !== false,
          digestHour: s.digestHour ?? 8,
          reminderIntervals: (s.reminderIntervals ?? DEFAULT_REMINDER_INTERVALS).join(", "),
        });
      }
      setLoading(false);
    })();
  }, [currentAccount, getIdToken, user?.email]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentAccount) return;
    setSaving(true);
    setMessage("");
    try {
      const intervals = form.reminderIntervals
        .split(",")
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => Number.isFinite(n) && n >= 0);

      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${currentAccount.id}/settings`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationEmail: form.notificationEmail || undefined,
          emailRemindersEnabled: form.emailRemindersEnabled,
          dailyDigestEnabled: form.dailyDigestEnabled,
          digestHour: form.digestHour,
          reminderIntervals: intervals.length ? intervals : [...DEFAULT_REMINDER_INTERVALS],
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("Settings saved. Reminder intervals apply to new contact updates.");
    } catch {
      setMessage("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <section className="glass-card rounded-2xl p-6 space-y-3">
        <h2 className="font-semibold">Account</h2>
        <p className="text-sm text-slate-600">
          <span className="text-slate-400">Signed in as:</span> {user?.email}
        </p>
        <p className="text-sm text-slate-600">
          <span className="text-slate-400">Workspace:</span> {currentAccount?.name}
        </p>
        <p className="text-sm text-slate-600">
          <span className="text-slate-400">Plan:</span>{" "}
          <span className="badge badge-primary capitalize">{currentAccount?.plan ?? "free"}</span>
        </p>
      </section>

      {currentAccount && (
        <ConnectionSetupGuide
          accountId={currentAccount.id}
          getIdToken={getIdToken}
          isAdmin={Boolean(isAdmin)}
        />
      )}

      <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Notifications</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <>
            <Field
              label="Notification email"
              type="email"
              value={form.notificationEmail}
              onChange={(v) => setForm({ ...form, notificationEmail: v })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.emailRemindersEnabled}
                onChange={(e) => setForm({ ...form, emailRemindersEnabled: e.target.checked })}
              />
              Email birthday &amp; anniversary reminders
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.dailyDigestEnabled}
                onChange={(e) => setForm({ ...form, dailyDigestEnabled: e.target.checked })}
              />
              Daily digest email (8 AM IST cron)
            </label>
            <Field
              label="Reminder days before (comma-separated)"
              value={form.reminderIntervals}
              onChange={(v) => setForm({ ...form, reminderIntervals: v })}
              hint="Default: 30, 15, 10, 7, 3, 1"
            />
            {message && <p className="text-sm text-indigo-600">{message}</p>}
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save notifications"}
            </button>
            <SyncRemindersButton accountId={currentAccount?.id} getIdToken={getIdToken} />
          </>
        )}
      </form>

      <Suspense fallback={<section className="glass-card rounded-2xl p-6 text-sm text-slate-500">Loading calendar settings...</section>}>
        <GoogleCalendarSection accountId={currentAccount?.id} getIdToken={getIdToken} />
      </Suspense>

      {currentAccount && (
        <>
          <WorkspaceIntegrationsPanel
            accountId={currentAccount.id}
            getIdToken={getIdToken}
            isAdmin={Boolean(isAdmin)}
          />
          <BillingPanel
            accountId={currentAccount.id}
            getIdToken={getIdToken}
            isAdmin={Boolean(isAdmin)}
          />
          <TeamPanel
            accountId={currentAccount.id}
            getIdToken={getIdToken}
            isAdmin={Boolean(isAdmin)}
          />
          <CompliancePanel
            accountId={currentAccount.id}
            getIdToken={getIdToken}
            isAdmin={Boolean(isAdmin)}
          />
        </>
      )}
    </div>
  );
}

const CALENDAR_MESSAGES: Record<string, string> = {
  connected: "Google Calendar connected. Birthdays and anniversaries are syncing.",
  denied: "Google Calendar connection was cancelled.",
  error: "Could not connect Google Calendar. Try again.",
  not_configured: "Google Calendar is not configured on the server yet.",
  no_refresh: "Could not get calendar access. Disconnect in Google Account settings and try again.",
  invalid: "Invalid calendar connection response.",
};

function GoogleCalendarSection({
  accountId,
  getIdToken,
}: {
  accountId?: string;
  getIdToken: () => Promise<string | null>;
}) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{
    configured: boolean;
    connected: boolean;
    connectedEmail: string | null;
    syncEnabled: boolean;
    lastSyncAt: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadStatus = useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(
        armApi(`/integrations/google-calendar/status?accountId=${encodeURIComponent(accountId)}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) setStatus(await res.json());
    } finally {
      setLoading(false);
    }
  }, [accountId, getIdToken]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    const result = searchParams.get("calendar");
    if (result && CALENDAR_MESSAGES[result]) {
      setMessage(CALENDAR_MESSAGES[result]!);
      if (result === "connected") loadStatus();
    }
  }, [searchParams, loadStatus]);

  async function connect() {
    if (!accountId) return;
    setBusy(true);
    setMessage("");
    try {
      const token = await getIdToken();
      const res = await fetch(
        armApi(`/integrations/google-calendar/auth-url?accountId=${encodeURIComponent(accountId)}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not start Google connect.");
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    setMessage("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi("/integrations/google-calendar/status"), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Disconnect failed");
      setMessage("Google Calendar disconnected.");
      await loadStatus();
    } catch {
      setMessage("Could not disconnect Google Calendar.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleSync(enabled: boolean) {
    if (!accountId) return;
    setBusy(true);
    setMessage("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/settings`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleCalendarSyncEnabled: enabled }),
      });
      if (!res.ok) throw new Error("Update failed");
      setMessage(enabled ? "Calendar sync enabled for this workspace." : "Calendar sync paused.");
      await loadStatus();
    } catch {
      setMessage("Could not update calendar sync.");
    } finally {
      setBusy(false);
    }
  }

  async function syncNow() {
    if (!accountId) return;
    setBusy(true);
    setMessage("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi("/integrations/google-calendar/sync"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`Synced ${data.synced} calendar events across ${data.contacts} contacts.`);
      await loadStatus();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Sync failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Google Calendar</h2>
        <p className="mt-1 text-sm text-slate-500">
          Export birthdays and anniversaries to your Google Calendar as yearly events.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : !status?.configured ? (
        <p className="text-sm text-amber-700">Add your Google OAuth app in Connections below, or ask the platform operator to set platform keys.</p>
      ) : (
        <>
          <p className="text-sm text-slate-600">
            {status.connected
              ? `Connected as ${status.connectedEmail ?? "Google account"}`
              : "Not connected"}
          </p>
          {status.connected && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={status.syncEnabled}
                disabled={busy}
                onChange={(e) => toggleSync(e.target.checked)}
              />
              Sync this workspace to Google Calendar
            </label>
          )}
          {status.lastSyncAt && (
            <p className="text-xs text-slate-400">
              Last sync: {new Date(status.lastSyncAt).toLocaleString()}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {!status.connected ? (
              <button type="button" onClick={connect} disabled={busy} className="btn-primary text-sm">
                {busy ? "Redirecting..." : "Connect Google Calendar"}
              </button>
            ) : (
              <>
                <button type="button" onClick={syncNow} disabled={busy || !status.syncEnabled} className="btn-secondary text-sm">
                  Sync now
                </button>
                <button type="button" onClick={disconnect} disabled={busy} className="btn-secondary text-sm">
                  Disconnect
                </button>
              </>
            )}
          </div>
        </>
      )}
      {message && <p className="text-sm text-indigo-600">{message}</p>}
    </section>
  );
}

function SyncRemindersButton({
  accountId,
  getIdToken,
}: {
  accountId?: string;
  getIdToken: () => Promise<string | null>;
}) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState("");

  async function syncAll() {
    if (!accountId) return;
    setSyncing(true);
    setResult("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/reminders/sync`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(`Synced reminders for ${data.synced} contacts.`);
    } catch {
      setResult("Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="pt-2 border-t border-slate-100">
      <button type="button" onClick={syncAll} disabled={syncing} className="btn-secondary text-sm">
        {syncing ? "Syncing..." : "Re-sync all contact reminders"}
      </button>
      {result && <p className="mt-2 text-xs text-slate-500">{result}</p>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
