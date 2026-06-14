export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireAuth, getUserAccounts } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { slugify, uniqueSlug } from "@/lib/arm/account/slug";
import { DEFAULT_REMINDER_INTERVALS, PLAN_LIMITS } from "@/lib/arm/constants/plans";

export async function GET(request: Request) {
  try {
    const user = await requireAuth(request);
    const accounts = await getUserAccounts(user.uid);
    return NextResponse.json({ accounts });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch accounts";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { name } = body as { name: string };

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const db = getAdminDb();
    const accountRef = db.collection("ripAccounts").doc();
    const slug = slugify(name);

    const existing = await db.collection("ripAccounts").where("slug", "==", slug).get();
    const finalSlug = existing.empty
      ? slug
      : uniqueSlug(
          name,
          existing.docs.map((d) => d.data().slug as string)
        );

    const now = new Date().toISOString();

    await accountRef.set({
      name: name.trim(),
      slug: finalSlug,
      ownerId: user.uid,
      plan: "free",
      modes: ["personal", "business", "ngo"],
      contactLimit: PLAN_LIMITS.free,
      settings: {
        timezone: "Asia/Kolkata",
        digestHour: 8,
        reminderIntervals: [...DEFAULT_REMINDER_INTERVALS],
        notificationEmail: user.email ?? "",
        emailRemindersEnabled: true,
        dailyDigestEnabled: true,
      },
      createdAt: now,
      createdBy: user.uid,
    });

    await accountRef.collection("members").doc(user.uid).set({
      userId: user.uid,
      role: "owner",
      email: user.email ?? "",
      joinedAt: now,
    });

    await db.doc(`ripUsers/${user.uid}/accountMemberships/${accountRef.id}`).set({
      accountId: accountRef.id,
      role: "owner",
      accountName: name.trim(),
      joinedAt: now,
    });

    const userRef = db.doc(`ripUsers/${user.uid}`);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      await userRef.set({
        email: user.email ?? "",
        defaultAccountId: accountRef.id,
        createdAt: now,
      });
    } else if (!userSnap.data()?.defaultAccountId) {
      await userRef.update({ defaultAccountId: accountRef.id });
    }

    return NextResponse.json({ id: accountRef.id, slug: finalSlug, name: name.trim() });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create account";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
