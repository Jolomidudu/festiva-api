import { IsDateString, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

   @IsOptional()
  @IsString()
  coverImage?: string;
}