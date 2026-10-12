import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export enum EventVisibility {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export class UpdateEventPreferencesDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  timezone?: string;

  @IsOptional()
  @IsDateString()
  rsvpDeadline?: string | null;

  @IsOptional()
  @IsBoolean()
  allowPlusOne?: boolean;

  @IsOptional()
  @IsBoolean()
  allowRsvpChanges?: boolean;

  @IsOptional()
  @IsBoolean()
  showGuestContactInfo?: boolean;

  @IsOptional()
  @IsEnum(EventVisibility)
  visibility?: EventVisibility;
}