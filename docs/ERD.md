# ER Diagram

```mermaid
erDiagram
  User ||--o| Profile : has
  User ||--o{ UserRoleGrant : receives
  User ||--o{ Equipment : owns
  User ||--o{ Booking : rents
  User ||--o{ Booking : fulfills
  User ||--o{ Favorite : saves
  User ||--o{ Message : sends
  User ||--o{ Notification : receives
  User ||--o{ Payout : earns
  Category ||--o{ Equipment : groups
  Equipment ||--o{ EquipmentImage : has
  Equipment ||--o{ EquipmentAvailability : exposes
  Equipment ||--o{ Booking : booked_for
  Equipment ||--o{ Review : reviewed
  Equipment ||--o{ FeaturedListing : promoted_as
  Equipment ||--o{ InsuranceClaim : claimed_against
  Equipment ||--o{ Report : reported
  Booking ||--o| Payment : paid_by
  Booking ||--o| Conversation : references
  Booking ||--o{ Review : produces
  Booking ||--o| InsuranceClaim : may_have
  Booking ||--o{ Dispute : may_have
  Payment ||--o| Payout : funds
  Conversation ||--o{ ConversationParticipant : includes
  Conversation ||--o{ Message : contains
```

## Core Tables

- `User`: platform account linked to external auth.
- `Profile`: public identity, verification, and payout metadata.
- `UserRoleGrant`: flexible role assignment for renters, owners, and admins.
- `Category`: hierarchical equipment taxonomy.
- `Equipment`: rentable listing with pricing, deposit, condition, location, and search fields.
- `EquipmentImage`: Cloudinary-backed listing media.
- `EquipmentAvailability`: date-level availability controls.
- `Booking`: rental lifecycle and price breakdown.
- `Payment`: Stripe payment intent and platform fee accounting.
- `Payout`: owner payout tracking.
- `Conversation`, `ConversationParticipant`, `Message`: booking-aware realtime messaging.
- `Review`: ratings, written reviews, owner replies, and moderation state.
- `Favorite`: saved listings.
- `Notification`: email, push, and in-app notification records.
- `InsuranceClaim`: damage protection workflow.
- `FeaturedListing`: paid listing promotion windows.
- `Report`, `Dispute`, `AuditLog`: moderation, dispute resolution, and security traceability.
