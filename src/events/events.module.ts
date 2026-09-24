import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET ?? "change-me" })
  ],
  controllers: [EventsController],
  providers: [EventsService, JwtAuthGuard]
})
export class EventsModule {}