# Deployment Guide

## Target Platform

- Frontend: Vercel.
- Backend: Railway or a container host.
- Database: Managed PostgreSQL.
- Cache and queues: Managed Redis.
- Images: Cloudinary.
- Payments: Stripe Connect.

## Frontend

1. Create a Vercel project from the repository.
2. Set root directory to `frontend`.
3. Set build command to `npm run build --workspace frontend`.
4. Set output framework to Next.js.
5. Add `NEXT_PUBLIC_*` environment variables.
6. Add Clerk sign-in/sign-up redirect URLs for the production domain.

## Backend

1. Deploy `docker/backend.Dockerfile` to Railway or another container runtime.
2. Set `DATABASE_URL`, `APP_URL`, `API_URL`, auth, Stripe, Cloudinary, Resend, and Firebase secrets.
3. Run Prisma migrations before serving production traffic.
4. Expose port `4000`.
5. Configure health checks against `/api/v1/health`.

## Database

```bash
npm run prisma:migrate:dev --workspace backend
```

For production, use a deploy-time migration command:

```bash
npm exec --workspace backend prisma migrate deploy
```

## Release Checklist

- Run typecheck, lint, and build.
- Confirm all required production environment variables are present.
- Run Prisma migrations.
- Verify `/api/v1/health`.
- Verify CORS only allows the production frontend origin.
- Verify `CLERK_AUTHORIZED_PARTIES` includes the production frontend origin.
- Configure Stripe webhook endpoint and signing secret.
- Configure Cloudinary upload presets and folder restrictions.
- Configure domain, TLS, and monitoring.
