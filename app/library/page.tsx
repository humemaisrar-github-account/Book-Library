import type { Metadata } from "next";
import Image from "next/image";
import Library from "../components/Library";
import { IMAGES } from "../lib/images";

export const metadata: Metadata = {
  title: "Library",
  description: "Search, borrow, rate and organise your book collection.",
};

export default function LibraryPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-stone-900">
        <Image src={IMAGES.library} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 to-stone-950/60" />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Your library</h1>
          <p className="mt-3 max-w-xl text-stone-300">
            Search, filter and sort your collection. Borrow a book to mark it as out, and star the ones you finish.
          </p>
        </div>
      </section>
      <Library />
    </>
  );
}
