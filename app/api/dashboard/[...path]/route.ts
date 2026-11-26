import { NextRequest, NextResponse } from 'next/server';
import { isValidSessionToken, SESSION_COOKIE } from '@/lib/auth';

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: RouteContext) {
  try {
    if (!isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value)) {
      return NextResponse.json({ detail: 'Sign in to access the dashboard.' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ detail: 'Dashboard login is not configured.' }, { status: 503 });
  }
  const backendUrl = process.env.BACKEND_API_URL;
  const dashboardKey = process.env.DASHBOARD_API_KEY;
  if (!backendUrl || !dashboardKey) {
    return NextResponse.json(
      { detail: 'Set BACKEND_API_URL and DASHBOARD_API_KEY in the frontend environment.' },
      { status: 503 },
    );
  }

  const { path } = await context.params;
  const upstream = new URL(`/api/v1/dashboard/${path.map(encodeURIComponent).join('/')}`, backendUrl);
  upstream.search = request.nextUrl.search;

  try {
    const response = await fetch(upstream, {
      method: request.method,
      headers: {
        'X-Dashboard-Key': dashboardKey,
        Accept: 'application/json',
        ...(request.headers.get('content-type') ? { 'Content-Type': request.headers.get('content-type')! } : {}),
      },
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    });
    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ detail: 'Dashboard backend is unavailable.' }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
