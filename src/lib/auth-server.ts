import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { env } from "@/lib/env";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Server-side Supabase client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Get authenticated user from request
 * Validates JWT token and returns user ID
 */
export async function getAuthUser(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify JWT token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

/**
 * Get authenticated user object from request
 */
export async function getAuthUserObject(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

/**
 * Require authentication middleware
 * Returns user ID or throws 401 error response
 */
export async function requireAuth(request: NextRequest): Promise<string> {
  const userId = await getAuthUser(request);
  if (!userId) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return userId;
}

/**
 * Get internal user record from Supabase user ID
 * Helper to avoid repeating this lookup in every route
 */
export async function getInternalUser(supabaseUserId: string) {
  const { db } = await import("@/db");
  const { users } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const user = await db.query.users.findFirst({
    where: eq(users.supabaseId, supabaseUserId),
  });

  return user;
}
