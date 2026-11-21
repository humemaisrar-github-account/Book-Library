import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { isAuthConfigured } from "./lib/auth-config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Book Library",
    template: "%s | Book Library",
  },
  description: "Keep track of the books you own, lend and love. Search, borrow, rate and organise your collection.",
};

// Runs before first paint so the saved theme is applied without a flash.
const themeScript = `try{var t=localStorage.getItem("bl:theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Without Clerk keys the provider throws, so the site renders without it
            and the auth pages explain what is missing instead. */}
        {isAuthConfigured ? (
          <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/library" signUpFallbackRedirectUrl="/library">
            <Navbar authConfigured />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ClerkProvider>
        ) : (
          <>
            <Navbar authConfigured={false} />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
