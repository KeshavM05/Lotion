import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const envInfo = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
  };

  // Debug: check which DB connection source is being used
  const cfSymbol = Symbol.for('__cloudflare-context__');
  const cfContext = (globalThis as Record<symbol, unknown>)[cfSymbol] as
    | { env?: { HYPERDRIVE?: { connectionString?: string } } }
    | undefined;
  const dbSource = cfContext?.env?.HYPERDRIVE?.connectionString
    ? 'hyperdrive'
    : process.env.DATABASE_URL
      ? 'DATABASE_URL'
      : 'none';

  let dbStatus = 'unknown';
  let dbError = '';
  try {
    await db.execute(sql`SELECT 1`);
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'unreachable';
    dbError = String(error);
  }

  let authStatus = 'skipped';
  let authError = '';
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const client = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data, error } = await client.auth.getUser(token);
      if (error) {
        authStatus = 'error';
        authError = error.message;
      } else if (data.user) {
        authStatus = 'ok';
      } else {
        authStatus = 'no_user';
      }
    } catch (error) {
      authStatus = 'exception';
      authError = String(error);
    }
  }

  return NextResponse.json({
    status: dbStatus === 'connected' ? 'ok' : 'error',
    db: dbStatus,
    dbSource,
    dbError: dbError || undefined,
    auth: authStatus,
    authError: authError || undefined,
    env: envInfo,
    timestamp: new Date().toISOString(),
  });
}
