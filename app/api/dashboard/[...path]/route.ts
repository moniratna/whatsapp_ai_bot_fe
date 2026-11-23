import { NextRequest, NextResponse } from 'next/server';

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: RouteContext) {
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
      method: 'GET',
      headers: { 'X-Dashboard-Key': dashboardKey, Accept: 'application/json' },
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
