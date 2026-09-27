import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export enum RsvpStatus {
  PENDING = "PENDING",
  ATTENDING = "ATTENDING",
  MAYBE = "MAYBE",
  NOT_ATTENDING = "NOT_ATTENDING",
}

export class UpdateGuestDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(RsvpStatus)
  status?: RsvpStatus;

  @IsOptional()
  @IsBoolean()
  plusOne?: boolean;

  @IsOptional()
  @IsString()
  dietaryRequirements?: string;
}