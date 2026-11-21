import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase hands out its keys under different names depending on where you copy
 * them from: its own Next.js quickstart suggests the NEXT_PUBLIC_* pair, while
 * the project settings page calls them the project URL and anon key. Accept all
 * of them so the app connects whichever pair is set.
 *
 * Each name is written out in full on purpose: Next.js only inlines
 * `process.env.NEXT_PUBLIC_X` when it appears literally in the source.
 */
const url =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";

const key =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

/** True when both values are present, so routes can fail with a clear message. */
export const isSupabaseConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/** Returns a server-side Supabase client, created on first use. */
export function getSupabase(): SupabaseClient {
  if (!url || !key) {
    throw new Error("Supabase is not configured.");
  }
  if (!client) {
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}

export const BOOKS_TABLE = "books";
export const BOOK_COLUMNS = "id, title, author, image, available, genre, rating";
