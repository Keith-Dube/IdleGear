-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('RENTER', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EquipmentCondition" AS ENUM ('NEW', 'EXCELLENT', 'GOOD', 'FAIR');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_OWNER_APPROVAL', 'APPROVED', 'REJECTED', 'PAYMENT_PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('REQUIRES_PAYMENT_METHOD', 'REQUIRES_CONFIRMATION', 'PROCESSING', 'SUCCEEDED', 'CANCELLED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'IN_TRANSIT', 'PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InsuranceClaimStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID', 'CLOSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BOOKING', 'PAYMENT', 'MESSAGE', 'REVIEW', 'PAYOUT', 'SECURITY', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'ACTIONED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'MEDIATION', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "externalAuthId" TEXT,
    "phone" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleGrant" (
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedById" TEXT,

    CONSTRAINT "UserRoleGrant_pkey" PRIMARY KEY ("userId","role")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "identityVerifiedAt" TIMESTAMP(3),
    "ownerVerifiedAt" TIMESTAMP(3),
    "stripeAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "condition" "EquipmentCondition" NOT NULL,
    "pricePerHourCents" INTEGER,
    "pricePerDayCents" INTEGER NOT NULL,
    "depositAmountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "minimumRentalHours" INTEGER NOT NULL DEFAULT 4,
    "maximumRentalDays" INTEGER NOT NULL DEFAULT 30,
    "deliveryAvailable" BOOLEAN NOT NULL DEFAULT false,
    "deliveryFeeCents" INTEGER,
    "locationName" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "postalCode" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "specifications" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "ratingAverage" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "bookingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentImage" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EquipmentImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentAvailability" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING_OWNER_APPROVAL',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "rentalSubtotalCents" INTEGER NOT NULL,
    "deliveryFeeCents" INTEGER NOT NULL DEFAULT 0,
    "serviceFeeCents" INTEGER NOT NULL,
    "depositAmountCents" INTEGER NOT NULL,
    "totalAmountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "deliveryRequested" BOOLEAN NOT NULL DEFAULT false,
    "deliveryAddress" JSONB,
    "ownerNote" TEXT,
    "renterNote" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "stripeChargeId" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "platformFeeCents" INTEGER NOT NULL,
    "ownerPayoutCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "ownerReply" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "hiddenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT,
    "equipmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadMessageId" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("conversationId","userId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "bookingId" TEXT,
    "body" TEXT,
    "imageUrl" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "userId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId","equipmentId")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "paymentId" TEXT,
    "stripePayoutId" TEXT,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "expectedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceClaim" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "claimantId" TEXT NOT NULL,
    "status" "InsuranceClaimStatus" NOT NULL DEFAULT 'OPEN',
    "description" TEXT NOT NULL,
    "evidence" JSONB,
    "estimatedDamageCents" INTEGER,
    "approvedAmountCents" INTEGER,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedListing" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "placement" TEXT NOT NULL DEFAULT 'homepage',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeaturedListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "equipmentId" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "reason" TEXT NOT NULL,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalAuthId_key" ON "User"("externalAuthId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "UserRoleGrant_role_idx" ON "UserRoleGrant"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "Category_sortOrder_idx" ON "Category"("sortOrder");

-- CreateIndex
CREATE INDEX "Equipment_categoryId_isPublished_idx" ON "Equipment"("categoryId", "isPublished");

-- CreateIndex
CREATE INDEX "Equipment_city_region_idx" ON "Equipment"("city", "region");

-- CreateIndex
CREATE INDEX "Equipment_pricePerDayCents_idx" ON "Equipment"("pricePerDayCents");

-- CreateIndex
CREATE INDEX "Equipment_ratingAverage_idx" ON "Equipment"("ratingAverage");

-- CreateIndex
CREATE INDEX "Equipment_createdAt_idx" ON "Equipment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_ownerId_slug_key" ON "Equipment"("ownerId", "slug");

-- CreateIndex
CREATE INDEX "EquipmentImage_equipmentId_sortOrder_idx" ON "EquipmentImage"("equipmentId", "sortOrder");

-- CreateIndex
CREATE INDEX "EquipmentAvailability_date_isAvailable_idx" ON "EquipmentAvailability"("date", "isAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentAvailability_equipmentId_date_key" ON "EquipmentAvailability"("equipmentId", "date");

-- CreateIndex
CREATE INDEX "Booking_renterId_status_idx" ON "Booking"("renterId", "status");

-- CreateIndex
CREATE INDEX "Booking_ownerId_status_idx" ON "Booking"("ownerId", "status");

-- CreateIndex
CREATE INDEX "Booking_equipmentId_startsAt_endsAt_idx" ON "Booking"("equipmentId", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "Review_equipmentId_hiddenAt_idx" ON "Review"("equipmentId", "hiddenAt");

-- CreateIndex
CREATE INDEX "Review_revieweeId_idx" ON "Review"("revieweeId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_bookingId_reviewerId_key" ON "Review"("bookingId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_bookingId_key" ON "Conversation"("bookingId");

-- CreateIndex
CREATE INDEX "Conversation_equipmentId_idx" ON "Conversation"("equipmentId");

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_archivedAt_idx" ON "ConversationParticipant"("userId", "archivedAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_sentAt_idx" ON "Message"("conversationId", "sentAt");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Favorite_equipmentId_idx" ON "Favorite"("equipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_paymentId_key" ON "Payout"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_stripePayoutId_key" ON "Payout"("stripePayoutId");

-- CreateIndex
CREATE INDEX "Payout_ownerId_status_idx" ON "Payout"("ownerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceClaim_bookingId_key" ON "InsuranceClaim"("bookingId");

-- CreateIndex
CREATE INDEX "InsuranceClaim_status_idx" ON "InsuranceClaim"("status");

-- CreateIndex
CREATE INDEX "InsuranceClaim_equipmentId_idx" ON "InsuranceClaim"("equipmentId");

-- CreateIndex
CREATE INDEX "FeaturedListing_placement_startsAt_endsAt_idx" ON "FeaturedListing"("placement", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "FeaturedListing_equipmentId_idx" ON "FeaturedListing"("equipmentId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_equipmentId_idx" ON "Report"("equipmentId");

-- CreateIndex
CREATE INDEX "Dispute_bookingId_status_idx" ON "Dispute"("bookingId", "status");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "UserRoleGrant" ADD CONSTRAINT "UserRoleGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleGrant" ADD CONSTRAINT "UserRoleGrant_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentImage" ADD CONSTRAINT "EquipmentImage_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentAvailability" ADD CONSTRAINT "EquipmentAvailability_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceClaim" ADD CONSTRAINT "InsuranceClaim_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceClaim" ADD CONSTRAINT "InsuranceClaim_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceClaim" ADD CONSTRAINT "InsuranceClaim_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedListing" ADD CONSTRAINT "FeaturedListing_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

