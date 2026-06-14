"use client";

import { armApi } from "@/lib/arm/paths";
import { useCallback, useEffect, useState } from "react";

type Member = {
  userId: string;
  email?: string;
  role: string;
  joinedAt?: string;
};

export function TeamPanel({
  accountId,
  getIdToken,
  isAdmin,
}: {
  accountId: string;
  getIdToken: () => Promise<string | null>;
  isAdmin: boolean;
}) {
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member" | "viewer">("member");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/members`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } finally {
      setLoading(false);
    }
  }, [accountId, getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin || !email.trim()) return;
    setBusy(true);
    setMessage("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/members`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmail("");
      setMessage(`Added ${data.email} to this workspace.`);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not add member.");
    } finally {
      setBusy(false);
    }
  }

  async function changeRole(userId: string, newRole: string) {
    setBusy(true);
    setMessage("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/members/${userId}`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not update role.");
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(userId: string) {
    if (!confirm("Remove this member from the workspace?")) return;
    setBusy(true);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/members/${userId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not remove member.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Team</h2>
        <p className="mt-1 text-sm text-slate-500">
          Invite colleagues to this workspace. They must sign up first, then you add them by email.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading team...</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
          {members.map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span>{m.email || m.userId}</span>
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <select
                    className="input-field py-1 text-xs"
                    value={m.role}
                    disabled={busy}
                    onChange={(e) => changeRole(m.userId, e.target.value)}
                  >
                    <option value="owner">owner</option>
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                    <option value="viewer">viewer</option>
                  </select>
                  {m.role !== "owner" && (
                    <button type="button" onClick={() => removeMember(m.userId)} className="text-xs text-red-600">
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <span className="badge badge-muted capitalize">{m.role}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAdmin && (
        <form onSubmit={addMember} className="flex flex-wrap gap-2">
          <input
            type="email"
            required
            placeholder="colleague@company.com"
            className="input-field min-w-[220px] flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select className="input-field max-w-[120px]" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" disabled={busy} className="btn-primary text-sm">
            Add member
          </button>
        </form>
      )}

      {message && <p className="text-sm text-indigo-600">{message}</p>}
    </section>
  );
}
