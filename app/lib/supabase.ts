import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

/** True when both env vars are present, so routes can fail with a clear message. */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client, created on first use.
 * The keys are read from env vars without the NEXT_PUBLIC_ prefix,
 * so they never reach the browser.
 */
export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
  }
  if (!client) {
    client = createClient(url, anonKey, { auth: { persistSession: false } });
  }
  return client;
}

export const BOOKS_TABLE = "books";
export const BOOK_COLUMNS = "id, title, author, image, available, genre, rating";
