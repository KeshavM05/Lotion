import { NextRequest } from 'next/server';
import { requireAuth, getInternalUser } from '@/lib/auth-server';

// GET /api/calendar/google — redirect to Google OAuth
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return Response.json({ error: 'Google Calendar not configured' }, { status: 500 });
  }

  let supabaseUserId: string;
  try {
    supabaseUserId = await requireAuth(request);
  } catch {
    return Response.redirect(new URL('/auth', request.url));
  }

  const user = await getInternalUser(supabaseUserId);
  if (!user) {
    return Response.redirect(new URL('/auth', request.url));
  }

  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scopes.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  // Pass internal user id through state so callback can associate tokens
  authUrl.searchParams.set('state', user.id);

  return Response.redirect(authUrl.toString());
}
