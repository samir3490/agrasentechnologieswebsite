import type { NextRequest } from "next/server";

export function getCronSecret(): string | undefined {
  return process.env.CRON_SECRET?.trim() || undefined;
}

export function isVercelCronRequest(request: NextRequest): boolean {
  return (
    request.headers.get("x-vercel-cron-schedule") != null ||
    request.headers.get("user-agent")?.includes("vercel-cron") === true
  );
}

export function isCronAuthorized(request: NextRequest): boolean {
  if (isVercelCronRequest(request)) return true;

  const secret = getCronSecret();
  if (!secret) return false;

  const auth = request.headers.get("authorization")?.trim();
  if (auth === `Bearer ${secret}`) return true;
  if (auth === secret) return true;

  return false;
}
