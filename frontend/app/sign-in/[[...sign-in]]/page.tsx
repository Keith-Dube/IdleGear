import { SignIn } from "@clerk/nextjs";

import { Card } from "@/components/ui/card";
import { isClerkConfigured } from "@/lib/auth-config";

export default function SignInPage() {
  if (!isClerkConfigured) {
    return (
      <main className="container flex min-h-screen items-center justify-center py-12">
        <Card className="max-w-md p-6 text-center">
          <h1 className="text-2xl font-bold">Authentication setup needed</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add your Clerk publishable and secret keys to `.env`, then restart
            the frontend and backend dev servers.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </main>
  );
}
