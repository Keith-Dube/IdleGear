"use client";

import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiUrl, isClerkConfigured } from "@/lib/auth-config";

import { OwnerEquipmentManager } from "./owner-equipment-manager";

type SyncedUser = {
  id: string;
  email: string;
  roles: string[];
  profile?: {
    displayName?: string | null;
    avatarUrl?: string | null;
  } | null;
};

type SyncState =
  | { status: "idle" | "loading" }
  | { status: "success"; user: SyncedUser }
  | { status: "error"; message: string };

export function DashboardClient() {
  if (!isClerkConfigured) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="mt-1 h-5 w-5 text-accent" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold">Authentication setup needed</h2>
            <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
              Add your Clerk keys to `.env`, restart the dev servers, then this
              dashboard will require sign-in and sync the user profile to the API.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return <ClerkDashboardClient />;
}

function ClerkDashboardClient() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [syncState, setSyncState] = useState<SyncState>({ status: "idle" });

  const primaryEmail = useMemo(
    () => user?.primaryEmailAddress?.emailAddress,
    [user?.primaryEmailAddress?.emailAddress],
  );

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !isSignedIn || !user || !primaryEmail) {
        return;
      }

      setSyncState({ status: "loading" });

      try {
        const token = await getToken();

        if (!token) {
          throw new Error("Clerk did not return a session token.");
        }

        const response = await fetch(`${apiUrl}/api/v1/me/sync`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: primaryEmail,
            displayName: user.fullName ?? user.username ?? primaryEmail,
            avatarUrl: user.imageUrl,
          }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            message?: string;
          } | null;
          throw new Error(body?.message ?? "Profile sync failed.");
        }

        const syncedUser = (await response.json()) as SyncedUser;
        setSyncState({ status: "success", user: syncedUser });
      } catch (error) {
        setSyncState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to sync the current user.",
        });
      }
    }

    void syncUser();
  }, [getToken, isLoaded, isSignedIn, primaryEmail, user]);

  if (!isLoaded || syncState.status === "loading") {
    return (
      <Card className="flex min-h-56 items-center justify-center p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Preparing your workspace
        </div>
      </Card>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Sign in to continue</h2>
        <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
          Your dashboard is protected and connects to the API with a Clerk
          session token.
        </p>
        <SignInButton mode="modal">
          <Button className="mt-5">Sign in</Button>
        </SignInButton>
      </Card>
    );
  }

  if (syncState.status === "error") {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="mt-1 h-5 w-5 text-destructive" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold">Profile sync failed</h2>
            <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
              {syncState.message}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (syncState.status !== "success") {
    return null;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge className="gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Synced
            </Badge>
            <h2 className="mt-5 text-2xl font-bold">
              {syncState.user.profile?.displayName ?? syncState.user.email}
            </h2>
            <p className="mt-2 text-muted-foreground">{syncState.user.email}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary">
            <UserRound className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {syncState.user.roles.map((role) => (
            <Badge key={role}>{role.toLowerCase()}</Badge>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold">Protected API access</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              This page used the active Clerk session token to call
              `POST /api/v1/me/sync`. The API verified the JWT and attached
              database-backed role grants to the request.
            </p>
          </div>
        </div>
      </Card>
      <div className="lg:col-span-2">
        <OwnerEquipmentManager user={syncState.user} />
      </div>
    </div>
  );
}
