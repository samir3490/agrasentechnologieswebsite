export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { contactCreateSchema } from "@/lib/arm/validation/contact";
import { syncContactEventsAndReminders } from "@/lib/arm/reminders/sync";
import { maybeSyncGoogleCalendarForContact } from "@/lib/arm/calendar/sync";
import type { AccountSettings, Contact } from "@/lib/arm/types";
import { enrichContactLocation } from "@/lib/arm/map/geocode";
import { resolveIntegrations } from "@/lib/arm/integrations/resolve";
import { writeAuditLog } from "@/lib/arm/audit/log";
import {
  csvRowToContactPayload,
  parseContactsCsv,
} from "@/lib/arm/contacts/csv-import";

type RouteParams = { params: Promise<{ id: string }> };

const MAX_ROWS = 200;

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid, ["owner", "admin", "member"]);

    const body = (await request.json()) as { csv?: string; geocode?: boolean };
    if (!body.csv || typeof body.csv !== "string") {
      return NextResponse.json({ error: "csv text is required" }, { status: 400 });
    }

    const parsedCsv = parseContactsCsv(body.csv);
    if (parsedCsv.rows.length === 0) {
      return NextResponse.json(
        { error: "No valid contacts found", details: parsedCsv.errors },
        { status: 400 }
      );
    }
    if (parsedCsv.rows.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `Import limited to ${MAX_ROWS} rows at a time` },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    if (!accountSnap.exists) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const account = accountSnap.data()!;
    const contactLimit = Number(account.contactLimit) || 100;
    const countSnap = await db.collection(`ripAccounts/${accountId}/contacts`).count().get();
    const existingCount = countSnap.data().count;
    const remaining = Math.max(0, contactLimit - existingCount);
    if (remaining <= 0) {
      return NextResponse.json(
        { error: `Contact limit reached (${contactLimit}). Upgrade your plan.` },
        { status: 403 }
      );
    }

    const rowsToImport = parsedCsv.rows.slice(0, remaining);
    const skippedForLimit = parsedCsv.rows.length - rowsToImport.length;
    const settings = (account.settings || {}) as AccountSettings;
    const integrations = body.geocode ? await resolveIntegrations(accountId) : null;

    let created = 0;
    const rowErrors: string[] = [...parsedCsv.errors];

    for (const [index, row] of rowsToImport.entries()) {
      const payload = csvRowToContactPayload(row);
      const validated = contactCreateSchema.safeParse(payload);
      if (!validated.success) {
        rowErrors.push(`Row for ${row.firstName}: invalid fields — skipped`);
        continue;
      }

      const now = new Date().toISOString();
      const ref = db.collection(`ripAccounts/${accountId}/contacts`).doc();
      const location =
        integrations && validated.data.location
          ? await enrichContactLocation(validated.data.location, integrations)
          : validated.data.location;

      const contact = {
        ...validated.data,
        ...(location ? { location } : {}),
        accountId,
        createdAt: now,
        updatedAt: now,
        createdBy: user.uid,
      };

      await ref.set(contact);
      const fullContact = { id: ref.id, ...contact } as Contact;
      await syncContactEventsAndReminders(db, accountId, ref.id, fullContact, settings);
      await maybeSyncGoogleCalendarForContact(db, accountId, ref.id, fullContact, settings);
      created += 1;

      // Soft throttle calendar/geocode pressure on large imports
      if (index > 0 && index % 25 === 0) {
        await new Promise((r) => setTimeout(r, 50));
      }
    }

    if (created > 0) {
      await writeAuditLog(db, accountId, {
        action: "contact.created",
        actorUserId: user.uid,
        actorEmail: user.email,
        resourceType: "contact",
        summary: `Imported ${created} contact${created === 1 ? "" : "s"} from CSV`,
        metadata: { created, skippedForLimit, errors: rowErrors.length },
      });
    }

    return NextResponse.json({
      created,
      attempted: rowsToImport.length,
      skippedForLimit,
      errors: rowErrors.slice(0, 50),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Import failed";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
