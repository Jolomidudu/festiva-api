import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGuestDto } from "./dto/create-guest.dto";

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  private async assertMember(userId: string, eventId: string) {
    const member = await this.prisma.eventMember.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });

    if (!member) {
      throw new ForbiddenException("You do not have access to this event.");
    }
  }

  async create(userId: string, eventId: string, dto: CreateGuestDto) {
    await this.assertMember(userId, eventId);

    return this.prisma.guest.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        plusOne: dto.plusOne ?? false,
        dietaryRequirements: dto.dietaryRequirements,
        eventId,
        createdById: userId
      }
    });
  }

  async findAll(userId: string, eventId: string) {
    await this.assertMember(userId, eventId);
    return this.prisma.guest.findMany({
      where: { eventId },
      orderBy: { name: "asc" }
    });
  }

  async remove(userId: string, eventId: string, guestId: string) {
    await this.assertMember(userId, eventId);

    const guest = await this.prisma.guest.findFirst({
      where: { id: guestId, eventId }
    });

    if (!guest) throw new NotFoundException("Guest not found.");

    await this.prisma.guest.delete({ where: { id: guestId } });
    return { success: true };
  }
}