import { IsEnum, IsOptional } from "class-validator";
import { InvitationStatus } from "@prisma/client";

export class UpdateInvitationDto {
  @IsOptional()
  @IsEnum(InvitationStatus)
  status?: InvitationStatus;
}