import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser } from '@/lib/auth-server';
import { getGoogleConnection } from '@/lib/google-calendar';
import { db } from '@/db';
import { oauthConnections } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET — check if Google Calendar is connected
export async function GET(request: NextRequest) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch {
    return Response.json({ connected: false });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ connected: false });

  const conn = await getGoogleConnection(user.id);
  return Response.json({
    connected: !!conn?.accessToken,
    email: conn ? null : null, // could fetch from Google profile if needed
  });
}

// DELETE — disconnect Google Calendar
export async function DELETE(request: NextRequest) {
  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

  const conn = await getGoogleConnection(user.id);
  if (conn) {
    // Revoke token with Google
    if (conn.accessToken) {
      await fetch(`https://oauth2.googleapis.com/revoke?token=${conn.accessToken}`, {
        method: 'POST',
      }).catch(() => {});
    }
    await db.delete(oauthConnections).where(eq(oauthConnections.id, conn.id));
  }

  return Response.json({ disconnected: true });
}
