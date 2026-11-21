"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import type { Book, BookInput } from "../lib/types";
import BookCard from "./BookCard";
import BookModal from "./BookModal";

type Filter = "all" | "available" | "borrowed" | "favourites";
type Sort = "newest" | "title" | "author" | "rating";

const FAV_KEY = "bl:favourites";

async function api<T>(method: string, body?: unknown): Promise<T> {
  const res = await fetch("/api/books", {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message ?? "Request failed.");
  return data as T;
}

export default function Library() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [favourites, setFavourites] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState<Sort>("newest");
  const [modal, setModal] = useState<{ book: Book | null } | null>(null);
  const [toDelete, setToDelete] = useState<Book | null>(null);
  const [toast, setToast] = useState("");

  const notify = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setBooks(await api<Book[]>("GET"));
    } catch {
      setLoadError("Could not load your books. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    try {
      setFavourites(JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]"));
    } catch {}
  }, [load]);

  const toggleFavourite = (id: number) => {
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const patchBook = async (book: Book, changes: Partial<BookInput>, message?: string) => {
    try {
      const updated = await api<Book>("PUT", { ...book, ...changes });
      setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      if (message) notify(message);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Update failed.");
    }
  };

  const saveBook = async (data: BookInput, id?: number) => {
    if (id === undefined) {
      const created = await api<Book>("POST", data);
      setBooks((prev) => [...prev, created]);
      notify(`"${created.title}" added to your library.`);
    } else {
      const updated = await api<Book>("PUT", { id, ...data });
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      notify("Changes saved.");
    }
    setModal(null);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api("DELETE", { id: toDelete.id });
      setBooks((prev) => prev.filter((b) => b.id !== toDelete.id));
      setFavourites((prev) => prev.filter((f) => f !== toDelete.id));
      notify(`"${toDelete.title}" deleted.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Delete failed.");
    }
    setToDelete(null);
  };

  const genres = useMemo(() => ["All", ...Array.from(new Set(books.map((b) => b.genre))).sort()], [books]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = books.filter((b) => {
      if (q && !`${b.title} ${b.author}`.toLowerCase().includes(q)) return false;
      if (genre !== "All" && b.genre !== genre) return false;
      if (filter === "available") return b.available;
      if (filter === "borrowed") return !b.available;
      if (filter === "favourites") return favourites.includes(b.id);
      return true;
    });
    const sorted = [...list];
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "author") sorted.sort((a, b) => a.author.localeCompare(b.author));
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else sorted.sort((a, b) => b.id - a.id);
    return sorted;
  }, [books, query, genre, filter, sort, favourites]);

  const stats = [
    { label: "Total books", value: books.length },
    { label: "Available", value: books.filter((b) => b.available).length },
    { label: "Borrowed", value: books.filter((b) => !b.available).length },
    { label: "Favourites", value: books.filter((b) => favourites.includes(b.id)).length },
  ];

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "available", label: "Available" },
    { id: "borrowed", label: "Borrowed" },
    { id: "favourites", label: "Favourites" },
  ];

  const selectClass =
    "rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-amber-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100";

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 text-center shadow ring-1 ring-stone-200 dark:bg-stone-800 dark:ring-stone-700">
            <p className="text-3xl font-bold text-amber-600">{s.value}</p>
            <p className="text-sm text-stone-600 dark:text-stone-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author…"
              aria-label="Search books"
              className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-10 pr-3 text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-50"
            />
          </div>
          <button
            onClick={() => setModal({ book: null })}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-2 font-medium text-white shadow hover:bg-amber-500"
          >
            <FiPlus /> Add book
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f.id
                  ? "bg-stone-900 text-white dark:bg-amber-600"
                  : "bg-white text-stone-700 ring-1 ring-stone-300 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-600"
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <select value={genre} onChange={(e) => setGenre(e.target.value)} aria-label="Filter by genre" className={selectClass}>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g === "All" ? "All genres" : g}
                </option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort books" className={selectClass}>
              <option value="newest">Newest first</option>
              <option value="title">Title (A–Z)</option>
              <option value="author">Author (A–Z)</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6">
        {loading ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="h-[28rem] animate-pulse rounded-2xl bg-stone-200 dark:bg-stone-800" />
            ))}
          </ul>
        ) : loadError ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-stone-800">
            <p className="text-stone-700 dark:text-stone-300">{loadError}</p>
            <button onClick={load} className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-white dark:bg-amber-600">
              Retry
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-stone-800">
            <p className="text-5xl">📭</p>
            <p className="mt-3 text-stone-700 dark:text-stone-300">
              {books.length === 0 ? "Your library is empty. Add your first book!" : "No books match your search or filters."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-stone-600 dark:text-stone-400">
              Showing {visible.length} of {books.length} books
            </p>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  favourite={favourites.includes(book.id)}
                  onToggleFavourite={toggleFavourite}
                  onToggleAvailable={(b) => patchBook(b, { available: !b.available }, b.available ? `You borrowed "${b.title}".` : `"${b.title}" returned.`)}
                  onRate={(b, rating) => patchBook(b, { rating })}
                  onEdit={(b) => setModal({ book: b })}
                  onDelete={setToDelete}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      {modal && <BookModal book={modal.book} onClose={() => setModal(null)} onSave={saveBook} />}

      {toDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4" onClick={() => setToDelete(null)}>
          <div onClick={(e) => e.stopPropagation()} role="alertdialog" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-stone-800">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50">Delete this book?</h3>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              &ldquo;{toDelete.title}&rdquo; will be removed from your library.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setToDelete(null)} className="rounded-lg px-4 py-2 text-stone-700 ring-1 ring-stone-300 dark:text-stone-200 dark:ring-stone-600">
                Cancel
              </button>
              <button onClick={confirmDelete} className="rounded-lg bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-500">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-5 py-3 text-sm text-white shadow-lg dark:bg-amber-600">
          {toast}
        </div>
      )}
    </section>
  );
}
