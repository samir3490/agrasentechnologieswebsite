export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireAccountAdmin, requireAccountAccess } from "@/lib/arm/auth/account-access";
import { getAdminDb } from "@/lib/arm/firebase/admin";
import { getMaskedWorkspaceIntegrations, saveWorkspaceIntegrations } from "@/lib/arm/integrations/store";
import { isIntegrationsEncryptionConfigured } from "@/lib/arm/integrations/crypto";

const patchSchema = z.object({
  openaiApiKey: z.string().optional(),
  openaiModel: z.string().max(80).optional(),
  mapboxAccessToken: z.string().optional(),
  newsApiKey: z.string().optional(),
  emailProvider: z.enum(["resend", "smtp"]).optional(),
  resendApiKey: z.string().optional(),
  emailFrom: z.string().max(200).optional(),
  smtpHost: z.string().max(200).optional(),
  smtpPort: z.number().min(1).max(65535).optional(),
  smtpSecure: z.boolean().optional(),
  smtpUser: z.string().max(200).optional(),
  smtpPass: z.string().optional(),
  googleOAuthClientId: z.string().max(200).optional(),
  googleOAuthClientSecret: z.string().optional(),
  clearOpenaiApiKey: z.boolean().optional(),
  clearMapboxAccessToken: z.boolean().optional(),
  clearNewsApiKey: z.boolean().optional(),
  clearResendApiKey: z.boolean().optional(),
  clearSmtpPass: z.boolean().optional(),
  clearGoogleOAuthClientSecret: z.boolean().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(_request);
    const { id: accountId } = await params;
    await requireAccountAccess(accountId, user.uid);

    const masked = await getMaskedWorkspaceIntegrations(getAdminDb(), accountId);
    return NextResponse.json(masked);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id: accountId } = await params;
    await requireAccountAdmin(accountId, user.uid);

    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const hasSecretUpdate = [
      parsed.data.openaiApiKey,
      parsed.data.mapboxAccessToken,
      parsed.data.newsApiKey,
      parsed.data.resendApiKey,
      parsed.data.smtpPass,
      parsed.data.googleOAuthClientSecret,
    ].some((v) => v !== undefined && v !== "");

    if (hasSecretUpdate && !isIntegrationsEncryptionConfigured()) {
      return NextResponse.json(
        {
          error: "Server encryption is not configured. Ask the platform operator to set INTEGRATIONS_ENCRYPTION_KEY.",
        },
        { status: 503 }
      );
    }

    const input = { ...parsed.data };
    if (parsed.data.clearOpenaiApiKey) input.openaiApiKey = "";
    if (parsed.data.clearMapboxAccessToken) input.mapboxAccessToken = "";
    if (parsed.data.clearNewsApiKey) input.newsApiKey = "";
    if (parsed.data.clearResendApiKey) input.resendApiKey = "";
    if (parsed.data.clearSmtpPass) input.smtpPass = "";
    if (parsed.data.clearGoogleOAuthClientSecret) input.googleOAuthClientSecret = "";

    await saveWorkspaceIntegrations(getAdminDb(), accountId, input, user.uid);
    const masked = await getMaskedWorkspaceIntegrations(getAdminDb(), accountId);
    return NextResponse.json(masked);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
