import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  EventPreferencesController,
} from "./event-preferences.controller";
import {
  EventPreferencesService,
} from "./event-preferences.service";

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET ?? "change-me" })
  ],
  controllers: [
    EventsController,
    EventPreferencesController,
  ],
  providers: [
    EventsService,
    EventPreferencesService,
  ],
})
export class EventsModule {}