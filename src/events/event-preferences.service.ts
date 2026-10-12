import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { UpdateEventPreferencesDto } from "./dto/update-event-preferences.dto";

@Injectable()
export class EventPreferencesService {
  constructor(private prisma: PrismaService) {}

  private async verifyEventAccess(
    userId: string,
    eventId: string,
  ) {
    const member = await this.prisma.eventMember.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!member) {
      throw new ForbiddenException(
        "You do not have access to this event.",
      );
    }
  }

  async getPreferences(
    userId: string,
    eventId: string,
  ) {
    await this.verifyEventAccess(userId, eventId);

    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
      },
    });

    if (!event) {
      throw new NotFoundException("Event not found.");
    }

    return this.prisma.eventPreference.upsert({
      where: {
        eventId,
      },
      create: {
        eventId,
      },
      update: {},
    });
  }

  async updatePreferences(
    userId: string,
    eventId: string,
    dto: UpdateEventPreferencesDto,
  ) {
    await this.verifyEventAccess(userId, eventId);

    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        id: true,
      },
    });

    if (!event) {
      throw new NotFoundException("Event not found.");
    }

    const data: {
      timezone?: string;
      rsvpDeadline?: Date | null;
      allowPlusOne?: boolean;
      allowRsvpChanges?: boolean;
      showGuestContactInfo?: boolean;
      visibility?: "PRIVATE" | "PUBLIC";
    } = {};

    if (dto.timezone !== undefined) {
      data.timezone = dto.timezone;
    }

    if (dto.rsvpDeadline !== undefined) {
      data.rsvpDeadline =
        dto.rsvpDeadline === null
          ? null
          : new Date(dto.rsvpDeadline);
    }

    if (dto.allowPlusOne !== undefined) {
      data.allowPlusOne = dto.allowPlusOne;
    }

    if (dto.allowRsvpChanges !== undefined) {
      data.allowRsvpChanges = dto.allowRsvpChanges;
    }

    if (dto.showGuestContactInfo !== undefined) {
      data.showGuestContactInfo =
        dto.showGuestContactInfo;
    }

    if (dto.visibility !== undefined) {
      data.visibility = dto.visibility;
    }

    return this.prisma.eventPreference.upsert({
      where: {
        eventId,
      },
      create: {
        eventId,
        ...data,
      },
      update: data,
    });
  }
}