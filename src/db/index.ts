import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

function getConnectionString(): string {
  // Try Cloudflare Hyperdrive via the global symbol (set by the worker runtime)
  const cfSymbol = Symbol.for('__cloudflare-context__');
  const cfContext = (globalThis as Record<symbol, unknown>)[cfSymbol] as
    | { env?: { HYPERDRIVE?: { connectionString?: string } } }
    | undefined;
  if (cfContext?.env?.HYPERDRIVE?.connectionString) {
    return cfContext.env.HYPERDRIVE.connectionString;
  }

  // Fallback to DATABASE_URL env var (local dev / non-CF environments)
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      'No database connection string available (neither Hyperdrive nor DATABASE_URL)'
    );
  }
  return dbUrl;
}

export const db: PostgresJsDatabase<typeof schema> = new Proxy(
  {} as PostgresJsDatabase<typeof schema>,
  {
    get(_, prop) {
      const connectionString = getConnectionString();
      const queryClient = postgres(connectionString, { prepare: false });
      const instance = drizzle(queryClient, { schema });
      return (instance as unknown as Record<string, unknown>)[prop as string];
    },
  }
);
