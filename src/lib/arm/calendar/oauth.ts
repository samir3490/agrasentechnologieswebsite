import crypto from "crypto";

const STATE_TTL_MS = 15 * 60 * 1000;

function stateSecret() {
  return (
    process.env.GOOGLE_OAUTH_STATE_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    process.env.FIREBASE_ADMIN_PRIVATE_KEY?.slice(0, 64) ||
    "arm-calendar-state-dev"
  );
}

export interface OAuthStatePayload {
  userId: string;
  accountId: string;
  exp: number;
}

export function signOAuthState(payload: Omit<OAuthStatePayload, "exp">) {
  const full: OAuthStatePayload = { ...payload, exp: Date.now() + STATE_TTL_MS };
  const data = Buffer.from(JSON.stringify(full)).toString("base64url");
  const sig = crypto.createHmac("sha256", stateSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyOAuthState(state: string): OAuthStatePayload {
  const [data, sig] = state.split(".");
  if (!data || !sig) throw new Error("Invalid OAuth state");
  const expected = crypto.createHmac("sha256", stateSecret()).update(data).digest("base64url");
  if (sig !== expected) throw new Error("Invalid OAuth state signature");
  const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as OAuthStatePayload;
  if (payload.exp < Date.now()) throw new Error("OAuth state expired");
  return payload;
}

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://agrasentechnologies.com").replace(
    /\/$/,
    ""
  );
  if (!clientId || !clientSecret) {
    throw new Error("Google Calendar OAuth is not configured on the server.");
  }
  return {
    clientId,
    clientSecret,
    redirectUri: `${appUrl}/api/arm/integrations/google-calendar/callback`,
  };
}

export function buildGoogleAuthUrl(state: string) {
  const { clientId, redirectUri } = getGoogleOAuthConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.events",
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Token exchange failed");
  }
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getGoogleOAuthConfig();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Token refresh failed");
  }
  return data.access_token;
}

export function isGoogleCalendarConfigured() {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() && process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim()
  );
}
