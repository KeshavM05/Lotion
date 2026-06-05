import { NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { db } from '@/db';
import { oauthConnections } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/calendar/google/callback — handle OAuth callback, persist tokens
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state'); // internal userId
  const error = request.nextUrl.searchParams.get('error');

  if (error || !code || !state) {
    return Response.redirect(new URL('/settings?error=auth_failed', request.url));
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    return Response.redirect(new URL('/settings?error=config_missing', request.url));
  }

  try {
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
      console.error('Token exchange error:', tokens.error);
      return Response.redirect(new URL('/settings?error=token_failed', request.url));
    }

    // Fetch Google profile to get providerAccountId
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileRes.json();
    const providerAccountId = profile.id || 'unknown';

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Upsert into oauth_connections
    const existing = await db.query.oauthConnections.findFirst({
      where: and(eq(oauthConnections.userId, state), eq(oauthConnections.provider, 'google')),
    });

    if (existing) {
      await db
        .update(oauthConnections)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? existing.refreshToken,
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(oauthConnections.id, existing.id));
    } else {
      await db.insert(oauthConnections).values({
        userId: state,
        provider: 'google',
        providerAccountId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        expiresAt,
      });
    }

    return Response.redirect(new URL('/settings?connected=google', request.url));
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return Response.redirect(new URL('/settings?error=server_error', request.url));
  }
}
