import {
  IsDateString,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateScheduleItemDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startTime!: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString()
  location?: string;
}