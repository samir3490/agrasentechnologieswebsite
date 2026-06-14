export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { isCronAuthorized } from "@/lib/arm/cron/auth";
import { buildDailyDigest, digestToHtml, digestToText } from "@/lib/arm/reminders/digest";
import { toDateKey } from "@/lib/arm/reminders/dates";
import { sendEmailWithIntegrations, isEmailConfigured, isPlatformEmailConfigured } from "@/lib/arm/notifications/email";
import { resolveIntegrations } from "@/lib/arm/integrations/resolve";
import type { Contact, AccountSettings } from "@/lib/arm/types";

export const maxDuration = 120;

export async function GET(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = toDateKey(new Date());
  const db = getAdminDb();
  const accountsSnap = await db.collection("ripAccounts").get();

  let digests = 0;
  let emailed = 0;
  const errors: string[] = [];
  const emailEnabled = isPlatformEmailConfigured();

  for (const accountDoc of accountsSnap.docs) {
    const accountId = accountDoc.id;
    const account = accountDoc.data();
    const settings = (account.settings || {}) as AccountSettings;
    const accountName = account.name as string;

    const contactsSnap = await db.collection(`ripAccounts/${accountId}/contacts`).get();
    const contacts = contactsSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as Contact[];
    const digest = buildDailyDigest(accountId, today, contacts);

    await db.doc(`ripAccounts/${accountId}/digests/${today}`).set(digest);
    digests++;

    if (settings.dailyDigestEnabled === false) continue;

    const integrations = await resolveIntegrations(accountId);
    if (!isEmailConfigured(integrations)) continue;

    const hasContent =
      digest.birthdays.length + digest.anniversaries.length + digest.suggestedOutreach.length > 0;
    if (!hasContent) continue;

    const ownerSnap = await db
      .collection(`ripAccounts/${accountId}/members`)
      .where("role", "==", "owner")
      .limit(1)
      .get();
    const to =
      settings.notificationEmail ||
      ownerSnap.docs[0]?.data()?.email ||
      process.env.ALERT_EMAIL;
    if (!to) continue;

    const result = await sendEmailWithIntegrations(
      {
        to,
        subject: `AI Relationship Manager Daily Digest — ${accountName}`,
        html: digestToHtml(digest, accountName),
        text: digestToText(digest, accountName),
      },
      integrations
    );

    if (result.ok) emailed++;
    else errors.push(`${accountId}: ${result.error}`);
  }

  return NextResponse.json({ ok: true, date: today, digests, emailed, errors, emailEnabled });
}
