import { getAdminDb, verifyAuthToken } from "@/lib/arm/firebase/admin";
import type { MemberRole } from "@/lib/arm/types";

export async function requireAuth(request: Request) {
  return verifyAuthToken(request.headers.get("authorization"));
}

export async function getMemberRole(accountId: string, userId: string): Promise<MemberRole | null> {
  const snap = await getAdminDb().doc(`ripAccounts/${accountId}/members/${userId}`).get();
  if (!snap.exists) return null;
  return snap.data()?.role as MemberRole;
}

export async function requireAccountAccess(
  accountId: string,
  userId: string,
  allowed: MemberRole[] = ["owner", "admin", "member", "viewer"]
) {
  const role = await getMemberRole(accountId, userId);
  if (!role || !allowed.includes(role)) {
    throw new Error("Forbidden");
  }
  return role;
}

export async function requireAccountWrite(accountId: string, userId: string) {
  return requireAccountAccess(accountId, userId, ["owner", "admin", "member"]);
}

export async function requireAccountAdmin(accountId: string, userId: string) {
  return requireAccountAccess(accountId, userId, ["owner", "admin"]);
}

export async function getUserAccounts(userId: string) {
  const db = getAdminDb();
  const memberships = await db.collection(`ripUsers/${userId}/accountMemberships`).get();
  const accounts = await Promise.all(
    memberships.docs.map(async (m) => {
      const accountId = m.id;
      const accountDoc = await db.doc(`ripAccounts/${accountId}`).get();
      const data = accountDoc.data() || {};
      return {
        id: accountId,
        name: data.name as string,
        slug: data.slug as string,
        role: m.data().role as MemberRole,
        plan: data.plan as string,
      };
    })
  );
  return accounts.filter((a) => a.name);
}
