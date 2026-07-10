import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { SearchEquipmentDto } from "./dto/search-equipment.dto";
import type { CreateEquipmentDto } from "./dto/owner/create-equipment.dto";
import type { ReplaceEquipmentAvailabilityDto } from "./dto/owner/replace-equipment-availability.dto";
import type { ReplaceEquipmentImagesDto } from "./dto/owner/replace-equipment-images.dto";
import type { UpdateEquipmentDto } from "./dto/owner/update-equipment.dto";
import { EquipmentRepository } from "./repositories/equipment.repository";
import type { AuthenticatedRequestUser } from "../auth/auth.types";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class EquipmentService {
  constructor(
    private readonly equipmentRepository: EquipmentRepository,
    private readonly prisma: PrismaService,
  ) {}

  async search(query: SearchEquipmentDto) {
    return this.equipmentRepository.searchPublished(query);
  }

  categories() {
    return this.equipmentRepository.findCategories();
  }

  async detail(id: string) {
    const listing = await this.equipmentRepository.findPublishedById(id);

    if (!listing) {
      throw new NotFoundException("Equipment listing was not found.");
    }

    return listing;
  }

  async ownerListings(authenticatedUser: AuthenticatedRequestUser) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);

    return this.equipmentRepository.findOwnerListings(ownerId);
  }

  async ownerListing(authenticatedUser: AuthenticatedRequestUser, equipmentId: string) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);
    const listing = await this.equipmentRepository.findOwnerListing(
      ownerId,
      equipmentId,
    );

    if (!listing) {
      throw new NotFoundException("Owner equipment listing was not found.");
    }

    return listing;
  }

  async createOwnerListing(
    authenticatedUser: AuthenticatedRequestUser,
    input: CreateEquipmentDto,
  ) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);
    const listing = await this.equipmentRepository.createOwnerListing(ownerId, input);

    if (!listing) {
      throw new NotFoundException("Equipment category was not found.");
    }

    return listing;
  }

  async updateOwnerListing(
    authenticatedUser: AuthenticatedRequestUser,
    equipmentId: string,
    input: UpdateEquipmentDto,
  ) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);
    const listing = await this.equipmentRepository.updateOwnerListing(
      ownerId,
      equipmentId,
      input,
    );

    if (!listing) {
      throw new NotFoundException("Owner equipment listing or category was not found.");
    }

    return listing;
  }

  async deleteOwnerListing(
    authenticatedUser: AuthenticatedRequestUser,
    equipmentId: string,
  ) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);
    const listing = await this.equipmentRepository.softDeleteOwnerListing(
      ownerId,
      equipmentId,
    );

    if (!listing) {
      throw new NotFoundException("Owner equipment listing was not found.");
    }

    return listing;
  }

  async replaceOwnerImages(
    authenticatedUser: AuthenticatedRequestUser,
    equipmentId: string,
    input: ReplaceEquipmentImagesDto,
  ) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);
    const listing = await this.equipmentRepository.replaceOwnerImages(
      ownerId,
      equipmentId,
      input.images,
    );

    if (!listing) {
      throw new NotFoundException("Owner equipment listing was not found.");
    }

    return listing;
  }

  async replaceOwnerAvailability(
    authenticatedUser: AuthenticatedRequestUser,
    equipmentId: string,
    input: ReplaceEquipmentAvailabilityDto,
  ) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);
    const listing = await this.equipmentRepository.upsertOwnerAvailability(
      ownerId,
      equipmentId,
      input.availability,
    );

    if (!listing) {
      throw new NotFoundException("Owner equipment listing was not found.");
    }

    return listing;
  }

  async publishOwnerListing(
    authenticatedUser: AuthenticatedRequestUser,
    equipmentId: string,
  ) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);
    const listing = await this.equipmentRepository.setPublishState(
      ownerId,
      equipmentId,
      true,
    );

    if (!listing) {
      throw new NotFoundException("Owner equipment listing was not found.");
    }

    return listing;
  }

  async unpublishOwnerListing(
    authenticatedUser: AuthenticatedRequestUser,
    equipmentId: string,
  ) {
    const ownerId = await this.resolveOwnerId(authenticatedUser);
    const listing = await this.equipmentRepository.setPublishState(
      ownerId,
      equipmentId,
      false,
    );

    if (!listing) {
      throw new NotFoundException("Owner equipment listing was not found.");
    }

    return listing;
  }

  private async resolveOwnerId(authenticatedUser: AuthenticatedRequestUser) {
    const user = await this.prisma.user.findUnique({
      where: { externalAuthId: authenticatedUser.clerkUserId },
      include: { roleGrants: true },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException("Synced GearShare user was not found.");
    }

    if (!user.roleGrants.some((grant) => grant.role === UserRole.OWNER)) {
      throw new NotFoundException("Owner role grant was not found.");
    }

    return user.id;
  }
}
