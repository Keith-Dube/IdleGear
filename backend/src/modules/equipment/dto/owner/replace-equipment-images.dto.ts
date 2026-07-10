import { Type } from "class-transformer";
import { ArrayMaxSize, ValidateNested } from "class-validator";

import { EquipmentImageDto } from "./equipment-image.dto";

export class ReplaceEquipmentImagesDto {
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => EquipmentImageDto)
  images!: EquipmentImageDto[];
}
