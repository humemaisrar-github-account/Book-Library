import { NextResponse } from "next/server";
import type { Book, BookInput } from "../../lib/types";

// NOTE: data lives in memory, so it resets whenever the server restarts.
// Swap this array for a database (Supabase, MongoDB, ...) when you want real persistence.
let books: Book[] = [
  { id: 1, title: "Read People Like a Book", author: "Patrick King", image: "/img1.jpg", available: true, genre: "Psychology", rating: 0 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", image: "/img.3.jpg", available: true, genre: "Classic", rating: 0 },
  { id: 3, title: "Normal People", author: "Sally Rooney", image: "/img2.jpg", available: true, genre: "Romance", rating: 0 },
  { id: 4, title: "Animal Farm", author: "George Orwell", image: "/img.4.jpg", available: true, genre: "Classic", rating: 0 },
  { id: 5, title: "Pride and Prejudice", author: "Jane Austen", image: "/img5.jpg", available: true, genre: "Romance", rating: 0 },
  { id: 6, title: "The Great Gatsby", author: "F. Scott Fitzgerald", image: "/img6.jpg", available: true, genre: "Classic", rating: 0 },
  { id: 7, title: "The Alchemist", author: "Paulo Coelho", image: "/img7.jpg", available: true, genre: "Adventure", rating: 0 },
  { id: 8, title: "The Book Thief", author: "Markus Zusak", image: "/img8.jpg", available: true, genre: "Historical", rating: 0 },
  { id: 9, title: "The Kite Runner", author: "Khaled Hosseini", image: "/img9.jpg", available: true, genre: "Fiction", rating: 0 },
];

const nextId = () => books.reduce((max, b) => Math.max(max, b.id), 0) + 1;

/** Validates and cleans user input. Returns an error message or the cleaned fields. */
function parseInput(raw: unknown): { error: string } | { data: BookInput } {
  if (typeof raw !== "object" || raw === null) return { error: "Invalid request body." };
  const r = raw as Record<string, unknown>;

  const title = typeof r.title === "string" ? r.title.trim() : "";
  const author = typeof r.author === "string" ? r.author.trim() : "";
  if (!title) return { error: "Title is required." };
  if (!author) return { error: "Author is required." };
  if (title.length > 150 || author.length > 100) return { error: "Title or author is too long." };

  const rating = Number(r.rating ?? 0);
  return {
    data: {
      title,
      author,
      image: typeof r.image === "string" ? r.image : "",
      available: r.available === undefined ? true : Boolean(r.available),
      genre: typeof r.genre === "string" && r.genre.trim() ? r.genre.trim() : "Other",
      rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, Math.round(rating))) : 0,
    },
  };
}

// GET /api/books
export async function GET() {
  return NextResponse.json(books, { status: 200 });
}

// POST /api/books
export async function POST(req: Request) {
  try {
    const parsed = parseInput(await req.json());
    if ("error" in parsed) return NextResponse.json({ message: parsed.error }, { status: 400 });

    const book: Book = { id: nextId(), ...parsed.data };
    books.push(book);
    return NextResponse.json(book, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Could not add the book." }, { status: 500 });
  }
}

// PUT /api/books
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = Number(body?.id);
    const existing = books.find((b) => b.id === id);
    if (!existing) return NextResponse.json({ message: "Book not found." }, { status: 404 });

    const parsed = parseInput({ ...existing, ...body });
    if ("error" in parsed) return NextResponse.json({ message: parsed.error }, { status: 400 });

    const updated: Book = { id, ...parsed.data };
    books = books.map((b) => (b.id === id ? updated : b));
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Could not update the book." }, { status: 500 });
  }
}

// DELETE /api/books
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!books.some((b) => b.id === Number(id))) {
      return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }
    books = books.filter((b) => b.id !== Number(id));
    return NextResponse.json({ message: "Book deleted." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Could not delete the book." }, { status: 500 });
  }
}
