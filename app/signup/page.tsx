import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AuthForm from "../components/AuthForm";
import { getSessionSafe, isAuthConfigured } from "../lib/auth";
import SetupNotice from "../components/SetupNotice";
import { IMAGES } from "../lib/images";

export const metadata: Metadata = { title: "Create account" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const missing = [
    !process.env.DATABASE_URL && !process.env.POSTGRES_URL ? "DATABASE_URL" : null,
    !process.env.BETTER_AUTH_SECRET ? "BETTER_AUTH_SECRET" : null,
  ].filter(Boolean) as string[];
  if (!isAuthConfigured) return <SetupNotice missing={missing} />;

  const session = await getSessionSafe(await headers());
  if (session) redirect("/library");

  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <div className="relative isolate flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16">
      <Image src={IMAGES.about} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-stone-950/75" />
      <div className="relative flex w-full justify-center">
        <AuthForm mode="signup" googleEnabled={googleEnabled} />
      </div>
    </div>
  );
}
