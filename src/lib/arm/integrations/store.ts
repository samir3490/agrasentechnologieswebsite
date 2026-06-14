import type { Firestore } from "firebase-admin/firestore";
import {
  decryptSecret,
  encryptSecret,
  hasSecretValue,
  isIntegrationsEncryptionConfigured,
  maskSecret,
} from "./crypto";
import type {
  MaskedWorkspaceIntegrations,
  StoredWorkspaceIntegrations,
  WorkspaceIntegrationsInput,
} from "./types";

const DOC_PATH = (accountId: string) => `ripAccounts/${accountId}/private/integrations`;

const SECRET_FIELDS = [
  "openaiApiKey",
  "mapboxAccessToken",
  "newsApiKey",
  "resendApiKey",
  "smtpPass",
  "googleOAuthClientSecret",
] as const;

function decryptStored(stored: StoredWorkspaceIntegrations): StoredWorkspaceIntegrations {
  const out = { ...stored };
  for (const field of SECRET_FIELDS) {
    const value = out[field];
    if (value) out[field] = decryptSecret(value);
  }
  return out;
}

function encryptField(value?: string) {
  if (!value?.trim()) return undefined;
  return encryptSecret(value.trim());
}

export async function getStoredWorkspaceIntegrations(
  db: Firestore,
  accountId: string
): Promise<StoredWorkspaceIntegrations | null> {
  const snap = await db.doc(DOC_PATH(accountId)).get();
  if (!snap.exists) return null;
  return decryptStored(snap.data() as StoredWorkspaceIntegrations);
}

export async function saveWorkspaceIntegrations(
  db: Firestore,
  accountId: string,
  input: WorkspaceIntegrationsInput,
  userId: string
) {
  const ref = db.doc(DOC_PATH(accountId));
  const existing = (await ref.get()).data() as StoredWorkspaceIntegrations | undefined;
  const next: StoredWorkspaceIntegrations = { ...(existing || {}), updatedAt: new Date().toISOString(), updatedBy: userId };

  if (input.openaiApiKey !== undefined) {
    next.openaiApiKey = input.openaiApiKey ? encryptField(input.openaiApiKey) : undefined;
  }
  if (input.openaiModel !== undefined) next.openaiModel = input.openaiModel || undefined;
  if (input.mapboxAccessToken !== undefined) {
    next.mapboxAccessToken = input.mapboxAccessToken ? encryptField(input.mapboxAccessToken) : undefined;
  }
  if (input.newsApiKey !== undefined) {
    next.newsApiKey = input.newsApiKey ? encryptField(input.newsApiKey) : undefined;
  }
  if (input.emailProvider !== undefined) next.emailProvider = input.emailProvider;
  if (input.resendApiKey !== undefined) {
    next.resendApiKey = input.resendApiKey ? encryptField(input.resendApiKey) : undefined;
  }
  if (input.emailFrom !== undefined) next.emailFrom = input.emailFrom || undefined;
  if (input.smtpHost !== undefined) next.smtpHost = input.smtpHost || undefined;
  if (input.smtpPort !== undefined) next.smtpPort = input.smtpPort;
  if (input.smtpSecure !== undefined) next.smtpSecure = input.smtpSecure;
  if (input.smtpUser !== undefined) next.smtpUser = input.smtpUser || undefined;
  if (input.smtpPass !== undefined) {
    next.smtpPass = input.smtpPass ? encryptField(input.smtpPass) : undefined;
  }
  if (input.googleOAuthClientId !== undefined) {
    next.googleOAuthClientId = input.googleOAuthClientId || undefined;
  }
  if (input.googleOAuthClientSecret !== undefined) {
    next.googleOAuthClientSecret = input.googleOAuthClientSecret
      ? encryptField(input.googleOAuthClientSecret)
      : undefined;
  }

  await ref.set(next, { merge: true });
  return next;
}

export async function getMaskedWorkspaceIntegrations(
  db: Firestore,
  accountId: string
): Promise<MaskedWorkspaceIntegrations> {
  const stored = await getStoredWorkspaceIntegrations(db, accountId);
  const platformOpenAi = Boolean(process.env.OPENAI_API_KEY?.trim());
  const platformMapbox = Boolean(
    process.env.MAPBOX_ACCESS_TOKEN?.trim() || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim()
  );
  const platformNews = Boolean(process.env.NEWS_API_KEY?.trim());
  const platformEmail = Boolean(
    process.env.RESEND_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  );
  const platformGoogle = Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() && process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim()
  );

  const wsOpenAi = hasSecretValue(stored?.openaiApiKey);
  const wsMapbox = hasSecretValue(stored?.mapboxAccessToken);
  const wsNews = hasSecretValue(stored?.newsApiKey);
  const wsEmailResend = hasSecretValue(stored?.resendApiKey);
  const wsEmailSmtp = Boolean(stored?.smtpHost && stored?.smtpUser && hasSecretValue(stored?.smtpPass));
  const wsGoogle = Boolean(stored?.googleOAuthClientId && hasSecretValue(stored?.googleOAuthClientSecret));

  return {
    openai: {
      configured: wsOpenAi || platformOpenAi,
      source: wsOpenAi ? "workspace" : platformOpenAi ? "platform" : "none",
      model: stored?.openaiModel || process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
      apiKeyMask: wsOpenAi ? maskSecret(stored?.openaiApiKey) : platformOpenAi ? "platform" : null,
    },
    mapbox: {
      configured: wsMapbox || platformMapbox,
      source: wsMapbox ? "workspace" : platformMapbox ? "platform" : "none",
      tokenMask: wsMapbox ? maskSecret(stored?.mapboxAccessToken) : platformMapbox ? "platform" : null,
    },
    news: {
      configured: wsNews || platformNews || true,
      source: wsNews ? "workspace" : platformNews ? "platform" : "none",
      apiKeyMask: wsNews ? maskSecret(stored?.newsApiKey) : platformNews ? "platform" : null,
    },
    email: {
      configured: wsEmailResend || wsEmailSmtp || platformEmail,
      source: wsEmailResend || wsEmailSmtp ? "workspace" : platformEmail ? "platform" : "none",
      provider: stored?.emailProvider || (process.env.RESEND_API_KEY ? "resend" : "smtp"),
      emailFrom: stored?.emailFrom || process.env.EMAIL_FROM,
      resendKeyMask: wsEmailResend ? maskSecret(stored?.resendApiKey) : null,
      smtpHost: stored?.smtpHost,
      smtpUserMask: stored?.smtpUser ? maskSecret(stored.smtpUser) : null,
    },
    googleCalendar: {
      configured: wsGoogle || platformGoogle,
      source: wsGoogle ? "workspace" : platformGoogle ? "platform" : "none",
      clientId: stored?.googleOAuthClientId || process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecretMask: wsGoogle
        ? maskSecret(stored?.googleOAuthClientSecret)
        : platformGoogle
          ? "platform"
          : null,
    },
    encryptionReady: isIntegrationsEncryptionConfigured(),
  };
}
