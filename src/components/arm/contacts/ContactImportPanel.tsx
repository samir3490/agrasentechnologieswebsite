"use client";

import { useState } from "react";
import { armApi } from "@/lib/arm/paths";
import { useAuth } from "@/components/arm/auth/AuthProvider";
import { CSV_TEMPLATE } from "@/lib/arm/contacts/csv-import";

export function ContactImportPanel({
  open,
  onClose,
  onImported,
}: {
  open: boolean;
  onClose: () => void;
  onImported: () => Promise<void> | void;
}) {
  const { currentAccount, getIdToken } = useAuth();
  const [csv, setCsv] = useState("");
  const [geocode, setGeocode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    setCsv(text);
  }

  async function handleImport() {
    if (!currentAccount || !csv.trim()) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${currentAccount.id}/contacts/import`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csv, geocode }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : Array.isArray(data.details)
              ? data.details.join("; ")
              : "Import failed"
        );
      }
      const parts = [`Imported ${data.created} contact${data.created === 1 ? "" : "s"}.`];
      if (data.skippedForLimit) {
        parts.push(`${data.skippedForLimit} skipped because of plan limit.`);
      }
      if (data.errors?.length) {
        parts.push(`${data.errors.length} row warning(s).`);
      }
      setMessage(parts.join(" "));
      setCsv("");
      await onImported();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "arm-contacts-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900">Import contacts from CSV</h2>
          <p className="mt-1 text-sm text-slate-500">
            Columns: firstName (required), lastName, birthday, anniversary, city, company,
            relationshipTypes, notes, tags. Up to 200 rows per import.
          </p>
        </div>
        <button type="button" className="text-sm text-slate-500 hover:text-slate-800" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-secondary py-2 text-sm" onClick={downloadTemplate}>
          Download template
        </button>
        <label className="btn-secondary cursor-pointer py-2 text-sm">
          Choose file
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      <textarea
        className="input-field min-h-[140px] font-mono text-xs"
        placeholder="Paste CSV here or choose a file..."
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={geocode} onChange={(e) => setGeocode(e.target.checked)} />
        Geocode cities during import (slower; needs Mapbox)
      </label>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={loading || !csv.trim()}
        onClick={handleImport}
        className="btn-primary py-2"
      >
        {loading ? "Importing..." : "Import contacts"}
      </button>
    </div>
  );
}
