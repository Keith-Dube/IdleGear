import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class EquipmentAvailabilityDto {
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsBoolean()
  isAvailable!: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  note?: string;
}
