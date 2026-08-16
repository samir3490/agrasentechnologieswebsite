import { posts, type BlogPost } from "@/data/posts";
import { RSS_FEED_PATH, SITE, siteUrl } from "@/lib/seo";

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 pubDate (RFC 822). Dates are stored as YYYY-MM-DD. */
export function toRfc822Date(date: string): string {
  return new Date(`${date}T12:00:00.000Z`).toUTCString();
}

function itemXml(post: BlogPost): string {
  const url = siteUrl(`/blog/${post.slug}`);
  return [
    `    <item>`,
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${escapeXml(url)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `      <pubDate>${toRfc822Date(post.date)}</pubDate>`,
    `      <description>${escapeXml(post.excerpt)}</description>`,
    `      <category>${escapeXml(post.category)}</category>`,
    `    </item>`,
  ].join("\n");
}

export function buildBlogRssXml(allPosts: BlogPost[] = posts): string {
  const sorted = [...allPosts].sort((a, b) => b.date.localeCompare(a.date));
  const feedUrl = siteUrl(RSS_FEED_PATH);
  const blogUrl = siteUrl("/blog");
  const lastBuildDate = sorted[0]
    ? toRfc822Date(sorted[0].date)
    : new Date().toUTCString();
  const title = `${SITE.name} Blog`;
  const description =
    "Insights on QuickBase, low-code applications, Smartsheet, and business technology from Agrasen Technologies.";

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `  <channel>`,
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(blogUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>en-us</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    ...sorted.map(itemXml),
    `  </channel>`,
    `</rss>`,
    ``,
  ].join("\n");
}
