import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { GuestsService } from "./guests.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { CreateGuestDto } from "./dto/create-guest.dto";

@Controller("events/:eventId/guests")
@UseGuards(JwtAuthGuard)
export class GuestsController {
  constructor(private guests: GuestsService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Param("eventId") eventId: string,
    @Body() dto: CreateGuestDto
  ) {
    return this.guests.create(user.sub, eventId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Param("eventId") eventId: string) {
    return this.guests.findAll(user.sub, eventId);
  }

  @Delete(":guestId")
  remove(
    @CurrentUser() user: any,
    @Param("eventId") eventId: string,
    @Param("guestId") guestId: string
  ) {
    return this.guests.remove(user.sub, eventId, guestId);
  }
}