"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/auth-config";

export function AuthActions() {
  if (!isClerkConfigured) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" disabled title="Add Clerk keys to enable sign in">
          Sign in
        </Button>
        <Button disabled title="Add Clerk keys to enable owner onboarding">
          List gear
        </Button>
      </div>
    );
  }

  return <ClerkAuthActions />;
}

function ClerkAuthActions() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {isLoaded && !isSignedIn ? (
        <>
          <SignInButton mode="modal">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>List gear</Button>
          </SignUpButton>
        </>
      ) : null}
      {isLoaded && isSignedIn ? (
        <>
          <Button asChild variant="secondary">
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </Link>
          </Button>
          <UserButton />
        </>
      ) : null}
    </div>
  );
}
