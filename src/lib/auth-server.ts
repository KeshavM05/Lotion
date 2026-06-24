import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { env } from '@/lib/env';

let _supabaseAdmin: SupabaseClient | undefined;

function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}

/**
 * Get authenticated user from request
 * Validates JWT token and returns user ID
 */
export async function getAuthUser(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify JWT token with Supabase
    const {
      data: { user },
      error,
    } = await getSupabaseAdmin().auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Get authenticated user object from request
 */
export async function getAuthUserObject(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error,
    } = await getSupabaseAdmin().auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export { AuthError };

/**
 * Require authentication middleware
 * Returns user ID or throws AuthError
 */
export async function requireAuth(request: NextRequest): Promise<string> {
  const userId = await getAuthUser(request);
  if (!userId) {
    throw new AuthError('Unauthorized', 401);
  }
  return userId;
}

/**
 * Get internal user record from Supabase user ID
 * Helper to avoid repeating this lookup in every route
 */
export async function getInternalUser(supabaseUserId: string) {
  const { db } = await import('@/db');
  const { users } = await import('@/db/schema');
  const { eq } = await import('drizzle-orm');

  const user = await db.query.users.findFirst({
    where: eq(users.supabaseId, supabaseUserId),
  });

  return user;
}
