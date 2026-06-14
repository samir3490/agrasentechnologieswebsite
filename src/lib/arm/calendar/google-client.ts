import type { Firestore } from "firebase-admin/firestore";
import { refreshAccessToken } from "./oauth";

export interface GoogleCalendarIntegration {
  refreshToken: string;
  calendarId: string;
  connectedEmail?: string;
  connectedAt: string;
}

export interface CalendarEventMap {
  googleEventId: string;
  contactId: string;
  type: "birthday" | "anniversary";
  contactName: string;
  syncedAt: string;
  syncedByUserId: string;
}

const INTEGRATION_PATH = (userId: string) => `ripUsers/${userId}/integrations/googleCalendar`;

export async function getGoogleCalendarIntegration(
  db: Firestore,
  userId: string
): Promise<GoogleCalendarIntegration | null> {
  const snap = await db.doc(INTEGRATION_PATH(userId)).get();
  if (!snap.exists) return null;
  const data = snap.data() as GoogleCalendarIntegration;
  return data.refreshToken ? data : null;
}

export async function saveGoogleCalendarIntegration(
  db: Firestore,
  userId: string,
  integration: GoogleCalendarIntegration
) {
  await db.doc(INTEGRATION_PATH(userId)).set(integration, { merge: true });
}

export async function deleteGoogleCalendarIntegration(db: Firestore, userId: string) {
  await db.doc(INTEGRATION_PATH(userId)).delete();
}

export async function getAccessTokenForUser(db: Firestore, userId: string) {
  const integration = await getGoogleCalendarIntegration(db, userId);
  if (!integration) return null;
  const accessToken = await refreshAccessToken(integration.refreshToken);
  return { accessToken, calendarId: integration.calendarId || "primary" };
}

export async function fetchGoogleUserEmail(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as { email?: string };
  return data.email;
}

interface GoogleCalendarEventBody {
  summary: string;
  description?: string;
  start: { date: string };
  end: { date: string };
  recurrence?: string[];
  transparency?: string;
}

export async function upsertGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  googleEventId: string | null,
  body: GoogleCalendarEventBody
) {
  const url = googleEventId
    ? `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(googleEventId)}`
    : `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;

  const res = await fetch(url, {
    method: googleEventId ? "PATCH" : "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as { id?: string; error?: { message?: string } };
  if (!res.ok || !data.id) {
    throw new Error(data.error?.message || "Google Calendar API error");
  }
  return data.id;
}

export async function deleteGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  googleEventId: string
) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(googleEventId)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 404 || res.status === 410) return;
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(data.error?.message || "Failed to delete calendar event");
  }
}
