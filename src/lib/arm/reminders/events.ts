import type { Contact, RipEvent, Reminder, AccountSettings } from "@/lib/arm/types";
import { DEFAULT_REMINDER_INTERVALS } from "@/lib/arm/constants/plans";
import { getNextOccurrence, parseMonthDay, startOfDay, toDateKey } from "./dates";

export function contactDisplayName(c: Pick<Contact, "firstName" | "lastName" | "nickname">): string {
  const base = [c.firstName, c.lastName].filter(Boolean).join(" ");
  return c.nickname ? `${base} (${c.nickname})` : base;
}

export function buildEventsFromContact(
  accountId: string,
  contactId: string,
  contact: Pick<Contact, "firstName" | "lastName" | "nickname" | "birthday" | "anniversary">,
  settings: AccountSettings
): RipEvent[] {
  const events: RipEvent[] = [];
  const name = contactDisplayName(contact);
  const intervals = settings.reminderIntervals?.length
    ? settings.reminderIntervals
    : [...DEFAULT_REMINDER_INTERVALS];

  if (contact.birthday) {
    const md = parseMonthDay(contact.birthday);
    if (md) {
      events.push({
        id: `${contactId}_birthday`,
        accountId,
        contactId,
        type: "birthday",
        month: md.month,
        day: md.day,
        recurrence: "yearly",
        reminderIntervals: intervals,
        contactName: name,
      });
    }
  }

  if (contact.anniversary) {
    const md = parseMonthDay(contact.anniversary);
    if (md) {
      events.push({
        id: `${contactId}_anniversary`,
        accountId,
        contactId,
        type: "anniversary",
        month: md.month,
        day: md.day,
        recurrence: "yearly",
        reminderIntervals: intervals,
        contactName: name,
      });
    }
  }

  return events;
}

export function buildRemindersForEvent(
  event: RipEvent,
  settings: AccountSettings,
  from: Date = new Date()
): Reminder[] {
  const occurrence = getNextOccurrence(event.month, event.day, from);
  const occurrenceKey = toDateKey(occurrence);
  const reminders: Reminder[] = [];

  for (const daysBefore of event.reminderIntervals) {
    const due = new Date(occurrence);
    due.setDate(due.getDate() - daysBefore);
    due.setHours(settings.digestHour ?? 8, 0, 0, 0);

    if (startOfDay(due) < startOfDay(from)) continue;

    reminders.push({
      id: `${event.id}_${occurrenceKey}_${daysBefore}`,
      accountId: event.accountId,
      eventId: event.id,
      contactId: event.contactId,
      type: event.type,
      contactName: event.contactName,
      eventDate: occurrenceKey,
      daysBefore,
      dueAt: due.toISOString(),
      status: "pending",
      channels: ["email"],
    });
  }

  return reminders;
}

export function daysUntil(month: number, day: number, from: Date = new Date()): number {
  const next = getNextOccurrence(month, day, from);
  const diff = startOfDay(next).getTime() - startOfDay(from).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
