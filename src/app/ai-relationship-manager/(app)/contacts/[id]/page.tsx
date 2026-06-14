"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { ContactForm } from "@/components/arm/contacts/ContactForm";
import { ContactAiPanel } from "@/components/arm/contacts/ContactAiPanel";
import { ContactNewsPanel } from "@/components/arm/contacts/ContactNewsPanel";
import { HealthBadge } from "@/components/arm/contacts/HealthBadge";
import type { Contact, Interaction } from "@/lib/arm/types";

export default function ContactDetailPage() {
  const params = useParams();
  const contactId = params.id as string;
  const { currentAccount, getIdToken } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [interactionNotes, setInteractionNotes] = useState("");
  const [interactionType, setInteractionType] = useState<Interaction["type"]>("call");

  const load = useCallback(async () => {
    if (!currentAccount) return;
    const token = await getIdToken();
    const [contactRes, intRes] = await Promise.all([
      fetch(armApi(`/accounts/${currentAccount.id}/contacts/${contactId}`), {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(armApi(`/accounts/${currentAccount.id}/contacts/${contactId}/interactions`), {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    if (contactRes.ok) setContact(await contactRes.json());
    if (intRes.ok) {
      const data = await intRes.json();
      setInteractions(data.interactions || []);
    }
    setLoading(false);
  }, [currentAccount, contactId, getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(data: Record<string, unknown>) {
    const token = await getIdToken();
    const res = await fetch(armApi(`/accounts/${currentAccount!.id}/contacts/${contactId}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update");
    setEditing(false);
    await load();
  }

  async function logInteraction(e: React.FormEvent) {
    e.preventDefault();
    const token = await getIdToken();
    const res = await fetch(
      armApi(`/accounts/${currentAccount!.id}/contacts/${contactId}/interactions`),
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: interactionType,
          date: new Date().toISOString(),
          notes: interactionNotes || undefined,
        }),
      }
    );
    if (res.ok) {
      setInteractionNotes("");
      await load();
    }
  }

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (!contact) return <p className="text-slate-500">Contact not found.</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      <Link href={armPath("/contacts")} className="text-sm text-indigo-600 hover:underline">
        ← Back to contacts
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {contact.firstName} {contact.lastName}
          </h1>
          {contact.work?.designation && contact.work?.company && (
            <p className="text-slate-600">
              {contact.work.designation} at {contact.work.company}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1">
            {(contact.relationshipTypes || []).map((t) => (
              <span key={t} className="badge badge-primary">
                {t}
              </span>
            ))}
            {contact.healthLabel && (
              <HealthBadge label={contact.healthLabel} score={contact.healthScore} />
            )}
          </div>
        </div>
        <button type="button" onClick={() => setEditing(!editing)} className="btn-secondary">
          {editing ? "Cancel edit" : "Edit"}
        </button>
      </div>

      {editing ? (
        <div className="glass-card rounded-2xl p-6">
          <ContactForm
            initial={contact}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="glass-card rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold">Profile</h2>
            <DetailRow label="Birthday" value={contact.birthday} />
            <DetailRow label="Anniversary" value={contact.anniversary} />
            <DetailRow
              label="Location"
              value={
                contact.location
                  ? [contact.location.city, contact.location.state, contact.location.country]
                      .filter(Boolean)
                      .join(", ")
                  : undefined
              }
            />
            <DetailRow label="Notes" value={contact.notes} />
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-3">
            <h2 className="font-semibold">Interests</h2>
            <DetailRow label="Hobbies" value={contact.interests?.hobbies?.join(", ")} />
            <DetailRow label="Sports" value={contact.interests?.sports?.join(", ")} />
            <DetailRow
              label="Budget"
              value={
                contact.gifting?.budgetMin || contact.gifting?.budgetMax
                  ? `₹${contact.gifting.budgetMin ?? "?"} – ₹${contact.gifting.budgetMax ?? "?"}`
                  : undefined
              }
            />
          </section>
        </div>
      )}

      {!editing && currentAccount && (
        <>
          <ContactNewsPanel
            accountId={currentAccount.id}
            contact={contact}
            getIdToken={getIdToken}
          />
          <ContactAiPanel
            accountId={currentAccount.id}
            contact={contact}
            getIdToken={getIdToken}
          />
        </>
      )}

      <section className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold">Log interaction</h2>
        <form onSubmit={logInteraction} className="mt-4 flex flex-wrap gap-3">
          <select
            className="input-field max-w-[140px]"
            value={interactionType}
            onChange={(e) => setInteractionType(e.target.value as Interaction["type"])}
          >
            <option value="call">Call</option>
            <option value="message">Message</option>
            <option value="meeting">Meeting</option>
            <option value="email">Email</option>
            <option value="event">Event</option>
          </select>
          <input
            type="text"
            placeholder="Notes (optional)"
            className="input-field flex-1 min-w-[200px]"
            value={interactionNotes}
            onChange={(e) => setInteractionNotes(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Log
          </button>
        </form>

        <ul className="mt-6 divide-y divide-slate-100">
          {interactions.length === 0 ? (
            <li className="py-3 text-sm text-slate-500">No interactions logged yet.</li>
          ) : (
            interactions.map((i) => (
              <li key={i.id} className="py-3 text-sm">
                <span className="badge badge-muted mr-2">{i.type}</span>
                {new Date(i.date).toLocaleDateString()}
                {i.notes && <span className="text-slate-500"> — {i.notes}</span>}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-slate-700">{value}</p>
    </div>
  );
}
