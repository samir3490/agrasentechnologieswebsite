import type { Contact, DailyDigest, DigestItem } from "@/lib/arm/types";
import { contactDisplayName, daysUntil } from "./events";
import { parseMonthDay } from "./dates";

const OUTREACH_DORMANT_DAYS = 180;

export function buildDailyDigest(
  accountId: string,
  dateKey: string,
  contacts: Contact[],
  from: Date = new Date()
): DailyDigest {
  const birthdays: DigestItem[] = [];
  const anniversaries: DigestItem[] = [];
  const suggestedOutreach: DigestItem[] = [];

  for (const c of contacts) {
    const name = contactDisplayName(c);

    if (c.birthday) {
      const md = parseMonthDay(c.birthday);
      if (md) {
        const d = daysUntil(md.month, md.day, from);
        if (d >= 0 && d <= 30) {
          birthdays.push({
            contactId: c.id,
            contactName: name,
            type: "birthday",
            daysUntil: d,
            date: c.birthday,
            message:
              d === 0
                ? `${name}'s birthday is today!`
                : `${name}'s birthday in ${d} day${d === 1 ? "" : "s"}`,
          });
        }
      }
    }

    if (c.anniversary) {
      const md = parseMonthDay(c.anniversary);
      if (md) {
        const d = daysUntil(md.month, md.day, from);
        if (d >= 0 && d <= 30) {
          anniversaries.push({
            contactId: c.id,
            contactName: name,
            type: "anniversary",
            daysUntil: d,
            date: c.anniversary,
            message:
              d === 0
                ? `${name}'s anniversary is today!`
                : `${name}'s anniversary in ${d} day${d === 1 ? "" : "s"}`,
          });
        }
      }
    }

    if (c.lastInteractionAt) {
      const last = new Date(c.lastInteractionAt);
      const daysSince = Math.floor((from.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince >= OUTREACH_DORMANT_DAYS) {
        suggestedOutreach.push({
          contactId: c.id,
          contactName: name,
          type: "outreach",
          daysUntil: daysSince,
          message: `Reach out to ${name} — no interaction for ${daysSince} days`,
        });
      }
    }
  }

  birthdays.sort((a, b) => a.daysUntil - b.daysUntil);
  anniversaries.sort((a, b) => a.daysUntil - b.daysUntil);
  suggestedOutreach.sort((a, b) => b.daysUntil - a.daysUntil);

  return {
    accountId,
    date: dateKey,
    birthdays,
    anniversaries,
    suggestedOutreach,
    generatedAt: new Date().toISOString(),
  };
}

export function digestToHtml(digest: DailyDigest, accountName: string): string {
  const section = (title: string, items: DigestItem[]) => {
    if (!items.length) return "";
    const rows = items.map((i) => `<li>${i.message}</li>`).join("");
    return `<h3>${title}</h3><ul>${rows}</ul>`;
  };

  return `
    <h2>Your RIP daily digest — ${accountName}</h2>
    <p>${digest.date}</p>
    ${section("Birthdays", digest.birthdays)}
    ${section("Anniversaries", digest.anniversaries)}
    ${section("Suggested outreach", digest.suggestedOutreach)}
    <p style="color:#64748b;font-size:12px">Sent by Relationship Intelligence Platform</p>
  `.trim();
}

export function digestToText(digest: DailyDigest, accountName: string): string {
  const lines = [`Your RIP daily digest — ${accountName}`, digest.date, ""];

  const add = (title: string, items: DigestItem[]) => {
    if (!items.length) return;
    lines.push(title);
    for (const i of items) lines.push(`• ${i.message}`);
    lines.push("");
  };

  add("Birthdays", digest.birthdays);
  add("Anniversaries", digest.anniversaries);
  add("Suggested outreach", digest.suggestedOutreach);
  return lines.join("\n");
}
