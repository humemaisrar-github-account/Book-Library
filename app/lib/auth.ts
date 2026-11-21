import { betterAuth } from "better-auth";
import { getPool, isDatabaseConfigured } from "./db";

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
