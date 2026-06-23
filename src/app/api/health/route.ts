import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json(
      { status: 'ok', db: 'connected', timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error('[health] DB ping failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        db: 'unreachable',
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
