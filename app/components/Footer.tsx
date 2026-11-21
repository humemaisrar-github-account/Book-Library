import Link from "next/link";
import { FiBookOpen, FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-amber-400">
            <FiBookOpen size={20} />
            Book Library
          </div>
          <p className="mt-3 max-w-xs text-sm text-stone-400">
            A simple, fast way to keep track of the books you own, lend and love.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Pages</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/" className="transition hover:text-amber-400">Home</Link></li>
            <li><Link href="/library" className="transition hover:text-amber-400">Library</Link></li>
            <li><Link href="/about" className="transition hover:text-amber-400">About</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Built with</h3>
          <ul className="mt-3 space-y-2 text-sm text-stone-400">
            <li>Next.js &amp; React</li>
            <li>Tailwind CSS</li>
            <li>Clerk &amp; Supabase</li>
          </ul>
          <a
            href="https://github.com/humemaisrar-github-account/Book-Library"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm transition hover:text-amber-400"
          >
            <FiGithub size={16} /> View source
          </a>
        </div>
      </div>

      <div className="border-t border-stone-800 py-5 text-center text-sm text-stone-500">
        &copy; {new Date().getFullYear()} Humema Israr. All rights reserved.
      </div>
    </footer>
  );
}
