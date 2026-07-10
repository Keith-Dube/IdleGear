import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "@/modules/auth/current-user.decorator";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";

import type { AuthenticatedRequestUser } from "../auth/auth.types";
import { SyncCurrentUserDto } from "./dto/sync-current-user.dto";
import { BecomeOwnerDto } from "./dto/become-owner.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { MeService } from "./me.service";

@ApiTags("me")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("me")
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  @ApiOkResponse({ description: "Current synced GearShare user." })
  getCurrentUser(@CurrentUser() user: AuthenticatedRequestUser) {
    return this.meService.getCurrentUser(user);
  }

  @Post("sync")
  @ApiOkResponse({ description: "Creates or updates the current user." })
  syncCurrentUser(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Body() input: SyncCurrentUserDto,
  ) {
    return this.meService.syncCurrentUser(user, input);
  }

  @Patch("profile")
  @ApiOkResponse({ description: "Updates the current user's profile." })
  updateProfile(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Body() input: UpdateProfileDto,
  ) {
    return this.meService.updateProfile(user, input);
  }

  @Get("roles")
  @ApiOkResponse({ description: "Current user's role grants." })
  getRoles(@CurrentUser() user: AuthenticatedRequestUser) {
    return { roles: user.roles };
  }

  @Post("owner")
  @ApiOkResponse({ description: "Grants owner access to the current user." })
  becomeOwner(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Body() input: BecomeOwnerDto,
  ) {
    return this.meService.becomeOwner(user, input);
  }
}
