import { NextRequest } from 'next/server';
import { env } from '@/lib/env';

// GET /api/calendar/google/callback — handle OAuth callback
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const error = request.nextUrl.searchParams.get('error');

  if (error || !code) {
    return Response.redirect(new URL('/calendar?error=auth_failed', request.url));
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    return Response.redirect(new URL('/calendar?error=config_missing', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();

    if (tokens.error) {
      return Response.redirect(new URL('/calendar?error=token_failed', request.url));
    }

    // For now, store tokens in a cookie (in production, store in DB)
    const response = Response.redirect(new URL('/calendar?connected=google', request.url));
    // In a real app, encrypt and store these securely
    response.headers.set(
      'Set-Cookie',
      `google_calendar_token=${tokens.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${tokens.expires_in}`
    );

    return response;
  } catch {
    return Response.redirect(new URL('/calendar?error=server_error', request.url));
  }
}
