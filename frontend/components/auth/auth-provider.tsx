"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

import { isClerkConfigured } from "@/lib/auth-config";

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!isClerkConfigured) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
