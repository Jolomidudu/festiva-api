import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateGuestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  plusOne?: boolean;

  @IsOptional()
  @IsString()
  dietaryRequirements?: string;
}