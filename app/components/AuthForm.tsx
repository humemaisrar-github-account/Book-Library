"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "../lib/auth-client";

type Mode = "signin" | "signup";

const COPY = {
  signin: {
    heading: "Welcome back",
    sub: "Sign in to get to your shelf.",
    submit: "Sign in",
    busy: "Signing in…",
    swapText: "New here?",
    swapLink: "Create an account",
    swapHref: "/signup",
  },
  signup: {
    heading: "Create your account",
    sub: "It takes a few seconds, and your shelf is yours alone.",
    submit: "Create account",
    busy: "Creating your account…",
    swapText: "Already have an account?",
    swapLink: "Sign in",
    swapHref: "/signin",
  },
} as const;

const inputClass =
  "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-50";

/** Turns a Better Auth error into something a reader can act on. */
function readable(message: string | undefined, mode: Mode): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("already") || m.includes("exists")) return "An account with that email already exists. Try signing in instead.";
  if (m.includes("invalid") || m.includes("password") || m.includes("credential")) {
    return mode === "signin" ? "That email and password don't match an account." : message || "Please check the form and try again.";
  }
  return message || "Something went wrong. Please try again.";
}

export default function AuthForm({ mode, googleEnabled }: { mode: Mode; googleEnabled: boolean }) {
  const copy = COPY[mode];
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password.length < 8) {
      setError("Please use a password of at least 8 characters.");
      return;
    }

    setBusy(true);
    const result =
      mode === "signin"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: name.trim() || email.split("@")[0] });

    if (result.error) {
      setError(readable(result.error.message, mode));
      setBusy(false);
      return;
    }
    router.push("/library");
    router.refresh();
  };

  const google = async () => {
    setError("");
    setBusy(true);
    const result = await authClient.signIn.social({ provider: "google", callbackURL: "/library" });
    if (result?.error) {
      setError(readable(result.error.message, mode));
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-stone-200 dark:bg-stone-800 dark:ring-stone-700">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">{copy.heading}</h1>
      <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-400">{copy.sub}</p>

      {googleEnabled && (
        <>
          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-stone-300 bg-white px-4 py-2.5 font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-60 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600"
          >
            <FcGoogle size={20} /> Continue with Google
          </button>
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
            <span className="text-xs uppercase tracking-wider text-stone-400">or</span>
            <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
          </div>
        </>
      )}

      <form onSubmit={submit} className={googleEnabled ? "space-y-4" : "mt-6 space-y-4"}>
        {mode === "signup" && (
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
            Name
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
          </label>
        )}

        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Email
          <input
            className={inputClass}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Password
          <input
            className={inputClass}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-amber-600 px-4 py-2.5 font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
        >
          {busy ? copy.busy : copy.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
        {copy.swapText}{" "}
        <Link href={copy.swapHref} className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
          {copy.swapLink}
        </Link>
      </p>
    </div>
  );
}
