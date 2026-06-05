import { db } from '@/db';
import { oauthConnections } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getGoogleAccessToken(userId: string): Promise<string | null> {
  const conn = await db.query.oauthConnections.findFirst({
    where: and(eq(oauthConnections.userId, userId), eq(oauthConnections.provider, 'google')),
  });

  if (!conn?.accessToken) return null;

  // Refresh if expired (with 60s buffer)
  const needsRefresh = conn.expiresAt && conn.expiresAt.getTime() < Date.now() + 60_000;
  if (!needsRefresh) return conn.accessToken;

  if (!conn.refreshToken) return null;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: conn.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json();
  if (data.error || !data.access_token) return null;

  await db
    .update(oauthConnections)
    .set({
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      updatedAt: new Date(),
    })
    .where(eq(oauthConnections.id, conn.id));

  return data.access_token;
}

export async function getGoogleConnection(userId: string) {
  return db.query.oauthConnections.findFirst({
    where: and(eq(oauthConnections.userId, userId), eq(oauthConnections.provider, 'google')),
  });
}
