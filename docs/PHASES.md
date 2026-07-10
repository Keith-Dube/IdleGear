# Incremental Build Plan

## Phase 1: Project Setup

Built in this delivery:

- Monorepo workspace.
- Next.js frontend.
- NestJS backend.
- Shared contracts.
- Prisma schema.
- Docker and infrastructure docs.
- Architecture, API, ERD, environment, deployment, and setup docs.

## Phase 2: Authentication

Built in this delivery:

- Clerk integration in the Next.js app shell.
- Sign-in and sign-up routes.
- Protected dashboard route.
- Clerk session-token verification in NestJS.
- User and profile sync flow.
- Default renter role grants.
- Current-user and role guards for protected API routes.

## Phase 3: Database

Built in this delivery:

- Initial Prisma migration.
- Seed data for categories, users, owners, listings, images, availability, bookings, and reviews.
- Equipment repository boundary for search.
- Equipment aggregate service for review and booking counters.
- Seed-time aggregate recalculation for listing popularity and ratings.

## Phase 4: Equipment CRUD

Built in this delivery:

- Owner role activation flow for synced users.
- Owner listing creation, detail, update, and soft delete.
- Image metadata replacement with signed Cloudinary upload support.
- Specification storage through validated listing payloads.
- Availability management for listing calendars.
- Publish/unpublish controls.
- Protected dashboard tools for owner inventory management.

## Phase 5: Search

- Keyword, category, location, distance, price, availability, rating, newest, and popularity filters.
- Google Maps Places integration.
- Search result pagination.
- Search performance indexes and cache strategy.

## Phase 6: Bookings

- Date selection.
- Price calculation.
- Owner approval and rejection.
- Booking confirmation.
- Email and push notifications.

## Phase 7: Payments

- Stripe Connect onboarding.
- Payment intents.
- Deposits, platform commission, refunds, and payout records.
- Webhook verification and idempotency.

## Phase 8: Messaging

- Conversations linked to bookings and equipment.
- Realtime chat.
- Image sharing.
- Read receipts.
- Notification fanout.

## Phase 9: Reviews

- 5-star reviews.
- Written reviews.
- Owner replies.
- Review moderation.
- Aggregate rating updates.

## Phase 10: Admin Dashboard

- User management.
- Listing moderation.
- Booking oversight.
- Disputes, reports, claims, payouts, and analytics.
- Audit log explorer.
