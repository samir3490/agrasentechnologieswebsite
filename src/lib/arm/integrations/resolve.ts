import { getAdminDb } from "@/lib/arm/firebase/admin";
import { getStoredWorkspaceIntegrations } from "./store";
import type { GoogleOAuthConfig, ResolvedIntegrations } from "./types";

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://agrasentechnologies.com").replace(/\/$/, "");
}

function platformGoogleOAuth(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return {
    clientId,
    clientSecret,
    redirectUri: `${appUrl()}/api/arm/integrations/google-calendar/callback`,
    source: "platform",
  };
}

export async function resolveIntegrations(accountId: string): Promise<ResolvedIntegrations> {
  const stored = await getStoredWorkspaceIntegrations(getAdminDb(), accountId);

  const openaiKey = stored?.openaiApiKey?.trim() || process.env.OPENAI_API_KEY?.trim();
  const mapboxToken =
    stored?.mapboxAccessToken?.trim() ||
    process.env.MAPBOX_ACCESS_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim();
  const newsKey = stored?.newsApiKey?.trim() || process.env.NEWS_API_KEY?.trim();

  const resendKey = stored?.resendApiKey?.trim() || process.env.RESEND_API_KEY?.trim();
  const smtpHost = stored?.smtpHost?.trim() || process.env.SMTP_HOST?.trim();
  const smtpUser = stored?.smtpUser?.trim() || process.env.SMTP_USER?.trim();
  const smtpPass = stored?.smtpPass?.trim() || process.env.SMTP_PASS?.trim();

  const wsGoogle =
    stored?.googleOAuthClientId?.trim() && stored?.googleOAuthClientSecret?.trim()
      ? {
          clientId: stored.googleOAuthClientId.trim(),
          clientSecret: stored.googleOAuthClientSecret.trim(),
          redirectUri: `${appUrl()}/api/arm/integrations/google-calendar/callback`,
          source: "workspace" as const,
        }
      : null;
  const google = wsGoogle || platformGoogleOAuth();

  const wsOpenAi = Boolean(stored?.openaiApiKey?.trim());
  const wsMapbox = Boolean(stored?.mapboxAccessToken?.trim());
  const wsNews = Boolean(stored?.newsApiKey?.trim());
  const wsEmail = Boolean(stored?.resendApiKey?.trim() || (stored?.smtpHost && stored?.smtpPass));
  const wsGoogleOAuth = Boolean(wsGoogle);

  const platformEmail = Boolean(resendKey || (smtpHost && smtpUser && smtpPass));

  return {
    openai: {
      apiKey: openaiKey,
      model: stored?.openaiModel?.trim() || process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      configured: Boolean(openaiKey),
      source: wsOpenAi ? "workspace" : openaiKey ? "platform" : "none",
    },
    mapbox: {
      accessToken: mapboxToken,
      configured: Boolean(mapboxToken),
      source: wsMapbox ? "workspace" : mapboxToken ? "platform" : "none",
    },
    news: {
      apiKey: newsKey,
      configured: Boolean(newsKey),
      source: wsNews ? "workspace" : newsKey ? "platform" : "none",
    },
    email: {
      configured: platformEmail,
      source: wsEmail ? "workspace" : platformEmail ? "platform" : "none",
      provider: stored?.emailProvider || (resendKey ? "resend" : smtpHost ? "smtp" : undefined),
      from: stored?.emailFrom?.trim() || process.env.EMAIL_FROM?.trim(),
      resendApiKey: resendKey,
      smtp:
        smtpHost && smtpUser && smtpPass
          ? {
              host: smtpHost,
              port: stored?.smtpPort ?? Number(process.env.SMTP_PORT || 587),
              secure: stored?.smtpSecure ?? (Number(process.env.SMTP_PORT) === 465),
              user: smtpUser,
              pass: smtpPass,
            }
          : undefined,
    },
    googleOAuth: {
      clientId: google?.clientId,
      clientSecret: google?.clientSecret,
      configured: Boolean(google),
      source: wsGoogleOAuth ? "workspace" : google ? "platform" : "none",
      redirectUri: google?.redirectUri || `${appUrl()}/api/arm/integrations/google-calendar/callback`,
    },
  };
}

export async function resolveGoogleOAuthForAccount(accountId: string): Promise<GoogleOAuthConfig> {
  const resolved = await resolveIntegrations(accountId);
  if (!resolved.googleOAuth.configured || !resolved.googleOAuth.clientId || !resolved.googleOAuth.clientSecret) {
    throw new Error("Google Calendar OAuth is not configured for this workspace.");
  }
  return {
    clientId: resolved.googleOAuth.clientId,
    clientSecret: resolved.googleOAuth.clientSecret,
    redirectUri: resolved.googleOAuth.redirectUri,
    source: resolved.googleOAuth.source,
  };
}

export function isGoogleCalendarConfiguredForResolved(resolved: ResolvedIntegrations) {
  return resolved.googleOAuth.configured;
}
