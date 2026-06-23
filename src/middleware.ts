import { NextRequest, NextResponse } from 'next/server';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * CSRF protection via Origin/Host header validation.
 *
 * The app uses Authorization: Bearer JWT tokens for auth — bearer token auth
 * is inherently CSRF-safe because browsers can't be tricked into sending
 * custom Authorization headers cross-origin. This middleware adds defense-in-
 * depth by rejecting mutation requests whose Origin doesn't match the host,
 * blocking any cookie-based CSRF vectors that may be added in the future.
 */
export function middleware(request: NextRequest) {
  if (!MUTATION_METHODS.has(request.method)) {
    return NextResponse.next();
  }

  // Only enforce on API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // Allow requests with no Origin header (server-to-server, curl, etc.)
  // Real CSRF attacks always carry an Origin.
  if (!origin) {
    return NextResponse.next();
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return NextResponse.json({ error: 'Forbidden: malformed Origin header' }, { status: 403 });
  }

  if (originHost !== host) {
    return NextResponse.json({ error: 'Forbidden: cross-origin request blocked' }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
