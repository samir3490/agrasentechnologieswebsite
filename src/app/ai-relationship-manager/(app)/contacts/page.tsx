"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { ContactForm } from "@/components/arm/contacts/ContactForm";
import { HealthBadge } from "@/components/arm/contacts/HealthBadge";
import { RELATIONSHIP_TYPES } from "@/lib/arm/constants/plans";
import type { Contact } from "@/lib/arm/types";

function ContactsContent() {
  const { currentAccount, getIdToken } = useAuth();
  const searchParams = useSearchParams();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get("new") === "1");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState(searchParams.get("relationshipType") || "");

  const loadContacts = useCallback(async () => {
    if (!currentAccount) return;
    setLoading(true);
    const token = await getIdToken();
    const params = new URLSearchParams();
    if (filterType) params.set("relationshipType", filterType);
    if (search) params.set("q", search);
    const res = await fetch(armApi(`/accounts/${currentAccount.id}/contacts?${params}`), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setContacts(data.contacts || []);
    }
    setLoading(false);
  }, [currentAccount, getIdToken, filterType, search]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  async function handleCreate(data: Record<string, unknown>) {
    const token = await getIdToken();
    const res = await fetch(armApi(`/accounts/${currentAccount!.id}/contacts`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(typeof result.error === "string" ? result.error : "Failed to save");
    setShowForm(false);
    await loadContacts();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500">{contacts.length} people in your network</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          Add contact
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name or company..."
          className="input-field max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field max-w-[160px]"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All types</option>
          {RELATIONSHIP_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 font-semibold">New contact</h2>
          <ContactForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading contacts...</p>
      ) : contacts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-slate-500">No contacts match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <Link
              key={c.id}
              href={`${armPath("/contacts")}/${c.id}`}
              className="glass-card rounded-2xl p-5 hover-lift block"
            >
              <p className="font-semibold text-slate-900">
                {c.firstName} {c.lastName}
              </p>
              {c.nickname && <p className="text-sm text-slate-400">&ldquo;{c.nickname}&rdquo;</p>}
              {c.work?.company && (
                <p className="mt-1 text-sm text-slate-600">{c.work.company}</p>
              )}
              {c.location?.city && (
                <p className="mt-1 text-xs text-slate-400">
                  {[c.location.city, c.location.state].filter(Boolean).join(", ")}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1 items-center">
                {(c.relationshipTypes || []).slice(0, 3).map((t) => (
                  <span key={t} className="badge badge-muted">
                    {t}
                  </span>
                ))}
                {c.healthLabel && <HealthBadge label={c.healthLabel} compact />}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading...</p>}>
      <ContactsContent />
    </Suspense>
  );
}
