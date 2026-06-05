import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { env } from "@/lib/env";

// Singleton pattern for dev to prevent connection exhaustion on hot reload
declare global {
  // eslint-disable-next-line no-var
  var _pgClient: postgres.Sql | undefined;
}

function createClient() {
  return postgres(env.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

const queryClient =
  process.env.NODE_ENV === "production"
    ? createClient()
    : (globalThis._pgClient ??= createClient());

export const db = drizzle(queryClient, { schema });
