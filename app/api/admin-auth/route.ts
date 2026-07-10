import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// ADMIN_PASSWORD (no NEXT_PUBLIC_ prefix) — never sent to the browser
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_COOKIE = "cfo_admin_session";
const SESSION_VALUE = "authenticated";

export async function POST(req: Request) {
  const body = await req.json();

  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin not configured." }, { status: 500 });
  }

  if (body.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  // Set a session cookie so they stay logged in while browsing admin
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
  return response;
}

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return NextResponse.json({ authenticated: session?.value === SESSION_VALUE });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
