import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { UpdateInvitationDto } from "./dto/update-invitation.dto";

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    eventId: string,
    dto: CreateInvitationDto,
  ) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        members: {
          some: {
            userId,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException("Event not found.");
    }

    const guest = await this.prisma.guest.findFirst({
      where: {
        id: dto.guestId,
        eventId,
      },
    });

    if (!guest) {
      throw new NotFoundException("Guest not found.");
    }

    const existing = await this.prisma.invitation.findUnique({
      where: {
        eventId_guestId: {
          eventId,
          guestId: dto.guestId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    const token = randomBytes(24).toString("hex");

    return this.prisma.invitation.create({
      data: {
        token,
        eventId,
        guestId: dto.guestId,
      },
      include: {
        guest: true,
        event: true,
      },
    });
  }

  async findAll(userId: string, eventId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        members: {
          some: {
            userId,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException("Event not found.");
    }

    return this.prisma.invitation.findMany({
      where: {
        eventId,
      },
      include: {
        guest: true,
        event: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(userId: string, eventId: string, invitationId: string) {
    const invitation = await this.prisma.invitation.findFirst({
      where: {
        id: invitationId,
        eventId,
        event: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        guest: true,
        event: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found.");
    }

    return invitation;
  }

  async update(
    userId: string,
    eventId: string,
    invitationId: string,
    dto: UpdateInvitationDto,
  ) {
    const invitation = await this.findOne(
      userId,
      eventId,
      invitationId,
    );

    return this.prisma.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        ...(dto.status !== undefined && {
          status: dto.status,
          ...(dto.status === "SENT" && {
            sentAt: new Date(),
          }),
        }),
      },
      include: {
        guest: true,
        event: true,
      },
    });
  }

  async remove(
    userId: string,
    eventId: string,
    invitationId: string,
  ) {
    const invitation = await this.findOne(
      userId,
      eventId,
      invitationId,
    );

    await this.prisma.invitation.delete({
      where: {
        id: invitation.id,
      },
    });

    return {
      success: true,
    };
  }

  async getPublicInvitation(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: {
        token,
      },
      include: {
        guest: true,
        event: true,
      },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found.");
    }

    if (invitation.status === "SENT") {
      await this.prisma.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: "OPENED",
          openedAt: new Date(),
        },
      });
    }

    return this.prisma.invitation.findUnique({
      where: {
        id: invitation.id,
      },
      include: {
        guest: true,
        event: true,
      },
    });
  }
}