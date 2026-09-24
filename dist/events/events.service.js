"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(userId, dto) {
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
    findMine(userId) {
        return this.prisma.event.findMany({
            where: { members: { some: { userId } } },
            include: { _count: { select: { guests: true } } },
            orderBy: { date: "asc" }
        });
    }
    async findOne(userId, id) {
        const event = await this.prisma.event.findFirst({
            where: { id, members: { some: { userId } } },
            include: { _count: { select: { guests: true } } }
        });
        if (!event)
            throw new common_1.NotFoundException("Event not found.");
        return event;
    }
    async remove(userId, id) {
        const member = await this.prisma.eventMember.findUnique({
            where: { userId_eventId: { userId, eventId: id } }
        });
        if (!member || member.role !== "OWNER") {
            throw new common_1.ForbiddenException("Only the owner can delete this event.");
        }
        await this.prisma.event.delete({ where: { id } });
        return { success: true };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map