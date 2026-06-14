import type { Firestore } from "firebase-admin/firestore";

export type AuditAction =
  | "contact.created"
  | "contact.updated"
  | "contact.deleted"
  | "interaction.logged"
  | "settings.updated"
  | "integrations.updated"
  | "billing.upgraded"
  | "member.added"
  | "member.removed"
  | "member.role_changed"
  | "export.downloaded";

export interface AuditLogInput {
  action: AuditAction;
  actorUserId: string;
  actorEmail?: string;
  resourceType?: string;
  resourceId?: string;
  summary: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogEntry extends AuditLogInput {
  id: string;
  accountId: string;
  createdAt: string;
}

export async function writeAuditLog(db: Firestore, accountId: string, entry: AuditLogInput) {
  const ref = db.collection(`ripAccounts/${accountId}/auditLogs`).doc();
  await ref.set({
    accountId,
    ...entry,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function listAuditLogs(db: Firestore, accountId: string, limit = 50) {
  const snap = await db.collection(`ripAccounts/${accountId}/auditLogs`).limit(100).get();

  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as AuditLogEntry)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
