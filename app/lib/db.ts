import { Pool } from "pg";

/**
 * One Postgres pool for the whole app: Better Auth stores its tables here and
 * the books API queries the same database, so there is a single connection
 * string to configure rather than a separate set of API keys.
 *
 * Use Supabase's *transaction pooler* connection string in serverless
 * environments — a direct connection runs out of slots quickly on Vercel.
 */
export const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

export const isDatabaseConfigured = Boolean(DATABASE_URL);

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not set.");
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      // Each serverless invocation is short-lived, so keep the footprint small.
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
      // Hosted Postgres (Supabase included) requires TLS; a local server has none.
      ssl: /localhost|127\.0\.0\.1/.test(DATABASE_URL) ? undefined : { rejectUnauthorized: false },
    });
  }
  return pool;
}

/** Runs a parameterised query and returns the rows. */
export async function query<T>(text: string, values: unknown[] = []): Promise<T[]> {
  const result = await getPool().query(text, values);
  return result.rows as T[];
}
