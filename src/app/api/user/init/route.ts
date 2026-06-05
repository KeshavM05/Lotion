import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth, getAuthUserObject } from '@/lib/auth-server';

// POST /api/user/init - Initialize or get user from Supabase auth
export async function POST(request: NextRequest) {
  try {
    const supabaseUserId = await requireAuth(request);

    // Get Supabase user details
    const supabaseUser = await getAuthUserObject(request);

    if (!supabaseUser) {
      return Response.json({ error: 'Supabase user not found' }, { status: 404 });
    }

    // Check if user exists in our database
    let user = await db.query.users.findFirst({
      where: eq(users.supabaseId, supabaseUserId),
    });

    if (!user) {
      // Create new user from Supabase data
      [user] = await db
        .insert(users)
        .values({
          supabaseId: supabaseUserId,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
          aiMemory: '',
        })
        .returning();
    }

    return Response.json(user);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('POST /api/user/init error:', error);
    return Response.json({ error: 'Failed to initialize user' }, { status: 500 });
  }
}
