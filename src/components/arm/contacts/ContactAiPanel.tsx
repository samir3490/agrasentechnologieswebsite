"use client";

import { armApi } from "@/lib/arm/paths";
import { useState } from "react";
import type { Contact, GiftSuggestion } from "@/lib/arm/types";
import type { MessageDraft, MessagePurpose } from "@/lib/arm/ai/messages";
import type { GiftOccasion } from "@/lib/arm/ai/gifts";

export function ContactAiPanel({
  accountId,
  contact,
  getIdToken,
}: {
  accountId: string;
  contact: Contact;
  getIdToken: () => Promise<string | null>;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GiftSuggestionsPanel accountId={accountId} contact={contact} getIdToken={getIdToken} />
      <MessageDraftPanel accountId={accountId} contact={contact} getIdToken={getIdToken} />
    </div>
  );
}

function GiftSuggestionsPanel({
  accountId,
  contact,
  getIdToken,
}: {
  accountId: string;
  contact: Contact;
  getIdToken: () => Promise<string | null>;
}) {
  const [occasion, setOccasion] = useState<GiftOccasion>(
    contact.birthday ? "birthday" : contact.anniversary ? "anniversary" : "general"
  );
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [source, setSource] = useState<string>("");

  async function generate() {
    setLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/contacts/${contact.id}/gifts/suggest`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ occasion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuggestions(data.suggestions || []);
      setSource(data.source);
    } catch {
      setSuggestions([]);
      setSource("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Gift ideas</h2>
        <p className="text-sm text-slate-500">AI suggestions with Amazon.in search links (no API required)</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          className="input-field max-w-[160px] py-1.5 text-sm"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value as GiftOccasion)}
        >
          <option value="general">General</option>
          <option value="birthday">Birthday</option>
          <option value="anniversary">Anniversary</option>
        </select>
        <button type="button" onClick={generate} disabled={loading} className="btn-primary text-sm py-1.5">
          {loading ? "Thinking..." : "Suggest gifts"}
        </button>
      </div>
      {source && source !== "error" && (
        <p className="text-xs text-slate-400">
          {source === "openai" ? "Powered by AI" : "Template suggestions (add OPENAI_API_KEY for AI)"}
        </p>
      )}
      <ul className="space-y-3">
        {suggestions.map((s) => (
          <li key={s.title + s.searchQuery} className="rounded-xl border border-slate-100 bg-white/60 p-3 text-sm">
            <p className="font-medium text-slate-900">{s.title}</p>
            <p className="text-slate-500">{s.reason}</p>
            {s.budgetHint && <p className="text-xs text-slate-400 mt-1">{s.budgetHint}</p>}
            <a
              href={s.amazonSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-indigo-600 hover:underline"
            >
              Search on Amazon.in →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MessageDraftPanel({
  accountId,
  contact,
  getIdToken,
}: {
  accountId: string;
  contact: Contact;
  getIdToken: () => Promise<string | null>;
}) {
  const [purpose, setPurpose] = useState<MessagePurpose>("check_in");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<MessageDraft | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setCopied(false);
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/contacts/${contact.id}/messages/draft`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ purpose }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDraft(data.draft);
    } catch {
      setDraft(null);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!draft) return;
    const text = draft.subject ? `${draft.subject}\n\n${draft.body}` : draft.body;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Message draft</h2>
        <p className="text-sm text-slate-500">WhatsApp, SMS, or email — copy and personalize</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          className="input-field max-w-[160px] py-1.5 text-sm"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value as MessagePurpose)}
        >
          <option value="check_in">Check in</option>
          <option value="birthday">Birthday</option>
          <option value="thank_you">Thank you</option>
          <option value="follow_up">Follow up</option>
        </select>
        <button type="button" onClick={generate} disabled={loading} className="btn-primary text-sm py-1.5">
          {loading ? "Drafting..." : "Draft message"}
        </button>
      </div>
      {draft && (
        <div className="rounded-xl border border-slate-100 bg-white/60 p-4 text-sm space-y-2">
          {draft.subject && (
            <p>
              <span className="text-xs uppercase text-slate-400">Subject</span>
              <br />
              {draft.subject}
            </p>
          )}
          <p className="whitespace-pre-wrap text-slate-700">{draft.body}</p>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={copy} className="btn-secondary text-xs py-1.5">
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
            <span className="text-xs text-slate-400 self-center capitalize">{draft.channel}</span>
          </div>
        </div>
      )}
    </section>
  );
}
