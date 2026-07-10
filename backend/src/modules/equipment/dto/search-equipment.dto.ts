import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export enum EquipmentSort {
  Newest = "newest",
  Popular = "popular",
  PriceAsc = "price_asc",
  PriceDesc = "price_desc",
  Rating = "rating",
}

export class SearchEquipmentDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  distanceKm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @IsEnum(EquipmentSort)
  sort?: EquipmentSort = EquipmentSort.Newest;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 24;
}
