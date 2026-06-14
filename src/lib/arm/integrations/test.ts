import { resolveIntegrations } from "./resolve";
import { chatJson, isOpenAiConfigured } from "@/lib/arm/ai/openai";
import { geocodePlace, isMapboxConfigured } from "@/lib/arm/map/geocode";
import { fetchNewsForQuery, isNewsApiConfigured } from "@/lib/arm/news/fetch";
import { isEmailConfigured, sendEmailWithIntegrations } from "@/lib/arm/notifications/send";
import { isGoogleCalendarConfiguredForResolved } from "./resolve";

export type IntegrationTestService = "openai" | "mapbox" | "email" | "news" | "googleCalendar";

export async function testWorkspaceIntegration(accountId: string, service: IntegrationTestService) {
  const integrations = await resolveIntegrations(accountId);

  switch (service) {
    case "openai": {
      if (!isOpenAiConfigured(integrations)) {
        return { ok: false, message: "OpenAI is not configured. Add your API key in Connections." };
      }
      await chatJson<{ ok: boolean }>(
        'Return JSON {"ok":true}',
        "Reply with ok true",
        integrations
      );
      return { ok: true, message: "OpenAI connection works.", source: integrations.openai.source };
    }
    case "mapbox": {
      if (!isMapboxConfigured(integrations)) {
        return { ok: false, message: "Mapbox is not configured. Add your access token in Connections." };
      }
      const result = await geocodePlace("Mumbai", "Maharashtra", "India", integrations);
      if (!result) return { ok: false, message: "Mapbox token was rejected or geocoding failed." };
      return { ok: true, message: `Mapbox works (sample: ${result.placeName}).`, source: integrations.mapbox.source };
    }
    case "email": {
      if (!isEmailConfigured(integrations)) {
        return { ok: false, message: "Email is not configured. Add Resend or SMTP in Connections." };
      }
      return {
        ok: true,
        message: "Email credentials are present. Send a test from Reminders after saving your notification email.",
        source: integrations.email.source,
      };
    }
    case "news": {
      const articles = await fetchNewsForQuery("technology India", 1, integrations);
      if (articles.length === 0) {
        return { ok: false, message: "Could not fetch news. Google RSS should work without a key." };
      }
      return {
        ok: true,
        message: `News fetch works (${isNewsApiConfigured(integrations) ? "NewsAPI" : "Google RSS"}).`,
        source: integrations.news.source,
      };
    }
    case "googleCalendar": {
      if (!isGoogleCalendarConfiguredForResolved(integrations)) {
        return {
          ok: false,
          message: "Google OAuth app not configured. Add Client ID & Secret in Connections, then connect your Google account.",
        };
      }
      return {
        ok: true,
        message: "Google OAuth app is configured. Use Connect Google Calendar below to link your account.",
        source: integrations.googleOAuth.source,
      };
    }
    default:
      return { ok: false, message: "Unknown service" };
  }
}
