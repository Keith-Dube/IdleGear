import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { PrismaService } from "@/prisma/prisma.service";

import type { AuthenticatedRequestUser } from "../auth/auth.types";
import type { SyncCurrentUserDto } from "./dto/sync-current-user.dto";
import type { BecomeOwnerDto } from "./dto/become-owner.dto";
import type { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class MeService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentUser(authenticatedUser: AuthenticatedRequestUser) {
    const user = await this.prisma.user.findUnique({
      where: { externalAuthId: authenticatedUser.clerkUserId },
      include: {
        profile: true,
        roleGrants: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User profile has not been synced yet.");
    }

    return this.serializeUser(user);
  }

  async syncCurrentUser(
    authenticatedUser: AuthenticatedRequestUser,
    input: SyncCurrentUserDto,
  ) {
    const existingByClerkId = await this.prisma.user.findUnique({
      where: { externalAuthId: authenticatedUser.clerkUserId },
      include: { profile: true, roleGrants: true },
    });

    if (existingByClerkId) {
      const user = await this.prisma.user.update({
        where: { id: existingByClerkId.id },
        data: {
          email: input.email,
          phone: input.phone,
          profile: {
            upsert: {
              create: {
                displayName: this.resolveDisplayName(input),
                avatarUrl: input.avatarUrl,
              },
              update: {
                displayName: this.resolveDisplayName(input),
                avatarUrl: input.avatarUrl,
              },
            },
          },
        },
        include: { profile: true, roleGrants: true },
      });

      return this.serializeUser(user);
    }

    const existingByEmail = await this.prisma.user.findUnique({
      where: { email: input.email },
      include: { profile: true, roleGrants: true },
    });

    if (existingByEmail?.externalAuthId) {
      throw new ConflictException("Email is already linked to another account.");
    }

    const user = await this.prisma.user.upsert({
      where: { email: input.email },
      create: {
        email: input.email,
        externalAuthId: authenticatedUser.clerkUserId,
        phone: input.phone,
        roleGrants: {
          create: {
            role: UserRole.RENTER,
          },
        },
        profile: {
          create: {
            displayName: this.resolveDisplayName(input),
            avatarUrl: input.avatarUrl,
          },
        },
      },
      update: {
        externalAuthId: authenticatedUser.clerkUserId,
        phone: input.phone,
        roleGrants: {
          upsert: {
            where: {
              userId_role: {
                userId: existingByEmail?.id ?? "",
                role: UserRole.RENTER,
              },
            },
            create: {
              role: UserRole.RENTER,
            },
            update: {},
          },
        },
        profile: {
          upsert: {
            create: {
              displayName: this.resolveDisplayName(input),
              avatarUrl: input.avatarUrl,
            },
            update: {
              displayName: this.resolveDisplayName(input),
              avatarUrl: input.avatarUrl,
            },
          },
        },
      },
      include: { profile: true, roleGrants: true },
    });

    return this.serializeUser(user);
  }

  async updateProfile(
    authenticatedUser: AuthenticatedRequestUser,
    input: UpdateProfileDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { externalAuthId: authenticatedUser.clerkUserId },
    });

    if (!user) {
      throw new NotFoundException("User profile has not been synced yet.");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        profile: {
          upsert: {
            create: {
              displayName: input.displayName ?? "GearShare member",
              bio: input.bio,
              avatarUrl: input.avatarUrl,
              city: input.city,
              region: input.region,
              country: input.country ?? "US",
            },
            update: input,
          },
        },
      },
      include: {
        profile: true,
        roleGrants: true,
      },
    });

    return this.serializeUser(updatedUser);
  }

  async becomeOwner(
    authenticatedUser: AuthenticatedRequestUser,
    input: BecomeOwnerDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { externalAuthId: authenticatedUser.clerkUserId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException("User profile has not been synced yet.");
    }

    await this.prisma.userRoleGrant.upsert({
      where: {
        userId_role: {
          userId: user.id,
          role: UserRole.OWNER,
        },
      },
      update: {},
      create: {
        userId: user.id,
        role: UserRole.OWNER,
      },
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        profile: {
          upsert: {
            create: {
              displayName: user.email.split("@")[0] ?? "GearShare owner",
              bio: input.ownerBio,
              ownerVerifiedAt: new Date(),
            },
            update: {
              bio: input.ownerBio ?? user.profile?.bio,
              ownerVerifiedAt: user.profile?.ownerVerifiedAt ?? new Date(),
            },
          },
        },
      },
      include: {
        profile: true,
        roleGrants: true,
      },
    });

    return this.serializeUser(updatedUser);
  }

  private resolveDisplayName(input: SyncCurrentUserDto) {
    return input.displayName?.trim() || input.email.split("@")[0] || "GearShare member";
  }

  private serializeUser<
    T extends {
      id: string;
      email: string;
      externalAuthId: string | null;
      status: string;
      profile: unknown;
      roleGrants: Array<{ role: UserRole }>;
      createdAt: Date;
      updatedAt: Date;
    },
  >(user: T) {
    return {
      id: user.id,
      email: user.email,
      externalAuthId: user.externalAuthId,
      status: user.status,
      profile: user.profile,
      roles: user.roleGrants.map((grant) => grant.role),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
