import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("events")
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private events: EventsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateEventDto) {
    return this.events.create(user.sub, dto);
  }

  @Get()
  findMine(@CurrentUser() user: any) {
    return this.events.findMine(user.sub);
  }

  @Get(":id")
  findOne(@CurrentUser() user: any, @Param("id") id: string) {
    return this.events.findOne(user.sub, id);
  }

  @Delete(":id")
  remove(@CurrentUser() user: any, @Param("id") id: string) {
    return this.events.remove(user.sub, id);
  }
}