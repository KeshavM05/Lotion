import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { env } from '@/lib/env';

let _db: PostgresJsDatabase<typeof schema> | undefined;

function getConnectionString(): string {
  // On Cloudflare Workers, Hyperdrive provides the connection string
  // OpenNext exposes bindings via process.env
  const hyperdrive = (process.env as Record<string, unknown>).HYPERDRIVE as
    | { connectionString: string }
    | undefined;
  if (hyperdrive?.connectionString) {
    return hyperdrive.connectionString;
  }
  return env.DATABASE_URL;
}

export const db: PostgresJsDatabase<typeof schema> = new Proxy(
  {} as PostgresJsDatabase<typeof schema>,
  {
    get(_, prop) {
      if (!_db) {
        const queryClient = postgres(getConnectionString(), {
          prepare: false,
        });
        _db = drizzle(queryClient, { schema });
      }
      return (_db as unknown as Record<string, unknown>)[prop as string];
    },
  }
);
