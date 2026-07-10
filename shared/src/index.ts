import { z } from "zod";

export const userRoleSchema = z.enum(["RENTER", "OWNER", "ADMIN"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const equipmentConditionSchema = z.enum([
  "NEW",
  "EXCELLENT",
  "GOOD",
  "FAIR",
]);
export type EquipmentCondition = z.infer<typeof equipmentConditionSchema>;

export const bookingStatusSchema = z.enum([
  "PENDING_OWNER_APPROVAL",
  "APPROVED",
  "REJECTED",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
]);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const equipmentSortSchema = z.enum([
  "newest",
  "popular",
  "price_asc",
  "price_desc",
  "rating",
]);
export type EquipmentSort = z.infer<typeof equipmentSortSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});
export type Pagination = z.infer<typeof paginationSchema>;

export const equipmentSearchSchema = paginationSchema.extend({
  q: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  distanceKm: z.coerce.number().min(1).max(500).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  sort: equipmentSortSchema.default("newest"),
});
export type EquipmentSearch = z.infer<typeof equipmentSearchSchema>;

export const moneySchema = z.object({
  amountCents: z.number().int().min(0),
  currency: z.string().length(3).default("USD"),
});
export type Money = z.infer<typeof moneySchema>;

const rentalWindowFields = {
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
};

const validRentalWindow = (value: { startsAt: Date; endsAt: Date }) =>
  value.endsAt > value.startsAt;

export const rentalWindowSchema = z
  .object(rentalWindowFields)
  .refine((value) => value.endsAt > value.startsAt, {
    message: "Rental end must be after rental start.",
    path: ["endsAt"],
  });
export type RentalWindow = z.infer<typeof rentalWindowSchema>;

export const createBookingSchema = z
  .object({
    ...rentalWindowFields,
    equipmentId: z.string().min(1),
    deliveryRequested: z.boolean().default(false),
    renterNote: z.string().trim().max(1000).optional(),
  })
  .refine(validRentalWindow, {
    message: "Rental end must be after rental start.",
    path: ["endsAt"],
  });
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(10).max(2000),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const platformFees = {
  bookingCommissionRate: 0.15,
} as const;
