import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAuthConfigured } from "./app/lib/auth-config";

// Routes are not protected here on purpose: Clerk recommends checking access
// next to the data it guards, which is what /library and /api/books do.
// Without keys the middleware would throw on every request, so it steps aside.
export default isAuthConfigured ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk's own frontend API routes
    "/__clerk/(.*)",
  ],
};
