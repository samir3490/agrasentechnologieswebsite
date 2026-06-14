import type { ResolvedIntegrations } from "@/lib/arm/integrations/types";

export type NewsQueryType = "company" | "location";

export type RawNewsArticle = {
  title: string;
  description?: string;
  url: string;
  source?: string;
  publishedAt?: string;
  imageUrl?: string;
};

export function isNewsApiConfigured(integrations?: ResolvedIntegrations) {
  return Boolean(getNewsApiKey(integrations));
}

function getNewsApiKey(integrations?: ResolvedIntegrations) {
  return integrations?.news.apiKey?.trim() || process.env.NEWS_API_KEY?.trim();
}

export function buildContactNewsQueries(contact: {
  work?: { company?: string };
  location?: { city?: string; state?: string; country?: string };
}): { queryType: NewsQueryType; query: string }[] {
  const queries: { queryType: NewsQueryType; query: string }[] = [];

  const company = contact.work?.company?.trim();
  if (company && company.length >= 2) {
    queries.push({ queryType: "company", query: company });
  }

  const city = contact.location?.city?.trim();
  if (city && city.length >= 2) {
    const locationQuery = [city, contact.location?.state, contact.location?.country]
      .filter(Boolean)
      .join(", ");
    queries.push({ queryType: "location", query: locationQuery });
  }

  return queries;
}

export async function fetchNewsForQuery(
  query: string,
  limit = 5,
  integrations?: ResolvedIntegrations
): Promise<RawNewsArticle[]> {
  if (isNewsApiConfigured(integrations)) {
    const fromApi = await fetchFromNewsApi(query, limit, integrations);
    if (fromApi.length > 0) return fromApi;
  }
  return fetchFromGoogleNewsRss(query, limit);
}

async function fetchFromNewsApi(
  query: string,
  limit: number,
  integrations?: ResolvedIntegrations
): Promise<RawNewsArticle[]> {
  const key = getNewsApiKey(integrations)!;
  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", query);
  url.searchParams.set("pageSize", String(limit));
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("language", "en");
  url.searchParams.set("apiKey", key);

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    articles?: {
      title?: string;
      description?: string;
      url?: string;
      source?: { name?: string };
      publishedAt?: string;
      urlToImage?: string;
    }[];
  };

  return (data.articles || [])
    .filter((a) => a.title && a.url)
    .slice(0, limit)
    .map((a) => ({
      title: a.title!,
      description: a.description,
      url: a.url!,
      source: a.source?.name,
      publishedAt: a.publishedAt,
      imageUrl: a.urlToImage,
    }));
}

async function fetchFromGoogleNewsRss(query: string, limit: number): Promise<RawNewsArticle[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  const res = await fetch(url, {
    headers: { "User-Agent": "ARM-NewsBot/1.0" },
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];

  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

  return items.slice(0, limit).map(parseRssItem).filter((a): a is RawNewsArticle => Boolean(a?.title && a?.url));
}

function parseRssItem(itemXml: string): RawNewsArticle | null {
  const title = decodeXml(extractTag(itemXml, "title"));
  const link = extractTag(itemXml, "link")?.trim();
  const pubDate = extractTag(itemXml, "pubDate");
  const description = decodeXml(stripHtml(extractTag(itemXml, "description") || ""));
  const source = decodeXml(extractTag(itemXml, "source"));

  if (!title || !link) return null;

  return {
    title,
    description: description || undefined,
    url: link,
    source: source || undefined,
    publishedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
  };
}

function extractTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1]?.trim();
}

function decodeXml(text: string | undefined) {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function getNewsSourceLabel(integrations?: ResolvedIntegrations) {
  if (isNewsApiConfigured(integrations)) {
    return integrations?.news.source === "workspace" ? "newsapi-workspace" : "newsapi-platform";
  }
  return "google-rss";
}
