import { IsString, MinLength } from "class-validator";

export class CreateInvitationDto {
  @IsString()
  @MinLength(1)
  guestId!: string;
}