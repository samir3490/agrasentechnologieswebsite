import type { ResolvedIntegrations } from "@/lib/arm/integrations/types";

export interface SendEmailResult {
  ok: boolean;
  error?: string;
  provider?: "resend" | "smtp";
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  return sendEmailWithIntegrations(params);
}

export async function sendEmailWithIntegrations(
  params: SendEmailParams,
  integrations?: ResolvedIntegrations
): Promise<SendEmailResult> {
  const resendKey = integrations?.email.resendApiKey || process.env.RESEND_API_KEY;
  if (resendKey) {
    const from =
      params.from ||
      integrations?.email.from ||
      process.env.EMAIL_FROM ||
      "AI Relationship Manager <onboarding@resend.dev>";
    return sendViaResend(resendKey, { ...params, from });
  }

  const smtp = integrations?.email.smtp;
  const smtpHost = smtp?.host || process.env.SMTP_HOST;
  const smtpUser = smtp?.user || process.env.SMTP_USER;
  const smtpPass = smtp?.pass || process.env.SMTP_PASS;
  if (smtpHost && smtpUser && smtpPass) {
    return sendViaSmtp(params, {
      host: smtpHost,
      port: smtp?.port ?? Number(process.env.SMTP_PORT || 587),
      secure: smtp?.secure ?? (Number(process.env.SMTP_PORT) === 465),
      user: smtpUser,
      pass: smtpPass,
    });
  }

  return {
    ok: false,
    error: "No email configured. Add workspace email in Settings → Connections, or set platform RESEND/SMTP env vars.",
  };
}

export function isPlatformEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY ||
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

export function isEmailConfigured(integrations?: ResolvedIntegrations): boolean {
  return Boolean(
    integrations?.email.configured ||
      isPlatformEmailConfigured()
  );
}

async function sendViaResend(apiKey: string, params: SendEmailParams): Promise<SendEmailResult> {
  const from = params.from || process.env.EMAIL_FROM || "AI Relationship Manager <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!res.ok) {
    return { ok: false, error: await res.text(), provider: "resend" };
  }
  return { ok: true, provider: "resend" };
}

async function sendViaSmtp(
  params: SendEmailParams,
  smtp: { host: string; port: number; secure: boolean; user: string; pass: string }
): Promise<SendEmailResult> {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  const from = params.from || `"AI Relationship Manager" <${smtp.user}>`;
  try {
    await transporter.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
    return { ok: true, provider: "smtp" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "SMTP send failed", provider: "smtp" };
  }
}
