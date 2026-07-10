import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from "class-validator";

export class EquipmentImageDto {
  @IsUrl({ require_tld: false })
  url!: string;

  @IsString()
  @MaxLength(255)
  cloudinaryPublicId!: string;

  @IsString()
  @MaxLength(180)
  altText!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
