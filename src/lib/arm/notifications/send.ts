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
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    return sendViaResend(resendKey, params);
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (smtpHost && smtpUser && smtpPass) {
    return sendViaSmtp(params, {
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
      user: smtpUser,
      pass: smtpPass,
    });
  }

  return { ok: false, error: "No email configured. Set RESEND_API_KEY or SMTP_* env vars." };
}

export function isPlatformEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY ||
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

async function sendViaResend(apiKey: string, params: SendEmailParams): Promise<SendEmailResult> {
  const from = params.from || process.env.EMAIL_FROM || "RIP <onboarding@resend.dev>";
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

  const from = params.from || `"RIP" <${smtp.user}>`;
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
