"use client";

import { armPath } from "@/lib/arm/paths";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { SITE } from "@/lib/arm/site";

const TOKEN_KEY = "arm_operator_token";

type Overview = {
  generatedAt: string;
  totals: {
    users: number;
    workspaces: number;
    contacts: number;
    freeWorkspaces: number;
    paidWorkspaces: number;
  };
  plans: Record<string, number>;
  signups: {
    usersLast7Days: number;
    usersLast30Days: number;
    workspacesLast7Days: number;
    workspacesLast30Days: number;
  };
  workspaces: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    ownerId: string;
    contactLimit: number;
    contactCount: number;
    memberCount: number;
    createdAt: string;
    createdBy: string;
  }[];
  users: {
    id: string;
    email: string;
    displayName?: string;
    createdAt: string;
  }[];
  recentActivity: {
    id: string;
    accountId: string;
    accountName?: string;
    action: string;
    actorEmail?: string;
    summary: string;
    createdAt: string;
  }[];
};

type AccountDetail = {
  id: string;
  name: string;
  plan: string;
  contactCount: number;
  contactLimit: number;
  memberCount: number;
  createdAt: string;
  settings: Record<string, unknown>;
  members: { userId: string; role?: string; email?: string; joinedAt?: string }[];
  contacts: {
    id: string;
    firstName?: string;
    lastName?: string;
    healthLabel?: string;
    createdAt?: string;
    lastInteractionAt?: string;
    city?: string;
    company?: string;
  }[];
  auditLogs: { id: string; action?: string; summary?: string; createdAt?: string; actorEmail?: string }[];
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function planBadge(plan: string) {
  const styles: Record<string, string> = {
    free: "bg-slate-100 text-slate-700",
    pro: "bg-indigo-100 text-indigo-800",
    business: "bg-violet-100 text-violet-800",
    enterprise: "bg-amber-100 text-amber-800",
  };
  return styles[plan] || styles.free;
}

export default function OperatorPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"workspaces" | "users" | "activity">("workspaces");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AccountDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, []);

  const loadOverview = useCallback(async (authToken: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/arm/operator/overview", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setError("Session expired. Sign in again.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load overview");
      }
      setOverview(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadOverview(token);
  }, [token, loadOverview]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/arm/operator/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.success) {
        setAuthError("Invalid password");
        return;
      }
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword("");
    } catch {
      setAuthError("Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setOverview(null);
    setSelectedId(null);
    setDetail(null);
  }

  async function openWorkspace(id: string) {
    if (!token) return;
    setSelectedId(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/arm/operator/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not load workspace");
      setDetail(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load workspace");
    } finally {
      setDetailLoading(false);
    }
  }

  const filteredWorkspaces = useMemo(() => {
    if (!overview) return [];
    const q = query.trim().toLowerCase();
    if (!q) return overview.workspaces;
    return overview.workspaces.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.slug.toLowerCase().includes(q) ||
        w.plan.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q)
    );
  }, [overview, query]);

  const filteredUsers = useMemo(() => {
    if (!overview) return [];
    const q = query.trim().toLowerCase();
    if (!q) return overview.users;
    return overview.users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.displayName || "").toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }, [overview, query]);

  if (!token) {
    return (
      <div className="mesh-bg flex min-h-screen items-center justify-center px-4">
        <div className="glass-card w-full max-w-md rounded-2xl p-8">
          <p className="text-sm font-medium text-indigo-600">{SITE.product}</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Operator panel</h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor free users, workspaces, and product activity. Use the same admin password as the
            site blog admin (or <code className="text-xs">ARM_OPERATOR_PASSWORD</code>).
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {authError}
              </p>
            )}
            <input
              type="password"
              required
              placeholder="Operator password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={authLoading} className="btn-primary w-full py-3">
              {authLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            <Link href={armPath()} className="text-indigo-600 hover:underline">
              ← Back to ARM
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">Operator</p>
            <h1 className="text-xl font-bold text-slate-900">{SITE.product} usage</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => token && loadOverview(token)}
              className="btn-secondary py-2 text-sm"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button type="button" onClick={logout} className="btn-secondary py-2 text-sm">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {overview && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Stat label="Users" value={overview.totals.users} />
              <Stat label="Workspaces" value={overview.totals.workspaces} />
              <Stat label="Contacts" value={overview.totals.contacts} />
              <Stat label="Free plans" value={overview.totals.freeWorkspaces} />
              <Stat label="Paid plans" value={overview.totals.paidWorkspaces} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="New users (7d)" value={overview.signups.usersLast7Days} subtle />
              <Stat label="New users (30d)" value={overview.signups.usersLast30Days} subtle />
              <Stat label="New workspaces (7d)" value={overview.signups.workspacesLast7Days} subtle />
              <Stat
                label="New workspaces (30d)"
                value={overview.signups.workspacesLast30Days}
                subtle
              />
            </div>

            <div className="glass-card rounded-2xl p-4">
              <p className="text-sm font-medium text-slate-700">Plans</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(overview.plans).map(([plan, count]) => (
                  <span
                    key={plan}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${planBadge(plan)}`}
                  >
                    {plan}: {count}
                  </span>
                ))}
                {Object.keys(overview.plans).length === 0 && (
                  <span className="text-sm text-slate-500">No workspaces yet</span>
                )}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Updated {formatDate(overview.generatedAt)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {(["workspaces", "users", "activity"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                    tab === t
                      ? "bg-indigo-600 text-white"
                      : "bg-white/80 text-slate-600 hover:bg-white"
                  }`}
                >
                  {t}
                </button>
              ))}
              {(tab === "workspaces" || tab === "users") && (
                <input
                  type="search"
                  placeholder={tab === "workspaces" ? "Search workspaces..." : "Search users..."}
                  className="input-field max-w-xs"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              )}
            </div>

            {tab === "workspaces" && (
              <div className="glass-card overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Workspace</th>
                        <th className="px-4 py-3">Plan</th>
                        <th className="px-4 py-3">Contacts</th>
                        <th className="px-4 py-3">Members</th>
                        <th className="px-4 py-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorkspaces.map((w) => (
                        <tr
                          key={w.id}
                          className="cursor-pointer border-b border-slate-100 hover:bg-indigo-50/40"
                          onClick={() => openWorkspace(w.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{w.name}</div>
                            <div className="text-xs text-slate-400">{w.slug || w.id}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${planBadge(w.plan)}`}
                            >
                              {w.plan}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {w.contactCount}
                            <span className="text-slate-400"> / {w.contactLimit}</span>
                          </td>
                          <td className="px-4 py-3">{w.memberCount}</td>
                          <td className="px-4 py-3 text-slate-500">{formatDate(w.createdAt)}</td>
                        </tr>
                      ))}
                      {filteredWorkspaces.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                            No workspaces found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "users" && (
              <div className="glass-card overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-slate-100">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">
                              {u.displayName || u.email || "Unknown"}
                            </div>
                            <div className="text-xs text-slate-400">{u.email}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "activity" && (
              <div className="glass-card space-y-3 rounded-2xl p-4">
                {overview.recentActivity.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-500">
                    No audit activity yet. Actions like adding contacts will show here.
                  </p>
                ) : (
                  overview.recentActivity.map((a) => (
                    <button
                      key={`${a.accountId}-${a.id}`}
                      type="button"
                      onClick={() => openWorkspace(a.accountId)}
                      className="block w-full rounded-xl border border-slate-100 bg-white/70 px-4 py-3 text-left hover:border-indigo-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-900">{a.summary}</span>
                        <span className="text-xs text-slate-400">{formatDate(a.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {a.accountName || a.accountId}
                        {a.actorEmail ? ` · ${a.actorEmail}` : ""}
                        {a.action ? ` · ${a.action}` : ""}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {loading && !overview && (
          <p className="text-center text-sm text-slate-500">Loading usage data...</p>
        )}
      </main>

      {(selectedId || detailLoading) && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0"
            onClick={() => {
              setSelectedId(null);
              setDetail(null);
            }}
          />
          <aside className="relative z-10 h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <h2 className="font-semibold text-slate-900">Workspace detail</h2>
              <button
                type="button"
                className="text-sm text-slate-500 hover:text-slate-800"
                onClick={() => {
                  setSelectedId(null);
                  setDetail(null);
                }}
              >
                Close
              </button>
            </div>
            <div className="space-y-6 p-5">
              {detailLoading && <p className="text-sm text-slate-500">Loading...</p>}
              {detail && (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{detail.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${planBadge(detail.plan)}`}
                      >
                        {detail.plan}
                      </span>
                      <span className="text-xs text-slate-500">
                        {detail.contactCount}/{detail.contactLimit} contacts · {detail.memberCount}{" "}
                        members
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      Created {formatDate(detail.createdAt)}
                    </p>
                  </div>

                  <section>
                    <h4 className="text-sm font-semibold text-slate-800">Members</h4>
                    <ul className="mt-2 space-y-2">
                      {detail.members.map((m) => (
                        <li key={m.userId} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                          <span className="font-medium">{m.email || m.userId}</span>
                          <span className="ml-2 text-xs capitalize text-slate-500">{m.role}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Contacts (sample up to 100)
                    </h4>
                    <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto">
                      {detail.contacts.map((c) => (
                        <li key={c.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                          <div className="font-medium">
                            {[c.firstName, c.lastName].filter(Boolean).join(" ") || c.id}
                          </div>
                          <div className="text-xs text-slate-500">
                            {[c.company, c.city, c.healthLabel].filter(Boolean).join(" · ") || "—"}
                          </div>
                        </li>
                      ))}
                      {detail.contacts.length === 0 && (
                        <li className="text-sm text-slate-500">No contacts yet</li>
                      )}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-sm font-semibold text-slate-800">Recent audit log</h4>
                    <ul className="mt-2 space-y-2">
                      {detail.auditLogs.map((a) => (
                        <li key={a.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                          <div>{a.summary || a.action}</div>
                          <div className="text-xs text-slate-400">
                            {formatDate(a.createdAt)}
                            {a.actorEmail ? ` · ${a.actorEmail}` : ""}
                          </div>
                        </li>
                      ))}
                      {detail.auditLogs.length === 0 && (
                        <li className="text-sm text-slate-500">No audit entries</li>
                      )}
                    </ul>
                  </section>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  subtle,
}: {
  label: string;
  value: number;
  subtle?: boolean;
}) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${subtle ? "bg-white/50" : ""}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
