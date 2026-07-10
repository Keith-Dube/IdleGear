import { IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(800)
  bio?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  country?: string;
}
