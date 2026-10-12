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
        const invitation = await this.findPublicInvitationRecord(token);
        if (!invitation) {
            throw new common_1.BadRequestException("Invitation not found or invalid.");
        }
        // Preserve the existing invitation-opened tracking.
        if (invitation.status === "SENT") {
            await this.prisma.invitation.update({
                where: { id: invitation.id },
                data: {
                    status: "OPENED",
                    openedAt: new Date(),
                },
            });
        }
        const refreshedInvitation = await this.findPublicInvitationRecord(token);
        if (!refreshedInvitation) {
            throw new common_1.BadRequestException("Invitation not found or invalid.");
        }
        return this.sanitizePublicInvitation(refreshedInvitation);
    }
    async findPublicInvitationRecord(token) {
        return this.prisma.invitation.findUnique({
            where: { token },
            include: {
                guest: true,
                event: {
                    include: {
                        scheduleItems: {
                            orderBy: { startTime: "asc" },
                        },
                        preferences: true,
                    },
                },
            },
        });
    }
    sanitizePublicInvitation(invitation) {
        const preferences = invitation.event.preferences ?? {
            timezone: "Africa/Lagos",
            rsvpDeadline: null,
            allowPlusOne: false,
            allowRsvpChanges: true,
            showGuestContactInfo: false,
            visibility: "PRIVATE",
        };
        const guest = preferences.showGuestContactInfo
            ? invitation.guest
            : {
                ...invitation.guest,
                email: null,
                phone: null,
            };
        return {
            ...invitation,
            guest,
            event: {
                ...invitation.event,
                preferences,
            },
        };
    }
    async submitPublicRsvp(token, status) {
        const invitation = await this.findPublicInvitationRecord(token);
        if (!invitation) {
            throw new common_1.BadRequestException("Invitation not found or invalid.");
        }
        const preferences = invitation.event.preferences ?? {
            timezone: "Africa/Lagos",
            rsvpDeadline: null,
            allowPlusOne: false,
            allowRsvpChanges: true,
            showGuestContactInfo: false,
            visibility: "PRIVATE",
        };
        // Reject submissions after the configured RSVP deadline.
        if (preferences.rsvpDeadline &&
            Date.now() > new Date(preferences.rsvpDeadline).getTime()) {
            throw new common_1.BadRequestException("The RSVP deadline has passed. Responses are now closed.");
        }
        const currentStatus = invitation.guest.status;
        // Allow an identical repeat request, but reject a change
        // after the guest has responded if changes are disabled.
        if (!preferences.allowRsvpChanges &&
            currentStatus !== "PENDING" &&
            currentStatus !== status) {
            throw new common_1.BadRequestException("RSVP changes are disabled for this event.");
        }
        // An identical repeat request needs no database update.
        if (currentStatus !== status) {
            await this.prisma.guest.update({
                where: { id: invitation.guestId },
                data: { status },
            });
        }
        const updatedInvitation = await this.findPublicInvitationRecord(token);
        if (!updatedInvitation) {
            throw new common_1.BadRequestException("Invitation not found or invalid.");
        }
        return {
            success: true,
            invitation: this.sanitizePublicInvitation(updatedInvitation),
        };
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map