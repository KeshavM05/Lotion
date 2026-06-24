import { NextRequest } from 'next/server';
import { getInternalUser } from '@/lib/auth-server';
import { createClient } from '@supabase/supabase-js';

// GET /api/calendar/google — redirect to Google OAuth
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return Response.json({ error: 'Google Calendar not configured' }, { status: 500 });
  }

  // Token passed as query param since this is a browser navigation (no Auth header)
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return Response.redirect(new URL('/settings?error=auth_failed', request.url));
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const {
    data: { user: supaUser },
  } = await supabase.auth.getUser(token);
  if (!supaUser) {
    return Response.redirect(new URL('/settings?error=auth_failed', request.url));
  }

  const user = await getInternalUser(supaUser.id);
  if (!user) {
    return Response.redirect(new URL('/settings?error=auth_failed', request.url));
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
  authUrl.searchParams.set('state', user.id);

  return Response.redirect(authUrl.toString());
}
