import type { Firestore } from "firebase-admin/firestore";
import type { AccountPlan } from "@/lib/arm/types";
import type { AuditLogEntry } from "@/lib/arm/audit/log";

export interface OperatorWorkspaceRow {
  id: string;
  name: string;
  slug: string;
  plan: AccountPlan;
  ownerId: string;
  contactLimit: number;
  contactCount: number;
  memberCount: number;
  createdAt: string;
  createdBy: string;
}

export interface OperatorUserRow {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  defaultAccountId?: string;
}

export interface OperatorOverview {
  generatedAt: string;
  totals: {
    users: number;
    workspaces: number;
    contacts: number;
    freeWorkspaces: number;
    paidWorkspaces: number;
  };
  plans: Record<string, number>;
  signups: {
    usersLast7Days: number;
    usersLast30Days: number;
    workspacesLast7Days: number;
    workspacesLast30Days: number;
  };
  workspaces: OperatorWorkspaceRow[];
  users: OperatorUserRow[];
  recentActivity: (AuditLogEntry & { accountName?: string })[];
}

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function inLastDays(iso: string | undefined, days: number) {
  if (!iso) return false;
  return iso >= daysAgoIso(days);
}

async function countSubcollection(db: Firestore, path: string) {
  try {
    const snap = await db.collection(path).count().get();
    return snap.data().count;
  } catch {
    const snap = await db.collection(path).get();
    return snap.size;
  }
}

export async function buildOperatorOverview(db: Firestore): Promise<OperatorOverview> {
  const [accountsSnap, usersSnap] = await Promise.all([
    db.collection("ripAccounts").get(),
    db.collection("ripUsers").get(),
  ]);

  const accountNameById = new Map<string, string>();
  const workspaceBase = accountsSnap.docs.map((doc) => {
    const data = doc.data();
    const plan = (data.plan as AccountPlan) || "free";
    accountNameById.set(doc.id, (data.name as string) || doc.id);
    return {
      id: doc.id,
      name: (data.name as string) || "Untitled",
      slug: (data.slug as string) || "",
      plan,
      ownerId: (data.ownerId as string) || (data.createdBy as string) || "",
      contactLimit: Number(data.contactLimit) || 100,
      createdAt: (data.createdAt as string) || "",
      createdBy: (data.createdBy as string) || "",
    };
  });

  const workspaces: OperatorWorkspaceRow[] = await Promise.all(
    workspaceBase.map(async (row) => {
      const [contactCount, memberCount] = await Promise.all([
        countSubcollection(db, `ripAccounts/${row.id}/contacts`),
        countSubcollection(db, `ripAccounts/${row.id}/members`),
      ]);
      return { ...row, contactCount, memberCount };
    })
  );

  workspaces.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  const users: OperatorUserRow[] = usersSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      email: (data.email as string) || "",
      displayName: data.displayName as string | undefined,
      createdAt: (data.createdAt as string) || "",
      defaultAccountId: data.defaultAccountId as string | undefined,
    };
  });
  users.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  const plans: Record<string, number> = {};
  for (const w of workspaces) {
    plans[w.plan] = (plans[w.plan] || 0) + 1;
  }

  const freeWorkspaces = workspaces.filter((w) => w.plan === "free").length;
  const paidWorkspaces = workspaces.length - freeWorkspaces;
  const contacts = workspaces.reduce((sum, w) => sum + w.contactCount, 0);

  // Recent activity: pull a few audit logs per workspace, merge
  const auditChunks = await Promise.all(
    workspaces.slice(0, 40).map(async (w) => {
      try {
        const snap = await db.collection(`ripAccounts/${w.id}/auditLogs`).limit(15).get();
        return snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            accountId: w.id,
            accountName: w.name,
            action: data.action,
            actorUserId: data.actorUserId,
            actorEmail: data.actorEmail,
            resourceType: data.resourceType,
            resourceId: data.resourceId,
            summary: data.summary,
            metadata: data.metadata,
            createdAt: data.createdAt as string,
          } as AuditLogEntry & { accountName?: string };
        });
      } catch {
        return [];
      }
    })
  );

  const recentActivity = auditChunks
    .flat()
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 50);

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      users: users.length,
      workspaces: workspaces.length,
      contacts,
      freeWorkspaces,
      paidWorkspaces,
    },
    plans,
    signups: {
      usersLast7Days: users.filter((u) => inLastDays(u.createdAt, 7)).length,
      usersLast30Days: users.filter((u) => inLastDays(u.createdAt, 30)).length,
      workspacesLast7Days: workspaces.filter((w) => inLastDays(w.createdAt, 7)).length,
      workspacesLast30Days: workspaces.filter((w) => inLastDays(w.createdAt, 30)).length,
    },
    workspaces,
    users,
    recentActivity,
  };
}

export async function buildOperatorAccountDetail(db: Firestore, accountId: string) {
  const accountRef = db.doc(`ripAccounts/${accountId}`);
  const accountSnap = await accountRef.get();
  if (!accountSnap.exists) return null;

  const data = accountSnap.data() || {};
  const [contactCount, memberCount, membersSnap, auditSnap, contactsSnap] = await Promise.all([
    countSubcollection(db, `ripAccounts/${accountId}/contacts`),
    countSubcollection(db, `ripAccounts/${accountId}/members`),
    db.collection(`ripAccounts/${accountId}/members`).get(),
    db.collection(`ripAccounts/${accountId}/auditLogs`).limit(40).get(),
    db.collection(`ripAccounts/${accountId}/contacts`).limit(100).get(),
  ]);

  const members = membersSnap.docs.map((d) => ({
    userId: d.id,
    ...(d.data() as { role?: string; email?: string; joinedAt?: string }),
  }));

  const auditLogs = auditSnap.docs
    .map((d) => ({ id: d.id, ...(d.data() as object) }))
    .sort((a, b) =>
      String((b as { createdAt?: string }).createdAt || "").localeCompare(
        String((a as { createdAt?: string }).createdAt || "")
      )
    );

  const contacts = contactsSnap.docs.map((d) => {
    const c = d.data();
    return {
      id: d.id,
      firstName: c.firstName,
      lastName: c.lastName,
      healthLabel: c.healthLabel,
      createdAt: c.createdAt,
      lastInteractionAt: c.lastInteractionAt,
      city: c.location?.city,
      company: c.work?.company,
    };
  });

  return {
    id: accountId,
    name: data.name,
    slug: data.slug,
    plan: data.plan || "free",
    ownerId: data.ownerId,
    contactLimit: data.contactLimit,
    modes: data.modes,
    settings: {
      emailRemindersEnabled: data.settings?.emailRemindersEnabled,
      dailyDigestEnabled: data.settings?.dailyDigestEnabled,
      googleCalendarSyncEnabled: data.settings?.googleCalendarSyncEnabled,
      notificationEmail: data.settings?.notificationEmail,
      timezone: data.settings?.timezone,
    },
    createdAt: data.createdAt,
    contactCount,
    memberCount,
    members,
    contacts,
    auditLogs,
  };
}
