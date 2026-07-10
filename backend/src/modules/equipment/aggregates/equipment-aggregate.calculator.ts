import {
  BookingStatus,
} from "@prisma/client";
import type { Prisma, PrismaClient } from "@prisma/client";

type AggregatePrisma = PrismaClient | Prisma.TransactionClient;

const aggregateBookingStatuses: BookingStatus[] = [
  BookingStatus.CONFIRMED,
  BookingStatus.IN_PROGRESS,
  BookingStatus.COMPLETED,
];

export type EquipmentAggregateSnapshot = {
  equipmentId: string;
  bookingCount: number;
  reviewCount: number;
  ratingAverage: number;
};

export async function recalculateEquipmentAggregates(
  prisma: AggregatePrisma,
  equipmentIds: string[],
): Promise<EquipmentAggregateSnapshot[]> {
  const uniqueEquipmentIds = [...new Set(equipmentIds)].filter(Boolean);

  if (uniqueEquipmentIds.length === 0) {
    return [];
  }

  const [bookingCounts, reviewSummaries] = await Promise.all([
    prisma.booking.groupBy({
      by: ["equipmentId"],
      where: {
        equipmentId: { in: uniqueEquipmentIds },
        status: { in: aggregateBookingStatuses },
      },
      _count: { _all: true },
    }),
    prisma.review.groupBy({
      by: ["equipmentId"],
      where: {
        equipmentId: { in: uniqueEquipmentIds },
        hiddenAt: null,
      },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  const bookingCountByEquipmentId = new Map(
    bookingCounts.map((count) => [count.equipmentId, count._count._all]),
  );
  const reviewSummaryByEquipmentId = new Map(
    reviewSummaries.map((summary) => [summary.equipmentId, summary]),
  );

  const snapshots = uniqueEquipmentIds.map((equipmentId) => {
    const reviewSummary = reviewSummaryByEquipmentId.get(equipmentId);
    const ratingAverage = reviewSummary?._avg.rating
      ? Math.round(reviewSummary._avg.rating * 100) / 100
      : 0;

    return {
      equipmentId,
      bookingCount: bookingCountByEquipmentId.get(equipmentId) ?? 0,
      reviewCount: reviewSummary?._count._all ?? 0,
      ratingAverage,
    };
  });

  await Promise.all(
    snapshots.map((snapshot) =>
      prisma.equipment.update({
        where: { id: snapshot.equipmentId },
        data: {
          bookingCount: snapshot.bookingCount,
          reviewCount: snapshot.reviewCount,
          ratingAverage: snapshot.ratingAverage,
        },
      }),
    ),
  );

  return snapshots;
}
