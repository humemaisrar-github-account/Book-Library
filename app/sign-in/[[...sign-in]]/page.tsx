import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import SetupNotice from "../../components/SetupNotice";
import { isAuthConfigured, missingAuthEnv } from "../../lib/auth-config";
import { IMAGES } from "../../lib/images";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  if (!isAuthConfigured) return <SetupNotice missing={missingAuthEnv()} />;

  return (
    <div className="relative isolate flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16">
      <Image src={IMAGES.about} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-stone-950/75" />
      <div className="relative">
        <Suspense fallback={<div className="h-96 w-80 animate-pulse rounded-2xl bg-white/10" />}>
          <SignIn />
        </Suspense>
      </div>
    </div>
  );
}
