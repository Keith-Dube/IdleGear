import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { EquipmentCondition } from "@prisma/client";

import { EquipmentAvailabilityDto } from "./equipment-availability.dto";
import { EquipmentImageDto } from "./equipment-image.dto";

export class CreateEquipmentDto {
  @IsString()
  @MaxLength(140)
  title!: string;

  @IsString()
  @MaxLength(3000)
  description!: string;

  @IsString()
  @MaxLength(80)
  categorySlug!: string;

  @IsEnum(EquipmentCondition)
  condition!: EquipmentCondition;

  @IsOptional()
  @IsInt()
  @Min(0)
  pricePerHourCents?: number;

  @IsInt()
  @Min(0)
  pricePerDayCents!: number;

  @IsInt()
  @Min(0)
  depositAmountCents!: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  minimumRentalHours?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maximumRentalDays?: number;

  @IsBoolean()
  deliveryAvailable!: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  deliveryFeeCents?: number;

  @IsString()
  @MaxLength(160)
  locationName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  addressLine1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  addressLine2?: string;

  @IsString()
  @MaxLength(120)
  city!: string;

  @IsString()
  @MaxLength(120)
  region!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsObject()
  specifications?: Record<string, unknown>;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EquipmentImageDto)
  images?: EquipmentImageDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EquipmentAvailabilityDto)
  availability?: EquipmentAvailabilityDto[];
}
