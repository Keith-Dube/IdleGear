# Environment Variables

Copy `.env.example` to `.env` at the repository root for local development. Backend and frontend workspace scripts both load this root file.

## Shared

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | yes | `development`, `test`, or `production` |
| `APP_URL` | yes | Frontend origin for CORS and links |
| `API_URL` | yes | Public backend URL |

## Data

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string. Local Docker uses host port `5434`. |
| `REDIS_URL` | no | Redis cache, rate limit store, queues |

## Auth

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | phase 2 | Clerk frontend key |
| `CLERK_SECRET_KEY` | phase 2 | Clerk server key |
| `CLERK_JWT_KEY` | optional | Clerk JWT public key PEM for networkless token verification. Leave blank or placeholder when using `CLERK_SECRET_KEY` verification. |
| `CLERK_AUTHORIZED_PARTIES` | phase 2 | Comma-separated allowed frontend origins for Clerk token verification |
| `JWT_ISSUER` | phase 2 | Expected JWT issuer |
| `JWT_AUDIENCE` | phase 2 | Expected JWT audience |

## Media

| Variable | Required | Purpose |
| --- | --- | --- |
| `CLOUDINARY_CLOUD_NAME` | phase 4 | Image storage cloud |
| `CLOUDINARY_API_KEY` | phase 4 | Image upload API key |
| `CLOUDINARY_API_SECRET` | phase 4 | Signed upload secret |

## Marketplace Integrations

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | phase 5 | Maps and places search |
| `STRIPE_SECRET_KEY` | phase 7 | Payment intents and Connect |
| `STRIPE_WEBHOOK_SECRET` | phase 7 | Stripe webhook verification |
| `STRIPE_CONNECT_CLIENT_ID` | phase 7 | Owner onboarding |
| `RESEND_API_KEY` | phase 6 | Transactional email |
| `EMAIL_FROM` | phase 6 | Sender identity |
| `FIREBASE_PROJECT_ID` | phase 8 | Push notifications |
| `FIREBASE_CLIENT_EMAIL` | phase 8 | Firebase service account |
| `FIREBASE_PRIVATE_KEY` | phase 8 | Firebase service account |
