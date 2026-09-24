import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { GuestsController } from "./guests.controller";
import { GuestsService } from "./guests.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET ?? "change-me" })
  ],
  controllers: [GuestsController],
  providers: [GuestsService, JwtAuthGuard]
})
export class GuestsModule {}