import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

function getDbConfig(): { connectionString: string; isHyperdrive: boolean } {
  // Prefer DATABASE_URL if set (works on both CF Workers via TCP and local dev)
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    return { connectionString: dbUrl, isHyperdrive: false };
  }

  // Try Cloudflare Hyperdrive via the global symbol (set by the worker runtime)
  const cfSymbol = Symbol.for('__cloudflare-context__');
  const cfContext = (globalThis as Record<symbol, unknown>)[cfSymbol] as
    | { env?: { HYPERDRIVE?: { connectionString?: string } } }
    | undefined;
  if (cfContext?.env?.HYPERDRIVE?.connectionString) {
    return { connectionString: cfContext.env.HYPERDRIVE.connectionString, isHyperdrive: true };
  }

  throw new Error('No database connection string available (neither DATABASE_URL nor Hyperdrive)');
}

export const db: PostgresJsDatabase<typeof schema> = new Proxy(
  {} as PostgresJsDatabase<typeof schema>,
  {
    get(_, prop) {
      const { connectionString, isHyperdrive } = getDbConfig();
      const queryClient = postgres(connectionString, {
        prepare: false,
        ssl: isHyperdrive ? false : undefined,
      });
      const instance = drizzle(queryClient, { schema });
      return (instance as unknown as Record<string, unknown>)[prop as string];
    },
  }
);
