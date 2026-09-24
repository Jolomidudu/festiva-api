import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";

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
        members: { create: { userId, role: "OWNER" } }
      }
    });
  }

  findMine(userId: string) {
    return this.prisma.event.findMany({
      where: { members: { some: { userId } } },
      include: { _count: { select: { guests: true } } },
      orderBy: { date: "asc" }
    });
  }

  async findOne(userId: string, id: string) {
    const event = await this.prisma.event.findFirst({
      where: { id, members: { some: { userId } } },
      include: { _count: { select: { guests: true } } }
    });

    if (!event) throw new NotFoundException("Event not found.");
    return event;
  }

  async remove(userId: string, id: string) {
    const member = await this.prisma.eventMember.findUnique({
      where: { userId_eventId: { userId, eventId: id } }
    });

    if (!member || member.role !== "OWNER") {
      throw new ForbiddenException("Only the owner can delete this event.");
    }

    await this.prisma.event.delete({ where: { id } });
    return { success: true };
  }
}