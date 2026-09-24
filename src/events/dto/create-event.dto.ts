import { IsDateString, IsOptional, IsString, MinLength } from "class-validator";

export class CreateEventDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @MinLength(2)
  location!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;
}