"use client";

import { armApi } from "@/lib/arm/paths";
import { useCallback, useEffect, useState } from "react";
import type { Contact, NewsItem } from "@/lib/arm/types";

export function ContactNewsPanel({
  accountId,
  contact,
  getIdToken,
}: {
  accountId: string;
  contact: Contact;
  getIdToken: () => Promise<string | null>;
}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

  const hasQueries = Boolean(contact.work?.company?.trim() || contact.location?.city?.trim());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/contacts/${contact.id}/news`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load news");
      setItems(data.items || []);
      setSource(data.source || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load news");
    } finally {
      setLoading(false);
    }
  }, [accountId, contact.id, getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  async function refreshNews() {
    setFetching(true);
    setError("");
    try {
      const token = await getIdToken();
      const res = await fetch(armApi(`/accounts/${accountId}/contacts/${contact.id}/news/fetch`), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch news");
      setItems(data.items || []);
      setSource(data.source || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch news");
    } finally {
      setFetching(false);
    }
  }

  return (
    <section className="glass-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Company & location news</h2>
          <p className="mt-1 text-sm text-slate-500">
            Headlines about {contact.work?.company || "their company"} and{" "}
            {contact.location?.city || "their city"}
          </p>
        </div>
        <button
          type="button"
          onClick={refreshNews}
          disabled={!hasQueries || fetching}
          className="btn-secondary py-1.5 text-xs"
        >
          {fetching ? "Fetching…" : "Refresh news"}
        </button>
      </div>

      {!hasQueries && (
        <p className="mt-4 text-sm text-amber-700">
          Add a company or city on this contact to see relevant news.
        </p>
      )}

      {source && (
        <p className="mt-3 text-xs text-slate-400">
          Source: {source === "newsapi" ? "NewsAPI" : "Google News RSS"}
          {source === "google-rss" && " — set NEWS_API_KEY on Vercel for richer results"}
        </p>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Loading news…</p>
      ) : items.length === 0 && hasQueries ? (
        <p className="mt-4 text-sm text-slate-500">
          No news stored yet. Click Refresh news to fetch headlines.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-100 bg-white/60 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="badge badge-muted capitalize">{item.queryType}</span>
                {item.source && <span>{item.source}</span>}
                {item.publishedAt && (
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                )}
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block font-medium text-indigo-700 hover:underline"
              >
                {item.title}
              </a>
              {item.description && (
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
