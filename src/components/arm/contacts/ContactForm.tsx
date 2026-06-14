"use client";

import { useState } from "react";
import { RELATIONSHIP_TYPES } from "@/lib/arm/constants/plans";
import type { Contact, RelationshipType } from "@/lib/arm/types";

interface ContactFormProps {
  initial?: Partial<Contact>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

export function ContactForm({ initial, onSubmit, onCancel }: ContactFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [nickname, setNickname] = useState(initial?.nickname ?? "");
  const [birthday, setBirthday] = useState(initial?.birthday ?? "");
  const [anniversary, setAnniversary] = useState(initial?.anniversary ?? "");
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>(
    initial?.relationshipTypes ?? []
  );
  const [city, setCity] = useState(initial?.location?.city ?? "");
  const [state, setState] = useState(initial?.location?.state ?? "");
  const [country, setCountry] = useState(initial?.location?.country ?? "India");
  const [company, setCompany] = useState(initial?.work?.company ?? "");
  const [designation, setDesignation] = useState(initial?.work?.designation ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [hobbies, setHobbies] = useState(initial?.interests?.hobbies?.join(", ") ?? "");
  const [budgetMin, setBudgetMin] = useState(initial?.gifting?.budgetMin?.toString() ?? "");
  const [budgetMax, setBudgetMax] = useState(initial?.gifting?.budgetMax?.toString() ?? "");

  function toggleType(type: RelationshipType) {
    setRelationshipTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({
        firstName,
        lastName: lastName || undefined,
        nickname: nickname || undefined,
        birthday: birthday || undefined,
        anniversary: anniversary || undefined,
        relationshipTypes,
        tags: [],
        location: city || state || country ? { city, state, country } : undefined,
        work: company || designation ? { company, designation } : undefined,
        interests: hobbies ? { hobbies: hobbies.split(",").map((h) => h.trim()).filter(Boolean) } : undefined,
        gifting:
          budgetMin || budgetMax
            ? {
                budgetMin: budgetMin ? Number(budgetMin) : undefined,
                budgetMax: budgetMax ? Number(budgetMax) : undefined,
              }
            : undefined,
        notes: notes || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name *" value={firstName} onChange={setFirstName} required />
        <Field label="Last name" value={lastName} onChange={setLastName} />
        <Field label="Nickname" value={nickname} onChange={setNickname} />
        <Field label="Birthday" value={birthday} onChange={setBirthday} placeholder="MM-DD or YYYY-MM-DD" />
        <Field label="Anniversary" value={anniversary} onChange={setAnniversary} placeholder="MM-DD" />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Relationship types</p>
        <div className="flex flex-wrap gap-2">
          {RELATIONSHIP_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                relationshipTypes.includes(t)
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" value={city} onChange={setCity} />
        <Field label="State" value={state} onChange={setState} />
        <Field label="Country" value={country} onChange={setCountry} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" value={company} onChange={setCompany} />
        <Field label="Designation" value={designation} onChange={setDesignation} />
      </div>

      <Field label="Hobbies (comma-separated)" value={hobbies} onChange={setHobbies} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Gift budget min (₹)" value={budgetMin} onChange={setBudgetMin} type="number" />
        <Field label="Gift budget max (₹)" value={budgetMax} onChange={setBudgetMax} type="number" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          className="input-field min-h-[80px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : initial ? "Update contact" : "Save contact"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
