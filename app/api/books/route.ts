import { NextResponse } from "next/server";
import { BOOKS_TABLE, BOOK_COLUMNS, getSupabase, isSupabaseConfigured } from "../../lib/supabase";
import type { Book, BookInput } from "../../lib/types";

// Books come from Supabase, so this route must never be cached or prerendered.
export const dynamic = "force-dynamic";

const SETUP_MESSAGE =
  "Database not connected yet. Add your Supabase project URL and anon key as environment variables, then redeploy. See README.";

/** Surfaces the real Supabase message (e.g. a missing table) instead of a generic failure. */
function describe(err: unknown, fallback: string): string {
  const message = typeof err === "object" && err !== null && "message" in err ? String((err as { message: unknown }).message) : "";
  return message ? `${fallback} ${message}` : fallback;
}

/** Returned when the env vars are missing, so the app shows a setup hint instead of crashing. */
const notConfigured = () => NextResponse.json({ message: SETUP_MESSAGE }, { status: 503 });

/** Validates and cleans user input. Returns an error message or the cleaned fields. */
function parseInput(raw: unknown): { error: string } | { data: BookInput } {
  if (typeof raw !== "object" || raw === null) return { error: "Invalid request body." };
  const r = raw as Record<string, unknown>;

  const title = typeof r.title === "string" ? r.title.trim() : "";
  const author = typeof r.author === "string" ? r.author.trim() : "";
  if (!title) return { error: "Title is required." };
  if (!author) return { error: "Author is required." };
  if (title.length > 150 || author.length > 100) return { error: "Title or author is too long." };

  const image = typeof r.image === "string" ? r.image : "";
  // Vercel caps request bodies at ~4.5 MB; covers are resized client-side, this is the backstop.
  if (image.length > 2_000_000) return { error: "That cover image is too large. Please pick a smaller one." };

  const rating = Number(r.rating ?? 0);
  return {
    data: {
      title,
      author,
      image,
      available: r.available === undefined ? true : Boolean(r.available),
      genre: typeof r.genre === "string" && r.genre.trim() ? r.genre.trim() : "Other",
      rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, Math.round(rating))) : 0,
    },
  };
}

// GET /api/books -> every book, oldest first
export async function GET() {
  if (!isSupabaseConfigured) return notConfigured();
  try {
    const { data, error } = await getSupabase()
      .from(BOOKS_TABLE)
      .select(BOOK_COLUMNS)
      .order("id", { ascending: true });

    if (error) throw error;
    return NextResponse.json((data ?? []) as Book[], { status: 200 });
  } catch (err) {
    console.error("GET /api/books failed:", err);
    return NextResponse.json({ message: describe(err, "Could not load the books.") }, { status: 500 });
  }
}

// POST /api/books -> the created book
export async function POST(req: Request) {
  if (!isSupabaseConfigured) return notConfigured();
  try {
    const parsed = parseInput(await req.json());
    if ("error" in parsed) return NextResponse.json({ message: parsed.error }, { status: 400 });

    const { data, error } = await getSupabase()
      .from(BOOKS_TABLE)
      .insert(parsed.data)
      .select(BOOK_COLUMNS)
      .single();

    if (error) throw error;
    return NextResponse.json(data as Book, { status: 201 });
  } catch (err) {
    console.error("POST /api/books failed:", err);
    return NextResponse.json({ message: describe(err, "Could not add the book.") }, { status: 500 });
  }
}

// PUT /api/books -> the updated book
export async function PUT(req: Request) {
  if (!isSupabaseConfigured) return notConfigured();
  try {
    const body = await req.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id)) return NextResponse.json({ message: "A valid book id is required." }, { status: 400 });

    const db = getSupabase();
    const { data: existing, error: findError } = await db
      .from(BOOKS_TABLE)
      .select(BOOK_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (findError) throw findError;
    if (!existing) return NextResponse.json({ message: "Book not found." }, { status: 404 });

    // Merge so a partial update (just a rating, say) keeps the other fields.
    const parsed = parseInput({ ...existing, ...body });
    if ("error" in parsed) return NextResponse.json({ message: parsed.error }, { status: 400 });

    const { data, error } = await db
      .from(BOOKS_TABLE)
      .update(parsed.data)
      .eq("id", id)
      .select(BOOK_COLUMNS)
      .single();

    if (error) throw error;
    return NextResponse.json(data as Book, { status: 200 });
  } catch (err) {
    console.error("PUT /api/books failed:", err);
    return NextResponse.json({ message: describe(err, "Could not update the book.") }, { status: 500 });
  }
}

// DELETE /api/books
export async function DELETE(req: Request) {
  if (!isSupabaseConfigured) return notConfigured();
  try {
    const { id } = await req.json();
    const bookId = Number(id);
    if (!Number.isInteger(bookId)) return NextResponse.json({ message: "A valid book id is required." }, { status: 400 });

    const { data, error } = await getSupabase()
      .from(BOOKS_TABLE)
      .delete()
      .eq("id", bookId)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ message: "Book not found." }, { status: 404 });
    return NextResponse.json({ message: "Book deleted." }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/books failed:", err);
    return NextResponse.json({ message: describe(err, "Could not delete the book.") }, { status: 500 });
  }
}
