/**
 * Clerk handles accounts; the books live in Supabase Postgres via DATABASE_URL.
 * Both keys are checked so a half-configured deployment can say so plainly
 * instead of throwing a blank server error.
 *
 * The publishable key is written out in full because Next.js only inlines
 * `process.env.NEXT_PUBLIC_X` when it appears literally in the source.
 */
export const isAuthConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

/** Names of whatever is still missing, for the setup notice. */
export function missingAuthEnv(): string[] {
  return [
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" : null,
    !process.env.CLERK_SECRET_KEY ? "CLERK_SECRET_KEY" : null,
    !process.env.DATABASE_URL && !process.env.POSTGRES_URL ? "DATABASE_URL" : null,
  ].filter(Boolean) as string[];
}
