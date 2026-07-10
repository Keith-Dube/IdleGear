import { ArrowLeft, Wrench } from "lucide-react";
import Link from "next/link";

import { AuthActions } from "@/components/auth/auth-actions";
import { Button } from "@/components/ui/button";

import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return (
    <main>
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container flex min-h-20 items-center justify-between gap-4 py-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="flex items-center gap-2">
                <Wrench className="h-4 w-4" aria-hidden="true" />
                GearShare
              </span>
            </Link>
          </Button>
          <AuthActions />
        </div>
      </header>

      <section className="container py-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-primary">
            Renter workspace
          </p>
          <h1 className="mt-2 text-4xl font-bold">Your GearShare dashboard</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Phase 2 connects Clerk sessions to the GearShare API and creates a
            database-backed profile with default renter access.
          </p>
        </div>
        <DashboardClient />
      </section>
    </main>
  );
}
