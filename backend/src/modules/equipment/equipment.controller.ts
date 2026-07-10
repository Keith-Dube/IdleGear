import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "@/modules/auth/current-user.decorator";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import { Roles } from "@/modules/auth/roles.decorator";
import { RolesGuard } from "@/modules/auth/roles.guard";

import type { AuthenticatedRequestUser } from "../auth/auth.types";
import { CreateEquipmentDto } from "./dto/owner/create-equipment.dto";
import { ReplaceEquipmentAvailabilityDto } from "./dto/owner/replace-equipment-availability.dto";
import { ReplaceEquipmentImagesDto } from "./dto/owner/replace-equipment-images.dto";
import { UpdateEquipmentDto } from "./dto/owner/update-equipment.dto";
import { SearchEquipmentDto } from "./dto/search-equipment.dto";
import { EquipmentService } from "./equipment.service";

@ApiTags("equipment")
@Controller("equipment")
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @ApiOkResponse({ description: "Paginated equipment search results." })
  search(@Query() query: SearchEquipmentDto) {
    return this.equipmentService.search(query);
  }

  @Get("categories")
  @ApiOkResponse({ description: "Equipment categories." })
  categories() {
    return this.equipmentService.categories();
  }

  @Get(":id")
  @ApiOkResponse({ description: "Published equipment listing detail." })
  detail(@Param("id") id: string) {
    return this.equipmentService.detail(id);
  }
}

@ApiTags("owner equipment")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
@Controller("owner/equipment")
export class OwnerEquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @ApiOkResponse({ description: "Owner equipment listings." })
  ownerListings(@CurrentUser() user: AuthenticatedRequestUser) {
    return this.equipmentService.ownerListings(user);
  }

  @Post()
  @ApiOkResponse({ description: "Created owner equipment listing." })
  createOwnerListing(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Body() input: CreateEquipmentDto,
  ) {
    return this.equipmentService.createOwnerListing(user, input);
  }

  @Get(":id")
  @ApiOkResponse({ description: "Owner equipment listing detail." })
  ownerListing(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param("id") id: string,
  ) {
    return this.equipmentService.ownerListing(user, id);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Updated owner equipment listing." })
  updateOwnerListing(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param("id") id: string,
    @Body() input: UpdateEquipmentDto,
  ) {
    return this.equipmentService.updateOwnerListing(user, id, input);
  }

  @Delete(":id")
  @ApiOkResponse({ description: "Soft-deleted owner equipment listing." })
  deleteOwnerListing(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param("id") id: string,
  ) {
    return this.equipmentService.deleteOwnerListing(user, id);
  }

  @Put(":id/images")
  @ApiOkResponse({ description: "Replaced owner equipment images." })
  replaceImages(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param("id") id: string,
    @Body() input: ReplaceEquipmentImagesDto,
  ) {
    return this.equipmentService.replaceOwnerImages(user, id, input);
  }

  @Put(":id/availability")
  @ApiOkResponse({ description: "Upserted owner equipment availability." })
  replaceAvailability(
    @CurrentUser() user: AuthenticatedRequestUser,
    @Param("id") id: string,
    @Body() input: ReplaceEquipmentAvailabilityDto,
  ) {
    return this.equipmentService.replaceOwnerAvailability(user, id, input);
  }

  @Post(":id/publish")
  @ApiOkResponse({ description: "Published owner equipment listing." })
  publish(@CurrentUser() user: AuthenticatedRequestUser, @Param("id") id: string) {
    return this.equipmentService.publishOwnerListing(user, id);
  }

  @Post(":id/unpublish")
  @ApiOkResponse({ description: "Unpublished owner equipment listing." })
  unpublish(@CurrentUser() user: AuthenticatedRequestUser, @Param("id") id: string) {
    return this.equipmentService.unpublishOwnerListing(user, id);
  }
}
