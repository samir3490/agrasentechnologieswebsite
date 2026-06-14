export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { fetchAndStoreContactNews, getNewsForContact } from "@/lib/arm/news/store";
import { buildContactNewsQueries } from "@/lib/arm/news/fetch";
import type { Contact } from "@/lib/arm/types";

type RouteParams = { params: Promise<{ id: string; cid: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId, cid } = await params;
    await requireAccountAccess(accountId, user.uid);

    const db = getAdminDb();
    const snap = await db.doc(`ripAccounts/${accountId}/contacts/${cid}`).get();
    if (!snap.exists) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

    const contact = { id: snap.id, ...snap.data() } as Contact;
    const queries = buildContactNewsQueries(contact);
    if (queries.length === 0) {
      return NextResponse.json(
        {
          error: "Add a company or city on this contact to fetch relevant news.",
          items: [],
          stored: 0,
        },
        { status: 400 }
      );
    }

    const result = await fetchAndStoreContactNews(db, accountId, contact);
    const items = await getNewsForContact(db, accountId, cid);

    return NextResponse.json({ ...result, items });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch news";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
