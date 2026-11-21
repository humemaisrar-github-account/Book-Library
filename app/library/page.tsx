import type { Metadata } from "next";
import Library from "../components/Library";

export const metadata: Metadata = {
  title: "Library",
  description: "Search, borrow, rate and organise your book collection.",
};

export default function LibraryPage() {
  return (
    <>
      <section className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
            Your library
          </h1>
          <p className="mt-3 max-w-xl text-stone-600 dark:text-stone-400">
            Search, filter and sort your collection. Borrow a book to mark it as out, and star the ones you finish.
          </p>
        </div>
      </section>
      <Library />
    </>
  );
}
