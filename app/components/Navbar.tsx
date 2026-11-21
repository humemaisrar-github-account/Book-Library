import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-stone-900/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-amber-400">
          <FiBookOpen size={22} />
          Book Library
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
