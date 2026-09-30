import { Controller, Get, Param } from "@nestjs/common";
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
}