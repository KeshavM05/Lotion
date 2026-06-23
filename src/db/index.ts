import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { env } from '@/lib/env';

function getConnectionString(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.HYPERDRIVE?.connectionString) {
      return ctx.env.HYPERDRIVE.connectionString;
    }
  } catch {
    // Not running on Cloudflare, use local env
  }
  return env.DATABASE_URL;
}

export const db: PostgresJsDatabase<typeof schema> = new Proxy(
  {} as PostgresJsDatabase<typeof schema>,
  {
    get(_, prop) {
      const connectionString = getConnectionString();
      const queryClient = postgres(connectionString, {
        prepare: false,
      });
      const instance = drizzle(queryClient, { schema });
      return (instance as unknown as Record<string, unknown>)[prop as string];
    },
  }
);
