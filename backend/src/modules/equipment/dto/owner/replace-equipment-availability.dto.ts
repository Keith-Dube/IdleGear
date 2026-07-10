import { Type } from "class-transformer";
import { ArrayMaxSize, ValidateNested } from "class-validator";

import { EquipmentAvailabilityDto } from "./equipment-availability.dto";

export class ReplaceEquipmentAvailabilityDto {
  @ArrayMaxSize(366)
  @ValidateNested({ each: true })
  @Type(() => EquipmentAvailabilityDto)
  availability!: EquipmentAvailabilityDto[];
}
