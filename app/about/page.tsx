import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "../lib/images";
import { FiArrowRight } from "react-icons/fi";

export const metadata: Metadata = {
  title: "About",
  description: "What Book Library does, how it works, and what it is built with.",
};

const STEPS = [
  { n: "01", title: "Add your books", body: "Enter a title, author and genre, and upload a cover if you have one. Covers are resized in your browser before they are saved, so uploads stay small and fast." },
  { n: "02", title: "Find them again", body: "Search by title or author, filter by genre or availability, and sort by title, author or rating. Everything updates as you type." },
  { n: "03", title: "Lend and get back", body: "Hit Borrow when a book leaves your shelf. It moves to the Borrowed filter until you mark it Returned, so you always know where it is." },
  { n: "04", title: "Rate and shortlist", body: "Give a book up to five stars, and heart the ones worth keeping close. Sort by Top rated to see your best reads first." },
];


export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-stone-900">
        <Image src={IMAGES.about} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/40" />
        <div className="relative mx-auto max-w-4xl px-4 py-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">How it works</h1>
          <p className="mt-5 max-w-2xl text-lg text-stone-300">
            Book Library is a small app for keeping track of a personal book collection —
            what you own, what you have lent out, and what was worth reading.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <ol className="space-y-10">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-6">
              <span className="shrink-0 text-2xl font-bold text-amber-600/70 dark:text-amber-500/60">{s.n}</span>
              <div>
                <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-50">{s.title}</h2>
                <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-400">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-stone-200 bg-white py-16 dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">Your shelf is yours</h2>
          <p className="mt-4 text-stone-600 dark:text-stone-400">
            Sign in once and your collection follows you — the same books on your laptop, your phone,
            anywhere you sign in. Nobody else can see or change what is on your shelf.
          </p>
          <p className="mt-4 text-stone-600 dark:text-stone-400">
            Books are saved in a database rather than in your browser, so nothing is lost when you clear
            your history or switch devices.
          </p>

          <Link
            href="/library"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-500"
          >
            Open the library <FiArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
