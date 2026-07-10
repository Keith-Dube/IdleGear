# Database

GearShare uses PostgreSQL with Prisma.

## Migrations

The initial schema lives in:

```txt
backend/prisma/migrations/20260710090000_initial_schema/migration.sql
```

For a fresh local database:

```bash
docker compose up -d postgres redis
npm run prisma:generate
npm run prisma:migrate:dev -- --name initial_schema
```

For production:

```bash
npm exec --workspace backend prisma migrate deploy
```

## Seed Data

Run:

```bash
npm run prisma:seed
```

The seed is idempotent. It creates:

- Marketplace categories.
- Owner, renter, and admin users.
- Profiles and role grants.
- Published equipment listings.
- Listing images and availability.
- Completed bookings.
- Reviews.

After seeding, it recalculates listing aggregates so search sorting has realistic values.

## Aggregate Counters

`Equipment` stores denormalized counters used by search and discovery:

- `bookingCount`
- `reviewCount`
- `ratingAverage`

The recalculation logic is in:

```txt
backend/src/modules/equipment/aggregates/equipment-aggregate.calculator.ts
```

Future booking and review write flows should call `EquipmentAggregateService` after state changes that affect popularity or ratings.

## Repository Boundary

Equipment search now goes through:

```txt
backend/src/modules/equipment/repositories/equipment.repository.ts
```

This keeps controller-facing services focused on application behavior while Prisma query construction stays in the repository layer.
