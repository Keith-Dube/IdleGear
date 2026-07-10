# Infrastructure

The MVP is designed for simple managed infrastructure first:

- Vercel for the Next.js frontend.
- Railway or another container runtime for the NestJS backend.
- Managed PostgreSQL for primary data.
- Managed Redis for queues, cache, and websocket fanout.
- Cloudinary for image storage and CDN delivery.
- Stripe Connect for marketplace payments and owner payouts.
- Resend for transactional email.
- Firebase Cloud Messaging for push notifications.

Future infrastructure work can add Terraform or Pulumi once the production provider choices are finalized.
