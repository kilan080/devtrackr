"use client";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useUser();

  function generateUsername(name: string, email: string) {
    if (name) {
      return name.toLowerCase().replace(/\s+/g, "");
    }
    return email.split("@")[0].toLowerCase();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-6 flex flex-col">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center mb-12 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold tracking-wide">DevTrackr</h1>

        <div className="flex items-center gap-4 text-sm">
          {!isSignedIn && (
            <>
              <SignInButton mode="modal">Sign In</SignInButton>
              <SignUpButton mode="modal">Get Started</SignUpButton>
            </>
          )}

          {isSignedIn && (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          Track Your Projects <br /> Like a Pro
        </h2>

        <p className="text-zinc-400 text-lg mb-8">
          DevTrackr helps you manage, track, and showcase your development
          projects all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {!isSignedIn && (
            <>
              <SignUpButton mode="modal">Start Building</SignUpButton>

              <SignInButton mode="modal">Already have an account?</SignInButton>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
