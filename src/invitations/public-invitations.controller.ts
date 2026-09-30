import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from "@nestjs/common";
import { PublicRsvpDto } from "./dto/public-rsvp.dto";
import { InvitationsService } from "./invitations.service";

@Controller("public/invitations")
export class PublicInvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @Get(":token")
  getInvitation(@Param("token") token: string) {
    return this.invitationsService.getPublicInvitation(token);
  }

  @Patch(":token/rsvp")
  submitRsvp(
    @Param("token") token: string,
    @Body() dto: PublicRsvpDto,
  ) {
    return this.invitationsService.submitPublicRsvp(
      token,
      dto.status,
    );
  }
}