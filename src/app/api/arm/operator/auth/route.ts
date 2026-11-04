export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createOperatorToken, getOperatorPassword } from "@/lib/arm/operator/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const expected = getOperatorPassword();
    if (!expected || !body.password || body.password !== expected) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    const token = createOperatorToken(body.password);
    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
