import Link from "next/link";
import { FiAlertCircle } from "react-icons/fi";

/** Shown instead of a blank error page when the environment variables are missing. */
export default function SetupNotice({ missing }: { missing: string[] }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-20">
      <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-stone-200 dark:bg-stone-800 dark:ring-stone-700">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
          <FiAlertCircle size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-stone-900 dark:text-stone-50">Almost set up</h1>
        <p className="mt-3 text-stone-600 dark:text-stone-400">
          Accounts need a database and a signing secret before anyone can sign in.
          {missing.length > 0 && " These are still missing:"}
        </p>
        {missing.length > 0 && (
          <ul className="mt-4 space-y-2">
            {missing.map((name) => (
              <li key={name}>
                <code className="rounded bg-stone-100 px-2 py-1 text-sm font-semibold text-stone-800 dark:bg-stone-900 dark:text-stone-200">
                  {name}
                </code>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-5 text-sm text-stone-600 dark:text-stone-400">
          Add them to the hosting environment and redeploy. The README has the full list and
          where to find each value.
        </p>
        <Link href="/" className="mt-7 inline-block rounded-lg bg-amber-600 px-5 py-2.5 font-semibold text-white transition hover:bg-amber-500">
          Back to home
        </Link>
      </div>
    </div>
  );
}
