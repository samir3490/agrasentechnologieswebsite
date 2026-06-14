export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { isCronAuthorized } from "@/lib/arm/cron/auth";
import { sendEmailWithIntegrations, isEmailConfigured } from "@/lib/arm/notifications/email";
import { resolveIntegrations } from "@/lib/arm/integrations/resolve";
import type { Reminder, AccountSettings } from "@/lib/arm/types";

export const maxDuration = 120;

function reminderSubject(r: Reminder): string {
  const label = r.type === "birthday" ? "Birthday" : "Anniversary";
  if (r.daysBefore === 0) return `Today: ${r.contactName}'s ${label.toLowerCase()}!`;
  return `${label} reminder: ${r.contactName} in ${r.daysBefore} day${r.daysBefore === 1 ? "" : "s"}`;
}

function reminderBody(r: Reminder): { html: string; text: string } {
  const label = r.type === "birthday" ? "birthday" : "anniversary";
  const when =
    r.daysBefore === 0
      ? `is today (${r.eventDate})`
      : `is on ${r.eventDate} (${r.daysBefore} days away)`;
  const text = `${r.contactName}'s ${label} ${when}. Open RIP to view contact details and gift ideas.`;
  const html = `<p>${text}</p><p style="color:#64748b;font-size:12px">Relationship Intelligence Platform</p>`;
  return { html, text };
}

export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const db = getAdminDb();
  const accountsSnap = await db.collection("ripAccounts").get();

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const accountDoc of accountsSnap.docs) {
    const accountId = accountDoc.id;
    const account = accountDoc.data();
    const settings = (account.settings || {}) as AccountSettings;

    if (settings.emailRemindersEnabled === false) continue;

    const integrations = await resolveIntegrations(accountId);
    if (!isEmailConfigured(integrations)) {
      skipped++;
      continue;
    }

    const ownerSnap = await db
      .collection(`ripAccounts/${accountId}/members`)
      .where("role", "==", "owner")
      .limit(1)
      .get();
    const to =
      settings.notificationEmail ||
      ownerSnap.docs[0]?.data()?.email ||
      process.env.ALERT_EMAIL;
    if (!to) {
      skipped++;
      continue;
    }

    const dueSnap = await db
      .collection(`ripAccounts/${accountId}/reminders`)
      .where("status", "==", "pending")
      .get();

    for (const remDoc of dueSnap.docs) {
      const reminder = remDoc.data() as Reminder;
      if (reminder.dueAt > now) continue;

      const { html, text } = reminderBody(reminder);
      const result = await sendEmailWithIntegrations(
        {
          to,
          subject: reminderSubject(reminder),
          html,
          text,
        },
        integrations
      );

      if (result.ok) {
        await remDoc.ref.update({ status: "sent", sentAt: now });
        sent++;
      } else {
        errors.push(`${reminder.id}: ${result.error}`);
      }
    }
  }

  return NextResponse.json({ ok: true, sent, skipped, errors });
}
