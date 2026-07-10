import { Injectable } from "@nestjs/common";
import type { Equipment, Prisma } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import {
  EquipmentSort,
  SearchEquipmentDto,
} from "../dto/search-equipment.dto";
import type { CreateEquipmentDto } from "../dto/owner/create-equipment.dto";
import type { EquipmentAvailabilityDto } from "../dto/owner/equipment-availability.dto";
import type { EquipmentImageDto } from "../dto/owner/equipment-image.dto";
import type { UpdateEquipmentDto } from "../dto/owner/update-equipment.dto";

@Injectable()
export class EquipmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async searchPublished(query: SearchEquipmentDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const where = this.buildPublishedWhere(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.equipment.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
          owner: {
            select: {
              id: true,
              profile: {
                select: {
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: this.resolveSort(query.sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.equipment.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  findCategories() {
    return this.prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  findPublishedById(id: string) {
    return this.prisma.equipment.findFirst({
      where: {
        id,
        deletedAt: null,
        isPublished: true,
      },
      include: this.detailInclude(),
    });
  }

  findOwnerListings(ownerId: string) {
    return this.prisma.equipment.findMany({
      where: {
        ownerId,
        deletedAt: null,
      },
      include: this.detailInclude(),
      orderBy: [{ updatedAt: "desc" }],
    });
  }

  findOwnerListing(ownerId: string, equipmentId: string) {
    return this.prisma.equipment.findFirst({
      where: {
        id: equipmentId,
        ownerId,
        deletedAt: null,
      },
      include: this.detailInclude(),
    });
  }

  async createOwnerListing(ownerId: string, input: CreateEquipmentDto) {
    const category = await this.prisma.category.findUnique({
      where: { slug: input.categorySlug },
      select: { id: true },
    });

    if (!category) {
      return undefined;
    }

    return this.prisma.$transaction(async (transaction) => {
      const equipment = await transaction.equipment.create({
        data: {
          ownerId,
          categoryId: category.id,
          slug: await this.createUniqueSlug(transaction, ownerId, input.title),
          title: input.title,
          description: input.description,
          condition: input.condition,
          pricePerHourCents: input.pricePerHourCents,
          pricePerDayCents: input.pricePerDayCents,
          depositAmountCents: input.depositAmountCents,
          currency: input.currency,
          minimumRentalHours: input.minimumRentalHours,
          maximumRentalDays: input.maximumRentalDays,
          deliveryAvailable: input.deliveryAvailable,
          deliveryFeeCents: input.deliveryFeeCents,
          locationName: input.locationName,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2,
          city: input.city,
          region: input.region,
          country: input.country,
          postalCode: input.postalCode,
          latitude: input.latitude,
          longitude: input.longitude,
          specifications: input.specifications as Prisma.InputJsonValue,
          isPublished: false,
        },
      });

      await this.replaceImages(transaction, equipment.id, input.images ?? []);
      await this.upsertAvailability(
        transaction,
        equipment.id,
        input.availability ?? [],
      );

      return transaction.equipment.findUnique({
        where: { id: equipment.id },
        include: this.detailInclude(),
      });
    });
  }

  async updateOwnerListing(
    ownerId: string,
    equipmentId: string,
    input: UpdateEquipmentDto,
  ) {
    const existing = await this.findOwnedEquipmentForWrite(ownerId, equipmentId);

    if (!existing) {
      return undefined;
    }

    const category = input.categorySlug
      ? await this.prisma.category.findUnique({
          where: { slug: input.categorySlug },
          select: { id: true },
        })
      : undefined;

    if (input.categorySlug && !category) {
      return undefined;
    }

    return this.prisma.$transaction(async (transaction) => {
      await transaction.equipment.update({
        where: { id: equipmentId },
        data: {
          ...this.mapWritableFields(input),
          ...(category ? { categoryId: category.id } : {}),
          ...(input.title && input.title !== existing.title
            ? {
                slug: await this.createUniqueSlug(
                  transaction,
                  ownerId,
                  input.title,
                  equipmentId,
                ),
              }
            : {}),
        },
      });

      if (input.images) {
        await this.replaceImages(transaction, equipmentId, input.images);
      }

      if (input.availability) {
        await this.upsertAvailability(transaction, equipmentId, input.availability);
      }

      return transaction.equipment.findUnique({
        where: { id: equipmentId },
        include: this.detailInclude(),
      });
    });
  }

  async softDeleteOwnerListing(ownerId: string, equipmentId: string) {
    const existing = await this.findOwnedEquipmentForWrite(ownerId, equipmentId);

    if (!existing) {
      return undefined;
    }

    return this.prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        deletedAt: new Date(),
        isPublished: false,
      },
      include: this.detailInclude(),
    });
  }

  async replaceOwnerImages(
    ownerId: string,
    equipmentId: string,
    images: EquipmentImageDto[],
  ) {
    const existing = await this.findOwnedEquipmentForWrite(ownerId, equipmentId);

    if (!existing) {
      return undefined;
    }

    return this.prisma.$transaction(async (transaction) => {
      await this.replaceImages(transaction, equipmentId, images);

      return transaction.equipment.findUnique({
        where: { id: equipmentId },
        include: this.detailInclude(),
      });
    });
  }

  async upsertOwnerAvailability(
    ownerId: string,
    equipmentId: string,
    availability: EquipmentAvailabilityDto[],
  ) {
    const existing = await this.findOwnedEquipmentForWrite(ownerId, equipmentId);

    if (!existing) {
      return undefined;
    }

    return this.prisma.$transaction(async (transaction) => {
      await this.upsertAvailability(transaction, equipmentId, availability);

      return transaction.equipment.findUnique({
        where: { id: equipmentId },
        include: this.detailInclude(),
      });
    });
  }

  async setPublishState(
    ownerId: string,
    equipmentId: string,
    isPublished: boolean,
  ) {
    const existing = await this.findOwnedEquipmentForWrite(ownerId, equipmentId);

    if (!existing) {
      return undefined;
    }

    return this.prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        isPublished,
        publishedAt: isPublished ? (existing.publishedAt ?? new Date()) : null,
      },
      include: this.detailInclude(),
    });
  }

  private buildPublishedWhere(
    query: SearchEquipmentDto,
  ): Prisma.EquipmentWhereInput {
    return {
      deletedAt: null,
      isPublished: true,
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: "insensitive" } },
              { description: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(query.category
        ? {
            category: {
              slug: query.category,
            },
          }
        : {}),
      ...(query.minPrice || query.maxPrice
        ? {
            pricePerDayCents: {
              ...(query.minPrice ? { gte: Math.round(query.minPrice * 100) } : {}),
              ...(query.maxPrice ? { lte: Math.round(query.maxPrice * 100) } : {}),
            },
          }
        : {}),
      ...(query.minRating
        ? {
            ratingAverage: {
              gte: query.minRating,
            },
          }
        : {}),
    };
  }

  private resolveSort(
    sort: SearchEquipmentDto["sort"],
  ): Prisma.EquipmentOrderByWithRelationInput[] {
    switch (sort) {
      case EquipmentSort.Popular:
        return [{ bookingCount: "desc" }, { createdAt: "desc" }];
      case EquipmentSort.PriceAsc:
        return [{ pricePerDayCents: "asc" }];
      case EquipmentSort.PriceDesc:
        return [{ pricePerDayCents: "desc" }];
      case EquipmentSort.Rating:
        return [{ ratingAverage: "desc" }, { reviewCount: "desc" }];
      case EquipmentSort.Newest:
      default:
        return [{ createdAt: "desc" }];
    }
  }

  private findOwnedEquipmentForWrite(
    ownerId: string,
    equipmentId: string,
  ): Promise<Equipment | null> {
    return this.prisma.equipment.findFirst({
      where: {
        id: equipmentId,
        ownerId,
        deletedAt: null,
      },
    });
  }

  private mapWritableFields(input: CreateEquipmentDto | UpdateEquipmentDto) {
    return {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.condition !== undefined ? { condition: input.condition } : {}),
      ...(input.pricePerHourCents !== undefined
        ? { pricePerHourCents: input.pricePerHourCents }
        : {}),
      ...(input.pricePerDayCents !== undefined
        ? { pricePerDayCents: input.pricePerDayCents }
        : {}),
      ...(input.depositAmountCents !== undefined
        ? { depositAmountCents: input.depositAmountCents }
        : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.minimumRentalHours !== undefined
        ? { minimumRentalHours: input.minimumRentalHours }
        : {}),
      ...(input.maximumRentalDays !== undefined
        ? { maximumRentalDays: input.maximumRentalDays }
        : {}),
      ...(input.deliveryAvailable !== undefined
        ? { deliveryAvailable: input.deliveryAvailable }
        : {}),
      ...(input.deliveryFeeCents !== undefined
        ? { deliveryFeeCents: input.deliveryFeeCents }
        : {}),
      ...(input.locationName !== undefined ? { locationName: input.locationName } : {}),
      ...(input.addressLine1 !== undefined ? { addressLine1: input.addressLine1 } : {}),
      ...(input.addressLine2 !== undefined ? { addressLine2: input.addressLine2 } : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.region !== undefined ? { region: input.region } : {}),
      ...(input.country !== undefined ? { country: input.country } : {}),
      ...(input.postalCode !== undefined ? { postalCode: input.postalCode } : {}),
      ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
      ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
      ...(input.specifications !== undefined
        ? { specifications: input.specifications as Prisma.InputJsonValue }
        : {}),
    };
  }

  private async createUniqueSlug(
    prisma: Prisma.TransactionClient,
    ownerId: string,
    title: string,
    excludeEquipmentId?: string,
  ) {
    const baseSlug = this.slugify(title);

    for (let index = 0; index < 25; index += 1) {
      const slug = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
      const existing = await prisma.equipment.findFirst({
        where: {
          ownerId,
          slug,
          ...(excludeEquipmentId ? { id: { not: excludeEquipmentId } } : {}),
        },
        select: { id: true },
      });

      if (!existing) {
        return slug;
      }
    }

    return `${baseSlug}-${Date.now()}`;
  }

  private slugify(value: string) {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80) || "equipment"
    );
  }

  private async replaceImages(
    prisma: Prisma.TransactionClient,
    equipmentId: string,
    images: EquipmentImageDto[],
  ) {
    await prisma.equipmentImage.deleteMany({
      where: { equipmentId },
    });

    if (images.length === 0) {
      return;
    }

    await prisma.equipmentImage.createMany({
      data: images.map((image, index) => ({
        equipmentId,
        url: image.url,
        cloudinaryPublicId: image.cloudinaryPublicId,
        altText: image.altText,
        width: image.width,
        height: image.height,
        sortOrder: image.sortOrder ?? index,
      })),
    });
  }

  private async upsertAvailability(
    prisma: Prisma.TransactionClient,
    equipmentId: string,
    availability: EquipmentAvailabilityDto[],
  ) {
    for (const availabilityItem of availability) {
      await prisma.equipmentAvailability.upsert({
        where: {
          equipmentId_date: {
            equipmentId,
            date: availabilityItem.date,
          },
        },
        update: {
          isAvailable: availabilityItem.isAvailable,
          startTime: availabilityItem.startTime,
          endTime: availabilityItem.endTime,
          note: availabilityItem.note,
        },
        create: {
          equipmentId,
          date: availabilityItem.date,
          isAvailable: availabilityItem.isAvailable,
          startTime: availabilityItem.startTime,
          endTime: availabilityItem.endTime,
          note: availabilityItem.note,
        },
      });
    }
  }

  private detailInclude() {
    return {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" as const },
      },
      availability: {
        orderBy: { date: "asc" as const },
        take: 60,
      },
      owner: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              avatarUrl: true,
              city: true,
              region: true,
            },
          },
        },
      },
    };
  }
}
