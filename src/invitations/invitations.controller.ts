import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { UpdateInvitationDto } from "./dto/update-invitation.dto";
import { InvitationsService } from "./invitations.service";

@Controller("events/:eventId/invitations")
@UseGuards(JwtAuthGuard)
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Param("eventId") eventId: string,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.invitationsService.create(
      user.userId,
      eventId,
      dto,
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: { userId: string },
    @Param("eventId") eventId: string,
  ) {
    return this.invitationsService.findAll(
      user.userId,
      eventId,
    );
  }

  @Get(":invitationId")
  findOne(
    @CurrentUser() user: { userId: string },
    @Param("eventId") eventId: string,
    @Param("invitationId") invitationId: string,
  ) {
    return this.invitationsService.findOne(
      user.userId,
      eventId,
      invitationId,
    );
  }

  @Patch(":invitationId")
  update(
    @CurrentUser() user: { userId: string },
    @Param("eventId") eventId: string,
    @Param("invitationId") invitationId: string,
    @Body() dto: UpdateInvitationDto,
  ) {
    return this.invitationsService.update(
      user.userId,
      eventId,
      invitationId,
      dto,
    );
  }

  @Delete(":invitationId")
  remove(
    @CurrentUser() user: { userId: string },
    @Param("eventId") eventId: string,
    @Param("invitationId") invitationId: string,
  ) {
    return this.invitationsService.remove(
      user.userId,
      eventId,
      invitationId,
    );
  }
}