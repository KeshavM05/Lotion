import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { env } from '@/lib/env';

const queryClient = postgres(env.DATABASE_URL, {
  prepare: false,
});

export const db = drizzle(queryClient, { schema });
