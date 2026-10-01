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

import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { CreateScheduleItemDto } from "./dto/create-schedule-item.dto";
import { UpdateScheduleItemDto } from "./dto/update-schedule-item.dto";

@Controller("events")
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private events: EventsService) {}

  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateEventDto,
  ) {
    return this.events.create(user.sub, dto);
  }
  

  @Get()
  findMine(@CurrentUser() user: any) {
    return this.events.findMine(user.sub);
  }

  @Get(":id")
  findOne(
    @CurrentUser() user: any,
    @Param("id") id: string,
  ) {
    return this.events.findOne(user.sub, id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() dto: Parameters<EventsService["update"]>[2],
  ) {
    return this.events.update(user.sub, id, dto);
  }

  @Delete(":id")
  remove(
    @CurrentUser() user: any,
    @Param("id") id: string,
  ) {
    return this.events.remove(user.sub, id);
  }

  @Get(":eventId/schedule")
  findSchedule(
    @CurrentUser() user: any,
    @Param("eventId") eventId: string,
  ) {
    return this.events.findSchedule(
      user.sub,
      eventId,
    );
  }

  @Post(":eventId/schedule")
  createScheduleItem(
    @CurrentUser() user: any,
    @Param("eventId") eventId: string,
    @Body() dto: CreateScheduleItemDto,
  ) {
    return this.events.createScheduleItem(
      user.sub,
      eventId,
      dto,
    );
  }

  @Patch(":eventId/schedule/:scheduleItemId")
  updateScheduleItem(
    @CurrentUser() user: any,
    @Param("eventId") eventId: string,
    @Param("scheduleItemId") scheduleItemId: string,
    @Body() dto: UpdateScheduleItemDto,
  ) {
    return this.events.updateScheduleItem(
      user.sub,
      eventId,
      scheduleItemId,
      dto,
    );
  }

  @Delete(":eventId/schedule/:scheduleItemId")
  removeScheduleItem(
    @CurrentUser() user: any,
    @Param("eventId") eventId: string,
    @Param("scheduleItemId") scheduleItemId: string,
  ) {
    return this.events.removeScheduleItem(
      user.sub,
      eventId,
      scheduleItemId,
    );
  }

  

  
}