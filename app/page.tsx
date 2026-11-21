import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiHeart, FiSearch, FiStar, FiRepeat, FiMoon, FiDatabase } from "react-icons/fi";
import { IMAGES } from "./lib/images";

const COVERS = [
  "/img1.jpg", "/img2.jpg", "/img.3.jpg", "/img.4.jpg", "/img5.jpg",
  "/img6.jpg", "/img7.jpg", "/img8.jpg", "/img9.jpg",
];

const FEATURES = [
  { icon: FiSearch, title: "Find anything fast", body: "Search by title or author, then narrow it down by genre or availability." },
  { icon: FiRepeat, title: "Track what's lent out", body: "Mark a book as borrowed when it leaves your shelf, and returned when it comes back." },
  { icon: FiStar, title: "Rate as you read", body: "Give each book a star rating and sort your whole collection by what you loved most." },
  { icon: FiHeart, title: "Keep favourites close", body: "Heart the books worth re-reading and pull them up with a single filter." },
  { icon: FiMoon, title: "Easy on the eyes", body: "A light and a dark theme, and the app remembers which one you prefer." },
  { icon: FiDatabase, title: "Saved for good", body: "Everything lives in a real database, so your shelf is the same on every device." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src={IMAGES.hero} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/90 via-stone-950/75 to-amber-950/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <p className="mb-4 inline-block rounded-full bg-amber-500/15 px-4 py-1.5 text-sm font-medium text-amber-300 ring-1 ring-amber-400/30">
            Your shelf, organised
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            Every book you own, in one tidy place.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-300">
            Search your collection, see what&apos;s lent out, rate what you&apos;ve finished,
            and keep your favourites a click away.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:bg-amber-500"
            >
              Open the library <FiArrowRight />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center rounded-lg px-6 py-3 font-semibold text-stone-100 ring-1 ring-stone-400/40 transition hover:bg-white/10"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Cover strip */}
      <section className="border-y border-stone-200 bg-white py-10 dark:border-stone-800 dark:bg-stone-900">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-stone-500">
            On the shelf right now
          </h2>
          <ul className="mt-6 flex justify-center gap-4 overflow-x-auto pb-2">
            {COVERS.map((src) => (
              <li key={src} className="shrink-0">
                <div className="relative h-44 w-28 overflow-hidden rounded-lg shadow-md ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-xl dark:ring-stone-700">
                  <Image src={src} alt="" fill sizes="112px" className="object-cover" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
            Built for the way you actually read
          </h2>
          <p className="mt-4 text-stone-600 dark:text-stone-400">
            No clutter, no learning curve. Just the handful of things a home library really needs.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-lg dark:bg-stone-800 dark:ring-stone-700"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-900 dark:text-stone-50">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing call to action */}
      <section className="relative isolate overflow-hidden bg-stone-900">
        <Image src={IMAGES.cta} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to see your shelf?</h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-400">
            Open the library, add a book, and it stays there — on your laptop, your phone, wherever you sign in.
          </p>
          <Link
            href="/library"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-7 py-3 font-semibold text-white transition hover:bg-amber-500"
          >
            Open the library <FiArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
