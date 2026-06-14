"use client";

import { armApi } from "@/lib/arm/paths";
import { useCallback, useEffect, useState } from "react";

type AuditLog = {
  id: string;
  action: string;
  summary: string;
  actorEmail?: string;
  createdAt: string;
};

export function CompliancePanel({
  accountId,
  getIdToken,
  isAdmin,
}: {
  accountId: string;
  getIdToken: () => Promise<string | null>;
  isAdmin: boolean;
}) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/audit-logs`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } finally {
      setLoading(false);
    }
  }, [accountId, getIdToken, isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  async function downloadExport() {
    if (!isAdmin) return;
    setExporting(true);
    setMessage("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/export`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error || "Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `arm-export-${accountId.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Export downloaded.");
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  if (!isAdmin) {
    return (
      <section className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold">Compliance</h2>
        <p className="mt-2 text-sm text-slate-500">Only workspace admins can view audit logs and export data.</p>
      </section>
    );
  }

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Compliance & data</h2>
        <p className="mt-1 text-sm text-slate-500">
          GDPR-style export of all workspace data (contacts, interactions, settings). Secrets are never included.
        </p>
      </div>

      <button type="button" onClick={downloadExport} disabled={exporting} className="btn-primary text-sm">
        {exporting ? "Preparing export..." : "Download workspace export (JSON)"}
      </button>

      <div>
        <h3 className="text-sm font-medium text-slate-700">Audit log</h3>
        {loading ? (
          <p className="mt-2 text-sm text-slate-500">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No activity logged yet.</p>
        ) : (
          <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto text-sm">
            {logs.map((log) => (
              <li key={log.id} className="rounded-lg border border-slate-100 px-3 py-2">
                <p className="text-slate-800">{log.summary}</p>
                <p className="text-xs text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                  {log.actorEmail ? ` · ${log.actorEmail}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {message && <p className="text-sm text-indigo-600">{message}</p>}
    </section>
  );
}
