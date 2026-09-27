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
exports.GuestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GuestsService = class GuestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertMember(userId, eventId) {
        const member = await this.prisma.eventMember.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException("You do not have access to this event.");
        }
    }
    async create(userId, eventId, dto) {
        await this.assertMember(userId, eventId);
        return this.prisma.guest.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                status: dto.status ?? "PENDING",
                plusOne: dto.plusOne ?? false,
                dietaryRequirements: dto.dietaryRequirements,
                eventId,
                createdById: userId,
            },
        });
    }
    async findAll(userId, eventId) {
        await this.assertMember(userId, eventId);
        return this.prisma.guest.findMany({
            where: {
                eventId,
            },
            orderBy: {
                name: "asc",
            },
        });
    }
    async update(userId, eventId, guestId, dto) {
        await this.assertMember(userId, eventId);
        const guest = await this.prisma.guest.findFirst({
            where: {
                id: guestId,
                eventId,
            },
        });
        if (!guest) {
            throw new common_1.NotFoundException("Guest not found.");
        }
        return this.prisma.guest.update({
            where: {
                id: guestId,
            },
            data: {
                ...(dto.name !== undefined && {
                    name: dto.name,
                }),
                ...(dto.email !== undefined && {
                    email: dto.email,
                }),
                ...(dto.phone !== undefined && {
                    phone: dto.phone,
                }),
                ...(dto.status !== undefined && {
                    status: dto.status,
                }),
                ...(dto.plusOne !== undefined && {
                    plusOne: dto.plusOne,
                }),
                ...(dto.dietaryRequirements !== undefined && {
                    dietaryRequirements: dto.dietaryRequirements,
                }),
            },
        });
    }
    async remove(userId, eventId, guestId) {
        await this.assertMember(userId, eventId);
        const guest = await this.prisma.guest.findFirst({
            where: {
                id: guestId,
                eventId,
            },
        });
        if (!guest) {
            throw new common_1.NotFoundException("Guest not found.");
        }
        await this.prisma.guest.delete({
            where: {
                id: guestId,
            },
        });
        return {
            success: true,
        };
    }
};
exports.GuestsService = GuestsService;
exports.GuestsService = GuestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GuestsService);
//# sourceMappingURL=guests.service.js.map