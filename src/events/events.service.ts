import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { CreateScheduleItemDto } from "./dto/create-schedule-item.dto";
import { UpdateScheduleItemDto } from "./dto/update-schedule-item.dto";

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        name: dto.name,
        date: new Date(dto.date),
        location: dto.location,
        description: dto.description,
        coverImage: dto.coverImage,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
    });
  }

  async findSchedule(userId: string, eventId: string) {
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

  return this.prisma.eventScheduleItem.findMany({
    where: {
      eventId,
    },
    orderBy: {
      startTime: "asc",
    },
  });
}

async createScheduleItem(
  userId: string,
  eventId: string,
  dto: CreateScheduleItemDto,
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

  return this.prisma.eventScheduleItem.create({
    data: {
      title: dto.title,
      description: dto.description,
      startTime: new Date(dto.startTime),
      endTime: dto.endTime
        ? new Date(dto.endTime)
        : undefined,
      location: dto.location,
      eventId,
    },
  });
}

async updateScheduleItem(
  userId: string,
  eventId: string,
  scheduleItemId: string,
  dto: UpdateScheduleItemDto,
) {
  const item = await this.prisma.eventScheduleItem.findFirst({
    where: {
      id: scheduleItemId,
      eventId,
      event: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });

  if (!item) {
    throw new NotFoundException(
      "Schedule item not found.",
    );
  }

  return this.prisma.eventScheduleItem.update({
    where: {
      id: scheduleItemId,
    },
    data: {
      ...(dto.title !== undefined && {
        title: dto.title,
      }),
      ...(dto.description !== undefined && {
        description: dto.description,
      }),
      ...(dto.startTime !== undefined && {
        startTime: new Date(dto.startTime),
      }),
      ...(dto.endTime !== undefined && {
        endTime: new Date(dto.endTime),
      }),
      ...(dto.location !== undefined && {
        location: dto.location,
      }),
    },
  });
}

async removeScheduleItem(
  userId: string,
  eventId: string,
  scheduleItemId: string,
) {
  const item = await this.prisma.eventScheduleItem.findFirst({
    where: {
      id: scheduleItemId,
      eventId,
      event: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
  });

  if (!item) {
    throw new NotFoundException(
      "Schedule item not found.",
    );
  }

  await this.prisma.eventScheduleItem.delete({
    where: {
      id: scheduleItemId,
    },
  });

  return {
    success: true,
  };
}

  findMine(userId: string) {
    return this.prisma.event.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            guests: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async findOne(userId: string, id: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            guests: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException("Event not found.");
    }

    return event;
  }

  async update(
    userId: string,
    eventId: string,
    dto: UpdateEventDto,
  ) {
    const member = await this.prisma.eventMember.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException("Event not found.");
    }

    if (member.role !== "OWNER") {
      throw new ForbiddenException(
        "Only the owner can update this event.",
      );
    }

    return this.prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),

        ...(dto.date !== undefined && {
          date: new Date(dto.date),
        }),

        ...(dto.location !== undefined && {
          location: dto.location,
        }),

        ...(dto.description !== undefined && {
          description: dto.description,
        }),

        ...(dto.coverImage !== undefined && {
          coverImage: dto.coverImage,
        }),
      },
      include: {
        _count: {
          select: {
            guests: true,
          },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const member = await this.prisma.eventMember.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: id,
        },
      },
    });

    if (!member || member.role !== "OWNER") {
      throw new ForbiddenException(
        "Only the owner can delete this event.",
      );
    }

    await this.prisma.event.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  }
}