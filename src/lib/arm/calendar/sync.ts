import type { Firestore } from "firebase-admin/firestore";
import type { AccountSettings, Contact } from "@/lib/arm/types";
import { buildEventsFromContact } from "@/lib/arm/reminders/events";
import { getNextOccurrence, toDateKey } from "@/lib/arm/reminders/dates";
import {
  deleteGoogleCalendarEvent,
  getAccessTokenForUser,
  type CalendarEventMap,
  upsertGoogleCalendarEvent,
} from "./google-client";

const APP_NAME = "AI Relationship Manager";

function eventSummary(type: "birthday" | "anniversary", contactName: string) {
  return type === "birthday" ? `🎂 ${contactName}'s Birthday` : `💍 ${contactName}'s Anniversary`;
}

function buildGoogleEventBody(
  type: "birthday" | "anniversary",
  contactName: string,
  month: number,
  day: number
) {
  const next = getNextOccurrence(month, day);
  const dateKey = toDateKey(next);
  return {
    summary: eventSummary(type, contactName),
    description: `Synced from ${APP_NAME} (agrasentechnologies.com)`,
    start: { date: dateKey },
    end: { date: dateKey },
    recurrence: [`RRULE:FREQ=YEARLY;BYMONTH=${month};BYMONTHDAY=${day}`],
    transparency: "transparent",
  };
}

export async function syncContactToGoogleCalendar(
  db: Firestore,
  accountId: string,
  contactId: string,
  contact: Contact,
  settings: AccountSettings,
  userId: string
) {
  if (!settings.googleCalendarSyncEnabled || settings.googleCalendarSyncedBy !== userId) {
    return { synced: 0, skipped: true };
  }

  const auth = await getAccessTokenForUser(db, userId);
  if (!auth) return { synced: 0, skipped: true };

  const events = buildEventsFromContact(accountId, contactId, contact, settings);
  const mapCol = db.collection(`ripAccounts/${accountId}/calendarMap`);
  let synced = 0;

  const existingMaps = await mapCol.where("contactId", "==", contactId).get();
  const activeEventIds = new Set(events.map((e) => e.id));

  for (const doc of existingMaps.docs) {
    if (!activeEventIds.has(doc.id)) {
      const map = doc.data() as CalendarEventMap;
      if (map.googleEventId) {
        await deleteGoogleCalendarEvent(auth.accessToken, auth.calendarId, map.googleEventId).catch(
          () => undefined
        );
      }
      await doc.ref.delete();
    }
  }

  for (const event of events) {
    const mapRef = mapCol.doc(event.id);
    const mapSnap = await mapRef.get();
    const existing = mapSnap.data() as CalendarEventMap | undefined;
    const body = buildGoogleEventBody(event.type, event.contactName, event.month, event.day);
    const googleEventId = await upsertGoogleCalendarEvent(
      auth.accessToken,
      auth.calendarId,
      existing?.googleEventId ?? null,
      body
    );
    await mapRef.set({
      googleEventId,
      contactId,
      type: event.type,
      contactName: event.contactName,
      syncedAt: new Date().toISOString(),
      syncedByUserId: userId,
    } satisfies CalendarEventMap);
    synced++;
  }

  return { synced, skipped: false };
}

export async function syncAccountToGoogleCalendar(
  db: Firestore,
  accountId: string,
  userId: string
) {
  const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
  if (!accountSnap.exists) throw new Error("Account not found");

  const settings = (accountSnap.data()?.settings || {}) as AccountSettings;
  if (!settings.googleCalendarSyncEnabled || settings.googleCalendarSyncedBy !== userId) {
    return { synced: 0, contacts: 0 };
  }

  const contactsSnap = await db.collection(`ripAccounts/${accountId}/contacts`).get();
  let synced = 0;
  for (const doc of contactsSnap.docs) {
    const contact = { id: doc.id, ...doc.data() } as Contact;
    const result = await syncContactToGoogleCalendar(db, accountId, doc.id, contact, settings, userId);
    synced += result.synced;
  }

  await db.doc(`ripAccounts/${accountId}`).update({
    "settings.googleCalendarLastSyncAt": new Date().toISOString(),
  });

  return { synced, contacts: contactsSnap.size };
}

export async function removeContactFromGoogleCalendar(
  db: Firestore,
  accountId: string,
  contactId: string,
  userId: string
) {
  const accountSnap = await db.doc(`ripAccounts/${accountId}`).get();
  const settings = (accountSnap.data()?.settings || {}) as AccountSettings;
  if (!settings.googleCalendarSyncEnabled || settings.googleCalendarSyncedBy !== userId) return;

  const auth = await getAccessTokenForUser(db, userId);
  if (!auth) return;

  const mapCol = db.collection(`ripAccounts/${accountId}/calendarMap`);
  const maps = await mapCol.where("contactId", "==", contactId).get();
  for (const doc of maps.docs) {
    const map = doc.data() as CalendarEventMap;
    if (map.googleEventId) {
      await deleteGoogleCalendarEvent(auth.accessToken, auth.calendarId, map.googleEventId).catch(
        () => undefined
      );
    }
    await doc.ref.delete();
  }
}

export async function maybeSyncGoogleCalendarForContact(
  db: Firestore,
  accountId: string,
  contactId: string,
  contact: Contact,
  settings: AccountSettings
) {
  if (!settings.googleCalendarSyncEnabled || !settings.googleCalendarSyncedBy) return;
  try {
    await syncContactToGoogleCalendar(
      db,
      accountId,
      contactId,
      contact,
      settings,
      settings.googleCalendarSyncedBy
    );
  } catch (e) {
    console.error("Google Calendar sync failed:", e);
  }
}

export async function maybeRemoveGoogleCalendarForContact(
  db: Firestore,
  accountId: string,
  contactId: string,
  settings: AccountSettings
) {
  if (!settings.googleCalendarSyncEnabled || !settings.googleCalendarSyncedBy) return;
  try {
    await removeContactFromGoogleCalendar(
      db,
      accountId,
      contactId,
      settings.googleCalendarSyncedBy
    );
  } catch (e) {
    console.error("Google Calendar delete failed:", e);
  }
}
