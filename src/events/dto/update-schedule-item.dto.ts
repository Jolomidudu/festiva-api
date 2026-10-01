import {
  IsDateString,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class UpdateScheduleItemDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  location?: string;
}