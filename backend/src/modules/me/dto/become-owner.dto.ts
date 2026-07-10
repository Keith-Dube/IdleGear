import { IsOptional, IsString, MaxLength } from "class-validator";

export class BecomeOwnerDto {
  @IsOptional()
  @IsString()
  @MaxLength(800)
  ownerBio?: string;
}
