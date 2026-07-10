import { IsEmail, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class SyncCurrentUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;
}
