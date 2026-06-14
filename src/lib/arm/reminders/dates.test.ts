import { describe, expect, it } from "vitest";
import { parseMonthDay, getNextOccurrence, toDateKey } from "./dates";
import { buildEventsFromContact, buildRemindersForEvent, daysUntil } from "./events";

describe("dates", () => {
  it("parses MM-DD and YYYY-MM-DD", () => {
    expect(parseMonthDay("03-15")).toEqual({ month: 3, day: 15 });
    expect(parseMonthDay("1990-03-15")).toEqual({ month: 3, day: 15 });
  });

  it("computes next occurrence", () => {
    const from = new Date(2026, 5, 14); // June 14 2026
    const next = getNextOccurrence(3, 15, from);
    expect(toDateKey(next)).toBe("2027-03-15");
  });
});

describe("events", () => {
  it("builds birthday event from contact", () => {
    const events = buildEventsFromContact(
      "acc1",
      "c1",
      { firstName: "Rahul", birthday: "05-10", anniversary: "12-01" },
      { timezone: "Asia/Kolkata", digestHour: 8, reminderIntervals: [7, 1] }
    );
    expect(events).toHaveLength(2);
    expect(events[0]?.type).toBe("birthday");
  });

  it("builds reminders for intervals", () => {
    const event = {
      id: "c1_birthday",
      accountId: "acc1",
      contactId: "c1",
      type: "birthday" as const,
      month: 6,
      day: 20,
      recurrence: "yearly" as const,
      reminderIntervals: [7, 1],
      contactName: "Rahul",
    };
    const from = new Date(2026, 5, 14);
    const reminders = buildRemindersForEvent(
      event,
      { timezone: "Asia/Kolkata", digestHour: 8, reminderIntervals: [7, 1] },
      from
    );
    expect(reminders.length).toBeGreaterThan(0);
    expect(reminders.every((r) => r.status === "pending")).toBe(true);
  });

  it("daysUntil returns non-negative for upcoming", () => {
    const from = new Date(2026, 5, 14);
    expect(daysUntil(6, 20, from)).toBe(6);
  });
});
