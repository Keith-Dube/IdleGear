# GearShare

GearShare is a peer-to-peer equipment rental marketplace. Owners list unused gear, renters book it for short windows, and the platform earns commission on each booking without owning inventory.

This repository contains the first four phases of the MVP: the production-oriented monorepo foundation, Clerk-backed authentication, database seed data, and owner equipment management.

## Phase 1 Built

- Next.js frontend with TailwindCSS, shadcn-style primitives, responsive marketplace landing page, category browsing, and a searchable equipment route.
- NestJS backend with validated environment config, global validation pipe, API versioning, Swagger docs, rate limiting, health checks, and Prisma wiring.
- Production-ready Prisma schema for users, profiles, equipment, bookings, payments, reviews, messaging, favorites, availability, payouts, insurance claims, featured listings, reports, disputes, and audit logs.
- Shared TypeScript/Zod contracts for roles, equipment search, pagination, booking input, reviews, money, and platform fees.
- Docker Compose support for PostgreSQL, Redis, backend, and frontend.
- Documentation for architecture, API, ER model, environment variables, deployment, and developer setup.

## Phase 2 Built

- Clerk provider, protected dashboard route, sign-in/sign-up pages, and Next.js `proxy.ts` auth middleware.
- NestJS Clerk JWT verification using `@clerk/backend`.
- Authenticated `/api/v1/me` endpoints for user/profile sync and role lookup.
- Request-level current-user typing, `JwtAuthGuard`, `RolesGuard`, `@CurrentUser`, and `@Roles`.
- Database-backed default renter role grants on first profile sync.

## Phase 3 Built

- Initial Prisma migration under `backend/prisma/migrations`.
- Idempotent Prisma seed data for categories, users, owners, listings, images, availability, bookings, and reviews.
- Equipment repository boundary for marketplace search.
- Equipment aggregate recalculation for booking count, review count, and average rating.

## Phase 4 Built

- Owner role activation from the protected dashboard.
- Owner equipment CRUD APIs for creating, editing, soft-deleting, publishing, and unpublishing listings.
- Image metadata management plus signed Cloudinary upload parameters for equipment photos.
- Availability management for listing blackout/available windows.
- Dashboard listing tools for owner inventory, images, availability, and publish state.

## Folder Structure

```txt
GearShare/
  backend/           NestJS API, Prisma schema, backend modules
  docker/            Frontend and backend Dockerfiles
  docs/              Architecture, API, ERD, setup, deployment docs
  frontend/          Next.js marketplace web app
  infrastructure/    Deployment and infrastructure notes
  shared/            Shared TypeScript and Zod domain contracts
```

## Quick Start

```bash
cp .env.example .env
npm install
docker compose up -d postgres redis
npm run prisma:generate
npm run prisma:migrate:dev -- --name initial_schema
npm run prisma:seed
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp .env.example .env`.

Frontend: http://localhost:3000

Backend API: http://localhost:4000/api/v1

Swagger: http://localhost:4000/api/docs

Protected dashboard: http://localhost:3000/dashboard

## Local Services

```bash
docker compose up -d postgres redis
```

The default local database URL is:

```txt
postgresql://gearshare:gearshare_dev_password@localhost:5434/gearshare?schema=public
```

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Next Phases

See [docs/PHASES.md](docs/PHASES.md) for the planned sequence from authentication through admin tooling.
