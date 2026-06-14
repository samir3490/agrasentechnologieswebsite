import type { Firestore } from "firebase-admin/firestore";
import type { Contact, AccountSettings } from "@/lib/arm/types";
import { buildEventsFromContact, buildRemindersForEvent } from "./events";

export async function syncContactEventsAndReminders(
  db: Firestore,
  accountId: string,
  contactId: string,
  contact: Contact,
  settings: AccountSettings
) {
  const events = buildEventsFromContact(accountId, contactId, contact, settings);
  const eventsCol = db.collection(`ripAccounts/${accountId}/events`);
  const remindersCol = db.collection(`ripAccounts/${accountId}/reminders`);

  const existingEvents = await eventsCol.where("contactId", "==", contactId).get();
  const batch = db.batch();

  for (const doc of existingEvents.docs) {
    if (!events.some((e) => e.id === doc.id)) {
      batch.delete(doc.ref);
    }
  }

  const oldReminders = await remindersCol.where("contactId", "==", contactId).get();
  for (const doc of oldReminders.docs) {
    batch.delete(doc.ref);
  }

  for (const event of events) {
    batch.set(eventsCol.doc(event.id), event);
    for (const reminder of buildRemindersForEvent(event, settings)) {
      batch.set(remindersCol.doc(reminder.id), reminder);
    }
  }

  await batch.commit();
}

export async function removeContactEventsAndReminders(
  db: Firestore,
  accountId: string,
  contactId: string
) {
  const batch = db.batch();
  const events = await db
    .collection(`ripAccounts/${accountId}/events`)
    .where("contactId", "==", contactId)
    .get();
  const reminders = await db
    .collection(`ripAccounts/${accountId}/reminders`)
    .where("contactId", "==", contactId)
    .get();

  for (const doc of events.docs) batch.delete(doc.ref);
  for (const doc of reminders.docs) batch.delete(doc.ref);
  await batch.commit();
}
