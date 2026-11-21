"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { authClient } from "../lib/auth-client";

export default function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (isPending) {
    return <span className="h-9 w-9 animate-pulse rounded-full bg-stone-700" aria-hidden />;
  }

  if (!session) {
    return (
      <Link
        href="/signin"
        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500"
      >
        Sign in
      </Link>
    );
  }

  const user = session.user;
  const label = user.name || user.email || "Account";
  const initial = label.charAt(0).toUpperCase();

  const out = async () => {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-600 text-sm font-bold text-white transition hover:bg-amber-500"
        title={label}
      >
        {initial}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-stone-200 dark:bg-stone-800 dark:ring-stone-700"
        >
          <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-3 dark:border-stone-700">
            <FiUser className="shrink-0 text-stone-400" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-100">{user.name || "Reader"}</p>
              <p className="truncate text-xs text-stone-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={out}
            role="menuitem"
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-stone-700 transition hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-700"
          >
            <FiLogOut /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
