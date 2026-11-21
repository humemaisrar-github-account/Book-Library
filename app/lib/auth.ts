import { betterAuth } from "better-auth";
import { getPool, isDatabaseConfigured } from "./db";

/** Better Auth refuses to run on its built-in default secret in production. */
const hasSecret = Boolean(process.env.BETTER_AUTH_SECRET);

/** True only when sign-in can actually work. */
export const isAuthConfigured = isDatabaseConfigured && hasSecret;

const socialProviders =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : undefined;

/**
 * Better Auth stores users and sessions in the same Postgres database as the
 * books. Google sign-in only switches on once its two keys are present, so the
 * app still runs with email and password alone.
 */
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: isDatabaseConfigured ? getPool() : undefined,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders,
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
});

/**
 * Looks up the session without ever throwing. Before the environment variables
 * are in place Better Auth raises, and a page that calls it directly would show
 * a blank server-error screen instead of something a reader can act on.
 */
export async function getSessionSafe(headers: Headers) {
  if (!isAuthConfigured) return null;
  try {
    return await auth.api.getSession({ headers });
  } catch (err) {
    console.error("Session lookup failed:", err);
    return null;
  }
}
