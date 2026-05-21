import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const token = btoa(password + Date.now().toString().slice(0, -4));

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
