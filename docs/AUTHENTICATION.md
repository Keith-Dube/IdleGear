# Authentication

GearShare uses Clerk for hosted authentication and local database records for marketplace ownership, roles, and profiles.

## Frontend Flow

- The app is wrapped in `ClerkProvider` when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is configured.
- `proxy.ts` protects `/dashboard` with Clerk middleware.
- `/sign-in` and `/sign-up` use Clerk's prebuilt auth components.
- The dashboard uses the active Clerk session token to call the backend.
- Frontend `dev`, `build`, and `start` scripts load the repository root `.env` file so Clerk browser keys stay in one place with backend secrets.

## Backend Flow

1. Protected routes use `JwtAuthGuard`.
2. The guard extracts the bearer token from `Authorization`.
3. `@clerk/backend` verifies the token with `CLERK_JWT_KEY` or `CLERK_SECRET_KEY`.
4. The verified Clerk `sub` claim becomes `request.user.clerkUserId`.
5. Local role grants are loaded from PostgreSQL.
6. `@CurrentUser()` exposes the authenticated request user to controllers.

Placeholder auth values from `.env.example` are ignored at runtime, so `CLERK_JWT_KEY` can remain unset while `CLERK_SECRET_KEY` is used for verification.

## User Sync

`POST /api/v1/me/sync` creates or updates the local `User` and `Profile` for the Clerk account. New users receive the `RENTER` role by default.

The dashboard owner activation flow grants the `OWNER` role through `POST /api/v1/me/owner`.
