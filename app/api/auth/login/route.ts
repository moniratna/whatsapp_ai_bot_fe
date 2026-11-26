import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, credentialsMatch, SESSION_COOKIE, sessionLifetimeSeconds } from '@/lib/auth';

export async function POST(request: NextRequest) {
  let body: { username?: unknown; password?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Enter your username and password.' }, { status: 400 }); }
  if (typeof body.username !== 'string' || typeof body.password !== 'string' || !credentialsMatch(body.username, body.password)) {
    return NextResponse.json({ error: 'The username or password is incorrect.' }, { status: 401 });
  }
  let token: string;
  try { token = createSessionToken(); } catch { return NextResponse.json({ error: 'Login is not configured on the server.' }, { status: 503 }); }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionLifetimeSeconds,
  });
  return response;
}
