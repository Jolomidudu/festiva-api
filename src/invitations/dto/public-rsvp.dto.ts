import { IsEnum } from "class-validator";
import { RsvpStatus } from "@prisma/client";

export class PublicRsvpDto {
  @IsEnum(RsvpStatus)
  status!: RsvpStatus;
}