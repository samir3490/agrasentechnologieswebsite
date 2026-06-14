export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth, requireAccountWrite } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { interactionCreateSchema } from "@/lib/arm/validation/contact";

type RouteParams = { params: Promise<{ id: string; cid: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId, cid } = await params;
    await requireAccountWrite(accountId, user.uid);

    const snap = await getAdminDb()
      .collection(`ripAccounts/${accountId}/contacts/${cid}/interactions`)
      .orderBy("date", "desc")
      .get();

    const interactions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ interactions });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch interactions";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId, cid } = await params;
    await requireAccountWrite(accountId, user.uid);

    const body = await request.json();
    const parsed = interactionCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const db = getAdminDb();
    const contactRef = db.doc(`ripAccounts/${accountId}/contacts/${cid}`);
    const contactSnap = await contactRef.get();
    if (!contactSnap.exists) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const ref = db.collection(`ripAccounts/${accountId}/contacts/${cid}/interactions`).doc();

    const interaction = {
      contactId: cid,
      ...parsed.data,
      createdBy: user.uid,
      createdAt: now,
    };

    await ref.set(interaction);
    await contactRef.update({
      lastInteractionAt: parsed.data.date,
      updatedAt: now,
    });

    return NextResponse.json({ id: ref.id, ...interaction });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to log interaction";
    const status = message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
