# Developer Setup

## Requirements

- Node.js 22 or newer.
- npm 10 or newer.
- Docker Desktop for PostgreSQL and Redis.

## Install

```bash
cp .env.example .env
npm install
docker compose up -d postgres redis
npm run prisma:generate
npm run prisma:migrate:dev -- --name initial_schema
npm run prisma:seed
npm run dev
```

Windows PowerShell equivalent for the environment file:

```powershell
Copy-Item .env.example .env
```

## Commands

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run typecheck
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
```

## Local URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/v1
- Swagger: http://localhost:4000/api/docs
- Prisma Studio: run `npm run prisma:studio --workspace backend`

PostgreSQL is exposed on host port `5434` to avoid conflicts with local Windows PostgreSQL installs.

## Clerk Setup

1. Create a Clerk application.
2. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to `.env`.
3. Optionally add the Clerk JWT public key PEM to `CLERK_JWT_KEY` for networkless token verification. If omitted, the backend verifies with `CLERK_SECRET_KEY`.
4. Keep `CLERK_AUTHORIZED_PARTIES` aligned with your local frontend URLs.
5. Restart the frontend and backend dev servers.

The frontend workspace scripts load the root `.env` through `dotenv-cli`, matching the backend's `../.env` loading behavior.

Without real Clerk keys, public marketplace pages still run and the dashboard shows an auth setup state.

If your Clerk instance requires organizations during sign-in, users must complete Clerk's organization step before the dashboard redirects back with an active session.

## Owner Listing Setup

Phase 4 owner tools are available from `/dashboard` after Clerk is configured and the current user has been synced through `/api/v1/me/sync`.

- Use the dashboard owner activation action or `POST /api/v1/me/owner` to grant the current user owner access.
- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` before calling the signed upload endpoint.
- Listing images are stored as Cloudinary metadata in GearShare after the browser uploads the file to Cloudinary.

## Development Notes

- Keep shared request and response contracts in `shared/src`.
- Add backend routes as NestJS feature modules under `backend/src/modules`.
- Keep frontend reusable UI in `frontend/components`.
- Use Prisma migrations for all schema changes.
- Keep `backend/prisma/seed.ts` idempotent so it can be rerun during development.
- Treat Stripe webhooks, owner approval, payouts, and claims as idempotent workflows.
