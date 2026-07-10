# API Documentation

The NestJS backend exposes versioned REST endpoints under `/api/v1`.

Swagger is available locally at `/api/docs` when the backend is running.

## Implemented Public Endpoints

### Health

```http
GET /api/v1/health
```

Checks that the service is running and that PostgreSQL is reachable.

Response:

```json
{
  "status": "ok",
  "service": "gearshare-api",
  "timestamp": "2026-07-08T00:00:00.000Z",
  "database": "reachable"
}
```

### Equipment Search

```http
GET /api/v1/equipment
```

Supported query parameters:

| Name | Type | Notes |
| --- | --- | --- |
| `q` | string | Keyword search across title and description |
| `category` | string | Category slug |
| `location` | string | Reserved for the maps/search phase |
| `distanceKm` | number | 1 to 500 |
| `minPrice` | number | Daily minimum price in major currency units |
| `maxPrice` | number | Daily maximum price in major currency units |
| `minRating` | number | 1 to 5 |
| `sort` | enum | `newest`, `popular`, `price_asc`, `price_desc`, `rating` |
| `page` | integer | Default `1` |
| `limit` | integer | Default `24`, max `100` |

The endpoint queries Prisma and returns paginated published equipment results. Later phases will add geospatial distance filtering, availability filtering, authenticated favorites, booking references, and owner visibility rules.

### Equipment Categories

```http
GET /api/v1/equipment/categories
```

Returns active equipment categories for listing forms and marketplace filters.

### Equipment Detail

```http
GET /api/v1/equipment/:id
```

Returns a published listing with owner profile, category, images, availability, and aggregate counters.

## Implemented Authenticated User Endpoints

All `/me` endpoints require a Clerk session token in the `Authorization` header:

```http
Authorization: Bearer <clerk-session-token>
```

### Current User

```http
GET /api/v1/me
```

Returns the synced GearShare user, profile, and database role grants.

### Sync Current User

```http
POST /api/v1/me/sync
```

Creates or updates the local GearShare user for the verified Clerk `sub` claim.

Body:

```json
{
  "email": "renter@example.com",
  "displayName": "Renter Name",
  "avatarUrl": "https://example.com/avatar.png"
}
```

New users receive a default `RENTER` role grant.

### Update Current Profile

```http
PATCH /api/v1/me/profile
```

Updates editable profile fields such as display name, bio, avatar, and location.

### Current Roles

```http
GET /api/v1/me/roles
```

Returns the role grants attached to the authenticated request.

### Become Owner

```http
POST /api/v1/me/owner
```

Grants the current synced user an `OWNER` role and updates owner profile fields.

Body:

```json
{
  "ownerBio": "Compact construction gear in Denver."
}
```

## Implemented Owner Equipment Endpoints

All `/owner/equipment` endpoints require a Clerk session token for a user with the `OWNER` role.

### Owner Listings

```http
GET /api/v1/owner/equipment
```

Returns the current owner's active listings, including images, availability, category, and aggregate counters.

### Create Listing

```http
POST /api/v1/owner/equipment
```

Creates a draft owner listing.

Required body fields include `title`, `description`, `categorySlug`, `condition`, `pricePerDayCents`, `depositAmountCents`, `deliveryAvailable`, `locationName`, `city`, and `region`.

Optional body fields include hourly price, currency, rental duration limits, delivery fee, address fields, country, postal code, latitude, longitude, specifications, images, and availability.

### Owner Listing Detail

```http
GET /api/v1/owner/equipment/:id
```

Returns an owner-owned listing whether it is published or still in draft.

### Update Listing

```http
PATCH /api/v1/owner/equipment/:id
```

Updates editable listing details and optionally replaces images or availability when those arrays are provided.

### Delete Listing

```http
DELETE /api/v1/owner/equipment/:id
```

Soft-deletes an owner-owned listing.

### Replace Images

```http
PUT /api/v1/owner/equipment/:id/images
```

Replaces the listing image set with up to 12 Cloudinary-backed image records.

Body:

```json
{
  "images": [
    {
      "cloudinaryPublicId": "gearshare/equipment/example",
      "url": "https://res.cloudinary.com/demo/image/upload/example.jpg",
      "altText": "Pressure washer on driveway",
      "sortOrder": 0
    }
  ]
}
```

### Replace Availability

```http
PUT /api/v1/owner/equipment/:id/availability
```

Replaces or inserts listing availability windows.

Body:

```json
{
  "availability": [
    {
      "date": "2026-08-01",
      "isAvailable": true,
      "startTime": "2026-08-01T08:00:00.000Z",
      "endTime": "2026-08-01T18:00:00.000Z",
      "note": "Pickup after 8 AM"
    }
  ]
}
```

### Publish Controls

```http
POST /api/v1/owner/equipment/:id/publish
POST /api/v1/owner/equipment/:id/unpublish
```

Toggles marketplace visibility for owner-owned listings.

## Implemented Upload Endpoints

### Equipment Image Signature

```http
POST /api/v1/uploads/cloudinary/equipment-image-signature
```

Requires an authenticated owner. Returns signed Cloudinary upload parameters for direct browser uploads.

Body:

```json
{
  "equipmentId": "equipment_id",
  "publicId": "gearshare/equipment/example"
}
```

## Future Endpoint Groups

- Auth and profiles: `/me`, `/profiles`
- Bookings: `/bookings`
- Payments and webhooks: `/payments`, `/webhooks/stripe`
- Conversations and messages: `/conversations`, `/messages`
- Reviews: `/reviews`
- Favorites: `/favorites`
- Owner dashboard: `/owner/*`
- Admin: `/admin/*`
- Notifications: `/notifications`
- Payouts and claims: `/payouts`, `/insurance-claims`

## API Standards

- JWT bearer authentication for protected routes.
- Role-based authorization for renter, owner, and admin actions.
- Class-validator DTO validation with `whitelist` and `forbidNonWhitelisted`.
- URI versioning.
- Rate limiting through a Nest middleware, with Redis-backed rate limiting planned for scale-out.
- Pagination for collection endpoints.
- Repository-backed read paths for search-oriented aggregates.
- Idempotency keys for booking, payment, and payout operations.
- Audit logging for privileged actions and sensitive state transitions.
