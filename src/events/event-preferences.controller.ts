import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { EventPreferencesService } from "./event-preferences.service";
import { UpdateEventPreferencesDto } from "./dto/update-event-preferences.dto";

@Controller("events/:eventId/preferences")
@UseGuards(JwtAuthGuard)
export class EventPreferencesController {
  constructor(
    private readonly preferencesService: EventPreferencesService,
  ) {}

  @Get()
  getPreferences(
    @Req() req: any,
    @Param("eventId") eventId: string,
  ) {
    return this.preferencesService.getPreferences(
      req.user.sub,
      eventId,
    );
  }

  @Patch()
  updatePreferences(
    @Req() req: any,
    @Param("eventId") eventId: string,
    @Body() dto: UpdateEventPreferencesDto,
  ) {
    return this.preferencesService.updatePreferences(
      req.user.sub,
      eventId,
      dto,
    );
  }
}