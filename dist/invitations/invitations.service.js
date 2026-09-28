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
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let InvitationsService = class InvitationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, eventId, dto) {
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
            throw new common_1.NotFoundException("Event not found.");
        }
        const guest = await this.prisma.guest.findFirst({
            where: {
                id: dto.guestId,
                eventId,
            },
        });
        if (!guest) {
            throw new common_1.NotFoundException("Guest not found.");
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
        const token = (0, crypto_1.randomBytes)(24).toString("hex");
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
    async findAll(userId, eventId) {
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
            throw new common_1.NotFoundException("Event not found.");
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
    async findOne(userId, eventId, invitationId) {
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
            throw new common_1.NotFoundException("Invitation not found.");
        }
        return invitation;
    }
    async update(userId, eventId, invitationId, dto) {
        const invitation = await this.findOne(userId, eventId, invitationId);
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
    async remove(userId, eventId, invitationId) {
        const invitation = await this.findOne(userId, eventId, invitationId);
        await this.prisma.invitation.delete({
            where: {
                id: invitation.id,
            },
        });
        return {
            success: true,
        };
    }
    async getPublicInvitation(token) {
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
            throw new common_1.NotFoundException("Invitation not found.");
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
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map