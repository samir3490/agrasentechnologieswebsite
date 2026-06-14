"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { DEFAULT_REMINDER_INTERVALS } from "@/lib/arm/constants/plans";

interface AccountSettingsForm {
  notificationEmail: string;
  emailRemindersEnabled: boolean;
  dailyDigestEnabled: boolean;
  digestHour: number;
  reminderIntervals: string;
}

export default function SettingsPage() {
  const { user, currentAccount, getIdToken } = useAuth();
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
    </div>
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
