import { NextResponse } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { auth, isAuthConfigured } from "../../../lib/auth";

const handlers = toNextJsHandler(auth);

/**
 * Without a database Better Auth quietly falls back to in-memory storage: a
 * sign-up then returns 200 while nothing is actually saved, and the account is
 * gone on the next request. Refuse outright instead, so the failure is obvious.
 */
const notConfigured = () =>
  NextResponse.json(
    { message: "Accounts are not available yet: the database is not connected. See README." },
    { status: 503 },
  );

export const GET = (req: Request) => (isAuthConfigured ? handlers.GET(req) : notConfigured());
export const POST = (req: Request) => (isAuthConfigured ? handlers.POST(req) : notConfigured());
