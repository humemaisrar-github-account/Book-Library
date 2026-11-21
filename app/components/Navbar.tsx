"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiBookOpen, FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-30 border-b border-stone-800/60 bg-stone-900/90 backdrop-blur supports-[backdrop-filter]:bg-stone-900/75">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-amber-400">
          <FiBookOpen size={22} />
          <span>Book Library</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(l.href) ? "bg-white/10 text-amber-400" : "text-stone-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className="mx-2 h-5 w-px bg-stone-700" />
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-lg p-2 text-stone-200 transition hover:bg-white/10"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-stone-800 bg-stone-900 sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive(l.href) ? "bg-white/10 text-amber-400" : "text-stone-300 hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
