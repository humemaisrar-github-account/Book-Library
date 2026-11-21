import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isDatabaseConfigured, query } from "../../lib/db";
import { isAuthConfigured } from "../../lib/auth-config";
import type { Book, BookInput } from "../../lib/types";

// Every response depends on the signed-in user, so nothing here may be cached.
export const dynamic = "force-dynamic";

const SETUP_MESSAGE =
  "Database not connected yet. Set DATABASE_URL, then redeploy. See README.";

// node-postgres hands bigint back as a string, so the id is cast to int here
// and the API keeps the number type the client expects.
const COLUMNS = `id::int as id, title, author, image, available, genre, rating`;

/** The signed-in Clerk user's id, or null when nobody is signed in. */
async function currentUserId(): Promise<string | null> {
  if (!isAuthConfigured) return null;
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

const unauthorized = () =>
  NextResponse.json({ message: "Please sign in to see your library." }, { status: 401 });

/** Surfaces the real Postgres message (a missing table, say) instead of a generic failure. */
function describe(err: unknown, fallback: string): string {
  const message =
    typeof err === "object" && err !== null && "message" in err
      ? String((err as { message: unknown }).message)
      : "";
  return message ? `${fallback} ${message}` : fallback;
}

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
  // Vercel caps request bodies at ~4.5 MB; covers are resized in the browser, this is the backstop.
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

// GET /api/books -> the signed-in user's books
export async function GET() {
  if (!isDatabaseConfigured) return NextResponse.json({ message: SETUP_MESSAGE }, { status: 503 });
  try {
    const userId = await currentUserId();
    if (!userId) return unauthorized();

    const rows = await query<Book>(
      `select ${COLUMNS} from public.books where user_id = $1 order by id asc`,
      [userId],
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("GET /api/books failed:", err);
    return NextResponse.json({ message: describe(err, "Could not load the books.") }, { status: 500 });
  }
}

// POST /api/books -> the created book
export async function POST(req: Request) {
  if (!isDatabaseConfigured) return NextResponse.json({ message: SETUP_MESSAGE }, { status: 503 });
  try {
    const userId = await currentUserId();
    if (!userId) return unauthorized();

    const parsed = parseInput(await req.json());
    if ("error" in parsed) return NextResponse.json({ message: parsed.error }, { status: 400 });
    const b = parsed.data;

    const [book] = await query<Book>(
      `insert into public.books (title, author, image, available, genre, rating, user_id)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning ${COLUMNS}`,
      [b.title, b.author, b.image, b.available, b.genre, b.rating, userId],
    );
    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    console.error("POST /api/books failed:", err);
    return NextResponse.json({ message: describe(err, "Could not add the book.") }, { status: 500 });
  }
}

// PUT /api/books -> the updated book
export async function PUT(req: Request) {
  if (!isDatabaseConfigured) return NextResponse.json({ message: SETUP_MESSAGE }, { status: 503 });
  try {
    const userId = await currentUserId();
    if (!userId) return unauthorized();

    const body = await req.json();
    const id = Number(body?.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ message: "A valid book id is required." }, { status: 400 });
    }

    // Scoping the lookup by user_id is what stops one person editing another's book.
    const [existing] = await query<Book>(
      `select ${COLUMNS} from public.books where id = $1 and user_id = $2`,
      [id, userId],
    );
    if (!existing) return NextResponse.json({ message: "Book not found." }, { status: 404 });

    // Merge so a partial update (just a rating, say) keeps the other fields.
    const parsed = parseInput({ ...existing, ...body });
    if ("error" in parsed) return NextResponse.json({ message: parsed.error }, { status: 400 });
    const b = parsed.data;

    const [book] = await query<Book>(
      `update public.books
          set title = $1, author = $2, image = $3, available = $4, genre = $5, rating = $6
        where id = $7 and user_id = $8
        returning ${COLUMNS}`,
      [b.title, b.author, b.image, b.available, b.genre, b.rating, id, userId],
    );
    return NextResponse.json(book, { status: 200 });
  } catch (err) {
    console.error("PUT /api/books failed:", err);
    return NextResponse.json({ message: describe(err, "Could not update the book.") }, { status: 500 });
  }
}

// DELETE /api/books
export async function DELETE(req: Request) {
  if (!isDatabaseConfigured) return NextResponse.json({ message: SETUP_MESSAGE }, { status: 503 });
  try {
    const userId = await currentUserId();
    if (!userId) return unauthorized();

    const { id } = await req.json();
    const bookId = Number(id);
    if (!Number.isInteger(bookId)) {
      return NextResponse.json({ message: "A valid book id is required." }, { status: 400 });
    }

    const rows = await query<{ id: number }>(
      `delete from public.books where id = $1 and user_id = $2 returning id::int as id`,
      [bookId, userId],
    );
    if (rows.length === 0) return NextResponse.json({ message: "Book not found." }, { status: 404 });
    return NextResponse.json({ message: "Book deleted." }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/books failed:", err);
    return NextResponse.json({ message: describe(err, "Could not delete the book.") }, { status: 500 });
  }
}
