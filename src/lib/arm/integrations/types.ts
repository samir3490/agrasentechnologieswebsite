export type IntegrationSource = "workspace" | "platform" | "none";

export interface WorkspaceIntegrationsInput {
  openaiApiKey?: string;
  openaiModel?: string;
  mapboxAccessToken?: string;
  newsApiKey?: string;
  emailProvider?: "resend" | "smtp";
  resendApiKey?: string;
  emailFrom?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
  googleOAuthClientId?: string;
  googleOAuthClientSecret?: string;
}

export interface StoredWorkspaceIntegrations {
  openaiApiKey?: string;
  openaiModel?: string;
  mapboxAccessToken?: string;
  newsApiKey?: string;
  emailProvider?: "resend" | "smtp";
  resendApiKey?: string;
  emailFrom?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
  googleOAuthClientId?: string;
  googleOAuthClientSecret?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface MaskedWorkspaceIntegrations {
  openai: { configured: boolean; source: IntegrationSource; model?: string; apiKeyMask?: string | null };
  mapbox: { configured: boolean; source: IntegrationSource; tokenMask?: string | null };
  news: { configured: boolean; source: IntegrationSource; apiKeyMask?: string | null };
  email: {
    configured: boolean;
    source: IntegrationSource;
    provider?: "resend" | "smtp";
    emailFrom?: string;
    resendKeyMask?: string | null;
    smtpHost?: string;
    smtpUserMask?: string | null;
  };
  googleCalendar: {
    configured: boolean;
    source: IntegrationSource;
    clientId?: string;
    clientSecretMask?: string | null;
  };
  encryptionReady: boolean;
}

export interface ResolvedIntegrations {
  openai: {
    apiKey?: string;
    model: string;
    configured: boolean;
    source: IntegrationSource;
  };
  mapbox: {
    accessToken?: string;
    configured: boolean;
    source: IntegrationSource;
  };
  news: {
    apiKey?: string;
    configured: boolean;
    source: IntegrationSource;
  };
  email: {
    configured: boolean;
    source: IntegrationSource;
    provider?: "resend" | "smtp";
    from?: string;
    resendApiKey?: string;
    smtp?: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
    };
  };
  googleOAuth: {
    clientId?: string;
    clientSecret?: string;
    configured: boolean;
    source: IntegrationSource;
    redirectUri: string;
  };
}

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  source: IntegrationSource;
}
