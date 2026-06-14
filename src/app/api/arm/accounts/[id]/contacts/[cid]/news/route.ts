export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAuth, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { getNewsForContact } from "@/lib/arm/news/store";
import { buildContactNewsQueries, isNewsApiConfigured } from "@/lib/arm/news/fetch";
import type { Contact } from "@/lib/arm/types";

type RouteParams = { params: Promise<{ id: string; cid: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId, cid } = await params;
    await requireAccountAccess(accountId, user.uid);

    const snap = await getAdminDb().doc(`ripAccounts/${accountId}/contacts/${cid}`).get();
    if (!snap.exists) return NextResponse.json({ error: "Contact not found" }, { status: 404 });

    const contact = { id: snap.id, ...snap.data() } as Contact;
    const items = await getNewsForContact(getAdminDb(), accountId, cid);

    return NextResponse.json({
      items,
      queries: buildContactNewsQueries(contact),
      source: isNewsApiConfigured() ? "newsapi" : "google-rss",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch news";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
