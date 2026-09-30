import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { InvitationsController } from "./invitations.controller";
import { PublicInvitationsController } from "./public-invitations.controller";
import { InvitationsService } from "./invitations.service";

@Module({
  imports: [AuthModule],
  controllers: [
    InvitationsController,
    PublicInvitationsController,
  ],
  providers: [InvitationsService],
})
export class InvitationsModule {}