import type { Firestore } from "firebase-admin/firestore";
import type { Contact, Interaction } from "@/lib/arm/types";

export async function buildWorkspaceExport(db: Firestore, accountId: string) {
  const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
  if (!accountSnap.exists) throw new Error("Workspace not found");

  const account = accountSnap.data()!;
  const { settings, ...accountPublic } = account;

  const membersSnap = await db.collection(`ripAccounts/${accountId}/members`).get();
  const contactsSnap = await db.collection(`ripAccounts/${accountId}/contacts`).get();
  const eventsSnap = await db.collection(`ripAccounts/${accountId}/events`).get();
  const remindersSnap = await db.collection(`ripAccounts/${accountId}/reminders`).get();
  const newsSnap = await db.collection(`ripAccounts/${accountId}/newsItems`).limit(500).get();

  const contacts: Contact[] = [];
  const interactions: Interaction[] = [];

  for (const doc of contactsSnap.docs) {
    contacts.push({ id: doc.id, ...doc.data() } as Contact);
    const intSnap = await db.collection(`ripAccounts/${accountId}/contacts/${doc.id}/interactions`).get();
    for (const i of intSnap.docs) {
      interactions.push({ id: i.id, contactId: doc.id, ...i.data() } as Interaction);
    }
  }

  return {
    exportedAt: new Date().toISOString(),
    format: "arm-gdpr-export-v1",
    workspace: {
      id: accountId,
      ...accountPublic,
      settings,
    },
    members: membersSnap.docs.map((d) => ({ userId: d.id, ...d.data() })),
    contacts,
    interactions,
    events: eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    reminders: remindersSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    newsItems: newsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    note: "This export excludes encrypted integration secrets and billing pending records.",
  };
}
