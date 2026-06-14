import type { Firestore } from "firebase-admin/firestore";
import { createHash } from "crypto";
import type { Contact, NewsItem } from "@/lib/arm/types";
import { buildContactNewsQueries, fetchNewsForQuery, isNewsApiConfigured, type NewsQueryType } from "./fetch";

function urlDocId(url: string) {
  return createHash("sha256").update(url).digest("hex").slice(0, 32);
}

export async function getNewsForContact(db: Firestore, accountId: string, contactId: string, limit = 20) {
  const snap = await db
    .collection(`ripAccounts/${accountId}/newsItems`)
    .where("contactId", "==", contactId)
    .limit(50)
    .get();

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as NewsItem)
    .sort((a, b) => b.fetchedAt.localeCompare(a.fetchedAt))
    .slice(0, limit);
}

export async function fetchAndStoreContactNews(db: Firestore, accountId: string, contact: Contact) {
  const queries = buildContactNewsQueries(contact);
  if (queries.length === 0) {
    return { stored: 0, queries: [], source: isNewsApiConfigured() ? "newsapi" : "google-rss" as const };
  }

  const now = new Date().toISOString();
  const batch = db.batch();
  let stored = 0;
  const source = isNewsApiConfigured() ? ("newsapi" as const) : ("google-rss" as const);

  for (const { queryType, query } of queries) {
    const articles = await fetchNewsForQuery(query, 5);
    for (const article of articles) {
      const id = urlDocId(article.url);
      const ref = db.doc(`ripAccounts/${accountId}/newsItems/${id}`);
      batch.set(
        ref,
        {
          accountId,
          contactId: contact.id,
          queryType,
          query,
          title: article.title,
          description: article.description || null,
          url: article.url,
          source: article.source || null,
          publishedAt: article.publishedAt || null,
          imageUrl: article.imageUrl || null,
          fetchedAt: now,
        },
        { merge: true }
      );
      stored++;
    }
  }

  if (stored > 0) await batch.commit();

  return { stored, queries, source };
}

export type { NewsQueryType };
