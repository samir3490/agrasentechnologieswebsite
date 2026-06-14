export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { contactCreateSchema } from "@/lib/arm/validation/contact";
import { syncContactEventsAndReminders } from "@/lib/arm/reminders/sync";
import type { Contact, RelationshipType, AccountSettings } from "@/lib/arm/types";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid);

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const city = searchParams.get("city");
    const relationshipType = searchParams.get("relationshipType");
    const healthLabel = searchParams.get("healthLabel");
    const q = searchParams.get("q")?.toLowerCase();

    const snap = await getAdminDb().collection(`ripAccounts/${accountId}/contacts`).get();
    let contacts = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Contact[];

    if (tag) contacts = contacts.filter((c) => c.tags?.includes(tag));
    if (city) contacts = contacts.filter((c) => c.location?.city?.toLowerCase() === city.toLowerCase());
    if (relationshipType) {
      contacts = contacts.filter((c) =>
        c.relationshipTypes?.includes(relationshipType as RelationshipType)
      );
    }
    if (healthLabel) contacts = contacts.filter((c) => c.healthLabel === healthLabel);
    if (q) {
      contacts = contacts.filter((c) => {
        const name = `${c.firstName} ${c.lastName ?? ""} ${c.nickname ?? ""}`.toLowerCase();
        return name.includes(q) || c.work?.company?.toLowerCase().includes(q);
      });
    }

    contacts.sort((a, b) => a.firstName.localeCompare(b.firstName));

    return NextResponse.json({ contacts, total: contacts.length });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch contacts";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid, ["owner", "admin", "member"]);

    const db = getAdminDb();
    const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
    if (!accountSnap.exists) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const account = accountSnap.data()!;
    const countSnap = await db.collection(`ripAccounts/${accountId}/contacts`).count().get();
    const count = countSnap.data().count;
    if (count >= (account.contactLimit as number)) {
      return NextResponse.json(
        { error: `Contact limit reached (${account.contactLimit}). Upgrade your plan.` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = contactCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const now = new Date().toISOString();
    const ref = db.collection(`ripAccounts/${accountId}/contacts`).doc();

    const contact = {
      ...parsed.data,
      accountId,
      createdAt: now,
      updatedAt: now,
      createdBy: user.uid,
    };

    await ref.set(contact);

    const settings = (account.settings || {}) as AccountSettings;
    await syncContactEventsAndReminders(db, accountId, ref.id, { id: ref.id, ...contact } as Contact, settings);

    return NextResponse.json({ id: ref.id, ...contact });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create contact";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
